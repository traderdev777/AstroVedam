import fs from 'fs';
import * as e from '../../src/engines/astrology/ephemeris.js';

// Let's inspect REF-01 (1999-03-28 05:55 UTC)
// In scratch/reference_cases.json:
const fixture = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));
const c1 = fixture.find(c => c.id === 'REF-01');

const jd = 2451265.746528;
const prodLon = e.saturnLongitude(jd);
const horizonsRef = c1.planets.Saturn.lonTrop; // 32.9745009

console.log(`REF-01 Horizons Q31 (apparent): ${horizonsRef.toFixed(6)}°`);
console.log(`REF-01 AstroVedam prodLon:       ${prodLon.toFixed(6)}°`);
console.log(`Difference:                     ${((prodLon - horizonsRef) * 60).toFixed(4)}' (${((prodLon - horizonsRef) * 3600).toFixed(2)}")`);

// Let's compute Earth's velocity and stellar aberration vector
const T = (jd - 2451545.0) / 36525.0;
const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

// Sun longitude at epoch
const sunLon = e.sunLongitude(jd);
console.log(`Sun Longitude at epoch: ${sunLon.toFixed(4)}°`);

// Earth orbital motion direction is Sun + 90 degrees (apex of Earth's motion)
const apex = (sunLon + 90) % 360;
console.log(`Earth orbital motion apex: ${apex.toFixed(4)}°`);

// Classical stellar aberration formula for ecliptic longitude:
// Delta lambda_aberr = -k * cos(Sun - lambda) / cos(beta)
// where k = 20.49552 arcseconds = 0.0056932 degrees
const k_arcsec = 20.49552;
const k_deg = k_arcsec / 3600;
const satLon = prodLon;
const deltaLambdaAberr_deg = -k_deg * Math.cos((sunLon - satLon) * DEG);
const deltaLambdaAberr_arcsec = deltaLambdaAberr_deg * 3600;

console.log(`Stellar aberration on Saturn longitude: ${deltaLambdaAberr_arcsec.toFixed(2)}" (${(deltaLambdaAberr_arcsec / 60).toFixed(4)}')`);

