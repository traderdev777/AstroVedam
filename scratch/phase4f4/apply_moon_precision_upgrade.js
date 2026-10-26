import fs from 'fs';

const targetFile = 'src/engines/astrology/ephemeris.js';
const backupFile = 'scratch/phase4f4/ephemeris_pre4f4_backup.js';

let content = fs.readFileSync(targetFile, 'utf8');

// Ensure backup exists
fs.writeFileSync(backupFile, content, 'utf8');
console.log(`Backup confirmed at ${backupFile}`);

const startMarker = `/**\n * Calculate Moon's tropical longitude (high precision)\n */`;
const endMarker = `/**\n * Calculate Earth's heliocentric position vector (VSOP87 / Meeus)\n */`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Failed to locate target markers in ephemeris.js!');
  process.exit(1);
}

const replacementCode = `/**
 * Jean Meeus (1998) Chapter 47 Table 47.A - Periodic terms for the longitude of the Moon (Σl).
 * Coefficients are in units of 10^-6 degrees (0.000001°).
 * Structure: [D, M, M', F, coeff_l]
 * Terms containing M (|M| = 1) are scaled by E = 1 - 0.002516*T - 0.0000074*T^2;
 * terms containing 2M (|M| = 2) are scaled by E^2.
 */
const MOON_LONGITUDE_PERIODIC_TERMS = [
  [0,  0,  1,  0, 6288774],
  [2,  0, -1,  0, 1274027],
  [2,  0,  0,  0,  658314],
  [0,  0,  2,  0,  213618],
  [0,  1,  0,  0, -185116],
  [0,  0,  0,  2, -114332],
  [2,  0, -2,  0,   58793],
  [2, -1, -1,  0,   57066],
  [2,  0,  1,  0,   53322],
  [2, -1,  0,  0,   45758],
  [0,  1, -1,  0,  -40923],
  [1,  0,  0,  0,  -34720],
  [0,  1,  1,  0,  -30383],
  [2,  0,  0, -2,   15327],
  [0,  0,  1,  2,  -12528],
  [0,  0,  1, -2,   10980],
  [4,  0, -1,  0,   10675],
  [0,  0,  3,  0,   10034],
  [4,  0, -2,  0,    8548],
  [2,  1, -1,  0,   -7888],
  [2,  1,  0,  0,   -6766],
  [1,  0, -1,  0,   -5163],
  [1,  1,  0,  0,    4987],
  [2, -1,  1,  0,    4036],
  [2,  0,  2,  0,    3994],
  [4,  0,  0,  0,    3861],
  [2,  0, -3,  0,    3665],
  [0,  1, -2,  0,   -2689],
  [2,  0, -1,  2,   -2602],
  [2, -1, -2,  0,    2390],
  [1,  0,  1,  0,   -2348],
  [2, -2,  0,  0,    2236],
  [0,  1,  2,  0,   -2120],
  [0,  2,  0,  0,   -2069],
  [2, -2, -1,  0,    2048],
  [2,  0,  1, -2,   -1773],
  [2,  0,  0,  2,   -1595],
  [4, -1, -1,  0,    1215],
  [0,  0,  2,  2,   -1110],
  [3,  0, -1,  0,    -892],
  [2,  1,  1,  0,    -810],
  [4, -1, -2,  0,     759],
  [0,  2, -1,  0,    -713],
  [2,  2, -1,  0,    -700],
  [2,  1, -2,  0,     691],
  [2, -1,  0, -2,     596],
  [4,  0,  1,  0,     549],
  [0,  0,  4,  0,     537],
  [4, -1,  0,  0,     520],
  [1,  0, -2,  0,    -487],
  [2,  1,  0, -2,    -399],
  [0,  0,  2, -2,    -381],
  [1,  1,  1,  0,     351],
  [3,  0, -2,  0,    -340],
  [4,  0, -3,  0,     330],
  [2, -1,  2,  0,     327],
  [0,  2,  1,  0,    -323],
  [1,  1, -1,  0,     299],
  [2,  0,  3,  0,     294]
];

/**
 * Calculate Moon's apparent geocentric ecliptic longitude.
 * Reference: Jean Meeus, Astronomical Algorithms (2nd ed., 1998), Chapter 47.
 * Uses complete ELP-2000/82 truncated periodic perturbation series (Table 47.A),
 * Earth orbit eccentricity scaling factors, planetary additive terms, and IAU 1980 nutation.
 *
 * @param {number} jd - Julian Day in UTC
 * @returns {number} Apparent geocentric longitude in degrees [0, 360)
 */
export function moonLongitude(jd) {
  if (!Number.isFinite(jd)) return NaN;

  const T = julianCenturies(jd);

  // Fundamental lunar arguments (Meeus 1998, eq. 47.1 - 47.5)
  // Moon's mean longitude (L')
  const Lp = norm360(218.3164477 + T * (481267.88123421 - T * (0.0015786 - T * (1/538841 - T/65194000))));

  // Moon's mean elongation (D)
  const D = norm360(297.8501921 + T * (445267.1114034 - T * (0.0018819 + T * (1/545868 - T/113065000))));

  // Sun's mean anomaly (M)
  const M = norm360(357.5291092 + T * (35999.0502909 - T * (0.0001536 + T/24490000)));

  // Moon's mean anomaly (M')
  const Mp = norm360(134.9633964 + T * (477198.8675055 + T * (0.0087414 + T * (1/69699 - T/14712000))));

  // Moon's argument of latitude (F)
  const F = norm360(93.2720950 + T * (483202.0175233 - T * (0.0036539 - T * (1/3526000 + T/863310000))));

  // Additional planetary arguments (Meeus 1998, p. 341)
  const A1 = norm360(119.75 + 131.849 * T) * DEG;
  const A2 = norm360(53.09 + 479264.290 * T) * DEG;

  // Earth's orbit eccentricity factor (Meeus 1998, eq. 47.6)
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const E2 = E * E;

  const Dr = D * DEG;
  const Mr = M * DEG;
  const Mpr = Mp * DEG;
  const Fr = F * DEG;

  // Evaluate periodic series (Table 47.A)
  let sigmal = 0;
  for (let i = 0; i < MOON_LONGITUDE_PERIODIC_TERMS.length; i++) {
    const row = MOON_LONGITUDE_PERIODIC_TERMS[i];
    let coeff = row[4];
    const absM = Math.abs(row[1]);
    if (absM === 1) coeff *= E;
    else if (absM === 2) coeff *= E2;

    const arg = row[0] * Dr + row[1] * Mr + row[2] * Mpr + row[3] * Fr;
    sigmal += coeff * Math.sin(arg);
  }

  // Planetary additive terms (Meeus 1998, p. 341-342)
  sigmal += 3958 * Math.sin(A1) + 1962 * Math.sin((Lp - F) * DEG) + 318 * Math.sin(A2);

  // IAU 1980 Nutation in longitude (degrees)
  const dPsi = nutationInLongitude(T);

  // Apparent geocentric longitude: mean longitude + periodic perturbations + nutation
  const moonLong = Lp + sigmal / 1000000 + dPsi;
  return norm360(moonLong);
}

`;

content = content.slice(0, startIndex) + replacementCode + content.slice(endIndex);
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully applied Moon precision upgrade to ephemeris.js!');
