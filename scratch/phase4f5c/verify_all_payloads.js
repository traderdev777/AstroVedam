import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as e from '../../src/engines/astrology/ephemeris.js';

console.log('=== GATE 6: CRYPTOGRAPHIC & PARAMETER AUDIT OF 22 RAW HORIZONS PAYLOADS ===');

const suites = [
  {
    name: 'Phase 4F.5 Validation Suite (10 cases)',
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

const payloadAuditResults = [];

for (const suite of suites) {
  console.log(`\nAuditing Suite: ${suite.name}`);
  const manifest = JSON.parse(fs.readFileSync(suite.manifestPath, 'utf8'));

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
    let deltaDeg = (prodLon - obsEcLon + 540) % 360 - 180;
    const deltaArcmin = deltaDeg * 60;
    const withinTolerance = Math.abs(deltaArcmin) <= 1.0;

    const isAllValid = hashMatch && hasTargetSaturn && hasCenterEarth && hasQuantity31 && (payloadLonDiff < 1e-4) && withinTolerance;

    if (isAllValid) passedPayloads++;
    else failedPayloads++;

    payloadAuditResults.push({
      id: entry.id,
      name: entry.name,
      filename: entry.filename,
      dateUTC: entry.dateUTC,
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
}

console.log(`\nPayload Audit Result: ${passedPayloads} / ${totalPayloads} verified.`);
fs.writeFileSync('scratch/phase4f5c/payload_audit_results.json', JSON.stringify(payloadAuditResults, null, 2));
