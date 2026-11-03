import{c as A}from"./panchang-gcc3KLuc.js";import"./ephemeris-XGObF-IA.js";const p=[{id:"vivah",name:"Vivah (Marriage)",nameHi:"विवाह मुहूर्त",icon:"💍",favorableNakshatras:["Rohini","Mrigashira","Magha","Uttara Phalguni","Hasta","Swati","Anuradha","Moola","Uttara Ashadha","Uttara Bhadrapada","Revati"],prohibitedTithis:["Chaturthi","Chaturdashi","Amavasya","Navami"],favorableDays:["Monday","Wednesday","Thursday","Friday"],advice:"Ensure Jupiter and Venus are not combust (Tara Asta). Avoid Bhadra and Rahu Kaal."},{id:"griha_pravesh",name:"Griha Pravesh (Housewarming)",nameHi:"गृह प्रवेश मुहूर्त",icon:"🏡",favorableNakshatras:["Rohini","Mrigashira","Uttara Phalguni","Chitra","Anuradha","Uttara Ashadha","Uttara Bhadrapada","Revati"],prohibitedTithis:["Amavasya","Purnima","Chaturthi","Navami","Chaturdashi"],favorableDays:["Monday","Wednesday","Thursday","Friday"],advice:"Perform Vastu Shanti and Navagraha Homa prior to entering the new sanctum."},{id:"business",name:"Business Launch (Vyapar Aarambh)",nameHi:"व्यापार आरम्भ मुहूर्त",icon:"💼",favorableNakshatras:["Ashwini","Pushya","Hasta","Chitra","Anuradha","Revati","Shravana"],prohibitedTithis:["Rikta Tithis (4, 9, 14)","Amavasya"],favorableDays:["Wednesday","Thursday","Friday"],advice:"Initiate paperwork during Labh or Amrit Choghadiya. Keep Kuber or Sri Yantra in reception."},{id:"vehicle",name:"Vehicle Purchase (Vahan Kharid)",nameHi:"वाहन क्रय मुहूर्त",icon:"🚗",favorableNakshatras:["Ashwini","Rohini","Punarvasu","Pushya","Hasta","Swati","Shravana"],prohibitedTithis:["Amavasya","Chaturthi","Navami","Chaturdashi"],favorableDays:["Monday","Wednesday","Thursday","Friday","Sunday"],advice:"Avoid Saturday for personal vehicles unless specifically advised. Draw Swastik with vermillion."},{id:"property",name:"Property Purchase (Bhoomi / Makan)",nameHi:"सम्पत्ति क्रय मुहूर्त",icon:"🏢",favorableNakshatras:["Mrigashira","Punarvasu","Magha","Ashlesha","Visakha","Moola","Revati"],prohibitedTithis:["Amavasya","Rikta Tithis"],favorableDays:["Thursday","Friday"],advice:"Verify registry during Shubh or Char Choghadiya under strong Mars and Saturn support."},{id:"namkaran",name:"Namkaran (Naming Ceremony)",nameHi:"नामकरण संस्कार",icon:"👶",favorableNakshatras:["Ashwini","Rohini","Mrigashira","Punarvasu","Pushya","Hasta","Chitra","Anuradha","Shravana","Dhanishta","Shatabhisha","Uttara Bhadrapada","Revati"],prohibitedTithis:["Chaturthi","Navami","Chaturdashi","Amavasya"],favorableDays:["Monday","Wednesday","Thursday","Friday"],advice:"Usually solemnized on 11th, 12th, or 101st day after infant birth."}];function $(l,r,n=7,o=28.6139,e=77.209,v=5.5){const a=p.find(h=>h.id===l)||p[0],d=[],u=new Date(r);for(let h=0;h<n;h++){const y=new Date(u);y.setDate(u.getDate()+h);const m=y.toISOString().split("T")[0],t=A(m,o,e,v),g=t.nakshatra.name,f=t.tithi.name,b=t.weekday,x=a.favorableNakshatras.includes(g),w=a.prohibitedTithis.includes(f),k=a.favorableDays.includes(b);let i=50;x&&(i+=30),k&&(i+=15),w&&(i-=40),t.yoga.nature==="Auspicious"&&(i+=10),t.karana.nature==="Movable"&&(i+=5),i=Math.max(10,Math.min(100,i));const c=[];t.muhurtas.abhijit&&!t.muhurtas.abhijit.includes("Not observed")&&c.push({name:"Abhijit Muhurta (Vijay)",time:t.muhurtas.abhijit,type:"Best"}),t.choghadiya.day.forEach(s=>{(s.quality==="Best"||s.quality==="Good")&&c.push({name:`${s.name} Choghadiya (${s.nameHi})`,time:s.time,type:s.quality})}),d.push({date:m,weekday:t.weekday,weekdayHi:t.weekdayHi,tithi:`${t.tithi.name} (${t.tithi.nameHi})`,nakshatra:`${t.nakshatra.name} (${t.nakshatra.nameHi})`,score:i,status:i>=75?"Highly Auspicious (अत्यंत शुभ)":i>=50?"Moderate (मध्यम)":"Inauspicious (वर्ज्य)",color:i>=75?"#10B981":i>=50?"#F59E0B":"#EF4444",rahuKaal:t.muhurtas.rahuKaal,auspiciousSlots:c,advice:a.advice})}return{activity:a,results:d}}function T(l){let r="vivah",n=new Date().toISOString().split("T")[0];function o(){var v;const e=$(r,n,7);l.innerHTML=`
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
          ${p.map(a=>`
            <button class="btn ${a.id===r?"btn-primary":"btn-secondary"} muhurta-act-btn" data-act="${a.id}" style="font-size: var(--text-xs);">
              ${a.icon} ${a.name}
            </button>
          `).join("")}
        </div>

        <!-- Settings Bar -->
        <div class="glass-card" style="margin-bottom: var(--space-8); padding: var(--space-4);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);">
            <div>
              <strong style="color: var(--gold-400);">${e.activity.name} (${e.activity.nameHi})</strong>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${e.activity.advice}</div>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <label style="font-size: var(--text-xs); color: var(--text-secondary);">Start From:</label>
              <input type="date" id="m-start-date" class="form-input" value="${n}" style="width: auto; padding: 4px 10px; font-size: 12px;" />
            </div>
          </div>
        </div>

        <!-- 7-Day Muhurta Cards -->
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          ${e.results.map(a=>`
            <div class="glass-card" style="border-left: 4px solid ${a.color};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-3);">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: var(--text-lg); font-weight: 800; color: #FFF;">${a.date}</span>
                    <span style="font-size: var(--text-sm); color: var(--gold-400); font-weight: 600;">(${a.weekday} - ${a.weekdayHi})</span>
                    <span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: ${a.color}22; color: ${a.color}; font-weight: 700; border: 1px solid ${a.color};">
                      ${a.status}
                    </span>
                  </div>
                  <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">
                    Tithi: <strong style="color: var(--text-primary);">${a.tithi}</strong> &bull; Nakshatra: <strong style="color: var(--text-primary);">${a.nakshatra}</strong>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: var(--text-xl); font-weight: 900; color: ${a.color};">${a.score}%</div>
                  <div style="font-size: 10px; color: var(--text-tertiary);">Auspicious Score</div>
                </div>
              </div>

              <!-- Recommended Time Slots -->
              <div style="border-top: 1px solid var(--border-secondary); padding-top: var(--space-3); margin-top: var(--space-2);">
                <div style="font-size: 11px; font-weight: 700; color: var(--gold-400); margin-bottom: 6px;">
                  Recommended Auspicious Windows for this date:
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${a.auspiciousSlots.map(d=>`
                    <div style="padding: 4px 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 11px;">
                      <span style="color: #10B981; font-weight: 600;">${d.name}:</span>
                      <span style="font-family: monospace; color: #E2E8F0; margin-left: 4px;">${d.time}</span>
                    </div>
                  `).join("")}
                </div>
                <div style="margin-top: 6px; font-size: 10px; color: #EF4444;">
                  Avoid Rahu Kaal: <strong>${a.rahuKaal}</strong>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `,l.querySelectorAll(".muhurta-act-btn").forEach(a=>{a.addEventListener("click",()=>{r=a.getAttribute("data-act"),o()})}),(v=document.getElementById("m-start-date"))==null||v.addEventListener("change",a=>{n=a.target.value,o()})}o()}export{T as renderMuhurtaPage};
