import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const rawDir = 'scratch/phase4f4/raw_horizons_responses';
fs.mkdirSync(rawDir, { recursive: true });

// 10 Independent validation test cases covering historical, future, phase, perigee, and boundary regimes
const testCases = [
  { id: 'HIST-01', name: 'Early 20th Century (1920)', date: '1920-05-15 00:00', regime: 'Historical' },
  { id: 'HIST-02', name: 'Mid 20th Century (1950)', date: '1950-01-01 00:00', regime: 'Historical' },
  { id: 'HIST-03', name: 'Late 20th Century (1975)', date: '1975-07-01 00:00', regime: 'Historical' },
  { id: 'HIST-04', name: 'Mid 21st Century (2050)', date: '2050-01-01 00:00', regime: 'Future' },
  { id: 'HIST-05', name: 'Late 21st Century (2080)', date: '2080-10-15 00:00', regime: 'Future' },
  { id: 'PHASE-01', name: 'Full Moon near REF-02 Epoch', date: '2000-04-18 17:41', regime: 'Phase / Near REF-02' },
  { id: 'PHASE-02', name: 'Total Solar Eclipse / New Moon', date: '2024-04-08 18:21', regime: 'Solar Eclipse / New Moon' },
  { id: 'PERIGEE-01', name: 'Extreme Perigee Supermoon', date: '2016-11-14 11:23', regime: 'Extreme Velocity Perigee' },
  { id: 'BOUND-01', name: 'Moon 0°/360° Pisces-Aries Wrap', date: '2023-03-21 16:15', regime: '0/360 Wrap' },
  { id: 'BOUND-02', name: 'Scorpio-Sagittarius Sign Boundary', date: '2024-08-15 06:00', regime: 'Sign Boundary' }
];

console.log(`Fetching ${testCases.length} independent Moon reference cases from JPL Horizons...`);

const manifest = [];

for (const tc of testCases) {
  const [datePart, timePart] = tc.date.split(' ');
  const [yr, mo, dy] = datePart.split('-').map(Number);
  const [hr, mn] = timePart.split(':').map(Number);

  const start = new Date(Date.UTC(yr, mo - 1, dy, hr, mn));
  const stop = new Date(Date.UTC(yr, mo - 1, dy, hr, mn + 1));

  const startTimeStr = `${datePart} ${timePart}`;
  const stopTimeStr = `${stop.getUTCFullYear()}-${String(stop.getUTCMonth()+1).padStart(2,'0')}-${String(stop.getUTCDate()).padStart(2,'0')} ${String(stop.getUTCHours()).padStart(2,'0')}:${String(stop.getUTCMinutes()).padStart(2,'0')}`;

  const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='301'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${encodeURIComponent(startTimeStr)}'&STOP_TIME='${encodeURIComponent(stopTimeStr)}'&STEP_SIZE='1m'&QUANTITIES='31'`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    const rawContent = JSON.stringify({
      request: {
        target: 'Moon (301)',
        center: 'Geocentric (500@399)',
        startTime: startTimeStr,
        stopTime: stopTimeStr,
        stepSize: '1m',
        quantities: '31 (ObsEclLon, ObsEclLat)',
        referenceFrame: 'ICRF / Ecliptic of Date',
        apparentCorrection: 'Light-time + Stellar Aberration'
      },
      url,
      response: json
    }, null, 2);

    const filename = `${tc.id}_Moon_horizons_raw.json`;
    const filePath = path.join(rawDir, filename);
    fs.writeFileSync(filePath, rawContent);

    const sha256 = crypto.createHash('sha256').update(rawContent).digest('hex');

    // Parse coordinates
    const resultText = json.result || '';
    const sIdx = resultText.indexOf('$$SOE');
    const eIdx = resultText.indexOf('$$EOE');
    let refTropLon = null;
    let refTropLat = null;

    if (sIdx !== -1 && eIdx !== -1) {
      const line = resultText.slice(sIdx, eIdx).split('\n').find(l => l.trim().length > 0 && !l.includes('$$'));
      if (line) {
        const parts = line.trim().split(/\s+/);
        // Format: [Date, Time, ObsEclLon, ObsEclLat]
        refTropLon = parseFloat(parts[2]);
        refTropLat = parseFloat(parts[3]);
      }
    }

    manifest.push({
      id: tc.id,
      name: tc.name,
      regime: tc.regime,
      dateUTC: tc.date,
      refTropLon,
      refTropLat,
      filename,
      sha256
    });

    console.log(`✅ [${tc.id}] ${tc.name.padEnd(36)}: Lon = ${refTropLon !== null ? refTropLon.toFixed(4) : 'ERR'}° | SHA256 = ${sha256.slice(0, 16)}...`);
  } catch (err) {
    console.error(`❌ Error fetching ${tc.id}:`, err.message);
  }
}

fs.writeFileSync('scratch/phase4f4/validation_manifest.json', JSON.stringify(manifest, null, 2));
console.log(`\nArchived ${manifest.length} reference cases to scratch/phase4f4/validation_manifest.json`);
