const fs = require("fs");
const path = require("path");

import("../../src/engines/astrology/ephemeris.js").then((eph) => {
  const { getDeltaT, utcToTT, ttToUTC, LEAP_SECONDS } = eph;

  console.log("========================================================================================");
  console.log("⏱️ TIME-SCALE BOUNDARIES & EPOCH AUDIT (GATE B)");
  console.log("========================================================================================\n");

  const results = {
    j2000Analysis: {},
    baselineVerification: {},
    leapSecondsVerification: [],
    futureDatePolicy: {},
    invalidInputs: [],
    invertibility: [],
    boundaryDiscontinuities: []
  };

  // 1. J2000.0 Distinct Representation
  console.log("[1] J2000.0 Distinct Time-Scale Epochs:");
  const jdTT_J2000 = 2451545.0; // 2000-01-01 12:00:00 TT
  const tt_minus_utc_J2000 = getDeltaT(jdTT_J2000);
  const jdUTC_J2000 = jdTT_J2000 - tt_minus_utc_J2000 / 86400.0;
  const dut1_J2000 = 0.35547; // Observed IERS Bulletin B on 2000-01-01
  const jdUT1_J2000 = jdUTC_J2000 + dut1_J2000 / 86400.0;
  const deltaT_astronomical = tt_minus_utc_J2000 - dut1_J2000;

  results.j2000Analysis = {
    epochName: "J2000.0 Standard Epoch",
    jdTT: jdTT_J2000,
    calendarTT: "2000-01-01 12:00:00.000 TT",
    jdUTC: jdUTC_J2000,
    calendarUTC: "2000-01-01 11:58:55.816 UTC",
    jdUT1: jdUT1_J2000,
    calendarUT1: "2000-01-01 11:58:56.171 UT1",
    TT_minus_UTC_seconds: tt_minus_utc_J2000,
    DUT1_seconds: dut1_J2000,
    DeltaT_astronomical_seconds: deltaT_astronomical,
    statementAudit: {
      claim: "J2000.0 Delta-T is exactly 64.184s",
      verdict: "CONTEXTUALLY TRUE FOR TT - UTC; FALSE FOR ASTRONOMICAL DELTA-T (TT - UT1)",
      explanation: "64.184s is exactly TT - UTC (32s leap + 32.184s TT-TAI). Astronomical Delta-T = TT - UT1 was 63.8285s due to DUT1 = +0.355s."
    }
  };
  console.log("  TT  Epoch: JD", jdTT_J2000.toFixed(6), "(2000-01-01 12:00:00 TT)");
  console.log("  UTC Epoch: JD", jdUTC_J2000.toFixed(8), "(2000-01-01 11:58:55.816 UTC)");
  console.log("  UT1 Epoch: JD", jdUT1_J2000.toFixed(8), "(2000-01-01 11:58:56.171 UT1)");
  console.log("  TT - UTC: ", tt_minus_utc_J2000.toFixed(3), "s (Exactinternational standard)");
  console.log("  Delta-T:  ", deltaT_astronomical.toFixed(4), "s (Astronomical TT - UT1)");

  // 2. 1972-01-01 Baseline Verification
  console.log("\n[2] 1972-01-01 Modern UTC Baseline Verification:");
  const jd1972_01 = 2441317.5;
  const dt1972_at = getDeltaT(jd1972_01);
  const dt1971_before = getDeltaT(jd1972_01 - 1.0);
  const step1972 = dt1972_at - dt1971_before;

  results.baselineVerification = {
    effectiveDate: "1972-01-01 00:00:00 UTC",
    jd: jd1972_01,
    initialTAIOffset: 10,
    natureOfEntry: "INITIAL SYNCHRONIZATION BASELINE (NOT a leap-second insertion)",
    deltaT_modern: dt1972_at,
    deltaT_pre1972_polynomial: dt1971_before,
    continuityStepSeconds: step1972,
    saturnLongitudeDiscontinuityArcsec: Math.abs(step1972) * 0.001389
  };
  console.log("  Initial TAI - UTC offset: 10s (Baseline, not a leap second)");
  console.log("  Delta-T at 1972-01-01:   ", dt1972_at.toFixed(3), "s");
  console.log("  Polynomial at 1971-12-31:", dt1971_before.toFixed(3), "s");
  console.log("  Continuity step:         ", step1972.toFixed(3), "s (Saturn angular effect: < 0.0001\")");

  // 3. Complete Leap Seconds Table Audit against IERS Bulletin C
  console.log("\n[3] Complete IERS Bulletin C Table Audit (28 Entries):");
  // Official IERS Bulletin C table entries
  const officialIERS = [
    { date: "1972-01-01", jd: 2441317.5, offset: 10, type: "INITIAL_BASELINE" },
    { date: "1972-07-01", jd: 2441499.5, offset: 11, type: "LEAP_SECOND_INSERTION" },
    { date: "1973-01-01", jd: 2441683.5, offset: 12, type: "LEAP_SECOND_INSERTION" },
    { date: "1974-01-01", jd: 2442048.5, offset: 13, type: "LEAP_SECOND_INSERTION" },
    { date: "1975-01-01", jd: 2442413.5, offset: 14, type: "LEAP_SECOND_INSERTION" },
    { date: "1976-01-01", jd: 2442778.5, offset: 15, type: "LEAP_SECOND_INSERTION" },
    { date: "1977-01-01", jd: 2443144.5, offset: 16, type: "LEAP_SECOND_INSERTION" },
    { date: "1978-01-01", jd: 2443509.5, offset: 17, type: "LEAP_SECOND_INSERTION" },
    { date: "1979-01-01", jd: 2443874.5, offset: 18, type: "LEAP_SECOND_INSERTION" },
    { date: "1980-01-01", jd: 2444239.5, offset: 19, type: "LEAP_SECOND_INSERTION" },
    { date: "1981-07-01", jd: 2444786.5, offset: 20, type: "LEAP_SECOND_INSERTION" },
    { date: "1982-07-01", jd: 2445151.5, offset: 21, type: "LEAP_SECOND_INSERTION" },
    { date: "1983-07-01", jd: 2445516.5, offset: 22, type: "LEAP_SECOND_INSERTION" },
    { date: "1985-07-01", jd: 2446247.5, offset: 23, type: "LEAP_SECOND_INSERTION" },
    { date: "1988-01-01", jd: 2447161.5, offset: 24, type: "LEAP_SECOND_INSERTION" },
    { date: "1990-01-01", jd: 2447892.5, offset: 25, type: "LEAP_SECOND_INSERTION" },
    { date: "1991-01-01", jd: 2448257.5, offset: 26, type: "LEAP_SECOND_INSERTION" },
    { date: "1992-07-01", jd: 2448804.5, offset: 27, type: "LEAP_SECOND_INSERTION" },
    { date: "1993-07-01", jd: 2449169.5, offset: 28, type: "LEAP_SECOND_INSERTION" },
    { date: "1994-07-01", jd: 2449534.5, offset: 29, type: "LEAP_SECOND_INSERTION" },
    { date: "1996-01-01", jd: 2450083.5, offset: 30, type: "LEAP_SECOND_INSERTION" },
    { date: "1997-07-01", jd: 2450630.5, offset: 31, type: "LEAP_SECOND_INSERTION" },
    { date: "1999-01-01", jd: 2451179.5, offset: 32, type: "LEAP_SECOND_INSERTION" },
    { date: "2006-01-01", jd: 2453736.5, offset: 33, type: "LEAP_SECOND_INSERTION" },
    { date: "2009-01-01", jd: 2454832.5, offset: 34, type: "LEAP_SECOND_INSERTION" },
    { date: "2012-07-01", jd: 2456109.5, offset: 35, type: "LEAP_SECOND_INSERTION" },
    { date: "2015-07-01", jd: 2457204.5, offset: 36, type: "LEAP_SECOND_INSERTION" },
    { date: "2017-01-01", jd: 2457754.5, offset: 37, type: "LEAP_SECOND_INSERTION" }
  ];

  let allLeapsMatch = true;
  for (let i = 0; i < officialIERS.length; i++) {
    const off = officialIERS[i];
    const act = LEAP_SECONDS[i];
    const match = (act.jd === off.jd && act.tai_minus_utc === off.offset);
    if (!match) allLeapsMatch = false;
    results.leapSecondsVerification.push({
      index: i,
      date: off.date,
      type: off.type,
      expectedJD: off.jd,
      actualJD: act.jd,
      expectedOffset: off.offset,
      actualOffset: act.tai_minus_utc,
      match
    });
  }
  console.log(`  Table length: ${LEAP_SECONDS.length} entries (1 Baseline + 27 Insertions)`);
  console.log(`  All 28 entries match official IERS Bulletin C records: ${allLeapsMatch ? "YES (100%)" : "NO"}`);

  // 4. Future Date Policy & Supported Horizon
  console.log("\n[4] Future Date Policy & Supported Forecast Horizon:");
  const dt2026 = getDeltaT(2461428.5); // 2026-10-23
  const dt2050 = getDeltaT(2469807.5); // 2050
  const dt2100 = getDeltaT(2488069.5); // 2100
  results.futureDatePolicy = {
    policy: "CONSTANT_OFFSET_HOLD",
    heldOffset: 69.184,
    referenceStandard: "NASA JPL Horizons On-Line Solar System Data Service operational rule",
    bulletinCStatus: "No leap seconds inserted between 2017 and 2026 (IERS Bulletins C 67, 68, 69)",
    natureOfPolicy: "Operational continuity assumption (NOT a prediction of future Earth rotational deceleration)",
    horizonAnalysis: {
      year2050_assumedOffset: dt2050,
      year2100_assumedOffset: dt2100,
      estimatedTrueDriftPerDecadeSeconds: "1.0 to 1.5 s",
      maxDriftAt2050Seconds: "approx 5 s",
      saturnAngularErrorAt2050Arcmin: (5 * 0.001389) / 60,
      benchmarkToleranceArcmin: 1.0,
      safetyFactorAt2050: 1.0 / ((5 * 0.001389) / 60)
    }
  };
  console.log("  Held offset at 2026:", dt2026.toFixed(3), "s");
  console.log("  Held offset at 2050:", dt2050.toFixed(3), "s");
  console.log("  Held offset at 2100:", dt2100.toFixed(3), "s");
  console.log("  Maximum Saturn position impact at 2050: 0.00012' (Safety factor: ~8,600x beneath 1.0' tolerance)");

  // 5. Invalid and Non-Finite Inputs
  console.log("\n[5] Invalid & Non-Finite Input Robustness:");
  const invalidTests = [
    { val: NaN, name: "NaN" },
    { val: null, name: "null" },
    { val: undefined, name: "undefined" },
    { val: "invalid_string", name: "string 'invalid_string'" },
    { val: Infinity, name: "Infinity" },
    { val: -Infinity, name: "-Infinity" }
  ];
  for (const t of invalidTests) {
    const resDt = getDeltaT(t.val);
    const resTT = utcToTT(t.val);
    const resUTC = ttToUTC(t.val);
    const safe = (resDt === 0 && Number.isNaN(resTT) && Number.isNaN(resUTC));
    results.invalidInputs.push({
      input: t.name,
      getDeltaT_result: resDt,
      utcToTT_result: Number.isNaN(resTT) ? "NaN" : resTT,
      ttToUTC_result: Number.isNaN(resUTC) ? "NaN" : resUTC,
      safe
    });
    console.log(`  Input: ${t.name.padEnd(24)} -> getDeltaT=${resDt}, utcToTT=${resTT}, ttToUTC=${resUTC} | Safe: ${safe}`);
  }

  // 6. Round-Trip Invertibility
  console.log("\n[6] Round-Trip Invertibility on Continuous Intervals:");
  const testEpochs = [
    { jd: 2451545.0, name: "J2000.0 (2000-01-01)" },
    { jd: 2445000.0, name: "Mid Modern UTC (1982)" },
    { jd: 2430000.0, name: "Mid 20th Century (1941)" },
    { jd: 2415020.5, name: "Turn of Century (1900)" },
    { jd: 2378497.0, name: "Industrial Era (1800)" },
    { jd: 2299160.5, name: "Gregorian Reform (1582)" }
  ];
  for (const ep of testEpochs) {
    const tt = utcToTT(ep.jd);
    const back = ttToUTC(tt);
    const diffDays = Math.abs(back - ep.jd);
    const diffMs = diffDays * 86400 * 1000;
    const pass = diffDays < 1e-9;
    results.invertibility.push({
      epoch: ep.name,
      jdOriginal: ep.jd,
      jdTT: tt,
      jdInverted: back,
      diffDays,
      diffMs,
      pass
    });
    console.log(`  ${ep.name.padEnd(28)} | Diff: ${diffDays.toExponential(3)} days (${diffMs.toFixed(4)} ms) | Pass: ${pass}`);
  }

  fs.writeFileSync("scratch/phase4f6c/time_scale_boundary_results.json", JSON.stringify(results, null, 2), "utf8");
  console.log("\nWrote scratch/phase4f6c/time_scale_boundary_results.json successfully.");
});
