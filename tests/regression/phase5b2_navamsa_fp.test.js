/**
 * Phase 5B.2 Navamsha & Floating-Point Boundary Certification Suite
 *
 * Verifies:
 * 1. Independent derivation of all 108 Navamsa divisions matching Parashara elemental triplicities.
 * 2. Floating-point boundary behavior: exact boundary, preceding float, following float, and offsets.
 * 3. Cross-helper consistency across getRashi, getDegreeInRashi, getNakshatra, getNakshatraPada, getNavamsaRashi.
 */

import {
  getRashi,
  getDegreeInRashi,
  getNakshatra,
  getNakshatraPada,
  getNavamsaRashi
} from '../../src/engines/astrology/ephemeris.js';

function nextAfter(val, dir) {
  const buf = new ArrayBuffer(8);
  const f64 = new Float64Array(buf);
  const u64 = new BigUint64Array(buf);
  f64[0] = val;
  if (Number.isNaN(val)) return NaN;
  if (val === dir) return val;
  let bits = u64[0];
  const sign = bits >> 63n;
  if (val === 0) return dir > 0 ? Number.MIN_VALUE : -Number.MIN_VALUE;
  if ((dir > val && sign === 0n) || (dir < val && sign === 1n)) bits += 1n;
  else bits -= 1n;
  u64[0] = bits;
  return f64[0];
}

function deriveClassicalNavamsa(p) {
  const signIdx = Math.floor(p / 9); // 0..11
  const padaInSign = p % 9; // 0..8
  const signNum = signIdx + 1;
  let startSign;
  if ([1, 5, 9].includes(signNum)) startSign = 1; // Fire -> Aries
  else if ([2, 6, 10].includes(signNum)) startSign = 10; // Earth -> Capricorn
  else if ([3, 7, 11].includes(signNum)) startSign = 7; // Air -> Libra
  else startSign = 4; // Water -> Cancer

  return ((startSign - 1 + padaInSign) % 12) + 1;
}

export function runPhase5B2NavamsaFPTests() {
  const suiteName = "Phase 5B.2 Navamsha & Floating-Point Certification";
  console.log(`\n--- Running ${suiteName} ---`);
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // 1. Classical Parashara Navamsha derivation for all 108 divisions
  for (let p = 0; p < 108; p++) {
    const startDeg = (p * 360) / 108;
    const midDeg = startDeg + (360 / 216); // midpoint
    const exp = deriveClassicalNavamsa(p);
    const actStart = getNavamsaRashi(startDeg);
    const actMid = getNavamsaRashi(midDeg);
    assert(
      actStart === exp && actMid === exp,
      `Navamsa pada ${p+1}/108 (${startDeg.toFixed(4)}°): expected Rashi ${exp}, got start=${actStart}, mid=${actMid}`
    );
  }

  // 2. Floating-point boundary behavior for 12 sign boundaries & key nakshatras
  const testBoundaries = [
    0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
    13.333333333333334, 26.666666666666668, 40.0, 53.333333333333336
  ];

  for (const b of testBoundaries) {
    const prev = (b === 0) ? nextAfter(360, -Infinity) : nextAfter(b, -Infinity);
    const next = nextAfter(b, Infinity);
    const minus = (b === 0) ? 360 - 1e-6 : b - 1e-6;
    const plus = b + 1e-6;

    const navExact = getNavamsaRashi(b);
    const navPrev = getNavamsaRashi(prev);
    const navNext = getNavamsaRashi(next);
    const navMinus = getNavamsaRashi(minus);
    const navPlus = getNavamsaRashi(plus);

    assert(navExact === navNext && navExact === navPlus, `Boundary ${b}°: exact and following map to same Navamsa (${navExact})`);
    assert(navPrev === navMinus, `Boundary ${b}°: preceding float and small minus offset map to same preceding Navamsa (${navPrev})`);
    assert(navPrev !== navExact, `Boundary ${b}°: preceding float is not pushed into next segment (${navPrev} !== ${navExact})`);
  }

  // 3. Consistency across helpers for non-finite & edge inputs
  const invalidInputs = [NaN, Infinity, -Infinity, null, undefined, "invalid", {}];
  for (const inv of invalidInputs) {
    assert(
      getRashi(inv) === null &&
      Number.isNaN(getDegreeInRashi(inv)) &&
      getNakshatra(inv) === null &&
      getNakshatraPada(inv) === null &&
      getNavamsaRashi(inv) === null,
      `Invalid input ${String(inv)} safely returns null/NaN across all 5 helpers`
    );
  }

  // 4. Multi-revolution and negative normalization consistency
  const angles = [0, 360, 720, -360, -720];
  for (const a of angles) {
    assert(
      getRashi(a) === 1 &&
      Math.abs(getDegreeInRashi(a) - 0) < 1e-7 &&
      getNakshatra(a) === 1 &&
      getNakshatraPada(a) === 1 &&
      getNavamsaRashi(a) === 1,
      `Revolution angle ${a}° consistently normalizes to Aries Ashwini Pada 1 Navamsha 1`
    );
  }

  console.log(`\n${suiteName} Suite Results: ${passed}/${total} passed`);
  return { suite: suiteName, passed, total };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ""))) {
  runPhase5B2NavamsaFPTests();
}
