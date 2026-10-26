import fs from 'fs';

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function norm360(d) {
  let r = d % 360;
  return r < 0 ? r + 360 : r;
}

function signedDiff(val, ref) {
  let diff = (val - ref) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

function getEarth(T) {
  let L0 = norm360(280.46646 + T * (36000.76983 + T * 0.0003032));
  let M = norm360(357.52911 + T * (35999.05029 - T * 0.0001537));
  let Mrad = M * DEG;
  let C = (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(Mrad)
    + (0.019993 - T * 0.000101) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);
  let sunTrueLong = L0 + C;
  let e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  let v = Mrad + C * DEG;
  let R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(v));
  let lEarth = norm360(sunTrueLong + 180) * DEG;
  return { x: R * Math.cos(lEarth), y: R * Math.sin(lEarth), R };
}

// Meeus Table 31.A Equinox of date
function calcSaturnMeeus(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const earth = getEarth(T);

  // Mean anomalies for perturbations
  // From Meeus / Schlyter
  const Mj = norm360(19.8950 + 3034.6906 * T);
  const Ms = norm360(316.9670 + 1221.5354 * T);

  const deltaL = 0.812 * Math.sin((2*Mj - 5*Ms - 67.6) * DEG)
    - 0.229 * Math.cos((2*Mj - 4*Ms - 2) * DEG)
    + 0.119 * Math.sin((Mj - 2*Ms - 3) * DEG)
    + 0.046 * Math.sin((2*Mj - 6*Ms - 69) * DEG) // corrected -69
    + 0.014 * Math.sin((Mj - 3*Ms + 32) * DEG);

  // Table 31.A: Saturn equinox of date
  const L = norm360(50.077444 + 1223.5110686 * T + 0.00051908 * T * T + deltaL);
  const a = 9.554909;
  const e = 0.05554814 - 0.000346641 * T;
  const I = (2.488879 - 0.0037362 * T) * DEG;
  const Omega = norm360(113.665503 + 0.877088 * T) * DEG;
  const peri = norm360(93.057237 + 1.9637613 * T);

  const M = norm360(L - peri) * DEG;
  const C = (2 * e - (e ** 3) / 4) * Math.sin(M)
    + (5/4 * e ** 2) * Math.sin(2 * M);
  const l = norm360(L + C * RAD);
  const v = M + C;
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
  const u = norm360(l - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));

  // Light time iteration
  const d0 = Math.sqrt((x - earth.x)**2 + (y - earth.y)**2);
  const tau = 0.0057755183 * d0; // days
  
  // Re-evaluate at t - tau
  const Ttau = (jd - tau - 2451545.0) / 36525.0;
  const MjTau = norm360(19.8950 + 3034.6906 * Ttau);
  const MsTau = norm360(316.9670 + 1221.5354 * Ttau);
  const deltaLTau = 0.812 * Math.sin((2*MjTau - 5*MsTau - 67.6) * DEG)
    - 0.229 * Math.cos((2*MjTau - 4*MsTau - 2) * DEG)
    + 0.119 * Math.sin((MjTau - 2*MsTau - 3) * DEG)
    + 0.046 * Math.sin((2*MjTau - 6*MsTau - 69) * DEG)
    + 0.014 * Math.sin((MjTau - 3*MsTau + 32) * DEG);
  const LTau = norm360(50.077444 + 1223.5110686 * Ttau + 0.00051908 * Ttau * Ttau + deltaLTau);
  const eTau = 0.05554814 - 0.000346641 * Ttau;
  const ITau = (2.488879 - 0.0037362 * Ttau) * DEG;
  const OmegaTau = norm360(113.665503 + 0.877088 * Ttau) * DEG;
  const periTau = norm360(93.057237 + 1.9637613 * Ttau);
  const MTau = norm360(LTau - periTau) * DEG;
  const CTau = (2 * eTau - (eTau ** 3) / 4) * Math.sin(MTau)
    + (5/4 * eTau ** 2) * Math.sin(2 * MTau);
  const lTau = norm360(LTau + CTau * RAD);
  const vTau = MTau + CTau;
  const rTau = (a * (1 - eTau * eTau)) / (1 + eTau * Math.cos(vTau));
  const uTau = norm360(lTau - OmegaTau * RAD) * DEG;
  const xTau = rTau * (Math.cos(OmegaTau) * Math.cos(uTau) - Math.sin(OmegaTau) * Math.sin(uTau) * Math.cos(ITau));
  const yTau = rTau * (Math.sin(OmegaTau) * Math.cos(uTau) + Math.cos(OmegaTau) * Math.sin(uTau) * Math.cos(ITau));

  return norm360(Math.atan2(yTau - earth.y, xTau - earth.x) * RAD);
}

// Meeus Table 31.A Equinox of date for Jupiter
function calcJupiterMeeus(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const earth = getEarth(T);

  const a = 5.202603;

  function getJup(t_val) {
    const Mj = norm360(19.8950 + 3034.6906 * t_val);
    const Ms = norm360(316.9670 + 1221.5354 * t_val);

    const deltaL = -0.332 * Math.sin((2*Mj - 5*Ms - 67.6) * DEG)
      - 0.056 * Math.sin((2*Mj - 2*Ms + 21) * DEG)
      + 0.042 * Math.sin((3*Mj - 5*Ms + 21) * DEG)
      - 0.036 * Math.sin((Mj - 2*Ms) * DEG)
      + 0.022 * Math.cos((Mj - Ms) * DEG)
      + 0.023 * Math.sin((2*Mj - 3*Ms + 52) * DEG)
      - 0.016 * Math.sin((Mj - 5*Ms - 69) * DEG);

    const L = norm360(34.351519 + 3036.3027748 * t_val + 0.0002233 * t_val * t_val + deltaL);
    const e = 0.04849793 + 0.000163225 * t_val;
    const I = (1.303267 - 0.0054965 * t_val) * DEG;
    const Omega = norm360(100.464407 + 1.0209774 * t_val) * DEG;
    const peri = norm360(14.331207 + 1.6126352 * t_val);

    const M = norm360(L - peri) * DEG;
    const C = (2 * e - (e ** 3) / 4) * Math.sin(M)
      + (5/4 * e ** 2) * Math.sin(2 * M);
    const l = norm360(L + C * RAD);
    const v = M + C;
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
    const u = norm360(l - Omega * RAD) * DEG;
    const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
    const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
    return { x, y, r };
  }

  const j0 = getJup(T);
  const d0 = Math.sqrt((j0.x - earth.x)**2 + (j0.y - earth.y)**2);
  const tau = 0.0057755183 * d0;
  const jTau = getJup((jd - tau - 2451545.0) / 36525.0);

  return norm360(Math.atan2(jTau.y - earth.y, jTau.x - earth.x) * RAD);
}

const refCases = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));

console.log("=== SATURN SIMULATION ===");
let satPass = 0;
for (const c of refCases) {
  const d = new Date(c.utcInstant);
  const [yr, mo, dy] = c.date.split('-').map(Number);
  const [h, m] = c.time.split(':').map(Number);
  let y = yr, m_ = mo;
  if (m_ <= 2) { y -= 1; m_ += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = (h + m / 60 - c.tz) / 24;
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

  const sim = calcSaturnMeeus(jd);
  const ref = c.planets.Saturn.lonTrop;
  const deltaArc = signedDiff(sim, ref) * 60;
  const pass = Math.abs(deltaArc) <= 1.0;
  if (pass) satPass++;
  console.log(`${c.id}: Sim=${sim.toFixed(4)}°, Ref=${ref.toFixed(4)}°, Delta=${deltaArc >= 0 ? '+' : ''}${deltaArc.toFixed(2)}' | ${pass ? '✅ PASS' : '❌'}`);
}
console.log(`Saturn Pass: ${satPass}/9\n`);

console.log("=== JUPITER SIMULATION ===");
let jupPass = 0;
for (const c of refCases) {
  const [yr, mo, dy] = c.date.split('-').map(Number);
  const [h, m] = c.time.split(':').map(Number);
  let y = yr, m_ = mo;
  if (m_ <= 2) { y -= 1; m_ += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = (h + m / 60 - c.tz) / 24;
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

  const sim = calcJupiterMeeus(jd);
  const ref = c.planets.Jupiter.lonTrop;
  const deltaArc = signedDiff(sim, ref) * 60;
  const pass = Math.abs(deltaArc) <= 1.0;
  if (pass) jupPass++;
  console.log(`${c.id}: Sim=${sim.toFixed(4)}°, Ref=${ref.toFixed(4)}°, Delta=${deltaArc >= 0 ? '+' : ''}${deltaArc.toFixed(2)}' | ${pass ? '✅ PASS' : '❌'}`);
}
console.log(`Jupiter Pass: ${jupPass}/9\n`);
