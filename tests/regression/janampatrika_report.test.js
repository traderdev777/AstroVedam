/**
 * Test Suite: Janampatrika Report Generation, 9-Page Structure,
 * Multilingual Isolation, Robustness & XSS Mitigation
 */

import { generateKundali, generateNavamsaChart } from '../../src/engines/astrology/kundali.js';
import { identifyYogas } from '../../src/engines/astrology/yoga.js';
import { analyzeDoshas } from '../../src/engines/astrology/dosha.js';
import { renderFullPatrikaReport, escapeHtml } from '../../src/components/reports/FullPatrikaReport.js';

export async function runReportTests() {
  const suiteName = 'Janampatrika 9-Page Report & Multilingual Integration';
  console.log(`\n--- Running ${suiteName} ---`);

  let passed = 0;
  let total = 0;

  function assert(condition, message, detail = '') {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      if (detail) console.error(`     Detail: ${detail}`);
    }
  }

  // Base seeker data
  const baseInputs = {
    name: 'Mahalaxmi Hajeri',
    date: '1999-03-28',
    time: '11:25',
    city: 'Vijayapura (Bijapur), Karnataka',
    fatherName: 'Pratap Singh Hajeri',
    motherName: 'Geetha P Hajeri',
    phone: '9019088160',
    latitude: 16.8302,
    longitude: 75.71,
    timezone: 5.5,
    ayanamsa: 'LAHIRI'
  };

  const kundali = generateKundali(baseInputs.date, baseInputs.time, baseInputs.latitude, baseInputs.longitude, baseInputs.timezone, baseInputs.ayanamsa);
  const navamsa = generateNavamsaChart(kundali);
  const yogas = identifyYogas(kundali);
  const doshas = analyzeDoshas(kundali);

  // Test 1: Nine-Page Structure across all 5 languages
  const languages = ['en', 'hi', 'kn', 'mr', 'te'];
  for (const lang of languages) {
    const html = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, baseInputs, lang);

    // Assert 9 discrete pages
    const pages = html.match(/class="patrika-page page-\d+"/g) || [];
    assert(pages.length === 9, `[${lang.toUpperCase()}] Exactly 9 pages generated`, `Found ${pages.length} pages`);

    for (let p = 1; p <= 9; p++) {
      assert(html.includes(`class="patrika-page page-${p}"`), `[${lang.toUpperCase()}] Page ${p} container present`);
    }

    // Assert absence of undefined, null, NaN
    const undefCount = (html.match(/undefined/g) || []).length;
    const nullCount = (html.match(/>null</g) || []).length;
    const nanCount = (html.match(/NaN/g) || []).length;

    assert(undefCount === 0, `[${lang.toUpperCase()}] Zero occurrences of 'undefined'`, `Found ${undefCount}`);
    assert(nullCount === 0, `[${lang.toUpperCase()}] Zero occurrences of '>null<'`, `Found ${nullCount}`);
    assert(nanCount === 0, `[${lang.toUpperCase()}] Zero occurrences of 'NaN'`, `Found ${nanCount}`);

    // Assert dual chart mount points on Page 2
    assert(html.includes('id="print-lagna-chart"'), `[${lang.toUpperCase()}] Lagna chart mount element present on Page 2`);
    assert(html.includes('id="print-navamsa-chart"'), `[${lang.toUpperCase()}] Navamsha chart mount element present on Page 2`);
  }

  // Test 2: Multilingual Content & Script Isolation
  const knHtml = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, baseInputs, 'kn');
  assert(knHtml.includes('ದ್ವಾದಶಿ'), '[KN] Localized Dwadashi Tithi in Kannada');
  assert(knHtml.includes('ಮಘಾ'), '[KN] Localized Magha Nakshatra in Kannada');
  assert(knHtml.includes('ಪಚ್ಚೆ ರತ್ನ'), '[KN] Localized Emerald in Kannada for Gemini Lagna');
  assert(knHtml.includes('ಸ್ವಕ್ಷೇತ್ರ'), '[KN] Localized Own Sign dignity in Kannada');
  assert(!knHtml.includes('Bright Saffron'), '[KN] Zero English color leakage');
  assert(!knHtml.includes('Yellow Sapphire (पुखराज'), '[KN] Zero Hindi leakage in Kannada attributes');

  const hiHtml = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, baseInputs, 'hi');
  assert(hiHtml.includes('द्वादशी'), '[HI] Localized Dwadashi Tithi in Hindi');
  assert(hiHtml.includes('मघा'), '[HI] Localized Magha Nakshatra in Hindi');

  const mrHtml = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, baseInputs, 'mr');
  assert(mrHtml.includes('तिथी'), '[MR] Localized Tithi label in Marathi');

  const teHtml = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, baseInputs, 'te');
  assert(teHtml.includes('తిథి'), '[TE] Localized Tithi label in Telugu');

  // Test 3: Blank & Optional Inputs Handling
  const emptyInputs = {
    name: '',
    fatherName: '',
    motherName: '',
    city: '',
    phone: '',
    date: '1999-03-28',
    time: '11:25',
    latitude: 16.8302,
    longitude: 75.71,
    timezone: 5.5,
    ayanamsa: 'LAHIRI'
  };

  const emptyHtmlKn = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, emptyInputs, 'kn');
  assert(emptyHtmlKn.includes('Seeker'), 'Empty name defaults to "Seeker"');
  assert(emptyHtmlKn.includes('ತಿಳಿಸಿಲ್ಲ (ಐಚ್ಛಿಕ)'), 'Empty phone renders localized "Not specified (Optional)"');
  assert(emptyHtmlKn.includes('📱 ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿಲ್ಲ (ಐಚ್ಛಿಕ ಸೇವೆ)'), 'Page 6 renders informational disclaimer card when phone is empty');
  assert(emptyHtmlKn.includes('New Delhi, Delhi'), 'Empty city defaults to "New Delhi, Delhi"');

  // Test 4: Hostile XSS Payloads & Safe Entity Rendering
  const xssInputs = {
    name: '<img src=x onerror=alert("xss_name")>',
    fatherName: '<script>alert("xss_father")</script>',
    motherName: '"><svg/onload=alert("xss_mother")>',
    city: 'City <script>alert("xss_city")</script> & "Quotes"',
    phone: '+91 99999<script>alert("xss_phone")</script>',
    date: '1999-03-28',
    time: '11:25',
    latitude: 16.8302,
    longitude: 75.71,
    timezone: 5.5,
    ayanamsa: 'LAHIRI'
  };

  const xssHtml = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, xssInputs, 'en');
  assert(!xssHtml.includes('<img src=x onerror='), 'XSS: Unescaped <img> tag NOT in output');
  assert(!xssHtml.includes('<script>alert("xss_father")</script>'), 'XSS: Unescaped <script> tag from fatherName NOT in output');
  assert(!xssHtml.includes('<svg/onload='), 'XSS: Unescaped <svg> tag from motherName NOT in output');
  assert(!xssHtml.includes('<script>alert("xss_phone")</script>'), 'XSS: Unescaped <script> tag from phone NOT in output');
  assert(xssHtml.includes('&lt;img src=x onerror=alert(&quot;xss_name&quot;)&gt;'), 'XSS: Name safely escaped to HTML entities');
  assert(xssHtml.includes('&lt;script&gt;alert(&quot;xss_father&quot;)&lt;/script&gt;'), 'XSS: Father safely escaped to HTML entities');

  // Test 5: Legitimate Special Characters (Apostrophes, Quotes, Ampersands)
  const specialInputs = {
    name: 'A & B "Test" O\'Neil',
    fatherName: 'Pratap & Sons',
    motherName: 'Mary O\'Connor',
    city: 'Hubballi "Smart" City',
    phone: '9019088160',
    date: '1999-03-28',
    time: '11:25',
    latitude: 16.8302,
    longitude: 75.71,
    timezone: 5.5,
    ayanamsa: 'LAHIRI'
  };

  const specialHtml = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, specialInputs, 'en');
  assert(specialHtml.includes('A &amp; B &quot;Test&quot; O&#39;Neil'), 'Legitimate name with special chars encoded safely');
  assert(specialHtml.includes('Pratap &amp; Sons'), 'Legitimate fatherName with & encoded safely');
  assert(specialHtml.includes('Mary O&#39;Connor'), 'Legitimate motherName with apostrophe encoded safely');

  console.log(`Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
