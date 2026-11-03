import{c as g,a as c,g as v}from"./dasha-DOZlgJUC.js";import{g as h}from"./kundali-BA-k_CTH.js";import{s}from"./index-Bw9TiSIN.js";import"./ephemeris-XGObF-IA.js";function f(o){let r=s.currentKundali;if(!r){const t=s.getSavedBirthDetails();r=h(t.date,t.time,t.latitude,t.longitude,t.timezone,t.ayanamsa),s.currentKundali=r}const n=r.planets.find(t=>t.name==="Moon"),i=g(n.longitude,r.birthDetails.date),p=c(n.longitude,r.birthDetails.date),e=v(i);o.innerHTML=`
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
              ${e?`${e.mahaDasha} Mahadasha &bull; ${e.antarDasha} Antardasha`:"Vimshottari Active Period"}
            </div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary);">
              ${e?`Mahadasha span: ${e.mahaStart} to ${e.mahaEnd} | Current Sub-period: until ${e.antarEnd}`:""}
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
              ${i.birthNakshatraName} (${i.birthNakshatraNameHi})
            </div>
          </div>
          <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-tertiary);">First Mahadasha Lord</div>
            <div style="font-size: var(--text-lg); font-weight: 700; color: var(--gold-400);">
              ${i.startingDashaLord}
            </div>
          </div>
          <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-tertiary);">Balance at Birth</div>
            <div style="font-size: var(--text-lg); font-weight: 700; color: var(--gold-400);">
              ${i.balanceOfDasha} Years
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
              ${i.periods.map((t,d)=>`
                <tr style="border-bottom: 1px solid var(--border-secondary); background: ${t.isActive?"rgba(218,165,32,0.08)":"transparent"};">
                  <td style="padding: 10px; font-weight: 700; color: ${t.isActive?"var(--gold-400)":"inherit"};">
                    ${t.lord} (${t.lordHi})
                  </td>
                  <td style="padding: 10px;">${t.balanceYears} Years</td>
                  <td style="padding: 10px; font-family: monospace;">${t.startDate}</td>
                  <td style="padding: 10px; font-family: monospace;">${t.endDate}</td>
                  <td style="padding: 10px;">
                    ${t.isActive?'<span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); color: #10B981; font-weight: 700;">Running</span>':'<span style="color: var(--text-tertiary); font-size: 11px;">Completed / Future</span>'}
                  </td>
                  <td style="padding: 10px;">
                    <button class="btn btn-secondary toggle-antar-btn" data-index="${d}" style="padding: 2px 8px; font-size: 11px;">
                      View Antardashas
                    </button>
                  </td>
                </tr>
                <tr id="antar-row-${d}" style="display: none; background: rgba(10,10,26,0.6);">
                  <td colspan="6" style="padding: 12px;">
                    <div style="font-weight: 600; font-size: 12px; color: var(--gold-400); margin-bottom: 8px;">
                      Sub-periods (Antardasha) of ${t.lord}:
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px;">
                      ${t.antardasha?t.antardasha.map(a=>`
                        <div style="padding: 6px 10px; background: rgba(255,255,255,0.03); border: 1px solid ${a.isActive?"#10B981":"var(--border-secondary)"}; border-radius: 6px;">
                          <div style="font-weight: 700; font-size: 11px; color: ${a.isActive?"#10B981":"var(--text-primary)"};">
                            ${t.lord}-${a.lord} (${a.lordHi}) ${a.isActive?"● ACTIVE":""}
                          </div>
                          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 2px;">
                            ${a.startDate} to ${a.endDate}
                          </div>
                        </div>
                      `).join(""):""}
                    </div>
                  </td>
                </tr>
              `).join("")}
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
              ${p.periods.map(t=>`
                <tr style="border-bottom: 1px solid var(--border-secondary); background: ${t.isActive?"rgba(218,165,32,0.08)":"transparent"};">
                  <td style="padding: 10px; font-weight: 700; color: ${t.isActive?"var(--gold-400)":"inherit"};">
                    ${t.yogini}
                  </td>
                  <td style="padding: 10px;">${t.planet}</td>
                  <td style="padding: 10px;">${t.years} Yr</td>
                  <td style="padding: 10px; font-family: monospace;">${t.startDate}</td>
                  <td style="padding: 10px; font-family: monospace;">${t.endDate}</td>
                  <td style="padding: 10px;">
                    ${t.isActive?'<span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); color: #10B981; font-weight: 700;">Running</span>':'<span style="color: var(--text-tertiary); font-size: 11px;">Completed / Future</span>'}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,o.querySelectorAll(".toggle-antar-btn").forEach(t=>{t.addEventListener("click",()=>{const d=t.getAttribute("data-index"),a=document.getElementById(`antar-row-${d}`);if(a){const l=a.style.display==="none";a.style.display=l?"table-row":"none",t.textContent=l?"Hide Antardashas":"View Antardashas"}})})}export{f as renderDashaPage};
