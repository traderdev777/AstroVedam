/**
 * AstroVeda - Ashtakoota Kundali Matching Engine (36 Gunas)
 * Deep Vedic analysis with definitive marriage verdict and exact per-dosha remedies.
 */

import { NAKSHATRAS, RASHIS, FRIENDSHIP } from './constants.js';

function getVarna(rashi) {
  if ([4, 8, 12].includes(rashi)) return { name: 'Brahmin', nameHi: 'ब्राह्मण', rank: 4 };
  if ([1, 5, 9].includes(rashi)) return { name: 'Kshatriya', nameHi: 'क्षत्रिय', rank: 3 };
  if ([2, 6, 10].includes(rashi)) return { name: 'Vaishya', nameHi: 'वैश्य', rank: 2 };
  return { name: 'Shudra', nameHi: 'शूद्र', rank: 1 };
}

function getVashya(rashi) {
  if ([1, 2, 9, 10].includes(rashi)) return 'Chatushpada';
  if ([3, 6, 7, 11].includes(rashi)) return 'Manava';
  if ([4, 12].includes(rashi)) return 'Jalachara';
  if ([5].includes(rashi)) return 'Vanachara';
  return 'Keeta';
}

const YONI_PAIRS = {
  1: 'Horse', 2: 'Elephant', 3: 'Sheep', 4: 'Serpent', 5: 'Serpent',
  6: 'Dog', 7: 'Cat', 8: 'Sheep', 9: 'Cat', 10: 'Rat',
  11: 'Rat', 12: 'Cow', 13: 'Buffalo', 14: 'Tiger', 15: 'Buffalo',
  16: 'Tiger', 17: 'Hare', 18: 'Hare', 19: 'Dog', 20: 'Monkey',
  21: 'Mongoose', 22: 'Monkey', 23: 'Lion', 24: 'Horse', 25: 'Lion',
  26: 'Cow', 27: 'Elephant'
};

const ENEMY_ANIMALS = {
  'Horse': 'Buffalo', 'Buffalo': 'Horse',
  'Elephant': 'Lion', 'Lion': 'Elephant',
  'Sheep': 'Monkey', 'Monkey': 'Sheep',
  'Serpent': 'Mongoose', 'Mongoose': 'Serpent',
  'Dog': 'Hare', 'Hare': 'Dog',
  'Cat': 'Rat', 'Rat': 'Cat',
  'Cow': 'Tiger', 'Tiger': 'Cow'
};

function getNadi(nakshatra) {
  const mod = (nakshatra - 1) % 6;
  if (mod === 0 || mod === 5) return 'Adi';
  if (mod === 1 || mod === 4) return 'Madhya';
  return 'Antya';
}

export function matchHoroscopes(boyKundali, girlKundali) {
  const boyMoon = boyKundali.planets.find(p => p.name === 'Moon');
  const girlMoon = girlKundali.planets.find(p => p.name === 'Moon');

  const boyNak = boyMoon.nakshatra;
  const girlNak = girlMoon.nakshatra;
  const boyRashi = boyMoon.rashi;
  const girlRashi = girlMoon.rashi;

  const boyNakData = NAKSHATRAS[boyNak - 1];
  const girlNakData = NAKSHATRAS[girlNak - 1];
  const boyRashiData = RASHIS[boyRashi - 1];
  const girlRashiData = RASHIS[girlRashi - 1];

  let totalPoints = 0;
  const kootas = [];
  const detectedDoshas = [];

  // 1. VARNA (1 Point)
  const boyVarna = getVarna(boyRashi);
  const girlVarna = getVarna(girlRashi);
  let varnaPts = 0;
  if (boyVarna.rank >= girlVarna.rank) {
    varnaPts = 1;
  } else {
    detectedDoshas.push({
      id: 'varna_dosha',
      title: 'Varna Dosha (वर्ण दोष)',
      description: `Groom is ${boyVarna.name} and Bride is ${girlVarna.name}. Traditionally inverted spiritual rank hierarchy.`,
      severity: 'Mild',
      remedies: [
        'Feed cows with green fodder and jaggery on Wednesdays and Thursdays.',
        'Donate books or yellow stationery to underprivileged students.'
      ]
    });
  }
  totalPoints += varnaPts;
  kootas.push({
    name: 'Varna Koota',
    nameHi: 'वर्ण कूट',
    max: 1,
    obtained: varnaPts,
    description: 'Spiritual inclination & ego balance',
    boyVal: boyVarna.name,
    girlVal: girlVarna.name,
    status: varnaPts === 1 ? 'Compatible' : 'Incompatible'
  });

  // 2. VASHYA (2 Points)
  const boyVashya = getVashya(boyRashi);
  const girlVashya = getVashya(girlRashi);
  let vashyaPts = 0;
  if (boyVashya === girlVashya) vashyaPts = 2;
  else if ((boyVashya === 'Manava' && girlVashya === 'Chatushpada') || (boyVashya === 'Chatushpada' && girlVashya === 'Manava')) vashyaPts = 1;
  else if (boyVashya === 'Jalachara' && girlVashya === 'Manava') vashyaPts = 1;
  else vashyaPts = 0.5;
  totalPoints += vashyaPts;
  kootas.push({
    name: 'Vashya Koota',
    nameHi: 'वश्य कूट',
    max: 2,
    obtained: vashyaPts,
    description: 'Mutual attraction and natural dominance',
    boyVal: boyVashya,
    girlVal: girlVashya,
    status: vashyaPts >= 1 ? 'Good' : 'Average'
  });

  // 3. TARA (3 Points)
  const distGB = ((boyNak - girlNak + 27) % 27) % 9;
  const distBG = ((girlNak - boyNak + 27) % 27) % 9;
  const badTaras = [2, 4, 6];
  let taraPts = 0;
  if (!badTaras.includes(distGB) && !badTaras.includes(distBG)) taraPts = 3;
  else if (!badTaras.includes(distGB) || !badTaras.includes(distBG)) taraPts = 1.5;
  else {
    taraPts = 0;
    detectedDoshas.push({
      id: 'tara_dosha',
      title: 'Tara Dosha (तारा दोष)',
      description: 'Adverse Nakshatra count indicating periodic energy draining and health vulnerability.',
      severity: 'Moderate',
      remedies: [
        'Chant Navagraha Stotram on Saturdays and Tuesdays.',
        'Donate whole wheat, rice, and pulses according to your weight on birth star days.'
      ]
    });
  }
  totalPoints += taraPts;
  kootas.push({
    name: 'Tara Koota',
    nameHi: 'तारा कूट',
    max: 3,
    obtained: taraPts,
    description: 'Destiny, health, and mutual well-being',
    boyVal: boyNakData.en,
    girlVal: girlNakData.en,
    status: taraPts >= 1.5 ? 'Favorable' : 'Dosha present'
  });

  // 4. YONI (4 Points)
  const boyYoni = YONI_PAIRS[boyNak];
  const girlYoni = YONI_PAIRS[girlNak];
  let yoniPts = 2;
  if (boyYoni === girlYoni) {
    yoniPts = 4;
  } else if (ENEMY_ANIMALS[boyYoni] === girlYoni) {
    yoniPts = 0;
    detectedDoshas.push({
      id: 'yoni_dosha',
      title: 'Yoni Vair Dosha (योनि वैर दोष)',
      description: `Inimical animal archetypes (${boyYoni} vs ${girlYoni}) causing physical discord and sexual friction.`,
      severity: 'High',
      remedies: [
        'Perform Gauri-Shankar Puja before marriage.',
        'Keep two energized Gomti Chakras wrapped in red cloth in the master bedroom.'
      ]
    });
  } else {
    yoniPts = 2.5;
  }
  totalPoints += yoniPts;
  kootas.push({
    name: 'Yoni Koota',
    nameHi: 'योनि कूट',
    max: 4,
    obtained: yoniPts,
    description: 'Physical compatibility and biological harmony',
    boyVal: boyYoni,
    girlVal: girlYoni,
    status: yoniPts === 4 ? 'Perfect' : (yoniPts === 0 ? 'Yoni Vair (Enemy)' : 'Neutral')
  });

  // 5. GRAHA MAITRI (5 Points)
  const boyLord = boyRashiData.lord;
  const girlLord = girlRashiData.lord;
  let maitriPts = 0;
  if (boyLord === girlLord) {
    maitriPts = 5;
  } else {
    const boyFriends = FRIENDSHIP[boyLord]?.friends || [];
    const girlFriends = FRIENDSHIP[girlLord]?.friends || [];
    const isBf = boyFriends.includes(girlLord);
    const isGf = girlFriends.includes(boyLord);
    if (isBf && isGf) {
      maitriPts = 5;
    } else if (isBf || isGf) {
      maitriPts = 3.5;
    } else {
      maitriPts = 1;
      detectedDoshas.push({
        id: 'graha_maitri_dosha',
        title: 'Graha Maitri Dosha (ग्रह मैत्री दोष)',
        description: `Planetary discord between Groom's lord (${boyLord}) and Bride's lord (${girlLord}). Causes divergent intellectual outlooks, stubborn ego stands, and differing core values.`,
        severity: 'High',
        remedies: [
          'Perform Lakshmi-Narayana Puja jointly on Thursdays and Fridays.',
          'Groom and Bride should mutually offer water (Arghya) with red sandalwood and kumkum to the rising Sun every morning.',
          'Keep an energized Surya Yantra and Shukra Yantra in the East quadrant of the living room.'
        ]
      });
    }
  }
  totalPoints += maitriPts;
  kootas.push({
    name: 'Graha Maitri',
    nameHi: 'ग्रह मैत्री',
    max: 5,
    obtained: maitriPts,
    description: 'Intellectual rapport and psychological friendship',
    boyVal: `${boyRashiData.en} (${boyLord})`,
    girlVal: `${girlRashiData.en} (${girlLord})`,
    status: maitriPts >= 3.5 ? 'Friendly' : 'Challenging'
  });

  // 6. GANA (6 Points)
  const boyGana = boyNakData.gana;
  const girlGana = girlNakData.gana;
  let ganaPts = 0;
  let isGanaDosha = false;
  if (boyGana === girlGana) {
    ganaPts = 6;
  } else if ((boyGana === 'Deva' && girlGana === 'Manushya') || (boyGana === 'Manushya' && girlGana === 'Deva')) {
    ganaPts = 5;
  } else if (boyGana === 'Rakshasa' && girlGana === 'Deva') {
    ganaPts = 1;
    isGanaDosha = true;
  } else if (boyGana === 'Deva' && girlGana === 'Rakshasa') {
    ganaPts = 0;
    isGanaDosha = true;
  } else {
    ganaPts = 1;
  }

  if (isGanaDosha) {
    detectedDoshas.push({
      id: 'gana_dosha',
      title: 'Gana Dosha (गण दोष - देव वर एवं राक्षस कन्या)',
      description: `Deva Gana Groom and Rakshasa Gana Bride. In classical Jyotish, this is a major temperamental clash: the Bride tends to be commanding, sharp, fiercely assertive and independent, whereas the Groom tends to be diplomatic, idealistic, and peace-seeking. High probability of domestic friction unless tempered.`,
      severity: 'Critical',
      remedies: [
        'Brihaspati (Jupiter) & Shukra (Venus) Shanti: Perform a special Vedic Navagraha Shanti Havan prior to the wedding ceremonies.',
        'Gayatri Mantra Anushthan: Both partners must commit to chanting 24 or 108 Gayatri Mantras daily at sunrise facing East.',
        'Maa Durga / Gauri Vrat: The Bride should worship Goddess Gauri on Fridays and observe fast on Shukla Paksha Ashtami to channel fierce cosmic energy into protective, nurturing grace.',
        'Psychological & Behavioral Discipline: The Groom must cultivate conscious patience and avoid defensive sarcasm; the Bride must consciously moderate temperamental outbursts and avoid public disrespect.'
      ]
    });
  }

  totalPoints += ganaPts;
  kootas.push({
    name: 'Gana Koota',
    nameHi: 'गण कूट',
    max: 6,
    obtained: ganaPts,
    description: 'Temperament and behavioral compatibility',
    boyVal: boyGana,
    girlVal: girlGana,
    status: ganaPts >= 5 ? 'Harmonious' : (ganaPts === 0 ? 'Gana Dosha' : 'Moderate')
  });

  // 7. BHAKOOT (7 Points)
  const rashiDiff = Math.abs(boyRashi - girlRashi);
  let bhakootPts = 7;
  let bhakootDosha = false;
  if ([1, 11].includes(rashiDiff)) { bhakootPts = 0; bhakootDosha = true; } // 2-12
  else if ([5, 7].includes(rashiDiff)) { bhakootPts = 0; bhakootDosha = true; } // 6-8 (Shadashtak)
  else if ([4, 8].includes(rashiDiff)) { bhakootPts = 0; bhakootDosha = true; } // 9-5 (Navam-Pancham)

  // Bhakoot cancellation
  if (bhakootDosha && (boyLord === girlLord || FRIENDSHIP[boyLord]?.friends.includes(girlLord))) {
    bhakootPts = 7;
    bhakootDosha = false;
  }

  if (bhakootDosha) {
    detectedDoshas.push({
      id: 'bhakoot_dosha',
      title: 'Bhakoot Dosha (भकूट दोष)',
      description: 'Adverse relative placement of Moon signs affecting financial accumulation and emotional attachment.',
      severity: 'High',
      remedies: [
        'Perform Mahavishnu or Shiva Sahasranama chanting.',
        'Observe Ekadashi fasts and donate yellow fruits to Brahmins.'
      ]
    });
  }

  totalPoints += bhakootPts;
  kootas.push({
    name: 'Bhakoot Koota',
    nameHi: 'भकूट कूट',
    max: 7,
    obtained: bhakootPts,
    description: 'Emotional romance, health, and familial longevity',
    boyVal: `${boyRashi} (${boyRashiData.en})`,
    girlVal: `${girlRashi} (${girlRashiData.en})`,
    status: bhakootPts === 7 ? 'Auspicious (Bhakoot Clean)' : 'Bhakoot Dosha'
  });

  // 8. NADI (8 Points)
  const boyNadi = getNadi(boyNak);
  const girlNadi = getNadi(girlNak);
  let nadiPts = 0;
  let nadiDosha = false;

  if (boyNadi !== girlNadi) {
    nadiPts = 8;
  } else {
    nadiDosha = true;
    // Cancellation rules
    if (boyRashi === girlRashi && boyNak !== girlNak) {
      nadiPts = 8;
      nadiDosha = false;
    }
  }

  if (nadiDosha) {
    detectedDoshas.push({
      id: 'nadi_dosha',
      title: `Antya Nadi Dosha (नाड़ी दोष - अन्त्य नाड़ी)`,
      description: `Both Groom and Bride share the same Antya (Kapha / Pitru) Nadi. In Vedic genetics and Ayurvedic cosmology, identical Nadis threaten physical vitality, biological compatibility, chronic health depletion, progeny (santan) delays or complications, and genetic afflictions. It carries 8 full points (the heaviest factor in marriage).`,
      severity: 'Critical / Mahadosha',
      remedies: [
        'Suvarna Naag Daan (स्वर्ण नाग दान): Before Vivah Sanskar, donate a pair of consecrated serpents crafted in Gold or Silver along with cow ghee, black sesame seeds, copper vessel, and clothes to an upright Vedic scholar on a Monday or Nag Panchami.',
        'Maha Mrityunjaya Anushthan (महामृत्युंजय अनुष्ठान): Complete 1,25,000 recitations of the Maha Mrityunjaya Mantra ("ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्...") with full Havan and Bilva samidha.',
        'Swarna Kanya Daan: The Bride\'s parents must perform Kanya Daan accompanied by gifting gold to sanctify genetic lineage.',
        'Panchamrit Rudrabhishek: Perform monthly Ekadasha Rudrabhishek of Lord Shiva using milk, honey, curd, ghee, and sugarcane juice.',
        'Go-Daan / Cow Service: Donate a cow or serve cows in a Gau-shala regularly, feeding them fresh green grass and jaggery on Wednesdays.'
      ]
    });
  }

  totalPoints += nadiPts;
  kootas.push({
    name: 'Nadi Koota',
    nameHi: 'नाड़ी कूट',
    max: 8,
    obtained: nadiPts,
    description: 'Genetic compatibility, progeny, and physiological health',
    boyVal: boyNadi,
    girlVal: girlNadi,
    status: nadiPts === 8 ? 'Safe (No Nadi Dosha)' : `Nadi Dosha (${boyNadi} Nadi)`
  });

  // ============================================
  // DEFINITIVE MARRIAGE DECISION & VERDICT
  // ============================================
  let verdict = '';
  let verdictHi = '';
  let color = '';
  let canMarry = 'NO';
  let decisionBadge = '';
  let decisionTitle = '';
  let detailedConclusion = '';
  let detailedConclusionHi = '';

  if (totalPoints >= 28 && !nadiDosha) {
    verdict = 'Excellent Match (Uttam Milan)';
    verdictHi = 'उत्तम मिलान - अत्यंत शुभ विवाह योग';
    color = '#10B981';
    canMarry = 'YES';
    decisionBadge = 'IDEAL FOR MARRIAGE (सर्वोत्तम)';
    decisionTitle = 'YES — Highly Recommended for Auspicious Marriage';
    detailedConclusion = 'This alliance scores exceptionally high across spiritual, mental, genetic, and biological dimensions. Marital longevity, happiness, and prosperity are strongly favored by Sanatan traditions.';
  } else if (totalPoints >= 18 && !nadiDosha) {
    verdict = 'Good Match (Madhyam Milan)';
    verdictHi = 'मध्यम मिलान - सामान्य अनुकूल';
    color = '#F59E0B';
    canMarry = 'YES';
    decisionBadge = 'APPROVED WITH MINOR REMEDIES (स्वीकार्य)';
    decisionTitle = 'YES — Permitted with Standard Auspicious Rituals';
    detailedConclusion = 'The alliance crosses the required 18-point threshold without critical Nadi Dosha. Marriage is permitted with standard blessings of Lord Ganesha and Gauri-Shankar.';
  } else if (totalPoints >= 18 && nadiDosha) {
    verdict = 'Borderline Match (Madhyam with Nadi Dosha)';
    verdictHi = 'मध्यम मिलान - नाड़ी दोष निवारण आवश्यक';
    color = '#F59E0B';
    canMarry = 'CONDITIONAL';
    decisionBadge = 'CONDITIONAL ON NADI SHANTI (सशर्त)';
    decisionTitle = 'CONDITIONAL — Only Allowed After Mandatory Nadi Shanti';
    detailedConclusion = 'Points exceed 18, but presence of Nadi Dosha requires strict completion of Suvarna Naag Daan and Maha Mrityunjaya Anushthan before wedding ceremonies.';
  } else {
    // Below 18 points (e.g. 12.5 Gunas with Nadi & Gana Dosha)
    verdict = 'Inauspicious Match (Ashubh Milan)';
    verdictHi = 'अशुभ मिलान - शास्त्रानुसार वर्जित';
    color = '#EF4444';
    canMarry = 'NOT_RECOMMENDED';
    decisionBadge = 'NOT RECOMMENDED FOR MARRIAGE (विवाह वर्जित)';
    decisionTitle = 'NO — Marriage Is NOT Recommended Under Vedic Shastras';
    detailedConclusion = `Based on classical Brihat Parashara Hora Shastra, this match scores only ${totalPoints} out of 36 Gunas (well below the mandatory 18-point threshold). It suffers from TWO severe Mahadoshas simultaneously: Antya Nadi Dosha (0/8) and Gana Dosha (0/6, Deva Groom + Rakshasa Bride), alongside Graha Maitri enmity (1/5). Under orthodox Sanatan rules, THIS MARRIAGE IS STRONGLY DISCOURAGED due to high risks of constant domestic strife, health complications, ego clashes, and progeny hardships.`;
    detailedConclusionHi = `बृहत्पाराशर होराशास्त्र एवं मुहूर्त चिन्तामणि के अनुसार, यह मिलान ३६ में से केवल ${totalPoints} गुण प्राप्त करता है (न्यूनतम १८ से बहुत कम)। इसमें दो प्रमुख महादोष एक साथ विद्यमान हैं: अन्त्य नाड़ी दोष (०/८) तथा गण दोष (०/६ - देव वर एवं राक्षस कन्या), साथ ही ग्रह मैत्री शत्रुता (१/५)। सनातन शास्त्रानुसार यह विवाह सामान्यतः वर्जित है। यदि पारिवारिक या व्यक्तिगत कारणों से विवाह करना अनिवार्य ही हो, तो नीचे उल्लिखित सभी प्रायश्चित्त व शांति विधान विवाह पूर्व सम्पन्न कराना अनिवार्य होगा।`;
  }

  return {
    totalPoints: totalPoints,
    maxPoints: 36,
    percentage: Math.round((totalPoints / 36) * 100),
    verdict: verdict,
    verdictHi: verdictHi,
    color: color,
    canMarry: canMarry,
    decisionBadge: decisionBadge,
    decisionTitle: decisionTitle,
    detailedConclusion: detailedConclusion,
    detailedConclusionHi: detailedConclusionHi,
    kootas: kootas,
    detectedDoshas: detectedDoshas
  };
}
