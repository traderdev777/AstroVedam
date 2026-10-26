import fs from 'fs';
import * as e from '../../src/engines/astrology/ephemeris.js';

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function norm360(d) { let r = d % 360; return r < 0 ? r + 360 : r; }
function signedDiff(val, ref) {
  let diff = (val - ref) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

// 1. Authoritative Leap Second Table (1972-01-01 to Present)
const LEAP_SECONDS = [
  { jd: 2441317.5, tai_minus_utc: 10 }, // 1972-01-01
  { jd: 2441499.5, tai_minus_utc: 11 }, // 1972-07-01
  { jd: 2441683.5, tai_minus_utc: 12 }, // 1973-01-01
  { jd: 2442048.5, tai_minus_utc: 13 }, // 1974-01-01
  { jd: 2442413.5, tai_minus_utc: 14 }, // 1975-01-01
  { jd: 2442778.5, tai_minus_utc: 15 }, // 1976-01-01
  { jd: 2443144.5, tai_minus_utc: 16 }, // 1977-01-01
  { jd: 2443509.5, tai_minus_utc: 17 }, // 1978-01-01
  { jd: 2443874.5, tai_minus_utc: 18 }, // 1979-01-01
  { jd: 2444239.5, tai_minus_utc: 19 }, // 1980-01-01
  { jd: 2444786.5, tai_minus_utc: 20 }, // 1981-07-01
  { jd: 2445151.5, tai_minus_utc: 21 }, // 1982-07-01
  { jd: 2445516.5, tai_minus_utc: 22 }, // 1983-07-01
  { jd: 2446247.5, tai_minus_utc: 23 }, // 1985-07-01
  { jd: 2447161.5, tai_minus_utc: 24 }, // 1988-01-01
  { jd: 2447892.5, tai_minus_utc: 25 }, // 1990-01-01
  { jd: 2448257.5, tai_minus_utc: 26 }, // 1991-01-01
  { jd: 2448804.5, tai_minus_utc: 27 }, // 1992-07-01
  { jd: 2449169.5, tai_minus_utc: 28 }, // 1993-07-01
  { jd: 2449534.5, tai_minus_utc: 29 }, // 1994-07-01
  { jd: 2450083.5, tai_minus_utc: 30 }, // 1996-01-01
  { jd: 2450630.5, tai_minus_utc: 31 }, // 1997-07-01
  { jd: 2451179.5, tai_minus_utc: 32 }, // 1999-01-01
  { jd: 2453736.5, tai_minus_utc: 33 }, // 2006-01-01
  { jd: 2454832.5, tai_minus_utc: 34 }, // 2009-01-01
  { jd: 2456109.5, tai_minus_utc: 35 }, // 2012-07-01
  { jd: 2457204.5, tai_minus_utc: 36 }, // 2015-07-01
  { jd: 2457754.5, tai_minus_utc: 37 }, // 2017-01-01
];

/**
 * Calculate Delta-T = TT - UT (or TT - UTC) in seconds.
 * References:
 * - Post-1972: IERS TAI - UTC table + 32.184s
 * - Historical & Future: Espenak & Meeus (NASA TP-2006-214141)
 */
function getDeltaT(jd) {
  if (jd >= 2441317.5) { // 1972-01-01 onwards
    for (let i = LEAP_SECONDS.length - 1; i >= 0; i--) {
      if (jd >= LEAP_SECONDS[i].jd) {
        return LEAP_SECONDS[i].tai_minus_utc + 32.184;
      }
    }
  }

  // Decimal year for polynomial
  const y = 2000.0 + (jd - 2451545.0) / 365.2425;

  if (y >= 2005 && y < 2050) {
    const t = y - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  } else if (y >= 1986 && y < 2005) {
    const t = y - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t + 0.000651814 * t * t * t * t;
  } else if (y >= 1961 && y < 1986) {
    const t = y - 1975;
    return 45.45 + 1.067 * t - t * t / 260 - t * t * t / 718;
  } else if (y >= 1900 && y < 1961) {
    const t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t * t * t * t;
  } else if (y >= 1800 && y < 1900) {
    const t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t * t * t * t;
  } else if (y >= 1700 && y < 1800) {
    const t = y - 1700;
    return 8.83 + 0.1603 * t - 0.0059285 * t * t + 0.00013336 * t * t * t - t * t * t * t / 1174000;
  } else if (y >= 500 && y < 1700) {
    const u = (y - 1000) / 100;
    return 1574.2 - 564.40 * u - 19.77 * u * u + 45.2 * u * u * u;
  } else if (y >= -500 && y < 500) {
    const u = y / 100;
    return 10583.6 - 1014.41 * u + 33.78311 * u * u - 5.952053 * u * u * u
      - 0.1798452 * u * u * u * u + 0.022174192 * u * u * u * u * u + 0.0090316521 * u * u * u * u * u * u;
  } else {
    const u = (y - 1820) / 100;
    return -20 + 32 * u * u;
  }
}

function jdUtcToTT(jd) {
  const deltaT = getDeltaT(jd); // in seconds
  return jd + deltaT / 86400.0;
}

// Read ephemeris functions
let ephemSource = fs.readFileSync('src/engines/astrology/ephemeris.js', 'utf8');
// remove import statements
ephemSource = ephemSource.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
// mock AYANAMSA and RASHIS if needed
ephemSource = 'const AYANAMSA = { LAHIRI: { value2000: 23.85307, rate: 0.013972 } };\nconst RASHIS = [];\n' + ephemSource;
ephemSource = ephemSource.replace(/export\s+/g, '');

const fn = new Function(`
  ${ephemSource}
  return { getSaturnHelio, getEarthHelioVector, nutationInLongitude, julianCenturies, sunLongitude };
`);
const { getSaturnHelio, getEarthHelioVector, nutationInLongitude, julianCenturies, sunLongitude } = fn();

function saturnLongitudeEnhanced(jdUtc) {
  const jdTT = jdUtcToTT(jdUtc);
  const T = julianCenturies(jdTT);
  const earth = getEarthHelioVector(T);

  const s0 = getSaturnHelio(T);
  const d0 = Math.sqrt((s0.x - earth.x) ** 2 + (s0.y - earth.y) ** 2 + s0.z ** 2);
  const dPsi = nutationInLongitude(T);

  if (!Number.isFinite(d0) || d0 <= 0 || d0 > 50) {
    return norm360(Math.atan2(s0.y - earth.y, s0.x - earth.x) * RAD + dPsi);
  }
  const tau = 0.0057755183 * d0;
  const Ttau = julianCenturies(jdTT - tau);
  const sTau = getSaturnHelio(Ttau);

  const geoLon = Math.atan2(sTau.y - earth.y, sTau.x - earth.x) * RAD;

  // Observer Stellar Aberration
  const sunLon = sunLongitude(jdTT);
  const beta = Math.asin(sTau.z / d0);
  const cosBeta = Math.cos(beta);
  const dLambdaAberr = (-20.49552 / 3600) * Math.cos((sunLon - geoLon) * DEG) / (cosBeta || 1);

  return norm360(geoLon + dPsi + dLambdaAberr);
}

// Test against all 31 reference cases
const canonical = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8')).map(c => ({
  id: c.id,
  dateUTC: c.utcInstant,
  refTrop: c.planets.Saturn.lonTrop
}));
const val10 = JSON.parse(fs.readFileSync('scratch/phase4f5/validation_manifest.json', 'utf8')).map(c => ({
  id: c.id,
  dateUTC: c.dateUTC,
  refTrop: c.refTropLon
}));
const val12 = JSON.parse(fs.readFileSync('scratch/phase4f5a/expanded_validation_manifest.json', 'utf8')).map(c => ({
  id: c.id,
  dateUTC: c.dateUTC,
  refTrop: c.refTropLon
}));
const all31 = [...canonical, ...val10, ...val12];

console.log("=== COMPARING PRODUCTION BASELINE VS ENHANCED MODEL (ALL 31 CASES) ===\n");

let baseMax = 0, baseSum = 0, baseBias = 0;
let enhMax = 0, enhSum = 0, enhBias = 0;

for (const c of all31) {
  let jd;
  if (c.dateUTC.includes('T')) {
    const d = new Date(c.dateUTC);
    jd = e.dateToJD(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
  } else {
    const [dp, tp] = c.dateUTC.split(' ');
    const [y, m, d] = dp.split('-').map(Number);
    const [hr, mn] = tp.split(':').map(Number);
    jd = e.dateToJD(y, m, d, hr, mn, 0);
  }

  const baseLon = e.saturnLongitude(jd);
  const enhLon = saturnLongitudeEnhanced(jd);

  const baseErr = signedDiff(baseLon, c.refTrop) * 60;
  const enhErr = signedDiff(enhLon, c.refTrop) * 60;

  if (Math.abs(baseErr) > baseMax) baseMax = Math.abs(baseErr);
  baseSum += Math.abs(baseErr);
  baseBias += baseErr;

  if (Math.abs(enhErr) > enhMax) enhMax = Math.abs(enhErr);
  enhSum += Math.abs(enhErr);
  enhBias += enhErr;

  console.log(`[${c.id.padEnd(11)}] Ref: ${c.refTrop.toFixed(4)}° | Base: ${baseLon.toFixed(4)}° (Err: ${(baseErr >= 0 ? '+' : '') + baseErr.toFixed(2)}' = ${(baseErr * 60).toFixed(1)}") | Enh: ${enhLon.toFixed(4)}° (Err: ${(enhErr >= 0 ? '+' : '') + enhErr.toFixed(2)}' = ${(enhErr * 60).toFixed(1)}")`);
}

const n = all31.length;
console.log("\n========================================================");
console.log("FINAL SUMMARY COMPARISON ACROSS ALL 31 CASES:");
console.log(`Baseline Production Engine:`);
console.log(`  Max Error: ${baseMax.toFixed(4)}' (${(baseMax * 60).toFixed(2)}") | MAE: ${(baseSum / n).toFixed(4)}' (${((baseSum / n) * 60).toFixed(2)}") | Bias: ${(baseBias / n).toFixed(4)}'`);
console.log(`Enhanced Pipeline (TT Time Scale + Observer Aberration):`);
console.log(`  Max Error: ${enhMax.toFixed(4)}' (${(enhMax * 60).toFixed(2)}") | MAE: ${(enhSum / n).toFixed(4)}' (${((enhSum / n) * 60).toFixed(2)}") | Bias: ${(enhBias / n).toFixed(4)}'`);
console.log("========================================================");
