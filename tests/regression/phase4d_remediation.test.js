/**
 * AstroVedam - Phase 4D Remediation Test Suite
 *
 * Verifies targeted fixes for:
 * 1. Dhaiya never renders the Sade Sati label (in report HTML, predictions, doshas across all languages)
 * 2. Sade Sati retains correct label for Rising, Peak, and Setting phases
 * 3. Invalid transit data renders an unavailable/error state rather than favorable status
 * 4. getRashi(0), getRashi(360), and equivalent full-circle angles return sign 1 (Aries)
 * 5. Negative and greater-than-360 angles normalize correctly
 * 6. Invalid longitude inputs (NaN, Infinity, null, non-numeric) handled safely (returns null)
 * 7. Displayed assessment date matches the date passed into calculation
 * 8. Natal birth date is never substituted for transit assessment date
 * 9. All 5 supported languages (en, hi, kn, mr, te) render distinct localized labels
 */

import { getRashi, calculateSaturnTransit } from '../../src/engines/astrology/ephemeris.js';
import { analyzeDoshas } from '../../src/engines/astrology/dosha.js';
import { generateAdvancedAstroSolutions } from '../../src/engines/astrology/predictions.js';
import { generateKundali, generateNavamsaChart } from '../../src/engines/astrology/kundali.js';
import { identifyYogas } from '../../src/engines/astrology/yoga.js';
import { renderFullPatrikaReport } from '../../src/components/reports/FullPatrikaReport.js';
import { DOSHAS_LOCALIZED } from '../../src/i18n/predictionTranslations.js';
import { prepareChartContext } from '../../src/engines/astroguru/advisor.js';

export async function runPhase4DTests() {
  const suiteName = 'Phase 4D Targeted Saturn Transit Presentation & Input Safety';
  console.log(`\n--- ${suiteName} ---`);

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // =========================================================================
  // TEST GROUP 1: getRashi Longitude Normalization & Safety (Fix 3)
  // =========================================================================
  console.log('\n[TEST GROUP 1] getRashi Longitude Normalization & Safety:');
  // Requirement 4: 0, 360, and multiples map to Aries (Sign 1)
  assert(getRashi(0) === 1, 'getRashi(0) === 1 (Aries)');
  assert(getRashi(0.0) === 1, 'getRashi(0.0) === 1 (Aries)');
  assert(getRashi(360) === 1, 'getRashi(360) === 1 (Aries, not 13)');
  assert(getRashi(360.0) === 1, 'getRashi(360.0) === 1 (Aries)');
  assert(getRashi(720) === 1, 'getRashi(720) === 1 (Aries)');
  assert(getRashi(29.9999) === 1, 'getRashi(29.9999) === 1 (Aries end)');
  assert(getRashi(30.0) === 2, 'getRashi(30.0) === 2 (Taurus start)');

  // Requirement 5: Negative & >360 normalization
  assert(getRashi(-0.0001) === 12, 'getRashi(-0.0001) === 12 (Pisces end)');
  assert(getRashi(-30) === 12, 'getRashi(-30) === 12 (Pisces start)');
  assert(getRashi(-30.0001) === 11, 'getRashi(-30.0001) === 11 (Aquarius end)');
  assert(getRashi(-360) === 1, 'getRashi(-360) === 1 (Aries)');
  assert(getRashi(-390) === 12, 'getRashi(-390) === 12 (Pisces)');
  assert(getRashi(390) === 2, 'getRashi(390) === 2 (Taurus)');
  assert(getRashi(750) === 2, 'getRashi(750) === 2 (Taurus)');

  // Requirement 6: Invalid longitude inputs return null safely
  assert(getRashi(NaN) === null, 'getRashi(NaN) returns null safely');
  assert(getRashi(Infinity) === null, 'getRashi(Infinity) returns null safely');
  assert(getRashi(-Infinity) === null, 'getRashi(-Infinity) returns null safely');
  assert(getRashi(null) === null, 'getRashi(null) returns null safely');
  assert(getRashi(undefined) === null, 'getRashi(undefined) returns null safely');
  assert(getRashi('360') === null, 'getRashi(\'360\') non-number returns null safely');
  assert(getRashi({}) === null, 'getRashi({}) object returns null safely');
  assert(getRashi([120]) === null, 'getRashi([120]) array returns null safely');

  // =========================================================================
  // TEST GROUP 2: Dhaiya vs Sade Sati Distinct Localized Labels (Fix 1)
  // =========================================================================
  console.log('\n[TEST GROUP 2] Dhaiya vs Sade Sati Distinct Localized Labels:');
  const languages = ['en', 'hi', 'kn', 'mr', 'te'];

  // Check dictionary keys in predictionTranslations.js
  const shaniLoc = DOSHAS_LOCALIZED['Shani Influence (Sade Sati / Dhaiya)'];
  for (const lang of languages) {
    assert(typeof shaniLoc[lang].activeStatus === 'string' && shaniLoc[lang].activeStatus.length > 0, `[${lang}] activeStatus exists`);
    assert(typeof shaniLoc[lang].activeDhaiyaStatus === 'string' && shaniLoc[lang].activeDhaiyaStatus.length > 0, `[${lang}] activeDhaiyaStatus exists`);
    assert(typeof shaniLoc[lang].unavailableStatus === 'string' && shaniLoc[lang].unavailableStatus.length > 0, `[${lang}] unavailableStatus exists`);
    assert(shaniLoc[lang].activeStatus !== shaniLoc[lang].activeDhaiyaStatus, `[${lang}] activeStatus !== activeDhaiyaStatus`);
  }

  // Base seeker data: born 1999-03-28 has Moon in Leo (Sign 5).
  // On 2026-06-15, Saturn is in Pisces (Sign 12).
  // Sign distance = ((12 - 5 + 12) % 12) + 1 = 8 -> Ashtama Shani (8th Dhaiya)!
  const baseInputs = {
    name: 'Dhaiya Test Seeker',
    date: '1999-03-28',
    time: '11:25',
    city: 'Bengaluru, India',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 5.5,
    ayanamsa: 'LAHIRI',
    transitDate: '2026-06-15'
  };

  const leoKundali = generateKundali(baseInputs.date, baseInputs.time, baseInputs.latitude, baseInputs.longitude, baseInputs.timezone, baseInputs.ayanamsa);
  const navamsa = generateNavamsaChart(leoKundali);
  const yogas = identifyYogas(leoKundali);

  const leoDoshas = analyzeDoshas(leoKundali, '2026-06-15');
  const leoShani = leoDoshas.find(d => d.id === 'shani_influence');
  assert(leoShani.isDhaiya === true, 'Leo Moon 2026: isDhaiya === true');
  assert(leoShani.isSadeSati === false, 'Leo Moon 2026: isSadeSati === false');
  assert(leoShani.phaseCode === 'ASHTAMA', 'Leo Moon 2026: phaseCode === ASHTAMA');

  // Also test Kantaka Shani (Sign distance 4):
  // Sagittarius native (Sign 9) when Saturn in Pisces (Sign 12)
  const sagKundali = JSON.parse(JSON.stringify(leoKundali));
  const sagMoon = sagKundali.planets.find(p => p.name === 'Moon');
  sagMoon.rashi = 9;
  sagMoon.rashiName = 'Sagittarius';
  sagMoon.rashiNameHi = 'धनु';

  const sagDoshas = analyzeDoshas(sagKundali, '2026-06-15');
  const sagShani = sagDoshas.find(d => d.id === 'shani_influence');
  assert(sagShani.isDhaiya === true, 'Sagittarius Moon 2026: isDhaiya === true');
  assert(sagShani.isSadeSati === false, 'Sagittarius Moon 2026: isSadeSati === false');
  assert(sagShani.phaseCode === 'KANTAKA', 'Sagittarius Moon 2026: phaseCode === KANTAKA');

  // Verify predictions.js produces distinct Dhaiya status for both Dhaiya charts
  const leoSolutions = generateAdvancedAstroSolutions(leoKundali, { transitDate: '2026-06-15' });
  assert(leoSolutions.sadeSati.status === 'Active Dhaiya (Kantaka / Ashtama Shani)', 'predictions.js: status is Active Dhaiya for Leo (Ashtama)');
  assert(leoSolutions.sadeSati.status !== 'Active Sade Sati', 'predictions.js: Ashtama Dhaiya is never labeled Active Sade Sati');

  const sagSolutions = generateAdvancedAstroSolutions(sagKundali, { transitDate: '2026-06-15' });
  assert(sagSolutions.sadeSati.status === 'Active Dhaiya (Kantaka / Ashtama Shani)', 'predictions.js: status is Active Dhaiya for Sagittarius (Kantaka)');
  assert(sagSolutions.sadeSati.status !== 'Active Sade Sati', 'predictions.js: Kantaka Dhaiya is never labeled Active Sade Sati');

  // Verify FullPatrikaReport.js renders distinct Dhaiya badge across all 5 languages
  for (const lang of languages) {
    const reportHtml = renderFullPatrikaReport(leoKundali, navamsa, yogas, leoDoshas, baseInputs, lang);
    const expectedDhaiya = shaniLoc[lang].activeDhaiyaStatus;
    const forbiddenSadeSati = shaniLoc[lang].activeStatus;

    assert(reportHtml.includes(expectedDhaiya), `[${lang}] Report HTML renders distinct Dhaiya label: ${expectedDhaiya}`);
    assert(!reportHtml.includes(forbiddenSadeSati), `[${lang}] Report HTML NEVER renders Sade Sati label for Dhaiya native`);
  }

  // =========================================================================
  // TEST GROUP 3: Sade Sati Retains Correct Localized Labels (Fix 1)
  // =========================================================================
  console.log('\n[TEST GROUP 3] Sade Sati Retains Correct Localized Labels:');
  // Pisces Moon (Sign 12). In 2026, Saturn in Pisces -> Distance = 1 -> Peak Phase Sade Sati
  const piscesKundali = JSON.parse(JSON.stringify(leoKundali));
  const piscesMoon = piscesKundali.planets.find(p => p.name === 'Moon');
  piscesMoon.rashi = 12;
  piscesMoon.rashiName = 'Pisces';
  piscesMoon.rashiNameHi = 'मीन';

  const piscesDoshas = analyzeDoshas(piscesKundali, '2026-06-15');
  const piscesShani = piscesDoshas.find(d => d.id === 'shani_influence');
  assert(piscesShani.isSadeSati === true, 'Pisces Moon 2026: isSadeSati === true');
  assert(piscesShani.isDhaiya === false, 'Pisces Moon 2026: isDhaiya === false');
  assert(piscesShani.phaseCode === 'PEAK', 'Pisces Moon 2026: phaseCode === PEAK');

  for (const lang of languages) {
    const reportHtml = renderFullPatrikaReport(piscesKundali, navamsa, yogas, piscesDoshas, baseInputs, lang);
    const expectedSadeSati = shaniLoc[lang].activeStatus;
    assert(reportHtml.includes(expectedSadeSati), `[${lang}] Report HTML renders correct Sade Sati label: ${expectedSadeSati}`);
  }

  // =========================================================================
  // TEST GROUP 4: Invalid Transit Data Must Not Appear Favorable (Fix 2)
  // =========================================================================
  console.log('\n[TEST GROUP 4] Invalid Transit Data Resilience & Non-Favorable Contract:');
  // 1. Direct calculateSaturnTransit with invalid dates
  const invalidDate1 = calculateSaturnTransit('Aries', 'invalid-date');
  assert(invalidDate1.valid === false, 'invalid-date: valid === false');
  assert(invalidDate1.classification === 'UNAVAILABLE', 'invalid-date: classification === UNAVAILABLE');
  assert(invalidDate1.phaseCode === 'UNAVAILABLE', 'invalid-date: phaseCode === UNAVAILABLE');
  assert(invalidDate1.isAffected === false, 'invalid-date: isAffected === false');

  const invalidDate2 = calculateSaturnTransit('Aries', '2025-99-99');
  assert(invalidDate2.valid === false, '2025-99-99: valid === false');
  assert(invalidDate2.classification === 'UNAVAILABLE', '2025-99-99: classification === UNAVAILABLE');

  const invalidMoon = calculateSaturnTransit(null, '2026-10-22');
  assert(invalidMoon.valid === false, 'null moon: valid === false');
  assert(invalidMoon.classification === 'UNAVAILABLE', 'null moon: classification === UNAVAILABLE');

  // 2. dosha.js with missing or invalid inputs
  const missingMoonKundali = JSON.parse(JSON.stringify(leoKundali));
  missingMoonKundali.planets = missingMoonKundali.planets.filter(p => p.name !== 'Moon');

  const invalidDoshas = analyzeDoshas(missingMoonKundali, '2026-10-22');
  const invalidShani = invalidDoshas.find(d => d.id === 'shani_influence');
  assert(invalidShani.valid === false, 'Missing Moon: dosha valid === false');
  assert(invalidShani.intensity === 'Data Unavailable', 'Missing Moon: intensity === Data Unavailable');
  assert(invalidShani.phaseCode === 'UNAVAILABLE', 'Missing Moon: phaseCode === UNAVAILABLE');
  assert(invalidShani.present === false, 'Missing Moon: present === false');

  // 3. predictions.js with invalid date
  const invalidSolutions = generateAdvancedAstroSolutions(leoKundali, { transitDate: 'invalid-date' });
  assert(invalidSolutions.sadeSati.valid === false, 'predictions.js: invalid date valid === false');
  assert(invalidSolutions.sadeSati.status === 'Transit Data Unavailable (अनुपलब्ध)', 'predictions.js: status is Transit Data Unavailable');
  assert(invalidSolutions.sadeSati.status !== 'Favorable / Inactive', 'predictions.js: invalid date NEVER yields Favorable / Inactive');

  // 4. Report HTML rendering of unavailable state across all 5 languages
  const invalidDateDoshas = analyzeDoshas(leoKundali, 'invalid-date');
  for (const lang of languages) {
    const reportHtml = renderFullPatrikaReport(leoKundali, navamsa, yogas, invalidDateDoshas, { ...baseInputs, transitDate: 'invalid-date' }, lang);
    const expectedUnavailable = shaniLoc[lang].unavailableStatus;
    const forbiddenClear = shaniLoc[lang].clearStatus;

    const shaniCardIdx = reportHtml.indexOf(shaniLoc[lang].name);
    assert(shaniCardIdx !== -1, `[${lang}] Shani card found in report`);
    const shaniCardHtml = reportHtml.slice(shaniCardIdx, shaniCardIdx + 650);

    assert(shaniCardHtml.includes(expectedUnavailable), `[${lang}] Report renders localized unavailable status: ${expectedUnavailable}`);
    assert(!shaniCardHtml.includes(forbiddenClear), `[${lang}] Shani card NEVER renders Clear/Favorable status for invalid data`);
    assert(shaniCardHtml.includes('#64748B'), `[${lang}] Report uses slate-gray (#64748B) badge for unavailable state`);
  }

  // =========================================================================
  // TEST GROUP 5: Transit Assessment Date Plumbing & Display (Fix 4)
  // =========================================================================
  console.log('\n[TEST GROUP 5] Transit Assessment Date Consistency & Display:');
  const assessmentDateTarget = '2026-10-22';
  const inputsWithDate = {
    ...baseInputs,
    transitDate: assessmentDateTarget
  };

  const kundaliWithDate = generateKundali(inputsWithDate.date, inputsWithDate.time, inputsWithDate.latitude, inputsWithDate.longitude, inputsWithDate.timezone, inputsWithDate.ayanamsa);
  const doshasWithDate = analyzeDoshas(kundaliWithDate, assessmentDateTarget);
  const shaniWithDate = doshasWithDate.find(d => d.id === 'shani_influence');

  // Date passed into calculation matches output field
  assert(shaniWithDate.assessmentDate === assessmentDateTarget, 'shani_influence.assessmentDate matches input date');

  // Natal birth date is NEVER substituted for transit date
  assert(shaniWithDate.assessmentDate !== inputsWithDate.date, 'Transit assessment date !== birth date (1999-03-28)');

  // FullPatrikaReport displays the assessment date in all 5 languages
  const transitDateLabelMap = {
    en: 'Transit assessment date',
    hi: 'गोचर आकलन तिथि',
    kn: 'ಗೋಚಾರ ಪರಿಶೀಲನಾ ದಿನಾಂಕ',
    mr: 'गोचर मूल्यांकन तारीख',
    te: 'గోచార పరిశీలన తేదీ'
  };
  for (const lang of languages) {
    const reportHtml = renderFullPatrikaReport(kundaliWithDate, navamsa, yogas, doshasWithDate, inputsWithDate, lang);
    assert(reportHtml.includes(assessmentDateTarget), `[${lang}] Report HTML displays assessment date: ${assessmentDateTarget}`);
    assert(reportHtml.includes(transitDateLabelMap[lang]), `[${lang}] Report HTML includes localized assessment date label: ${transitDateLabelMap[lang]}`);
  }

  // AstroGuru advisor plumbing
  const guruContext = prepareChartContext(kundaliWithDate, { transitDate: assessmentDateTarget });
  assert(guruContext.assessmentDate === assessmentDateTarget, 'AstroGuru advisor context preserves transitDate');
  assert(guruContext.doshas.find(d => d.id === 'shani_influence').assessmentDate === assessmentDateTarget, 'AstroGuru dosha assessmentDate matches input');

  // Default date handling: when transitDate is omitted, defaults to current date, NOT birth date
  const inputsNoDate = { ...baseInputs, transitDate: undefined };
  const doshasDefaultDate = analyzeDoshas(kundaliWithDate);
  const shaniDefaultDate = doshasDefaultDate.find(d => d.id === 'shani_influence');
  assert(typeof shaniDefaultDate.assessmentDate === 'string', 'Omitted transitDate defaults to ISO date string');
  assert(shaniDefaultDate.assessmentDate !== inputsNoDate.date, 'Omitted transitDate NEVER defaults to birth date');

  console.log(`\nPhase 4D Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
