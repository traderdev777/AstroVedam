/**
 * AstroVeda - Dasha System Page
 */

import { calculateVimshottariDasha, calculateYoginiDasha, getCurrentDasha } from '../engines/astrology/dasha.js';
import { generateKundali } from '../engines/astrology/kundali.js';
import { store } from '../utils/store.js';

export function renderDashaPage(container) {
  let kundali = store.currentKundali;
  if (!kundali) {
    const saved = store.getSavedBirthDetails();
    kundali = generateKundali(saved.date, saved.time, saved.latitude, saved.longitude, saved.timezone, saved.ayanamsa);
    store.currentKundali = kundali;
  }

  const moon = kundali.planets.find(p => p.name === 'Moon');
  const dashaData = calculateVimshottariDasha(moon.longitude, kundali.birthDetails.date);
  const yoginiData = calculateYoginiDasha(moon.longitude, kundali.birthDetails.date);
  const currentDasha = getCurrentDasha(dashaData);

  container.innerHTML = `
    <div class="dasha-page">
      <div style="margin-bottom: var(--space-6);">
        <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          ⏳ Vimshottari & Yogini Dasha Systems
        </h2>
        <p style="color: var(--text-secondary); font-size: var(--text-sm);">
          Vedic time cycles governing your life karmic unfoldment, career shifts, health, and prosperity.
        </p>
      </div>

      <!-- Current Running Dasha Highlight Card -->
      <div class="glass-card" style="margin-bottom: var(--space-8); border: 1.5px solid var(--gold-500); background: linear-gradient(135deg, rgba(218,165,32,0.12), rgba(124,58,237,0.12));">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4);">
          <div>
            <div style="font-size: var(--text-xs); color: var(--gold-400); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
              ✨ Currently Running Vedic Period
            </div>
            <div style="font-size: var(--text-2xl); font-weight: 800; color: #FFF; margin: 4px 0;">
              ${currentDasha ? `${currentDasha.mahaDasha} Mahadasha &bull; ${currentDasha.antarDasha} Antardasha` : 'Vimshottari Active Period'}
            </div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary);">
              ${currentDasha ? `Mahadasha span: ${currentDasha.mahaStart} to ${currentDasha.mahaEnd} | Current Sub-period: until ${currentDasha.antarEnd}` : ''}
            </div>
          </div>
          <div>
            <span style="display: inline-block; padding: 6px 14px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid #10B981; font-weight: 700; font-size: var(--text-xs);">
              CURRENTLY ACTIVE
            </span>
          </div>
        </div>
      </div>

      <!-- Birth Dasha Overview Card -->
      <div class="glass-card" style="margin-bottom: var(--space-8);">
        <h3 class="card-title"><span>📜 Natal Dasha Parameters</span></h3>
        <div class="grid-3" style="text-align: center;">
          <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-tertiary);">Birth Nakshatra</div>
            <div style="font-size: var(--text-lg); font-weight: 700; color: var(--gold-400);">
              ${dashaData.birthNakshatraName} (${dashaData.birthNakshatraNameHi})
            </div>
          </div>
          <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-tertiary);">First Mahadasha Lord</div>
            <div style="font-size: var(--text-lg); font-weight: 700; color: var(--gold-400);">
              ${dashaData.startingDashaLord}
            </div>
          </div>
          <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-tertiary);">Balance at Birth</div>
            <div style="font-size: var(--text-lg); font-weight: 700; color: var(--gold-400);">
              ${dashaData.balanceOfDasha} Years
            </div>
          </div>
        </div>
      </div>

      <!-- Vimshottari Mahadasha Timeline Table -->
      <div class="glass-card" style="margin-bottom: var(--space-8);">
        <h3 class="card-title"><span>🪐 Vimshottari Mahadasha Periods (120-Year Cycle)</span></h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--text-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-primary); color: var(--gold-400);">
                <th style="padding: 10px;">Dasha Lord</th>
                <th style="padding: 10px;">Total Span</th>
                <th style="padding: 10px;">Start Date</th>
                <th style="padding: 10px;">End Date</th>
                <th style="padding: 10px;">Status</th>
                <th style="padding: 10px;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${dashaData.periods.map((p, idx) => `
                <tr style="border-bottom: 1px solid var(--border-secondary); background: ${p.isActive ? 'rgba(218,165,32,0.08)' : 'transparent'};">
                  <td style="padding: 10px; font-weight: 700; color: ${p.isActive ? 'var(--gold-400)' : 'inherit'};">
                    ${p.lord} (${p.lordHi})
                  </td>
                  <td style="padding: 10px;">${p.balanceYears} Years</td>
                  <td style="padding: 10px; font-family: monospace;">${p.startDate}</td>
                  <td style="padding: 10px; font-family: monospace;">${p.endDate}</td>
                  <td style="padding: 10px;">
                    ${p.isActive ? '<span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); color: #10B981; font-weight: 700;">Running</span>' : '<span style="color: var(--text-tertiary); font-size: 11px;">Completed / Future</span>'}
                  </td>
                  <td style="padding: 10px;">
                    <button class="btn btn-secondary toggle-antar-btn" data-index="${idx}" style="padding: 2px 8px; font-size: 11px;">
                      View Antardashas
                    </button>
                  </td>
                </tr>
                <tr id="antar-row-${idx}" style="display: none; background: rgba(10,10,26,0.6);">
                  <td colspan="6" style="padding: 12px;">
                    <div style="font-weight: 600; font-size: 12px; color: var(--gold-400); margin-bottom: 8px;">
                      Sub-periods (Antardasha) of ${p.lord}:
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px;">
                      ${p.antardasha ? p.antardasha.map(a => `
                        <div style="padding: 6px 10px; background: rgba(255,255,255,0.03); border: 1px solid ${a.isActive ? '#10B981' : 'var(--border-secondary)'}; border-radius: 6px;">
                          <div style="font-weight: 700; font-size: 11px; color: ${a.isActive ? '#10B981' : 'var(--text-primary)'};">
                            ${p.lord}-${a.lord} (${a.lordHi}) ${a.isActive ? '● ACTIVE' : ''}
                          </div>
                          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 2px;">
                            ${a.startDate} to ${a.endDate}
                          </div>
                        </div>
                      `).join('') : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Yogini Dasha Table -->
      <div class="glass-card">
        <h3 class="card-title"><span>🌺 Yogini Dasha System (36-Year Cycle)</span></h3>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-4);">
          Classical feminine energy cycle, especially potent for acute health, sudden turn of fortune, and spiritual breakthroughs.
        </p>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--text-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-primary); color: var(--gold-400);">
                <th style="padding: 10px;">Yogini Name</th>
                <th style="padding: 10px;">Ruling Graha</th>
                <th style="padding: 10px;">Years</th>
                <th style="padding: 10px;">Start Date</th>
                <th style="padding: 10px;">End Date</th>
                <th style="padding: 10px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${yoginiData.periods.map(y => `
                <tr style="border-bottom: 1px solid var(--border-secondary); background: ${y.isActive ? 'rgba(218,165,32,0.08)' : 'transparent'};">
                  <td style="padding: 10px; font-weight: 700; color: ${y.isActive ? 'var(--gold-400)' : 'inherit'};">
                    ${y.yogini}
                  </td>
                  <td style="padding: 10px;">${y.planet}</td>
                  <td style="padding: 10px;">${y.years} Yr</td>
                  <td style="padding: 10px; font-family: monospace;">${y.startDate}</td>
                  <td style="padding: 10px; font-family: monospace;">${y.endDate}</td>
                  <td style="padding: 10px;">
                    ${y.isActive ? '<span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); color: #10B981; font-weight: 700;">Running</span>' : '<span style="color: var(--text-tertiary); font-size: 11px;">Completed / Future</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Attach Antardasha expand listeners
  container.querySelectorAll('.toggle-antar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      const row = document.getElementById(`antar-row-${idx}`);
      if (row) {
        const isHidden = row.style.display === 'none';
        row.style.display = isHidden ? 'table-row' : 'none';
        btn.textContent = isHidden ? 'Hide Antardashas' : 'View Antardashas';
      }
    });
  });
}
