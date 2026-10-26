/**
 * Test Suite: Targeted Saturn Precision Upgrade (Phase 4F.5)
 *
 * Validates the upgraded VSOP87D ephemeris model for Saturn:
 * 1. Canonical benchmark reference cases (all 9 canonical cases from NASA JPL Horizons, including REF-06).
 * 2. Independent multi-regime validation (10 diverse cases from NASA JPL Horizons: historical, future,
 *    stationary retrograde, stationary direct, peak retrograde opposition, and sign wrap boundaries).
 * 3. Saturn planetary velocity & retrograde continuity (stationary turns, retrograde flag, velocity bounds).
 * 4. Cyclic coordinate normalization across the 0°/360° zodiac boundary.
 * 5. Downstream Sade Sati, Dhaiya, and transit structural integrity.
 * 6. Input safety contracts & finite error bounds on invalid/degenerate inputs.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  saturnLongitude,
  getPlanetaryVelocity,
  isPlanetRetrograde,
  getAyanamsa,
  calculateSaturnTransit,
  getRashi,
  normDiff
} from "../../src/engines/astrology/ephemeris.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runPhase4F5PrecisionTests() {
  const suiteName = "Targeted Saturn Precision Upgrade (Phase 4F.5)";
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
  // [TEST GROUP 1] Canonical Benchmark Reference Cases (Saturn)
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 1] Canonical Benchmark Reference Cases (Saturn):");
  for (const c of refCases) {
    const [yr, mo, dy] = c.date.split("-").map(Number);
    const [h, m] = c.time.split(":").map(Number);
    let y = yr, m_ = mo;
    if (m_ <= 2) { y -= 1; m_ += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFrac = (h + m / 60 - c.tz) / 24;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m_ + 1)) + dy + B - 1524.5 + dayFrac;

    const saturnAvTrop = saturnLongitude(jd);
    const saturnRefTrop = c.planets.Saturn.lonTrop;
    const saturnErrArc = Math.abs(normDiff(saturnAvTrop, saturnRefTrop) * 60);

    // Configured tolerance for Saturn is 1.0 arcminute
    assert(
      saturnErrArc <= 1.0,
      `${c.id} Saturn tropical error < 1.0': ${saturnErrArc.toFixed(2)}' (AV=${saturnAvTrop.toFixed(4)}°, Ref=${saturnRefTrop.toFixed(4)}°)`
    );

    // Also verify sidereal correspondence
    const ayan = getAyanamsa(jd);
    const saturnAvSid = (saturnAvTrop - ayan + 360) % 360;
    const saturnRefSid = (saturnRefTrop - ayan + 360) % 360;
    const sidErrArc = Math.abs(normDiff(saturnAvSid, saturnRefSid) * 60);
    assert(
      sidErrArc <= 1.0,
      `${c.id} Saturn sidereal error < 1.0': ${sidErrArc.toFixed(2)}' (AV_sid=${saturnAvSid.toFixed(4)}°, Ref_sid=${saturnRefSid.toFixed(4)}°)`
    );
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 2] Independent JPL Horizons Multi-Regime Validation
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 2] Independent JPL Horizons Multi-Regime Validation:");
  const indepPath = path.resolve(__dirname, "../../scratch/phase4f5/validation_manifest.json");
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

      const saturnAvTrop = saturnLongitude(jd);
      const saturnRefTrop = tc.refTropLon;
      const errArc = Math.abs(normDiff(saturnAvTrop, saturnRefTrop) * 60);

      assert(
        errArc <= 1.0,
        `[${tc.id}] ${tc.name} (${tc.regime}): Error < 1.0': ${errArc.toFixed(2)}' (AV=${saturnAvTrop.toFixed(4)}°, Ref=${saturnRefTrop.toFixed(4)}°)`
      );
    }
  } else {
    assert(false, "Independent validation manifest not found", indepPath);
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 3] Saturn Planetary Velocity & Retrograde Continuity
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 3] Saturn Planetary Velocity & Retrograde Continuity:");
  // Peak retrograde opposition date (RETRO-01: 2023-08-27)
  const jdRetro = 2460183.8333; // 2023-08-27 08:00 UTC
  const isRetro = isPlanetRetrograde("Saturn", jdRetro);
  const velRetro = getPlanetaryVelocity("Saturn", jdRetro);
  assert(isRetro === true, "RETRO-01 Saturn isRetrograde is strictly true during opposition");
  assert(velRetro < 0, `RETRO-01 Saturn velocity is negative: ${velRetro.toFixed(4)}°/day`);

  // Direct motion date (REF-01: 2000-05-15)
  const jdDirect = 2451679.9167;
  const isDirect = isPlanetRetrograde("Saturn", jdDirect);
  const velDirect = getPlanetaryVelocity("Saturn", jdDirect);
  assert(isDirect === false, "REF-01 Saturn isRetrograde is strictly false during direct motion");
  assert(velDirect > 0, `REF-01 Saturn velocity is positive: ${velDirect.toFixed(4)}°/day`);

  // Bounded daily motion [-0.15°/day, +0.15°/day] across canonical cases
  for (const c of refCases) {
    const d = new Date(c.utcInstant);
    const jd = Math.floor(365.25 * (d.getUTCFullYear() + 4716)) + 
      Math.floor(30.6001 * (d.getUTCMonth() + 1 + (d.getUTCMonth() + 1 <= 2 ? 12 : 0))) + 
      d.getUTCDate() - 1524.5 + (d.getUTCHours() + d.getUTCMinutes() / 60) / 24;
    const v = getPlanetaryVelocity("Saturn", jd);
    assert(
      v >= -0.15 && v <= 0.15,
      `${c.id} Saturn daily velocity ${v.toFixed(4)}°/day in valid range [-0.15, +0.15]`
    );
  }

  // ---------------------------------------------------------------------------
  // [TEST GROUP 4] Cyclic Coordinate Normalization & 0°/360° Wrap Continuity
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 4] Cyclic Coordinate Normalization & 0°/360° Wrap Continuity:");
  // Ingress into Aries (BOUND-01: 2025-05-25 00:00 UTC)
  const jdWrapCenter = 2460820.5; // 2025-05-25 00:00 UTC
  const lonBefore = saturnLongitude(jdWrapCenter - 0.5);
  const lonCenter = saturnLongitude(jdWrapCenter);
  const lonAfter = saturnLongitude(jdWrapCenter + 0.5);

  assert(lonBefore >= 0 && lonBefore < 360, `Saturn longitude before wrap in [0, 360): ${lonBefore.toFixed(4)}°`);
  assert(lonCenter >= 0 && lonCenter < 360, `Saturn longitude at wrap in [0, 360): ${lonCenter.toFixed(4)}°`);
  assert(lonAfter >= 0 && lonAfter < 360, `Saturn longitude after wrap in [0, 360): ${lonAfter.toFixed(4)}°`);

  const forwardStep = normDiff(lonAfter, lonBefore);
  assert(
    forwardStep > 0 && forwardStep < 0.1,
    `Smooth forward 24-hour step across boundary: ${forwardStep.toFixed(4)}°`
  );

  // ---------------------------------------------------------------------------
  // [TEST GROUP 5] Downstream Sade Sati & Transit Integrity
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 5] Downstream Sade Sati & Transit Integrity:");
  const testJd = 2460000.5; // ~Feb 2023, Saturn in Aquarius (~315° Tropical, ~291° Sidereal / Kumbha)
  const saturnSidLon = (saturnLongitude(testJd) - getAyanamsa(testJd) + 360) % 360;
  const saturnRashi = getRashi(saturnSidLon);

  // Case 1: Natal Moon in same Rashi -> Peak Sade Sati (signDistance = 1)
  const ssPeak = calculateSaturnTransit(saturnRashi, testJd);
  assert(ssPeak.isSadeSati === true, "Natal Moon in transit Saturn sign produces isSadeSati: true");
  assert(ssPeak.phaseCode === "PEAK", `Peak Sade Sati detected correctly: ${ssPeak.phaseCode}`);

  // Case 2: Natal Moon in 12th from Saturn transit -> Setting Sade Sati (Saturn is 2nd from Moon, signDistance = 2)
  const moonSettingRashi = ((saturnRashi - 2 + 12) % 12) + 1;
  const ssSetting = calculateSaturnTransit(moonSettingRashi, testJd);
  assert(ssSetting.isSadeSati === true, "Saturn in 2nd from Moon produces isSadeSati: true (Setting Phase)");
  assert(ssSetting.phaseCode === "SETTING", `Setting Sade Sati detected correctly: ${ssSetting.phaseCode}`);

  // Case 3: Natal Moon in 2nd from Saturn transit -> Rising Sade Sati (Saturn is 12th from Moon, signDistance = 12)
  const moonRisingRashi = (saturnRashi % 12) + 1;
  const ssRising = calculateSaturnTransit(moonRisingRashi, testJd);
  assert(ssRising.isSadeSati === true, "Saturn in 12th from Moon produces isSadeSati: true (Rising Phase)");
  assert(ssRising.phaseCode === "RISING", `Rising Sade Sati detected correctly: ${ssRising.phaseCode}`);

  // Case 4: Saturn 4th from Moon (Kantaka Dhaiya, signDistance = 4)
  const moonKantakaRashi = ((saturnRashi - 4 + 12) % 12) + 1;
  const ssKantaka = calculateSaturnTransit(moonKantakaRashi, testJd);
  assert(ssKantaka.isDhaiya === true, "Saturn 4th from Moon produces isDhaiya: true");
  assert(ssKantaka.phaseCode === "KANTAKA", `Kantaka Dhaiya detected correctly: ${ssKantaka.phaseCode}`);

  // Case 5: Saturn 8th from Moon (Ashtama Dhaiya, signDistance = 8)
  const moonAshtamaRashi = ((saturnRashi - 8 + 12) % 12) + 1;
  const ssAshtama = calculateSaturnTransit(moonAshtamaRashi, testJd);
  assert(ssAshtama.isDhaiya === true, "Saturn 8th from Moon produces isDhaiya: true");
  assert(ssAshtama.phaseCode === "ASHTAMA", `Ashtama Dhaiya detected correctly: ${ssAshtama.phaseCode}`);

  // Case 6: Harmonious (Saturn 5th from Moon, signDistance = 5)
  const moonHarmoniousRashi = ((saturnRashi - 5 + 12) % 12) + 1;
  const ssHarmonious = calculateSaturnTransit(moonHarmoniousRashi, testJd);
  assert(ssHarmonious.isSadeSati === false, "Harmonious transit produces isSadeSati: false");
  assert(ssHarmonious.isDhaiya === false, "Harmonious transit produces isDhaiya: false");
  assert(ssHarmonious.phaseCode === "FREE", `Harmonious phase: ${ssHarmonious.phaseCode}`);

  // ---------------------------------------------------------------------------
  // [TEST GROUP 6] Input Safety & Degenerate Input Handling
  // ---------------------------------------------------------------------------
  console.log("\n[TEST GROUP 6] Input Safety & Degenerate Input Handling:");
  assert(Number.isNaN(saturnLongitude(NaN)), "saturnLongitude(NaN) returns NaN safely");
  assert(Number.isNaN(saturnLongitude(Infinity)), "saturnLongitude(Infinity) returns NaN safely");
  assert(Number.isNaN(saturnLongitude(-Infinity)), "saturnLongitude(-Infinity) returns NaN safely");
  assert(Number.isNaN(saturnLongitude("invalid")), "saturnLongitude('invalid') returns NaN safely");
  assert(Number.isNaN(saturnLongitude(null)), "saturnLongitude(null) returns NaN safely");

  console.log(`\nPhase 4F.5 Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
