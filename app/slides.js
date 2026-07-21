/* Slides & Study Guides — list of R2-hosted PDFs. "Open" launches the browser's
   native PDF viewer in a new tab (best for a full slide deck); "Preview" toggles
   an inline <iframe> for a quick look without leaving the page. */
(function () {
  'use strict';
  var slides = window.__SLIDES || [];
  var base = window.__SLIDES_BASE || '';

  function render() {
    var el = document.getElementById('slideList');
    if (!el) return;
    if (!slides.length) {
      el.innerHTML = '<p class="sp-cal-empty">No slide decks added yet.</p>';
      return;
    }
    el.innerHTML = slides.map(function (s, i) {
      var url = base + encodeURIComponent(s.file);
      return (
        '<div class="slide-item">' +
        '<div class="slide-item-row">' +
        '<span class="icon-chip sm" style="--chip-c:var(--sec-slides);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg></span>' +
        '<div class="slide-item-info">' +
        '<div class="slide-item-title">' + s.title + '</div>' +
        '<span class="tag">' + s.area + '</span>' +
        '</div>' +
        '<a class="btn btn-primary slide-open-btn" href="' + url + '" target="_blank" rel="noopener">Open</a>' +
        '<button type="button" class="btn btn-secondary slide-preview-btn" onclick="window.BCPS_toggleSlidePreview(' + i + ')">Preview</button>' +
        '</div>' +
        '<div class="slide-preview-wrap" id="slide-preview-' + i + '"></div>' +
        '</div>'
      );
    }).join('');
  }

  var openIdx = null;
  window.BCPS_toggleSlidePreview = function (i) {
    var wrap = document.getElementById('slide-preview-' + i);
    if (!wrap) return;
    if (openIdx === i) { wrap.innerHTML = ''; openIdx = null; return; }
    if (openIdx != null) { var prev = document.getElementById('slide-preview-' + openIdx); if (prev) prev.innerHTML = ''; }
    var url = base + encodeURIComponent(slides[i].file);
    wrap.innerHTML = '<iframe src="' + url + '" class="slide-iframe" title="' + slides[i].title + '"></iframe>';
    openIdx = i;
  };

  window.addEventListener('bcps:tab', function (e) { if (e.detail === 'slides') render(); });
  document.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();
})();
