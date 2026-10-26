/**
 * Test Suite: Targeted Moon Precision Upgrade (Phase 4F.4)
 *
 * Validates the upgraded Jean Meeus (1998) Chapter 47 ELP-2000/82 ephemeris model for the Moon:
 * 1. Canonical benchmark reference cases (all 9 canonical cases from NASA JPL Horizons, including REF-02).
 * 2. Independent multi-regime validation (10 diverse cases from NASA JPL Horizons: historical, future,
 *    lunar eclipse/phase, extreme perigee supermoon, and sign wrap boundaries).
 * 3. Lunar motion & velocity continuity (strictly direct motion, velocity within 11.0°/day to 16.0°/day).
 * 4. Cyclic coordinate normalization across the 0°/360° zodiac boundary.
 * 5. Downstream Nakshatra, Pada, and Rashi structural integrity.
 * 6. Input safety contracts & finite error bounds on invalid/degenerate inputs.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  moonLongitude,
  getPlanetaryVelocity,
  isPlanetRetrograde,
  getAyanamsa,
  dateToJD,
  getRashi,
  getNakshatra,
  getNakshatraPada,
  normDiff
} from "../../src/engines/astrology/ephemeris.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runPhase4F4PrecisionTests() {
  const suiteName = "Targeted Moon Precision Upgrade (Phase 4F.4)";
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

  // Load canonical reference cases
  const refPath = path.resolve(__dirname, "../../scratch/reference_cases.json");
  const refCases = JSON.parse(fs.readFileSync(refPath, "utf8"));

  // ---------------------------------------------------------------------------
  // [TEST GROUP 1] Canonical Benchmark Reference Cases (Moon)
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 1] Canonical Benchmark Reference Cases (Moon):");
  for (const c of refCases) {
    const [yr, mo, dy] = c.date.split("-").map(Number);
    const [h, m] = c.time.split(":").map(Number);
    let y = yr, m_ = mo;
    if (m_ <= 2) { y -= 1; m_ += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = (h + m / 60 - c.tz) / 24;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

    const moonAvTrop = moonLongitude(jd);
    const moonRefTrop = c.planets.Moon.lonTrop;
    const moonErrArc = Math.abs(normDiff(moonAvTrop, moonRefTrop) * 60);

    // Configured tolerance for Moon is 2.0 arcminutes
    assert(
      moonErrArc <= 2.0,
      `${c.id} Moon tropical error < 2.0': ${moonErrArc.toFixed(2)}' (AV=${moonAvTrop.toFixed(4)}°, Ref=${moonRefTrop.toFixed(4)}°)`
    );

    // Also verify sidereal correspondence
    const ayan = getAyanamsa(jd);
    const moonAvSid = (moonAvTrop - ayan + 360) % 360;
    const moonRefSid = (moonRefTrop - ayan + 360) % 360;
    const sidErrArc = Math.abs(normDiff(moonAvSid, moonRefSid) * 60);
    assert(
      sidErrArc <= 2.0,
      `${c.id} Moon sidereal error < 2.0': ${sidErrArc.toFixed(2)}' (AV_sid=${moonAvSid.toFixed(4)}°, Ref_sid=${moonRefSid.toFixed(4)}°)`
    );
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 2] Independent JPL Horizons Multi-Regime Validation
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 2] Independent JPL Horizons Multi-Regime Validation:");
  const indepPath = path.resolve(__dirname, "../../scratch/phase4f4/validation_manifest.json");
  if (fs.existsSync(indepPath)) {
    const indepCases = JSON.parse(fs.readFileSync(indepPath, "utf8"));
    for (const tc of indepCases) {
      const [datePart, timePart] = tc.dateUTC.split(" ");
      const [yr, mo, dy] = datePart.split("-").map(Number);
      const [hr, mn] = timePart.split(":").map(Number);
      let y = yr, m_ = mo;
      if (m_ <= 2) { y -= 1; m_ += 12; }
      const A = Math.floor(y / 100);
      const B = 2 - A + Math.floor(A / 4);
      const dayFrac = (hr + mn / 60) / 24;
      const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

      const moonAv = moonLongitude(jd);
      const moonRef = tc.refTropLon;
      const errArc = Math.abs(normDiff(moonAv, moonRef) * 60);

      assert(
        errArc <= 2.0,
        `[${tc.id}] ${tc.name} (${tc.regime}): Error < 2.0': ${errArc.toFixed(2)}' (AV=${moonAv.toFixed(4)}°, Ref=${moonRef.toFixed(4)}°)`
      );
    }
  } else {
    assert(false, "Independent validation manifest not found at " + indepPath);
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 3] Lunar Motion & Monotonic Velocity Invariants
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 3] Lunar Motion & Monotonic Velocity Invariants:");
  for (const c of refCases) {
    const [yr, mo, dy] = c.date.split("-").map(Number);
    const [h, m] = c.time.split(":").map(Number);
    let y = yr, m_ = mo;
    if (m_ <= 2) { y -= 1; m_ += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = (h + m / 60 - c.tz) / 24;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

    // In Vedic and Western astronomy, the Moon never retrogrades
    const isRetro = isPlanetRetrograde("Moon", jd);
    assert(isRetro === false, `${c.id} Moon isRetrograde is strictly false`);

    // Daily motion should be positive and within physically possible bounds [11.0°, 16.0°] per day
    const vel = getPlanetaryVelocity("Moon", jd);
    assert(
      vel > 11.0 && vel < 16.0,
      `${c.id} Moon daily velocity ${vel.toFixed(3)}°/day in valid range [11.0, 16.0]`
    );
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 4] Cyclic Coordinate Normalization & 0°/360° Wrap Continuity
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 4] Cyclic Coordinate Normalization & 0°/360° Wrap Continuity:");
  // Test time across 2023-03-21 15:30 to 16:30 where Moon crosses 0° Aries
  const wrapJD1 = dateToJD(2023, 3, 21, 15, 30, 0); // Before wrap (approx 359.7°)
  const wrapJD2 = dateToJD(2023, 3, 21, 16, 30, 0); // After wrap (approx 0.3°)
  const lon1 = moonLongitude(wrapJD1);
  const lon2 = moonLongitude(wrapJD2);

  assert(lon1 >= 0 && lon1 < 360, `Moon longitude at JD1 normalized in [0, 360): ${lon1.toFixed(4)}°`);
  assert(lon2 >= 0 && lon2 < 360, `Moon longitude at JD2 normalized in [0, 360): ${lon2.toFixed(4)}°`);

  // Diff across boundary using normDiff
  const diffCross = normDiff(lon2, lon1);
  assert(
    diffCross > 0.4 && diffCross < 0.7,
    `Smooth 1-hour angular progression across 0° boundary: ${diffCross.toFixed(4)}° (~0.55°/hr)`
  );

  // ---------------------------------------------------------------------------
  // [TEST GROUP 5] Downstream Nakshatra, Pada, and Rashi Integrity
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 5] Downstream Nakshatra, Pada, and Rashi Integrity:");
  for (const c of refCases) {
    const [yr, mo, dy] = c.date.split("-").map(Number);
    const [h, m] = c.time.split(":").map(Number);
    let y = yr, m_ = mo;
    if (m_ <= 2) { y -= 1; m_ += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = (h + m / 60 - c.tz) / 24;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

    const moonTrop = moonLongitude(jd);
    const ayan = getAyanamsa(jd);
    const moonSid = (moonTrop - ayan + 360) % 360;

    const rashiNum = getRashi(moonSid);
    assert(
      typeof rashiNum === "number" && rashiNum >= 1 && rashiNum <= 12,
      `${c.id} Moon Rashi number in [1..12]: ${rashiNum}`
    );

    const nakshatraNum = getNakshatra(moonSid);
    assert(
      typeof nakshatraNum === "number" && nakshatraNum >= 1 && nakshatraNum <= 27,
      `${c.id} Moon Nakshatra number in [1..27]: ${nakshatraNum}`
    );

    const pada = getNakshatraPada(moonSid);
    assert(
      typeof pada === "number" && pada >= 1 && pada <= 4,
      `${c.id} Moon Pada in [1..4]: ${pada}`
    );
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 6] Input Safety & Degenerate Input Handling
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 6] Input Safety & Degenerate Input Handling:");
  assert(Number.isNaN(moonLongitude(NaN)), "moonLongitude(NaN) returns NaN safely");
  assert(Number.isNaN(moonLongitude(Infinity)), "moonLongitude(Infinity) returns NaN safely");
  assert(Number.isNaN(moonLongitude(-Infinity)), "moonLongitude(-Infinity) returns NaN safely");
  assert(Number.isNaN(moonLongitude("invalid")), "moonLongitude('invalid') returns NaN safely");
  assert(Number.isNaN(moonLongitude(null)), "moonLongitude(null) returns NaN safely");

  console.log(`\nPhase 4F.4 Suite Results: ${passed}/${total} passed`);
  return { suite: suiteName, passed, total };
}
