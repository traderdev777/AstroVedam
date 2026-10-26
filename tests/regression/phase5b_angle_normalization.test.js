/**
 * Test Suite: Phase 5B Angle Normalization & Boundary Safety Verification
 * Verifies DEF-03 fixes in getDegreeInRashi, getNakshatra, getNakshatraPada, and getNavamsaRashi.
 */

import {
  getRashi,
  getDegreeInRashi,
  getNakshatra,
  getNakshatraPada,
  getNavamsaRashi
} from "../../src/engines/astrology/ephemeris.js";

export async function runAngleNormalizationTests() {
  const suiteName = "Phase 5B Angle Normalization & Boundaries (DEF-03)";
  console.log(`\n--- Running ${suiteName} ---`);

  let passed = 0;
  let total = 0;

  function assert(condition, message, detail = "") {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      if (detail) console.error(`     Detail: ${detail}`);
    }
  }

  // 1. Modulo Periodic Equivalence (0°, 360°, 720°)
  assert(getRashi(0) === 1 && getRashi(360) === 1 && getRashi(720) === 1, "Rashi equivalence across revolutions (0°, 360°, 720° -> Rashi 1)");
  assert(getDegreeInRashi(0) === 0 && getDegreeInRashi(360) === 0 && getDegreeInRashi(720) === 0, "Degree equivalence across revolutions (0°, 360°, 720° -> 0°)");
  assert(getNakshatra(0) === 1 && getNakshatra(360) === 1 && getNakshatra(720) === 1, "Nakshatra equivalence across revolutions (Ashwini, Nak 1)");
  assert(getNakshatraPada(0) === 1 && getNakshatraPada(360) === 1 && getNakshatraPada(720) === 1, "Nakshatra pada equivalence across revolutions (Pada 1)");
  assert(getNavamsaRashi(0) === 1 && getNavamsaRashi(360) === 1 && getNavamsaRashi(720) === 1, "Navamsha rashi equivalence across revolutions (Aries Navamsha, Rashi 1)");

  // 2. Negative angle mapping (-1° == 359° == -721°)
  assert(getRashi(-1) === 12 && getRashi(359) === 12 && getRashi(-721) === 12, "Negative angle correctly maps to Pisces (Rashi 12)");
  assert(Math.abs(getDegreeInRashi(-1) - 29.0) < 1e-6, "Negative -1° degree in Pisces is 29°");
  assert(getNakshatra(-1) === 27 && getNakshatra(359) === 27 && getNakshatra(-721) === 27, "Negative -1° nakshatra correctly maps to Revati (Nak 27)");
  assert(getNakshatraPada(-1) === 4 && getNakshatraPada(359) === 4 && getNakshatraPada(-721) === 4, "Negative -1° pada correctly maps to Pada 4");
  assert(getNavamsaRashi(-1) === 12 && getNavamsaRashi(359) === 12 && getNavamsaRashi(-721) === 12, "Negative -1° Navamsha correctly maps to Pisces (Rashi 12)");

  // 3. Multi-revolution positive angle (361° == 721° == 1°)
  assert(getRashi(361) === 1 && getRashi(721) === 1 && getRashi(1) === 1, "Positive >360° angle maps to Aries (Rashi 1)");
  assert(Math.abs(getDegreeInRashi(361) - 1.0) < 1e-6, "361° degree in Aries is 1°");
  assert(getNakshatra(361) === 1 && getNakshatra(721) === 1, "361° nakshatra maps to Ashwini (Nak 1)");
  assert(getNakshatraPada(361) === 1, "361° pada maps to Pada 1");
  assert(getNavamsaRashi(361) === 1, "361° navamsha maps to Aries (Rashi 1)");

  // 4. Critical Rashi boundaries
  // Just before Taurus ingress: 29.99999°
  assert(getRashi(29.99999) === 1, "29.99999° is Aries (Rashi 1)");
  assert(getNakshatra(29.99999) === 3, "29.99999° is Krittika (Nak 3)");
  assert(getNakshatraPada(29.99999) === 1, "29.99999° is Krittika Pada 1");
  assert(getNavamsaRashi(29.99999) === 9, "29.99999° is Sagittarius Navamsha (Rashi 9)");

  // Exact Taurus ingress: 30.00000°
  assert(getRashi(30.0) === 2, "30.0° is Taurus (Rashi 2)");
  assert(Math.abs(getDegreeInRashi(30.0) - 0.0) < 1e-6, "30.0° is 0° in Taurus");
  assert(getNakshatra(30.0) === 3, "30.0° is Krittika (Nak 3)");
  assert(getNakshatraPada(30.0) === 2, "30.0° is Krittika Pada 2");
  assert(getNavamsaRashi(30.0) === 10, "30.0° is Capricorn Navamsha (Rashi 10)");

  // 5. Critical Nakshatra boundaries (Ashwini to Bharani: 13.333333°)
  const ashwiniBharani = 360 / 27; // 13.333333333333334
  assert(getNakshatra(ashwiniBharani - 1e-7) === 1, "Immediately before boundary is Ashwini (Nak 1)");
  assert(getNakshatraPada(ashwiniBharani - 1e-7) === 4, "Immediately before boundary is Ashwini Pada 4");
  assert(getNavamsaRashi(ashwiniBharani - 1e-7) === 4, "Immediately before boundary is Cancer Navamsha (Rashi 4)");

  assert(getNakshatra(ashwiniBharani) === 2, "Exactly at boundary is Bharani (Nak 2)");
  assert(getNakshatraPada(ashwiniBharani) === 1, "Exactly at boundary is Bharani Pada 1");
  assert(getNavamsaRashi(ashwiniBharani) === 5, "Exactly at boundary is Leo Navamsha (Rashi 5)");

  // 6. Non-finite, NaN, and invalid input safety
  assert(getRashi(NaN) === null, "getRashi(NaN) returns null");
  assert(Number.isNaN(getDegreeInRashi(NaN)), "getDegreeInRashi(NaN) returns NaN");
  assert(getNakshatra(NaN) === null, "getNakshatra(NaN) returns null");
  assert(getNakshatraPada(NaN) === null, "getNakshatraPada(NaN) returns null");
  assert(getNavamsaRashi(NaN) === null, "getNavamsaRashi(NaN) returns null");

  assert(getRashi(Infinity) === null, "getRashi(Infinity) returns null");
  assert(Number.isNaN(getDegreeInRashi(Infinity)), "getDegreeInRashi(Infinity) returns NaN");
  assert(getNakshatra(Infinity) === null, "getNakshatra(Infinity) returns null");
  assert(getNakshatraPada(Infinity) === null, "getNakshatraPada(Infinity) returns null");
  assert(getNavamsaRashi(Infinity) === null, "getNavamsaRashi(Infinity) returns null");

  assert(getRashi(-Infinity) === null, "getRashi(-Infinity) returns null");
  assert(Number.isNaN(getDegreeInRashi(-Infinity)), "getDegreeInRashi(-Infinity) returns NaN");
  assert(getNakshatra(-Infinity) === null, "getNakshatra(-Infinity) returns null");
  assert(getNakshatraPada(-Infinity) === null, "getNakshatraPada(-Infinity) returns null");
  assert(getNavamsaRashi(-Infinity) === null, "getNavamsaRashi(-Infinity) returns null");

  assert(getRashi("invalid") === null, "getRashi('invalid') returns null");
  assert(Number.isNaN(getDegreeInRashi("invalid")), "getDegreeInRashi('invalid') returns NaN");
  assert(getNakshatra("invalid") === null, "getNakshatra('invalid') returns null");
  assert(getNakshatraPada("invalid") === null, "getNakshatraPada('invalid') returns null");
  assert(getNavamsaRashi("invalid") === null, "getNavamsaRashi('invalid') returns null");

  console.log(`\nPhase 5B Angle Normalization Suite Results: ${passed}/${total} passed`);
  return { suite: suiteName, passed, total };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ""))) {
  runAngleNormalizationTests();
}
