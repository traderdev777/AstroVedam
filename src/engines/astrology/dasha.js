/**
 * AstroVeda - Dasha System Calculator
 * Vimshottari, Yogini, and other Dasha systems
 */

import { VIMSHOTTARI_DASHA, YOGINI_DASHA, NAKSHATRAS, GRAHAS } from './constants.js';
import { getNakshatra, getNakshatraPada } from './ephemeris.js';

/**
 * Calculate Vimshottari Maha Dasha periods
 */
export function calculateVimshottariDasha(moonLongitude, birthDate) {
  const nakshatra = getNakshatra(moonLongitude);
  const nakshatraSize = 360 / 27;
  const posInNakshatra = moonLongitude % nakshatraSize;
  const fractionElapsed = posInNakshatra / nakshatraSize;
  
  // Determine starting Dasha lord
  const startLord = VIMSHOTTARI_DASHA.nakshatraLords[nakshatra];
  const dashaOrder = VIMSHOTTARI_DASHA.order;
  const startIndex = dashaOrder.indexOf(startLord);
  
  // Birth date
  const birth = new Date(birthDate);
  
  // Calculate balance of first Dasha
  const firstDashaYears = VIMSHOTTARI_DASHA.years[startLord];
  const balanceDays = firstDashaYears * 365.25 * (1 - fractionElapsed);
  
  const periods = [];
  let currentDate = new Date(birth);
  
  // First (partial) dasha
  const firstEnd = new Date(currentDate.getTime() + balanceDays * 86400000);
  periods.push({
    lord: startLord,
    lordHi: getGrahaHindi(startLord),
    totalYears: firstDashaYears,
    balanceYears: parseFloat((balanceDays / 365.25).toFixed(2)),
    startDate: formatDate(currentDate),
    endDate: formatDate(firstEnd),
    isActive: currentDate <= new Date() && new Date() < firstEnd,
    antardasha: calculateAntardasha(startLord, currentDate, firstEnd)
  });
  currentDate = firstEnd;
  
  // Subsequent full dashas (cycle through all 9 lords twice for ~240 years coverage)
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 1; i < dashaOrder.length; i++) {
      const lordIndex = (startIndex + i) % dashaOrder.length;
      const lord = dashaOrder[lordIndex];
      const years = VIMSHOTTARI_DASHA.years[lord];
      const days = years * 365.25;
      const endDate = new Date(currentDate.getTime() + days * 86400000);
      
      periods.push({
        lord: lord,
        lordHi: getGrahaHindi(lord),
        totalYears: years,
        balanceYears: years,
        startDate: formatDate(currentDate),
        endDate: formatDate(endDate),
        isActive: currentDate <= new Date() && new Date() < endDate,
        antardasha: calculateAntardasha(lord, currentDate, endDate)
      });
      currentDate = endDate;
    }
  }
  
  return {
    birthNakshatra: nakshatra,
    birthNakshatraName: NAKSHATRAS[nakshatra - 1].en,
    birthNakshatraNameHi: NAKSHATRAS[nakshatra - 1].hi,
    startingDashaLord: startLord,
    balanceOfDasha: parseFloat((balanceDays / 365.25).toFixed(2)),
    periods: periods.slice(0, 18) // Return reasonable number
  };
}

/**
 * Calculate Antardasha (sub-periods) within a Mahadasha
 */
function calculateAntardasha(mahaLord, mahaStart, mahaEnd) {
  const dashaOrder = VIMSHOTTARI_DASHA.order;
  const startIndex = dashaOrder.indexOf(mahaLord);
  const totalDays = (mahaEnd - mahaStart) / 86400000;
  const mahaYears = VIMSHOTTARI_DASHA.years[mahaLord];
  
  const antardashas = [];
  let currentDate = new Date(mahaStart);
  
  for (let i = 0; i < 9; i++) {
    const lordIndex = (startIndex + i) % dashaOrder.length;
    const lord = dashaOrder[lordIndex];
    const lordYears = VIMSHOTTARI_DASHA.years[lord];
    const proportion = lordYears / 120;
    const days = totalDays * proportion;
    const endDate = new Date(currentDate.getTime() + days * 86400000);
    
    antardashas.push({
      lord: lord,
      lordHi: getGrahaHindi(lord),
      days: Math.round(days),
      startDate: formatDate(currentDate),
      endDate: formatDate(endDate),
      isActive: currentDate <= new Date() && new Date() < endDate
    });
    currentDate = endDate;
  }
  
  return antardashas;
}

/**
 * Calculate Yogini Dasha
 */
export function calculateYoginiDasha(moonLongitude, birthDate) {
  const nakshatra = getNakshatra(moonLongitude);
  const nakshatraSize = 360 / 27;
  const posInNakshatra = moonLongitude % nakshatraSize;
  const fractionElapsed = posInNakshatra / nakshatraSize;
  
  // Starting Yogini = (Nakshatra number + 3) mod 8
  const startYoginiIndex = (nakshatra + 2) % 8;
  const birth = new Date(birthDate);
  
  const periods = [];
  let currentDate = new Date(birth);
  
  // First (partial) period
  const firstYogini = YOGINI_DASHA.yoginis[startYoginiIndex];
  const balanceDays = firstYogini.years * 365.25 * (1 - fractionElapsed);
  const firstEnd = new Date(currentDate.getTime() + balanceDays * 86400000);
  
  periods.push({
    yogini: firstYogini.name,
    planet: firstYogini.planet,
    years: firstYogini.years,
    balanceYears: parseFloat((balanceDays / 365.25).toFixed(2)),
    startDate: formatDate(currentDate),
    endDate: formatDate(firstEnd),
    isActive: currentDate <= new Date() && new Date() < firstEnd
  });
  currentDate = firstEnd;
  
  // Subsequent full cycles
  for (let cycle = 0; cycle < 5; cycle++) {
    for (let i = 1; i < 8; i++) {
      const idx = (startYoginiIndex + i) % 8;
      const yogini = YOGINI_DASHA.yoginis[idx];
      const days = yogini.years * 365.25;
      const endDate = new Date(currentDate.getTime() + days * 86400000);
      
      periods.push({
        yogini: yogini.name,
        planet: yogini.planet,
        years: yogini.years,
        balanceYears: yogini.years,
        startDate: formatDate(currentDate),
        endDate: formatDate(endDate),
        isActive: currentDate <= new Date() && new Date() < endDate
      });
      currentDate = endDate;
    }
  }
  
  return { periods: periods.slice(0, 20) };
}

/**
 * Get current running Dasha info
 */
export function getCurrentDasha(dashaData) {
  const now = new Date();
  const activeMaha = dashaData.periods.find(p => p.isActive);
  if (!activeMaha) return null;
  
  const activeAntar = activeMaha.antardasha ? activeMaha.antardasha.find(a => a.isActive) : null;
  
  return {
    mahaDasha: activeMaha.lord,
    mahaDashaHi: activeMaha.lordHi,
    mahaStart: activeMaha.startDate,
    mahaEnd: activeMaha.endDate,
    antarDasha: activeAntar ? activeAntar.lord : null,
    antarDashaHi: activeAntar ? activeAntar.lordHi : null,
    antarStart: activeAntar ? activeAntar.startDate : null,
    antarEnd: activeAntar ? activeAntar.endDate : null
  };
}

function getGrahaHindi(name) {
  const map = { Sun: 'सूर्य', Moon: 'चन्द्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु' };
  return map[name] || name;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}
