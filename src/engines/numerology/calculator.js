/**
 * AstroVeda - Advanced Vedic & Chaldean Numerology Engine
 * Includes Mulank (Driver), Bhagyank (Conductor), Chaldean & Pythagorean Name numbers,
 * Lo Shu Grid 3x3 Magic Square analysis, 8 Planes of strength, Mobile Number numerology,
 * Name Spelling Optimization, and Missing Numbers Multi-Layered Remedies.
 */

// Chaldean letter vibration values
export const CHALDEAN_MAP = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

// Pythagorean letter values
export const PYTHAGOREAN_MAP = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

export const PLANET_NUMBER_MAP = {
  1: { planet: 'Sun', planetHi: 'सूर्य', nature: 'King / Leader', color: 'Gold, Orange, Ruby Red', gem: 'Ruby (माणिक्य)', metal: 'Gold, Copper', days: ['Sunday'], friendly: [1, 2, 3, 5, 9], enemy: [6, 8], neutral: [4, 7] },
  2: { planet: 'Moon', planetHi: 'चन्द्र', nature: 'Queen / Intuitive', color: 'White, Cream, Silver', gem: 'Pearl (मोती)', metal: 'Silver', days: ['Monday'], friendly: [1, 2, 3, 5], enemy: [8, 9], neutral: [4, 6, 7] },
  3: { planet: 'Jupiter', planetHi: 'गुरु', nature: 'Guru / Counselor', color: 'Yellow, Saffron', gem: 'Yellow Sapphire (पुखराज)', metal: 'Gold, Brass', days: ['Thursday'], friendly: [1, 2, 3, 9], enemy: [6], neutral: [4, 5, 7, 8] },
  4: { planet: 'Rahu', planetHi: 'राहु', nature: 'Innovator / Rebel', color: 'Blue, Grey, Electric Brown', gem: 'Hessonite (गोमेद)', metal: 'Alloy', days: ['Saturday', 'Sunday'], friendly: [1, 5, 6, 7], enemy: [2, 4, 8, 9], neutral: [3] },
  5: { planet: 'Mercury', planetHi: 'बुध', nature: 'Prince / Trader', color: 'Emerald Green, Turquoise', gem: 'Emerald (पन्ना)', metal: 'Bronze, Brass', days: ['Wednesday'], friendly: [1, 2, 3, 5, 6], enemy: [], neutral: [4, 7, 8, 9] },
  6: { planet: 'Venus', planetHi: 'शुक्र', nature: 'Preceptor / Artist', color: 'Pastel Blue, Diamond White, Pink', gem: 'Diamond (हीरा) / Opal', metal: 'Silver, Platinum', days: ['Friday'], friendly: [1, 4, 5, 6, 7], enemy: [3], neutral: [2, 8, 9] },
  7: { planet: 'Ketu', planetHi: 'केतु', nature: 'Mystic / Researcher', color: 'White, Smoky Grey, Light Green', gem: 'Cat’s Eye (लहसुनिया)', metal: 'Iron, Silver', days: ['Tuesday', 'Thursday'], friendly: [1, 4, 5, 6], enemy: [2, 9], neutral: [3, 7, 8] },
  8: { planet: 'Saturn', planetHi: 'शनि', nature: 'Judge / Karmic Ruler', color: 'Navy Blue, Black, Dark Violet', gem: 'Blue Sapphire (नीलम) / Amethyst', metal: 'Iron', days: ['Saturday'], friendly: [3, 5, 6], enemy: [1, 2, 4, 9], neutral: [7, 8] },
  9: { planet: 'Mars', planetHi: 'मंगल', nature: 'Commander / Warrior', color: 'Crimson, Blood Red, Coral', gem: 'Red Coral (मूँगा)', metal: 'Copper', days: ['Tuesday'], friendly: [1, 2, 3, 5], enemy: [2, 4, 8], neutral: [6, 7] }
};

// Esoteric Chaldean Compound Meanings
export const CHALDEAN_COMPOUND_MAP = {
  10: 'The Wheel of Fortune (भाग्य चक्र) - Highly fortunate; symbolizes honor, faith, and self-confidence. Can achieve any ambition.',
  11: 'The Clenched Fist (चेतावनी) - High spiritual trials, hidden rivals, high intuitive power requiring wise discernment.',
  12: 'The Sacrifice (त्याग) - Mental anxiety, warns against self-sacrifice or false promises from associates.',
  13: 'Regeneration & Power (पुनरुत्थान) - Sudden upheaval, breakthrough change, power when handled with high wisdom.',
  14: 'Movement & Challenge (गतिशीलता) - High versatility, commerce, risk management; financial gains through prudent enterprise.',
  15: 'The Magician (जादूगर / आकर्षण) - Venusian magnetism, eloquence, artistic gifts, luxury, wealth, and profound personal charm.',
  16: 'The Shattered Citadel (ध्वस्त दुर्ग) - Warns against false pride or risky partnerships; requires humility and dharma.',
  17: 'The Star of the Magi (ज्ञान का तारा) - Immense spiritual brilliance, immortality of name, enduring peace and success.',
  18: 'Spiritual Conflict (द्वंद्व) - Internal struggle, deceptive friendships, calls for unwavering integrity and Kavach.',
  19: 'The Prince of the Heavens (सूर्य विजय) - Supreme auspiciousness, victory over adversaries, fame, vitality, and fulfillment.',
  20: 'The Awakening (चेतना उदय) - New purpose, spiritual awakening, delayed material fruits, noble ideals.',
  21: 'The Crown of the Magi (विजय मुकुट) - Complete advancement, global recognition, elevated honor, supreme victory.',
  22: 'Master Builder (महा-निर्माता) - Tremendous visionary ambition, master architect of large enterprises; warns against illusion.',
  23: 'The Royal Star of the Lion (सिंह तारा) - Supreme royal luck, protection from high quarters, victory in disputes, commanding success.',
  24: 'Love & Material Fortune (प्रेम व समृद्धि) - Attracts wealth through high connections, artistic favor, harmonious alliances.',
  25: 'Wisdom through Experience (अनुभवजन्य ज्ञान) - Spiritual growth through trials; philosophical intellect and research mastery.',
  26: 'Karmic Partnership (साझेदारी परीक्षा) - Warns against unwise speculation or toxic business partnerships; requires strict legal discipline.',
  27: 'The Sceptre (राजदंड) - Supreme executive authority, intellect, command over masses, and literary or administrative honor.',
  28: 'The Trusting Lamb (सावधानी) - Financial contradictions, sudden reversals if trusting blindly; calls for solid contracts.',
  29: 'Uncertainty & Deception (धोखा चेतावनी) - Emotional vulnerability, trials in love, requires grounding and spiritual shield.',
  30: 'The Scholar (विद्वान) - Superior intellectual power, philosophical mastery, indifference to superficial wealth.',
  31: 'The Solitary Thinker (एकांत विचारक) - Deeply intellectual, isolated from crowds, introverted brilliance.',
  32: 'Magnetic Communication (वाक् सिद्धि) - Unrivaled commercial eloquence, persuasive magnetism, global trading success.',
  33: 'Master Teacher (महा-गुरु) - Spiritual teacher, compassion, universal welfare, protected by Jupiter and Venus.',
  34: 'Practical Wisdom (व्यावहारिक उन्नति) - Hard work crowned with eventual solid fortune; steady accumulation of assets.',
  35: 'Fluctuating Wealth (परिवर्तनशील धन) - Financial ups and downs; caution needed in real estate or speculative loans.',
  36: 'The Leader (नायक) - Self-made authority through sheer grit; success in industrial or executive domains.',
  37: 'Good Fortune & Alliances (परम शुभ योग) - Superb luck, harmonious partnerships, wealth, and happy domestic and social life.',
  38: 'Gentle Magnetism (सौम्य आकर्षण) - Artistic acclaim, influential friends; caution against hasty romantic decisions.',
  39: 'Dynamic Ambition (तीव्र महत्वाकांक्षा) - Fiery willpower, high stamina, triumph over competitors in tough circumstances.',
  40: 'Revolutionary Thinker (क्रांतिकारी) - Unconventional vision, sudden changes of fortune, unconventional path.',
  41: 'Executive Command (अधिकार) - Leadership, commercial acumen, commanding personality, high professional rank.',
  42: 'Artistic Harmony (कलात्मक संतुलन) - Love, aesthetic refinement, domestic peace, prosperous partnerships.',
  43: 'Unfortunate Star (संघर्ष) - Warns against sudden setbacks, litigation, or impulsive business steps.',
  44: 'Double Karmic Trial (कर्म भार) - Heavy responsibilities, delayed rewards; requires unwavering integrity and patience.',
  45: 'Commercial Victory (व्यापारिक विजय) - High trade success, intelligence, quick financial recovery from any obstacle.',
  46: 'The Crown of Wealth (धन मुकुट) - Immense affluence, prosperity, royal patronages, luxury lifestyle.',
  47: 'Intuitive Insight (गूढ़ अंतर्दृष्टि) - Deep occult, research, or counseling capability; spiritual wealth.',
  48: 'Karmic Discipline (शनि न्याय) - Stern karmic tests; ultimate endurance and honor through ethical conduct.',
  49: 'Transformation (परिवर्तन) - High energy, rapid turns of fortune, requires disciplined meditation.',
  50: 'Intellectual Expansion (ज्ञान विस्तार) - Rapid mental faculties, writing, trade, versatile communication prowess.',
  51: 'Warrior Spirit (योद्धा) - Fiery courage, swift breakthrough, leadership in crisis, dynamic success.',
  52: 'Guardianship (संरक्षण) - Caution against hidden enemies; need for spiritual vigilance.'
};

// Reduce number to single digit
export function reduceToSingle(num) {
  let val = Math.abs(num);
  while (val > 9) {
    val = String(val).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return val;
}

// Calculate Chaldean Name Total
export function calculateChaldean(name) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (let ch of clean) {
    sum += CHALDEAN_MAP[ch] || 0;
  }
  const single = reduceToSingle(sum);
  const compoundMeaning = CHALDEAN_COMPOUND_MAP[sum] || `Governed by single vibration ${single} (${PLANET_NUMBER_MAP[single]?.planet || 'Benefic'}).`;

  return {
    compound: sum,
    single: single,
    compoundMeaning: compoundMeaning
  };
}

// Calculate Pythagorean Name Total
export function calculatePythagorean(name) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  let vowelsSum = 0;
  let consonantsSum = 0;
  const vowels = ['A', 'E', 'I', 'O', 'U'];

  for (let ch of clean) {
    const val = PYTHAGOREAN_MAP[ch] || 0;
    sum += val;
    if (vowels.includes(ch)) vowelsSum += val;
    else consonantsSum += val;
  }

  return {
    expression: reduceToSingle(sum),
    soulUrge: reduceToSingle(vowelsSum),
    personality: reduceToSingle(consonantsSum)
  };
}

// Build Lo Shu Grid from birthdate
export function generateLoShuGrid(birthDate) {
  const digits = birthDate.replace(/[^0-9]/g, '').split('').map(Number);
  
  // Lo Shu standard position:
  // [4, 9, 2]
  // [3, 5, 7]
  // [8, 1, 6]
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  digits.forEach(d => {
    if (d >= 1 && d <= 9) counts[d]++;
  });

  // Check Lo Shu Planes with completion percentage
  const rawPlanes = [
    { name: 'Mental Plane (4-9-2)', hi: 'मानसिक तल', digits: [4, 9, 2], desc: 'Brilliant intellectual memory, sharp analytical depth, and clear conceptualization.' },
    { name: 'Emotional Plane (3-5-7)', hi: 'भावनात्मक तल', digits: [3, 5, 7], desc: 'Deep intuition, empathy, artistic spirituality, and heartfelt connection.' },
    { name: 'Practical Plane (8-1-6)', hi: 'व्यावहारिक तल', digits: [8, 1, 6], desc: 'Pragmatic material execution, financial stability, and hands-on diligence.' },
    { name: 'Thought Plane (4-3-8)', hi: 'विचार तल', digits: [4, 3, 8], desc: 'Original vision, strong principles, and visionary long-term planning.' },
    { name: 'Will Plane (9-5-1)', hi: 'संकल्प तल', digits: [9, 5, 1], desc: 'Indomitable willpower, perseverance, courage, and executive drive.' },
    { name: 'Action Plane (2-7-6)', hi: 'कर्म तल', digits: [2, 7, 6], desc: 'Spontaneous energy to transform thoughts straight into manifested deeds.' },
    { name: 'Golden Raj Yoga (4-5-6)', hi: 'स्वर्ण राजयोग', digits: [4, 5, 6], desc: 'Brings immense material wealth, luxury, public stature, and prosperity.' },
    { name: 'Silver Earth Yoga (2-5-8)', hi: 'रजत भू-योग', digits: [2, 5, 8], desc: 'Mastery over real estate, land, construction, and grounded stability.' }
  ];

  const planes = rawPlanes.map(p => {
    const presentCount = p.digits.filter(d => counts[d] > 0).length;
    const isActive = presentCount === 3;
    let statusText = 'Dormant (0%)';
    let statusHi = 'निष्क्रिय';
    if (presentCount === 3) { statusText = 'Active (100%)'; statusHi = 'सक्रिय (पूर्ण)'; }
    else if (presentCount === 2) { statusText = 'Partial (66%)'; statusHi = 'आंशिक'; }
    else if (presentCount === 1) { statusText = 'Nascent (33%)'; statusHi = 'प्रारंभिक'; }

    return {
      ...p,
      presentCount,
      percent: Math.round((presentCount / 3) * 100),
      active: isActive,
      statusText,
      statusHi
    };
  });

  // Missing numbers with enriched remedies
  const missingNumbers = [];
  const missingRemedies = {
    1: {
      planet: 'Sun',
      element: 'Water/Career',
      color: 'Red / Copper',
      crystal: 'Ruby / Sunstone',
      remedy: 'Offer Arghya to Lord Surya every morning in a copper vessel with red sandalwood. Carry a red handkerchief, keep North clutter-free.'
    },
    2: {
      planet: 'Moon',
      element: 'Earth/Sensitivity',
      color: 'White / Silver',
      crystal: 'Natural Pearl / Moonstone',
      remedy: 'Drink water from a pure silver tumbler, seek maternal blessings daily, place a crystal quartz in South-West.'
    },
    3: {
      planet: 'Jupiter',
      element: 'Wood/Wisdom',
      color: 'Yellow / Saffron',
      crystal: 'Yellow Sapphire / Citrine',
      remedy: 'Apply yellow sandalwood tilak, respect spiritual elders, keep healthy green bamboo plants in East zone.'
    },
    4: {
      planet: 'Rahu',
      element: 'Wood/Discipline',
      color: 'Brown / Green',
      crystal: 'Hessonite / Green Aventurine',
      remedy: 'Hang a 4-rod wooden windchime in South-East, maintain immaculate organization on your work desk.'
    },
    5: {
      planet: 'Mercury',
      element: 'Earth/Central Luck',
      color: 'Emerald Green',
      crystal: 'Emerald / Green Jade',
      remedy: 'Keep Brahmasthan (center of home) open and well-lit. Wear green clothes on Wednesdays, place a green crystal pyramid.'
    },
    6: {
      planet: 'Venus',
      element: 'Metal/Luxury & Help',
      color: 'Diamond White / Cream',
      crystal: 'Diamond / White Quartz',
      remedy: 'Wear neat, fragrant clothes. Use natural sandalwood or rose attar. Place metallic artifacts or windchimes in North-West.'
    },
    7: {
      planet: 'Ketu',
      element: 'Metal/Spiritual Growth',
      color: 'Smoky Grey / Silver',
      crystal: 'Cat’s Eye / Smoky Quartz',
      remedy: 'Feed stray dogs on Tuesdays/Saturdays. Wear a multi-color thread or metallic silver watch in West.'
    },
    8: {
      planet: 'Saturn',
      element: 'Earth/Intuition & Focus',
      color: 'Navy Blue / Black',
      crystal: 'Blue Sapphire / Amethyst',
      remedy: 'Light a mustard oil lamp on Saturday evenings. Maintain disciplined routine and be generous to domestic helpers.'
    },
    9: {
      planet: 'Mars',
      element: 'Fire/Fame & Courage',
      color: 'Crimson / Orange',
      crystal: 'Red Coral / Carnelian',
      remedy: 'Recite Hanuman Chalisa on Tuesdays. Donate jaggery and masoor dal. Keep South zone energized with warm lighting.'
    }
  };

  for (let num = 1; num <= 9; num++) {
    if (counts[num] === 0) {
      const info = missingRemedies[num];
      missingNumbers.push({
        number: num,
        planet: info.planet,
        element: info.element,
        color: info.color,
        crystal: info.crystal,
        remedy: info.remedy
      });
    }
  }

  return {
    grid: [
      [counts[4], counts[9], counts[2]],
      [counts[3], counts[5], counts[7]],
      [counts[8], counts[1], counts[6]]
    ],
    counts: counts,
    planes: planes,
    missingNumbers: missingNumbers,
    activePlanesCount: planes.filter(p => p.active).length
  };
}

// Analyze Mobile Phone Number
// Comprehensive Mobile Phone Number Shubh / Ashubh Analysis
export function analyzeMobileNumber(phoneStr, userMulank = null, userBhagyank = null, missingLoShuNumbers = []) {
  const digitsOnly = (phoneStr || "").replace(/[^0-9]/g, "");
  const suggestions = getBestMobileNumberSuggestions(userMulank, userBhagyank, missingLoShuNumbers);

  if (!digitsOnly || digitsOnly.length < 5) {
    return {
      provided: false,
      phoneNumber: phoneStr || "Not Specified",
      compoundSum: 0,
      singleNumber: 5,
      rulingPlanet: "Mercury",
      rulingPlanetHi: "बुध",
      nature: "Commercial & Versatile",
      shubhStatus: "तटस्थ / सामान्य (General)",
      shubhBadgeColor: "#D97706",
      isHarmoniousWithClient: true,
      isSuitable: true,
      suitabilityVerdict: "नया नंबर चुनने हेतु नीचे दिए गए ब्लूप्रिंट का उपयोग करें",
      suitabilityReasons: ["कोई मोबाइल नंबर प्रदान नहीं किया गया है; नए नंबर हेतु नीचे दिए गए शुभ सुझाव देखें।"],
      advice: "अपने मूलांक व भाग्यांक के अनुकूल नए सिम कार्ड के चयन हेतु नीचे दिए गए सर्वोत्तम सुझावों एवं ब्लूप्रिंट का पालन करें।",
      isMasterVip: false,
      mulankRelation: "तटस्थ (Neutral)",
      bhagyankRelation: "तटस्थ (Neutral)",
      endingDigit: {
        digit: 5,
        status: "शुभ",
        meaning: "अंक 1, 5 अथवा 6 पर अंत होने वाले मोबाइल नंबर व्यापार, समृद्धि एवं नेतृत्व हेतु सर्वोत्तम होते हैं।"
      },
      keyPairs: [],
      excessiveDigits: [],
      professionSuitability: "ऐसा नंबर चुनें जिसका कुल योग 1, 5 या 6 हो तथा अंत भी 1, 5 या 6 पर हो।",
      remedies: {
        wallpaper: "उदित होते भगवान सूर्य व गायत्री यंत्र का वॉलपेपर",
        coverColor: "स्वर्ण, पीला अथवा एमराल्ड हरा",
        numericalYantra: "कागज़ पर अष्टगंध या हरी स्याही से शुभ अंक लिखकर बैक कवर में रखें।",
        callingMantra: "महत्वपूर्ण कॉल से पूर्व ३ बार \"ॐ गं गणपतये नमः\" का जप करें।"
      },
      favorableEndingDigits: [1, 5, 6],
      digitsToAvoid: [4, 8, 0],
      digitFrequency: {},
      suggestions: suggestions
    };
  }

  let sum = 0;
  for (let d of digitsOnly) sum += parseInt(d, 10);
  const totalSingle = reduceToSingle(sum);
  const info = PLANET_NUMBER_MAP[totalSingle] || PLANET_NUMBER_MAP[5];

  // VIP Founder / Master Helpline recognition
  const isMasterVip = digitsOnly.includes("9019088160");

  // Client Harmony (Mulank & Bhagyank check)
  let isHarmonious = true;
  let mulankRelation = "मित्र (Friendly)";
  let bhagyankRelation = "मित्र (Friendly)";

  if (userMulank) {
    if (PLANET_NUMBER_MAP[userMulank]?.enemy.includes(totalSingle)) {
      isHarmonious = false;
      mulankRelation = "शत्रु / विरोधी (Enemy)";
    } else if (PLANET_NUMBER_MAP[userMulank]?.neutral.includes(totalSingle)) {
      mulankRelation = "तटस्थ (Neutral)";
    }
  }

  if (userBhagyank) {
    if (PLANET_NUMBER_MAP[userBhagyank]?.enemy.includes(totalSingle)) {
      isHarmonious = false;
      bhagyankRelation = "शत्रु / विरोधी (Enemy)";
    } else if (PLANET_NUMBER_MAP[userBhagyank]?.neutral.includes(totalSingle)) {
      bhagyankRelation = "तटस्थ (Neutral)";
    }
  }

  // Ending Digit Analysis
  const lastDigit = parseInt(digitsOnly.slice(-1), 10);
  let endingStatus = "शुभ (Auspicious)";
  let endingMeaning = "";

  if ([1, 5, 6].includes(lastDigit)) {
    endingStatus = "परम शुभ (Highly Favorable)";
    endingMeaning = lastDigit === 1 
      ? "अंक 1 (सूर्य) पर अंत: नेतृत्व क्षमता, प्रशासनिक सम्मान, उच्च प्रतिष्ठा और निर्णय शक्ति में वृद्धि करता है।"
      : (lastDigit === 5 
        ? "अंक 5 (बुध) पर अंत: व्यापारिक चतुरता, तीव्र संवाद, बहुमुखी धन लाभ और नेटवर्क विस्तार में अत्यंत सहायक है।"
        : "अंक 6 (शुक्र) पर अंत: भौतिक सुख, धन-वैभव, आकर्षण, सौहार्दपूर्ण संबंध और विलासिता को आकर्षित करता है।");
  } else if ([3, 7].includes(lastDigit)) {
    endingStatus = "शुभ (Favorable for Advisory)";
    endingMeaning = lastDigit === 3
      ? "अंक 3 (गुरु) पर अंत: ज्ञान, परामर्श, बौद्धिक प्रतिष्ठा, शिक्षण और आध्यात्मिक मार्गदर्शन के लिए शुभ फलदायी है।"
      : "अंक 7 (केतु) पर अंत: शोध, गूढ़ विद्या, तकनीकी विश्लेषण और स्वतंत्र चिंतन हेतु उत्तम; विशुद्ध भौतिक लोभ से दूर रखता है।";
  } else if (lastDigit === 2) {
    endingStatus = "मध्यम / संवेदनशील (Average / Fluctuating)";
    endingMeaning = "अंक 2 (चन्द्र) पर अंत: भावनात्मक संवेदनशीलता बढ़ाता है, किन्तु वार्तालाप में अनिर्णय या मूड में उतार-चढ़ाव ला सकता है।";
  } else {
    endingStatus = "अशुभ / वर्जित (Inauspicious / Avoid)";
    endingMeaning = lastDigit === 4
      ? "अंक 4 (राहु) पर अंत: आकस्मिक तकनीकी रुकावटें, अप्रत्याशित खर्चे, फोन पर भ्रम या विवाद उत्पन्न कर सकता है।"
      : (lastDigit === 8
        ? "अंक 8 (शनि) पर अंत: कार्यों में भारी विलंब, कड़े संघर्ष, कठोर सौदेबाजी और मानसिक तनाव उत्पन्न करता है।"
        : "अंक 0 (शून्य) पर अंत: ऊर्जा का क्षरण करता है; बने-बनाए व्यावसायिक अवसर हाथ से फिसलने का भय रहता है।");
  }

  // Internal Digit Pairings
  const pairsFound = [];
  const phoneText = digitsOnly;
  if (phoneText.includes("15") || phoneText.includes("51")) {
    pairsFound.push({ pair: "1-5 (बुधादित्य युति)", type: "shubh", desc: "सूर्य व बुध का शुभ संगम; व्यापारिक विस्तार, बौद्धिक निर्णय और प्रशासनिक अनुबंधों में उच्च सफलता दिलाता है।" });
  }
  if (phoneText.includes("56") || phoneText.includes("65")) {
    pairsFound.push({ pair: "5-6 (लक्ष्मी योग)", type: "shubh", desc: "बुध व शुक्र का मधुर योग; धन प्रवाह, संपत्तियों के सौदे, ग्लैमर एवं उच्चवर्गीय संपर्कों से लाभ कराता है।" });
  }
  if (phoneText.includes("33")) {
    pairsFound.push({ pair: "3-3 (द्वि-गुरु योग)", type: "shubh", desc: "अगाध विवेक, सलाहकार क्षमता और आध्यात्मिक व बौद्धिक सम्मान दिलाता है।" });
  }
  if (phoneText.includes("99")) {
    pairsFound.push({ pair: "9-9 (द्वि-मंगल शौर्य)", type: "neutral", desc: "अत्यधिक ऊर्जा व त्वरित निर्णय शक्ति; आवेश पर नियंत्रण रखना आवश्यक है।" });
  }
  if (phoneText.includes("48") || phoneText.includes("84")) {
    pairsFound.push({ pair: "4-8 (शनि-राहु दोष)", type: "ashubh", desc: "राहु व शनि की युति; आकस्मिक रुकावटें, तकनीकी खराबी या कानूनी अड़चनों का जोखिम बढ़ाती है।" });
  }
  if (phoneText.includes("24") || phoneText.includes("42")) {
    pairsFound.push({ pair: "2-4 (चन्द्र-राहु ग्रहण योग)", type: "ashubh", desc: "कॉल पर मानसिक व्यग्रता, संशय या अनावश्यक आशंकाएं पैदा कर सकता है।" });
  }
  if (phoneText.includes("88")) {
    pairsFound.push({ pair: "8-8 (द्वि-शनि विलंब)", type: "ashubh", desc: "सौदों के अंतिम समय पर अटकने या अत्यधिक विलंब का कारण बनता है।" });
  }

  // Digit frequency
  const freq = {};
  for (let d of phoneText) freq[d] = (freq[d] || 0) + 1;

  const excessiveDigits = [];
  for (let d in freq) {
    if (freq[d] >= 3 && ["4", "8", "2", "0"].includes(d)) {
      excessiveDigits.push(`अंक "${d}" की ${freq[d]} बार आवृत्ति है (अत्यधिक ऊर्जा संचय, जिसे संतुलित करना आवश्यक है)।`);
    }
  }

  // Chaldean inauspicious compounds check
  const inauspiciousCompounds = {
    16: "The Shattered Citadel (आकस्मिक हानि, योजना भंग व पतन)",
    18: "Conflict & Betrayal (कटुता, विवाद, शत्रुता व धोखा)",
    26: "Partnership Disaster (साझेदारी में विश्वासघात व भारी नुकसान)",
    28: "Litigation & Burden (कानूनी अड़चनें व अत्यधिक संघर्ष)",
    44: "Heavy Delays & Strife (दोहरा राहु - भारी संघर्ष व विलंब)"
  };

  // Comprehensive Suitability Check
  const suitabilityReasons = [];
  let isSuitable = true;

  if (isMasterVip) {
    isSuitable = true;
    suitabilityReasons.push("AstroVeda का मास्टर वीआईपी हेल्पलाइन नंबर (+91 901 908 8160) - अखंड राजयोग ऊर्जा व परम सिद्ध वाइब्रेशन।");
  } else {
    if (!isHarmonious) {
      isSuitable = false;
      if (mulankRelation.includes("शत्रु")) {
        suitabilityReasons.push(`एकल अंक ${totalSingle} (${info.planetHi}) आपके मूलांक ${userMulank} का शत्रु अंक है, जो व्यक्तित्व व ऊर्जा में अंतर्विरोध उत्पन्न करता है।`);
      }
      if (bhagyankRelation.includes("शत्रु")) {
        suitabilityReasons.push(`एकल अंक ${totalSingle} (${info.planetHi}) आपके भाग्यांक ${userBhagyank} का शत्रु अंक है, जो भाग्य व अवसरों में रुकावट डालता है।`);
      }
    }

    if ([4, 8, 0].includes(lastDigit)) {
      isSuitable = false;
      suitabilityReasons.push(`नंबर का अंतिम अंक [${lastDigit}] वर्जित है (${lastDigit === 0 ? "शून्य ऊर्जा का क्षरण व अवसर हानि करता है" : (lastDigit === 4 ? "राहु अचानक बाधाएं व खर्चे लाता है" : "शनि भारी विलंब व तनाव कराता है")})।`);
    }

    if ([4, 8].includes(totalSingle)) {
      isSuitable = false;
      suitabilityReasons.push(`कुल एकल योग ${totalSingle} (${info.planetHi}) सामान्य संचार व दैनिक प्रगति हेतु अवरोधक माना जाता है।`);
    }

    if (inauspiciousCompounds[sum]) {
      isSuitable = false;
      suitabilityReasons.push(`संयुक्त योग ${sum} एक चुनौतीपूर्ण यौगिक अंक है: ${inauspiciousCompounds[sum]}।`);
    }

    const ashubhPairs = pairsFound.filter(p => p.type === "ashubh");
    if (ashubhPairs.length > 0) {
      isSuitable = false;
      ashubhPairs.forEach(p => suitabilityReasons.push(`अशुभ युति उपस्थित है: ${p.pair} - ${p.desc}`));
    }

    if (excessiveDigits.length > 0) {
      excessiveDigits.forEach(e => suitabilityReasons.push(e));
    }
  }

  if (isSuitable && suitabilityReasons.length === 0) {
    suitabilityReasons.push(`कुल योग ${sum} (एकल ${totalSingle}) तथा अंतिम अंक ${lastDigit} आपके मूलांक व भाग्यांक के पूर्णतः अनुकूल एवं प्रगतिशील हैं।`);
  }

  // Shubh vs Ashubh Verdict
  let shubhStatus = "शुभ (Favorable)";
  let shubhBadgeColor = "#15803D";
  if (isMasterVip) {
    shubhStatus = "परम राजयोग शुभ (Royal Supreme)";
    shubhBadgeColor = "#B45309";
  } else if (!isSuitable) {
    shubhStatus = "अशुभ / प्रतिकूल (Not Suitable / Clashing)";
    shubhBadgeColor = "#DC2626";
  } else if (mulankRelation.includes("मित्र") && bhagyankRelation.includes("मित्र") && [1, 5, 6].includes(totalSingle) && [1, 5, 6].includes(lastDigit)) {
    shubhStatus = "परम शुभ (Highly Auspicious)";
    shubhBadgeColor = "#15803D";
  } else if (mulankRelation.includes("तटस्थ") || bhagyankRelation.includes("तटस्थ")) {
    shubhStatus = "सामान्य / मध्यम (Average)";
    shubhBadgeColor = "#D97706";
  }

  // Profession suitability
  let professionSuitability = "";
  if (totalSingle === 1) professionSuitability = "कंपनी निदेशक, प्रशासनिक अधिकारी, राजनेता, स्वतंत्र उद्यमी एवं शीर्ष नेतृत्व वर्ग।";
  else if (totalSingle === 5) professionSuitability = "व्यापारी, ई-कॉमर्स, शेयर बाजार, सीए, डिजिटल मार्केटिंग, मीडिया एवं जनसंपर्क।";
  else if (totalSingle === 6) professionSuitability = "लग्जरी ब्रांड्स, रियल एस्टेट, फैशन, मनोरंजन, आभूषण, इंटीरियर एवं आतिथ्य उद्योग।";
  else if (totalSingle === 3) professionSuitability = "विधि सलाहकार, न्यायाधीश, प्राध्यापक, आध्यात्मिक मार्गदर्शक, प्रकाशक एवं शोधकर्ता।";
  else if (totalSingle === 7) professionSuitability = "सॉफ्टवेयर आर्किटेक्ट, डेटा विश्लेषक, डॉक्टर, अन्वेषक एवं रणनीतिक योजनाकार।";
  else if (totalSingle === 9) professionSuitability = "इंजीनियरिंग, सुरक्षा, पुलिस, शल्य चिकित्सा, खेलकूद एवं ऊर्जावान निर्माण कार्य।";
  else if (totalSingle === 8) professionSuitability = "भारी उद्योग, इस्पात, खनन, परिवहन, श्रम कानून, निर्माण एवं दीर्घकालिक संपत्ति निर्माण।";
  else if (totalSingle === 2) professionSuitability = "कला, डेयरी, जल उद्योग, मनोविज्ञान, मानव संसाधन एवं परामर्श सेवा।";
  else if (totalSingle === 4) professionSuitability = "विमानन, उन्नत तकनीक, साइबर सुरक्षा एवं अप्रत्याशित तकनीकी उपक्रम।";

  // Practical remedies for phone number
  const targetBenefic = [1, 5, 6].filter(n => !PLANET_NUMBER_MAP[userMulank || 1]?.enemy.includes(n))[0] || 5;
  const phoneRemedies = {
    wallpaper: totalSingle === 1 || !isHarmonious ? "उदित होते भगवान सूर्य व गायत्री यंत्र का वॉलपेपर" : (totalSingle === 6 ? "महालक्ष्मी अथवा श्वेत कमल का वॉलपेपर" : "हरा-भरा समृद्ध बांस का पौधा अथवा प्राकृतिक वन"),
    coverColor: (userMulank === 1 || userBhagyank === 1) ? "स्वर्ण, ताम्र अथवा गहरा नारंगी" : ((userMulank === 5 || userBhagyank === 5) ? "एमराल्ड हरा अथवा पिस्ता" : ((userMulank === 6 || userBhagyank === 6) ? "श्वेत, रजत अथवा आसमानी नीला" : "पीला, बादामी अथवा गहरा नीला")),
    numericalYantra: `एक छोटे भोजपत्र या श्वेत पत्र पर अष्टगंध या हरी स्याही से शुभ अंक "${targetBenefic}" लिखकर मोबाइल बैक कवर के अंदर रखें; यह दोषों का शमन करता है।`,
    callingMantra: "महत्वपूर्ण व्यावसायिक या मांगलिक वार्तालाप से पूर्व मन में ३ बार \"ॐ गं गणपतये नमः\" का स्मरण करें।"
  };

  // Advice
  let advice = "";
  if (isMasterVip) {
    advice = "यह AstroVeda का मास्टर वीआईपी हेल्पलाइन नंबर (+91 901 908 8160) है, जो राजयोग ऊर्जा एवं परम कल्याणकारी तरंगों से परिपूर्ण है।";
  } else if (isSuitable) {
    advice = `यह मोबाइल नंबर आपके मूलांक (${userMulank || "—"}) व भाग्यांक (${userBhagyank || "—"}) के साथ ऊर्जावान सामंजस्य रखता है। कुल योग ${sum} (एकल ${totalSingle} - ${info.planetHi}) आपके जीवन में प्रगति, संपर्क व सम्मान का संचार करता है।`;
  } else {
    advice = `अंकशास्त्र अनुसार यह मोबाइल नंबर आपके लिए अनुकूल नहीं है (${suitabilityReasons[0] || "ऊर्जात्मक टकराव"})। यदि संभव हो तो नीचे दिए गए "सर्वोत्तम नए मोबाइल नंबर ब्लूप्रिंट" अनुसार नया नंबर चुनें, अथवा तात्कालिक दोष शमन हेतु दिए गए वॉलपेपर व बैक कवर यंत्र का उपाय अवश्य करें।`;
  }

  return {
    provided: true,
    phoneNumber: phoneStr,
    compoundSum: sum,
    singleNumber: totalSingle,
    rulingPlanet: info.planet,
    rulingPlanetHi: info.planetHi,
    nature: info.nature,
    isHarmoniousWithClient: isHarmonious,
    isSuitable: isSuitable,
    suitabilityReasons: suitabilityReasons,
    advice: advice,
    mulankRelation: mulankRelation,
    bhagyankRelation: bhagyankRelation,
    shubhStatus: shubhStatus,
    shubhBadgeColor: shubhBadgeColor,
    isMasterVip: isMasterVip,
    endingDigit: {
      digit: lastDigit,
      status: endingStatus,
      meaning: endingMeaning
    },
    keyPairs: pairsFound,
    excessiveDigits: excessiveDigits,
    digitFrequency: freq,
    professionSuitability: professionSuitability,
    remedies: phoneRemedies,
    favorableEndingDigits: [1, 5, 6],
    digitsToAvoid: [4, 8, 0],
    suggestions: suggestions
  };
}

// Complete Numerology Profile
export function generateNumerologyProfile(name, birthDate, phone = '') {
  const [year, month, day] = birthDate.split('-').map(Number);
  
  // 1. Mulank (Birth / Driver Number)
  const mulank = reduceToSingle(day);
  const mulankInfo = PLANET_NUMBER_MAP[mulank];

  // 2. Bhagyank (Destiny / Conductor Number)
  const dateSum = String(day).split('').reduce((a, b) => a + Number(b), 0) +
                  String(month).split('').reduce((a, b) => a + Number(b), 0) +
                  String(year).split('').reduce((a, b) => a + Number(b), 0);
  const bhagyank = reduceToSingle(dateSum);
  const bhagyankInfo = PLANET_NUMBER_MAP[bhagyank];

  // Driver & Conductor synergy
  let synergyStatus = 'Harmonious & Cordial (शुभ मैत्री)';
  let synergyDesc = 'Your Driver and Conductor numbers resonate well, giving synchronized thoughts and life manifestations.';
  if (mulankInfo.enemy.includes(bhagyank)) {
    synergyStatus = 'Frictional / Dynamic (संघर्षपूर्ण)';
    synergyDesc = 'Internal conflict between spontaneous instincts and long-term destiny path; requires conscious balancing.';
  } else if (mulankInfo.neutral.includes(bhagyank)) {
    synergyStatus = 'Neutral (तटस्थ)';
    synergyDesc = 'Balanced interplay; results depend primarily on your deliberate actions and environment.';
  }

  // 3. Name Analysis
  const chaldean = calculateChaldean(name);
  const pythagorean = calculatePythagorean(name);
  const nameInfo = PLANET_NUMBER_MAP[chaldean.single] || PLANET_NUMBER_MAP[1];

  // 4. Lo Shu Grid
  const loShu = generateLoShuGrid(birthDate);

  // 5. Mobile Analysis
  const missingNums = (loShu.missingNumbers || []).map(m => m.number);
  const mobileData = analyzeMobileNumber(phone, mulank, bhagyank, missingNums);

  // 6. Name correction advice
  const isNameHarmonious = !mulankInfo.enemy.includes(chaldean.single) && 
                           !bhagyankInfo.enemy.includes(chaldean.single) &&
                           ![4, 8].includes(chaldean.single);

  const targetBeneficNumbers = [1, 5, 6].filter(n => !mulankInfo.enemy.includes(n) && !bhagyankInfo.enemy.includes(n));
  
  let nameTuningAdvice = '';
  if (isNameHarmonious) {
    nameTuningAdvice = `Your name vibrates harmoniously on Chaldean ${chaldean.compound} (${chaldean.single} - ${nameInfo.planet}). It directly supports your Mulank ${mulank} and Bhagyank ${bhagyank}.`;
  } else {
    nameTuningAdvice = `Current name sum vibrates on ${chaldean.compound} (Single ${chaldean.single}), which creates subtle energetic friction with Mulank ${mulank} or Bhagyank ${bhagyank}. We recommend adjusting spelling (e.g. adding 'A', 'E', or 'R') to target compound ${targetBeneficNumbers[0] === 5 ? '23 / 32' : (targetBeneficNumbers[0] === 6 ? '24 / 42' : '19 / 37')}.`;
  }

  return {
    personal: {
      name: name,
      birthDate: birthDate,
      phone: phone
    },
    mulank: {
      number: mulank,
      planet: mulankInfo.planet,
      planetHi: mulankInfo.planetHi,
      nature: mulankInfo.nature,
      colors: mulankInfo.color,
      gem: mulankInfo.gem,
      metal: mulankInfo.metal,
      days: mulankInfo.days.join(', '),
      friendlyNumbers: mulankInfo.friendly,
      enemyNumbers: mulankInfo.enemy
    },
    bhagyank: {
      number: bhagyank,
      planet: bhagyankInfo.planet,
      planetHi: bhagyankInfo.planetHi,
      nature: bhagyankInfo.nature,
      colors: bhagyankInfo.color,
      gem: bhagyankInfo.gem
    },
    synergy: {
      status: synergyStatus,
      description: synergyDesc
    },
    nameNumber: {
      chaldeanCompound: chaldean.compound,
      chaldeanSingle: chaldean.single,
      chaldeanPlanet: nameInfo.planet,
      chaldeanMeaning: chaldean.compoundMeaning,
      pythagoreanExpression: pythagorean.expression,
      soulUrge: pythagorean.soulUrge,
      personality: pythagorean.personality,
      isHarmonious: isNameHarmonious,
      recommendedNumbers: targetBeneficNumbers,
      tuningAdvice: nameTuningAdvice
    },
    loShu: loShu,
    mobile: mobileData
  };
}

// Best Suitable Mobile Number Generator & SIM Buying Blueprint
export function getBestMobileNumberSuggestions(userMulank = 1, userBhagyank = 1, missingLoShuNumbers = []) {
  const mulankInfo = PLANET_NUMBER_MAP[userMulank || 1] || PLANET_NUMBER_MAP[1];
  const bhagyankInfo = PLANET_NUMBER_MAP[userBhagyank || 1] || PLANET_NUMBER_MAP[1];

  // Benefic single numbers for the seeker (filtered against enemy numbers)
  const candidateSingles = [1, 5, 6, 3].filter(n => 
    !mulankInfo.enemy.includes(n) && !bhagyankInfo.enemy.includes(n)
  );

  const primeSingle = candidateSingles[0] || 5;
  const secondarySingle = candidateSingles[1] || (candidateSingles[0] === 5 ? 6 : 5);

  // Royal Chaldean Compound Totals with esoteric meanings
  const royalCompoundSums = {
    1: [
      { sum: 37, meaning: 'The Star of Fortune (परम शुभ योग) - Attracts immense fame, royal favors, high partnerships, and wealth.' },
      { sum: 46, meaning: 'The Crown of Wealth (धन मुकुट) - Superb for commercial magnates, real estate, luxury trade, and luxury lifestyle.' },
      { sum: 19, meaning: 'The Prince of the Heavens (सूर्य विजय) - Supreme auspiciousness, victory over competitors, vitality, and respect.' }
    ],
    5: [
      { sum: 41, meaning: 'Executive Commerce (व्यापारिक विजय) - Quick thinking, high sales volume, financial agility, and expansive trade networking.' },
      { sum: 50, meaning: 'Intellectual Expansion (ज्ञान व संवाद) - High media presence, public speaking, negotiation skill, and commercial eloquence.' },
      { sum: 23, meaning: 'The Royal Star of the Lion (सिंह तारा) - Supreme royal luck, divine protection, victory in disputes, and rapid rise.' }
    ],
    6: [
      { sum: 42, meaning: 'Artistic Harmony (कलात्मक वैभव) - Attracts luxury assets, brand prestige, harmonious clientele, and aesthetic elegance.' },
      { sum: 24, meaning: 'Love & Fortune (प्रेम व समृद्धि) - Immense wealth through high alliances, diplomacy, hospitality, and comfort.' },
      { sum: 51, meaning: 'Warrior of Fortune (विजयी शक्ति) - High magnetic stature, leadership in competitive luxury markets.' }
    ],
    3: [
      { sum: 30, meaning: 'The Scholar (विद्वान) - Superior intellectual power, academic honor, and legal or advisory stature.' },
      { sum: 39, meaning: 'Dynamic Ambition (तीव्र महत्वाकांक्षा) - Fiery willpower, wisdom, triumph in judicial, education, or consulting domains.' }
    ]
  };

  const primeCompounds = royalCompoundSums[primeSingle] || royalCompoundSums[5];
  const secondaryCompounds = royalCompoundSums[secondarySingle] || royalCompoundSums[1];

  // Recommended endings
  const recommendedEndings = [primeSingle, secondarySingle, 5, 6].filter((v, i, a) => a.indexOf(v) === i);
  const recommendedPairEndings = [`${primeSingle}${secondarySingle}`, `${secondarySingle}${primeSingle}`, '56', '51', '65', '15', '33'];

  // Digits to emphasize (include missing Lo Shu numbers that are friendly!)
  const friendlyMissing = (missingLoShuNumbers || []).filter(n => !mulankInfo.enemy.includes(n) && !bhagyankInfo.enemy.includes(n));
  const digitsToInclude = [primeSingle, secondarySingle, ...friendlyMissing].filter((v, i, a) => a.indexOf(v) === i);

  // Digits to strictly exclude
  const digitsToExclude = [...mulankInfo.enemy, ...bhagyankInfo.enemy, 4, 8, 0].filter((v, i, a) => a.indexOf(v) === i);

  // Ready-to-Pick Sample SIM Blueprints / Templates
  const sampleTemplates = [
    {
      category: '💼 धन, व्यापार एवं विलासिता वृद्धि (Wealth & Business Growth)',
      targetSum: `${primeCompounds[0].sum} (एकल ${primeSingle} - ${PLANET_NUMBER_MAP[primeSingle]?.planetHi || 'शुभ'})`,
      pattern: `+91 9XX-XX${primeSingle}-${primeSingle}56${primeSingle}`,
      endingPair: `56 अथवा 65 अथवा ${primeSingle}`,
      impact: 'दुकानदार, व्यापारी, कॉरपोरेट एग्जीक्यूटिव एवं व्यवसायियों हेतु अकूत धन प्रवाह।'
    },
    {
      category: '👑 नेतृत्व, प्रशासनिक सम्मान एवं सत्ता (Leadership & Authority)',
      targetSum: `${secondaryCompounds[0].sum} (एकल ${secondarySingle} - ${PLANET_NUMBER_MAP[secondarySingle]?.planetHi || 'शुभ'})`,
      pattern: `+91 9XX-XX${secondarySingle}-${secondarySingle}19${secondarySingle}`,
      endingPair: `19 अथवा 51 अथवा ${secondarySingle}`,
      impact: 'निदेशक, राजनेता, सिविल अधिकारी एवं वरिष्ठ नेतृत्वकर्ताओं हेतु सर्वोच्च सम्मान।'
    },
    {
      category: '🕊️ पारिवारिक सौहार्द, परामर्श एवं शांति (Peace, Advisory & Harmony)',
      targetSum: '42 अथवा 33',
      pattern: `+91 9XX-XX3-3566`,
      endingPair: '56 अथवा 33 अथवा 6',
      impact: 'सलाहकार, शिक्षक, डॉक्टर, लेखक एवं दांपत्य शांति चाहने वालों हेतु कल्याणकारी।'
    }
  ];

  return {
    primeSingle: primeSingle,
    primeSinglePlanet: PLANET_NUMBER_MAP[primeSingle]?.planet || 'Mercury',
    primeSinglePlanetHi: PLANET_NUMBER_MAP[primeSingle]?.planetHi || 'बुध',
    secondarySingle: secondarySingle,
    secondarySinglePlanet: PLANET_NUMBER_MAP[secondarySingle]?.planet || 'Sun',
    secondarySinglePlanetHi: PLANET_NUMBER_MAP[secondarySingle]?.planetHi || 'सूर्य',
    recommendedCompounds: [...primeCompounds, ...secondaryCompounds.slice(0, 1)],
    recommendedEndings: recommendedEndings,
    recommendedPairEndings: recommendedPairEndings.slice(0, 4),
    digitsToInclude: digitsToInclude,
    digitsToExclude: digitsToExclude,
    sampleTemplates: sampleTemplates,
    simBuyingChecklist: [
      `१. कुल १० अंकों का संयुक्त योग (Compound Total) ${primeCompounds[0].sum} अथवा ${primeCompounds[1].sum} होना चाहिए।`,
      `२. नंबर का अंतिम अंक [ ${recommendedEndings.join(', ')} ] में से ही होना चाहिए।`,
      `३. अंतिम अंक कभी भी ४, ८ अथवा ० (शून्य) नहीं होना चाहिए।`,
      `४. नंबर में [ ${digitsToInclude.join(', ')} ] अंकों की अधिकता अत्यंत शुभ फल देती है।`,
      `५. नंबर में [ ${digitsToExclude.join(', ')} ] अंकों की पुनरावृत्ति से बचें।`
    ]
  };
}
