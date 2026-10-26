/**
 * Test Suite: Astrological Core Calculations Baseline Contract
 * Locks in existing structural properties for Vimshottari Dasha, Yogas,
 * Doshas, and current Sade Sati baseline before Phase 3 calculations upgrade.
 */

import { generateKundali } from '../../src/engines/astrology/kundali.js';
import { calculateVimshottariDasha, getCurrentDasha } from '../../src/engines/astrology/dasha.js';
import { identifyYogas } from '../../src/engines/astrology/yoga.js';
import { analyzeDoshas } from '../../src/engines/astrology/dosha.js';
import { calculateDailyPanchang } from '../../src/engines/astrology/panchang.js';

export async function runAstrologyBaselineTests() {
  const suiteName = 'Astrology Baseline Contracts & Sade Sati Reference';
  console.log(`\n--- Running ${suiteName} ---`);

  let passed = 0;
  let total = 0;

  function assert(condition, message, detail = '') {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      if (detail) console.error(`     Detail: ${detail}`);
    }
  }

  // 1. Vimshottari Dasha Contract
  const moonLongMagha = 125.5; // Magha nakshatra (ruled by Ketu)
  const dashaData = calculateVimshottariDasha(moonLongMagha, '1999-03-28');

  assert(dashaData.periods && dashaData.periods.length >= 9, 'Dasha: Contains at least 9 Mahadasha periods');
  assert(dashaData.periods[0].lord === 'Ketu', 'Dasha: Moon in Magha correctly starts with Ketu Mahadasha');
  assert(dashaData.periods[0].balanceYears > 0 && dashaData.periods[0].balanceYears <= 7, 'Dasha: Ketu initial balance is positive and <= 7 years');
  assert(dashaData.periods[1].lord === 'Venus', 'Dasha: Second period is Venus Mahadasha (20 years)');
  assert(dashaData.periods[1].totalYears === 20, 'Dasha: Venus period length is 20 years');

  const currentDasha = getCurrentDasha(dashaData);
  assert(currentDasha && currentDasha.mahaDasha, 'Dasha: Resolves active current Mahadasha period');
  assert(currentDasha.antarDasha, 'Dasha: Resolves active current Antardasha period');

  // 2. Yogas Detection Contract
  const kundali = generateKundali('1999-03-28', '11:25', 16.8302, 75.71, 5.5, 'LAHIRI');
  const yogas = identifyYogas(kundali);

  assert(Array.isArray(yogas), 'Yogas: Returns array of detected yogas');
  assert(yogas.length > 0, `Yogas: Detected ${yogas.length} auspicious combinations for reference seeker`);
  for (const y of yogas) {
    assert(typeof y.name === 'string' && y.name.length > 0, `Yoga: '${y.name}' has valid name`);
    assert(typeof y.description === 'string', `Yoga: '${y.name}' has description`);
  }

  // 3. Dosha Detection & Current Sade Sati Baseline
  const doshas = analyzeDoshas(kundali);
  assert(Array.isArray(doshas), 'Doshas: Returns array of dosha evaluations');

  const shaniDosha = doshas.find(d => d.id === 'shani_influence');
  assert(shaniDosha !== undefined, 'Sade Sati: Shani influence assessment is included in doshas');
  assert(typeof shaniDosha.present === 'boolean', 'Sade Sati: present field is boolean');
  assert(typeof shaniDosha.details === 'string', 'Sade Sati: details description present');
  assert(Array.isArray(shaniDosha.remedies) && shaniDosha.remedies.length >= 3, 'Sade Sati: Contains practical remedies array');

  // Test deterministic behavior of dynamic Saturn transit assessment (Phase 4C.2):
  // Evaluates transiting Saturn sign relative to natal Moon sign
  const moon = kundali.planets.find(p => p.name === 'Moon');
  assert(typeof shaniDosha.signDistance === 'number' && shaniDosha.signDistance >= 1 && shaniDosha.signDistance <= 12, 'Sade Sati: Valid sidereal sign distance (1-12)');
  assert(typeof shaniDosha.transitSaturnSign === 'string', 'Sade Sati: Valid transit Saturn sign');
  assert(shaniDosha.details.includes(shaniDosha.transitSaturnSign), 'Sade Sati: Details correctly reference transiting Saturn sign');
  assert(shaniDosha.details.includes(shaniDosha.natalMoonSign), 'Sade Sati: Details correctly reference natal Moon sign');

  // 4. Panchang Calculation Baseline
  const panchang = calculateDailyPanchang('1999-03-28', 16.8302, 75.71, 5.5);
  assert(panchang.tithi && typeof panchang.tithi.name === 'string', 'Panchang: Contains valid Tithi');
  assert(panchang.nakshatra && typeof panchang.nakshatra.name === 'string', 'Panchang: Contains valid Nakshatra');
  assert(panchang.yoga && typeof panchang.yoga.name === 'string', 'Panchang: Contains valid Yoga');
  assert(panchang.karana && typeof panchang.karana.name === 'string', 'Panchang: Contains valid Karana');
  assert(typeof panchang.sunrise === 'string', 'Panchang: Contains sunrise timestamp');

  console.log(`Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
