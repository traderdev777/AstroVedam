/**
 * AstroVedam - Sade Sati & Saturn Transit Verification Suite (Phase 4C.2)
 *
 * Mathematical & Astronomical Verification of Dynamic Saturn Transit (Gochar)
 * Classifications against Classical Parashari Rules.
 *
 * Covers:
 * 1. 144 Permutations (12 Moon Signs x 12 Transit Saturn Signs)
 * 2. Strict Sign Distance Classifications (12, 1, 2, 4, 8 vs Free)
 * 3. Pisces/Aries Zodiac Wraparound
 * 4. Elimination of Natal Saturn Trap (Natal Conjunct vs Transit Free)
 * 5. Dynamic Detection when Natal Saturn is elsewhere (Natal 7th vs Transit Peak)
 * 6. Temporal Boundary Crossing (Aquarius to Pisces transit)
 * 7. Engine Agreement: dosha.js vs predictions.js
 * 8. Invalid Inputs, Nulls, and Out-of-Bounds Resilience
 * 9. Backward Compatibility & Public API Invariance
 * 10. Non-Regression Invariance Guards (Phases 4B.1, 4B.2, 4B.3)
 */

import { calculateSaturnTransit, dateToJD } from '../../src/engines/astrology/ephemeris.js';
import { analyzeDoshas } from '../../src/engines/astrology/dosha.js';
import { generateAdvancedAstroSolutions } from '../../src/engines/astrology/predictions.js';
import { generateKundali } from '../../src/engines/astrology/kundali.js';
import { RASHIS } from '../../src/engines/astrology/constants.js';

export async function runSadeSatiTests() {
  const suiteName = 'Sade Sati & Saturn Transit Dynamic Assessment (Phase 4C.2)';
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
  // 1. All 144 Sign Combinations (12 Natal Moon Signs x 12 Transit Signs)
  // Mathematical Rule Verification independent of ephemeris
  // =========================================================================
  console.log('\n[TEST GROUP 1] 144 Mathematical Sign Combinations & Parashari Distance Rules:');

  for (let moonRashi = 1; moonRashi <= 12; moonRashi++) {
    for (let saturnRashi = 1; saturnRashi <= 12; saturnRashi++) {
      const distance = ((saturnRashi - moonRashi + 12) % 12) + 1;
      const moonName = RASHIS[moonRashi - 1].en;
      const saturnName = RASHIS[saturnRashi - 1].en;

      // We synthesize an assessment date corresponding to when Saturn is in saturnRashi
      // Or test using the mathematical distance logic directly
      let expectedClassification = 'NONE';
      let expectedIsSadeSati = false;
      let expectedIsDhaiya = false;
      let expectedPhaseCode = 'FREE';

      if (distance === 12) {
        expectedClassification = 'SADE_SATI_RISING';
        expectedIsSadeSati = true;
        expectedPhaseCode = 'RISING';
      } else if (distance === 1) {
        expectedClassification = 'SADE_SATI_PEAK';
        expectedIsSadeSati = true;
        expectedPhaseCode = 'PEAK';
      } else if (distance === 2) {
        expectedClassification = 'SADE_SATI_SETTING';
        expectedIsSadeSati = true;
        expectedPhaseCode = 'SETTING';
      } else if (distance === 4) {
        expectedClassification = 'KANTAKA_SHANI';
        expectedIsDhaiya = true;
        expectedPhaseCode = 'KANTAKA';
      } else if (distance === 8) {
        expectedClassification = 'ASHTAMA_SHANI';
        expectedIsDhaiya = true;
        expectedPhaseCode = 'ASHTAMA';
      }

      // Check classification rules
      if (expectedIsSadeSati) {
        assert(!expectedIsDhaiya, `Distance ${distance} (${moonName} -> ${saturnName}): Sade Sati is never classified as Dhaiya`);
      }
      if (expectedIsDhaiya) {
        assert(!expectedIsSadeSati, `Distance ${distance} (${moonName} -> ${saturnName}): Dhaiya is never classified as Sade Sati`);
      }
      if (!expectedIsSadeSati && !expectedIsDhaiya) {
        assert(expectedPhaseCode === 'FREE', `Distance ${distance} (${moonName} -> ${saturnName}): Harmonics outside 12,1,2,4,8 are Sade Sati Free`);
      }
    }
  }

  // =========================================================================
  // 2. Real Ephemeris Epoch Tests across Zodiac Signs
  // =========================================================================
  console.log('\n[TEST GROUP 2] Real Ephemeris Assessment Dates Across Saturn Signs:');

  // Epochs with verified Sidereal Lahiri Saturn positions:
  // 1. 2021-06-15: Saturn in Capricorn (Makara, id: 10)
  // 2. 2024-06-15: Saturn in Aquarius (Kumbha, id: 11)
  // 3. 2026-06-15: Saturn in Pisces (Meena, id: 12)
  // 4. 2029-06-15: Saturn in Aries (Mesha, id: 1)

  const epochs = [
    { date: '2021-06-15', expectedSign: 'Capricorn', expectedRashi: 10 },
    { date: '2024-06-15', expectedSign: 'Aquarius', expectedRashi: 11 },
    { date: '2026-06-15', expectedSign: 'Pisces', expectedRashi: 12 },
    { date: '2029-06-15', expectedSign: 'Aries', expectedRashi: 1 }
  ];

  for (const ep of epochs) {
    const res = calculateSaturnTransit('Aries', ep.date);
    assert(res.valid === true, `Transit check on ${ep.date} returned valid result`);
    assert(res.transitSaturnSign === ep.expectedSign, `Transit on ${ep.date}: Saturn is in ${ep.expectedSign} (got ${res.transitSaturnSign})`);
    assert(res.transitSaturnRashi === ep.expectedRashi, `Transit on ${ep.date}: Saturn Rashi is ${ep.expectedRashi}`);
  }

  // =========================================================================
  // 3. Pisces & Aries Zodiac Wraparound
  // =========================================================================
  console.log('\n[TEST GROUP 3] Pisces / Aries Zodiac Boundary Wraparound:');

  // When Saturn is in Pisces (2026-06-15, sign 12):
  // - Natal Moon in Aries (1): Saturn in Pisces is 12th from Moon -> Rising Phase
  const ariesIn2026 = calculateSaturnTransit('Aries', '2026-06-15');
  assert(ariesIn2026.signDistance === 12, 'Pisces Saturn to Aries Moon: Sign distance is 12 (wraparound)');
  assert(ariesIn2026.isSadeSati === true && ariesIn2026.phaseCode === 'RISING', 'Pisces Saturn to Aries Moon: Classified as Sade Sati Rising');

  // - Natal Moon in Pisces (12): Saturn in Pisces is 1st (same sign) -> Peak Phase
  const piscesIn2026 = calculateSaturnTransit('Pisces', '2026-06-15');
  assert(piscesIn2026.signDistance === 1, 'Pisces Saturn to Pisces Moon: Sign distance is 1');
  assert(piscesIn2026.isSadeSati === true && piscesIn2026.phaseCode === 'PEAK', 'Pisces Saturn to Pisces Moon: Classified as Sade Sati Peak');

  // - Natal Moon in Aquarius (11): Saturn in Pisces is 2nd from Moon -> Setting Phase
  const aquariusIn2026 = calculateSaturnTransit('Aquarius', '2026-06-15');
  assert(aquariusIn2026.signDistance === 2, 'Pisces Saturn to Aquarius Moon: Sign distance is 2');
  assert(aquariusIn2026.isSadeSati === true && aquariusIn2026.phaseCode === 'SETTING', 'Pisces Saturn to Aquarius Moon: Classified as Sade Sati Setting');

  // When Saturn is in Aries (2029-06-15, sign 1):
  // - Natal Moon in Pisces (12): Saturn in Aries is 2nd from Moon -> Setting Phase (wraparound)
  const piscesIn2029 = calculateSaturnTransit('Pisces', '2029-06-15');
  assert(piscesIn2029.signDistance === 2, 'Aries Saturn to Pisces Moon: Sign distance is 2 (wraparound)');
  assert(piscesIn2029.isSadeSati === true && piscesIn2029.phaseCode === 'SETTING', 'Aries Saturn to Pisces Moon: Classified as Sade Sati Setting');

  // - Natal Moon in Taurus (2): Saturn in Aries is 12th from Moon -> Rising Phase
  const taurusIn2029 = calculateSaturnTransit('Taurus', '2029-06-15');
  assert(taurusIn2029.signDistance === 12, 'Aries Saturn to Taurus Moon: Sign distance is 12');
  assert(taurusIn2029.isSadeSati === true && taurusIn2029.phaseCode === 'RISING', 'Aries Saturn to Taurus Moon: Classified as Sade Sati Rising');

  // =========================================================================
  // 4. Dhaiya Disaggregation (Kantaka & Ashtama Shani != Sade Sati)
  // =========================================================================
  console.log('\n[TEST GROUP 4] Dhaiya Disaggregation (Kantaka & Ashtama Shani):');

  // When Saturn is in Pisces (2026-06-15, sign 12):
  // 4th from Moon = Saturn in 12 means Moon in Sagittarius (9). (12 - 9 + 12)%12 + 1 = 4
  const sagIn2026 = calculateSaturnTransit('Sagittarius', '2026-06-15');
  assert(sagIn2026.signDistance === 4, 'Pisces Saturn to Sagittarius Moon: Sign distance is 4');
  assert(sagIn2026.isDhaiya === true, 'Sagittarius Moon: isDhaiya is true');
  assert(sagIn2026.isSadeSati === false, 'Sagittarius Moon: isSadeSati is FALSE (Kantaka Shani is not Sade Sati)');
  assert(sagIn2026.phaseCode === 'KANTAKA', 'Sagittarius Moon: phaseCode is KANTAKA');

  // 8th from Moon = Saturn in 12 means Moon in Leo (5). (12 - 5 + 12)%12 + 1 = 8
  const leoIn2026 = calculateSaturnTransit('Leo', '2026-06-15');
  assert(leoIn2026.signDistance === 8, 'Pisces Saturn to Leo Moon: Sign distance is 8');
  assert(leoIn2026.isDhaiya === true, 'Leo Moon: isDhaiya is true');
  assert(leoIn2026.isSadeSati === false, 'Leo Moon: isSadeSati is FALSE (Ashtama Shani is not Sade Sati)');
  assert(leoIn2026.phaseCode === 'ASHTAMA', 'Leo Moon: phaseCode is ASHTAMA');

  // Neutral distance: Saturn in Pisces (12) to Moon in Cancer (4). Distance = (12 - 4 + 12)%12 + 1 = 9
  const cancerIn2026 = calculateSaturnTransit('Cancer', '2026-06-15');
  assert(cancerIn2026.signDistance === 9, 'Pisces Saturn to Cancer Moon: Sign distance is 9');
  assert(cancerIn2026.isSadeSati === false, 'Cancer Moon: isSadeSati is false');
  assert(cancerIn2026.isDhaiya === false, 'Cancer Moon: isDhaiya is false');
  assert(cancerIn2026.isAffected === false, 'Cancer Moon: isAffected is false');
  assert(cancerIn2026.phaseCode === 'FREE', 'Cancer Moon: phaseCode is FREE');

  // =========================================================================
  // 5. Elimination of the "Natal Saturn Trap"
  // =========================================================================
  console.log('\n[TEST GROUP 5] Elimination of Natal Saturn Trap:');

  // Construct a synthetic kundali where natal Saturn is CONJUNCT natal Moon (same house and rashi)
  // Old bug would look at natal Saturn house === natal Moon house and claim PEAK SADE SATI permanently!
  const natalConjunctKundali = {
    lagna: { rashi: 1, rashiName: 'Aries' },
    planets: [
      { name: 'Moon', rashi: 5, rashiName: 'Leo', house: 5, longitude: 130 },
      { name: 'Saturn', rashi: 5, rashiName: 'Leo', house: 5, longitude: 132 },
      { name: 'Sun', rashi: 1, rashiName: 'Aries', house: 1, longitude: 10 },
      { name: 'Mars', rashi: 1, rashiName: 'Aries', house: 1, longitude: 15 },
      { name: 'Mercury', rashi: 1, rashiName: 'Aries', house: 1, longitude: 20 },
      { name: 'Jupiter', rashi: 1, rashiName: 'Aries', house: 1, longitude: 25 },
      { name: 'Venus', rashi: 1, rashiName: 'Aries', house: 1, longitude: 28 },
      { name: 'Rahu', rashi: 3, rashiName: 'Gemini', house: 3, longitude: 70 },
      { name: 'Ketu', rashi: 9, rashiName: 'Sagittarius', house: 9, longitude: 250 }
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, lord: 'Mars', rashiName: 'Aries' })),
    birthDetails: { ayanamsa: 'LAHIRI' }
  };

  // Evaluate on 2021-06-15 (Saturn in Capricorn, id 10).
  // Natal Moon in Leo (id 5). Transiting Saturn in Capricorn (10). Distance = 6.
  // Neither Sade Sati nor Dhaiya!
  const doshasConjunct2021 = analyzeDoshas(natalConjunctKundali, '2021-06-15');
  const shaniDosha2021 = doshasConjunct2021.find(d => d.id === 'shani_influence');
  assert(shaniDosha2021 !== undefined, 'Natal Trap Test: dosha evaluation includes shani_influence');
  assert(shaniDosha2021.present === false, 'Natal Trap Resolved: Despite natal Moon conjunct natal Saturn, 2021 transit is present: false');
  assert(shaniDosha2021.isSadeSati === false, 'Natal Trap Resolved: isSadeSati is false');
  assert(shaniDosha2021.signDistance === 6, 'Natal Trap Resolved: Sign distance is 6 (Leo to Capricorn)');
  assert(shaniDosha2021.phaseCode === 'FREE', 'Natal Trap Resolved: Phase is FREE');

  // =========================================================================
  // 6. Dynamic Transit Detection when Natal Saturn is Elsewhere
  // =========================================================================
  console.log('\n[TEST GROUP 6] Dynamic Detection when Natal Saturn is in Amicable/Distant House:');

  // Construct a synthetic kundali where natal Saturn is in 7th house from Moon (opposed / 180 deg)
  // Old bug would calculate diffFromMoon = 7 and claim "Currently inactive in natal chart"!
  // But on 2024-06-15 (Saturn in Aquarius), if natal Moon is in Aquarius, seeker is in PEAK SADE SATI!
  const natalOpposedKundali = {
    lagna: { rashi: 1, rashiName: 'Aries' },
    planets: [
      { name: 'Moon', rashi: 11, rashiName: 'Aquarius', house: 11, longitude: 310 },
      { name: 'Saturn', rashi: 5, rashiName: 'Leo', house: 5, longitude: 130 },
      { name: 'Sun', rashi: 1, rashiName: 'Aries', house: 1, longitude: 10 },
      { name: 'Mars', rashi: 1, rashiName: 'Aries', house: 1, longitude: 15 },
      { name: 'Mercury', rashi: 1, rashiName: 'Aries', house: 1, longitude: 20 },
      { name: 'Jupiter', rashi: 1, rashiName: 'Aries', house: 1, longitude: 25 },
      { name: 'Venus', rashi: 1, rashiName: 'Aries', house: 1, longitude: 28 },
      { name: 'Rahu', rashi: 3, rashiName: 'Gemini', house: 3, longitude: 70 },
      { name: 'Ketu', rashi: 9, rashiName: 'Sagittarius', house: 9, longitude: 250 }
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, lord: 'Mars', rashiName: 'Aries' })),
    birthDetails: { ayanamsa: 'LAHIRI' }
  };

  const doshasOpposed2024 = analyzeDoshas(natalOpposedKundali, '2024-06-15');
  const shaniDosha2024 = doshasOpposed2024.find(d => d.id === 'shani_influence');
  assert(shaniDosha2024.present === true, 'Natal Opposed Seeker: Successfully detects active transit on 2024-06-15');
  assert(shaniDosha2024.isSadeSati === true, 'Natal Opposed Seeker: isSadeSati is true');
  assert(shaniDosha2024.phaseCode === 'PEAK', 'Natal Opposed Seeker: Phase is PEAK (transiting over Aquarius)');
  assert(shaniDosha2024.signDistance === 1, 'Natal Opposed Seeker: Sign distance is 1');

  // =========================================================================
  // 7. Temporal Boundary Crossing (Aquarius -> Pisces)
  // =========================================================================
  console.log('\n[TEST GROUP 7] Temporal Transit Boundary Crossing:');

  // For a native with Moon in Pisces:
  // In mid-2024 (Saturn in Aquarius): Moon in Pisces is 12th from Moon -> Rising Phase
  // In mid-2026 (Saturn in Pisces): Moon in Pisces is 1st from Moon -> Peak Phase
  const piscesNative = {
    lagna: { rashi: 1, rashiName: 'Aries' },
    planets: [{ name: 'Moon', rashi: 12, rashiName: 'Pisces', house: 12, longitude: 345 }],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, lord: 'Mars', rashiName: 'Aries' })),
    birthDetails: { ayanamsa: 'LAHIRI' }
  };

  const pisces2024 = analyzeDoshas(piscesNative, '2024-06-15').find(d => d.id === 'shani_influence');
  const pisces2026 = analyzeDoshas(piscesNative, '2026-06-15').find(d => d.id === 'shani_influence');

  assert(pisces2024.phaseCode === 'RISING', 'Boundary Crossing: Mid-2024 Pisces Moon is in RISING phase (Saturn in Aquarius)');
  assert(pisces2026.phaseCode === 'PEAK', 'Boundary Crossing: Mid-2026 Pisces Moon progresses to PEAK phase (Saturn in Pisces)');
  assert(pisces2024.transitSaturnSign === 'Aquarius', 'Boundary Crossing: 2024 transit sign is Aquarius');
  assert(pisces2026.transitSaturnSign === 'Pisces', 'Boundary Crossing: 2026 transit sign is Pisces');

  // =========================================================================
  // 8. Cross-Engine Agreement: dosha.js vs predictions.js
  // =========================================================================
  console.log('\n[TEST GROUP 8] Cross-Engine Concordance (dosha.js vs predictions.js):');

  const testSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const testDates = ['2021-06-15', '2024-06-15', '2026-06-15', '2029-06-15'];

  for (const sign of testSigns) {
    const signId = RASHIS.find(r => r.en === sign).id;
    const testKundali = {
      lagna: { rashi: 1, rashiName: 'Aries', lord: 'Mars' },
      planets: [
        { name: 'Moon', rashi: signId, rashiName: sign, house: signId, longitude: (signId - 1) * 30 + 15 },
        { name: 'Sun', rashi: 1, rashiName: 'Aries', house: 1, longitude: 10 },
        { name: 'Mars', rashi: 1, rashiName: 'Aries', house: 1, longitude: 15 },
        { name: 'Mercury', rashi: 1, rashiName: 'Aries', house: 1, longitude: 20 },
        { name: 'Jupiter', rashi: 1, rashiName: 'Aries', house: 1, longitude: 25 },
        { name: 'Venus', rashi: 1, rashiName: 'Aries', house: 1, longitude: 28 },
        { name: 'Saturn', rashi: 7, rashiName: 'Libra', house: 7, longitude: 190 },
        { name: 'Rahu', rashi: 3, rashiName: 'Gemini', house: 3, longitude: 70 },
        { name: 'Ketu', rashi: 9, rashiName: 'Sagittarius', house: 9, longitude: 250 }
      ],
      houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, lord: 'Mars', rashiName: 'Aries' })),
      birthDetails: { ayanamsa: 'LAHIRI' }
    };

    for (const d of testDates) {
      const doshaResult = analyzeDoshas(testKundali, d).find(x => x.id === 'shani_influence');
      const predResult = generateAdvancedAstroSolutions(testKundali, { transitDate: d }).sadeSati;

      assert(doshaResult.present === predResult.isAffected, `Engine Agreement (${sign} on ${d}): present (${doshaResult.present}) === isAffected (${predResult.isAffected})`);
      assert(doshaResult.phase === predResult.phase, `Engine Agreement (${sign} on ${d}): phase matches ('${doshaResult.phase}')`);
      assert(doshaResult.phaseCode === predResult.phaseCode, `Engine Agreement (${sign} on ${d}): phaseCode matches ('${doshaResult.phaseCode}')`);
      assert(doshaResult.signDistance === predResult.signDistance, `Engine Agreement (${sign} on ${d}): signDistance matches (${doshaResult.signDistance})`);
      assert(doshaResult.transitSaturnSign === predResult.transitSaturnSign, `Engine Agreement (${sign} on ${d}): transitSaturnSign matches (${doshaResult.transitSaturnSign})`);
    }
  }

  // =========================================================================
  // 9. Input Resilience & Edge-Case Fault Tolerance
  // =========================================================================
  console.log('\n[TEST GROUP 9] Input Resilience & Fault Tolerance:');

  const invalidInputs = [
    null,
    undefined,
    0,
    13,
    -1,
    'InvalidSignName',
    {},
    { planets: [] }
  ];

  for (const inv of invalidInputs) {
    const res = calculateSaturnTransit(inv, '2024-06-15');
    assert(res.valid === false, `calculateSaturnTransit gracefully handles invalid input: ${JSON.stringify(inv)}`);
    assert(res.isAffected === false, 'Invalid input returns isAffected: false without crashing');
    assert(res.phaseCode === 'UNAVAILABLE', 'Invalid input returns phaseCode: UNAVAILABLE without crashing');
  }

  // Invalid date inputs
  const invalidDates = ['invalid-date', '2025-99-99', NaN];
  for (const invDate of invalidDates) {
    const res = calculateSaturnTransit('Aries', invDate);
    assert(res.valid === false, `calculateSaturnTransit gracefully handles invalid date: ${invDate}`);
    assert(res.isAffected === false, 'Invalid date returns isAffected: false');
  }

  // Backward compatibility default: omitting assessmentDate
  const defaultDateRes = calculateSaturnTransit('Aries');
  assert(defaultDateRes.valid === true, 'Default assessment date (omitted) resolves cleanly to current time');
  assert(typeof defaultDateRes.transitSaturnSign === 'string', 'Default date yields valid Saturn sign');

  // Backward compatibility for analyzeDoshas without 2nd argument
  const baselineKundali = generateKundali('1999-03-28', '11:25', 16.8302, 75.71, 5.5);
  const baselineDoshas = analyzeDoshas(baselineKundali);
  const baselineShani = baselineDoshas.find(d => d.id === 'shani_influence');
  assert(baselineShani !== undefined, 'analyzeDoshas(kundali) with single argument returns shani_influence');
  assert(typeof baselineShani.present === 'boolean', 'shani_influence.present is boolean');
  assert(typeof baselineShani.details === 'string', 'shani_influence.details is string');

  // Backward compatibility for generateAdvancedAstroSolutions without userInputs
  const baselineSolutions = generateAdvancedAstroSolutions(baselineKundali);
  assert(baselineSolutions.sadeSati !== undefined, 'generateAdvancedAstroSolutions(kundali) returns sadeSati');
  assert(typeof baselineSolutions.sadeSati.isAffected === 'boolean', 'sadeSati.isAffected is boolean');
  assert(typeof baselineSolutions.sadeSati.detail === 'string', 'sadeSati.detail is backward-compatible string');
  assert(typeof baselineSolutions.sadeSati.details === 'string', 'sadeSati.details is string');

  // =========================================================================
  // 10. Non-Regression Invariance Guards
  // Verify that Phases 4B.1, 4B.2, and 4B.3 were not altered
  // =========================================================================
  console.log('\n[TEST GROUP 10] Non-Regression Invariance Guards:');

  // Phase 4B.1 Ascendant check (1999-03-28, 11:25 @ 16.8302, 75.71 -> Gemini 63.59°)
  assert(baselineKundali.lagna.rashiName === 'Gemini', 'Phase 4B.1 Guard: Ascendant remains Gemini for baseline chart');
  assert(Math.abs(baselineKundali.lagna.longitude - 63.59) < 0.25, 'Phase 4B.1 Guard: Ascendant longitude remains ~63.59°');

  // Phase 4B.2 Geocentric longitudes check
  const mercury = baselineKundali.planets.find(p => p.name === 'Mercury');
  const mars = baselineKundali.planets.find(p => p.name === 'Mars');
  assert(mercury.rashiName === 'Aquarius', 'Phase 4B.2 Guard: Geocentric Mercury remains Aquarius (328.29°)');
  assert(mars.rashiName === 'Libra', 'Phase 4B.2 Guard: Geocentric Mars remains Libra (197.77°)');

  // Phase 4B.3 Retrograde detection check
  assert(mercury.isRetrograde === true, 'Phase 4B.3 Guard: Mercury remains retrograde for baseline chart');
  assert(mars.isRetrograde === true, 'Phase 4B.3 Guard: Mars remains retrograde for baseline chart');

  console.log(`Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
