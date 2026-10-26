/**
 * AstroVeda - Vedic Yoga Calculation Engine
 * Identifies classical auspicious yogas based on Brihat Parashara Hora Shastra
 */

import { RASHIS, GRAHAS } from './constants.js';

export function identifyYogas(kundali) {
  const yogas = [];
  const planets = kundali.planets;
  const houses = kundali.houses;
  const lagnaRashi = kundali.lagna.rashi;

  // Helper getters
  const getPlanet = (name) => planets.find(p => p.name === name);
  const getPlanetsInHouse = (hNum) => houses[hNum - 1]?.planets || [];
  const getLordOfHouse = (hNum) => houses[hNum - 1]?.lord;

  const sun = getPlanet('Sun');
  const moon = getPlanet('Moon');
  const mars = getPlanet('Mars');
  const mercury = getPlanet('Mercury');
  const jupiter = getPlanet('Jupiter');
  const venus = getPlanet('Venus');
  const saturn = getPlanet('Saturn');
  const rahu = getPlanet('Rahu');
  const ketu = getPlanet('Ketu');

  // 1. Budhaditya Yoga (Sun + Mercury in same house)
  if (sun && mercury && sun.house === mercury.house) {
    yogas.push({
      name: 'Budhaditya Yoga',
      nameHi: 'बुधादित्य योग',
      category: 'Intellect & Fame',
      description: 'Conjunction of Sun (Soul & Authority) and Mercury (Intellect). Grants sharp intellect, administrative brilliance, and eloquence.',
      strength: sun.strength.strength > 40 && mercury.strength.strength > 40 ? 'Strong' : 'Moderate',
      house: sun.house,
      remedy: 'Recite Aditya Hridaya Stotram on Sundays and Gayatri Mantra.'
    });
  }

  // 2. Gaja Kesari Yoga (Jupiter in Kendra from Moon: 1, 4, 7, 10 houses away)
  if (jupiter && moon) {
    const diff = ((jupiter.house - moon.house + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(diff)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        nameHi: 'गजकेसरी योग',
        category: 'Royalty & Wisdom',
        description: 'Jupiter in Kendra from Moon. The elephant and lion combination provides immense respect, wisdom, virtuous character, lasting wealth, and noble authority.',
        strength: jupiter.strength.strength >= 50 ? 'Very Auspicious' : 'Auspicious',
        house: jupiter.house,
        remedy: 'Worship Lord Shiva and donate yellow items or chana dal on Thursdays.'
      });
    }
  }

  // 3. Chandra-Mangala Yoga (Moon and Mars in same house)
  if (moon && mars && moon.house === mars.house) {
    yogas.push({
      name: 'Chandra-Mangala Yoga',
      nameHi: 'चन्द्र-मंगल योग',
      category: 'Wealth & Enterprise',
      description: 'Moon and Mars conjunction gives great financial accumulative power, entrepreneurial drive, and material prosperity through energetic pursuits.',
      strength: 'Auspicious',
      house: moon.house,
      remedy: 'Channel aggressive impulses into constructive trade or philanthropic projects.'
    });
  }

  // 4. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Kendra in own/exalted rashi)
  const kendras = [1, 4, 7, 10];

  // Ruchaka Yoga (Mars)
  if (mars && kendras.includes(mars.house)) {
    if ([1, 8, 10].includes(mars.rashi)) {
      yogas.push({
        name: 'Ruchaka Yoga (Pancha Mahapurusha)',
        nameHi: 'रुचक योग (पञ्च महापुरुष)',
        category: 'Courage & Leadership',
        description: 'Mars exalted in Capricorn or in own signs Aries/Scorpio in Kendra. Endows physical prowess, military or executive victory, valor, and commander virtues.',
        strength: mars.rashi === 10 ? 'Exalted (Param Ruchaka)' : 'Strong',
        house: mars.house,
        remedy: 'Worship Lord Hanuman and recite Hanuman Chalisa every Tuesday.'
      });
    }
  }

  // Bhadra Yoga (Mercury)
  if (mercury && kendras.includes(mercury.house)) {
    if ([3, 6].includes(mercury.rashi)) {
      yogas.push({
        name: 'Bhadra Yoga (Pancha Mahapurusha)',
        nameHi: 'भद्र योग (पञ्च महापुरुष)',
        category: 'Genius & Business',
        description: 'Mercury in Gemini or Virgo in Kendra. Imparts rare analytical brilliance, business acumen, scholarly achievements, and master communication.',
        strength: mercury.rashi === 6 ? 'Exalted (Supreme Bhadra)' : 'Strong',
        house: mercury.house,
        remedy: 'Feed green grass or spinach to cows on Wednesday; keep Budh Yantra.'
      });
    }
  }

  // Hamsa Yoga (Jupiter)
  if (jupiter && kendras.includes(jupiter.house)) {
    if ([4, 9, 12].includes(jupiter.rashi)) {
      yogas.push({
        name: 'Hamsa Yoga (Pancha Mahapurusha)',
        nameHi: 'हंस योग (पञ्च महापुरुष)',
        category: 'Spiritual Majesty',
        description: 'Jupiter exalted in Cancer or in Sagittarius/Pisces in Kendra. Gives supreme wisdom, spiritual righteousness, royal favor, and sacred discernment.',
        strength: jupiter.rashi === 4 ? 'Exalted (Param Hamsa)' : 'Strong',
        house: jupiter.house,
        remedy: 'Respect gurus and teachers; offer water with turmeric to Peepal tree.'
      });
    }
  }

  // Malavya Yoga (Venus)
  if (venus && kendras.includes(venus.house)) {
    if ([2, 7, 12].includes(venus.rashi)) {
      yogas.push({
        name: 'Malavya Yoga (Pancha Mahapurusha)',
        nameHi: 'मालव्य योग (पञ्च महापुरुष)',
        category: 'Luxury, Arts & Grace',
        description: 'Venus exalted in Pisces or in Taurus/Libra in Kendra. Grants extraordinary aesthetic charm, luxury vehicles, matrimonial harmony, and artistic glory.',
        strength: venus.rashi === 12 ? 'Exalted (Param Malavya)' : 'Strong',
        house: venus.house,
        remedy: 'Honor women; offer white flowers and sweets to Goddess Lakshmi on Fridays.'
      });
    }
  }

  // Sasa Yoga (Saturn)
  if (saturn && kendras.includes(saturn.house)) {
    if ([7, 10, 11].includes(saturn.rashi)) {
      yogas.push({
        name: 'Sasa Yoga (Pancha Mahapurusha)',
        nameHi: 'शश योग (पञ्च महापुरुष)',
        category: 'Endurance & Power',
        description: 'Saturn exalted in Libra or in Capricorn/Aquarius in Kendra. Endows perseverance, mastery over masses, organizational command, and sustained success in later life.',
        strength: saturn.rashi === 7 ? 'Exalted (Param Sasa)' : 'Strong',
        house: saturn.house,
        remedy: 'Light mustard oil lamp under Shami or Peepal tree on Saturday evenings.'
      });
    }
  }

  // 5. Lakshmi Yoga (9th lord in Kendra/Trikona exalted or in own house)
  const lord9 = getLordOfHouse(9);
  const planetLord9 = getPlanet(lord9);
  if (planetLord9 && [1, 4, 5, 7, 9, 10].includes(planetLord9.house)) {
    const isStrong = planetLord9.strength.strength >= 80;
    if (isStrong) {
      yogas.push({
        name: 'Lakshmi Yoga',
        nameHi: 'लक्ष्मी योग',
        category: 'Prosperity & Fortune',
        description: 'Divine alignment of the 9th lord of fortune in auspicious stations. Bestows boundless grace of Goddess Mahalakshmi, noble reputation, and abundant fortune.',
        strength: 'Supreme Auspicious',
        house: planetLord9.house,
        remedy: 'Recite Sri Suktam or Mahalakshmi Ashtakam on Fridays.'
      });
    }
  }

  // 6. Vipreet Raj Yogas (Harsha, Sarala, Vimala)
  const lord6 = getPlanet(getLordOfHouse(6));
  const lord8 = getPlanet(getLordOfHouse(8));
  const lord12 = getPlanet(getLordOfHouse(12));
  const dusthanas = [6, 8, 12];

  if (lord6 && dusthanas.includes(lord6.house)) {
    yogas.push({
      name: 'Harsha Vipreet Raj Yoga',
      nameHi: 'हर्ष विपरीत राजयोग',
      category: 'Triumph over Adversity',
      description: '6th lord positioned in a Dusthana (6, 8, or 12). Grants absolute triumph over rivals, immunity from secret enemies, good vitality, and victory after trial.',
      strength: 'Moderate Auspicious',
      house: lord6.house,
      remedy: 'Help underprivileged or sick people unconditionally.'
    });
  }
  if (lord8 && dusthanas.includes(lord8.house)) {
    yogas.push({
      name: 'Sarala Vipreet Raj Yoga',
      nameHi: 'सरल विपरीत राजयोग',
      category: 'Fearlessness & Wealth',
      description: '8th lord placed in 6, 8, or 12. Imparts fearlessness, longevity, unexpected gains, esoteric mastery, and turning setbacks into breakthroughs.',
      strength: 'Moderate Auspicious',
      house: lord8.house,
      remedy: 'Chant Maha Mrityunjaya Mantra 108 times on Mondays.'
    });
  }
  if (lord12 && dusthanas.includes(lord12.house)) {
    yogas.push({
      name: 'Vimala Vipreet Raj Yoga',
      nameHi: 'विमल विपरीत राजयोग',
      category: 'Noble Virtue & Savings',
      description: '12th lord situated in 6, 8, or 12. Bestows modest frugal wealth, spiritual detachment, freedom from hefty debts, and independent life expression.',
      strength: 'Moderate Auspicious',
      house: lord12.house,
      remedy: 'Regular meditation and quiet spiritual pilgrimages.'
    });
  }

  // 7. Amala Yoga (Benefic in 10th house)
  const benefics = ['Jupiter', 'Venus', 'Mercury'];
  const house10Planets = getPlanetsInHouse(10);
  const hasBeneficIn10 = house10Planets.some(p => benefics.includes(p.name));
  if (hasBeneficIn10) {
    yogas.push({
      name: 'Amala Yoga',
      nameHi: 'अमल योग',
      category: 'Flawless Fame & Career',
      description: 'Natural benefic in the 10th house of career. Bestows spotless professional honor, benevolent conduct, societal patronage, and philanthropic leadership.',
      strength: 'Auspicious',
      house: 10,
      remedy: 'Maintain utmost integrity in professional and business transactions.'
    });
  }

  // 8. Saraswati Yoga
  const auspiciousHouses = [1, 2, 4, 5, 7, 9, 10];
  if (
    jupiter && auspiciousHouses.includes(jupiter.house) &&
    venus && auspiciousHouses.includes(venus.house) &&
    mercury && auspiciousHouses.includes(mercury.house)
  ) {
    yogas.push({
      name: 'Saraswati Yoga',
      nameHi: 'सरस्वती योग',
      category: 'Learning, Arts & Literature',
      description: 'All three natural benefics grace the auspicious houses. Grants high scholarship, poetic talent, mastery of prose and sciences, and divine blessings of Maa Saraswati.',
      strength: 'Supreme Auspicious',
      house: 1,
      remedy: 'Donate books, pens, and educational materials to needy students.'
    });
  }

  // 9. Dhan Yoga
  const lord2 = getPlanet(getLordOfHouse(2));
  const lord11 = getPlanet(getLordOfHouse(11));
  if (lord2 && lord11 && (lord2.house === lord11.house || lord2.house === 11 || lord11.house === 2)) {
    yogas.push({
      name: 'Maha Dhan Yoga',
      nameHi: 'महा धन योग',
      category: 'Abundant Wealth',
      description: 'Harmonious link between 2nd house of accumulated wealth and 11th house of income and gains. Ensures multi-stream revenues and lasting familial wealth.',
      strength: 'Very Auspicious',
      house: lord2.house,
      remedy: 'Keep an energized Kuber Yantra in the North/North-East zone of your home.'
    });
  }

  return yogas;
}
