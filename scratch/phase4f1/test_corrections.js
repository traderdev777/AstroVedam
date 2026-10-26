import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

function julianCenturies(jd) {
  return (jd - 2451545.0) / 36525.0;
}

// Current Earth vector from ephemeris.js
function getEarthHelioVector(T) {
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
  return {
    x: R * Math.cos(lEarth),
    y: R * Math.sin(lEarth),
    R: R
  };
}

// Test current Saturn
function saturnCurrent(jd) {
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);
  const Mj = norm360(20.020194 + T * 3034.684357);
  const Ms = norm360(317.020696 + T * 1222.113778);
  const deltaL = 0.812 * Math.sin((2*Mj - 5*Ms - 67.6) * DEG)
    - 0.229 * Math.cos((2*Mj - 4*Ms - 2) * DEG)
    + 0.119 * Math.sin((Mj - 2*Ms - 3) * DEG)
    + 0.046 * Math.sin((2*Mj - 6*Ms + 69) * DEG)
    + 0.014 * Math.sin((Mj - 3*Ms + 32) * DEG);
  const a = 9.582017;
  const e = 0.055509 - 0.000346 * T;
  const I = (2.485240 + 0.001083 * T) * DEG;
  const L = norm360(50.077471 + 1222.113794 * T + deltaL);
  const peri = norm360(92.43194 + 1.958 * T);
  const Omega = norm360(113.665524 - 0.256671 * T) * DEG;
  const M = norm360(L - peri) * DEG;
  const C = (2 * e - (e ** 3) / 4) * Math.sin(M)
    + (5/4 * e ** 2) * Math.sin(2 * M);
  const l = norm360(L + C * RAD);
  const v = M + C;
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
  const u = norm360(l - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
  return norm360(Math.atan2(y - earth.y, x - earth.x) * RAD);
}

// Load reference cases
const refCases = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));

console.log("=== CURRENT SATURN VS REF CASES ===");
for (const c of refCases) {
  const d = new Date(c.utcInstant);
  const [h, m] = c.time.split(':').map(Number);
  // Reconstruct JD
  const [yr, mo, dy] = c.date.split('-').map(Number);
  // Calculate JD
  let y = yr, m_ = mo;
  if (m_ <= 2) { y -= 1; m_ += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = (h + m / 60 - c.tz) / 24;
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;
  
  const cur = saturnCurrent(jd);
  const ref = c.planets.Saturn.lonTrop;
  const diffArc = signedDiff(cur, ref) * 60;
  console.log(`${c.id}: JD ${jd.toFixed(4)} | Cur: ${cur.toFixed(4)}° | Ref: ${ref.toFixed(4)}° | Delta: ${diffArc >= 0 ? '+' : ''}${diffArc.toFixed(2)}'`);
}
