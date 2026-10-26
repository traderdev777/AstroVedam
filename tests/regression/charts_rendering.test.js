/**
 * Test Suite: North Indian (Diamond) and South Indian (Fixed Zodiac)
 * SVG Chart Rendering Engine
 */

import { generateKundali, generateNavamsaChart, getChartData } from '../../src/engines/astrology/kundali.js';
import { renderNorthIndianChart } from '../../src/components/charts/NorthIndianChart.js';
import { renderSouthIndianChart } from '../../src/components/charts/SouthIndianChart.js';
import { renderChart } from '../../src/components/charts/ChartRenderer.js';

export async function runChartTests() {
  const suiteName = 'North & South Indian Chart SVG Rendering';
  console.log(`\n--- Running ${suiteName} ---`);

  let passed = 0;
  let total = 0;

  function assert(condition, message, detail = '') {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      if (detail) console.error(`     Detail: ${detail}`);
    }
  }

  // Generate test chart data
  const kundali = generateKundali('1999-03-28', '11:25', 16.8302, 75.71, 5.5, 'LAHIRI');
  const chartData = getChartData(kundali);

  // 1. Test North Indian Chart Rendering (Light / Print Theme)
  const mockNorthContainerLight = { innerHTML: '' };
  renderNorthIndianChart(chartData, mockNorthContainerLight, { theme: 'print' });

  const northLightSvg = mockNorthContainerLight.innerHTML;
  assert(northLightSvg.includes('<svg'), 'North Indian: Generates root <svg> element');
  assert(northLightSvg.includes('viewBox="0 0 480 480"'), 'North Indian: Uses standard 480x480 coordinate system');
  assert(northLightSvg.includes('polygon points="240,12 468,240 240,468 12,240"'), 'North Indian: Contains central diamond polygon');
  assert(northLightSvg.includes('ॐ'), 'North Indian: Contains central Om watermark');
  assert(northLightSvg.includes('#C2410C'), 'North Indian (Print): Uses high-contrast print planet palette for Sun');

  // Verify all 12 houses rendered in North Indian chart via chart-house group and data-house attribute
  for (let h = 1; h <= 12; h++) {
    assert(
      northLightSvg.includes(`data-house="${h}"`) || northLightSvg.includes(`<!-- House ${h} -->`),
      `North Indian: House ${h} group present`
    );
  }

  // 2. Test North Indian Chart Rendering (Dark Theme)
  const mockNorthContainerDark = { innerHTML: '' };
  renderNorthIndianChart(chartData, mockNorthContainerDark, { theme: 'dark' });
  const northDarkSvg = mockNorthContainerDark.innerHTML;
  assert(northDarkSvg.includes('chartBgGrad'), 'North Indian (Dark): References dark gradient background (chartBgGrad)');
  assert(northDarkSvg.includes('#F59E0B'), 'North Indian (Dark): Uses glowing palette for Sun (#F59E0B)');

  // 3. Test South Indian Chart Rendering (Fixed Zodiac Grid)
  const mockSouthContainer = { innerHTML: '' };
  renderSouthIndianChart(chartData, mockSouthContainer, { theme: 'print' });

  const southSvg = mockSouthContainer.innerHTML;
  assert(southSvg.includes('<svg'), 'South Indian: Generates root <svg> element');
  assert(southSvg.includes('viewBox="0 0 480 480"'), 'South Indian: Uses 480x480 coordinate space');
  assert(southSvg.includes('SOUTH INDIAN'), 'South Indian: Central box contains SOUTH INDIAN title');
  assert(southSvg.includes('Fixed Zodiac Kundali'), 'South Indian: Contains Fixed Zodiac descriptor');

  // Verify fixed zodiac signs rendered in South Indian chart (Aries through Pisces)
  assert(southSvg.includes('Aries (1)'), 'South Indian: Contains Aries (1) box label');
  assert(southSvg.includes('Pisces (12)'), 'South Indian: Contains Pisces (12) box label');
  assert(southSvg.includes('Leo (5)'), 'South Indian: Contains Leo (5) box label');

  // 4. Test Universal Chart Switcher (ChartRenderer.js)
  const mockUniversalNorth = { innerHTML: '' };
  renderChart(chartData, mockUniversalNorth, 'north', { theme: 'print' });
  assert(mockUniversalNorth.innerHTML.includes('points="240,12'), 'Universal Switcher: Renders North Indian chart when style="north"');

  const mockUniversalSouth = { innerHTML: '' };
  renderChart(chartData, mockUniversalSouth, 'south', { theme: 'print' });
  assert(mockUniversalSouth.innerHTML.includes('SOUTH INDIAN'), 'Universal Switcher: Renders South Indian chart when style="south"');

  // 5. Test Navamsha Chart Data Rendering
  const navamsa = generateNavamsaChart(kundali);
  const navamsaChartData = {
    lagnaRashi: navamsa.lagna.rashi,
    houses: {}
  };
  for (let i = 1; i <= 12; i++) {
    navamsaChartData.houses[i] = {
      rashi: navamsa.houses[i - 1].rashi,
      rashiSymbol: navamsa.houses[i - 1].rashiSymbol,
      planets: navamsa.houses[i - 1].planets.map(p => ({
        abbr: p.abbr,
        symbol: p.symbol,
        color: p.color,
        isRetrograde: p.isRetrograde,
        degree: p.degreeFormatted
      }))
    };
  }

  const mockNavamsaContainer = { innerHTML: '' };
  renderNorthIndianChart(navamsaChartData, mockNavamsaContainer, { theme: 'print' });
  assert(mockNavamsaContainer.innerHTML.includes('<svg'), 'Navamsha: Renders D-9 SVG chart without exceptions');

  console.log(`Suite Results: ${passed}/${total} passed\n`);
  return { suite: suiteName, passed, total };
}
