/**
 * AstroVeda - Panchang Engine
 * Computes authentic 5 Limbs (Tithi, Vaara, Nakshatra, Yoga, Karana),
 * Auspicious Muhurtas (Abhijit, Brahma), Inauspicious times (Rahu Kaal, Yamaganda, Gulika),
 * Choghadiya Day & Night, and 24 Planetary Horas.
 */

import { dateToJD, getSiderealLongitudes, calculateSunriseSunset } from './ephemeris.js';
import { TITHIS, NAKSHATRAS, YOGAS, KARANAS, VARAS, CHOGHADIYA, HORA_SEQUENCE, DAY_HORA_START, RAHU_KAAL_PERIOD } from './constants.js';

export function calculateDailyPanchang(dateStr, latitude = 28.6139, longitude = 77.2090, timezone = 5.5) {
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Midday local time JD
  const jd = dateToJD(year, month, day, 12 - timezone, 0, 0);
  const planets = getSiderealLongitudes(jd, 'LAHIRI');
  
  const sunLong = planets.Sun;
  const moonLong = planets.Moon;
  
  // 1. Tithi Calculation: (Moon - Sun) mod 360 / 12
  let tithiDiff = (moonLong - sunLong + 360) % 360;
  const tithiIndex = Math.floor(tithiDiff / 12);
  const tithiData = TITHIS[tithiIndex] || TITHIS[0];
  const tithiProgress = ((tithiDiff % 12) / 12) * 100;
  
  // 2. Nakshatra Calculation: Moon / (360/27)
  const nakshatraSize = 360 / 27; // 13.3333°
  const nakshatraIndex = Math.floor(moonLong / nakshatraSize);
  const nakshatraData = NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[0];
  const nakshatraProgress = ((moonLong % nakshatraSize) / nakshatraSize) * 100;
  const pada = Math.floor((moonLong % nakshatraSize) / (nakshatraSize / 4)) + 1;
  
  // 3. Yoga Calculation: (Sun + Moon) mod 360 / (360/27)
  const yogaSum = (sunLong + moonLong) % 360;
  const yogaIndex = Math.floor(yogaSum / nakshatraSize);
  const yogaData = YOGAS[yogaIndex] || YOGAS[0];
  
  // 4. Karana Calculation: (Moon - Sun) mod 360 / 6
  const karanaRaw = Math.floor(tithiDiff / 6);
  let karanaData;
  if (karanaRaw === 0) {
    karanaData = KARANAS[10]; // Kimstughna (fixed)
  } else if (karanaRaw >= 57) {
    if (karanaRaw === 57) karanaData = KARANAS[7]; // Shakuni
    else if (karanaRaw === 58) karanaData = KARANAS[8]; // Chatushpada
    else karanaData = KARANAS[9]; // Nagava
  } else {
    // 7 movable repeating
    const movIndex = (karanaRaw - 1) % 7;
    karanaData = KARANAS[movIndex];
  }
  
  // 5. Vaara (Weekday)
  const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const weekday = targetDate.getUTCDay();
  const varaData = VARAS[weekday];
  
  // Sunrise & Sunset (approx in local solar time)
  const sunTimes = calculateSunriseSunset(jd, latitude, longitude);
  const sunriseHour = (sunTimes.sunrise + timezone) % 24;
  const sunsetHour = (sunTimes.sunset + timezone) % 24;
  const dayDuration = ((sunsetHour - sunriseHour + 24) % 24);
  const nightDuration = 24 - dayDuration;
  
  // Format decimal hour to HH:MM AM/PM
  const formatTime = (decHour) => {
    let h = Math.floor(decHour);
    let m = Math.floor((decHour - h) * 60);
    let ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };
  
  // Periods (1/8th of day)
  const daySegment = dayDuration / 8;
  const rahuPeriod = RAHU_KAAL_PERIOD[weekday] || 8;
  const rahuStart = sunriseHour + (rahuPeriod - 1) * daySegment;
  const rahuEnd = rahuStart + daySegment;
  
  // Yamaganda period by weekday
  // Sun: 5th, Mon: 4th, Tue: 3rd, Wed: 2nd, Thu: 1st, Fri: 7th, Sat: 6th
  const yamagandaPeriods = [5, 4, 3, 2, 1, 7, 6];
  const yamaP = yamagandaPeriods[weekday];
  const yamaStart = sunriseHour + (yamaP - 1) * daySegment;
  const yamaEnd = yamaStart + daySegment;
  
  // Gulika Kaal period by weekday
  // Sun: 7th, Mon: 6th, Tue: 5th, Wed: 4th, Thu: 3rd, Fri: 2nd, Sat: 1st
  const gulikaPeriods = [7, 6, 5, 4, 3, 2, 1];
  const guliP = gulikaPeriods[weekday];
  const guliStart = sunriseHour + (guliP - 1) * daySegment;
  const guliEnd = guliStart + daySegment;
  
  // Abhijit Muhurta (approx 8th muhurta of 15 daylight parts, centered around solar noon)
  const noonHour = sunriseHour + dayDuration / 2;
  const abhijitStart = noonHour - 0.4;
  const abhijitEnd = noonHour + 0.4;
  const isAbhijitAuspicious = weekday !== 3; // Inauspicious on Wednesday
  
  // Brahma Muhurta (2 Muhurtas before sunrise, approx 96 min before sunrise)
  const brahmaStart = (sunriseHour - 1.6 + 24) % 24;
  const brahmaEnd = (sunriseHour - 0.8 + 24) % 24;
  
  // Choghadiya sequence calculation
  // Day starting choghadiya by weekday:
  // Sun: Udveg, Mon: Amrit, Tue: Rog, Wed: Labh, Thu: Shubh, Fri: Char, Sat: Kaal
  const dayChoghadiyaCycle = ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'];
  const dayStartMap = { 0: 0, 1: 3, 2: 6, 3: 2, 4: 5, 5: 1, 6: 4 };
  const startIndex = dayStartMap[weekday];
  
  const choghadiyaDay = [];
  for (let i = 0; i < 8; i++) {
    const chName = dayChoghadiyaCycle[(startIndex + i) % 7];
    const cStart = sunriseHour + i * daySegment;
    const cEnd = cStart + daySegment;
    const info = CHOGHADIYA.nature[chName];
    choghadiyaDay.push({
      name: chName,
      nameHi: info.hi,
      quality: info.quality,
      time: `${formatTime(cStart)} - ${formatTime(cEnd)}`,
      status: info.quality === 'Best' || info.quality === 'Good' ? 'Auspicious' : (info.quality === 'Neutral' ? 'Moderate' : 'Inauspicious')
    });
  }
  
  // Night Choghadiya sequence
  const nightSegment = nightDuration / 8;
  const nightStartMap = { 0: 5, 1: 1, 2: 4, 3: 0, 4: 3, 5: 6, 6: 2 };
  const nStartIndex = nightStartMap[weekday];
  const choghadiyaNight = [];
  for (let i = 0; i < 8; i++) {
    const chName = dayChoghadiyaCycle[(nStartIndex + i) % 7];
    const cStart = sunsetHour + i * nightSegment;
    const cEnd = cStart + nightSegment;
    const info = CHOGHADIYA.nature[chName];
    choghadiyaNight.push({
      name: chName,
      nameHi: info.hi,
      quality: info.quality,
      time: `${formatTime(cStart)} - ${formatTime(cEnd)}`,
      status: info.quality === 'Best' || info.quality === 'Good' ? 'Auspicious' : (info.quality === 'Neutral' ? 'Moderate' : 'Inauspicious')
    });
  }
  
  // 24 Planetary Horas starting from sunrise
  const horas = [];
  const horaStartLordIdx = DAY_HORA_START[weekday];
  for (let i = 0; i < 24; i++) {
    const lord = HORA_SEQUENCE[(horaStartLordIdx + i) % 7];
    const hStart = (sunriseHour + i) % 24;
    const hEnd = (hStart + 1) % 24;
    horas.push({
      hour: i + 1,
      lord: lord,
      time: `${formatTime(hStart)} - ${formatTime(hEnd)}`,
      nature: ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(lord) ? 'Benefic' : 'Malefic'
    });
  }

  return {
    date: dateStr,
    weekday: varaData.en,
    weekdayHi: varaData.hi,
    sunrise: formatTime(sunriseHour),
    sunset: formatTime(sunsetHour),
    tithi: {
      number: tithiData.id,
      name: tithiData.en,
      nameHi: tithiData.hi,
      paksha: tithiData.paksha,
      deity: tithiData.deity,
      progress: Math.round(tithiProgress)
    },
    nakshatra: {
      number: nakshatraData.id,
      name: nakshatraData.en,
      nameHi: nakshatraData.hi,
      lord: nakshatraData.lord,
      deity: nakshatraData.deity,
      pada: pada,
      progress: Math.round(nakshatraProgress)
    },
    yoga: {
      name: yogaData.en,
      nameHi: yogaData.hi,
      nature: yogaData.nature
    },
    karana: {
      name: karanaData.en,
      nameHi: karanaData.hi,
      nature: karanaData.nature
    },
    muhurtas: {
      brahma: `${formatTime(brahmaStart)} - ${formatTime(brahmaEnd)}`,
      abhijit: isAbhijitAuspicious ? `${formatTime(abhijitStart)} - ${formatTime(abhijitEnd)}` : 'Not observed on Wednesday',
      rahuKaal: `${formatTime(rahuStart)} - ${formatTime(rahuEnd)}`,
      yamaganda: `${formatTime(yamaStart)} - ${formatTime(yamaEnd)}`,
      gulika: `${formatTime(guliStart)} - ${formatTime(guliEnd)}`
    },
    choghadiya: {
      day: choghadiyaDay,
      night: choghadiyaNight
    },
    horas: horas
  };
}
