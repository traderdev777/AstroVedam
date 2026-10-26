/**
 * Test Suite: Planetary Retrograde Motion & Velocity Verification (Phase 4B.3)
 *
 * Independent astronomical verification of planetary retrograde detection for
 * Mercury, Venus, Mars, Jupiter, Saturn, Sun, Moon, Rahu, and Ketu.
 *
 * Validates that:
 * 1. Apparent retrograde status is determined by geocentric ecliptic longitudinal motion over time (dλ/dt < 0).
 * 2. Longitudinal velocity is numerically stable with central difference interval h = 0.05 days.
 * 3. Wraparound across 0°/360° produces smooth, continuous velocities without artifacts.
 * 4. Station and near-station periods are handled correctly.
 * 5. Sun and Moon are never retrograde; Rahu and Ketu always regress (retrograde).
 * 6. Kundali, Navamsha, and FullPatrikaReport consume the correct retrograde status.
 *
 * Independent Reference Standard:
 *   NASA JPL Horizons Solar System Dynamics (DE440 / DE441 Ephemerides)
 *   Daily longitudinal motion (deg/day) in apparent geocentric ecliptic frame
 */

import {
  getPlanetaryVelocity,
  isPlanetRetrograde,
  isPlanetStationary,
  mercuryLongitude,
  venusLongitude,
  marsLongitude,
  jupiterLongitude,
  saturnLongitude,
  calculateAscendant,
  normDiff
} from '../../src/engines/astrology/ephemeris.js';
import { generateKundali, generateNavamsaChart } from '../../src/engines/astrology/kundali.js';
import { renderFullPatrikaReport } from '../../src/components/reports/FullPatrikaReport.js';
import { identifyYogas } from '../../src/engines/astrology/yoga.js';
import { analyzeDoshas } from '../../src/engines/astrology/dosha.js';

export async function runRetrogradeTests() {
  const suiteName = 'Planetary Retrograde & Velocity Verification (Phase 4B.3)';
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

  // 1. Direct Motion Cases for each supported planet (JPL Horizons verified)
  const directCases = [
    { planet: 'Mercury', jd: 2451647.9895833335, caseId: 'REF-02', refVel: +1.5394 },
    { planet: 'Venus',   jd: 2451265.746527778,  caseId: 'REF-01', refVel: +1.1971 },
    { planet: 'Mars',    jd: 2451647.9895833335, caseId: 'REF-02', refVel: +0.7178 },
    { planet: 'Jupiter', jd: 2451265.746527778,  caseId: 'REF-01', refVel: +0.2420 },
    { planet: 'Saturn',  jd: 2451647.9895833335, caseId: 'REF-02', refVel: +0.1223 },
    { planet: 'Sun',     jd: 2451265.746527778,  caseId: 'REF-01', refVel: +0.9889 },
    { planet: 'Moon',    jd: 2451265.746527778,  caseId: 'REF-01', refVel: +12.7816 }
  ];

  for (const c of directCases) {
    const isRetro = isPlanetRetrograde(c.planet, c.jd);
    const vel = getPlanetaryVelocity(c.planet, c.jd);
    assert(
      !isRetro && vel > 0,
      `[Direct Motion] ${c.planet} on ${c.caseId} correctly classified DIRECT (vel: +${vel.toFixed(4)}°/d, JPL: +${c.refVel.toFixed(4)}°/d)`
    );
  }

  // 2. Retrograde Motion Cases for each supported planet (JPL Horizons verified)
  const retroCases = [
    { planet: 'Mercury', jd: 2451265.746527778,  caseId: 'REF-01', refVel: -0.4445 },
    { planet: 'Venus',   jd: 2455510.7604166665, caseId: 'REF-08', refVel: -0.3290 },
    { planet: 'Mars',    jd: 2451265.746527778,  caseId: 'REF-01', refVel: -0.1283 },
    { planet: 'Jupiter', jd: 2459883.5,          caseId: 'REF-07', refVel: -0.0773 },
    { planet: 'Saturn',  jd: 2459114.3333333335, caseId: 'REF-05', refVel: -0.0113 },
    { planet: 'Rahu',    jd: 2451265.746527778,  caseId: 'REF-01', refVel: -0.0530 },
    { planet: 'Ketu',    jd: 2451265.746527778,  caseId: 'REF-01', refVel: -0.0530 }
  ];

  for (const c of retroCases) {
    const isRetro = isPlanetRetrograde(c.planet, c.jd);
    const vel = getPlanetaryVelocity(c.planet, c.jd);
    assert(
      isRetro && vel < 0,
      `[Retrograde Motion] ${c.planet} on ${c.caseId} correctly classified RETROGRADE (vel: ${vel.toFixed(4)}°/d, JPL: ${c.refVel.toFixed(4)}°/d)`
    );
  }

  // 3. Station and Near-Station Cases
  // Saturn on REF-06 (2023-06-21) is near turning point (JPL velocity: -0.0074°/day ≈ -0.44 arcmin/day)
  const saturnStationVel = getPlanetaryVelocity('Saturn', 2460117.1666666665);
  const saturnStationRetro = isPlanetRetrograde('Saturn', 2460117.1666666665);
  assert(
    saturnStationRetro && Math.abs(saturnStationVel) < 0.015,
    `[Station Handling] Saturn on REF-06 near retrograde station correctly detected (vel: ${saturnStationVel.toFixed(4)}°/d, JPL: -0.0074°/d)`
  );

  // Mars on REF-07 (2022-10-31) near station (JPL velocity: -0.0135°/day)
  const marsStationVel = getPlanetaryVelocity('Mars', 2459883.5);
  const marsStationRetro = isPlanetRetrograde('Mars', 2459883.5);
  assert(
    marsStationRetro && Math.abs(marsStationVel) < 0.02,
    `[Station Handling] Mars on REF-07 near retrograde station correctly detected (vel: ${marsStationVel.toFixed(4)}°/d, JPL: -0.0135°/d)`
  );

  // Verify stationary detector utility function
  const isSaturnNearStation = isPlanetStationary('Saturn', 2460117.1666666665);
  assert(
    typeof isSaturnNearStation === 'boolean',
    `[Station Utility] isPlanetStationary returns boolean contract (${isSaturnNearStation})`
  );

  // 4. Boundary Wraparound near 0°/360°
  // Jupiter in REF-07 is at ~359.3° moving retrograde (towards 360°/0°)
  const jupWrapVel = getPlanetaryVelocity('Jupiter', 2459883.5);
  assert(
    jupWrapVel < 0 && Math.abs(jupWrapVel) < 0.2,
    `[Wraparound Stability] Retrograde Jupiter near 360° wraps smoothly without discontinuity (${jupWrapVel.toFixed(4)}°/d)`
  );

  // Mercury in REF-02 is at ~0.76° moving direct (crossing 0°)
  const mercWrapVel = getPlanetaryVelocity('Mercury', 2451647.9895833335);
  assert(
    mercWrapVel > 1.0 && mercWrapVel < 2.5,
    `[Wraparound Stability] Direct Mercury near 0° wraps smoothly without discontinuity (+${mercWrapVel.toFixed(4)}°/d)`
  );

  // 5. Complete 45-Point Velocity Accuracy Audit across all 9 Reference Cases
  const benchmarkCases = [
    {
      id: 'REF-01', jd: 2451265.746527778,
      velocities: { Mercury: -0.4445, Venus: +1.1971, Mars: -0.1283, Jupiter: +0.2420, Saturn: +0.1197 }
    },
    {
      id: 'REF-02', jd: 2451647.9895833335,
      velocities: { Mercury: +1.5394, Venus: +1.2330, Mars: +0.7178, Jupiter: +0.2330, Saturn: +0.1223 }
    },
    {
      id: 'REF-03', jd: 2451265.7118055555,
      velocities: { Mercury: -0.4477, Venus: +1.1971, Mars: -0.1278, Jupiter: +0.2420, Saturn: +0.1197 }
    },
    {
      id: 'REF-04', jd: 2451604.0,
      velocities: { Mercury: -1.0261, Venus: +1.2356, Mars: +0.7516, Jupiter: +0.1900, Saturn: +0.0822 }
    },
    {
      id: 'REF-05', jd: 2459114.3333333335,
      velocities: { Mercury: +1.2773, Venus: +1.1390, Mars: -0.1773, Jupiter: +0.0300, Saturn: -0.0113 }
    },
    {
      id: 'REF-06', jd: 2460117.1666666665,
      velocities: { Mercury: +2.0513, Venus: +0.7798, Mars: +0.5958, Jupiter: +0.1881, Saturn: -0.0074 }
    },
    {
      id: 'REF-07', jd: 2459883.5,
      velocities: { Mercury: +1.6654, Venus: +1.2536, Mars: -0.0135, Jupiter: -0.0773, Saturn: +0.0144 }
    },
    {
      id: 'REF-08', jd: 2455510.7604166665,
      velocities: { Mercury: +1.4875, Venus: -0.3290, Mars: +0.7306, Jupiter: -0.0274, Saturn: +0.1080 }
    },
    {
      id: 'REF-09', jd: 2451544.572222222,
      velocities: { Mercury: +1.5566, Venus: +1.2091, Mars: +0.7757, Jupiter: +0.0410, Saturn: -0.0198 }
    }
  ];

  for (const c of benchmarkCases) {
    for (const [pName, jplVel] of Object.entries(c.velocities)) {
      const calcVel = getPlanetaryVelocity(pName, c.jd);
      const isRetro = isPlanetRetrograde(pName, c.jd);
      const expectedRetro = jplVel < 0;
      const velDiff = Math.abs(calcVel - jplVel);
      const tol = pName === 'Mercury' ? 0.08 : 0.03;

      assert(
        isRetro === expectedRetro,
        `[${c.id}] ${pName} retrograde flag matches JPL (${isRetro ? 'RETRO' : 'DIRECT'}, JPL: ${expectedRetro ? 'RETRO' : 'DIRECT'})`
      );
      assert(
        velDiff <= tol,
        `[${c.id}] ${pName} velocity within ${tol}°/d (got ${calcVel >= 0 ? '+' : ''}${calcVel.toFixed(4)}°/d, JPL: ${jplVel >= 0 ? '+' : ''}${jplVel.toFixed(4)}°/d, diff: ${velDiff.toFixed(4)}°/d)`
      );
    }
  }

  // 6. End-to-End Kundali Integration Contract
  const kundali = generateKundali('1999-03-28', '11:25', 16.8302, 75.71, 5.5, 'LAHIRI');
  const merc = kundali.planets.find(p => p.name === 'Mercury');
  const mars = kundali.planets.find(p => p.name === 'Mars');
  const sun = kundali.planets.find(p => p.name === 'Sun');
  const jup = kundali.planets.find(p => p.name === 'Jupiter');
  const rahu = kundali.planets.find(p => p.name === 'Rahu');

  assert(merc && merc.isRetrograde === true, 'Kundali Integration: Mercury is correctly marked retrograde for 1999-03-28 seeker');
  assert(mars && mars.isRetrograde === true, 'Kundali Integration: Mars is correctly marked retrograde for 1999-03-28 seeker');
  assert(sun && sun.isRetrograde === false, 'Kundali Integration: Sun is marked direct (never retrograde)');
  assert(jup && jup.isRetrograde === false, 'Kundali Integration: Jupiter is marked direct');
  assert(rahu && rahu.isRetrograde === true, 'Kundali Integration: Rahu is marked retrograde (Vedic mean node convention)');

  // 7. Navamsha Chart & Report Consumption
  const navamsa = generateNavamsaChart(kundali);
  const navMerc = navamsa.houses.flatMap(h => h.planets).find(p => p.name === 'Mercury' || p.abbr === 'Me');
  assert(navMerc && navMerc.isRetrograde === true, 'Navamsha Integration: Mercury preserves retrograde flag in D-9 chart');

  const yogas = identifyYogas(kundali);
  const doshas = analyzeDoshas(kundali);
  const baseInputs = {
    name: 'Test Seeker',
    date: '1999-03-28',
    time: '11:25',
    city: 'Vijayapura',
    latitude: 16.8302,
    longitude: 75.71,
    timezone: 5.5,
    ayanamsa: 'LAHIRI'
  };
  const reportHtml = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, baseInputs, 'kn');
  assert(reportHtml.includes('ವಕ್ರ'), 'Report Integration: Kannada report renders Vakra (ವಕ್ರ) for retrograde planets');
  assert(reportHtml.includes('(R)'), 'Report Integration: HTML table renders red (R) badge for retrograde planets');

  // 8. Invariance Guards: Ascendant & Geocentric Longitudes unchanged
  const ascRef01 = calculateAscendant(2451265.746527778, 16.8302, 75.71);
  assert(
    Math.abs(normDiff(ascRef01, 87.4326)) < 0.01,
    'Invariance Guard: Phase 4B.1 calculateAscendant is 100% unchanged'
  );
  const mercLong01 = mercuryLongitude(2451265.746527778);
  assert(
    Math.abs(normDiff(mercLong01, 352.1472)) < 0.01,
    'Invariance Guard: Phase 4F.2 geocentric planetary longitude is verified (upgraded from Phase 4B.2 352.2216° to 352.1472°)'
  );

  console.log(`Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
