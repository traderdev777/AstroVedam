import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as e from '../../src/engines/astrology/ephemeris.js';

console.log('=== GATE 4: INDEPENDENT AUDIT OF RAW HORIZONS PAYLOADS ===');

const manifestPath = 'scratch/phase4f5/validation_manifest.json';
const rawDir = 'scratch/phase4f5/raw_horizons_responses';

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest not found at ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log(`Found ${manifest.length} manifest entries.`);

let verifiedCount = 0;
let failedCount = 0;

for (const entry of manifest) {
  console.log(`\n-----------------------------------------------------------`);
  console.log(`Audit Case: ${entry.id} - ${entry.name} (${entry.regime})`);
  const filePath = path.join(rawDir, entry.filename);

  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ RAW FILE MISSING: ${filePath}`);
    failedCount++;
    continue;
  }

  // 1. Compute actual SHA-256 hash
  const fileBytes = fs.readFileSync(filePath);
  const actualHash = crypto.createHash('sha256').update(fileBytes).digest('hex');
  const expectedHash = entry.sha256;

  console.log(`  File: ${entry.filename} (${fileBytes.length} bytes)`);
  console.log(`  Actual SHA-256:   ${actualHash}`);
  console.log(`  Expected SHA-256: ${expectedHash}`);

  if (actualHash !== expectedHash) {
    console.error(`  ❌ CHECKSUM MISMATCH!`);
    failedCount++;
    continue;
  } else {
    console.log(`  ✅ SHA-256 CHECKSUM MATCHED!`);
  }

  // 2. Parse raw payload
  const rawJson = JSON.parse(fileBytes.toString('utf8'));
  const resultText = (rawJson.response && rawJson.response.result) || rawJson.result || '';

  // 3. Verify request parameters from payload header
  const hasTargetSaturn = resultText.includes('Target body name: Saturn (699)');
  const hasCenterEarth = resultText.includes('Center body name: Earth (399)') || resultText.includes('Center-site name: GEOCENTRIC');
  const hasQuantity31 = resultText.includes('ObsEcLon    ObsEcLat');
  const hasApparent = resultText.includes('apparent position, with light-time');

  console.log(`  Payload Header Verification:`);
  console.log(`    Target Saturn (699):               ${hasTargetSaturn ? '✅ YES' : '❌ NO'}`);
  console.log(`    Center Geocentric (399):           ${hasCenterEarth ? '✅ YES' : '❌ NO'}`);
  console.log(`    Quantity 31 (ObsEcLon, ObsEcLat):  ${hasQuantity31 ? '✅ YES' : '❌ NO'}`);
  console.log(`    Apparent (Light-time + Aberration): ${hasApparent ? '✅ YES' : '❌ NO'}`);

  if (!hasTargetSaturn || !hasCenterEarth || !hasQuantity31) {
    console.error(`  ❌ Payload header missing essential parameters!`);
    failedCount++;
    continue;
  }

  // 4. Extract data line from $$SOE ... $$EOE
  const soeIdx = resultText.indexOf('$$SOE');
  const eoeIdx = resultText.indexOf('$$EOE');
  if (soeIdx === -1 || eoeIdx === -1) {
    console.error(`  ❌ Could not find $$SOE/$$EOE data markers!`);
    failedCount++;
    continue;
  }

  const dataBlock = resultText.slice(soeIdx + 5, eoeIdx).trim();
  const dataLines = dataBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  console.log(`    Raw Data Line: ${dataLines[0]}`);

  // Columns for QUANTITIES='31':
  // Date__(UT)__HR:MN     ObsEcLon    ObsEcLat
  const tokens = dataLines[0].split(/\s+/);
  const rawDateStr = tokens[0] + ' ' + tokens[1];
  const obsEcLon = parseFloat(tokens[2]);
  const obsEcLat = parseFloat(tokens[3]);

  console.log(`    Parsed Horizons Date (UT): ${rawDateStr}`);
  console.log(`    Parsed ObsEcLon:           ${obsEcLon}°`);
  console.log(`    Parsed ObsEcLat:           ${obsEcLat}°`);
  console.log(`    Manifest refTropLon:       ${entry.refTropLon}°`);

  const manifestLonDiff = Math.abs(obsEcLon - entry.refTropLon);
  if (manifestLonDiff > 1e-4) {
    console.error(`  ❌ Manifest refTropLon mismatch with payload: diff=${manifestLonDiff}`);
    failedCount++;
    continue;
  }

  // 5. Compute production ephemeris output
  const [datePart, timePart] = entry.dateUTC.split(' ');
  const [yr, mo, dy] = datePart.split('-').map(Number);
  const [hr, mn] = timePart.split(':').map(Number);
  const jd = e.dateToJD(yr, mo, dy, hr, mn, 0);

  const prodLon = e.saturnLongitude(jd);
  const deltaDeg = (prodLon - obsEcLon + 540) % 360 - 180;
  const deltaArcmin = deltaDeg * 60;
  const pass = Math.abs(deltaArcmin) <= 1.0;

  console.log(`    Production AstroVedam Lon: ${prodLon.toFixed(4)}°`);
  console.log(`    Signed Delta:              ${deltaArcmin >= 0 ? '+' : ''}${deltaArcmin.toFixed(2)}'`);
  console.log(`    Within 1.0' Tolerance:     ${pass ? '✅ PASS' : '❌ FAIL'}`);

  if (pass) verifiedCount++;
  else failedCount++;
}

console.log(`\n===========================================================`);
console.log(`GATE 4 AUDIT SUMMARY:`);
console.log(`Total Cases Audited: ${manifest.length}`);
console.log(`Verified Checksums & Payload Matching: ${verifiedCount}`);
console.log(`Failed Cases: ${failedCount}`);
console.log(`===========================================================`);
