/**
 * AstroVeda - Astronomical Ephemeris Engine
 * High-precision planetary position calculations
 * Based on VSOP87 simplified + Meeus algorithms
 */

import { AYANAMSA, RASHIS } from './constants.js';

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
 * Calculate Moon's tropical longitude (high precision)
 */
export function moonLongitude(jd) {
  const T = julianCenturies(jd);
  // Moon's mean longitude
  let Lp = 218.3164477 + T * (481267.88123421 - T * (0.0015786 - T * (1/538841 - T/65194000)));
  Lp = norm360(Lp);
  // Moon's mean anomaly
  let Mp = 134.9633964 + T * (477198.8675055 + T * (0.0087414 + T * (1/69699 - T/14712000)));
  Mp = norm360(Mp) * DEG;
  // Sun's mean anomaly
  let M = 357.5291092 + T * (35999.0502909 - T * (0.0001536 + T/24490000));
  M = norm360(M) * DEG;
  // Moon's mean elongation
  let D = 297.8501921 + T * (445267.1114034 - T * (0.0018819 + T * (1/545868 - T/113065000)));
  D = norm360(D) * DEG;
  // Moon's argument of latitude
  let F = 93.2720950 + T * (483202.0175233 - T * (0.0036539 - T * (1/3526000 + T/863310000)));
  F = norm360(F) * DEG;

  // Principal term corrections (simplified, most significant terms)
  let dL = 0;
  dL += 6288774 * Math.sin(Mp);
  dL += 1274027 * Math.sin(2 * D - Mp);
  dL += 658314 * Math.sin(2 * D);
  dL += 213618 * Math.sin(2 * Mp);
  dL += -185116 * Math.sin(M);
  dL += -114332 * Math.sin(2 * F);
  dL += 58793 * Math.sin(2 * D - 2 * Mp);
  dL += 57066 * Math.sin(2 * D - M - Mp);
  dL += 53322 * Math.sin(2 * D + Mp);
  dL += 45758 * Math.sin(2 * D - M);
  dL += -40923 * Math.sin(M - Mp);
  dL += -34720 * Math.sin(D);
  dL += -30383 * Math.sin(M + Mp);
  dL += 15327 * Math.sin(2 * D - 2 * F);
  dL += -12528 * Math.sin(Mp + 2 * F);
  dL += 10980 * Math.sin(Mp - 2 * F);
  
  const moonLong = Lp + dL / 1000000;
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
 * Calculate Mars geocentric longitude (VSOP87 / Meeus)
 */
export function marsLongitude(jd) {
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);
  const a = 1.52367934 + 0.00000319 * T;
  const e = 0.093405 + 0.000092064 * T;
  const I = (1.849691 - 0.000601 * T) * DEG;
  const L = norm360(355.433 + 19141.696 * T);
  const peri = norm360(336.060 + 1.841 * T);
  const Omega = norm360(49.558 - 0.295 * T) * DEG;
  const M = norm360(L - peri) * DEG;
  const C = (2 * e - (e ** 3) / 4) * Math.sin(M)
    + (5/4 * e ** 2) * Math.sin(2 * M)
    + (13/12 * e ** 3) * Math.sin(3 * M);
  const l = norm360(L + C * RAD);
  const v = M + C;
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
  const u = norm360(l - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
  return norm360(Math.atan2(y - earth.y, x - earth.x) * RAD);
}

/**
 * Calculate Mercury geocentric longitude (VSOP87 / Meeus)
 */
export function mercuryLongitude(jd) {
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);
  const a = 0.38709893 + 0.00000066 * T;
  const e = 0.20563069 + 0.00002527 * T;
  const I = (7.004979 - 0.005947 * T) * DEG;
  const L = norm360(252.250906 + 149472.674111 * T);
  const peri = norm360(77.45645 + 1.556478 * T);
  const Omega = norm360(48.330766 - 0.125341 * T) * DEG;
  const M = norm360(L - peri) * DEG;
  const C = (2 * e - (e ** 3) / 4) * Math.sin(M)
    + (5/4 * e ** 2) * Math.sin(2 * M)
    + (13/12 * e ** 3) * Math.sin(3 * M);
  const l = norm360(L + C * RAD);
  const v = M + C;
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
  const u = norm360(l - Omega * RAD) * DEG;
  const x = r * (Math.cos(Omega) * Math.cos(u) - Math.sin(Omega) * Math.sin(u) * Math.cos(I));
  const y = r * (Math.sin(Omega) * Math.cos(u) + Math.cos(Omega) * Math.sin(u) * Math.cos(I));
  return norm360(Math.atan2(y - earth.y, x - earth.x) * RAD);
}

/**
 * Calculate Jupiter geocentric longitude (VSOP87 / Meeus)
 */
export function jupiterLongitude(jd) {
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);
  const Mj = norm360(20.020194 + T * 3034.684357);
  const Ms = norm360(317.020696 + T * 1222.113778);
  const deltaL = -0.332 * Math.sin((2*Mj - 5*Ms - 67.6) * DEG)
    - 0.056 * Math.sin((2*Mj - 2*Ms + 21) * DEG)
    + 0.042 * Math.sin((3*Mj - 5*Ms + 21) * DEG)
    - 0.036 * Math.sin((Mj - 2*Ms) * DEG)
    + 0.022 * Math.cos((Mj - Ms) * DEG)
    + 0.023 * Math.sin((2*Mj - 3*Ms + 52) * DEG)
    - 0.016 * Math.sin((Mj - 5*Ms - 69) * DEG);
  const a = 5.204267;
  const e = 0.048498 + 0.000004 * T;
  const I = (1.303270 - 0.005696 * T) * DEG;
  const L = norm360(34.351484 + 3034.905675 * T + deltaL);
  const peri = norm360(14.75385 + 1.619 * T);
  const Omega = norm360(100.464441 + 0.176683 * T) * DEG;
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
 * Calculate Saturn geocentric longitude (VSOP87 / Meeus)
 */
export function saturnLongitude(jd) {
  const T = julianCenturies(jd);
  const earth = getEarthHelioVector(T);
  const Mj = norm360(20.020194 + T * 3034.684357);
  const Ms = norm360(317.020696 + T * 1222.113778);
  const deltaL = 0.812 * Math.sin((2*Mj - 5*Ms - 67.6) * DEG)
    - 0.229 * Math.cos((2*Mj - 4*Ms - 2) * DEG)
    + 0.119 * Math.sin((Mj - 2*Ms - 3) * DEG)
    + 0.046 * Math.sin((2*Mj - 6*Ms + 69) * DEG)
    + 0.014 * Math.sin((Mj - 3*Ms + 32) * DEG);
  const a = 9.582017;
  const e = 0.055509 - 0.000346 * T;
  const I = (2.485240 + 0.001083 * T) * DEG;
  const L = norm360(50.077471 + 1222.113794 * T + deltaL);
  const peri = norm360(92.43194 + 1.958 * T);
  const Omega = norm360(113.665524 - 0.256671 * T) * DEG;
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

