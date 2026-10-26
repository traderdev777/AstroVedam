import fs from 'fs';

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function norm360(d) {
  let r = d % 360;
  return r < 0 ? r + 360 : r;
}

function normDiff(a, b) {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
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

function nutationLon(T) {
  const Omega = norm360(125.04452 - 1934.136261 * T) * DEG;
  const L0 = norm360(280.4665 + 36000.7698 * T) * DEG;
  return (-17.20 * Math.sin(Omega) - 1.32 * Math.sin(2 * L0)) / 3600;
}

function solveKepler(Mrad, e) {
  let E = Mrad + e * Math.sin(Mrad);
  for (let i = 0; i < 6; i++) {
    const f = E - e * Math.sin(E) - Mrad;
    const fprime = 1 - e * Math.cos(E);
    const dE = f / fprime;
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

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
    const E = solveKepler(M, e);
    const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
    const r = a * (1 - e * Math.cos(E));
    const u = norm360(v * RAD + peri - Omega * RAD) * DEG;
    const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
    const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
    return { x, y, r };
  }

  const j0 = getJup(T);
  const d0 = Math.sqrt((j0.x - earth.x)**2 + (j0.y - earth.y)**2);
  const tau = 0.0057755183 * d0;
  const jTau = getJup((jd - tau - 2451545.0) / 36525.0);
  const dPsi = nutationLon(T);
  return norm360(Math.atan2(jTau.y - earth.y, jTau.x - earth.x) * RAD + dPsi);
}

function calcSaturnMeeus(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const earth = getEarth(T);
  const a = 9.554909;

  function getSat(t_val) {
    const Mj = norm360(19.8950 + 3034.6906 * t_val);
    const Ms = norm360(316.9670 + 1221.5354 * t_val);

    const deltaL = 0.812 * Math.sin((2*Mj - 5*Ms - 67.6) * DEG)
      - 0.229 * Math.cos((2*Mj - 4*Ms - 2) * DEG)
      + 0.119 * Math.sin((Mj - 2*Ms - 3) * DEG)
      + 0.046 * Math.sin((2*Mj - 6*Ms - 69) * DEG)
      + 0.014 * Math.sin((Mj - 3*Ms + 32) * DEG);

    const L = norm360(50.077444 + 1223.5110686 * t_val + 0.00051908 * t_val * t_val + deltaL);
    const e = 0.05554814 - 0.000346641 * t_val;
    const I = (2.488879 - 0.0037362 * t_val) * DEG;
    const Omega = norm360(113.665503 + 0.877088 * t_val) * DEG;
    const peri = norm360(93.057237 + 1.9637613 * t_val);

    const M = norm360(L - peri) * DEG;
    const E = solveKepler(M, e);
    const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
    const r = a * (1 - e * Math.cos(E));
    const u = norm360(v * RAD + peri - Omega * RAD) * DEG;
    const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
    const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
    return { x, y, r };
  }

  const s0 = getSat(T);
  const d0 = Math.sqrt((s0.x - earth.x)**2 + (s0.y - earth.y)**2);
  const tau = 0.0057755183 * d0;
  const sTau = getSat((jd - tau - 2451545.0) / 36525.0);
  const dPsi = nutationLon(T);
  return norm360(Math.atan2(sTau.y - earth.y, sTau.x - earth.x) * RAD + dPsi);
}

function getVelocity(fn, jd) {
  const h = 0.01;
  const l1 = fn(jd - h);
  const l2 = fn(jd + h);
  return normDiff(l2, l1) / (2 * h);
}

const refCases = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));

console.log('=== RETROGRADE & VELOCITY VERIFICATION ===');
for (const c of refCases) {
  const [yr, mo, dy] = c.date.split('-').map(Number);
  const [h, m] = c.time.split(':').map(Number);
  let y = yr, m_ = mo;
  if (m_ <= 2) { y -= 1; m_ += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = (h + m / 60 - c.tz) / 24;
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

  const jupVel = getVelocity(calcJupiterMeeus, jd);
  const jupRetro = jupVel < 0;
  const jupRefRetro = c.planets.Jupiter.isRetro;

  const satVel = getVelocity(calcSaturnMeeus, jd);
  const satRetro = satVel < 0;
  const satRefRetro = c.planets.Saturn.isRetro;

  console.log(`${c.id}: Jup Vel=${jupVel.toFixed(5)}°/d (Retro=${jupRetro}, Ref=${jupRefRetro}) | Sat Vel=${satVel.toFixed(5)}°/d (Retro=${satRetro}, Ref=${satRefRetro})`);
}
