/**
 * AstroVeda - Kundali (Birth Chart) Generator
 * Generates complete Janam Kundali with all planetary data
 */

import { dateToJD, getSiderealLongitudes, calculateAscendant, getAyanamsa, getRashi, getDegreeInRashi, getNakshatra, getNakshatraPada, getNavamsaRashi, getPlanetaryStrength, getHousePosition, calculateHouseCusps, isPlanetRetrograde } from './ephemeris.js';
import { RASHIS, GRAHAS, NAKSHATRAS, BHAVAS } from './constants.js';

/**
 * Generate complete Janam Kundali
 */
export function generateKundali(birthDate, birthTime, latitude, longitude, timezone, ayanamsaSystem = 'LAHIRI') {
  // Validate input parameters strictly (DEF-01 & DEF-02 & Phase 5B.1)
  if (!birthDate || typeof birthDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new TypeError('generateKundali requires a valid birthDate string in YYYY-MM-DD format');
  }
  const [year, month, day] = birthDate.split('-').map(Number);
  if (month < 1 || month > 12) {
    throw new RangeError('generateKundali birthDate month out of range [1-12]: ' + month);
  }
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonths = [0, 31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > daysInMonths[month]) {
    throw new RangeError(`generateKundali birthDate day out of range for ${year}-${String(month).padStart(2, '0')}: ${day}`);
  }

  if (!birthTime || typeof birthTime !== 'string' || !/^\d{1,2}:\d{2}(:\d{2})?$/.test(birthTime)) {
    throw new TypeError('generateKundali requires a valid birthTime string in HH:MM format');
  }
  const timeParts = birthTime.split(':').map(Number);
  const hour = timeParts[0];
  const minute = timeParts[1];
  const second = timeParts[2] !== undefined ? timeParts[2] : 0;
  if (hour < 0 || hour > 23) {
    throw new RangeError('generateKundali birthTime hour out of range [0-23]: ' + hour);
  }
  if (minute < 0 || minute > 59) {
    throw new RangeError('generateKundali birthTime minute out of range [0-59]: ' + minute);
  }
  if (second < 0 || second > 59) {
    throw new RangeError('generateKundali birthTime second out of range [0-59]: ' + second);
  }

  if (typeof timezone !== 'number' || !Number.isFinite(timezone)) {
    throw new TypeError('generateKundali requires a valid numeric timezone offset (e.g. 5.5 for IST). Got: ' + timezone);
  }
  if (timezone < -12 || timezone > 14) {
    throw new RangeError('generateKundali timezone offset out of range [-12, +14]: ' + timezone);
  }
  if (typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new RangeError('generateKundali latitude out of range [-90, +90]: ' + latitude);
  }
  if (typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new RangeError('generateKundali longitude out of range [-180, +180]: ' + longitude);
  }
  
  // Convert to UTC
  const utcHour = hour - timezone;
  const utcMin = minute;
  
  // Calculate Julian Day
  const jd = dateToJD(year, month, day, utcHour, utcMin);
  
  // Get Ayanamsa
  const ayanamsa = getAyanamsa(jd, ayanamsaSystem);
  
  // Get sidereal planetary positions
  const planets = getSiderealLongitudes(jd, ayanamsaSystem);
  
  // Calculate Ascendant (Lagna)
  const tropicalAsc = calculateAscendant(jd, latitude, longitude);
  const ascendant = ((tropicalAsc - ayanamsa) % 360 + 360) % 360;
  
  // House cusps
  const houseCusps = calculateHouseCusps(ascendant);
  
  // Build detailed planet data
  const planetaryData = [];
  const planetOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  
  planetOrder.forEach((planetName, idx) => {
    const lon = planets[planetName];
    const rashi = getRashi(lon) || 1;
    const degree = getDegreeInRashi(lon) || 0;
    const nakshatra = getNakshatra(lon) || 1;
    const pada = getNakshatraPada(lon) || 1;
    const navamsa = getNavamsaRashi(lon) || 1;
    const house = getHousePosition(lon, ascendant) || 1;
    const strength = getPlanetaryStrength(planetName, lon, ascendant);
    const rashiData = RASHIS[rashi - 1] || RASHIS[0];
    const nakshatraData = NAKSHATRAS[nakshatra - 1] || NAKSHATRAS[0];
    const navamsaData = RASHIS[navamsa - 1] || RASHIS[0];
    const grahaData = GRAHAS[idx] || GRAHAS[0];
    const houseData = BHAVAS[house - 1] || BHAVAS[0];
    
    planetaryData.push({
      name: planetName,
      nameHi: grahaData.hi,
      symbol: grahaData.symbol,
      abbr: grahaData.abbr,
      color: grahaData.color,
      longitude: lon,
      rashi: rashi,
      rashiName: rashiData.en,
      rashiNameHi: rashiData.hi,
      rashiSymbol: rashiData.symbol,
      degree: degree,
      degreeFormatted: formatDegree(degree),
      nakshatra: nakshatra,
      nakshatraName: nakshatraData.en,
      nakshatraNameHi: nakshatraData.hi,
      pada: pada,
      navamsaRashi: navamsa,
      navamsaName: navamsaData.en,
      navamsaNameHi: navamsaData.hi,
      house: house,
      houseName: houseData.en,
      houseNameHi: houseData.hi,
      strength: strength,
      isRetrograde: isPlanetRetrograde(planetName, jd)
    });
  });
  
  // Build house data with planets in each house
  const houses = [];
  for (let i = 0; i < 12; i++) {
    const houseNum = i + 1;
    const planetsInHouse = planetaryData.filter(p => p.house === houseNum);
    const rashiIndex = Math.floor(houseCusps[i] / 30);
    const houseRashiData = RASHIS[rashiIndex] || RASHIS[0];
    houses.push({
      number: houseNum,
      cusp: houseCusps[i],
      rashi: rashiIndex + 1,
      rashiName: houseRashiData.en,
      rashiNameHi: houseRashiData.hi,
      rashiSymbol: houseRashiData.symbol,
      lord: houseRashiData.lord,
      planets: planetsInHouse,
      signification: BHAVAS[i]?.signification || ''
    });
  }
  
  // Lagna details
  const lagnaRashi = getRashi(ascendant) || 1;
  const lagnaNakshatra = getNakshatra(ascendant) || 1;
  const lagnaRashiData = RASHIS[lagnaRashi - 1] || RASHIS[0];
  const lagnaNakshatraData = NAKSHATRAS[lagnaNakshatra - 1] || NAKSHATRAS[0];
  
  return {
    birthDetails: {
      date: birthDate,
      time: birthTime,
      latitude,
      longitude,
      timezone,
      ayanamsaSystem,
      ayanamsaValue: ayanamsa.toFixed(4)
    },
    lagna: {
      longitude: ascendant,
      rashi: lagnaRashi,
      rashiName: lagnaRashiData.en,
      rashiNameHi: lagnaRashiData.hi,
      rashiSymbol: lagnaRashiData.symbol,
      degree: getDegreeInRashi(ascendant),
      degreeFormatted: formatDegree(getDegreeInRashi(ascendant)),
      nakshatra: lagnaNakshatra,
      nakshatraName: lagnaNakshatraData.en,
      nakshatraNameHi: lagnaNakshatraData.hi,
      lord: lagnaRashiData.lord
    },
    planets: planetaryData,
    houses: houses,
    julianDay: jd
  };
}

/**
 * Format degree to DD°MM'SS"
 */
function formatDegree(deg) {
  if (typeof deg !== 'number' || !Number.isFinite(deg)) return '0°00\'00"';
  const norm = ((deg % 360) + 360) % 360;
  const d = Math.floor(norm);
  const m = Math.floor((norm - d) * 60);
  const s = Math.floor(((norm - d) * 60 - m) * 60);
  return `${d}°${String(m).padStart(2,'0')}'${String(s).padStart(2,'0')}"`;
}

/**
 * Generate Navamsa (D-9) chart
 */
export function generateNavamsaChart(kundali) {
  const navamsaPlanets = kundali.planets.map(p => ({
    ...p,
    rashi: p.navamsaRashi,
    rashiName: p.navamsaName,
    rashiNameHi: p.navamsaNameHi,
    rashiSymbol: RASHIS[p.navamsaRashi - 1].symbol
  }));
  
  // Navamsa Lagna
  const lagnaNavamsa = getNavamsaRashi(kundali.lagna.longitude);
  
  const houses = [];
  for (let i = 0; i < 12; i++) {
    const rashiNum = ((lagnaNavamsa - 1 + i) % 12) + 1;
    const planetsInHouse = navamsaPlanets.filter(p => {
      const houseInNavamsa = ((p.navamsaRashi - lagnaNavamsa + 12) % 12) + 1;
      return houseInNavamsa === i + 1;
    });
    houses.push({
      number: i + 1,
      rashi: rashiNum,
      rashiName: RASHIS[rashiNum - 1].en,
      rashiNameHi: RASHIS[rashiNum - 1].hi,
      rashiSymbol: RASHIS[rashiNum - 1].symbol,
      lord: RASHIS[rashiNum - 1].lord,
      planets: planetsInHouse
    });
  }
  
  return {
    lagna: {
      rashi: lagnaNavamsa,
      rashiName: RASHIS[lagnaNavamsa - 1].en,
      rashiNameHi: RASHIS[lagnaNavamsa - 1].hi
    },
    planets: navamsaPlanets,
    houses: houses
  };
}

/**
 * Get Kundali for chart rendering (simplified house-planet map)
 */
export function getChartData(kundali) {
  const chartHouses = {};
  for (let i = 1; i <= 12; i++) {
    const house = kundali.houses[i - 1];
    chartHouses[i] = {
      rashi: house.rashi,
      rashiSymbol: house.rashiSymbol,
      planets: house.planets.map(p => ({
        abbr: p.abbr,
        symbol: p.symbol,
        color: p.color,
        isRetrograde: p.isRetrograde,
        degree: p.degreeFormatted
      }))
    };
  }
  return {
    lagnaRashi: kundali.lagna.rashi,
    houses: chartHouses
  };
}
