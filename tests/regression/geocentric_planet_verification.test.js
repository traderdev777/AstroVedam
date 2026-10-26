/**
 * Test Suite: Geocentric Planetary Longitude Verification (Phase 4B.2)
 *
 * Independent astronomical verification of Mercury, Venus, Mars, Jupiter, and Saturn.
 * Validates that production engine calculates true geocentric apparent ecliptic longitudes
 * via Earth-planet vector subtraction (VSOP87 / Standish model) rather than unprojected
 * heliocentric orbital positions.
 *
 * Independent Reference Standard:
 *   NASA JPL Horizons Solar System Dynamics (DE440 / DE441 Ephemerides)
 *   Coordinate Frame: Geocentric Ecliptic of Date (Apparent)
 *   Ayanamsha Model: True Chitra Paksha (Lahiri)
 */

import {
  mercuryLongitude,
  venusLongitude,
  marsLongitude,
  jupiterLongitude,
  saturnLongitude,
  calculateAscendant
} from '../../src/engines/astrology/ephemeris.js';
import { generateKundali } from '../../src/engines/astrology/kundali.js';

function normDiff(a, b) {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

export async function runGeocentricPlanetTests() {
  const suiteName = 'Geocentric Planetary Longitude Verification (Phase 4B.2)';
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

  // 9 Canonical Benchmark Reference Cases from NASA JPL Horizons
  const benchmarkCases = [
    {
      id: 'REF-01',
      name: 'Normal Indian Birth Chart (Vijayapura)',
      jd: 2451265.746527778,
      ayanamsa: 23.8423,
      planets: {
        Mercury: { refTrop: 352.1342, refSid: 328.2919, expectedRashi: 11, tol: 0.15 },
        Venus:   { refTrop: 41.8381,  refSid: 17.9958,  expectedRashi: 1,  tol: 0.50 },
        Mars:    { refTrop: 221.6170, refSid: 197.7747, expectedRashi: 7,  tol: 0.15 },
        Jupiter: { refTrop: 10.1040,  refSid: 346.2617, expectedRashi: 12, tol: 0.60 },
        Saturn:  { refTrop: 32.9745,  refSid: 9.1322,   expectedRashi: 1,  tol: 0.50 }
      }
    },
    {
      id: 'REF-02',
      name: 'Confirmed Sign Boundary (Mesha Ingress)',
      jd: 2451647.9895833335,
      ayanamsa: 23.8569,
      planets: {
        Mercury: { refTrop: 0.7254,   refSid: 336.8685, expectedRashi: 12, tol: 0.15 },
        Venus:   { refTrop: 8.2819,   refSid: 344.4250, expectedRashi: 12, tol: 0.50 },
        Mars:    { refTrop: 45.5750,  refSid: 21.7181,  expectedRashi: 1,  tol: 0.15 },
        Jupiter: { refTrop: 42.0403,  refSid: 18.1834,  expectedRashi: 1,  tol: 0.60 },
        Saturn:  { refTrop: 46.9799,  refSid: 23.1230,  expectedRashi: 1,  tol: 0.50 }
      }
    },
    {
      id: 'REF-03',
      name: 'Nakshatra/Pada Boundary',
      jd: 2451265.7118055555,
      ayanamsa: 23.8423,
      planets: {
        Mercury: { refTrop: 352.1514, refSid: 328.3091, expectedRashi: 11, tol: 0.15 },
        Venus:   { refTrop: 41.7965,  refSid: 17.9542,  expectedRashi: 1,  tol: 0.50 },
        Mars:    { refTrop: 221.6212, refSid: 197.7789, expectedRashi: 7,  tol: 0.15 },
        Jupiter: { refTrop: 10.0956,  refSid: 346.2533, expectedRashi: 12, tol: 0.60 },
        Saturn:  { refTrop: 32.9704,  refSid: 9.1281,   expectedRashi: 1,  tol: 0.50 }
      }
    },
    {
      id: 'REF-04',
      name: 'Century Leap-Day Rollover (2000-02-29)',
      jd: 2451604.0,
      ayanamsa: 23.8553,
      planets: {
        Mercury: { refTrop: 342.5065, refSid: 318.6512, expectedRashi: 11, tol: 0.15 },
        Venus:   { refTrop: 313.9566, refSid: 290.1013, expectedRashi: 10, tol: 0.50 },
        Mars:    { refTrop: 13.2215,  refSid: 349.3662, expectedRashi: 12, tol: 0.15 },
        Jupiter: { refTrop: 32.5771,  refSid: 8.7218,   expectedRashi: 1,  tol: 0.60 },
        Saturn:  { refTrop: 42.3658,  refSid: 18.5105,  expectedRashi: 1,  tol: 0.50 }
      }
    },
    {
      id: 'REF-05',
      name: 'Southern-Hemisphere Ascendant (Sydney)',
      jd: 2459114.3333333335,
      ayanamsa: 24.1422,
      planets: {
        Mercury: { refTrop: 203.3207, refSid: 179.1785, expectedRashi: 6,  tol: 0.15 },
        Venus:   { refTrop: 137.2908, refSid: 113.1486, expectedRashi: 4,  tol: 0.50 },
        Mars:    { refTrop: 27.1044,  refSid: 2.9622,   expectedRashi: 1,  tol: 0.15 },
        Jupiter: { refTrop: 287.5315, refSid: 263.3893, expectedRashi: 9,  tol: 0.60 },
        Saturn:  { refTrop: 295.3818, refSid: 271.2396, expectedRashi: 10, tol: 0.50 }
      }
    },
    {
      id: 'REF-06',
      name: 'Daylight Saving Time (New York EDT)',
      jd: 2460117.1666666665,
      ayanamsa: 24.1805,
      planets: {
        Mercury: { refTrop: 78.7140,  refSid: 54.5335,  expectedRashi: 2,  tol: 0.15 },
        Venus:   { refTrop: 134.0986, refSid: 109.9181, expectedRashi: 4,  tol: 0.50 },
        Mars:    { refTrop: 138.6767, refSid: 114.4962, expectedRashi: 4,  tol: 0.15 },
        Jupiter: { refTrop: 37.5894,  refSid: 13.4089,  expectedRashi: 1,  tol: 0.60 },
        Saturn:  { refTrop: 337.1979, refSid: 313.0174, expectedRashi: 11, tol: 0.50 }
      }
    },
    {
      id: 'REF-07',
      name: 'Verified Retrograde Motion (Mars & Jupiter)',
      jd: 2459883.5,
      ayanamsa: 24.1716,
      planets: {
        Mercury: { refTrop: 211.9947, refSid: 187.8231, expectedRashi: 7,  tol: 0.15 },
        Venus:   { refTrop: 219.6147, refSid: 195.4431, expectedRashi: 7,  tol: 0.50 },
        Mars:    { refTrop: 85.6126,  refSid: 61.4410,  expectedRashi: 3,  tol: 0.15 },
        Jupiter: { refTrop: 359.7695, refSid: 335.5979, expectedRashi: 12, tol: 0.60 },
        Saturn:  { refTrop: 318.6414, refSid: 294.4698, expectedRashi: 10, tol: 0.50 }
      }
    },
    {
      id: 'REF-08',
      name: 'Navamsha Boundary Case (2010-11-10)',
      jd: 2455510.7604166665,
      ayanamsa: 24.0045,
      planets: {
        Mercury: { refTrop: 241.9024, refSid: 217.8979, expectedRashi: 8,  tol: 0.15 },
        Venus:   { refTrop: 209.1762, refSid: 185.1717, expectedRashi: 7,  tol: 0.50 },
        Mars:    { refTrop: 249.3859, refSid: 225.3814, expectedRashi: 8,  tol: 0.15 },
        Jupiter: { refTrop: 353.6177, refSid: 329.6132, expectedRashi: 11, tol: 0.60 },
        Saturn:  { refTrop: 192.5093, refSid: 168.5048, expectedRashi: 6,  tol: 0.50 }
      }
    },
    {
      id: 'REF-09',
      name: 'Sunrise Ascendant Defect Validation',
      jd: 2451544.572222222,
      ayanamsa: 23.8530,
      planets: {
        Mercury: { refTrop: 271.2240, refSid: 247.3710, expectedRashi: 9,  tol: 0.15 },
        Venus:   { refTrop: 241.0487, refSid: 217.1957, expectedRashi: 8,  tol: 0.50 },
        Mars:    { refTrop: 327.6315, refSid: 303.7785, expectedRashi: 11, tol: 0.15 },
        Jupiter: { refTrop: 25.2359,  refSid: 1.3829,   expectedRashi: 1,  tol: 0.60 },
        Saturn:  { refTrop: 40.4043,  refSid: 16.5513,  expectedRashi: 1,  tol: 0.50 }
      }
    }
  ];

  const planetFns = {
    Mercury: mercuryLongitude,
    Venus: venusLongitude,
    Mars: marsLongitude,
    Jupiter: jupiterLongitude,
    Saturn: saturnLongitude
  };

  // 1. Numerical Accuracy across all 9 Reference Cases (45 planetary checks)
  for (const c of benchmarkCases) {
    for (const [pName, pData] of Object.entries(c.planets)) {
      const calcTrop = planetFns[pName](c.jd);
      const delta = normDiff(calcTrop, pData.refTrop);
      const deltaArcMin = Math.abs(delta * 60).toFixed(1);
      assert(
        Math.abs(delta) <= pData.tol,
        `[${c.id}] ${pName} longitude matches JPL within ${(pData.tol * 60).toFixed(0)}' (err: ${delta >= 0 ? '+' : ''}${delta.toFixed(4)}°, ${deltaArcMin}')`,
        `Expected: ${pData.refTrop}°, Got: ${calcTrop.toFixed(4)}°`
      );
    }
  }

  // 2. Anti-Heliocentric Defect Regression Guard (Checking that geocentric vector projection is active)
  const ref01Merc = mercuryLongitude(2451265.746527778);
  const helioDistMerc = Math.abs(normDiff(ref01Merc, 185.06));
  assert(
    helioDistMerc > 100,
    `[Defect Guard] Mercury calculation rejects defective heliocentric longitude (divergence ${helioDistMerc.toFixed(1)}° > 100°)`,
    `Got ${ref01Merc.toFixed(2)}° vs heliocentric 185.06°`
  );

  const ref01Venus = venusLongitude(2451265.746527778);
  const helioDistVenus = Math.abs(normDiff(ref01Venus, 70.27));
  assert(
    helioDistVenus > 25,
    `[Defect Guard] Venus calculation rejects defective heliocentric longitude (divergence ${helioDistVenus.toFixed(1)}° > 25°)`,
    `Got ${ref01Venus.toFixed(2)}° vs heliocentric 70.27°`
  );

  // 3. Angular Normalization & Boundary Wraparound [0, 360) (45 normalization checks)
  for (const c of benchmarkCases) {
    for (const [pName] of Object.entries(c.planets)) {
      const val = planetFns[pName](c.jd);
      assert(val >= 0 && val < 360, `[${c.id}] ${pName} normalized in [0, 360): ${val.toFixed(2)}°`);
    }
  }

  // Boundary cases
  const mercRef02 = mercuryLongitude(2451647.9895833335);
  assert(mercRef02 >= 0 && mercRef02 < 2.0, `[Wraparound] Mercury near 0° wraps properly without negative or >=360 values (${mercRef02.toFixed(4)}°)`);

  const jupRef07 = jupiterLongitude(2459883.5);
  assert(jupRef07 > 358.0 && jupRef07 < 360.0, `[Wraparound] Jupiter near 360° wraps properly without overflow (${jupRef07.toFixed(4)}°)`);

  // 4. Preservation of Phase 4B.1 Ascendant Outputs
  const ascRef01 = calculateAscendant(2451265.746527778, 16.8302, 75.71);
  const ascDelta01 = Math.abs(normDiff(ascRef01, 87.4326));
  assert(
    ascDelta01 < 0.01,
    `[Ascendant Guard] Phase 4B.1 calculateAscendant is 100% preserved on REF-01 (delta: ${(ascDelta01 * 60).toFixed(4)}')`
  );

  const ascRef02 = calculateAscendant(2451647.9895833335, 23.1765, 75.7885);
  const ascDelta02 = Math.abs(normDiff(ascRef02, 183.6864));
  assert(
    ascDelta02 < 0.01,
    `[Ascendant Guard] Phase 4B.1 calculateAscendant is 100% preserved on REF-02 (delta: ${(ascDelta02 * 60).toFixed(4)}')`
  );

  // 5. Kundali Integration & Sidereal Rashi Placement Contract
  const kundali = generateKundali('1999-03-28', '11:25', 16.8302, 75.71, 5.5, 'LAHIRI');
  assert(Array.isArray(kundali.planets), 'Kundali: returns valid planets array');

  for (const [pName, pData] of Object.entries(benchmarkCases[0].planets)) {
    const pObj = kundali.planets.find(p => p.name === pName);
    assert(pObj !== undefined, `Kundali: contains planet ${pName}`);
    assert(typeof pObj.longitude === 'number', `Kundali: ${pName} longitude is numeric`);
    assert(pObj.rashi === pData.expectedRashi, `Kundali: ${pName} placed in correct sidereal Rashi ${pData.expectedRashi} (got ${pObj.rashi} ${pObj.rashiName})`);
  }

  console.log(`Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
