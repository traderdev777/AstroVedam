/**
 * Test Suite: AstroGuru Conversational AI Engine
 * Validates natural language intent classification, localized responses,
 * and dynamic birth-chart adaptation.
 */

import { generateKundali } from '../../src/engines/astrology/kundali.js';
import { getAstroGuruResponse, classifyIntent, detectLanguage } from '../../src/engines/astroguru/advisor.js';

export async function runAstroGuruTests() {
  const suiteName = 'AstroGuru Conversational AI & Chart Awareness';
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

  // Create two distinct nativities to test personalization
  const chartSagittarius = generateKundali('1999-03-28', '11:25', 16.8302, 75.71, 5.5, 'LAHIRI'); // Sagittarius Lagna
  const inputsSagittarius = { name: 'Mahalaxmi Hajeri', date: '1999-03-28', time: '11:25', city: 'Vijayapura' };

  const chartGemini = generateKundali('1995-10-24', '10:30', 25.3176, 82.9739, 5.5, 'LAHIRI'); // Gemini/Taurus Lagna
  const inputsGemini = { name: 'Aarav Sharma', date: '1995-10-24', time: '10:30', city: 'Varanasi' };

  // 1. Test 10 Key Intents in Kannada
  const knQueries = [
    { query: 'ನನ್ನ ಉದ್ಯೋಗ ಮತ್ತು ಪ್ರಮೋಷನ್ ಯಾವಾಗ?', intent: 'CAREER', expectedTitleKeyword: 'ವೃತ್ತಿ' },
    { query: 'ನನ್ನ ಮದುವೆ ಯಾವಾಗ ಆಗುತ್ತದೆ? ಸಂಗಾತಿ ಹೇಗೆ?', intent: 'MARRIAGE', expectedTitleKeyword: 'ವಿವಾಹ' },
    { query: 'ನನಗೆ ಹಣಕಾಸಿನ ಸ್ಥಿತಿ ಹೇಗೆ ಇರಲಿದೆ?', intent: 'WEALTH', expectedTitleKeyword: 'ಧನ' },
    { query: 'ನನ್ನ ಆರೋಗ್ಯ ಮತ್ತು ಆಯಸ್ಸು ಹೇಗಿದೆ?', intent: 'HEALTH', expectedTitleKeyword: 'ಆರೋಗ್ಯ' },
    { query: 'ನನಗೆ ಯಾವುದಾದರೂ ಗ್ರಹ ದೋಷ ಅಥವಾ ಸಾಡೇ ಸಾತಿ ಇದೆಯಾ?', intent: 'DOSHAS', expectedTitleKeyword: 'ದೋಷ' },
    { query: 'ನನಗೆ ಯಾವ ರತ್ನ ಧರಿಸಲು ಸೂಕ್ತ?', intent: 'GEMSTONE', expectedTitleKeyword: 'ರತ್ನ' },
    { query: 'ನನ್ನ ಇಷ್ಟದೇವತೆ ಯಾರು? ಯಾವ ಮಂತ್ರ ಜಪಿಸಬೇಕು?', intent: 'MANTRAS', expectedTitleKeyword: 'ಇಷ್ಟದೇವತೆ' }
  ];

  for (const item of knQueries) {
    const detectedIntent = classifyIntent(item.query);
    assert(detectedIntent === item.intent, `[KN] Intent '${item.intent}' classified accurately`);

    const res = getAstroGuruResponse(item.query, chartSagittarius, inputsSagittarius, 'kn');
    assert(res.topicTitle && res.topicTitle.includes(item.expectedTitleKeyword), `[KN] Response for '${item.intent}' has title containing '${item.expectedTitleKeyword}'`);
    assert(res.analysis && res.analysis.length > 50, `[KN] Detailed astrological analysis generated for '${item.intent}'`);
    assert(Array.isArray(res.remedies) && res.remedies.length > 0, `[KN] Actionable remedies provided for '${item.intent}'`);
    assert(!JSON.stringify(res).includes('undefined'), `[KN] Zero occurrences of 'undefined' in response for '${item.intent}'`);
  }

  // 2. Test Multi-language Support (English, Hindi, Marathi, Telugu)
  const enRes = getAstroGuruResponse('When will I get a job promotion?', chartSagittarius, inputsSagittarius, 'en');
  assert(enRes.topicTitle.includes('Professional') || enRes.topicTitle.includes('Career'), '[EN] English career title present');
  assert(enRes.analysis.includes('10th house') || enRes.analysis.includes('Lagna'), '[EN] English analysis references chart factors');

  const hiRes = getAstroGuruResponse('मेरी नौकरी और करियर का क्या भविष्य है?', chartSagittarius, inputsSagittarius, 'hi');
  assert(hiRes.topicTitle.includes('आजीविका') || hiRes.topicTitle.includes('व्यावसायिक'), '[HI] Hindi career title present');

  const mrRes = getAstroGuruResponse('माझ्या नोकरीत पदोन्नती कधी होईल?', chartSagittarius, inputsSagittarius, 'mr');
  assert(mrRes.topicTitle.includes('ॲस्ट्रोगुरू'), '[MR] Marathi response generated with valid title');

  const teRes = getAstroGuruResponse('నా ఉద్యోగం మరియు వ్యాపారం ఎలా ఉంటుంది?', chartSagittarius, inputsSagittarius, 'te');
  assert(teRes.topicTitle.includes('ఆస్ట్రోగురు'), '[TE] Telugu response generated with valid title');

  // 3. Test Dynamic Chart Personalization
  const resSeeker1 = getAstroGuruResponse('ನನ್ನ ಜಾತಕ ವಿಶ್ಲೇಷಣೆ ಮಾಡಿ', chartSagittarius, inputsSagittarius, 'kn');
  const resSeeker2 = getAstroGuruResponse('ನನ್ನ ಜಾತಕ ವಿಶ್ಲೇಷಣೆ ಮಾಡಿ', chartGemini, inputsGemini, 'kn');

  assert(resSeeker1.lagnaSummary !== resSeeker2.lagnaSummary, 'Personalization: Lagna summaries differ between Seeker 1 and Seeker 2');
  assert(resSeeker1.lagnaSummary.includes('ಮಿಥುನ'), 'Personalization: Seeker 1 Lagna summary correctly identifies Mithuna (Gemini)');
  assert(resSeeker2.lagnaSummary.includes('ಧನು'), 'Personalization: Seeker 2 Lagna summary identifies correct ascendant Dhanu (Sagittarius)');
  assert(resSeeker1.seekerName.includes('Mahalaxmi'), 'Personalization: Preserves Seeker 1 name in consultation');
  assert(resSeeker2.seekerName.includes('Aarav'), 'Personalization: Preserves Seeker 2 name in consultation');

  console.log(`Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
