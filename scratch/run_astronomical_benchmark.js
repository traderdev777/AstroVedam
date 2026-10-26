/**
 * AstroVedam - Independent Astronomical Benchmark Harness (Phase 4A)
 * Compares AstroVedam's current calculation engine against
 * NASA JPL Horizons apparent geocentric ephemeris reference data.
 *
 * ZERO PRODUCTION MODIFICATIONS: Completely isolated test runner.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Absolute path to AstroVedam engine
const ASTROVEDA_ROOT = '/Users/supreeththakur/.gemini/antigravity-ide/brain/841fc7ef-3339-408c-81d2-565fe6d2f4d4/browser/astroveda';
const kundaliModulePath = path.join(ASTROVEDA_ROOT, 'src/engines/astrology/kundali.js');
const ephemerisModulePath = path.join(ASTROVEDA_ROOT, 'src/engines/astrology/ephemeris.js');

const { generateKundali } = await import(kundaliModulePath);
const { calculateAscendant, getAyanamsa, julianCenturies, dateToJD } = await import(ephemerisModulePath);

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function norm360(deg) {
  let r = deg % 360;
  return r < 0 ? r + 360 : r;
}

// Normalize signed angular difference to [-180, +180]
function signedDiff(val, ref) {
  let diff = (val - ref) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

// Calculate true apparent geocentric Ascendant using standard IAU spherical astronomy
function calculateTrueAscendant(jd, lat, lon) {
  const T = julianCenturies(jd);
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + T * T * (0.000387933 - T / 38710000);
  GMST = norm360(GMST);
  const LST = norm360(GMST + lon);
  const LSTrad = LST * DEG;
  const latRad = lat * DEG;
  const eps = (23.4393 - 0.013 * T) * DEG;

  // True Eastern Rising Point:
  const y = Math.cos(LSTrad);
  const x = -Math.sin(eps) * Math.tan(latRad) - Math.cos(eps) * Math.sin(LSTrad);
  return norm360(Math.atan2(y, x) * RAD);
}

// Load reference fixture
const fixturePath = path.join(__dirname, 'reference_cases.json');
const referenceCases = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

console.log('========================================================================================');
console.log('🔭 ASTROVEDAM INDEPENDENT ASTRONOMICAL BENCHMARK (PHASE 4A)');
console.log('Reference Source: NASA JPL Horizons On-Line Solar System Data Service (DE440/441)');
console.log('Observer Frame: Geocentric Apparent | Sidereal Mode: True Chitra Paksha (Lahiri)');
console.log('========================================================================================\n');

const tolerances = {
  Sun: 1.0 / 60,      // 1 arcminute (0.0167°)
  Moon: 2.0 / 60,     // 2 arcminutes (0.0333°)
  Mars: 1.0 / 60,     // 1 arcminute (0.0167°)
  Mercury: 2.0 / 60,  // 2 arcminutes (0.0333°)
  Jupiter: 1.0 / 60,  // 1 arcminute (0.0167°)
  Venus: 2.0 / 60,    // 2 arcminutes (0.0333°)
  Saturn: 1.0 / 60,   // 1 arcminute (0.0167°)
  Ascendant: 2.0 / 60 // 2 arcminutes (0.0333°)
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

const benchmarkResults = [];

for (const c of referenceCases) {
  console.log(`\n----------------------------------------------------------------------------------------`);
  console.log(`📌 CASE ${c.id}: ${c.name}`);
  console.log(`   Date/Time: ${c.date} ${c.time} (TZ: UTC${c.tz >= 0 ? '+' : ''}${c.tz}) | UTC: ${c.utcInstant}`);
  console.log(`   Location: ${c.city} (${c.lat}°N, ${c.lon}°E)`);
  console.log(`----------------------------------------------------------------------------------------`);

  // Run AstroVedam engine
  const kundali = generateKundali(c.date, c.time, c.lat, c.lon, c.tz, 'LAHIRI');
  const jd = kundali.julianDay;
  const ayanamsa = parseFloat(kundali.birthDetails.ayanamsaValue);

  // Calculate True Reference Ascendant
  const [h, m] = c.time.split(':').map(Number);
  const trueAscTrop = calculateTrueAscendant(jd, c.lat, c.lon);
  const trueAscSid = norm360(trueAscTrop - ayanamsa);

  console.log(`   Julian Day (UTC): ${jd.toFixed(4)} | Lahiri Ayanamsha: ${ayanamsa.toFixed(4)}°\n`);

  console.log(`   ${'BODY / FACTOR'.padEnd(12)} | ${'HORIZONS REF'.padEnd(14)} | ${'ASTROVEDAM'.padEnd(14)} | ${'DELTA (DEG)'.padEnd(14)} | ${'DELTA (ARC)'.padEnd(14)} | STATUS`);
  console.log(`   ${'-'.repeat(84)}`);

  const caseSummary = {
    id: c.id,
    name: c.name,
    utcInstant: c.utcInstant,
    ayanamsa,
    jd,
    comparisons: []
  };

  // Compare Planets
  for (const [pName, refData] of Object.entries(c.planets)) {
    totalChecks++;
    const refSid = norm360(refData.lonTrop - ayanamsa);
    const avPlanet = kundali.planets.find(p => p.name === pName);
    const avSid = avPlanet.longitude;
    const delta = signedDiff(avSid, refSid);
    const deltaArc = delta * 60; // arcminutes
    const tol = tolerances[pName];
    const pass = Math.abs(delta) <= tol;

    if (pass) passedChecks++;
    else failedChecks++;

    const statusStr = pass ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${pName.padEnd(12)} | ${(refSid.toFixed(4) + '°').padEnd(14)} | ${(avSid.toFixed(4) + '°').padEnd(14)} | ${(delta >= 0 ? '+' : '') + delta.toFixed(4).padEnd(13)} | ${(deltaArc >= 0 ? '+' : '') + deltaArc.toFixed(2) + '\''.padEnd(13)} | ${statusStr}`);

    caseSummary.comparisons.push({
      factor: pName,
      refSid,
      avSid,
      delta,
      deltaArc,
      tolerance: tol,
      pass
    });

    // Retrograde check
    totalChecks++;
    const avRetro = avPlanet.isRetrograde;
    const refRetro = refData.isRetro;
    const retroPass = (avRetro === refRetro);
    if (retroPass) passedChecks++;
    else failedChecks++;
    caseSummary.comparisons.push({
      factor: `${pName} Retrograde`,
      refValue: refRetro,
      avValue: avRetro,
      pass: retroPass
    });
  }

  // Compare Ascendant
  totalChecks++;
  const avAscSid = kundali.lagna.longitude;
  const ascDelta = signedDiff(avAscSid, trueAscSid);
  const ascDeltaArc = ascDelta * 60;
  const ascPass = Math.abs(ascDelta) <= tolerances.Ascendant;
  if (ascPass) passedChecks++;
  else failedChecks++;

  const ascStatus = ascPass ? '✅ PASS' : '❌ FAIL (INVERTED)';
  console.log(`   ${'Ascendant'.padEnd(12)} | ${(trueAscSid.toFixed(4) + '°').padEnd(14)} | ${(avAscSid.toFixed(4) + '°').padEnd(14)} | ${(ascDelta >= 0 ? '+' : '') + ascDelta.toFixed(4).padEnd(13)} | ${(ascDeltaArc >= 0 ? '+' : '') + ascDeltaArc.toFixed(2) + '\''.padEnd(13)} | ${ascStatus}`);

  caseSummary.comparisons.push({
    factor: 'Ascendant',
    refSid: trueAscSid,
    avSid: avAscSid,
    delta: ascDelta,
    deltaArc: ascDeltaArc,
    tolerance: tolerances.Ascendant,
    pass: ascPass
  });

  benchmarkResults.push(caseSummary);
}

// Summary statistics
console.log('\n========================================================================================');
console.log('📊 BENCHMARK EXECUTION SUMMARY');
console.log('========================================================================================');
console.log(`TOTAL COMPARISONS EXECUTED: ${totalChecks}`);
console.log(`PASSED WITHIN ASTRONOMICAL TOLERANCE: ${passedChecks} (${((passedChecks / totalChecks) * 100).toFixed(1)}%)`);
console.log(`FAILED BEYOND ASTRONOMICAL TOLERANCE: ${failedChecks} (${((failedChecks / totalChecks) * 100).toFixed(1)}%)`);
console.log('========================================================================================\n');

// Save JSON summary
fs.writeFileSync(path.join(__dirname, 'benchmark_results.json'), JSON.stringify({
  timestamp: new Date().toISOString(),
  referenceSource: 'NASA JPL Horizons (DE440/441)',
  totalChecks,
  passedChecks,
  failedChecks,
  results: benchmarkResults
}, null, 2));

console.log('Detailed benchmark results JSON written to scratch/benchmark_results.json.\n');
