/**
 * AstroVeda - Avakahada Chakra & Janam Naam (Naming Syllables)
 * Classical 108 Pada syllables for the 27 Nakshatras
 */

export const NAKSHATRA_SYLLABLES = {
  1:  ['Chu (चु)', 'Che (चे)', 'Cho (चो)', 'La (ला)'],              // Ashwini
  2:  ['Li (ली)', 'Lu (लू)', 'Le (ले)', 'Lo (लो)'],                 // Bharani
  3:  ['A (अ)', 'I (ई)', 'U (उ)', 'E (ए)'],                         // Krittika
  4:  ['O (ओ)', 'Va (वा)', 'Vi (वी)', 'Vu (वू)'],                   // Rohini
  5:  ['Ve (वे)', 'Vo (वो)', 'Ka (का)', 'Ki (की)'],                 // Mrigashira
  6:  ['Ku (कु)', 'Gha (घ)', 'Nga (ङ)', 'Chha (छ)'],                // Ardra
  7:  ['Ke (के)', 'Ko (को)', 'Ha (हा)', 'Hi (ही)'],                 // Punarvasu
  8:  ['Hu (हु)', 'He (हे)', 'Ho (हो)', 'Da (डा)'],                 // Pushya
  9:  ['Di (डी)', 'Du (डू)', 'De (डे)', 'Do (डो)'],                 // Ashlesha
  10: ['Ma (मा)', 'Mi (मी)', 'Mu (मू)', 'Me (मे)'],                 // Magha
  11: ['Mo (मो)', 'Ta (टा)', 'Ti (टी)', 'Tu (टू)'],                 // Purva Phalguni
  12: ['Te (टे)', 'To (टो)', 'Pa (पा)', 'Pi (पी)'],                 // Uttara Phalguni
  13: ['Pu (पू)', 'Sha (ष)', 'Na (ण)', 'Tha (ठ)'],                  // Hasta
  14: ['Pe (पे)', 'Po (पो)', 'Ra (रा)', 'Ri (री)'],                 // Chitra
  15: ['Ru (रू)', 'Re (रे)', 'Ro (रो)', 'Ta (ता)'],                 // Swati
  16: ['Ti (ती)', 'Tu (तू)', 'Te (ते)', 'To (तो)'],                 // Vishakha
  17: ['Na (ना)', 'Ni (नी)', 'Nu (नू)', 'Ne (ने)'],                 // Anuradha
  18: ['No (नो)', 'Ya (या)', 'Yi (यी)', 'Yu (यू)'],                 // Jyeshtha
  19: ['Ye (ये)', 'Yo (यो)', 'Bha (भा)', 'Bhi (भी)'],               // Moola
  20: ['Bhu (भू)', 'Dha (धा)', 'Pha (फा)', 'Dha (ढा)'],             // Purva Ashadha
  21: ['Bhe (भे)', 'Bho (भो)', 'Ja (जा)', 'Ji (जी)'],               // Uttara Ashadha
  22: ['Khi (खी)', 'Khu (खू)', 'Khe (खे)', 'Kho (खो)'],             // Shravana
  23: ['Ga (गा)', 'Gi (गी)', 'Gu (गु)', 'Ge (गे)'],                 // Dhanishta
  24: ['Go (गो)', 'Sa (सा)', 'Si (सी)', 'Su (सू)'],                 // Shatabhisha
  25: ['Se (से)', 'So (सो)', 'Da (दा)', 'Di (दी)'],                 // Purva Bhadrapada
  26: ['Du (दू)', 'Tha (थ)', 'Jha (झ)', 'Na (ञ)'],                 // Uttara Bhadrapada
  27: ['De (दे)', 'Do (दो)', 'Cha (चा)', 'Chi (ची)']                // Revati
};

export function getJanamNaam(nakshatraIndex, pada) {
  const syllables = NAKSHATRA_SYLLABLES[nakshatraIndex] || NAKSHATRA_SYLLABLES[1];
  const syllable = syllables[Math.max(0, Math.min(3, pada - 1))] || syllables[0];
  return {
    syllable: syllable,
    nakshatraPada: `Pada ${pada}`,
    explanation: `Based on Moon's placement in Pada ${pada}, the sacred initial phonetic vibration for naming is "${syllable}".`
  };
}
