/**
 * AstroVeda - Advanced Numerology & Lo Shu Grid Page
 */

import { generateNumerologyProfile, analyzeMobileNumber } from '../engines/numerology/calculator.js';
import { escapeHtml } from '../components/reports/FullPatrikaReport.js';
import { store } from '../utils/store.js';

export function renderNumerologyPage(container) {
  let nameInput = 'Supreeth Thakur';
  let dateInput = '1995-10-24';
  let phoneInput = '+91 901 908 8160';

  function renderView() {
    const profile = generateNumerologyProfile(nameInput, dateInput, phoneInput);

    container.innerHTML = `
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
                <input type="text" id="num-name" class="form-input" value="${escapeHtml(nameInput)}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input type="date" id="num-date" class="form-input" value="${escapeHtml(dateInput)}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Phone Number</label>
                <input type="text" id="num-phone" class="form-input" value="${escapeHtml(phoneInput)}" placeholder="+91 901 908 8160" />
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
              ${profile.mulank.number}
            </div>
            <div style="font-size: var(--text-base); font-weight: 700; color: #FFF;">
              Ruled by ${profile.mulank.planet} (${profile.mulank.planetHi})
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
              Nature: ${profile.mulank.nature}
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: var(--gold-300);">
              Lucky Gem: <strong>${profile.mulank.gem}</strong> &bull; Lucky Days: <strong>${profile.mulank.days}</strong>
            </div>
          </div>

          <!-- Bhagyank -->
          <div class="glass-card" style="text-align: center; border-top: 3px solid #AD6FFF;">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Bhagyank / Destiny (भाग्यांक)</div>
            <div style="font-size: 3.5rem; font-weight: 900; color: #AD6FFF; line-height: 1.1; margin: 4px 0;">
              ${profile.bhagyank.number}
            </div>
            <div style="font-size: var(--text-base); font-weight: 700; color: #FFF;">
              Ruled by ${profile.bhagyank.planet} (${profile.bhagyank.planetHi})
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
              Life Purpose: ${profile.bhagyank.nature}
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: var(--gold-300);">
              Lucky Colors: <strong>${profile.bhagyank.colors}</strong>
            </div>
          </div>

          <!-- Name Number -->
          <div class="glass-card" style="text-align: center; border-top: 3px solid #10B981;">
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Name Number (नामांक)</div>
            <div style="font-size: 3.5rem; font-weight: 900; color: #10B981; line-height: 1.1; margin: 4px 0;">
              ${profile.nameNumber.chaldeanSingle}
            </div>
            <div style="font-size: var(--text-base); font-weight: 700; color: #FFF;">
              Chaldean Compound: ${profile.nameNumber.chaldeanCompound}
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
              Soul Urge (Vowels): <strong>${profile.nameNumber.soulUrge}</strong> &bull; Personality: <strong>${profile.nameNumber.personality}</strong>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: ${profile.nameNumber.isHarmonious ? '#10B981' : '#EF4444'}; font-weight: 600;">
              ${profile.nameNumber.isHarmonious ? '✓ Highly Harmonious with Birth Energy' : '⚠️ Clashes with Mulank/Bhagyank'}
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
              ${profile.loShu.grid.map((row, rIdx) => 
                row.map((count, cIdx) => {
                  const standardNums = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
                  const num = standardNums[rIdx][cIdx];
                  const isPresent = count > 0;
                  return `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 10px; background: ${isPresent ? 'rgba(218,165,32,0.18)' : 'rgba(255,255,255,0.02)'}; border: 1.5px solid ${isPresent ? 'var(--gold-500)' : 'rgba(255,255,255,0.08)'}; box-shadow: ${isPresent ? '0 0 12px rgba(218,165,32,0.25)' : 'none'};">
                      <div style="font-size: 1.8rem; font-weight: 900; color: ${isPresent ? 'var(--gold-400)' : '#475569'};">
                        ${isPresent ? String(num).repeat(count) : '-'}
                      </div>
                      <div style="font-size: 10px; color: var(--text-tertiary);">Slot ${num}</div>
                    </div>
                  `;
                }).join('')
              ).join('')}
            </div>

            <!-- Missing Numbers Remedies -->
            <div style="text-align: left; margin-top: var(--space-4); border-top: 1px solid var(--border-secondary); padding-top: var(--space-3);">
              <div style="font-size: 12px; font-weight: 700; color: var(--gold-400); margin-bottom: 6px;">Remedies for Missing Numbers:</div>
              <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--text-secondary);">
                ${profile.loShu.missingNumbers.map(m => `
                  <div><strong style="color: var(--text-primary);">Number ${m.number} (${m.planet}):</strong> ${m.remedy}</div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Lo Shu Planes of Strength -->
          <div class="glass-card">
            <h3 class="card-title"><span>⚡ Lo Shu Planes of Manifestation</span></h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${profile.loShu.planes.map(pl => `
                <div style="padding: 10px 12px; background: ${pl.active ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)'}; border-left: 3px solid ${pl.active ? '#10B981' : '#64748B'}; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: ${pl.active ? '#FFF' : 'var(--text-tertiary)'}; font-size: var(--text-sm);">
                      ${pl.name} (${pl.hi})
                    </span>
                    <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 600; background: ${pl.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}; color: ${pl.active ? '#10B981' : 'var(--text-tertiary)'};">
                      ${pl.active ? 'ACTIVE (पूर्ण)' : 'Incomplete'}
                    </span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">
                    ${pl.desc}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Mobile Phone Number Analysis Card -->
        ${profile.mobile ? `
          <div class="glass-card" style="border: ${profile.mobile.isMasterVip ? "1.5px solid var(--gold-400)" : (profile.mobile.isSuitable ? "1px solid var(--border-primary)" : "1.5px solid #EF4444")}; margin-bottom: var(--space-8);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4);">
              <div>
                <h3 class="card-title" style="margin: 0;">
                  <span>📱 Mobile Number Numerology: ${profile.mobile.phoneNumber}</span>
                </h3>
                <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: 2px;">
                  Comprehensive Shubh/Ashubh vibration, compatibility with Mulank & Bhagyank, and best suitable number blueprint.
                </div>
              </div>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                ${profile.mobile.isMasterVip ? `
                  <span style="padding: 4px 12px; border-radius: 9999px; background: rgba(218,165,32,0.2); color: var(--gold-400); border: 1px solid var(--gold-500); font-weight: 800; font-size: var(--text-xs);">
                    👑 MASTER VIP NUMBER (+91 901 908 8160)
                  </span>
                ` : ""}
                <span style="padding: 4px 12px; border-radius: 9999px; font-weight: 800; font-size: var(--text-xs); background: ${profile.mobile.isSuitable ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}; color: ${profile.mobile.isSuitable ? "#10B981" : "#EF4444"}; border: 1px solid ${profile.mobile.isSuitable ? "#10B981" : "#EF4444"};">
                  ${profile.mobile.shubhStatus}
                </span>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid-4" style="margin-bottom: var(--space-4); text-align: center; gap: 10px;">
              <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-size: 11px; color: var(--text-tertiary);">Compound Total (संयुक्त योग)</div>
                <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--gold-400);">${profile.mobile.compoundSum}</div>
              </div>
              <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-size: 11px; color: var(--text-tertiary);">Single Root (एकल अंक)</div>
                <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--gold-400);">${profile.mobile.singleNumber} <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">(${profile.mobile.rulingPlanetHi})</span></div>
              </div>
              <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-size: 11px; color: var(--text-tertiary);">Mulank Relation (मूलांक संबंध)</div>
                <div style="font-size: var(--text-sm); font-weight: 700; margin-top: 6px; color: ${profile.mobile.mulankRelation.includes("शत्रु") ? "#EF4444" : "#10B981"};">${profile.mobile.mulankRelation}</div>
              </div>
              <div style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-size: 11px; color: var(--text-tertiary);">Bhagyank Relation (भाग्यांक संबंध)</div>
                <div style="font-size: var(--text-sm); font-weight: 700; margin-top: 6px; color: ${profile.mobile.bhagyankRelation.includes("शत्रु") ? "#EF4444" : "#10B981"};">${profile.mobile.bhagyankRelation}</div>
              </div>
            </div>

            <!-- Suitability Verdict Alert -->
            ${!profile.mobile.isSuitable ? `
              <div style="background: rgba(239,68,68,0.1); border: 1.5px solid #EF4444; border-radius: 8px; padding: 14px; margin-bottom: var(--space-4);">
                <div style="display: flex; align-items: center; gap: 8px; color: #EF4444; font-weight: 800; font-size: var(--text-sm);">
                  <span>⚠️</span>
                  <span>वर्तमान नंबर आपके लिए अनुकूल नहीं है (Why Current Number is Not Suitable):</span>
                </div>
                <ul style="margin: 8px 0 0 20px; padding: 0; color: #FCA5A5; font-size: var(--text-xs); line-height: 1.6;">
                  ${profile.mobile.suitabilityReasons.map(r => `<li>${escapeHtml(r)}</li>`).join("")}
                </ul>
                <div style="margin-top: 8px; font-size: var(--text-xs); color: #F87171; font-weight: 600;">
                  💡 <strong>परामर्श:</strong> निरंतर व्यापारिक बाधाओं, विलंब या ऊर्जा क्षरण से बचने हेतु नीचे दिए गए "सर्वोत्तम नए मोबाइल नंबर ब्लूप्रिंट" अनुसार नया सिम कार्ड लें, अथवा नीचे दिए गए तात्कालिक वॉलपेपर व कवर यंत्र का उपाय करें।
                </div>
              </div>
            ` : `
              <div style="background: rgba(16,185,129,0.1); border: 1px solid #10B981; border-radius: 8px; padding: 10px 14px; margin-bottom: var(--space-4); font-size: var(--text-xs); color: #6EE7B7;">
                ✓ <strong>अनुकूलता प्रमाण:</strong> यह मोबाइल नंबर आपके मूलांक (${profile.mulank.number}) व भाग्यांक (${profile.bhagyank.number}) के पूर्ण सामंजस्य में है और प्रगति व संचार में सहायक है।
              </div>
            `}

            <!-- Ending Digit & Key Pairs -->
            <div class="grid-2" style="margin-bottom: var(--space-4); gap: 12px;">
              <div style="padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #FFF; font-size: var(--text-xs);">अंतिम अंक (Ending Digit): [ ${profile.mobile.endingDigit.digit} ]</strong>
                  <span style="font-weight: 700; font-size: 11px; color: ${profile.mobile.endingDigit.status.includes("शुभ") ? "#10B981" : "#EF4444"};">${profile.mobile.endingDigit.status}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">${profile.mobile.endingDigit.meaning}</div>
                <div style="margin-top: 8px; font-size: 10.5px; color: var(--text-tertiary); border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 6px;">
                  <strong style="color: #10B981;">शुभ अंत अंक:</strong> [1, 5, 6] &bull; <strong style="color: #EF4444;">वर्जित अंत अंक:</strong> [4, 8, 0]
                </div>
              </div>

              <div style="padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;">
                <strong style="color: #FFF; font-size: var(--text-xs); display: block; margin-bottom: 6px;">आंतरिक अंक युतियां (Key Pairs):</strong>
                ${profile.mobile.keyPairs.length > 0 ? `
                  <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">
                    ${profile.mobile.keyPairs.map(p => `
                      <div style="margin-bottom: 4px;">
                        <span style="font-weight: 700; color: ${p.type === "shubh" ? "#10B981" : (p.type === "ashubh" ? "#EF4444" : "var(--gold-400)")}">${p.pair}:</span> 
                        ${p.desc}
                      </div>
                    `).join("")}
                  </div>
                ` : `
                  <div style="font-size: 11px; color: var(--text-tertiary);">संख्या में कोई गंभीर दोषपूर्ण अथवा विशिष्ट युति नहीं है; ऊर्जा संतुलित व सामान्य है।</div>
                `}
                ${profile.mobile.excessiveDigits.length > 0 ? `
                  <div style="margin-top: 6px; font-size: 10.5px; color: #EF4444; border-top: 1px dashed rgba(239,68,68,0.3); padding-top: 4px;">
                    ⚠️ ${profile.mobile.excessiveDigits.join(" ")}
                  </div>
                ` : ""}
              </div>
            </div>

            <!-- Best Suitable Mobile Number Generator & Blueprint -->
            <div style="background: rgba(218,165,32,0.06); border: 1.5px solid var(--gold-500); border-radius: 8px; padding: 16px; margin-bottom: var(--space-4);">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: var(--text-sm); color: var(--gold-400); font-weight: 800; display: flex; align-items: center; gap: 6px;">
                  <span>🎯</span> सर्वोत्तम अनुकूल नए मोबाइल नंबर का चयन (Best Suitable SIM Blueprint)
                </h4>
                <span style="font-size: 11px; color: var(--text-tertiary);">Tailored for Mulank ${profile.mulank.number} & Bhagyank ${profile.bhagyank.number}</span>
              </div>

              <!-- Top Targets Grid -->
              <div class="grid-3" style="gap: 10px; margin-bottom: 12px;">
                <div style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(218,165,32,0.2);">
                  <div style="font-size: 10.5px; color: var(--text-tertiary);">प्रधान शुभ एकल अंक (Prime Single)</div>
                  <div style="font-size: var(--text-lg); font-weight: 800; color: var(--gold-400); margin-top: 2px;">
                    ${profile.mobile.suggestions.primeSingle} <span style="font-size: 12px; color: var(--text-secondary);">(${profile.mobile.suggestions.primeSinglePlanetHi})</span>
                  </div>
                </div>
                <div style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(218,165,32,0.2);">
                  <div style="font-size: 10.5px; color: var(--text-tertiary);">सहायक शुभ एकल अंक (Secondary)</div>
                  <div style="font-size: var(--text-lg); font-weight: 800; color: var(--gold-400); margin-top: 2px;">
                    ${profile.mobile.suggestions.secondarySingle} <span style="font-size: 12px; color: var(--text-secondary);">(${profile.mobile.suggestions.secondarySinglePlanetHi})</span>
                  </div>
                </div>
                <div style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(218,165,32,0.2);">
                  <div style="font-size: 10.5px; color: var(--text-tertiary);">सर्वश्रेष्ठ अंतिम अंक (Best Endings)</div>
                  <div style="font-size: var(--text-lg); font-weight: 800; color: #10B981; margin-top: 2px;">
                    [ ${profile.mobile.suggestions.recommendedEndings.join(", ")} ]
                  </div>
                </div>
              </div>

              <!-- Royal Compound Sums -->
              <div style="padding: 10px 14px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 12px;">
                <strong style="color: var(--gold-300); font-size: 11px; display: block; margin-bottom: 6px;">
                  👑 सर्वोत्तम संयुक्त योग (Target Royal Compound Sums & Esoteric Meanings):
                </strong>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px;">
                  ${profile.mobile.suggestions.recommendedCompounds.map(c => `
                    <div style="background: rgba(0,0,0,0.25); padding: 6px 10px; border-radius: 4px; font-size: 10.5px;">
                      <span style="font-weight: 800; color: var(--gold-400); font-size: 12px;">${c.sum}</span>: 
                      <span style="color: var(--text-secondary);">${c.meaning}</span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- 3 Ready-to-Pick SIM Templates -->
              <strong style="color: var(--gold-300); font-size: 11px; display: block; margin-bottom: 6px;">
                📋 ३ विशिष्ट रेडी-टू-पिक सिम पैटर्न (3 Ready-to-Pick SIM Blueprints):
              </strong>
              <div class="grid-3" style="gap: 10px; margin-bottom: 12px;">
                ${profile.mobile.suggestions.sampleTemplates.map(t => `
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
                  ${profile.mobile.suggestions.simBuyingChecklist.map(c => `<li>${c.replace(/^[१२३४५]\.\s*/, "")}</li>`).join("")}
                </ol>
              </div>
            </div>

            <!-- Instant Compensatory Remedies -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 14px; margin-bottom: var(--space-4);">
              <h4 style="margin: 0 0 8px 0; font-size: var(--text-xs); color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.5px;">
                📱 तात्कालिक दोष निवारण उपाय (If You Cannot Change SIM Immediately)
              </h4>
              <div class="grid-2" style="gap: 10px; font-size: 11px; margin-bottom: 8px;">
                <div><strong style="color: #FFF;">वॉलपेपर उपाय:</strong> <span style="color: var(--text-secondary);">${profile.mobile.remedies.wallpaper}</span></div>
                <div><strong style="color: #FFF;">बैक कवर रंग:</strong> <span style="color: var(--text-secondary);">${profile.mobile.remedies.coverColor}</span></div>
              </div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
                <strong style="color: #FFF;">🔯 भोजपत्र यंत्र उपाय:</strong> ${profile.mobile.remedies.numericalYantra}
              </div>
              <div style="font-size: 11px; color: var(--text-secondary);">
                <strong style="color: #FFF;">📞 कॉल आरंभ मंत्र:</strong> ${profile.mobile.remedies.callingMantra}
              </div>
            </div>

            <!-- Interactive Live Candidate Number Tester -->
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--gold-500); border-radius: 8px; padding: 14px;">
              <h4 style="margin: 0 0 6px 0; font-size: var(--text-sm); color: var(--gold-400); font-weight: 700;">
                🔍 नए संभावित नंबर की त्वरित जांच (Test a Candidate SIM Number Before Buying)
              </h4>
              <p style="font-size: 11px; color: var(--text-secondary); margin: 0 0 10px 0;">
                यदि आप नया नंबर लेने जा रहे हैं, तो उसका १० अंकों का नंबर यहाँ दर्ज करें और तुरंत जांचें कि वह आपके मूलांक (${profile.mulank.number}) व भाग्यांक (${profile.bhagyank.number}) के अनुकूल है या नहीं।
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
        ` : ""}
      </div>
    `;

    // Candidate phone verifier handler
    document.getElementById("btn-check-candidate")?.addEventListener("click", () => {
      const candidateStr = document.getElementById("candidate-phone-input")?.value;
      const resBox = document.getElementById("candidate-result-box");
      if (!resBox) return;

      if (!candidateStr || candidateStr.replace(/[^0-9]/g, "").length < 7) {
        resBox.style.display = "block";
        resBox.innerHTML = `<div style="padding: 8px 12px; background: rgba(239,68,68,0.1); border: 1px solid #EF4444; border-radius: 6px; color: #F87171; font-size: 11px;">कृपया कम से कम ७ से १० अंकों का मोबाइल नंबर दर्ज करें।</div>`;
        return;
      }

      const analyzed = analyzeMobileNumber(candidateStr, profile.mulank.number, profile.bhagyank.number);
      resBox.style.display = "block";
      resBox.innerHTML = `
        <div style="padding: 12px; background: ${analyzed.isSuitable ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"}; border: 1px solid ${analyzed.isSuitable ? "#10B981" : "#EF4444"}; border-radius: 6px; font-size: 11px; line-height: 1.5;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
            <strong style="color: #FFF; font-size: 13px;">नंबर: ${escapeHtml(analyzed.phoneNumber)}</strong>
            <span style="font-weight: 800; color: ${analyzed.isSuitable ? "#10B981" : "#EF4444"}; font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.2);">
              ${analyzed.isSuitable ? "✅ अत्यंत शुभ व अनुकूल (Recommended to Buy)" : "⚠️ प्रतिकूल / लेने से बचें (Not Suitable)"}
            </span>
          </div>
          <div style="display: flex; gap: 14px; margin-bottom: 6px; color: var(--text-secondary); flex-wrap: wrap;">
            <span><strong>संयुक्त योग:</strong> <span style="color: var(--gold-400); font-weight: 700;">${analyzed.compoundSum}</span></span>
            <span><strong>एकल अंक:</strong> <span style="color: var(--gold-400); font-weight: 700;">${analyzed.singleNumber} (${analyzed.rulingPlanetHi})</span></span>
            <span><strong>अंतिम अंक:</strong> [ ${analyzed.endingDigit.digit} ] (${analyzed.endingDigit.status})</span>
          </div>
          <div style="color: ${analyzed.isSuitable ? "#6EE7B7" : "#FCA5A5"}; font-size: 10.5px;">
            ${analyzed.isSuitable ? "यह नंबर आपके मूलांक व भाग्यांक से पूरी तरह मेल खाता है। आप इसे क्रय कर सकते हैं।" : ("दोष: " + analyzed.suitabilityReasons.map(r => escapeHtml(r)).join(" • "))}
          </div>
        </div>
      `;
    });

    document.getElementById("numerology-form")?.addEventListener('submit', (e) => {
      e.preventDefault();
      nameInput = document.getElementById('num-name').value;
      dateInput = document.getElementById('num-date').value;
      phoneInput = document.getElementById('num-phone').value;
      renderView();
    });
  }

  renderView();
}
