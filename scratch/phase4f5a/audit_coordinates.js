import fs from 'fs';
import * as e from '../../src/engines/astrology/ephemeris.js';

console.log('--- Auditing Coordinate Pipeline on REF-06 (2023-06-21 16:00 UTC) ---');
const jd = e.dateToJD(2023, 6, 21, 16, 0, 0);
const T = e.julianCenturies(jd);
console.log(`JD: ${jd}, T: ${T}`);

// 1. Earth vector
const earth = e.getEarthHelioVector ? e.getEarthHelioVector(T) : null;
console.log('Earth Vector:', earth);

// 2. Nutation
const Omega = (125.04452 - 1934.136261 * T) * Math.PI / 180;
const L0 = (280.4665 + 36000.7698 * T) * Math.PI / 180;
const dPsi = (-17.20 * Math.sin(Omega) - 1.32 * Math.sin(2 * L0)) / 3600;
console.log(`IAU 1980 Nutation dPsi: ${(dPsi * 3600).toFixed(4)} arcsec (${dPsi.toFixed(6)}°)`);

// 3. Ayanamsha
const ayan = e.getAyanamsa(jd);
console.log(`Lahiri Ayanamsha: ${ayan.toFixed(4)}°`);

// 4. Saturn Tropical & Sidereal
const satTrop = e.saturnLongitude(jd);
const satSid = (satTrop - ayan + 360) % 360;
console.log(`Saturn Tropical: ${satTrop.toFixed(4)}°`);
console.log(`Saturn Sidereal: ${satSid.toFixed(4)}°`);

// 5. Compare with Horizons Ref for REF-06
const refCases = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));
const c6 = refCases.find(c => c.id === 'REF-06');
console.log(`Horizons Ref Trop: ${c6.planets.Saturn.lonTrop.toFixed(4)}°`);
console.log(`Horizons Ref Sid:  ${c6.planets.Saturn.lonSid.toFixed(4)}°`);
console.log(`Trop Error: ${(satTrop - c6.planets.Saturn.lonTrop) * 60} arcmin`);
console.log(`Sid Error:  ${(satSid - c6.planets.Saturn.lonSid) * 60} arcmin`);
