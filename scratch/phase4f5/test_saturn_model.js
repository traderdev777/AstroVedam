import * as e from '../../src/engines/astrology/ephemeris.js';
import fs from 'fs';

const url = 'https://raw.githubusercontent.com/commenthol/astronomia/master/data/vsop87Dsaturn.js';
const text = await fetch(url).then(r => r.text());
const jsonLike = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
const vsop = (new Function('return ' + jsonLike))();

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
function norm360(deg) { let r = deg % 360; return r < 0 ? r + 360 : r; }
function normDiff(a, b) { let d = (a - b) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; }

function nutationInLongitude(T) {
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
  let ecc = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  let v = Mrad + C * DEG;
  let R = (1.000001018 * (1 - ecc * ecc)) / (1 + ecc * Math.cos(v));
  let lEarth = norm360(sunTrueLong + 180) * DEG;
  return {
    x: R * Math.cos(lEarth),
    y: R * Math.sin(lEarth),
    z: 0,
    R: R
  };
}

function evalSeries(seriesObj, tau, threshold = 0) {
  let val = 0;
  let tauPower = 1;
  for (let i = 0; i <= 5; i++) {
    const table = seriesObj[String(i)];
    if (!table) break;
    let subVal = 0;
    for (let j = 0; j < table.length; j++) {
      const [A, B, C] = table[j];
      if (Math.abs(A) < threshold) continue;
      subVal += A * Math.cos(B + C * tau);
    }
    val += subVal * tauPower;
    tauPower *= tau;
  }
  return val;
}

function getSaturnHelioVSOP(T, threshold = 0) {
  const tau = T / 10;
  const L = evalSeries(vsop.L, tau, threshold);
  const B = evalSeries(vsop.B, tau, threshold);
  const R = evalSeries(vsop.R, tau, threshold);

  return {
    x: R * Math.cos(L) * Math.cos(B),
    y: R * Math.sin(L) * Math.cos(B),
    z: R * Math.sin(B),
    r: R
  };
}

function saturnLongitudeVSOP(jd, threshold = 0) {
  const T = e.julianCenturies(jd);
  const earth = getEarthHelioVector(T);
  const s0 = getSaturnHelioVSOP(T, threshold);
  const d0 = Math.sqrt((s0.x - earth.x) ** 2 + (s0.y - earth.y) ** 2 + (s0.z - earth.z) ** 2);
  const dPsi = nutationInLongitude(T);

  const tau = 0.0057755183 * d0;
  const Ttau = e.julianCenturies(jd - tau);
  const sTau = getSaturnHelioVSOP(Ttau, threshold);

  return norm360(Math.atan2(sTau.y - earth.y, sTau.x - earth.x) * RAD + dPsi);
}

const refCases = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));

for (const th of [2e-5, 3e-5, 5e-5, 7e-5, 1e-4]) {
  let countL = 0, countB = 0, countR = 0;
  for (const ord of Object.keys(vsop.L)) countL += vsop.L[ord].filter(t => Math.abs(t[0]) >= th).length;
  for (const ord of Object.keys(vsop.B)) countB += vsop.B[ord].filter(t => Math.abs(t[0]) >= th).length;
  for (const ord of Object.keys(vsop.R)) countR += vsop.R[ord].filter(t => Math.abs(t[0]) >= th).length;
  const totalTerms = countL + countB + countR;

  console.log(`\nThreshold: ${th.toExponential()} rad (Terms: L=${countL}, B=${countB}, R=${countR}, Total=${totalTerms}):`);
  let maxErr = 0;
  let passCount = 0;
  for (const c of refCases) {
    const d = new Date(c.utcInstant);
    const jd = e.dateToJD(d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    const lon = saturnLongitudeVSOP(jd, th);
    const ref = c.planets.Saturn.lonTrop;
    const errArc = normDiff(lon, ref) * 60;
    if (Math.abs(errArc) > maxErr) maxErr = Math.abs(errArc);
    const pass = Math.abs(errArc) <= 1.0;
    if (pass) passCount++;
    console.log(`  ${c.id}: Ref=${ref.toFixed(4)}°, VSOP=${lon.toFixed(4)}°, Delta=${(errArc>=0?'+':'')+errArc.toFixed(2)}' | ${pass?'PASS':'FAIL'}`);
  }
  console.log(`  Pass: ${passCount}/9 | Max Error: ${maxErr.toFixed(2)}'`);
}
