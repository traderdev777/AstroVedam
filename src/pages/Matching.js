/**
 * AstroVeda - Kundali Matching (Gun Milan) Page
 * Includes precise Place of Birth, Definitive Marriage Decision (Can they marry or not?),
 * and Exact Step-by-Step Remedies for each matching dosha and natal kundali dosha.
 */

import { generateKundali } from '../engines/astrology/kundali.js';
import { matchHoroscopes } from '../engines/astrology/matching.js';
import { analyzeDoshas } from '../engines/astrology/dosha.js';
import { INDIAN_PLACES, renderIndianPlacesDatalist, findIndianPlace } from '../utils/indianPlaces.js';
import { escapeHtml } from '../components/reports/FullPatrikaReport.js';

export function renderMatchingPage(container) {
  // Preset defaults matching user's exact case
  let boyDetails = { name: 'Amit Brijawasi', date: '1994-06-15', time: '08:30', lat: 28.6139, lon: 77.2090, tz: 5.5, city: 'New Delhi, Delhi' };
  let girlDetails = { name: 'Mahalaxmi Hajeri', date: '1996-09-22', time: '14:15', lat: 19.0760, lon: 72.8777, tz: 5.5, city: 'Mumbai, Maharashtra' };

  function renderView() {
    container.innerHTML = `
      <div class="matching-page">
        <!-- Header -->
        <div style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            💍 Kundali Milan: Marriage Decision & Exact Vedic Remedies
          </h2>
          <p style="color: var(--text-secondary); font-size: var(--text-sm);">
            Ashtakoota 36 Gunas, definitive marriage conclusion, and exact classical remedies for each detected dosha.
          </p>
        </div>

        <!-- Inputs Grid -->
        <div class="grid-2" style="margin-bottom: var(--space-8);">
          <!-- Boy Form -->
          <div class="glass-card">
            <h3 class="card-title"><span>🤵 Groom Details (वर)</span></h3>
            <div class="form-group">
              <label class="form-label">Groom's Name</label>
              <input type="text" id="m-boy-name" class="form-input" value="${escapeHtml(boyDetails.name)}" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input type="date" id="m-boy-date" class="form-input" value="${escapeHtml(boyDetails.date)}" />
              </div>
              <div class="form-group">
                <label class="form-label">Time of Birth (24h)</label>
                <input type="time" id="m-boy-time" class="form-input" value="${escapeHtml(boyDetails.time)}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" style="display: flex; justify-content: space-between;">
                <span>Place of Birth (Search All Indian Places)</span>
                <span style="color: var(--gold-400); font-size: 11px;">150+ Places</span>
              </label>
              <input type="text" id="m-boy-city-input" list="m-boy-places-list" class="form-input" 
                     placeholder="Search city e.g. Bengaluru, Varanasi, Ayodhya, Patna..." 
                     value="${escapeHtml(boyDetails.city)}" autocomplete="off" />
              ${renderIndianPlacesDatalist('m-boy-places-list')}
            </div>
            <div class="form-row" style="font-size: 11px; opacity: 0.85; background: rgba(0,0,0,0.15); padding: 8px; border-radius: 6px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 10px;">Latitude (°N)</label>
                <input type="number" step="0.0001" id="m-boy-lat" class="form-input" value="${boyDetails.lat}" style="padding: 4px 8px; font-size: 11px;" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 10px;">Longitude (°E)</label>
                <input type="number" step="0.0001" id="m-boy-lon" class="form-input" value="${boyDetails.lon}" style="padding: 4px 8px; font-size: 11px;" />
              </div>
            </div>
          </div>

          <!-- Girl Form -->
          <div class="glass-card">
            <h3 class="card-title"><span>👰 Bride Details (कन्या)</span></h3>
            <div class="form-group">
              <label class="form-label">Bride's Name</label>
              <input type="text" id="m-girl-name" class="form-input" value="${escapeHtml(girlDetails.name)}" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input type="date" id="m-girl-date" class="form-input" value="${escapeHtml(girlDetails.date)}" />
              </div>
              <div class="form-group">
                <label class="form-label">Time of Birth (24h)</label>
                <input type="time" id="m-girl-time" class="form-input" value="${escapeHtml(girlDetails.time)}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" style="display: flex; justify-content: space-between;">
                <span>Place of Birth (Search All Indian Places)</span>
                <span style="color: var(--gold-400); font-size: 11px;">150+ Places</span>
              </label>
              <input type="text" id="m-girl-city-input" list="m-girl-places-list" class="form-input" 
                     placeholder="Search city e.g. Mumbai, Mysuru, Ujjain, Jaipur..." 
                     value="${escapeHtml(girlDetails.city)}" autocomplete="off" />
              ${renderIndianPlacesDatalist('m-girl-places-list')}
            </div>
            <div class="form-row" style="font-size: 11px; opacity: 0.85; background: rgba(0,0,0,0.15); padding: 8px; border-radius: 6px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 10px;">Latitude (°N)</label>
                <input type="number" step="0.0001" id="m-girl-lat" class="form-input" value="${girlDetails.lat}" style="padding: 4px 8px; font-size: 11px;" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 10px;">Longitude (°E)</label>
                <input type="number" step="0.0001" id="m-girl-lon" class="form-input" value="${girlDetails.lon}" style="padding: 4px 8px; font-size: 11px;" />
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; margin-bottom: var(--space-8);">
          <button id="calculate-match-btn" class="btn btn-primary btn-lg">
            ✨ Calculate Compatibility & Generate Verdict
          </button>
        </div>

        <!-- Results Section -->
        <div id="matching-results-container"></div>
      </div>
    `;

    // Attach groom place listener
    const bCityInput = document.getElementById('m-boy-city-input');
    const updateBoyCoords = (val) => {
      const match = findIndianPlace(val);
      if (match) {
        document.getElementById('m-boy-lat').value = match.lat;
        document.getElementById('m-boy-lon').value = match.lon;
        boyDetails.city = match.name;
        boyDetails.tz = match.tz;
      }
    };
    bCityInput?.addEventListener('input', (e) => updateBoyCoords(e.target.value));
    bCityInput?.addEventListener('change', (e) => updateBoyCoords(e.target.value));

    // Attach bride place listener
    const gCityInput = document.getElementById('m-girl-city-input');
    const updateGirlCoords = (val) => {
      const match = findIndianPlace(val);
      if (match) {
        document.getElementById('m-girl-lat').value = match.lat;
        document.getElementById('m-girl-lon').value = match.lon;
        girlDetails.city = match.name;
        girlDetails.tz = match.tz;
      }
    };
    gCityInput?.addEventListener('input', (e) => updateGirlCoords(e.target.value));
    gCityInput?.addEventListener('change', (e) => updateGirlCoords(e.target.value));

    document.getElementById('calculate-match-btn')?.addEventListener('click', calculateAndRenderResults);
    calculateAndRenderResults();
  }

  function calculateAndRenderResults() {
    const bName = document.getElementById('m-boy-name').value;
    const bDate = document.getElementById('m-boy-date').value;
    const bTime = document.getElementById('m-boy-time').value;
    const bCity = document.getElementById('m-boy-city-input').value;
    const bLat = parseFloat(document.getElementById('m-boy-lat').value);
    const bLon = parseFloat(document.getElementById('m-boy-lon').value);

    const gName = document.getElementById('m-girl-name').value;
    const gDate = document.getElementById('m-girl-date').value;
    const gTime = document.getElementById('m-girl-time').value;
    const gCity = document.getElementById('m-girl-city-input').value;
    const gLat = parseFloat(document.getElementById('m-girl-lat').value);
    const gLon = parseFloat(document.getElementById('m-girl-lon').value);

    const safeBName = escapeHtml(bName || 'Groom');
    const safeGName = escapeHtml(gName || 'Bride');
    const safeBCity = escapeHtml(bCity || 'City');
    const safeGCity = escapeHtml(gCity || 'City');

    const boyK = generateKundali(bDate, bTime, bLat, bLon, boyDetails.tz);
    const girlK = generateKundali(gDate, gTime, gLat, gLon, girlDetails.tz);

    const match = matchHoroscopes(boyK, girlK);
    const boyDoshas = analyzeDoshas(boyK);
    const girlDoshas = analyzeDoshas(girlK);

    const boyManglik = boyDoshas.find(d => d.id === 'manglik');
    const girlManglik = girlDoshas.find(d => d.id === 'manglik');

    const resEl = document.getElementById('matching-results-container');
    if (!resEl) return;

    const boyMoon = boyK.planets.find(p => p.name === 'Moon');
    const girlMoon = girlK.planets.find(p => p.name === 'Moon');

    // Filter natal doshas
    const boyActiveDoshas = boyDoshas.filter(d => d.present);
    const girlActiveDoshas = girlDoshas.filter(d => d.present);

    resEl.innerHTML = `
      <!-- ============================================ -->
      <!-- DEFINITIVE MARRIAGE DECISION BOX (विवाह निर्णय) -->
      <!-- ============================================ -->
      <div class="glass-card" style="margin-bottom: var(--space-8); border: 2.5px solid ${match.color}; padding: var(--space-8); background: linear-gradient(135deg, rgba(15,15,46,0.95), ${match.color}15);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4);">
          <div style="font-size: var(--text-xs); color: var(--gold-400); font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
            🕉️ FINAL ASTROLOGICAL VERDICT & MARRIAGE DECISION (विवाह निर्णय)
          </div>
          <span style="padding: 6px 16px; border-radius: 9999px; background: ${match.color}22; color: ${match.color}; border: 1.5px solid ${match.color}; font-weight: 800; font-size: var(--text-xs);">
            ${match.decisionBadge}
          </span>
        </div>

        <h3 style="font-size: var(--text-3xl); font-weight: 900; color: ${match.color}; margin-bottom: var(--space-3); line-height: 1.2;">
          ${match.decisionTitle}
        </h3>

        <div style="font-size: var(--text-xl); font-weight: 700; color: #FFF; margin-bottom: 4px;">
          Guna Milan Score: <span style="color: ${match.color};">${match.totalPoints} / ${match.maxPoints} Gunas</span> 
          <span style="font-size: var(--text-sm); color: var(--text-secondary); font-weight: 400;">(Minimum required by Shastras: 18)</span>
        </div>

        <p style="font-size: var(--text-sm); color: #E2E8F0; line-height: 1.7; margin: var(--space-4) 0; padding: 14px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 4px solid ${match.color};">
          <strong>Vedic Conclusion:</strong> ${match.detailedConclusion}
        </p>

        <p style="font-family: 'Noto Sans Devanagari'; font-size: var(--text-sm); color: var(--gold-300); line-height: 1.8; margin-bottom: 0;">
          <strong>शास्त्रीय निष्कर्ष:</strong> ${match.detailedConclusionHi}
        </p>
      </div>

      <!-- Astrological Profile Alignment Summary -->
      <div class="grid-2" style="margin-bottom: var(--space-8);">
        <div class="glass-card">
          <h4 style="color: var(--gold-400); font-size: var(--text-base); margin-bottom: var(--space-3);">
            🤵 Groom Profile (${safeBName})
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: var(--text-xs);">
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Birth Place:</span>
              <strong style="color: #FFF; margin-left: 4px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${safeBCity}</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Lagna:</span>
              <strong style="color: #FFF; margin-left: 4px;">${boyK.lagna.rashiName} (${boyK.lagna.rashiNameHi})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Moon Sign:</span>
              <strong style="color: #FFF; margin-left: 4px;">${boyMoon.rashiName} (${boyMoon.rashiNameHi})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Nakshatra:</span>
              <strong style="color: #FFF; margin-left: 4px;">${boyMoon.nakshatraName} (Pada ${boyMoon.pada})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px; grid-column: span 2;">
              <span style="color: var(--text-tertiary);">Manglik Status:</span>
              <strong style="color: ${boyManglik.present ? '#EF4444' : '#10B981'}; margin-left: 4px;">
                ${boyManglik.present ? (boyManglik.cancelled ? 'Mild (Cancelled by Jupiter/Sign)' : 'Yes (Kuja Dosha)') : 'No (Clear)'}
              </strong>
            </div>
          </div>
        </div>

        <div class="glass-card">
          <h4 style="color: var(--gold-400); font-size: var(--text-base); margin-bottom: var(--space-3);">
            👰 Bride Profile (${safeGName})
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: var(--text-xs);">
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Birth Place:</span>
              <strong style="color: #FFF; margin-left: 4px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${safeGCity}</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Lagna:</span>
              <strong style="color: #FFF; margin-left: 4px;">${girlK.lagna.rashiName} (${girlK.lagna.rashiNameHi})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Moon Sign:</span>
              <strong style="color: #FFF; margin-left: 4px;">${girlMoon.rashiName} (${girlMoon.rashiNameHi})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Nakshatra:</span>
              <strong style="color: #FFF; margin-left: 4px;">${girlMoon.nakshatraName} (Pada ${girlMoon.pada})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px; grid-column: span 2;">
              <span style="color: var(--text-tertiary);">Manglik Status:</span>
              <strong style="color: ${girlManglik.present ? '#EF4444' : '#10B981'}; margin-left: 4px;">
                ${girlManglik.present ? (girlManglik.cancelled ? 'Mild (Cancelled by Jupiter/Sign)' : 'Yes (Kuja Dosha)') : 'No (Clear)'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- EXACT REMEDIES FOR EACH MATCHING DOSHA -->
      <!-- ============================================ -->
      <div class="glass-card" style="margin-bottom: var(--space-8); border-top: 3px solid #EF4444;">
        <h3 class="card-title">
          <span style="color: #EF4444;">🛡️ Exact Shastric Remedies for Detected Matching Doshas</span>
        </h3>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-4);">
          If the couple or families decide to proceed despite the adverse score, the following specific Vedic remedies MUST be undertaken:
        </p>

        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          ${match.detectedDoshas.map(d => `
            <div style="padding: var(--space-4); background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: var(--radius-md);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <h4 style="color: var(--gold-400); font-size: var(--text-base); margin: 0;">${d.title}</h4>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: rgba(239,68,68,0.2); color: #EF4444; font-weight: 700;">
                  Severity: ${d.severity}
                </span>
              </div>
              <p style="font-size: var(--text-xs); color: #CBD5E1; margin-bottom: var(--space-3); line-height: 1.6;">
                ${d.description}
              </p>
              <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 6px; border: 1px solid rgba(218,165,32,0.2);">
                <div style="font-size: 11px; font-weight: 700; color: var(--gold-400); margin-bottom: 6px; text-transform: uppercase;">
                  Exact Sanatan Vedic Step-by-Step Remedies:
                </div>
                <ul style="padding-left: 18px; margin: 0; font-size: 11px; color: var(--text-primary); line-height: 1.8;">
                  ${d.remedies.map(r => `<li>${r}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ============================================ -->
      <!-- INDIVIDUAL JANAM KUNDALI DOSHAS & REMEDIES -->
      <!-- ============================================ -->
      <div class="grid-2" style="margin-bottom: var(--space-8);">
        <!-- Groom Kundali Doshas -->
        <div class="glass-card">
          <h4 style="color: var(--gold-400); font-size: var(--text-sm); font-weight: 700; margin-bottom: var(--space-3);">
            🪐 Groom's Janam Kundali Doshas (${safeBName})
          </h4>
          ${boyActiveDoshas.length === 0 ? '<p style="color: #10B981; font-size: 12px;">No major natal doshas detected in Groom\'s chart.</p>' : ''}
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${boyActiveDoshas.map(d => `
              <div style="padding: 10px; background: rgba(255,255,255,0.02); border-left: 3px solid #F59E0B; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #FFF;">
                  <span>${d.name} (${d.nameHi})</span>
                  <span style="color: ${d.cancelled ? '#10B981' : '#EF4444'}; font-size: 10px;">${d.intensity}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); margin: 4px 0;">${d.impact}</div>
                <div style="font-size: 10px; color: var(--gold-300); margin-top: 4px;">
                  <strong>Remedy:</strong> ${d.remedies[0]}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bride Kundali Doshas -->
        <div class="glass-card">
          <h4 style="color: var(--gold-400); font-size: var(--text-sm); font-weight: 700; margin-bottom: var(--space-3);">
            🪐 Bride's Janam Kundali Doshas (${safeGName})
          </h4>
          ${girlActiveDoshas.length === 0 ? '<p style="color: #10B981; font-size: 12px;">No major natal doshas detected in Bride\'s chart.</p>' : ''}
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${girlActiveDoshas.map(d => `
              <div style="padding: 10px; background: rgba(255,255,255,0.02); border-left: 3px solid #F59E0B; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #FFF;">
                  <span>${d.name} (${d.nameHi})</span>
                  <span style="color: ${d.cancelled ? '#10B981' : '#EF4444'}; font-size: 10px;">${d.intensity}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); margin: 4px 0;">${d.impact}</div>
                <div style="font-size: 10px; color: var(--gold-300); margin-top: 4px;">
                  <strong>Remedy:</strong> ${d.remedies[0]}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 8 Kootas Table -->
      <div class="glass-card" style="margin-bottom: var(--space-8);">
        <h3 class="card-title"><span>📊 Ashtakoota Milan Breakdown (8 Dimensions)</span></h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--text-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-primary); color: var(--gold-400);">
                <th style="padding: 10px;">Koota Dimension</th>
                <th style="padding: 10px;">Significance</th>
                <th style="padding: 10px;">Groom (${safeBName})</th>
                <th style="padding: 10px;">Bride (${safeGName})</th>
                <th style="padding: 10px;">Score</th>
                <th style="padding: 10px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${match.kootas.map(k => `
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: 10px; font-weight: 700;">${k.name} (${k.nameHi})</td>
                  <td style="padding: 10px; color: var(--text-secondary); font-size: 12px;">${k.description}</td>
                  <td style="padding: 10px; font-weight: 600;">${k.boyVal}</td>
                  <td style="padding: 10px; font-weight: 600;">${k.girlVal}</td>
                  <td style="padding: 10px; font-weight: 800; color: var(--gold-400);">${k.obtained} / ${k.max}</td>
                  <td style="padding: 10px;">
                    <span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: ${k.obtained >= k.max * 0.5 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${k.obtained >= k.max * 0.5 ? '#10B981' : '#EF4444'}; font-weight: 600;">
                      ${k.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderView();
}
