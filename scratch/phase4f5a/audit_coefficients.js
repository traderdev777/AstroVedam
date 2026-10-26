import fs from 'fs';
import * as ephem from '../../src/engines/astrology/ephemeris.js';

// 1. Fetch raw authoritative VSOP87D Saturn dataset
console.log('Fetching authoritative VSOP87D Saturn dataset...');
const url = 'https://raw.githubusercontent.com/commenthol/astronomia/master/data/vsop87Dsaturn.js';
const text = await fetch(url).then(r => r.text());
const jsonLike = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
const vsopRaw = (new Function('return ' + jsonLike))();

// Read ephemeris.js text and extract the production arrays
const ephemSource = fs.readFileSync('src/engines/astrology/ephemeris.js', 'utf8');

function extractArray(name) {
  const startMarker = `const ${name} = [`;
  const startIndex = ephemSource.indexOf(startMarker);
  if (startIndex === -1) throw new Error(`Could not find ${name}`);
  // Find matching closing bracket
  let openBrackets = 0;
  let endIndex = -1;
  for (let i = startIndex + startMarker.length - 1; i < ephemSource.length; i++) {
    if (ephemSource[i] === '[') openBrackets++;
    else if (ephemSource[i] === ']') {
      openBrackets--;
      if (openBrackets === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  const arrayCode = ephemSource.slice(startIndex, endIndex);
  const fn = new Function(`${arrayCode}; return ${name};`);
  return fn();
}

const prodL = extractArray('SATURN_VSOP87D_L');
const prodB = extractArray('SATURN_VSOP87D_B');
const prodR = extractArray('SATURN_VSOP87D_R');

console.log('Extracted Production Arrays:');
console.log(`  L: ${prodL.length} orders, total terms = ${prodL.reduce((acc, o) => acc + o.length, 0)}`);
console.log(`  B: ${prodB.length} orders, total terms = ${prodB.reduce((acc, o) => acc + o.length, 0)}`);
console.log(`  R: ${prodR.length} orders, total terms = ${prodR.reduce((acc, o) => acc + o.length, 0)}`);

// 2. Audit against raw source and check threshold
const threshold = 5e-5;

function auditSeries(prodArr, rawSeries, name, unit) {
  console.log(`\n--- Auditing ${name} (${unit}) ---`);
  let totalRawTerms = 0;
  let totalKeptRaw = 0;
  let omittedSumAbs = 0;
  let omittedSumSq = 0;
  let mismatchCount = 0;

  for (let order = 0; order <= 5; order++) {
    const rawOrder = rawSeries[String(order)] || [];
    const prodOrder = prodArr[order] || [];
    totalRawTerms += rawOrder.length;

    const expectedKept = rawOrder.filter(t => Math.abs(t[0]) >= threshold);
    totalKeptRaw += expectedKept.length;

    // Verify omitted terms
    const omitted = rawOrder.filter(t => Math.abs(t[0]) < threshold);
    for (const t of omitted) {
      omittedSumAbs += Math.abs(t[0]);
      omittedSumSq += t[0] * t[0];
    }

    // Check count match
    if (expectedKept.length !== prodOrder.length) {
      console.error(`  Mismatch in order ${order}: expected ${expectedKept.length} terms, got ${prodOrder.length}`);
      mismatchCount++;
    }

    // Verify every term matches exactly
    for (let j = 0; j < expectedKept.length; j++) {
      const exp = expectedKept[j];
      const act = prodOrder[j];
      if (!act) {
        console.error(`  Order ${order} term ${j} missing!`);
        mismatchCount++;
        continue;
      }
      const diffA = Math.abs(exp[0] - act[0]);
      const diffB = Math.abs(exp[1] - act[1]);
      const diffC = Math.abs(exp[2] - act[2]);
      if (diffA > 1e-12 || diffB > 1e-12 || diffC > 1e-12) {
        console.error(`  Order ${order} term ${j} mismatch: exp=[${exp}], act=[${act}]`);
        mismatchCount++;
      }
    }
  }

  const rmsOmitted = Math.sqrt(omittedSumSq);
  console.log(`  Raw terms: ${totalRawTerms}`);
  console.log(`  Terms >= ${threshold}: ${totalKeptRaw} (Production has: ${prodArr.reduce((a, o) => a + o.length, 0)})`);
  console.log(`  Omitted terms: ${totalRawTerms - totalKeptRaw}`);
  console.log(`  Sum of |A| of omitted terms: ${omittedSumAbs.toExponential(4)} ${unit} (${(omittedSumAbs * 180 / Math.PI * 60).toFixed(4)} arcmin)`);
  console.log(`  RMS of omitted terms: ${rmsOmitted.toExponential(4)} ${unit} (${(rmsOmitted * 180 / Math.PI * 60).toFixed(4)} arcmin)`);
  console.log(`  Coefficient Mismatches: ${mismatchCount}`);
  return { totalRawTerms, totalKeptRaw, omittedSumAbs, rmsOmitted, mismatchCount };
}

const resL = auditSeries(prodL, vsopRaw.L, 'Longitude (L)', 'radians');
const resB = auditSeries(prodB, vsopRaw.B, 'Latitude (B)', 'radians');
const resR = auditSeries(prodR, vsopRaw.R, 'Radius (R)', 'AU');

console.log('\n=============================================');
console.log('COEFFICIENT AUDIT SUMMARY:');
console.log(`Total Raw VSOP87D Saturn terms: ${resL.totalRawTerms + resB.totalRawTerms + resR.totalRawTerms}`);
console.log(`Total Production terms retained: ${prodL.reduce((a,o)=>a+o.length,0) + prodB.reduce((a,o)=>a+o.length,0) + prodR.reduce((a,o)=>a+o.length,0)}`);
console.log(`Total Mismatches: ${resL.mismatchCount + resB.mismatchCount + resR.mismatchCount}`);
console.log('=============================================');
