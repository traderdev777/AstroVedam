import en from './en.js';
import hi from './hi.js';

const translations = { en, hi };
let currentLang = localStorage.getItem('astroveda_lang') || 'en';

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('astroveda_lang', lang);
    applyTranslations();
  }
}

export function t(path) {
  const keys = path.split('.');
  let val = translations[currentLang];
  for (let k of keys) {
    if (val && val[k]) val = val[k];
    else return path;
  }
  return val;
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  const langLabel = document.getElementById('lang-label');
  if (langLabel) {
    langLabel.textContent = currentLang === 'en' ? 'HI' : 'EN';
  }
}
