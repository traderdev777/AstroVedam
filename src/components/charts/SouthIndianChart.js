/**
 * AstroVeda - South Indian Chart Renderer
 * High-definition, crystal-clear typography with fixed Zodiac grid,
 * large sign labels, bold planet badges, and clean spacing.
 */

export function renderSouthIndianChart(chartData, containerId, options = {}) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const isPrint = options.theme === 'print' || options.theme === 'light' || options.isPrint;
  const houses = chartData.houses || {};
  const lagnaRashi = chartData.lagnaRashi;

  const boxCoords = {
    12: { x: 10, y: 10 },
    1:  { x: 125, y: 10 },
    2:  { x: 240, y: 10 },
    3:  { x: 355, y: 10 },
    4:  { x: 355, y: 125 },
    5:  { x: 355, y: 240 },
    6:  { x: 355, y: 355 },
    7:  { x: 240, y: 355 },
    8:  { x: 125, y: 355 },
    9:  { x: 10, y: 355 },
    10: { x: 10, y: 240 },
    11: { x: 10, y: 125 }
  };

  const rashiNames = {
    1: 'Aries (1)', 2: 'Taurus (2)', 3: 'Gemini (3)', 4: 'Cancer (4)',
    5: 'Leo (5)', 6: 'Virgo (6)', 7: 'Libra (7)', 8: 'Scorpio (8)',
    9: 'Sagit (9)', 10: 'Capri (10)', 11: 'Aquar (11)', 12: 'Pisces (12)'
  };

  const printPlanetColors = {
    Su: '#C2410C', Mo: '#1E3A8A', Ma: '#B91C1C', Me: '#047857',
    Ju: '#92400E', Ve: '#BE185D', Sa: '#0F172A', Ra: '#4338CA',
    Ke: '#6D28D9', As: '#B45309', default: '#0F172A'
  };

  const darkPlanetColors = {
    Su: '#F59E0B', Mo: '#93C5FD', Ma: '#EF4444', Me: '#10B981',
    Ju: '#FBBF24', Ve: '#F472B6', Sa: '#CBD5E1', Ra: '#C084FC',
    Ke: '#A78BFA', As: '#DAA520', default: '#F5C842'
  };

  const colors = isPrint ? printPlanetColors : darkPlanetColors;

  const formatChartDegree = (degStr) => {
    if (!degStr) return '';
    const match = String(degStr).match(/^(\d+)°/);
    return match ? `${match[1]}°` : '';
  };

  const planetsByRashi = {};
  for (let r = 1; r <= 12; r++) planetsByRashi[r] = [];

  for (let h = 1; h <= 12; h++) {
    const houseInfo = houses[h];
    if (houseInfo && houseInfo.rashi) {
      const r = houseInfo.rashi;
      (houseInfo.planets || []).forEach(p => planetsByRashi[r].push(p));
    }
  }

  let boxElements = '';
  for (let r = 1; r <= 12; r++) {
    const pos = boxCoords[r];
    const isLagna = r === lagnaRashi;
    const plist = planetsByRashi[r] || [];

    let pElements = '';
    const n = plist.length;
    const spacing = n > 3 ? 15 : 18;
    const fontSize = n > 3 ? '13' : '15';

    plist.forEach((p, idx) => {
      const yOffset = pos.y + 38 + idx * spacing;
      const pColor = colors[p.abbr] || colors.default;
      const retro = p.isRetrograde ? '<tspan fill="#DC2626" font-weight="900">®</tspan>' : '';
      const deg = formatChartDegree(p.degree);

      pElements += `
        <text x="${pos.x + 12}" y="${yOffset}" 
              font-family="'Inter', sans-serif" 
              font-size="${fontSize}" 
              font-weight="800" 
              fill="${pColor}"
              style="paint-order: stroke fill; stroke: ${isPrint ? '#FFFFFF' : '#0B0B1E'}; stroke-width: 3px;">
          ${p.abbr}${retro}${deg ? ` <tspan font-size="11" font-weight="700" fill="${isPrint ? '#334155' : '#CBD5E1'}">${deg}</tspan>` : ''}
        </text>
      `;
    });

    const boxBg = isPrint 
      ? (isLagna ? '#FEF3C7' : '#FFFFFF') 
      : (isLagna ? 'rgba(218, 165, 32, 0.15)' : 'rgba(255, 255, 255, 0.02)');
    const boxBorder = isPrint ? '#B45309' : (isLagna ? '#DAA520' : 'rgba(218, 165, 32, 0.3)');

    boxElements += `
      <!-- Box for Sign ${r} -->
      <g class="south-chart-box" data-rashi="${r}">
        <rect x="${pos.x}" y="${pos.y}" width="115" height="115" 
              fill="${boxBg}" stroke="${boxBorder}" stroke-width="${isLagna ? '2.5' : '1.5'}" rx="3" />
        <text x="${pos.x + 8}" y="${pos.y + 16}" 
              font-family="'Outfit', sans-serif" font-size="12" font-weight="800" 
              fill="${isPrint ? '#78350F' : '#DAA520'}">
          ${rashiNames[r]}
        </text>
        ${isLagna ? `
          <text x="${pos.x + 105}" y="${pos.y + 16}" 
                font-family="'Inter', sans-serif" font-size="12" font-weight="900" 
                fill="#B45309" text-anchor="end"
                style="paint-order: stroke fill; stroke: #FFFFFF; stroke-width: 2px;">
            LAGNA
          </text>
        ` : ''}
        ${pElements}
      </g>
    `;
  }

  const bgFill = isPrint ? '#FFFDF8' : '#0A0A1F';
  const borderStroke = isPrint ? '#9A3412' : '#DAA520';

  const svg = `
    <svg viewBox="0 0 480 480" width="100%" height="100%" class="vedic-chart-svg" style="display: block; margin: 0 auto; max-width: 440px; ${isPrint ? 'box-shadow: 0 4px 15px rgba(180,83,9,0.12);' : 'filter: drop-shadow(0 4px 20px rgba(0,0,0,0.5));'}">
      <rect width="480" height="480" fill="${bgFill}" rx="6" />
      <rect x="6" y="6" width="468" height="468" fill="none" stroke="${borderStroke}" stroke-width="2.5" rx="4" />

      <!-- Center Box -->
      <rect x="125" y="125" width="230" height="230" 
            fill="${isPrint ? '#FFFBEB' : 'rgba(218,165,32,0.05)'}" 
            stroke="${borderStroke}" stroke-width="2" />
      <text x="240" y="235" font-family="'Outfit', sans-serif" font-size="20" font-weight="900" fill="${isPrint ? '#9A3412' : '#DAA520'}" text-anchor="middle">
        SOUTH INDIAN
      </text>
      <text x="240" y="260" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="${isPrint ? '#78350F' : '#94A3B8'}" text-anchor="middle">
        Fixed Zodiac Kundali
      </text>

      ${boxElements}
    </svg>
  `;

  container.innerHTML = svg;
}
