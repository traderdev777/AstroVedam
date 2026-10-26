/**
 * AstroVeda - AstroGuru Dedicated Interactive Consultation Page
 * Advanced Conversational Vedic Astrologer analyzing seeker's birth chart.
 */

import { store } from '../utils/store.js';
import { getAstroGuruResponse, prepareChartContext } from '../engines/astroguru/advisor.js';
import { INDIAN_PLACES, renderIndianPlacesDatalist, findIndianPlace } from '../utils/indianPlaces.js';
import { LOCALIZED_RASHIS, LOCALIZED_PLANETS } from '../i18n/patrikaTranslations.js';
import { LOCALIZED_NAKSHATRAS } from '../i18n/predictionTranslations.js';

let activeLang = 'kn'; // Default to Kannada as requested
let chatHistory = [];
let speechRecognizer = null;
let isRecognizing = false;

// Sample Seekers for quick test
const SAMPLE_SEEKERS = [
  {
    name: 'Mahalaxmi Hajeri',
    date: '1999-03-28',
    time: '11:25',
    city: 'Vijayapura (Bijapur), Karnataka',
    latitude: 16.8302,
    longitude: 75.7100,
    timezone: 5.5,
    ayanamsa: 'LAHIRI'
  },
  {
    name: 'Aarav Sharma',
    date: '1995-10-24',
    time: '10:30',
    city: 'Varanasi (Kashi / Banaras), UP',
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: 5.5,
    ayanamsa: 'LAHIRI'
  }
];

// Quick suggestion chips localized
const CHIPS_LOCALIZED = {
  kn: [
    { label: '💼 ಉದ್ಯೋಗ & ವೃತ್ತಿ ಪ್ರಗತಿ', q: 'ನನ್ನ ಉದ್ಯೋಗದಲ್ಲಿ ಪ್ರಮೋಷನ್ ಮತ್ತು ವೃತ್ತಿ ಪ್ರಗತಿ ಯಾವಾಗ ಸಾಧ್ಯ?' },
    { label: '💍 ವಿವಾಹ ಯೋಗ & ಸಂಗಾತಿ', q: 'ನನ್ನ ವಿವಾಹ ಯೋಗ ಯಾವಾಗ ಮತ್ತು ಜೀವನ ಸಂಗಾತಿಯ ಸ್ವಭಾವ ಹೇಗಿರುತ್ತದೆ?' },
    { label: '💰 ಧನ ಲಾಭ & ಆಸ್ತಿ ಯೋಗ', q: 'ನನ್ನ ಜಾತಕದಲ್ಲಿ ಧನ ಲಾಭ, ಆಸ್ತಿ ಯೋಗ ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿರತೆ ಹೇಗಿದೆ?' },
    { label: '🩺 ಆರೋಗ್ಯ & ದೀರ್ಘಾಯುಷ್ಯ', q: 'ನನ್ನ ಆರೋಗ್ಯ, ಆಯಸ್ಸು ಮತ್ತು ಮಾನಸಿಕ ನೆಮ್ಮದಿಗೆ ಯಾವ ಪರಿಹಾರಗಳಿವೆ?' },
    { label: '🪐 ದಶಾ & ಶನಿ ಪ್ರಭಾವ', q: 'ಪ್ರಸ್ತುತ ಮಹಾದಶಾ ಮತ್ತು ಶನಿ ಸಾಡೇ ಸಾತಿ ಪ್ರಭಾವ ನನ್ನ ಮೇಲಿದೆಯೇ?' },
    { label: '💎 ಸೂಕ್ತ ರತ್ನ & ರುದ್ರಾಕ್ಷಿ', q: 'ನನ್ನ ಜಾತಕಕ್ಕೆ ಧರಿಸಬಹುದಾದ ಶುಭ ರತ್ನ ಮತ್ತು ರುದ್ರಾಕ್ಷಿ ಯಾವುದು?' },
    { label: '🕉️ ಇಷ್ಟದೇವತೆ & ನಿತ್ಯ ಮಂತ್ರ', q: 'ನನ್ನ ಇಷ್ಟದೇವತೆ ಯಾರು ಮತ್ತು ನಾನು ನಿತ್ಯ ಜಪಿಸಬೇಕಾದ ಮಂತ್ರ ಯಾವುದು?' },
    { label: '✈️ ವಿದೇಶ ಯಾನ & ದೂರ ಪ್ರಯಾಣ', q: 'ನನ್ನ ಜಾತಕದಲ್ಲಿ ವಿದೇಶ ಪ್ರಯಾಣ ಅಥವಾ ವಿದೇಶದಲ್ಲಿ ಉದ್ಯೋಗ ಯೋಗವಿದೆಯೇ?' },
    { label: '🔮 ಸಮಗ್ರ ಭವಿಷ್ಯ ಸಾರಾಂಶ', q: 'ನನ್ನ ಜಾತಕದ ಸಮಗ್ರ ಭವಿಷ್ಯ ಮತ್ತು ಪ್ರಮುಖ ರಾಜಯೋಗಗಳ ವಿವರ ನೀಡಿ.' }
  ],
  hi: [
    { label: '💼 नौकरी एवं व्यवसाय', q: 'मेरी नौकरी में पदोन्नति एवं व्यापार में वृद्धि कब होगी?' },
    { label: '💍 विवाह एवं जीवनसाथी', q: 'मेरा विवाह कब होगा और जीवनसाथी का स्वभाव कैसा रहेगा?' },
    { label: '💰 धन लाभ एवं संपत्ति', q: 'मेरी आर्थिक स्थिति, धन लाभ और अचल संपत्ति के योग कैसे हैं?' },
    { label: '🩺 स्वास्थ्य एवं दीर्घायु', q: 'मेरे स्वास्थ्य और दीर्घायु हेतु कौन से वैदिक उपाय करने चाहिए?' },
    { label: '🪐 महादशा एवं साढ़ेसाती', q: 'वर्तमान महादशा और शनि की साढ़ेसाती का प्रभाव कैसा है?' },
    { label: '💎 शुभ रत्न एवं रुद्राक्ष', q: 'मेरी कुण्डली के अनुसार कौन सा रत्न और रुद्राक्ष धारण करना चाहिए?' },
    { label: '🕉️ इष्टदेव एवं मंत्र', q: 'मेरे इष्टदेव कौन हैं और मुझे किस बीज मंत्र का जप करना चाहिए?' },
    { label: '✈️ विदेश यात्रा योग', q: 'क्या मेरी कुण्डली में विदेश यात्रा अथवा विदेश में रोजगार का योग है?' },
    { label: '🔮 समग्र भविष्यफल', q: 'मेरी कुण्डली का संपूर्ण भविष्यफल और मुख्य राजयोग बताइए।' }
  ],
  en: [
    { label: '💼 Career & Promotion', q: 'When will I get a promotion and career growth according to my chart?' },
    { label: '💍 Marriage & Spouse', q: 'When will I get married and what will my future spouse be like?' },
    { label: '💰 Wealth & Property', q: 'What are the wealth yogas and financial stability indications in my chart?' },
    { label: '🩺 Health & Longevity', q: 'What does my chart indicate about my health, vitality and longevity?' },
    { label: '🪐 Current Dasha & Shani', q: 'How is my current Mahadasha and is there any Saturn Sade Sati influence?' },
    { label: '💎 Prescribed Gemstone', q: 'Which auspicious gemstone and rudraksha should I wear?' },
    { label: '🕉️ Ishta Devata & Mantra', q: 'Who is my Ishta Devata and which sacred mantra should I chant daily?' },
    { label: '✈️ Foreign Relocation', q: 'Does my chart show prospects for foreign travel or overseas career?' },
    { label: '🔮 Complete Future Outlook', q: 'Please provide a comprehensive future roadmap based on my birth chart.' }
  ],
  mr: [
    { label: '💼 नोकरी व व्यवसाय', q: 'माझ्या करिअरमध्ये प्रगती व नोकरीत पदोन्नती कधी होईल?' },
    { label: '💍 विवाह व जोडीदार', q: 'माझे लग्न कधी होईल आणि भावी जोडीदार कसा असेल?' },
    { label: '💰 धनसंपत्ती व आर्थिक लाभ', q: 'माझ्या कुंडलीत धनयोग व आर्थिक स्थैर्य कसे आहे?' },
    { label: '🪐 महादशा व शनी प्रभाव', q: 'माझ्यावर चालू महादशा व शनीची साडेसातीचा काय प्रभाव आहे?' },
    { label: '💎 शुभ रत्न व रुद्राक्ष', q: 'माझ्या राशीनुसार कोणते रत्न व रुद्राक्ष घालावे?' },
    { label: '🔮 संपूर्ण भविष्य', q: 'माझ्या कुंडलीचे संपूर्ण भविष्य विश्लेषण सांगा.' }
  ],
  te: [
    { label: '💼 ఉద్యోగం & వృత్తి', q: 'నా ఉద్యోగంలో పదోన్నతి మరియు వృత్తి పురోగతి ఎప్పుడు కలుగుతుంది?' },
    { label: '💍 వివాహం & జీవిత భాగస్వామి', q: 'నా వివాహం ఎప్పుడు అవుతుంది మరియు జీవిత భాగస్వామి ఎలా ఉంటారు?' },
    { label: '💰 ధన లాభం & సంపద', q: 'నా జాతకంలో ధన యోగాలు మరియు ఆర్థిక స్థిరత్వం ఎలా ఉన్నాయి?' },
    { label: '🪐 దశ & శని ప్రభావం', q: 'నా ప్రస్తుత మహర్దశ మరియు శని ప్రభావం ఎలా ఉంది?' },
    { label: '💎 అదృష్ట రత్నం & రుద్రాక్ష', q: 'నా కుండలికి అనుకూలమైన రత్నం మరియు రుద్రాక్ష ఏది?' },
    { label: '🔮 సమగ్ర భవిష్యత్తు', q: 'నా జాతక సమగ్ర భవిష్యత్తు మరియు రాజయోగాలను వివరించండి.' }
  ]
};

// UI Translations
const UI_TEXT = {
  kn: {
    title: 'ಆಸ್ಟ್ರೋಗುರು — ದೈವಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷಿ & ಮಾರ್ಗದರ್ಶಿ',
    subtitle: 'ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿಯನ್ನು ಸೂಕ್ಷ್ಮವಾಗಿ ಪರಿಶೀಲಿಸಿ ಸಮಸ್ಯೆಗಳಿಗೆ ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ ನೀಡುವ ಜ್ಞಾನಮಿತ್ರ',
    online: 'ಸಕ್ರಿಯ • ಗ್ರಹ ಸ್ಥಿತಿ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ ನಿರತ',
    editChart: 'ಕುಂಡಲಿ ಬದಲಾಯಿಸಿ / ಸಂಪಾದಿಸಿ',
    inputPlaceholder: 'ಆಸ್ಟ್ರೋಗುರು ಬಳಿ ನಿಮ್ಮ ವೃತ್ತಿ, ವಿವಾಹ, ಆರ್ಥಿಕ ಅಥವಾ ಭವಿಷ್ಯದ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...',
    send: 'ಕೇಳಿ',
    clear: 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ',
    copy: 'ನಕಲಿಸಿ',
    copied: 'ನಕಲಿಸಲಾಗಿದೆ!',
    download: 'ಪರಿಹಾರ ಮುದ್ರಿಸಿ',
    voice: 'ಧ್ವನಿ ಮೂಲಕ ಮಾತನಾಡಿ',
    activeSeeker: 'ಪ್ರಸ್ತುತ ಜಾತಕರು:',
    welcomeGreeting: 'ನಮಸ್ಕಾರ {name}! ನಾನು ನಿಮ್ಮ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶಕ ಆಸ್ಟ್ರೋಗುರು. ನಿಮ್ಮ ಜನ್ಮ ಲಗ್ನ {lagna}, ರಾಶಿ {moon} ಮತ್ತು ನಕ್ಷತ್ರ {nakshatra}ವನ್ನು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ. ನಿಮ್ಮ ಭವಿಷ್ಯ, ಉದ್ಯೋಗ, ವಿವಾಹ, ಆರ್ಥಿಕತೆ, ಆರೋಗ್ಯ ಅಥವಾ ಗ್ರಹ ದೋಷಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿದ್ದರೂ ನಿಸ್ಸಂಕೋಚವಾಗಿ ಕೇಳಿ. ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರಗಳೊಂದಿಗೆ ನಿಮಗೆ ದಾರಿದೀಪವಾಗುತ್ತೇನೆ.',
    changeModalTitle: 'ಜಾತಕರ ಜನ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ / ಆಯ್ಕೆ ಮಾಡಿ',
    saveBtn: 'ಕುಂಡಲಿ ಅನ್ವಯಿಸಿ & ಚಾಟ್ ಮುಂದುವರಿಸಿ',
    sampleQuickPick: 'ಸಿದ್ಧ ಜಾತಕಗಳನ್ನು ಆರಿಸಿ:'
  },
  hi: {
    title: 'एस्ट्रोगुरु — दिव्य वैदिक ज्योतिषी एवं जीवन मार्गदर्शक',
    subtitle: 'आपकी जन्म कुण्डली का गहन विश्लेषण कर समस्याओं का अचूक वैदिक समाधान देने वाले मार्गदर्शक',
    online: 'ऑनलाइन • कुण्डली विश्लेषण सक्रिय',
    editChart: 'कुण्डली बदलें / संपादित करें',
    inputPlaceholder: 'एस्ट्रोगुरु से अपनी नौकरी, विवाह, धन, स्वास्थ्य या भविष्य संबंधी प्रश्न पूछें...',
    send: 'पूछें',
    clear: 'चैट साफ़ करें',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    download: 'सलाह प्रिंट करें',
    voice: 'बोलकर पूछें',
    activeSeeker: 'सक्रिय जातक:',
    welcomeGreeting: 'नमस्कार {name}! मैं आपका वैदिक ज्योतिषी एस्ट्रोगुरु हूँ। मैंने आपकी कुण्डली में लग्न {lagna}, राशि {moon} तथा नक्षत्र {nakshatra} का अध्ययन किया है। अपने भविष्य, आजीविका, विवाह, आर्थिक स्थिति या ग्रह दोषों से जुड़ा कोई भी प्रश्न पूछें। मैं शास्त्रसम्मत समाधान प्रस्तुत करूँगा।',
    changeModalTitle: 'जातक के जन्म विवरण दर्ज करें अथवा चुनें',
    saveBtn: 'कुण्डली लागू करें एवं चर्चा करें',
    sampleQuickPick: 'नमूना कुण्डली चुनें:'
  },
  en: {
    title: 'AstroGuru — AI Vedic Astrologer & Life Guide',
    subtitle: 'Deeply analyzing your natal birth chart to provide precise answers & authentic Sanatan remedies.',
    online: 'Online • Real-Time Chart Analysis Active',
    editChart: 'Edit / Switch Birth Chart',
    inputPlaceholder: 'Ask AstroGuru about your career, marriage, finances, health, dasha or future...',
    send: 'Ask Guru',
    clear: 'Clear Chat',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Print Advice',
    voice: 'Voice Input',
    activeSeeker: 'Active Seeker:',
    welcomeGreeting: 'Namaste {name}! I am your Vedic Astrological Guide, AstroGuru. I have inspected your natal chart with Ascendant in {lagna}, Moon in {moon}, and Nakshatra in {nakshatra}. Discuss any aspect of your future, career, marriage, finances, health, or planetary remedies freely.',
    changeModalTitle: 'Update / Select Seeker Birth Details',
    saveBtn: 'Apply Chart & Start Consultation',
    sampleQuickPick: 'Quick Pick Sample Seeker:'
  },
  mr: {
    title: 'ॲस्ट्रोगुरू — वैदिक ज्योतिषी व जीवन मार्गदर्शक',
    subtitle: 'आपल्या जन्मपत्रिकेचे विश्लेषण करून अचूक वैदिक उपाय व मार्गदर्शन देणारे मार्गदर्शक',
    online: 'सक्रिय • पत्रिका विश्लेषण सुरू',
    editChart: 'पत्रिका बदला',
    inputPlaceholder: 'ॲस्ट्रोगुरूंना आपले भविष्य, नोकरी, लग्न किंवा समस्यांविषयी विचारा...',
    send: 'विचारा',
    clear: 'चॅट साफ करा',
    copy: 'कॉपी करा',
    copied: 'कॉपी झाले!',
    download: 'प्रिंट करा',
    voice: 'बोला',
    activeSeeker: 'जातक:',
    welcomeGreeting: 'नमस्कार {name}! मी आपला वैदिक मार्गदर्शक ॲस्ट्रोगुरू आहे. आपल्या पत्रिकेत लग्न {lagna}, रास {moon} व नक्षत्र {nakshatra} आहे. आपल्या जीवनातील कोणत्याही समस्येवर मार्गदर्शन मिळवण्यासाठी प्रश्न विचारा.',
    changeModalTitle: 'जन्म तपशील बदला',
    saveBtn: 'पत्रिका लागू करा',
    sampleQuickPick: 'तयार पत्रिका निवडा:'
  },
  te: {
    title: 'ఆస్ట్రోగురు — దైవిక వేద జ్యోతిష నిపుణుడు',
    subtitle: 'మీ జన్మ కుండలిని క్షుణ్ణంగా పరిశీలించి సమస్యలకు సరైన శాస్త్రోక్త పరిష్కారాలు అందించే మార్గదర్శి',
    online: 'ఆన్‌లైన్ • జాతక విశ్లేషణ సిద్ధంగా ఉంది',
    editChart: 'కుండలి మార్చండి',
    inputPlaceholder: 'ఆస్ట్రోగురుని మీ ఉద్యోగం, వివాహం, ఆర్థిక లేదా భవిష్యత్తు గురించి అడగండి...',
    send: 'అడగండి',
    clear: 'చాట్ క్లియర్',
    copy: 'కాపీ',
    copied: 'కాపీ అయింది!',
    download: 'ప్రింట్',
    voice: 'వాయిస్',
    activeSeeker: 'జాతకుడు:',
    welcomeGreeting: 'నమస్కారం {name}! నేను మీ వేద జ్యోతిష మార్గదర్శి ఆస్ట్రోగురుని. మీ జన్మ లగ్నం {lagna}, చంద్ర రాశి {moon}, నక్షత్రం {nakshatra} ను పరిశీలించాను. మీ భవిష్యత్తు మరియు సమస్యలకు సంబంధించి ఏ సందేహమైనా అడగండి.',
    changeModalTitle: 'జన్మ వివరాలు మార్చండి',
    saveBtn: 'కుండలి వర్తింపజేయండి',
    sampleQuickPick: 'నమూనా జాతకాన్ని ఎంచుకోండి:'
  }
};

/**
 * Render AstroGuru Dedicated Consultation Page
 */
export function renderAstroGuruPage(container) {
  let savedBirth = store.getSavedBirthDetails();
  
  // Ensure default seeker has a solid profile
  if (!savedBirth.name || savedBirth.name === 'AstroVeda Seeker') {
    savedBirth = { ...SAMPLE_SEEKERS[0] };
    store.saveBirthDetails(savedBirth);
  }

  // Pre-calculate context
  let chartCtx = prepareChartContext(store.currentKundali, savedBirth);

  const T = UI_TEXT[activeLang] || UI_TEXT.kn;
  const chips = CHIPS_LOCALIZED[activeLang] || CHIPS_LOCALIZED.kn;

  const lagnaLocal = LOCALIZED_RASHIS[chartCtx.lagna.rashi]?.[activeLang] || chartCtx.lagna.rashiName;
  const moonLocal = LOCALIZED_RASHIS[chartCtx.moon.rashi]?.[activeLang] || chartCtx.moon.rashiName;
  const nakshatraLocal = LOCALIZED_NAKSHATRAS[chartCtx.moon.nakshatraName]?.[activeLang] || chartCtx.moon.nakshatraName;
  const dashaLocal = `${LOCALIZED_PLANETS[chartCtx.currentDasha?.mahaDasha]?.[activeLang] || chartCtx.currentDasha?.mahaDasha || 'Guru'} / ${LOCALIZED_PLANETS[chartCtx.currentDasha?.antarDasha]?.[activeLang] || chartCtx.currentDasha?.antarDasha || 'Shani'}`;

  // Initialize chat history with welcome message if empty
  if (chatHistory.length === 0) {
    const welcomeMsg = T.welcomeGreeting
      .replace('{name}', savedBirth.name)
      .replace('{lagna}', lagnaLocal)
      .replace('{moon}', moonLocal)
      .replace('{nakshatra}', nakshatraLocal);

    chatHistory.push({
      sender: 'guru',
      text: welcomeMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isWelcome: true
    });
  }

  container.innerHTML = `
    <div class="astroguru-page-wrapper">
      <!-- AstroGuru Header Card -->
      <div class="guru-hero-card">
        <div class="guru-header-main">
          <div class="guru-avatar-container">
            <div class="guru-avatar-halo"></div>
            <div class="guru-avatar-icon">🧙‍♂️</div>
            <span class="guru-live-dot" title="Online"></span>
          </div>

          <div class="guru-title-block">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <h2 class="guru-heading">${T.title}</h2>
              <span class="guru-status-pill">${T.online}</span>
            </div>
            <p class="guru-tagline">${T.subtitle}</p>

            <!-- Seeker Quick Summary Strip -->
            <div class="guru-seeker-strip">
              <span class="seeker-label">👤 ${T.activeSeeker} <strong>${savedBirth.name}</strong></span>
              <span class="seeker-meta">🪐 ಲಗ್ನ: <strong>${lagnaLocal}</strong></span>
              <span class="seeker-meta">🌙 ರಾಶಿ: <strong>${moonLocal}</strong></span>
              <span class="seeker-meta">⭐ ನಕ್ಷತ್ರ: <strong>${nakshatraLocal}</strong></span>
              <span class="seeker-meta">⏳ ದಶಾ: <strong>${dashaLocal}</strong></span>
              <span class="seeker-meta">📅 ಗೋಚಾರ: <strong>${chartCtx.solutions?.sadeSati?.assessmentDate || chartCtx.doshas?.find(d => d.id === 'shani_influence')?.assessmentDate || ''}</strong></span>
              <button id="guru-switch-chart-btn" class="guru-edit-btn">⚙️ ${T.editChart}</button>
            </div>
          </div>

          <!-- Language Selector -->
          <div class="guru-lang-selector" id="guru-lang-bar">
            <button class="guru-lang-btn ${activeLang === 'kn' ? 'active' : ''}" data-lang="kn">ಕನ್ನಡ</button>
            <button class="guru-lang-btn ${activeLang === 'hi' ? 'active' : ''}" data-lang="hi">हिंदी</button>
            <button class="guru-lang-btn ${activeLang === 'en' ? 'active' : ''}" data-lang="en">English</button>
            <button class="guru-lang-btn ${activeLang === 'mr' ? 'active' : ''}" data-lang="mr">मराठी</button>
            <button class="guru-lang-btn ${activeLang === 'te' ? 'active' : ''}" data-lang="te">తెలుగు</button>
          </div>
        </div>
      </div>

      <!-- Quick Suggestion Topic Chips -->
      <div class="guru-chips-container">
        <div class="guru-chips-scroll" id="guru-chips-list">
          ${chips.map((chip, idx) => `
            <button class="guru-chip-btn" data-query="${encodeURIComponent(chip.q)}">
              ${chip.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Chat Stream Area -->
      <div class="guru-chat-container" id="guru-chat-box">
        <div class="guru-messages-stream" id="guru-messages-stream">
          <!-- Rendered messages will be injected here -->
        </div>

        <!-- Typing Animation -->
        <div id="guru-typing-indicator" class="guru-typing-bubble" style="display: none;">
          <div class="guru-typing-dot"></div>
          <div class="guru-typing-dot"></div>
          <div class="guru-typing-dot"></div>
          <span style="font-size: 12px; color: var(--gold-400); margin-left: 6px;">ಆಸ್ಟ್ರೋಗುರು ಗ್ರಹಗಳ ಸಂಚಾರವನ್ನು ಲೆಕ್ಕಿಸುತ್ತಿದ್ದಾರೆ...</span>
        </div>
      </div>

      <!-- Chat Input Dock -->
      <div class="guru-input-dock">
        <div class="guru-input-bar">
          <button id="guru-clear-chat" class="guru-tool-btn" title="${T.clear}">
            🧹
          </button>
          <button id="guru-voice-btn" class="guru-tool-btn" title="${T.voice}">
            🎙️
          </button>
          <textarea id="guru-input-text" class="guru-textarea" placeholder="${T.inputPlaceholder}" rows="1"></textarea>
          <button id="guru-send-btn" class="guru-send-btn" title="${T.send}">
            <span>${T.send}</span> &rarr;
          </button>
        </div>
        <div class="guru-disclaimer">
          🕉️ ಜ್ಯೋತಿಷ್ಯವು ದೈವಿಕ ಸಂಕೇತಗಳ ಮಾರ್ಗದರ್ಶಿ. ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ, ಕಾಯಕ ನಿಷ್ಠೆ ಮತ್ತು ಈಶ್ವರನ ಅನುಗ್ರಹದಿಂದ ಸಕಲವೂ ಸಿದ್ಧಿಸುವುದು.
        </div>
      </div>
    </div>

    <!-- Edit Birth Details Modal Container -->
    <div id="guru-chart-modal" class="guru-modal hidden">
      <div class="guru-modal-backdrop"></div>
      <div class="guru-modal-dialog">
        <div class="guru-modal-header">
          <h3>🪐 ${T.changeModalTitle}</h3>
          <button id="guru-close-modal-btn" class="guru-modal-close">&times;</button>
        </div>
        <div class="guru-modal-body">
          <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; color: var(--gold-400); font-weight: 700; display: block; margin-bottom: 6px;">
              ${T.sampleQuickPick}
            </label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${SAMPLE_SEEKERS.map(s => `
                <button type="button" class="btn btn-secondary guru-sample-btn" data-sample="${encodeURIComponent(JSON.stringify(s))}" style="font-size: 12px; padding: 4px 10px;">
                  👤 ${s.name} (${s.city.split(',')[0]})
                </button>
              `).join('')}
            </div>
          </div>

          <form id="guru-chart-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">ಜಾತಕರ ಪೂರ್ಣ ಹೆಸರು / Full Name</label>
                <input type="text" id="g-name" class="form-input" value="${savedBirth.name || ''}" required />
              </div>
              <div class="form-group">
                <label class="form-label">ಜನ್ಮ ದಿನಾಂಕ / Birth Date</label>
                <input type="date" id="g-date" class="form-input" value="${savedBirth.date || '1999-03-28'}" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">ಜನ್ಮ ಸಮಯ / Birth Time (24 Hr)</label>
                <input type="time" id="g-time" class="form-input" value="${savedBirth.time || '11:25'}" required />
              </div>
              <div class="form-group">
                <label class="form-label">ಜನ್ಮ ಸ್ಥಳ / City of Birth</label>
                <input type="text" id="g-city" list="guru-places-list" class="form-input" value="${savedBirth.city || 'Vijayapura (Bijapur), Karnataka'}" required />
              </div>
            </div>

            <input type="hidden" id="g-lat" value="${savedBirth.latitude || 16.8302}" />
            <input type="hidden" id="g-lon" value="${savedBirth.longitude || 75.7100}" />
            <input type="hidden" id="g-tz" value="${savedBirth.timezone || 5.5}" />
            <input type="hidden" id="g-ayan" value="${savedBirth.ayanamsa || 'LAHIRI'}" />

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
              <button type="button" id="guru-cancel-modal-btn" class="btn btn-secondary">ರದ್ದು (Cancel)</button>
              <button type="submit" class="btn btn-primary" style="background: var(--gradient-accent); color: #000; font-weight: 800;">
                ${T.saveBtn}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    ${renderIndianPlacesDatalist('guru-places-list')}
  `;

  // Render chat messages
  renderMessages();

  // Attach event listeners
  setupEventListeners(container, savedBirth);
}

/**
 * Render all messages in stream
 */
function renderMessages() {
  const streamEl = document.getElementById('guru-messages-stream');
  if (!streamEl) return;

  const T = UI_TEXT[activeLang] || UI_TEXT.kn;

  streamEl.innerHTML = chatHistory.map((msg, idx) => {
    if (msg.sender === 'user') {
      return `
        <div class="guru-msg-row user-row">
          <div class="guru-msg-bubble user-bubble">
            <div class="guru-msg-text">${escapeHtml(msg.text)}</div>
            <div class="guru-msg-time">${msg.timestamp}</div>
          </div>
          <div class="guru-avatar-user">👤</div>
        </div>
      `;
    } else {
      // Guru Response
      return `
        <div class="guru-msg-row guru-row" data-msg-idx="${idx}">
          <div class="guru-avatar-bot">🧙‍♂️</div>
          <div class="guru-msg-bubble guru-bubble">
            ${msg.isWelcome ? `
              <div class="guru-welcome-box">
                <div style="font-size: 14.5px; line-height: 1.6; color: var(--text-primary);">
                  ${msg.text}
                </div>
              </div>
            ` : `
              <div class="guru-card-header">
                <span class="guru-card-title">${msg.topicTitle || '🔮 ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಸಮಾಧಾನ'}</span>
                <span class="guru-card-badge">${msg.lagnaSummary || ''}</span>
              </div>

              <!-- Astrological Analysis -->
              <div class="guru-section">
                <div class="guru-section-label">🪐 ಗ್ರಹ ಸ್ಥಿತಿ & ಕುಂಡಲಿ ವಿಶ್ಲೇಷಣೆ:</div>
                <div class="guru-section-content">${msg.analysis}</div>
              </div>

              <!-- Forecast & Timing -->
              <div class="guru-section">
                <div class="guru-section-label">⏳ ಕಾಲಮಾನ & ಭವಿಷ್ಯವಾಣಿ:</div>
                <div class="guru-section-content">${msg.forecast}</div>
              </div>

              <!-- Remedies -->
              ${msg.remedies && msg.remedies.length > 0 ? `
                <div class="guru-section remedies-section">
                  <div class="guru-section-label">🛡️ ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ ಮಾರ್ಗಗಳು:</div>
                  <ul class="guru-remedies-list">
                    ${msg.remedies.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              <!-- Blessings -->
              <div class="guru-blessings">
                ✨ <strong>ಆಸ್ಟ್ರೋಗುರು ಆಶೀರ್ವಾದ:</strong> ${msg.blessings}
              </div>
            `}

            <div class="guru-msg-footer">
              <span class="guru-msg-time">${msg.timestamp}</span>
              <div class="guru-action-group">
                <button class="guru-action-btn copy-btn" data-idx="${idx}" title="${T.copy}">📋 ${T.copy}</button>
                <button class="guru-action-btn download-btn" data-idx="${idx}" title="${T.download}">📥 ${T.download}</button>
                <button class="guru-action-btn speak-btn" data-idx="${idx}" title="Listen">🔊</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  // Scroll to bottom
  const chatBox = document.getElementById('guru-chat-box');
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Attach action button listeners
  attachMessageActions();
}

/**
 * Setup Event Listeners
 */
function setupEventListeners(container, savedBirth) {
  const inputEl = document.getElementById('guru-input-text');
  const sendBtn = document.getElementById('guru-send-btn');
  const clearBtn = document.getElementById('guru-clear-chat');
  const voiceBtn = document.getElementById('guru-voice-btn');

  // Send message on click
  sendBtn?.addEventListener('click', () => {
    handleUserSendMessage(inputEl);
  });

  // Send message on Enter (without Shift)
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSendMessage(inputEl);
    }
  });

  // Auto-resize textarea
  inputEl?.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
  });

  // Suggestion chips click
  container.querySelectorAll('.guru-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = decodeURIComponent(btn.getAttribute('data-query') || '');
      if (q) {
        if (inputEl) inputEl.value = q;
        handleUserSendMessage(inputEl);
      }
    });
  });

  // Clear chat
  clearBtn?.addEventListener('click', () => {
    chatHistory = [];
    renderAstroGuruPage(container);
  });

  // Language buttons
  container.querySelectorAll('.guru-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang && lang !== activeLang) {
        activeLang = lang;
        chatHistory = []; // Reset with new language greeting
        renderAstroGuruPage(container);
      }
    });
  });

  // Voice Speech Recognition
  voiceBtn?.addEventListener('click', () => {
    toggleVoiceRecognition(voiceBtn, inputEl);
  });

  // Modal: Switch / Edit Chart
  const modal = document.getElementById('guru-chart-modal');
  const switchBtn = document.getElementById('guru-switch-chart-btn');
  const closeBtn = document.getElementById('guru-close-modal-btn');
  const cancelBtn = document.getElementById('guru-cancel-modal-btn');
  const form = document.getElementById('guru-chart-form');

  switchBtn?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });

  const closeModal = () => modal?.classList.add('hidden');
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  modal?.querySelector('.guru-modal-backdrop')?.addEventListener('click', closeModal);

  // Quick Sample Seeker buttons
  modal?.querySelectorAll('.guru-sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        const s = JSON.parse(decodeURIComponent(btn.getAttribute('data-sample') || '{}'));
        document.getElementById('g-name').value = s.name;
        document.getElementById('g-date').value = s.date;
        document.getElementById('g-time').value = s.time;
        document.getElementById('g-city').value = s.city;
        document.getElementById('g-lat').value = s.latitude;
        document.getElementById('g-lon').value = s.longitude;
        document.getElementById('g-tz').value = s.timezone;
        document.getElementById('g-ayan').value = s.ayanamsa;
      } catch (e) {}
    });
  });

  // City Autocomplete change
  const cityInput = document.getElementById('g-city');
  cityInput?.addEventListener('change', () => {
    const found = findIndianPlace(cityInput.value);
    if (found) {
      document.getElementById('g-lat').value = found.lat;
      document.getElementById('g-lon').value = found.lon;
      document.getElementById('g-tz').value = found.tz;
      cityInput.value = found.label;
    }
  });

  // Save updated birth details
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('g-name').value.trim() || 'Seeker';
    const date = document.getElementById('g-date').value;
    const time = document.getElementById('g-time').value;
    const city = document.getElementById('g-city').value;
    const lat = parseFloat(document.getElementById('g-lat').value) || 16.8302;
    const lon = parseFloat(document.getElementById('g-lon').value) || 75.7100;
    const tz = parseFloat(document.getElementById('g-tz').value) || 5.5;
    const ayan = document.getElementById('g-ayan').value || 'LAHIRI';

    const newBirth = { name, date, time, city, latitude: lat, longitude: lon, timezone: tz, ayanamsa: ayan, phone: '' };
    store.saveBirthDetails(newBirth);
    store.currentKundali = null; // Re-generate

    chatHistory = []; // Reset for new seeker
    closeModal();
    renderAstroGuruPage(container);
  });
}

/**
 * Handle sending a user message
 */
function handleUserSendMessage(inputEl) {
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return;

  // Add user message
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  chatHistory.push({
    sender: 'user',
    text,
    timestamp: now
  });

  inputEl.value = '';
  inputEl.style.height = 'auto';
  renderMessages();

  // Show typing indicator
  const indicator = document.getElementById('guru-typing-indicator');
  if (indicator) indicator.style.display = 'flex';
  const chatBox = document.getElementById('guru-chat-box');
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;

  // Simulate divine computation latency (600ms)
  setTimeout(() => {
    const savedBirth = store.getSavedBirthDetails();
    const resp = getAstroGuruResponse(text, store.currentKundali, savedBirth, activeLang);

    if (indicator) indicator.style.display = 'none';

    chatHistory.push({
      sender: 'guru',
      topicTitle: resp.topicTitle,
      lagnaSummary: resp.lagnaSummary,
      analysis: resp.analysis,
      forecast: resp.forecast,
      remedies: resp.remedies,
      blessings: resp.blessings,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    renderMessages();
  }, 650);
}

/**
 * Attach copy, download and speak listeners
 */
function attachMessageActions() {
  // Copy button
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const msg = chatHistory[idx];
      if (!msg) return;

      const rawText = msg.isWelcome ? msg.text : `
${msg.topicTitle}
${msg.lagnaSummary}

🪐 ಗ್ರಹ ಸ್ಥಿತಿ & ವಿಶ್ಲೇಷಣೆ:
${msg.analysis}

⏳ ಕಾಲಮಾನ & ಭವಿಷ್ಯವಾಣಿ:
${msg.forecast}

🛡️ ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ ಮಾರ್ಗಗಳು:
${msg.remedies?.map(r => '• ' + r.replace(/<[^>]+>/g, '')).join('\n')}

✨ ಆಸ್ಟ್ರೋಗುರು ಆಶೀರ್ವಾದ:
${msg.blessings}
      `.trim();

      navigator.clipboard.writeText(rawText).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✅ ' + (UI_TEXT[activeLang]?.copied || 'Copied!');
        setTimeout(() => { btn.textContent = orig; }, 2000);
      });
    });
  });

  // Download consultation summary
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const msg = chatHistory[idx];
      if (!msg) return;
      downloadConsultationDoc(msg);
    });
  });

  // Speech output
  document.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const msg = chatHistory[idx];
      if (!msg) return;

      const textToSpeak = msg.isWelcome ? msg.text : `${msg.analysis} ${msg.forecast} ${msg.blessings}`.replace(/<[^>]+>/g, '');
      speakText(textToSpeak, activeLang);
    });
  });
}

/**
 * Text-to-Speech playback
 */
function speakText(text, lang) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const langMap = { kn: 'kn-IN', hi: 'hi-IN', mr: 'mr-IN', te: 'te-IN', en: 'en-IN' };
  utterance.lang = langMap[lang] || 'kn-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

/**
 * Speech recognition voice input
 */
function toggleVoiceRecognition(voiceBtn, inputEl) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice input is not supported in this browser. Please type your question.');
    return;
  }

  if (isRecognizing && speechRecognizer) {
    speechRecognizer.stop();
    isRecognizing = false;
    voiceBtn.classList.remove('recording');
    return;
  }

  speechRecognizer = new SpeechRecognition();
  const langMap = { kn: 'kn-IN', hi: 'hi-IN', mr: 'mr-IN', te: 'te-IN', en: 'en-US' };
  speechRecognizer.lang = langMap[activeLang] || 'kn-IN';
  speechRecognizer.interimResults = false;

  speechRecognizer.onstart = () => {
    isRecognizing = true;
    voiceBtn.classList.add('recording');
    voiceBtn.textContent = '🛑';
  };

  speechRecognizer.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    if (inputEl) {
      inputEl.value = (inputEl.value ? inputEl.value + ' ' : '') + transcript;
      inputEl.focus();
    }
  };

  speechRecognizer.onerror = () => {
    isRecognizing = false;
    voiceBtn.classList.remove('recording');
    voiceBtn.textContent = '🎙️';
  };

  speechRecognizer.onend = () => {
    isRecognizing = false;
    voiceBtn.classList.remove('recording');
    voiceBtn.textContent = '🎙️';
  };

  speechRecognizer.start();
}

/**
 * Download styled consultation print sheet
 */
function downloadConsultationDoc(msg) {
  const saved = store.getSavedBirthDetails();
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AstroGuru Consultation - ${saved.name}</title>
      <style>
        body { font-family: 'Noto Sans Kannada', 'Noto Sans Devanagari', sans-serif; padding: 30px; color: #1E293B; max-width: 800px; margin: 0 auto; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #DAA520; padding-bottom: 15px; margin-bottom: 20px; }
        .title { color: #9A3412; font-size: 22px; font-weight: 800; margin: 0; }
        .badge { display: inline-block; padding: 4px 12px; background: #FEF3C7; color: #92400E; border-radius: 4px; font-weight: 700; margin-top: 5px; }
        .section { margin-bottom: 16px; padding: 12px; background: #F8FAFC; border-left: 4px solid #DAA520; border-radius: 4px; }
        .label { font-weight: 800; color: #9A3412; margin-bottom: 5px; }
        ul { padding-left: 20px; margin: 0; }
        li { margin-bottom: 4px; }
        .blessing { padding: 12px; background: #FFFBEB; border: 1px solid #D97706; border-radius: 6px; text-align: center; font-weight: 700; color: #B45309; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">🧙‍♂️ AstroGuru — Vedic Consultation Summary</h1>
        <div class="badge">${msg.topicTitle || 'Vedic Guidance'} &bull; ${saved.name}</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 4px;">${msg.lagnaSummary || ''}</div>
      </div>

      <div class="section">
        <div class="label">🪐 Astrological & Planetary Analysis:</div>
        <div>${msg.analysis}</div>
      </div>

      <div class="section">
        <div class="label">⏳ Timeline & Forecast:</div>
        <div>${msg.forecast}</div>
      </div>

      ${msg.remedies && msg.remedies.length > 0 ? `
        <div class="section">
          <div class="label">🛡️ Vedic Remedies & Action Plan:</div>
          <ul>
            ${msg.remedies.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="blessing">
        ✨ ${msg.blessings}
      </div>

      <div style="text-align: center; font-size: 11px; color: #94A3B8; margin-top: 25px;">
        AstroVeda &bull; Generated on ${new Date().toLocaleDateString()} &bull; Helpline: +91 901 908 8160
      </div>
      <script>
        window.onload = () => { window.print(); };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
}

function escapeHtml(str = '') {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
