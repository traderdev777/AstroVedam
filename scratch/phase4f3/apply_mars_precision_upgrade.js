import fs from 'fs';

const targetFile = 'src/engines/astrology/ephemeris.js';
const backupFile = 'scratch/phase4f3/ephemeris_pre4f3_backup.js';

let content = fs.readFileSync(targetFile, 'utf8');

// Ensure backup exists
fs.writeFileSync(backupFile, content, 'utf8');
console.log(`Backup confirmed at ${backupFile}`);

const startMarker = `/**\n * Calculate Mars geocentric longitude (VSOP87 / Meeus)\n */`;
const endMarker = `/**\n * Calculate Mercury heliocentric rectangular coordinates (equinox of date).\n * References: Meeus (1998) Table 31.A, Simon et al. (1994).\n */`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Failed to locate target markers in ephemeris.js!');
  process.exit(1);
}

const replacementCode = `/**
 * Calculate Mars heliocentric longitude perturbations (VSOP87 / Meeus 1998 Appendix III).
 * Accounts for principal mutual gravitational perturbations from Jupiter and Earth on Mars.
 *
 * @param {number} tau - Time in millennia from J2000.0 (T / 10)
 * @returns {number} Longitude perturbation deltaL in degrees
 */
function getMarsPerturbations(tau) {
  const terms = [
    [27744.987, 5.9704951, 3.523118],
    [12315.897, 0.8495608, 2810.921462],
    [10610.230, 2.9395852, 2281.230497],
    [8926.772, 4.1569785, 0.017254],
    [7774.867, 3.3396866, 5621.842923],
    [6797.552, 0.3646224, 398.149003],
    [4161.101, 0.2281498, 2942.463423],
    [3575.079, 1.6618654, 2544.314420],
    [3075.250, 0.8569660, 191.448266],
    [2937.543, 6.0789371, 0.067310],
    [2628.122, 0.6480614, 3337.089308],
    [2579.842, 0.0299671, 3344.135545],
    [2389.420, 5.0389640, 796.298007],
    [1798.808, 0.6563403, 529.690965],
    [1546.408, 2.9157963, 1751.539531],
    [1528.140, 1.1497931, 6151.533888],
    [1286.232, 3.0679592, 2146.165416],
    [1264.356, 3.6227509, 5092.151958]
  ];

  let dL = 0;
  for (const [A, B, C] of terms) {
    dL += A * Math.cos(B + C * tau);
  }
  return (dL * 1e-8) * RAD;
}

/**
 * Calculate Mars heliocentric rectangular coordinates (equinox of date).
 * References: Meeus (1998) Table 31.A, Simon et al. (1994), VSOP87.
 *
 * @param {number} T - Julian centuries from J2000.0
 * @returns {{x: number, y: number, r: number}} Heliocentric coordinates (AU)
 */
function getMarsHelio(T) {
  const tau = T / 10;
  const deltaL = getMarsPerturbations(tau);

  const a = 1.52367934;
  const e = 0.09340062 + 0.000092064 * T - 0.000000077 * T * T;
  const I = (1.849726 - 0.0006011 * T + 0.00001276 * T * T) * DEG;
  const L = norm360(355.433275 + 19141.6964746 * T + 0.00031052 * T * T + deltaL);
  const peri = norm360(336.060234 + 1.8410449 * T + 0.00013477 * T * T);
  const Omega = norm360(49.558093 + 0.7720959 * T + 0.00001557 * T * T) * DEG;

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
 * Calculate Mars geocentric apparent tropical longitude.
 * Includes equinox-of-date secular rates, Kepler equation solution,
 * planetary perturbations (Jupiter/Earth), light-time retardation, and principal nutation.
 *
 * @param {number} jd - Julian Day Number
 * @returns {number} Geocentric longitude in degrees [0, 360)
 */
export function marsLongitude(jd) {
  if (typeof jd !== 'number' || !Number.isFinite(jd)) return NaN;
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);

  const m0 = getMarsHelio(T);
  const d0 = Math.sqrt((m0.x - earth.x) ** 2 + (m0.y - earth.y) ** 2);
  const dPsi = nutationInLongitude(T);

  // Light-time correction tau = d / c (0.0057755183 days/AU)
  if (!Number.isFinite(d0) || d0 <= 0 || d0 > 10) {
    return norm360(Math.atan2(m0.y - earth.y, m0.x - earth.x) * RAD + dPsi);
  }
  const tau = 0.0057755183 * d0;
  const Ttau = julianCenturies(jd - tau);
  const mTau = getMarsHelio(Ttau);

  return norm360(Math.atan2(mTau.y - earth.y, mTau.x - earth.x) * RAD + dPsi);
}

`;

const updatedContent = content.slice(0, startIndex) + replacementCode + content.slice(endIndex);
fs.writeFileSync(targetFile, updatedContent, 'utf8');
console.log(`Successfully upgraded Mars precision in ${targetFile}!`);
