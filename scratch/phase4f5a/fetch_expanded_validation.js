import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as e from '../../src/engines/astrology/ephemeris.js';

const outDir = 'scratch/phase4f5a/raw_expanded_horizons';
fs.mkdirSync(outDir, { recursive: true });

const cases = [
  { id: 'HIST-EXP-01', name: '19th Century Deep Historical', regime: 'Historical', dateUTC: '1850-01-01 00:00' },
  { id: 'HIST-EXP-02', name: 'Turn of 20th Century (1900)', regime: 'Historical', dateUTC: '1900-01-01 00:00' },
  { id: 'HIST-EXP-03', name: 'Mid 20th Century (1960)', regime: 'Historical', dateUTC: '1960-06-01 00:00' },
  { id: 'HIST-EXP-04', name: 'Halley Era (1985)', regime: 'Historical', dateUTC: '1985-11-20 00:00' },
  { id: 'FUT-EXP-01', name: 'Mid 2030s Cycle (2035)', regime: 'Future', dateUTC: '2035-08-15 00:00' },
  { id: 'FUT-EXP-02', name: 'Late 2060s Cycle (2065)', regime: 'Future', dateUTC: '2065-03-30 00:00' },
  { id: 'FUT-EXP-03', name: '22nd Century Boundary (2100)', regime: 'Future', dateUTC: '2100-01-01 00:00' },
  { id: 'STAT-EXP-01', name: 'Saturn Stationary Retrograde 2024', regime: 'Stationary Retrograde', dateUTC: '2024-06-29 19:00' },
  { id: 'STAT-EXP-02', name: 'Saturn Stationary Direct 2024', regime: 'Stationary Direct', dateUTC: '2024-11-15 14:00' },
  { id: 'OPP-EXP-01', name: 'Saturn Opposition with Sun 2024', regime: 'Opposition', dateUTC: '2024-09-08 04:30' },
  { id: 'CONJ-EXP-01', name: 'Saturn Solar Conjunction 2024', regime: 'Conjunction', dateUTC: '2024-02-28 21:00' },
  { id: 'BOUND-EXP-01', name: 'Saturn Taurus-Gemini 60° Ingress', regime: 'Sign Boundary', dateUTC: '2028-04-13 18:00' }
];

console.log(`Querying NASA JPL Horizons for ${cases.length} expanded validation cases...`);

const manifest = [];

for (const c of cases) {
  const [datePart, timePart] = c.dateUTC.split(' ');
  const [yr, mo, dy] = datePart.split('-').map(Number);
  const [hr, mn] = timePart.split(':').map(Number);

  // Stop time is +1 minute
  let stopHr = hr;
  let stopMn = mn + 1;
  let stopDy = dy;
  if (stopMn >= 60) { stopMn -= 60; stopHr++; }
  if (stopHr >= 24) { stopHr -= 24; stopDy++; }
  const stopDateUTC = `${yr}-${String(mo).padStart(2,'0')}-${String(stopDy).padStart(2,'0')} ${String(stopHr).padStart(2,'0')}:${String(stopMn).padStart(2,'0')}`;

  const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='699'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${encodeURIComponent(c.dateUTC)}'&STOP_TIME='${encodeURIComponent(stopDateUTC)}'&STEP_SIZE='1m'&QUANTITIES='31'`;

  console.log(`Fetching ${c.id} (${c.dateUTC})...`);
  let resText = '';
  try {
    const resp = await fetch(url);
    resText = await resp.text();
  } catch (err) {
    console.error(`Failed to fetch ${c.id}:`, err.message);
    continue;
  }

  const rawJson = JSON.parse(resText);
  const payloadToSave = {
    request: {
      target: 'Saturn (699)',
      center: 'Geocentric (500@399)',
      startTime: c.dateUTC,
      stopTime: stopDateUTC,
      stepSize: '1m',
      quantities: '31 (ObsEcLon, ObsEcLat)',
      referenceFrame: 'ICRF / Ecliptic of Date',
      apparentCorrection: 'Light-time + Stellar Aberration'
    },
    url,
    response: rawJson
  };

  const filename = `${c.id}_Saturn_expanded_raw.json`;
  const filePath = path.join(outDir, filename);
  const fileContent = JSON.stringify(payloadToSave, null, 2);
  fs.writeFileSync(filePath, fileContent, 'utf8');

  const sha256 = crypto.createHash('sha256').update(Buffer.from(fileContent, 'utf8')).digest('hex');

  // Parse ObsEcLon from result
  const resultText = rawJson.result || '';
  const soeIdx = resultText.indexOf('$$SOE');
  const eoeIdx = resultText.indexOf('$$EOE');
  if (soeIdx === -1 || eoeIdx === -1) {
    console.error(`  Warning: Could not parse $$SOE for ${c.id}`);
    continue;
  }
  const dataBlock = resultText.slice(soeIdx + 5, eoeIdx).trim();
  const line1 = dataBlock.split('\n')[0].trim();
  const tokens = line1.split(/\s+/);
  const refTropLon = parseFloat(tokens[2]);
  const refTropLat = parseFloat(tokens[3]);

  manifest.push({
    id: c.id,
    name: c.name,
    regime: c.regime,
    dateUTC: c.dateUTC,
    refTropLon,
    refTropLat,
    filename,
    sha256
  });

  console.log(`  -> Ref Lon: ${refTropLon.toFixed(4)}°, Lat: ${refTropLat.toFixed(4)}° | Saved ${filename} (SHA: ${sha256.slice(0, 8)}...)`);
  await new Promise(r => setTimeout(r, 200)); // Respectful rate limiting
}

const manifestPath = 'scratch/phase4f5a/expanded_validation_manifest.json';
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Saved expanded manifest to ${manifestPath} (${manifest.length} cases).`);
