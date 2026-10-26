import fs from 'fs';

console.log("=== COMPREHENSIVE TRUNCATION & SECULAR ANALYSIS (PHASE 4F.5C) ===");

// 1. Fetch raw authoritative VSOP87D Saturn dataset
console.log("Loading authoritative raw VSOP87D Saturn dataset...");
const url = 'https://raw.githubusercontent.com/commenthol/astronomia/master/data/vsop87Dsaturn.js';
const text = await fetch(url).then(r => r.text());
const jsonLike = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
const vsopRaw = (new Function('return ' + jsonLike))();

// 2. Extract production arrays from ephemeris.js
const ephemSource = fs.readFileSync('src/engines/astrology/ephemeris.js', 'utf8');
function extractArray(name) {
  const startMarker = `const ${name} = [`;
  const startIndex = ephemSource.indexOf(startMarker);
  let openBrackets = 0;
  let endIndex = -1;
  for (let i = startIndex + startMarker.length - 1; i < ephemSource.length; i++) {
    if (ephemSource[i] === '[') openBrackets++;
    else if (ephemSource[i] === ']') {
      openBrackets--;
      if (openBrackets === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  const arrayCode = ephemSource.slice(startIndex, endIndex);
  return (new Function(`${arrayCode}; return ${name};`))();
}

const prodL = extractArray('SATURN_VSOP87D_L');
const prodB = extractArray('SATURN_VSOP87D_B');
const prodR = extractArray('SATURN_VSOP87D_R');

function evalSeries(series, tau) {
  let val = 0;
  let tauPower = 1;
  const maxOrder = Array.isArray(series) ? series.length : 6;
  for (let i = 0; i < maxOrder; i++) {
    const table = Array.isArray(series) ? (series[i] || []) : (series[String(i)] || []);
    let subVal = 0;
    for (let j = 0; j < table.length; j++) {
      const term = table[j];
      subVal += term[0] * Math.cos(term[1] + term[2] * tau);
    }
    val += subVal * tauPower;
    tauPower *= tau;
  }
  return val;
}

// Earth model from ephemeris.js
const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
function norm360(d) { let r = d % 360; return r < 0 ? r + 360 : r; }

function getEarthHelio(T) {
  let L0 = norm360(280.46646 + T * (36000.76983 + T * 0.0003032));
  let M = norm360(357.52911 + T * (35999.05029 - T * 0.0001537));
  let Mrad = M * DEG;
  let C = (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(Mrad)
    + (0.019993 - T * 0.000101) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);
  let sunTrueLong = L0 + C;
  let e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  let v = Mrad + C * DEG;
  let R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(v));
  let lEarth = norm360(sunTrueLong + 180) * DEG;
  return {
    x: R * Math.cos(lEarth),
    y: R * Math.sin(lEarth),
    R: R
  };
}

function calcGeocentricLon(L, B, R, earth) {
  const cosB = Math.cos(B);
  const sx = R * Math.cos(L) * cosB;
  const sy = R * Math.sin(L) * cosB;
  return norm360(Math.atan2(sy - earth.y, sx - earth.x) * RAD);
}

function angularDiffArcmin(deg1, deg2) {
  let diff = (deg1 - deg2 + 540) % 360 - 180;
  return diff * 60;
}

// ---------------------------------------------------------------------
// TEST 1: High-Density Sampling (5,000 points over 1800 to 2150 CE)
// ---------------------------------------------------------------------
console.log("\n--- TEST 1: Dense Sampling (5,000 steps from 1800 to 2150 CE) ---");

let maxTotalErr = 0;
let maxLErr = 0;
let maxBErr = 0;
let maxRErr = 0;
let worstTotalJD = 0;

const N_STEPS = 5000;
const startJD = 2378497.0; // 1800-01-01
const endJD = 2506335.0;   // 2150-01-01

for (let step = 0; step < N_STEPS; step++) {
  const jd = startJD + (step / (N_STEPS - 1)) * (endJD - startJD);
  const T = (jd - 2451545.0) / 36525.0;
  const tau = T / 10;
  const earth = getEarthHelio(T);

  // Full raw series
  const rawL = evalSeries(vsopRaw.L, tau);
  const rawB = evalSeries(vsopRaw.B, tau);
  const rawR = evalSeries(vsopRaw.R, tau);

  // Truncated series
  const prodL_val = evalSeries(prodL, tau);
  const prodB_val = evalSeries(prodB, tau);
  const prodR_val = evalSeries(prodR, tau);

  // Geocentric positions
  const geoFull = calcGeocentricLon(rawL, rawB, rawR, earth);
  const geoProd = calcGeocentricLon(prodL_val, prodB_val, prodR_val, earth);

  // Single component substitutions
  const geoProdL = calcGeocentricLon(prodL_val, rawB, rawR, earth);
  const geoProdB = calcGeocentricLon(rawL, prodB_val, rawR, earth);
  const geoProdR = calcGeocentricLon(rawL, rawB, prodR_val, earth);

  const errTotal = Math.abs(angularDiffArcmin(geoProd, geoFull));
  const errL = Math.abs(angularDiffArcmin(geoProdL, geoFull));
  const errB = Math.abs(angularDiffArcmin(geoProdB, geoFull));
  const errR = Math.abs(angularDiffArcmin(geoProdR, geoFull));

  if (errTotal > maxTotalErr) {
    maxTotalErr = errTotal;
    worstTotalJD = jd;
  }
  if (errL > maxLErr) maxLErr = errL;
  if (errB > maxBErr) maxBErr = errB;
  if (errR > maxRErr) maxRErr = errR;
}

console.log(`Max Total Truncation Error (1800-2150 CE): ${maxTotalErr.toFixed(4)}' (${(maxTotalErr * 60).toFixed(2)}") at JD ${worstTotalJD.toFixed(1)}`);
console.log(`  Max Longitude-Only (L) Error:           ${maxLErr.toFixed(4)}' (${(maxLErr * 60).toFixed(2)}")`);
console.log(`  Max Latitude-Only (B) Error:            ${maxBErr.toFixed(4)}' (${(maxBErr * 60).toFixed(2)}")`);
console.log(`  Max Radius-Only (R) Error:              ${maxRErr.toFixed(4)}' (${(maxRErr * 60).toFixed(2)}")`);

// ---------------------------------------------------------------------
// TEST 2: Special Orbital Regimes (Oppositions, Conjunctions, Stations)
// ---------------------------------------------------------------------
console.log("\n--- TEST 2: Orbital Regimes (Opposition, Conjunction, Stations) ---");

// Test Saturn opposition cycle 2020-2035 (Saturn distance ~ 8.0 - 8.5 AU)
const regimeEpochs = [
  { name: 'Opposition 2020 (Min Distance)', jd: 2459051.5 },
  { name: 'Opposition 2021', jd: 2459428.5 },
  { name: 'Opposition 2022', jd: 2459806.5 },
  { name: 'Opposition 2023', jd: 2460183.5 },
  { name: 'Opposition 2024', jd: 2460562.5 },
  { name: 'Conjunction 2021 (Max Distance)', jd: 2459239.5 },
  { name: 'Conjunction 2022', jd: 2459615.5 },
  { name: 'Conjunction 2023', jd: 2459992.5 },
  { name: 'Conjunction 2024', jd: 2460369.5 },
  { name: 'Stationary Retrograde 2023 (STAT-01)', jd: 2460112.5 },
  { name: 'Stationary Direct 2023 (STAT-02)', jd: 2460252.5 },
  { name: 'Sign Boundary 2025 (BOUND-01)', jd: 2460820.5 }
];

for (const reg of regimeEpochs) {
  const T = (reg.jd - 2451545.0) / 36525.0;
  const tau = T / 10;
  const earth = getEarthHelio(T);
  const rawL = evalSeries(vsopRaw.L, tau);
  const rawB = evalSeries(vsopRaw.B, tau);
  const rawR = evalSeries(vsopRaw.R, tau);

  const prodL_val = evalSeries(prodL, tau);
  const prodB_val = evalSeries(prodB, tau);
  const prodR_val = evalSeries(prodR, tau);

  const geoFull = calcGeocentricLon(rawL, rawB, rawR, earth);
  const geoProd = calcGeocentricLon(prodL_val, prodB_val, prodR_val, earth);
  const err = Math.abs(angularDiffArcmin(geoProd, geoFull));

  console.log(`  [${reg.name}] Truncation Error: ${err.toFixed(4)}' (${(err * 60).toFixed(2)}")`);
}

// ---------------------------------------------------------------------
// TEST 3: Secular Divergence across 1000 BCE to 3000 CE
// ---------------------------------------------------------------------
console.log("\n--- TEST 3: Secular Analysis Across 1000 BCE to 3000 CE ---");

const secularYears = [-1000, -500, 0, 500, 1000, 1500, 1800, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2500, 3000];

for (const yr of secularYears) {
  // Approximate JD for Jan 1 of that year
  const jd = 1721424.5 + (yr - 1) * 365.2425;
  const T = (jd - 2451545.0) / 36525.0;
  const tau = T / 10;
  const earth = getEarthHelio(T);

  const rawL = evalSeries(vsopRaw.L, tau);
  const rawB = evalSeries(vsopRaw.B, tau);
  const rawR = evalSeries(vsopRaw.R, tau);

  const prodL_val = evalSeries(prodL, tau);
  const prodB_val = evalSeries(prodB, tau);
  const prodR_val = evalSeries(prodR, tau);

  const geoFull = calcGeocentricLon(rawL, rawB, rawR, earth);
  const geoProd = calcGeocentricLon(prodL_val, prodB_val, prodR_val, earth);
  const err = Math.abs(angularDiffArcmin(geoProd, geoFull));

  console.log(`  Year ${String(yr).padStart(5)} (T = ${T.toFixed(2)}, tau = ${tau.toFixed(3)}): Truncation Error = ${err.toFixed(4)}' (${(err * 60).toFixed(2)}")`);
}

