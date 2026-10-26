/**
 * AstroVeda - Janam & Lagna Kundali Page
 * Includes complete Indian Places Database with searchable autocomplete,
 * optional Mother's & Father's names, Multilingual PDF selection (English, Hindi, Kannada, Marathi, Telugu),
 * and full 9-Page High-Definition Vedic Janampatrika PDF Generator.
 */

import { generateKundali, generateNavamsaChart, getChartData } from '../engines/astrology/kundali.js';
import { identifyYogas } from '../engines/astrology/yoga.js';
import { analyzeDoshas } from '../engines/astrology/dosha.js';
import { renderChart } from '../components/charts/ChartRenderer.js';
import { store } from '../utils/store.js';
import { INDIAN_PLACES, renderIndianPlacesDatalist, findIndianPlace } from '../utils/indianPlaces.js';
import { renderFullPatrikaReport, escapeHtml } from '../components/reports/FullPatrikaReport.js';
import { downloadKundaliPdf, showDownloadStatus } from '../utils/pdfDownloader.js';

export function renderKundaliPage(container) {
  const urlParams = new URLSearchParams(window.location.search || '');
  const saved = store.getSavedBirthDetails();

  let selectedReportLang = urlParams.get('lang') || 'hi';
  const nameVal = urlParams.get('name') || saved.name || 'Aarav Sharma';
  const dateVal = urlParams.get('date') || saved.date || '1995-10-24';
  const timeVal = urlParams.get('time') || saved.time || '10:30';
  const fatherVal = urlParams.get('father') || saved.fatherName || '';
  const motherVal = urlParams.get('mother') || saved.motherName || '';
  let phoneVal = urlParams.get('phone') || saved.phone || '';
  if (phoneVal.includes('9019088160') || phoneVal.includes('901 908 8160') || phoneVal.trim() === '+91 901 908 8160') {
    phoneVal = '';
  }
  const cityVal = urlParams.get('city') || saved.city || 'Varanasi (Kashi / Banaras), UP';
  const latVal = urlParams.get('lat') ? parseFloat(urlParams.get('lat')) : (saved.latitude || 25.3176);
  const lonVal = urlParams.get('lon') ? parseFloat(urlParams.get('lon')) : (saved.longitude || 82.9739);
  const tzVal = urlParams.get('tz') ? parseFloat(urlParams.get('tz')) : (saved.timezone || 5.5);
  const ayanVal = urlParams.get('ayanamsa') || saved.ayanamsa || 'LAHIRI';

  container.innerHTML = `
    <div class="kundali-page">
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-6);">
        <div>
          <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            🪐 Janam Kundali & 9-Page Brihat Mahapatrika
          </h2>
          <p style="color: var(--text-secondary); font-size: var(--text-sm);">
            Complete Vedic birth chart, Avakahada Janam Naam, Good/Bad attributes, Career, Marriage Timing & Multilingual HD PDF export.
          </p>
        </div>
        <div style="display: flex; gap: var(--space-2);">
          <button id="view-pdf-tab-btn" class="btn btn-primary" style="font-size: var(--text-xs); font-weight: 700;">
            📥 Calculate & Download 9-Page PDF Patrika
          </button>
        </div>
      </div>

      <!-- Input Form Card -->
      <div class="glass-card" style="margin-bottom: var(--space-8);">
        <h3 class="card-title"><span>✍️ Enter Birth Particulars</span></h3>
        <form id="kundali-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="k-name" class="form-input" value="${escapeHtml(nameVal)}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="date" id="k-date" class="form-input" value="${escapeHtml(dateVal)}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Time of Birth (24 Hr)</label>
              <input type="time" id="k-time" class="form-input" value="${escapeHtml(timeVal)}" required />
            </div>
          </div>

          <!-- Optional Parents Names & Phone for Numerology -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Father's Name (पिता का नाम - Optional)</label>
              <input type="text" id="k-father" class="form-input" placeholder="e.g. Pt. Ramakant Sharma" value="${escapeHtml(fatherVal)}" />
            </div>
            <div class="form-group">
              <label class="form-label">Mother's Name (माता का नाम - Optional)</label>
              <input type="text" id="k-mother" class="form-input" placeholder="e.g. Smt. Shanti Devi" value="${escapeHtml(motherVal)}" />
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number (अंक ज्योतिष समाधान हेतु - Optional)</label>
              <input type="tel" id="k-phone" class="form-input" placeholder="e.g. 9876543210 (Optional / ಐಚ್ಛಿಕ)" value="${escapeHtml(phoneVal)}" />
            </div>
          </div>

          <!-- Location Selector & Language Selector -->
          <div class="form-row">
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label" style="display: flex; justify-content: space-between;">
                <span>📍 Place of Birth (Search All Indian Cities, Tirthas & Towns)</span>
                <span style="color: var(--gold-400); font-size: 11px;">350+ Places across India (Including Chirala & AP Towns)</span>
              </label>
              <input type="text" id="k-place-input" list="k-indian-places-list" class="form-input" 
                     placeholder="Type to search e.g. Chirala, Tirupati, Vijayawada, Varanasi, Bengaluru..." 
                     value="${escapeHtml(cityVal)}" autocomplete="off" />
              ${renderIndianPlacesDatalist('k-indian-places-list')}
            </div>

            <!-- Multilingual Selector -->
            <div class="form-group">
              <label class="form-label" style="display: flex; justify-content: space-between;">
                <span>🌐 PDF & Report Language (ಭಾಷೆ / भाषा / భాష)</span>
                <span style="color: var(--gold-400); font-size: 11px;">5 Indian Languages</span>
              </label>
              <select id="k-report-lang" class="form-input" style="font-weight: 700; color: var(--gold-400);">
                <option value="en" ${selectedReportLang === 'en' ? 'selected' : ''}>English (Global Universal)</option>
                <option value="hi" ${selectedReportLang === 'hi' ? 'selected' : ''}>हिंदी (Hindi - राष्ट्रभाषा)</option>
                <option value="kn" ${selectedReportLang === 'kn' ? 'selected' : ''}>ಕನ್ನಡ (Kannada - ಕರ್ನಾಟಕ ಶೈಲಿ)</option>
                <option value="mr" ${selectedReportLang === 'mr' ? 'selected' : ''}>मराठी (Marathi - महाराष्ट्र पद्धती)</option>
                <option value="te" ${selectedReportLang === 'te' ? 'selected' : ''}>తెలుగు (Telugu - ఆంధ్ర & తెలంగాణ శైలి)</option>
              </select>
            </div>
          </div>

          <!-- Precise Coordinates & Ayanamsa -->
          <div class="form-row" style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-secondary);">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Latitude (°N)</label>
              <input type="number" step="0.0001" id="k-lat" class="form-input" value="${latVal}" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Longitude (°E)</label>
              <input type="number" step="0.0001" id="k-lon" class="form-input" value="${lonVal}" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Timezone (UTC)</label>
              <input type="number" step="0.1" id="k-tz" class="form-input" value="${tzVal}" readonly style="background: rgba(0,0,0,0.2); opacity: 0.8;" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Ayanamsa</label>
              <select id="k-ayanamsa" class="form-input" style="font-size: 12px;">
                <option value="LAHIRI" ${ayanVal === 'LAHIRI' ? 'selected' : ''}>Lahiri (Chitrapaksha - Govt Standard)</option>
                <option value="KP" ${ayanVal === 'KP' ? 'selected' : ''}>KP (Krishnamurti Paddhati)</option>
                <option value="RAMAN" ${ayanVal === 'RAMAN' ? 'selected' : ''}>B.V. Raman</option>
                <option value="YUKTESHWAR" ${ayanVal === 'YUKTESHWAR' ? 'selected' : ''}>Sri Yukteshwar</option>
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-4); flex-wrap: wrap;">
            <button type="button" id="btn-calculate-interactive" class="btn btn-secondary" style="padding: var(--space-3) var(--space-6); font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
              <span>📊</span> Calculate & View Online (स्क्रीन पर देखें)
            </button>
            <button type="submit" id="btn-calculate-download-pdf" class="btn btn-primary" style="padding: var(--space-3) var(--space-8); font-weight: 800; font-size: var(--text-base); display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(218,165,32,0.4);">
              <span>📥</span> Calculate Kundali & Download PDF (पीडीएफ डाउनलोड करें)
            </button>
          </div>
        </form>
      </div>

      <!-- Mode View Tabs: Interactive Dashboard vs 9-Page Full Patrika Report -->
      <div style="display: flex; gap: 8px; margin-bottom: var(--space-6);" class="no-print">
        <button id="view-mode-interactive" class="btn btn-secondary" style="padding: 6px 14px; font-size: var(--text-xs);">
          📊 Interactive Chart Dashboard
        </button>
        <button id="view-mode-pdf" class="btn btn-primary" style="padding: 6px 14px; font-size: var(--text-xs);">
          📜 9-Page Complete Vedic Mahapatrika & Solutions (PDF View)
        </button>
      </div>

      <!-- Main Results Container -->
      <div id="kundali-results-container"></div>
    </div>
  `;

  let activeViewMode = urlParams.get('view') === 'interactive' ? 'interactive' : 'pdf';
  if (activeViewMode === 'pdf') {
    setTimeout(() => {
      document.getElementById('view-mode-interactive')?.classList.replace('btn-primary', 'btn-secondary');
      document.getElementById('view-mode-pdf')?.classList.replace('btn-secondary', 'btn-primary');
    }, 50);
  } else {
    setTimeout(() => {
      document.getElementById('view-mode-interactive')?.classList.replace('btn-secondary', 'btn-primary');
      document.getElementById('view-mode-pdf')?.classList.replace('btn-primary', 'btn-secondary');
    }, 50);
  }

  // Language change listener on form
  document.getElementById('k-report-lang')?.addEventListener('change', (e) => {
    selectedReportLang = e.target.value;
    calculateAndRender(false);
  });

  // Autocomplete place input listener
  const placeInput = document.getElementById('k-place-input');
  placeInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    const match = findIndianPlace(val);
    if (match) {
      document.getElementById('k-lat').value = match.lat;
      document.getElementById('k-lon').value = match.lon;
      document.getElementById('k-tz').value = match.tz;
    }
  });

  placeInput?.addEventListener('change', (e) => {
    const val = e.target.value;
    const match = findIndianPlace(val);
    if (match) {
      document.getElementById('k-lat').value = match.lat;
      document.getElementById('k-lon').value = match.lon;
      document.getElementById('k-tz').value = match.tz;
      calculateAndRender(false);
    }
  });

  const triggerPdfModeAndCalculate = (autoDownload = true) => {
    activeViewMode = 'pdf';
    const tabPdf = document.getElementById('view-mode-pdf');
    const tabInt = document.getElementById('view-mode-interactive');
    if (tabPdf && tabInt) {
      tabPdf.className = 'btn btn-primary';
      tabInt.className = 'btn btn-secondary';
    }
    calculateAndRender(autoDownload);
  };

  // Form submit triggers PDF view & direct download
  document.getElementById('kundali-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    triggerPdfModeAndCalculate(true);
  });

  // Calculate Kundali & Download PDF button click
  document.getElementById('btn-calculate-download-pdf')?.addEventListener('click', (e) => {
    e.preventDefault();
    triggerPdfModeAndCalculate(true);
  });

  // Top header button: Calculate & Download 9-Page PDF Patrika
  document.getElementById('view-pdf-tab-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    triggerPdfModeAndCalculate(true);
  });

  // Calculate & View Online (Interactive) button
  document.getElementById('btn-calculate-interactive')?.addEventListener('click', () => {
    activeViewMode = 'interactive';
    const tabPdf = document.getElementById('view-mode-pdf');
    const tabInt = document.getElementById('view-mode-interactive');
    if (tabPdf && tabInt) {
      tabInt.className = 'btn btn-primary';
      tabPdf.className = 'btn btn-secondary';
    }
    calculateAndRender(false);
  });

  // View mode tab switches
  document.getElementById('view-mode-interactive')?.addEventListener('click', () => {
    activeViewMode = 'interactive';
    document.getElementById('view-mode-interactive').className = 'btn btn-primary';
    document.getElementById('view-mode-pdf').className = 'btn btn-secondary';
    calculateAndRender(false);
  });

  document.getElementById('view-mode-pdf')?.addEventListener('click', () => {
    activeViewMode = 'pdf';
    document.getElementById('view-mode-pdf').className = 'btn btn-primary';
    document.getElementById('view-mode-interactive').className = 'btn btn-secondary';
    calculateAndRender(false);
  });

  // Initial calculation on page load
  calculateAndRender(false);

  function calculateAndRender(autoDownload = false) {
    const langFromSelect = document.getElementById('k-report-lang')?.value;
    if (langFromSelect) selectedReportLang = langFromSelect;

    const name = document.getElementById('k-name')?.value || nameVal;
    const date = document.getElementById('k-date')?.value || dateVal;
    const time = document.getElementById('k-time')?.value || timeVal;
    const city = document.getElementById('k-place-input')?.value || cityVal;
    const fatherName = document.getElementById('k-father')?.value || fatherVal;
    const motherName = document.getElementById('k-mother')?.value || motherVal;
    const phone = document.getElementById('k-phone') ? document.getElementById('k-phone').value.trim() : '';
    const lat = parseFloat(document.getElementById('k-lat')?.value) || latVal;
    const lon = parseFloat(document.getElementById('k-lon')?.value) || lonVal;
    const tz = parseFloat(document.getElementById('k-tz')?.value) || tzVal;
    const ayanamsa = document.getElementById('k-ayanamsa')?.value || ayanVal;

    const userInputs = { name, date, time, city, fatherName, motherName, phone, latitude: lat, longitude: lon, timezone: tz, ayanamsa, lang: selectedReportLang };

    // Save to store
    store.saveBirthDetails(userInputs);

    // Generate Kundali & Navamsa
    const kundali = generateKundali(date, time, lat, lon, tz, ayanamsa);
    store.currentKundali = kundali;
    const navamsa = generateNavamsaChart(kundali);

    // Identify Yogas & Doshas
    const yogas = identifyYogas(kundali);
    const transitAssessmentDate = userInputs.transitDate || userInputs.assessmentDate || new Date().toISOString().split('T')[0];
    const doshas = analyzeDoshas(kundali, transitAssessmentDate);

    const resContainer = document.getElementById('kundali-results-container');
    if (!resContainer) return;

    if (activeViewMode === 'pdf') {
      // Render 9-Page Full Patrika Report with current selected language
      resContainer.innerHTML = renderFullPatrikaReport(kundali, navamsa, yogas, doshas, { ...userInputs, transitDate: transitAssessmentDate }, selectedReportLang);

      // Render charts into page 2 at 350px width for crystal-clear readability
      const lagnaChartData = getChartData(kundali);
      const navamsaChartData = {
        lagnaRashi: navamsa.lagna.rashi,
        houses: {}
      };
      for (let i = 1; i <= 12; i++) {
        navamsaChartData.houses[i] = {
          rashi: navamsa.houses[i - 1].rashi,
          rashiSymbol: navamsa.houses[i - 1].rashiSymbol,
          planets: navamsa.houses[i - 1].planets.map(p => ({
            abbr: p.abbr,
            symbol: p.symbol,
            color: p.color,
            degree: ''
          }))
        };
      }

      // Render large, high-contrast print charts
      renderChart(lagnaChartData, 'print-lagna-chart', store.chartStyle || 'north', { width: 350, height: 350, theme: 'print' });
      renderChart(navamsaChartData, 'print-navamsa-chart', store.chartStyle || 'north', { width: 350, height: 350, theme: 'print' });

      // Language Switcher Buttons inside the PDF action bar
      document.querySelectorAll('.patrika-lang-choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetLang = btn.getAttribute('data-lang');
          if (targetLang) {
            selectedReportLang = targetLang;
            const formSelect = document.getElementById('k-report-lang');
            if (formSelect) formSelect.value = targetLang;
            calculateAndRender(false);
          }
        });
      });

      // 1. Direct PDF Download button trigger
      document.getElementById('trigger-pdf-download-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        downloadKundaliPdf('printable-patrika', userInputs.name, showDownloadStatus, selectedReportLang);
      });

      // 2. Print / Save as PDF button trigger
      document.getElementById('trigger-pdf-print-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
      });

      // Helper function to build sharable URL
      const getShareUrl = () => {
        const shareParams = new URLSearchParams({
          name: userInputs.name,
          date: userInputs.date,
          time: userInputs.time,
          city: userInputs.city,
          lat: userInputs.latitude,
          lon: userInputs.longitude,
          phone: userInputs.phone || '',
          father: userInputs.fatherName || '',
          mother: userInputs.motherName || '',
          lang: selectedReportLang,
          view: 'pdf'
        });
        return `${window.location.origin}${window.location.pathname}?${shareParams.toString()}`;
      };

      // 3. Attach WhatsApp share trigger
      document.getElementById('trigger-whatsapp-share-btn')?.addEventListener('click', () => {
        const moon = kundali.planets.find(p => p.name === 'Moon');
        const shareUrl = getShareUrl();
        const text = `🕉️ *AstroVeda • 9-Page Comprehensive Vedic Mahapatrika*\n\n` +
          `👤 *Seeker:* ${userInputs.name}\n` +
          `📅 *DOB:* ${userInputs.date} (${userInputs.time})\n` +
          `📍 *Place:* ${userInputs.city}\n` +
          `♈ *Lagna:* ${kundali.lagna.rashiName} (${kundali.lagna.rashiNameHi})\n` +
          `🌙 *Moon Sign:* ${moon.rashiName} (${moon.rashiNameHi})\n` +
          `⭐ *Nakshatra:* ${moon.nakshatraName} (Pada ${moon.pada})\n\n` +
          `📜 *View & Download Full 9-Page Patrika in ${selectedReportLang.toUpperCase()}:*\n${shareUrl}\n\n` +
          `📞 *Acharya Helpline:* +91 901 908 8160`;
          
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      });

      // 4. Attach Copy Link trigger
      document.getElementById('trigger-copy-link-btn')?.addEventListener('click', () => {
        const shareUrl = getShareUrl();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('✨ Sharable Patrika Link copied to clipboard!');
          }).catch(() => {
            prompt('Copy this Sharable Patrika URL:', shareUrl);
          });
        } else {
          prompt('Copy this Sharable Patrika URL:', shareUrl);
        }
      });

      // If auto-download requested, scroll to report and trigger download
      if (autoDownload) {
        setTimeout(() => {
          const printable = document.getElementById('printable-patrika');
          if (printable) {
            printable.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          downloadKundaliPdf('printable-patrika', userInputs.name, showDownloadStatus, selectedReportLang);
        }, 300);
      }

    } else {
      // Interactive Dashboard View
      renderInteractiveDashboard(resContainer, kundali, navamsa, yogas, doshas, name, city);
    }
  }

  function renderInteractiveDashboard(resContainer, kundali, navamsa, yogas, doshas, clientName, cityName) {
    const safeClientName = escapeHtml(clientName);
    const safeCityName = escapeHtml(cityName);
    resContainer.innerHTML = `
      <div class="grid-2" style="margin-bottom: var(--space-8);">
        <!-- Chart Render Panel -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; gap: 8px;">
              <button id="chart-tab-lagna" class="btn btn-primary" style="padding: 4px 12px; font-size: var(--text-xs);">Lagna (D-1)</button>
              <button id="chart-tab-navamsa" class="btn btn-secondary" style="padding: 4px 12px; font-size: var(--text-xs);">Navamsa (D-9)</button>
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="style-north-btn" class="btn ${store.chartStyle === 'north' ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 10px; font-size: var(--text-xs);">North Indian</button>
              <button id="style-south-btn" class="btn ${store.chartStyle === 'south' ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 10px; font-size: var(--text-xs);">South Indian</button>
            </div>
          </div>

          <div id="chart-viewport" style="display: flex; justify-content: center; align-items: center; min-height: 440px;"></div>
        </div>

        <!-- Lagna & Key Attributes Panel -->
        <div class="glass-card">
          <h3 class="card-title"><span>🌟 Kundali Summary</span></h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); margin-bottom: var(--space-4);">
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Seeker Name</div>
              <div style="font-size: var(--text-base); font-weight: 700; color: var(--gold-400);">${safeClientName}</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Place of Birth</div>
              <div style="font-size: 13px; font-weight: 700; color: #FFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${safeCityName}">
                📍 ${safeCityName}
              </div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Ascendant (लग्न)</div>
              <div style="font-size: var(--text-base); font-weight: 700; color: var(--gold-400);">
                ${kundali.lagna.rashiName} (${kundali.lagna.rashiNameHi})
              </div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Lagna Degree</div>
              <div style="font-weight: 600;">${kundali.lagna.degreeFormatted}</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Lagna Nakshatra</div>
              <div style="font-weight: 600;">${kundali.lagna.nakshatraName} (${kundali.lagna.nakshatraNameHi})</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Lagna Lord</div>
              <div style="font-weight: 600; color: var(--gold-300);">${kundali.lagna.lord}</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; grid-column: span 2;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Ayanamsa & Coordinates</div>
              <div style="font-size: 12px; font-weight: 600;">
                ${kundali.birthDetails.ayanamsaValue}° (${kundali.birthDetails.ayanamsaSystem}) &bull; Lat: ${kundali.birthDetails.latitude}°N, Lon: ${kundali.birthDetails.longitude}°E
              </div>
            </div>
          </div>

          <!-- Quick Dosha Badges -->
          <div style="margin-top: var(--space-4); border-top: 1px solid var(--border-secondary); padding-top: var(--space-3);">
            <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">Core Dosha Scan:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${doshas.map(d => `
                <span style="font-size: 11px; padding: 4px 10px; border-radius: 9999px; font-weight: 600; background: ${d.present ? (d.cancelled ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)') : 'rgba(16, 185, 129, 0.15)'}; color: ${d.present ? (d.cancelled ? '#F59E0B' : '#EF4444') : '#10B981'}; border: 1px solid currentColor;">
                  ${d.name}: ${d.present ? (d.cancelled ? 'Cancelled / Mild' : 'Present') : 'Clear'}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Planetary Positions Table -->
      <div class="glass-card" style="margin-bottom: var(--space-8);">
        <h3 class="card-title"><span>🪐 Planetary Positions (ग्रह स्थिति)</span></h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--text-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-primary); color: var(--gold-400);">
                <th style="padding: 10px;">Planet</th>
                <th style="padding: 10px;">Rashi (Sign)</th>
                <th style="padding: 10px;">Longitude</th>
                <th style="padding: 10px;">Nakshatra & Pada</th>
                <th style="padding: 10px;">Navamsa</th>
                <th style="padding: 10px;">House</th>
                <th style="padding: 10px;">Dignity / Status</th>
              </tr>
            </thead>
            <tbody>
              ${kundali.planets.map(p => `
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: 10px; font-weight: 600; color: ${p.color};">
                    ${p.symbol} ${p.name} (${p.nameHi})
                  </td>
                  <td style="padding: 10px;">${p.rashiSymbol} ${p.rashiName} (${p.rashiNameHi})</td>
                  <td style="padding: 10px; font-family: monospace;">${p.degreeFormatted}</td>
                  <td style="padding: 10px;">${p.nakshatraName} (Pada ${p.pada})</td>
                  <td style="padding: 10px;">${p.navamsaName} (${p.navamsaNameHi})</td>
                  <td style="padding: 10px; font-weight: 600; color: var(--gold-400);">House ${p.house}</td>
                  <td style="padding: 10px;">
                    <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-secondary);">
                      ${p.strength.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Yogas & Doshas Analysis Section -->
      <div class="grid-2">
        <!-- Auspicious Yogas -->
        <div class="glass-card">
          <h3 class="card-title"><span style="color: #10B981;">✨ Auspicious Yogas Detected (${yogas.length})</span></h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${yogas.length === 0 ? '<p style="color: var(--text-tertiary);">No major classical yogas detected under primary criteria.</p>' : ''}
            ${yogas.map(y => `
              <div style="padding: var(--space-3); background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-weight: 700; color: var(--gold-400);">${y.name} (${y.nameHi})</span>
                  <span style="font-size: 11px; color: #10B981; font-weight: 600;">${y.strength}</span>
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 6px; line-height: 1.5;">${y.description}</div>
                <div style="font-size: 11px; color: var(--gold-300);"><strong>Vedic Remedy / Enhancement:</strong> ${y.remedy}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dosha Analysis, Lifecycles & Remedies with Ending Dates -->
        <div class="glass-card">
          <h3 class="card-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <span style="color: #F59E0B;">🛡️ Dosha Analysis, Ending Dates & Authentic Sanatan Remedies</span>
            <span style="font-size: 11px; color: var(--gold-400); font-weight: 600;">Exact Ending Dates & Milestones Included</span>
          </h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${doshas.filter(d => d.present).map(d => `
              <div style="padding: var(--space-4); background: rgba(239, 68, 68, 0.04); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
                  <span style="font-weight: 800; font-size: 15px; color: #F59E0B;">${d.name} (${d.nameHi})</span>
                  <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: ${d.cancelled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${d.cancelled ? '#10B981' : '#EF4444'}; font-weight: 700; border: 1px solid currentColor;">${d.intensity}</span>
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 6px;">${d.details}</div>
                <div style="font-size: 12px; color: #E2E8F0; margin-bottom: 8px; line-height: 1.5;">${d.impact}</div>

                <!-- Ending Date & Lifecycle Banner -->
                ${d.endingTimeline ? `
                  <div style="background: rgba(218, 165, 32, 0.08); border: 1px solid rgba(218, 165, 32, 0.35); border-radius: 6px; padding: 10px 12px; margin: 8px 0 10px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: ${d.timelineMilestones && d.timelineMilestones.length > 0 ? '8px' : '0'};">
                      <div style="font-size: 12px; color: var(--gold-300);">
                        <strong>⏳ Ending Date / Relief Milestone:</strong>
                        <span style="font-weight: 700; color: #FFF;"> ${d.endingTimeline}</span>
                      </div>
                      ${d.endDateFormatted && d.endDateFormatted !== 'N/A' ? `
                        <span style="font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: rgba(218,165,32,0.25); color: var(--gold-300); border: 1px solid var(--gold-400);">
                          🗓️ ${d.endDateFormatted}
                        </span>
                      ` : ''}
                    </div>

                    ${d.timelineMilestones && d.timelineMilestones.length > 0 ? `
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px; margin-top: 6px; font-size: 11px;">
                        ${d.timelineMilestones.map(m => `
                          <div style="padding: 6px 8px; background: rgba(0,0,0,0.25); border-radius: 4px; border-left: 3px solid var(--gold-400);">
                            <div style="font-weight: 700; color: var(--gold-300);">${m.phase || m.label}</div>
                            <div style="color: #CBD5E1; font-size: 10.5px;">${m.period || m.date || ''}</div>
                            ${m.desc ? `<div style="color: var(--text-tertiary); font-size: 10px; margin-top: 2px;">${m.desc}</div>` : ''}
                          </div>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                ` : ''}

                <!-- Structured Remedies Section -->
                ${d.structuredRemedies ? `
                  <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-weight: 800; font-size: 12px; color: var(--gold-400); margin-bottom: 6px;">Authentic Sanatan Remedies & Vidhi:</div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 8px; font-size: 11.5px; line-height: 1.5;">
                      ${d.structuredRemedies.mantra ? `
                        <div style="padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-secondary);">
                          <strong style="color: #38BDF8;">🕉️ Mantra Sadhana:</strong>
                          <div style="font-style: italic; color: #FFF; margin: 2px 0;">"${d.structuredRemedies.mantra.verse}"</div>
                          <div style="color: var(--text-secondary); font-size: 10.5px;"><strong>Japa:</strong> ${d.structuredRemedies.mantra.japaCount} &bull; <strong>Mala:</strong> ${d.structuredRemedies.mantra.mala}</div>
                        </div>
                      ` : ''}
                      ${d.structuredRemedies.rudraksha ? `
                        <div style="padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-secondary);">
                          <strong style="color: #F43F5E;">📿 Sacred Rudraksha:</strong>
                          <div style="color: #FFF; font-weight: 600; margin: 2px 0;">${d.structuredRemedies.rudraksha.mukhi}</div>
                          <div style="color: var(--text-secondary); font-size: 10.5px;">${d.structuredRemedies.rudraksha.benefit}</div>
                        </div>
                      ` : ''}
                      ${d.structuredRemedies.daan ? `
                        <div style="padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-secondary);">
                          <strong style="color: #34D399;">🌾 Daan & Seva (दान):</strong>
                          <div style="color: #E2E8F0; margin: 2px 0;">${d.structuredRemedies.daan.items}</div>
                          <div style="color: var(--text-secondary); font-size: 10.5px;"><strong>Day:</strong> ${d.structuredRemedies.daan.day} &bull; <strong>Recipient:</strong> ${d.structuredRemedies.daan.recipient}</div>
                        </div>
                      ` : ''}
                      ${d.structuredRemedies.tirthas ? `
                        <div style="padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-secondary);">
                          <strong style="color: #FBBF24;">🏛️ Siddha Tirthas (सिद्ध पीठ):</strong>
                          <ul style="padding-left: 16px; margin: 3px 0 0 0; color: #CBD5E1; font-size: 10.5px;">
                            ${d.structuredRemedies.tirthas.map(t => `<li>${t}</li>`).join('')}
                          </ul>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                ` : `
                  <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
                    <strong style="font-size: 11px; color: var(--gold-400);">Authentic Sanatan Remedies:</strong>
                    <ul style="padding-left: 18px; margin-top: 4px; font-size: 11px; color: var(--text-secondary); line-height: 1.5;">
                      ${d.remedies.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                  </div>
                `}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Render active chart tab
    let currentChartType = 'lagna';
    const lagnaChartData = getChartData(kundali);
    const navamsaChartData = {
      lagnaRashi: navamsa.lagna.rashi,
      houses: {}
    };
    for (let i = 1; i <= 12; i++) {
      navamsaChartData.houses[i] = {
        rashi: navamsa.houses[i - 1].rashi,
        rashiSymbol: navamsa.houses[i - 1].rashiSymbol,
        planets: navamsa.houses[i - 1].planets.map(p => ({
          abbr: p.abbr,
          symbol: p.symbol,
          color: p.color,
          degree: ''
        }))
      };
    }

    function updateChart() {
      const activeData = currentChartType === 'lagna' ? lagnaChartData : navamsaChartData;
      renderChart(activeData, 'chart-viewport', store.chartStyle);
    }

    updateChart();

    document.getElementById('style-north-btn')?.addEventListener('click', () => {
      store.setChartStyle('north');
      document.getElementById('style-north-btn').className = 'btn btn-primary';
      document.getElementById('style-south-btn').className = 'btn btn-secondary';
      updateChart();
    });

    document.getElementById('style-south-btn')?.addEventListener('click', () => {
      store.setChartStyle('south');
      document.getElementById('style-south-btn').className = 'btn btn-primary';
      document.getElementById('style-north-btn').className = 'btn btn-secondary';
      updateChart();
    });

    document.getElementById('chart-tab-lagna')?.addEventListener('click', () => {
      currentChartType = 'lagna';
      document.getElementById('chart-tab-lagna').className = 'btn btn-primary';
      document.getElementById('chart-tab-navamsa').className = 'btn btn-secondary';
      updateChart();
    });

    document.getElementById('chart-tab-navamsa')?.addEventListener('click', () => {
      currentChartType = 'navamsa';
      document.getElementById('chart-tab-navamsa').className = 'btn btn-primary';
      document.getElementById('chart-tab-lagna').className = 'btn btn-secondary';
      updateChart();
    });
  }
}

function showToast(msg) {
  let toast = document.getElementById('astro-toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'astro-toast-notification';
    toast.className = 'astro-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
