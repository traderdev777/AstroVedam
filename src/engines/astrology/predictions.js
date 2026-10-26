/**
 * AstroVeda - Comprehensive Life Predictions & Guidance Engine
 * Computes:
 * - Favorable & Unfavorable attributes (Numbers, Colors, Directions, Days, Gemstones)
 * - Career & Business suitability (Job vs Business, top industries)
 * - Marriage Timing (Vivah Yoga, age window, spouse attributes)
 * - Yearly Horoscope Forecast (Health, Wealth, Career, Relationships)
 * - Step-by-Step Remedies & Solutions (Rudraksha, Mantras, Yantras, Daan)
 */

import { RASHIS, GRAHAS } from './constants.js';
import { calculateSaturnTransit } from './ephemeris.js';

export function generateLifeGuidance(kundali, birthDetails = {}) {
  const lagnaRashi = kundali.lagna.rashi;
  const lagnaLord = kundali.lagna.lord;
  const moon = kundali.planets.find(p => p.name === 'Moon');
  const sun = kundali.planets.find(p => p.name === 'Sun');
  const venus = kundali.planets.find(p => p.name === 'Venus');
  const jupiter = kundali.planets.find(p => p.name === 'Jupiter');
  const mars = kundali.planets.find(p => p.name === 'Mars');
  const saturn = kundali.planets.find(p => p.name === 'Saturn');
  const mercury = kundali.planets.find(p => p.name === 'Mercury');

  const moonRashi = moon.rashi;
  const house7 = kundali.houses[6];
  const lord7 = house7.lord;
  const house10 = kundali.houses[9];
  const lord10 = house10.lord;

  // Day of birth for psychic number
  const birthDay = parseInt(birthDetails.date?.split('-')[2] || '1', 10);
  const mulank = ((birthDay - 1) % 9) + 1;

  // 1. Favorable & Unfavorable Attributes
  const attributesMap = {
    Aries: {
      luckyColors: ['Blood Red', 'Coral Orange', 'Golden Yellow'],
      unluckyColors: ['Jet Black', 'Dark Blue'],
      luckyNumbers: [1, 3, 9],
      unluckyNumbers: [6, 8],
      favorableDirections: ['East', 'North-East', 'South'],
      unfavorableDirections: ['West', 'South-West'],
      favorableDays: ['Tuesday', 'Sunday', 'Thursday'],
      unfavorableDays: ['Saturday', 'Friday'],
      lifeGem: 'Red Coral (मूँगा - 5 to 7 Ratti in Copper or Gold, ring finger, Tuesday)',
      luckyGem: 'Yellow Sapphire (पुखराज - index finger, Thursday)',
      avoidGem: 'Blue Sapphire and Diamond without strict verification',
      rudraksha: '3 Mukhi Rudraksha (Lord Agni) and 11 Mukhi Rudraksha (Lord Hanuman)',
      ishtaDevata: 'Lord Hanuman & Lord Kartikeya / Narasimha',
      mantra: 'ॐ अं अंगारकाय नमः (108 times on Tuesdays)'
    },
    Taurus: {
      luckyColors: ['Diamond White', 'Pastel Cream', 'Sky Blue', 'Light Green'],
      unluckyColors: ['Dark Red', 'Maroon'],
      luckyNumbers: [5, 6, 8],
      unluckyNumbers: [3, 9],
      favorableDirections: ['South-East', 'North', 'West'],
      unfavorableDirections: ['South', 'North-East'],
      favorableDays: ['Friday', 'Wednesday', 'Saturday'],
      unfavorableDays: ['Tuesday', 'Thursday'],
      lifeGem: 'Diamond or White Opal (हीरा/ओपल - middle/small finger, Friday in Silver)',
      luckyGem: 'Blue Sapphire or Emerald',
      avoidGem: 'Red Coral and Yellow Sapphire',
      rudraksha: '6 Mukhi Rudraksha (Lord Kartikeya/Venus) and 7 Mukhi (Maa Lakshmi)',
      ishtaDevata: 'Goddess Mahalakshmi & Maa Annapurna',
      mantra: 'ॐ शुं शुक्राय नमः (108 times on Fridays)'
    },
    Gemini: {
      luckyColors: ['Emerald Green', 'Light Yellow', 'Ivory White'],
      unluckyColors: ['Crimson Red'],
      luckyNumbers: [1, 5, 6],
      unluckyNumbers: [2, 9],
      favorableDirections: ['North', 'East', 'North-West'],
      unfavorableDirections: ['South'],
      favorableDays: ['Wednesday', 'Friday', 'Thursday'],
      unfavorableDays: ['Tuesday'],
      lifeGem: 'Emerald (पन्ना - 4 to 6 Ratti in Gold or Bronze, little finger, Wednesday)',
      luckyGem: 'Diamond or Blue Sapphire',
      avoidGem: 'Red Coral and Pearl',
      rudraksha: '4 Mukhi Rudraksha (Lord Brahma/Mercury)',
      ishtaDevata: 'Lord Ganesha & Lord Vishnu',
      mantra: 'ॐ बुं बुधाय नमः (108 times on Wednesdays)'
    },
    Cancer: {
      luckyColors: ['Pearl White', 'Silver', 'Cream', 'Light Gold'],
      unluckyColors: ['Black', 'Dark Blue'],
      luckyNumbers: [1, 2, 3, 9],
      unluckyNumbers: [5, 8],
      favorableDirections: ['North-East', 'East', 'North'],
      unfavorableDirections: ['South-West'],
      favorableDays: ['Monday', 'Tuesday', 'Thursday'],
      unfavorableDays: ['Saturday', 'Wednesday'],
      lifeGem: 'Natural Pearl (सच्चा मोती - 5 to 7 Ratti in Silver, little finger, Monday)',
      luckyGem: 'Red Coral or Yellow Sapphire',
      avoidGem: 'Blue Sapphire, Diamond, and Emerald',
      rudraksha: '2 Mukhi Rudraksha (Ardhanarishwara/Moon)',
      ishtaDevata: 'Lord Shiva & Goddess Parvati',
      mantra: 'ॐ सों सोमाय नमः / ॐ नमः शिवाय (108 times on Mondays)'
    },
    Leo: {
      luckyColors: ['Royal Gold', 'Saffron', 'Copper Orange', 'Bright Yellow'],
      unluckyColors: ['Dark Navy Blue', 'Black'],
      luckyNumbers: [1, 3, 5, 9],
      unluckyNumbers: [6, 7, 8],
      favorableDirections: ['East', 'North-East'],
      unfavorableDirections: ['West', 'South-West'],
      favorableDays: ['Sunday', 'Tuesday', 'Thursday'],
      unfavorableDays: ['Saturday', 'Friday'],
      lifeGem: 'Ruby (माणिक्य - 4 to 6 Ratti in Gold or Copper, ring finger, Sunday)',
      luckyGem: 'Yellow Sapphire or Red Coral',
      avoidGem: 'Blue Sapphire and Diamond',
      rudraksha: '1 Mukhi or 12 Mukhi Rudraksha (Lord Surya)',
      ishtaDevata: 'Lord Surya Narayana & Lord Shiva / Gayatri',
      mantra: 'ॐ घृणि सूर्याय नमः (108 times at sunrise with water arghya)'
    },
    Virgo: {
      luckyColors: ['Light Green', 'Emerald', 'White', 'Beige'],
      unluckyColors: ['Fiery Red'],
      luckyNumbers: [5, 6, 7],
      unluckyNumbers: [1, 9],
      favorableDirections: ['North', 'North-West', 'West'],
      unfavorableDirections: ['South'],
      favorableDays: ['Wednesday', 'Friday', 'Saturday'],
      unfavorableDays: ['Tuesday'],
      lifeGem: 'Emerald (पन्ना - 4 to 6 Ratti, little finger, Wednesday in Gold/Silver)',
      luckyGem: 'Diamond or Blue Sapphire',
      avoidGem: 'Red Coral and Yellow Sapphire',
      rudraksha: '4 Mukhi & 10 Mukhi Rudraksha (Lord Vishnu)',
      ishtaDevata: 'Lord Vishnu & Lord Ganesha',
      mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः'
    },
    Libra: {
      luckyColors: ['Pure White', 'Sky Blue', 'Pastel Pink', 'Cream'],
      unluckyColors: ['Bright Red', 'Dark Orange'],
      luckyNumbers: [5, 6, 8],
      unluckyNumbers: [1, 9],
      favorableDirections: ['West', 'South-East', 'North'],
      unfavorableDirections: ['North-East', 'South'],
      favorableDays: ['Friday', 'Saturday', 'Wednesday'],
      unfavorableDays: ['Sunday', 'Tuesday'],
      lifeGem: 'Diamond / White Zircon / Opal (हीरा/ओपल - ring or middle finger, Friday)',
      luckyGem: 'Blue Sapphire (Saturn is Yogakaraka for Libra!)',
      avoidGem: 'Ruby and Yellow Sapphire',
      rudraksha: '6 Mukhi & 7 Mukhi Rudraksha',
      ishtaDevata: 'Maa Mahalakshmi & Lord Shiva',
      mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः (108 times on Fridays)'
    },
    Scorpio: {
      luckyColors: ['Dark Red', 'Maroon', 'Rust', 'Saffron Yellow'],
      unluckyColors: ['Green', 'Pure White'],
      luckyNumbers: [1, 2, 3, 9],
      unluckyNumbers: [5, 6],
      favorableDirections: ['East', 'South', 'North-East'],
      unfavorableDirections: ['North', 'West'],
      favorableDays: ['Tuesday', 'Sunday', 'Thursday'],
      unfavorableDays: ['Wednesday', 'Friday'],
      lifeGem: 'Red Coral (मूँगा - 6 to 8 Ratti in Copper or Gold, ring finger, Tuesday)',
      luckyGem: 'Yellow Sapphire or Pearl',
      avoidGem: 'Emerald and Diamond',
      rudraksha: '3 Mukhi (Agni) & 8 Mukhi Rudraksha (Lord Ganesha)',
      ishtaDevata: 'Lord Hanuman, Lord Kartikeya, Maa Durga',
      mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः'
    },
    Sagittarius: {
      luckyColors: ['Golden Yellow', 'Bright Saffron', 'Orange', 'Cream'],
      unluckyColors: ['Dark Black', 'Deep Navy Blue'],
      luckyNumbers: [1, 2, 3, 9],
      unluckyNumbers: [6, 8],
      favorableDirections: ['North-East', 'East', 'North'],
      unfavorableDirections: ['South-West'],
      favorableDays: ['Thursday', 'Sunday', 'Tuesday'],
      unfavorableDays: ['Friday', 'Saturday'],
      lifeGem: 'Yellow Sapphire (पुखराज - 5 to 7 Ratti in Gold or Brass, index finger, Thursday)',
      luckyGem: 'Ruby or Red Coral',
      avoidGem: 'Diamond, Emerald, and Blue Sapphire',
      rudraksha: '5 Mukhi Rudraksha (Lord Kalagni Rudra / Jupiter)',
      ishtaDevata: 'Lord Vishnu, Dakshinamurthy & Guru Dattatreya',
      mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (108 times on Thursdays)'
    },
    Capricorn: {
      luckyColors: ['Navy Blue', 'Royal Blue', 'Charcoal Grey', 'White'],
      unluckyColors: ['Bright Red', 'Yellow'],
      luckyNumbers: [5, 6, 8],
      unluckyNumbers: [1, 3, 9],
      favorableDirections: ['West', 'South', 'North-West'],
      unfavorableDirections: ['East', 'North-East'],
      favorableDays: ['Saturday', 'Friday', 'Wednesday'],
      unfavorableDays: ['Sunday', 'Tuesday', 'Thursday'],
      lifeGem: 'Blue Sapphire or Amethyst (नीलम/कटैला - 5 to 7 Ratti in Iron or Silver, middle finger)',
      luckyGem: 'Diamond or Emerald (Venus is Yogakaraka!)',
      avoidGem: 'Ruby and Red Coral',
      rudraksha: '7 Mukhi & 14 Mukhi Rudraksha',
      ishtaDevata: 'Lord Shani Dev, Lord Shiva & Lord Hanuman',
      mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः'
    },
    Aquarius: {
      luckyColors: ['Electric Blue', 'Cyan', 'Purple', 'Grey', 'White'],
      unluckyColors: ['Crimson Red', 'Bright Orange'],
      luckyNumbers: [5, 6, 8],
      unluckyNumbers: [1, 2, 9],
      favorableDirections: ['West', 'North', 'South-East'],
      unfavorableDirections: ['East', 'South'],
      favorableDays: ['Saturday', 'Friday', 'Wednesday'],
      unfavorableDays: ['Sunday', 'Monday', 'Tuesday'],
      lifeGem: 'Blue Sapphire or Lapis Lazuli (नीलम/लाजवर्द - middle finger, Saturday)',
      luckyGem: 'Diamond or Emerald',
      avoidGem: 'Ruby, Pearl, and Red Coral',
      rudraksha: '7 Mukhi & 8 Mukhi Rudraksha',
      ishtaDevata: 'Lord Shiva & Lord Hanuman',
      mantra: 'ॐ शं शनैश्चराय नमः'
    },
    Pisces: {
      luckyColors: ['Deep Yellow', 'Golden Amber', 'Aquamarine', 'Cream'],
      unluckyColors: ['Jet Black', 'Dark Blue'],
      luckyNumbers: [1, 2, 3, 9],
      unluckyNumbers: [5, 6, 8],
      favorableDirections: ['North-East', 'East', 'North'],
      unfavorableDirections: ['West', 'South-West'],
      favorableDays: ['Thursday', 'Tuesday', 'Sunday'],
      unfavorableDays: ['Friday', 'Saturday'],
      lifeGem: 'Yellow Sapphire (पुखराज - index finger, Thursday in Gold)',
      luckyGem: 'Red Coral or Natural Pearl',
      avoidGem: 'Diamond, Blue Sapphire, and Emerald',
      rudraksha: '5 Mukhi & 10 Mukhi Rudraksha',
      ishtaDevata: 'Lord Narayana & Lord Shiva',
      mantra: 'ॐ बृं बृहस्पतये नमः'
    }
  };

  const lagnaInfo = attributesMap[kundali.lagna.rashiName] || attributesMap.Aries;

  // 2. Career & Business Analysis
  const careerMap = {
    Sun: { field: 'Administration, Government Services, Politics, Leadership, Mining, Solar Energy, Top Management', style: 'Leadership & Executive Command' },
    Moon: { field: 'Hospitality, Travel, Marine/Water trades, Dairy, Food processing, Psychology, Nursing, Textiles', style: 'People-oriented & Creative Service' },
    Mars: { field: 'Real Estate, Construction, Defense, Police, Surgery, Mechanical/Civil Engineering, Athletics, Fire & Security', style: 'High Energy & Executive Venture' },
    Mercury: { field: 'IT, Software, Analytics, Commerce, CA, Banking, Digital Marketing, Media, Publishing, Stock Trading', style: 'Analytical, High-Volume Trading & Consultancy' },
    Jupiter: { field: 'Advisory, Law, Judiciary, Education, Philosophy, Financial Funds, Spiritual Counseling, Publishing', style: 'Advisory, Consulting & Respected Institutions' },
    Venus: { field: 'Luxury Goods, Entertainment, Fashion, Interior Design, Hospitality, Media, Automobiles, Jewelry', style: 'Creative, Aesthetic & Brand Leadership' },
    Saturn: { field: 'Heavy Manufacturing, Steel, Infrastructure, Mining, Oil & Gas, Logistics, Legal, Labor Administration', style: 'Systematic, Enduring & Large Enterprise' }
  };

  const primeCareer = careerMap[lord10] || careerMap.Sun;
  const secondaryCareer = careerMap[lagnaLord] || careerMap.Jupiter;

  const isBusinessFavored = ['Mercury', 'Venus', 'Mars'].includes(lord10) || ['Mercury', 'Venus'].includes(lagnaLord);

  // 3. Marriage Timing & Spouse Attributes
  let marriageAgeWindow = '24 to 28 Years';
  let spouseDirection = 'West or South-West';
  let spouseNature = 'Attractive, cooperative, and cultured';

  if (['Saturn', 'Rahu', 'Ketu'].includes(lord7)) {
    marriageAgeWindow = '27 to 31 Years (Mature / Thoughtful Marriage)';
    spouseNature = 'Pragmatic, disciplined, hardworking, mature in temperament';
    spouseDirection = 'West or South';
  } else if (['Jupiter', 'Venus'].includes(lord7)) {
    marriageAgeWindow = '23 to 27 Years (Auspicious & Harmonious Timing)';
    spouseNature = 'Virtuous, good-natured, supportive, artistic or scholarly';
    spouseDirection = 'North-East or East';
  } else if (['Mars', 'Sun'].includes(lord7)) {
    marriageAgeWindow = '25 to 29 Years';
    spouseNature = 'Dynamic, confident, leader-like, protective yet self-willed';
    spouseDirection = 'South or East';
  }

  // 4. Yearly Forecast (Current Year Ahead)
  const currentYear = new Date().getFullYear();
  const yearlyForecast = {
    year: currentYear,
    health: 'Overall stamina remains resilient. Cultivate balanced diet and morning meditation to prevent minor digestive or sleep sensitivity.',
    finance: 'Steady inflows with lucrative opportunities in second half of the year. Avoid unvetted speculative loans.',
    career: 'High potential for promotion, prestige elevation, or commercial expansion under favorable planetary aspects.',
    relationships: 'Harmonious domestic period; cultivate clear communication with elders and life partner to avert misunderstandings.',
    remedySummary: 'Regular Gayatri Japa and lighting sesame oil diya on Saturdays ensures continuous cosmic protection.'
  };

  return {
    attributes: lagnaInfo,
    career: {
      primeField: primeCareer.field,
      secondaryField: secondaryCareer.field,
      workStyle: primeCareer.style,
      businessVsJob: isBusinessFavored 
        ? 'Independent Business, Partnerships & Enterprise are highly auspicious' 
        : 'Senior Corporate Employment, Executive Civil/Govt Service & Professional Practice are most lucrative',
      favorableSectors: [primeCareer.field, secondaryCareer.field]
    },
    marriage: {
      ageWindow: marriageAgeWindow,
      favorableDirections: spouseDirection,
      spouseCharacteristics: spouseNature,
      rulingLord: lord7,
      houseSign: house7.rashiName,
      matrimonialAdvice: 'Perform pre-marital Gauri-Ganesh blessings. Choose a partner whose Nakshatra avoids Nadi and Gana dosha.'
    },
    yearly: yearlyForecast
  };
}

/**
 * Advanced Vedic Astrology Solutions, Karmic Debts & Yantra Consecration Engine
 */
export function generateAdvancedAstroSolutions(kundali, userInputs = {}) {
  const lagnaRashi = kundali.lagna.rashiName;
  const lagnaLord = kundali.lagna.lord;
  const moon = kundali.planets.find(p => p.name === 'Moon');
  const sun = kundali.planets.find(p => p.name === 'Sun');
  const mars = kundali.planets.find(p => p.name === 'Mars');
  const mercury = kundali.planets.find(p => p.name === 'Mercury');
  const jupiter = kundali.planets.find(p => p.name === 'Jupiter');
  const venus = kundali.planets.find(p => p.name === 'Venus');
  const saturn = kundali.planets.find(p => p.name === 'Saturn');
  const rahu = kundali.planets.find(p => p.name === 'Rahu');
  const ketu = kundali.planets.find(p => p.name === 'Ketu');

  const moonRashi = moon.rashiName;
  const house9 = kundali.houses[8];
  const lord9 = house9.lord;

  // 1. Karmic & Ancestral Debts (ऋण दोष)
  const debts = [];

  // Pitru Rin
  const sunAfflicted = [6, 8, 12].includes(sun.house) || 
                       Math.abs(sun.longitude - rahu.longitude) < 15 || 
                       Math.abs(sun.longitude - ketu.longitude) < 15 || 
                       Math.abs(sun.longitude - saturn.longitude) < 10;
  debts.push({
    title: 'पितृ ऋण (Pitru Rin - Ancestral Karmic Debt)',
    detected: sunAfflicted,
    severity: sunAfflicted ? 'सक्रिय प्रभाव (Active)' : 'अल्प / निष्प्रभावी (Neutral)',
    impact: 'Occurs from past ancestral promises or disrespect to father/elders. Can cause career roadblocks or delays in lineage advancement.',
    remedy: 'Offer water with red sandalwood and akshat to rising Sun (Arghya) in a copper vessel daily. Water a Peepal tree and perform Tarpana with black sesame on Amavasya. Feed cows and crows.'
  });

  // Matru Rin
  const moonAfflicted = [6, 8, 12].includes(moon.house) || 
                        Math.abs(moon.longitude - rahu.longitude) < 15 || 
                        Math.abs(moon.longitude - saturn.longitude) < 10;
  debts.push({
    title: 'मातृ ऋण (Matru Rin - Maternal Karmic Debt)',
    detected: moonAfflicted,
    severity: moonAfflicted ? 'सक्रिय प्रभाव (Active)' : 'अल्प / निष्प्रभावी (Neutral)',
    impact: 'Affects peace of mind, domestic harmony, emotional stability, and mother’s longevity.',
    remedy: 'Donate silver or unboiled white milk on Mondays. Perform milk Abhishekam on Shivling. Touch biological mother’s feet daily and respect all maternal figures.'
  });

  // Bhratri Rin
  const marsAfflicted = mars.rashiName === 'Cancer' || [6, 8, 12].includes(mars.house);
  debts.push({
    title: 'भ्रातृ ऋण (Bhratri Rin - Sibling Karma)',
    detected: marsAfflicted,
    severity: marsAfflicted ? 'सक्रिय प्रभाव (Active)' : 'शांत (Clear)',
    impact: 'Can manifest as property conflicts, sibling estrangement, or unexpected blood/muscular vitality dips.',
    remedy: 'Recite Hanuman Chalisa or Sundarkand 7 times on Tuesdays. Offer sindoor and jasmine oil to Lord Hanuman. Distribute sweet jaggery rotis to workers.'
  });

  // Guru / Dev Rin
  const jupiterAfflicted = jupiter.rashiName === 'Capricorn' || [6, 8, 12].includes(jupiter.house) || Math.abs(jupiter.longitude - rahu.longitude) < 12;
  debts.push({
    title: 'गुरु एवं देव ऋण (Guru / Dev Rin - Spiritual Preceptor Debt)',
    detected: jupiterAfflicted,
    severity: jupiterAfflicted ? 'सक्रिय प्रभाव (Active)' : 'शांत (Clear)',
    impact: 'Can cause hurdles in higher education, delay in children’s prosperity, or philosophical disillusionment.',
    remedy: 'Sponsor the education of underprivileged students. Donate yellow grains (chana dal) and saffron at a temple on Thursdays. Chant Vishnu Sahasranama.'
  });

  // Stri Rin
  const venusAfflicted = venus.rashiName === 'Virgo' || [6, 8, 12].includes(venus.house);
  debts.push({
    title: 'स्त्री एवं कलत्र ऋण (Stri / Kalatra Rin - Feminine Karma)',
    detected: venusAfflicted,
    severity: venusAfflicted ? 'सक्रिय प्रभाव (Active)' : 'शांत (Clear)',
    impact: 'Can cause friction in marital bliss, delays in finding a life partner, or financial leakage in luxuries.',
    remedy: 'Treat spouse and all women with utmost reverence. Recite Sri Suktam every Friday evening. Gift white fragrant flowers or silk to Goddess Mahalakshmi.'
  });

  // 2. Yantra Consecration Architecture
  const yantraMap = {
    Sun: { name: 'श्री सूर्य यंत्र (Sri Surya Yantra)', direction: 'East (पूर्व दिशा)', metal: 'Pure Copper or 24K Gold Plated', mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः' },
    Moon: { name: 'श्री चंद्र / शिव यंत्र (Sri Chandra Yantra)', direction: 'North-West (वायव्य कोण)', metal: 'Silver Plate (रजत)', mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः' },
    Mars: { name: 'श्री मंगल / हनुमान यंत्र (Sri Mangal Yantra)', direction: 'South / East (दक्षिण / पूर्व)', metal: 'Pure Copper Plate (ताम्र)', mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः' },
    Mercury: { name: 'श्री बुध / कुबेर यंत्र (Sri Kuber Yantra)', direction: 'North (उत्तर दिशा - कुबेर स्थान)', metal: 'Bronze or Brass Plate (कांस्य/पीतल)', mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः' },
    Jupiter: { name: 'श्री गुरु / श्रीयंत्र (Sri Guru Yantra)', direction: 'North-East (ईशान कोण)', metal: '24K Gold Plated Brass Plate', mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' },
    Venus: { name: 'श्री महामेरु / महालक्ष्मी यंत्र (Sri Chakra Yantra)', direction: 'North-East / South-East', metal: 'Ashtadhatu or Silver Plate', mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः' },
    Saturn: { name: 'श्री शनि / नवग्रह यंत्र (Sri Shani Yantra)', direction: 'West (पश्चिम दिशा)', metal: 'Iron or Ashtadhatu Plate', mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः' }
  };

  const primaryYantra = yantraMap[lagnaLord] || yantraMap.Sun;
  const secondaryYantra = yantraMap[lord9] || yantraMap.Venus;

  // 3. Navagraha Beej Mantras
  const beejMantras = {
    Sun: { mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', mala: 'Rudraksha Mala (रुद्राक्ष माला)', count: '108 daily at Sunrise' },
    Moon: { mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः', mala: 'Sphatik / Pearl Mala (स्फटिक माला)', count: '108 daily at Evening' },
    Mars: { mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', mala: 'Red Coral / Rudraksha Mala', count: '108 daily at Morning' },
    Mercury: { mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', mala: 'Tulsi / Green Jade Mala (तुलसी माला)', count: '108 daily at Morning' },
    Jupiter: { mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', mala: 'Haldi Mala / Sandalwood (हल्दी माला)', count: '108 daily at Dawn' },
    Venus: { mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', mala: 'Sphatik / Lotus Seed Mala (कमलगट्टा माला)', count: '108 daily at Dusk' },
    Saturn: { mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', mala: 'Rudraksha / Blue Thread Mala', count: '108 daily after Sunset' }
  };

  // 4. Shani Transit & Sade Sati Status (Phase 4C.2 Dynamic Transit Assessment)
  const assessmentDate = userInputs.transitDate || userInputs.assessmentDate || null;
  const transit = calculateSaturnTransit(
    moon,
    assessmentDate,
    kundali.birthDetails?.ayanamsa || 'LAHIRI'
  );

  const sadeSatiStatus = {
    valid: transit.valid,
    status: !transit.valid
      ? 'Transit Data Unavailable (अनुपलब्ध)'
      : (transit.isSadeSati
          ? 'Active Sade Sati'
          : (transit.isDhaiya
              ? 'Active Dhaiya (Kantaka / Ashtama Shani)'
              : 'Favorable / Inactive')),
    phase: transit.phase,
    phaseHi: transit.phaseHi,
    phaseCode: transit.phaseCode,
    isAffected: transit.isAffected,
    isSadeSati: transit.isSadeSati,
    isDhaiya: transit.isDhaiya,
    signDistance: transit.signDistance,
    transitSaturnSign: transit.transitSaturnSign,
    natalMoonSign: transit.natalMoonSign,
    detail: transit.details,
    details: transit.details,
    assessmentDate: transit.assessmentDate
  };

  // 5. Strictly Forbidden Gemstones (वर्जित रत्न)
  const forbiddenGemsMap = {
    Aries: 'Emerald (पन्ना) and Diamond (हीरा) - As Mercury & Venus rule 3rd, 6th & 2nd, 7th Maraka houses.',
    Taurus: 'Yellow Sapphire (पुखराज) and Ruby (माणिक्य) - Jupiter rules 8th & 11th; Sun rules 4th Kendra.',
    Gemini: 'Red Coral (मूँगा) and Pearl (मोती) - Mars rules 6th & 11th; Moon rules 2nd Maraka.',
    Cancer: 'Blue Sapphire (नीलम), Diamond (हीरा), and Emerald (पन्ना) - Saturn rules 7th & 8th; Mercury rules 3rd & 12th.',
    Leo: 'Blue Sapphire (नीलम) and Diamond (हीरा) - Saturn rules 6th & 7th Dusthana/Maraka; Venus rules 3rd & 10th.',
    Virgo: 'Red Coral (मूँगा) and Yellow Sapphire (पुखराज) - Mars rules 3rd & 8th severe Dusthana; Jupiter rules Kendra.',
    Libra: 'Ruby (माणिक्य) and Yellow Sapphire (पुखराज) - Sun rules 11th; Jupiter rules 3rd & 6th malefic houses.',
    Scorpio: 'Emerald (पन्ना) and Diamond (हीरा) - Mercury rules 8th & 11th; Venus rules 7th & 12th.',
    Sagittarius: 'Diamond (हीरा), Emerald (पन्ना), and Blue Sapphire (नीलम) - Venus rules 6th & 11th; Mercury rules Kendradhipati.',
    Capricorn: 'Ruby (माणिक्य) and Red Coral (मूँगा) - Sun rules 8th house; Mars rules 4th & 11th badhak.',
    Aquarius: 'Ruby (माणिक्य), Pearl (मोती), and Red Coral (मूँगा) - Sun rules 7th; Moon rules 6th Dusthana; Mars rules 3rd.',
    Pisces: 'Diamond (हीरा), Blue Sapphire (नीलम), and Emerald (पन्ना) - Venus rules 3rd & 8th; Saturn rules 11th & 12th.'
  };

  const forbiddenGems = forbiddenGemsMap[lagnaRashi] || 'Blue Sapphire and Diamond without strict astrological scrutiny.';

  return {
    karmicDebts: debts,
    activeDebtsCount: debts.filter(d => d.detected).length,
    yantras: {
      primary: primaryYantra,
      secondary: secondaryYantra,
      consecrationVidhi: 'Consecrate on Shukla Paksha morning on the planet’s weekday. Bathe Yantra in Gangajal and raw cow milk, offer white flowers, akshat, and light pure cow ghee deepam while chanting the mantra 108 times.'
    },
    beejMantras: {
      lagnaLord: { planet: lagnaLord, ...beejMantras[lagnaLord] },
      lord9: { planet: lord9, ...beejMantras[lord9] },
      mahamrityunjaya: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥'
    },
    sadeSati: {
      ...sadeSatiStatus,
      remedy: 'Perform Chhaya Daan (छाया दान) with mustard oil in an iron vessel on Saturday. Light sesame lamp under Peepal or Shami tree at dusk. Recite Dasharatha Shani Stotram.'
    },
    forbiddenGems: forbiddenGems,
    gemstoneVidhi: 'Wear on Shukla Paksha morning. Purify with raw unboiled cow milk and Gangajal. Chant presiding deity’s Beej mantra 108 times facing East.'
  };
}

/**
 * Complete & Advanced Life Predictions Engine
 * Covers Health, Wealth, Career, Marriage, Spiritual Path, and 4-Quarter Milestones
 */
export function generateComprehensiveLifePredictions(kundali, userInputs = {}) {
  const lagnaRashi = kundali.lagna.rashiName;
  const lagnaLord = kundali.lagna.lord;
  const moon = kundali.planets.find(p => p.name === 'Moon');
  const sun = kundali.planets.find(p => p.name === 'Sun');
  const jupiter = kundali.planets.find(p => p.name === 'Jupiter');
  const venus = kundali.planets.find(p => p.name === 'Venus');
  const mars = kundali.planets.find(p => p.name === 'Mars');
  const saturn = kundali.planets.find(p => p.name === 'Saturn');
  const mercury = kundali.planets.find(p => p.name === 'Mercury');

  const moonRashi = moon.rashiName;
  const house2 = kundali.houses[1];
  const house7 = kundali.houses[6];
  const house9 = kundali.houses[8];
  const house10 = kundali.houses[9];
  const house11 = kundali.houses[10];

  // 1. Health & Vitality
  const healthConstitutions = {
    Aries: { dosha: 'Pitta (पित्त प्रधान)', organs: 'मस्तिष्क, रक्त संचार, नेत्र एवं सिर दर्द', advice: 'नियमित प्राणायाम करें, अत्यधिक मिर्च-मसालों से बचें और पर्याप्त जल पिएं।' },
    Taurus: { dosha: 'Kapha-Vata (कफ-वात)', organs: 'कंठ, थायरॉइड, स्वर तंत्र एवं मुख विकार', advice: 'नियमित व्यायाम, उष्ण जल सेवन एवं गाय के दुग्ध का संतुलित उपयोग करें।' },
    Gemini: { dosha: 'Vata (वात प्रधान)', organs: 'श्वसन तंत्र, फेफड़े, कंधे एवं स्नायु तंत्र', advice: 'गहरी श्वास क्रिया, अनुलोम-विलोम एवं स्नायु तंत्र को शांत रखने हेतु ध्यान करें।' },
    Cancer: { dosha: 'Kapha (कफ व जल तत्व)', organs: 'आमाशय, पाचन अग्नि, छाती एवं मानसिक तनाव', advice: 'शीतल पेय पदार्थों से बचें, रात्रि में हल्का भोजन लें एवं ध्यान करें।' },
    Leo: { dosha: 'Pitta (अग्नि तत्व)', organs: 'हृदय, रीढ़ की हड्डी, रक्तचाप एवं जीवनी शक्ति', advice: 'प्रातःकाल सूर्य नमस्कार, हृदय स्वास्थ्य की जांच एवं संयमित आहार अपनाएं।' },
    Virgo: { dosha: 'Vata-Pitta (वात-पित्त)', organs: 'आंतें, पाचन संस्थान, उदर विकार एवं तनाव', advice: 'सुपाच्य रेशेदार आहार, त्रिफला का प्रयोग एवं नियमित दिनचर्या रखें।' },
    Libra: { dosha: 'Vata (वात-कफ)', organs: 'वृक्क (गुर्दे), त्वचा, कमर एवं जल संतुलन', advice: 'पर्याप्त जल का सेवन, नमक की मात्रा नियंत्रित रखना एवं योग अभ्यास करें।' },
    Scorpio: { dosha: 'Pitta-Kapha (जल-अग्नि)', organs: 'गुप्तांग, रक्त शुद्धि एवं उत्सर्जन तंत्र', advice: 'रक्तवर्धक आहार, प्राणायाम एवं क्रोध पर नियंत्रण रखना आवश्यक है।' },
    Sagittarius: { dosha: 'Pitta (अग्नि तत्व)', organs: 'यकृत (लिवर), जंघाएं, कूल्हे एवं वसा संतुलन', advice: 'वसायुक्त गरिष्ठ भोजन से परहेज, प्रातः भ्रमण एवं लिवर डिटॉक्स करें।' },
    Capricorn: { dosha: 'Vata (वात प्रधान)', organs: 'घुटने, अस्थियां, जोड़ एवं त्वचा संवेदनशीलता', advice: 'तिल के तेल की मालिश, कैल्शियम युक्त आहार एवं वात नाशक जीवनशैली अपनाएं।' },
    Aquarius: { dosha: 'Vata (वायु तत्व)', organs: 'पिंडलियां, टखने, रक्त नलिकाएं एवं स्नायु', advice: 'पैरों का व्यायाम, नियमित विश्राम एवं अत्यधिक मानसिक श्रम से बचें।' },
    Pisces: { dosha: 'Kapha (जल तत्व)', organs: 'पैर के पंजे, लसिका तंत्र एवं निद्रा विकार', advice: 'स्वच्छ जल सेवन, रात्रि में समय पर शयन एवं जल चिकित्सा अपनाएं।' }
  };

  const healthData = healthConstitutions[lagnaRashi] || healthConstitutions.Aries;

  // 2. Wealth & Dhana Yogas
  const dhanaYogas = [];
  if (['Sun', 'Jupiter', 'Venus'].includes(house2.lord) || ['Sun', 'Jupiter', 'Venus'].includes(house11.lord)) {
    dhanaYogas.push('महाधन योग (Mahadhana Yoga) - 2nd/11th भावों पर शुभ ग्रहों का प्रभाव प्रचुर संपत्ति एवं अनवरत धन प्रवाह देता है।');
  }
  if (jupiter.house === 1 || jupiter.house === 4 || jupiter.house === 7 || jupiter.house === 10) {
    dhanaYogas.push('हंस / गुरु केंद्र योग (Hamsa Kendra Yoga) - नैतिक व्यापार एवं समाज में पूजनीय स्थिति से अकूत धन लाभ।');
  }
  if (mercury.house === 1 || mercury.house === 5 || mercury.house === 10) {
    dhanaYogas.push('भद्र योग / व्यापारिक लक्ष्मी योग (Bhadra Trade Yoga) - वाणिज्यिक चतुरता एवं बौद्धिक संपदा से वैभव।');
  }
  if (dhanaYogas.length === 0) {
    dhanaYogas.push('वसुमति योग (Vasumathi Wealth Yoga) - उपचय भावों में शुभ ग्रहों की दृष्टि से स्व-अर्जित स्थिर संपत्ति।');
  }

  // 3. Career & Authority
  const isBusiness = ['Mercury', 'Venus', 'Mars'].includes(house10.lord) || ['Mercury', 'Venus'].includes(lagnaLord);

  // 4. Spiritual Path
  const spiritualPaths = {
    Sun: { deity: 'भगवान सूर्य नारायण एवं गायत्री माता', tirtha: 'काशी विश्वनाथ, कोणार्क एवं अयोध्या धाम' },
    Moon: { deity: 'भगवान शिव एवं माता पार्वती', tirtha: 'सोमनाथ, रामेश्वरम एवं हरिद्वार' },
    Mars: { deity: 'संकटमोचन श्री हनुमान जी एवं कार्तिकेय', tirtha: 'उज्जैन महाकाल, मेहंदीपुर एवं अयोध्या' },
    Mercury: { deity: 'भगवान श्री विष्णु एवं श्री गणेश जी', tirtha: 'तिरुपति बालाजी, बद्रीनाथ एवं द्वारका' },
    Jupiter: { deity: 'भगवान श्री हरि विष्णु एवं दक्षिणामूर्ति', tirtha: 'ऋषिकेश, बद्रीनाथ एवं वाराणसी' },
    Venus: { deity: 'भगवती महालक्ष्मी एवं मां अन्नपूर्णा', tirtha: 'कोल्हापुर महालक्ष्मी, कामाख्या एवं वृन्दावन' },
    Saturn: { deity: 'भगवान शिव, कालभैरव एवं शनि देव', tirtha: 'शिरडी, शनि शिंगणापुर एवं काशी' }
  };

  const spiritual = spiritualPaths[lagnaLord] || spiritualPaths.Jupiter;
  const currentYear = new Date().getFullYear();

  return {
    health: {
      constitution: healthData.dosha,
      vulnerableOrgans: healthData.organs,
      ayurvedicAdvice: healthData.advice,
      longevityFactor: 'लग्नेश एवं अष्टमेश की स्थिति सुदृढ़ दीर्घायु एवं उत्तम पुनरुत्थान शक्ति का संकेत देती है।'
    },
    wealth: {
      dhanaYogas: dhanaYogas,
      primeAssetClasses: 'अचल संपत्ति (भूमि-भवन), बहुमूल्य धातुएं (स्वर्ण/रजत), विनिर्माण एवं सुरक्षित दीर्घकालिक निवेश।',
      financialTiming: 'द्वितीय अर्धवर्ष एवं अनुकूल दशाओं में बड़े वित्तीय अनुबंध व अप्रत्याशित लाभ के प्रबल योग बनते हैं।'
    },
    career: {
      style: isBusiness ? 'स्वतंत्र व्यापार, उद्योग एवं साझेदारी (High Business Potential)' : 'वरिष्ठ प्रशासनिक पद, कॉरपोरेट नेतृत्व एवं प्रतिष्ठित सेवाएं',
      leadershipTrait: 'रणनीतिक निर्णय क्षमता, दीर्घकालिक दृष्टि एवं सहयोगियों से कार्य निष्पादन कराने में निपुणता।'
    },
    marriage: {
      ageWindow: ['Jupiter', 'Venus'].includes(house7.lord) ? '२३ से २७ वर्ष (शुभ व सुगम काल)' : '२६ से ३० वर्ष (परिपक्व व स्थिर काल)',
      spouseNature: 'संस्कारवान, परिवार का सम्मान करने वाले, सहयोगी एवं आकर्षक व्यक्तित्व युक्त जीवनसाथी।'
    },
    spirituality: {
      ishtaDevata: spiritual.deity,
      sacredTirthas: spiritual.tirtha,
      sadhana: 'नित्य प्रातः ध्यान, गायत्री जप एवं एकादशी/प्रदोष व्रत से मानसिक शांति एवं आध्यात्मिक उन्नति प्राप्त होगी।'
    },
    quarterlyForecast: {
      year: currentYear,
      q1: 'प्रथम त्रैमास (जनवरी-मार्च): नवीन योजनाओं का शुभारंभ, कार्यक्षेत्र में ऊर्जा व नए संपर्कों से लाभ।',
      q2: 'द्वितीय त्रैमास (अप्रैल-जून): वित्तीय संचिति, अनुबंधों पर हस्ताक्षर एवं व्यावसायिक विस्तार के ठोस अवसर।',
      q3: 'तृतीय त्रैमास (जुलाई-सितंबर): पद-प्रतिष्ठा में वृद्धि, सामाजिक सम्मान एवं पारिवारिक मांगलिक उत्सव।',
      q4: 'चतुर्थ त्रैमास (अक्टूबर-दिसंबर): दीर्घकालिक संपत्तियों में निवेश, आध्यात्मिक शांति एवं वर्ष की श्रेष्ठ उपलब्धियां।'
    }
  };
}

/**
 * Complete & Advanced Remedies Engine
 * Generates exact Mantra Japa with malas/counts, Gemstone Prana Pratishtha, Forbidden Gems, Rudraksha, Yantras & Daan
 */
export function generateComprehensiveRemedies(kundali, userInputs = {}) {
  const lagnaRashi = kundali.lagna.rashiName;
  const lagnaLord = kundali.lagna.lord;
  const house9 = kundali.houses[8];
  const lord9 = house9.lord;

  // 1. Detailed Mantra Japa Architecture
  const mantraDatabase = {
    Sun: {
      planet: 'Sun (सूर्य देव)',
      beejMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
      gayatriMantra: 'ॐ आदित्याय विद्महे प्रभाकराय धीमहि तन्नः सूर्यः प्रचोदयात्॥',
      mala: 'लाल चंदन अथवा रुद्राक्ष माला (१०८ मनके)',
      dailyCount: 'नित्य १०८ बार (१ माला)',
      totalAnushthan: '७,००० जप (२१ दिवसीय अनुष्ठान)',
      time: 'प्रातःकाल सूर्योदय के समय पूर्वाभिमुख होकर'
    },
    Moon: {
      planet: 'Moon (चन्द्र देव)',
      beejMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः',
      gayatriMantra: 'ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि तन्नो चन्द्रः प्रचोदयात्॥',
      mala: 'स्फटिक अथवा सच्चे मोती की माला',
      dailyCount: 'नित्य १०८ बार',
      totalAnushthan: '११,००० जप',
      time: 'संध्याकाल अथवा रात्रिकाल में पश्चिमाभिमुख होकर'
    },
    Mars: {
      planet: 'Mars (मंगल देव)',
      beejMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
      gayatriMantra: 'ॐ अंगारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात्॥',
      mala: 'लाल मूंगा अथवा रुद्राक्ष माला',
      dailyCount: 'नित्य १०८ बार',
      totalAnushthan: '१०,००० जप',
      time: 'प्रातःकाल स्नानोपरांत दक्षिणाभिमुख होकर'
    },
    Mercury: {
      planet: 'Mercury (बुध देव)',
      beejMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
      gayatriMantra: 'ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि तन्नो सौम्यः प्रचोदयात्॥',
      mala: 'तुलसी माला अथवा हरी अकीक माला',
      dailyCount: 'नित्य १०८ बार',
      totalAnushthan: '९,००० जप',
      time: 'प्रातःकाल उत्तराभिमुख होकर'
    },
    Jupiter: {
      planet: 'Jupiter (देवगुरु बृहस्पति)',
      beejMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
      gayatriMantra: 'ॐ अंगिरोऋषये विद्महे वाचस्पतये धीमहि तन्नो गुरुः प्रचोदयात्॥',
      mala: 'हल्दी की माला अथवा पीले चंदन की माला',
      dailyCount: 'नित्य १०८ बार (अथवा ३ माला)',
      totalAnushthan: '१९,००० जप (४० दिवसीय अनुष्ठान)',
      time: 'प्रातःकाल ब्रह्म मुहूर्त में ईशानाभिमुख होकर'
    },
    Venus: {
      planet: 'Venus (दैत्यगुरु शुक्र)',
      beejMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
      gayatriMantra: 'ॐ भृगुपुत्राय विद्महे दिव्यदेहाय धीमहि तन्नः शुक्रः प्रचोदयात्॥',
      mala: 'स्फटिक अथवा कमलगट्टे की माला',
      dailyCount: 'नित्य १०८ बार',
      totalAnushthan: '१६,००० जप',
      time: 'संध्याकाल में पूर्वाभिमुख होकर'
    },
    Saturn: {
      planet: 'Saturn (शनैश्चर देव)',
      beejMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
      gayatriMantra: 'ॐ सूर्यपुत्राय विद्महे मृत्युरूपाय धीमहि तन्नः सौरिः प्रचोदयात्॥',
      mala: 'काले रुद्राक्ष अथवा नीले धागे की माला',
      dailyCount: 'नित्य १०८ बार',
      totalAnushthan: '२३,००० जप',
      time: 'सूर्यास्त के पश्चात पश्चिमाभिमुख होकर'
    }
  };

  const lagnaMantra = mantraDatabase[lagnaLord] || mantraDatabase.Sun;
  const bhagyaMantra = mantraDatabase[lord9] || mantraDatabase.Jupiter;

  // 2. Comprehensive Gemstone Specifications & Prana Pratishtha
  const gemDatabase = {
    Aries: {
      lifeGem: 'Red Coral (इटैलियन त्रिकोणीय अथवा कैप्सूल मूँगा - ६ से ८ रत्ती, तांबा/स्वर्ण, अनामिका अंगुली, मंगलवार)',
      luckyGem: 'Yellow Sapphire (पीला पुखराज - ५ से ७ रत्ती, पंचधातु/स्वर्ण, तर्जनी अंगुली, गुरुवार)',
      avoidGems: 'Emerald (पन्ना) एवं Diamond (हीरा) कदापि धारण न करें; ये ३रे, ६ठे एवं २रे मारक भाव के स्वामी हैं।'
    },
    Taurus: {
      lifeGem: 'Diamond / White Opal (हीरा अथवा ऑस्ट्रेलियन ओपल - ५ से ७ रत्ती, चांदी/प्लैटिनम, मध्यमा/कनिष्ठिका, शुक्रवार)',
      luckyGem: 'Blue Sapphire (नीलम अथवा जामुनिया - योगकारक शनि देव का रत्न, मध्यमा अंगुली, शनिवार)',
      avoidGems: 'Ruby (माणिक्य) एवं Yellow Sapphire (पुखराज) से बचें; गुरु ८वें एवं ११वें भाव के स्वामी हैं।'
    },
    Gemini: {
      lifeGem: 'Emerald (कोलंबियन/ज़ाम्बियन पन्ना - ५ से ७ रत्ती, स्वर्ण/कांस्य, कनिष्ठिका अंगुली, बुधवार)',
      luckyGem: 'Diamond अथवा Blue Sapphire (भाग्येश शनि देव का रत्न)',
      avoidGems: 'Red Coral (मूँगा) एवं Pearl (मोती) न पहनें; मंगल ६ठे एवं ११वें भाव के शत्रु हैं।'
    },
    Cancer: {
      lifeGem: 'Natural Pearl (सच्चा दक्षिण सागरीय मोती - ६ से ८ रत्ती, शुद्ध चांदी, कनिष्ठिका अंगुली, सोमवार)',
      luckyGem: 'Yellow Sapphire (पुखराज - भाग्येश गुरु देव का रत्न, तर्जनी, गुरुवार)',
      avoidGems: 'Blue Sapphire (नीलम), Diamond (हीरा) एवं Emerald (पन्ना) सर्वथा वर्जित हैं; भारी कष्ट दे सकते हैं।'
    },
    Leo: {
      lifeGem: 'Ruby (बर्मीज माणिक्य - ५ से ७ रत्ती, तांबा अथवा स्वर्ण, अनामिका अंगुली, रविवार प्रातः)',
      luckyGem: 'Yellow Sapphire (पुखराज - ५वें त्रिकोणेश गुरु का रत्न) अथवा मूँगा (भाग्येश मंगल)',
      avoidGems: 'Blue Sapphire (नीलम) एवं Diamond (हीरा) कदापि न पहनें; शनि ६ठे एवं ७वें मारक भाव के स्वामी हैं।'
    },
    Virgo: {
      lifeGem: 'Emerald (पन्ना - ५ से ७ रत्ती, स्वर्ण/चांदी, कनिष्ठिका अंगुली, बुधवार प्रातः)',
      luckyGem: 'Diamond अथवा White Zircon (भाग्येश शुक्र देव का रत्न, अनामिका, शुक्रवार)',
      avoidGems: 'Red Coral (मूँगा) एवं Yellow Sapphire (पुखराज) से बचें; मंगल ३रे व ८वें त्रिक भाव के अधिपति हैं।'
    },
    Libra: {
      lifeGem: 'Diamond / White Opal (हीरा अथवा ओपल - ५ से ७ रत्ती, चांदी/स्वर्ण, अनामिका/मध्यमा, शुक्रवार)',
      luckyGem: 'Blue Sapphire (नीलम - योगकारक शनि देव का सर्वोच्च रत्न, ४थे व ५वें भाव के स्वामी)',
      avoidGems: 'Ruby (माणिक्य) एवं Yellow Sapphire (पुखराज) वर्जित हैं; सूर्य एकादशेश व गुरु त्रिकेश हैं।'
    },
    Scorpio: {
      lifeGem: 'Red Coral (रक्त मूँगा - ७ से ९ रत्ती, तांबा/पंचधातु, अनामिका अंगुली, मंगलवार)',
      luckyGem: 'Yellow Sapphire (पुखराज - त्रिकोणेश गुरु) अथवा मोती (भाग्येश चन्द्रमा)',
      avoidGems: 'Emerald (पन्ना) एवं Diamond (हीरा) न पहनें; बुध ८वें व ११वें तथा शुक्र मारक भाव के स्वामी हैं।'
    },
    Sagittarius: {
      lifeGem: 'Yellow Sapphire (सीलोनी पुखराज - ५ से ७ रत्ती, स्वर्ण/पीतल, तर्जनी अंगुली, गुरुवार)',
      luckyGem: 'Ruby (माणिक्य - भाग्येश सूर्य देव का रत्न, अनामिका, रविवार)',
      avoidGems: 'Diamond (हीरा), Emerald (पन्ना) एवं Blue Sapphire (नीलम) सर्वथा वर्जित हैं।'
    },
    Capricorn: {
      lifeGem: 'Blue Sapphire (नीलम अथवा कटैला - ५ से ७ रत्ती, पंचधातु/लोहा, मध्यमा अंगुली, शनिवार)',
      luckyGem: 'Emerald (पन्ना - भाग्येश बुध का रत्न) अथवा Diamond (योगकारक शुक्र)',
      avoidGems: 'Ruby (माणिक्य) एवं Red Coral (मूँगा) न पहनें; सूर्य अष्टमेश व मंगल बाधक हैं।'
    },
    Aquarius: {
      lifeGem: 'Blue Sapphire (नीलम अथवा लाजवर्द - ५ से ७ रत्ती, चांदी/पंचधातु, मध्यमा अंगुली, शनिवार)',
      luckyGem: 'Diamond (हीरा - भाग्येश शुक्र का रत्न) अथवा पन्ना (त्रिकोणेश बुध)',
      avoidGems: 'Ruby (माणिक्य), Pearl (मोती) एवं Red Coral (मूँगा) वर्जित हैं; त्रिक भाव सक्रिय हो सकते हैं।'
    },
    Pisces: {
      lifeGem: 'Yellow Sapphire (पुखराज - ६ से ८ रत्ती, स्वर्ण/पीतल, तर्जनी अंगुली, गुरुवार प्रातः)',
      luckyGem: 'Red Coral (मूँगा - भाग्येश मंगल का रत्न) अथवा मोती (पंचमेश चन्द्रमा)',
      avoidGems: 'Diamond (हीरा), Blue Sapphire (नीलम) एवं Emerald (पन्ना) कदापि धारण न करें।'
    }
  };

  const gemSpecs = gemDatabase[lagnaRashi] || gemDatabase.Aries;

  // 3. Prana Pratishtha 5-Step Vidhi
  const pranaPratishthaSteps = [
    '१. रात्रि शोधन: शुक्ल पक्ष के शुभ दिन से पूर्व संध्या पर रत्न जड़ित अंगूठी को कच्चे अदूषित गोदुग्ध, गंगाजल, तुलसी पत्र एवं शहद के सम्मिश्रण में रातभर डुबोकर रखें।',
    '२. प्रातः स्नान एवं शुद्धि: सूर्योदय काल में स्नान कर स्वच्छ वस्त्र (ग्रह के शुभ रंग अनुसार) धारण करें और पूजा स्थल पर पूर्वाभिमुख अथवा ईशानाभिमुख होकर बैठें।',
    '३. पंचामृत अभिषेक: तांबे अथवा चांदी की थाली में स्वास्तिक बनाकर अंगूठी को स्थापित करें। शुद्ध गंगाजल से स्नान कराएं, रोली, अक्षत, पीला चंदन एवं पुष्प अर्पित करें।',
    '४. मंत्र जप द्वारा प्राण ऊर्जा: शुद्ध गाय के घी का दीपक एवं गुग्गल धूप प्रज्वलित करें। अंगूठी को दाहिने हाथ में लेकर ग्रह के तांत्रिक बीज मंत्र का १०८ बार जप करें।',
    '५. शुभ मुहूर्त में धारण: जप पूर्ण होने पर इष्टदेव एवं कुलदेवता का स्मरण कर शुभ नक्षत्र/होरा में अंगूठी को निर्दिष्ट अंगुली में स्पर्श कराकर धारण करें। तत्पश्चात यथाशक्ति दान करें।'
  ];

  // 4. Rudraksha Therapy
  const rudrakshaMap = {
    Sun: { mukhi: '१ मुखी अथवा १२ मुखी रुद्राक्ष', devata: 'भगवान सूर्य नारायण', mantra: 'ॐ ह्रीं नमः / ॐ क्रौं क्षौं ग्लौं ह्रीं नमः' },
    Moon: { mukhi: '२ मुखी रुद्राक्ष (अर्धनारीश्वर)', devata: 'भगवान शिव व माता पार्वती', mantra: 'ॐ नमः' },
    Mars: { mukhi: '३ मुखी रुद्राक्ष (अग्नि देव)', devata: 'भगवान अग्नि व हनुमान जी', mantra: 'ॐ क्लीं नमः' },
    Mercury: { mukhi: '४ मुखी रुद्राक्ष (ब्रह्मा जी)', devata: 'चतुर्मुख ब्रह्मा व सरस्वती', mantra: 'ॐ ह्रीं नमः' },
    Jupiter: { mukhi: '५ मुखी रुद्राक्ष (कालाग्नि रुद्र)', devata: 'भगवान सदाशिव', mantra: 'ॐ ह्रीं नमः' },
    Venus: { mukhi: '६ मुखी रुद्राक्ष (कार्तिकेय)', devata: 'भगवान कार्तिकेय व शुक्र देव', mantra: 'ॐ ह्रीं हुं नमः' },
    Saturn: { mukhi: '७ मुखी अथवा १४ मुखी रुद्राक्ष', devata: 'माता महालक्ष्मी व हनुमान जी', mantra: 'ॐ हुं नमः' }
  };

  const rudraksha = rudrakshaMap[lagnaLord] || rudrakshaMap.Jupiter;

  return {
    mantras: {
      lagna: lagnaMantra,
      bhagya: bhagyaMantra,
      mahamrityunjaya: {
        verse: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥',
        meaning: 'समस्त व्याधियों, अकाल मृत्यु भय, दुर्घटना एवं नकारात्मक ऊर्जा से रक्षा करने वाला परम कल्याणकारी महामंत्र।',
        count: 'नित्य प्रातः अथवा संध्याकाल ११ या १०८ बार जपें।'
      },
      suryaGayatri: {
        verse: 'ॐ भास्कराय विद्महे महाद्युतिकराय धीमहि तन्नो आदित्यः प्रचोदयात्॥',
        vidhi: 'प्रातःकाल तांबे के लोटे में जल, कुमकुम, अक्षत और लाल पुष्प डालकर सूर्य देव को अर्घ्य देते हुए स्मरण करें।'
      }
    },
    gemstones: {
      ...gemSpecs,
      pranaPratishthaSteps: pranaPratishthaSteps
    },
    rudraksha: {
      ...rudraksha,
      thread: 'लाल अथवा पीले रेशमी धागे में, चांदी/स्वर्ण के कुंडे सहित',
      wearingDay: 'सोमवार, शिवरात्रि अथवा प्रदोष काल में धारण करें।'
    },
    shaniArmor: {
      chhayaDaan: 'शनिवार प्रातः तांबे अथवा लोहे के पात्र में सरसों का तेल भरकर उसमें अपना मुख देखें, १ सिक्का डालें और शनि मंदिर अथवा जरूरतमंद को दान करें।',
      treeDeepam: 'प्रति शनिवार संध्याकाल पीपल अथवा शमी वृक्ष की जड़ में तिल/सरसों के तेल का चौमुखा दीपक प्रज्वलित करें।',
      dasharathaStotram: 'राजा दशरथ कृत शनि स्तोत्र का पाठ समस्त अनिष्टों व शनि पीड़ा का शमन करता है।'
    },
    daanAndSeva: [
      '१. गौ सेवा: प्रति बुधवार या गुरुवार को गाय को हरा चारा, गुड़ और भीगी हुई चना दाल खिलाएं।',
      '२. पक्षी सेवा: छत अथवा बालकनी में प्रतिदिन पक्षियों हेतु शुद्ध जल एवं सप्तधान्य (बाजरा, ज्वार, गेहूं) रखें।',
      '३. अन्न दान: अमावस्या एवं संक्रांति पर भूखों व अनाथों को यथाशक्ति भोजन कराएं।',
      '४. वस्त्र व दीप दान: शनिवार को वृद्धों व श्रमिकों को काले कंबल, जूते अथवा छाता दान करना परम श्रेयस्कर है।'
    ]
  };
}
