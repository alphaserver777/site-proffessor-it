const root = document.documentElement;

function getStoredTheme() {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* ignore */
  }
}

function setTheme(theme) {
  const normalized = theme === 'light' ? 'light' : 'dark';
  root.setAttribute('data-theme', normalized);
  storeTheme(normalized);
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored) {
    setTheme(stored);
    return;
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')
    .matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initThemeToggle();
  initYear();
});

