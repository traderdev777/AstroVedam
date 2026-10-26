/**
 * AstroVeda - Full Comprehensive Pagewise Vedic Patrika (9-Page Master PDF Report Generator)
 * Supports 5 Languages: English (en), Hindi (hi), Kannada (kn), Marathi (mr), and Telugu (te).
 * High-definition typography, 350px crystal-clear dual SVG charts, Lo Shu Grid, Mobile Numerology,
 * 100% Authentic Localized Life Predictions, Master Remedies, and 5 Daily Success Rules.
 * Pure native terminology with zero English parenthetical residues.
 */

import { calculateDailyPanchang } from '../../engines/astrology/panchang.js';
import { 
  generateLifeGuidance, 
  generateAdvancedAstroSolutions,
  generateComprehensiveLifePredictions,
  generateComprehensiveRemedies 
} from '../../engines/astrology/predictions.js';
import { calculateVimshottariDasha, getCurrentDasha } from '../../engines/astrology/dasha.js';
import { generateNumerologyProfile, analyzeMobileNumber } from '../../engines/numerology/calculator.js';
import { RASHIS } from '../../engines/astrology/constants.js';

import { getPatrikaText, PATRIKA_LANGUAGES, LOCALIZED_PLANETS, LOCALIZED_RASHIS } from '../../i18n/patrikaTranslations.js';
import { 
  CARD_LABELS,
  DASHA_TABLE_LABELS,
  PAGE4_TABLE_LABELS,
  YOGAS_LOCALIZED,
  DOSHAS_LOCALIZED,
  MOBILE_LOCALIZATION,
  CAREER_GUIDANCE_LOCALIZED,
  getLocalizedPredictionsData,
  LOCALIZED_NAKSHATRAS,
  LOCALIZED_PANCHANG,
  getLocalizedJanamNaam,
  getPlanetDignityKey,
  GEMSTONE_PROTOCOLS_LOCALIZED,
  RUDRAKSHA_LOCALIZED,
  YANTRA_LOCALIZED,
  getPureLocalizedAttributes,
  getLocalizedDebtTitle,
  getRashiName
} from '../../i18n/predictionTranslations.js';

/**
 * Context-aware HTML entity encoder to prevent DOM-based XSS when interpolating
 * untrusted strings into HTML contexts.
 * Encodes &, <, >, ", and ' to their safe HTML entity representations.
 *
 * @param {any} val - Untrusted input
 * @returns {string} - Escaped HTML string
 */
export function escapeHtml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderFullPatrikaReport(kundali, navamsa, yogas, doshas, userInputs = {}, selectedLang = 'hi') {
  const langKey = ['en', 'hi', 'kn', 'mr', 'te'].includes(selectedLang) ? selectedLang : 'hi';
  const T = getPatrikaText(langKey);
  const labels = CARD_LABELS[langKey] || CARD_LABELS.en;
  const localizedData = getLocalizedPredictionsData(kundali, langKey);
  const mobLoc = MOBILE_LOCALIZATION[langKey] || MOBILE_LOCALIZATION.hi;
  const careerLoc = CAREER_GUIDANCE_LOCALIZED[langKey] || CAREER_GUIDANCE_LOCALIZED.hi;
  const dashaLabels = DASHA_TABLE_LABELS[langKey] || DASHA_TABLE_LABELS.en;
  const p4Labels = PAGE4_TABLE_LABELS[langKey] || PAGE4_TABLE_LABELS.en;

  const moon = kundali.planets.find(p => p.name === 'Moon');
  const namingInfo = getLocalizedJanamNaam(moon.nakshatra, moon.pada, langKey);
  const panchang = calculateDailyPanchang(userInputs.date || '1995-10-24', kundali.birthDetails?.latitude || 25.3176, kundali.birthDetails?.longitude || 82.9739, kundali.birthDetails?.timezone || 5.5);
  const rawLifeGuidance = generateLifeGuidance(kundali, userInputs);
  const lifeGuidance = {
    ...rawLifeGuidance,
    attributes: getPureLocalizedAttributes(rawLifeGuidance.attributes, langKey, kundali.lagna.rashiName)
  };
  const advancedAstro = generateAdvancedAstroSolutions(kundali, userInputs);
  const deepPredictions = generateComprehensiveLifePredictions(kundali, userInputs);
  const deepRemedies = generateComprehensiveRemedies(kundali, userInputs);
  const rawPersonName = (userInputs.name || 'Seeker').trim() || 'Seeker';
  const rawDob = userInputs.date || '1995-10-24';
  const rawTob = userInputs.time || '10:30';
  const rawCity = userInputs.city || 'New Delhi, Delhi';
  const userPhoneClean = (userInputs.phone || '').trim();
  const hasPhone = !!userPhoneClean;

  const dashaData = calculateVimshottariDasha(moon.longitude, rawDob);
  const currentDasha = getCurrentDasha(dashaData);
  const numerology = generateNumerologyProfile(rawPersonName, rawDob, userInputs.phone || '');
  const mobileDetails = hasPhone ? analyzeMobileNumber(userPhoneClean, numerology.mulank.number, numerology.bhagyank.number) : null;

  const notSpecMap = {
    en: 'Not Provided (Optional)',
    hi: 'उपलब्ध नहीं (ऐच्छिक)',
    kn: 'ತಿಳಿಸಿಲ್ಲ (ಐಚ್ಛಿಕ)',
    mr: 'दिलेले नाही (ऐच्छಿಕ)',
    te: 'తెలిಯజేయలేదు (ఐచ్ఛికం)'
  };
  const notSpecGeneric = { en: 'Not Specified', hi: 'निर्दिष्ट नहीं', kn: 'ತಿಳಿಸಿಲ್ಲ', mr: 'नमूद नाही', te: 'తెలిಯజేಯలేదు' };
  
  // Safe Escaped User-Controlled Values (DOM-based XSS Prevention)
  const personName = escapeHtml(rawPersonName);
  const rawFather = userInputs.fatherName ? userInputs.fatherName.trim() : (notSpecGeneric[langKey] || 'Not Specified');
  const fatherName = escapeHtml(rawFather);
  const rawMother = userInputs.motherName ? userInputs.motherName.trim() : (notSpecGeneric[langKey] || 'Not Specified');
  const motherName = escapeHtml(rawMother);
  const cityName = escapeHtml(rawCity);
  const dobText = escapeHtml(rawDob);
  const tobText = escapeHtml(rawTob);
  const safePhone = escapeHtml(userPhoneClean);
  const displayPhone = hasPhone ? safePhone : escapeHtml(notSpecMap[langKey]);
  const gemProtocol = GEMSTONE_PROTOCOLS_LOCALIZED[kundali.lagna.rashiName]?.[langKey] || GEMSTONE_PROTOCOLS_LOCALIZED.Sagittarius[langKey];
  const rudrakshaLoc = RUDRAKSHA_LOCALIZED[kundali.lagna.lord]?.[langKey] || RUDRAKSHA_LOCALIZED.Jupiter[langKey];
  const yantraLoc = YANTRA_LOCALIZED[kundali.lagna.lord]?.[langKey] || YANTRA_LOCALIZED.Jupiter[langKey];
  const lagnaBeej = deepRemedies.mantras.lagna.beejMantra || deepRemedies.mantras.lagna.mantra;
  const bhagyaBeej = deepRemedies.mantras.bhagya.beejMantra || deepRemedies.mantras.bhagya.mantra;

  const localizedMoonRashi = LOCALIZED_RASHIS[moon.rashi]?.[langKey] || moon.rashiName;
  const localizedLagnaRashi = LOCALIZED_RASHIS[kundali.lagna.rashi]?.[langKey] || kundali.lagna.rashiName;

  // Localized Panchang Labels
  const panchangLabels = {
    en: { tithi: 'Tithi:', yoga: 'Yoga:', karana: 'Karana:', vara: 'Vara (Day):', sunrise: 'Sunrise:', ritu: 'Ritu (Season):' },
    hi: { tithi: 'तिथि:', yoga: 'योग:', karana: 'करण:', vara: 'वार (दिन):', sunrise: 'सूर्योदय:', ritu: 'ऋतु:' },
    kn: { tithi: 'ತಿಥಿ:', yoga: 'ಯೋಗ:', karana: 'ಕರಣ:', vara: 'ವಾರ (ದಿನ):', sunrise: 'ಸೂರ್ಯೋದಯ:', ritu: 'ಋತು:' },
    mr: { tithi: 'तिथी:', yoga: 'योग:', karana: 'करण:', vara: 'वार (दिवस):', sunrise: 'सूर्योदय:', ritu: 'ऋतू:' },
    te: { tithi: 'తిథి:', yoga: 'యోగం:', karana: 'కరణం:', vara: 'వారం (రోజు):', sunrise: 'సూర్యోదయం:', ritu: 'ఋతువు:' }
  }[langKey] || { tithi: 'Tithi:', yoga: 'Yoga:', karana: 'Karana:', vara: 'Vara (Day):', sunrise: 'Sunrise:', ritu: 'Ritu (Season):' };

  const rituNames = {
    en: 'Sharad (Autumn)',
    hi: 'शरद ऋतु',
    kn: 'ಶರದ್ ಋತು',
    mr: 'शरद ऋतू',
    te: 'శరద్ ఋతువు'
  }[langKey] || 'Sharad';

  // Chart titles
  const chartTitles = {
    en: {
      d1: `D-1 Lagna Chart (Ascendant - ${localizedLagnaRashi})`,
      d9: 'D-9 Navamsha Chart (Subtle Destiny)'
    },
    hi: {
      d1: `डी-१ लग्न कुण्डली (${localizedLagnaRashi})`,
      d9: 'डी-९ नवांश कुण्डली (सूक्ष्म भाग्य)'
    },
    kn: {
      d1: `ಡಿ-೧ ಲಗ್ನ ಕುಂಡಲಿ (${localizedLagnaRashi})`,
      d9: 'ಡಿ-೯ ನವಾಂಶ ಕುಂಡಲಿ (ಸೂಕ್ಷ್ಮ ಭಾಗ್ಯ)'
    },
    mr: {
      d1: `डी-१ लग्न कुंडली (${localizedLagnaRashi})`,
      d9: 'डी-९ नवांश कुंडली (सूक्ष्म भाग्य)'
    },
    te: {
      d1: `డి-1 లగ్న కుండలి (${localizedLagnaRashi})`,
      d9: 'డి-9 నవాంశ కుండలి (సూక్ష్మ భాగ్యం)'
    }
  }[langKey] || {
    d1: `D-1 Lagna Chart (Ascendant - ${localizedLagnaRashi})`,
    d9: 'D-9 Navamsha Chart (Subtle Destiny)'
  };

  // Numerology Labels
  const numLabels = {
    en: {
      mulank: 'Mulank (Birth / Driver Number):',
      bhagyank: 'Bhagyank (Destiny / Conductor):',
      chaldean: 'Chaldean Namank (Name Vibration):',
      compound: 'Compound:',
      pythagorean: 'Pythagorean Expression:',
      soulUrge: 'Soul Urge:',
      loShuTitle: '3x3 Sacred Lo Shu Magic Square',
      newSimTitle: 'Golden Recommendation for New SIM / Mobile Connection:'
    },
    hi: {
      mulank: 'मूलांक (जन्म अंक):',
      bhagyank: 'भाग्यांक (जीवन अंक):',
      chaldean: 'खाल्डियन नामांक (नाम शक्ति):',
      compound: 'संयुक्तांक:',
      pythagorean: 'पाइथागोरियन अभिव्यक्ति अंक:',
      soulUrge: 'आत्म प्रेरणा अंक:',
      loShuTitle: '३x३ पवित्र लो-शू महायंत्र चक्र',
      newSimTitle: 'नवीन सिम / मोबाइल कनेक्शन हेतु स्वर्ण अनुशंसा:'
    },
    kn: {
      mulank: 'ಮೂಲ್ಯಾಂಕ (ಜನ್ಮ ಸಂಖ್ಯೆ):',
      bhagyank: 'ಭಾಗ್ಯಾಂಕ (ಜೀವನ ಸಂಖ್ಯೆ):',
      chaldean: 'ಚಾಲ್ಡಿಯನ್ ನಾಮಾಂಕ (ನಾಮ ಶಕ್ತಿ):',
      compound: 'ಸಂಯುಕ್ತ ಮೊತ್ತ:',
      pythagorean: 'ಪೈಥಾಗೋರಿಯನ್ ಅಭಿವ್ಯಕ್ತಿ ಸಂಖ್ಯೆ:',
      soulUrge: 'ಆತ್ಮ ಪ್ರೇರಣೆ ಸಂಖ್ಯೆ:',
      loShuTitle: '೩x೩ ಪವಿತ್ರ ಲೋ-ಶೂ ಚಕ್ರ',
      newSimTitle: 'ನೂತನ ಸಿಮ್ / ಮೊಬೈಲ್ ಸಂಪರ್ಕಕ್ಕಾಗಿ ಸುವರ್ಣ ಶಿಫಾರಸು:'
    },
    mr: {
      mulank: 'मूलांक (जन्म अंक):',
      bhagyank: 'भाग्यांक (जीवन अंक):',
      chaldean: 'चाल्डियन नामांक (नाव शक्ती):',
      compound: 'संयुक्त बेरीज:',
      pythagorean: 'पायथागोरियन अभिव्यक्ती अंक:',
      soulUrge: 'आत्म प्रेरणा अंक:',
      loShuTitle: '३x३ पवित्र लो-शू महायंत्र चक्र',
      newSimTitle: 'नवीन सिम / मोबाइल कनेक्शनसाठी सुवर्ण शिफारस:'
    },
    te: {
      mulank: 'మూలాంకం (జన్మ సంఖ్య):',
      bhagyank: 'భాగ్యాంకం (జీవన సంఖ్య):',
      chaldean: 'చాల్డియన్ నామాంకం (పేరు శక్తి):',
      compound: 'సంయుక్త మొత్తం:',
      pythagorean: 'పైథాగోరియన్ వ్యక్తీకరణ సంఖ్య:',
      soulUrge: 'ఆత్మ ప్రేరణ సంఖ్య:',
      loShuTitle: '3x3 పవిత్ర లో-షూ చక్రం',
      newSimTitle: 'కొత్త సిమ్ / మొబైల్ కనెక్షన్ కోసం సువర్ణ సిఫార్సు:'
    }
  }[langKey] || {
    mulank: 'Mulank (Birth / Driver Number):',
    bhagyank: 'Bhagyank (Destiny / Conductor):',
    chaldean: 'Chaldean Namank (Name Vibration):',
    compound: 'Compound:',
    pythagorean: 'Pythagorean Expression:',
    soulUrge: 'Soul Urge:',
    loShuTitle: '3x3 Sacred Lo Shu Magic Square',
    newSimTitle: 'Golden Recommendation for New SIM / Mobile Connection:'
  };

  // Quarterly forecast labels
  const qLabels = {
    en: ['Q1 (Jan–Mar)', 'Q2 (Apr–Jun)', 'Q3 (Jul–Sep)', 'Q4 (Oct–Dec)'],
    hi: ['प्रथम त्रैमास (जनवरी-मार्च)', 'द्वितीय त्रैमास (अप्रैल-जून)', 'तृतीय त्रैमास (जुलाई-सितंबर)', 'चतुर्थ त्रैमास (अक्टूबर-दिसंबर)'],
    kn: ['ಮೊದಲ ತ್ರೈಮಾಸಿಕ (ಜನವರಿ-ಮಾರ್ಚ್)', 'ಎರಡನೇ ತ್ರೈಮಾಸಿಕ (ಏಪ್ರಿಲ್-ಜೂನ್)', 'ಮೂರನೇ ತ್ರೈಮಾಸಿಕ (ಜುಲೈ-ಸೆಪ್ಟೆಂಬರ್)', 'ನಾಲ್ಕನೇ ತ್ರೈಮಾಸಿಕ (ಅಕ್ಟೋಬರ್-ಡಿಸೆಂಬರ್)'],
    mr: ['पहिली तिमाही (जानेवारी-मार्च)', 'दुसरी तिमाही (एप्रिल-जून)', 'तिसरी तिमाही (जुलै-सप्टेंबर)', 'चौथी तिमाही (ऑक्टोबर-डिसेंबर)'],
    te: ['మొదటి త్రైమాసికం (జనవరి-మార్చి)', 'రెండవ త్రైమాసికం (ఏప్రిల్-జూన్)', 'మూడవ త్రైమాసికం (జూలై-సెప్టెంబర్)', 'నాల్గవ త్రైమాసికం (అక్టోబర్-డిసెంబర్)']
  }[langKey] || ['Q1 (Jan–Mar)', 'Q2 (Apr–Jun)', 'Q3 (Jul–Sep)', 'Q4 (Oct–Dec)'];

  // Helper for Lo Shu grid cell display
  const renderLoShuCell = (num, count) => {
    let display = '<span style="color: #94A3B8; font-size: 13px;">—</span>';
    if (count > 0) {
      display = `<span style="color: #9A3412; font-weight: 900; font-size: 18px;">${String(num).repeat(Math.min(count, 4))}</span>`;
    }
    return `
      <div style="border: 1.5px solid #D97706; padding: 8px; text-align: center; background: ${count > 0 ? '#FEF3C7' : '#FFFFFF'}; border-radius: 6px; min-height: 52px; display: flex; flex-direction: column; justify-content: center; position: relative;">
        <span style="position: absolute; top: 3px; left: 5px; font-size: 10.5px; color: #92400E; font-weight: 800;">${num}</span>
        ${display}
      </div>
    `;
  };

  return `
    <div class="patrika-report-wrapper" id="printable-patrika">
      <!-- Print & Share Actions Bar (hidden when printing) -->
      <div class="no-print" style="background: rgba(218,165,32,0.12); border: 2px solid var(--gold-500); padding: 16px 22px; border-radius: var(--radius-lg); margin-bottom: var(--space-6); display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <strong style="color: var(--gold-400); font-size: 16px;">${T.meta.title}</strong>
            <div style="font-size: 12.5px; color: #CBD5E1; margin-top: 2px;">
              ${({
    kn: 'ಮುದ್ರಿಸಬಹುದಾದ ಉನ್ನತ-ರೆಸಲ್ಯೂಶನ್ ಸ್ವರೂಪ • ಸ್ಪಷ್ಟ ಕುಂಡಲಿ ಚಕ್ರಗಳು ಮತ್ತು ಶುದ್ಧ ಕನ್ನಡ ಪಠ್ಯ',
    hi: 'उच्च-रेजोल्यूशन मुद्रण योग्य प्रारूप • स्पष्ट कुंडली चक्र एवं प्रामाणिक हिंदी पाठ',
    mr: 'उच्च दर्जाचे मुद्रण योग्य स्वरूप • स्पष्ट कुंडली चक्रे व अस्खलित मराठी मजकूर',
    te: 'హై-డెఫినిషన్ ప్రింటబుల్ ఫార్మాట్ • స్పష్టమైన జాతక చక్రాలు & స్వచ్ఛమైన తెలుగు',
    en: 'High-Definition 300DPI Printable & Sharable Format • Crystal-Clear Charts & Enhanced Typography'
  }[langKey])}
            </div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="trigger-pdf-download-btn" class="btn btn-primary" style="padding: 9px 22px; font-weight: 800; font-size: 13.5px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(218,165,32,0.4);">
              <span>📥</span> ${({
    kn: 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (ಕನ್ನಡ)',
    hi: 'पीडीएफ डाउनलोड करें (हिंदी)',
    mr: 'पीडीएफ डाउनलोड करा (मराठी)',
    te: 'పిడిఎఫ్ డౌన్‌లోడ్ చేయండి (తెలుగు)',
    en: 'Download PDF File (English)'
  }[langKey])}
            </button>
            <button id="trigger-pdf-print-btn" class="btn btn-secondary" style="padding: 9px 18px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              <span>🖨️</span> ${({
    kn: 'ಪ್ರಿಂಟ್ / ಪಿಡಿಎಫ್ ಉಳಿಸಿ',
    hi: 'प्रिंट / सेव पीडीएफ',
    mr: 'प्रिंट / सेव्ह पीडीएफ',
    te: 'ప్రింట్ / సేవ్ పిడిఎఫ్',
    en: 'Print / Save as PDF'
  }[langKey])}
            </button>
            <button id="trigger-whatsapp-share-btn" class="btn btn-secondary" style="padding: 9px 18px; font-weight: 700; border-color: #25D366; color: #25D366; display: inline-flex; align-items: center; gap: 6px;">
              <span>💬</span> ${({
    kn: 'ವಾಟ್ಸಾಪ್',
    hi: 'व्हाट्सएप',
    mr: 'व्हॉट्सॲप',
    te: 'వాట్సాప్',
    en: 'WhatsApp'
  }[langKey])}
            </button>
            <button id="trigger-copy-link-btn" class="btn btn-secondary" style="padding: 9px 18px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              <span>🔗</span> ${({
    kn: 'ಲಿಂಕ್ ನಕಲಿಸಿ',
    hi: 'लिंक कॉपी करें',
    mr: 'लिंक कॉपी करा',
    te: 'లింక్ కాపీ చేయండి',
    en: 'Copy Link'
  }[langKey])}
            </button>
          </div>
        </div>

        <!-- Language Switcher Strip -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding-top: 8px; border-top: 1px dashed rgba(218,165,32,0.3); font-size: 13px;">
          <div style="color: var(--gold-400); font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <span>🌐</span> <strong>${({
    kn: 'ವರದಿ ಮತ್ತು ಪಿಡಿಎಫ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    hi: 'रिपोर्ट एवं पीडीएफ भाषा चुनें:',
    mr: 'अहवाल व पीडीएफ भाषा निवडा:',
    te: 'రిపోర్ట్ & పిడిఎఫ్ భాషను ఎంచుకోండి:',
    en: 'Choose Report & PDF Language:'
  }[langKey])}</strong>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${langKey === 'en' ? 'btn-primary' : 'btn-secondary'}" data-lang="en" style="padding: 4px 12px; font-weight: 800;">
              English
            </button>
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${langKey === 'hi' ? 'btn-primary' : 'btn-secondary'}" data-lang="hi" style="padding: 4px 12px; font-weight: 800;">
              हिंदी (Hindi)
            </button>
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${langKey === 'kn' ? 'btn-primary' : 'btn-secondary'}" data-lang="kn" style="padding: 4px 12px; font-weight: 800;">
              ಕನ್ನಡ (Kannada)
            </button>
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${langKey === 'mr' ? 'btn-primary' : 'btn-secondary'}" data-lang="mr" style="padding: 4px 12px; font-weight: 800;">
              मराठी (Marathi)
            </button>
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${langKey === 'te' ? 'btn-primary' : 'btn-secondary'}" data-lang="te" style="padding: 4px 12px; font-weight: 800;">
              తెలుగు (Telugu)
            </button>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 1: COVER & SACRED BIRTH PARTICULARS                -->
      <!-- ======================================================== -->
      <div class="patrika-page page-1">
        <div class="patrika-border">
          <div class="patrika-header">
            <div class="patrika-om">${T.meta.om}</div>
            <h1 class="patrika-title">${T.meta.title}</h1>
            <p class="patrika-subtitle">${T.meta.subtitle}</p>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s1}</span>
          </div>

          <table class="patrika-print-table" style="margin-bottom: 14px;">
            <tbody>
              <tr>
                <td style="width: 25%;"><strong>${T.fields.name}:</strong></td>
                <td style="width: 25%;"><strong style="color: #9A3412; font-size: 13.5px;">${personName}</strong></td>
                <td style="width: 25%;"><strong>${T.fields.dob}:</strong></td>
                <td style="width: 25%;">${dobText}</td>
              </tr>
              <tr>
                <td><strong>${T.fields.tob}:</strong></td>
                <td>${tobText} (24 Hr)</td>
                <td><strong>${T.fields.pob}:</strong></td>
                <td>${cityName}</td>
              </tr>
              <tr>
                <td><strong>${T.fields.father}:</strong></td>
                <td>${fatherName}</td>
                <td><strong>${T.fields.mother}:</strong></td>
                <td>${motherName}</td>
              </tr>
              <tr>
                <td><strong>${T.fields.phone}:</strong></td>
                <td>${hasPhone ? `<strong style="color: #9A3412;">${displayPhone}</strong>` : `<span style="color: #64748B;">${displayPhone}</span>`}</td>
                <td><strong>${T.fields.coords}:</strong></td>
                <td>${kundali.birthDetails.latitude}°N, ${kundali.birthDetails.longitude}°E</td>
              </tr>
              <tr>
                <td><strong>${T.fields.ayanamsa}:</strong></td>
                <td>${kundali.birthDetails.ayanamsaValue}° (${LOCALIZED_PANCHANG.ayanamsa[kundali.birthDetails.ayanamsaSystem]?.[langKey] || escapeHtml(kundali.birthDetails.ayanamsaSystem)})</td>
                <td><strong>${T.fields.tz}:</strong></td>
                <td>UTC +${kundali.birthDetails.timezone}</td>
              </tr>
            </tbody>
          </table>

          <div style="padding: 12px 16px; background: rgba(218,165,32,0.08); border-left: 4px solid #DAA520; border-radius: 4px; margin-bottom: 14px; font-size: 12.5px; line-height: 1.6;">
            <div style="font-weight: 800; font-size: 13px; color: #9A3412; margin-bottom: 4px;">${T.sections.janamNaamTitle}</div>
            <div>
              <strong>${T.fields.nakshatra}:</strong> ${LOCALIZED_NAKSHATRAS[moon.nakshatraName]?.[langKey] || moon.nakshatraName} &bull; 
              <strong>${T.fields.pada}:</strong> ${moon.pada} &bull; 
              <strong>${T.fields.prescribedSyllable}:</strong> <strong style="color: #B45309; font-size: 15px;">${namingInfo.syllable}</strong>
            </div>
            <div style="font-size: 11.5px; color: #475569; margin-top: 2px;">
              ${namingInfo.explanation}
            </div>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s2}</span>
          </div>

          <div class="patrika-table-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 14px;">
            <div class="p-cell"><span class="p-lbl">${T.fields.lagna}:</span><strong class="p-val">${localizedLagnaRashi} (${kundali.lagna.degreeFormatted})</strong></div>
            <div class="p-cell"><span class="p-lbl">${T.fields.lagnaLord}:</span><strong class="p-val">${LOCALIZED_PLANETS[kundali.lagna.lord]?.[langKey] || kundali.lagna.lord}</strong></div>
            <div class="p-cell"><span class="p-lbl">${T.fields.moonSign}:</span><strong class="p-val">${localizedMoonRashi} (${moon.degreeFormatted})</strong></div>
            <div class="p-cell"><span class="p-lbl">${T.fields.moonLord}:</span><strong class="p-val">${LOCALIZED_PLANETS[RASHIS[moon.rashi - 1].lord]?.[langKey] || RASHIS[moon.rashi - 1].lord}</strong></div>
            <div class="p-cell"><span class="p-lbl">${T.fields.nakshatra}:</span><strong class="p-val">${LOCALIZED_NAKSHATRAS[moon.nakshatraName]?.[langKey] || moon.nakshatraName} (${T.fields.pada} ${moon.pada})</strong></div>
            <div class="p-cell"><span class="p-lbl">${T.fields.sunSign}:</span><strong class="p-val">${LOCALIZED_RASHIS[kundali.planets.find(p=>p.name==='Sun').rashi]?.[langKey] || kundali.planets.find(p=>p.name==='Sun').rashiName}</strong></div>
            <div class="p-cell"><span class="p-lbl">${panchangLabels.tithi}</span><strong class="p-val">${LOCALIZED_PANCHANG.tithis[panchang.tithi.name]?.[langKey] || panchang.tithi.name} (${LOCALIZED_PANCHANG.pakshas[panchang.tithi.paksha]?.[langKey] || panchang.tithi.paksha})</strong></div>
            <div class="p-cell"><span class="p-lbl">${panchangLabels.yoga}</span><strong class="p-val">${LOCALIZED_PANCHANG.yogas[panchang.yoga.name]?.[langKey] || panchang.yoga.name}</strong></div>
            <div class="p-cell"><span class="p-lbl">${panchangLabels.karana}</span><strong class="p-val">${LOCALIZED_PANCHANG.karanas[panchang.karana.name]?.[langKey] || panchang.karana.name}</strong></div>
            <div class="p-cell"><span class="p-lbl">${panchangLabels.vara}</span><strong class="p-val">${LOCALIZED_PANCHANG.weekdays[panchang.weekday]?.[langKey] || panchang.weekday}</strong></div>
            <div class="p-cell"><span class="p-lbl">${panchangLabels.sunrise}</span><strong class="p-val">${panchang.sunrise}</strong></div>
            <div class="p-cell"><span class="p-lbl">${panchangLabels.ritu}</span><strong class="p-val">${rituNames}</strong></div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '1')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 2: CHARTS & PLANETARY LONGITUDES                    -->
      <!-- ======================================================== -->
      <div class="patrika-page page-2">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${T.sections.s3}</span>
            <span>${personName}</span>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s3}</span>
          </div>

          <!-- Dual High-Resolution Kundali SVG Charts (Enlarged to 350px for Crisp Readability) -->
          <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 12px; flex-wrap: wrap;">
            <div style="flex: 1 1 350px; max-width: 350px; text-align: center;">
              <div style="font-weight: 800; font-size: 13.5px; color: #9A3412; margin-bottom: 6px;">
                ${chartTitles.d1}
              </div>
              <div id="print-lagna-chart" style="width: 350px; height: 350px; margin: 0 auto; background: #FFFDF8; border: 1.5px solid #D97706; border-radius: 8px; box-shadow: 0 4px 15px rgba(217,119,6,0.12);"></div>
            </div>

            <div style="flex: 1 1 350px; max-width: 350px; text-align: center;">
              <div style="font-weight: 800; font-size: 13.5px; color: #9A3412; margin-bottom: 6px;">
                ${chartTitles.d9}
              </div>
              <div id="print-navamsa-chart" style="width: 350px; height: 350px; margin: 0 auto; background: #FFFDF8; border: 1.5px solid #D97706; border-radius: 8px; box-shadow: 0 4px 15px rgba(217,119,6,0.12);"></div>
            </div>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s4}</span>
          </div>

          <table class="patrika-print-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>${T.fields.planet || 'Planet'}</th>
                <th>${T.fields.sign || 'Sign'}</th>
                <th>${T.fields.degree || 'Degree'}</th>
                <th>${T.fields.nakshatra || 'Nakshatra'}</th>
                <th>${T.fields.pada || 'Pada'}</th>
                <th>${T.fields.house || 'House'}</th>
                <th>${T.fields.status || 'Dignity'}</th>
                <th>${T.fields.speed || 'Speed'}</th>
              </tr>
            </thead>
            <tbody>
              ${kundali.planets.map(p => {
                const pNameLocal = LOCALIZED_PLANETS[p.name]?.[langKey] || p.name;
                const rNameLocal = LOCALIZED_RASHIS[p.rashi]?.[langKey] || p.rashiName;
                const nakLocal = LOCALIZED_NAKSHATRAS[p.nakshatraName]?.[langKey] || p.nakshatraName;
                const digKey = getPlanetDignityKey(p.name, p.rashi);
                const digLocal = T.dignities[digKey] || digKey;
                const motionText = p.isRetrograde ? (labels.motionRetro || 'ವಕ್ರ') : (labels.motionDirect || 'ಮಾರ್ಗಿ');
                return `
                  <tr>
                    <td><strong>${p.symbol} ${pNameLocal}</strong> ${p.isRetrograde ? '<span style="color: #DC2626; font-weight: 800;">(R)</span>' : ''}</td>
                    <td>${rNameLocal}</td>
                    <td>${p.degreeFormatted}</td>
                    <td>${nakLocal}</td>
                    <td>${p.pada}</td>
                    <td><strong>${p.house}</strong></td>
                    <td><span style="color: ${digKey === 'Exalted' || digKey === 'Own' || digKey === 'Moolatrikona' ? '#16A34A' : (digKey === 'Debilitated' || digKey === 'Enemy' ? '#DC2626' : '#9A3412')}; font-weight: 700;">${digLocal}</span></td>
                    <td>${motionText}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '2')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 3: DASHA SYSTEM, YOGAS & DOSHAS                     -->
      <!-- ======================================================== -->
      <div class="patrika-page page-3">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${T.sections.s5}</span>
            <span>${personName}</span>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s5}</span>
          </div>

          <div style="margin: 8px 0; padding: 12px; background: rgba(218,165,32,0.08); border-left: 4px solid #DAA520; font-size: 13px; line-height: 1.6;">
            <strong>${T.fields.activeDasha}:</strong> 
            ${currentDasha ? `${LOCALIZED_PLANETS[currentDasha.mahaDasha]?.[langKey] || currentDasha.mahaDasha} ${dashaLabels.mahaDasha} - ${LOCALIZED_PLANETS[currentDasha.antarDasha]?.[langKey] || currentDasha.antarDasha} ${dashaLabels.antarDasha} (${dashaLabels.until} ${currentDasha.antarEnd})` : dashaLabels.activeCycle}
            &bull; <strong>${dashaLabels.startingBalance}</strong> ${LOCALIZED_PLANETS[dashaData.startingDashaLord]?.[langKey] || dashaData.startingDashaLord} (${dashaData.balanceOfDasha} ${dashaLabels.yrs})
          </div>

          <table class="patrika-print-table" style="margin-bottom: 12px; font-size: 12.5px;">
            <thead>
              <tr>
                <th>${dashaLabels.dashaLord}</th>
                <th>${dashaLabels.duration}</th>
                <th>${dashaLabels.startDate}</th>
                <th>${dashaLabels.endDate}</th>
                <th>${dashaLabels.status}</th>
              </tr>
            </thead>
            <tbody>
              ${dashaData.periods.slice(0, 9).map(p => {
                const lordName = LOCALIZED_PLANETS[p.lord]?.[langKey] || p.lord;
                return `
                  <tr style="${p.isActive ? 'background: #FEF3C7; font-weight: 800;' : ''}">
                    <td><strong>${lordName}</strong></td>
                    <td>${p.balanceYears} ${dashaLabels.yrs}</td>
                    <td>${p.startDate}</td>
                    <td>${p.endDate}</td>
                    <td>${p.isActive ? dashaLabels.active : (new Date(p.endDate) < new Date() ? dashaLabels.elapsed : dashaLabels.upcoming)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="patrika-section-title">
            <span>${T.sections.s6}</span>
          </div>
          <div style="margin-bottom: 10px;">
            ${yogas.slice(0, 4).map(y => {
              // Normalized search for Yogas
              const cleanYName = y.name.toLowerCase().replace(/[^a-z]/g, '');
              const matchedKey = Object.keys(YOGAS_LOCALIZED).find(k => {
                const cleanK = k.toLowerCase().replace(/[^a-z]/g, '');
                return cleanK === cleanYName || cleanK.includes(cleanYName) || cleanYName.includes(cleanK);
              });

              const yLoc = (matchedKey && YOGAS_LOCALIZED[matchedKey]?.[langKey]) || {
                name: y.name,
                strength: y.strength,
                desc: y.description,
                remedy: y.remedy
              };
              const enhancementLabel = labels.enhancementLabel || 'ಪರಿಹಾರ / ಶುಭ ಫಲ ವೃದ್ಧಿ:';

              return `
                <div style="margin-bottom: 8px; font-size: 12.5px; padding: 8px 12px; background: #F0FDF4; border-left: 4px solid #16A34A; border-radius: 4px; line-height: 1.5;">
                  <strong style="color: #15803D; font-size: 13px;">${yLoc.name} &bull; ${yLoc.strength}:</strong> 
                  <div style="color: #1E293B; margin-top: 2px;">${yLoc.desc}</div>
                  <div style="font-size: 11.5px; color: #B45309; margin-top: 4px;"><strong>${enhancementLabel}</strong> ${yLoc.remedy}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s7}</span>
          </div>
          <div>
            ${doshas.map(d => {
              let matchedKey = null;
              const lowerDName = d.name.toLowerCase();
              if (lowerDName.includes('kaal sarp') || lowerDName.includes('कालसर्प') || lowerDName.includes('ಕಾಳಸರ್ಪ') || lowerDName.includes('కాలసర్ప')) {
                matchedKey = 'Kaal Sarp Dosha';
              } else if (lowerDName.includes('manglik') || lowerDName.includes('kuja') || lowerDName.includes('मांगलिक') || lowerDName.includes('ಮಂಗಳ') || lowerDName.includes('కుజ')) {
                matchedKey = 'Manglik Dosha (Kuja Dosha)';
              } else if (lowerDName.includes('shani') || lowerDName.includes('sade sati') || lowerDName.includes('शनि') || lowerDName.includes('ಶನಿ') || lowerDName.includes('శని')) {
                matchedKey = 'Shani Influence (Sade Sati / Dhaiya)';
              } else if (lowerDName.includes('pitra') || lowerDName.includes('पितृ') || lowerDName.includes('ಪಿತೃ') || lowerDName.includes('పితృ')) {
                matchedKey = 'Pitra Dosha';
              } else if (lowerDName.includes('guru chandal') || lowerDName.includes('गुरु चांडाल') || lowerDName.includes('ಗುರು ಚಾಂಡಾಲ')) {
                matchedKey = 'Guru Chandal Dosha';
              }

              let dLoc = matchedKey ? DOSHAS_LOCALIZED[matchedKey]?.[langKey] : null;
              if (!dLoc) {
                dLoc = {
                  name: d.name,
                  clearStatus: langKey === 'kn' ? 'ದೋಷ ಮುಕ್ತ (ಇಲ್ಲ)' : (langKey === 'hi' ? 'दोष मुक्त (अनुपस्थित)' : 'Clear / Not Present'),
                  clearImpact: d.impact,
                  activeStatus: langKey === 'kn' ? 'ಸಕ್ರಿಯ ಪ್ರಭಾವ' : (langKey === 'hi' ? 'सक्रिय प्रभाव' : 'Active Intensity'),
                  activeImpact: d.impact,
                  neutralizedStatus: langKey === 'kn' ? 'ದೋಷ ಪರಿಹಾರಗೊಂಡಿದೆ' : (langKey === 'hi' ? 'दोष शमित' : 'Neutralized'),
                  neutralizedImpact: d.impact
                };
              }

              let displayName = dLoc.name;
              if (d.name.includes('Anshik') && langKey === 'kn') {
                displayName = `ಆಂಶಿಕ ${displayName}`;
              } else if (d.name.includes('Poorna') && langKey === 'kn') {
                displayName = `ಪೂರ್ಣ ${displayName}`;
              } else if (d.name.includes('Anshik') && langKey === 'hi') {
                displayName = `आंशिक ${displayName}`;
              } else if (d.name.includes('Poorna') && langKey === 'hi') {
                displayName = `पूर्ण ${displayName}`;
              }

              let statusText = dLoc.clearStatus;
              let impactText = dLoc.clearImpact;
              let badgeColor = '#15803D';
              let bgColor = '#F8FAFC';
              let borderColor = '#16A34A';

              if (d.id === 'shani_influence') {
                if (d.valid === false) {
                  statusText = dLoc.unavailableStatus || 'Assessment Unavailable';
                  impactText = d.details || dLoc.unavailableImpact;
                  badgeColor = '#64748B';
                  bgColor = '#F8FAFC';
                  borderColor = '#94A3B8';
                } else if (d.present) {
                  if (d.cancelled) {
                    statusText = dLoc.neutralizedStatus;
                    impactText = dLoc.neutralizedImpact;
                    badgeColor = '#B45309';
                    bgColor = '#F8FAFC';
                    borderColor = '#F59E0B';
                  } else if (d.isDhaiya) {
                    statusText = dLoc.activeDhaiyaStatus || 'Active Dhaiya (Kantaka / Ashtama Shani)';
                    impactText = d.details || dLoc.activeDhaiyaImpact;
                    badgeColor = '#B91C1C';
                    bgColor = '#FEF2F2';
                    borderColor = '#DC2626';
                  } else {
                    statusText = dLoc.activeStatus;
                    impactText = d.details || dLoc.activeImpact;
                    badgeColor = '#B91C1C';
                    bgColor = '#FEF2F2';
                    borderColor = '#DC2626';
                  }
                } else {
                  statusText = dLoc.clearStatus;
                  impactText = d.details || dLoc.clearImpact;
                  badgeColor = '#15803D';
                  bgColor = '#F8FAFC';
                  borderColor = '#16A34A';
                }
              } else if (d.present) {
                if (d.cancelled) {
                  statusText = dLoc.neutralizedStatus;
                  impactText = dLoc.neutralizedImpact;
                  badgeColor = '#B45309';
                  bgColor = '#F8FAFC';
                  borderColor = '#F59E0B';
                } else {
                  statusText = dLoc.activeStatus;
                  impactText = dLoc.activeImpact;
                  badgeColor = '#B91C1C';
                  bgColor = '#FEF2F2';
                  borderColor = '#DC2626';
                }
              }

              const transitDateLabelMap = {
                en: 'Transit assessment date',
                hi: 'गोचर आकलन तिथि',
                kn: 'ಗೋಚಾರ ಪರಿಶೀಲನಾ ದಿನಾಂಕ',
                mr: 'गोचर मूल्यांकन तारीख',
                te: 'గోచార పరిశీలన తేదీ'
              };
              const transitLabel = transitDateLabelMap[langKey] || 'Transit assessment date';
              const displayDate = d.assessmentDate || userInputs.transitDate || userInputs.assessmentDate || null;
              const transitDateHtml = (d.id === 'shani_influence' && d.valid !== false && displayDate)
                ? `<div style="font-size: 11px; color: #64748B; margin-top: 4px;"><strong>${transitLabel}:</strong> ${escapeHtml(displayDate)}</div>`
                : '';

              const endingDateHtml = (d.endingTimeline && d.present)
                ? `<div style="font-size: 11px; color: #9A3412; margin-top: 3px; font-weight: 600;"><strong>⏳ ${langKey === "hi" ? "समाप्ति / शमन अवधि" : (langKey === "kn" ? "ಮುಕ್ತಾಯ / ಶಮನ ಅವಧಿ" : "Ending / Relief Milestone")}:</strong> ${escapeHtml(d.endingTimeline)}</div>`
                : '';

              return `
                <div style="margin-bottom: 8px; font-size: 12.5px; padding: 8px 12px; background: ${bgColor}; border-left: 4px solid ${borderColor}; border-radius: 4px; line-height: 1.5;">
                  <strong style="color: ${badgeColor}; font-size: 13px;">${displayName}:</strong> 
                  <span style="font-weight: 700; color: ${badgeColor};">${statusText}</span>
                  <div style="font-size: 12px; color: #334155; margin-top: 2px;">${impactText}</div>
                  ${endingDateHtml}
                  ${transitDateHtml}
                </div>
              `;
            }).join('')}
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '3')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 4: GOOD/BAD ATTRIBUTES, CAREER & MARRIAGE TIMING    -->
      <!-- ======================================================== -->
      <div class="patrika-page page-4">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${T.sections.s8}</span>
            <span>${personName}</span>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s8}</span>
          </div>

          <table class="patrika-print-table" style="margin-bottom: 12px; font-size: 12.5px;">
            <thead>
              <tr>
                <th style="width: 25%;">${p4Labels.category}</th>
                <th style="width: 40%; color: #16A34A;">${p4Labels.favorable}</th>
                <th style="width: 35%; color: #DC2626;">${p4Labels.inauspicious}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${T.fields.luckyNum}</strong></td>
                <td><strong style="color: #15803D;">${lifeGuidance.attributes.luckyNumbers.join(', ')}</strong></td>
                <td><span style="color: #DC2626;">${lifeGuidance.attributes.unluckyNumbers.join(', ')}</span> ${p4Labels.caution}</td>
              </tr>
              <tr>
                <td><strong>${T.fields.luckyColor}</strong></td>
                <td><strong style="color: #15803D;">${lifeGuidance.attributes.luckyColors.join(', ')}</strong></td>
                <td><span style="color: #DC2626;">${lifeGuidance.attributes.unluckyColors.join(', ')}</span></td>
              </tr>
              <tr>
                <td><strong>${p4Labels.directions}</strong></td>
                <td>${lifeGuidance.attributes.favorableDirections.join(', ')}</td>
                <td>${lifeGuidance.attributes.unfavorableDirections.join(', ')}</td>
              </tr>
              <tr>
                <td><strong>${T.fields.luckyDay}</strong></td>
                <td>${lifeGuidance.attributes.favorableDays.join(', ')}</td>
                <td>${lifeGuidance.attributes.unfavorableDays.join(', ')}</td>
              </tr>
              <tr>
                <td><strong>${p4Labels.lifeGem}</strong></td>
                <td><strong>${lifeGuidance.attributes.lifeGem}</strong></td>
                <td><span style="color: #DC2626; font-weight: 700;">${lifeGuidance.attributes.avoidGem}</span></td>
              </tr>
              <tr>
                <td><strong>${p4Labels.rudraksha}</strong></td>
                <td colspan="2"><strong>${lifeGuidance.attributes.rudraksha}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="patrika-section-title">
            <span>${T.sections.s9}</span>
          </div>
          <div style="padding: 12px 16px; background: rgba(0,0,0,0.02); border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; margin-bottom: 12px; line-height: 1.6;">
            <div style="margin-bottom: 5px;"><strong>${p4Labels.orientation}</strong> ${careerLoc.orientationBusiness}</div>
            <div style="margin-bottom: 5px;"><strong>${p4Labels.primeFields}</strong> <strong style="color: #9A3412;">${careerLoc.primeFields}</strong></div>
            <div style="margin-bottom: 5px;"><strong>${p4Labels.secondaryDomains}</strong> ${careerLoc.secondaryDomains}</div>
            <div><strong>${p4Labels.professionalStyle}</strong> ${careerLoc.workStyle}</div>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s10}</span>
          </div>
          <div style="padding: 12px 16px; background: rgba(218,165,32,0.06); border: 1.5px solid #DAA520; border-radius: 6px; font-size: 12.5px; line-height: 1.6;">
            <div style="margin-bottom: 5px;"><strong>${p4Labels.nuptialAge}</strong> <strong style="color: #B45309; font-size: 13.5px;">${careerLoc.nuptialAge}</strong></div>
            <div style="margin-bottom: 5px;"><strong>${p4Labels.allianceDirections}</strong> ${careerLoc.directions}</div>
            <div style="margin-bottom: 5px;"><strong>${p4Labels.spouseProfile}</strong> ${careerLoc.spouseProfile}</div>
            <div style="margin-bottom: 5px;"><strong>${p4Labels.harmonyGuidance}</strong> ${careerLoc.matrimonialAdvice}</div>
            <div><strong>${p4Labels.rulingLordSign}</strong> ${LOCALIZED_PLANETS[lifeGuidance.marriage.rulingLord]?.[langKey] || lifeGuidance.marriage.rulingLord} (${getRashiName(lifeGuidance.marriage.houseSign, langKey)})</div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '4')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 5: ADVANCED ASTRO SOLUTIONS & LIFE PREDICTIONS       -->
      <!-- ======================================================== -->
      <div class="patrika-page page-5">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${T.sections.s11}</span>
            <span>${personName}</span>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s11}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 12px;">
            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${labels.healthVitality}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${localizedData.health.constitution} &bull; <strong>${labels.vulnerableLabel || 'ಸೂಕ್ಷ್ಮ ಅಂಗಗಳು:'}</strong> ${localizedData.health.vulnerableOrgans}</div>
              <div style="font-size: 12px; color: #15803D; margin-top: 3px;"><strong>${labels.healthRemedy}</strong> ${localizedData.health.ayurvedicAdvice}</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${labels.financialProsperity}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${localizedData.wealth.dhanaYogas.join(' • ')}</div>
              <div style="font-size: 12px; color: #15803D; margin-top: 3px;"><strong>${labels.assetClassesTiming}</strong> ${localizedData.wealth.primeAssetClasses} (${localizedData.wealth.financialTiming})</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${labels.karmicDebts}</strong>
              <div style="margin-top: 3px; color: #1E293B;">
                ${labels.activeDebts} <strong>${advancedAstro.activeDebtsCount}</strong> &bull; 
                ${advancedAstro.activeDebtsCount > 0 ? advancedAstro.karmicDebts.filter(d => d.detected).map(d => getLocalizedDebtTitle(d.title, langKey)).join(', ') : labels.noMajorDebts}
              </div>
              <div style="font-size: 12px; color: #B45309; margin-top: 3px;">
                ${labels.defaultPitruRemedy}
              </div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${labels.spiritualAlignment}</strong>
              <div style="font-size: 12px; color: #B45309; margin-top: 3px;"><strong>${labels.sacredSadhana}</strong> ${localizedData.spirituality.sadhana}</div>
            </div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '5')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 6: NUMEROLOGY & ADVANCED MOBILE BLUEPRINTS          -->
      <!-- ======================================================== -->
      <div class="patrika-page page-6">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${T.sections.s13}</span>
            <span>${personName}</span>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s13}</span>
          </div>

          <div style="display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
            <div style="flex: 1 1 280px;">
              <div class="patrika-table-grid" style="grid-template-columns: 1fr; gap: 6px; font-size: 12.5px;">
                <div class="p-cell"><span class="p-lbl">${numLabels.mulank}</span><strong class="p-val" style="color: #9A3412; font-size: 14px;">${numerology.mulank.number} (${LOCALIZED_PLANETS[numerology.mulank.planet]?.[langKey] || numerology.mulank.planet})</strong></div>
                <div class="p-cell"><span class="p-lbl">${numLabels.bhagyank}</span><strong class="p-val" style="color: #9A3412; font-size: 14px;">${numerology.bhagyank.number} (${LOCALIZED_PLANETS[numerology.bhagyank.planet]?.[langKey] || numerology.bhagyank.planet})</strong></div>
                <div class="p-cell"><span class="p-lbl">${numLabels.chaldean}</span><strong class="p-val">${numerology.nameNumber.chaldeanSingle} (${numLabels.compound} ${numerology.nameNumber.chaldeanCompound} - ${LOCALIZED_PLANETS[numerology.nameNumber.chaldeanPlanet]?.[langKey] || numerology.nameNumber.chaldeanPlanet})</strong></div>
                <div class="p-cell"><span class="p-lbl">${numLabels.pythagorean}</span><strong class="p-val">${numerology.nameNumber.pythagoreanExpression} (${numLabels.soulUrge} ${numerology.nameNumber.soulUrge})</strong></div>
              </div>
            </div>
            <div style="flex: 1 1 280px; max-width: 320px; margin: 0 auto;">
              <div style="font-weight: 800; font-size: 13px; color: #9A3412; text-align: center; margin-bottom: 6px;">${numLabels.loShuTitle}</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: #FEF3C7; padding: 10px; border-radius: 8px; border: 1.5px solid #D97706;">
                ${renderLoShuCell(4, numerology.loShu.counts[4] || 0)}
                ${renderLoShuCell(9, numerology.loShu.counts[9] || 0)}
                ${renderLoShuCell(2, numerology.loShu.counts[2] || 0)}
                ${renderLoShuCell(3, numerology.loShu.counts[3] || 0)}
                ${renderLoShuCell(5, numerology.loShu.counts[5] || 0)}
                ${renderLoShuCell(7, numerology.loShu.counts[7] || 0)}
                ${renderLoShuCell(8, numerology.loShu.counts[8] || 0)}
                ${renderLoShuCell(1, numerology.loShu.counts[1] || 0)}
                ${renderLoShuCell(6, numerology.loShu.counts[6] || 0)}
              </div>
            </div>
          </div>

          ${hasPhone && mobileDetails ? `
          <div class="patrika-section-title">
            <span>${T.sections.s14}</span>
          </div>

          <div style="padding: 12px 16px; background: ${mobileDetails.isSuitable ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)'}; border: 1.5px solid ${mobileDetails.isSuitable ? '#16A34A' : '#DC2626'}; border-radius: 8px; margin-bottom: 12px; font-size: 12.5px; line-height: 1.6;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
              <div><strong>${labels.testedNumber}</strong> <code style="font-size: 15px; font-weight: 800; color: #0F172A;">${safePhone}</code></div>
              <div style="font-weight: 800; font-size: 12px; padding: 3px 10px; border-radius: 4px; background: ${mobileDetails.isSuitable ? '#DCFCE7' : '#FEE2E2'}; color: ${mobileDetails.isSuitable ? '#15803D' : '#B91C1C'}; border: 1px solid currentColor;">
                ${mobileDetails.isSuitable ? T.mobile.auspicious : T.mobile.inauspicious}
              </div>
            </div>
            <div style="margin-bottom: 4px;"><strong>${labels.sumTotal}</strong> ${mobileDetails.compoundSum} &bull; <strong>${labels.singleRoot}</strong> ${mobileDetails.singleNumber} (${LOCALIZED_PLANETS[mobileDetails.rulingPlanet]?.[langKey] || mobileDetails.rulingPlanet}) &bull; <strong>${labels.status}</strong> ${mobileDetails.isSuitable ? mobLoc.auspiciousStatus : mobLoc.inauspiciousStatus}</div>
            <div style="margin-bottom: 6px; color: ${mobileDetails.isSuitable ? '#15803D' : '#B91C1C'}; font-weight: 600;">
              ${mobileDetails.isSuitable ? mobLoc.adviceSuitable : mobLoc.adviceUnsuitable}
            </div>
          </div>

          ${mobileDetails.suggestions ? `
            <div class="patrika-section-title">
              <span>${T.sections.s15}</span>
            </div>
            <div style="padding: 12px 16px; background: #FFFBEB; border: 1.5px solid #D97706; border-radius: 8px; font-size: 12.5px; line-height: 1.6;">
              <div style="font-weight: 800; color: #9A3412; font-size: 13.5px; margin-bottom: 6px;">
                ${numLabels.newSimTitle}
              </div>
              <div style="margin-bottom: 5px;">
                <strong>${labels.primeRoot}</strong> ${mobileDetails.suggestions.primeSingle} (${LOCALIZED_PLANETS[mobileDetails.suggestions.primeSinglePlanet]?.[langKey] || mobileDetails.suggestions.primeSinglePlanet}) &bull; <strong>${labels.secondaryRoot}</strong> ${mobileDetails.suggestions.secondarySingle} (${LOCALIZED_PLANETS[mobileDetails.suggestions.secondarySinglePlanet]?.[langKey] || mobileDetails.suggestions.secondarySinglePlanet}) &bull; <strong>${labels.royalCompounds}</strong> ${mobileDetails.suggestions.recommendedCompounds.map(c => c.compound).join(', ')}
              </div>
              <div style="margin-bottom: 6px;">
                <strong>${labels.blueprintNumbers}</strong>
                <ul style="padding-left: 20px; margin-top: 3px; font-family: monospace; font-size: 13px; font-weight: 700; color: #0F172A;">
                  ${mobileDetails.suggestions.sampleTemplates.map(t => `<li>${t.pattern} (${t.category})</li>`).join('')}
                </ul>
              </div>
              <div style="font-size: 11.5px; color: #78350F;">
                <strong>${labels.goldenChecklist}</strong> ${mobLoc.checklist.join(' • ')}
              </div>
            </div>
          ` : ''}
` : `
          <div class="patrika-section-title">
            <span>${T.sections.s14}</span>
          </div>
          <div style="padding: 16px 20px; background: #F8FAFC; border: 1.5px dashed #94A3B8; border-radius: 8px; margin-bottom: 12px; font-size: 12.5px; line-height: 1.7; color: #334155;">
            <div style="font-weight: 800; color: #475569; font-size: 13.5px; margin-bottom: 6px;">
              ${{
                kn: '📱 ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿಲ್ಲ (ಐಚ್ಛಿಕ ಸೇವೆ)',
                hi: '📱 मोबाइल नंबर दर्ज नहीं किया गया (ऐच्छिक सेवा)',
                mr: '📱 मोबाईल क्रमांक नोंदवला नाही (ऐच्छिक सेवा)',
                te: '📱 మొబైల్ నంబర్ నమోదు చేయలేదు (ఐచ్ఛిక సేవ)',
                en: '📱 Mobile Number Not Provided (Optional Service)'
              }[langKey]}
            </div>
            <div>
              ${{
                kn: 'ಜಾತಕ ರಚನೆಯ ಸಮಯದಲ್ಲಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿಲ್ಲವಾದ್ದರಿಂದ ಮೊಬೈಲ್ ಸಂಖ್ಯಾಶಾಸ್ತ್ರ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಅನ್ವಯಿಸಲಾಗಿಲ್ಲ. ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯ ಸಂಖ್ಯಾಬಲ, ಮೂಲಾಂಕ-ಭಾಗ್ಯಾಂಕ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಅದೃಷ್ಟಶಾಲಿ ಹೊಸ ಸಿಮ್ ಸಂಖ್ಯೆಯ ಶಿಫಾರಸು ಪಡೆಯಲು, ಮುಖಪುಟದ ಫಾರ್ಮ್‌ನಲ್ಲಿ ನಿಮ್ಮ ೧೦ ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ದಾಖಲಿಸಿ ಕುಂಡಲಿ ಮರು-ರಚಿಸಿ.',
                hi: 'कुंडली निर्माण के समय मोबाइल नंबर उपलब्ध नहीं कराया गया, अतः यह विश्लेषण लागू नहीं हुआ। यदि आप अपने मोबाइल नंबर का अंक ज्योतिष परीक्षण एवं भाग्यशाली सिम अनुशंसा चाहते हैं, तो कृपया फॉर्म में अपना नंबर दर्ज कर पुनः पत्रिका डाउनलोड करें।',
                mr: 'पत्रिका तयार करताना मोबाईल क्रमांक नोंदवला नाही. मोबाईल अंकशास्त्र विश्लेषण व भाग्यशाली नवीन सिम शिफारस मिळवण्यासाठी फॉर्ममध्ये आपला १० अंकी मोबाईल नंबर टाकून पुन्हा पत्रिका तयार करा.',
                te: 'కుండలి తయారీ సమయంలో మొబైల్ నంబరు నమోదు చేయలేదు. మీ మొబైల్ సంఖ్యాశాస్త్ర విశ్లేషణ మరియు శుభప్రదమైన కొత్త సిమ్ సంఖ్యల సూచనల కోసం దయచేసి ఫారంలో మీ మొబైల్ నంబరు నమోదు చేసి మళ్లీ పత్రికను రూపొందించండి.',
                en: 'No mobile number was entered during chart creation. To receive complete mobile numerology resonance analysis and golden SIM recommendations, enter your 10-digit mobile number in the form and regenerate your Patrika.'
              }[langKey]}
            </div>
          </div>
`}

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '6')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 7: COMPREHENSIVE PREDICTIONS & QUARTERLY FORECAST   -->
      <!-- ======================================================== -->
      <div class="patrika-page page-7">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${T.sections.s16}</span>
            <span>${personName}</span>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s16}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 12px;">
            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${labels.physicalLongevity}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${localizedData.health.constitution} &bull; ${localizedData.health.longevityFactor}</div>
              <div style="font-size: 12px; color: #15803D; margin-top: 3px;"><strong>${labels.dailyRegimen}</strong> ${localizedData.health.ayurvedicAdvice}</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${labels.wealthCapital}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${localizedData.wealth.dhanaYogas.join(' • ')}</div>
              <div style="font-size: 12px; color: #15803D; margin-top: 3px;"><strong>${labels.wealthAnchor}</strong> ${localizedData.wealth.primeAssetClasses}</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${labels.careerAscent}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${localizedData.career.style}</div>
              <div style="font-size: 12px; color: #B45309; margin-top: 3px;"><strong>${labels.goldenTrait}</strong> ${localizedData.career.leadershipTrait}</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${labels.domesticBliss}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${localizedData.marriage.ageWindow} &bull; ${localizedData.marriage.spouseNature}</div>
            </div>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s17}</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div style="padding: 10px 12px; background: #FFFDF8; border: 1px solid #D97706; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${qLabels[0]} (${localizedData.quarterlyForecast.year})</strong>
              <div style="color: #1E293B; margin-top: 3px;">${localizedData.quarterlyForecast.q1}</div>
            </div>
            <div style="padding: 10px 12px; background: #FFFDF8; border: 1px solid #D97706; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${qLabels[1]} (${localizedData.quarterlyForecast.year})</strong>
              <div style="color: #1E293B; margin-top: 3px;">${localizedData.quarterlyForecast.q2}</div>
            </div>
            <div style="padding: 10px 12px; background: #FFFDF8; border: 1px solid #D97706; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${qLabels[2]} (${localizedData.quarterlyForecast.year})</strong>
              <div style="color: #1E293B; margin-top: 3px;">${localizedData.quarterlyForecast.q3}</div>
            </div>
            <div style="padding: 10px 12px; background: #FFFDF8; border: 1px solid #D97706; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${qLabels[3]} (${localizedData.quarterlyForecast.year})</strong>
              <div style="color: #1E293B; margin-top: 3px;">${localizedData.quarterlyForecast.q4}</div>
            </div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '7')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 8: MASTER REMEDIAL BLUEPRINT                        -->
      <!-- ======================================================== -->
      <div class="patrika-page page-8">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${T.sections.s18}</span>
            <span>${personName}</span>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s18}</span>
          </div>

          <!-- 1. Mantra Japa -->
          <div style="padding: 12px 14px; background: rgba(218,165,32,0.06); border: 1.5px solid #DAA520; border-radius: 8px; margin-bottom: 10px; font-size: 12.5px; line-height: 1.6;">
            <div style="font-weight: 800; font-size: 13.5px; color: #9A3412; margin-bottom: 4px;">
              ${labels.primaryMantraTitle}
            </div>
            <div style="font-size: 14.5px; font-weight: 800; color: #B45309; margin-bottom: 4px;">
              ${labels.lagnaBeeja} ${lagnaBeej} (${LOCALIZED_PLANETS[deepRemedies.mantras.lagna.planet.split(' ')[0]]?.[langKey] || deepRemedies.mantras.lagna.planet})
            </div>
            <div style="font-size: 12.5px; color: #1E293B;">
              <strong>${labels.bhagyaBeeja}</strong> ${bhagyaBeej} &bull; 
              <strong>${labels.mahamrityunjaya}</strong> ${deepRemedies.mantras.mahamrityunjaya.verse}
            </div>
          </div>

          <!-- 2. Gemstone 5-step Protocol -->
          <div style="padding: 12px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; margin-bottom: 10px; font-size: 12.5px; line-height: 1.6;">
            <div style="font-weight: 800; font-size: 13.5px; color: #9A3412; margin-bottom: 4px;">
              ${labels.gemstoneProtocol}
            </div>
            <div><strong>${labels.recommendedGem}</strong> <strong style="color: #15803D; font-size: 13.5px;">${gemProtocol.primeGem}</strong> (${gemProtocol.metal}, ${gemProtocol.finger}, ${gemProtocol.wearingDay})</div>
            <div style="font-size: 12px; color: #334155; margin-top: 3px;"><strong>${labels.consecrationSteps}</strong> ${gemProtocol.consecrationSteps ? gemProtocol.consecrationSteps.join(' • ') : localizedData.remedies.consecrationSteps.join(' • ')}</div>
            <div style="margin-top: 5px; padding: 6px 10px; background: #FEE2E2; border-left: 4px solid #DC2626; border-radius: 4px; font-size: 12px; color: #991B1B; font-weight: 700;">
              ${labels.forbiddenGemsTitle} ${gemProtocol.forbiddenGems}
            </div>
          </div>

          <!-- 3. Rudraksha & Yantra -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="padding: 10px 12px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${labels.consecratedRudraksha}</strong>
              <div style="color: #0F172A; font-weight: 700; margin-top: 2px;">${rudrakshaLoc.mukhi}</div>
              <div style="color: #475569; margin-top: 2px;">${rudrakshaLoc.thread} &bull; ${rudrakshaLoc.wearingDay}</div>
            </div>
            <div style="padding: 10px 12px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${labels.shaniShield}</strong>
              <div style="color: #0F172A; font-weight: 700; margin-top: 2px;">${yantraLoc.name} (${yantraLoc.direction})</div>
              <div style="color: #475569; margin-top: 2px;">${yantraLoc.metal} &bull; ${localizedData.remedies.shaniDeepam}</div>
            </div>
          </div>

          <!-- 4. Gau Seva & Charity -->
          <div style="padding: 10px 14px; background: #FFFBEB; border: 1.5px solid #D97706; border-radius: 6px; font-size: 12.5px; line-height: 1.6;">
            <strong style="color: #9A3412; font-size: 13px;">${labels.daanGauSeva}</strong>
            <div>${localizedData.remedies.daanSeva.join(' • ')}</div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '8')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 9: MASTER SUMMARY & ASTROLOGICAL VERDICT           -->
      <!-- ======================================================== -->
      <div class="patrika-page page-9">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${T.sections.s19}</span>
            <span>${personName}</span>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s19}</span>
          </div>

          <div style="padding: 12px 16px; background: rgba(218,165,32,0.06); border: 2px solid #DAA520; border-radius: 8px; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">
            <div style="font-weight: 800; font-size: 14.5px; color: #9A3412; margin-bottom: 5px;">
              ${labels.executiveSummary.replace('{name}', personName)}
            </div>
            <div style="color: #1E293B;">
              ${labels.executiveDesc
                .replace('{lagna}', localizedLagnaRashi)
                .replace('{moon}', localizedMoonRashi)
                .replace('{nakshatra}', LOCALIZED_NAKSHATRAS[moon.nakshatraName]?.[langKey] || moon.nakshatraName)
                .replace('{dasha}', currentDasha ? (LOCALIZED_PLANETS[currentDasha.mahaDasha]?.[langKey] || currentDasha.mahaDasha) + ' / ' + (LOCALIZED_PLANETS[currentDasha.antarDasha]?.[langKey] || currentDasha.antarDasha) : 'Vimshottari Cycle')
              }
            </div>
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s20}</span>
          </div>

          <table class="patrika-print-table" style="margin-bottom: 12px; font-size: 12.5px;">
            <thead>
              <tr>
                <th style="width: 30%;">${labels.masterParameter}</th>
                <th style="width: 70%;">${labels.auspiciousPrescription}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${T.fields.luckyColor}</strong></td>
                <td><strong style="color: #15803D;">${lifeGuidance.attributes.luckyColors.join(', ')}</strong></td>
              </tr>
              <tr>
                <td><strong>${T.fields.luckyNum}</strong></td>
                <td><strong style="color: #15803D;">${lifeGuidance.attributes.luckyNumbers.join(', ')}</strong></td>
              </tr>
              <tr>
                <td><strong>${T.fields.luckyDay}</strong></td>
                <td>${lifeGuidance.attributes.favorableDays.join(', ')}</td>
              </tr>
              <tr>
                <td><strong>${T.fields.ishtaDevata}</strong></td>
                <td><strong>${lifeGuidance.attributes.ishtaDevata}</strong> (${lifeGuidance.attributes.mantra})</td>
              </tr>
              <tr>
                <td><strong>${T.fields.bestCareers}</strong></td>
                <td><strong>${careerLoc.primeFields}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="patrika-section-title">
            <span>${T.sections.s21}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px;">
            ${T.dailyRules.map((rule, idx) => `
              <div style="padding: 8px 12px; background: #F8FAFC; border-left: 4px solid #DAA520; border-radius: 4px; font-size: 12.5px; line-height: 1.5;">
                <strong style="color: #9A3412;">${idx + 1}. ${rule.title}:</strong> 
                <span style="color: #1E293B;">${rule.desc}</span>
              </div>
            `).join('')}
          </div>

          <div class="patrika-section-title">
            <span>${T.sections.s22}</span>
          </div>

          <div style="padding: 14px 18px; background: linear-gradient(135deg, rgba(218,165,32,0.12), rgba(218,165,32,0.03)); border: 2px solid #DAA520; border-radius: 8px; text-align: center;">
            <div style="font-size: 26px; color: #DAA520; line-height: 1; margin-bottom: 4px;">${T.meta.om}</div>
            <div style="font-weight: 800; font-size: 15px; color: #9A3412; margin-bottom: 6px;">
              ${T.verdict.heading}
            </div>
            <div style="font-size: 13px; color: #1E293B; line-height: 1.6; max-width: 680px; margin: 0 auto;">
              ${T.verdict.text}
            </div>
            <div style="font-size: 11px; color: #B45309; margin-top: 8px; font-weight: 700;">
              ॥ शुभं भवतु ॥ ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು ॥ సర్వేజనాః సుఖినోభవంతు ॥
            </div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${T.meta.pageOf.replace('{p}', '9')} &bull; ${PATRIKA_LANGUAGES[langKey]?.label || ''}</span>
            <span>${T.meta.helpline}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
