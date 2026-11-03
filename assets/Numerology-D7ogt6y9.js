import{g as b,a as y}from"./calculator-Dt1xjC0g.js";import{e as o}from"./escapeHtml-6fqo2KgN.js";import"./index-Bw9TiSIN.js";function $(c){let n="Supreeth Thakur",l="1995-10-24",d="+91 901 908 8160";function p(){var g,v;const e=b(n,l,d);c.innerHTML=`
      <div class="numerology-page">
        <!-- Header -->
        <div style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            🔢 Lo Shu Grid, Chaldean & Vedic Numerology
          </h2>
          <p style="color: var(--text-secondary); font-size: var(--text-sm);">
            Decode your Mulank, Bhagyank, Lo Shu energy planes, mobile vibration & name spelling corrections.
          </p>
        </div>

        <!-- Input Form -->
        <div class="glass-card" style="margin-bottom: var(--space-8);">
          <h3 class="card-title"><span>✍️ Enter Details</span></h3>
          <form id="numerology-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" id="num-name" class="form-input" value="${o(n)}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input type="date" id="num-date" class="form-input" value="${o(l)}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Phone Number</label>
                <input type="text" id="num-phone" class="form-input" value="${o(d)}" placeholder="+91 901 908 8160" />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="padding: var(--space-3) var(--space-6);">
                ⚡ Calculate Numerology Profile
              </button>
            </div>
          </form>
        </div>

        <!-- Core Numbers Grid -->
        <div class="grid-3" style="margin-bottom: var(--space-8);">
          <!-- Mulank -->
          <div class="glass-card" style="text-align: center; border-top: 3px solid var(--gold-400);">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Mulank / Driver (मूलांक)</div>
            <div style="font-size: 3.5rem; font-weight: 900; color: var(--gold-400); line-height: 1.1; margin: 4px 0;">
              ${e.mulank.number}
            </div>
            <div style="font-size: var(--text-base); font-weight: 700; color: #FFF;">
              Ruled by ${e.mulank.planet} (${e.mulank.planetHi})
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
              Nature: ${e.mulank.nature}
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: var(--gold-300);">
              Lucky Gem: <strong>${e.mulank.gem}</strong> &bull; Lucky Days: <strong>${e.mulank.days}</strong>
            </div>
          </div>

          <!-- Bhagyank -->
          <div class="glass-card" style="text-align: center; border-top: 3px solid #AD6FFF;">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Bhagyank / Destiny (भाग्यांक)</div>
            <div style="font-size: 3.5rem; font-weight: 900; color: #AD6FFF; line-height: 1.1; margin: 4px 0;">
              ${e.bhagyank.number}
            </div>
            <div style="font-size: var(--text-base); font-weight: 700; color: #FFF;">
              Ruled by ${e.bhagyank.planet} (${e.bhagyank.planetHi})
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
              Life Purpose: ${e.bhagyank.nature}
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: var(--gold-300);">
              Lucky Colors: <strong>${e.bhagyank.colors}</strong>
            </div>
          </div>

          <!-- Name Number -->
          <div class="glass-card" style="text-align: center; border-top: 3px solid #10B981;">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Name Number (नामांक)</div>
            <div style="font-size: 3.5rem; font-weight: 900; color: #10B981; line-height: 1.1; margin: 4px 0;">
              ${e.nameNumber.chaldeanSingle}
            </div>
            <div style="font-size: var(--text-base); font-weight: 700; color: #FFF;">
              Chaldean Compound: ${e.nameNumber.chaldeanCompound}
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
              Soul Urge (Vowels): <strong>${e.nameNumber.soulUrge}</strong> &bull; Personality: <strong>${e.nameNumber.personality}</strong>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: ${e.nameNumber.isHarmonious?"#10B981":"#EF4444"}; font-weight: 600;">
              ${e.nameNumber.isHarmonious?"✓ Highly Harmonious with Birth Energy":"⚠️ Clashes with Mulank/Bhagyank"}
            </div>
          </div>
        </div>

        <!-- Lo Shu Grid & Planes Section -->
        <div class="grid-2" style="margin-bottom: var(--space-8);">
          <!-- Lo Shu 3x3 Visual Matrix -->
          <div class="glass-card" style="text-align: center;">
            <h3 class="card-title" style="justify-content: center;"><span>🧩 Sacred Lo Shu Grid (3×3)</span></h3>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-4);">
              Numbers present in your birthdate create energetic vortexes:
            </p>

            <div style="display: grid; grid-template-columns: repeat(3, 85px); grid-template-rows: repeat(3, 85px); gap: 10px; justify-content: center; margin: 0 auto var(--space-4);">
              ${e.loShu.grid.map((t,r)=>t.map((i,s)=>{const m=[[4,9,2],[3,5,7],[8,1,6]][r][s],a=i>0;return`
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 10px; background: ${a?"rgba(218,165,32,0.18)":"rgba(255,255,255,0.02)"}; border: 1.5px solid ${a?"var(--gold-500)":"rgba(255,255,255,0.08)"}; box-shadow: ${a?"0 0 12px rgba(218,165,32,0.25)":"none"};">
                      <div style="font-size: 1.8rem; font-weight: 900; color: ${a?"var(--gold-400)":"#475569"};">
                        ${a?String(m).repeat(i):"-"}
                      </div>
                      <div style="font-size: 10px; color: var(--text-tertiary);">Slot ${m}</div>
                    </div>
                  `}).join("")).join("")}
            </div>

            <!-- Missing Numbers Remedies -->
            <div style="text-align: left; margin-top: var(--space-4); border-top: 1px solid var(--border-secondary); padding-top: var(--space-3);">
              <div style="font-size: 12px; font-weight: 700; color: var(--gold-400); margin-bottom: 6px;">Remedies for Missing Numbers:</div>
              <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--text-secondary);">
                ${e.loShu.missingNumbers.map(t=>`
                  <div><strong style="color: var(--text-primary);">Number ${t.number} (${t.planet}):</strong> ${t.remedy}</div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Lo Shu Planes of Strength -->
          <div class="glass-card">
            <h3 class="card-title"><span>⚡ Lo Shu Planes of Manifestation</span></h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${e.loShu.planes.map(t=>`
                <div style="padding: 10px 12px; background: ${t.active?"rgba(16, 185, 129, 0.08)":"rgba(255,255,255,0.02)"}; border-left: 3px solid ${t.active?"#10B981":"#64748B"}; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: ${t.active?"#FFF":"var(--text-tertiary)"}; font-size: var(--text-sm);">
                      ${t.name} (${t.hi})
                    </span>
                    <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 600; background: ${t.active?"rgba(16, 185, 129, 0.2)":"rgba(255,255,255,0.05)"}; color: ${t.active?"#10B981":"var(--text-tertiary)"};">
                      ${t.active?"ACTIVE (पूर्ण)":"Incomplete"}
                    </span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">
                    ${t.desc}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Mobile Phone Number Analysis Card -->
        ${e.mobile?`
          <div class="glass-card" style="border: ${e.mobile.isMasterVip?"1.5px solid var(--gold-400)":e.mobile.isSuitable?"1px solid var(--border-primary)":"1.5px solid #EF4444"}; margin-bottom: var(--space-8);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4);">
              <div>
                <h3 class="card-title" style="margin: 0;">
                  <span>📱 Mobile Number Numerology: ${e.mobile.phoneNumber}</span>
                </h3>
                <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: 2px;">
                  Comprehensive Shubh/Ashubh vibration, compatibility with Mulank & Bhagyank, and best suitable number blueprint.
                </div>
              </div>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                ${e.mobile.isMasterVip?`
                  <span style="padding: 4px 12px; border-radius: 9999px; background: rgba(218,165,32,0.2); color: var(--gold-400); border: 1px solid var(--gold-500); font-weight: 800; font-size: var(--text-xs);">
                    👑 MASTER VIP NUMBER (+91 901 908 8160)
                  </span>
                `:""}
                <span style="padding: 4px 12px; border-radius: 9999px; font-weight: 800; font-size: var(--text-xs); background: ${e.mobile.isSuitable?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)"}; color: ${e.mobile.isSuitable?"#10B981":"#EF4444"}; border: 1px solid ${e.mobile.isSuitable?"#10B981":"#EF4444"};">
                  ${e.mobile.shubhStatus}
                </span>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid-4" style="margin-bottom: var(--space-4); text-align: center; gap: 10px;">
              <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-size: 11px; color: var(--text-tertiary);">Compound Total (संयुक्त योग)</div>
                <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--gold-400);">${e.mobile.compoundSum}</div>
              </div>
              <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-size: 11px; color: var(--text-tertiary);">Single Root (एकल अंक)</div>
                <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--gold-400);">${e.mobile.singleNumber} <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">(${e.mobile.rulingPlanetHi})</span></div>
              </div>
              <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-size: 11px; color: var(--text-tertiary);">Mulank Relation (मूलांक संबंध)</div>
                <div style="font-size: var(--text-sm); font-weight: 700; margin-top: 6px; color: ${e.mobile.mulankRelation.includes("शत्रु")?"#EF4444":"#10B981"};">${e.mobile.mulankRelation}</div>
              </div>
              <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-size: 11px; color: var(--text-tertiary);">Bhagyank Relation (भाग्यांक संबंध)</div>
                <div style="font-size: var(--text-sm); font-weight: 700; margin-top: 6px; color: ${e.mobile.bhagyankRelation.includes("शत्रु")?"#EF4444":"#10B981"};">${e.mobile.bhagyankRelation}</div>
              </div>
            </div>

            <!-- Suitability Verdict Alert -->
            ${e.mobile.isSuitable?`
              <div style="background: rgba(16,185,129,0.1); border: 1px solid #10B981; border-radius: 8px; padding: 10px 14px; margin-bottom: var(--space-4); font-size: var(--text-xs); color: #6EE7B7;">
                ✓ <strong>अनुकूलता प्रमाण:</strong> यह मोबाइल नंबर आपके मूलांक (${e.mulank.number}) व भाग्यांक (${e.bhagyank.number}) के पूर्ण सामंजस्य में है और प्रगति व संचार में सहायक है।
              </div>
            `:`
              <div style="background: rgba(239,68,68,0.1); border: 1.5px solid #EF4444; border-radius: 8px; padding: 14px; margin-bottom: var(--space-4);">
                <div style="display: flex; align-items: center; gap: 8px; color: #EF4444; font-weight: 800; font-size: var(--text-sm);">
                  <span>⚠️</span>
                  <span>वर्तमान नंबर आपके लिए अनुकूल नहीं है (Why Current Number is Not Suitable):</span>
                </div>
                <ul style="margin: 8px 0 0 20px; padding: 0; color: #FCA5A5; font-size: var(--text-xs); line-height: 1.6;">
                  ${e.mobile.suitabilityReasons.map(t=>`<li>${o(t)}</li>`).join("")}
                </ul>
                <div style="margin-top: 8px; font-size: var(--text-xs); color: #F87171; font-weight: 600;">
                  💡 <strong>परामर्श:</strong> निरंतर व्यापारिक बाधाओं, विलंब या ऊर्जा क्षरण से बचने हेतु नीचे दिए गए "सर्वोत्तम नए मोबाइल नंबर ब्लूप्रिंट" अनुसार नया सिम कार्ड लें, अथवा नीचे दिए गए तात्कालिक वॉलपेपर व कवर यंत्र का उपाय करें।
                </div>
              </div>
            `}

            <!-- Ending Digit & Key Pairs -->
            <div class="grid-2" style="margin-bottom: var(--space-4); gap: 12px;">
              <div style="padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #FFF; font-size: var(--text-xs);">अंतिम अंक (Ending Digit): [ ${e.mobile.endingDigit.digit} ]</strong>
                  <span style="font-weight: 700; font-size: 11px; color: ${e.mobile.endingDigit.status.includes("शुभ")?"#10B981":"#EF4444"};">${e.mobile.endingDigit.status}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">${e.mobile.endingDigit.meaning}</div>
                <div style="margin-top: 8px; font-size: 10.5px; color: var(--text-tertiary); border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 6px;">
                  <strong style="color: #10B981;">शुभ अंत अंक:</strong> [1, 5, 6] &bull; <strong style="color: #EF4444;">वर्जित अंत अंक:</strong> [4, 8, 0]
                </div>
              </div>

              <div style="padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;">
                <strong style="color: #FFF; font-size: var(--text-xs); display: block; margin-bottom: 6px;">आंतरिक अंक युतियां (Key Pairs):</strong>
                ${e.mobile.keyPairs.length>0?`
                  <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">
                    ${e.mobile.keyPairs.map(t=>`
                      <div style="margin-bottom: 4px;">
                        <span style="font-weight: 700; color: ${t.type==="shubh"?"#10B981":t.type==="ashubh"?"#EF4444":"var(--gold-400)"}">${t.pair}:</span> 
                        ${t.desc}
                      </div>
                    `).join("")}
                  </div>
                `:`
                  <div style="font-size: 11px; color: var(--text-tertiary);">संख्या में कोई गंभीर दोषपूर्ण अथवा विशिष्ट युति नहीं है; ऊर्जा संतुलित व सामान्य है।</div>
                `}
                ${e.mobile.excessiveDigits.length>0?`
                  <div style="margin-top: 6px; font-size: 10.5px; color: #EF4444; border-top: 1px dashed rgba(239,68,68,0.3); padding-top: 4px;">
                    ⚠️ ${e.mobile.excessiveDigits.join(" ")}
                  </div>
                `:""}
              </div>
            </div>

            <!-- Best Suitable Mobile Number Generator & Blueprint -->
            <div style="background: rgba(218,165,32,0.06); border: 1.5px solid var(--gold-500); border-radius: 8px; padding: 16px; margin-bottom: var(--space-4);">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: var(--text-sm); color: var(--gold-400); font-weight: 800; display: flex; align-items: center; gap: 6px;">
                  <span>🎯</span> सर्वोत्तम अनुकूल नए मोबाइल नंबर का चयन (Best Suitable SIM Blueprint)
                </h4>
                <span style="font-size: 11px; color: var(--text-tertiary);">Tailored for Mulank ${e.mulank.number} & Bhagyank ${e.bhagyank.number}</span>
              </div>

              <!-- Top Targets Grid -->
              <div class="grid-3" style="gap: 10px; margin-bottom: 12px;">
                <div style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(218,165,32,0.2);">
                  <div style="font-size: 10.5px; color: var(--text-tertiary);">प्रधान शुभ एकल अंक (Prime Single)</div>
                  <div style="font-size: var(--text-lg); font-weight: 800; color: var(--gold-400); margin-top: 2px;">
                    ${e.mobile.suggestions.primeSingle} <span style="font-size: 12px; color: var(--text-secondary);">(${e.mobile.suggestions.primeSinglePlanetHi})</span>
                  </div>
                </div>
                <div style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(218,165,32,0.2);">
                  <div style="font-size: 10.5px; color: var(--text-tertiary);">सहायक शुभ एकल अंक (Secondary)</div>
                  <div style="font-size: var(--text-lg); font-weight: 800; color: var(--gold-400); margin-top: 2px;">
                    ${e.mobile.suggestions.secondarySingle} <span style="font-size: 12px; color: var(--text-secondary);">(${e.mobile.suggestions.secondarySinglePlanetHi})</span>
                  </div>
                </div>
                <div style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(218,165,32,0.2);">
                  <div style="font-size: 10.5px; color: var(--text-tertiary);">सर्वश्रेष्ठ अंतिम अंक (Best Endings)</div>
                  <div style="font-size: var(--text-lg); font-weight: 800; color: #10B981; margin-top: 2px;">
                    [ ${e.mobile.suggestions.recommendedEndings.join(", ")} ]
                  </div>
                </div>
              </div>

              <!-- Royal Compound Sums -->
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 12px;">
                <strong style="color: var(--gold-300); font-size: 11px; display: block; margin-bottom: 6px;">
                  👑 सर्वोत्तम संयुक्त योग (Target Royal Compound Sums & Esoteric Meanings):
                </strong>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px;">
                  ${e.mobile.suggestions.recommendedCompounds.map(t=>`
                    <div style="background: rgba(0,0,0,0.25); padding: 6px 10px; border-radius: 4px; font-size: 10.5px;">
                      <span style="font-weight: 800; color: var(--gold-400); font-size: 12px;">${t.sum}</span>: 
                      <span style="color: var(--text-secondary);">${t.meaning}</span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- 3 Ready-to-Pick SIM Templates -->
              <strong style="color: var(--gold-300); font-size: 11px; display: block; margin-bottom: 6px;">
                📋 ३ विशिष्ट रेडी-टू-पिक सिम पैटर्न (3 Ready-to-Pick SIM Blueprints):
              </strong>
              <div class="grid-3" style="gap: 10px; margin-bottom: 12px;">
                ${e.mobile.suggestions.sampleTemplates.map(t=>`
                  <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(218,165,32,0.25); border-radius: 6px; padding: 10px; font-size: 11px; line-height: 1.5;">
                    <div style="font-weight: 700; color: var(--gold-400); font-size: 11.5px; margin-bottom: 4px;">${t.category}</div>
                    <div style="font-family: monospace; font-size: 13px; font-weight: 800; color: #FFF; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; letter-spacing: 0.5px; margin-bottom: 4px;">
                      ${t.pattern}
                    </div>
                    <div style="color: var(--text-secondary); font-size: 10.5px;"><strong>लक्ष्य योग:</strong> ${t.targetSum}</div>
                    <div style="color: var(--text-tertiary); font-size: 10px; margin-top: 2px;"><strong>उपयोग:</strong> ${t.impact}</div>
                  </div>
                `).join("")}
              </div>

              <!-- 5-Point SIM Checklist -->
              <div style="background: rgba(0,0,0,0.2); padding: 10px 14px; border-radius: 6px; border-left: 3px solid var(--gold-400); font-size: 10.5px; color: var(--text-secondary); line-height: 1.6;">
                <strong style="color: var(--gold-300);">दूरसंचार स्टोर (SIM Store) पर नंबर लेते समय ५ स्वर्णिम नियम:</strong>
                <ol style="margin: 4px 0 0 18px; padding: 0;">
                  ${e.mobile.suggestions.simBuyingChecklist.map(t=>`<li>${t.replace(/^[१२३४५]\.\s*/,"")}</li>`).join("")}
                </ol>
              </div>
            </div>

            <!-- Instant Compensatory Remedies -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 14px; margin-bottom: var(--space-4);">
              <h4 style="margin: 0 0 8px 0; font-size: var(--text-xs); color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.5px;">
                📱 तात्कालिक दोष निवारण उपाय (If You Cannot Change SIM Immediately)
              </h4>
              <div class="grid-2" style="gap: 10px; font-size: 11px; margin-bottom: 8px;">
                <div><strong style="color: #FFF;">वॉलपेपर उपाय:</strong> <span style="color: var(--text-secondary);">${e.mobile.remedies.wallpaper}</span></div>
                <div><strong style="color: #FFF;">बैक कवर रंग:</strong> <span style="color: var(--text-secondary);">${e.mobile.remedies.coverColor}</span></div>
              </div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
                <strong style="color: #FFF;">🔯 भोजपत्र यंत्र उपाय:</strong> ${e.mobile.remedies.numericalYantra}
              </div>
              <div style="font-size: 11px; color: var(--text-secondary);">
                <strong style="color: #FFF;">📞 कॉल आरंभ मंत्र:</strong> ${e.mobile.remedies.callingMantra}
              </div>
            </div>

            <!-- Interactive Live Candidate Number Tester -->
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--gold-500); border-radius: 8px; padding: 14px;">
              <h4 style="margin: 0 0 6px 0; font-size: var(--text-sm); color: var(--gold-400); font-weight: 700;">
                🔍 नए संभावित नंबर की त्वरित जांच (Test a Candidate SIM Number Before Buying)
              </h4>
              <p style="font-size: 11px; color: var(--text-secondary); margin: 0 0 10px 0;">
                यदि आप नया नंबर लेने जा रहे हैं, तो उसका १० अंकों का नंबर यहाँ दर्ज करें और तुरंत जांचें कि वह आपके मूलांक (${e.mulank.number}) व भाग्यांक (${e.bhagyank.number}) के अनुकूल है या नहीं।
              </p>
              <div style="display: flex; gap: 8px; max-width: 450px;">
                <input type="text" id="candidate-phone-input" class="form-input" placeholder="e.g. 9812345678" style="flex: 1;" />
                <button type="button" id="btn-check-candidate" class="btn btn-secondary" style="font-weight: 700; white-space: nowrap;">
                  जांचें (Verify)
                </button>
              </div>
              <div id="candidate-result-box" style="margin-top: 10px; display: none;"></div>
            </div>

          </div>
        `:""}
      </div>
    `,(g=document.getElementById("btn-check-candidate"))==null||g.addEventListener("click",()=>{var s;const t=(s=document.getElementById("candidate-phone-input"))==null?void 0:s.value,r=document.getElementById("candidate-result-box");if(!r)return;if(!t||t.replace(/[^0-9]/g,"").length<7){r.style.display="block",r.innerHTML='<div style="padding: 8px 12px; background: rgba(239,68,68,0.1); border: 1px solid #EF4444; border-radius: 6px; color: #F87171; font-size: 11px;">कृपया कम से कम ७ से १० अंकों का मोबाइल नंबर दर्ज करें।</div>';return}const i=y(t,e.mulank.number,e.bhagyank.number);r.style.display="block",r.innerHTML=`
        <div style="padding: 12px; background: ${i.isSuitable?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)"}; border: 1px solid ${i.isSuitable?"#10B981":"#EF4444"}; border-radius: 6px; font-size: 11px; line-height: 1.5;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
            <strong style="color: #FFF; font-size: 13px;">नंबर: ${o(i.phoneNumber)}</strong>
            <span style="font-weight: 800; color: ${i.isSuitable?"#10B981":"#EF4444"}; font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.2);">
              ${i.isSuitable?"✅ अत्यंत शुभ व अनुकूल (Recommended to Buy)":"⚠️ प्रतिकूल / लेने से बचें (Not Suitable)"}
            </span>
          </div>
          <div style="display: flex; gap: 14px; margin-bottom: 6px; color: var(--text-secondary); flex-wrap: wrap;">
            <span><strong>संयुक्त योग:</strong> <span style="color: var(--gold-400); font-weight: 700;">${i.compoundSum}</span></span>
            <span><strong>एकल अंक:</strong> <span style="color: var(--gold-400); font-weight: 700;">${i.singleNumber} (${i.rulingPlanetHi})</span></span>
            <span><strong>अंतिम अंक:</strong> [ ${i.endingDigit.digit} ] (${i.endingDigit.status})</span>
          </div>
          <div style="color: ${i.isSuitable?"#6EE7B7":"#FCA5A5"}; font-size: 10.5px;">
            ${i.isSuitable?"यह नंबर आपके मूलांक व भाग्यांक से पूरी तरह मेल खाता है। आप इसे क्रय कर सकते हैं।":"दोष: "+i.suitabilityReasons.map(x=>o(x)).join(" • ")}
          </div>
        </div>
      `}),(v=document.getElementById("numerology-form"))==null||v.addEventListener("submit",t=>{t.preventDefault(),n=document.getElementById("num-name").value,l=document.getElementById("num-date").value,d=document.getElementById("num-phone").value,p()})}p()}export{$ as renderNumerologyPage};
