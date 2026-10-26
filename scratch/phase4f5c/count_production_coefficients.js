import fs from 'fs';

const code = fs.readFileSync('src/engines/astrology/ephemeris.js', 'utf8');

function extractArray(name) {
  const startIdx = code.indexOf(`const ${name} = [`);
  if (startIdx === -1) throw new Error(`Could not find ${name}`);
  const sub = code.slice(startIdx + `const ${name} = `.length);
  // find matching closing bracket
  let depth = 0;
  let endIdx = -1;
  for (let i = 0; i < sub.length; i++) {
    if (sub[i] === '[') depth++;
    else if (sub[i] === ']') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  const jsonLike = sub.slice(0, endIdx);
  // evaluate safely
  return eval(jsonLike);
}

const L = extractArray('SATURN_VSOP87D_L');
const B = extractArray('SATURN_VSOP87D_B');
const R = extractArray('SATURN_VSOP87D_R');

console.log('=== DIRECT RUNTIME INSPECTION OF SATURN COEFFICIENTS ===\n');

console.log('--- SATURN_VSOP87D_L (Longitude) ---');
let countL = 0;
L.forEach((order, idx) => {
  console.log(`  Order tau^${idx}: ${order.length} terms`);
  countL += order.length;
});
console.log(`Total Longitude (L) terms: ${countL}\n`);

console.log('--- SATURN_VSOP87D_B (Latitude) ---');
let countB = 0;
B.forEach((order, idx) => {
  console.log(`  Order tau^${idx}: ${order.length} terms`);
  countB += order.length;
});
console.log(`Total Latitude (B) terms: ${countB}\n`);

console.log('--- SATURN_VSOP87D_R (Radius) ---');
let countR = 0;
R.forEach((order, idx) => {
  console.log(`  Order tau^${idx}: ${order.length} terms`);
  countR += order.length;
});
console.log(`Total Radius (R) terms: ${countR}\n`);

const grandTotal = countL + countB + countR;
console.log(`=======================================================`);
console.log(`GRAND TOTAL PRODUCTION SATURN TERMS: ${grandTotal}`);
console.log(`L: ${countL}, B: ${countB}, R: ${countR}`);
console.log(`=======================================================`);
