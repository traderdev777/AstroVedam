import{c as p}from"./panchang-gcc3KLuc.js";import{I as c,r as v,f as g}from"./indianPlaces-CBev9HOS.js";import"./ephemeris-XGObF-IA.js";function f(l){let s=new Date().toISOString().split("T")[0],e=c[0];function n(){var o;const t=p(s,e.lat,e.lon,e.tz);l.innerHTML=`
      <div class="panchang-page">
        <!-- Header & Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-6);">
          <div>
            <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              📅 Daily Vedic Panchang & Choghadiya
            </h2>
            <p style="color: var(--text-secondary); font-size: var(--text-sm);">
              Authentic 5 limbs of time, auspicious Muhurtas, Rahu Kaal, and 24 planetary Horas for any Indian city.
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: var(--text-xs); font-weight: 600; color: var(--gold-400);">City:</label>
              <input type="text" id="panchang-place-input" list="panchang-indian-places" class="form-input" 
                     value="${e.name}" style="width: 220px; padding: 6px 12px; font-size: 12px;" autocomplete="off" />
              ${v("panchang-indian-places")}
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: var(--text-xs); font-weight: 600; color: var(--gold-400);">Date:</label>
              <input type="date" id="panchang-date-input" class="form-input" value="${s}" style="width: auto; padding: 6px 12px; font-size: 12px;" />
            </div>
          </div>
        </div>

        <!-- City coordinates badge -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: var(--space-6); font-size: 11px; color: var(--text-tertiary);">
          <span>📍 <strong>${e.name}</strong></span>
          <span>&bull;</span>
          <span>Lat: ${e.lat.toFixed(2)}°N, Lon: ${e.lon.toFixed(2)}°E</span>
          <span>&bull;</span>
          <span>Solar Noon & Sunrise adjusted for geographic longitude</span>
        </div>

        <!-- The 5 Limbs (Pancha-Anga) Cards -->
        <div class="grid-4" style="margin-bottom: var(--space-8);">
          <!-- Tithi -->
          <div class="glass-card" style="text-align: center;">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">1. Tithi (तिथि)</div>
            <div style="font-size: var(--text-xl); font-weight: 800; color: var(--gold-400); margin: 6px 0;">
              ${t.tithi.name}
            </div>
            <div style="font-family: 'Noto Sans Devanagari'; font-size: var(--text-base); color: var(--text-secondary);">
              ${t.tithi.nameHi}
            </div>
            <div style="font-size: 11px; color: var(--gold-300); margin-top: 6px;">
              ${t.tithi.paksha} Paksha &bull; Deity: ${t.tithi.deity}
            </div>
          </div>

          <!-- Nakshatra -->
          <div class="glass-card" style="text-align: center;">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">2. Nakshatra (नक्षत्र)</div>
            <div style="font-size: var(--text-xl); font-weight: 800; color: var(--gold-400); margin: 6px 0;">
              ${t.nakshatra.name}
            </div>
            <div style="font-family: 'Noto Sans Devanagari'; font-size: var(--text-base); color: var(--text-secondary);">
              ${t.nakshatra.nameHi}
            </div>
            <div style="font-size: 11px; color: var(--gold-300); margin-top: 6px;">
              Lord: ${t.nakshatra.lord} &bull; Pada ${t.nakshatra.pada}
            </div>
          </div>

          <!-- Yoga -->
          <div class="glass-card" style="text-align: center;">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">3. Yoga (योग)</div>
            <div style="font-size: var(--text-xl); font-weight: 800; color: var(--gold-400); margin: 6px 0;">
              ${t.yoga.name}
            </div>
            <div style="font-family: 'Noto Sans Devanagari'; font-size: var(--text-base); color: var(--text-secondary);">
              ${t.yoga.nameHi}
            </div>
            <div style="font-size: 11px; color: ${t.yoga.nature==="Auspicious"?"#10B981":"#EF4444"}; margin-top: 6px; font-weight: 600;">
              ${t.yoga.nature}
            </div>
          </div>

          <!-- Karana & Vaara -->
          <div class="glass-card" style="text-align: center;">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">4. Karana & 5. Vaara</div>
            <div style="font-size: var(--text-xl); font-weight: 800; color: var(--gold-400); margin: 6px 0;">
              ${t.karana.name}
            </div>
            <div style="font-size: 11px; color: var(--text-secondary);">
              Karana: ${t.karana.nameHi} (${t.karana.nature})
            </div>
            <div style="font-size: 11px; color: var(--gold-300); margin-top: 6px; font-weight: 600;">
              Vaara: ${t.weekday} (${t.weekdayHi})
            </div>
          </div>
        </div>

        <!-- Timings Section (Sun, Auspicious, Inauspicious) -->
        <div class="grid-3" style="margin-bottom: var(--space-8);">
          <!-- Solar Times -->
          <div class="glass-card">
            <h3 class="card-title"><span>☀️ Solar Cycles (${e.name.split(",")[0]})</span></h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 6px;">
                <span style="color: var(--text-secondary);">Sunrise (सूर्योदय)</span>
                <strong style="color: #F59E0B;">${t.sunrise}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 6px;">
                <span style="color: var(--text-secondary);">Sunset (सूर्यास्त)</span>
                <strong style="color: #F59E0B;">${t.sunset}</strong>
              </div>
            </div>
          </div>

          <!-- Auspicious Muhurtas -->
          <div class="glass-card">
            <h3 class="card-title"><span style="color: #10B981;">✨ Auspicious Slots</span></h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(16,185,129,0.05); border-radius: 6px;">
                <span style="color: #10B981;">Abhijit Muhurta</span>
                <strong>${t.muhurtas.abhijit}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(16,185,129,0.05); border-radius: 6px;">
                <span style="color: #10B981;">Brahma Muhurta</span>
                <strong>${t.muhurtas.brahma}</strong>
              </div>
            </div>
          </div>

          <!-- Inauspicious Periods -->
          <div class="glass-card">
            <h3 class="card-title"><span style="color: #EF4444;">⚠️ Inauspicious Kaal</span></h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(239,68,68,0.05); border-radius: 6px;">
                <span style="color: #EF4444;">Rahu Kaal</span>
                <strong>${t.muhurtas.rahuKaal}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(239,68,68,0.05); border-radius: 6px;">
                <span style="color: #EF4444;">Yamaganda</span>
                <strong>${t.muhurtas.yamaganda}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(239,68,68,0.05); border-radius: 6px;">
                <span style="color: #EF4444;">Gulika Kaal</span>
                <strong>${t.muhurtas.gulika}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Choghadiya Section -->
        <div class="glass-card" style="margin-bottom: var(--space-8);">
          <h3 class="card-title"><span>⏳ Choghadiya Timings (Day & Night)</span></h3>
          <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-4);">
            Amrit, Shubh & Labh are best for auspicious beginnings. Char is suitable for travel. Rog, Kaal & Udveg are inauspicious.
          </p>

          <div class="grid-2">
            <!-- Day Choghadiya -->
            <div>
              <div style="font-weight: 700; color: var(--gold-400); margin-bottom: 8px; font-size: var(--text-sm);">
                ☀️ Day Choghadiya (दिन का चौघड़िया)
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${t.choghadiya.day.map(a=>`
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border-left: 3px solid ${a.status==="Auspicious"?"#10B981":a.status==="Moderate"?"#F59E0B":"#EF4444"};">
                    <div>
                      <strong>${a.name} (${a.nameHi})</strong>
                      <span style="font-size: 11px; margin-left: 6px; color: ${a.status==="Auspicious"?"#10B981":a.status==="Moderate"?"#F59E0B":"#EF4444"}; font-weight: 600;">
                        ${a.status}
                      </span>
                    </div>
                    <div style="font-family: monospace; font-size: 12px; color: var(--text-secondary);">${a.time}</div>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Night Choghadiya -->
            <div>
              <div style="font-weight: 700; color: var(--purple-300); margin-bottom: 8px; font-size: var(--text-sm);">
                🌙 Night Choghadiya (रात का चौघड़िया)
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${t.choghadiya.night.map(a=>`
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border-left: 3px solid ${a.status==="Auspicious"?"#10B981":a.status==="Moderate"?"#F59E0B":"#EF4444"};">
                    <div>
                      <strong>${a.name} (${a.nameHi})</strong>
                      <span style="font-size: 11px; margin-left: 6px; color: ${a.status==="Auspicious"?"#10B981":a.status==="Moderate"?"#F59E0B":"#EF4444"}; font-weight: 600;">
                        ${a.status}
                      </span>
                    </div>
                    <div style="font-family: monospace; font-size: 12px; color: var(--text-secondary);">${a.time}</div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- 24 Planetary Horas -->
        <div class="glass-card">
          <h3 class="card-title"><span>🪐 24 Planetary Horas (होरा चक्र)</span></h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;">
            ${t.horas.map(a=>`
              <div style="padding: 8px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-secondary); border-radius: 6px; text-align: center;">
                <div style="font-size: 10px; color: var(--text-tertiary);">Hora ${a.hour}</div>
                <div style="font-weight: 700; color: ${a.nature==="Benefic"?"#10B981":"var(--gold-400)"}; font-size: 12px;">
                  ${a.lord}
                </div>
                <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">${a.time}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `,(o=document.getElementById("panchang-date-input"))==null||o.addEventListener("change",a=>{s=a.target.value,n()});const i=document.getElementById("panchang-place-input"),r=a=>{const d=g(a);d&&(e=d,n())};i==null||i.addEventListener("input",a=>r(a.target.value)),i==null||i.addEventListener("change",a=>r(a.target.value))}n()}export{f as renderPanchangPage};
