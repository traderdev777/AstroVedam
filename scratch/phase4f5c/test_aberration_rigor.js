import * as e from '../../src/engines/astrology/ephemeris.js';

// Let's test REF-01 (1999-03-28 05:55 UTC)
// JD = 2451265.746528
const jd = 2451265.746528;
const T = (jd - 2451545.0) / 36525.0;

// Earth position and velocity
// In ephemeris.js:
// L0 = 280.46646 + T * (36000.76983 + T * 0.0003032)
// Earth velocity v_E is approximately 2*pi*AU / year = 29.78 km/s
// In AU/day: 2*pi / 365.256363 = 0.017202 AU/day
// c = 173.1446 AU/day (since 1/c = 0.0057755183 days/AU)
// v_E / c = 0.017202 / 173.1446 = 9.935e-5 radians = 20.49 arcseconds!

console.log("=== STELLAR ABERRATION INVESTIGATION ===");
console.log(`v_E / c ≈ 20.5 arcseconds (0.34 arcminutes)`);

// Let's evaluate what production saturnLongitude gives:
const prodTrop = e.saturnLongitude(jd);
console.log(`Production saturnLongitude: ${prodTrop.toFixed(6)}°`);

// Reference from Horizons Quantity 31: 32.9745009°
const refTrop = 32.9745009;
console.log(`Horizons Quantity 31 (apparent): ${refTrop.toFixed(6)}°`);
console.log(`Difference (Production - Horizons Q31): ${((prodTrop - refTrop) * 60).toFixed(4)} arcmin (${((prodTrop - refTrop) * 3600).toFixed(2)} arcsec)`);

