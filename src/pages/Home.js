/**
 * AstroVeda - Home Page
 */

import { calculateDailyPanchang } from '../engines/astrology/panchang.js';
import { store } from '../utils/store.js';

export function renderHomePage(container, navigateTo) {
  const todayStr = new Date().toISOString().split('T')[0];
  const panchang = calculateDailyPanchang(todayStr);

  container.innerHTML = `
    <!-- Permitted Client Unlimited Banner -->
    <div class="vip-client-banner glass-card" style="margin-bottom: var(--space-8); border: 1px solid rgba(218,165,32,0.4); background: linear-gradient(90deg, rgba(218,165,32,0.15), rgba(124,58,237,0.15));">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4);">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <span style="font-size: 1.8rem;">👑</span>
          <div>
            <div style="font-weight: 700; color: var(--gold-400); font-size: var(--text-base); display: flex; align-items: center; gap: 8px;">
              <span>Permitted Client Unlimited Access</span>
              <span style="background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid #10B981; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">UNLIMITED VIP ACTIVE</span>
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">
              Exclusive access granted for master consultation & unlimited horoscopes &bull; Helpline: <strong style="color: var(--gold-300);">+91 901 908 8160</strong>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: var(--space-2);">
          <button id="quick-kundali-btn" class="btn btn-primary" style="padding: var(--space-2) var(--space-4); font-size: var(--text-xs);">
            ⚡ Quick Kundali
          </button>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-symbol">🕉️</div>
      <h1 class="hero-title">AstroVeda</h1>
      <p class="hero-subtitle">
        Authentic Sanatan Hindu Vedic Astrology, Classical Numerology & MahaVastu Solutions. 
        High-precision algorithms for accurate life predictions and holistic remedies.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg" id="hero-astroguru-btn" style="background: var(--gradient-accent); color: #000; font-weight: 800; box-shadow: 0 0 15px rgba(218,165,32,0.4);">
          🧙‍♂️ Chat with AstroGuru
        </button>
        <button class="btn btn-secondary btn-lg" id="hero-kundali-btn">
          🪐 Janam Kundali
        </button>
        <button class="btn btn-secondary btn-lg" id="hero-panchang-btn">
          📅 Today's Panchang
        </button>
        <button class="btn btn-secondary btn-lg" id="hero-vaastu-btn">
          🏠 Vaastu Audit
        </button>
        <button class="btn btn-secondary btn-lg" id="hero-numerology-btn">
          🔢 Lo Shu Numerology
        </button>
      </div>
    </section>

    <!-- Today's Live Panchang Quick Ticker Card -->
    <div class="glass-card" style="margin-bottom: var(--space-10);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: var(--space-4); border-bottom: 1px solid var(--border-secondary); padding-bottom: var(--space-3);">
        <h3 class="card-title" style="margin: 0;">
          <span>🗓️ Daily Vedic Panchang</span>
          <span style="font-size: var(--text-xs); background: rgba(218,165,32,0.15); color: var(--gold-400); padding: 4px 10px; border-radius: 9999px;">
            ${panchang.weekday} (${panchang.weekdayHi}), ${todayStr}
          </span>
        </h3>
        <button id="view-full-panchang" class="btn btn-secondary" style="padding: 4px 12px; font-size: var(--text-xs);">
          Full Details & Choghadiya &rarr;
        </button>
      </div>

      <div class="grid-4" style="text-align: center;">
        <div style="padding: var(--space-3); background: rgba(255,255,255,0.03); border-radius: var(--radius-md);">
          <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Tithi (तिथि)</div>
          <div style="font-size: var(--text-base); font-weight: 700; color: var(--gold-400); margin-top: 4px;">
            ${panchang.tithi.name} (${panchang.tithi.nameHi})
          </div>
          <div style="font-size: 11px; color: var(--text-secondary);">${panchang.tithi.paksha} Paksha</div>
        </div>

        <div style="padding: var(--space-3); background: rgba(255,255,255,0.03); border-radius: var(--radius-md);">
          <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Nakshatra (नक्षत्र)</div>
          <div style="font-size: var(--text-base); font-weight: 700; color: var(--gold-400); margin-top: 4px;">
            ${panchang.nakshatra.name} (${panchang.nakshatra.nameHi})
          </div>
          <div style="font-size: 11px; color: var(--text-secondary);">Lord: ${panchang.nakshatra.lord} &bull; Pada ${panchang.nakshatra.pada}</div>
        </div>

        <div style="padding: var(--space-3); background: rgba(255,255,255,0.03); border-radius: var(--radius-md);">
          <div style="font-size: var(--text-xs); color: #10B981; text-transform: uppercase;">Abhijit Muhurta (अभिजित)</div>
          <div style="font-size: var(--text-base); font-weight: 700; color: #10B981; margin-top: 4px;">
            ${panchang.muhurtas.abhijit}
          </div>
          <div style="font-size: 11px; color: var(--text-secondary);">Supreme Auspicious Window</div>
        </div>

        <div style="padding: var(--space-3); background: rgba(255,255,255,0.03); border-radius: var(--radius-md);">
          <div style="font-size: var(--text-xs); color: #EF4444; text-transform: uppercase;">Rahu Kaal (राहु काल)</div>
          <div style="font-size: var(--text-base); font-weight: 700; color: #EF4444; margin-top: 4px;">
            ${panchang.muhurtas.rahuKaal}
          </div>
          <div style="font-size: 11px; color: var(--text-secondary);">Avoid auspicious starts</div>
        </div>
      </div>
    </div>

    
    <!-- AstroGuru Featured Banner -->
    <div class="glass-card" style="margin-bottom: var(--space-8); border: 1.5px solid rgba(218,165,32,0.4); background: linear-gradient(135deg, rgba(30, 27, 75, 0.65), rgba(15, 23, 42, 0.8)); border-radius: var(--radius-xl); padding: var(--space-6); display: flex; align-items: center; justify-content: space-between; gap: var(--space-6); flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 58px; height: 58px; border-radius: 50%; background: #1E1B4B; border: 2px solid #DAA520; display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: 0 0 15px rgba(218,165,32,0.4); flex-shrink: 0;">
          🧙‍♂️
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <h3 style="margin: 0; font-size: var(--text-xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              AstroGuru — AI Vedic Astrologer & Life Guide
            </h3>
            <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #10B981; border-radius: 4px;">
              🟢 Live Chart Analysis
            </span>
          </div>
          <p style="margin: 4px 0 0 0; font-size: 13.5px; color: var(--text-secondary); max-width: 680px;">
            Discuss your career, marriage, health, finances, dasha, and life challenges interactively. AstroGuru analyzes your live birth chart to prescribe personalized Vedic remedies, mantras & gemstones in Kannada, Hindi, Marathi, Telugu & English.
          </p>
        </div>
      </div>
      <button id="banner-astroguru-btn" class="btn btn-primary" style="background: var(--gradient-accent); color: #000; font-weight: 800; padding: 10px 22px; white-space: nowrap;">
        Start Consultation &rarr;
      </button>
    </div>
  
    <!-- Features Grid -->
    <div class="section-header">
      <span class="section-badge">Unicorn Solutions Suite</span>
      <h2 class="section-title">Ancient Vedic Wisdom, Modern Precision</h2>
      <p class="section-desc">Experience accurate algorithms verified against classical astrological treatises.</p>
    </div>

    <div class="grid-3" style="margin-bottom: var(--space-12);">
      <div class="feature-card" data-goto="kundali">
        <span class="feature-icon">🪐</span>
        <h3 class="feature-title">Janam & Lagna Kundali</h3>
        <p class="feature-desc">North & South Indian charts, D-9 Navamsa, D-10 Dashamsha, Shadbala, and 12-house planetary positions.</p>
      </div>

      <div class="feature-card" data-goto="dasha">
        <span class="feature-icon">⏳</span>
        <h3 class="feature-title">Vimshottari & Yogini Dasha</h3>
        <p class="feature-desc">120-year complete planetary timeline with Mahadasha, Antardasha, current active planetary phases & life impact.</p>
      </div>

      <div class="feature-card" data-goto="matching">
        <span class="feature-icon">💍</span>
        <h3 class="feature-title">Kundali Matching (Gun Milan)</h3>
        <p class="feature-desc">Authentic 36 Guna Ashtakoota Milan (Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, Nadi) with dosha remedies.</p>
      </div>

      <div class="feature-card" data-goto="numerology">
        <span class="feature-icon">🔢</span>
        <h3 class="feature-title">Lo Shu & Chaldean Numerology</h3>
        <p class="feature-desc">Mulank, Bhagyank, 3x3 Lo Shu Grid planes, phone number analysis, and personalized name spelling correction.</p>
      </div>

      <div class="feature-card" data-goto="vaastu">
        <span class="feature-icon">🏠</span>
        <h3 class="feature-title">16-Zone MahaVastu Audit</h3>
        <p class="feature-desc">Room-by-room directional analysis, 5-element Panchatatva balance, and non-demolition Sanatan remedies.</p>
      </div>

      <div class="feature-card" data-goto="muhurta">
        <span class="feature-icon">✨</span>
        <h3 class="feature-title">Auspicious Muhurta Finder</h3>
        <p class="feature-desc">Find optimal dates & times for Vivah, Griha Pravesh, Vehicle purchase, Business launch, and Namkaran.</p>
      </div>
    </div>

    <!-- Sacred Vedic Shloka Card -->
    <div class="glass-card" style="text-align: center; border: 1px solid rgba(218,165,32,0.3); padding: var(--space-8);">
      <div style="font-family: 'Noto Sans Devanagari', serif; font-size: var(--text-2xl); color: var(--gold-400); margin-bottom: var(--space-3); line-height: 1.6;">
        ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥
      </div>
      <div style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 650px; margin: 0 auto;">
        "Lead us from the unreal to the real, from darkness into light, from mortality to immortality."
        <br><span style="color: var(--gold-500); font-size: var(--text-xs);">&mdash; Brihadaranyaka Upanishad</span>
      </div>
    </div>
  `;

  // Attach event listeners
  container.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => {
      const page = el.getAttribute('data-goto');
      navigateTo(page);
    });
  });

  document.getElementById('hero-astroguru-btn')?.addEventListener('click', () => navigateTo('astroguru'));
  document.getElementById('banner-astroguru-btn')?.addEventListener('click', () => navigateTo('astroguru'));
  document.getElementById('hero-kundali-btn')?.addEventListener('click', () => navigateTo('kundali'));
  document.getElementById('hero-panchang-btn')?.addEventListener('click', () => navigateTo('panchang'));
  document.getElementById('hero-vaastu-btn')?.addEventListener('click', () => navigateTo('vaastu'));
  document.getElementById('hero-numerology-btn')?.addEventListener('click', () => navigateTo('numerology'));
  document.getElementById('quick-kundali-btn')?.addEventListener('click', () => navigateTo('kundali'));
  document.getElementById('view-full-panchang')?.addEventListener('click', () => navigateTo('panchang'));
}
