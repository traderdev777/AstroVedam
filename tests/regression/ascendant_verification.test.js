/**
 * Test Suite: Ascendant (Lagna) Astronomical Verification
 * Phase 4B.1: Isolated validation of corrected calculateAscendant()
 * against independent IAU spherical astronomy reference values.
 */

import { calculateAscendant, dateToJD, julianCenturies } from "../../src/engines/astrology/ephemeris.js";
import { generateKundali } from "../../src/engines/astrology/kundali.js";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function norm360(deg) {
  let r = deg % 360;
  return r < 0 ? r + 360 : r;
}

function signedDiff(val, ref) {
  let diff = (val - ref) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

// Independent IAU spherical astronomy reference function (Meeus Ch. 14)
function calculateIndependentAscendant(jd, lat, lon) {
  const T = julianCenturies(jd);
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + T * T * (0.000387933 - T / 38710000);
  GMST = norm360(GMST);
  const LST = norm360(GMST + lon);
  const LSTrad = LST * DEG;
  const latRad = lat * DEG;
  const eps = (23.4393 - 0.013 * T) * DEG;

  const y = Math.cos(LSTrad);
  const x = -Math.sin(eps) * Math.tan(latRad) - Math.cos(eps) * Math.sin(LSTrad);
  return norm360(Math.atan2(y, x) * RAD);
}

export async function runAscendantTests() {
  const suiteName = "Ascendant (Lagna) Astronomical Verification";
  console.log("\n--- Running " + suiteName + " ---");

  let passed = 0;
  let total = 0;

  function assert(condition, message, detail = "") {
    total++;
    if (condition) {
      console.log("  ✅ PASS: " + message);
      passed++;
    } else {
      console.error("  ❌ FAIL: " + message);
      if (detail) console.error("     Detail: " + detail);
    }
  }

  // 9 Canonical Astronomical Reference Cases
  const referenceCases = [
    { id: "REF-01", name: "Vijayapura Standard", date: "1999-03-28", time: "11:25", tz: 5.5, lat: 16.8302, lon: 75.71, expectedSidRashi: 3 }, // Gemini
    { id: "REF-02", name: "Ujjain Ingress", date: "2000-04-13", time: "17:15", tz: 5.5, lat: 23.1765, lon: 75.7885, expectedSidRashi: 6 }, // Virgo
    { id: "REF-03", name: "Varanasi Gandanta", date: "1999-03-28", time: "10:35", tz: 5.5, lat: 25.3176, lon: 82.9739, expectedSidRashi: 3 }, // Gemini
    { id: "REF-04", name: "New Delhi Leap Century", date: "2000-02-29", time: "17:30", tz: 5.5, lat: 28.6139, lon: 77.209, expectedSidRashi: 5 }, // Leo
    { id: "REF-05", name: "Sydney Southern Hemisphere", date: "2020-09-22", time: "06:00", tz: 10.0, lat: -33.8688, lon: 151.2093, expectedSidRashi: 6 }, // Virgo
    { id: "REF-06", name: "New York EDT (UTC-4)", date: "2023-06-21", time: "12:00", tz: -4.0, lat: 40.7128, lon: -74.006, expectedSidRashi: 5 }, // Leo
    { id: "REF-07", name: "Bengaluru Retrograde", date: "2022-10-31", time: "05:30", tz: 5.5, lat: 12.9716, lon: 77.5946, expectedSidRashi: 7 }, // Libra
    { id: "REF-08", name: "Ayodhya Navamsha", date: "2010-11-10", time: "11:45", tz: 5.5, lat: 26.7922, lon: 82.1998, expectedSidRashi: 10 }, // Capricorn
    { id: "REF-09", name: "New Delhi Sunrise", date: "2000-01-01", time: "07:14", tz: 5.5, lat: 28.6139, lon: 77.209, expectedSidRashi: 9 } // Sagittarius
  ];

  // 1. Direct calculateAscendant Accuracy & 180° Inversion Guard for all 9 cases
  for (const c of referenceCases) {
    const [y, m, d] = c.date.split("-").map(Number);
    const [hh, mm] = c.time.split(":").map(Number);
    const tzHours = Math.floor(c.tz);
    const tzMins = Math.round((c.tz - tzHours) * 60);
    let utcMin = mm - tzMins;
    let utcHour = hh - tzHours;
    if (utcMin < 0) { utcMin += 60; utcHour -= 1; }
    if (utcMin >= 60) { utcMin -= 60; utcHour += 1; }
    const jd = dateToJD(y, m, d, utcHour, utcMin);

    const prodAscTrop = calculateAscendant(jd, c.lat, c.lon);
    const refAscTrop = calculateIndependentAscendant(jd, c.lat, c.lon);

    const deltaDeg = Math.abs(signedDiff(prodAscTrop, refAscTrop));
    const deltaArcMin = deltaDeg * 60;

    assert(deltaArcMin < 0.01, "[" + c.id + "] calculateAscendant matches independent IAU reference within 0.01 arcmin (" + deltaArcMin.toFixed(4) + "')");
    assert(Math.abs(deltaDeg - 180) > 10, "[" + c.id + "] Ascendant is NOT inverted by 180° (anti-Descendant guard)");

    // Verify Kundali integration
    const kundali = generateKundali(c.date, c.time, c.lat, c.lon, c.tz, "LAHIRI");
    assert(kundali.lagna && typeof kundali.lagna.longitude === "number", "[" + c.id + "] Kundali lagna object valid");
    assert(kundali.lagna.rashi === c.expectedSidRashi, "[" + c.id + "] Kundali lagna rashi correctly matches sidereal " + c.expectedSidRashi + " (got " + kundali.lagna.rashi + " " + kundali.lagna.rashiName + ")");
  }

  // 2. Physical Sunrise Horizon Consistency (REF-09)
  const sunriseCase = referenceCases.find(c => c.id === "REF-09");
  const sunriseKundali = generateKundali(sunriseCase.date, sunriseCase.time, sunriseCase.lat, sunriseCase.lon, sunriseCase.tz, "LAHIRI");
  const sunPlanet = sunriseKundali.planets.find(p => p.name === "Sun");
  const ascSunDelta = Math.abs(signedDiff(sunriseKundali.lagna.longitude, sunPlanet.longitude));
  assert(ascSunDelta < 2.0, "[Sunrise Test] Ascendant is conjunct rising Sun at sunrise (delta: " + ascSunDelta.toFixed(2) + "° < 2.0°)");

  // 3. Southern Hemisphere Consistency (REF-05)
  const sydCase = referenceCases.find(c => c.id === "REF-05");
  const sydKundali = generateKundali(sydCase.date, sydCase.time, sydCase.lat, sydCase.lon, sydCase.tz, "LAHIRI");
  assert(sydKundali.lagna.rashi === 6, "[Southern Hemisphere] Sydney ascendant properly evaluates to Virgo (rashi 6)");
  assert(sydKundali.lagna.longitude >= 0 && sydKundali.lagna.longitude < 360, "[Southern Hemisphere] Longitude in [0, 360) range");

  // 4. Boundary Normalization [0, 360)
  const borderJd = dateToJD(2024, 3, 20, 12, 0);
  const ascBoundary1 = calculateAscendant(borderJd, 0.0, 0.0);
  assert(ascBoundary1 >= 0 && ascBoundary1 < 360, "[Boundary Normalization] Equator/Greenwich in [0, 360) (" + ascBoundary1.toFixed(2) + "°)");

  const ascBoundary2 = calculateAscendant(borderJd, -80.0, 179.9);
  assert(ascBoundary2 >= 0 && ascBoundary2 < 360, "[Boundary Normalization] Extreme south/east in [0, 360) (" + ascBoundary2.toFixed(2) + "°)");

  const ascBoundary3 = calculateAscendant(borderJd, 80.0, -179.9);
  assert(ascBoundary3 >= 0 && ascBoundary3 < 360, "[Boundary Normalization] Extreme north/west in [0, 360) (" + ascBoundary3.toFixed(2) + "°)");

  console.log("Suite Results: " + passed + "/" + total + " passed\n");
  return { suite: suiteName, passed, total };
}
