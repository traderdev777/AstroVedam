import { renderAstroGuruPage } from './pages/AstroGuru.js';
import { initAstroGuruWidget } from './components/ui/AstroGuruWidget.js';
/**
 * AstroVeda - Main Application Controller
 * Premium Vedic Astrology, Numerology & Vaastu Shastra Web Application
 */

import './styles/index.css';
import { initCosmicCanvas } from './utils/cosmicCanvas.js';
import { getLanguage, setLanguage, applyTranslations } from './i18n/index.js';
import { renderHomePage } from './pages/Home.js';
import { renderKundaliPage } from './pages/Kundali.js';
import { renderDashaPage } from './pages/Dasha.js';
import { renderPanchangPage } from './pages/Panchang.js';
import { renderMuhurtaPage } from './pages/Muhurta.js';
import { renderMatchingPage } from './pages/Matching.js';
import { renderNumerologyPage } from './pages/Numerology.js';
import { renderVaastuPage } from './pages/Vaastu.js';
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

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Render Page
  switch (pageId) {
    case 'home':
      renderHomePage(pageContentEl, navigateTo);
      break;
    case 'kundali':
      renderKundaliPage(pageContentEl);
      break;
    case 'dasha':
      renderDashaPage(pageContentEl);
      break;
    case 'panchang':
      renderPanchangPage(pageContentEl);
      break;
    case 'muhurta':
      renderMuhurtaPage(pageContentEl);
      break;
    case 'matching':
      renderMatchingPage(pageContentEl);
      break;
    case 'numerology':
      renderNumerologyPage(pageContentEl);
      break;
    case 'vaastu':
      renderVaastuPage(pageContentEl);
      break;
    case 'astroguru':
      renderAstroGuruPage(pageContentEl);
      break;
    default:
      renderHomePage(pageContentEl, navigateTo);
  }

  // Close mobile menu if open
  document.getElementById('nav-links')?.classList.remove('mobile-open');

  // Apply translations to static page attributes
  applyTranslations();
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

  if (isPdfView || pageParam === 'kundali') {
    navigateTo('kundali');
  } else if (pageParam && ['home', 'kundali', 'dasha', 'panchang', 'muhurta', 'matching', 'numerology', 'vaastu', 'astroguru'].includes(pageParam)) {
    navigateTo(pageParam);
  } else {
    navigateTo('home');
  }

  // Dismiss loading screen gracefully
  const loadingScreen = document.getElementById('loading-screen');
  const appShell = document.getElementById('app-shell');

  setTimeout(() => {
    if (loadingScreen && appShell) {
      loadingScreen.classList.add('fade-out');
      appShell.classList.remove('hidden');
      setTimeout(() => {
        loadingScreen.remove();
      }, 800);
    }
  }, 1200);
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
