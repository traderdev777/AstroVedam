import fs from 'fs';
import path from 'path';

const targetFile = '/Users/supreeththakur/.gemini/antigravity-ide/brain/841fc7ef-3339-408c-81d2-565fe6d2f4d4/browser/astroveda/src/engines/astrology/ephemeris.js';
const backupFile = '/Users/supreeththakur/.gemini/antigravity-ide/brain/ffa2cbd2-cb86-41a3-9f63-8f9bd64b27a9/scratch/phase4f1/ephemeris_pre4f1_backup.js';

let content = fs.readFileSync(targetFile, 'utf8');

// 1. Create a pristine backup first
fs.writeFileSync(backupFile, content, 'utf8');
console.log(`Backup written to ${backupFile}`);

// 2. Identify the exact block from jupiterLongitude to saturnLongitude
const startMarker = `/**\n * Calculate Jupiter geocentric longitude (VSOP87 / Meeus)\n */`;
const endMarker = `/**\n * Calculate Rahu (Mean Node) longitude - always retrograde\n */`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Failed to locate target markers in ephemeris.js!');
  process.exit(1);
}

const replacementCode = `/**
 * Solve Kepler's equation E - e * sin(E) = M via Newton-Raphson iteration.
 * Bounded to 6 iterations with strict finite-value checks.
 *
 * @param {number} Mrad - Mean anomaly in radians
 * @param {number} e - Orbital eccentricity
 * @returns {number} Eccentric anomaly in radians
 */
function solveKepler(Mrad, e) {
  if (!Number.isFinite(Mrad) || !Number.isFinite(e)) return NaN;
  let E = Mrad + e * Math.sin(Mrad);
  for (let i = 0; i < 6; i++) {
    const f = E - e * Math.sin(E) - Mrad;
    const fprime = 1 - e * Math.cos(E);
    if (Math.abs(fprime) < 1e-12) break;
    const dE = f / fprime;
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

/**
 * Calculate IAU 1980 principal nutation in longitude (Δψ) in degrees.
 * Aligns equinox-of-date coordinates with apparent true equinox.
 *
 * @param {number} T - Julian centuries from J2000.0
 * @returns {number} Nutation in longitude in degrees
 */
function nutationInLongitude(T) {
  if (!Number.isFinite(T)) return 0;
  const Omega = norm360(125.04452 - 1934.136261 * T) * DEG;
  const L0 = norm360(280.4665 + 36000.7698 * T) * DEG;
  return (-17.20 * Math.sin(Omega) - 1.32 * Math.sin(2 * L0)) / 3600;
}

/**
 * Calculate Jupiter heliocentric rectangular coordinates (equinox of date).
 * References: Meeus (1998) Table 31.A, Simon et al. (1994), Schlyter (1979).
 */
function getJupiterHelio(T) {
  const Mj = norm360(19.8950 + 3034.6906 * T);
  const Ms = norm360(316.9670 + 1221.5354 * T);

  // Mutual Jupiter-Saturn perturbations in longitude
  const deltaL = -0.332 * Math.sin((2*Mj - 5*Ms - 67.6) * DEG)
    - 0.056 * Math.sin((2*Mj - 2*Ms + 21) * DEG)
    + 0.042 * Math.sin((3*Mj - 5*Ms + 21) * DEG)
    - 0.036 * Math.sin((Mj - 2*Ms) * DEG)
    + 0.022 * Math.cos((Mj - Ms) * DEG)
    + 0.023 * Math.sin((2*Mj - 3*Ms + 52) * DEG)
    - 0.016 * Math.sin((Mj - 5*Ms - 69) * DEG);

  // Meeus Table 31.A equinox-of-date elements
  const a = 5.202603;
  const e = 0.04849793 + 0.000163225 * T;
  const I = (1.303267 - 0.0054965 * T) * DEG;
  const L = norm360(34.351519 + 3036.3027748 * T + 0.0002233 * T * T + deltaL);
  const Omega = norm360(100.464407 + 1.0209774 * T) * DEG;
  const peri = norm360(14.331207 + 1.6126352 * T);

  const M = norm360(L - peri) * DEG;
  const E = solveKepler(M, e);
  const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
  const r = a * (1 - e * Math.cos(E));
  const u = norm360(v * RAD + peri - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
  return { x, y, r };
}

/**
 * Calculate Jupiter geocentric apparent tropical longitude.
 * Includes equinox-of-date secular rates, Kepler equation solution,
 * mutual perturbation terms, light-time retardation, and principal nutation.
 *
 * @param {number} jd - Julian Day Number
 * @returns {number} Geocentric longitude in degrees [0, 360)
 */
export function jupiterLongitude(jd) {
  if (typeof jd !== 'number' || !Number.isFinite(jd)) return NaN;
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);

  const j0 = getJupiterHelio(T);
  const d0 = Math.sqrt((j0.x - earth.x) ** 2 + (j0.y - earth.y) ** 2);
  const dPsi = nutationInLongitude(T);

  // Light-time correction tau = d / c (0.0057755183 days/AU)
  if (!Number.isFinite(d0) || d0 <= 0 || d0 > 50) {
    return norm360(Math.atan2(j0.y - earth.y, j0.x - earth.x) * RAD + dPsi);
  }
  const tau = 0.0057755183 * d0;
  const Ttau = julianCenturies(jd - tau);
  const jTau = getJupiterHelio(Ttau);

  return norm360(Math.atan2(jTau.y - earth.y, jTau.x - earth.x) * RAD + dPsi);
}

/**
 * Calculate Venus geocentric longitude (VSOP87 / Meeus)
 */
export function venusLongitude(jd) {
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);
  const a = 0.72333199 + 0.00000092 * T;
  const e = 0.00677323 - 0.00004938 * T;
  const I = (3.394676 - 0.000789 * T) * DEG;
  const L = norm360(181.979801 + 58517.815676 * T);
  const peri = norm360(131.563707 + 1.402229 * T);
  const Omega = norm360(76.679843 - 0.277694 * T) * DEG;
  const M = norm360(L - peri) * DEG;
  const C = (2 * e - (e ** 3) / 4) * Math.sin(M)
    + (5/4 * e ** 2) * Math.sin(2 * M);
  const l = norm360(L + C * RAD);
  const v = M + C;
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
  const u = norm360(l - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
  return norm360(Math.atan2(y - earth.y, x - earth.x) * RAD);
}

/**
 * Calculate Saturn heliocentric rectangular coordinates (equinox of date).
 * References: Meeus (1998) Table 31.A, Simon et al. (1994), Schlyter (1979).
 */
function getSaturnHelio(T) {
  const Mj = norm360(19.8950 + 3034.6906 * T);
  const Ms = norm360(316.9670 + 1221.5354 * T);

  // Mutual Jupiter-Saturn perturbations in longitude (with corrected -69° phase angle)
  const deltaL = 0.812 * Math.sin((2*Mj - 5*Ms - 67.6) * DEG)
    - 0.229 * Math.cos((2*Mj - 4*Ms - 2) * DEG)
    + 0.119 * Math.sin((Mj - 2*Ms - 3) * DEG)
    + 0.046 * Math.sin((2*Mj - 6*Ms - 69) * DEG)
    + 0.014 * Math.sin((Mj - 3*Ms + 32) * DEG);

  // Meeus Table 31.A equinox-of-date elements
  const a = 9.554909;
  const e = 0.05554814 - 0.000346641 * T;
  const I = (2.488879 - 0.0037362 * T) * DEG;
  const L = norm360(50.077444 + 1223.5110686 * T + 0.00051908 * T * T + deltaL);
  const Omega = norm360(113.665503 + 0.877088 * T) * DEG;
  const peri = norm360(93.057237 + 1.9637613 * T);

  const M = norm360(L - peri) * DEG;
  const E = solveKepler(M, e);
  const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
  const r = a * (1 - e * Math.cos(E));
  const u = norm360(v * RAD + peri - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
  return { x, y, r };
}

/**
 * Calculate Saturn geocentric apparent tropical longitude.
 * Includes equinox-of-date secular rates, Kepler equation solution,
 * mutual perturbation terms (with verified phase angle), light-time retardation, and principal nutation.
 *
 * @param {number} jd - Julian Day Number
 * @returns {number} Geocentric longitude in degrees [0, 360)
 */
export function saturnLongitude(jd) {
  if (typeof jd !== 'number' || !Number.isFinite(jd)) return NaN;
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);

  const s0 = getSaturnHelio(T);
  const d0 = Math.sqrt((s0.x - earth.x) ** 2 + (s0.y - earth.y) ** 2);
  const dPsi = nutationInLongitude(T);

  // Light-time correction tau = d / c (0.0057755183 days/AU)
  if (!Number.isFinite(d0) || d0 <= 0 || d0 > 50) {
    return norm360(Math.atan2(s0.y - earth.y, s0.x - earth.x) * RAD + dPsi);
  }
  const tau = 0.0057755183 * d0;
  const Ttau = julianCenturies(jd - tau);
  const sTau = getSaturnHelio(Ttau);

  return norm360(Math.atan2(sTau.y - earth.y, sTau.x - earth.x) * RAD + dPsi);
}

`;

const newContent = content.slice(0, startIndex) + replacementCode + content.slice(endIndex);
fs.writeFileSync(targetFile, newContent, 'utf8');
console.log('Successfully applied precision upgrade to ephemeris.js!');
