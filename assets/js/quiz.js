/* Renders the practice quiz defined by window.LH_QUIZ on module pages and
   saves best scores to localStorage (per-browser, no accounts or network). */
(function () {
  var root = document.getElementById('quiz-root');
  var mount = document.getElementById('quiz');
  if (!root || !mount || !window.LH_QUIZ) return;

  var slug = root.getAttribute('data-slug');
  var questions = window.LH_QUIZ.questions || [];
  var STORE_KEY = 'lh-progress';

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveResult(score) {
    var store = loadStore();
    var prev = store[slug] || { best: 0, attempts: 0 };
    store[slug] = {
      best: Math.max(prev.best, score),
      last: score,
      total: questions.length,
      attempts: (prev.attempts || 0) + 1
    };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {}
  }

  function render() {
    mount.innerHTML = '';
    var score = 0, answered = 0;

    questions.forEach(function (item, qi) {
      var card = document.createElement('div');
      card.className = 'quiz-q';

      var stem = document.createElement('p');
      stem.className = 'stem';
      stem.textContent = (qi + 1) + '. ' + item.q;
      card.appendChild(stem);

      var buttons = [];
      item.opts.forEach(function (opt, oi) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-opt';
        btn.textContent = String.fromCharCode(65 + oi) + '. ' + opt;
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) { b.disabled = true; });
          buttons[item.a].classList.add('correct');
          if (oi === item.a) { score++; } else { btn.classList.add('incorrect'); }
          explain.classList.add('show');
          answered++;
          if (answered === questions.length) finish(score);
        });
        buttons.push(btn);
        card.appendChild(btn);
      });

      var explain = document.createElement('div');
      explain.className = 'quiz-explain';
      explain.textContent = item.why;
      card.appendChild(explain);

      mount.appendChild(card);
    });

    var result = document.createElement('div');
    result.className = 'quiz-result';
    result.id = 'quiz-result';
    mount.appendChild(result);

    function finish(finalScore) {
      saveResult(finalScore);
      var best = loadStore()[slug].best;
      result.innerHTML =
        '<div class="score">' + finalScore + ' / ' + questions.length + '</div>' +
        '<p>Best so far in this browser: ' + best + ' / ' + questions.length + '.</p>';
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn';
      retry.textContent = 'Retake quiz';
      retry.addEventListener('click', render);
      result.appendChild(retry);
      result.classList.add('show');
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  render();
})();
