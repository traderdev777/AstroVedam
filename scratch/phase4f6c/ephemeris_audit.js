/**
 * AstroVeda - Astronomical Ephemeris Engine
 * High-precision planetary position calculations
 * Based on VSOP87 simplified + Meeus algorithms
 */

import { AYANAMSA, RASHIS } from "../../src/engines/astrology/constants.js";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/**
 * Convert date to Julian Day Number
 */
export function dateToJD(year, month, day, hour = 0, min = 0, sec = 0) {
  const decimalDay = day + (hour + min / 60 + sec / 3600) / 24;
  if (month <= 2) { year--; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + decimalDay + B - 1524.5;
}

/**
 * Julian centuries from J2000.0
 */
export function julianCenturies(jd) {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * Authoritative IERS Leap Seconds Table (1972-01-01 to Present).
 * Maps Julian Day epoch to cumulative TAI - UTC offset in seconds.
 * Reference: IERS Bulletin C (International Earth Rotation and Reference Systems Service).
 */
export const LEAP_SECONDS = [
  { jd: 2441317.5, tai_minus_utc: 10 }, // 1972-01-01
  { jd: 2441499.5, tai_minus_utc: 11 }, // 1972-07-01
  { jd: 2441683.5, tai_minus_utc: 12 }, // 1973-01-01
  { jd: 2442048.5, tai_minus_utc: 13 }, // 1974-01-01
  { jd: 2442413.5, tai_minus_utc: 14 }, // 1975-01-01
  { jd: 2442778.5, tai_minus_utc: 15 }, // 1976-01-01
  { jd: 2443144.5, tai_minus_utc: 16 }, // 1977-01-01
  { jd: 2443509.5, tai_minus_utc: 17 }, // 1978-01-01
  { jd: 2443874.5, tai_minus_utc: 18 }, // 1979-01-01
  { jd: 2444239.5, tai_minus_utc: 19 }, // 1980-01-01
  { jd: 2444786.5, tai_minus_utc: 20 }, // 1981-07-01
  { jd: 2445151.5, tai_minus_utc: 21 }, // 1982-07-01
  { jd: 2445516.5, tai_minus_utc: 22 }, // 1983-07-01
  { jd: 2446247.5, tai_minus_utc: 23 }, // 1985-07-01
  { jd: 2447161.5, tai_minus_utc: 24 }, // 1988-01-01
  { jd: 2447892.5, tai_minus_utc: 25 }, // 1990-01-01
  { jd: 2448257.5, tai_minus_utc: 26 }, // 1991-01-01
  { jd: 2448804.5, tai_minus_utc: 27 }, // 1992-07-01
  { jd: 2449169.5, tai_minus_utc: 28 }, // 1993-07-01
  { jd: 2449534.5, tai_minus_utc: 29 }, // 1994-07-01
  { jd: 2450083.5, tai_minus_utc: 30 }, // 1996-01-01
  { jd: 2450630.5, tai_minus_utc: 31 }, // 1997-07-01
  { jd: 2451179.5, tai_minus_utc: 32 }, // 1999-01-01 (J2000 epoch ΔT = 32 + 32.184 = 64.184s)
  { jd: 2453736.5, tai_minus_utc: 33 }, // 2006-01-01
  { jd: 2454832.5, tai_minus_utc: 34 }, // 2009-01-01
  { jd: 2456109.5, tai_minus_utc: 35 }, // 2012-07-01
  { jd: 2457204.5, tai_minus_utc: 36 }, // 2015-07-01
  { jd: 2457754.5, tai_minus_utc: 37 }, // 2017-01-01
];

/**
 * Calculate Delta-T = TT - UT (or TT - UTC) in seconds.
 *
 * Astronomical Time-Scale Specifications:
 * 1. Modern civil UTC (1972-01-01 to Present):
 *    Delta-T = (TAI - UTC) + 32.184 seconds, where (TAI - UTC) is from the IERS leap-second table.
 *    For dates after the latest announced leap second, the constant value (37 + 32.184 = 69.184s)
 *    is applied into the predictable future, matching NASA JPL Horizons' operational convention.
 * 2. Historical & Pre-UTC Eras (prior to 1972):
 *    UTC did not exist prior to 1972; civil time was UT1 / GMT.
 *    Delta-T is evaluated using the authoritative polynomial approximations of
 *    Fred Espenak & Jean Meeus (NASA Technical Publication TP-2006-214141:
 *    "Five Millennium Canon of Solar Eclipses: -1999 to +3000").
 *
 * @param {number} jd - Julian Day Number (in UTC / UT1)
 * @returns {number} Delta-T in seconds
 */
export function getDeltaT(jd) {
  if (typeof jd !== "number" || !Number.isFinite(jd)) return 0;

  // Modern era: IERS leap-second table (1972-01-01 onwards)
  if (jd >= 2441317.5) {
    for (let i = LEAP_SECONDS.length - 1; i >= 0; i--) {
      if (jd >= LEAP_SECONDS[i].jd) {
        return LEAP_SECONDS[i].tai_minus_utc + 32.184;
      }
    }
  }

  // Pre-1972 and Historical eras: Espenak & Meeus (2006) NASA TP-2006-214141 polynomials
  const y = 2000.0 + (jd - 2451545.0) / 365.2425;

  if (y >= 1961 && y < 1972) {
    const t = y - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t * t * t) / 718;
  } else if (y >= 1941 && y < 1961) {
    const t = y - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t * t * t) / 2547;
  } else if (y >= 1920 && y < 1941) {
    const t = y - 1920;
    return 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * (t ** 3);
  } else if (y >= 1900 && y < 1920) {
    const t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * (t ** 3) - 0.000197 * (t ** 4);
  } else if (y >= 1860 && y < 1900) {
    const t = y - 1860;
    return 7.62 + 0.5737 * t - 0.251754 * t * t + 0.01680668 * (t ** 3) - 0.0004473624 * (t ** 4) + (t ** 5) / 233174;
  } else if (y >= 1800 && y < 1860) {
    const t = y - 1800;
    return 13.72 - 0.332447 * t + 0.0068612 * t * t + 0.0041116 * (t ** 3) - 0.00037436 * (t ** 4) + 0.0000121272 * (t ** 5) - 0.0000001699 * (t ** 6) + 0.000000000875 * (t ** 7);
  } else if (y >= 1700 && y < 1800) {
    const t = y - 1700;
    return 8.83 + 0.1603 * t - 0.0059285 * t * t + 0.00013336 * (t ** 3) - (t ** 4) / 1174000;
  } else if (y >= 1600 && y < 1700) {
    const t = y - 1600;
    return 120 - 0.9808 * t - 0.01532 * t * t + (t ** 3) / 7129;
  } else if (y >= 500 && y < 1600) {
    const u = (y - 1000) / 100;
    return 1574.2 - 556.01 * u + 71.23472 * u * u + 0.0319781 * (u ** 3) - 0.8503463 * (u ** 4) - 0.005050998 * (u ** 5) + 0.0083572073 * (u ** 6);
  } else if (y >= -500 && y < 500) {
    const u = y / 100;
    return 10583.6 - 1014.41 * u + 33.78311 * u * u - 5.952053 * (u ** 3) - 0.1798452 * (u ** 4) + 0.022174192 * (u ** 5) + 0.0090316521 * (u ** 6);
  } else {
    const u = (y - 1820) / 100;
    return -20 + 32 * u * u;
  }
}

/**
 * Convert Julian Day in UTC to Julian Day in Terrestrial Time (TT / TDB).
 * JD_TT = JD_UTC + DeltaT / 86400
 *
 * @param {number} jdUtc - Julian Day Number in UTC
 * @returns {number} Julian Day Number in Terrestrial Time (TT)
 */
export function utcToTT(jdUtc) {
  if (typeof jdUtc !== "number" || !Number.isFinite(jdUtc)) return NaN;
  return jdUtc + getDeltaT(jdUtc) / 86400.0;
}

/**
 * Convert Julian Day in Terrestrial Time (TT) to Julian Day in UTC.
 * JD_UTC = JD_TT - DeltaT / 86400
 *
 * @param {number} jdTT - Julian Day Number in TT
 * @returns {number} Julian Day Number in UTC
 */
export function ttToUTC(jdTT) {
  if (typeof jdTT !== "number" || !Number.isFinite(jdTT)) return NaN;
  return jdTT - getDeltaT(jdTT) / 86400.0;
}

/**
 * Normalize angle to 0-360
 */
function norm360(deg) {
  let r = deg % 360;
  return r < 0 ? r + 360 : r;
}

/**
 * Calculate Ayanamsa for a given Julian Day
 */
export function getAyanamsa(jd, system = 'LAHIRI') {
  const T = julianCenturies(jd);
  const yearsFrom2000 = T * 100;
  const ayan = AYANAMSA[system];
  if (!ayan) return AYANAMSA.LAHIRI.value2000 + yearsFrom2000 * AYANAMSA.LAHIRI.rate;
  return ayan.value2000 + yearsFrom2000 * ayan.rate;
}

/**
 * Calculate Sun's tropical longitude (high precision)
 */
export function sunLongitude(jd) {
  const T = julianCenturies(jd);
  // Geometric mean longitude
  let L0 = 280.46646 + T * (36000.76983 + T * 0.0003032);
  L0 = norm360(L0);
  // Mean anomaly
  let M = 357.52911 + T * (35999.05029 - T * 0.0001537);
  M = norm360(M);
  const Mrad = M * DEG;
  // Equation of center
  const C = (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(Mrad)
    + (0.019993 - T * 0.000101) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);
  // Sun's true longitude
  let sunTrueLong = L0 + C;
  // Apparent longitude (nutation + aberration)
  const omega = 125.04 - 1934.136 * T;
  sunTrueLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(omega * DEG);
  return norm360(sunTrueLong);
}

/**
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

/**
 * Calculate Earth's heliocentric position vector (VSOP87 / Meeus)
 */
function getEarthHelioVector(T) {
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

/**
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

/**
 * Calculate Mercury heliocentric rectangular coordinates (equinox of date).
 * References: Meeus (1998) Table 31.A, Simon et al. (1994).
 */
function getMercuryHelio(T) {
  const a = 0.38709831;
  const e = 0.20563175 + 0.000020407 * T - 0.0000000283 * T * T;
  const I = (7.004986 + 0.0018215 * T - 0.0000181 * T * T) * DEG;
  const L = norm360(252.250906 + 149474.0722491 * T + 0.0003035 * T * T);
  const peri = norm360(77.456119 + 1.5564776 * T + 0.00029544 * T * T);
  const Omega = norm360(48.330893 + 1.1861883 * T + 0.00017542 * T * T) * DEG;

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
 * Calculate Mercury geocentric apparent tropical longitude.
 * Includes equinox-of-date secular rates, Kepler equation solution,
 * light-time retardation, and principal nutation.
 *
 * @param {number} jd - Julian Day Number
 * @returns {number} Geocentric longitude in degrees [0, 360)
 */
export function mercuryLongitude(jd) {
  if (typeof jd !== 'number' || !Number.isFinite(jd)) return NaN;
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);

  const m0 = getMercuryHelio(T);
  const d0 = Math.sqrt((m0.x - earth.x) ** 2 + (m0.y - earth.y) ** 2);
  const dPsi = nutationInLongitude(T);

  // Light-time correction tau = d / c (0.0057755183 days/AU)
  if (!Number.isFinite(d0) || d0 <= 0 || d0 > 10) {
    return norm360(Math.atan2(m0.y - earth.y, m0.x - earth.x) * RAD + dPsi);
  }
  const tau = 0.0057755183 * d0;
  const Ttau = julianCenturies(jd - tau);
  const mTau = getMercuryHelio(Ttau);

  return norm360(Math.atan2(mTau.y - earth.y, mTau.x - earth.x) * RAD + dPsi);
}

/**
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
 * Calculate Venus heliocentric rectangular coordinates (equinox of date).
 * References: Meeus (1998) Table 31.A, Simon et al. (1994).
 */
function getVenusHelio(T) {
  const a = 0.72332982;
  const e = 0.00677192 - 0.000047765 * T + 0.0000000981 * T * T;
  const I = (3.394662 + 0.0010037 * T - 0.00000088 * T * T) * DEG;
  const L = norm360(181.979801 + 58519.2130302 * T + 0.00031014 * T * T);
  const peri = norm360(131.563703 + 1.4022288 * T - 0.00107618 * T * T);
  const Omega = norm360(76.67992 + 0.9011206 * T + 0.00040618 * T * T) * DEG;

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
 * Calculate Venus geocentric apparent tropical longitude.
 * Includes equinox-of-date secular rates, Kepler equation solution,
 * light-time retardation, and principal nutation.
 *
 * @param {number} jd - Julian Day Number
 * @returns {number} Geocentric longitude in degrees [0, 360)
 */
export function venusLongitude(jd) {
  if (typeof jd !== 'number' || !Number.isFinite(jd)) return NaN;
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);

  const v0 = getVenusHelio(T);
  const d0 = Math.sqrt((v0.x - earth.x) ** 2 + (v0.y - earth.y) ** 2);
  const dPsi = nutationInLongitude(T);

  // Light-time correction tau = d / c (0.0057755183 days/AU)
  if (!Number.isFinite(d0) || d0 <= 0 || d0 > 10) {
    return norm360(Math.atan2(v0.y - earth.y, v0.x - earth.x) * RAD + dPsi);
  }
  const tau = 0.0057755183 * d0;
  const Ttau = julianCenturies(jd - tau);
  const vTau = getVenusHelio(Ttau);

  return norm360(Math.atan2(vTau.y - earth.y, vTau.x - earth.x) * RAD + dPsi);
}

/**
 * Saturn VSOP87D heliocentric longitude terms (equinox of date, A >= 5e-5 rad)
 */
const SATURN_VSOP87D_L = [
  // Order tau^0 (20 terms)
  [
    [0.87401354029, 0, 0],
    [0.1110765978, 3.96205090194, 213.299095438],
    [0.01414150958, 4.58581515873, 7.1135470008],
    [0.00398379386, 0.52112025957, 206.1855484372],
    [0.00350769223, 3.30329903015, 426.598190876],
    [0.00206816296, 0.24658366938, 103.0927742186],
    [0.00079271288, 3.8400707853, 220.4126424388],
    [0.00023990338, 4.6697693486, 110.2063212194],
    [0.00016573583, 0.43719123541, 419.4846438752],
    [0.00014906995, 5.76903283845, 316.3918696566],
    [0.000158203, 0.9380895376, 632.7837393132],
    [0.00014609562, 1.56518573691, 3.9321532631],
    [0.00013160308, 4.44891180176, 14.2270940016],
    [0.00015053509, 2.71670027883, 639.897286314],
    [0.00013005305, 5.98119067061, 11.0457002639],
    [0.00010725066, 3.12939596466, 202.2533951741],
    [0.00005863207, 0.23657028777, 529.6909650946],
    [0.00005227771, 4.2078316238, 3.1813937377],
    [0.00006126308, 1.76328499656, 277.0349937414],
    [0.00005019658, 3.17787919533, 433.7117378768],
  ],
  // Order tau^1 (9 terms)
  [
    [213.54295595986, 0, 0],
    [0.01296855005, 1.82820544701, 213.299095438],
    [0.00564347566, 2.88500136429, 7.1135470008],
    [0.0009832303, 1.08070061328, 426.598190876],
    [0.0010767877, 2.27769911872, 206.1855484372],
    [0.00040254586, 2.0412825709, 220.4126424388],
    [0.00019941734, 1.27954662736, 103.0927742186],
    [0.00010511706, 2.748803928, 14.2270940016],
    [0.00006939233, 0.40493079985, 639.897286314],
  ],
  // Order tau^2 (6 terms)
  [
    [0.00116441181, 1.17987850633, 7.1135470008],
    [0.00091920844, 0.07425261094, 213.299095438],
    [0.00090592251, 0, 0],
    [0.00015276909, 4.06492007503, 206.1855484372],
    [0.00010631396, 0.25778277414, 220.4126424388],
    [0.00010604979, 5.40963595885, 426.598190876],
  ],
  // Order tau^3 (1 terms)
  [
    [0.00016038734, 5.73945377424, 7.1135470008],
  ],
  // Order tau^4 (0 terms)
  [
  ],
  // Order tau^5 (0 terms)
  [
  ],
];

/**
 * Saturn VSOP87D heliocentric latitude terms (equinox of date, A >= 5e-5 rad)
 */
const SATURN_VSOP87D_B = [
  // Order tau^0 (8 terms)
  [
    [0.0433067804, 3.60284428399, 213.299095438],
    [0.00240348303, 2.8523848939, 426.598190876],
    [0.00084745939, 0, 0],
    [0.00030863357, 3.48441504465, 220.4126424388],
    [0.00034116063, 0.57297307844, 206.1855484372],
    [0.0001473407, 2.1184659787, 639.897286314],
    [0.00009916668, 5.79003189405, 419.4846438752],
    [0.00006993564, 4.73604689179, 7.1135470008],
  ],
  // Order tau^1 (5 terms)
  [
    [0.00397554998, 5.33289992556, 213.299095438],
    [0.00049478641, 3.14159265359, 0],
    [0.00018571607, 6.09919206378, 426.598190876],
    [0.00014800587, 2.3058606052, 206.1855484372],
    [0.00009643981, 1.6967466012, 220.4126424388],
  ],
  // Order tau^2 (1 terms)
  [
    [0.00020629977, 0.50482422817, 213.299095438],
  ],
  // Order tau^3 (0 terms)
  [
  ],
  // Order tau^4 (0 terms)
  [
  ],
  // Order tau^5 (0 terms)
  [
  ],
];

/**
 * Saturn VSOP87D heliocentric radius terms (equinox of date, A >= 5e-5 AU)
 */
const SATURN_VSOP87D_R = [
  // Order tau^0 (29 terms)
  [
    [9.55758135801, 0, 0],
    [0.52921382465, 2.39226219733, 213.299095438],
    [0.01873679934, 5.23549605091, 206.1855484372],
    [0.01464663959, 1.64763045468, 426.598190876],
    [0.00821891059, 5.93520025371, 316.3918696566],
    [0.00547506899, 5.01532628454, 103.0927742186],
    [0.00371684449, 2.27114833428, 220.4126424388],
    [0.00361778433, 3.13904303264, 7.1135470008],
    [0.00140617548, 5.70406652991, 632.7837393132],
    [0.00108974737, 3.29313595577, 110.2063212194],
    [0.00069007015, 5.94099622447, 419.4846438752],
    [0.0006105335, 0.94037761156, 639.897286314],
    [0.00048913044, 1.55733388472, 202.2533951741],
    [0.00034143794, 0.19518550682, 277.0349937414],
    [0.00032401718, 5.47084606947, 949.1756089698],
    [0.00020936573, 0.46349163993, 735.8765135318],
    [0.00020839118, 1.5210259064, 433.7117378768],
    [0.00020746678, 5.33255667599, 199.0720014364],
    [0.00015298457, 3.05943652881, 529.6909650946],
    [0.00014296479, 2.60433537909, 323.5054166574],
    [0.00011993314, 5.98051421881, 846.0828347512],
    [0.00011380261, 1.73105746566, 522.5774180938],
    [0.00012884128, 1.64892310393, 138.5174968707],
    [0.00007752769, 5.85191318903, 95.9792272178],
    [0.00009796061, 5.20475863996, 1265.5674786264],
    [0.00006465967, 0.17733160145, 1052.2683831884],
    [0.00006770621, 3.00433479284, 14.2270940016],
    [0.00005850443, 1.45519636076, 415.5524906121],
    [0.00005307481, 0.5973753405, 63.7358983034],
  ],
  // Order tau^1 (13 terms)
  [
    [0.06182981282, 0.25843515034, 213.299095438],
    [0.00506577574, 0.71114650941, 206.1855484372],
    [0.00341394136, 5.7963577396, 426.598190876],
    [0.00188491375, 0.47215719444, 220.4126424388],
    [0.0018626154, 3.14159265359, 0],
    [0.00143891176, 1.40744864239, 7.1135470008],
    [0.00049621111, 6.0174446958, 103.0927742186],
    [0.00020928189, 5.0924565447, 639.897286314],
    [0.00019952612, 1.17560125007, 419.4846438752],
    [0.00018839639, 1.60819563173, 110.2063212194],
    [0.00012892827, 5.94330258435, 433.7117378768],
    [0.00013876565, 0.75886204364, 199.0720014364],
    [0.00005396699, 1.28852405908, 14.2270940016],
  ],
  // Order tau^2 (5 terms)
  [
    [0.00436902464, 4.78671673044, 213.299095438],
    [0.0007192276, 2.50069994874, 206.1855484372],
    [0.00049766792, 4.9716815087, 220.4126424388],
    [0.00043220894, 3.86940443794, 426.598190876],
    [0.00029645554, 5.96310264282, 7.1135470008],
  ],
  // Order tau^3 (3 terms)
  [
    [0.00020315005, 3.02186626038, 213.299095438],
    [0.00008923581, 3.19144205755, 220.4126424388],
    [0.00006908677, 4.35174889353, 206.1855484372],
  ],
  // Order tau^4 (0 terms)
  [
  ],
  // Order tau^5 (0 terms)
  [
  ],
];

/**
 * Evaluate a VSOP87 series array for a given time in millennia from J2000.0.
 * Sums sum_i (tau^i * sum_j (A_j * cos(B_j + C_j * tau))).
 *
 * @param {Array<Array<Array<number>>>} seriesArray - Multi-order term tables
 * @param {number} tau - Millennia from J2000.0 (T / 10)
 * @returns {number} Series sum
 */
function evalVsopSeries(seriesArray, tau) {
  let val = 0;
  let tauPower = 1;
  for (let i = 0; i < seriesArray.length; i++) {
    const table = seriesArray[i];
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

/**
 * Calculate Saturn heliocentric rectangular coordinates (equinox of date).
 * References: Bretagnon & Francou (1988) VSOP87D planetary theory.
 * Evaluates truncated heliocentric spherical series (L, B, R) in equinox of date.
 *
 * @param {number} T - Julian centuries from J2000.0
 * @returns {{x: number, y: number, z: number, r: number}}
 */
function getSaturnHelio(T) {
  const tau = T / 10;
  const L = evalVsopSeries(SATURN_VSOP87D_L, tau);
  const B = evalVsopSeries(SATURN_VSOP87D_B, tau);
  const R = evalVsopSeries(SATURN_VSOP87D_R, tau);

  const cosB = Math.cos(B);
  return {
    x: R * Math.cos(L) * cosB,
    y: R * Math.sin(L) * cosB,
    z: R * Math.sin(B),
    r: R
  };
}

/**
 * Calculate Saturn geocentric apparent tropical longitude.
 * Includes:
 * 1. Time-scale conversion from UTC input to Terrestrial Time (TT/TDB) via getDeltaT.
 * 2. VSOP87D heliocentric planetary theory (equinox of date).
 * 3. Light-time retardation tau = d / c.
 * 4. Observer-velocity stellar aberration (-k * cos(Sun - Lon) / cos(Beta)).
 * 5. IAU 1980 principal nutation in longitude (dPsi).
 *
 * @param {number} jd - Julian Day Number (in UTC)
 * @returns {number} Geocentric longitude in degrees [0, 360)
 */
export function saturnLongitude(jd) {
  if (typeof jd !== 'number' || !Number.isFinite(jd)) return NaN;
  const jdTT = utcToTT(jd);
  const T = julianCenturies(jdTT);
  const earth = getEarthHelioVector(T);

  const s0 = getSaturnHelio(T);
  const d0 = Math.sqrt((s0.x - earth.x) ** 2 + (s0.y - earth.y) ** 2 + s0.z ** 2);
  const dPsi = nutationInLongitude(T);

  // Light-time correction tau = d / c (0.0057755183 days/AU)
  if (!Number.isFinite(d0) || d0 <= 0 || d0 > 50) {
    return norm360(Math.atan2(s0.y - earth.y, s0.x - earth.x) * RAD + dPsi);
  }
  const tau = 0.0057755183 * d0;
  const Ttau = julianCenturies(jdTT - tau);
  const sTau = getSaturnHelio(Ttau);

  const dx = sTau.x - earth.x;
  const dy = sTau.y - earth.y;
  const dz = sTau.z;
  const geoLon = Math.atan2(dy, dx) * RAD;

  // Observer Stellar Aberration
  // Evaluates orbital velocity aberration using IAU constant k = 20.49552"
  const sunLon = sunLongitude(jdTT);
  const dTau = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const beta = Math.asin(dz / dTau);
  const cosBeta = Math.cos(beta);
  const dLambdaAberr = (-20.49552 / 3600) * Math.cos((sunLon - geoLon) * DEG) / (cosBeta || 1);

  return norm360(geoLon + dPsi + dLambdaAberr);
}

/**
 * Calculate Rahu (Mean Node) longitude - always retrograde
 */
export function rahuLongitude(jd) {
  const T = julianCenturies(jd);
  let omega = 125.0445479 - T * (1934.1362891 - T * (0.0020754 + T / 467441));
  return norm360(omega);
}

/**
 * Calculate Ketu longitude (opposite to Rahu)
 */
export function ketuLongitude(jd) {
  return norm360(rahuLongitude(jd) + 180);
}

/**
 * Get all planetary tropical longitudes
 */
export function getAllTropicalLongitudes(jd) {
  return {
    Sun: sunLongitude(jd),
    Moon: moonLongitude(jd),
    Mars: marsLongitude(jd),
    Mercury: mercuryLongitude(jd),
    Jupiter: jupiterLongitude(jd),
    Venus: venusLongitude(jd),
    Saturn: saturnLongitude(jd),
    Rahu: rahuLongitude(jd),
    Ketu: ketuLongitude(jd)
  };
}

/**
 * Convert tropical to sidereal (Vedic) longitudes
 */
export function getSiderealLongitudes(jd, ayanamsaSystem = 'LAHIRI') {
  const tropical = getAllTropicalLongitudes(jd);
  const ayanamsa = getAyanamsa(jd, ayanamsaSystem);
  const sidereal = {};
  for (const [planet, lon] of Object.entries(tropical)) {
    sidereal[planet] = norm360(lon - ayanamsa);
  }
  return sidereal;
}

/**
 * Calculate the Ascendant (Lagna) for given time and location
 */
export function calculateAscendant(jd, latitude, longitude) {
  const T = julianCenturies(jd);
  
  // Greenwich Mean Sidereal Time
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + T * T * (0.000387933 - T / 38710000);
  GMST = norm360(GMST);
  
  // Local Sidereal Time
  let LST = norm360(GMST + longitude);
  const LSTrad = LST * DEG;
  const latRad = latitude * DEG;
  
  // Obliquity of ecliptic
  const eps = (23.4393 - 0.013 * T) * DEG;
  
  // Ascendant calculation (true rising eastern intersection of horizon and ecliptic)
  const y = Math.cos(LSTrad);
  const x = -Math.sin(eps) * Math.tan(latRad) - Math.cos(eps) * Math.sin(LSTrad);
  let asc = Math.atan2(y, x) * RAD;
  asc = norm360(asc);
  
  return asc;
}

/**
 * Calculate Midheaven (MC - Medium Coeli)
 */
export function calculateMC(jd, longitude) {
  const T = julianCenturies(jd);
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + T * T * (0.000387933 - T / 38710000);
  const LST = norm360(GMST + longitude);
  const eps = (23.4393 - 0.013 * T) * DEG;
  let mc = Math.atan2(Math.sin(LST * DEG), Math.cos(LST * DEG) * Math.cos(eps)) * RAD;
  return norm360(mc);
}

/**
 * Calculate house cusps using Equal House system
 */
export function calculateHouseCusps(ascendant) {
  const cusps = [];
  for (let i = 0; i < 12; i++) {
    cusps.push(norm360(ascendant + i * 30));
  }
  return cusps;
}

/**
 * Get Rashi (zodiac sign) from longitude
 */
/**
 * Get Rashi (zodiac sign 1 to 12) from longitude.
 * Safely normalizes finite angles to [0, 360) where 0°, 360°, 720° map to Aries (sign 1).
 * Returns null for non-finite / invalid numeric inputs without crashing.
 *
 * @param {number} longitude - Ecliptic longitude in degrees
 * @returns {number|null} Zodiac sign index (1 to 12) or null if invalid
 */
export function getRashi(longitude) {
  if (typeof longitude !== 'number' || !Number.isFinite(longitude)) {
    return null;
  }
  const normalized = ((longitude % 360) + 360) % 360;
  return Math.floor(normalized / 30) + 1;
}

/**
 * Get degree within a Rashi
 */
export function getDegreeInRashi(longitude) {
  return longitude % 30;
}

/**
 * Get Nakshatra from longitude
 */
export function getNakshatra(longitude) {
  const nakshatraSize = 360 / 27; // 13.333...
  const nakshatraIndex = Math.floor(longitude / nakshatraSize);
  return nakshatraIndex + 1;
}

/**
 * Get Nakshatra Pada (quarter)
 */
export function getNakshatraPada(longitude) {
  const nakshatraSize = 360 / 27;
  const padaSize = nakshatraSize / 4;
  const posInNakshatra = longitude % nakshatraSize;
  return Math.floor(posInNakshatra / padaSize) + 1;
}

/**
 * Calculate Navamsa (D-9) position
 */
export function getNavamsaRashi(longitude) {
  const rashiNum = Math.floor(longitude / 30);
  const degInRashi = longitude % 30;
  const navamsaPada = Math.floor(degInRashi / (30/9));
  let navamsaStart;
  const element = rashiNum % 4; // 0=Fire,1=Earth,2=Air,3=Water
  if (element === 0) navamsaStart = 1;       // Fire signs start from Aries
  else if (element === 1) navamsaStart = 10;  // Earth signs start from Capricorn
  else if (element === 2) navamsaStart = 7;   // Air signs start from Libra
  else navamsaStart = 4;                       // Water signs start from Cancer
  return ((navamsaStart - 1 + navamsaPada) % 12) + 1;
}

/**
 * Determine planetary strength (Shadbala simplified)
 */
export function getPlanetaryStrength(planet, longitude, ascendant) {
  const rashi = getRashi(longitude);
  const planetData = {
    Sun: { exalt: 1, exaltDeg: 10, debil: 7, own: [5], moola: 5 },
    Moon: { exalt: 2, exaltDeg: 3, debil: 8, own: [4], moola: 2 },
    Mars: { exalt: 10, exaltDeg: 28, debil: 4, own: [1, 8], moola: 1 },
    Mercury: { exalt: 6, exaltDeg: 15, debil: 12, own: [3, 6], moola: 6 },
    Jupiter: { exalt: 4, exaltDeg: 5, debil: 10, own: [9, 12], moola: 9 },
    Venus: { exalt: 12, exaltDeg: 27, debil: 6, own: [2, 7], moola: 7 },
    Saturn: { exalt: 7, exaltDeg: 20, debil: 1, own: [10, 11], moola: 11 }
  };
  const data = planetData[planet];
  if (!data) return { status: 'Normal', strength: 50 };
  
  if (rashi === data.exalt) return { status: 'Exalted (उच्च)', strength: 100 };
  if (rashi === data.debil) return { status: 'Debilitated (नीच)', strength: 10 };
  if (data.own.includes(rashi)) return { status: 'Own Sign (स्वगृही)', strength: 85 };
  if (rashi === data.moola) return { status: 'Moolatrikona (मूलत्रिकोण)', strength: 90 };
  return { status: 'Normal', strength: 50 };
}

/**
 * Determine which house a planet occupies
 */
export function getHousePosition(planetLong, ascendant) {
  let diff = norm360(planetLong - ascendant);
  return Math.floor(diff / 30) + 1;
}

/**
 * Calculate sunrise/sunset approximately
 * @param {number} jd - Julian Day
 * @param {number} latitude - degrees
 * @param {number} longitude - degrees
 * @returns {{ sunrise: number, sunset: number }} - in fractional hours UTC
 */
export function calculateSunriseSunset(jd, latitude, longitude) {
  const T = julianCenturies(jd);
  const n = jd - 2451545.0 + 0.0008;
  const Jstar = n - longitude / 360;
  const M = norm360(357.5291 + 0.98560028 * Jstar);
  const Mrad = M * DEG;
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);
  const lambda = norm360(M + C + 180 + 102.9372);
  const lambdaRad = lambda * DEG;
  const sinDec = Math.sin(lambdaRad) * Math.sin(23.4393 * DEG);
  const dec = Math.asin(sinDec);
  const cosH = (Math.sin(-0.833 * DEG) - Math.sin(latitude * DEG) * Math.sin(dec)) /
    (Math.cos(latitude * DEG) * Math.cos(dec));
  
  if (cosH > 1) return { sunrise: 6, sunset: 18 }; // polar night
  if (cosH < -1) return { sunrise: 0, sunset: 24 }; // midnight sun
  
  const H = Math.acos(cosH) * RAD;
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);
  const Jrise = Jtransit - H / 360;
  const Jset = Jtransit + H / 360;
  
  const sunriseHour = ((Jrise - Math.floor(jd - 0.5) - 0.5) * 24 + longitude / 15) % 24;
  const sunsetHour = ((Jset - Math.floor(jd - 0.5) - 0.5) * 24 + longitude / 15) % 24;
  
  return {
    sunrise: sunriseHour < 0 ? sunriseHour + 24 : sunriseHour,
    sunset: sunsetHour < 0 ? sunsetHour + 24 : sunsetHour
  };
}

/**
 * Normalize signed angular difference to [-180, +180]
 */
export function normDiff(a, b) {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

/**
 * Calculate apparent geocentric longitudinal velocity in degrees per day.
 * Uses central difference with step h = 0.05 days (~1.2 hours).
 *
 * @param {string} planetName - e.g. 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Sun', 'Moon', 'Rahu', 'Ketu'
 * @param {number} jd - Julian Day
 * @param {number} [h=0.05] - Step size in days
 * @returns {number} Velocity in degrees/day (positive = direct, negative = retrograde)
 */
export function getPlanetaryVelocity(planetName, jd, h = 0.05) {
  if (planetName === 'Sun') {
    const l1 = sunLongitude(jd - h);
    const l2 = sunLongitude(jd + h);
    return normDiff(l2, l1) / (2 * h);
  }
  if (planetName === 'Moon') {
    const l1 = moonLongitude(jd - h);
    const l2 = moonLongitude(jd + h);
    return normDiff(l2, l1) / (2 * h);
  }
  if (planetName === 'Rahu' || planetName === 'Ketu') {
    // Mean lunar node rate is ~ -0.05295 deg/day
    return -0.05295;
  }

  const planetFns = {
    Mercury: mercuryLongitude,
    Venus: venusLongitude,
    Mars: marsLongitude,
    Jupiter: jupiterLongitude,
    Saturn: saturnLongitude
  };

  const fn = planetFns[planetName];
  if (!fn) return 0;

  const l1 = fn(jd - h);
  const l2 = fn(jd + h);
  return normDiff(l2, l1) / (2 * h);
}

/**
 * Determine whether a planet is stationary (turning direct or turning retrograde).
 * Station threshold is defined as |velocity| < 0.005 deg/day (~18 arcsec/day).
 *
 * @param {string} planetName
 * @param {number} jd
 * @returns {boolean}
 */
export function isPlanetStationary(planetName, jd) {
  if (planetName === 'Sun' || planetName === 'Moon' || planetName === 'Rahu' || planetName === 'Ketu') {
    return false;
  }
  const vel = getPlanetaryVelocity(planetName, jd);
  return Math.abs(vel) < 0.005;
}

/**
 * Determine if a planet is in apparent retrograde motion at Julian Day jd.
 *
 * Astronomical & Astrological Rules:
 * - Sun and Moon never retrograde (apparent velocity always > 0).
 * - Rahu and Ketu are always retrograde in Vedic astrology convention.
 * - Mercury, Venus, Mars, Jupiter, Saturn are retrograde when longitudinal velocity < 0.
 *
 * @param {string} planetName
 * @param {number} jd
 * @returns {boolean}
 */
export function isPlanetRetrograde(planetName, jd) {
  if (planetName === 'Sun' || planetName === 'Moon') return false;
  if (planetName === 'Rahu' || planetName === 'Ketu') return true;
  return getPlanetaryVelocity(planetName, jd) < 0;
}

/**
 * Resolve Moon Rashi index (1 to 12) from multiple supported input formats:
 * - Number: 1 to 12
 * - String: English or Hindi rashi name ('Aries', 'Mesha', etc.)
 * - Object: Planet object with .rashi or .rashiName, or Kundali object with .planets
 * - null/undefined if invalid
 */
function resolveMoonRashi(input) {
  if (input === null || input === undefined) return null;
  if (typeof input === 'number' && Number.isFinite(input)) {
    const r = Math.floor(input);
    return (r >= 1 && r <= 12) ? r : null;
  }
  if (typeof input === 'string') {
    const normalized = input.trim().toLowerCase();
    const found = RASHIS.find(r => r.en.toLowerCase() === normalized || r.hi === normalized);
    return found ? found.id : null;
  }
  if (typeof input === 'object') {
    if (Array.isArray(input.planets)) {
      const moon = input.planets.find(p => p.name === 'Moon');
      return moon ? moon.rashi : null;
    }
    if (typeof input.rashi === 'number') return resolveMoonRashi(input.rashi);
    if (typeof input.rashiName === 'string') return resolveMoonRashi(input.rashiName);
    if (typeof input.longitude === 'number' && Number.isFinite(input.longitude)) {
      return getRashi(((input.longitude % 360) + 360) % 360);
    }
  }
  return null;
}

/**
 * Resolve Julian Day from multiple assessment date formats:
 * - Julian Day number (> 1,000,000)
 * - ISO date string ('YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss')
 * - Date object
 * - null/undefined: defaults to current UTC instant
 */
function resolveAssessmentJD(assessmentDate) {
  if (typeof assessmentDate === 'number' && Number.isFinite(assessmentDate)) {
    if (assessmentDate > 1000000) {
      return { jd: assessmentDate, isoDate: null };
    }
    const d = new Date(assessmentDate);
    if (!isNaN(d.getTime())) {
      const y = d.getUTCFullYear();
      const m = d.getUTCMonth() + 1;
      const day = d.getUTCDate();
      const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { jd: dateToJD(y, m, day, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()), isoDate };
    }
    return null;
  }
  if (assessmentDate instanceof Date) {
    if (isNaN(assessmentDate.getTime())) return null;
    const y = assessmentDate.getUTCFullYear();
    const m = assessmentDate.getUTCMonth() + 1;
    const day = assessmentDate.getUTCDate();
    const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { jd: dateToJD(y, m, day, assessmentDate.getUTCHours(), assessmentDate.getUTCMinutes(), assessmentDate.getUTCSeconds()), isoDate };
  }
  if (typeof assessmentDate === 'string' && assessmentDate.trim().length > 0) {
    const parts = assessmentDate.trim().split(/[-T :]/).map(Number);
    if (parts.length >= 3 && !parts.slice(0, 3).some(isNaN)) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const hour = parts[3] !== undefined && !isNaN(parts[3]) ? parts[3] : 12;
      const min = parts[4] !== undefined && !isNaN(parts[4]) ? parts[4] : 0;
      const sec = parts[5] !== undefined && !isNaN(parts[5]) ? parts[5] : 0;
      if (year < 1000 || year > 3000 || month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
      }
      if (hour < 0 || hour > 24 || min < 0 || min > 59 || sec < 0 || sec > 59) {
        return null;
      }
      const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { jd: dateToJD(year, month, day, hour, min, sec), isoDate };
    }
    const d = new Date(assessmentDate);
    if (!isNaN(d.getTime())) {
      const y = d.getUTCFullYear();
      const m = d.getUTCMonth() + 1;
      const day = d.getUTCDate();
      const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { jd: dateToJD(y, m, day, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()), isoDate };
    }
    return null;
  }
  if (assessmentDate === null || assessmentDate === undefined) {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { jd: dateToJD(y, m, day, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()), isoDate };
  }
  return null;
}

/**
 * Shared Dynamic Saturn Transit & Sade Sati Assessment Helper (Phase 4C.2)
 *
 * Evaluates Saturn's true Gochar (transit) position relative to the natal Moon sign.
 * Uses geocentric ephemeris coordinates from Phase 4B.2 and configured sidereal ayanamsha.
 *
 * Classical Parashari Sign Distance Rules:
 * - 12th from Moon: Sade Sati Rising / 1st Phase (प्रथम चरण / सिर काल)
 * - 1st (same sign) as Moon: Sade Sati Peak / 2nd Phase (द्वितीय चरण / हृदय काल)
 * - 2nd from Moon: Sade Sati Setting / 3rd Phase (तृतीय चरण / चरण मुक्ति काल)
 * - 4th from Moon: Kantaka Shani / 4th Dhaiya (चतुर्थ ढैया)
 * - 8th from Moon: Ashtama Shani / 8th Dhaiya (अष्टम ढैया)
 * - Other distances (3, 5, 6, 7, 9, 10, 11): Sade Sati Free (शुभ गोचर)
 *
 * @param {number|string|object} natalMoonInput - Natal Moon sign (1-12), name ('Aries'), planet obj, or Kundali
 * @param {string|Date|number|null} [assessmentDate=null] - Date of transit assessment (default: current UTC)
 * @param {string} [ayanamsaSystem='LAHIRI'] - Sidereal ayanamsha system
 * @returns {object} Comprehensive transit evaluation object
 */
export function calculateSaturnTransit(natalMoonInput, assessmentDate = null, ayanamsaSystem = 'LAHIRI') {
  const natalMoonRashi = resolveMoonRashi(natalMoonInput);
  const resolved = resolveAssessmentJD(assessmentDate);
  const jd = resolved ? resolved.jd : null;
  const assessmentDateStr = resolved ? resolved.isoDate : null;

  if (!natalMoonRashi || !jd) {
    return {
      valid: false,
      isSadeSati: false,
      isDhaiya: false,
      isAffected: false,
      phase: 'Transit Assessment Unavailable (गोचर विवरण अनुपलब्ध)',
      phaseHi: 'शनि गोचर विवरण अनुपलब्ध',
      phaseCode: 'UNAVAILABLE',
      classification: 'UNAVAILABLE',
      signDistance: null,
      transitSaturnRashi: null,
      transitSaturnSign: null,
      natalMoonRashi: natalMoonRashi || null,
      natalMoonSign: natalMoonRashi && RASHIS[natalMoonRashi - 1] ? RASHIS[natalMoonRashi - 1].en : null,
      details: 'Unable to assess Saturn transit: missing or invalid lunar or transit date inputs.',
      detailsHi: 'शनि गोचर गणना हेतु आवश्यक चंद्र राशि या तिथि विवरण उपलब्ध नहीं है।',
      assessmentDate: assessmentDateStr
    };
  }

  // 1. Calculate transiting Saturn geocentric tropical longitude
  const tropSaturn = saturnLongitude(jd);

  // 2. Apply configured sidereal ayanamsha exactly once
  const ayan = getAyanamsa(jd, ayanamsaSystem);
  const sidSaturn = ((tropSaturn - ayan) % 360 + 360) % 360;

  // 3. Determine Saturn sidereal sign (1 to 12)
  const transitSaturnRashi = getRashi(sidSaturn);
  const saturnSignData = RASHIS[transitSaturnRashi - 1];
  const moonSignData = RASHIS[natalMoonRashi - 1];

  // 4. Calculate sign distance from natal Moon with correct zodiac wraparound [1..12]
  const signDistance = ((transitSaturnRashi - natalMoonRashi + 12) % 12) + 1;

  let classification = 'NONE';
  let isSadeSati = false;
  let isDhaiya = false;
  let phase = 'Sade Sati Free (शुभ गोचर)';
  let phaseHi = 'साढ़ेसाती मुक्त';
  let phaseCode = 'FREE';
  let details = `Transiting Saturn is in ${saturnSignData.en} (${signDistance} signs away from natal Moon in ${moonSignData.en}). Current transit of Saturn is harmonious and free from Sade Sati pressure. Steady growth favored.`;

  if (signDistance === 12) {
    classification = 'SADE_SATI_RISING';
    isSadeSati = true;
    phaseCode = 'RISING';
    phase = 'Rising Phase (प्रथम चरण / सिर काल)';
    phaseHi = 'साढ़ेसाती का प्रथम चरण (व्यय / सिर काल)';
    details = `Transiting Saturn is in ${saturnSignData.en} (12th from natal Moon in ${moonSignData.en}). Initial phase of Sade Sati. Calls for financial prudence, stress management, and avoiding speculative commitments.`;
  } else if (signDistance === 1) {
    classification = 'SADE_SATI_PEAK';
    isSadeSati = true;
    phaseCode = 'PEAK';
    phase = 'Peak Phase (द्वितीय चरण / हृदय काल)';
    phaseHi = 'साढ़ेसाती का मध्य / शिखर चरण (हृदय काल)';
    details = `Transiting Saturn is in ${saturnSignData.en} (transiting directly over natal Moon in ${moonSignData.en}). Core phase of Sade Sati. Requires spiritual endurance, humility, strict ethical conduct, and routine health checks.`;
  } else if (signDistance === 2) {
    classification = 'SADE_SATI_SETTING';
    isSadeSati = true;
    phaseCode = 'SETTING';
    phase = 'Setting Phase (तृतीय चरण / चरण मुक्ति काल)';
    phaseHi = 'साढ़ेसाती का तृतीय चरण (पैर / मुक्ति काल)';
    details = `Transiting Saturn is in ${saturnSignData.en} (2nd from natal Moon in ${moonSignData.en}). Final phase of Sade Sati. Rewards hard work, provides relief from past setbacks, and stabilizes profession and family finances.`;
  } else if (signDistance === 4) {
    classification = 'KANTAKA_SHANI';
    isDhaiya = true;
    phaseCode = 'KANTAKA';
    phase = 'Kantaka Shani (चतुर्थ ढैया)';
    phaseHi = 'शनि की चतुर्थ ढैया (कंटक शनि)';
    details = `Transiting Saturn is in ${saturnSignData.en} (4th from natal Moon in ${moonSignData.en}). Kantaka Shani Dhaiya period. Calls for careful maintenance of domestic peace, home property, and emotional balance.`;
  } else if (signDistance === 8) {
    classification = 'ASHTAMA_SHANI';
    isDhaiya = true;
    phaseCode = 'ASHTAMA';
    phase = 'Ashtama Shani (अष्टम ढैया)';
    phaseHi = 'शनि की अष्टम ढैया (कष्टप्रद गोचर)';
    details = `Transiting Saturn is in ${saturnSignData.en} (8th from natal Moon in ${moonSignData.en}). Ashtama Shani Dhaiya period. Advises caution in health, partnerships, legal documentation, and avoiding hasty risks.`;
  }

  return {
    valid: true,
    isSadeSati,
    isDhaiya,
    isAffected: isSadeSati || isDhaiya,
    phase,
    phaseHi,
    phaseCode,
    classification,
    signDistance,
    transitSaturnRashi,
    transitSaturnSign: saturnSignData.en,
    natalMoonRashi,
    natalMoonSign: moonSignData.en,
    details,
    saturnSiderealLongitude: sidSaturn,
    assessmentJD: jd,
    assessmentDate: assessmentDateStr
  };
}


export { getSaturnHelio, getEarthHelioVector, nutationInLongitude };
