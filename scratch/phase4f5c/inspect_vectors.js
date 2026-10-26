import * as e from '../../src/engines/astrology/ephemeris.js';

const RAD = 180 / Math.PI;
const DEG = Math.PI / 180;

const jd = 2451265.746528; // REF-01 (1999-03-28 05:55 UTC)
const T = e.julianCenturies(jd);
const dPsi = e.nutationInLongitude(T);

// Let's compute with tau and without tau:
// In ephemeris.js:
// const tau = 0.0057755183 * d0;
// We can test by computing saturnLongitude(jd)
const prodTrop = e.saturnLongitude(jd);

console.log(`REF-01 Epoch: JD ${jd}`);
console.log(`Nutation dPsi: ${(dPsi * 3600).toFixed(2)} arcsec (${(dPsi * 60).toFixed(4)} arcmin)`);
console.log(`Production saturnLongitude: ${prodTrop.toFixed(6)}°`);

// Reference from Horizons:
// In reference_cases.json: REF-01 Saturn tropical is 32.9745009°
const refHorizons = 32.9745009;
console.log(`Horizons ref (apparent Q31): ${refHorizons.toFixed(6)}°`);
console.log(`Diff: ${((prodTrop - refHorizons) * 60).toFixed(4)} arcmin (${((prodTrop - refHorizons) * 3600).toFixed(2)} arcsec)`);

