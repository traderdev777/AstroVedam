import fs from 'fs';
import * as ephem from '../../src/engines/astrology/ephemeris.js';
import { generateKundali, generateNavamsaChart } from '../../src/engines/astrology/kundali.js';
import { identifyYogas } from '../../src/engines/astrology/yoga.js';
import { analyzeDoshas } from '../../src/engines/astrology/dosha.js';
import { renderFullPatrikaReport } from '../../src/components/reports/FullPatrikaReport.js';
import { getAstroGuruResponse } from '../../src/engines/astroguru/advisor.js';

console.log('=== GATE 6: DOWNSTREAM REGRESSION & INTEGRATION AUDIT ===');
let pass = 0;
let total = 0;

function assert(cond, msg) {
  total++;
  if (cond) {
    console.log(`  ✅ PASS: ${msg}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
  }
}

// 1. getAllTropicalLongitudes & getSiderealLongitudes
console.log('\n[TEST 1] Planetary Longitude Feeds & Ayanamsha Invariance:');
const testJd = 2460117.1667; // REF-06
const trop = ephem.getAllTropicalLongitudes(testJd);
assert(typeof trop.Saturn === 'number' && Number.isFinite(trop.Saturn), 'getAllTropicalLongitudes contains finite Saturn');
assert(trop.Saturn >= 0 && trop.Saturn < 360, `Saturn tropical longitude normalized: ${trop.Saturn.toFixed(4)}°`);

const sid = ephem.getSiderealLongitudes(testJd);
const ayan = ephem.getAyanamsa(testJd);
const expectedSid = (trop.Saturn - ayan + 360) % 360;
const diffSid = Math.abs(sid.Saturn - expectedSid);
assert(diffSid < 1e-10, `getSiderealLongitudes applies ayanamsha exactly once: diff=${diffSid.toExponential(4)}`);

// 2. Velocity & Retrograde Status
console.log('\n[TEST 2] Velocity, Stationary Detection & Retrograde Invariants:');
const jdRetro = 2460183.8333; // RETRO-01 (Aug 2023)
const vRetro = ephem.getPlanetaryVelocity('Saturn', jdRetro);
const isRetro = ephem.isPlanetRetrograde('Saturn', jdRetro);
assert(isRetro === true, 'RETRO-01 isPlanetRetrograde strictly true');
assert(vRetro < 0, `RETRO-01 velocity negative: ${vRetro.toFixed(4)}°/day`);

const jdDirect = 2451679.9167; // REF-01 (May 2000)
const vDirect = ephem.getPlanetaryVelocity('Saturn', jdDirect);
const isDirect = ephem.isPlanetRetrograde('Saturn', jdDirect);
assert(isDirect === false, 'REF-01 isPlanetRetrograde strictly false');
assert(vDirect > 0, `REF-01 velocity positive: ${vDirect.toFixed(4)}°/day`);

const jdStationary = 2460112.5; // STAT-01 (June 17, 2023)
const isStat = ephem.isPlanetStationary('Saturn', jdStationary);
const vStat = ephem.getPlanetaryVelocity('Saturn', jdStationary);
assert(Math.abs(vStat) < 0.005, `STAT-01 velocity near zero (|v| < 0.005°/day): ${vStat.toFixed(5)}°/day`);
assert(isStat === true, 'STAT-01 isPlanetStationary strictly true');

// 3. Kundali Generation (D1 & D9)
console.log('\n[TEST 3] Kundali Chart Placement & Divisional Integration:');
const k = generateKundali('2023-06-21', '12:00', 40.7128, -74.006, -4, 'LAHIRI');
const pSat = k.planets.find(p => p.name === 'Saturn');
assert(pSat !== undefined, 'Kundali contains Saturn');
assert(pSat.longitude >= 0 && pSat.longitude < 360, `Saturn longitude valid: ${pSat.longitude.toFixed(4)}°`);
assert(pSat.rashi >= 1 && pSat.rashi <= 12, `Saturn rashi in 1..12: ${pSat.rashi} (${pSat.rashiName})`);
assert(pSat.nakshatra >= 1 && pSat.nakshatra <= 27, `Saturn nakshatra in 1..27: ${pSat.nakshatra} (${pSat.nakshatraName})`);
assert(pSat.pada >= 1 && pSat.pada <= 4, `Saturn pada in 1..4: ${pSat.pada}`);
assert(pSat.isRetrograde === true, 'Kundali marks Saturn retrograde correctly at REF-06');

const d9 = generateNavamsaChart(k);
const satD9 = d9.planets.find(p => p.name === 'Saturn');
assert(satD9 !== undefined, 'D9 Navamsha chart contains Saturn');
assert(satD9.rashi >= 1 && satD9.rashi <= 12, `Saturn D9 rashi in 1..12: ${satD9.rashi}`);

// 4. Transit & Sade Sati Evaluation
console.log('\n[TEST 4] Dynamic Transit & Sade Sati Classifications:');
const transitSat = ephem.calculateSaturnTransit(11, '2023-06-21'); // Natal Moon in Aquarius (11), Saturn in Aquarius (11)
assert(transitSat.valid === true, 'calculateSaturnTransit returns valid result');
assert(transitSat.isSadeSati === true, 'Moon in Aquarius produces isSadeSati: true');
assert(transitSat.phaseCode === 'PEAK', `Aquarius transit classified as PEAK: ${transitSat.phaseCode}`);

// Check all 12 relative signs from Saturn
const sRashi = transitSat.transitSaturnRashi;
for (let offset = 0; offset < 12; offset++) {
  const moonRashi = ((sRashi - 1 - offset + 12) % 12) + 1;
  const res = ephem.calculateSaturnTransit(moonRashi, '2023-06-21');
  const dist = res.signDistance;
  if (dist === 1) assert(res.isSadeSati && res.phaseCode === 'PEAK', '1st house -> PEAK Sade Sati');
  else if (dist === 2) assert(res.isSadeSati && res.phaseCode === 'SETTING', '2nd house -> SETTING Sade Sati');
  else if (dist === 12) assert(res.isSadeSati && res.phaseCode === 'RISING', '12th house -> RISING Sade Sati');
  else if (dist === 4) assert(res.isDhaiya && res.phaseCode === 'KANTAKA', '4th house -> KANTAKA Dhaiya');
  else if (dist === 8) assert(res.isDhaiya && res.phaseCode === 'ASHTAMA', '8th house -> ASHTAMA Dhaiya');
  else assert(!res.isSadeSati && !res.isDhaiya && res.phaseCode === 'FREE', `${dist}th house -> FREE`);
}

// 5. 9-Page Janampatrika Report Generation
console.log('\n[TEST 5] Janampatrika 9-Page Comprehensive Report Generation:');
const baseInputs = {
  name: 'Test Seeker',
  date: '2023-06-21',
  time: '12:00',
  city: 'New York, USA',
  latitude: 40.7128,
  longitude: -74.006,
  timezone: -4
};
const yogas = identifyYogas(k);
const doshas = analyzeDoshas(k);

const htmlEn = renderFullPatrikaReport(k, d9, yogas, doshas, baseInputs, 'en');
assert(typeof htmlEn === 'string' && htmlEn.length > 5000, 'renderFullPatrikaReport (English) rendered successfully');
assert(htmlEn.includes('Saturn') && htmlEn.includes('Aquarius'), 'English report contains Saturn and Aquarius placement');

const htmlHi = renderFullPatrikaReport(k, d9, yogas, doshas, baseInputs, 'hi');
assert(typeof htmlHi === 'string' && htmlHi.length > 5000, 'renderFullPatrikaReport (Hindi) rendered successfully');
assert(htmlHi.includes('शनि') && (htmlHi.includes('कुंभ') || htmlHi.includes('कुम्भ')), 'Hindi report contains शनि and कुंभ placement');

// 6. AstroGuru Conversational AI Integration
console.log('\n[TEST 6] AstroGuru AI Advisor Transit Awareness:');
const guruRespKn = getAstroGuruResponse('ನನಗೆ ಯಾವುದಾದರೂ ಗ್ರಹ ದೋಷ ಅಥವಾ ಸಾಡೇ ಸಾತಿ ಇದೆಯಾ?', k, baseInputs, 'kn');
assert(guruRespKn && typeof guruRespKn.analysis === 'string' && guruRespKn.analysis.length > 50, 'AstroGuru Kannada returns robust analysis');
assert(guruRespKn.analysis.includes('ಶನಿ ಗೋಚಾರ'), 'AstroGuru analysis contains live Saturn transit assessment (ಶನಿ ಗೋಚಾರ)');

const guruRespEn = getAstroGuruResponse('When will my career improve?', k, baseInputs, 'en');
assert(guruRespEn && typeof guruRespEn.analysis === 'string' && guruRespEn.analysis.length > 50, 'AstroGuru English career analysis robust');

console.log(`\n===========================================================`);
console.log(`DOWNSTREAM AUDIT SUMMARY: ${pass}/${total} passed (${((pass/total)*100).toFixed(1)}%)`);
console.log(`===========================================================`);
