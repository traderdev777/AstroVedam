/**
 * AstroVeda - North Indian (Diamond) Chart Renderer
 * High-definition, crystal-clear typography with bold rashi numbers,
 * prominent planet badges, white text-halos, and zero collision.
 */

export function renderNorthIndianChart(chartData, containerId, options = {}) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const isPrint = options.theme === 'print' || options.theme === 'light' || options.isPrint;
  const houses = chartData.houses || {};

  // Mathematically calculated house centroids & safe inner anchor points
  // Width: 480, Height: 480, Center: (240, 240)
  const houseCoordinates = {
    1:  { rashi: [240, 52],  planets: [240, 136], anchor: 'middle' },
    2:  { rashi: [125, 34],  planets: [125, 75],  anchor: 'middle' },
    3:  { rashi: [34, 125],  planets: [75, 125],  anchor: 'middle' },
    4:  { rashi: [52, 240],  planets: [136, 240], anchor: 'middle' },
    5:  { rashi: [34, 355],  planets: [75, 355],  anchor: 'middle' },
    6:  { rashi: [125, 446], planets: [125, 405], anchor: 'middle' },
    7:  { rashi: [240, 428], planets: [240, 344], anchor: 'middle' },
    8:  { rashi: [355, 446], planets: [355, 405], anchor: 'middle' },
    9:  { rashi: [446, 355], planets: [405, 355], anchor: 'middle' },
    10: { rashi: [428, 240], planets: [344, 240], anchor: 'middle' },
    11: { rashi: [446, 125], planets: [405, 125], anchor: 'middle' },
    12: { rashi: [355, 34],  planets: [355, 75],  anchor: 'middle' }
  };

  // High-contrast, bold color palette
  const printPlanetColors = {
    Su: '#C2410C', // Vermilion Orange
    Mo: '#1E3A8A', // Deep Blue
    Ma: '#B91C1C', // Crimson Red
    Me: '#047857', // Forest Emerald
    Ju: '#92400E', // Amber Gold
    Ve: '#BE185D', // Rose Ruby
    Sa: '#0F172A', // Deep Slate
    Ra: '#4338CA', // Indigo
    Ke: '#6D28D9', // Deep Violet
    As: '#B45309', // Ascendant Amber
    default: '#0F172A'
  };

  const darkPlanetColors = {
    Su: '#F59E0B',
    Mo: '#93C5FD',
    Ma: '#EF4444',
    Me: '#10B981',
    Ju: '#FBBF24',
    Ve: '#F472B6',
    Sa: '#CBD5E1',
    Ra: '#C084FC',
    Ke: '#A78BFA',
    As: '#DAA520',
    default: '#F5C842'
  };

  const colors = isPrint ? printPlanetColors : darkPlanetColors;

  const formatChartDegree = (degStr) => {
    if (!degStr) return '';
    const match = String(degStr).match(/^(\d+)°/);
    return match ? `${match[1]}°` : '';
  };

  let houseMarkup = '';
  for (let h = 1; h <= 12; h++) {
    const houseInfo = houses[h] || { rashi: h, planets: [] };
    const coords = houseCoordinates[h];
    const rashiNum = houseInfo.rashi;
    let plist = [...(houseInfo.planets || [])];

    // In House 1, if Ascendant badge is not in list, add it
    if (h === 1 && !plist.some(p => p.abbr === 'As')) {
      plist.unshift({ abbr: 'As', degree: '', isRetrograde: false });
    }

    let planetElements = '';
    const n = plist.length;

    if (n > 0) {
      // Ample vertical spacing for large bold text
      const spacing = n === 1 ? 0 : (n === 2 ? 20 : (n === 3 ? 18 : 15));
      const fontSize = n > 3 ? '13' : (n > 2 ? '15' : '17');
      const degFontSize = n > 2 ? '10' : '11.5';

      plist.forEach((p, idx) => {
        const yOffset = coords.planets[1] + (idx - (n - 1) / 2) * spacing;
        const pColor = colors[p.abbr] || colors.default;
        const retro = p.isRetrograde ? '<tspan fill="#DC2626" font-weight="900">®</tspan>' : '';
        const deg = formatChartDegree(p.degree);

        planetElements += `
          <text x="${coords.planets[0]}" y="${yOffset + 5}" 
                font-family="'Inter', -apple-system, sans-serif" 
                font-size="${fontSize}" 
                font-weight="800" 
                fill="${pColor}" 
                text-anchor="${coords.anchor}"
                style="paint-order: stroke fill; stroke: ${isPrint ? '#FFFFFF' : '#0B0B1E'}; stroke-width: 3.5px; stroke-linejoin: round;">
            ${p.abbr}${retro}${deg ? ` <tspan font-size="${degFontSize}" font-weight="700" fill="${isPrint ? '#334155' : '#CBD5E1'}">${deg}</tspan>` : ''}
          </text>
        `;
      });
    }

    const rashiColor = isPrint ? '#9A3412' : '#FBBF24';
    houseMarkup += `
      <!-- House ${h} -->
      <g class="chart-house" data-house="${h}">
        <!-- Large High-Contrast Rashi Number -->
        <text x="${coords.rashi[0]}" y="${coords.rashi[1] + 6}" 
              font-family="'Outfit', 'Inter', sans-serif" 
              font-size="19" 
              font-weight="900" 
              fill="${rashiColor}" 
              text-anchor="middle"
              style="paint-order: stroke fill; stroke: ${isPrint ? '#FFFFFF' : '#0B0B1E'}; stroke-width: 4px; stroke-linejoin: round;">
          ${rashiNum}
        </text>
        ${planetElements}
      </g>
    `;
  }

  // Theme styling definitions
  const bgFill = isPrint ? '#FFFDF8' : 'url(#chartBgGrad)';
  const borderStroke = isPrint ? '#9A3412' : 'url(#goldBorderGrad)';
  const lineStroke = isPrint ? '#B45309' : 'url(#goldBorderGrad)';
  const omFill = isPrint ? '#9A3412' : '#DAA520';
  const omOpacity = isPrint ? '0.08' : '0.12';

  const svg = `
    <svg viewBox="0 0 480 480" width="100%" height="100%" class="vedic-chart-svg" style="display: block; margin: 0 auto; max-width: 440px; ${isPrint ? 'box-shadow: 0 4px 15px rgba(180,83,9,0.12); border-radius: 6px;' : 'filter: drop-shadow(0 4px 20px rgba(0,0,0,0.5));'}">
      <defs>
        ${!isPrint ? `
        <linearGradient id="chartBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0E0E2A" />
          <stop offset="50%" stop-color="#141438" />
          <stop offset="100%" stop-color="#0A0A1F" />
        </linearGradient>
        <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5C842" />
          <stop offset="50%" stop-color="#DAA520" />
          <stop offset="100%" stop-color="#B8860B" />
        </linearGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#DAA520" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#DAA520" stop-opacity="0" />
        </radialGradient>
        ` : ''}
      </defs>

      <!-- Background -->
      <rect width="480" height="480" fill="${bgFill}" rx="6" />

      <!-- Outer Frame -->
      <rect x="6" y="6" width="468" height="468" fill="none" stroke="${borderStroke}" stroke-width="3" rx="4" />
      <rect x="12" y="12" width="456" height="456" fill="none" stroke="${lineStroke}" stroke-width="1.2" stroke-opacity="0.5" />

      <!-- Classical North Indian Diamond Dividing Lines -->
      <!-- Diagonals -->
      <line x1="12" y1="12" x2="468" y2="468" stroke="${lineStroke}" stroke-width="2.5" stroke-linecap="round" />
      <line x1="468" y1="12" x2="12" y2="468" stroke="${lineStroke}" stroke-width="2.5" stroke-linecap="round" />

      <!-- Central Diamond -->
      <polygon points="240,12 468,240 240,468 12,240" fill="none" stroke="${lineStroke}" stroke-width="2.5" stroke-linejoin="round" />

      <!-- Center Glow / Subtle Om -->
      <text x="240" y="258" font-family="'Noto Sans Devanagari', 'Outfit', sans-serif" font-size="56" fill="${omFill}" fill-opacity="${omOpacity}" text-anchor="middle" font-weight="900">
        ॐ
      </text>

      <!-- Houses, Planets & Rashi Numbers -->
      ${houseMarkup}
    </svg>
  `;

  container.innerHTML = svg;
}
