/* Responsive wayfinding and keyboard access, preserving the Warm Study Desk. */
(function () {
  'use strict';
  const compact = window.matchMedia('(max-width: 600px)');
  const secondary = ['concepts', 'accp', 'podcasts', 'slides'];
  function updateNavigation() {
    const active = document.querySelector('.section.active');
    if (!active) return;
    const more = MORE_SUBS.includes(active.id) || (compact.matches && secondary.includes(active.id));
    const id = more ? 'more' : active.id;
    document.querySelectorAll('.tab-bar .tab-btn').forEach(button => {
      const current = button.id === 'tab-' + id;
      button.classList.toggle('active', current);
      current ? button.setAttribute('aria-current', 'page') : button.removeAttribute('aria-current');
    });
  }
  // Each section is a history entry, so the browser's Back and Forward move
  // between sections instead of leaving the site. Home keeps the bare URL.
  const sectionIds = new Set([...document.querySelectorAll('.section[id]')].map(s => s.id));
  const urlFor = id => id === 'home' ? location.pathname + location.search : '#' + id;
  let fromHistory = false;
  const baseSwitch = window.switchSection;
  window.switchSection = function (id) {
    const current = history.state && history.state.section;
    if (!fromHistory && sectionIds.has(id) && current !== id) {
      try {
        history.replaceState(Object.assign({}, history.state, { y: window.scrollY }), '');
        history.pushState({ section: id, y: 0 }, '', urlFor(id));
      } catch (_) { /* history unavailable (sandboxed frame): sections still switch */ }
    }
    baseSwitch(id);
    updateNavigation();
    const section = document.getElementById(id);
    if (!section) return;
    const heading = section.querySelector('h2,h1') || section;
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  function showFromHistory(id, y) {
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    if (document.getElementById('spotlightOverlay').classList.contains('open')) window.closeSpotlight();
    fromHistory = true;
    try { window.switchSection(id); } finally { fromHistory = false; }
    if (y) window.scrollTo({ top: y, behavior: 'instant' });
  }
  window.addEventListener('popstate', event => {
    const id = (event.state && event.state.section) || location.hash.slice(1) || 'home';
    if (sectionIds.has(id)) showFromHistory(id, event.state && event.state.y);
  });
  compact.addEventListener('change', updateNavigation);
  secondary.forEach(id => {
    const tab = document.getElementById('tab-' + id);
    if (tab) tab.classList.add('compact-secondary');
    const section = document.getElementById(id);
    if (section) {
      const back = document.createElement('button');
      back.className = 'mobile-more-back'; back.textContent = '← More';
      back.onclick = () => window.switchSection('more'); section.prepend(back);
    }
  });
  document.querySelectorAll('.chapter-card h3').forEach((heading, i) => {
    heading.removeAttribute('onclick');
    const card = heading.closest('.chapter-card'), body = card.querySelector('.chapter-card-body');
    if (!body) return;
    const button = document.createElement('button');
    button.className = 'chapter-toggle'; button.type = 'button';
    button.innerHTML = heading.innerHTML; heading.replaceChildren(button);
    body.id = 'chapter-body-' + i; button.setAttribute('aria-controls', body.id);
    const sync = () => button.setAttribute('aria-expanded', String(card.classList.contains('open')));
    button.onclick = () => { card.classList.toggle('open'); sync(); };
    new MutationObserver(sync).observe(card, { attributes: true, attributeFilter: ['class'] }); sync();
  });
  document.querySelectorAll('.header [onclick]:not(button)').forEach(element => {
    element.setAttribute('role', 'button'); element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', 'AinaDara home');
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); element.click(); }
    });
  });
  const overlay = document.getElementById('spotlightOverlay');
  overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', 'Search study material');
  document.getElementById('spotlightInput').setAttribute('aria-label', 'Search questions, drugs, cards, and chapters');
  const searchButton = document.querySelector('.search-btn');
  const baseOpenSearch = window.openSpotlight, baseCloseSearch = window.closeSpotlight;
  const hideSearch = () => { overlay.inert = true; overlay.setAttribute('aria-hidden', 'true'); };
  window.openSpotlight = function () { overlay.inert = false; overlay.removeAttribute('aria-hidden'); baseOpenSearch(); };
  window.closeSpotlight = function () { baseCloseSearch(); hideSearch(); searchButton.focus(); };
  hideSearch();
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Tab') { event.preventDefault(); document.getElementById('spotlightInput').focus(); }
    if (event.key === 'Escape') { closeSpotlight(); searchButton.focus(); }
  });
  document.getElementById('importCodeMsg').setAttribute('role', 'status');
  updateNavigation();
  // Open the section named in the URL (a shared or reloaded link), and mark the first entry.
  const start = location.hash.slice(1);
  try {
    if (sectionIds.has(start) && start !== 'home') {
      history.replaceState({ section: start, y: 0 }, '', '#' + start);
      showFromHistory(start, 0);
    } else if (!history.state || !history.state.section) {
      history.replaceState({ section: 'home', y: 0 }, '', start && !sectionIds.has(start) ? location.href : urlFor('home'));
    }
  } catch (_) { /* no history API: the page still works without Back support */ }
})();
