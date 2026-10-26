/**
 * Test Suite: Phase 5B.1 Context-Specific Security & DOM Safety Verification
 * Verifies that all user-controlled values rendered across Kundali, Matching, and Numerology
 * are context-safely handled across HTML text, quoted attributes, and URLs.
 */

import { escapeHtml } from "../../src/utils/sanitizer.js";

export async function runSecurityContextTests() {
  const suiteName = "Phase 5B.1 Security Context & Rendering Safety";
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

  // =========================================================================
  // 1. Quoted Attribute Context Verification (Kundali, Matching, Numerology inputs)
  // =========================================================================
  const attrPayloads = [
    `" onfocus="alert(1)" id="hack`,
    `' onmouseover='alert(2)'`,
    `"><script>alert(3)</script><input value="`,
    `" autofocus onfocus="fetch('/steal?c='+document.cookie)"`,
    `' onclick='evil()' style='color:red'`
  ];

  for (const payload of attrPayloads) {
    const safe = escapeHtml(payload);
    const simulatedInput = `<input type="text" id="k-name" value="${safe}" required />`;
    
    // Assert no raw quotes break out of the value attribute
    assert(!simulatedInput.includes(`value="${payload}"`), `Attribute breakout neutralized for: ${payload.slice(0, 25)}...`);
    assert(!simulatedInput.includes('" onfocus='), `No attribute breakout into onfocus handler`);
    assert(!simulatedInput.includes("' onmouseover="), `No attribute breakout into onmouseover handler`);
    assert(!simulatedInput.includes("<script>"), `No injected script tags inside attribute`);
  }

  // =========================================================================
  // 2. HTML Text Context Verification (Kundali dashboard, Matching headers, Numerology results)
  // =========================================================================
  const textPayloads = [
    "<script>alert('xss')</script>",
    "<img src=x onerror=alert('img-xss')>",
    "<svg/onload=alert('svg-xss')>",
    "<iframe src='javascript:alert(1)'>",
    "<body onload=alert('body-xss')>",
    "<a href='javascript:alert(1)'>Click Me</a>"
  ];

  for (const payload of textPayloads) {
    const safe = escapeHtml(payload);
    const containerSnippet = `
      <div class="name">${safe}</div>
      <h4>Groom (${safe})</h4>
      <strong>नंबर: ${safe}</strong>
    `;

    assert(!containerSnippet.includes("<script>"), `HTML text: No executable script tag for ${payload.slice(0, 20)}`);
    assert(!containerSnippet.includes("<img src=x"), `HTML text: No unescaped img tag`);
    assert(!containerSnippet.includes("<svg/onload"), `HTML text: No unescaped svg tag`);
    assert(!containerSnippet.includes("<iframe"), `HTML text: No unescaped iframe tag`);
    assert(safe.includes("&lt;") && safe.includes("&gt;"), `HTML text: Entity brackets correctly encoded`);
  }

  // =========================================================================
  // 3. Double-Context Verification (Title Attribute + Text Content in Kundali)
  // =========================================================================
  const dualPayload = `New Delhi" onmouseover="alert('xss')<script>alert(2)</script>`;
  const safeDual = escapeHtml(dualPayload);
  const dualSnippet = `<div class="city" title="${safeDual}">📍 ${safeDual}</div>`;
  assert(!dualSnippet.includes('title="New Delhi" onmouseover='), "Dual context: Attribute quotes safely encoded inside title attribute");
  assert(!dualSnippet.includes("<script>"), "Dual context: Script tag safely encoded inside inner text");
  assert(dualSnippet.includes("&quot; onmouseover=&quot;"), "Dual context: Event handler enclosed as harmless attribute text");

  // =========================================================================
  // 4. Legitimate Input & Unicode Preservation
  // =========================================================================
  const legitimateInputs = [
    { input: "Pt. Ramakant Sharma-O'Connor", desc: "Apostrophe and hyphen in English name" },
    { input: "पं. रामाकांत शर्मा (काशी)", desc: "Devanagari Hindi text with honorific and parens" },
    { input: "ಸುಪ್ರೀತ್ ಠಾಕೂರ್ (ಬೆಂಗಳೂರು)", desc: "Kannada Unicode with conjuncts" },
    { input: "శ్రీనివాస రామానుజన్", desc: "Telugu Unicode text" },
    { input: "महालक्ष्मी & महागणपति", desc: "Devanagari with ampersand" },
    { input: "Alpha / Beta & Gamma (100% pure)", desc: "Punctuation: slash, ampersand, percent, parens" }
  ];

  for (const item of legitimateInputs) {
    const safe = escapeHtml(item.input);
    if (item.input.includes("&")) {
      assert(safe.includes("&amp;"), `Legitimate ampersand safely encoded for: ${item.desc}`);
    }
    if (item.input.includes("'")) {
      assert(safe.includes("&#39;"), `Apostrophe safely encoded as &#39; for: ${item.desc}`);
    }
    // Unicode characters must not be corrupted or stripped
    if (item.input.includes("रामाकांत")) {
      assert(safe.includes("रामाकांत"), `Hindi characters preserved intact: ${item.desc}`);
    }
    if (item.input.includes("ಸುಪ್ರೀತ್")) {
      assert(safe.includes("ಸುಪ್ರೀತ್"), `Kannada characters preserved intact: ${item.desc}`);
    }
    if (item.input.includes("శ్రీనివాస")) {
      assert(safe.includes("శ్రీనివాస"), `Telugu characters preserved intact: ${item.desc}`);
    }
  }

  // =========================================================================
  // 5. Boundary & Type Safety Verification
  // =========================================================================
  assert(escapeHtml(null) === "", "escapeHtml(null) returns empty string");
  assert(escapeHtml(undefined) === "", "escapeHtml(undefined) returns empty string");
  assert(escapeHtml("") === "", "escapeHtml('') returns empty string");
  assert(escapeHtml(0) === "0", "escapeHtml(0) preserves numeric zero as string");
  assert(escapeHtml(12345) === "12345", "escapeHtml(12345) preserves positive integer");
  assert(escapeHtml(-98.76) === "-98.76", "escapeHtml(-98.76) preserves negative float");
  assert(escapeHtml(false) === "false", "escapeHtml(false) preserves boolean false as string");
  assert(escapeHtml(true) === "true", "escapeHtml(true) preserves boolean true as string");

  console.log(`\nPhase 5B.1 Security Context Suite Results: ${passed}/${total} passed`);
  return { suite: suiteName, passed, total };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ""))) {
  runSecurityContextTests();
}
