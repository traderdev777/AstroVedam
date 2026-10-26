import fs from "fs";
import path from "path";
import * as e from "../../src/engines/astrology/ephemeris.js";

const holdouts = [
  { id: "HOLDOUT-01", name: "Early 20th Century (1910)", dateUTC: "1910-04-15 12:00", y: 1910, m: 4, d: 15, hr: 12, mn: 0 },
  { id: "HOLDOUT-02", name: "Mid 20th Century (1945)",   dateUTC: "1945-08-15 09:00", y: 1945, m: 8, d: 15, hr: 9,  mn: 0 },
  { id: "HOLDOUT-03", name: "Space Age Apollo 11 (1969)", dateUTC: "1969-07-20 20:17", y: 1969, m: 7, d: 20, hr: 20, mn: 17 },
  { id: "HOLDOUT-04", name: "Late 20th Century (1989)",  dateUTC: "1989-11-09 18:00", y: 1989, m: 11, d: 9, hr: 18, mn: 0 },
  { id: "HOLDOUT-05", name: "Modern Solstice (2012)",    dateUTC: "2012-12-21 11:11", y: 2012, m: 12, d: 21, hr: 11, mn: 11 },
  { id: "HOLDOUT-06", name: "Mid 21st Century (2035)",   dateUTC: "2035-09-02 01:00", y: 2035, m: 9, d: 2,   hr: 1,  mn: 0 },
  { id: "HOLDOUT-07", name: "Conjunction Era (2040)",    dateUTC: "2040-09-08 12:00", y: 2040, m: 9, d: 8,   hr: 12, mn: 0 },
  { id: "HOLDOUT-08", name: "Century Boundary (2100)",   dateUTC: "2100-01-01 00:00", y: 2100, m: 1, d: 1,   hr: 0,  mn: 0 }
];

function signedDiff(val, ref) {
  let diff = (val - ref) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

async function run() {
  console.log("Fetching and evaluating 8 independent holdout epochs from NASA JPL Horizons...");
  const results = [];

  for (const h of holdouts) {
    const startStr = `${h.y}-${String(h.m).padStart(2, "0")}-${String(h.d).padStart(2, "0")} ${String(h.hr).padStart(2, "0")}:${String(h.mn).padStart(2, "0")}`;
    const stopDate = new Date(Date.UTC(h.y, h.m - 1, h.d, h.hr, h.mn + 1));
    const stopStr = `${stopDate.getUTCFullYear()}-${String(stopDate.getUTCMonth() + 1).padStart(2, "0")}-${String(stopDate.getUTCDate()).padStart(2, "0")} ${String(stopDate.getUTCHours()).padStart(2, "0")}:${String(stopDate.getUTCMinutes()).padStart(2, "0")}`;

    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='699'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${encodeURIComponent(startStr)}'&STOP_TIME='${encodeURIComponent(stopStr)}'&STEP_SIZE='1m'&QUANTITIES='31'`;

    let data;
    const rawFile = path.join("scratch/phase4f6a/raw_holdouts", `${h.id}_raw.json`);
    if (fs.existsSync(rawFile)) {
      data = JSON.parse(fs.readFileSync(rawFile, "utf8"));
    } else {
      const res = await fetch(url);
      data = await res.json();
      fs.writeFileSync(rawFile, JSON.stringify({ request: h, url, result: data.result }, null, 2), "utf8");
    }

    const text = data.result || "";
    const soe = text.indexOf("$$SOE");
    const eoe = text.indexOf("$$EOE");
    if (soe === -1 || eoe === -1) {
      console.error(`Failed to find SOE/EOE for ${h.id}`);
      continue;
    }
    const tableText = text.substring(soe + 5, eoe).trim();
    const firstLine = tableText.split("\n")[0].trim();
    const parts = firstLine.split(/\s+/);
    // Line format: Date Time ObsEcLon ObsEcLat
    const obsEcLon = parseFloat(parts[2]);
    const obsEcLat = parseFloat(parts[3]);

    const jd = e.dateToJD(h.y, h.m, h.d, h.hr, h.mn, 0);
    const avLon = e.saturnLongitude(jd);
    const diffDeg = signedDiff(avLon, obsEcLon);
    const diffArcmin = diffDeg * 60;
    const diffArcsec = diffArcmin * 60;
    const absArcmin = Math.abs(diffArcmin);

    results.push({
      id: h.id,
      name: h.name,
      dateUTC: h.dateUTC,
      jd,
      refTropLon: obsEcLon,
      refTropLat: obsEcLat,
      astrovedaLon: avLon,
      residualArcmin: diffArcmin,
      residualArcsec: diffArcsec,
      absErrorArcmin: absArcmin,
      passed: absArcmin <= 1.0
    });

    console.log(`[${h.id}] ${h.name.padEnd(30)} | Ref: ${obsEcLon.toFixed(4)}° | AV: ${avLon.toFixed(4)}° | Err: ${diffArcmin.toFixed(2)}' (${diffArcsec.toFixed(1)}") | Status: ${absArcmin <= 1.0 ? "✅ PASS" : "❌ FAIL"}`);
  }

  const n = results.length;
  let maxErr = 0, sumErr = 0, sumSigned = 0;
  for (const r of results) {
    if (r.absErrorArcmin > maxErr) maxErr = r.absErrorArcmin;
    sumErr += r.absErrorArcmin;
    sumSigned += r.residualArcmin;
  }

  const summary = {
    totalHoldouts: n,
    allPassed: results.every(r => r.passed),
    maxErrorArcmin: maxErr,
    maeArcmin: sumErr / n,
    signedBiasArcmin: sumSigned / n,
    results
  };

  fs.writeFileSync("scratch/phase4f6a/holdout_results.json", JSON.stringify(summary, null, 2), "utf8");
  console.log("\n=== HOLDOUT TEST SUMMARY ===");
  console.log(`Holdouts Evaluated: ${n} | All Passed: ${summary.allPassed}`);
  console.log(`Max Error: ${maxErr.toFixed(4)}' (${(maxErr * 60).toFixed(2)}")`);
  console.log(`MAE: ${(sumErr / n).toFixed(4)}' (${(sumErr * 60 / n).toFixed(2)}")`);
  console.log(`Signed Bias: ${(sumSigned / n).toFixed(4)}'`);
}

run();
