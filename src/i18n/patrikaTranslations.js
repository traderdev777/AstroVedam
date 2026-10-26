/**
 * AstroVeda - Multilingual Translations for 9-Page Vedic Janampatrika
 * Supports English (en), Hindi (hi), Kannada (kn), Marathi (mr), and Telugu (te).
 * 100% Pure native terminology with zero English parenthetical residues.
 */

export const PATRIKA_LANGUAGES = {
  en: { code: 'en', name: 'English', native: 'English', label: 'English' },
  hi: { code: 'hi', name: 'Hindi', native: 'हिंदी', label: 'हिंदी (Hindi)' },
  kn: { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', label: 'ಕನ್ನಡ (Kannada)' },
  mr: { code: 'mr', name: 'Marathi', native: 'मराठी', label: 'मराठी (Marathi)' },
  te: { code: 'te', name: 'Telugu', native: 'తెలుగు', label: 'తెలుగు (Telugu)' }
};

export const PATRIKA_TRANSLATIONS = {
  en: {
    meta: {
      om: 'ॐ',
      title: 'AstroVeda • Comprehensive Vedic Mahapatrika & Solutions',
      subtitle: 'Authentic Sanatan Hindu Vedic Horoscope, Advanced Numerology & Cosmic Life Blueprint',
      pageOf: 'Page {p} of 9',
      helpline: 'Master Helpline: +91 901 908 8160 • Unlimited VIP Access'
    },
    sections: {
      s1: '1. Seeker Identity & Sacred Birth Particulars',
      janamNaamTitle: '🕉️ Janam Naam Syllable (Avakahada Chakra)',
      s2: '2. Panchang Parameters & Core Kundali Elements',
      s3: '3. Janam Kundali Charts (Lagna D-1 & Navamsa D-9)',
      s4: '4. Planetary Longitudes, Nakshatras & Dignities',
      s5: '5. Vimshottari Mahadasha Periods & Active Planetary Cycle',
      s6: '6. Auspicious Yogas Detected in Horoscope',
      s7: '7. Classical Dosha Scan & Authentic Step-by-Step Remedies',
      s8: '8. Janam Avakahada Lucky Profile Matrix',
      s9: '9. Career & Professional Livelihood Blueprint',
      s10: '10. Marriage, Partnership & Timing of Nuptials',
      s11: '11. Advanced Astro Solutions & Life Predictions',
      s12: '12. Life Domain Forecasts & Remedies',
      s13: '13. Advanced Numerology & Sacred Lo Shu Grid Matrix',
      s14: '14. Mobile Number Shubh / Ashubh In-Depth Analysis',
      s15: '15. Best Suitable Mobile Number Suggestion Blueprint',
      s16: '16. Comprehensive Domain Predictions (Health, Wealth, Career)',
      s17: '17. 12-Month Quarterly Astrological Forecast',
      s18: '18. Master Remedial Blueprint (Mantras, Gemstones, Rudraksha)',
      s19: '19. Master Life Summary & Astrological Verdict',
      s20: '20. Lucky Profile Attributes Master Table',
      s21: '21. Five Daily Sacred Rules for Lifelong Success',
      s22: '22. Final Astrological Conclusion & Divine Blessings'
    },
    fields: {
      name: 'Full Name',
      dob: 'Date of Birth',
      tob: 'Time of Birth',
      pob: 'Place of Birth',
      father: "Father's Name",
      mother: "Mother's Name",
      phone: 'Mobile / Phone',
      coords: 'Coordinates',
      ayanamsa: 'Ayanamsa System',
      tz: 'Timezone',
      pada: 'Pada',
      lagna: 'Ascendant (Lagna)',
      lagnaLord: 'Lagna Lord',
      moonSign: 'Moon Sign',
      moonLord: 'Sign Lord',
      nakshatra: 'Birth Star',
      sunSign: 'Sun Sign',
      activeDasha: 'Active Dasha Period',
      planet: 'Planet',
      sign: 'Sign',
      degree: 'Degree',
      navamsa: 'Navamsha',
      house: 'House',
      status: 'Dignity',
      speed: 'Speed / Motion',
      d1Chart: 'Lagna Chart (D-1)',
      d9Chart: 'Navamsha Chart (D-9)',
      luckyColor: 'Lucky Colors',
      luckyNum: 'Lucky Numbers',
      luckyDay: 'Lucky Days',
      ishtaDevata: 'Ishta Devata & Seed Mantra',
      bestCareers: 'Prime Career Domains',
      mobileStatus: 'Vibrational Status',
      isSuitable: 'Number Harmony',
      prescribedSyllable: 'Prescribed Syllable'
    },
    dignities: {
      Exalted: 'Exalted',
      Moolatrikona: 'Moolatrikona',
      Own: 'Own Sign',
      GreatFriend: 'Great Friend',
      Friend: 'Friend Sign',
      Neutral: 'Neutral Sign',
      Enemy: 'Enemy Sign',
      GreatEnemy: 'Great Enemy',
      Debilitated: 'Debilitated'
    },
    mobile: {
      auspicious: 'Highly Auspicious & Favorable (Shubh)',
      inauspicious: 'Inauspicious & Clashing Energy (Ashubh)',
      suitableText: 'This mobile number is in complete harmony with your Mulank and Bhagyank.',
      unsuitableText: 'This mobile number produces friction. We strongly recommend transitioning to our prescribed blueprint numbers.'
    },
    dailyRules: [
      { title: 'Daily Morning Surya Arghya (6:00 AM - 7:00 AM)', desc: 'Offer pure water with red vermillion and whole rice to Lord Surya while chanting the Gayatri Mantra.' },
      { title: 'Ishta Devata Mantra Japa (108 Chants)', desc: 'Chant your designated Ishta Devata mantra 108 times daily on a consecrated Rudraksha or Tulsi mala.' },
      { title: 'Gau Seva & Bird Feeding', desc: 'Feed green grass or chana dal to cows on Wednesdays or Saturdays and provide water/grains to birds.' },
      { title: 'Sacred Colors & Numbers Activation', desc: 'Incorporate your prime lucky colors and numbers in business meetings, contracts, and travel.' },
      { title: 'Northeast Evening Deepam', desc: 'Light a pure cow ghee lamp in the Ishanya (Northeast) corner of your home every evening at dusk.' }
    ],
    verdict: {
      heading: 'Final Astrological Verdict & Vedic Blessings',
      text: 'The native possesses a righteous cosmic blueprint blessed by auspicious alignments. By adhering to the prescribed daily rituals, authentic seed mantras, and sattvic conduct, all planetary imbalances dissolve, granting enduring longevity, robust health, financial sovereignty, and divine peace. May Lord Surya and Lord Shiva bestow grace upon your journey.'
    }
  },

  hi: {
    meta: {
      om: 'ॐ',
      title: 'AstroVeda • वृहत् जन्मपत्रिका एवं सर्वतोभद्र समाधान',
      subtitle: 'सनातन हिन्दू वैदिक ज्योतिष, उन्नत अंक ज्योतिष एवं समग्र जीवन मार्गदर्शन',
      pageOf: 'पृष्ठ {p} / 9',
      helpline: 'आचार्य हेल्पलाइन: +91 901 908 8160 • असीमित वीआईपी क्लाइंट एक्सेस'
    },
    sections: {
      s1: '१. जातक परिचय एवं जन्म विवरण',
      janamNaamTitle: '🕉️ अवकहड़ा चक्र अनुसार जन्म नामाक्षर',
      s2: '२. पंचांग एवं मूलभूत कुण्डली तत्व',
      s3: '३. जन्म कुण्डली चक्र (लग्न एवं नवांश)',
      s4: '४. स्पष्ट ग्रह स्थिति, नक्षत्र एवं बल',
      s5: '५. विंशोत्तरी महादशा क्रम एवं प्रभावी दशा चक्र',
      s6: '६. कुण्डली में उपस्थित शुभ राजयोग',
      s7: '७. दोष विश्लेषण एवं प्रामाणिक वैदिक उपाय',
      s8: '८. समग्र अवकहड़ा शुभ तत्व प्रोफाइल तालिका',
      s9: '९. आजीविका, व्यवसाय एवं करियर मार्गदर्शन',
      s10: '१०. विवाह योग, वैवाहिक जीवन एवं समय-सीमा',
      s11: '११. उन्नत ज्योतिषीय समाधान एवं जीवन निर्देश',
      s12: '१२. जीवन के प्रमुख क्षेत्रों का भविष्यफल एवं उपाय',
      s13: '१३. उन्नत अंक ज्योतिष एवं लो-शू महायंत्र चक्र',
      s14: '१४. मोबाइल नंबर शुभ / अशुभ गहन विश्लेषण',
      s15: '१५. सर्वोत्कृष्ट अनुकूल मोबाइल नंबर सुझाव ब्लूप्रिंट',
      s16: '१६. समग्र जीवन भविष्यवाणियां (स्वास्थ्य, धन, करियर, परिवार)',
      s17: '१७. आगामी १२ माह का त्रैमासिक ज्योतिषीय पूर्वानुमान',
      s18: '१८. महा-उपाय मास्टर ब्लूप्रिंट (मंत्र जप, रत्न, रुद्राक्ष एवं कवच)',
      s19: '१९. समग्र जीवन सारांश एवं कुण्डली महा-निष्कर्ष',
      s20: '२०. समग्र शुभ तत्व मास्टर तालिका',
      s21: '२१. जीवन में सफलता हेतु ५ सरल दैनिक नियम',
      s22: '२२. परम पावन अंतिम ज्योतिषाचार्य निष्कर्ष एवं शुभाशीष'
    },
    fields: {
      name: 'जातक नाम',
      dob: 'जन्म तिथि',
      tob: 'जन्म समय',
      pob: 'जन्म स्थान',
      father: 'पिता का नाम',
      mother: 'माता का नाम',
      phone: 'मोबाइल / संपर्क',
      coords: 'अक्षांश / रेखांश',
      ayanamsa: 'अयनांश प्रणाली',
      tz: 'समय क्षेत्र',
      pada: 'चरण',
      lagna: 'लग्न राशि',
      lagnaLord: 'लग्न स्वामी',
      moonSign: 'चन्द्र राशि',
      moonLord: 'राश्याधिपति',
      nakshatra: 'जन्म नक्षत्र',
      sunSign: 'सूर्य राशि',
      activeDasha: 'प्रस्तुत महादशा अवधि',
      planet: 'ग्रह',
      sign: 'राशि',
      degree: 'अंश',
      navamsa: 'नवांश',
      house: 'भाव',
      status: 'स्थिति / बल',
      speed: 'गति (चलन)',
      d1Chart: 'लग्न कुण्डली (डी-१)',
      d9Chart: 'नवांश कुण्डली (डी-९)',
      luckyColor: 'शुभ रंग',
      luckyNum: 'शुभ अंक',
      luckyDay: 'शुभ वार',
      ishtaDevata: 'इष्टदेव एवं मूल बीज मंत्र',
      bestCareers: 'सर्वोत्तम कार्यक्षेत्र',
      mobileStatus: 'मोबाइल ऊर्जा स्थिति',
      isSuitable: 'संख्या अनुकूलता',
      prescribedSyllable: 'विहित प्रथमाक्षर'
    },
    dignities: {
      Exalted: 'उच्च राशि',
      Moolatrikona: 'मूलत्रिकोण',
      Own: 'स्वक्षेत्र',
      GreatFriend: 'अधिमित्र राशि',
      Friend: 'मित्र राशि',
      Neutral: 'सम राशि',
      Enemy: 'शत्रु राशि',
      GreatEnemy: 'अधिशत्रु राशि',
      Debilitated: 'नीच राशि'
    },
    mobile: {
      auspicious: 'परम शुभ एवं सकारात्मक ऊर्जा (शुभ)',
      inauspicious: 'अशुभ एवं विरोधी ऊर्जा (अशुभ)',
      suitableText: 'यह मोबाइल नंबर आपके मूलांक एवं भाग्यांक के साथ पूर्ण सामंजस्य में है।',
      unsuitableText: 'यह मोबाइल नंबर ग्रहीय ऊर्जाओं में टकराव उत्पन्न कर रहा है। कृपया अनुशंसित नंबर चुनें।'
    },
    dailyRules: [
      { title: 'प्रातःकाल सूर्यनारायण को अर्घ्य (प्रातः ६:०० - ७:००)', desc: 'तांबे के लोटे में जल, कुमकुम व अक्षत डालकर पूर्व दिशा की ओर मुख कर गायत्री मंत्र जपते हुए अर्घ्य दें।' },
      { title: 'इष्टदेव के बीज मंत्र का नित्य जप (१०८ बार)', desc: 'रुद्राक्ष अथवा तुलसी माला पर अपने इष्टदेव के मंत्र का प्रतिदिन शांत भाव से जप करें।' },
      { title: 'गौमाता की सेवा एवं पक्षियों को दाना', desc: 'बुधवार या शनिवार को गाय को हरी घास अथवा गुड़-रोटी खिलाएं और पक्षियों के लिए दाना-पानी रखें।' },
      { title: 'शुभ रंग एवं संख्याओं का प्रयोग', desc: 'महत्वपूर्ण अनुबंध, साक्षात्कार एवं शुभ यात्राओं में अपने भाग्यशाली रंगों और अंकों का उपयोग करें।' },
      { title: 'ईशान कोण में संध्या दीपक', desc: 'प्रतिदिन संध्याकाल में घर के ईशान कोण में गाय के शुद्ध घी का दीपक प्रज्वलित करें।' }
    ],
    verdict: {
      heading: 'अंतिम ज्योतिषाचार्य निष्कर्ष एवं दिव्य आशीर्वाद',
      text: 'जातक की जन्मपत्रिका में धर्म, अर्थ, काम और मोक्ष का उत्तम योग है। विहित दैनिक नियमों, बीज मंत्रों और सात्विक दिनचर्या का पालन करने से समस्त ग्रहीय बाधाएं दूर होकर दीर्घायु, उत्तम स्वास्थ्य, विपुल धन और समाज में सर्वोच्च प्रतिष्ठा प्राप्त होगी। भगवान सूर्य एवं देवाधिदेव महादेव की असीम कृपा आप पर सदैव बनी रहे।'
    }
  },

  kn: {
    meta: {
      om: 'ಓಂ',
      title: 'ಆಸ್ಟ್ರೋವೇದ • ಬೃಹತ್ ಜಾತಕ ಫಲ ಮತ್ತು ಸರ್ವತೋಭದ್ರ ಪರಿಹಾರ',
      subtitle: 'ಪ್ರಾಮಾಣಿಕ ಸನಾತನ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ, ಸಂಖ್ಯಾಶಾಸ್ತ್ರ ಮತ್ತು ಸಮಗ್ರ ಜೀವನ ಮಾರ್ಗದರ್ಶಿ',
      pageOf: 'ಪುಟ {p} / 9',
      helpline: 'ಆಚಾರ್ಯ ಸಹಾಯವಾಣಿ: +91 901 908 8160 • ವಿಐಪಿ ಕ್ಲೈಂಟ್ ಪ್ರವೇಶ'
    },
    sections: {
      s1: '೧. ಜಾತಕರ ಪರಿಚಯ ಮತ್ತು ಜನ್ಮ ವಿವರಗಳು',
      janamNaamTitle: '🕉️ ಅವಕಹಡ ಚಕ್ರದ ಪ್ರಕಾರ ಜನ್ಮ ನಾಮಾಕ್ಷರ',
      s2: '೨. ಪಂಚಾಂಗ ಮತ್ತು ಮೂಲಭೂತ ಕುಂಡಲಿ ತತ್ವಗಳು',
      s3: '೩. ಜನ್ಮ ಕುಂಡಲಿ ಚಕ್ರಗಳು (ಲಗ್ನ ಮತ್ತು ನವಾಂಶ)',
      s4: '೪. ಸ್ಪಷ್ಟ ಗ್ರಹ ಸ್ಥಿತಿ, ನಕ್ಷತ್ರ ಮತ್ತು ಬಲ',
      s5: '೫. ವಿಂಶೋತ್ತರಿ ಮಹಾದಶಾ ಕ್ರಮ ಮತ್ತು ಸಕ್ರಿಯ ಅವಧಿ',
      s6: '೬. ಜಾತಕದಲ್ಲಿರುವ ಶುಭ ಯೋಗಗಳು',
      s7: '೭. ದೋಷ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸನಾತನ ವೈದಿಕ ಪರಿಹಾರಗಳು',
      s8: '೮. ಜನ್ಮ ಅವಕಹಡ ಶುಭ ತತ್ವಗಳ ಪಟ್ಟಿ',
      s9: '೯. ವೃತ್ತಿ, ವ್ಯವಹಾರ ಮತ್ತು ಜೀವನೋಪಾಯ ಮಾರ್ಗದರ್ಶನ',
      s10: '೧೦. ವಿವಾಹ ಯೋಗ ಮತ್ತು ವೈವಾಹಿಕ ಸಮಯ',
      s11: '೧೧. ಮುಂದುವರಿದ ಜ್ಯೋತಿಷ್ಯ ಪರಿಹಾರಗಳು ಮತ್ತು ರಕ್ಷಣೆ',
      s12: '೧೨. ಜೀವನದ ಪ್ರಮುಖ ಕ್ಷೇತ್ರಗಳ ಭವಿಷ್ಯ ಮತ್ತು ಪರಿಹಾರಗಳು',
      s13: '೧೩. ಸಂಖ್ಯಾಶಾಸ್ತ್ರ ಮತ್ತು ಲೋ-ಶೂ ಚಕ್ರ',
      s14: '೧೪. ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಶುಭ / ಅಶುಭ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆ',
      s15: '೧೫. ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಶಿಫಾರಸು',
      s16: '೧೬. ಸಮಗ್ರ ಜೀವನ ಭವಿಷ್ಯ (ಆರೋಗ್ಯ, ಸಂಪತ್ತು, ವೃತ್ತಿ, ಕುಟುಂಬ)',
      s17: '೧೭. ಮುಂಬರುವ ೧೨ ತಿಂಗಳ ತ್ರೈಮಾಸಿಕ ಭವಿಷ್ಯ',
      s18: '೧೮. ಮಹಾ ಪರಿಹಾರ ಸೂತ್ರ (ಮಂತ್ರ ಜಪ, ರತ್ನ ಧಾರಣೆ, ರುದ್ರಾಕ್ಷಿ ಮತ್ತು ರಕ್ಷೆ)',
      s19: '೧೯. ಸಮಗ್ರ ಜೀವನ ಸಾರಾಂಶ ಮತ್ತು ಜಾತಕ ಮಹಾ ತೀರ್ಪು',
      s20: '೨೦. ಶುಭ ತತ್ವಗಳ ಮಾಸ್ಟರ್ ಪಟ್ಟಿ',
      s21: '೨೧. ಜೀವನದಲ್ಲಿ ಯಶಸ್ಸು ಗಳಿಸಲು ೫ ಸರಳ ದಿನನಿತ್ಯದ ನಿಯಮಗಳು',
      s22: '೨೨. ಅಂತಿಮ ಜ್ಯೋತಿಷ್ಯಾಚಾರ್ಯ ತೀರ್ಪು ಮತ್ತು ದೈವಿಕ ಆಶೀರ್ವಾದ'
    },
    fields: {
      name: 'ಜಾತಕರ ಹೆಸರು',
      dob: 'ಜನ್ಮ ದಿನಾಂಕ',
      tob: 'ಜನ್ಮ ಸಮಯ',
      pob: 'ಜನ್ಮ ಸ್ಥಳ',
      father: 'ತಂದೆಯ ಹೆಸರು',
      mother: 'ತಾಯಿಯ ಹೆಸರು',
      phone: 'ಮೊಬೈಲ್ / ಸಂಪರ್ಕ',
      coords: 'ಅಕ್ಷಾಂಶ / ರೇಖಾಂಶ',
      ayanamsa: 'ಅಯನಾಂಶ ಪದ್ಧತಿ',
      tz: 'ಸಮಯ ವಲಯ',
      pada: 'ಪಾದ',
      lagna: 'ಲಗ್ನ ರಾಶಿ',
      lagnaLord: 'ಲಗ್ನಾಧಿಪತಿ',
      moonSign: 'ಚಂದ್ರ ರಾಶಿ',
      moonLord: 'ರಾಶ್ಯಾಧಿಪತಿ',
      nakshatra: 'ಜನ್ಮ ನಕ್ಷತ್ರ',
      sunSign: 'ಸೂರ್ಯ ರಾಶಿ',
      activeDasha: 'ಪ್ರಸ್ತುತ ಮಹಾದಶಾ ಅವಧಿ',
      planet: 'ಗ್ರಹ',
      sign: 'ರಾಶಿ',
      degree: 'ಅಂಶ',
      navamsa: 'ನವಾಂಶ',
      house: 'ಭಾವ',
      status: 'ಸ್ಥಿತಿ / ಬಲ',
      speed: 'ಗತಿ (ಚಲನೆ)',
      d1Chart: 'ಲಗ್ನ ಕುಂಡಲಿ (ಡಿ-೧)',
      d9Chart: 'ನವಾಂಶ ಕುಂಡಲಿ (ಡಿ-೯)',
      luckyColor: 'ಶುಭ ಬಣ್ಣಗಳು',
      luckyNum: 'ಶುಭ ಸಂಖ್ಯೆಗಳು',
      luckyDay: 'ಶುಭ ವಾರಗಳು',
      ishtaDevata: 'ಇಷ್ಟದೇವತೆ ಮತ್ತು ಮೂಲ ಮಂತ್ರ',
      bestCareers: 'ಅತ್ಯುತ್ತಮ ವೃತ್ತಿ ಕ್ಷೇತ್ರಗಳು',
      mobileStatus: 'ಮೊಬೈಲ್ ಶಕ್ತಿ ಸ್ಥಿತಿ',
      isSuitable: 'ಸಂಖ್ಯೆಯ ಹೊಂದಾಣಿಕೆ',
      prescribedSyllable: 'ಸೂಚಿತ ಪ್ರಥಮಾಕ್ಷರ'
    },
    dignities: {
      Exalted: 'ಉಚ್ಚ ರಾಶಿ',
      Moolatrikona: 'ಮೂಲತ್ರಿಕೋಣ',
      Own: 'ಸ್ವಕ್ಷೇತ್ರ',
      GreatFriend: 'ಅಧಿಮಿತ್ರ ರಾಶಿ',
      Friend: 'ಮಿತ್ರ ರಾಶಿ',
      Neutral: 'ಸಮ ರಾಶಿ',
      Enemy: 'ಶತ್ರು ರಾಶಿ',
      GreatEnemy: 'ಅಧಿಶತ್ರು ರಾಶಿ',
      Debilitated: 'ನೀಚ ರಾಶಿ'
    },
    mobile: {
      auspicious: 'ಪರಮ ಶುಭ ಹಾಗೂ ಸಕಾರಾತ್ಮಕ ಶಕ್ತಿ (ಶುಭ)',
      inauspicious: 'ಅಶುಭ ಹಾಗೂ ವಿರೋಧಾತ್ಮಕ ಶಕ್ತಿ (ಅಶುಭ)',
      suitableText: 'ಈ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯು ನಿಮ್ಮ ಮೂಲ್ಯಾಂಕ ಮತ್ತು ಭಾಗ್ಯಾಂಕದೊಂದಿಗೆ ಅತ್ಯುತ್ತಮ ಸಾಮರಸ್ಯ ಹೊಂದಿದೆ.',
      unsuitableText: 'ಈ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯು ಗ್ರಹ ವಿರೋಧವನ್ನು ಉಂಟುಮಾಡುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಕೆಳಗೆ ಶಿಫಾರಸು ಮಾಡಿದ ಹೊಸ ಸಂಖ್ಯೆಯನ್ನು ಆರಿಸಿಕೊಳ್ಳಿ.'
    },
    dailyRules: [
      { title: 'ಪ್ರತಿದಿನ ಪ್ರಾತಃಕಾಲ ಸೂರ್ಯಾರ್ಘ್ಯ (ಬೆಳಿಗ್ಗೆ ೬:೦೦ - ೭:೦೦)', desc: 'ತಾಮ್ರದ ಪಾತ್ರೆಯಲ್ಲಿ ಶುದ್ಧ ನೀರು, ಅಕ್ಷತೆ ಹಾಕಿ ಗಾಯತ್ರಿ ಮಂತ್ರದೊಂದಿಗೆ ಸೂರ್ಯದೇವನಿಗೆ ಅರ್ಘ್ಯ ಅರ್ಪಿಸಿ.' },
      { title: 'ಇಷ್ಟದೇವತೆಯ ನಿತ್ಯ ಮಂತ್ರ ಜಪ (೧೦೮ ಬಾರಿ)', desc: 'ರುದ್ರಾಕ್ಷಿ ಅಥವಾ ತುಳಸಿ ಮಾಲೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಇಷ್ಟದೇವತೆಯ ಮಂತ್ರವನ್ನು ನಿತ್ಯವೂ ಜಪಿಸಿ.' },
      { title: 'ಗೋಸೇವೆ ಮತ್ತು ಪಕ್ಷಿಗಳಿಗೆ ಆಹಾರ', desc: 'ಬುಧವಾರ ಅಥವಾ ಶನಿವಾರದಂದು ಹಸುಗಳಿಗೆ ಹಸಿರು ಹುಲ್ಲು ನೀಡಿ ಹಾಗೂ ಪಕ್ಷಿಗಳಿಗೆ ಕಾಳು ಹಾಕಿ.' },
      { title: 'ಶುಭ ಬಣ್ಣಗಳು ಮತ್ತು ಸಂಖ್ಯೆಗಳ ಬಳಕೆ', desc: 'ಮುಖ್ಯ ಸಂದರ್ಶನ, ಒಪ್ಪಂದ ಹಾಗೂ ಪ್ರಯಾಣಗಳಲ್ಲಿ ನಿಮ್ಮ ಭಾಗ್ಯಶಾಲಿ ಬಣ್ಣಗಳನ್ನು ಧರಿಸಿ.' },
      { title: 'ಈಶಾನ್ಯ ಮೂಲೆಯಲ್ಲಿ ಸಂಜೆ ದೀಪಾರಾಧನೆ', desc: 'ಪ್ರತಿದಿನ ಸಂಜೆ ಮನೆಯ ಈಶಾನ್ಯ ಮೂಲೆಯಲ್ಲಿ ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪದ ದೀಪವನ್ನು ಬೆಳಗಿಸಿ.' }
    ],
    verdict: {
      heading: 'ಅಂತಿಮ ಜ್ಯೋತಿಷ್ಯಾಚಾರ್ಯ ತೀರ್ಪು ಮತ್ತು ಶುಭಾಶೀರ್ವಾದಗಳು',
      text: 'ಜಾತಕರ ಜನ್ಮಕುಂಡಲಿಯಲ್ಲಿ ಧರ್ಮ, ಕರ್ಮ ಮತ್ತು ಜ್ಞಾನದ ಉತ್ತಮ ಸಂಯೋಗವಿದೆ. ಸೂಚಿಸಲಾದ ವೈದಿಕ ನಿಯಮಗಳು, ದಿನನಿತ್ಯದ ಮಂತ್ರಜಪ ಮತ್ತು ಸಾತ್ವಿಕ ಜೀವನಶೈಲಿಯನ್ನು ಪಾಲಿಸುವುದರಿಂದ ಸಮಸ್ತ ಗ್ರಹದೋಷಗಳು ನಿವಾರಣೆಯಾಗಿ ಆಯುಷ್ಯ, ಆರೋಗ್ಯ, ಕೀರ್ತಿ ಮತ್ತು ಶಾಶ್ವತ ಸುಖ-ಶಾಂತಿ ಲಭಿಸುವುದು. ಶ್ರೀ ಸೂರ್ಯನಾರಾಯಣ ಮತ್ತು ಶಿವನ ಕೃಪೆ ನಿಮ್ಮ ಮೇಲಿರಲಿ.'
    }
  },

  mr: {
    meta: {
      om: 'ॐ',
      title: 'AstroVeda • बृहत् जन्मपत्रिका व सर्वतोभद्र उपाय',
      subtitle: 'सनातन वैदिक ज्योतिष, प्रगत अंकशास्त्र व समग्र जीवन मार्गदर्शन',
      pageOf: 'पृष्ठ {p} / 9',
      helpline: 'आचार्य हेल्पलाइन: +91 901 908 8160 • व्हीआयपी क्लायंट प्रवेश'
    },
    sections: {
      s1: '१. जातक परिचय व जन्म तपशील',
      janamNaamTitle: '🕉️ अवकहडा चक्रानुसार जन्म नामाक्षर',
      s2: '२. पंचांग व मूलभूत कुंडली घटक',
      s3: '३. जन्म कुंडली चक्रे (लग्न व नवांश)',
      s4: '४. स्पष्ट ग्रह स्थिती, नक्षत्र व बळ',
      s5: '५. विंशोत्तरी महादशा क्रम व सक्रिय दशा काळ',
      s6: '६. कुंडलीतील शुभ राजयोग',
      s7: '७. दोष विश्लेषण व प्रामाणिक वैदिक उपाय',
      s8: '८. समग्र अवकहडा शुभ घटक तक्ता',
      s9: '९. उपजीविका, व्यवसाय व करिअर मार्गदर्शन',
      s10: '१०. विवाह योग, वैवाहिक जीवन व शुभ काळ',
      s11: '११. प्रगत ज्योतिषीय उपाय व जीवन दिशा',
      s12: '१२. जीवनातील प्रमुख क्षेत्रांचे भविष्य व उपाय',
      s13: '१३. प्रगत अंकशास्त्र व लो-शू महायंत्र चक्र',
      s14: '१४. मोबाईल नंबर शुभ / अशुभ सखोल विश्लेषण',
      s15: '१५. सर्वोत्तम अनुकूल मोबाईल नंबर शिफारस आराखडा',
      s16: '१६. समग्र जीवन भविष्य (आरोग्य, वित्त, करिअर, कुटुंब)',
      s17: '१७. आगामी १२ महिन्यांचे त्रैमासिक ज्योतिषीय अंदाज',
      s18: '१८. महा-उपाय मास्टर आराखडा (मंत्र जप, रत्न, रुद्राक्ष व कवच)',
      s19: '१९. समग्र जीवन सारांश व कुंडली महा-निष्कर्ष',
      s20: '२०. समग्र शुभ घटक मास्टर तक्ता',
      s21: '२१. जीवनात यशासाठी ५ सोपे दैनंदिन नियम',
      s22: '२२. परम पावन अंतिम ज्योतिषाचार्य निष्कर्ष व शुभाशीर्वाद'
    },
    fields: {
      name: 'जातकाचे नाव',
      dob: 'जन्म तारीख',
      tob: 'जन्म वेळ',
      pob: 'जन्म ठिकाण',
      father: 'वडिलांचे नाव',
      mother: 'आईचे नाव',
      phone: 'मोबाईल / संपर्क',
      coords: 'अक्षांश / रेखांश',
      ayanamsa: 'अयनांश पद्धती',
      tz: 'वेळ क्षेत्र',
      pada: 'चरण',
      lagna: 'लग्न रास',
      lagnaLord: 'लग्नेश',
      moonSign: 'चंद्र रास',
      moonLord: 'राशी स्वामी',
      nakshatra: 'जन्म नक्षत्र',
      sunSign: 'सूर्य रास',
      activeDasha: 'सध्याची महादशा',
      planet: 'ग्रह',
      sign: 'रास',
      degree: 'अंश',
      navamsa: 'नवांश',
      house: 'स्थान',
      status: 'स्थिती / बळ',
      speed: 'गती (चलन)',
      d1Chart: 'लग्न कुंडली (डी-१)',
      d9Chart: 'नवांश कुंडली (डी-९)',
      luckyColor: 'शुभ रंग',
      luckyNum: 'शुभ अंक',
      luckyDay: 'शुभ वार',
      ishtaDevata: 'इष्टदेव व बीज मंत्र',
      bestCareers: 'सर्वोत्कृष्ट कार्यक्षेत्रे',
      mobileStatus: 'मोबाईल ऊर्जा स्थिती',
      isSuitable: 'नंबर अनुकूलता',
      prescribedSyllable: 'विहित प्रथमाक्षर'
    },
    dignities: {
      Exalted: 'उच्च रास',
      Moolatrikona: 'मूलत्रिकोण',
      Own: 'स्वक्षेत्र',
      GreatFriend: 'अधिमित्र रास',
      Friend: 'मित्र रास',
      Neutral: 'सम रास',
      Enemy: 'शत्रू रास',
      GreatEnemy: 'अधिशत्रू रास',
      Debilitated: 'नीच रास'
    },
    mobile: {
      auspicious: 'परम शुभ व सकारात्मक ऊर्जा (शुभ)',
      inauspicious: 'अशुभ व विरोधी ऊर्जा (अशुभ)',
      suitableText: 'हा मोबाईल नंबर तुमच्या मूलांक व भाग्यांकाशी परिपूर्ण सुसंगत आहे.',
      unsuitableText: 'हा मोबाईल नंबर ग्रहीय संघर्षास कारणीभूत ठरतो. कृपया शिफारस केलेला नंबर निवडा.'
    },
    dailyRules: [
      { title: 'सकाळी सूर्यनारायणाला अर्घ्य (सकाळी ६:०० - ७:००)', desc: 'तांब्याच्या पात्रात जल, कुंकू व अक्षता घालून पूर्व दिशेकडे तोंड करून गायत्री मंत्रासह अर्घ्य द्यावे.' },
      { title: 'इष्टदेवाच्या बीज मंत्राचा नित्य जप (१०८ वेळा)', desc: 'रुद्राक्ष किंवा तुळशीच्या माळेवर आपल्या इष्टदेवतेच्या मंत्राचा शांत चित्ताने नित्य जप करावा.' },
      { title: 'गोसेवा व पक्ष्यांना दाणा-पाणी', desc: 'बुधवारी किंवा शनिवारी गाईला चारा/गूळ-पोळी द्यावी व पक्ष्यांना दाणे टाकावेत.' },
      { title: 'शुभ रंग व अंकांचा वापर', desc: 'महत्त्वाच्या मुलाखती, व्यावसायिक करार व प्रवासात आपल्या भाग्यशाली रंगांचा वापर करावा.' },
      { title: 'ईशान्य कोपऱ्यात संध्याकाळी दिवा', desc: 'दररोज संध्याकाळी घराच्या ईशान्य कोपऱ्यात गाईच्या शुद्ध तुपाचा दिवा लावावा.' }
    ],
    verdict: {
      heading: 'अंतिम ज्योतिषाचार्य निष्कर्ष व शुभाशीर्वाद',
      text: 'जातकाच्या पत्रिकेत धर्म, कर्म व भाग्याचा उत्तम संगम आहे. दररोज विहित नियमांचे पालन, बीज मंत्र जप व सात्त्विक आचरण ठेवल्यास सर्व ग्रहांचे दोष निवारण होऊन दीर्घायुष्य, उत्तम आरोग्य, संपत्ती व मान-सन्मान लाभेल. भगवान सूर्यनारायण व महादेवाची कृपा सदैव राहो.'
    }
  },

  te: {
    meta: {
      om: 'ఓం',
      title: 'AstroVeda • బృహత్ జన్మపత్రిక & సర్వతోభద్ర పరిహారాలు',
      subtitle: 'ప్రామాణిక సనాతన వైదిక జ్యోతిష్యం, అధునాతన సంఖ్యాశాస్త్రం & సమగ్ర జీవిత మార్గదర్శి',
      pageOf: 'పేజీ {p} / 9',
      helpline: 'ఆచార్య హెల్ప్‌లైన్: +91 901 908 8160 • వీఐపీ క్లయింట్ యాక్సెస్'
    },
    sections: {
      s1: '౧. జాతకుని పరిచయం & పవిత్ర జన్మ వివరాలు',
      janamNaamTitle: '🕉️ అవకహడ చక్రం ప్రకారం జన్మ నామాక్షరం',
      s2: '౨. పంచాంగం & ప్రాథమిక కుండలి అంశాలు',
      s3: '౩. జన్మ కుండలి చక్రాలు (లగ్నం & నవాంశ)',
      s4: '౪. స్పష్ట గ్రహ స్థితి, నక్షత్రం & గ్రహ బలం',
      s5: '౫. వింశోత్తరి మహర్దశ క్రమం & ప్రస్తుత గ్రహ కాలం',
      s6: '౬. కుండలిలో ఉన్న శుభ రాజయోగాలు',
      s7: '౭. దోష విశ్లేషణ & ప్రామాణిక వైదిక పరిహారాలు',
      s8: '౮. జన్మ అవకహడ శుభ అంశాల పట్టిక',
      s9: '౯. జీవనోపాధి, వృత్తి & వ్యాపార మార్గదర్శకత్వం',
      s10: '౧౦. వివాహ యోగం, దాంపత్య జీవితం & శుభ సమయం',
      s11: '౧౧. అధునాతన జ్యోతిష్య పరిహారాలు & రక్షణ',
      s12: '౧౨. జీవిత ముఖ్య రంగాల భవిష్యత్తు & పరిహారాలు',
      s13: '౧౩. సంఖ్యాశాస్త్రం & పవిత్ర లో-షూ చక్రం',
      s14: '౧౪. మొబైల్ సంఖ్య శుభ / అశుభ సమగ్ర విశ్లేషణ',
      s15: '౧౫. అత్యంత అనుకూలమైన మొబైల్ సంఖ్య సిఫార్సు బ్లూప్రింట్',
      s16: '౧౬. సమగ్ర జీవిత భవిష్యత్తు (ఆరోగ్యం, సంపద, వృత్తి, కుటుంబం)',
      s17: '౧౭. రాబోయే ౧౨ నెలల త్రైమాసిక జ్యోతిష్య అంచనాలు',
      s18: '౧౮. మహా పరిహార సూత్రాలు (మంత్ర జపం, రత్నధారణ, రుద్రాక్ష & కవచం)',
      s19: '౧౯. సమగ్ర జీవిత సారాంశం & జాతక మహా తీర్పు',
      s20: '౨౦. శుభ తత్వాల మాస్టర్ పట్టిక',
      s21: '౨౧. జీవితంలో విజయం సాధించడానికి ౫ సరళ నిత్య నియమాలు',
      s22: '౨౨. అంతిమ జ్యోతిష్యాచార్య తీర్పు & దైవాశీస్సులు'
    },
    fields: {
      name: 'జాతకుని పేరు',
      dob: 'జన్మ తేదీ',
      tob: 'జన్మ సమయం',
      pob: 'జన్మ స్థలం',
      father: 'తండ్రి పేరు',
      mother: 'తల్లి పేరు',
      phone: 'మొబైల్ / ఫోన్',
      coords: 'అక్షాంశం / రేఖాంశం',
      ayanamsa: 'అయనాంశ పద్ధతి',
      tz: 'సమయ మండలం',
      pada: 'పాదం',
      lagna: 'లగ్న రాశి',
      lagnaLord: 'లగ్నాధిపతి',
      moonSign: 'చంద్ర రాశి',
      moonLord: 'రాశ్యాధిపతి',
      nakshatra: 'జన్మ నక్షత్రం',
      sunSign: 'సూర్య రాశి',
      activeDasha: 'ప్రస్తుత మహర్దశ కాలం',
      planet: 'గ్రహం',
      sign: 'రాశి',
      degree: 'అంశ',
      navamsa: 'నవాంశ',
      house: 'స్థానం / భావం',
      status: 'స్థితి / బలం',
      speed: 'గతి (చలనం)',
      d1Chart: 'లగ్న కుండలి (డి-1)',
      d9Chart: 'నవాంశ కుండలి (డి-9)',
      luckyColor: 'శుభ రంగులు',
      luckyNum: 'శుభ సంఖ్యలు',
      luckyDay: 'శుభ వారాలు',
      ishtaDevata: 'ఇష్టదైవం & మూల మంత్రం',
      bestCareers: 'అనుకూల రంగాల ఎంపిక',
      mobileStatus: 'మొబైల్ శక్తి స్థితి',
      isSuitable: 'సంఖ్య అనుకూలత',
      prescribedSyllable: 'సూచించిన ప్రథమాక్షరం'
    },
    dignities: {
      Exalted: 'ఉచ్ఛ రాశి',
      Moolatrikona: 'మూలత్రికోణం',
      Own: 'స్వక్షేత్రం',
      GreatFriend: 'అధిమిత్ర రాశి',
      Friend: 'మిత్ర రాశి',
      Neutral: 'సమ రాశి',
      Enemy: 'శత్రు రాశి',
      GreatEnemy: 'అధిశత్రు రాశి',
      Debilitated: 'నీచ రాశి'
    },
    mobile: {
      auspicious: 'పరమ శుభ మరియు సానుకూల శక్తి (శుభ)',
      inauspicious: 'అశుభ మరియు వ్యతిరేక శక్తి (అశుభ)',
      suitableText: 'ఈ మొబైల్ సంఖ్య మీ మూలాంకం మరియు భాగ్యాంకంతో సంపూర్ణ అనుకూలతను కలిగి ఉంది.',
      unsuitableText: 'ఈ మొబైల్ సంఖ్య గ్రహాల శక్తులతో విభేదిస్తుంది. దయచేసి క్రింద సూచించిన అనుకూల సంఖ్యను తీసుకోండి.'
    },
    dailyRules: [
      { title: 'రోజూ ఉదయం సూర్యార్ఘ్యం (ఉదయం ౬:౦౦ - ౭:౦౦)', desc: 'రాగి పాత్రలో నీరు, అక్షతలు వేసి గాయత్రీ మంత్రంతో తూర్పు ముఖంగా సూర్య భగవానునికి అర్ఘ్యం సమర్పించండి.' },
      { title: 'ఇష్టదైవ నిత్య మంత్ర జపం (౧౦౮ సార్లు)', desc: 'తులసి లేదా రుద్రాక్ష మాలతో మీ ఇష్టదైవ మంత్రాన్ని నిత్యం భక్తితో జపించండి.' },
      { title: 'గోసేవ మరియు పక్షులకు దాణా', desc: 'బుధవారం లేదా శనివారం గోవుకు పచ్చగడ్డి తినిపించండి మరియు పక్షులకు ధాన్యం వేయండి.' },
      { title: 'శుభ రంగులు మరియు సంఖ్యల వినియోగం', desc: 'ముఖ్యమైన ఇంటర్వ్యూలు, ఒప్పందాలు మరియు ప్రయాణాలలో మీ అదృష్ట రంగు దుస్తులు ధరించండి.' },
      { title: 'ఈశాన్య మూలలో సంధ్యా దీపారాధన', desc: 'ప్రతిరోజూ సాయంత్రం ఇంట్లో ఈశాన్య దిశలో స్వచ్ఛమైన ఆవు నెయ్యితో దీపం వెలిగించండి.' }
    ],
    verdict: {
      heading: 'అంతిమ జ్యోతిష్యాచార్య తీర్పు మరియు శుభాశీస్సులు',
      text: 'జాతకుని కుండలిలో ధర్మ, అర్థ, కామ మరియు మోక్షాల సమన్వయం ఉన్నది. సూచించిన వైదిక నియమాలు, దినచర్య మంత్ర జపం మరియు సదాచారాన్ని పాటించడం వలన సమస్త గ్రహదోషాలు నివారించబడి దీర్ಘాయుష్షు, ఆరోగ్యం, ఐశ్వర్యం మరియు కీర్తి లభిస్తాయి. శ్రీ సూర్యనారాయణ మరియు పరమేశ్వరుని కృపాకటాక్షాలు ఎల్లవేళలా ఉండుగాక.'
    }
  }
};

export const LOCALIZED_RASHIS = {
  1: { en: 'Aries', hi: 'मेष', kn: 'ಮೇಷ', mr: 'मेष', te: 'మేషం', symbol: '♈' },
  2: { en: 'Taurus', hi: 'वृषभ', kn: 'ವೃಷಭ', mr: 'वृषभ', te: 'వృషభం', symbol: '♉' },
  3: { en: 'Gemini', hi: 'मिथुन', kn: 'ಮಿಥುನ', mr: 'मिथुन', te: 'మిథునం', symbol: '♊' },
  4: { en: 'Cancer', hi: 'कर्क', kn: 'ಕರ್ಕಾಟಕ', mr: 'कर्क', te: 'కర్కాటకం', symbol: '♋' },
  5: { en: 'Leo', hi: 'सिंह', kn: 'ಸಿಂಹ', mr: 'सिंह', te: 'సింహం', symbol: '♌' },
  6: { en: 'Virgo', hi: 'कन्या', kn: 'ಕನ್ಯಾ', mr: 'कन्या', te: 'కన్య', symbol: '♍' },
  7: { en: 'Libra', hi: 'तुला', kn: 'ತುಲಾ', mr: 'तुळ', te: 'తులా', symbol: '♎' },
  8: { en: 'Scorpio', hi: 'वृश्चिक', kn: 'ವೃಶ್ಚಿಕ', mr: 'वृश्चिक', te: 'వృశ్చికం', symbol: '♏' },
  9: { en: 'Sagittarius', hi: 'धनु', kn: 'ಧನು', mr: 'धनू', te: 'ధనుస్సు', symbol: '♐' },
  10: { en: 'Capricorn', hi: 'मकर', kn: 'ಮಕರ', mr: 'मकर', te: 'మకరం', symbol: '♑' },
  11: { en: 'Aquarius', hi: 'कुम्भ', kn: 'ಕುಂಭ', mr: 'कुंभ', te: 'కుంభం', symbol: '♒' },
  12: { en: 'Pisces', hi: 'मीन', kn: 'ಮೀನ', mr: 'मीन', te: 'మీనం', symbol: '♓' }
};

export const LOCALIZED_PLANETS = {
  Sun: { en: 'Sun', hi: 'सूर्य', kn: 'ಸೂರ್ಯ', mr: 'सूर्य', te: 'సూర్యుడు', abbr: 'Su', symbol: '☉' },
  Moon: { en: 'Moon', hi: 'चन्द्र', kn: 'ಚಂದ್ರ', mr: 'चंद्र', te: 'చంద్రుడు', abbr: 'Mo', symbol: '☽' },
  Mars: { en: 'Mars', hi: 'मंगल', kn: 'ಮಂಗಳ', mr: 'ಮಂಗಳ', te: 'కుజుడు', abbr: 'Ma', symbol: '♂' },
  Mercury: { en: 'Mercury', hi: 'बुध', kn: 'ಬುಧ', mr: 'बुध', te: 'బుధుడు', abbr: 'Me', symbol: '☿' },
  Jupiter: { en: 'Jupiter', hi: 'गुरु', kn: 'ಗುರು', mr: 'गुरू', te: 'గురువు', abbr: 'Ju', symbol: '♃' },
  Venus: { en: 'Venus', hi: 'शुक्र', kn: 'ಶುಕ್ರ', mr: 'शुक्र', te: 'శుక్రుడు', abbr: 'Ve', symbol: '♀' },
  Saturn: { en: 'Saturn', hi: 'शनि', kn: 'ಶನಿ', mr: 'शनी', te: 'శని', abbr: 'Sa', symbol: '♄' },
  Rahu: { en: 'Rahu', hi: 'राहु', kn: 'ರಾಹು', mr: 'राहू', te: 'రాహువు', abbr: 'Ra', symbol: '☊' },
  Ketu: { en: 'Ketu', hi: 'केतु', kn: 'ಕೇತು', mr: 'केतू', te: 'కేతువు', abbr: 'Ke', symbol: '☋' },
  Ascendant: { en: 'Ascendant', hi: 'लग्न', kn: 'ಲಗ್ನ', mr: 'लग्न', te: 'లగ్నం', abbr: 'As', symbol: 'ASC' }
};

export function getPatrikaText(lang = 'hi') {
  return PATRIKA_TRANSLATIONS[lang] || PATRIKA_TRANSLATIONS.hi;
}
