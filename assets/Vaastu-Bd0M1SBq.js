const c=[{id:"N",name:"North",nameHi:"उत्तर",deity:"Kuber (कुबेर)",element:"Water (जल)",color:"Blue / Light Green",energy:"New Opportunities, Wealth Flow, Abundance"},{id:"NNE",name:"North-North-East",nameHi:"उत्तर-उत्तर-पूर्व",deity:"Dhanvantari",element:"Water (जल)",color:"Light Blue",energy:"Health, Immunity, Physical Vitality"},{id:"NE",name:"North-East (Ishan)",nameHi:"ईशान कोण",deity:"Shiva (शिव)",element:"Water (जल)",color:"White / Sky Blue",energy:"Spiritual Clarity, Wisdom, Divine Connection"},{id:"ENE",name:"East-North-East",nameHi:"पूर्व-उत्तर-पूर्व",deity:"Jayant",element:"Air (वायु)",color:"Light Green",energy:"Joy, Recreation, Happiness, Rejuvenation"},{id:"E",name:"East",nameHi:"पूर्व",deity:"Indra (इन्द्र)",element:"Air (वायु)",color:"Green / Brown",energy:"Social Networking, Connections, Government Aid"},{id:"ESE",name:"East-South-East",nameHi:"पूर्व-दक्षिण-पूर्व",deity:"Anil",element:"Air (वायु)",color:"Light Yellowish Green",energy:"Mental Churning, Analytical Thinking"},{id:"SE",name:"South-East (Agneya)",nameHi:"आग्नेय कोण",deity:"Agni (अग्नि)",element:"Fire (अग्नि)",color:"Red, Orange, Pink",energy:"Cash Liquidity, Zeal, Passion, Fire Power"},{id:"SSE",name:"South-South-East",nameHi:"दक्षिण-दक्षिण-पूर्व",deity:"Pusha",element:"Fire (अग्नि)",color:"Orange / Warm White",energy:"Physical Strength, Self-Confidence, Will"},{id:"S",name:"South",nameHi:"दक्षिण",deity:"Yama (यम)",element:"Fire (अग्नि)",color:"Deep Red / Maroon",energy:"Fame, Relaxation, Recognition, Public Stature"},{id:"SSW",name:"South-South-West",nameHi:"दक्षिण-दक्षिण-पश्चिम",deity:"Gandharva",element:"Earth (पृथ्वी)",color:"Yellow",energy:"Disposal, Letting Go, Waste Management"},{id:"SW",name:"South-West (Nairritya)",nameHi:"नैऋत्य कोण",deity:"Nirriti / Pitrus",element:"Earth (पृथ्वी)",color:"Golden Yellow / Brown",energy:"Relationship Stability, Ancestral Grace, Skill Mastery"},{id:"WSW",name:"West-South-West",nameHi:"पश्चिम-दक्षिण-पश्चिम",deity:"Dauwarik",element:"Space (आकाश)",color:"White / Silver",energy:"Education, Savings, Knowledge Retention"},{id:"W",name:"West",nameHi:"पश्चिम",deity:"Varuna (वरुण)",element:"Space (आकाश)",color:"White / Grey",energy:"Gains, Profits, Wish Manifestation"},{id:"WNW",name:"West-North-West",nameHi:"पश्चिम-उत्तर-पश्चिम",deity:"Roga",element:"Space (आकाश)",color:"Light Grey",energy:"Detoxification, Emotional Release, Healing"},{id:"NW",name:"North-West (Vayavya)",nameHi:"वायव्य कोण",deity:"Vayu (वायु)",element:"Air / Space",color:"White / Cream",energy:"Support, Banking, Helpful People, Travel"},{id:"NNW",name:"North-North-West",nameHi:"उत्तर-उत्तर-पश्चिम",deity:"Soma",element:"Water (जल)",color:"White / Sky Blue",energy:"Attraction, Charisma, Marital Harmony"},{id:"CENTER",name:"Center (Brahmasthan)",nameHi:"ब्रह्मस्थान",deity:"Brahma (ब्रह्मा)",element:"Ether / Cosmic Void",color:"Clear / Open Space",energy:"Cosmic Prana, Life Balance, Harmony"}],m={mainEntrance:{name:"Main Entrance (मुख्य द्वार)",best:["N","NE","E","W"],moderate:["NW","SE"],bad:["SW","SSW","S"],remedyForBad:"Place a Brass/Lead strip beneath the threshold, hang energized Swastik or Panchmukhi Hanuman photo facing outwards, keep two plants flanking the entrance."},poojaRoom:{name:"Pooja Room (पूजा घर)",best:["NE","N","E"],moderate:["W"],bad:["SW","SE","SSW","S"],remedyForBad:"Strictly avoid temple under stairs or shared with bathroom wall. Install Ishan Yantra or copper Sri Yantra, light ghee lamp in North-East corner."},masterBedroom:{name:"Master Bedroom (प्रधान शयन कक्ष)",best:["SW","S","W"],moderate:["NNE","NW"],bad:["NE","SE"],remedyForBad:"Sleep with head strictly pointing South or East. If in NE/SE, keep a brass bowl with unrefined sea salt to absorb hyperactivity; avoid mirrors facing bed."},kitchen:{name:"Kitchen / Stove (रसोई घर)",best:["SE","NW"],moderate:["S","E"],bad:["NE","SW","N"],remedyForBad:"Kitchen in NE causes severe health & wealth loss: place green marble slab under cooking gas stove or wrap copper wire. Avoid black granite counters in SE."},livingRoom:{name:"Living Room (बैठक कक्ष)",best:["N","E","NW"],moderate:["W","NE"],bad:["SW"],remedyForBad:"Keep heavy sofa sets against South and West walls. Keep North and East open with light furniture and fresh indoor green plants."},toilet:{name:"Toilet / WC (शौचालय)",best:["SSW","WNW","ESE"],moderate:["NW","W"],bad:["NE","SW","SE","N","CENTER"],remedyForBad:"Toilet in NE or Brahmasthan is the gravest Vaastu defect: install stainless steel / copper / brass wire around the commode base, keep glass bowl with sea salt changed weekly."},staircase:{name:"Staircase (सीढ़ियाँ)",best:["S","SW","W"],moderate:["NW","SE"],bad:["NE","CENTER","N"],remedyForBad:"Paint walls in light yellow/cream, hang a brass bell or spherical crystal, ensure clockwise ascent when climbing stairs."},cashLocker:{name:"Cash Locker / Safe (तिजोरी)",best:["N","SW","W"],moderate:["E"],bad:["SE","NE","SSW"],remedyForBad:"Place safe against South wall opening towards North (Kuber direction). Place energized Kuber Yantra or silver coin inside locker."},undergroundTank:{name:"Underground Water Tank / Borewell (भूमिगत जल)",best:["NE","N","E"],moderate:["NNW"],bad:["SE","SW","S","CENTER"],remedyForBad:"Water in Fire (SE) or Earth (SW) causes fire-water clashes: surround the tank exterior with red/yellow boundary paint and keep Lord Varuna yantra nearby."}};function p(s){let a=100;const i=[],l=[],t=[];for(const[d,n]of Object.entries(s)){const o=m[d];o&&(o.best.includes(n)?l.push({room:o.name,direction:n,status:"Perfect Alignment (शुभ)",benefit:`Magnifies positive cosmic vibrations for ${o.name}.`}):o.moderate.includes(n)?(a-=5,l.push({room:o.name,direction:n,status:"Acceptable (सामान्य)",benefit:"Tolerable position with neutral effects."})):o.bad.includes(n)&&(a-=15,i.push({room:o.name,direction:n,severity:["NE","SW","CENTER"].includes(n)?"Critical Dosha":"Moderate Dosha",issue:`${o.name} in ${n} clashes with governing deities and elements.`,remedy:o.remedyForBad}),t.push({title:`Remedy for ${o.name} in ${n}`,step:o.remedyForBad})))}a=Math.max(10,Math.min(100,a));let r="",e="";return a>=85?(r="A+ (Excellent Vaastu Sanctuary)",e="#10B981"):a>=70?(r="B (Good with Minor Corrections)",e="#F59E0B"):a>=50?(r="C (Challenging - Remedial Action Urgently Recommended)",e="#E23D28"):(r="D (Severe Elemental Imbalance)",e="#EF4444"),{score:a,grade:r,color:e,strengths:l,issues:i,remedies:t,generalRemedies:["Maintain an open, light, and spotless North-East (Ishan) zone for divine blessings.","Keep the South-West (Nairritya) elevated and heaviest to ensure family stability.","Burn pure camphor (Karpura) in the evenings to clear negative electromagnetic stagnant energy.","Keep a sacred Tulsi plant in East or North-East and light a ghee lamp beside it daily."]}}function g(s){let a={mainEntrance:"NE",poojaRoom:"NE",masterBedroom:"SW",kitchen:"SE",livingRoom:"N",toilet:"SSW",staircase:"S",cashLocker:"N",undergroundTank:"NE"};const i=[{id:"N",label:"North (उत्तर - कुबेर)"},{id:"NNE",label:"NNE (स्वास्थ्य)"},{id:"NE",label:"North-East (ईशान - शिव)"},{id:"ENE",label:"ENE (आनन्द)"},{id:"E",label:"East (पूर्व - इन्द्र)"},{id:"ESE",label:"ESE (मंथन)"},{id:"SE",label:"South-East (आग्नेय - अग्नि)"},{id:"SSE",label:"SSE (बल)"},{id:"S",label:"South (दक्षिण - यम)"},{id:"SSW",label:"SSW (विसर्जन)"},{id:"SW",label:"South-West (नैऋत्य - पितृ/स्थिरता)"},{id:"WSW",label:"WSW (विद्या/बचत)"},{id:"W",label:"West (पश्चिम - वरुण)"},{id:"WNW",label:"WNW (अवसाद मुक्ति)"},{id:"NW",label:"North-West (वायव्य - वायु/सहयोग)"},{id:"NNW",label:"NNW (आकर्षण)"},{id:"CENTER",label:"Center (ब्रह्मस्थान)"}];function l(){var r;const t=p(a);s.innerHTML=`
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
        <div class="glass-card" style="margin-bottom: var(--space-8); border: 2px solid ${t.color}; text-align: center; padding: var(--space-6);">
          <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: var(--space-4);">
            <div>
              <div style="font-size: 3.5rem; font-weight: 900; color: ${t.color}; line-height: 1;">
                ${t.score}%
              </div>
              <div style="font-size: var(--text-sm); font-weight: 700; color: #FFF; margin-top: 4px;">
                Overall Vaastu Harmony Score
              </div>
            </div>
            <div>
              <div style="font-size: var(--text-xl); font-weight: 800; color: var(--gold-400);">
                Grade: ${t.grade}
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">
                ${t.issues.length===0?"Flawless Cosmic Alignment":`${t.issues.length} Potential Doshas Detected`}
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
                  ${i.map(e=>`<option value="${e.id}" ${a.mainEntrance===e.id?"selected":""}>${e.label}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🕉️ Pooja Room (पूजा घर)</label>
                <select id="v-poojaRoom" class="form-select">
                  ${i.map(e=>`<option value="${e.id}" ${a.poojaRoom===e.id?"selected":""}>${e.label}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🛏️ Master Bedroom (प्रधान शयन)</label>
                <select id="v-masterBedroom" class="form-select">
                  ${i.map(e=>`<option value="${e.id}" ${a.masterBedroom===e.id?"selected":""}>${e.label}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🍳 Kitchen / Stove (रसोई घर)</label>
                <select id="v-kitchen" class="form-select">
                  ${i.map(e=>`<option value="${e.id}" ${a.kitchen===e.id?"selected":""}>${e.label}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🛋️ Living Room (बैठक)</label>
                <select id="v-livingRoom" class="form-select">
                  ${i.map(e=>`<option value="${e.id}" ${a.livingRoom===e.id?"selected":""}>${e.label}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🚽 Toilet / WC (शौचालय)</label>
                <select id="v-toilet" class="form-select">
                  ${i.map(e=>`<option value="${e.id}" ${a.toilet===e.id?"selected":""}>${e.label}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">🪜 Staircase (सीढ़ियाँ)</label>
                <select id="v-staircase" class="form-select">
                  ${i.map(e=>`<option value="${e.id}" ${a.staircase===e.id?"selected":""}>${e.label}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">💰 Cash Locker / Safe (तिजोरी)</label>
                <select id="v-cashLocker" class="form-select">
                  ${i.map(e=>`<option value="${e.id}" ${a.cashLocker===e.id?"selected":""}>${e.label}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">💧 Underground Water / Borewell</label>
                <select id="v-undergroundTank" class="form-select">
                  ${i.map(e=>`<option value="${e.id}" ${a.undergroundTank===e.id?"selected":""}>${e.label}</option>`).join("")}
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
            ${t.issues.length===0?'<p style="color: #10B981; font-weight: 600;">No severe doshas detected! Your property aligns favorably with Vedic architecture.</p>':""}
            <div style="display: flex; flex-direction: column; gap: var(--space-4);">
              ${t.issues.map(e=>`
                <div style="padding: 12px; background: rgba(239, 68, 68, 0.06); border-left: 3px solid #EF4444; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong style="color: #EF4444; font-size: 13px;">${e.room} in ${e.direction}</strong>
                    <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(239,68,68,0.2); color: #EF4444; font-weight: 700;">${e.severity}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">${e.issue}</div>
                  <div style="font-size: 11px; color: var(--gold-400); background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; border: 1px solid rgba(218,165,32,0.2);">
                    <strong>Non-Demolition Remedy:</strong> ${e.remedy}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Positive Strengths -->
          <div class="glass-card">
            <h3 class="card-title"><span style="color: #10B981;">✨ Positive Alignments (${t.strengths.length})</span></h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${t.strengths.map(e=>`
                <div style="padding: 10px 12px; background: rgba(16, 185, 129, 0.05); border-left: 3px solid #10B981; border-radius: 6px;">
                  <div style="font-weight: 700; color: #FFF; font-size: 12px;">
                    ${e.room} &bull; ${e.direction} (${e.status})
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
                    ${e.benefit}
                  </div>
                </div>
              `).join("")}
            </div>

            <!-- General Sanatan Vastu Principles -->
            <div style="margin-top: var(--space-6); border-top: 1px solid var(--border-secondary); padding-top: var(--space-4);">
              <h4 style="font-size: var(--text-sm); font-weight: 700; color: var(--gold-400); margin-bottom: 6px;">
                Universal Sanatan Vedic Home Tips:
              </h4>
              <ul style="padding-left: 18px; font-size: 11px; color: var(--text-secondary); line-height: 1.6;">
                ${t.generalRemedies.map(e=>`<li>${e}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>

        <!-- 16 Zones Encyclopedia Cards -->
        <div class="glass-card">
          <h3 class="card-title"><span>🌐 16 MahaVastu Zones Reference</span></h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
            ${c.map(e=>`
              <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-secondary); border-radius: 8px;">
                <div style="font-weight: 700; font-size: 12px; color: var(--gold-400);">
                  ${e.name} (${e.nameHi})
                </div>
                <div style="font-size: 10px; color: var(--text-tertiary); margin: 2px 0;">
                  Deity: <strong>${e.deity}</strong> &bull; Element: <strong>${e.element}</strong>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.3;">
                  ${e.energy}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `,(r=document.getElementById("vaastu-form"))==null||r.addEventListener("submit",e=>{e.preventDefault(),a.mainEntrance=document.getElementById("v-mainEntrance").value,a.poojaRoom=document.getElementById("v-poojaRoom").value,a.masterBedroom=document.getElementById("v-masterBedroom").value,a.kitchen=document.getElementById("v-kitchen").value,a.livingRoom=document.getElementById("v-livingRoom").value,a.toilet=document.getElementById("v-toilet").value,a.staircase=document.getElementById("v-staircase").value,a.cashLocker=document.getElementById("v-cashLocker").value,a.undergroundTank=document.getElementById("v-undergroundTank").value,l()})}l()}export{g as renderVaastuPage};
