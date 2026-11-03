import { initAstroGuruWidget } from './components/ui/AstroGuruWidget.js';
/**
 * AstroVeda - Main Application Controller
 * Premium Vedic Astrology, Numerology & Vaastu Shastra Web Application
 */

import './styles/index.css';
import { initCosmicCanvas } from './utils/cosmicCanvas.js';
import { getLanguage, setLanguage, applyTranslations } from './i18n/index.js';
// Pages are code-split: each one is downloaded only when the user opens it.
const PAGE_LOADERS = {
  home: () => import('./pages/Home.js').then(m => m.renderHomePage),
  kundali: () => import('./pages/Kundali.js').then(m => m.renderKundaliPage),
  dasha: () => import('./pages/Dasha.js').then(m => m.renderDashaPage),
  panchang: () => import('./pages/Panchang.js').then(m => m.renderPanchangPage),
  muhurta: () => import('./pages/Muhurta.js').then(m => m.renderMuhurtaPage),
  matching: () => import('./pages/Matching.js').then(m => m.renderMatchingPage),
  numerology: () => import('./pages/Numerology.js').then(m => m.renderNumerologyPage),
  vaastu: () => import('./pages/Vaastu.js').then(m => m.renderVaastuPage),
  astroguru: () => import('./pages/AstroGuru.js').then(m => m.renderAstroGuruPage),
};
const pageCache = {};
function loadPage(id) {
  if (!pageCache[id]) {
    pageCache[id] = PAGE_LOADERS[id]().catch(err => { delete pageCache[id]; throw err; });
  }
  return pageCache[id];
}
let navToken = 0;
import { store } from './utils/store.js';

let currentPage = 'home';
const pageContentEl = document.getElementById('page-content');

// Router
function navigateTo(pageId) {
  currentPage = pageId;

  try {
    if (window.location.hash !== '#' + pageId) {
      window.history.replaceState(null, '', '#' + pageId + (window.location.search || ''));
    }
  } catch (e) {}

  // Update nav active classes
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Close mobile menu immediately for snappy feel
  document.getElementById('nav-links')?.classList.remove('mobile-open');

  if (!PAGE_LOADERS[pageId]) pageId = 'home';
  currentPage = pageId;
  const token = ++navToken;
  pageContentEl.setAttribute('aria-busy', 'true');

  return loadPage(pageId).then(render => {
    if (token !== navToken) return; // a newer navigation won
    window.scrollTo(0, 0);
    if (pageId === 'home') render(pageContentEl, navigateTo);
    else render(pageContentEl);
    pageContentEl.removeAttribute('aria-busy');
    applyTranslations();
  }).catch(err => {
    console.error('Failed to load page', pageId, err);
    pageContentEl.removeAttribute('aria-busy');
    pageContentEl.innerHTML = '<div style="padding:48px;text-align:center"><p>Could not load this section. Please check your connection.</p><button class="control-btn" onclick="location.reload()">Retry</button></div>';
  });
}

// Prefetch the most-used pages when the browser is idle
function prefetchPages() {
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1500));
  idle(() => { ['kundali', 'panchang', 'dasha'].forEach(id => loadPage(id).catch(() => {})); });
}

// Theme Switcher
function initTheme() {
  const currentTheme = localStorage.getItem('astroveda_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme');
    const next = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('astroveda_theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

// Language Switcher
function initLanguage() {
  applyTranslations();
  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const lang = getLanguage() === 'en' ? 'hi' : 'en';
    setLanguage(lang);
    navigateTo(currentPage); // re-render active page
  });
}

// Mobile Menu
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const links = document.getElementById('nav-links');
  btn?.addEventListener('click', () => {
    links?.classList.toggle('mobile-open');
  });
}

// Navigation links setup
function initNavLinks() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });
}

// App Initialization
function initApp() {
  // Start cosmic animated canvas
  initCosmicCanvas('cosmic-canvas');

  // Themes & i18n
  initTheme();
  initLanguage();
  initMobileMenu();
  initNavLinks();
  initAstroGuruWidget(navigateTo);

  // Smart initial route from search params or hash
  const urlParams = new URLSearchParams(window.location.search || '');
  const pageParam = urlParams.get('page') || (window.location.hash ? window.location.hash.replace('#', '') : null);
  const isPdfView = urlParams.get('view') === 'pdf';

  let firstRoute = 'home';
  if (isPdfView || pageParam === 'kundali') firstRoute = 'kundali';
  else if (pageParam && PAGE_LOADERS[pageParam]) firstRoute = pageParam;

  // Reveal the app as soon as the first page has rendered (no artificial delay)
  const loadingScreen = document.getElementById('loading-screen');
  const appShell = document.getElementById('app-shell');
  navigateTo(firstRoute).finally(() => {
    appShell?.classList.remove('hidden');
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => loadingScreen.remove(), 400);
    }
    prefetchPages();
  });

  // Fonts that only some languages need are fetched after first paint
  loadDeferredFonts();
}

function loadDeferredFonts() {
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 2000));
  idle(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;700&family=Noto+Sans+Telugu:wght@400;700&display=swap';
    document.head.appendChild(link);
  });
}

// Back/forward support for hash routes
window.addEventListener('hashchange', () => {
  const id = window.location.hash.replace('#', '');
  if (id && id !== currentPage && PAGE_LOADERS[id]) navigateTo(id);
});

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
