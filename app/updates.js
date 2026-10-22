/* Flags newer guidance wherever it appears. Study content follows the 2024
   course book; sentences that start with one of the markers below record a
   later change or a label that differs. They are rendered as a visible callout
   so a reader never mistakes the book's answer for current practice. */
(function () {
  'use strict';
  const MARKERS = [
    { text: 'Updated after the 2024 course:', label: 'Newer guidance' },
    { text: 'Current FDA labeling differs:', label: 'Label differs' }
  ];
  const ANY = new RegExp('(' + MARKERS.map(m => m.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')');
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION']);

  // A text node may carry several notes; each marker starts its own callout.
  function wrapTextNode(node) {
    const text = node.nodeValue;
    const parts = text.split(ANY);
    if (parts.length < 3) return;
    const parent = node.parentNode;
    if (parts[0].trim()) parent.insertBefore(document.createTextNode(parts[0]), node);
    for (let i = 1; i < parts.length; i += 2) {
      const marker = MARKERS.find(x => x.text === parts[i]);
      const span = document.createElement('span');
      span.className = 'update-note';
      span.setAttribute('role', 'note');
      const tag = document.createElement('span');
      tag.className = 'update-note-tag';
      tag.textContent = marker.label;
      span.appendChild(tag);
      span.appendChild(document.createTextNode(' ' + parts[i + 1].trim()));
      parent.insertBefore(span, node);
    }
    parent.removeChild(node);
  }

  function scan(root) {
    if (!root || root.nodeType !== 1 && root.nodeType !== 3) return;
    if (root.nodeType === 3) { if (root.parentNode && !root.parentNode.closest('.update-note')) wrapTextNode(root); return; }
    if (SKIP.has(root.tagName) || root.closest && root.closest('.update-note')) return;
    if (!ANY.test(root.textContent || '')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (ANY.test(n.nodeValue) && !SKIP.has(n.parentNode.tagName) && !n.parentNode.closest('.update-note')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const hits = [];
    while (walker.nextNode()) hits.push(walker.currentNode);
    hits.forEach(wrapTextNode);
  }

  function start() {
    scan(document.body);
    new MutationObserver(muts => {
      for (const m of muts) m.addedNodes.forEach(scan);
    }).observe(document.body, { childList: true, subtree: true });
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function renderList() {
    const el = document.getElementById('updatesList');
    const data = window.__updates || [];
    if (!el) return;
    if (!data.length) { el.innerHTML = '<p class="sp-cal-empty">No changes recorded yet.</p>'; return; }
    const groups = {};
    data.forEach(u => { (groups[u.domain] = groups[u.domain] || []).push(u); });
    el.innerHTML = Object.keys(groups).sort().map(d =>
      '<h3 class="updates-domain">' + esc(d) + ' <span class="updates-count">' + groups[d].length + '</span></h3>' +
      groups[d].sort((a, b) => String(b.date).localeCompare(String(a.date))).map(u =>
        '<article class="update-item"><div class="update-item-meta"><span class="update-note-tag">' + esc(u.kind === 'label' ? 'Label differs' : 'Newer guidance') + '</span><time>' + esc(u.date) + '</time></div>' +
        '<p class="update-item-change">' + esc(u.change) + '</p>' +
        '<p class="update-item-impact"><strong>For the exam:</strong> ' + esc(u.practice_impact) + '</p>' +
        '<p class="update-item-source">' + (u.url ? '<a href="' + esc(u.url) + '" target="_blank" rel="noopener">' + esc(u.source) + '</a>' : esc(u.source)) + '</p></article>'
      ).join('')
    ).join('');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { start(); renderList(); }); else { start(); renderList(); }
  window.BCPS_markUpdates = scan;
})();
