/**
 * AstroVedam - Master Regression Test Runner
 * Aggregates and executes all unit, integration, and security regression suites.
 */

import { runReportTests } from './regression/janampatrika_report.test.js';
import { runChartTests } from './regression/charts_rendering.test.js';
import { runAstrologyBaselineTests } from './regression/astrology_baseline.test.js';
import { runAstroGuruTests } from './regression/astroguru_advisor.test.js';
import { runAscendantTests } from './regression/ascendant_verification.test.js';
import { runGeocentricPlanetTests } from './regression/geocentric_planet_verification.test.js';
import { runRetrogradeTests } from './regression/retrograde_verification.test.js';
import { runSadeSatiTests } from './regression/sade_sati_verification.test.js';
import { runPhase4DTests } from './regression/phase4d_remediation.test.js';
import { runPhase4F1PrecisionTests } from './regression/phase4f1_precision.test.js';
import { runPhase4F2PrecisionTests } from './regression/phase4f2_precision.test.js';
import { runPhase4F3PrecisionTests } from './regression/phase4f3_precision.test.js';
import { runPhase4F4PrecisionTests } from './regression/phase4f4_precision.test.js';
import { runPhase4F5PrecisionTests } from './regression/phase4f5_precision.test.js';
import { runPhase4F6CorrectionTests } from './regression/phase4f6_saturn_corrections.test.js';
import { runSecurityTests } from './regression/phase5b_security_xss.test.js';
import { runInputSafetyTests } from './regression/phase5b_input_safety.test.js';
import { runAngleNormalizationTests } from './regression/phase5b_angle_normalization.test.js';
import { runSecurityContextTests } from './regression/phase5b1_security_context.test.js';
import { runPhase5B2NavamsaFPTests } from './regression/phase5b2_navamsa_fp.test.js';

console.log('===========================================================');
console.log('🪐 ASTROVEDAM MASTER QA REGRESSION TEST SUITE');
console.log('===========================================================');

const startTime = Date.now();
const results = [];

try {
  results.push(await runReportTests());
  results.push(await runChartTests());
  results.push(await runAstrologyBaselineTests());
  results.push(await runAstroGuruTests());
  results.push(await runAscendantTests());
  results.push(await runGeocentricPlanetTests());
  results.push(await runRetrogradeTests());
  results.push(await runSadeSatiTests());
  results.push(await runPhase4DTests());
  results.push(await runPhase4F1PrecisionTests());
  results.push(await runPhase4F2PrecisionTests());
  results.push(await runPhase4F3PrecisionTests());
  results.push(await runPhase4F4PrecisionTests());
  results.push(await runPhase4F5PrecisionTests());
  results.push(await runPhase4F6CorrectionTests());
  results.push(await runSecurityTests());
  results.push(await runInputSafetyTests());
  results.push(await runAngleNormalizationTests());
  results.push(await runSecurityContextTests());
  results.push(await runPhase5B2NavamsaFPTests());
} catch (err) {
  console.error('\n💥 CRITICAL TEST SUITE RUNTIME ERROR:', err);
  process.exit(1);
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n===========================================================');
console.log('📊 REGRESSION TEST EXECUTION SUMMARY');
console.log('===========================================================');

let grandTotal = 0;
let grandPassed = 0;

for (const r of results) {
  const status = r.passed === r.total ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | ${r.suite.padEnd(50)} | ${r.passed}/${r.total} passed`);
  grandTotal += r.total;
  grandPassed += r.passed;
}

const grandFailed = grandTotal - grandPassed;
console.log('-----------------------------------------------------------');
console.log(`TOTAL ASSERTIONS: ${grandTotal} | PASSED: ${grandPassed} | FAILED: ${grandFailed} | DURATION: ${duration}s`);
console.log('===========================================================');

if (grandFailed > 0) {
  console.error(`\n❌ REGRESSION FAILURE: ${grandFailed} assertion(s) failed!`);
  process.exit(1);
} else {
  console.log('\n🌟 ALL REGRESSION TESTS PASSED CLEANLY (100% SUCCESS) 🌟\n');
  process.exit(0);
}
