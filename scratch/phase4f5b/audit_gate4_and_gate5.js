import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as e from '../../src/engines/astrology/ephemeris.js';
import { generateKundali } from '../../src/engines/astrology/kundali.js';

console.log('========================================================================================');
console.log('🛰️ ASTROVEDAM PHASE 4F.5B — GATE 4 & GATE 5 SCIENTIFIC AUDIT');
console.log('========================================================================================\n');

function norm360(deg) {
  let r = deg % 360;
  return r < 0 ? r + 360 : r;
}

function signedDiff(val, ref) {
  let diff = (val - ref) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

// ---------------------------------------------------------
// GATE 4: AUDIT ALL 22 INDEPENDENT HORIZONS RAW PAYLOADS
// ---------------------------------------------------------
console.log('--- GATE 4: INDEPENDENT REFERENCE DATA AUDIT (22 CASES) ---');

const suites = [
  {
    name: 'Phase 4F.5 Independent Validation Suite (10 cases)',
    manifestPath: 'scratch/phase4f5/validation_manifest.json',
    rawDir: 'scratch/phase4f5/raw_horizons_responses'
  },
  {
    name: 'Phase 4F.5A Expanded Validation Suite (12 cases)',
    manifestPath: 'scratch/phase4f5a/expanded_validation_manifest.json',
    rawDir: 'scratch/phase4f5a/raw_expanded_horizons'
  }
];

let totalPayloads = 0;
let passedPayloads = 0;
let failedPayloads = 0;

const suiteResults = [];

for (const suite of suites) {
  console.log(`\nAuditing Suite: ${suite.name}`);
  const manifest = JSON.parse(fs.readFileSync(suite.manifestPath, 'utf8'));
  const results = [];

  for (const entry of manifest) {
    totalPayloads++;
    const filePath = path.join(suite.rawDir, entry.filename);

    if (!fs.existsSync(filePath)) {
      console.error(`  ❌ MISSING FILE: ${filePath}`);
      failedPayloads++;
      continue;
    }

    const fileBytes = fs.readFileSync(filePath);
    const actualHash = crypto.createHash('sha256').update(fileBytes).digest('hex');
    const expectedHash = entry.sha256;

    const hashMatch = (actualHash === expectedHash);

    const rawJson = JSON.parse(fileBytes.toString('utf8'));
    const resultText = (rawJson.response && rawJson.response.result) || rawJson.result || '';

    // Verify request parameters
    const hasTargetSaturn = resultText.includes('Target body name: Saturn (699)') || resultText.includes('Saturn (699)');
    const hasCenterEarth = resultText.includes('Center body name: Earth (399)') || resultText.includes('Center-site name: GEOCENTRIC') || resultText.includes('Earth (399)');
    const hasQuantity31 = resultText.includes('ObsEcLon    ObsEcLat');
    const hasApparent = resultText.includes('apparent') || resultText.includes('light-time');

    // Extract data line
    const soeIdx = resultText.indexOf('$$SOE');
    const eoeIdx = resultText.indexOf('$$EOE');
    let obsEcLon = null;
    let obsEcLat = null;
    let rawDateStr = '';

    if (soeIdx !== -1 && eoeIdx !== -1) {
      const dataBlock = resultText.slice(soeIdx + 5, eoeIdx).trim();
      const dataLines = dataBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const tokens = dataLines[0].split(/\s+/);
      rawDateStr = tokens[0] + ' ' + tokens[1];
      obsEcLon = parseFloat(tokens[2]);
      obsEcLat = parseFloat(tokens[3]);
    }

    const payloadLonDiff = Math.abs(obsEcLon - entry.refTropLon);

    // Compute AstroVedam ephemeris value
    const [datePart, timePart] = entry.dateUTC.split(' ');
    const [yr, mo, dy] = datePart.split('-').map(Number);
    const [hr, mn] = timePart.split(':').map(Number);
    const jd = e.dateToJD(yr, mo, dy, hr, mn, 0);

    const prodLon = e.saturnLongitude(jd);
    const deltaDeg = signedDiff(prodLon, obsEcLon);
    const deltaArcmin = deltaDeg * 60;
    const withinTolerance = Math.abs(deltaArcmin) <= 1.0;

    const isAllValid = hashMatch && hasTargetSaturn && hasCenterEarth && hasQuantity31 && (payloadLonDiff < 1e-4) && withinTolerance;

    if (isAllValid) {
      passedPayloads++;
    } else {
      failedPayloads++;
    }

    results.push({
      id: entry.id,
      name: entry.name,
      regime: entry.regime,
      dateUTC: entry.dateUTC,
      filename: entry.filename,
      fileSize: fileBytes.length,
      actualHash,
      expectedHash,
      hashMatch,
      hasTargetSaturn,
      hasCenterEarth,
      hasQuantity31,
      hasApparent,
      obsEcLon,
      obsEcLat,
      manifestRefLon: entry.refTropLon,
      prodLon,
      deltaArcmin,
      withinTolerance,
      isAllValid
    });

    console.log(`  [${entry.id}] ${entry.dateUTC} | Ref: ${obsEcLon.toFixed(4)}° | Calc: ${prodLon.toFixed(4)}° | Err: ${deltaArcmin >= 0 ? '+' : ''}${deltaArcmin.toFixed(2)}' | Hash: ${hashMatch ? 'OK' : 'MISMATCH'} | Parms: ${hasTargetSaturn && hasCenterEarth && hasQuantity31 ? 'OK' : 'ERR'}`);
  }

  suiteResults.push({ name: suite.name, results });
}

console.log(`\nGate 4 Result: ${passedPayloads} / ${totalPayloads} payloads fully verified.`);

// ---------------------------------------------------------
// GATE 5: REASSESS ACCURACY CLAIMS
// ---------------------------------------------------------
console.log('\n========================================================================================');
console.log('--- GATE 5: STATISTICAL ACCURACY REASSESSMENT ---');

// 1. Canonical suite (9 cases)
const canonicalFixture = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));
const canonicalResults = [];

for (const c of canonicalFixture) {
  const kundali = generateKundali(c.date, c.time, c.lat, c.lon, c.tz, 'LAHIRI');
  const jd = kundali.julianDay;
  const ayanamsa = parseFloat(kundali.birthDetails.ayanamsaValue);

  const refTrop = c.planets.Saturn.lonTrop;
  const refSid = norm360(refTrop - ayanamsa);
  const avSaturn = kundali.planets.find(p => p.name === 'Saturn');
  const avSid = avSaturn.longitude;

  const delta = signedDiff(avSid, refSid);
  const errArcmin = delta * 60;
  const tol = 1.0; // arcminute

  canonicalResults.push({
    id: c.id,
    name: c.name,
    dateUTC: c.utcInstant,
    refTrop,
    refSid,
    ayanamsa,
    avSid,
    errArcmin,
    tol,
    pass: Math.abs(errArcmin) <= tol
  });

  console.log(`  [${c.id}] ${c.utcInstant} | RefSid: ${refSid.toFixed(4)}° | CalcSid: ${avSid.toFixed(4)}° | Err: ${errArcmin >= 0 ? '+' : ''}${errArcmin.toFixed(2)}' | Pass: ${Math.abs(errArcmin) <= tol ? 'YES' : 'NO'}`);
}

function calcStats(items, errKey) {
  const n = items.length;
  const errors = items.map(x => x[errKey]);
  const absErrors = errors.map(Math.abs);
  const maxErr = Math.max(...absErrors);
  const mae = absErrors.reduce((a, b) => a + b, 0) / n;
  const mse = errors.reduce((a, b) => a + b, 0) / n; // mean signed error
  const variance = errors.reduce((sum, e) => sum + Math.pow(e - mse, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const passCount = items.filter(x => Math.abs(x[errKey]) <= (x.tol || 1.0)).length;

  return { n, maxErr, mae, mse, stdDev, passCount, passRate: (passCount / n) * 100 };
}

const canonStats = calcStats(canonicalResults, 'errArcmin');
const val10Stats = calcStats(suiteResults[0].results, 'deltaArcmin');
const val12Stats = calcStats(suiteResults[1].results, 'deltaArcmin');

const all31Cases = [
  ...canonicalResults.map(c => ({ id: c.id, dateUTC: c.dateUTC, err: c.errArcmin, tol: c.tol, regime: 'Canonical' })),
  ...suiteResults[0].results.map(r => ({ id: r.id, dateUTC: r.dateUTC, err: r.deltaArcmin, tol: 1.0, regime: r.regime })),
  ...suiteResults[1].results.map(r => ({ id: r.id, dateUTC: r.dateUTC, err: r.deltaArcmin, tol: 1.0, regime: r.regime }))
];

const total31Stats = calcStats(all31Cases, 'err');

console.log('\n--- ACCURACY METRICS TABLE ---');
console.log(`Canonical (9 cases):     Max = ${canonStats.maxErr.toFixed(4)}', MAE = ${canonStats.mae.toFixed(4)}', MSE = ${canonStats.mse.toFixed(4)}', StdDev = ${canonStats.stdDev.toFixed(4)}', Pass = ${canonStats.passCount}/${canonStats.n} (${canonStats.passRate.toFixed(1)}%)`);
console.log(`Validation 10 (4F.5):    Max = ${val10Stats.maxErr.toFixed(4)}', MAE = ${val10Stats.mae.toFixed(4)}', MSE = ${val10Stats.mse.toFixed(4)}', StdDev = ${val10Stats.stdDev.toFixed(4)}', Pass = ${val10Stats.passCount}/${val10Stats.n} (${val10Stats.passRate.toFixed(1)}%)`);
console.log(`Expanded 12 (4F.5A):     Max = ${val12Stats.maxErr.toFixed(4)}', MAE = ${val12Stats.mae.toFixed(4)}', MSE = ${val12Stats.mse.toFixed(4)}', StdDev = ${val12Stats.stdDev.toFixed(4)}', Pass = ${val12Stats.passCount}/${val12Stats.n} (${val12Stats.passRate.toFixed(1)}%)`);
console.log(`----------------------------------------------------------------------------------------`);
console.log(`ALL 31 COMBINED CASES:   Max = ${total31Stats.maxErr.toFixed(4)}', MAE = ${total31Stats.mae.toFixed(4)}', MSE = ${total31Stats.mse.toFixed(4)}', StdDev = ${total31Stats.stdDev.toFixed(4)}', Pass = ${total31Stats.passCount}/${total31Stats.n} (${total31Stats.passRate.toFixed(1)}%)`);

// Save audit artifacts for Gate 4 and Gate 5
fs.writeFileSync('scratch/phase4f5b/gate4_gate5_results.json', JSON.stringify({
  gate4: {
    totalPayloads,
    passedPayloads,
    failedPayloads,
    suites: suiteResults
  },
  gate5: {
    canonicalResults,
    canonStats,
    val10Stats,
    val12Stats,
    total31Stats,
    all31Cases
  }
}, null, 2));

console.log('\nSaved results to scratch/phase4f5b/gate4_gate5_results.json.');
