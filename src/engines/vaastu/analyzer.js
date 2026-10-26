/**
 * AstroVeda - Vaastu Shastra Engine
 * 16-Zone MahaVastu & Classical Sanatan Vaastu Shastra analyzer.
 * Room-by-room compatibility, Pancha Tatva balancing, and non-demolition remedies.
 */

// 16 Vastu Zones
export const VASTU_ZONES = [
  { id: 'N', name: 'North', nameHi: 'उत्तर', deity: 'Kuber (कुबेर)', element: 'Water (जल)', color: 'Blue / Light Green', energy: 'New Opportunities, Wealth Flow, Abundance' },
  { id: 'NNE', name: 'North-North-East', nameHi: 'उत्तर-उत्तर-पूर्व', deity: 'Dhanvantari', element: 'Water (जल)', color: 'Light Blue', energy: 'Health, Immunity, Physical Vitality' },
  { id: 'NE', name: 'North-East (Ishan)', nameHi: 'ईशान कोण', deity: 'Shiva (शिव)', element: 'Water (जल)', color: 'White / Sky Blue', energy: 'Spiritual Clarity, Wisdom, Divine Connection' },
  { id: 'ENE', name: 'East-North-East', nameHi: 'पूर्व-उत्तर-पूर्व', deity: 'Jayant', element: 'Air (वायु)', color: 'Light Green', energy: 'Joy, Recreation, Happiness, Rejuvenation' },
  { id: 'E', name: 'East', nameHi: 'पूर्व', deity: 'Indra (इन्द्र)', element: 'Air (वायु)', color: 'Green / Brown', energy: 'Social Networking, Connections, Government Aid' },
  { id: 'ESE', name: 'East-South-East', nameHi: 'पूर्व-दक्षिण-पूर्व', deity: 'Anil', element: 'Air (वायु)', color: 'Light Yellowish Green', energy: 'Mental Churning, Analytical Thinking' },
  { id: 'SE', name: 'South-East (Agneya)', nameHi: 'आग्नेय कोण', deity: 'Agni (अग्नि)', element: 'Fire (अग्नि)', color: 'Red, Orange, Pink', energy: 'Cash Liquidity, Zeal, Passion, Fire Power' },
  { id: 'SSE', name: 'South-South-East', nameHi: 'दक्षिण-दक्षिण-पूर्व', deity: 'Pusha', element: 'Fire (अग्नि)', color: 'Orange / Warm White', energy: 'Physical Strength, Self-Confidence, Will' },
  { id: 'S', name: 'South', nameHi: 'दक्षिण', deity: 'Yama (यम)', element: 'Fire (अग्नि)', color: 'Deep Red / Maroon', energy: 'Fame, Relaxation, Recognition, Public Stature' },
  { id: 'SSW', name: 'South-South-West', nameHi: 'दक्षिण-दक्षिण-पश्चिम', deity: 'Gandharva', element: 'Earth (पृथ्वी)', color: 'Yellow', energy: 'Disposal, Letting Go, Waste Management' },
  { id: 'SW', name: 'South-West (Nairritya)', nameHi: 'नैऋत्य कोण', deity: 'Nirriti / Pitrus', element: 'Earth (पृथ्वी)', color: 'Golden Yellow / Brown', energy: 'Relationship Stability, Ancestral Grace, Skill Mastery' },
  { id: 'WSW', name: 'West-South-West', nameHi: 'पश्चिम-दक्षिण-पश्चिम', deity: 'Dauwarik', element: 'Space (आकाश)', color: 'White / Silver', energy: 'Education, Savings, Knowledge Retention' },
  { id: 'W', name: 'West', nameHi: 'पश्चिम', deity: 'Varuna (वरुण)', element: 'Space (आकाश)', color: 'White / Grey', energy: 'Gains, Profits, Wish Manifestation' },
  { id: 'WNW', name: 'West-North-West', nameHi: 'पश्चिम-उत्तर-पश्चिम', deity: 'Roga', element: 'Space (आकाश)', color: 'Light Grey', energy: 'Detoxification, Emotional Release, Healing' },
  { id: 'NW', name: 'North-West (Vayavya)', nameHi: 'वायव्य कोण', deity: 'Vayu (वायु)', element: 'Air / Space', color: 'White / Cream', energy: 'Support, Banking, Helpful People, Travel' },
  { id: 'NNW', name: 'North-North-West', nameHi: 'उत्तर-उत्तर-पश्चिम', deity: 'Soma', element: 'Water (जल)', color: 'White / Sky Blue', energy: 'Attraction, Charisma, Marital Harmony' },
  { id: 'CENTER', name: 'Center (Brahmasthan)', nameHi: 'ब्रह्मस्थान', deity: 'Brahma (ब्रह्मा)', element: 'Ether / Cosmic Void', color: 'Clear / Open Space', energy: 'Cosmic Prana, Life Balance, Harmony' }
];

// Room best placement rules
export const ROOM_COMPATIBILITY = {
  mainEntrance: {
    name: 'Main Entrance (मुख्य द्वार)',
    best: ['N', 'NE', 'E', 'W'],
    moderate: ['NW', 'SE'],
    bad: ['SW', 'SSW', 'S'],
    remedyForBad: 'Place a Brass/Lead strip beneath the threshold, hang energized Swastik or Panchmukhi Hanuman photo facing outwards, keep two plants flanking the entrance.'
  },
  poojaRoom: {
    name: 'Pooja Room (पूजा घर)',
    best: ['NE', 'N', 'E'],
    moderate: ['W'],
    bad: ['SW', 'SE', 'SSW', 'S'],
    remedyForBad: 'Strictly avoid temple under stairs or shared with bathroom wall. Install Ishan Yantra or copper Sri Yantra, light ghee lamp in North-East corner.'
  },
  masterBedroom: {
    name: 'Master Bedroom (प्रधान शयन कक्ष)',
    best: ['SW', 'S', 'W'],
    moderate: ['NNE', 'NW'],
    bad: ['NE', 'SE'],
    remedyForBad: 'Sleep with head strictly pointing South or East. If in NE/SE, keep a brass bowl with unrefined sea salt to absorb hyperactivity; avoid mirrors facing bed.'
  },
  kitchen: {
    name: 'Kitchen / Stove (रसोई घर)',
    best: ['SE', 'NW'],
    moderate: ['S', 'E'],
    bad: ['NE', 'SW', 'N'],
    remedyForBad: 'Kitchen in NE causes severe health & wealth loss: place green marble slab under cooking gas stove or wrap copper wire. Avoid black granite counters in SE.'
  },
  livingRoom: {
    name: 'Living Room (बैठक कक्ष)',
    best: ['N', 'E', 'NW'],
    moderate: ['W', 'NE'],
    bad: ['SW'],
    remedyForBad: 'Keep heavy sofa sets against South and West walls. Keep North and East open with light furniture and fresh indoor green plants.'
  },
  toilet: {
    name: 'Toilet / WC (शौचालय)',
    best: ['SSW', 'WNW', 'ESE'],
    moderate: ['NW', 'W'],
    bad: ['NE', 'SW', 'SE', 'N', 'CENTER'],
    remedyForBad: 'Toilet in NE or Brahmasthan is the gravest Vaastu defect: install stainless steel / copper / brass wire around the commode base, keep glass bowl with sea salt changed weekly.'
  },
  staircase: {
    name: 'Staircase (सीढ़ियाँ)',
    best: ['S', 'SW', 'W'],
    moderate: ['NW', 'SE'],
    bad: ['NE', 'CENTER', 'N'],
    remedyForBad: 'Paint walls in light yellow/cream, hang a brass bell or spherical crystal, ensure clockwise ascent when climbing stairs.'
  },
  cashLocker: {
    name: 'Cash Locker / Safe (तिजोरी)',
    best: ['N', 'SW', 'W'],
    moderate: ['E'],
    bad: ['SE', 'NE', 'SSW'],
    remedyForBad: 'Place safe against South wall opening towards North (Kuber direction). Place energized Kuber Yantra or silver coin inside locker.'
  },
  undergroundTank: {
    name: 'Underground Water Tank / Borewell (भूमिगत जल)',
    best: ['NE', 'N', 'E'],
    moderate: ['NNW'],
    bad: ['SE', 'SW', 'S', 'CENTER'],
    remedyForBad: 'Water in Fire (SE) or Earth (SW) causes fire-water clashes: surround the tank exterior with red/yellow boundary paint and keep Lord Varuna yantra nearby.'
  }
};

export function auditHomeVaastu(userRoomPlacements) {
  let score = 100;
  const issues = [];
  const strengths = [];
  const remedies = [];

  for (const [roomKey, userDirection] of Object.entries(userRoomPlacements)) {
    const rule = ROOM_COMPATIBILITY[roomKey];
    if (!rule) continue;

    if (rule.best.includes(userDirection)) {
      strengths.push({
        room: rule.name,
        direction: userDirection,
        status: 'Perfect Alignment (शुभ)',
        benefit: `Magnifies positive cosmic vibrations for ${rule.name}.`
      });
    } else if (rule.moderate.includes(userDirection)) {
      score -= 5;
      strengths.push({
        room: rule.name,
        direction: userDirection,
        status: 'Acceptable (सामान्य)',
        benefit: 'Tolerable position with neutral effects.'
      });
    } else if (rule.bad.includes(userDirection)) {
      score -= 15;
      issues.push({
        room: rule.name,
        direction: userDirection,
        severity: ['NE', 'SW', 'CENTER'].includes(userDirection) ? 'Critical Dosha' : 'Moderate Dosha',
        issue: `${rule.name} in ${userDirection} clashes with governing deities and elements.`,
        remedy: rule.remedyForBad
      });
      remedies.push({
        title: `Remedy for ${rule.name} in ${userDirection}`,
        step: rule.remedyForBad
      });
    }
  }

  score = Math.max(10, Math.min(100, score));

  let grade = '';
  let color = '';
  if (score >= 85) { grade = 'A+ (Excellent Vaastu Sanctuary)'; color = '#10B981'; }
  else if (score >= 70) { grade = 'B (Good with Minor Corrections)'; color = '#F59E0B'; }
  else if (score >= 50) { grade = 'C (Challenging - Remedial Action Urgently Recommended)'; color = '#E23D28'; }
  else { grade = 'D (Severe Elemental Imbalance)'; color = '#EF4444'; }

  return {
    score: score,
    grade: grade,
    color: color,
    strengths: strengths,
    issues: issues,
    remedies: remedies,
    generalRemedies: [
      'Maintain an open, light, and spotless North-East (Ishan) zone for divine blessings.',
      'Keep the South-West (Nairritya) elevated and heaviest to ensure family stability.',
      'Burn pure camphor (Karpura) in the evenings to clear negative electromagnetic stagnant energy.',
      'Keep a sacred Tulsi plant in East or North-East and light a ghee lamp beside it daily.'
    ]
  };
}
