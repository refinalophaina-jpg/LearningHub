/* Home page: annotate module cards with saved quiz scores and show overall progress. */
(function () {
  var store;
  try { store = JSON.parse(localStorage.getItem('lh-progress')) || {}; }
  catch (e) { store = {}; }

  var cards = document.querySelectorAll('a.card[data-slug]');
  var attempted = 0, mastered = 0;

  cards.forEach(function (card) {
    var slug = card.getAttribute('data-slug');
    var rec = store[slug];
    var badge = document.createElement('span');
    badge.className = 'card-badge';
    if (rec && rec.total) {
      attempted++;
      badge.textContent = 'Best: ' + rec.best + '/' + rec.total;
      if (rec.best === rec.total) { badge.classList.add('done'); mastered++; }
      else { badge.classList.add('partial'); }
    } else {
      badge.textContent = 'Not started';
    }
    card.appendChild(badge);
  });

  var wrap = document.getElementById('overall-progress');
  if (wrap && cards.length) {
    var pct = Math.round((attempted / cards.length) * 100);
    wrap.querySelector('.progress-text').textContent =
      attempted + ' of ' + cards.length + ' modules attempted · ' + mastered + ' mastered (100%)';
    wrap.querySelector('.progress-bar > div').style.width = pct + '%';
  }
})();
