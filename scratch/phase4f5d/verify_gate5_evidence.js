import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as e from '../../src/engines/astrology/ephemeris.js';

console.log("=== GATE 5: INDEPENDENT EVIDENCE VERIFICATION OF 22 RAW HORIZONS PAYLOADS ===");

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
let verifiedPayloads = 0;
const results = [];

for (const suite of suites) {
  console.log(`\nInspecting ${suite.name}...`);
  if (!fs.existsSync(suite.manifestPath)) {
    console.error(`MISSING MANIFEST: ${suite.manifestPath}`);
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(suite.manifestPath, 'utf8'));

  for (const entry of manifest) {
    totalPayloads++;
    const filePath = path.join(suite.rawDir, entry.filename);
    if (!fs.existsSync(filePath)) {
      console.error(`MISSING PAYLOAD: ${filePath}`);
      continue;
    }

    const bytes = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    const hashOk = (hash === entry.sha256);

    const json = JSON.parse(bytes.toString('utf8'));
    const resultText = (json.response && json.response.result) || json.result || '';

    // Verify query parameters
    const targetOk = resultText.includes('Target body name: Saturn (699)');
    const centerOk = resultText.includes('Center-site name: GEOCENTRIC') || resultText.includes('Center body name: Earth (399)');
    const q31Ok = resultText.includes('ObsEcLon    ObsEcLat');
    const apparentOk = resultText.includes('apparent position, with light-time');

    // Extract SOE .. EOE
    const soe = resultText.indexOf('$$SOE');
    const eoe = resultText.indexOf('$$EOE');
    let refLon = null;
    let refLat = null;
    let rawDate = '';

    if (soe !== -1 && eoe !== -1) {
      const block = resultText.slice(soe + 5, eoe).trim();
      const line = block.split('\n')[0].trim();
      const parts = line.split(/\s+/);
      rawDate = parts[0] + ' ' + parts[1];
      refLon = parseFloat(parts[2]);
      refLat = parseFloat(parts[3]);
    }

    const manifestDiff = Math.abs(refLon - entry.refTropLon);

    // Compute production ephemeris
    const [dPart, tPart] = entry.dateUTC.split(' ');
    const [yr, mo, dy] = dPart.split('-').map(Number);
    const [hr, mn] = tPart.split(':').map(Number);
    const jd = e.dateToJD(yr, mo, dy, hr, mn, 0);

    const prodLon = e.saturnLongitude(jd);
    const resDeg = (prodLon - refLon + 540) % 360 - 180;
    const resArcmin = resDeg * 60;
    const passTol = Math.abs(resArcmin) <= 1.0;

    const allOk = hashOk && targetOk && centerOk && q31Ok && (manifestDiff < 1e-4) && passTol;
    if (allOk) verifiedPayloads++;

    results.push({
      id: entry.id,
      name: entry.name,
      file: entry.filename,
      dateUTC: entry.dateUTC,
      fileSize: bytes.length,
      hash,
      expectedHash: entry.sha256,
      hashOk,
      targetOk,
      centerOk,
      q31Ok,
      apparentOk,
      refLon,
      refLat,
      prodLon,
      resArcmin,
      passTol,
      allOk
    });

    console.log(`[${entry.id}] ${entry.filename} | SHA-256: ${hashOk ? 'MATCH' : 'MISMATCH'} | Target: ${targetOk ? '699' : 'ERR'} | Center: ${centerOk ? '399' : 'ERR'} | Q31: ${q31Ok ? 'YES' : 'ERR'} | Residual: ${resArcmin >= 0 ? '+' : ''}${resArcmin.toFixed(2)}'`);
  }
}

console.log(`\nTotal verified: ${verifiedPayloads} / ${totalPayloads}`);
fs.writeFileSync('scratch/phase4f5d/gate5_payload_audit.json', JSON.stringify(results, null, 2));
