/**
 * AstroVeda - AstroGuru Intelligent Vedic Astrological Advisor
 * Comprehensive, contextual, birthchart-analyzing AI Vedic Guide.
 * Supports: Kannada (kn), Hindi (hi), English (en), Marathi (mr), Telugu (te).
 */

import { generateKundali } from '../astrology/kundali.js';
import { calculateVimshottariDasha, getCurrentDasha } from '../astrology/dasha.js';
import { identifyYogas } from '../astrology/yoga.js';
import { analyzeDoshas } from '../astrology/dosha.js';
import { generateLifeGuidance, generateComprehensiveRemedies, generateAdvancedAstroSolutions } from '../astrology/predictions.js';
import { 
  LOCALIZED_RASHIS, 
  LOCALIZED_PLANETS 
} from '../../i18n/patrikaTranslations.js';
import { 
  LOCALIZED_NAKSHATRAS, 
  GEMSTONE_PROTOCOLS_LOCALIZED, 
  RUDRAKSHA_LOCALIZED, 
  ISHTA_DEVATA_LOCALIZED,
  CAREER_GUIDANCE_LOCALIZED
} from '../../i18n/predictionTranslations.js';

// Intent keywords dictionary across 5 languages
const INTENT_PATTERNS = {
  CAREER: [
    'career', 'job', 'promotion', 'business', 'work', 'profession', 'interview', 'salary', 'office', 'boss', 'commerce',
    'ಉದ್ಯೋಗ', 'ವೃತ್ತಿ', 'ಕೆರಿಯರ್', 'ಕೆಲಸ', 'ವ್ಯಾಪಾರ', 'ಪ್ರಮೋಷನ್', 'ಸಂಬಳ', 'ನೌಕರಿ', 'ಅಧಿಕಾರ', 'ಉದ್ಯಮ',
    'नौकरी', 'व्यवसाय', 'करियर', 'पदोन्नति', 'धंधा', 'काम', 'वेतन', 'अधिकार', 'रोजगार',
    'नोकरी', 'व्यवसाय', 'काम', 'बढती', 'उद्योग',
    'ఉద్యోగం', 'వ్యాపారం', 'పని', 'ప్రమోషన్', 'జీతం', 'వృత్తి'
  ],
  MARRIAGE: [
    'marriage', 'wedding', 'spouse', 'husband', 'wife', 'love', 'relationship', 'partner', 'divorce', 'match', 'vivah', 'shadi', 'married',
    'ವಿವಾಹ', 'ಮದುವೆ', 'ಸಂಗಾತಿ', 'ಪತಿ', 'ಪತ್ನಿ', 'ಪ್ರೇಮ', 'ಸಂಬಂಧ', 'ದಾಂಪತ್ಯ', 'ಕಂಕಣ ಭಾಗ್ಯ',
    'विवाह', 'शादी', 'पति', 'पत्नी', 'प्रेम', 'जीवनसाथी', 'सम्बन्ध', 'दांपत्य', 'वर', 'वधू',
    'लग्न', 'पती', 'पत्नी', 'जोडीदार', 'वैवाहिक',
    'పెళ్లి', 'వివాహం', 'భార్య', 'భర్త', 'సంబంధం', 'దాంపత్యం'
  ],
  WEALTH: [
    'wealth', 'money', 'finance', 'debt', 'loan', 'rich', 'property', 'house', 'investment', 'shares', 'stock', 'loss', 'profit', 'dhana',
    'ಧನ', 'ಹಣ', 'ಆಸ್ತಿ', 'ಸಾಲ', 'ಆರ್ಥಿಕ', 'ಲಾಭ', 'ಶ್ರೀಮಂತ', 'ಹೂಡಿಕೆ', 'ಮನೆ', 'ಖರ್ಚು', 'ಸಂಪತ್ತು',
    'धन', 'पैसा', 'संपत्ति', 'कर्ज', 'ऋण', 'आर्थिक', 'निवेश', 'मकान', 'लाभ', 'अमीरी', 'घाटा',
    'पैसा', 'कर्ज', 'मालमत्ता', 'आर्थिक', 'गुंतवणूक',
    'ధనం', 'డబ్బు', 'ఆస్తి', 'అప్పు', 'సంపద', 'లాభం', 'ఖర్చు'
  ],
  HEALTH: [
    'health', 'illness', 'disease', 'sick', 'longevity', 'surgery', 'mental', 'stress', 'pain', 'ayurveda', 'ayush',
    'ಆರೋಗ್ಯ', 'ರೋಗ', 'ಕಾಯಿಲೆ', 'ಆಯಸ್ಸು', 'ಮಾನಸಿಕ', 'ಒತ್ತಡ', 'ಸ್ವಾಸ್ಥ್ಯ', 'ಚಿಕಿತ್ಸೆ', 'ಶಕ್ತಿ',
    'स्वास्थ्य', 'रोग', 'बीमारी', 'दीर्घायु', 'मानसिक', 'तनाव', 'आयु', 'कष्ट', 'इलाज',
    'आरोग्य', 'आजार', 'दीर्घायुष्य', 'ताणतणाव',
    'ఆరోగ్యం', 'వ్యాధి', 'రోగాలు', 'ఆయుష్షు', 'ఒత్తిడి'
  ],
  DOSHAS: [
    'dasha', 'shani', 'sade sati', 'rahu', 'ketu', 'saturn', 'transit', 'mahadasha', 'dosha', 'manglik', 'kaal sarp', 'pitra',
    'ದಶಾ', 'ಶನಿ', 'ಸಾಡೇ ಸಾತಿ', 'ರಾಹು', 'ಕೇತು', 'ಗೋಚಾರ', 'ದಶೆ', 'ದೋಷ', 'ಮಾಂಗ್ಲಿಕ್', 'ಕಾಳಸರ್ಪ', 'ಪಿತೃ',
    'दशा', 'शनि', 'साढ़ेसाती', 'राहु', 'केतु', 'महादशा', 'दोष', 'मांगलिक', 'कालसर्प', 'पितृ दोष',
    'दशा', 'शनि', 'साडेसाती', 'दोष', 'मांगलिक',
    'దశ', 'శని', 'సాడేసాతి', 'రాహువు', 'కేతువు', 'దోషం', 'మాంగ్లిక్'
  ],
  GEMSTONE: [
    'gem', 'gemstone', 'stone', 'rudraksha', 'ring', 'diamond', 'sapphire', 'ruby', 'pearl', 'emerald', 'pearl',
    'ರತ್ನ', 'ರತ್ನಗಳು', 'ಉಂಗುರ', 'ರುದ್ರಾಕ್ಷಿ', 'ಮುತ್ತು', 'ನೀಲಂ', 'ಮಾಣಿಕ್ಯ', 'ರತ್ನಧಾರಣೆ', 'ಪುಷ್ಯರಾಗ',
    'रत्न', 'रुद्राक्ष', 'अंगूठी', 'माणिक्य', 'नीलम', 'पुखराज', 'मोती', 'पन्ना', 'हीरा',
    'रत्न', 'रुद्राक्ष', 'अंगठी', 'माणिक', 'पुष्कराज',
    'రత్నం', 'రుద్రాక్ష', 'ఉంగరం', 'ముత్యం', 'నీలం'
  ],
  MANTRAS: [
    'ishta', 'devata', 'god', 'mantra', 'puja', 'worship', 'japa', 'temple', 'spiritual', 'prayer', 'sadhana',
    'ಇಷ್ಟದೇವತೆ', 'ಮಂತ್ರ', 'ಪೂಜೆ', 'ಜಪ', 'ದೇವಸ್ಥಾನ', 'ಸಾಧನೆ', 'ದೇವರು', 'ಇಷ್ಟದೈವ', 'ಪ್ರಾರ್ಥನೆ',
    'इष्टदेव', 'मंत्र', 'पूजा', 'जप', 'साधना', 'भगवान', 'मंदिर', 'कुलदेवी', 'उपासना',
    'इष्टदेव', 'मंत्र', 'पूजा', 'जप', 'साधना', 'देव',
    'ఇష్టదైవం', 'మంత్రం', 'పూజ', 'జపం', 'సాధన', 'దేవుడు'
  ],
  CHILDREN: [
    'child', 'baby', 'son', 'daughter', 'education', 'study', 'exam', 'school', 'college', 'progeny', 'intellect',
    'ಸಂತಾನ', 'ಮಕ್ಕಳು', 'ಶಿಕ್ಷಣ', 'ಓದು', 'ಪರೀಕ್ಷೆ', 'ವಿದ್ಯಾಭ್ಯಾಸ', 'ಸಂತಾನ ಭಾಗ್ಯ', 'ಬುದ್ಧಿ',
    'संतान', 'बच्चे', 'शिक्षा', 'पढ़ाई', 'परीक्षा', 'पुत्र', 'पुत्री', 'विद्या',
    'मुलबाळ', 'शिक्षण', 'अभ्यास', 'परीक्षा',
    'పిల్లలు', 'సంతానం', 'చదువు', 'పరీక్ష'
  ],
  FOREIGN: [
    'foreign', 'abroad', 'travel', 'visa', 'relocation', 'overseas', 'immigration', 'journey',
    'ವಿದೇಶ', 'ಪ್ರಯಾಣ', 'ವಿದೇಶ ಯಾನ', 'ವಲಸೆ', 'ವೀಸಾ', 'ದೂರ ಪ್ರಯಾಣ',
    'विदेश', 'यात्रा', 'विदेश गमन', 'वीजा', 'परदेस',
    'परदेश', 'प्रवास', 'व्हिसा',
    'విదేశీ', 'యాత్ర', 'వీసా'
  ]
};

/**
 * Detect language of the query or fallback to selected language
 */
export function detectLanguage(query = '', fallbackLang = 'kn') {
  // Check Kannada script
  if (/[\u0C80-\u0CFF]/.test(query)) return 'kn';
  // Check Devanagari script (Hindi / Marathi)
  if (/[\u0900-\u097F]/.test(query)) {
    if (query.includes('आहे') || query.includes('नाही') || query.includes('कधी') || query.includes('लग्न')) return 'mr';
    return 'hi';
  }
  // Check Telugu script
  if (/[\u0C00-\u0C7F]/.test(query)) return 'te';
  
  return fallbackLang || 'kn';
}

/**
 * Classify query intent based on keywords
 */
export function classifyIntent(query = '') {
  const qLower = query.toLowerCase();
  
  for (const [intent, keywords] of Object.entries(INTENT_PATTERNS)) {
    for (const kw of keywords) {
      if (qLower.includes(kw.toLowerCase())) {
        return intent;
      }
    }
  }
  return 'COMPREHENSIVE';
}

/**
 * Resolve seeker Kundali data safely
 */
export function prepareChartContext(kundali, userInputs = {}) {
  if (!kundali || !kundali.lagna) {
    // Generate fallback chart from inputs or default
    const birthDate = userInputs.date || '1999-03-28';
    const birthTime = userInputs.time || '11:25';
    const lat = userInputs.latitude || 16.8302;
    const lon = userInputs.longitude || 75.7100;
    const tz = userInputs.timezone || 5.5;
    const ayan = userInputs.ayanamsa || 'LAHIRI';
    kundali = generateKundali(birthDate, birthTime, lat, lon, tz, ayan);
  }

  const birthDate = userInputs.date || kundali.birthDetails?.date || '1999-03-28';
  const moon = kundali.planets.find(p => p.name === 'Moon') || { rashi: 5, longitude: 120.5, nakshatraName: 'Magha', pada: 1 };
  
  // Calculate Dasha
  const dashaData = calculateVimshottariDasha(moon.longitude, birthDate);
  const currentDasha = getCurrentDasha(dashaData);
  const yogas = identifyYogas(kundali);
  const assessmentDate = userInputs.transitDate || userInputs.assessmentDate || new Date().toISOString().split('T')[0];
  const doshas = analyzeDoshas(kundali, assessmentDate);
  const guidance = generateLifeGuidance(kundali, userInputs);
  const remedies = generateComprehensiveRemedies(kundali, userInputs);
  const solutions = generateAdvancedAstroSolutions(kundali, { ...userInputs, transitDate: assessmentDate });

  // 12 Houses map
  const houses = {};
  for (let i = 1; i <= 12; i++) {
    const rashiNum = ((kundali.lagna.rashi - 1 + (i - 1)) % 12) + 1;
    const occupants = kundali.planets.filter(p => p.house === i);
    houses[i] = {
      house: i,
      rashi: rashiNum,
      rashiName: kundali.lagna.rashiName,
      occupants: occupants.map(p => p.name)
    };
  }

  return {
    seekerName: userInputs.name || 'Seeker (ಜಾತಕರು)',
    assessmentDate,
    transitAssessmentDate: assessmentDate,
    birthDetails: kundali.birthDetails,
    lagna: kundali.lagna,
    moon,
    sun: kundali.planets.find(p => p.name === 'Sun') || { house: 4, rashi: 12 },
    currentDasha,
    dashaData,
    yogas,
    doshas,
    guidance,
    remedies,
    solutions,
    planets: kundali.planets,
    houses
  };
}

/**
 * Main AstroGuru consultation resolver
 */
export function getAstroGuruResponse(query = '', rawKundali = null, userInputs = {}, preferredLang = 'kn') {
  const lang = detectLanguage(query, preferredLang);
  const intent = classifyIntent(query);
  const ctx = prepareChartContext(rawKundali, userInputs);

  const lagnaRashiName = LOCALIZED_RASHIS[ctx.lagna.rashi]?.[lang] || ctx.lagna.rashiName;
  const moonRashiName = LOCALIZED_RASHIS[ctx.moon.rashi]?.[lang] || ctx.moon.rashiName;
  const nakshatraLocal = LOCALIZED_NAKSHATRAS[ctx.moon.nakshatraName]?.[lang] || ctx.moon.nakshatraName;
  const lagnaLordLocal = LOCALIZED_PLANETS[ctx.lagna.lord]?.[lang] || ctx.lagna.lord;
  const mahaDashaLord = LOCALIZED_PLANETS[ctx.currentDasha?.mahaDasha]?.[lang] || ctx.currentDasha?.mahaDasha || 'Guru';
  const antarDashaLord = LOCALIZED_PLANETS[ctx.currentDasha?.antarDasha]?.[lang] || ctx.currentDasha?.antarDasha || 'Shani';

  // 10th house (Career)
  const tenthHouseLord = ctx.guidance?.career?.tenthLord || 'Mercury';
  const tenthLordLocal = LOCALIZED_PLANETS[tenthHouseLord]?.[lang] || tenthHouseLord;

  // 7th house (Marriage)
  const seventhHouseSign = ((ctx.lagna.rashi - 1 + 6) % 12) + 1;
  const seventhSignLocal = LOCALIZED_RASHIS[seventhHouseSign]?.[lang] || 'Mithuna';
  const seventhLordLocal = LOCALIZED_PLANETS[ctx.guidance?.marriage?.rulingLord || 'Mercury']?.[lang] || 'Mercury';

  // Gemstone, Rudraksha, Ishta Devata
  const rashiKey = ctx.lagna.rashiName || 'Sagittarius';
  const gemProtocol = GEMSTONE_PROTOCOLS_LOCALIZED[rashiKey]?.[lang] || GEMSTONE_PROTOCOLS_LOCALIZED.Sagittarius[lang];
  const rudrakshaLoc = RUDRAKSHA_LOCALIZED[ctx.lagna.lord]?.[lang] || RUDRAKSHA_LOCALIZED.Jupiter[lang];
  const ishtaInfo = ISHTA_DEVATA_LOCALIZED[rashiKey]?.[lang] || ISHTA_DEVATA_LOCALIZED.Sagittarius[lang];
  const careerInfo = CAREER_GUIDANCE_LOCALIZED[lang] || CAREER_GUIDANCE_LOCALIZED.kn;

  // Doshas status
  const manglik = ctx.doshas.find(d => d.id === 'manglik');
  const sadeSati = ctx.doshas.find(d => d.id === 'shani_influence');
  const kaalSarp = ctx.doshas.find(d => d.id === 'kaal_sarp');
  const pitra = ctx.doshas.find(d => d.id === 'pitra_dosha');

  // Prominent Raja Yogas
  const topYogas = ctx.yogas.slice(0, 3).map(y => y.name).join(', ') || 'Gajakesari Yoga';

  // Build specialized responses according to language
  if (lang === 'kn') {
    return buildKannadaResponse(intent, ctx, {
      lagnaRashiName, moonRashiName, nakshatraLocal, lagnaLordLocal,
      mahaDashaLord, antarDashaLord, tenthLordLocal, seventhSignLocal, seventhLordLocal,
      gemProtocol, rudrakshaLoc, ishtaInfo, careerInfo,
      manglik, sadeSati, kaalSarp, pitra, topYogas
    });
  } else if (lang === 'hi') {
    return buildHindiResponse(intent, ctx, {
      lagnaRashiName, moonRashiName, nakshatraLocal, lagnaLordLocal,
      mahaDashaLord, antarDashaLord, tenthLordLocal, seventhSignLocal, seventhLordLocal,
      gemProtocol, rudrakshaLoc, ishtaInfo, careerInfo,
      manglik, sadeSati, kaalSarp, pitra, topYogas
    });
  } else if (lang === 'mr') {
    return buildMarathiResponse(intent, ctx, {
      lagnaRashiName, moonRashiName, nakshatraLocal, lagnaLordLocal,
      mahaDashaLord, antarDashaLord, tenthLordLocal, seventhSignLocal, seventhLordLocal,
      gemProtocol, rudrakshaLoc, ishtaInfo, careerInfo,
      manglik, sadeSati, kaalSarp, pitra, topYogas
    });
  } else if (lang === 'te') {
    return buildTeluguResponse(intent, ctx, {
      lagnaRashiName, moonRashiName, nakshatraLocal, lagnaLordLocal,
      mahaDashaLord, antarDashaLord, tenthLordLocal, seventhSignLocal, seventhLordLocal,
      gemProtocol, rudrakshaLoc, ishtaInfo, careerInfo,
      manglik, sadeSati, kaalSarp, pitra, topYogas
    });
  } else {
    return buildEnglishResponse(intent, ctx, {
      lagnaRashiName, moonRashiName, nakshatraLocal, lagnaLordLocal,
      mahaDashaLord, antarDashaLord, tenthLordLocal, seventhSignLocal, seventhLordLocal,
      gemProtocol, rudrakshaLoc, ishtaInfo, careerInfo,
      manglik, sadeSati, kaalSarp, pitra, topYogas
    });
  }
}

// -------------------------------------------------------------------------
// 1. KANNADA RESPONSE BUILDER (ಶುದ್ಧ ಕನ್ನಡ ಶಾಸ್ತ್ರೋಕ್ತ ಸಮಾಧಾನ)
// -------------------------------------------------------------------------
function buildKannadaResponse(intent, ctx, d) {
  let topicTitle = '';
  let analysis = '';
  let forecast = '';
  let remedies = [];
  let blessings = '';

  switch (intent) {
    case 'CAREER':
      topicTitle = '💼 ವೃತ್ತಿ, ಉದ್ಯೋಗ ಮತ್ತು ವ್ಯಾಪಾರ ಯೋಗ ವಿಶ್ಲೇಷಣೆ';
      analysis = `ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಲಗ್ನವು ${d.lagnaRashiName} ಆಗಿದ್ದು, ಕರ್ಮ ಸ್ಥಾನವಾದ ೧೦ನೇ ಮನೆಯ ಅಧಿಪತಿ ${d.tenthLordLocal} ಆಗಿದ್ದಾರೆ. ಪ್ರಸ್ತುತ ಮಹಾದಶಾ ನಾಯಕ ${d.mahaDashaLord} ಮತ್ತು ಅಂತರ್ದಶಾ ನಾಯಕ ${d.antarDashaLord} ನಿಮ್ಮ ಕಾರ್ಯಕ್ಷೇತ್ರದ ಮೇಲೆ ಪ್ರಭಾವ ಬೀರುತ್ತಿದ್ದಾರೆ. ಜಾತಕದಲ್ಲಿ ${d.topYogas} ಸಕ್ರಿಯವಾಗಿರುವುದರಿಂದ ಸ್ವತಂತ್ರ ಉದ್ಯಮ, ಕಾರ್ಯತಂತ್ರದ ನಿರ್ಧಾರಗಳು ಮತ್ತು ನಾಯಕತ್ವ ಸ್ಥಾನಗಳು ನಿಮಗೆ ಅತ್ಯಂತ ಅನುಕೂಲಕರವಾಗಿವೆ.`;
      forecast = `ಮುಂದಿನ ೮ ರಿಂದ ೧೪ ತಿಂಗಳುಗಳಲ್ಲಿ ನಿಮ್ಮ ವೃತ್ತಿ ಜೀವನದಲ್ಲಿ ಮಹತ್ವದ ತಿರುವು ಕಂಡುಬರಲಿದೆ. ನೂತನ ಉದ್ಯೋಗಾವಕಾಶ ಅಥವಾ ವ್ಯವಹಾರ ವಿಸ್ತರಣೆಯ ಯೋಗ ಪ್ರಬಲವಾಗಿದೆ. ಸಹೋದ್ಯೋಗಿಗಳೊಂದಿಗೆ ತಾಳ್ಮೆ ಹಾಗೂ ಹಿರಿಯ ಅಧಿಕಾರಿಗಳೊಂದಿಗೆ ನಯವಾದ ನಡವಳಿಕೆ ಯಶಸ್ಸಿನ ಮೂಲ.`;
      remedies = [
        `<strong>ಬೀಜ ಮಂತ್ರ ಜಪ:</strong> ಲಗ್ನಾಧಿಪತಿ ${d.lagnaLordLocal} ದೇವತೆಯನ್ನು ಪ್ರಾರ್ಥಿಸಿ ನಿತ್ಯ ೧೦೮ ಬಾರಿ ಬೀಜ ಮಂತ್ರ ಪಠಿಸಿ.`,
        `<strong>ರತ್ನ ಧಾರಣೆ:</strong> ನಿಮಗೆ ಅನುಕೂಲಕರವಾದ ರತ್ನ ${d.gemProtocol.primeGem} (${d.gemProtocol.metal}ದಲ್ಲಿ, ${d.gemProtocol.finger}ಗೆ, ${d.gemProtocol.wearingDay}).`,
        `<strong>ವರ್ಜ್ಯ ರತ್ನ:</strong> ${d.gemProtocol.forbiddenGems}`,
        `<strong>ದಾನ & ಸೇವೆ:</strong> ಪ್ರತಿ ಗುರುವಾರ ಮತ್ತು ಶನಿವಾರ ಬಡವರಿಗೆ ಅಥವಾ ಅಗತ್ಯವಿರುವವರಿಗೆ ಅನ್ನದಾನ ಮಾಡಿ ಮತ್ತು ಹಸುವಿಗೆ ಹಸಿರು ಹುಲ್ಲು ಅಥವಾ ಬೆಲ್ಲ ನೀಡಿ.`
      ];
      blessings = 'ಕರ್ಮದಲ್ಲಿ ಶ್ರದ್ಧೆಯಿರಲಿ, ಧರ್ಮ ನಿಮ್ಮನ್ನು ಕೈಹಿಡಿಯುತ್ತದೆ. ಗುರು ಮತ್ತು ಶನಿ ಕೃಪೆಯಿಂದ ಉನ್ನತ ಗೌರವ ಪ್ರಾಪ್ತಿಯಾಗಲಿ.';
      break;

    case 'MARRIAGE':
      topicTitle = '💍 ವಿವಾಹ ಯೋಗ, ಜೀವನ ಸಂಗಾತಿ ಮತ್ತು ದಾಂಪತ್ಯ ಸುಖ';
      analysis = `ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಸಪ್ತಮ (೭ನೇ) ಸ್ಥಾನವು ${d.seventhSignLocal} ರಾಶಿಯಾಗಿದ್ದು, ಸಪ್ತಮಾಧಿಪತಿ ${d.seventhLordLocal} ಆಗಿದ್ದಾರೆ. ಜನ್ಮ ಲಗ್ನ ${d.lagnaRashiName} ಮತ್ತು ಚಂದ್ರ ರಾಶಿ ${d.moonRashiName} ಪ್ರಕಾರ, ನಿಮ್ಮ ಭಾವಿ ಸಂಗಾತಿಯು ಬುದ್ಧಿವಂತರು, ಸೌಮ್ಯ ಸ್ವಭಾವದವರು ಹಾಗೂ ಕುಟುಂಬದ ಮೌಲ್ಯಗಳನ್ನು ಗೌರವಿಸುವ ವ್ಯಕ್ತಿಯಾಗಿರುತ್ತಾರೆ. ${d.manglik?.present ? (d.manglik.cancelled ? 'ಕುಜ ದೋಷವು ಶುಭ ಗ್ರಹಗಳ ದೃಷ್ಟಿಯಿಂದ ಪರಿಹಾರಗೊಂಡಿದೆ.' : 'ಮಂಗಳ ಪ್ರಭಾವ ಸಾಧಾರಣವಾಗಿದ್ದು ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ ಅಗತ್ಯ.') : 'ಜಾತಕದಲ್ಲಿ ಯಾವುದೇ ಮಾರಕ ಕುಜ ದೋಷವಿಲ್ಲ.'}`;
      forecast = `ಪ್ರಸ್ತುತ ${d.mahaDashaLord} ದಶಾ ಪ್ರಭಾವದಿಂದ ಮುಂಬರುವ ದಿನಗಳಲ್ಲಿ ವಿವಾಹ ಮಾತುಕತೆಗಳು ಫಲಪ್ರದವಾಗುವ ಸಕಾಲ ಸನ್ನಿಹಿತವಾಗಿದೆ. ಈಶಾನ್ಯ ಅಥವಾ ಪೂರ್ವ ದಿಕ್ಕಿನಿಂದ ಶುಭ ಸಂಬಂಧಗಳು ಬರುವ ಸಂಭವವಿದೆ.`;
      remedies = [
        `<strong>ಕಲ್ಯಾಣ ಮಂತ್ರ:</strong> ಸಪ್ತಮಾಧಿಪತಿಯ ಶಾಂತಿಗಾಗಿ ಹಾಗೂ ಶ್ರೀ ಲಕ್ಷ್ಮೀ-ನಾರಾಯಣರ ಕೃಪೆಗಾಗಿ ನಿತ್ಯ "ॐ ನಮೋ ನಾರಾಯಣಾಯ" ೧೦೮ ಬಾರಿ ಜಪಿಸಿ.`,
        `<strong>ಶುಭ ರುದ್ರಾಕ್ಷಿ:</strong> ${d.rudrakshaLoc.mukhi} ಧರಿಸುವುದರಿಂದ ದಾಂಪತ್ಯ ಜೀವನದಲ್ಲಿ ಸಾಮರಸ್ಯ ಹೆಚ್ಚುತ್ತದೆ.`,
        `<strong>ಗೌರಿ ಪೂಜೆ:</strong> ಶುಕ್ರವಾರದಂದು ದೇವಿ ದುರ್ಗೆ ಅಥವಾ ಗೌರಿ ದೇವಸ್ಥಾನಕ್ಕೆ ತುಪ್ಪದ ದೀಪ ಸಮರ್ಪಿಸಿ.`
      ];
      blessings = 'ದಾಂಪತ್ಯವು ಪವಿತ್ರ ಬಂಧನ; ಸಕಾಲದಲ್ಲಿ ಸದ್ಗುಣ ಸಂಪನ್ನ ಸಂಗಾತಿಯ ಸಾನ್ನಿಧ್ಯ ಪ್ರಾಪ್ತಿಯಾಗಲಿ.';
      break;

    case 'WEALTH':
      topicTitle = '💰 ಧನ ಲಾಭ, ಆರ್ಥಿಕ ಸ್ಥಿರತೆ ಮತ್ತು ಆಸ್ತಿ ಯೋಗ';
      analysis = `ನಿಮ್ಮ ಕುಂಡಲಿಯ ೨ನೇ ಧನ ಸ್ಥಾನ ಮತ್ತು ೧೧ನೇ ಲಾಭ ಸ್ಥಾನಗಳನ್ನು ಪರಿಶೀಲಿಸಿದಾಗ, ${d.topYogas} ಯೋಗಗಳು ನಿಮ್ಮ ಜನ್ಮ ಲಗ್ನದಲ್ಲಿ ಧನ ಸಂಚಯ ಸಾಮರ್ಥ್ಯವನ್ನು ಹೆಚ್ಚಿಸುತ್ತವೆ. ಚಂದ್ರನ ಸ್ಥಾನ ${d.moonRashiName} ಮತ್ತು ${d.mahaDashaLord} ದಶಾ ಅವಧಿಯಲ್ಲಿ ಸ್ಥಿರ ಆಸ್ತಿ ಹಾಗೂ ಹೂಡಿಕೆಗಳಿಂದ ಉತ್ತಮ ಲಾಭ ಸಿಗಲಿದೆ. ಅನಾವಶ್ಯಕ ಸಾಲ ನೀಡುವುದು ಅಥವಾ ಸಾಹಸಮಯ ಸಟ್ಟಾ ವ್ಯವಹಾರಗಳಿಂದ ದೂರವಿರುವುದು ಒಳಿತು.`;
      forecast = `ಮುಂದಿನ ೧ ವರ್ಷದಲ್ಲಿ ಹೊಸ ಆರ್ಥಿಕ ಮಾರ್ಗಗಳು ತೆರೆದುಕೊಳ್ಳಲಿವೆ. ಭೂಮಿ, ಗೃಹ ಅಥವಾ ದೀರ್ಘಕಾಲೀನ ಚಿನ್ನದ ಹೂಡಿಕೆಗಳು ನಿಮಗೆ ಶಾಶ್ವತ ಸಮೃದ್ಧಿ ನೀಡಲಿವೆ.`;
      remedies = [
        `<strong>ಲಕ್ಷ್ಮೀ ಆರಾಧನೆ:</strong> ಶುಕ್ರವಾರದಂದು ಶ್ರೀ ಕನಕಧಾರಾ ಸ್ತೋತ್ರ ಅಥವಾ ಶ್ರೀ ಸೂಕ್ತ ಪಠಿಸಿ.`,
        `<strong>ಧನ ಯಂತ್ರ:</strong> ಮನೆಯ ಉತ್ತರ ದಿಕ್ಕಿನಲ್ಲಿ ಅಥವಾ ಪೂಜಾ ಕೋಣೆಯಲ್ಲಿ ಶುದ್ಧ ತಾಮ್ರದ ಕುಬೇರ ಅಥವಾ ಶ್ರೀ ಯಂತ್ರ ಸ್ಥಾಪಿಸಿ.`,
        `<strong>ಗೋಸೇವೆ:</strong> ಶುಕ್ರವಾರ ಮತ್ತು ಅಮಾವಾಸ್ಯೆಯಂದು ದೇಸಿ ಹಸುವಿಗೆ ಹಣ್ಣು ಅಥವಾ ಅಕ್ಕಿ ಬೆಲ್ಲ ತಿನ್ನಿಸಿ.`
      ];
      blessings = 'ಧರ್ಮ ಮಾರ್ಗದಲ್ಲಿ ಸಂಪಾದಿಸಿದ ಧನವು ಸದಾ ಶಾಶ್ವತವಾಗಿ ಉಳಿಯುತ್ತದೆ. ಅಷ್ಟಲಕ್ಷ್ಮಿಯರ ಕೃಪೆ ನಿಮಗಿರಲಿ.';
      break;

    case 'HEALTH':
      topicTitle = '🩺 ಶಾರೀರಿಕ ಆರೋಗ್ಯ, ಮಾನಸಿಕ ನೆಮ್ಮದಿ ಮತ್ತು ದೀರ್ಘಾಯುಷ್ಯ';
      analysis = `ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಲಗ್ನಾಧಿಪತಿ ${d.lagnaLordLocal} ಬಲಿಷ್ಠವಾಗಿದ್ದು, ಮೂಲಭೂತ ಚೈತನ್ಯ ಉತ್ತಮವಾಗಿದೆ. ಚಂದ್ರ ರಾಶಿ ${d.moonRashiName} ಮತ್ತು ೬ನೇ ರೋಗ ಸ್ಥಾನದ ಆಧಾರದ ಮೇಲೆ, ಜೀರ್ಣಕ್ರಿಯೆ, ಬೆನ್ನು ಅಥವಾ ನರಗಳ ಸೂಕ್ಷ್ಮತೆ ಕಂಡುಬರಬಹುದು. ಮಾನಸಿಕ ಒತ್ತಡವನ್ನು ಕಡಿಮೆ ಮಾಡಿಕೊಳ್ಳುವುದು ಅತ್ಯಗತ್ಯ.`;
      forecast = `ಪ್ರಸ್ತುತ ${d.mahaDashaLord} ಅವಧಿಯಲ್ಲಿ ದಿನಚರಿ, ಸಾತ್ವಿಕ ಆಹಾರ ಮತ್ತು ಪ್ರಾಣಾಯಾಮ ಪಾಲಿಸಿದರೆ ಯಾವುದೇ ದೀರ್ಘಕಾಲೀನ ಬಾಧೆಗಳು ತಟ್ಟುವುದಿಲ್ಲ. ಆಯುಷ್ಯ ಸ್ಥಾನವು ಸುದೃಢವಾಗಿದೆ.`;
      remedies = [
        `<strong>ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರ:</strong> ನಿತ್ಯ ಮುಂಜಾನೆ ೧೧ ಬಾರಿ "ॐ ತ್ರ್ಯಂಬಕಂ ಯಜಾಮಹೇ ಸುಗಂಧಿಂ ಪುಷ್ಟಿವರ್ಧನಮ್ | ಉರ್ವಾರುಕಮಿವ ಬಂಧನಾನ್ ಮೃತ್ಯೋರ್ಮುಕ್ಷೀಯ ಮಾಮೃತಾತ್" ಜಪಿಸಿ.`,
        `<strong>ಸೂರ್ಯ ನಮಸ್ಕಾರ:</strong> ನಿತ್ಯ ಮುಂಜಾನೆ ತಾಮ್ರದ ಪಾತ್ರೆಯಿಂದ ಸೂರ್ಯ ದೇವರಿಗೆ ಅರ್ಘ್ಯ ನೀಡಿ.`,
        `<strong>ಆಹಾರ ಕ್ರಮ:</strong> ಅಧಿಕ ಎಣ್ಣೆ-ಖಾರ ವರ್ಜಿಸಿ, ತುಳಸಿ ತೀರ್ಥ ಸೇವಿಸಿ.`
      ];
      blessings = 'ದೇಹವೇ ದೇಗುಲ; ಸದಾ ನಿರೋಗಿ ಹಾಗೂ ದೀರ್ಘಾಯುಷ್ಯವಂತರಾಗಿ ಬಾಳಿ.';
      break;

    case 'DOSHAS':
      topicTitle = '🪐 ಗ್ರಹ ದೋಷ, ಸಾಡೇ ಸಾತಿ ಮತ್ತು ರಾಹು-ಕೇತು ಪರಿಹಾರ';
      let shaniConsultation = 'ಸದ್ಯಕ್ಕೆ ಸಾಡೇ ಸಾತಿ ಭೀತಿ ಇಲ್ಲ.';
      if (d.sadeSati) {
        if (d.sadeSati.valid === false) {
          shaniConsultation = 'ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.';
        } else if (d.sadeSati.isDhaiya) {
          shaniConsultation = `${d.sadeSati.phase} ಚಾಲ್ತಿಯಲ್ಲಿದೆ (ಗೋಚಾರ ದಿನಾಂಕ: ${d.sadeSati.assessmentDate || 'ಇಂದು'}).`;
        } else if (d.sadeSati.isSadeSati) {
          shaniConsultation = `${d.sadeSati.phase} ಚಾಲ್ತಿಯಲ್ಲಿದೆ (ಗೋಚಾರ ದಿನಾಂಕ: ${d.sadeSati.assessmentDate || 'ಇಂದು'}).`;
        } else {
          shaniConsultation = `ಸದ್ಯಕ್ಕೆ ಸಾಡೇ ಸಾತಿ ಮುಕ್ತ (ಗೋಚಾರ ದಿನಾಂಕ: ${d.sadeSati.assessmentDate || 'ಇಂದು'}).`;
        }
      }
      analysis = `ನಿಮ್ಮ ಜಾತಕದ ದೋಷ ಪರಿಶೀಲನೆ:\n• ಕುಜ ದೋಷ: ${d.manglik?.present ? (d.manglik.cancelled ? 'ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ಶಮನಗೊಂಡಿದೆ.' : 'ಸಾಧಾರಣ ಪ್ರಭಾವವಿದೆ.') : 'ಕುಜ ದೋಷವಿಲ್ಲ.'}\n• ಶನಿ ಗೋಚಾರ: ${shaniConsultation}\n• ಕಾಳಸರ್ಪ: ${d.kaalSarp?.present ? 'ಕಾಳಸರ್ಪ ಯೋಗವಿದೆ.' : 'ಕಾಳಸರ್ಪ ದೋಷವಿಲ್ಲ.'}\n• ಪಿತೃ ಋಣ: ${d.pitra?.present ? 'ಪಿತೃ ಆಶೀರ್ವಾದ ಪಡೆಯಲು ತರ್ಪಣ ಪರಿಹಾರ ಶ್ರೇಷ್ಠ.' : 'ಯಾವುದೇ ಮಾರಕ ಪಿತೃ ದೋಷವಿಲ್ಲ.'}`;
      forecast = `ದೋಷಗಳ ಬಗ್ಗೆ ಅನಗತ್ಯ ಭಯ ಬೇಡ; ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ, ನಿತ್ಯ ದೈವ ಭಕ್ತಿ ಮತ್ತು ಸದಾಚಾರದಿಂದ ಗ್ರಹ ದೋಷಗಳೆಲ್ಲವೂ ಶುಭ ಫಲಗಳಾಗಿ ಪರಿವರ್ತನೆಯಾಗುತ್ತವೆ.`;
      remedies = [
        `<strong>ಹನುಮಾನ್ ಚಾಲೀಸಾ:</strong> ಪ್ರತಿ ಮಂಗಳವಾರ ಮತ್ತು ಶನಿವಾರ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಿಸಿ.`,
        `<strong>ಶನಿ ಶಾಂತಿ:</strong> ಶನಿವಾರ ಸಂಜೆ ಅಶ್ವತ್ಥ (ಅರಳಿ) ಮರದ ಕೆಳಗೆ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಹಚ್ಚಿ.`,
        `<strong>ಪಿತೃ ತರ್ಪಣ:</strong> ಅಮಾವಾಸ್ಯೆಯಂದು ಕಾಗೆ ಮತ್ತು ಹಸುಗಳಿಗೆ ಅನ್ನ ನೀಡಿ.`
      ];
      blessings = 'ಶಿವ ಮತ್ತು ಹನುಮಂತರ ಅನುಗ್ರಹದಿಂದ ಸಕಲ ಗ್ರಹ ಬಾಧೆಗಳು ನಿವಾರಣೆಯಾಗಲಿ.';
      break;

    case 'GEMSTONE':
      topicTitle = '💎 ಜಾತಕಾನುಸಾರ ಶುಭ ರತ್ನ ಮತ್ತು ರುದ್ರಾಕ್ಷಿ ಮಾರ್ಗದರ್ಶನ';
      analysis = `ನಿಮ್ಮ ಲಗ್ನ ${d.lagnaRashiName} ಹಾಗೂ ಲಗ್ನಾಧಿಪತಿ ${d.lagnaLordLocal}ಗೆ ಅನುಗುಣವಾಗಿ ಶಾಸ್ತ್ರೋಕ್ತ ರತ್ನ ನಿರ್ಣಯ:\n• <strong>ಮುಖ್ಯ ರತ್ನ:</strong> ${d.gemProtocol.primeGem}\n• <strong>ಲೋಹ:</strong> ${d.gemProtocol.metal}\n• <strong>ಬೆರಳು:</strong> ${d.gemProtocol.finger}\n• <strong>ಶುಭ ದಿನ:</strong> ${d.gemProtocol.wearingDay}\n• <strong>ರುದ್ರಾಕ್ಷಿ:</strong> ${d.rudrakshaLoc.mukhi}`;
      forecast = `ಸರಿಯಾದ ವಿಧಿಯಂತೆ ಪ್ರಾಣ ಪ್ರತಿಷ್ಠಾಪನೆ ಮಾಡಿ ಧರಿಸಿದಾಗ ಈ ರತ್ನವು ನಿಮ್ಮ ಆತ್ಮವಿಶ್ವಾಸ, ಏಕಾಗ್ರತೆ ಹಾಗೂ ಭಾಗ್ಯೋದಯವನ್ನು ೩ ಪಟ್ಟು ಹೆಚ್ಚಿಸುತ್ತದೆ.`;
      remedies = [
        `<strong>ಕಟ್ಟುನಿಟ್ಟಿನ ಎಚ್ಚರಿಕೆ (ವರ್ಜ್ಯ ರತ್ನ):</strong> ${d.gemProtocol.forbiddenGems}`,
        `<strong>ಪ್ರಾಣ ಪ್ರತಿಷ್ಠೆ:</strong> ರತ್ನವನ್ನು ಗಂಗಾಜಲ ಮತ್ತು ಹಸಿ ಹಸುವಿನ ಹಾಲಿನಲ್ಲಿ ಶುದ್ಧೀಕರಿಸಿ, ಲಗ್ನ ಬೀಜ ಮಂತ್ರದಿಂದ ೧೦೮ ಬಾರಿ ಅಭಿಮಂತ್ರಿಸಿ ಧರಿಸಿ.`
      ];
      blessings = 'ರತ್ನವು ಕೇವಲ ಆಭರಣವಲ್ಲ, ದೈವಿಕ ರಕ್ಷಾ ಕವಚ. ಶುಭ ಫಲ ಲಭಿಸಲಿ.';
      break;

    case 'MANTRAS':
      topicTitle = '🕉️ ಇಷ್ಟದೇವತೆ, ಕುಲದೈವ ಮತ್ತು ನಿತ್ಯ ಮಂತ್ರ ಸಾಧನೆ';
      analysis = `ನಿಮ್ಮ ಕುಂಡಲಿಯ ೯ನೇ ಭಾಗ್ಯ ಸ್ಥಾನ ಮತ್ತು ಲಗ್ನಾಧಿಪತಿಯ ಪ್ರಕಾರ ನಿಮ್ಮ ಇಷ್ಟದೇವತೆ:\n• <strong>ಇಷ್ಟದೇವತೆ:</strong> ${d.ishtaInfo.ishta}\n• <strong>ಮುಖ್ಯ ಮಂತ್ರ:</strong> ${d.ishtaInfo.mantra}\n• <strong>ಲಗ್ನ ರಕ್ಷಾ ಮಂತ್ರ:</strong> ${ctx.remedies?.mantras?.lagna?.beejMantra || 'ॐ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ'}`;
      forecast = `ಪ್ರತಿದಿನ ಸೂರ್ಯೋದಯ ಅಥವಾ ಸಂಧ್ಯಾ ಸಮಯದಲ್ಲಿ ಈ ಮಂತ್ರವನ್ನು ಪಠಿಸುವುದರಿಂದ ನಿಮ್ಮ ಜಾತಕದ ಸರ್ವ ಗ್ರಹ ದೋಷಗಳು ಉಪಶಮನಗೊಂಡು ಸಕಾರಾತ್ಮಕ ಶಕ್ತಿ ವೃದ್ಧಿಯಾಗುತ್ತದೆ.`;
      remedies = [
        `ನಿತ್ಯ ಕನಿಷ್ಠ ೧೦೮ ಬಾರಿ ತುಳಸಿ ಅಥವಾ ರುದ್ರಾಕ್ಷಿ ಮಾಲೆಯಲ್ಲಿ ಜಪಿಸಿ.`,
        `ಪೂಜೆಯ ನಂತರ ಕರ್ಪೂರ ಅಥವಾ ತುಪ್ಪದ ಆರತಿ ಬೆಳಗಿ.`,
        `ತಂದೆ-ತಾಯಿ ಮತ್ತು ಗುರುಗಳ ಪಾದಸ್ಪರ್ಶ ಮಾಡಿ ಆಶೀರ್ವಾದ ಪಡೆಯಿರಿ.`
      ];
      blessings = 'ಇಷ್ಟದೇವತೆಯ ನಿರಂತರ ಸ್ಮರಣೆಯಿಂದ ಮನಸ್ಸು ಶಾಂತವಾಗಲಿ ಮತ್ತು ಇಷ್ಟಾರ್ಥಗಳು ಸಿದ್ಧಿಸಲಿ.';
      break;

    default:
      topicTitle = '🔮 ಸಮಗ್ರ ಜಾತಕ ಸಾರಾಂಶ ಮತ್ತು ಭವಿಷ್ಯ ಮಾರ್ಗದರ್ಶನ';
      analysis = `ಮಾನ್ಯ ${ctx.seekerName}, ನಿಮ್ಮ ಜಾತಕದ ಸಮಗ್ರ ಅವಲೋಕನ:\n• <strong>ಜನ್ಮ ಲಗ್ನ:</strong> ${d.lagnaRashiName} (ಅಧಿಪತಿ: ${d.lagnaLordLocal})\n• <strong>ಚಂದ್ರ ರಾಶಿ:</strong> ${d.moonRashiName} (ನಕ್ಷತ್ರ: ${d.nakshatraLocal})\n• <strong>ಪ್ರಸ್ತುತ ಮಹಾದಶಾ:</strong> ${d.mahaDashaLord} / ${d.antarDashaLord}\n• <strong>ಪ್ರಮುಖ ರಾಜಯೋಗಗಳು:</strong> ${d.topYogas}\nನಿಮ್ಮ ಜಾತಕವು ಧರ್ಮ, ಜ್ಞಾನ ಮತ್ತು ಸಮಾಜದಲ್ಲಿ ಸನ್ಮಾನ ತಂದುಕೊಡುವ ಶ್ರೇಷ್ಠ ಗುಣಗಳನ್ನು ಹೊಂದಿದೆ.`;
      forecast = `ಪ್ರಸ್ತುತ ಗ್ರಹ ಚಲನೆಗಳು ಹೊಸ ಆರಂಭಕ್ಕೆ ಪ್ರೇರಣೆ ನೀಡುತ್ತಿವೆ. ಧರ್ಮ ಮಾರ್ಗದಲ್ಲಿ ಮುನ್ನಡೆದರೆ ಮುಂದಿನ ವರ್ಷಗಳಲ್ಲಿ ಸುಖ-ಶಾಂತಿ ಮತ್ತು ಸಮೃದ್ಧಿ ನೆಲೆಸಲಿದೆ.`;
      remedies = [
        `<strong>ದಿನಚರಿ ನಿಯಮ:</strong> ನಿತ್ಯ ಸೂರ್ಯ ನಮಸ್ಕಾರ ಮತ್ತು ಗುರು ಮಂತ್ರ ಜಪಿಸಿ.`,
        `<strong>ಸೂಕ್ತ ರತ್ನ:</strong> ${d.gemProtocol.primeGem} ಧರಿಸಿ.`,
        `<strong>ಸೇವಾ ಕಾರ್ಯ:</strong> ವಾರಕ್ಕೊಮ್ಮೆ ದೇಸಿ ಹಸುವಿಗೆ ಹಸಿರು ಮೇವು ಅಥವಾ ಬೆಲ್ಲ ನೀಡಿ.`
      ];
      blessings = 'ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು. ನಿಮ್ಮ ಸರ್ವ ಕಾರ್ಯಗಳಲ್ಲೂ ಜಯ ಲಭಿಸಲಿ ಎಂದು ಆಸ್ಟ್ರೋಗುರು ಹರಸುತ್ತಾರೆ.';
      break;
  }

  return {
    lang: 'kn',
    topicTitle,
    seekerName: ctx.seekerName,
    lagnaSummary: `ಲಗ್ನ: ${d.lagnaRashiName} • ರಾಶಿ: ${d.moonRashiName} • ನಕ್ಷತ್ರ: ${d.nakshatraLocal} • ದಶಾ: ${d.mahaDashaLord}/${d.antarDashaLord}`,
    analysis,
    forecast,
    remedies,
    blessings
  };
}

// -------------------------------------------------------------------------
// 2. HINDI RESPONSE BUILDER (शुद्ध वैदिक हिंदी समाधान)
// -------------------------------------------------------------------------
function buildHindiResponse(intent, ctx, d) {
  let topicTitle = '';
  let analysis = '';
  let forecast = '';
  let remedies = [];
  let blessings = '';

  switch (intent) {
    case 'CAREER':
      topicTitle = '💼 आजीविका, पदोन्नति एवं व्यावसायिक योग';
      analysis = `आपकी जन्म कुण्डली में लग्न ${d.lagnaRashiName} है तथा कर्म (दशम) भाव के स्वामी ${d.tenthLordLocal} हैं। वर्तमान में ${d.mahaDashaLord} की महादशा में ${d.antarDashaLord} की अंतर्दशा गतिशील है। कुण्डली में ${d.topYogas} सक्रिय होने के कारण स्वतंत्र व्यवसाय, नेतृत्व तथा प्रशासनिक क्षेत्र में आपका वर्चस्व स्थापित होगा।`;
      forecast = `आगामी ८ से १२ महीनों में आजीविका के क्षेत्र में सकारात्मक बदलाव एवं पदोन्नति के प्रबल योग निर्मित हो रहे हैं। वरिष्ठ जनों के साथ सामंजस्य लाभप्रद रहेगा।`;
      remedies = [
        `<strong>बीज मंत्र:</strong> नित्य लग्न स्वामी ${d.lagnaLordLocal} के बीज मंत्र का १०८ बार जप करें।`,
        `<strong>शुभ रत्न:</strong> आपके लिए अनुकूल रत्न ${d.gemProtocol.primeGem} (${d.gemProtocol.metal} में, ${d.gemProtocol.finger} पर, ${d.gemProtocol.wearingDay})।`,
        `<strong>वर्जित रत्न:</strong> ${d.gemProtocol.forbiddenGems}`,
        `<strong>सेवा कर्म:</strong> गुरुवार अथवा शनिवार को निर्धनों को भोजन कराएं एवं गाय को हरा चारा खिलाएं।`
      ];
      blessings = 'सत्कर्म एवं धर्म का मार्ग कभी निष्फल नहीं होता। भगवान सूर्य एवं देवगुरु की कृपा आप पर सदैव बनी रहे।';
      break;

    case 'MARRIAGE':
      topicTitle = '💍 विवाह योग, जीवनसाथी एवं वैवाहिक सौख्य';
      analysis = `कुण्डली के सप्तम भाव में ${d.seventhSignLocal} राशि स्थित है जिसके स्वामी ${d.seventhLordLocal} हैं। लग्न ${d.lagnaRashiName} एवं चन्द्र राशि ${d.moonRashiName} के आधार पर आपका जीवनसाथी गुणवान, सुसंस्कृत तथा पारिवारिक मूल्यों का आदर करने वाला होगा। ${d.manglik?.present ? (d.manglik.cancelled ? 'मांगलिक प्रभाव शुभ ग्रहों के योग से शमित हो चुका है।' : 'मांगलिक प्रभाव सामान्य है, शांति उपाय हितकर हैं।') : 'कुण्डली में कोई अनिष्ट मांगलिक दोष नहीं है।'}`;
      forecast = `वर्तमान ${d.mahaDashaLord} दशा अनुकूल संबंधों के द्वार खोल रही है। उत्तर-पूर्व दिशा से शुभ वैवाहिक प्रस्ताव आने की प्रबल संभावना है।`;
      remedies = [
        `<strong>मंत्र साधना:</strong> दांपत्य सुख हेतु नित्य "ॐ नमो नारायणाय" अथवा "ॐ क्लीं कृष्णाय नमः" का जप करें।`,
        `<strong>पवित्र रुद्राक्ष:</strong> ${d.rudrakshaLoc.mukhi} धारण करने से संबंधों में प्रगाढ़ता आती है।`,
        `<strong>गौ-सेवा:</strong> शुक्रवार को देवी मंदिर में शुद्ध घी का दीपक प्रज्वलित करें।`
      ];
      blessings = 'दांपत्य जीवन प्रेम, सामंजस्य एवं अखंड सौभाग्य से परिपूर्ण हो।';
      break;

    case 'WEALTH':
      topicTitle = '💰 धन संचय, स्थायी संपत्ति एवं आर्थिक समृद्धि';
      analysis = `कुण्डली के द्वितीय (धन) एवं एकादश (लाभ) भाव का विश्लेषण करने पर ${d.topYogas} आपके संचित धन को बल प्रदान करते हैं। ${d.mahaDashaLord} की दशा में भूमि, भवन एवं दीर्घकालिक निवेशों से प्रचुर लाभ के योग हैं। अनावश्यक ऋण लेने या सट्टा-बाजार से परहेज रखें।`;
      forecast = `आगामी १ वर्ष में आय के नवीन स्रोतों का सृजन होगा। अचल संपत्ति के निर्माण हेतु यह समय अत्यंत शुभ है।`;
      remedies = [
        `<strong>श्री सूक्त पाठ:</strong> प्रत्येक शुक्रवार को श्री सूक्त अथवा कनकधारा स्तोत्र का पाठ करें।`,
        `<strong>कुबेर यंत्र:</strong> पूजा स्थल में प्राण-प्रतिष्ठित श्री यंत्र अथवा कुबेर यंत्र स्थापित करें।`,
        `<strong>अन्नदान:</strong> अमावस्या के दिन जरूरतमंदों को सूखा अन्न व फल दान करें।`
      ];
      blessings = 'माता महालक्ष्मी आपके भंडार सदैव भरे रखें।';
      break;

    default:
      topicTitle = '🔮 समग्र जीवन फल एवं वैदिक दिशा-निर्देश';
      analysis = `प्रिय ${ctx.seekerName}, आपकी कुण्डली का आधार स्तम्भ:\n• <strong>जन्म लग्न:</strong> ${d.lagnaRashiName} (स्वामी: ${d.lagnaLordLocal})\n• <strong>चन्द्र राशि:</strong> ${d.moonRashiName} (नक्षत्र: ${d.nakshatraLocal})\n• <strong>सक्रिय महादशा:</strong> ${d.mahaDashaLord} / ${d.antarDashaLord}\n• <strong>मुख्य राजयोग:</strong> ${d.topYogas}`;
      forecast = `ग्रहों का गोचर आपके आत्म-विकास एवं आध्यात्मिक जागृति के अनुकूल है। नियमित साधना से जीवन के सभी संकल्प सिद्ध होंगे।`;
      remedies = [
        `<strong>इष्टदेव उपासना:</strong> ${d.ishtaInfo.ishta} का ध्यान एवं ${d.ishtaInfo.mantra} का नित्य जप करें।`,
        `<strong>रत्न धारण:</strong> ${d.gemProtocol.primeGem} धारण करें।`,
        `<strong>सूर्य अर्घ्य:</strong> तांबे के लोटे से सूर्य को जल अर्पित करें।`
      ];
      blessings = 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। एस्ट्रोगुरु का शुभाशीर्वाद आपके साथ है।';
      break;
  }

  return {
    lang: 'hi',
    topicTitle,
    seekerName: ctx.seekerName,
    lagnaSummary: `लग्न: ${d.lagnaRashiName} • राशि: ${d.moonRashiName} • नक्षत्र: ${d.nakshatraLocal} • दशा: ${d.mahaDashaLord}/${d.antarDashaLord}`,
    analysis,
    forecast,
    remedies,
    blessings
  };
}

// -------------------------------------------------------------------------
// 3. ENGLISH RESPONSE BUILDER
// -------------------------------------------------------------------------
function buildEnglishResponse(intent, ctx, d) {
  let topicTitle = '';
  let analysis = '';
  let forecast = '';
  let remedies = [];
  let blessings = '';

  switch (intent) {
    case 'CAREER':
      topicTitle = '💼 Professional Ascent, Career Direction & Enterprise';
      analysis = `Your natal chart has ${d.lagnaRashiName} Ascendant with 10th house lord ${d.tenthLordLocal}. You are currently running the Mahadasha of ${d.mahaDashaLord} with Antardasha of ${d.antarDashaLord}. The presence of ${d.topYogas} endows you with supreme analytical acumen, strategic foresight, and natural executive leadership.`;
      forecast = `The upcoming 8 to 14 months present a strong astrological window for career promotion, corporate expansion, or successful new business partnerships.`;
      remedies = [
        `<strong>Seed Mantra Japa:</strong> Chant the Lagna Lord ${d.lagnaLordLocal} seed mantra 108 times daily.`,
        `<strong>Prescribed Gemstone:</strong> ${d.gemProtocol.primeGem} (${d.gemProtocol.metal}, ${d.gemProtocol.finger}, ${d.gemProtocol.wearingDay}).`,
        `<strong>Strictly Avoid:</strong> ${d.gemProtocol.forbiddenGems}`,
        `<strong>Vedic Charity:</strong> Feed cows with green fodder or jaggery on Thursdays and Saturdays.`
      ];
      blessings = 'Align your intellect with right action (Dharma), and victory will follow naturally.';
      break;

    case 'MARRIAGE':
      topicTitle = '💍 Matrimonial Prospects, Spouse Profile & Domestic Harmony';
      analysis = `The 7th house in your Kundali is in ${d.seventhSignLocal} ruled by ${d.seventhLordLocal}. With Ascendant in ${d.lagnaRashiName} and Moon in ${d.moonRashiName}, your future spouse will be intellectually mature, dignified, and emotionally grounded. ${d.manglik?.present ? (d.manglik.cancelled ? 'Manglik affliction is neutralized by benefic aspects.' : 'Manglik intensity is moderate; standard remedies are recommended.') : 'No debilitating Manglik dosha is present.'}`;
      forecast = `The transit of Jupiter activates matrimonial opportunities in the upcoming months. The North-East or East direction is auspicious for alliances.`;
      remedies = [
        `<strong>Harmony Mantra:</strong> Chant "Om Namo Narayanaya" 108 times daily.`,
        `<strong>Consecrated Rudraksha:</strong> Wear ${d.rudrakshaLoc.mukhi} for relationship peace.`,
        `<strong>Devi Worship:</strong> Light a cow-ghee lamp on Fridays at a sacred temple.`
      ];
      blessings = 'May your marital bond be blessed with lifelong harmony, prosperity, and joy.';
      break;

    default:
      topicTitle = '🔮 Comprehensive Astrological Analysis & Future Blueprint';
      analysis = `Respected ${ctx.seekerName}, here is your cosmic blueprint:\n• <strong>Ascendant (Lagna):</strong> ${d.lagnaRashiName} (Lord: ${d.lagnaLordLocal})\n• <strong>Moon Sign (Rashi):</strong> ${d.moonRashiName} (Nakshatra: ${d.nakshatraLocal})\n• <strong>Current Dasha:</strong> ${d.mahaDashaLord} / ${d.antarDashaLord}\n• <strong>Active Raj Yogas:</strong> ${d.topYogas}`;
      forecast = `The current celestial transits encourage inner discipline and purposeful growth. Favorable outcomes will manifest as you stay focused on your core strengths.`;
      remedies = [
        `<strong>Ishta Devata:</strong> Meditate upon ${d.ishtaInfo.ishta} and chant ${d.ishtaInfo.mantra}.`,
        `<strong>Gemstone:</strong> Consecrate and wear ${d.gemProtocol.primeGem}.`,
        `<strong>Surya Arghya:</strong> Offer clean water to the rising Sun daily from a copper vessel.`
      ];
      blessings = 'May the divine cosmic light illuminate your path to happiness and fulfillment.';
      break;
  }

  return {
    lang: 'en',
    topicTitle,
    seekerName: ctx.seekerName,
    lagnaSummary: `Lagna: ${d.lagnaRashiName} • Moon: ${d.moonRashiName} • Nakshatra: ${d.nakshatraLocal} • Dasha: ${d.mahaDashaLord}/${d.antarDashaLord}`,
    analysis,
    forecast,
    remedies,
    blessings
  };
}

// -------------------------------------------------------------------------
// 4. MARATHI RESPONSE BUILDER
// -------------------------------------------------------------------------
function buildMarathiResponse(intent, ctx, d) {
  return {
    lang: 'mr',
    topicTitle: '🔮 ॲस्ट्रोगुरू कुंडली विश्लेषण व शास्त्रीय मार्गदर्शन',
    seekerName: ctx.seekerName,
    lagnaSummary: `लग्न: ${d.lagnaRashiName} • रास: ${d.moonRashiName} • नक्षत्र: ${d.nakshatraLocal} • दशा: ${d.mahaDashaLord}/${d.antarDashaLord}`,
    analysis: `आपल्या पत्रिकेत लग्न ${d.lagnaRashiName} असून लग्नेश ${d.lagnaLordLocal} आहेत. सध्या ${d.mahaDashaLord} महादशेत ${d.antarDashaLord} अंतर्दशा कार्यरत आहे. पत्रिकेतील ${d.topYogas} आपल्या प्रगतीचा मार्ग प्रशस्त करत आहेत.`,
    forecast: `येत्या काळात आपल्या जीवनात महत्त्वपूर्ण सकारात्मक बदल घडून येतील. धैर्याने वाटचाल केल्यास यशाची नवी शिखरे गाठाल.`,
    remedies: [
      `<strong>इष्टदेवता उपासना:</strong> ${d.ishtaInfo.ishta} यांची भक्ती व ${d.ishtaInfo.mantra} चा जप करा.`,
      `<strong>शुभ रत्न:</strong> ${d.gemProtocol.primeGem} परिधान करावे.`,
      `<strong>सेवा:</strong> गुरुवारी व शनिवारी गरजूंना अन्नदान आणि गाईला चारा द्यावा.`
    ],
    blessings: 'सत्कर्म आणि ईश्वरावरील श्रद्धा नेहमी यश मिळवून देते. ॲस्ट्रोगुरूंचे मंगल आशीर्वाद.'
  };
}

// -------------------------------------------------------------------------
// 5. TELUGU RESPONSE BUILDER
// -------------------------------------------------------------------------
function buildTeluguResponse(intent, ctx, d) {
  return {
    lang: 'te',
    topicTitle: '🔮 ఆస్ట్రోగురు జాతక విశ్లేషణ మరియు శాస్త్రోక్త పరిష్కారాలు',
    seekerName: ctx.seekerName,
    lagnaSummary: `లగ్నం: ${d.lagnaRashiName} • రాశి: ${d.moonRashiName} • నక్షత్రం: ${d.nakshatraLocal} • దశ: ${d.mahaDashaLord}/${d.antarDashaLord}`,
    analysis: `మీ జాతకంలో జన్మ లగ్నం ${d.lagnaRashiName} మరియు లగ్నాధిపతి ${d.lagnaLordLocal}. ప్రస్తుతం ${d.mahaDashaLord} మహర్దశలో ${d.antarDashaLord} అంతర్దశ నడుస్తోంది. మీ కుండలిలోని ${d.topYogas} శుభ ఫలితాలను ప్రసాదిస్తున్నాయి.`,
    forecast: `రాబోయే కాలంలో మీ జీవితంలో శుభ పరిణామాలు సంభవిస్తాయి. ప్రయత్న లోపం లేకుండా ముందుకు సాగితే విజయాలు సిద్ధించును.`,
    remedies: [
      `<strong>ఇష్టదైవ ఆరాధన:</strong> ${d.ishtaInfo.ishta} ను స్మరించి నిత్యం ${d.ishtaInfo.mantra} జపించండి.`,
      `<strong>శుభ రత్నం:</strong> శాస్త్రోక్తంగా ${d.gemProtocol.primeGem} ధరించండి.`,
      `<strong>గోసేవ:</strong> ఆవులకు అరటిపండ్లు లేదా పచ్చగడ్డి సమర్పించండి.`
    ],
    blessings: 'ధర్మో రక్షతి రక్షితః. ఆస్ట్రోగురు దైవిక ఆశీస్సులు మీకు ఎల్లవేళలా ఉండును గాక.'
  };
}
