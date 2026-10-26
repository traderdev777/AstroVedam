import fs from "fs";
import * as e from "../../src/engines/astrology/ephemeris.js";
import { generateKundali, generateNavamsaChart } from "../../src/engines/astrology/kundali.js";
import { renderFullPatrikaReport } from "../../src/components/reports/FullPatrikaReport.js";
import { getAstroGuruResponse } from "../../src/engines/astroguru/advisor.js";

console.log("=== FORENSIC DOWNSTREAM VERIFICATION SUITE ===");

let passed = 0;
let total = 0;

function assert(cond, msg) {
  total++;
  if (cond) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
  }
}

// 1. Retrograde and stationary detection
console.log("\n[1] Retrograde & Stationary Points:");
const jdRetro = 2460183.5; // RETRO-01
const vRetro = e.getPlanetaryVelocity("Saturn", jdRetro);
const isRetro = e.isPlanetRetrograde("Saturn", jdRetro);
assert(isRetro === true, `Saturn retrograde flag true at opposition (vel: ${vRetro.toFixed(4)}°/d)`);
assert(vRetro < -0.05, `Saturn retrograde velocity strongly negative: ${vRetro.toFixed(4)}°/d`);

const jdDirect = 2451265.7465; // REF-01
const vDirect = e.getPlanetaryVelocity("Saturn", jdDirect);
const isDirectRetro = e.isPlanetRetrograde("Saturn", jdDirect);
assert(isDirectRetro === false, `Saturn direct flag true at direct motion (vel: ${vDirect.toFixed(4)}°/d)`);
assert(vDirect > 0.10, `Saturn direct velocity strongly positive: ${vDirect.toFixed(4)}°/d`);

const jdStation = 2460113.5; // STAT-01
const vStation = e.getPlanetaryVelocity("Saturn", jdStation);
const isStat = e.isPlanetStationary("Saturn", jdStation);
assert(isStat === true, `Saturn stationary flag true at station turn (|v| < 0.005°/d: ${Math.abs(vStation).toFixed(5)}°/d)`);

// 2. Sign ingress and 0°/360° normalization
console.log("\n[2] Ingress & Cyclic Wrap Normalization:");
const jdWrapAt = 2460820.5; // BOUND-01: 2025-05-25 00:00 UTC
const jdWrapBefore = jdWrapAt - 0.5;
const jdWrapAfter = jdWrapAt + 0.5;
const lonBefore = e.saturnLongitude(jdWrapBefore);
const lonAt = e.saturnLongitude(jdWrapAt);
const lonAfter = e.saturnLongitude(jdWrapAfter);
assert(lonAt >= 359.0 && lonAt < 360.0, `Saturn longitude near 0/360 wrap: ${lonAt.toFixed(4)}°`);
assert(lonBefore >= 0 && lonBefore < 360, "Coordinate strictly in [0, 360)");
assert(lonAfter >= 0 && lonAfter < 360, "Coordinate strictly in [0, 360)");
assert(Math.abs(e.normDiff(lonAfter, lonBefore)) < 0.1, `Smooth forward rate across boundary: ${e.normDiff(lonAfter, lonBefore).toFixed(4)}°/day`);

// 3. D1 and D9 chart placements
console.log("\n[3] D1 and D9 Kundali Integration:");
const chart = generateKundali("1999-03-28", "11:25", 16.8302, 75.71, 5.5);
const saturnD1 = chart.planets.find(p => p.name === "Saturn");
assert(chart && saturnD1, "Kundali object successfully created with Saturn");
assert(typeof saturnD1.longitude === "number" && Number.isFinite(saturnD1.longitude), `Saturn longitude valid: ${saturnD1.longitude.toFixed(4)}°`);
assert(saturnD1.rashi >= 1 && saturnD1.rashi <= 12, `Saturn Rashi index in 1..12: ${saturnD1.rashi} (${saturnD1.rashiName})`);
assert(saturnD1.nakshatra >= 1 && saturnD1.nakshatra <= 27, `Saturn Nakshatra in 1..27: ${saturnD1.nakshatra} (${saturnD1.nakshatraName})`);
assert(saturnD1.pada >= 1 && saturnD1.pada <= 4, `Saturn Pada in 1..4: ${saturnD1.pada}`);

const navamsha = generateNavamsaChart(chart);
const saturnD9 = navamsha.planets.find(p => p.name === "Saturn");
assert(navamsha && saturnD9, "D9 Navamsha chart successfully created with Saturn");
assert(saturnD9.rashi >= 1 && saturnD9.rashi <= 12, `Saturn D9 Rashi in 1..12: ${saturnD9.rashi} (${saturnD9.rashiName})`);

// 4. Sade Sati, Dhaiya, Kantaka, Ashtama
console.log("\n[4] Sade Sati, Dhaiya, Kantaka, Ashtama Dynamic Engine:");
const tPeak = e.calculateSaturnTransit("Pisces", "2026-06-15");
assert(tPeak.isSadeSati === true && tPeak.phaseCode === "PEAK", "1st House: PEAK Sade Sati verified");

const tSetting = e.calculateSaturnTransit("Aquarius", "2026-06-15");
assert(tSetting.isSadeSati === true && tSetting.phaseCode === "SETTING", "2nd House: SETTING Sade Sati verified");

const tRising = e.calculateSaturnTransit("Aries", "2026-06-15");
assert(tRising.isSadeSati === true && tRising.phaseCode === "RISING", "12th House: RISING Sade Sati verified");

const tKantaka = e.calculateSaturnTransit("Sagittarius", "2026-06-15");
assert(tKantaka.isDhaiya === true && tKantaka.phaseCode === "KANTAKA", "4th House: KANTAKA Dhaiya verified");

const tAshtama = e.calculateSaturnTransit("Leo", "2026-06-15");
assert(tAshtama.isDhaiya === true && tAshtama.phaseCode === "ASHTAMA", "8th House: ASHTAMA Dhaiya verified");

const tFree = e.calculateSaturnTransit("Taurus", "2026-06-15");
assert(tFree.isSadeSati === false && tFree.isDhaiya === false && tFree.phaseCode === "FREE", "11th House: Sade Sati / Dhaiya FREE verified");

// 5. Birth date handling & Janampatrika report output
console.log("\n[5] Birth Date Handling & Janampatrika Report Generation:");
const baseInputs = { name: "Audit User", date: "1999-03-28", time: "11:25", lat: 16.8302, lon: 75.71, tz: 5.5 };
const reportEn = renderFullPatrikaReport(chart, navamsha, [], [], baseInputs, "en");
assert(typeof reportEn === "string" && reportEn.length > 5000, `English report rendered successfully (${reportEn.length} bytes)`);
assert(reportEn.includes("Saturn") || reportEn.includes("Shani"), "English report includes Saturn / Shani analysis");

const reportHi = renderFullPatrikaReport(chart, navamsha, [], [], baseInputs, "hi");
assert(typeof reportHi === "string" && reportHi.length > 5000, `Hindi report rendered successfully (${reportHi.length} bytes)`);
assert(reportHi.includes("शनि"), "Hindi report includes शनि analysis");

// 6. AstroGuru Conversational Advisor
console.log("\n[6] AstroGuru Conversational Advisor Awareness:");
const guruResp = getAstroGuruResponse("When is my Sade Sati?", chart, baseInputs, "en");
assert(guruResp && typeof guruResp.analysis === "string", "AstroGuru returns valid analysis");

// 7. Existing API compatibility & performance benchmark
console.log("\n[7] API Contracts & Performance Benchmark:");
const t0 = performance.now();
for (let i = 0; i < 5000; i++) {
  e.saturnLongitude(2451545.0 + i * 0.1);
}
const t1 = performance.now();
const timeMs = t1 - t0;
const rate = Math.round(5000 / (timeMs / 1000));
console.log(`  Performance: 5,000 Saturn apparent evaluations in ${timeMs.toFixed(1)} ms (${rate.toLocaleString()} evals/sec)`);
assert(rate > 20000, `High execution throughput: ${rate.toLocaleString()} evals/sec > 20,000`);

console.log(`\n===========================================================`);
console.log(`FORENSIC AUDIT DOWNSTREAM SUMMARY: ${passed}/${total} passed (${((passed/total)*100).toFixed(1)}%)`);
console.log(`===========================================================`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
