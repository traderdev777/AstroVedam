import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASTROVEDA_ROOT = path.resolve(__dirname, '../../');

const ephemerisPath = path.join(ASTROVEDA_ROOT, 'src/engines/astrology/ephemeris.js');
const {
  saturnLongitude,
  jupiterLongitude,
  marsLongitude,
  mercuryLongitude,
  venusLongitude,
  sunLongitude,
  moonLongitude,
  getAyanamsa,
  getRashi,
  dateToJD
} = await import(ephemerisPath);

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

const auditCases = [
  { id: 'AUDIT-01', name: 'Benchmark REF-01 Baseline', date: '1999-03-28', time: '05:55:00', jd: 2451265.74652778 },
  { id: 'AUDIT-02', name: 'Benchmark REF-06 Max Saturn Error', date: '2023-06-21', time: '16:00:00', jd: 2460117.16666667 },
  { id: 'AUDIT-03', name: 'Benchmark REF-07 Max Jupiter Error', date: '2022-10-31', time: '00:00:00', jd: 2459883.50000000 },
  { id: 'AUDIT-04', name: 'Saturn Kumbha Ingress Vicinity', date: '2023-01-17', time: '12:00:00', jd: 2459962.00000000 },
  { id: 'AUDIT-05', name: 'Saturn Meena Ingress Vicinity', date: '2025-03-29', time: '12:00:00', jd: 2460764.00000000 },
  { id: 'AUDIT-06', name: 'Current Audit Assessment Date', date: '2026-10-22', time: '12:00:00', jd: 2461336.00000000 }
];

const targets = [
  { name: 'Saturn', code: '699', fn: saturnLongitude },
  { name: 'Jupiter', code: '599', fn: jupiterLongitude }
];

const rawDir = path.join(__dirname, 'raw_horizons_responses');

console.log('========================================================================================');
console.log('📡 INDEPENDENT NASA JPL HORIZONS AUDIT VALIDATION RUN');
console.log('Query: QUANTITIES=31 (Observer Ecliptic Apparent), CENTER=500@399 (Geocentric)');
console.log('========================================================================================\n');

const auditResults = [];

for (const c of auditCases) {
  console.log(`\n----------------------------------------------------------------------------------------`);
  console.log(`Case: ${c.id} - ${c.name} | UTC: ${c.date} ${c.time} (JD ${c.jd.toFixed(4)})`);
  console.log(`----------------------------------------------------------------------------------------`);

  const ayanamsa = getAyanamsa(c.jd);
  const startTime = `${c.date} ${c.time.slice(0, 5)}`;
  // stop time 1 hour later
  const [yr, mo, dy] = c.date.split('-').map(Number);
  const [hr, mn] = c.time.split(':').map(Number);
  const dtNext = new Date(Date.UTC(yr, mo - 1, dy, hr + 1, mn));
  const stopTime = `${dtNext.getUTCFullYear()}-${String(dtNext.getUTCMonth()+1).padStart(2,'0')}-${String(dtNext.getUTCDate()).padStart(2,'0')} ${String(dtNext.getUTCHours()).padStart(2,'0')}:${String(dtNext.getUTCMinutes()).padStart(2,'0')}`;

  const caseEntry = {
    id: c.id,
    name: c.name,
    date: c.date,
    time: c.time,
    jd: c.jd,
    ayanamsa,
    bodies: []
  };

  for (const t of targets) {
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='${t.code}'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${encodeURIComponent(startTime)}'&STOP_TIME='${encodeURIComponent(stopTime)}'&STEP_SIZE='1d'&QUANTITIES='31'`;
    
    let rawText = '';
    let parsedRefTrop = null;
    try {
      const res = await fetch(url);
      const json = await res.json();
      rawText = json.result;
      
      // Save raw response
      const rawFile = path.join(rawDir, `${c.id}_${t.name}_horizons_raw.json`);
      fs.writeFileSync(rawFile, JSON.stringify(json, null, 2));

      const sIdx = rawText.indexOf('$$SOE');
      const eIdx = rawText.indexOf('$$EOE');
      if (sIdx !== -1 && eIdx !== -1) {
        const line = rawText.slice(sIdx, eIdx).split('\n').find(l => l.trim().length > 0 && !l.includes('$$'));
        if (line) {
          const parts = line.trim().split(/\s+/);
          parsedRefTrop = parseFloat(parts[2]);
        }
      }
    } catch (err) {
      console.error(`Error querying JPL Horizons for ${t.name}:`, err.message);
    }

    if (parsedRefTrop === null || isNaN(parsedRefTrop)) {
      console.log(`   ${t.name}: FAILED to retrieve or parse Horizons response.`);
      continue;
    }

    const refSid = norm360(parsedRefTrop - ayanamsa);
    const avTrop = t.fn(c.jd);
    const avSid = norm360(avTrop - ayanamsa);
    const delta = signedDiff(avSid, refSid);
    const deltaArc = delta * 60;

    const refRashi = getRashi(refSid);
    const avRashi = getRashi(avSid);
    const rashiMatch = refRashi === avRashi;

    console.log(`   ${t.name.padEnd(8)} | Ref Trop: ${parsedRefTrop.toFixed(4)}° | Ref Sid: ${refSid.toFixed(4)}° (Rashi ${refRashi}) | AV Sid: ${avSid.toFixed(4)}° (Rashi ${avRashi}) | Delta: ${(delta >= 0 ? '+' : '')}${delta.toFixed(4)}° (${(deltaArc >= 0 ? '+' : '')}${deltaArc.toFixed(2)}') | Rashi Match: ${rashiMatch ? '✅' : '⚠️ MISMATCH'}`);

    caseEntry.bodies.push({
      body: t.name,
      refTrop: parsedRefTrop,
      refSid,
      avTrop,
      avSid,
      deltaDeg: delta,
      deltaArc,
      refRashi,
      avRashi,
      rashiMatch
    });
  }

  auditResults.push(caseEntry);
}

fs.writeFileSync(path.join(__dirname, 'independent_audit_results.json'), JSON.stringify(auditResults, null, 2));
console.log('\nAudit execution complete. Results saved to independent_audit_results.json and raw_horizons_responses/');
