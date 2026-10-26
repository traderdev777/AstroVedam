import fs from 'fs';
import * as e from '../../src/engines/astrology/ephemeris.js';

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

const fixture = JSON.parse(fs.readFileSync('scratch/reference_cases.json', 'utf8'));

console.log("=== CONTROLLED ABERRATION COMPARISON ON 9 CANONICAL CASES ===");
console.log("Case | Ref (Q31) | Prod Lon | Prod Err | Aberr Corr | Prod+Aberr | Residual with Aberr");
console.log("----------------------------------------------------------------------------------");

for (const c of fixture) {
  const [yr, mo, dy] = c.date.split('-').map(Number);
  const [hr, mn] = c.time.split(':').map(Number);
  // UTC instant in fixture: c.utcInstant
  const d = new Date(c.utcInstant);
  const jd = e.dateToJD(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());

  const prodLon = e.saturnLongitude(jd);
  const refQ31 = c.planets.Saturn.lonTrop;

  const sunLon = e.sunLongitude(jd);
  const aberrCorr_deg = (-20.49552 / 3600) * Math.cos((sunLon - prodLon) * DEG);
  const aberrCorr_arcsec = aberrCorr_deg * 3600;

  const prodWithAberr = prodLon + aberrCorr_deg;

  const prodErr_arcsec = ((prodLon - refQ31 + 540) % 360 - 180) * 3600;
  const aberrErr_arcsec = ((prodWithAberr - refQ31 + 540) % 360 - 180) * 3600;

  console.log(`${c.id.padEnd(6)} | ${refQ31.toFixed(4)}° | ${prodLon.toFixed(4)}° | ${(prodErr_arcsec >= 0 ? '+' : '') + prodErr_arcsec.toFixed(1) + '" (' + (prodErr_arcsec/60).toFixed(2) + "')"} | ${(aberrCorr_arcsec >= 0 ? '+' : '') + aberrCorr_arcsec.toFixed(1) + '"'} | ${prodWithAberr.toFixed(4)}° | ${(aberrErr_arcsec >= 0 ? '+' : '') + aberrErr_arcsec.toFixed(1) + '" (' + (aberrErr_arcsec/60).toFixed(2) + "')"}`);
}

