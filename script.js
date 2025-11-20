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

    if (target === modal || target.closest('[data-plan-close]')) {
      closePlanModal();
    }
  });

  const closeButtons = modal.querySelectorAll('[data-plan-close]');
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', closePlanModal);
  });

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

function initMobileMenu() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!nav || !toggle) return;

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    nav.classList.add('is-open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.closest('.nav-link')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

function initCtaPopup() {
  const popup = document.getElementById('cta-popup');
  if (!popup) return;

  let dismissed = false;
  try {
    dismissed = localStorage.getItem('cta_popup_dismissed') === '1';
  } catch {
    dismissed = false;
  }

  if (dismissed) return;

  const backdrop = popup.querySelector('.cta-popup-backdrop');
  const closeBtn = popup.querySelector('[data-cta-close]');
  let hasOpened = false;

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    try {
      localStorage.setItem('cta_popup_dismissed', '1');
    } catch {
      /* ignore */
    }
  }

  function openPopup() {
    if (hasOpened) return;
    hasOpened = true;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
  }

  if (backdrop) {
    backdrop.addEventListener('click', closePopup);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  popup.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.closest('[data-cta-close]')) {
      closePopup();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.classList.contains('is-open')) {
      closePopup();
    }
  });

  setTimeout(openPopup, 20000);

  function handleScroll() {
    if (hasOpened) return;
    const docHeight = document.documentElement.scrollHeight;
    const viewportBottom = window.scrollY + window.innerHeight;
    if (viewportBottom >= docHeight / 2) {
      openPopup();
      window.removeEventListener('scroll', handleScroll);
    }
  }

  window.addEventListener('scroll', handleScroll);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initThemeToggle();
  initYear();
  initPlanModal();
  initMobileMenu();
  initCtaPopup();
});
