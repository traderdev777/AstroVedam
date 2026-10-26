/**
 * Test Suite: Phase 5B Timezone & Input Safety Remediation Verification
 * Verifies DEF-01, DEF-02 fixes in generateKundali and safe lookup tables.
 */

import { generateKundali } from "../../src/engines/astrology/kundali.js";

export async function runInputSafetyTests() {
  const suiteName = "Phase 5B Timezone & Input Safety (DEF-01, DEF-02)";
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

  const validDate = "1995-10-24";
  const validTime = "10:30";
  const validLat = 28.6139;
  const validLon = 77.2090;

  // 1. Missing timezone parameter throws TypeError
  try {
    generateKundali(validDate, validTime, validLat, validLon);
    assert(false, "generateKundali should throw when timezone is omitted");
  } catch (err) {
    assert(err instanceof TypeError && err.message.includes("timezone"), "Missing timezone throws TypeError with clear message");
  }

  // 2. undefined timezone throws TypeError
  try {
    generateKundali(validDate, validTime, validLat, validLon, undefined);
    assert(false, "generateKundali should throw when timezone is undefined");
  } catch (err) {
    assert(err instanceof TypeError && err.message.includes("timezone"), "Undefined timezone throws TypeError");
  }

  // 3. null timezone throws TypeError (preventing silent coercion to 0 UTC)
  try {
    generateKundali(validDate, validTime, validLat, validLon, null);
    assert(false, "generateKundali should throw when timezone is null");
  } catch (err) {
    assert(err instanceof TypeError && err.message.includes("timezone"), "null timezone throws TypeError (rejects silent UTC coercion)");
  }

  // 4. NaN timezone throws TypeError
  try {
    generateKundali(validDate, validTime, validLat, validLon, NaN);
    assert(false, "generateKundali should throw when timezone is NaN");
  } catch (err) {
    assert(err instanceof TypeError && err.message.includes("timezone"), "NaN timezone throws TypeError");
  }

  // 5. Infinite timezone values throw TypeError
  try {
    generateKundali(validDate, validTime, validLat, validLon, Infinity);
    assert(false, "generateKundali should throw when timezone is Infinity");
  } catch (err) {
    assert(err instanceof TypeError, "Infinity timezone throws TypeError");
  }
  try {
    generateKundali(validDate, validTime, validLat, validLon, -Infinity);
    assert(false, "generateKundali should throw when timezone is -Infinity");
  } catch (err) {
    assert(err instanceof TypeError, "-Infinity timezone throws TypeError");
  }

  // 6. Non-numeric types throw TypeError
  try {
    generateKundali(validDate, validTime, validLat, validLon, "5.5");
    assert(false, "String timezone '5.5' should throw TypeError");
  } catch (err) {
    assert(err instanceof TypeError, "String timezone throws TypeError");
  }
  try {
    generateKundali(validDate, validTime, validLat, validLon, true);
    assert(false, "Boolean timezone should throw TypeError");
  } catch (err) {
    assert(err instanceof TypeError, "Boolean timezone throws TypeError");
  }

  // 7. Out-of-range timezone offsets throw RangeError
  try {
    generateKundali(validDate, validTime, validLat, validLon, 15);
    assert(false, "Timezone +15 should throw RangeError");
  } catch (err) {
    assert(err instanceof RangeError && err.message.includes("range"), "Timezone +15 throws RangeError");
  }
  try {
    generateKundali(validDate, validTime, validLat, validLon, -13);
    assert(false, "Timezone -13 should throw RangeError");
  } catch (err) {
    assert(err instanceof RangeError && err.message.includes("range"), "Timezone -13 throws RangeError");
  }

  // 8. Valid boundary timezone offsets succeed
  const boundaryZones = [-12, -11, 0, 5.5, 9.75, 12, 13, 14];
  for (const tz of boundaryZones) {
    const k = generateKundali(validDate, validTime, validLat, validLon, tz);
    assert(k && k.planets && k.planets.length === 9, `Valid timezone ${tz} produces complete Kundali chart`);
    assert(k.birthDetails.timezone === tz, `Recorded timezone matches ${tz}`);
  }

  // 9. Coordinate validation bounds
  try {
    generateKundali(validDate, validTime, 95.0, validLon, 5.5);
    assert(false, "Latitude > 90 should throw RangeError");
  } catch (err) {
    assert(err instanceof RangeError, "Latitude 95 throws RangeError");
  }
  try {
    generateKundali(validDate, validTime, -91.0, validLon, 5.5);
    assert(false, "Latitude < -90 should throw RangeError");
  } catch (err) {
    assert(err instanceof RangeError, "Latitude -91 throws RangeError");
  }

  // 10. Date and time string validation
  try {
    generateKundali("invalid-date", validTime, validLat, validLon, 5.5);
    assert(false, "Invalid date format should throw TypeError");
  } catch (err) {
    assert(err instanceof TypeError, "Invalid date throws TypeError");
  }
  try {
    generateKundali(validDate, "invalid-time", validLat, validLon, 5.5);
    assert(false, "Invalid time format should throw TypeError");
  } catch (err) {
    assert(err instanceof TypeError, "Invalid time throws TypeError");
  }

  // 11. Valid canonical chart output equivalence check
  const canonicalK = generateKundali("1999-03-28", "11:25", 16.8302, 75.71, 5.5, "LAHIRI");
  assert(canonicalK.lagna.rashi === 3, "Canonical Vijayapura chart lagna is Gemini (Mithuna, Rashi 3)");
  assert(canonicalK.lagna.rashiName === "Gemini", "Lagna name is Gemini");
  assert(canonicalK.lagna.rashiNameHi === "मिथुन", "Lagna Hindi name is मिथुन");
  const sun = canonicalK.planets.find(p => p.name === "Sun");
  assert(sun.rashi === 12, "Canonical Sun is in Pisces (Meena, Rashi 12)");
  assert(sun.nakshatraName === "Uttara Bhadrapada", "Sun nakshatra is Uttara Bhadrapada");

  console.log(`\nPhase 5B Input Safety Suite Results: ${passed}/${total} passed`);
  return { suite: suiteName, passed, total };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ""))) {
  runInputSafetyTests();
}
