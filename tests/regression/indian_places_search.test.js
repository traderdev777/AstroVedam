/**
 * Test Suite: Indian Places Search & Auto-Resolution (Chirala & Andhra Pradesh)
 */

import { INDIAN_PLACES, findIndianPlace, searchIndianPlaces } from '../../src/utils/indianPlaces.js';

export async function runIndianPlacesTests() {
  const suiteName = 'Indian Places Search & Andhra Pradesh Resolution';
  let passed = 0;
  let failed = 0;

  function assert(desc, condition) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      failed++;
    }
  }

  console.log(`\n--- Running ${suiteName} ---`);

  // 1. Chirala presence in INDIAN_PLACES
  const chiralaInDb = INDIAN_PLACES.find(p => p.name.toLowerCase().startsWith('chirala'));
  assert('Chirala exists in INDIAN_PLACES database', !!chiralaInDb);
  assert('Chirala latitude is ~15.8246°N', chiralaInDb && Math.abs(chiralaInDb.lat - 15.8246) < 0.01);
  assert('Chirala longitude is ~80.3522°E', chiralaInDb && Math.abs(chiralaInDb.lon - 80.3522) < 0.01);
  assert('Chirala state is Andhra Pradesh', chiralaInDb && chiralaInDb.state === 'Andhra Pradesh');
  assert('Chirala timezone is 5.5', chiralaInDb && chiralaInDb.tz === 5.5);

  // 2. findIndianPlace for "Chirala" in various natural user queries
  const exactChirala = findIndianPlace('Chirala');
  assert('findIndianPlace("Chirala") resolves correctly', exactChirala && exactChirala.name.startsWith('Chirala'));

  const fullChirala = findIndianPlace('Chirala, Andhra Pradesh');
  assert('findIndianPlace("Chirala, Andhra Pradesh") resolves correctly', fullChirala && fullChirala.name.startsWith('Chirala'));

  const userQuery = findIndianPlace('Chirala of andrapradesh');
  assert('findIndianPlace("Chirala of andrapradesh") handles phonetic/conversational query', userQuery && userQuery.name.startsWith('Chirala'));

  const apQuery = findIndianPlace('Chirala AP');
  assert('findIndianPlace("Chirala AP") handles state abbreviation', apQuery && apQuery.name.startsWith('Chirala'));

  const andraQuery = findIndianPlace('Chirala andra');
  assert('findIndianPlace("Chirala andra") handles phonetic spelling', andraQuery && andraQuery.name.startsWith('Chirala'));

  // 3. Other Andhra Pradesh towns
  const bapatla = findIndianPlace('Bapatla');
  assert('findIndianPlace("Bapatla") resolves correctly', bapatla && bapatla.name.startsWith('Bapatla'));

  const tirupati = findIndianPlace('Tirupati');
  assert('findIndianPlace("Tirupati") resolves correctly without null', tirupati && tirupati.name.includes('Tirupati'));

  const vizag = findIndianPlace('Vizag');
  assert('findIndianPlace("Vizag") resolves to Visakhapatnam', vizag && vizag.name.includes('Visakhapatnam'));

  const vizagFull = findIndianPlace('Visakhapatnam');
  assert('findIndianPlace("Visakhapatnam") does not mistakenly resolve to Patna', vizagFull && vizagFull.name.includes('Visakhapatnam'));

  const patna = findIndianPlace('Patna');
  assert('findIndianPlace("Patna") correctly resolves to Patna, Bihar', patna && patna.name.includes('Patna'));

  // 4. searchIndianPlaces
  const searchChirala = searchIndianPlaces('chirala');
  assert('searchIndianPlaces("chirala") returns Chirala results', searchChirala.length > 0 && searchChirala[0].name.startsWith('Chirala'));

  const searchAndra = searchIndianPlaces('andra');
  assert('searchIndianPlaces("andra") matches Andhra Pradesh places including Chirala', searchAndra.some(p => p.name.startsWith('Chirala')));

  // 5. Total Places in DB
  assert('INDIAN_PLACES contains 300+ Indian cities and pilgrimage towns', INDIAN_PLACES.length >= 300);

  return { suite: suiteName, passed, total: passed + failed };
}
