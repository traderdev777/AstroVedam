/**
 * AstroVeda - Vedic Dosha Analysis & Sanatan Remedies Engine
 * Detects Manglik, Kaal Sarp, Pitra, Sade Sati, and Guru Chandal doshas
 * with authentic cancellations and step-by-step Vedic remedies.
 */

import { GRAHAS } from './constants.js';
import { calculateSaturnTransit } from './ephemeris.js';

export function analyzeDoshas(kundali, assessmentDate = null) {
  const doshas = [];
  const planets = kundali.planets;
  const houses = kundali.houses;
  const getPlanet = (name) => planets.find(p => p.name === name);

  const mars = getPlanet('Mars');
  const moon = getPlanet('Moon');
  const sun = getPlanet('Sun');
  const jupiter = getPlanet('Jupiter');
  const saturn = getPlanet('Saturn');
  const rahu = getPlanet('Rahu');
  const ketu = getPlanet('Ketu');

  // ============================================
  // 1. MANGLIK DOSHA (Kuja Dosha)
  // ============================================
  if (mars) {
    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const isLagnaManglik = manglikHouses.includes(mars.house);
    
    // Moon Manglik (from natal Moon)
    let isMoonManglik = false;
    let moonMarsHouse = 1;
    if (moon) {
      moonMarsHouse = ((mars.house - moon.house + 12) % 12) + 1;
      isMoonManglik = manglikHouses.includes(moonMarsHouse);
    }

    if (isLagnaManglik || isMoonManglik) {
      // Check classical cancellations
      const cancellations = [];
      if ([1, 8].includes(mars.rashi)) cancellations.push('Mars in own sign (Mesha/Vrischika)');
      if (mars.rashi === 10) cancellations.push('Mars exalted in Capricorn (Makara)');
      if (jupiter && [1, 5, 7, 9].includes(((jupiter.house - mars.house + 12) % 12) + 1)) {
        cancellations.push('Auspicious Jupiter aspects Mars');
      }
      if (moon && moon.house === mars.house) cancellations.push('Chandra-Mangala yoga neutralizes maleficence');
      
      const isCancelled = cancellations.length > 0;
      const intensity = isCancelled ? 'Neutralized / Low' : (isLagnaManglik && isMoonManglik ? 'High (Poorna Manglik)' : 'Mild (Anshik Manglik)');

      doshas.push({
        id: 'manglik',
        name: 'Manglik Dosha (Kuja Dosha)',
        nameHi: 'मांगलिक दोष (भौम दोष)',
        present: true,
        intensity: intensity,
        cancelled: isCancelled,
        cancellationReasons: cancellations,
        details: `Mars is placed in house ${mars.house} from Lagna${isMoonManglik ? ` and house ${moonMarsHouse} from Moon` : ''}.`,
        impact: isCancelled 
          ? 'Affliction is largely cancelled by beneficial alignments. Normal matrimonial and career life expected.'
          : 'May cause delays, misunderstandings in marital life, temperamental clashes, or partner health sensitivity.',
        remedies: [
          'Perform Kumbh Vivah / Ark Vivah before marriage under guidance of a Vedic priest.',
          'Chant the sacred Mangal Gayatri Mantra: "ॐ अंगारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात्" 108 times on Tuesdays.',
          'Recite Hanuman Chalisa daily and Sunderkand on Tuesdays.',
          'Donate red lentils (masoor dal), jaggery, or copper utensils to temple priests or Brahmins.',
          'Fast on Tuesdays or consume saltless food after sunset.'
        ]
      });
    } else {
      doshas.push({
        id: 'manglik',
        name: 'Manglik Dosha (Kuja Dosha)',
        nameHi: 'मांगलिक दोष (भौम दोष)',
        present: false,
        intensity: 'None',
        cancelled: true,
        details: 'Mars is placed in a non-afflicting house (House ' + mars.house + '). Free from Kuja Dosha.',
        impact: 'Auspicious for marital bliss, partnerships, and cooperative harmony.',
        remedies: ['Continue standard spiritual devotions to Lord Hanuman.']
      });
    }
  }

  // ============================================
  // 2. KAAL SARP DOSHA
  // ============================================
  if (rahu && ketu) {
    const rHouse = rahu.house;
    const kHouse = ketu.house;
    
    // Check if other 7 planets are on one side of Rahu-Ketu axis
    const nonNodes = planets.filter(p => p.name !== 'Rahu' && p.name !== 'Ketu');
    let sideA = 0;
    let sideB = 0;

    nonNodes.forEach(p => {
      const distFromRahu = (p.house - rHouse + 12) % 12;
      if (distFromRahu > 0 && distFromRahu < 6) sideA++;
      else if (distFromRahu > 6) sideB++;
    });

    const isFullKaalSarp = sideA === 7 || sideB === 7;
    const isPartialKaalSarp = (sideA === 6 || sideB === 6) && !isFullKaalSarp;

    const kaalSarpTypes = [
      { name: 'Anant Kaal Sarp', hi: 'अनन्त कालसर्प', houses: '1st - 7th', theme: 'Physical health, mental peace, personality' },
      { name: 'Kulik Kaal Sarp', hi: 'कुलिक कालसर्प', houses: '2nd - 8th', theme: 'Family harmony, speech, wealth accumulation' },
      { name: 'Vasuki Kaal Sarp', hi: 'वासुकी कालसर्प', houses: '3rd - 9th', theme: 'Siblings, travel, self-effort, luck' },
      { name: 'Shankhapal Kaal Sarp', hi: 'शंखपाल कालसर्प', houses: '4th - 10th', theme: 'Mother, peace of mind, domestic bliss' },
      { name: 'Padma Kaal Sarp', hi: 'पद्म कालसर्प', houses: '5th - 11th', theme: 'Progeny, higher studies, creative intellect' },
      { name: 'Mahapadma Kaal Sarp', hi: 'महापद्म कालसर्प', houses: '6th - 12th', theme: 'Debt, legal adversaries, health challenges' },
      { name: 'Takshak Kaal Sarp', hi: 'तक्षक कालसर्प', houses: '7th - 1st', theme: 'Marriage, business partnerships, abroad travel' },
      { name: 'Karkotak Kaal Sarp', hi: 'कर्कोटक कालसर्प', houses: '8th - 2nd', theme: 'Sudden obstacles, ancestral wealth, occult' },
      { name: 'Shankhachood Kaal Sarp', hi: 'शंखचूड़ कालसर्प', houses: '9th - 3rd', theme: 'Father relationship, fortune, righteousness' },
      { name: 'Ghatak Kaal Sarp', hi: 'घातक कालसर्प', houses: '10th - 4th', theme: 'Career promotions, political prestige' },
      { name: 'Vishdhar Kaal Sarp', hi: 'विषधर कालसर्प', houses: '11th - 5th', theme: 'Financial cash flow, elder siblings, gains' },
      { name: 'Sheshnag Kaal Sarp', hi: 'शेषनाग कालसर्प', houses: '12th - 6th', theme: 'Litigations, foreign settlements, expenditure' }
    ];

    const currentType = kaalSarpTypes[rHouse - 1] || kaalSarpTypes[0];

    if (isFullKaalSarp || isPartialKaalSarp) {
      doshas.push({
        id: 'kaal_sarp',
        name: isFullKaalSarp ? `Poorna ${currentType.name}` : `Anshik ${currentType.name}`,
        nameHi: currentType.hi,
        present: true,
        intensity: isFullKaalSarp ? 'Intense (Poorna)' : 'Mild (Anshik)',
        details: `Rahu in house ${rHouse} and Ketu in house ${kHouse}. All other planets align within one hemisphere.`,
        theme: currentType.theme,
        impact: 'Can cause sudden rise and sudden delays, struggle in youth followed by great success in mature age.',
        remedies: [
          'Chant Maha Mrityunjaya Mantra: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्..." 108 times daily at sunrise or sunset.',
          'Offer milk, honey, and Bilva leaves to a Shiva Lingam on Mondays and on Nag Panchami.',
          'Keep a consecrated silver cobra pair or Kal Sarp Yantra at your home pooja altar.',
          'Perform Kaal Sarp Shanti at holy pilgrimage sites like Trimbakeshwar (Nashik) or Kalahasti.',
          'Feed dogs and birds daily with whole grains.'
        ]
      });
    } else {
      doshas.push({
        id: 'kaal_sarp',
        name: 'Kaal Sarp Dosha',
        nameHi: 'कालसर्प दोष',
        present: false,
        intensity: 'None',
        details: 'Planets are freely distributed outside the Rahu-Ketu axis. No Kaal Sarp Yoga detected.',
        impact: 'Unrestricted flow of planetary energies.',
        remedies: ['Offer regular gratitude to Lord Shiva.']
      });
    }
  }

  // ============================================
  // 3. PITRA DOSHA (Ancestral Karmic Debt)
  // ============================================
  const pitraAfflictions = [];
  if (sun && (sun.house === rahu?.house || sun.house === ketu?.house || sun.house === saturn?.house)) {
    pitraAfflictions.push(`Sun afflicted by ${sun.house === rahu?.house ? 'Rahu' : (sun.house === ketu?.house ? 'Ketu' : 'Saturn')}`);
  }
  const lord9 = houses[8]?.lord;
  const planetLord9 = getPlanet(lord9);
  if (planetLord9 && (planetLord9.house === rahu?.house || planetLord9.house === 6 || planetLord9.house === 8)) {
    pitraAfflictions.push('9th house of Dharma/Father under malefic influence');
  }

  if (pitraAfflictions.length > 0) {
    doshas.push({
      id: 'pitra_dosha',
      name: 'Pitra Dosha',
      nameHi: 'पितृ दोष',
      present: true,
      intensity: pitraAfflictions.length > 1 ? 'Moderate to High' : 'Mild',
      details: pitraAfflictions.join('; '),
      impact: 'May manifest as recurring unexplainable delays, progeny hurdles, or lack of peace despite hard work.',
      remedies: [
        'Offer water mixed with black sesame seeds (Til Tarpan) facing South direction during Amavasya (New Moon).',
        'Feed cows, crows, and dogs every Saturday and Amavasya.',
        'Perform Shradh ceremonies dedicated to ancestors during Pitru Paksha.',
        'Water the sacred Peepal tree on Saturdays without touching the tree.',
        'Chant Gayatri Mantra 108 times daily for spiritual purification.'
      ]
    });
  }

  // ============================================
  // 4. GURU CHANDAL DOSHA
  // ============================================
  if (jupiter && (jupiter.house === rahu?.house || jupiter.house === ketu?.house)) {
    doshas.push({
      id: 'guru_chandal',
      name: 'Guru Chandal Dosha',
      nameHi: 'गुरु चाण्डाल दोष',
      present: true,
      intensity: 'Moderate',
      details: `Jupiter (Guru) in same house ${jupiter.house} with ${jupiter.house === rahu?.house ? 'Rahu' : 'Ketu'}.`,
      impact: 'Creates conflicts in belief systems, tendency to clash with mentors/teachers, or speculative financial errors.',
      remedies: [
        'Worship Lord Vishnu and chant "ॐ नमो भगवते वासुदेवाय" daily.',
        'Donate yellow items (chana dal, turmeric, brass vessel) on Thursdays.',
        'Wear a silver bracelet or maintain strict honesty in financial matters.'
      ]
    });
  }

  // ============================================
  // 5. SHANI SADE SATI / DHAIYA STATUS (Phase 4C.2 / 4D Dynamic Transit Assessment)
  // ============================================
  if (moon) {
    const transit = calculateSaturnTransit(
      moon,
      assessmentDate,
      kundali.birthDetails?.ayanamsa || 'LAHIRI'
    );

    doshas.push({
      id: 'shani_influence',
      name: 'Shani Influence (Sade Sati / Dhaiya)',
      nameHi: 'शनि साढ़ेसाती एवं ढैया विश्लेषण',
      valid: transit.valid,
      present: transit.valid ? transit.isAffected : false,
      intensity: !transit.valid
        ? 'Data Unavailable'
        : (transit.isAffected ? 'Active Assessment' : 'Favorable Distance'),
      phase: transit.phase,
      phaseHi: transit.phaseHi,
      phaseCode: transit.phaseCode,
      signDistance: transit.signDistance,
      transitSaturnSign: transit.transitSaturnSign,
      natalMoonSign: transit.natalMoonSign,
      isSadeSati: transit.isSadeSati,
      isDhaiya: transit.isDhaiya,
      details: transit.details,
      assessmentDate: transit.assessmentDate,
      impact: !transit.valid
        ? 'Transit evaluation could not be completed due to missing or invalid inputs.'
        : (transit.isAffected 
            ? 'Period calls for absolute honesty, hard work, patience, detachment from ego, and service to humanity.'
            : 'Saturn is placed in an amicable distance from the lunar sanctuary.'),
      remedies: [
        'Light a mustard oil lamp (Diya) with black sesame seeds under a Peepal or Shami tree every Saturday evening.',
        'Recite Dasharatha Shani Stotram or Hanuman Chalisa regularly.',
        'Perform Chhaya Daan: look into a bowl of mustard oil and donate it with a coin to a needy person on Saturdays.',
        'Wear iron or horse-shoe ring on middle finger after proper energization.'
      ]
    });
  } else {
    doshas.push({
      id: 'shani_influence',
      name: 'Shani Influence (Sade Sati / Dhaiya)',
      nameHi: 'शनि साढ़ेसाती एवं ढैया विश्लेषण',
      valid: false,
      present: false,
      intensity: 'Data Unavailable',
      phase: 'Unavailable',
      phaseHi: 'अनुपलब्ध',
      phaseCode: 'UNAVAILABLE',
      signDistance: null,
      transitSaturnSign: null,
      natalMoonSign: null,
      isSadeSati: false,
      isDhaiya: false,
      details: 'Moon sign is unavailable in the chart; Saturn transit evaluation cannot be computed.',
      assessmentDate: null,
      impact: 'Transit evaluation could not be completed due to missing natal Moon position.',
      remedies: [
        'Ensure birth time and coordinates are verified to calculate an accurate natal Moon sign.'
      ]
    });
  }

  return doshas;
}
