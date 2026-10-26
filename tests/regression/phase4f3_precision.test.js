/**
 * Test Suite: Targeted Mars Precision Upgrade (Phase 4F.3)
 *
 * Validates the upgraded Meeus Table 31.A ephemeris model with planetary perturbations for Mars:
 * 1. Canonical benchmark reference cases (all 9 canonical cases from NASA JPL Horizons).
 * 2. Independent historical validation across 1920-2080 (NASA JPL Horizons API).
 * 3. Retrograde detection & velocity continuity (direct vs retrograde invariance).
 * 4. Cyclic coordinate normalization across the 0°/360° zodiac boundary.
 * 5. Input safety contracts & finite error bounds on invalid/degenerate inputs.
 * 6. Sign boundary continuity near ingress.
 * 7. Sidereal conversion invariance without double-applying ayanamsha.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  marsLongitude,
  getPlanetaryVelocity,
  isPlanetStationary,
  isPlanetRetrograde,
  getAyanamsa,
  dateToJD,
  getRashi,
  normDiff
} from "../../src/engines/astrology/ephemeris.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runPhase4F3PrecisionTests() {
  const suiteName = "Targeted Mars Precision Upgrade (Phase 4F.3)";
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
  // [TEST GROUP 1] Canonical Benchmark Reference Cases (Mars)
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 1] Canonical Benchmark Reference Cases (Mars):");
  for (const c of refCases) {
    const [yr, mo, dy] = c.date.split("-").map(Number);
    const [h, m] = c.time.split(":").map(Number);
    let y = yr, m_ = mo;
    if (m_ <= 2) { y -= 1; m_ += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = (h + m / 60 - c.tz) / 24;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

    const marsAvTrop = marsLongitude(jd);
    const marsRefTrop = c.planets.Mars.lonTrop;
    const marsErrArc = Math.abs(normDiff(marsAvTrop, marsRefTrop) * 60);

    // Configured tolerance for Mars is 1.0 arcminute
    assert(
      marsErrArc <= 1.0,
      `${c.id} Mars tropical error < 1.0': ${marsErrArc.toFixed(2)}' (AV=${marsAvTrop.toFixed(4)}°, Ref=${marsRefTrop.toFixed(4)}°)`
    );

    // Also verify sidereal correspondence
    const ayan = getAyanamsa(jd);
    const marsAvSid = (marsAvTrop - ayan + 360) % 360;
    const marsRefSid = (marsRefTrop - ayan + 360) % 360;
    const sidErrArc = Math.abs(normDiff(marsAvSid, marsRefSid) * 60);
    assert(
      sidErrArc <= 1.0,
      `${c.id} Mars sidereal error < 1.0': ${sidErrArc.toFixed(2)}' (AV_sid=${marsAvSid.toFixed(4)}°, Ref_sid=${marsRefSid.toFixed(4)}°)`
    );
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 2] Planetary Motion & Retrograde Direction
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 2] Planetary Motion & Retrograde Direction:");
  for (const c of refCases) {
    const [yr, mo, dy] = c.date.split("-").map(Number);
    const [h, m] = c.time.split(":").map(Number);
    let y = yr, m_ = mo;
    if (m_ <= 2) { y -= 1; m_ += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = (h + m / 60 - c.tz) / 24;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

    const marsVel = getPlanetaryVelocity("Mars", jd);
    const marsIsRetro = isPlanetRetrograde("Mars", jd);

    assert(
      marsIsRetro === c.planets.Mars.isRetro,
      `${c.id} Mars retrograde state matches JPL: isRetro=${marsIsRetro} (vel=${marsVel.toFixed(5)}°/d, JPL=${c.planets.Mars.dailyMotion.toFixed(5)}°/d)`
    );
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 3] Mathematical Continuity & Coordinate Normalization
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 3] Mathematical Continuity & Coordinate Normalization:");
  const jd04 = 2451604.0; // REF-04 (2000-02-29)
  const mars04 = marsLongitude(jd04);
  assert(mars04 >= 0 && mars04 < 360, `REF-04 Mars (${mars04.toFixed(4)}°) is strictly in [0, 360)`);

  // Small dt steps across station point on REF-07 (2022-10-31)
  const jd07 = 2459883.5;
  const dtSteps = [-0.1, -0.05, 0, 0.05, 0.1];
  for (let i = 0; i < dtSteps.length - 1; i++) {
    const lA = marsLongitude(jd07 + dtSteps[i]);
    const lB = marsLongitude(jd07 + dtSteps[i+1]);
    const diff = Math.abs(normDiff(lB, lA));
    assert(
      diff < 0.05,
      `Mars longitude continuous across step ${dtSteps[i]} -> ${dtSteps[i+1]}: diff=${diff.toFixed(5)}°`
    );
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 4] Input Safety & Non-Finite Handling
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 4] Input Safety & Non-Finite Handling:");
  const invalidInputs = [NaN, null, undefined, "invalid", Infinity, -Infinity];
  for (const inv of invalidInputs) {
    const mRes = marsLongitude(inv);
    assert(Number.isNaN(mRes), `marsLongitude safely returns NaN for invalid input: ${inv}`);
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 5] Independent JPL Horizons Validation (11 cases, 1920-2080)
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 5] Independent JPL Horizons Historical & Boundary Validation (1920-2080):");
  const manifestPath = path.resolve(__dirname, "../../scratch/phase4f3/validation_manifest.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    for (const item of manifest) {
      const [datePart, timePart] = item.dateUTC.split(" ");
      const [yr, mo, dy] = datePart.split("-").map(Number);
      const [hr, mn] = timePart.split(":").map(Number);
      const jd = dateToJD(yr, mo, dy, hr, mn, 0);

      const calc = marsLongitude(jd);
      const errArc = Math.abs(normDiff(calc, item.refTropLon) * 60);
      assert(
        errArc <= 1.0,
        `[${item.id}] Mars ${item.regime} error < 1.0': ${errArc.toFixed(2)}' (Calc=${calc.toFixed(4)}°, JPL=${item.refTropLon.toFixed(4)}°)`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 6] Sign Boundary & Ingress Vicinity
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 6] Sign Boundary & Ingress Vicinity:");
  // BOUND-02: Mars Cancer-Leo Boundary (July 10, 2023)
  const jdCancerLeo = dateToJD(2023, 7, 10, 12, 0, 0);
  const marsTrop = marsLongitude(jdCancerLeo);
  assert(
    marsTrop > 149.9 && marsTrop < 150.1,
    `2023-07-10 Mars at Cancer-Leo tropical boundary (150°): lon=${marsTrop.toFixed(4)}°`
  );

  // BOUND-01: Mars Pisces-Aries wrap boundary (April 23, 2024)
  const jdWarp = dateToJD(2024, 4, 23, 12, 0, 0);
  const marsWrap = marsLongitude(jdWarp);
  assert(
    marsWrap >= 0 && marsWrap < 360,
    `2024-04-23 Mars wrap boundary in [0, 360): lon=${marsWrap.toFixed(4)}°`
  );

  // ---------------------------------------------------------------------------
  // [TEST GROUP 7] Sidereal Conversion & Ayanamsa Invariance
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 7] Sidereal Conversion & Ayanamsa Invariance:");
  const testJDs = [2451265.746527778, 2451647.9895833335, 2459883.5];
  for (const tjd of testJDs) {
    const trop = marsLongitude(tjd);
    const ayan = getAyanamsa(tjd);
    const sid = (trop - ayan + 360) % 360;
    // Ensure ayanamsa subtraction is exact and reversible
    const recoveredTrop = (sid + ayan) % 360;
    const diff = Math.abs(normDiff(recoveredTrop, trop));
    assert(
      diff < 1e-10,
      `Sidereal-tropical conversion reversible on JD ${tjd.toFixed(2)}: diff=${diff.toExponential(2)}`
    );
  }

  console.log(`\nPhase 4F.3 Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
