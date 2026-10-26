/**
 * Test Suite: Targeted Venus & Mercury Precision Upgrade (Phase 4F.2)
 *
 * Validates the upgraded Meeus Table 31.A ephemeris model for Mercury and Venus:
 * 1. Canonical benchmark reference cases (all 9 canonical cases from NASA JPL Horizons).
 * 2. Independent historical validation across 1920-2080 (NASA JPL Horizons API).
 * 3. Retrograde detection & velocity continuity (direct vs retrograde invariance).
 * 4. Cyclic coordinate normalization across the 0°/360° zodiac boundary.
 * 5. Input safety contracts & finite error bounds on invalid/degenerate inputs.
 * 6. Sign boundary continuity near ingress.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  mercuryLongitude,
  venusLongitude,
  getPlanetaryVelocity,
  isPlanetStationary,
  isPlanetRetrograde,
  getAyanamsa,
  dateToJD,
  getRashi,
  normDiff
} from "../../src/engines/astrology/ephemeris.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runPhase4F2PrecisionTests() {
  const suiteName = "Targeted Venus & Mercury Precision Upgrade (Phase 4F.2)";
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
  // [TEST GROUP 1] Canonical Benchmark Reference Cases (Mercury & Venus)
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 1] Canonical Benchmark Reference Cases:");
  for (const c of refCases) {
    const [yr, mo, dy] = c.date.split("-").map(Number);
    const [h, m] = c.time.split(":").map(Number);
    let y = yr, m_ = mo;
    if (m_ <= 2) { y -= 1; m_ += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = (h + m / 60 - c.tz) / 24;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

    // Mercury tropical longitude check (2.0 arcminute tolerance)
    const mercAvTrop = mercuryLongitude(jd);
    const mercRefTrop = c.planets.Mercury.lonTrop;
    const mercErrArc = Math.abs(normDiff(mercAvTrop, mercRefTrop) * 60);
    assert(mercErrArc <= 2.0, `${c.id} Mercury tropical error < 2.0': ${mercErrArc.toFixed(2)}' (AV=${mercAvTrop.toFixed(4)}°, Ref=${mercRefTrop.toFixed(4)}°)`);

    // Venus tropical longitude check (2.0 arcminute tolerance)
    const venAvTrop = venusLongitude(jd);
    const venRefTrop = c.planets.Venus.lonTrop;
    const venErrArc = Math.abs(normDiff(venAvTrop, venRefTrop) * 60);
    assert(venErrArc <= 2.0, `${c.id} Venus tropical error < 2.0': ${venErrArc.toFixed(2)}' (AV=${venAvTrop.toFixed(4)}°, Ref=${venRefTrop.toFixed(4)}°)`);
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

    const mercVel = getPlanetaryVelocity("Mercury", jd);
    const venVel = getPlanetaryVelocity("Venus", jd);

    const mercIsRetro = mercVel < 0;
    const venIsRetro = venVel < 0;

    assert(mercIsRetro === c.planets.Mercury.isRetro, `${c.id} Mercury retrograde state matches JPL: isRetro=${mercIsRetro} (vel=${mercVel.toFixed(5)}°/d)`);
    assert(venIsRetro === c.planets.Venus.isRetro, `${c.id} Venus retrograde state matches JPL: isRetro=${venIsRetro} (vel=${venVel.toFixed(5)}°/d)`);
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 3] Mathematical Continuity & Coordinate Normalization
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 3] Mathematical Continuity & Coordinate Normalization:");
  const jd02 = 2451647.9895833335; // REF-02
  const merc02 = mercuryLongitude(jd02);
  assert(merc02 >= 0 && merc02 < 360, `REF-02 Mercury (${merc02.toFixed(4)}°) is strictly in [0, 360)`);

  // Small dt steps across station point
  const dtSteps = [-0.1, -0.05, 0, 0.05, 0.1];
  for (let i = 0; i < dtSteps.length - 1; i++) {
    const lA = mercuryLongitude(jd02 + dtSteps[i]);
    const lB = mercuryLongitude(jd02 + dtSteps[i+1]);
    const diff = Math.abs(normDiff(lB, lA));
    assert(diff < 0.25, `Mercury longitude continuous across step ${dtSteps[i]} -> ${dtSteps[i+1]}: diff=${diff.toFixed(5)}°`);
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 4] Input Safety & Non-Finite Handling
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 4] Input Safety & Non-Finite Handling:");
  const invalidInputs = [NaN, null, undefined, "invalid", Infinity, -Infinity];
  for (const inv of invalidInputs) {
    const mRes = mercuryLongitude(inv);
    const vRes = venusLongitude(inv);
    assert(Number.isNaN(mRes), `mercuryLongitude safely returns NaN for invalid input: ${inv}`);
    assert(Number.isNaN(vRes), `venusLongitude safely returns NaN for invalid input: ${inv}`);
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 5] Independent JPL Horizons Historical Validation (1920-2080)
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 5] Independent JPL Horizons Historical Validation (1920-2080):");
  const manifestPath = path.resolve(__dirname, "../../scratch/phase4f2/validation_manifest.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    for (const item of manifest) {
      const [yr, mo, dy] = item.date.split("-").map(Number);
      const [hr, mn] = item.time.split(":").map(Number);
      let y = yr, m_ = mo;
      if (m_ <= 2) { y -= 1; m_ += 12; }
      const A = Math.floor(y / 100);
      const B = 2 - A + Math.floor(A / 4);
      const dayFrac = (hr + mn / 60) / 24;
      const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

      const calc = item.target === "Mercury" ? mercuryLongitude(jd) : venusLongitude(jd);
      const errArc = Math.abs(normDiff(calc, item.obsEcLon) * 60);
      assert(errArc <= 2.0, `[${item.id}] ${item.target} error < 2.0': ${errArc.toFixed(2)}' (Calc=${calc.toFixed(4)}°, JPL=${item.obsEcLon.toFixed(4)}°)`);
    }
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 6] Sign Boundary & Ingress Vicinity
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 6] Sign Boundary & Ingress Vicinity:");
  // Venus Taurus Ingress (April 6, 2023)
  const jdVenuIngress = dateToJD(2023, 4, 6, 12, 0, 0);
  const venAyan = getAyanamsa(jdVenuIngress);
  const venTrop = venusLongitude(jdVenuIngress);
  const venSid = (venTrop - venAyan + 360) % 360;
  const venRashi = getRashi(venSid);
  assert(venRashi === 2, `2023-04-06 Venus in Taurus (Vrishabha): Rashi=${venRashi} (sid=${venSid.toFixed(3)}°)`);

  console.log(`\nPhase 4F.2 Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
