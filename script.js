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

function openPlanModal(initialTargetId) {
  const modal = document.getElementById('plan-modal');
  if (!modal) return;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  setActivePlanPanel(initialTargetId || 'plan-admin');
}

function closePlanModal() {
  const modal = document.getElementById('plan-modal');
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function setActivePlanPanel(targetId) {
  if (!targetId) return;
  const panels = document.querySelectorAll('.plan-panel');
  panels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.id === targetId);
  });

  const links = document.querySelectorAll('.plan-sidebar-link');
  links.forEach((btn) => {
    btn.classList.toggle(
      'is-active',
      btn.getAttribute('data-plan-target') === targetId
    );
  });
}

function initPlanModal() {
  const triggerButtons = document.querySelectorAll('.track-plan-btn');
  if (!triggerButtons.length) return;

  triggerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-plan-target');
      openPlanModal(target);
    });
  });

  const modal = document.getElementById('plan-modal');
  if (!modal) return;

  modal.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.hasAttribute('data-plan-close') || target === modal) {
      closePlanModal();
    }
  });

  const closeBtn = modal.querySelector('.plan-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePlanModal);
  }

  const sidebarLinks = modal.querySelectorAll('.plan-sidebar-link');
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-plan-target');
      setActivePlanPanel(target);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const isOpen = modal.classList.contains('is-open');
      if (isOpen) {
        closePlanModal();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initThemeToggle();
  initYear();
  initPlanModal();
});
