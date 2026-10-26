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

// Load all 31 reference cases
const canonical = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8')).map(c => ({
  id: c.id,
  name: c.name,
  dateUTC: c.utcInstant,
  refTrop: c.planets.Saturn.lonTrop
}));

const val10 = JSON.parse(fs.readFileSync('scratch/phase4f5/validation_manifest.json', 'utf8')).map(c => ({
  id: c.id,
  name: c.name,
  dateUTC: c.dateUTC,
  refTrop: c.refTropLon
}));

const val12 = JSON.parse(fs.readFileSync('scratch/phase4f5a/expanded_validation_manifest.json', 'utf8')).map(c => ({
  id: c.id,
  name: c.name,
  dateUTC: c.dateUTC,
  refTrop: c.refTropLon
}));

const all31 = [...canonical, ...val10, ...val12];

console.log("Evaluating Aberration Models across all 31 reference cases...\n");

// Test models:
// Model 0: Baseline (Current production code)
// Model 1: Classical Meeus Aberration: dLambda = -20.49552" * cos(Sun - Lon) / 3600
// Model 2: Complete Meeus Aberration with E-terms:
//   e = 0.016708634 - 0.000042037 * T
//   pi = 102.93735 + 1.71953 * T
//   dLambda = (-k * cos(Sun - Lon) + e * k * cos(pi - Lon)) / (3600 * cos(Lat))

function testModel(name, aberrFn) {
  let maxErr = 0;
  let sumErr = 0;
  let sumSigned = 0;
  const results = [];

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

    const T = e.julianCenturies(jd);
    const prodLon = e.saturnLongitude(jd);
    const sunLon = e.sunLongitude(jd);

    const corr = aberrFn(T, sunLon, prodLon);
    const correctedLon = norm360(prodLon + corr);

    const deltaDeg = signedDiff(correctedLon, c.refTrop);
    const deltaArcmin = deltaDeg * 60;
    const deltaArcsec = deltaArcmin * 60;

    const absArcmin = Math.abs(deltaArcmin);
    if (absArcmin > maxErr) maxErr = absArcmin;
    sumErr += absArcmin;
    sumSigned += deltaArcmin;

    results.push({ id: c.id, deltaArcmin, deltaArcsec });
  }

  const mae = sumErr / all31.length;
  const bias = sumSigned / all31.length;
  console.log(`[${name}]`);
  console.log(`  Max Error: ${maxErr.toFixed(4)}' (${(maxErr * 60).toFixed(2)}") | MAE: ${mae.toFixed(4)}' (${(mae * 60).toFixed(2)}") | Bias: ${bias.toFixed(4)}'`);
  return { maxErr, mae, bias, results };
}

const m0 = testModel("Model 0: Current Baseline (No explicit aberration)", () => 0);
const m1 = testModel("Model 1: Principal Aberration (-k * cos(Sun - Lon))", (T, sun, sat) => {
  return (-20.49552 / 3600) * Math.cos((sun - sat) * DEG);
});
const m2 = testModel("Model 2: Full Meeus with E-terms", (T, sun, sat) => {
  const k = 20.49552 / 3600;
  const ecc = 0.016708634 - 0.000042037 * T;
  const peri = norm360(102.93735 + 1.71953 * T) * DEG;
  return -k * Math.cos((sun - sat) * DEG) + ecc * k * Math.cos(peri - sat * DEG);
});

