/**
 * AstroVeda - 16-Zone MahaVastu & Classical Vaastu Shastra Page
 */

import { VASTU_ZONES, auditHomeVaastu } from '../engines/vaastu/analyzer.js';

export function renderVaastuPage(container) {
  // Default room directions
  let roomSelections = {
    mainEntrance: 'NE',
    poojaRoom: 'NE',
    masterBedroom: 'SW',
    kitchen: 'SE',
    livingRoom: 'N',
    toilet: 'SSW',
    staircase: 'S',
    cashLocker: 'N',
    undergroundTank: 'NE'
  };

  const directionOptions = [
    { id: 'N', label: 'North (उत्तर - कुबेर)' },
    { id: 'NNE', label: 'NNE (स्वास्थ्य)' },
    { id: 'NE', label: 'North-East (ईशान - शिव)' },
    { id: 'ENE', label: 'ENE (आनन्द)' },
    { id: 'E', label: 'East (पूर्व - इन्द्र)' },
    { id: 'ESE', label: 'ESE (मंथन)' },
    { id: 'SE', label: 'South-East (आग्नेय - अग्नि)' },
    { id: 'SSE', label: 'SSE (बल)' },
    { id: 'S', label: 'South (दक्षिण - यम)' },
    { id: 'SSW', label: 'SSW (विसर्जन)' },
    { id: 'SW', label: 'South-West (नैऋत्य - पितृ/स्थिरता)' },
    { id: 'WSW', label: 'WSW (विद्या/बचत)' },
    { id: 'W', label: 'West (पश्चिम - वरुण)' },
    { id: 'WNW', label: 'WNW (अवसाद मुक्ति)' },
    { id: 'NW', label: 'North-West (वायव्य - वायु/सहयोग)' },
    { id: 'NNW', label: 'NNW (आकर्षण)' },
    { id: 'CENTER', label: 'Center (ब्रह्मस्थान)' }
  ];

  function renderView() {
    const audit = auditHomeVaastu(roomSelections);

    container.innerHTML = `
      <div class="vaastu-page">
        <!-- Header -->
        <div style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            🏠 16-Zone MahaVastu & Classical Sanatan Auditor
          </h2>
          <p style="color: var(--text-secondary); font-size: var(--text-sm);">
            Audit room placements against the 5 Panchatatvas with authentic non-demolition remedies.
          </p>
        </div>

        <!-- Audit Score Overview Banner -->
        <div class="glass-card" style="margin-bottom: var(--space-8); border: 2px solid ${audit.color}; text-align: center; padding: var(--space-6);">
          <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: var(--space-4);">
            <div>
              <div style="font-size: 3.5rem; font-weight: 900; color: ${audit.color}; line-height: 1;">
                ${audit.score}%
              </div>
              <div style="font-size: var(--text-sm); font-weight: 700; color: #FFF; margin-top: 4px;">
                Overall Vaastu Harmony Score
              </div>
            </div>
            <div>
              <div style="font-size: var(--text-xl); font-weight: 800; color: var(--gold-400);">
                Grade: ${audit.grade}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">
                ${audit.issues.length === 0 ? 'Flawless Cosmic Alignment' : `${audit.issues.length} Potential Doshas Detected`}
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Audit Form -->
        <div class="glass-card" style="margin-bottom: var(--space-8);">
          <h3 class="card-title"><span>🧭 Select Room Directions in Your Property</span></h3>
          <form id="vaastu-form">
            <div class="grid-3">
              <div class="form-group">
                <label class="form-label">🚪 Main Entrance (मुख्य द्वार)</label>
                <select id="v-mainEntrance" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.mainEntrance === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🕉️ Pooja Room (पूजा घर)</label>
                <select id="v-poojaRoom" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.poojaRoom === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🛏️ Master Bedroom (प्रधान शयन)</label>
                <select id="v-masterBedroom" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.masterBedroom === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🍳 Kitchen / Stove (रसोई घर)</label>
                <select id="v-kitchen" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.kitchen === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🛋️ Living Room (बैठक)</label>
                <select id="v-livingRoom" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.livingRoom === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🚽 Toilet / WC (शौचालय)</label>
                <select id="v-toilet" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.toilet === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🪜 Staircase (सीढ़ियाँ)</label>
                <select id="v-staircase" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.staircase === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">💰 Cash Locker / Safe (तिजोरी)</label>
                <select id="v-cashLocker" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.cashLocker === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">💧 Underground Water / Borewell</label>
                <select id="v-undergroundTank" class="form-select">
                  ${directionOptions.map(d => `<option value="${d.id}" ${roomSelections.undergroundTank === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: var(--space-4);">
              <button type="submit" class="btn btn-primary">
                ⚡ Recalculate Vaastu Audit
              </button>
            </div>
          </form>
        </div>

        <!-- Audit Findings & Remedies Layout -->
        <div class="grid-2" style="margin-bottom: var(--space-8);">
          <!-- Detected Issues & Non-demolition Remedies -->
          <div class="glass-card">
            <h3 class="card-title"><span style="color: #EF4444;">🛡️ Detected Doshas & Specific Remedies</span></h3>
            ${audit.issues.length === 0 ? '<p style="color: #10B981; font-weight: 600;">No severe doshas detected! Your property aligns favorably with Vedic architecture.</p>' : ''}
            <div style="display: flex; flex-direction: column; gap: var(--space-4);">
              ${audit.issues.map(iss => `
                <div style="padding: 12px; background: rgba(239, 68, 68, 0.06); border-left: 3px solid #EF4444; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong style="color: #EF4444; font-size: 13px;">${iss.room} in ${iss.direction}</strong>
                    <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(239,68,68,0.2); color: #EF4444; font-weight: 700;">${iss.severity}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">${iss.issue}</div>
                  <div style="font-size: 11px; color: var(--gold-400); background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; border: 1px solid rgba(218,165,32,0.2);">
                    <strong>Non-Demolition Remedy:</strong> ${iss.remedy}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Positive Strengths -->
          <div class="glass-card">
            <h3 class="card-title"><span style="color: #10B981;">✨ Positive Alignments (${audit.strengths.length})</span></h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${audit.strengths.map(st => `
                <div style="padding: 10px 12px; background: rgba(16, 185, 129, 0.05); border-left: 3px solid #10B981; border-radius: 6px;">
                  <div style="font-weight: 700; color: #FFF; font-size: 12px;">
                    ${st.room} &bull; ${st.direction} (${st.status})
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
                    ${st.benefit}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- General Sanatan Vastu Principles -->
            <div style="margin-top: var(--space-6); border-top: 1px solid var(--border-secondary); padding-top: var(--space-4);">
              <h4 style="font-size: var(--text-sm); font-weight: 700; color: var(--gold-400); margin-bottom: 6px;">
                Universal Sanatan Vedic Home Tips:
              </h4>
              <ul style="padding-left: 18px; font-size: 11px; color: var(--text-secondary); line-height: 1.6;">
                ${audit.generalRemedies.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- 16 Zones Encyclopedia Cards -->
        <div class="glass-card">
          <h3 class="card-title"><span>🌐 16 MahaVastu Zones Reference</span></h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
            ${VASTU_ZONES.map(z => `
              <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-secondary); border-radius: 8px;">
                <div style="font-weight: 700; font-size: 12px; color: var(--gold-400);">
                  ${z.name} (${z.nameHi})
                </div>
                <div style="font-size: 10px; color: var(--text-tertiary); margin: 2px 0;">
                  Deity: <strong>${z.deity}</strong> &bull; Element: <strong>${z.element}</strong>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.3;">
                  ${z.energy}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('vaastu-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      roomSelections.mainEntrance = document.getElementById('v-mainEntrance').value;
      roomSelections.poojaRoom = document.getElementById('v-poojaRoom').value;
      roomSelections.masterBedroom = document.getElementById('v-masterBedroom').value;
      roomSelections.kitchen = document.getElementById('v-kitchen').value;
      roomSelections.livingRoom = document.getElementById('v-livingRoom').value;
      roomSelections.toilet = document.getElementById('v-toilet').value;
      roomSelections.staircase = document.getElementById('v-staircase').value;
      roomSelections.cashLocker = document.getElementById('v-cashLocker').value;
      roomSelections.undergroundTank = document.getElementById('v-undergroundTank').value;
      renderView();
    });
  }

  renderView();
}
