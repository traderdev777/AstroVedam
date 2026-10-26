import fs from 'fs';
import path from 'path';

const rawDir = '/Users/supreeththakur/.gemini/antigravity-ide/brain/ffa2cbd2-cb86-41a3-9f63-8f9bd64b27a9/scratch/phase4f1/raw_horizons_responses';
fs.mkdirSync(rawDir, { recursive: true });

const ephemerisPath = '/Users/supreeththakur/.gemini/antigravity-ide/brain/841fc7ef-3339-408c-81d2-565fe6d2f4d4/browser/astroveda/src/engines/astrology/ephemeris.js';
const {
  saturnLongitude,
  jupiterLongitude,
  getAyanamsa,
  dateToJD,
  getRashi
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

const testDates = [
  { id: 'HIST-01', name: 'Early 20th Century', date: '1920-05-15', time: '00:00:00', yr: 1920, mo: 5, dy: 15 },
  { id: 'HIST-02', name: 'Mid 20th Century', date: '1950-01-01', time: '00:00:00', yr: 1950, mo: 1, dy: 1 },
  { id: 'HIST-03', name: 'Late 20th Century', date: '1975-07-01', time: '00:00:00', yr: 1975, mo: 7, dy: 1 },
  { id: 'HIST-04', name: 'Mid 21st Century', date: '2050-01-01', time: '00:00:00', yr: 2050, mo: 1, dy: 1 },
  { id: 'HIST-05', name: 'Late 21st Century', date: '2080-10-15', time: '00:00:00', yr: 2080, mo: 10, dy: 15 }
];

const planets = [
  { name: 'Jupiter', code: '599', fn: jupiterLongitude },
  { name: 'Saturn', code: '699', fn: saturnLongitude }
];

const results = [];

for (const td of testDates) {
  const jd = dateToJD(td.yr, td.mo, td.dy, 0, 0, 0);
  const ayanamsa = getAyanamsa(jd);

  const [yr, mo, dy] = td.date.split('-').map(Number);
  const dtNext = new Date(Date.UTC(yr, mo - 1, dy, 1, 0));
  const startTime = `${td.date} 00:00`;
  const stopTime = `${dtNext.getUTCFullYear()}-${String(dtNext.getUTCMonth()+1).padStart(2,'0')}-${String(dtNext.getUTCDate()).padStart(2,'0')} 01:00`;

  const dateEntry = {
    id: td.id,
    name: td.name,
    date: td.date,
    time: td.time,
    jd,
    ayanamsa,
    planets: {}
  };

  for (const p of planets) {
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='${p.code}'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${encodeURIComponent(startTime)}'&STOP_TIME='${encodeURIComponent(stopTime)}'&STEP_SIZE='1d'&QUANTITIES='31'`;

    let rawText = '';
    let parsedRefTrop = null;

    try {
      const res = await fetch(url);
      const json = await res.json();
      rawText = json.result;

      // Save raw response
      const rawFile = path.join(rawDir, `${td.id}_${p.name}_horizons_raw.json`);
      fs.writeFileSync(rawFile, JSON.stringify({ queryUrl: url, response: json }, null, 2));

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
      console.error(`Error querying JPL Horizons for ${p.name} on ${td.date}:`, err.message);
    }

    if (parsedRefTrop === null || isNaN(parsedRefTrop)) {
      console.error(`Failed to parse Horizons for ${p.name} on ${td.date}`);
      continue;
    }

    const refSid = norm360(parsedRefTrop - ayanamsa);
    const avTrop = p.fn(jd);
    const avSid = norm360(avTrop - ayanamsa);
    const deltaDeg = signedDiff(avSid, refSid);
    const deltaArc = deltaDeg * 60;

    dateEntry.planets[p.name] = {
      refTrop: parsedRefTrop,
      refSid,
      avTrop,
      avSid,
      deltaDeg,
      deltaArc,
      refRashi: getRashi(refSid),
      avRashi: getRashi(avSid)
    };

    console.log(`[${td.id} ${td.date}] ${p.name.padEnd(8)}: Ref=${parsedRefTrop.toFixed(4)}°, AV=${avTrop.toFixed(4)}°, Err=${(deltaArc >= 0 ? '+' : '')}${deltaArc.toFixed(2)}'`);
  }

  results.push(dateEntry);
}

const outPath = '/Users/supreeththakur/.gemini/antigravity-ide/brain/ffa2cbd2-cb86-41a3-9f63-8f9bd64b27a9/scratch/phase4f1/historical_validation_results.json';
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`\nHistorical validation complete! Output written to ${outPath}`);
