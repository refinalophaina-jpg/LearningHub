/* Evidence-based study features, additive to app.js (loaded after it).
   Hooks the app's existing global functions (renderQuestion, answerQuestion,
   loadQuestion, getFilteredQuiz, switchSection's "bcps:tab" event) rather than
   touching app.js internals — this file owns its own localStorage keys and can
   be removed without breaking the base app.
   Source: docs/reviews/2026-07-20-study-features-spec.md (R1-R5). */
(function () {
  'use strict';

  var LS = {
    examDate: 'bcps_exam_date',
    quizSrs: 'bcps_quiz_srs_20261019',
    confLog: 'bcps_confidence_log_20261019',
    mockHistory: 'bcps_mock_history',
    mockSession: 'bcps_mock_session_20261019',
  };

  function todayStr() { var d = new Date(); return d.toISOString().slice(0, 10); }
  function addDays(dateStr, n) { var d = new Date(dateStr + 'T00:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
  function daysBetween(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000); }
  function readJSON(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }
  function writeJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { } }

  // Changed question meanings must not inherit mastery from an older item.
  // Keep legacy stores intact and migrate only unchanged question records.
  (function migrateQuestionRevision() {
    var changed = new Set([0, 52, 88, 95, 158, 166, 169, 171, 188, 198, 218, 241, 246, 258, 267, 272, 273, 296, 300, 305, 311, 320, 350, 372, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448]);
    try {
      if (localStorage.getItem(LS.quizSrs) === null) {
        var old = readJSON('bcps_quiz_srs', {}), next = {};
        Object.keys(old).forEach(function (k) { if (!changed.has(Number(k))) next[k] = old[k]; });
        writeJSON(LS.quizSrs, next);
      }
      if (localStorage.getItem(LS.confLog) === null) {
        var log = readJSON('bcps_confidence_log', []);
        writeJSON(LS.confLog, Array.isArray(log) ? log.filter(function (r) { return !changed.has(Number(r.i)); }) : []);
      }
    } catch (e) { /* Storage may be unavailable; practice remains usable. */ }
  })();

  // ── Exam date anchor (R3) ──────────────────────────────────────────────
  function getExamDate() { return localStorage.getItem(LS.examDate) || null; }
  function setExamDate(dateStr) { if (dateStr) localStorage.setItem(LS.examDate, dateStr); else localStorage.removeItem(LS.examDate); renderStudyPlan(); }
  function daysToExam() { var d = getExamDate(); if (!d) return null; return daysBetween(todayStr(), d); }
  function capToExam(dueStr) {
    var d = getExamDate();
    if (!d) return dueStr;
    return dueStr > d ? d : dueStr;
  }
  window.BCPS_setExamDate = setExamDate;

  // ── Quiz missed-question spaced queue (R1) ──────────────────────────────
  // entry: { streak, lastSeenDate, due, graduated }
  var STAGE_DAYS = [3, 7]; // streak 1 -> next due in 3d; streak reaches 2 -> graduate

  function getSrsStore() { return readJSON(LS.quizSrs, {}); }
  function saveSrsStore(s) { writeJSON(LS.quizSrs, s); }

  function recordQuizResult(qIdx, correct, confidence) {
    var store = getSrsStore();
    var key = String(qIdx);
    var entry = store[key];
    var today = todayStr();

    if (!correct) {
      store[key] = { streak: 0, lastSeenDate: today, due: addDays(today, 1), graduated: false };
    } else if (entry && !entry.graduated) {
      if (entry.lastSeenDate === today) {
        // same-day repeat — don't let re-testing within one session fake mastery
        store[key] = entry;
      } else {
        var streak = (entry.streak || 0) + 1;
        if (streak >= 2) {
          store[key] = { streak: streak, lastSeenDate: today, due: null, graduated: true };
        } else {
          var days = STAGE_DAYS[streak - 1] || STAGE_DAYS[STAGE_DAYS.length - 1];
          store[key] = { streak: streak, lastSeenDate: today, due: capToExam(addDays(today, days)), graduated: false };
        }
      }
    } else if (!entry && confidence === 'guess') {
      // correct but a pure guess — worth a light follow-up even though it wasn't "missed"
      store[key] = { streak: 0, lastSeenDate: today, due: capToExam(addDays(today, 2)), graduated: false };
    }
    // else: never missed, not a guess, answered correctly — not part of this queue.
    saveSrsStore(store);
  }

  function getDueIndices() {
    var store = getSrsStore();
    var today = todayStr();
    var due = [];
    Object.keys(store).forEach(function (k) {
      var e = store[k];
      if (e && !e.graduated && e.due && e.due <= today) due.push(Number(k));
    });
    return due;
  }
  function getQueueCounts() {
    var store = getSrsStore();
    var today = todayStr(), due = 0, upcoming = 0, graduated = 0;
    Object.keys(store).forEach(function (k) {
      var e = store[k];
      if (!e) return;
      if (e.graduated) graduated++;
      else if (e.due && e.due <= today) due++;
      else upcoming++;
    });
    return { due: due, upcoming: upcoming, graduated: graduated, total: due + upcoming + graduated };
  }

  // ── Reset controls (R1) ─────────────────────────────────────────────────
  // The spaced-review queue is easy to seed by accident (one missed practice
  // question), so give it an explicit clear. Quiz scores live elsewhere and
  // are untouched.
  window.BCPS_resetSRS = function () {
    if (!confirm('Clear the spaced-review queue? Questions you\'ve missed will stop resurfacing on a schedule. Your quiz scores and streak are not affected.')) return;
    try { localStorage.removeItem(LS.quizSrs); } catch (e) {}
    window._srsForceSet = null;
    renderDueBanner();
    renderStudyPlan();
  };
  // Clears everything this file owns (used by the global "Reset Everything").
  window.BCPS_resetStudyData = function () {
    [LS.quizSrs, LS.confLog, LS.mockHistory, LS.mockSession, LS.examDate, 'bcps_quiz_srs', 'bcps_confidence_log', 'bcps_mock_result_v1', 'bcps_mock_session_20261019_v2', 'bcps_mock_result_v2'].forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    window._srsForceSet = null;
    renderDueBanner();
    renderStudyPlan();
    if (typeof window.BCPS_clearMockState === 'function') window.BCPS_clearMockState();
  };

  window._srsForceSet = null; // when set (array), loadQuestion pulls only from these indices
  window.startDueReview = function () {
    var due = getDueIndices();
    if (!due.length) return;
    window._srsForceSet = due.slice();
    switchSection('quiz');
    if (typeof resetScore === 'function') resetScore(); else loadQuestion();
    renderDueBanner();
  };

  function renderDueBanner() {
    var el = document.getElementById('dueTodayBanner');
    if (!el) return;
    if (window._srsForceSet && window._srsForceSet.length) {
      el.innerHTML =
        '<div class="due-banner">' +
        '<span><strong>' + window._srsForceSet.length + '</strong> due for spaced review — questions you\'ve missed before, resurfacing on schedule.</span>' +
        '<button class="btn btn-secondary" onclick="window._srsForceSet=null;window.renderDueBanner();loadQuestion();">Exit review</button>' +
        '</div>';
      return;
    }
    var c = getQueueCounts();
    if (c.due > 0) {
      el.innerHTML =
        '<div class="due-banner">' +
        '<span><strong>' + c.due + '</strong> question' + (c.due === 1 ? '' : 's') + ' due for spaced review today.</span>' +
        '<button class="btn btn-primary" onclick="window.startDueReview()">Review now</button>' +
        '<button class="btn btn-secondary" onclick="window.BCPS_resetSRS()" title="Clear the spaced-review queue">Clear</button>' +
        '</div>';
    } else {
      el.innerHTML = '';
    }
  }
  window.renderDueBanner = renderDueBanner;

  // ── Confidence capture + calibration (R2) ───────────────────────────────
  var _pendingConfidence = null;

  function confidenceRowHTML() {
    return '<div class="conf-row" role="group" aria-label="Rate your confidence before answering">' +
      '<span class="conf-label">Confidence:</span>' +
      '<button type="button" class="conf-btn" data-c="guess" onclick="window._setConfidence(this,\'guess\')">Guess</button>' +
      '<button type="button" class="conf-btn" data-c="fair" onclick="window._setConfidence(this,\'fair\')">Fairly sure</button>' +
      '<button type="button" class="conf-btn" data-c="certain" onclick="window._setConfidence(this,\'certain\')">Certain</button>' +
      '</div>';
  }
  window._setConfidence = function (btn, val) {
    _pendingConfidence = val;
    var row = btn.closest('.conf-row');
    if (row) { Array.prototype.forEach.call(row.querySelectorAll('.conf-btn'), function (b) { b.classList.toggle('active', b === btn); }); }
  };

  function logConfidence(qIdx, topic, correct, confidence) {
    if (!confidence) return; // skipped — don't pollute calibration stats with unrated answers
    var log = readJSON(LS.confLog, []);
    log.push({ i: qIdx, topic: topic || null, correct: !!correct, c: confidence, d: todayStr() });
    if (log.length > 1000) log = log.slice(-1000);
    writeJSON(LS.confLog, log);
  }

  function calibrationSummary() {
    var log = readJSON(LS.confLog, []);
    var buckets = { guess: { c: 0, t: 0 }, fair: { c: 0, t: 0 }, certain: { c: 0, t: 0 } };
    log.forEach(function (r) { if (buckets[r.c]) { buckets[r.c].t++; if (r.correct) buckets[r.c].c++; } });
    var overconfident = buckets.certain.t >= 5 && (buckets.certain.c / buckets.certain.t) < 0.75;
    return { buckets: buckets, total: log.length, overconfident: overconfident };
  }

  // ── Hook: renderQuestion — inject the confidence row ────────────────────
  var _origRenderQuestion = window.renderQuestion;
  window.renderQuestion = function (q) {
    _pendingConfidence = null;
    _origRenderQuestion(q);
    var card = document.querySelector('#questionContainer .question-card');
    var opts = card && card.querySelector('.options');
    if (opts) opts.insertAdjacentHTML('beforebegin', confidenceRowHTML());
  };

  // ── Hook: answerQuestion — record SRS + confidence log ──────────────────
  var _origAnswerQuestion = window.answerQuestion;
  window.answerQuestion = function (btn, chosen, correct, card, optsExp) {
    var q = window._currentQ;
    var qIdx = q ? quizData.indexOf(q) : -1;
    var isCorrect = (chosen === correct);
    var confidence = _pendingConfidence;
    _origAnswerQuestion(btn, chosen, correct, card, optsExp);
    if (qIdx >= 0) {
      recordQuizResult(qIdx, isCorrect, confidence);
      logConfidence(qIdx, q.topic || q.domain, isCorrect, confidence);
    }
    // if this was a forced due-review session, drop the item once answered
    if (window._srsForceSet) {
      window._srsForceSet = window._srsForceSet.filter(function (i) { return i !== qIdx; });
      renderDueBanner();
    }
    renderStudyPlan();
  };

  // ── Hook: loadQuestion — due-review restriction + interleave-by-default (R4) ──
  var _recentTopics = [];
  var _origLoadQuestion = window.loadQuestion;
  window.loadQuestion = function () {
    if (window._srsForceSet && window._srsForceSet.length) {
      var forced = window._srsForceSet.map(function (i) { return quizData[i]; }).filter(Boolean);
      if (!forced.length) { window._srsForceSet = null; renderDueBanner(); return _origLoadQuestion(); }
      var q = forced[Math.floor(Math.random() * forced.length)];
      renderQuestion(q);
      return;
    }
    if (typeof getFilteredQuiz !== 'function') return _origLoadQuestion();
    var pool = getFilteredQuiz();
    if (!pool.length) return _origLoadQuestion();
    // prefer a topic different from the last 2 shown, when the pool allows it
    var candidates = pool.filter(function (p) { return _recentTopics.indexOf(p.topic) === -1; });
    if (!candidates.length) candidates = pool;
    var pick = candidates[Math.floor(Math.random() * candidates.length)];
    _recentTopics.push(pick.topic);
    if (_recentTopics.length > 2) _recentTopics.shift();
    renderQuestion(pick);
  };

  // ── Study Plan panel (home) ─────────────────────────────────────────────
  function renderStudyPlan() {
    var el = document.getElementById('studyPlanPanel');
    if (!el) return;
    var exam = getExamDate();
    var dte = daysToExam();
    var q = getQueueCounts();
    var cal = calibrationSummary();

    var examRow = exam
      ? '<div class="sp-exam-set"><span>Exam date: <strong>' + exam + '</strong>' +
        (dte != null ? (dte >= 0 ? ' · <strong>' + dte + '</strong> days to go' : ' · exam has passed') : '') + '</span>' +
        '<button class="sp-link-btn" onclick="window.BCPS_setExamDate(null)">Clear</button></div>'
      : '<div class="sp-exam-set"><label for="spExamDate" style="font-size:13px;color:var(--label2);">Set your exam date to pace reviews:</label>' +
        '<input type="date" id="spExamDate" style="margin-left:8px;">' +
        '<button class="btn btn-primary" style="padding:6px 12px;font-size:12.5px;margin-left:6px;" onclick="window.BCPS_setExamDate(document.getElementById(\'spExamDate\').value)">Set</button></div>';

    var calRow = cal.total >= 5
      ? '<div class="sp-cal">' +
        '<span class="sp-cal-item">Guess: <strong>' + (cal.buckets.guess.t ? Math.round(100 * cal.buckets.guess.c / cal.buckets.guess.t) : 0) + '%</strong></span>' +
        '<span class="sp-cal-item">Fairly sure: <strong>' + (cal.buckets.fair.t ? Math.round(100 * cal.buckets.fair.c / cal.buckets.fair.t) : 0) + '%</strong></span>' +
        '<span class="sp-cal-item">Certain: <strong>' + (cal.buckets.certain.t ? Math.round(100 * cal.buckets.certain.c / cal.buckets.certain.t) : 0) + '%</strong></span>' +
        (cal.overconfident ? '<span class="sp-cal-warn">You\'re less accurate than your confidence suggests on "Certain" answers — worth a second look before test day.</span>' : '') +
        '</div>'
      : '<p class="sp-cal-empty">Rate your confidence while answering quiz questions to build a calibration picture here.</p>';

    el.innerHTML =
      '<div class="progress-wrap sp-wrap">' +
      '<b>Study plan</b>' +
      examRow +
      '<div class="sp-queue">' +
      '<span class="sp-queue-item"><strong>' + q.due + '</strong> due today</span>' +
      '<span class="sp-queue-item"><strong>' + q.upcoming + '</strong> upcoming</span>' +
      '<span class="sp-queue-item"><strong>' + q.graduated + '</strong> mastered</span>' +
      (q.due > 0 ? '<button class="btn btn-primary" style="padding:6px 12px;font-size:12.5px;" onclick="window.startDueReview()">Review due questions</button>' : '') +
      (q.total > 0 ? '<button class="sp-link-btn" onclick="window.BCPS_resetSRS()" title="Clear the spaced-review queue">Reset queue</button>' : '') +
      '</div>' +
      '<div class="sp-cal-wrap"><b style="font-size:12.5px;color:var(--label3);text-transform:uppercase;letter-spacing:.06em;">Confidence calibration</b>' + calRow + '</div>' +
      readinessHTML() +
      '</div>';
  }
  window.renderStudyPlan = renderStudyPlan;

  window.addEventListener('bcps:tab', function (e) {
    if (e.detail === 'home') renderStudyPlan();
    if (e.detail === 'quiz') renderDueBanner();
  });

  document.addEventListener('DOMContentLoaded', function () {
    renderStudyPlan();
    renderDueBanner();
  });
  if (document.readyState !== 'loading') { renderStudyPlan(); renderDueBanner(); }

  // ── Timed mock exam + readiness meter (R5) ──────────────────────────────
  var MOCK_MIN_TIMED_ITEMS = 1; // readiness band withheld until this much timed volume exists
  var AREA_LABEL = { '1': 'Area 1: Patient Care', '2': 'Area 2: Therapeutics & Management', '3': 'Area 3: Professional Practice' };

  function getMockHistory() { var h=readJSON(LS.mockHistory, []); return Array.isArray(h)?h.filter(function(a){return a && Number.isFinite(a.total) && a.total>0 && Number.isFinite(a.pct);}):[]; }
  function saveMockAttempt(attempt) {
    var h = getMockHistory(); h.push(attempt);
    if (h.length > 30) h = h.slice(-30);
    writeJSON(LS.mockHistory, h);
  }
  function timedItemTotal() { return getMockHistory().reduce(function (n, a) { return n + a.total; }, 0); }

  function readinessBand() {
    var h = getMockHistory();
    if (!h.length || timedItemTotal() < MOCK_MIN_TIMED_ITEMS) return null;
    var recent = h.slice(-3);
    var pct = recent.reduce(function (s, a) { return s + a.pct; }, 0) / recent.length;
    var band = 'Recent practice accuracy';
    var cls = pct < 60 ? 'not-ready' : pct < 70 ? 'borderline' : 'ready';
    return { pct: Math.round(pct), band: band, cls: cls, attempts: h.length };
  }

  function readinessHTML() {
    var r = readinessBand();
    var wrap = '<div class="sp-readiness-wrap">';
    wrap += '<b style="font-size:12.5px;color:var(--label3);text-transform:uppercase;letter-spacing:.06em;">Timed practice history</b>';
    if (!r) {
      wrap += '<p class="sp-cal-empty">Complete a timed session in Mock Exam to see your practice results here. On a phone, open More → Timed practice.</p>';
    } else {
      wrap += '<div class="sp-readiness ' + r.cls + '"><span class="sp-readiness-band">' + r.band + '</span><span class="sp-readiness-pct">' + r.pct + '% avg, last ' + Math.min(3, r.attempts) + ' timed attempt' + (r.attempts > 1 ? 's' : '') + '</span></div>';
      wrap += '<p class="sp-cal-empty">Your recent practice results. Different session modes and earlier question versions may not be directly comparable.</p>';
    }
    wrap += '</div>';
    return wrap;
  }

})();
