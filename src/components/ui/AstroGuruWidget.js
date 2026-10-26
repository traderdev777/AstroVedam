/**
 * AstroVeda - Floating AstroGuru Global Assistant Widget
 * Persistent, collapsible AI Vedic Assistant available across all pages.
 */

import { store } from '../../utils/store.js';
import { getAstroGuruResponse } from '../../engines/astroguru/advisor.js';

let isWidgetOpen = false;
let widgetMessages = [];
let widgetLang = 'kn';

export function initAstroGuruWidget(navigateTo) {
  // Check if widget already exists
  if (document.getElementById('astroguru-floating-root')) return;

  const root = document.createElement('div');
  root.id = 'astroguru-floating-root';
  root.className = 'astroguru-floating-root';

  root.innerHTML = `
    <!-- Floating Trigger Bubble -->
    <button id="astroguru-fab" class="astroguru-fab" title="Chat with AstroGuru (ವೈದಿಕ ಜ್ಯೋತಿಷಿ)">
      <div class="fab-halo"></div>
      <span class="fab-icon">🧙‍♂️</span>
      <span class="fab-text">AstroGuru</span>
      <span class="fab-badge">AI</span>
    </button>

    <!-- Floating Chat Window -->
    <div id="astroguru-window" class="astroguru-window hidden">
      <div class="astroguru-win-header">
        <div class="win-title-block">
          <span class="win-avatar">🧙‍♂️</span>
          <div>
            <div class="win-title">AstroGuru (ಆಸ್ಟ್ರೋಗುರು)</div>
            <div class="win-status">🟢 Kundali AI Advisor</div>
          </div>
        </div>
        <div class="win-controls">
          <button id="astroguru-expand-btn" class="win-btn" title="Full Page Consultation">⤢</button>
          <button id="astroguru-close-btn" class="win-btn" title="Minimize">&times;</button>
        </div>
      </div>

      <!-- Quick Context Strip -->
      <div class="astroguru-win-context" id="win-context-strip">
        <span id="win-seeker-name">👤 Loading Chart...</span>
      </div>

      <!-- Messages Stream -->
      <div class="astroguru-win-body" id="astroguru-win-messages">
        <!-- Messages will be rendered here -->
      </div>

      <!-- Quick Chips -->
      <div class="astroguru-win-chips">
        <button class="win-chip" data-q="ನನ್ನ ಉದ್ಯೋಗ ಮತ್ತು ಪ್ರಮೋಷನ್ ಯಾವಾಗ ಆಗುತ್ತದೆ?">💼 Career</button>
        <button class="win-chip" data-q="ನನ್ನ ವಿವಾಹ ಯೋಗ ಮತ್ತು ಸಂಗಾತಿಯ ಸ್ವಭಾವ ಹೇಗಿರುತ್ತದೆ?">💍 Marriage</button>
        <button class="win-chip" data-q="ನನ್ನ ಜಾತಕದಲ್ಲಿ ಧನ ಲಾಭ ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿತಿ ಹೇಗಿದೆ?">💰 Wealth</button>
        <button class="win-chip" data-q="ನನ್ನ ಜಾತಕಕ್ಕೆ ಸೂಕ್ತವಾದ ರತ್ನ ಮತ್ತು ರುದ್ರಾಕ್ಷಿ ಯಾವುದು?">💎 Gemstone</button>
      </div>

      <!-- Footer Input -->
      <div class="astroguru-win-footer">
        <input type="text" id="win-input" class="win-input" placeholder="Ask AstroGuru about your chart..." />
        <button id="win-send-btn" class="win-send-btn">&rarr;</button>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  // Initial welcome in widget
  const saved = store.getSavedBirthDetails();
  widgetMessages = [
    {
      sender: 'guru',
      text: `ನಮಸ್ಕಾರ ${saved.name || 'Seeker'}! ನಾನು ಆಸ್ಟ್ರೋಗುರು. ನಿಮ್ಮ ಜಾತಕದ ಆಧಾರದ ಮೇಲೆ ವೃತ್ತಿ, ವಿವಾಹ, ಧನ ಅಥವಾ ದೋಷ ಪರಿಹಾರಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.`
    }
  ];

  renderWidgetMessages();

  // Attach FAB & Window Listeners
  const fab = document.getElementById('astroguru-fab');
  const win = document.getElementById('astroguru-window');
  const closeBtn = document.getElementById('astroguru-close-btn');
  const expandBtn = document.getElementById('astroguru-expand-btn');
  const sendBtn = document.getElementById('win-send-btn');
  const inputEl = document.getElementById('win-input');

  fab?.addEventListener('click', () => {
    isWidgetOpen = !isWidgetOpen;
    win?.classList.toggle('hidden', !isWidgetOpen);
    if (isWidgetOpen) {
      updateContextStrip();
      inputEl?.focus();
    }
  });

  closeBtn?.addEventListener('click', () => {
    isWidgetOpen = false;
    win?.classList.add('hidden');
  });

  expandBtn?.addEventListener('click', () => {
    isWidgetOpen = false;
    win?.classList.add('hidden');
    if (navigateTo) navigateTo('astroguru');
  });

  const sendWidgetMessage = () => {
    const text = inputEl?.value.trim();
    if (!text) return;

    widgetMessages.push({ sender: 'user', text });
    inputEl.value = '';
    renderWidgetMessages();

    // Generate guru response
    setTimeout(() => {
      const birth = store.getSavedBirthDetails();
      const resp = getAstroGuruResponse(text, store.currentKundali, birth, widgetLang);
      widgetMessages.push({
        sender: 'guru',
        title: resp.topicTitle,
        analysis: resp.analysis,
        forecast: resp.forecast,
        remedy: resp.remedies?.[0] || '',
        blessings: resp.blessings
      });
      renderWidgetMessages();
    }, 450);
  };

  sendBtn?.addEventListener('click', sendWidgetMessage);
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendWidgetMessage();
    }
  });

  // Chip clicks
  root.querySelectorAll('.win-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      if (q && inputEl) {
        inputEl.value = q;
        sendWidgetMessage();
      }
    });
  });
}

function updateContextStrip() {
  const strip = document.getElementById('win-seeker-name');
  if (!strip) return;
  const saved = store.getSavedBirthDetails();
  strip.innerHTML = `👤 <strong>${saved.name || 'Seeker'}</strong> &bull; ${saved.city || 'India'}`;
}

function renderWidgetMessages() {
  const container = document.getElementById('astroguru-win-messages');
  if (!container) return;

  container.innerHTML = widgetMessages.map(m => {
    if (m.sender === 'user') {
      return `
        <div class="win-msg user">
          <div class="win-bubble">${escapeHtml(m.text)}</div>
        </div>
      `;
    } else {
      return `
        <div class="win-msg guru">
          <span class="win-guru-ico">🧙‍♂️</span>
          <div class="win-bubble">
            ${m.title ? `<div class="win-msg-title">${m.title}</div>` : ''}
            <div>${m.text || m.analysis}</div>
            ${m.forecast ? `<div style="margin-top: 6px; font-size: 11.5px; color: var(--gold-400);">⏳ ${m.forecast}</div>` : ''}
            ${m.remedy ? `<div style="margin-top: 6px; padding: 4px 8px; background: rgba(218,165,32,0.1); border-left: 3px solid #DAA520; font-size: 11px;">🛡️ ${m.remedy}</div>` : ''}
          </div>
        </div>
      `;
    }
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function escapeHtml(str = '') {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
