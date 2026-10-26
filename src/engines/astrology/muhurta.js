/**
 * AstroVeda - Auspicious Muhurta Engine
 * Calculates auspicious dates and time windows for major Sanatan life events:
 * Vivah, Griha Pravesh, Business Launch, Vehicle Purchase, Property, Namkaran.
 */

import { calculateDailyPanchang } from './panchang.js';

export const MUHURTA_TYPES = [
  {
    id: 'vivah',
    name: 'Vivah (Marriage)',
    nameHi: 'विवाह मुहूर्त',
    icon: '💍',
    favorableNakshatras: ['Rohini', 'Mrigashira', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Moola', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    prohibitedTithis: ['Chaturthi', 'Chaturdashi', 'Amavasya', 'Navami'],
    favorableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    advice: 'Ensure Jupiter and Venus are not combust (Tara Asta). Avoid Bhadra and Rahu Kaal.'
  },
  {
    id: 'griha_pravesh',
    name: 'Griha Pravesh (Housewarming)',
    nameHi: 'गृह प्रवेश मुहूर्त',
    icon: '🏡',
    favorableNakshatras: ['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Chitra', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    prohibitedTithis: ['Amavasya', 'Purnima', 'Chaturthi', 'Navami', 'Chaturdashi'],
    favorableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    advice: 'Perform Vastu Shanti and Navagraha Homa prior to entering the new sanctum.'
  },
  {
    id: 'business',
    name: 'Business Launch (Vyapar Aarambh)',
    nameHi: 'व्यापार आरम्भ मुहूर्त',
    icon: '💼',
    favorableNakshatras: ['Ashwini', 'Pushya', 'Hasta', 'Chitra', 'Anuradha', 'Revati', 'Shravana'],
    prohibitedTithis: ['Rikta Tithis (4, 9, 14)', 'Amavasya'],
    favorableDays: ['Wednesday', 'Thursday', 'Friday'],
    advice: 'Initiate paperwork during Labh or Amrit Choghadiya. Keep Kuber or Sri Yantra in reception.'
  },
  {
    id: 'vehicle',
    name: 'Vehicle Purchase (Vahan Kharid)',
    nameHi: 'वाहन क्रय मुहूर्त',
    icon: '🚗',
    favorableNakshatras: ['Ashwini', 'Rohini', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Shravana'],
    prohibitedTithis: ['Amavasya', 'Chaturthi', 'Navami', 'Chaturdashi'],
    favorableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
    advice: 'Avoid Saturday for personal vehicles unless specifically advised. Draw Swastik with vermillion.'
  },
  {
    id: 'property',
    name: 'Property Purchase (Bhoomi / Makan)',
    nameHi: 'सम्पत्ति क्रय मुहूर्त',
    icon: '🏢',
    favorableNakshatras: ['Mrigashira', 'Punarvasu', 'Magha', 'Ashlesha', 'Visakha', 'Moola', 'Revati'],
    prohibitedTithis: ['Amavasya', 'Rikta Tithis'],
    favorableDays: ['Thursday', 'Friday'],
    advice: 'Verify registry during Shubh or Char Choghadiya under strong Mars and Saturn support.'
  },
  {
    id: 'namkaran',
    name: 'Namkaran (Naming Ceremony)',
    nameHi: 'नामकरण संस्कार',
    icon: '👶',
    favorableNakshatras: ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Anuradha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Uttara Bhadrapada', 'Revati'],
    prohibitedTithis: ['Chaturthi', 'Navami', 'Chaturdashi', 'Amavasya'],
    favorableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    advice: 'Usually solemnized on 11th, 12th, or 101st day after infant birth.'
  }
];

export function findMuhurtas(activityId, startDateStr, daysToCheck = 7, lat = 28.6139, lon = 77.2090, tz = 5.5) {
  const activity = MUHURTA_TYPES.find(a => a.id === activityId) || MUHURTA_TYPES[0];
  const results = [];
  const start = new Date(startDateStr);

  for (let i = 0; i < daysToCheck; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const dateStr = current.toISOString().split('T')[0];
    
    const panchang = calculateDailyPanchang(dateStr, lat, lon, tz);
    
    // Check compatibility
    const nakName = panchang.nakshatra.name;
    const tithiName = panchang.tithi.name;
    const weekday = panchang.weekday;
    
    const isNakFav = activity.favorableNakshatras.includes(nakName);
    const isTithiBad = activity.prohibitedTithis.includes(tithiName);
    const isDayFav = activity.favorableDays.includes(weekday);
    
    let score = 50;
    if (isNakFav) score += 30;
    if (isDayFav) score += 15;
    if (isTithiBad) score -= 40;
    if (panchang.yoga.nature === 'Auspicious') score += 10;
    if (panchang.karana.nature === 'Movable') score += 5;
    
    score = Math.max(10, Math.min(100, score));
    
    // Find best auspicious slots during this day
    const auspiciousSlots = [];
    if (panchang.muhurtas.abhijit && !panchang.muhurtas.abhijit.includes('Not observed')) {
      auspiciousSlots.push({
        name: 'Abhijit Muhurta (Vijay)',
        time: panchang.muhurtas.abhijit,
        type: 'Best'
      });
    }
    
    // Filter Day Choghadiyas that are Amrit or Shubh
    panchang.choghadiya.day.forEach(ch => {
      if (ch.quality === 'Best' || ch.quality === 'Good') {
        auspiciousSlots.push({
          name: `${ch.name} Choghadiya (${ch.nameHi})`,
          time: ch.time,
          type: ch.quality
        });
      }
    });

    results.push({
      date: dateStr,
      weekday: panchang.weekday,
      weekdayHi: panchang.weekdayHi,
      tithi: `${panchang.tithi.name} (${panchang.tithi.nameHi})`,
      nakshatra: `${panchang.nakshatra.name} (${panchang.nakshatra.nameHi})`,
      score: score,
      status: score >= 75 ? 'Highly Auspicious (अत्यंत शुभ)' : (score >= 50 ? 'Moderate (मध्यम)' : 'Inauspicious (वर्ज्य)'),
      color: score >= 75 ? '#10B981' : (score >= 50 ? '#F59E0B' : '#EF4444'),
      rahuKaal: panchang.muhurtas.rahuKaal,
      auspiciousSlots: auspiciousSlots,
      advice: activity.advice
    });
  }

  return {
    activity: activity,
    results: results
  };
}
