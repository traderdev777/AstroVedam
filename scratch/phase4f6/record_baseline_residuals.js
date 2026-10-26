import fs from 'fs';
import * as e from '../../src/engines/astrology/ephemeris.js';
import { generateKundali } from '../../src/engines/astrology/kundali.js';

console.log("Recording baseline residuals across all 31 reference cases...");

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

// 1. Canonical (9 cases)
const canonicalFixture = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));
const canonicalBaseline = [];

for (const c of canonicalFixture) {
  const kundali = generateKundali(c.date, c.time, c.lat, c.lon, c.tz, 'LAHIRI');
  const jd = kundali.julianDay;
  const ayanamsa = parseFloat(kundali.birthDetails.ayanamsaValue);

  const refTrop = c.planets.Saturn.lonTrop;
  const refSid = norm360(refTrop - ayanamsa);
  const avSaturn = kundali.planets.find(p => p.name === 'Saturn');
  const avSid = avSaturn.longitude;
  const avTrop = norm360(avSid + ayanamsa);

  const deltaDeg = signedDiff(avSid, refSid);
  const deltaArcmin = deltaDeg * 60;
  const deltaArcsec = deltaArcmin * 60;

  canonicalBaseline.push({
    id: c.id,
    name: c.name,
    dateUTC: c.utcInstant,
    jd,
    refTrop,
    refSid,
    ayanamsa,
    avTrop,
    avSid,
    deltaArcmin,
    deltaArcsec,
    pass: Math.abs(deltaArcmin) <= 1.0
  });
}

// 2. Validation 10 (Phase 4F.5)
const val10Fixture = JSON.parse(fs.readFileSync('scratch/phase4f5/validation_manifest.json', 'utf8'));
const val10Baseline = [];

for (const entry of val10Fixture) {
  const [datePart, timePart] = entry.dateUTC.split(' ');
  const [yr, mo, dy] = datePart.split('-').map(Number);
  const [hr, mn] = timePart.split(':').map(Number);
  const jd = e.dateToJD(yr, mo, dy, hr, mn, 0);

  const prodLon = e.saturnLongitude(jd);
  const deltaDeg = signedDiff(prodLon, entry.refTropLon);
  const deltaArcmin = deltaDeg * 60;
  const deltaArcsec = deltaArcmin * 60;

  val10Baseline.push({
    id: entry.id,
    name: entry.name,
    regime: entry.regime,
    dateUTC: entry.dateUTC,
    jd,
    refTrop: entry.refTropLon,
    prodLon,
    deltaArcmin,
    deltaArcsec,
    pass: Math.abs(deltaArcmin) <= 1.0
  });
}

// 3. Expanded 12 (Phase 4F.5A)
const val12Fixture = JSON.parse(fs.readFileSync('scratch/phase4f5a/expanded_validation_manifest.json', 'utf8'));
const val12Baseline = [];

for (const entry of val12Fixture) {
  const [datePart, timePart] = entry.dateUTC.split(' ');
  const [yr, mo, dy] = datePart.split('-').map(Number);
  const [hr, mn] = timePart.split(':').map(Number);
  const jd = e.dateToJD(yr, mo, dy, hr, mn, 0);

  const prodLon = e.saturnLongitude(jd);
  const deltaDeg = signedDiff(prodLon, entry.refTropLon);
  const deltaArcmin = deltaDeg * 60;
  const deltaArcsec = deltaArcmin * 60;

  val12Baseline.push({
    id: entry.id,
    name: entry.name,
    regime: entry.regime,
    dateUTC: entry.dateUTC,
    jd,
    refTrop: entry.refTropLon,
    prodLon,
    deltaArcmin,
    deltaArcsec,
    pass: Math.abs(deltaArcmin) <= 1.0
  });
}

function calcStats(items) {
  const errors = items.map(x => x.deltaArcmin);
  const absErrors = errors.map(Math.abs);
  const maxErr = Math.max(...absErrors);
  const mae = absErrors.reduce((a, b) => a + b, 0) / errors.length;
  const mse = errors.reduce((a, b) => a + b, 0) / errors.length;
  const passCount = items.filter(x => x.pass).length;
  return { n: items.length, maxErr, mae, mse, passCount, passRate: (passCount / items.length) * 100 };
}

const all31 = [
  ...canonicalBaseline.map(c => ({ id: c.id, dateUTC: c.dateUTC, deltaArcmin: c.deltaArcmin, pass: c.pass })),
  ...val10Baseline.map(c => ({ id: c.id, dateUTC: c.dateUTC, deltaArcmin: c.deltaArcmin, pass: c.pass })),
  ...val12Baseline.map(c => ({ id: c.id, dateUTC: c.dateUTC, deltaArcmin: c.deltaArcmin, pass: c.pass }))
];

const stats = {
  canonical: calcStats(canonicalBaseline),
  val10: calcStats(val10Baseline),
  val12: calcStats(val12Baseline),
  combined: calcStats(all31)
};

const output = {
  timestamp: new Date().toISOString(),
  stats,
  canonicalBaseline,
  val10Baseline,
  val12Baseline
};

fs.writeFileSync('scratch/phase4f6/baseline_residuals.json', JSON.stringify(output, null, 2));

console.log("Baseline statistics:");
console.log(`  Canonical (9 cases):  Max = ${stats.canonical.maxErr.toFixed(4)}', MAE = ${stats.canonical.mae.toFixed(4)}', Bias = ${stats.canonical.mse.toFixed(4)}'`);
console.log(`  Val10 (10 cases):     Max = ${stats.val10.maxErr.toFixed(4)}', MAE = ${stats.val10.mae.toFixed(4)}', Bias = ${stats.val10.mse.toFixed(4)}'`);
console.log(`  Val12 (12 cases):     Max = ${stats.val12.maxErr.toFixed(4)}', MAE = ${stats.val12.mae.toFixed(4)}', Bias = ${stats.val12.mse.toFixed(4)}'`);
console.log(`  Combined (31 cases):  Max = ${stats.combined.maxErr.toFixed(4)}', MAE = ${stats.combined.mae.toFixed(4)}', Bias = ${stats.combined.mse.toFixed(4)}'`);
