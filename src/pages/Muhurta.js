/**
 * AstroVeda - Auspicious Muhurta Finder Page
 */

import { findMuhurtas, MUHURTA_TYPES } from '../engines/astrology/muhurta.js';

export function renderMuhurtaPage(container) {
  let selectedActivity = 'vivah';
  let startDate = new Date().toISOString().split('T')[0];

  function renderView() {
    const data = findMuhurtas(selectedActivity, startDate, 7);

    container.innerHTML = `
      <div class="muhurta-page">
        <!-- Page Header -->
        <div style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ✨ Auspicious Muhurta Finder (शुभ मुहूर्त)
          </h2>
          <p style="color: var(--text-secondary); font-size: var(--text-sm);">
            Identify divine cosmic windows for life milestones with Tithi, Nakshatra, and Choghadiya alignment.
          </p>
        </div>

        <!-- Activity Selection Tabs -->
        <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-6);">
          ${MUHURTA_TYPES.map(act => `
            <button class="btn ${act.id === selectedActivity ? 'btn-primary' : 'btn-secondary'} muhurta-act-btn" data-act="${act.id}" style="font-size: var(--text-xs);">
              ${act.icon} ${act.name}
            </button>
          `).join('')}
        </div>

        <!-- Settings Bar -->
        <div class="glass-card" style="margin-bottom: var(--space-8); padding: var(--space-4);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);">
            <div>
              <strong style="color: var(--gold-400);">${data.activity.name} (${data.activity.nameHi})</strong>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${data.activity.advice}</div>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <label style="font-size: var(--text-xs); color: var(--text-secondary);">Start From:</label>
              <input type="date" id="m-start-date" class="form-input" value="${startDate}" style="width: auto; padding: 4px 10px; font-size: 12px;" />
            </div>
          </div>
        </div>

        <!-- 7-Day Muhurta Cards -->
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          ${data.results.map(r => `
            <div class="glass-card" style="border-left: 4px solid ${r.color};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-3);">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: var(--text-lg); font-weight: 800; color: #FFF;">${r.date}</span>
                    <span style="font-size: var(--text-sm); color: var(--gold-400); font-weight: 600;">(${r.weekday} - ${r.weekdayHi})</span>
                    <span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: ${r.color}22; color: ${r.color}; font-weight: 700; border: 1px solid ${r.color};">
                      ${r.status}
                    </span>
                  </div>
                  <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">
                    Tithi: <strong style="color: var(--text-primary);">${r.tithi}</strong> &bull; Nakshatra: <strong style="color: var(--text-primary);">${r.nakshatra}</strong>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: var(--text-xl); font-weight: 900; color: ${r.color};">${r.score}%</div>
                  <div style="font-size: 10px; color: var(--text-tertiary);">Auspicious Score</div>
                </div>
              </div>

              <!-- Recommended Time Slots -->
              <div style="border-top: 1px solid var(--border-secondary); padding-top: var(--space-3); margin-top: var(--space-2);">
                <div style="font-size: 11px; font-weight: 700; color: var(--gold-400); margin-bottom: 6px;">
                  Recommended Auspicious Windows for this date:
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${r.auspiciousSlots.map(s => `
                    <div style="padding: 4px 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 11px;">
                      <span style="color: #10B981; font-weight: 600;">${s.name}:</span>
                      <span style="font-family: monospace; color: #E2E8F0; margin-left: 4px;">${s.time}</span>
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top: 6px; font-size: 10px; color: #EF4444;">
                  Avoid Rahu Kaal: <strong>${r.rahuKaal}</strong>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Activity button events
    container.querySelectorAll('.muhurta-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedActivity = btn.getAttribute('data-act');
        renderView();
      });
    });

    // Date change event
    document.getElementById('m-start-date')?.addEventListener('change', (e) => {
      startDate = e.target.value;
      renderView();
    });
  }

  renderView();
}
