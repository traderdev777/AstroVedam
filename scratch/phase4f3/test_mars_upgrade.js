import fs from 'fs';
import { julianCenturies, dateToJD } from '../../src/engines/astrology/ephemeris.js';

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

function solveKepler(Mrad, e) {
  if (!Number.isFinite(Mrad) || !Number.isFinite(e)) return NaN;
  let E = Mrad + e * Math.sin(Mrad);
  for (let i = 0; i < 6; i++) {
    const f = E - e * Math.sin(E) - Mrad;
    const fprime = 1 - e * Math.cos(E);
    if (Math.abs(fprime) < 1e-12) break;
    const dE = f / fprime;
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

function nutationInLongitude(T) {
  if (!Number.isFinite(T)) return 0;
  const Omega = norm360(125.04452 - 1934.136261 * T) * DEG;
  const L0 = norm360(280.4665 + 36000.7698 * T) * DEG;
  return (-17.20 * Math.sin(Omega) - 1.32 * Math.sin(2 * L0)) / 3600;
}

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

// Current Mars
function currentMars(jd) {
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);
  const a = 1.52367934 + 0.00000319 * T;
  const e = 0.093405 + 0.000092064 * T;
  const I = (1.849691 - 0.000601 * T) * DEG;
  const L = norm360(355.433 + 19141.696 * T);
  const peri = norm360(336.060 + 1.841 * T);
  const Omega = norm360(49.558 - 0.295 * T) * DEG;
  const M = norm360(L - peri) * DEG;
  const C = (2 * e - (e ** 3) / 4) * Math.sin(M)
    + (5/4 * e ** 2) * Math.sin(2 * M)
    + (13/12 * e ** 3) * Math.sin(3 * M);
  const l = norm360(L + C * RAD);
  const v = M + C;
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
  const u = norm360(l - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
  return norm360(Math.atan2(y - earth.y, x - earth.x) * RAD);
}

// Upgraded Mars Helio
function getMarsHelio(T) {
  const a = 1.52367934;
  const e = 0.09340062 + 0.000092064 * T - 0.000000077 * T * T;
  const I = (1.849726 - 0.0006011 * T + 0.00001276 * T * T) * DEG;
  const L = norm360(355.433275 + 19141.6964746 * T + 0.00031052 * T * T);
  const peri = norm360(336.060234 + 1.8410449 * T + 0.00013477 * T * T);
  const Omega = norm360(49.558093 + 0.7720959 * T + 0.00001557 * T * T) * DEG;

  const M = norm360(L - peri) * DEG;
  const E = solveKepler(M, e);
  const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
  const r = a * (1 - e * Math.cos(E));
  const u = norm360(v * RAD + peri - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
  return { x, y, r };
}

// Upgraded Mars Geocentric
function upgradedMars(jd) {
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);

  const m0 = getMarsHelio(T);
  const d0 = Math.sqrt((m0.x - earth.x) ** 2 + (m0.y - earth.y) ** 2);
  const dPsi = nutationInLongitude(T);

  // Light-time correction tau = d / c (0.0057755183 days/AU)
  if (!Number.isFinite(d0) || d0 <= 0 || d0 > 10) {
    return norm360(Math.atan2(m0.y - earth.y, m0.x - earth.x) * RAD + dPsi);
  }
  const tau = 0.0057755183 * d0;
  const Ttau = julianCenturies(jd - tau);
  const mTau = getMarsHelio(Ttau);

  return norm360(Math.atan2(mTau.y - earth.y, mTau.x - earth.x) * RAD + dPsi);
}

const cases = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));

console.log('CASE   | HORIZONS TROP | CURRENT TROP | UPGRADE TROP | CURR ERR (\') | UPGR ERR (\') | STATUS');
console.log('-----------------------------------------------------------------------------------------');

for (const c of cases) {
  const d = new Date(c.utcInstant);
  const jd = dateToJD(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  );
  const refTrop = c.planets.Mars.lonTrop;
  const curTrop = currentMars(jd);
  const upgTrop = upgradedMars(jd);

  const curErrArc = signedDiff(curTrop, refTrop) * 60;
  const upgErrArc = signedDiff(upgTrop, refTrop) * 60;
  const pass = Math.abs(upgErrArc) <= 1.0 ? '✅ PASS' : '❌ FAIL';

  console.log(
    `${c.id} | ${refTrop.toFixed(4).padStart(13)}° | ${curTrop.toFixed(4).padStart(12)}° | ${upgTrop.toFixed(4).padStart(12)}° | ${curErrArc.toFixed(2).padStart(12)}' | ${upgErrArc.toFixed(2).padStart(12)}' | ${pass}`
  );
}
