/**
 * AstroVeda - Vedic Astrology Constants
 * Complete Vedic astronomical data based on Surya Siddhanta & Brihat Parashara Hora Shastra
 */

// ============================================
// RASHIS (Zodiac Signs)
// ============================================
export const RASHIS = [
  { id: 1, en: 'Aries', hi: 'मेष', symbol: '♈', lord: 'Mars', element: 'Fire', quality: 'Movable', gender: 'Male' },
  { id: 2, en: 'Taurus', hi: 'वृषभ', symbol: '♉', lord: 'Venus', element: 'Earth', quality: 'Fixed', gender: 'Female' },
  { id: 3, en: 'Gemini', hi: 'मिथुन', symbol: '♊', lord: 'Mercury', element: 'Air', quality: 'Dual', gender: 'Male' },
  { id: 4, en: 'Cancer', hi: 'कर्क', symbol: '♋', lord: 'Moon', element: 'Water', quality: 'Movable', gender: 'Female' },
  { id: 5, en: 'Leo', hi: 'सिंह', symbol: '♌', lord: 'Sun', element: 'Fire', quality: 'Fixed', gender: 'Male' },
  { id: 6, en: 'Virgo', hi: 'कन्या', symbol: '♍', lord: 'Mercury', element: 'Earth', quality: 'Dual', gender: 'Female' },
  { id: 7, en: 'Libra', hi: 'तुला', symbol: '♎', lord: 'Venus', element: 'Air', quality: 'Movable', gender: 'Male' },
  { id: 8, en: 'Scorpio', hi: 'वृश्चिक', symbol: '♏', lord: 'Mars', element: 'Water', quality: 'Fixed', gender: 'Female' },
  { id: 9, en: 'Sagittarius', hi: 'धनु', symbol: '♐', lord: 'Jupiter', element: 'Fire', quality: 'Dual', gender: 'Male' },
  { id: 10, en: 'Capricorn', hi: 'मकर', symbol: '♑', lord: 'Saturn', element: 'Earth', quality: 'Movable', gender: 'Female' },
  { id: 11, en: 'Aquarius', hi: 'कुम्भ', symbol: '♒', lord: 'Saturn', element: 'Air', quality: 'Fixed', gender: 'Male' },
  { id: 12, en: 'Pisces', hi: 'मीन', symbol: '♓', lord: 'Jupiter', element: 'Water', quality: 'Dual', gender: 'Female' }
];

// ============================================
// GRAHAS (Planets)
// ============================================
export const GRAHAS = [
  { id: 0, en: 'Sun', hi: 'सूर्य', symbol: '☉', abbr: 'Su', color: '#FF6B35', nature: 'Malefic', gender: 'Male', element: 'Fire', exaltation: 1, debilitation: 7, moolatrikona: 5, ownSign: [5] },
  { id: 1, en: 'Moon', hi: 'चन्द्र', symbol: '☽', abbr: 'Mo', color: '#C8D6E5', nature: 'Benefic', gender: 'Female', element: 'Water', exaltation: 2, debilitation: 8, moolatrikona: 2, ownSign: [4] },
  { id: 2, en: 'Mars', hi: 'मंगल', symbol: '♂', abbr: 'Ma', color: '#E74C3C', nature: 'Malefic', gender: 'Male', element: 'Fire', exaltation: 10, debilitation: 4, moolatrikona: 1, ownSign: [1, 8] },
  { id: 3, en: 'Mercury', hi: 'बुध', symbol: '☿', abbr: 'Me', color: '#2ECC71', nature: 'Neutral', gender: 'Neutral', element: 'Earth', exaltation: 6, debilitation: 12, moolatrikona: 6, ownSign: [3, 6] },
  { id: 4, en: 'Jupiter', hi: 'गुरु', symbol: '♃', abbr: 'Ju', color: '#F39C12', nature: 'Benefic', gender: 'Male', element: 'Ether', exaltation: 4, debilitation: 10, moolatrikona: 9, ownSign: [9, 12] },
  { id: 5, en: 'Venus', hi: 'शुक्र', symbol: '♀', abbr: 'Ve', color: '#E8DAEF', nature: 'Benefic', gender: 'Female', element: 'Water', exaltation: 12, debilitation: 6, moolatrikona: 7, ownSign: [2, 7] },
  { id: 6, en: 'Saturn', hi: 'शनि', symbol: '♄', abbr: 'Sa', color: '#34495E', nature: 'Malefic', gender: 'Neutral', element: 'Air', exaltation: 7, debilitation: 1, moolatrikona: 11, ownSign: [10, 11] },
  { id: 7, en: 'Rahu', hi: 'राहु', symbol: '☊', abbr: 'Ra', color: '#8E44AD', nature: 'Malefic', gender: 'Male', element: 'Air', exaltation: 3, debilitation: 9, moolatrikona: 6, ownSign: [11] },
  { id: 8, en: 'Ketu', hi: 'केतु', symbol: '☋', abbr: 'Ke', color: '#95A5A6', nature: 'Malefic', gender: 'Neutral', element: 'Fire', exaltation: 9, debilitation: 3, moolatrikona: 12, ownSign: [8] }
];

// ============================================
// NAKSHATRAS (Lunar Mansions) - 27 Nakshatras
// ============================================
export const NAKSHATRAS = [
  { id: 1, en: 'Ashwini', hi: 'अश्विनी', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'Horse Head', startDeg: 0, gana: 'Deva', animal: 'Horse', gender: 'Male' },
  { id: 2, en: 'Bharani', hi: 'भरणी', lord: 'Venus', deity: 'Yama', symbol: 'Yoni', startDeg: 13.333, gana: 'Manushya', animal: 'Elephant', gender: 'Female' },
  { id: 3, en: 'Krittika', hi: 'कृत्तिका', lord: 'Sun', deity: 'Agni', symbol: 'Razor', startDeg: 26.667, gana: 'Rakshasa', animal: 'Sheep', gender: 'Female' },
  { id: 4, en: 'Rohini', hi: 'रोहिणी', lord: 'Moon', deity: 'Brahma', symbol: 'Cart', startDeg: 40, gana: 'Manushya', animal: 'Serpent', gender: 'Female' },
  { id: 5, en: 'Mrigashira', hi: 'मृगशिरा', lord: 'Mars', deity: 'Soma', symbol: 'Deer Head', startDeg: 53.333, gana: 'Deva', animal: 'Serpent', gender: 'Neutral' },
  { id: 6, en: 'Ardra', hi: 'आर्द्रा', lord: 'Rahu', deity: 'Rudra', symbol: 'Teardrop', startDeg: 66.667, gana: 'Manushya', animal: 'Dog', gender: 'Female' },
  { id: 7, en: 'Punarvasu', hi: 'पुनर्वसु', lord: 'Jupiter', deity: 'Aditi', symbol: 'Bow', startDeg: 80, gana: 'Deva', animal: 'Cat', gender: 'Male' },
  { id: 8, en: 'Pushya', hi: 'पुष्य', lord: 'Saturn', deity: 'Brihaspati', symbol: 'Flower', startDeg: 93.333, gana: 'Deva', animal: 'Ram', gender: 'Male' },
  { id: 9, en: 'Ashlesha', hi: 'आश्लेषा', lord: 'Mercury', deity: 'Nagas', symbol: 'Serpent', startDeg: 106.667, gana: 'Rakshasa', animal: 'Cat', gender: 'Female' },
  { id: 10, en: 'Magha', hi: 'मघा', lord: 'Ketu', deity: 'Pitris', symbol: 'Throne', startDeg: 120, gana: 'Rakshasa', animal: 'Rat', gender: 'Female' },
  { id: 11, en: 'Purva Phalguni', hi: 'पूर्वा फाल्गुनी', lord: 'Venus', deity: 'Bhaga', symbol: 'Hammock', startDeg: 133.333, gana: 'Manushya', animal: 'Rat', gender: 'Female' },
  { id: 12, en: 'Uttara Phalguni', hi: 'उत्तरा फाल्गुनी', lord: 'Sun', deity: 'Aryaman', symbol: 'Bed', startDeg: 146.667, gana: 'Manushya', animal: 'Cow', gender: 'Female' },
  { id: 13, en: 'Hasta', hi: 'हस्त', lord: 'Moon', deity: 'Savitar', symbol: 'Hand', startDeg: 160, gana: 'Deva', animal: 'Buffalo', gender: 'Male' },
  { id: 14, en: 'Chitra', hi: 'चित्रा', lord: 'Mars', deity: 'Vishwakarma', symbol: 'Pearl', startDeg: 173.333, gana: 'Rakshasa', animal: 'Tiger', gender: 'Female' },
  { id: 15, en: 'Swati', hi: 'स्वाति', lord: 'Rahu', deity: 'Vayu', symbol: 'Coral', startDeg: 186.667, gana: 'Deva', animal: 'Buffalo', gender: 'Female' },
  { id: 16, en: 'Vishakha', hi: 'विशाखा', lord: 'Jupiter', deity: 'Indra-Agni', symbol: 'Archway', startDeg: 200, gana: 'Rakshasa', animal: 'Tiger', gender: 'Female' },
  { id: 17, en: 'Anuradha', hi: 'अनुराधा', lord: 'Saturn', deity: 'Mitra', symbol: 'Lotus', startDeg: 213.333, gana: 'Deva', animal: 'Hare', gender: 'Male' },
  { id: 18, en: 'Jyeshtha', hi: 'ज्येष्ठा', lord: 'Mercury', deity: 'Indra', symbol: 'Earring', startDeg: 226.667, gana: 'Rakshasa', animal: 'Hare', gender: 'Female' },
  { id: 19, en: 'Moola', hi: 'मूल', lord: 'Ketu', deity: 'Nirriti', symbol: 'Root', startDeg: 240, gana: 'Rakshasa', animal: 'Dog', gender: 'Neutral' },
  { id: 20, en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा', lord: 'Venus', deity: 'Apas', symbol: 'Fan', startDeg: 253.333, gana: 'Manushya', animal: 'Monkey', gender: 'Female' },
  { id: 21, en: 'Uttara Ashadha', hi: 'उत्तराषाढ़ा', lord: 'Sun', deity: 'Vishvedevas', symbol: 'Tusk', startDeg: 266.667, gana: 'Manushya', animal: 'Mongoose', gender: 'Female' },
  { id: 22, en: 'Shravana', hi: 'श्रवण', lord: 'Moon', deity: 'Vishnu', symbol: 'Ear', startDeg: 280, gana: 'Deva', animal: 'Monkey', gender: 'Male' },
  { id: 23, en: 'Dhanishta', hi: 'धनिष्ठा', lord: 'Mars', deity: 'Vasus', symbol: 'Drum', startDeg: 293.333, gana: 'Rakshasa', animal: 'Lion', gender: 'Female' },
  { id: 24, en: 'Shatabhisha', hi: 'शतभिषा', lord: 'Rahu', deity: 'Varuna', symbol: 'Circle', startDeg: 306.667, gana: 'Rakshasa', animal: 'Horse', gender: 'Neutral' },
  { id: 25, en: 'Purva Bhadrapada', hi: 'पूर्वभाद्रपद', lord: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Sword', startDeg: 320, gana: 'Manushya', animal: 'Lion', gender: 'Male' },
  { id: 26, en: 'Uttara Bhadrapada', hi: 'उत्तरभाद्रपद', lord: 'Saturn', deity: 'Ahir Budhnya', symbol: 'Twin', startDeg: 333.333, gana: 'Manushya', animal: 'Cow', gender: 'Male' },
  { id: 27, en: 'Revati', hi: 'रेवती', lord: 'Mercury', deity: 'Pushan', symbol: 'Fish', startDeg: 346.667, gana: 'Deva', animal: 'Elephant', gender: 'Female' }
];

// ============================================
// BHAVAS (Houses) and their significations
// ============================================
export const BHAVAS = [
  { id: 1, en: 'Lagna (Ascendant)', hi: 'लग्न', signification: 'Self, personality, body, health, appearance', karakas: ['Sun'] },
  { id: 2, en: 'Dhana (Wealth)', hi: 'धन', signification: 'Wealth, family, speech, food, early education', karakas: ['Jupiter'] },
  { id: 3, en: 'Sahaja (Siblings)', hi: 'सहज', signification: 'Siblings, courage, short travels, communication', karakas: ['Mars'] },
  { id: 4, en: 'Sukha (Happiness)', hi: 'सुख', signification: 'Mother, home, vehicles, land, peace of mind', karakas: ['Moon'] },
  { id: 5, en: 'Putra (Children)', hi: 'पुत्र', signification: 'Children, intelligence, creativity, romance, past merit', karakas: ['Jupiter'] },
  { id: 6, en: 'Shatru (Enemies)', hi: 'शत्रु', signification: 'Enemies, disease, debt, service, competition', karakas: ['Mars', 'Saturn'] },
  { id: 7, en: 'Kalatra (Spouse)', hi: 'कलत्र', signification: 'Marriage, partnerships, business, foreign travel', karakas: ['Venus'] },
  { id: 8, en: 'Ayu (Longevity)', hi: 'आयु', signification: 'Longevity, transformation, occult, inheritance', karakas: ['Saturn'] },
  { id: 9, en: 'Dharma (Fortune)', hi: 'धर्म', signification: 'Father, dharma, fortune, higher learning, guru', karakas: ['Jupiter', 'Sun'] },
  { id: 10, en: 'Karma (Career)', hi: 'कर्म', signification: 'Career, status, authority, government, fame', karakas: ['Sun', 'Mercury', 'Jupiter', 'Saturn'] },
  { id: 11, en: 'Labha (Gains)', hi: 'लाभ', signification: 'Gains, income, friends, elder siblings, desires', karakas: ['Jupiter'] },
  { id: 12, en: 'Vyaya (Loss)', hi: 'व्यय', signification: 'Loss, expenses, foreign lands, liberation, sleep', karakas: ['Saturn', 'Ketu'] }
];

// ============================================
// VIMSHOTTARI DASHA - Planetary Periods
// ============================================
export const VIMSHOTTARI_DASHA = {
  totalYears: 120,
  order: ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'],
  years: {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
    'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
  },
  nakshatraLords: {
    1: 'Ketu', 2: 'Venus', 3: 'Sun', 4: 'Moon', 5: 'Mars',
    6: 'Rahu', 7: 'Jupiter', 8: 'Saturn', 9: 'Mercury',
    10: 'Ketu', 11: 'Venus', 12: 'Sun', 13: 'Moon', 14: 'Mars',
    15: 'Rahu', 16: 'Jupiter', 17: 'Saturn', 18: 'Mercury',
    19: 'Ketu', 20: 'Venus', 21: 'Sun', 22: 'Moon', 23: 'Mars',
    24: 'Rahu', 25: 'Jupiter', 26: 'Saturn', 27: 'Mercury'
  }
};

// ============================================
// YOGINI DASHA - Planetary Periods
// ============================================
export const YOGINI_DASHA = {
  totalYears: 36,
  yoginis: [
    { name: 'Mangala', planet: 'Moon', years: 1 },
    { name: 'Pingala', planet: 'Sun', years: 2 },
    { name: 'Dhanya', planet: 'Jupiter', years: 3 },
    { name: 'Bhramari', planet: 'Mars', years: 4 },
    { name: 'Bhadrika', planet: 'Mercury', years: 5 },
    { name: 'Ulka', planet: 'Saturn', years: 6 },
    { name: 'Siddha', planet: 'Venus', years: 7 },
    { name: 'Sankata', planet: 'Rahu', years: 8 }
  ]
};

// ============================================
// AYANAMSA VALUES (Reference epoch J2000.0)
// ============================================
export const AYANAMSA = {
  LAHIRI: { name: 'Lahiri (Chitrapaksha)', value2000: 23.853, rate: 50.2388475 / 3600 },
  KP: { name: 'KP (Krishnamurti)', value2000: 23.864, rate: 50.2388475 / 3600 },
  RAMAN: { name: 'Raman', value2000: 22.397, rate: 50.2388475 / 3600 },
  YUKTESHWAR: { name: 'Yukteshwar', value2000: 22.823, rate: 50.2388475 / 3600 }
};

// ============================================
// TITHI (Lunar Day) Data
// ============================================
export const TITHIS = [
  { id: 1, en: 'Pratipada', hi: 'प्रतिपदा', paksha: 'Shukla', deity: 'Agni' },
  { id: 2, en: 'Dwitiya', hi: 'द्वितीया', paksha: 'Shukla', deity: 'Brahma' },
  { id: 3, en: 'Tritiya', hi: 'तृतीया', paksha: 'Shukla', deity: 'Gauri' },
  { id: 4, en: 'Chaturthi', hi: 'चतुर्थी', paksha: 'Shukla', deity: 'Ganesh' },
  { id: 5, en: 'Panchami', hi: 'पंचमी', paksha: 'Shukla', deity: 'Nagas' },
  { id: 6, en: 'Shashthi', hi: 'षष्ठी', paksha: 'Shukla', deity: 'Kartikeya' },
  { id: 7, en: 'Saptami', hi: 'सप्तमी', paksha: 'Shukla', deity: 'Surya' },
  { id: 8, en: 'Ashtami', hi: 'अष्टमी', paksha: 'Shukla', deity: 'Rudra' },
  { id: 9, en: 'Navami', hi: 'नवमी', paksha: 'Shukla', deity: 'Durga' },
  { id: 10, en: 'Dashami', hi: 'दशमी', paksha: 'Shukla', deity: 'Dharma' },
  { id: 11, en: 'Ekadashi', hi: 'एकादशी', paksha: 'Shukla', deity: 'Vishnu' },
  { id: 12, en: 'Dwadashi', hi: 'द्वादशी', paksha: 'Shukla', deity: 'Vishnu' },
  { id: 13, en: 'Trayodashi', hi: 'त्रयोदशी', paksha: 'Shukla', deity: 'Kamadeva' },
  { id: 14, en: 'Chaturdashi', hi: 'चतुर्दशी', paksha: 'Shukla', deity: 'Shiva' },
  { id: 15, en: 'Purnima', hi: 'पूर्णिमा', paksha: 'Shukla', deity: 'Chandra' },
  { id: 16, en: 'Pratipada', hi: 'प्रतिपदा', paksha: 'Krishna', deity: 'Agni' },
  { id: 17, en: 'Dwitiya', hi: 'द्वितीया', paksha: 'Krishna', deity: 'Brahma' },
  { id: 18, en: 'Tritiya', hi: 'तृतीया', paksha: 'Krishna', deity: 'Gauri' },
  { id: 19, en: 'Chaturthi', hi: 'चतुर्थी', paksha: 'Krishna', deity: 'Ganesh' },
  { id: 20, en: 'Panchami', hi: 'पंचमी', paksha: 'Krishna', deity: 'Nagas' },
  { id: 21, en: 'Shashthi', hi: 'षष्ठी', paksha: 'Krishna', deity: 'Kartikeya' },
  { id: 22, en: 'Saptami', hi: 'सप्तमी', paksha: 'Krishna', deity: 'Surya' },
  { id: 23, en: 'Ashtami', hi: 'अष्टमी', paksha: 'Krishna', deity: 'Rudra' },
  { id: 24, en: 'Navami', hi: 'नवमी', paksha: 'Krishna', deity: 'Durga' },
  { id: 25, en: 'Dashami', hi: 'दशमी', paksha: 'Krishna', deity: 'Dharma' },
  { id: 26, en: 'Ekadashi', hi: 'एकादशी', paksha: 'Krishna', deity: 'Vishnu' },
  { id: 27, en: 'Dwadashi', hi: 'द्वादशी', paksha: 'Krishna', deity: 'Vishnu' },
  { id: 28, en: 'Trayodashi', hi: 'त्रयोदशी', paksha: 'Krishna', deity: 'Kamadeva' },
  { id: 29, en: 'Chaturdashi', hi: 'चतुर्दशी', paksha: 'Krishna', deity: 'Shiva' },
  { id: 30, en: 'Amavasya', hi: 'अमावस्या', paksha: 'Krishna', deity: 'Pitris' }
];

// ============================================
// YOGA (Panchang Yoga) - 27 Yogas
// ============================================
export const YOGAS = [
  { id: 1, en: 'Vishkambha', hi: 'विष्कम्भ', nature: 'Inauspicious' },
  { id: 2, en: 'Preeti', hi: 'प्रीति', nature: 'Auspicious' },
  { id: 3, en: 'Ayushman', hi: 'आयुष्मान', nature: 'Auspicious' },
  { id: 4, en: 'Saubhagya', hi: 'सौभाग्य', nature: 'Auspicious' },
  { id: 5, en: 'Shobhana', hi: 'शोभन', nature: 'Auspicious' },
  { id: 6, en: 'Atiganda', hi: 'अतिगण्ड', nature: 'Inauspicious' },
  { id: 7, en: 'Sukarma', hi: 'सुकर्मा', nature: 'Auspicious' },
  { id: 8, en: 'Dhriti', hi: 'धृति', nature: 'Auspicious' },
  { id: 9, en: 'Shoola', hi: 'शूल', nature: 'Inauspicious' },
  { id: 10, en: 'Ganda', hi: 'गण्ड', nature: 'Inauspicious' },
  { id: 11, en: 'Vriddhi', hi: 'वृद्धि', nature: 'Auspicious' },
  { id: 12, en: 'Dhruva', hi: 'ध्रुव', nature: 'Auspicious' },
  { id: 13, en: 'Vyaghata', hi: 'व्याघात', nature: 'Inauspicious' },
  { id: 14, en: 'Harshana', hi: 'हर्षण', nature: 'Auspicious' },
  { id: 15, en: 'Vajra', hi: 'वज्र', nature: 'Inauspicious' },
  { id: 16, en: 'Siddhi', hi: 'सिद्धि', nature: 'Auspicious' },
  { id: 17, en: 'Vyatipata', hi: 'व्यतीपात', nature: 'Inauspicious' },
  { id: 18, en: 'Variyan', hi: 'वरीयान', nature: 'Auspicious' },
  { id: 19, en: 'Parigha', hi: 'परिघ', nature: 'Inauspicious' },
  { id: 20, en: 'Shiva', hi: 'शिव', nature: 'Auspicious' },
  { id: 21, en: 'Siddha', hi: 'सिद्ध', nature: 'Auspicious' },
  { id: 22, en: 'Sadhya', hi: 'साध्य', nature: 'Auspicious' },
  { id: 23, en: 'Shubha', hi: 'शुभ', nature: 'Auspicious' },
  { id: 24, en: 'Shukla', hi: 'शुक्ल', nature: 'Auspicious' },
  { id: 25, en: 'Brahma', hi: 'ब्रह्म', nature: 'Auspicious' },
  { id: 26, en: 'Indra', hi: 'इन्द्र', nature: 'Auspicious' },
  { id: 27, en: 'Vaidhriti', hi: 'वैधृति', nature: 'Inauspicious' }
];

// ============================================
// KARANA - 11 Karanas
// ============================================
export const KARANAS = [
  { id: 1, en: 'Bava', hi: 'बव', nature: 'Movable' },
  { id: 2, en: 'Balava', hi: 'बालव', nature: 'Movable' },
  { id: 3, en: 'Kaulava', hi: 'कौलव', nature: 'Movable' },
  { id: 4, en: 'Taitila', hi: 'तैतिल', nature: 'Movable' },
  { id: 5, en: 'Garaja', hi: 'गरज', nature: 'Movable' },
  { id: 6, en: 'Vanija', hi: 'वणिज', nature: 'Movable' },
  { id: 7, en: 'Vishti', hi: 'विष्टि', nature: 'Movable' },
  { id: 8, en: 'Shakuni', hi: 'शकुनि', nature: 'Fixed' },
  { id: 9, en: 'Chatushpada', hi: 'चतुष्पद', nature: 'Fixed' },
  { id: 10, en: 'Nagava', hi: 'नाग', nature: 'Fixed' },
  { id: 11, en: 'Kimstughna', hi: 'किंस्तुघ्न', nature: 'Fixed' }
];

// ============================================
// VARA (Weekday) Data
// ============================================
export const VARAS = [
  { id: 0, en: 'Sunday', hi: 'रविवार', lord: 'Sun', color: '#FF6B35' },
  { id: 1, en: 'Monday', hi: 'सोमवार', lord: 'Moon', color: '#C8D6E5' },
  { id: 2, en: 'Tuesday', hi: 'मंगलवार', lord: 'Mars', color: '#E74C3C' },
  { id: 3, en: 'Wednesday', hi: 'बुधवार', lord: 'Mercury', color: '#2ECC71' },
  { id: 4, en: 'Thursday', hi: 'गुरुवार', lord: 'Jupiter', color: '#F39C12' },
  { id: 5, en: 'Friday', hi: 'शुक्रवार', lord: 'Venus', color: '#E8DAEF' },
  { id: 6, en: 'Saturday', hi: 'शनिवार', lord: 'Saturn', color: '#34495E' }
];

// ============================================
// GUN MILAN (Kundali Matching) - 8 Koota
// ============================================
export const ASHTAKOOTA = [
  { id: 1, en: 'Varna', hi: 'वर्ण', maxPoints: 1, description: 'Spiritual compatibility' },
  { id: 2, en: 'Vashya', hi: 'वश्य', maxPoints: 2, description: 'Mutual attraction & dominance' },
  { id: 3, en: 'Tara', hi: 'तारा', maxPoints: 3, description: 'Birth star compatibility' },
  { id: 4, en: 'Yoni', hi: 'योनि', maxPoints: 4, description: 'Physical & sexual compatibility' },
  { id: 5, en: 'Graha Maitri', hi: 'ग्रह मैत्री', maxPoints: 5, description: 'Mental compatibility' },
  { id: 6, en: 'Gana', hi: 'गण', maxPoints: 6, description: 'Temperament compatibility' },
  { id: 7, en: 'Bhakoot', hi: 'भकूट', maxPoints: 7, description: 'Love & emotional compatibility' },
  { id: 8, en: 'Nadi', hi: 'नाड़ी', maxPoints: 8, description: 'Health & genetic compatibility' }
];

// ============================================
// CHOGHADIYA - Time Division
// ============================================
export const CHOGHADIYA = {
  day: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
  night: ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
  nature: {
    'Amrit': { en: 'Excellent', hi: 'अमृत', quality: 'Best' },
    'Shubh': { en: 'Good', hi: 'शुभ', quality: 'Good' },
    'Labh': { en: 'Profitable', hi: 'लाभ', quality: 'Good' },
    'Char': { en: 'Normal', hi: 'चर', quality: 'Neutral' },
    'Rog': { en: 'Inauspicious', hi: 'रोग', quality: 'Bad' },
    'Kaal': { en: 'Very Bad', hi: 'काल', quality: 'Bad' },
    'Udveg': { en: 'Disturbing', hi: 'उद्वेग', quality: 'Bad' }
  }
};

// ============================================
// PLANETARY FRIENDSHIP TABLE
// ============================================
export const FRIENDSHIP = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'], neutral: ['Mercury'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: [], neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'], neutral: ['Venus', 'Saturn'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'], neutral: ['Mars', 'Jupiter', 'Saturn'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'], neutral: ['Saturn'] },
  Venus: { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'], neutral: ['Mars', 'Jupiter'] },
  Saturn: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'], neutral: ['Jupiter'] }
};

// ============================================
// HORA Lords (Planetary Hours)
// ============================================
export const HORA_SEQUENCE = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
export const DAY_HORA_START = {
  0: 0, // Sunday starts with Sun
  1: 3, // Monday starts with Moon
  2: 6, // Tuesday starts with Mars
  3: 2, // Wednesday starts with Mercury
  4: 5, // Thursday starts with Jupiter
  5: 1, // Friday starts with Venus
  6: 4  // Saturday starts with Saturn
};

// ============================================
// RAHU KAAL timings (fraction of day, from sunrise)
// ============================================
export const RAHU_KAAL = {
  0: { start: 4.5, end: 6 },   // Sunday: 4:30 PM - 6 PM (approx 8th muhurta)
  1: { start: 1.5, end: 3 },   // Monday: 7:30 AM - 9 AM
  2: { start: 3, end: 4.5 },   // Tuesday
  3: { start: 4.5, end: 6 },   // Wednesday (corrected by day calculation)
  4: { start: 3, end: 4.5 },   // Thursday
  5: { start: 1.5, end: 3 },   // Friday
  6: { start: 0, end: 1.5 }    // Saturday: first period after sunrise
};

// Rahu Kaal in 8ths of daytime: [period_number] 
// Mon=2, Sat=1, Fri=4, Wed=5, Thu=3, Tue=7, Sun=8
export const RAHU_KAAL_PERIOD = { 0: 8, 1: 2, 2: 7, 3: 5, 4: 3, 5: 4, 6: 1 };
