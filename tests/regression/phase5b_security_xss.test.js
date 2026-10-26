/**
 * Test Suite: Phase 5B Security & DOM XSS Remediation Verification
 * Verifies SEC-01, SEC-02, SEC-03 fixes and context-specific escaping.
 */

import { escapeHtml } from "../../src/components/reports/FullPatrikaReport.js";

export async function runSecurityTests() {
  const suiteName = "Phase 5B Security & DOM-based XSS Remediation";
  console.log(`\n--- Running ${suiteName} ---`);

  let passed = 0;
  let total = 0;

  function assert(condition, message, detail = "") {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      if (detail) console.error(`     Detail: ${detail}`);
    }
  }

  // 1. Tag injection payloads
  const payloadTag = "<img src=x onerror=alert('XSS')>";
  const escapedTag = escapeHtml(payloadTag);
  assert(!escapedTag.includes("<") && !escapedTag.includes(">"), "Tag payload has brackets escaped");
  assert(escapedTag.includes("&lt;img src=x onerror=alert(&#39;XSS&#39;)&gt;"), "Exact entity encoding of img tag verified");

  // 2. Script injection payloads
  const payloadScript = "<script>document.cookie='steal'</script>";
  const escapedScript = escapeHtml(payloadScript);
  assert(!escapedScript.includes("<script>"), "Script tag neutralized");
  assert(escapedScript.includes("&lt;script&gt;"), "Script tag replaced with &lt;script&gt;");

  // 3. Attribute breakout payloads (double quote)
  const payloadAttr = `" onfocus="alert(1)" id="hack`;
  const escapedAttr = escapeHtml(payloadAttr);
  assert(!escapedAttr.includes('"'), "Double quotes escaped to &quot;");
  assert(escapedAttr.includes("&quot; onfocus=&quot;alert(1)&quot;"), "Attribute breakout neutralized");

  // 4. Attribute breakout payloads (single quote)
  const payloadSingle = `' onmouseover='alert(1)`;
  const escapedSingle = escapeHtml(payloadSingle);
  assert(!escapedSingle.includes("'"), "Single quotes escaped to &#39;");

  // 5. Ampersand and entity preservation
  const payloadAmp = "Tom & Jerry <cartoon>";
  assert(escapeHtml(payloadAmp) === "Tom &amp; Jerry &lt;cartoon&gt;", "Ampersands and brackets encoded properly");

  // 6. Unicode preservation (Hindi, Kannada, Telugu, Marathi, Sanskrit)
  const unicodeSample = "महालक्ष्मी हाजेरी & ಬೆಂಗಳೂರು (AstroVeda)";
  const escapedUnicode = escapeHtml(unicodeSample);
  assert(escapedUnicode.includes("महालक्ष्मी हाजेरी"), "Hindi Unicode text preserved uncorrupted");
  assert(escapedUnicode.includes("ಬೆಂಗಳೂರು"), "Kannada Unicode text preserved uncorrupted");
  assert(escapedUnicode.includes("&amp;"), "Nested ampersand within Unicode string escaped");

  // 7. Null and undefined safety
  assert(escapeHtml(null) === "", "escapeHtml(null) returns empty string");
  assert(escapeHtml(undefined) === "", "escapeHtml(undefined) returns empty string");
  assert(escapeHtml(0) === "0", "escapeHtml(0) returns string '0'");
  assert(escapeHtml(false) === "false", "escapeHtml(false) returns string 'false'");

  // 8. Simulated DOM rendering verification for Kundali dashboard
  const clientNamePayload = "<svg/onload=alert('client')>";
  const cityNamePayload = `New Delhi" onmouseover="alert('city')`;
  const safeClient = escapeHtml(clientNamePayload);
  const safeCity = escapeHtml(cityNamePayload);

  const kundaliHtmlSnippet = `
    <div class="name">${safeClient}</div>
    <div class="city" title="${safeCity}">📍 ${safeCity}</div>
  `;
  assert(!kundaliHtmlSnippet.includes("<svg/onload"), "Kundali dashboard snippet does not contain executable svg tag");
  assert(!kundaliHtmlSnippet.includes('title="New Delhi" onmouseover='), "Kundali dashboard snippet does not contain attribute breakout");

  // 9. Simulated DOM rendering verification for Matching
  const groomPayload = "<script>alert('groom')</script>";
  const bridePayload = "<iframe src='javascript:alert(1)'>";
  const safeGroom = escapeHtml(groomPayload);
  const safeBride = escapeHtml(bridePayload);

  const matchHtmlSnippet = `
    <h4>Groom (${safeGroom})</h4>
    <h4>Bride (${safeBride})</h4>
  `;
  assert(!matchHtmlSnippet.includes("<script>"), "Matching UI snippet does not contain raw script tag");
  assert(!matchHtmlSnippet.includes("<iframe"), "Matching UI snippet does not contain raw iframe tag");

  // 10. Simulated DOM rendering verification for Numerology phone
  const phonePayload = "<b onfocus=alert(1)>+91 9019088160</b>";
  const safePhone = escapeHtml(phonePayload);
  const numHtmlSnippet = `<strong style="color: #FFF;">नंबर: ${safePhone}</strong>`;
  assert(!numHtmlSnippet.includes("<b onfocus"), "Numerology phone snippet does not contain executable bold element");
  assert(numHtmlSnippet.includes("&lt;b onfocus=alert(1)&gt;"), "Phone payload safely encoded as text");

  console.log(`\nPhase 5B Security Suite Results: ${passed}/${total} passed`);
  return { suite: suiteName, passed, total };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ""))) {
  runSecurityTests();
}
