const fs = require("fs");
const path = require("path");

import("../../src/engines/astrology/kundali.js").then((kundaliMod) => {
  import("../../src/engines/astrology/ephemeris.js").then((ephMod) => {
    const { generateKundali } = kundaliMod;
    const { dateToJD, saturnLongitude, utcToTT, getDeltaT } = ephMod;

    console.log("========================================================================================");
    console.log("🏛️ HISTORICAL CIVIL BIRTH-TIME & TIMEZONE CONTRACT AUDIT (GATE C)");
    console.log("========================================================================================\n");

    const auditResults = {
      pipelineTrace: {},
      inputClassification: "Category 3: Local civil timestamp with user-specified numerical timezone offset",
      historicalCases: [],
      missingTimezoneCases: [],
      conceptualProof: {}
    };

    // 1. Pipeline Trace
    console.log("[1] Tracing Input-to-Dynamical Julian Day Pipeline:");
    const sampleDate = "1999-03-28";
    const sampleTime = "11:25";
    const sampleLat = 16.8302;
    const sampleLon = 75.71;
    const sampleTz = 5.5;

    const [yr, mo, dy] = sampleDate.split("-").map(Number);
    const [hr, mn] = sampleTime.split(":").map(Number);
    const utcHour = hr - sampleTz; // 11 - 5.5 = 5.5 (05:30) + 25m = 05:55 UTC
    const jdCivil = dateToJD(yr, mo, dy, utcHour, mn, 0);
    const dtSeconds = getDeltaT(jdCivil);
    const jdDynamical = utcToTT(jdCivil);

    auditResults.pipelineTrace = {
      inputLocalTimestamp: `${sampleDate} ${sampleTime}`,
      inputTimezone: sampleTz,
      step1_localToGreenwich: `utcHour = hour (${hr}) - timezone (${sampleTz}) = ${utcHour}`,
      step2_greenwichToJD: `dateToJD(${yr}, ${mo}, ${dy}, ${utcHour}, ${mn}, 0) = ${jdCivil}`,
      step3_civilToDynamical: `utcToTT(${jdCivil}) = ${jdCivil} + ${dtSeconds}s / 86400 = ${jdDynamical}`
    };
    console.log("  Input:        ", sampleDate, sampleTime, "(TZ: +" + sampleTz + ")");
    console.log("  Step 1 (Civil): Local clock - TZ -> Greenwich Civil Hour:", utcHour, "(05:55)");
    console.log("  Step 2 (JD):   Greenwich Civil JD:                      ", jdCivil);
    console.log("  Step 3 (Dyn):  Delta-T offset:                          ", dtSeconds, "s");
    console.log("  Step 4 (TT):   Dynamical TT JD:                         ", jdDynamical);

    // 2. Proof that Delta-T does NOT convert Local Time to UT1
    auditResults.conceptualProof = {
      premise: "Does a Delta-T polynomial perform local-time-to-UT1 conversion?",
      answer: "STRICTLY NO",
      proof: "Delta-T is defined astronomically as TT - UT1. It accounts exclusively for the Earth's rotational deceleration relative to atomic/dynamical clocks. The conversion from Local Civil Time to Greenwich Mean Time (UT1/UTC) is performed strictly by subtracting the geographical/civil timezone offset (or longitude in hours for Local Mean Time). Applying Delta-T to uncorrected local clock time would erroneously confuse geographical longitude offset with Earth deceleration."
    };

    // 3. Historical Local Timestamps (Pre-1906 India LMT vs Modern Standard Time)
    console.log("\n[2] Historical Civil Timestamps (Pre-1906 Indian LMT):");
    const histDate = "1890-08-15";
    const histTime = "06:00";
    const varanasiLon = 82.97;
    const lmtOffset = varanasiLon / 15.0; // 5.53133 hours

    const chartIST = generateKundali(histDate, histTime, 25.31, varanasiLon, 5.5);
    const chartLMT = generateKundali(histDate, histTime, 25.31, varanasiLon, lmtOffset);
    const saturnIST = chartIST.planets.find(p => p.name === "Saturn").longitude;
    const saturnLMT = chartLMT.planets.find(p => p.name === "Saturn").longitude;
    const diffArcsec = Math.abs(saturnIST - saturnLMT) * 3600;
    const diffArcmin = diffArcsec / 60;

    auditResults.historicalCases.push({
      caseName: "1890 Varanasi Birth (Pre-IST)",
      date: histDate,
      time: histTime,
      assumedStandardIST_Tz: 5.5,
      trueLMT_Tz: lmtOffset,
      timezoneDifferenceMinutes: (lmtOffset - 5.5) * 60,
      saturnLon_IST: saturnIST,
      saturnLon_LMT: saturnLMT,
      saturnDifferenceArcsec: diffArcsec,
      saturnDifferenceArcmin: diffArcmin,
      withinBenchmarkTolerance: diffArcmin < 1.0
    });
    console.log("  Varanasi 1890-08-15 06:00 Local Clock:");
    console.log("    Using modern IST (+5.5h): Saturn =", saturnIST.toFixed(4) + "°");
    console.log("    Using true LMT (+5.531h): Saturn =", saturnLMT.toFixed(4) + "°");
    console.log("    Difference:              ", diffArcsec.toFixed(3) + "\" (" + diffArcmin.toFixed(5) + "')");
    console.log("    Within 1.0' tolerance:   ", diffArcmin < 1.0 ? "YES" : "NO");

    // 4. Missing / Ambiguous Timezone Information
    console.log("\n[3] Missing or Ambiguous Timezone Input Handling:");
    const testMissingTz = [
      { tz: undefined, label: "undefined" },
      { tz: null, label: "null" },
      { tz: NaN, label: "NaN" },
      { tz: "invalid", label: "string 'invalid'" }
    ];

    for (const mt of testMissingTz) {
      let threw = false;
      let errorMsg = "";
      try {
        const chart = generateKundali("2000-01-01", "12:00", 28.61, 77.209, mt.tz);
      } catch (err) {
        threw = true;
        errorMsg = err.message;
      }
      auditResults.missingTimezoneCases.push({
        timezoneInput: mt.label,
        threwError: threw,
        errorMessage: errorMsg,
        finding: "Calling generateKundali with non-numeric timezone propagates NaN into dateToJD and RASHIS indexing, causing TypeError: Cannot read properties of undefined (reading 'en').",
        recommendedSafeHandling: "Input validation in public API: if (typeof timezone !== 'number' || !Number.isFinite(timezone)) throw new TypeError('Invalid timezone specified'); or fallback to longitude / 15.0 for LMT."
      });
      console.log(`  Timezone = ${mt.label.padEnd(16)} -> Threw error: ${threw} (${errorMsg.slice(0, 45)}...)`);
    }

    fs.writeFileSync("scratch/phase4f6c/historical_civil_time_audit.json", JSON.stringify(auditResults, null, 2), "utf8");
    console.log("\nWrote scratch/phase4f6c/historical_civil_time_audit.json successfully.");
  });
});
