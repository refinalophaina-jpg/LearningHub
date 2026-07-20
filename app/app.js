/* Offline stub — Supabase removed; progress lives in localStorage + the progress code. */
(function(){
  var sel=function(){var b={eq:function(){return b;},order:function(){return b;},limit:function(){return b;},maybeSingle:async function(){return {data:null,error:null};},then:function(res){return res({data:[],error:null});}};return b;};
  var from=function(){return {upsert:async function(){return {error:null};},insert:async function(){return {error:null};},delete:function(){return sel();},select:sel};};
  var client={auth:{signUp:async function(){return {data:{user:null},error:null};},signInWithPassword:async function(){return {data:{user:null},error:{message:'Sign-in is off — your progress is saved on this device. Use the progress code to move between devices.'}};},signOut:async function(){return {error:null};},getUser:async function(){return {data:{user:null}};},getSession:async function(){return {data:{session:null}};},refreshSession:async function(){return {data:{session:null},error:null};},onAuthStateChange:function(){return {data:{subscription:{unsubscribe:function(){}}}};}},from:from};
  window.supabase={createClient:function(){return client;}};
  window.sbUser=async function(){return null;};
  window.sbSignUp=async function(){return {};};
  window.sbSignIn=async function(){return {error:{message:'disabled'}};};
  window.sbSignOut=async function(){return {};};
  window.sbMarkAccpReviewed=async function(){};
  window.sbLoadAccpProgress=async function(){return {};};
  window.sbSaveQuizAttempt=async function(){};
  window.sbSaveFlashProgress=async function(){};
  window.sbLoadFlashProgress=async function(){return null;};
  window.sbSaveQuizState=async function(){};
  window.sbLoadQuizState=async function(){return null;};
})();


(function() {
  const _SB_URL = '';
  const _SB_KEY = '';
  const _sb = supabase.createClient(_SB_URL, _SB_KEY);

  // ── Auth helpers ───────────────────────────────────────────────────────
  window.sbSignUp = async (email, password) => _sb.auth.signUp({email, password});
  window.sbSignIn = async (email, password) => _sb.auth.signInWithPassword({email, password});
  window.sbSignOut = async () => _sb.auth.signOut();
  window.sbUser   = async () => (await _sb.auth.getUser()).data.user;

  // ── ACCP progress ──────────────────────────────────────────────────────
  window.sbMarkAccpReviewed = async (questionNum) => {
    const user = await window.sbUser();
    if (!user) return;
    await _sb.from('accp_progress').upsert({
      user_id: user.id,
      question_num: questionNum,
      reviewed: true,
      updated_at: new Date().toISOString()
    }, {onConflict: 'user_id,question_num'});
  };

  window.sbLoadAccpProgress = async () => {
    const user = await window.sbUser();
    if (!user) return {};
    const { data } = await _sb.from('accp_progress')
      .select('question_num')
      .eq('user_id', user.id)
      .eq('reviewed', true);
    const result = {};
    (data || []).forEach(r => { result[r.question_num] = true; });
    return result;
  };

  // ── Quiz attempt logging ───────────────────────────────────────────────
  window.sbSaveQuizAttempt = async (questionId, domain, correct, chosenIdx) => {
    const user = await window.sbUser();
    if (!user) return;
    await _sb.from('quiz_attempts').insert({
      user_id: user.id,
      question_id: String(questionId),
      domain: domain || null,
      correct: !!correct,
      chosen_idx: chosenIdx
    });
  };

  // ── Flashcard spaced-repetition progress ──────────────────────────────
  window.sbSaveFlashProgress = async (srState, streakData) => {
    const user = await window.sbUser();
    if (!user) return;
    await _sb.from('flash_progress').upsert({
      user_id: user.id,
      sr_state: srState,
      streak_data: streakData,
      updated_at: new Date().toISOString()
    }, {onConflict: 'user_id'});
  };

  window.sbLoadFlashProgress = async () => {
    const user = await window.sbUser();
    if (!user) return null;
    const { data, error } = await _sb.from('flash_progress')
      .select('sr_state, streak_data')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !data) return null;
    return { srState: data.sr_state || {}, streakData: data.streak_data || {} };
  };

  // ── Quiz used-question state (resume where you left off) ───────────────
  window.sbSaveQuizState = async (usedQsArr) => {
    const user = await window.sbUser();
    if (!user) return;
    const indices = usedQsArr.map(q => {
      if (typeof quizData !== 'undefined') return quizData.indexOf(q);
      return -1;
    }).filter(i => i >= 0);
    await _sb.from('quiz_state').upsert({
      user_id: user.id,
      used_questions: indices,
      updated_at: new Date().toISOString()
    }, {onConflict: 'user_id'});
  };

  window.sbLoadQuizState = async () => {
    const user = await window.sbUser();
    if (!user) return null;
    const { data, error } = await _sb.from('quiz_state')
      .select('used_questions')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !data || !data.used_questions) return null;
    if (typeof quizData === 'undefined') return null;
    return data.used_questions.map(i => quizData[i]).filter(Boolean);
  };

  // ── Auth state listener — load ACCP + flash progress on sign-in ────────
  _sb.auth.onAuthStateChange((event, session) => {
    const user = session ? session.user : null;
    if (user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
      // Load ACCP progress
      if (typeof sbLoadAccpProgress === 'function' && window._accpInitDone) {
        sbLoadAccpProgress().then(saved => {
          if (saved && window._accpReviewed) Object.assign(window._accpReviewed, saved);
        }).catch(()=>{});
      }
      // Load flashcard SR state
      if (typeof sbLoadFlashProgress === 'function') {
        sbLoadFlashProgress().then(data => {
          if (data && data.srState && Object.keys(data.srState).length) {
            if (typeof srState !== 'undefined') {
              srState = data.srState;
              if (data.streakData && typeof streakData !== 'undefined') streakData = data.streakData;
              localStorage.setItem('bcps_sr_v2', JSON.stringify(srState));
              localStorage.setItem('bcps_streak_v1', JSON.stringify(streakData));
              if (typeof flashInitialized !== 'undefined' && flashInitialized && typeof buildDeck === 'function') buildDeck();
            }
          }
        }).catch(()=>{});
      }
      // Load quiz resume state
      if (typeof sbLoadQuizState === 'function') {
        sbLoadQuizState().then(saved => {
          if (saved && saved.length && typeof usedQuestions !== 'undefined') usedQuestions = saved;
        }).catch(()=>{});
      }
    }
  });
})();

;
/* ───── next block ───── */

// ── DATA ──────────────────────────────────────────────────────────────────
const quizData = JSON.parse(({textContent: JSON.stringify(window.__quizData)}).textContent);
const flashData = JSON.parse(({textContent: JSON.stringify(window.__flashData)}).textContent);

// ── NAVIGATION ────────────────────────────────────────────────────────────
function switchSection(id) {
  try{window.dispatchEvent(new CustomEvent("bcps:tab",{detail:id}));}catch(e){}
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  const tb = document.getElementById('tab-'+id);
  if (tb) tb.classList.add('active');
  if (id === 'quiz' && !quizInitialized) initQuiz();
  if (id === 'flash' && !flashInitialized) initFlash();
  if (id === 'concepts' && !window._drugInitDone) { window._drugInitDone = true; drugInit(); }
  if (id === 'visuals') { setTimeout(()=>{initVisuals();},100); }
  if (id === 'exampsych') { setTimeout(()=>{initEpDrills(); calcTiming();},100); }
  if (id === 'evidence' && !evidenceInitialized) initEvidence();
  if (id === 'accp' && !window._accpInitDone) { window._accpInitDone=true; initAccpReview(); }
}

// ── STUDY GUIDE ───────────────────────────────────────────────────────────
function filterStudy(q) {
  const cards = document.querySelectorAll('#studyContent .chapter-card');
  const lq = q.toLowerCase();
  cards.forEach(c => {
    c.style.display = c.textContent.toLowerCase().includes(lq) ? '' : 'none';
  });
}
/* Chapter cards use inline onclick in HTML — no duplicate listener needed */
function toggleChapter(el) {
  const card = el.closest('.chapter-card');
  if (card) card.classList.toggle('open');
}

// ── QUIZ ENGINE ───────────────────────────────────────────────────────────
let sessionScore = 0, sessionAttempts = 0, quizInitialized = false;
let usedQuestions = [];
// FIX: cache opts_exp to avoid JSON-in-onclick attribute escaping issues
const _optsExpCache = {}; let _optsExpIdx = 0;


function updateProgressFill() {
  const pf = document.getElementById('progressFill');
  const scoreDisplay = document.getElementById('scoreDisplay');
  if (!pf || !scoreDisplay) return;
  const txt = scoreDisplay.textContent;
  const m = txt.match(/(\d+) \/ (\d+)/);
  if (m) {
    const pct = m[2]>0 ? (m[1]/m[2]*100) : 0;
    pf.style.width = pct + '%';
  }
}
function initQuiz() {
  quizInitialized = true;
  const sel = document.getElementById('topicFilter');
  const topics = [...new Set(quizData.map(q => q.topic))].sort();
  topics.forEach(t => {
    const o = document.createElement('option');
    o.value = t; o.textContent = t;
    sel.appendChild(o);
  });
  loadQuestion();
}

function getFilteredQuiz() {
  const diff = document.getElementById('diffFilter').value;
  const topic = document.getElementById('topicFilter').value;
  const domain = document.getElementById('domainFilter').value;
  let pool = quizData.filter((q, i) =>
    (diff === 'all' || q.diff === diff) &&
    (topic === 'all' || q.topic === topic) &&
    (domain === 'all' || q.domain === domain) &&
    (!window.reviewMissedMode || (window.missedQIds && window.missedQIds.has(i)))
  );
  return pool;
}

function loadQuestion() {
  const pool = getFilteredQuiz();
  if (!pool.length) {
    document.getElementById('questionContainer').innerHTML = '<div class="empty-state"><h3>No questions match filters</h3><p>Try adjusting the difficulty, domain, or topic filter.</p></div>';
    return;
  }
  let available = pool.filter(q => !usedQuestions.includes(q));
  if (!available.length) { usedQuestions = []; available = pool; }
  const q = available[Math.floor(Math.random() * available.length)];
  usedQuestions.push(q);
  if (usedQuestions.length > pool.length * 0.8) usedQuestions = usedQuestions.slice(-Math.floor(pool.length * 0.5));
  // ── Supabase: debounce-save quiz resume state (every ~5 questions) ──
  if (typeof sbSaveQuizState === 'function') {
    clearTimeout(window._sbQzTimer);
    window._sbQzTimer = setTimeout(() => sbSaveQuizState(usedQuestions).catch(()=>{}), 3000);
  }
  renderQuestion(q);
}

function renderQuestion(q) {
  window._currentQ = q; // track for stats
  const diffLabel = {exam:'BCPS Exam Level', hard:'Harder Than Exam', expert:'Expert / Punishing'}[q.diff] || q.diff;
  const diffClass = {exam:'diff-exam', hard:'diff-hard', expert:'diff-expert'}[q.diff] || 'diff-exam';
  const domMap = {'Area 1':'dom-1','Area 2':'dom-2','Area 3':'dom-3'};
  const domainBadge = q.domain ? `<span class="domain-badge ${domMap[q.domain] || ''}" title="${q.topic || ''}">${q.domain}</span>` : '';
  const topicBadge = q.topic ? `<span class="topic-badge" style="background:var(--fill);color:var(--label2);font-size:0.6rem;padding:2px 8px;border-radius:10px;font-weight:500">${q.topic}</span>` : '';
  // FIX: store opts_exp in cache to avoid HTML attribute escaping issues
  const cacheKey = ++_optsExpIdx;
  _optsExpCache[cacheKey] = q.opts_exp || [];
  const optsHtml = q.opts.map((o, i) =>
    `<button class="option-btn" onclick="answerQuestion(this,${i},${q.correct},this.closest('.question-card'),_optsExpCache[${cacheKey}])">${o}</button>`
  ).join('');
  const refTag = q.ref ? `<span class="ref-tag">&#128214; Reference: ${q.ref}</span>` : '';
  document.getElementById('questionContainer').innerHTML = `
    <div class="question-card">
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.75rem">
        <span class="difficulty ${diffClass}">${diffLabel}</span>${domainBadge} ${topicBadge}
      </div>
      <div class="question-text">${q.q}</div>
      <div class="options">${optsHtml}</div>
      <div class="explanation" id="exp">
        <strong style="color:#06b6d4">Rationale:</strong> ${q.exp}
        ${refTag}
        <span class="source-tag">Topic: ${q.topic}</span>
      </div>
    </div>`;
}

function answerQuestion(btn, chosen, correct, card, optsExp) {
  const btns = card.querySelectorAll('.option-btn');
  btns.forEach((b, i) => {
    b.classList.add('disabled');
    b.onclick = null;
    if (i === correct) b.classList.add('correct');
    else if (i === chosen && chosen !== correct) b.classList.add('incorrect');
  });
  sessionAttempts++;
  if (chosen === correct) sessionScore++;
  if (window._currentQ) {
    const isCorrect = (chosen === correct);
    const origIdx = quizData.indexOf(window._currentQ);
    if (typeof window.trackMissed === 'function') window.trackMissed(origIdx, isCorrect);
    if (typeof window.recordTopicStat === 'function') window.recordTopicStat(window._currentQ.topic || window._currentQ.domain, isCorrect);
    // ── Supabase: log quiz attempt ──
    if (typeof sbSaveQuizAttempt === 'function') {
      const qDomain = window._currentQ.domain || window._currentQ.topic || null;
      sbSaveQuizAttempt(origIdx, qDomain, isCorrect, chosen).catch(()=>{});
    }
  }
  updateScore();
  const expDiv = card.querySelector('#exp');
  if (optsExp && optsExp.length === 4) {
    const labels = ['A','B','C','D'];
    let html = '<div class="opts-rationale"><span class="opts-rationale-title">&#128203; Per-Option Analysis:</span>';
    optsExp.forEach((ex, i) => {
      const isCor = i === correct;
      const isChWrong = (i === chosen && chosen !== correct);
      const cls = isCor ? 'is-correct' : isChWrong ? 'is-chosen-wrong' : 'is-wrong';
      const icon = isCor ? '&#9989;' : isChWrong ? '&#9888;&#65039; Your answer &mdash;' : '&#10060;';
      html += `<div class="opt-exp ${cls}">${icon} <strong>${labels[i]}:</strong> ${ex}</div>`;
    });
    html += '</div>';
    expDiv.innerHTML += html;
  }
  expDiv.classList.add('show');
}

function updateScore() {
  const pct = sessionAttempts > 0 ? Math.round(sessionScore / sessionAttempts * 100) : 0;
  const pf = document.getElementById('progressFill');
  const acc = document.getElementById('accuracyDisplay');
  if (pf) { pf.style.width = pct + '%'; pf.style.background = pct >= 80 ? 'var(--green,#34C759)' : pct >= 60 ? 'var(--orange,#FF9500)' : 'var(--red,#FF3B30)'; }
  if (acc) { acc.textContent = pct + '%'; acc.style.color = pct >= 80 ? 'var(--green,#34C759)' : pct >= 60 ? 'var(--orange,#FF9500)' : 'var(--red,#FF3B30)'; }
  const sd = document.getElementById('scoreDisplay'); if(sd) sd.textContent = `${sessionScore}/${sessionAttempts}`;
  const cd = document.getElementById('correctDisplay'); if(cd) cd.textContent = sessionScore;
  updateProgressFill();
}

function resetScore() {
  sessionScore = 0; sessionAttempts = 0; usedQuestions = [];
  updateScore(); loadQuestion();
}

// ── FLASHCARDS + ANKI SPACED REPETITION ──────────────────────────────────
const SR_KEY = 'bcps_sr_v2';
const STREAK_KEY = 'bcps_streak_v1';
let srState = {};      // {cardId: {interval, ease, reps, due, correct, total}}
let streakData = {};   // {date: count}
let fcDeck = [], fcIndex = 0, flashInitialized = false;
let fcFlipped = false, sessionReviewed = 0, sessionCorrect = 0;
let allCards = [];       // flashData + custom cards
let customCards = [];    // user-created cards
let occBoxes = [];       // image occlusion rectangles being drawn
let occImg = null, occDraw = false, occStart = null;
let currentFcMode = 'study';

// ── SR persistence ────────────────────────────────────────────────────────
function loadSR() {
  try { srState = JSON.parse(localStorage.getItem(SR_KEY)) || {}; } catch(e) { srState = {}; }
  try { streakData = JSON.parse(localStorage.getItem(STREAK_KEY)) || {}; } catch(e) { streakData = {}; }
  try { customCards = JSON.parse(localStorage.getItem('bcps_custom_cards')) || []; } catch(e) { customCards = []; }
  // ── If logged in, pull from Supabase and override local (async) ──
  if (typeof sbLoadFlashProgress === 'function') {
    sbLoadFlashProgress().then(data => {
      if (data && data.srState && Object.keys(data.srState).length) {
        srState = data.srState;
        if (data.streakData) streakData = data.streakData;
        localStorage.setItem(SR_KEY, JSON.stringify(srState));
        localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
        // Re-render deck if flashcard section already loaded
        if (flashInitialized && typeof buildDeck === 'function') buildDeck();
      }
    }).catch(()=>{});
  }
}
function saveSR() {
  localStorage.setItem(SR_KEY, JSON.stringify(srState));
  localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  localStorage.setItem('bcps_custom_cards', JSON.stringify(customCards));
  // ── Supabase: fire-and-forget sync (debounced 4s) ──
  if (typeof sbSaveFlashProgress === 'function') {
    clearTimeout(window._sbFlashTimer);
    window._sbFlashTimer = setTimeout(() => sbSaveFlashProgress(srState, streakData).catch(()=>{}), 4000);
  }
}

// ── SM-2 Algorithm ────────────────────────────────────────────────────────
function sm2(cardId, rating) {
  const s = srState[cardId] || {interval:1, ease:2.5, reps:0, correct:0, total:0};
  let {interval, ease, reps, correct, total} = s;
  total++;
  if (rating >= 2) correct++;
  if (rating === 0) {       // Again
    interval = 1; reps = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else if (rating === 1) { // Hard
    interval = Math.max(1, Math.ceil(interval * 1.2));
    ease = Math.max(1.3, ease - 0.15);
  } else if (rating === 2) { // Good
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.ceil(interval * ease);
    reps++;
  } else {                  // Easy
    if (reps === 0) interval = 4;
    else if (reps === 1) interval = 10;
    else interval = Math.ceil(interval * ease * 1.3);
    reps++; ease = Math.min(2.5, ease + 0.15);
  }
  const due = new Date(); due.setDate(due.getDate() + interval);
  srState[cardId] = {interval, ease, reps, correct, total, due: due.toISOString().split('T')[0]};
  // update streak
  const today = new Date().toISOString().split('T')[0];
  streakData[today] = (streakData[today] || 0) + 1;
  saveSR();
}

function getPreviewIntervals(cardId) {
  const s = srState[cardId] || {interval:1, ease:2.5, reps:0};
  const fmt = d => d < 1 ? '<1d' : d === 1 ? '1d' : d < 30 ? d+'d' : d < 365 ? Math.round(d/30)+'mo' : Math.round(d/365)+'yr';
  const {interval: iv, ease, reps} = s;
  const again = 1;
  const hard = Math.max(1, Math.ceil(iv * 1.2));
  const good = reps === 0 ? 1 : reps === 1 ? 6 : Math.ceil(iv * ease);
  const easy = reps === 0 ? 4 : reps === 1 ? 10 : Math.ceil(iv * ease * 1.3);
  return [fmt(again), fmt(hard), fmt(good), fmt(easy)];
}

function isDue(cardId) {
  const s = srState[cardId];
  if (!s) return true;
  return s.due <= new Date().toISOString().split('T')[0];
}

// ── Init & Mode Switching ─────────────────────────────────────────────────
function initFlash() {
  flashInitialized = true;
  loadSR();
  allCards = [...flashData, ...customCards];
  // populate topic filter
  const sel = document.getElementById('fcTopicFilter');
  const topics = [...new Set(allCards.map(f => f.topic))].sort();
  topics.forEach(t => { const o = document.createElement('option'); o.value=t; o.textContent=t; sel.appendChild(o); });
  updateSrStats();
  buildClozeSection();
  buildImageSection();
  refreshCustomList();
  filterFlash();
}

function switchFcMode(mode) {
  currentFcMode = mode;
  ['study','cloze','create'].forEach(m => {
    const el = document.getElementById('fcMode' + m.charAt(0).toUpperCase() + m.slice(1));
    if (el) el.style.display = m === mode ? '' : 'none';
  });
  document.querySelectorAll('.fc-mode-tab').forEach((b,i) => {
    b.classList.toggle('active', ['study','cloze','create'][i] === mode);
  });
  if (mode === 'create') refreshCustomList();
}

// ── Stats ─────────────────────────────────────────────────────────────────
function updateSrStats() {
  allCards = [...flashData, ...customCards];
  const total = allCards.length;
  const due = allCards.filter((_,i) => isDue('c'+i)).length;
  const isNew = id => !srState[id];
  const newCount = allCards.filter((_,i) => isNew('c'+i)).length;
  // streak
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  for (let d=0; d<365; d++) {
    const dt = new Date(); dt.setDate(dt.getDate()-d);
    const ds = dt.toISOString().split('T')[0];
    if (streakData[ds]) streak++; else if (d>0) break;
  }
  // retention
  const totalAns = Object.values(srState).reduce((a,s) => a+(s.total||0), 0);
  const totalCor = Object.values(srState).reduce((a,s) => a+(s.correct||0), 0);
  const ret = totalAns ? Math.round(totalCor/totalAns*100)+'%' : '--%';
  document.getElementById('srDueToday').textContent = due;
  document.getElementById('srNewCount').textContent = newCount;
  document.getElementById('srTotal').textContent = total;
  document.getElementById('srStreak').textContent = streak + (streak > 0 ? '🔥' : '');
  const srRetEl = document.getElementById('srRetention') || document.getElementById('srRet'); if(srRetEl) srRetEl.textContent = ret;
  document.getElementById('srRetention').textContent = ret;
  // update nav badge
  const navBtn = document.querySelectorAll('nav button')[2];
  const existing = navBtn.querySelector('.due-badge');
  if (existing) existing.remove();
  if (due > 0) { const b = document.createElement('span'); b.className='due-badge'; b.textContent=due; navBtn.appendChild(b); }
}

// ── Filter & Deck Building ────────────────────────────────────────────────
function filterFlash() {
  allCards = [...flashData, ...customCards];
  const topic = document.getElementById('fcTopicFilter').value;
  const queue = document.getElementById('fcQueueFilter').value;
  const today = new Date().toISOString().split('T')[0];
  let pool = allCards.map((c,i) => ({...c, _id:'c'+i}))
    .filter(c => topic === 'all' || c.topic === topic);
  if (queue === 'due') {
    const due = pool.filter(c => isDue(c._id));
    const notDue = pool.filter(c => !isDue(c._id));
    fcDeck = [...due, ...notDue];
  } else if (queue === 'new') {
    fcDeck = pool.filter(c => !srState[c._id]);
  } else if (queue === 'review') {
    fcDeck = pool.filter(c => srState[c._id] && isDue(c._id));
  } else {
    fcDeck = pool;
  }
  fcIndex = 0; fcFlipped = false;
  const fc = document.getElementById('flashcard');
  if (fc) fc.classList.remove('flipped');
  hideSrBtns();
  showCard();
}

// ── Card Display ──────────────────────────────────────────────────────────
function showCard() {
  if (!fcDeck.length) {
    document.getElementById('fcCounter').textContent = 'No cards in this queue 🎉';
    document.getElementById('fcFront').innerHTML = '<span style="color:#10b981">All done for now!</span>';
    document.getElementById('fcBack').innerHTML = '';
    document.getElementById('fcTopicLabel').textContent = '';
    document.getElementById('srProgressFill').style.width = '100%';
    updateSrStats();
    return;
  }
  const c = fcDeck[fcIndex];
  const total = fcDeck.length;
  const pct = total > 1 ? Math.round(fcIndex / (total-1) * 100) : 0;
  document.getElementById('srProgressFill').style.width = pct + '%';
  // Status label
  const s = srState[c._id];
  const statusTxt = !s ? '🆕 New' : isDue(c._id) ? '🔄 Due' : '✅ Scheduled';
  document.getElementById('fcCounter').textContent = `Card ${fcIndex+1} of ${total} · ${statusTxt}`;
  // Render front — detect cloze
  const frontEl = document.getElementById('fcFront');
  if (c.front && c.front.includes('[[')) {
    frontEl.innerHTML = renderClozeHidden(c.front);
  } else {
    frontEl.textContent = c.front || '';
  }
  // Image card?
  if (c.type === 'image') {
    frontEl.innerHTML = renderImageFront(c);
  }
  document.getElementById('fcBack').textContent = c.back || '';
  document.getElementById('fcTopicLabel').textContent = c.topic || '';
  document.getElementById('fcTopicLabelBack').textContent = c.topic || '';
  const fc = document.getElementById('flashcard');
  if (fc) fc.classList.remove('flipped');
  fcFlipped = false;
  hideSrBtns();
  document.getElementById('fcHint').textContent = c.front && c.front.includes('[[') ? 'Tap blanks or click to flip' : 'Click to flip';
}

function fcClickHandler(e) {
  // Don't flip if clicking a cloze blank
  if (e.target.classList.contains('cloze-blank')) return;
  flipCard();
}

function flipCard() {
  const fc = document.getElementById('flashcard');
  if (!fc || !fcDeck.length) return;
  fc.classList.toggle('flipped');
  fcFlipped = !fcFlipped;
  if (fcFlipped) showSrBtns();
  else hideSrBtns();
}

function showSrBtns() {
  const btns = document.getElementById('srBtns');
  btns.classList.add('show');
  document.getElementById('fcNavBtns').style.display = 'none';
  if (fcDeck.length) {
    const ivs = getPreviewIntervals(fcDeck[fcIndex]._id);
    ['srI0','srI1','srI2','srI3'].forEach((id,i) => document.getElementById(id).textContent = ivs[i]);
  }
}

function hideSrBtns() {
  document.getElementById('srBtns').classList.remove('show');
  document.getElementById('fcNavBtns').style.display = '';
}

function rateCard(rating) {
  if (!fcDeck.length) return;
  const card = fcDeck[fcIndex];
  sm2(card._id, rating);
  if (rating >= 2) sessionCorrect++;
  sessionReviewed++;
  updateSrStats();
  // advance
  fcIndex = (fcIndex + 1) % fcDeck.length;
  hideSrBtns();
  showCard();
}

function nextCard() { if (!fcDeck.length) return; fcIndex=(fcIndex+1)%fcDeck.length; hideSrBtns(); showCard(); }
function prevCard() { if (!fcDeck.length) return; fcIndex=(fcIndex-1+fcDeck.length)%fcDeck.length; hideSrBtns(); showCard(); }

function shuffleFlash() {
  for (let i=fcDeck.length-1; i>0; i--) {
    const j=Math.floor(Math.random()*(i+1));
    [fcDeck[i],fcDeck[j]]=[fcDeck[j],fcDeck[i]];
  }
  fcIndex=0; hideSrBtns();
  const fc = document.getElementById('flashcard');
  if (fc) fc.classList.remove('flipped');
  showCard();
}

function resetSR() {
  if (!confirm('Reset all spaced repetition progress? This cannot be undone.')) return;
  srState = {}; streakData = {};
  saveSR(); updateSrStats(); filterFlash();
}

// ── CLOZE RENDERING ───────────────────────────────────────────────────────
function renderClozeHidden(text) {
  return text.replace(/\[\[(.+?)\]\]/g, (match, word) =>
    `<span class="cloze-blank" onclick="this.classList.toggle('revealed');this.textContent=this.classList.contains('revealed')?'${word.replace(/'/g,"'")}':'_____';event.stopPropagation()" title="Click to reveal">_____</span>`
  );
}

function buildClozeSection() {
  allCards = [...flashData, ...customCards];
  const clozeCards = allCards.filter(c => c.front && c.front.includes('[['));
  const container = document.getElementById('clozeCards');
  if (!clozeCards.length) {
    container.innerHTML = '<div class="empty-state"><h3>No cloze cards yet</h3><p>Add [[blanks]] in the Create tab to make cloze cards.</p></div>';
    return;
  }
  container.innerHTML = clozeCards.map((c, i) => `
    <div style="background:var(--card);border:1px solid var(--sep);border-radius:12px;padding:1.25rem;margin-bottom:0.75rem;box-shadow:0 1px 4px rgba(0,0,0,.06)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem">
        <span style="background:var(--primary);color:#fff;font-size:0.68rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:20px">${c.topic||'General'}</span>
        <button onclick="this.closest('div').querySelector('.cloze-answer').classList.toggle('show')" class="btn btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.8rem">Show Answer</button>
      </div>
      <div style="font-size:1rem;color:var(--label);line-height:1.6;margin-bottom:0.75rem">${renderClozeHidden(c.front)}</div>
      <div class="cloze-answer" style="display:none;background:var(--fill);border-left:3px solid #10b981;padding:0.75rem;border-radius:0 6px 6px 0;color:var(--label);font-size:0.875rem">${c.back||''}</div>
    </div>`).join('');
}

// ── IMAGE OCCLUSION ───────────────────────────────────────────────────────
function buildImageSection() {
  const container = document.getElementById('imageCardList'); if (!container) return;
  const imageCards = customCards.filter(c => c.type === 'image');
  if (!imageCards.length) {
    container.innerHTML = '<div class="empty-state"><h3>No image cards yet</h3><p>Create image occlusion cards in the Create tab.</p></div>';
    return;
  }
  container.innerHTML = imageCards.map((c, i) => `
    <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:1.25rem;margin-bottom:1.25rem">
      <div style="margin-bottom:0.75rem;display:flex;justify-content:space-between;align-items:center">
        <span style="background:#06b6d4;color:#0f172a;font-size:0.68rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:20px">${c.topic||'General'}</span>
        <button onclick="revealAllOcc(this)" class="btn btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.8rem">Reveal All</button>
      </div>
      ${renderImageFront(c)}
      <div style="color:#94a3b8;font-size:0.8rem;margin-top:0.75rem">${c.back||''}</div>
    </div>`).join('');
}

function renderImageFront(c) {
  if (!c.imgSrc) return '';
  const rects = (c.rects||[]).map((r,i) =>
    `<div class="occ-rect" style="left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%" onclick="this.classList.toggle('revealed')"></div>`
  ).join('');
  return `<div class="img-occ-container" style="position:relative;display:inline-block;max-width:100%">
    <img src="${c.imgSrc}" style="max-width:100%;border-radius:6px;display:block">
    ${rects}
  </div>`;
}

function revealAllOcc(btn) {
  btn.closest('div').querySelectorAll('.occ-rect').forEach(r => r.classList.add('revealed'));
}

function loadImageForOcclusion(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    occImg = e.target.result;
    const img = document.getElementById('imgOccPreview');
    const canvas = document.getElementById('imgOccCanvas');
    img.onload = () => {
      canvas.width = img.offsetWidth; canvas.height = img.offsetHeight;
      occBoxes = []; drawOccBoxes(canvas, occBoxes);
    };
    img.src = occImg;
    document.getElementById('imgOccWorkspace').style.display = '';
    setupOccCanvas(canvas);
  };
  reader.readAsDataURL(file);
}

function setupOccCanvas(canvas) {
  canvas.onmousedown = e => {
    const r = canvas.getBoundingClientRect();
    occStart = {x: e.clientX - r.left, y: e.clientY - r.top}; occDraw = true;
  };
  canvas.onmousemove = e => {
    if (!occDraw) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    drawOccBoxes(canvas, occBoxes, occStart, {x,y});
  };
  canvas.onmouseup = e => {
    if (!occDraw) return; occDraw = false;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const x1 = Math.min(occStart.x, x), y1 = Math.min(occStart.y, y);
    const w = Math.abs(x - occStart.x), h = Math.abs(y - occStart.y);
    if (w > 5 && h > 5) {
      occBoxes.push({x: x1/canvas.width*100, y: y1/canvas.height*100,
                       w: w/canvas.width*100, h: h/canvas.height*100});
      drawOccBoxes(canvas, occBoxes);
    }
  };
  // touch support
  canvas.ontouchstart = e => { e.preventDefault(); canvas.onmousedown(e.touches[0]); };
  canvas.ontouchmove = e => { e.preventDefault(); canvas.onmousemove(e.touches[0]); };
  canvas.ontouchend = e => { e.preventDefault(); canvas.onmouseup(e.changedTouches[0]); };
}

function drawOccBoxes(canvas, boxes, start, end) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'rgba(30,58,138,0.85)';
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
  boxes.forEach(b => {
    ctx.fillRect(b.x/100*canvas.width, b.y/100*canvas.height,
                 b.w/100*canvas.width, b.h/100*canvas.height);
    ctx.strokeRect(b.x/100*canvas.width, b.y/100*canvas.height,
                   b.w/100*canvas.width, b.h/100*canvas.height);
  });
  if (start && end) {
    const x1=Math.min(start.x,end.x), y1=Math.min(start.y,end.y);
    ctx.fillRect(x1, y1, Math.abs(end.x-start.x), Math.abs(end.y-start.y));
    ctx.strokeRect(x1, y1, Math.abs(end.x-start.x), Math.abs(end.y-start.y));
  }
}

function clearOccBoxes() {
  occBoxes = [];
  const canvas = document.getElementById('imgOccCanvas');
  drawOccBoxes(canvas, occBoxes);
}

function saveImageCard() {
  if (!occImg) { alert('Please upload an image first.'); return; }
  if (!occBoxes.length) { alert('Please draw at least one occlusion box.'); return; }
  const topic = document.getElementById('imgCardTopic').value || 'Image Card';
  customCards.push({ type:'image', topic, imgSrc: occImg, rects:[...occBoxes], front:'', back:'' });
  saveSR(); buildImageSection(); refreshCustomList(); updateSrStats();
  document.getElementById('imgOccWorkspace').style.display='none';
  document.getElementById('imgUpload').value=''; occImg=null; occBoxes=[];
  alert('Image card saved! View it in the Image Cards tab.');
}

// ── Create / Custom Cards ─────────────────────────────────────────────────
function saveCustomCard() {
  const front = document.getElementById('newCardFront').value.trim();
  const back = document.getElementById('newCardBack').value.trim();
  const topic = document.getElementById('newCardTopic').value.trim() || 'Custom';
  if (!front) { alert('Front text is required.'); return; }
  customCards.push({front, back, topic, type: front.includes('[[') ? 'cloze' : 'standard'});
  saveSR();
  document.getElementById('newCardFront').value='';
  document.getElementById('newCardBack').value='';
  document.getElementById('newCardTopic').value='';
  buildClozeSection(); refreshCustomList(); updateSrStats();
  // re-populate topic filter
  const sel = document.getElementById('fcTopicFilter');
  if (![...sel.options].find(o => o.value===topic)) {
    const o = document.createElement('option'); o.value=topic; o.textContent=topic; sel.appendChild(o);
  }
  alert('Card saved!');
}

function refreshCustomList() {
  const wrap = document.getElementById('customCardListWrap');
  const list = document.getElementById('customCardList');
  document.getElementById('customCount').textContent = customCards.length;
  if (!customCards.length) { wrap.style.display='none'; return; }
  wrap.style.display='';
  list.innerHTML = customCards.map((c,i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0.75rem;background:#0f172a;border-radius:6px;margin-bottom:0.5rem">
      <div style="font-size:0.82rem;color:#cbd5e1;flex:1;margin-right:1rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${c.type==='image'?'🖼️ '+c.topic : c.front.substring(0,60)+(c.front.length>60?'...':'')}</div>
      <span style="background:#334155;color:#94a3b8;font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:20px;margin-right:0.75rem">${c.topic}</span>
      <button onclick="deleteCustomCard(${i})" style="background:#450a0a;color:#fca5a5;border:none;border-radius:4px;padding:0.2rem 0.5rem;cursor:pointer;font-size:0.75rem">✕</button>
    </div>`).join('');
}

function deleteCustomCard(i) {
  if (!confirm('Delete this card?')) return;
  customCards.splice(i,1); saveSR();
  refreshCustomList(); buildClozeSection(); buildImageSection(); updateSrStats();
}

// ── CONCEPT CONNECTOR ─────────────────────────────────────────────────────
const conceptData = JSON.parse(({textContent: JSON.stringify(window.__conceptData)}).textContent);
let conceptQuizMode = false, activeConceptTab = 'all', conceptGroupFilter = 'All';

function initConcepts() {
  buildGroupTabs();
  buildConceptTabs('All');
  renderConcepts('all', '');
}

function buildGroupTabs() {
  const bar = document.getElementById('conceptGroupBar');
  if (!bar) return;
  const groups = ['All', ...new Set(conceptData.map(c => c.group || 'Other'))];
  bar.innerHTML = '';
  groups.forEach(g => {
    const b = document.createElement('button');
    b.className = 'concept-group-btn' + (g === 'All' ? ' active' : '');
    b.textContent = g === 'All' ? '📚 All Topics' :
      g === 'Pharmacokinetics & Dosing' ? '⚗️ PK & Dosing' :
      g === 'Cardiovascular Pharmacology' ? '❤️ Cardiovascular' :
      g === 'Antimicrobial Pharmacology' ? '🦠 Antimicrobials' :
      g === 'Drug Safety & Toxicology' ? '⚠️ Safety & Tox' :
      g === 'Clinical Practice & Systems' ? '🏥 Clinical & Systems' : g;
    b.onclick = () => {
      conceptGroupFilter = g;
      document.querySelectorAll('.concept-group-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      activeConceptTab = 'all';
      buildConceptTabs(g);
      renderConcepts('all', document.getElementById('conceptSearch').value);
    };
    bar.appendChild(b);
  });
}

function buildConceptTabs(group) {
  const tabs = document.getElementById('conceptTabs');
  if (!tabs) return;
  tabs.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'concept-tab active'; all.textContent = 'All'; all.dataset.cat = 'all';
  all.onclick = () => setConceptTab('all');
  tabs.appendChild(all);
  const filtered = (!group || group === 'All') ? conceptData : conceptData.filter(c => c.group === group);
  filtered.forEach(c => {
    const t = document.createElement('button');
    t.className = 'concept-tab'; t.textContent = c.name; t.dataset.cat = c.name;
    t.onclick = () => setConceptTab(c.name);
    tabs.appendChild(t);
  });
}

function setConceptTab(name) {
  activeConceptTab = name;
  document.querySelectorAll('.concept-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === name));
  renderConcepts(name, document.getElementById('conceptSearch').value);
}

function filterConcepts(q) {
  // Legacy: redirect to DRUG_DB search
  const inp = document.getElementById('drugSearch');
  if (inp && typeof drugFilterState !== 'undefined') {
    inp.value = q;
    drugFilterState.query = q.toLowerCase();
    if (typeof drugRender === 'function') drugRender();
  }
}

function renderConcepts(catFilter, query) {
  const container = document.getElementById('conceptContent');
  const q = query.toLowerCase().trim();
  let rendered = 0;
  container.innerHTML = '';
  conceptData.forEach((c, ci) => {
    if (catFilter !== 'all' && c.name !== catFilter) return;
    if (conceptGroupFilter && conceptGroupFilter !== 'All' && c.group !== conceptGroupFilter) return;
    const filteredDrugs = c.drugs.filter(d =>
      !q || d.drug.toLowerCase().includes(q) || d.adjustment.toLowerCase().includes(q) || d.source.toLowerCase().includes(q)
    );
    if (!filteredDrugs.length && q) return;
    rendered++;
    const card = document.createElement('div');
    card.className = 'concept-card' + (ci < 2 ? ' open' : '');
    card.dataset.concept = c.name.toLowerCase();
    const groupIconMap = {
      'Pharmacokinetics & Dosing':'⚗️','Cardiovascular Pharmacology':'❤️',
      'Antimicrobial Pharmacology':'🦠','Drug Safety & Toxicology':'⚠️','Clinical Practice & Systems':'🏥'
    };
    const groupIcon = groupIconMap[c.group] || '📖';
    const summaryHtml = c.summary ? `<div class="concept-summary">${c.summary}</div>` : '';
    card.innerHTML = `
      <div class="concept-card-header" onclick="toggleConceptCard(this.closest('.concept-card'))">
        <h3>${groupIcon} ${c.name}</h3>
        <div class="concept-card-header-right">
          <span class="concept-count-badge">${filteredDrugs.length} item${filteredDrugs.length!==1?'s':''}</span>
          <span class="concept-chevron">&#9660;</span>
        </div>
      </div>
      <div class="concept-body">
        ${summaryHtml}
        ${filteredDrugs.map(d => renderDrugRow(d, q)).join('')}
      </div>`;
    container.appendChild(card);
  });
  if (!rendered) {
    container.innerHTML = '<div class="empty-state"><h3>No matches found</h3><p>Try a different search term or tab.</p></div>';
  }
  if (conceptQuizMode) container.classList.add('quiz-mode-active');
}

function renderDrugRow(d, highlight) {
  const hl = (txt) => {
    if (!highlight || !txt) return txt || '';
    const re = new RegExp('(' + highlight.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
    return txt.replace(re, '<mark class="highlighted">$1</mark>');
  };
  const moaHtml = d.moa ? `<div class="moa-tag">⚙️ <em>${hl(d.moa)}</em></div>` : '';
  const cautionHtml = d.caution ? `<div class="caution-tag">⚠️ ${hl(d.caution)}</div>` : '';
  // Build clickable resource links
  const drugName = encodeURIComponent(d.drug.split('+')[0].split('/')[0].trim().split(' ')[0]);
  const pubmedQ  = encodeURIComponent(d.drug.replace(/[^a-zA-Z0-9 ]/g,' ').trim());
  const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${pubmedQ}`;
  const dailymedUrl = `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${drugName}`;
  const linksHtml = `<div class="drug-row-links">
    <a href="${pubmedUrl}" target="_blank" rel="noopener" class="drug-link-btn pubmed">📗 PubMed</a>
    <a href="${dailymedUrl}" target="_blank" rel="noopener" class="drug-link-btn dailymed">💊 DailyMed</a>
  </div>`;
  return `
    <div class="drug-row">
      <div class="drug-row-top">
        <strong>${hl(d.drug)}</strong>
        <span class="drug-src-badge">📖 ${d.source}</span>
      </div>
      ${moaHtml}
      <p class="drug-adjust" onclick="revealDrugAdjust(this)">${hl(d.adjustment)}</p>
      ${cautionHtml}
      ${linksHtml}
    </div>`;
}

function revealDrugAdjust(el) {
  if (!conceptQuizMode) return;
  el.classList.add('revealed');
  drugQuizRevealed++;
  updateDrugQuizBar();
}

let drugQuizRevealed = 0, drugQuizTotal = 0;
function updateDrugQuizBar() {
  const bar = document.getElementById('drugQuizBar');
  if (!bar) return;
  const pct = drugQuizTotal > 0 ? Math.round(drugQuizRevealed/drugQuizTotal*100) : 0;
  bar.innerHTML = `<span>Quiz Mode Active — Tap any adjustment to reveal</span>
    <span class="drug-quiz-score-chip">${drugQuizRevealed}/${drugQuizTotal} revealed (${pct}%)</span>`;
}

function toggleConceptCard(card) {
  card.classList.toggle('open');
}

function toggleAllConcepts(expand) {
  document.querySelectorAll('.concept-card').forEach(c => c.classList.toggle('open', expand));
}

function toggleConceptQuizMode() {
  conceptQuizMode = !conceptQuizMode;
  const btn = document.getElementById('quizModeBtn');
  btn.classList.toggle('on', conceptQuizMode);
  btn.textContent = conceptQuizMode ? '✅ Quiz On' : '🧠 Quiz Me';
  const c = document.getElementById('conceptContent');
  c.classList.toggle('quiz-mode-active', conceptQuizMode);
  // Inject/remove quiz score bar
  let bar = document.getElementById('drugQuizBar');
  if (conceptQuizMode) {
    // Reset revealed state
    c.querySelectorAll('.drug-adjust').forEach(el => { el.classList.remove('revealed'); });
    drugQuizRevealed = 0;
    drugQuizTotal = c.querySelectorAll('.drug-adjust').length;
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'drugQuizBar';
      bar.className = 'drug-quiz-bar';
      c.parentElement.insertBefore(bar, c);
    }
    updateDrugQuizBar();
  } else {
    c.querySelectorAll('.drug-adjust').forEach(el => el.classList.remove('revealed'));
    if (bar) bar.remove();
  }
}

function startDrugMCQQuiz() {
  // Launch the main quiz tab filtered to pharmacology topics
  switchSection('quiz');
  // Small delay then set topic filter to pharmacology
  setTimeout(() => {
    const sel = document.getElementById('topicFilter');
    if (sel) {
      // Find a pharmacology/drug option
      const opts = Array.from(sel.options);
      const pharmaOpt = opts.find(o => /pharmac|drug|interaction|kinetic/i.test(o.text));
      if (pharmaOpt) sel.value = pharmaOpt.value;
    }
    loadQuestion();
  }, 200);
}

// ── VISUAL PHARMACOLOGY ────────────────────────────────────────────────────
function initVisuals() {
  drawCascade();
  drawRAAS();
  drawAdrenergic();
  drawBetaLactam();
  drawSpectrum();
  drawCYPWeb();
  drawGlucose();
  drawRenal();
  drawAbxTargets();
  drawHFCascade();
  drawSSvsNMS();
  drawCOPD();
  drawOpioid();
  drawPKPD();
  drawAntidep();
  drawIBD();
  initMindMap();
}

function getCanvasCtx(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const w = el.parentElement.clientWidth - 40;
  el.width = Math.max(300, w);
  return { ctx: el.getContext('2d'), w: el.width, h: el.height };
}

function drawCascade() {
  const d = getCanvasCtx('cascadeCanvas');
  if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0, 0, w, h);
  const pal = { bg:'#f8fafc', arrow:'#94a3b8', factor:'#1e293b', drug:'#0284c7', inhibitor:'#dc2626', box:'#fff', border:'#e2e8f0' };
  ctx.fillStyle = pal.bg; ctx.fillRect(0,0,w,h);
  const factors = [
    {label:'XII → XIIa',x:0.15,y:0.08},
    {label:'XI → XIa',x:0.15,y:0.22},
    {label:'IX → IXa',x:0.15,y:0.38},
    {label:'X → Xa',x:0.45,y:0.5},
    {label:'VIII → VIIIa',x:0.15,y:0.5},
    {label:'Prothrombin → Thrombin (IIa)',x:0.45,y:0.67},
    {label:'Fibrinogen → Fibrin',x:0.45,y:0.84},
    {label:'VII → VIIa + TF',x:0.75,y:0.38},
    {label:'V → Va',x:0.75,y:0.5},
  ];
  const drugs = [
    {label:'Heparin/LMWH\n(anti-IIa + anti-Xa)',x:0.25,y:0.6,color:'#0284c7'},
    {label:'Fondaparinux\n(anti-Xa only)',x:0.25,y:0.46,color:'#7c3aed'},
    {label:'Argatroban/\nBivalirudin (anti-IIa)',x:0.62,y:0.73,color:'#dc2626'},
    {label:'Rivaroxaban/\nApixaban (anti-Xa)',x:0.62,y:0.54,color:'#ea580c'},
    {label:'Warfarin\n(II,VII,IX,X,PC,PS)',x:0.88,y:0.55,color:'#16a34a'},
    {label:'Dabigatran\n(direct IIa)',x:0.62,y:0.63,color:'#b91c1c'},
  ];
  const bx = (f) => { const bw=Math.min(w*0.25,130), bh=28, x=f.x*w-bw/2, y=f.y*h-bh/2;
    ctx.fillStyle=pal.box; ctx.strokeStyle=pal.border; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(x,y,bw,bh,6); ctx.fill(); ctx.stroke();
    ctx.fillStyle=pal.factor; ctx.font=`bold ${Math.max(9,Math.min(11,w/45))}px system-ui`;
    ctx.textAlign='center'; ctx.fillText(f.label,f.x*w,f.y*h+4); };
  const aw = (x1,y1,x2,y2) => {
    ctx.strokeStyle=pal.arrow; ctx.lineWidth=1.5; ctx.beginPath();
    ctx.moveTo(x1*w,y1*h); ctx.lineTo(x2*w,y2*h); ctx.stroke();
    const ang=Math.atan2((y2-y1)*h,(x2-x1)*w);
    ctx.fillStyle=pal.arrow; ctx.beginPath();
    ctx.moveTo(x2*w,y2*h);
    ctx.lineTo(x2*w-10*Math.cos(ang-0.3),y2*h-10*Math.sin(ang-0.3));
    ctx.lineTo(x2*w-10*Math.cos(ang+0.3),y2*h-10*Math.sin(ang+0.3));
    ctx.fill(); };
  aw(0.15,0.12,0.15,0.19); aw(0.15,0.26,0.15,0.35); aw(0.15,0.42,0.35,0.48);
  aw(0.75,0.42,0.55,0.48); aw(0.45,0.54,0.45,0.64); aw(0.45,0.7,0.45,0.81);
  factors.forEach(bx);
  drugs.forEach(dr => {
    ctx.fillStyle=dr.color+'22'; ctx.strokeStyle=dr.color; ctx.lineWidth=1.5;
    const bw=Math.min(w*0.22,120), bh=32, x=dr.x*w-bw/2, y=dr.y*h-bh/2;
    ctx.beginPath(); ctx.roundRect(x,y,bw,bh,8); ctx.fill(); ctx.stroke();
    ctx.fillStyle=dr.color; ctx.font=`${Math.max(8,Math.min(10,w/50))}px system-ui`;
    ctx.textAlign='center';
    const lines=dr.label.split('\n');
    lines.forEach((l,i)=>ctx.fillText(l,dr.x*w,dr.y*h-(lines.length-1)*6+i*12));
  });
  ctx.fillStyle='#64748b'; ctx.font=`bold ${Math.max(10,12)}px system-ui`; ctx.textAlign='left';
  ctx.fillText('Intrinsic Path →',5,20); ctx.fillText('← Extrinsic Path',w-110,20);
}

function drawRAAS() {
  const d = getCanvasCtx('raasCanvas');
  if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const steps = [
    {y:0.08, label:'Angiotensinogen (liver)', color:'#0f172a'},
    {y:0.22, label:'Angiotensin I', color:'#0f172a'},
    {y:0.40, label:'Angiotensin II', color:'#dc2626'},
    {y:0.58, label:'AT1 Receptor Activation', color:'#dc2626'},
    {y:0.75, label:'↑ Aldosterone / ↑ BP / ↑ Na⁺ retention', color:'#7c2d12'},
  ];
  const drugs2 = [
    {y:0.15, label:'Aliskiren\n(Direct Renin Inhibitor)', color:'#7c3aed', side:'right'},
    {y:0.31, label:'ACE Inhibitors\n(-pril: block ACE)', color:'#0284c7', side:'right'},
    {y:0.49, label:'ARBs (-sartan)\n(block AT1 receptor)', color:'#16a34a', side:'left'},
    {y:0.49, label:'ARNIs (sacubitril/valsartan)\n+ NEP inhibition', color:'#0891b2', side:'right'},
    {y:0.67, label:'MRAs (spiro/eplerenone)\n(block aldosterone receptor)', color:'#ca8a04', side:'left'},
  ];
  ctx.strokeStyle='#94a3b8'; ctx.lineWidth=2;
  ctx.setLineDash([4,3]);
  ctx.beginPath(); ctx.moveTo(w/2,h*0.11); ctx.lineTo(w/2,h*0.78); ctx.stroke();
  ctx.setLineDash([]);
  steps.forEach((s,i) => {
    const bw=Math.min(w*0.5,200), x=w/2-bw/2, y=s.y*h-14;
    ctx.fillStyle='#fff'; ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(x,y,bw,28,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle=s.color; ctx.font=`bold ${Math.max(9,Math.min(11,w/45))}px system-ui`;
    ctx.textAlign='center'; ctx.fillText(s.label,w/2,y+18);
    if (i<steps.length-1) {
      ctx.fillStyle='#94a3b8'; ctx.font='16px system-ui';
      ctx.fillText('↓',w/2-5,s.y*h+22);
    }
  });
  drugs2.forEach(dr => {
    const bw=Math.min(w*0.35,130), bh=30, side=dr.side==='right'?w/2+bw*0.15:w/2-bw*1.15;
    ctx.fillStyle=dr.color+'18'; ctx.strokeStyle=dr.color; ctx.lineWidth=1.5;
    const y=dr.y*h-bh/2;
    ctx.beginPath(); ctx.roundRect(side,y,bw,bh,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle=dr.color; ctx.font=`${Math.max(8,Math.min(9,w/55))}px system-ui`;
    ctx.textAlign='center';
    const lines=dr.label.split('\n');
    lines.forEach((l,i)=>ctx.fillText(l,side+bw/2,y+10+(lines.length===1?5:0)+i*11));
    ctx.strokeStyle=dr.color+'88'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(dr.side==='right'?side:side+bw,dr.y*h);
    ctx.lineTo(w/2,dr.y*h); ctx.stroke(); ctx.setLineDash([]);
  });
}

function drawAdrenergic() {
  const d = getCanvasCtx('adrenCanvas');
  if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const receptors = [
    {id:'α1', x:0.2, y:0.3, color:'#dc2626', effects:['↑ SVR / vasoconstriction','↑ BP','Urinary retention']},
    {id:'α2', x:0.2, y:0.65, color:'#f97316', effects:['↓ NE release (presynaptic)','↓ Sympathetic outflow','Sedation']},
    {id:'β1', x:0.65, y:0.25, color:'#0284c7', effects:['↑ HR (chronotropy)','↑ Contractility (inotropy)','↑ Renin release']},
    {id:'β2', x:0.65, y:0.65, color:'#16a34a', effects:['Bronchodilation','Vasodilation (skeletal)','↓ K+ (shift intracellular)']},
  ];
  const drugsA = [
    {label:'Norepinephrine',selects:['α1','β1'],x:0.42,y:0.15},
    {label:'Epinephrine',selects:['α1','α2','β1','β2'],x:0.42,y:0.45},
    {label:'Phenylephrine',selects:['α1'],x:0.05,y:0.5},
    {label:'Dobutamine',selects:['β1'],x:0.82,y:0.45},
    {label:'Albuterol',selects:['β2'],x:0.82,y:0.75},
  ];
  receptors.forEach(r => {
    const bw=Math.min(w*0.28,130), bh=20+r.effects.length*13;
    const x=r.x*w-bw/2, y=r.y*h-bh/2;
    ctx.fillStyle=r.color+'1a'; ctx.strokeStyle=r.color; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(x,y,bw,bh,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle=r.color; ctx.font=`bold ${Math.max(11,13)}px system-ui`;
    ctx.textAlign='center'; ctx.fillText(r.id+' Receptor',r.x*w,y+16);
    ctx.fillStyle='#334155'; ctx.font=`${Math.max(9,10)}px system-ui`;
    r.effects.forEach((e,i)=>ctx.fillText(e,r.x*w,y+30+i*13));
  });
  ctx.fillStyle='#0f172a'; ctx.font=`bold ${Math.max(10,12)}px system-ui`;
  ctx.textAlign='center'; ctx.fillText('Catecholamine / Drug Receptor Selectivity',w/2,h-10);
}

function drawBetaLactam() {
  const d = getCanvasCtx('betalactamCanvas');
  if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const cx=w/2, cy=h/2;
  const steps2 = [
    {a:270,r:0.38,label:'PBPs (Penicillin Binding Proteins)',color:'#0f172a'},
    {a:330,r:0.38,label:'Transpeptidase enzyme\n(cross-links peptidoglycan)',color:'#0284c7'},
    {a:30,r:0.38,label:'Cell wall synthesis\n(peptidoglycan cross-linking)',color:'#16a34a'},
    {a:90,r:0.38,label:'Autolytic enzymes\nactivated',color:'#f97316'},
    {a:150,r:0.38,label:'Cell lysis / death\n(bactericidal)',color:'#dc2626'},
    {a:210,r:0.38,label:'Beta-lactam ring\nbinds PBP active site',color:'#7c3aed'},
  ];
  ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(cx,cy,h*0.32,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='#fff'; ctx.strokeStyle='#0284c7'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.arc(cx,cy,h*0.14,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#0284c7'; ctx.font=`bold ${Math.max(9,11)}px system-ui`;
  ctx.textAlign='center'; ctx.fillText('β-Lactam',cx,cy-5); ctx.fillText('Ring',cx,cy+8);
  steps2.forEach((s,i) => {
    const rad=s.a*Math.PI/180, rx=cx+h*0.32*Math.cos(rad), ry=cy+h*0.32*Math.sin(rad);
    const bw=Math.min(w*0.27,105), bh=30;
    ctx.fillStyle='#fff'; ctx.strokeStyle=s.color; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(rx-bw/2,ry-bh/2,bw,bh,6); ctx.fill(); ctx.stroke();
    ctx.fillStyle=s.color; ctx.font=`${Math.max(8,9)}px system-ui`;
    ctx.textAlign='center';
    s.label.split('\n').forEach((l,li)=>ctx.fillText(l,rx,ry-4+li*11));
    const a2=(s.a+(i%2===0?-12:12))*Math.PI/180;
    ctx.strokeStyle=s.color+'66'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(cx+h*0.14*Math.cos(rad),cy+h*0.14*Math.sin(rad));
    ctx.lineTo(rx,ry); ctx.stroke(); ctx.setLineDash([]);
  });
  ctx.fillStyle='#64748b'; ctx.font=`${Math.max(9,10)}px system-ui`;
  ctx.textAlign='center';
  ctx.fillText('Bactericidal: time-dependent killing (fT>MIC)',w/2,h-8);
}

function drawSpectrum() {
  const d = getCanvasCtx('spectrumCanvas');
  if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const abx = ['Vancomycin','Pip/Tazo','Meropenem','Ceftriaxone','Cipro','Linezolid','Metronidazole','Azithromycin'];
  const cats = ['MRSA','MSSA','Pseudo','ESBL','Anaerobes','Atypicals'];
  const coverage = [
    [1,1,0,0,0,0],[0,1,1,0,1,0],[0,1,1,1,1,0],[0,1,0,0,0,0],
    [0,0,1,0,0,1],[1,1,0,0,0,0],[0,0,0,0,1,0],[0,0,0,0,0,1],
  ];
  const pad=5, lw=90, ch=Math.min(22,(h-pad*2-20)/(abx.length)), cw=Math.min(38,(w-lw-pad*2)/cats.length);
  const startY=25, startX=lw+pad;
  ctx.fillStyle='#475569'; ctx.font=`bold ${Math.max(8,9)}px system-ui`;
  ctx.textAlign='center';
  cats.forEach((c,i)=>ctx.fillText(c,startX+i*cw+cw/2,20));
  abx.forEach((ab,i) => {
    ctx.fillStyle='#334155'; ctx.font=`${Math.max(8,9)}px system-ui`;
    ctx.textAlign='right'; ctx.fillText(ab,lw,startY+i*ch+ch/2+3);
    cats.forEach((c,j) => {
      const x=startX+j*cw+2, y=startY+i*ch+2, bw=cw-4, bh=ch-4;
      const covered=coverage[i][j];
      ctx.fillStyle=covered?'#4ade80':'#fca5a5';
      ctx.beginPath(); ctx.roundRect(x,y,bw,bh,3); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font=`bold ${Math.max(10,11)}px system-ui`;
      ctx.textAlign='center'; ctx.fillText(covered?'✓':'✗',x+bw/2,y+bh/2+4);
    });
  });
  ctx.fillStyle='#64748b'; ctx.font=`${Math.max(8,9)}px system-ui`;
  ctx.textAlign='center';
  ctx.fillText('Green = coverage, Red = no coverage',w/2,h-6);
}

function drawCYPWeb() {
  const d = getCanvasCtx('cypCanvas');
  if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const enzymes = [
    {id:'CYP3A4',x:0.5,y:0.15,color:'#0284c7',note:'~50% of drugs',size:44},
    {id:'CYP2C9',x:0.2,y:0.45,color:'#dc2626',note:'Warfarin/NSAIDs',size:36},
    {id:'CYP2C19',x:0.5,y:0.48,color:'#7c3aed',note:'PPIs/Clopidogrel',size:36},
    {id:'CYP2D6',x:0.8,y:0.45,color:'#16a34a',note:'Codeine/Tamoxifen',size:36},
    {id:'CYP1A2',x:0.3,y:0.8,color:'#f97316',note:'Clozapine/Theoph.',size:32},
    {id:'CYP2E1',x:0.7,y:0.8,color:'#0891b2',note:'Ethanol/Acetaminophen',size:28},
  ];
  const links = [
    {from:'CYP3A4',to:'CYP2C19',label:'ritonavir inhibits both',color:'#dc2626'},
    {from:'CYP3A4',to:'CYP2C9',label:'fluconazole inh both',color:'#7c3aed'},
    {from:'CYP2D6',to:'CYP2C19',label:'PGx both',color:'#16a34a'},
  ];
  const getPos = id => enzymes.find(e=>e.id===id);
  links.forEach(lk => {
    const a=getPos(lk.from), b=getPos(lk.to);
    if (!a||!b) return;
    ctx.strokeStyle=lk.color+'66'; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(a.x*w,a.y*h); ctx.lineTo(b.x*w,b.y*h); ctx.stroke();
    ctx.setLineDash([]);
  });
  enzymes.forEach(e => {
    const r=e.size/2;
    ctx.fillStyle=e.color+'22'; ctx.strokeStyle=e.color; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(e.x*w,e.y*h,r,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle=e.color; ctx.font=`bold ${Math.max(9,Math.min(11,r/2))}px system-ui`;
    ctx.textAlign='center'; ctx.fillText(e.id,e.x*w,e.y*h+3);
    ctx.fillStyle='#64748b'; ctx.font=`${Math.max(8,9)}px system-ui`;
    ctx.fillText(e.note,e.x*w,e.y*h+r+12);
  });
  ctx.fillStyle='#475569'; ctx.font=`bold 11px system-ui`; ctx.textAlign='center';
  ctx.fillText('CYP450 Enzyme Map — Major Drug Metabolism Pathways',w/2,h-8);
}

// ── MIND MAP ───────────────────────────────────────────────────────────────
const mmNodes = [
  {id:0,label:'BCPS',x:0.5,y:0.47,r:28,color:'#0f172a',textColor:'#fff',group:'core'},
  {id:1,label:'Area 1\nPatient Care',x:0.15,y:0.25,r:22,color:'#0284c7',textColor:'#fff',group:'area'},
  {id:2,label:'Area 2\nTherapeutics',x:0.85,y:0.25,r:22,color:'#7c3aed',textColor:'#fff',group:'area'},
  {id:3,label:'Area 3\nSystems',x:0.5,y:0.88,r:22,color:'#16a34a',textColor:'#fff',group:'area'},
  {id:4,label:'Cardiology',x:0.08,y:0.12,r:16,color:'#0284c7',textColor:'#fff',group:'1'},
  {id:5,label:'ID / ABX',x:0.22,y:0.08,r:16,color:'#0284c7',textColor:'#fff',group:'1'},
  {id:6,label:'Critical\nCare',x:0.08,y:0.4,r:16,color:'#0284c7',textColor:'#fff',group:'1'},
  {id:7,label:'Renal\nAdj.',x:0.2,y:0.45,r:14,color:'#0284c7',textColor:'#fff',group:'1'},
  {id:8,label:'Neuro',x:0.05,y:0.6,r:14,color:'#0284c7',textColor:'#fff',group:'1'},
  {id:9,label:'Biostats',x:0.92,y:0.12,r:16,color:'#7c3aed',textColor:'#fff',group:'2'},
  {id:10,label:'Drug Info\n& EBM',x:0.78,y:0.08,r:16,color:'#7c3aed',textColor:'#fff',group:'2'},
  {id:11,label:'PGx',x:0.95,y:0.4,r:14,color:'#7c3aed',textColor:'#fff',group:'2'},
  {id:12,label:'PK/PD',x:0.82,y:0.45,r:14,color:'#7c3aed',textColor:'#fff',group:'2'},
  {id:13,label:'Drug\nInteractions',x:0.75,y:0.6,r:14,color:'#7c3aed',textColor:'#fff',group:'2'},
  {id:14,label:'Regulatory',x:0.35,y:0.95,r:16,color:'#16a34a',textColor:'#fff',group:'3'},
  {id:15,label:'ISMP /\nSafety',x:0.5,y:0.99,r:14,color:'#16a34a',textColor:'#fff',group:'3'},
  {id:16,label:'ASP',x:0.65,y:0.95,r:14,color:'#16a34a',textColor:'#fff',group:'3'},
  {id:17,label:'Formulary\n& P&T',x:0.3,y:0.75,r:14,color:'#16a34a',textColor:'#fff',group:'3'},
  {id:18,label:'QTc\nRisk',x:0.35,y:0.55,r:13,color:'#f97316',textColor:'#fff',group:'cross'},
  {id:19,label:'Renal\n+ Cardio',x:0.62,y:0.35,r:13,color:'#f97316',textColor:'#fff',group:'cross'},
];
const mmEdges = [
  [0,1],[0,2],[0,3],[1,4],[1,5],[1,6],[1,7],[1,8],
  [2,9],[2,10],[2,11],[2,12],[2,13],[3,14],[3,15],[3,16],[3,17],
  [1,18],[2,18],[1,19],[2,19],[3,19],
];
let mmDrag=null, mmSvgEl=null;
// ── NEW VISUAL DIAGRAMS ────────────────────────────────────────────────────
function drawGlucose() {
  const d = getCanvasCtx('glucoseCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const classes = [
    {name:'Metformin', site:'Liver', moa:'Decrease hepatic glucose output via AMPK', x:0.15,y:0.18,color:'#0284c7'},
    {name:'SGLT2 inhibitors', site:'Kidney', moa:'Block renal glucose reabsorption - glycosuria', x:0.15,y:0.42,color:'#7c3aed'},
    {name:'GLP-1 RAs', site:'Pancreas / GI', moa:'Glucose-dependent insulin secretion', x:0.5,y:0.12,color:'#16a34a'},
    {name:'Sulfonylureas', site:'Pancreas (beta)', moa:'Close KATP channels - non-glucose-dep. release', x:0.5,y:0.36,color:'#dc2626'},
    {name:'DPP-4 inhibitors', site:'Pancreas', moa:'Inhibit DPP-4 - increase endogenous GLP-1', x:0.5,y:0.58,color:'#ea580c'},
    {name:'TZDs', site:'Peripheral tissue', moa:'PPARgamma agonist - increase insulin sensitivity', x:0.83,y:0.24,color:'#0891b2'},
    {name:'Alpha-glucosidase inh.', site:'GI tract', moa:'Delay carbohydrate absorption (acarbose)', x:0.83,y:0.50,color:'#a16207'},
    {name:'Insulin', site:'Systemic', moa:'Direct glucose uptake + anabolic effects', x:0.83,y:0.75,color:'#be185d'},
  ];
  const boxW = Math.min(w*0.28,160), boxH=46;
  classes.forEach(cl => {
    const x=cl.x*w-boxW/2, y=cl.y*h-boxH/2;
    const r=8;
    ctx.fillStyle=cl.color+'22'; ctx.strokeStyle=cl.color; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+boxW-r,y); ctx.arcTo(x+boxW,y,x+boxW,y+r,r);
    ctx.lineTo(x+boxW,y+boxH-r); ctx.arcTo(x+boxW,y+boxH,x+boxW-r,y+boxH,r);
    ctx.lineTo(x+r,y+boxH); ctx.arcTo(x,y+boxH,x,y+boxH-r,r);
    ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillStyle=cl.color; ctx.font='bold '+Math.max(8.5,w*0.022)+'px -apple-system,sans-serif';
    ctx.fillText(cl.name, x+boxW/2, y+5);
    ctx.fillStyle='#334155'; ctx.font=Math.max(7.5,w*0.018)+'px -apple-system,sans-serif';
    const moa=cl.moa.length>38?cl.moa.slice(0,36)+'…':cl.moa;
    ctx.fillText(moa, x+boxW/2, y+20);
    ctx.fillStyle='#94a3b8'; ctx.font='italic '+Math.max(7,w*0.017)+'px -apple-system,sans-serif';
    ctx.fillText('Site: '+cl.site, x+boxW/2, y+34);
  });
  ctx.fillStyle='#0f172a'; ctx.font='bold '+Math.max(9,w*0.023)+'px -apple-system,sans-serif';
  ctx.textAlign='center'; ctx.fillText('Antidiabetic Drug Mechanisms by Target Site', w/2, h*0.92);
}

function drawRenal() {
  const d = getCanvasCtx('renalCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const segs = [
    {name:'Glomerulus', note1:'Filtration: MW<7kDa freely filtered', note2:'Protein-bound drugs NOT filtered', x:0.08,y:0.5,color:'#0284c7'},
    {name:'Proximal Tubule', note1:'OAT/OCT: Secrete metformin, penicillin', note2:'methotrexate, furosemide (active)', x:0.3,y:0.25,color:'#7c3aed'},
    {name:'Loop of Henle', note1:'Thick ascending limb: Na/K/2Cl', note2:'Furosemide + bumetanide target here', x:0.5,y:0.6,color:'#dc2626'},
    {name:'Distal Tubule', note1:'Aldosterone: Na reabsorption', note2:'Spironolactone / eplerenone act here', x:0.7,y:0.25,color:'#16a34a'},
    {name:'Collecting Duct', note1:'ADH/vasopressin: water reabsorption', note2:'Lithium toxicity occurs here', x:0.9,y:0.5,color:'#ea580c'},
  ];
  const bw=Math.min(w*0.18,100), bh=58;
  segs.forEach(s => {
    const x=s.x*w-bw/2, y=s.y*h-bh/2;
    ctx.fillStyle=s.color+'18'; ctx.strokeStyle=s.color; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(x,y,bw,bh,8); ctx.fill(); ctx.stroke();
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillStyle=s.color; ctx.font='bold '+Math.max(8,w*0.021)+'px -apple-system,sans-serif';
    ctx.fillText(s.name, x+bw/2, y+6);
    ctx.fillStyle='#334155'; ctx.font=Math.max(7,w*0.018)+'px -apple-system,sans-serif';
    ctx.fillText(s.note1.slice(0,22), x+bw/2, y+22);
    ctx.fillText(s.note2.slice(0,22), x+bw/2, y+35);
  });
  ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
  ctx.beginPath();
  segs.forEach((s,i) => { const x=s.x*w, y=s.y*h; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle='#64748b'; ctx.font=Math.max(8,w*0.02)+'px -apple-system,sans-serif';
  ctx.textAlign='center'; ctx.fillText('Nephron — Drug Handling & Target Sites', w/2, h*0.93);
}

function drawAbxTargets() {
  const d = getCanvasCtx('abxTargetCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const targets = [
    {label:'Cell Wall Synthesis', icon:'Wall', drugs:['Beta-lactams (PBPs)','Glycopeptides (transglycosylase)','Fosfomycin (MurA)'], x:0.15,y:0.28,color:'#0284c7'},
    {label:'30S Ribosome', icon:'30S', drugs:['Aminoglycosides (16S rRNA)','Tetracyclines (30S A site)','Glycylcyclines (tigecycline)'], x:0.5,y:0.15,color:'#7c3aed'},
    {label:'50S Ribosome', icon:'50S', drugs:['Macrolides (23S rRNA)','Lincosamides (clindamycin)','Oxazolidinones (linezolid)'], x:0.5,y:0.52,color:'#dc2626'},
    {label:'DNA Gyrase/Topo IV', icon:'DNA', drugs:['Fluoroquinolones','(ciprofloxacin, levofloxacin)','(moxifloxacin)'], x:0.82,y:0.28,color:'#16a34a'},
    {label:'Cell Membrane', icon:'Mem', drugs:['Polymyxins (colistin, B)','Daptomycin (Gram+ only)','Disrupts lipid bilayer'], x:0.82,y:0.65,color:'#ea580c'},
    {label:'RNA Polymerase', icon:'RNA', drugs:['Rifampin (RpoB subunit)','Rifabutin, rifapentine','(TB / MAC treatment)'], x:0.15,y:0.72,color:'#a16207'},
  ];
  const bw=Math.min(w*0.26,148), bh=72;
  targets.forEach(t => {
    const x=t.x*w-bw/2, y=t.y*h-bh/2;
    ctx.fillStyle=t.color+'18'; ctx.strokeStyle=t.color; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(x,y,bw,bh,8); ctx.fill(); ctx.stroke();
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillStyle=t.color; ctx.font='bold '+Math.max(8.5,w*0.022)+'px -apple-system,sans-serif';
    ctx.fillText(t.label, x+bw/2, y+7);
    ctx.fillStyle='#334155'; ctx.font=Math.max(7.5,w*0.019)+'px -apple-system,sans-serif';
    t.drugs.forEach((line,i) => ctx.fillText(line.slice(0,26), x+bw/2, y+23+i*13));
  });
  ctx.fillStyle='#64748b'; ctx.font=Math.max(9,w*0.023)+'px -apple-system,sans-serif';
  ctx.textAlign='center'; ctx.fillText('Bacterial Cell — Antibiotic Target Sites', w/2, h*0.94);
}

function drawHFCascade() {
  const d = getCanvasCtx('hfCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const nodes = [
    {lines:['Low Cardiac Output'], x:0.5,y:0.07,color:'#dc2626',main:true},
    {lines:['RAAS Activation','(Ang II, Aldosterone)'], x:0.22,y:0.28,color:'#7c3aed'},
    {lines:['SNS Activation','(Norepinephrine)'], x:0.78,y:0.28,color:'#ea580c'},
    {lines:['Ventricular Remodeling'], x:0.5,y:0.47,color:'#dc2626',main:true},
    {lines:['ACEi / ARB / ARNI','blocks Ang II'], x:0.07,y:0.52,color:'#0284c7',drug:true},
    {lines:['Beta-blockers','block SNS'], x:0.93,y:0.52,color:'#0284c7',drug:true},
    {lines:['MRA (Spiro/Eplerenone)','blocks Aldosterone'], x:0.07,y:0.75,color:'#0284c7',drug:true},
    {lines:['SGLT2i — Hemodynamic','+ Metabolic benefit'], x:0.93,y:0.75,color:'#0284c7',drug:true},
    {lines:['BNP / NT-proBNP','Natriuretic peptides'], x:0.5,y:0.72,color:'#16a34a'},
    {lines:['Worsening HF','Hospitalization'], x:0.5,y:0.92,color:'#dc2626',main:true},
  ];
  const bw=Math.min(w*0.24,135), bh=40;
  const arrows=[[0,1],[0,2],[1,3],[2,3],[3,9],[1,4],[2,5],[1,6],[3,8]];
  ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
  arrows.forEach(([si,di]) => {
    const sx=nodes[si].x*w, sy=nodes[si].y*h+bh/2;
    const dx=nodes[di].x*w, dy=nodes[di].y*h-bh/2;
    ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(dx,dy); ctx.stroke();
  });
  ctx.setLineDash([]);
  nodes.forEach(n => {
    const x=n.x*w-bw/2, y=n.y*h-bh/2;
    ctx.fillStyle=n.drug?'#EBF8FF':n.main?n.color+'22':n.color+'15';
    ctx.strokeStyle=n.drug?'#0284c7':n.color; ctx.lineWidth=n.main?2.5:1.5;
    if(n.drug) ctx.setLineDash([4,2]);
    ctx.beginPath(); ctx.roundRect(x,y,bw,bh,7); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign='center'; ctx.textBaseline='top';
    const fcolor=n.drug?'#0284c7':n.color;
    ctx.fillStyle=fcolor; ctx.font='bold '+Math.max(7.5,w*0.019)+'px -apple-system,sans-serif';
    n.lines.forEach((line,i) => ctx.fillText(line.slice(0,24), x+bw/2, y+7+i*14));
  });
  ctx.fillStyle='#0284c7'; ctx.font='bold '+Math.max(7.5,w*0.018)+'px -apple-system,sans-serif';
  ctx.textAlign='left'; ctx.fillText('- - - Drug intervention (GDMT)', 6, h-8);
}

function drawSSvsNMS() {
  const d = getCanvasCtx('ssNmsCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const rows = [
    {feat:'Feature',ss:'Serotonin Syndrome',nms:'Neuroleptic Malignant Syndrome'},
    {feat:'Cause',ss:'Serotonergic agents (SSRIs, SNRIs, MAOIs, tramadol)',nms:'Dopamine antagonists (antipsychotics, metoclopramide)'},
    {feat:'Onset',ss:'Rapid — hours',nms:'Slow — days to weeks'},
    {feat:'Rigidity',ss:'Clonus / hyperreflexia (not lead-pipe)',nms:'Severe lead-pipe rigidity (hallmark)'},
    {feat:'Temperature',ss:'Hyperthermia',nms:'Hyperthermia'},
    {feat:'Pupils',ss:'Mydriasis (dilated)',nms:'Normal or miosis'},
    {feat:'Reflexes',ss:'Hyperreflexia, clonus',nms:'Hyporeflexia'},
    {feat:'Treatment',ss:'Cyproheptadine (5-HT2A antagonist)',nms:'Dantrolene + bromocriptine'},
  ];
  const cw0=w*0.18, cw1=w*0.41, cw2=w*0.41;
  const rowH=Math.min((h-30)/rows.length, 28);
  rows.forEach((row, ri) => {
    const y=28+ri*rowH;
    const cells=[{txt:row.feat,x:0,cw:cw0},{txt:row.ss,x:cw0,cw:cw1},{txt:row.nms,x:cw0+cw1,cw:cw2}];
    cells.forEach(({txt,x,cw},ci) => {
      if(ri===0) ctx.fillStyle=ci===0?'#334155':ci===1?'#15803d':'#6d28d9';
      else ctx.fillStyle=ri%2===0?(ci===1?'#f0fdf4':ci===2?'#faf5ff':'#f1f5f9'):(ci===1?'#f8fafc':ci===2?'#fdf4ff':'#ffffff');
      ctx.fillRect(x,y,cw,rowH);
      ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=0.5; ctx.strokeRect(x,y,cw,rowH);
      ctx.fillStyle=ri===0?'#fff':'#1e293b';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.font=(ri===0?'bold ':'')+Math.max(7,w*0.017)+'px -apple-system,sans-serif';
      const t=txt.length>30?txt.slice(0,28)+'…':txt;
      ctx.fillText(t, x+cw/2, y+rowH/2);
    });
  });
  ctx.fillStyle='#0f172a'; ctx.font='bold '+Math.max(9,w*0.023)+'px -apple-system,sans-serif';
  ctx.textAlign='center'; ctx.fillText('Serotonin Syndrome vs. NMS — Comparison', w/2, 18);
}

function drawCOPD() {
  const d = getCanvasCtx('copdCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const fs = n => Math.max(8, w*n);
  // Title
  ctx.fillStyle='#0f172a'; ctx.font='bold '+fs(0.022)+'px sans-serif'; ctx.textAlign='center';
  ctx.fillText('COPD Therapy: GOLD Groups & Bronchodilator Targets', w/2, 20);
  // GOLD groups table
  const groups = [
    {grp:'Group A', desc:'Low symptoms, low exac risk', rx:'Short-acting BD (SABA or SAMA) PRN', col:'#22c55e'},
    {grp:'Group B', desc:'High symptoms, low exac risk', rx:'Long-acting BD (LABA or LAMA)', col:'#3b82f6'},
    {grp:'Group C', desc:'Low symptoms, high exac risk', rx:'LAMA preferred', col:'#f59e0b'},
    {grp:'Group D', desc:'High symptoms, high exac risk', rx:'LAMA + LABA; add ICS if eos ≥300', col:'#ef4444'},
  ];
  const rowH=(h-100)/groups.length, startY=40;
  groups.forEach((g,i) => {
    const y = startY + i*rowH;
    ctx.fillStyle=g.col+'22'; ctx.fillRect(8,y,w-16,rowH-3); 
    ctx.fillStyle=g.col; ctx.fillRect(8,y,6,rowH-3);
    ctx.fillStyle=g.col; ctx.font='bold '+fs(0.02)+'px sans-serif'; ctx.textAlign='left';
    ctx.fillText(g.grp, 20, y+14);
    ctx.fillStyle='#64748b'; ctx.font=fs(0.016)+'px sans-serif';
    ctx.fillText(g.desc, 20, y+28);
    ctx.fillStyle='#0f172a'; ctx.font='bold '+fs(0.016)+'px sans-serif';
    ctx.fillText('→ '+g.rx, 20, y+42);
  });
  // Bronchodilator legend
  const legY = h - 55;
  ctx.fillStyle='#f1f5f9'; ctx.fillRect(8, legY, w-16, 50);
  ctx.fillStyle='#0f172a'; ctx.font='bold '+fs(0.017)+'px sans-serif'; ctx.textAlign='left';
  ctx.fillText('Bronchodilator Classes:', 14, legY+14);
  const items = [['SABA','albuterol, levalbuterol','#22c55e'],['SAMA','ipratropium','#3b82f6'],['LABA','salmeterol, formoterol, olodaterol','#8b5cf6'],['LAMA','tiotropium, umeclidinium, glyco','#f59e0b']];
  items.forEach((it, i) => {
    const x = 14 + i*(w-28)/4, iy = legY+28;
    ctx.fillStyle=it[2]; ctx.font='bold '+fs(0.015)+'px sans-serif';
    ctx.fillText(it[0], x, iy);
    ctx.fillStyle='#64748b'; ctx.font=fs(0.013)+'px sans-serif';
    const abbr = it[1].length>18?it[1].slice(0,17)+'…':it[1];
    ctx.fillText(abbr, x, iy+13);
  });
}

function drawOpioid() {
  const d = getCanvasCtx('opioidCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#fafaf9'; ctx.fillRect(0,0,w,h);
  const fs = n => Math.max(8, w*n);
  ctx.fillStyle='#1c1917'; ctx.font='bold '+fs(0.022)+'px sans-serif'; ctx.textAlign='center';
  ctx.fillText('Opioid Receptors & Analgesic Ladder', w/2, 18);
  // WHO Ladder
  const steps = [
    {step:3, label:'Strong opioids', drugs:'Morphine, Oxycodone, Hydromorphone, Fentanyl', col:'#dc2626', w:w*0.85},
    {step:2, label:'Weak opioids + adjuvants', drugs:'Codeine, Tramadol, Low-dose opioids', col:'#ea580c', w:w*0.65},
    {step:1, label:'Non-opioid ± adjuvants', drugs:'Acetaminophen, NSAIDs, Gabapentin', col:'#16a34a', w:w*0.45},
  ];
  let y = 32;
  const stepH = 52;
  steps.forEach((s) => {
    const x = (w - s.w)/2;
    ctx.fillStyle=s.col+'33'; ctx.fillRect(x, y, s.w, stepH);
    ctx.fillStyle=s.col; ctx.lineWidth=1.5; ctx.strokeRect(x, y, s.w, stepH);
    ctx.fillStyle=s.col; ctx.font='bold '+fs(0.018)+'px sans-serif'; ctx.textAlign='center';
    ctx.fillText('Step '+s.step+': '+s.label, w/2, y+17);
    ctx.fillStyle='#44403c'; ctx.font=fs(0.015)+'px sans-serif';
    ctx.fillText(s.drugs, w/2, y+34);
    y += stepH+4;
  });
  // Receptor table
  const tableY = y+8;
  ctx.fillStyle='#1c1917'; ctx.font='bold '+fs(0.018)+'px sans-serif'; ctx.textAlign='center';
  ctx.fillText('Receptor Effects', w/2, tableY);
  const recs = [
    {r:'μ (Mu)', eff:'Analgesia, euphoria, miosis, respiratory depression, constipation, physical dependence'},
    {r:'κ (Kappa)', eff:'Spinal analgesia, sedation, dysphoria'},
    {r:'δ (Delta)', eff:'Analgesia (spinal), modulates μ receptors'},
  ];
  recs.forEach((r, i) => {
    const ry = tableY+14+i*26;
    ctx.fillStyle = i%2===0?'#fef9f0':'#fff7ed';
    ctx.fillRect(8, ry, w-16, 24);
    ctx.fillStyle='#92400e'; ctx.font='bold '+fs(0.016)+'px sans-serif'; ctx.textAlign='left';
    ctx.fillText(r.r+':', 14, ry+15);
    ctx.fillStyle='#44403c'; ctx.font=fs(0.015)+'px sans-serif';
    const eff = r.eff.length>Math.floor(w/7)?r.eff.slice(0,Math.floor(w/7)-2)+'…':r.eff;
    ctx.fillText(eff, 70, ry+15);
  });
  // Reversal
  const revY = tableY+14+recs.length*26+6;
  ctx.fillStyle='#fef2f2'; ctx.fillRect(8,revY,w-16,22);
  ctx.fillStyle='#dc2626'; ctx.font='bold '+fs(0.016)+'px sans-serif'; ctx.textAlign='left';
  ctx.fillText('Reversal: Naloxone (μ antagonist) 0.4mg IV/IM/IN, repeat q2-3min. Duration 30-90 min → re-dose for long-acting opioids.', 12, revY+14);
}

function drawPKPD() {
  const d = getCanvasCtx('pkpdCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
  const fs = n => Math.max(8, w*n);
  ctx.fillStyle='#0f172a'; ctx.font='bold '+fs(0.022)+'px sans-serif'; ctx.textAlign='center';
  ctx.fillText('Antibiotic PK/PD Targets: Concentration vs. Time', w/2, 18);
  // Three panels side by side
  const panW = (w-40)/3, panH = h*0.55;
  const panels = [
    {title:'Concentration-Dep.', sub:'AUC/MIC', ex:'Aminoglycosides, FQ, Daptomycin', col:'#dc2626', desc:'Kill proportional\nto peak/AUC'},
    {title:'Time-Dep. (AUC)', sub:'%T>MIC', ex:'Beta-lactams, Azithromycin', col:'#2563eb', desc:'Kill proportional\nto time above MIC'},
    {title:'Exposure-Dep.', sub:'AUC/MIC (ratio)', ex:'Vancomycin, Azithromycin', col:'#16a34a', desc:'Kill proportional\nto total exposure'},
  ];
  panels.forEach((p, i) => {
    const px = 10 + i*(panW+10), py = 28;
    ctx.fillStyle=p.col+'15'; ctx.fillRect(px,py,panW,panH);
    ctx.fillStyle=p.col; ctx.lineWidth=1; ctx.strokeRect(px,py,panW,panH);
    ctx.fillStyle=p.col; ctx.font='bold '+fs(0.016)+'px sans-serif'; ctx.textAlign='center';
    ctx.fillText(p.title, px+panW/2, py+15);
    ctx.fillStyle='#0f172a'; ctx.font='bold '+fs(0.02)+'px sans-serif';
    ctx.fillText(p.sub, px+panW/2, py+34);
    // Mini graph
    const gx=px+10, gy=py+44, gw=panW-20, gh=panH-90;
    ctx.fillStyle='#fff'; ctx.fillRect(gx,gy,gw,gh);
    ctx.strokeStyle='#94a3b8'; ctx.lineWidth=0.5;
    ctx.strokeRect(gx,gy,gw,gh);
    // Draw MIC line
    const micY = gy+gh*0.55;
    ctx.strokeStyle='#ef4444'; ctx.lineWidth=1; ctx.setLineDash([3,2]);
    ctx.beginPath(); ctx.moveTo(gx,micY); ctx.lineTo(gx+gw,micY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#ef4444'; ctx.font=fs(0.011)+'px sans-serif'; ctx.textAlign='left';
    ctx.fillText('MIC', gx+2, micY-3);
    // Draw concentration curve
    ctx.strokeStyle=p.col; ctx.lineWidth=2;
    ctx.beginPath();
    for(let t=0; t<=gw; t++) {
      const pct=t/gw;
      let concY;
      if(i===0) concY=gy+gh*0.1*(1+Math.exp(-pct*3)*10)/(1+Math.exp(0))-gy*0.05;
      else if(i===1) concY=gy+gh*(0.12+0.7*Math.pow(pct,0.8));
      else concY=gy+gh*(0.1+0.68*(1-Math.exp(-pct*4)));
      concY=gy+Math.max(0,Math.min(gh-2, (1-Math.exp(-t/gw*4))*gh*0.8+gh*0.05));
      if(i===0) concY=gy+gh*(0.05+0.8*Math.exp(-pct*4));
      if(t===0) ctx.moveTo(gx+t,concY); else ctx.lineTo(gx+t,concY);
    }
    ctx.stroke();
    // shade under curve if AUC type
    ctx.fillStyle=p.col+'33';
    ctx.beginPath(); ctx.moveTo(gx,gy+gh);
    for(let t=0; t<=gw; t++) {
      const pct=t/gw;
      let concY=gy+gh*(0.05+0.8*Math.exp(-pct*4));
      if(i===0) { if(t===0)ctx.lineTo(gx,concY); else ctx.lineTo(gx+t,concY); }
    }
    if(i===0){ctx.lineTo(gx+gw,gy+gh);ctx.closePath();ctx.fill();}
    // Label
    ctx.fillStyle='#44556b'; ctx.font=fs(0.013)+'px sans-serif'; ctx.textAlign='center';
    const descLines = p.desc.split('\n');
    descLines.forEach((l,li)=>ctx.fillText(l,px+panW/2,py+panH-28+li*13));
    ctx.fillStyle='#64748b'; ctx.font=fs(0.012)+'px sans-serif';
    ctx.fillText(p.ex.length>20?p.ex.slice(0,19)+'…':p.ex, px+panW/2, py+panH-8);
  });
  // Table
  const tY=28+panH+10;
  const rows=[
    ['PK/PD Index','Goal','Examples','Dosing Strategy'],
    ['Cmax/MIC','≥8-10','Aminoglycosides','High-dose extended interval (Hartford)'],
    ['%T>MIC (fT>MIC)','40-70%','Beta-lactams','Extended infusion (3-4h); freq dosing'],
    ['AUC/MIC','400-600','Vancomycin, FQ','AUC-guided monitoring; q24h FQ'],
  ];
  const colW=[w*0.18,w*0.15,w*0.25,w*0.40];
  rows.forEach((row,ri)=>{
    let xOff=0;
    row.forEach((cell,ci)=>{
      ctx.fillStyle=ri===0?'#1e293b':(ri%2?'#f1f5f9':'#fff');
      ctx.fillRect(xOff,tY+ri*22,colW[ci]-1,21);
      ctx.fillStyle=ri===0?'#fff':'#1e293b'; 
      ctx.font=(ri===0?'bold ':'')+fs(0.014)+'px sans-serif';
      ctx.textAlign='center';
      const txt=cell.length>Math.floor(colW[ci]/7)?cell.slice(0,Math.floor(colW[ci]/7)-2)+'…':cell;
      ctx.fillText(txt,xOff+colW[ci]/2,tY+ri*22+14);
      xOff+=colW[ci];
    });
  });
}

function drawAntidep() {
  const d = getCanvasCtx('antidepCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#fdf4ff'; ctx.fillRect(0,0,w,h);
  const fs = n => Math.max(8, w*n);
  ctx.fillStyle='#4c1d95'; ctx.font='bold '+fs(0.022)+'px sans-serif'; ctx.textAlign='center';
  ctx.fillText('Antidepressant Mechanisms: Neurotransmitter Targets', w/2, 18);
  const classes = [
    {cls:'SSRI', drugs:'Sertraline, Fluoxetine, Escitalopram', mech:'5-HT reuptake ↑', targets:['5-HT↑'], col:'#8b5cf6', note:'First-line; sexual dysfunction, GI'},
    {cls:'SNRI', drugs:'Venlafaxine, Duloxetine, Desvenlafaxine', mech:'5-HT + NE reuptake ↑', targets:['5-HT↑','NE↑'], col:'#0284c7', note:'Pain + depression; HTN at high dose'},
    {cls:'TCA', drugs:'Amitriptyline, Nortriptyline, Clomipramine', mech:'5-HT+NE reuptake ↑, anticholinergic, H1, α1', targets:['5-HT↑','NE↑','ACh↓','H1↓'], col:'#dc2626', note:'Effective; cardiotoxic (QRS), OD risk'},
    {cls:'MAOI', drugs:'Phenelzine, Tranylcypromine, Selegiline', mech:'MAO-A/B inhibition → ↑5-HT, NE, DA', targets:['5-HT↑','NE↑','DA↑'], col:'#d97706', note:'Tyramine restriction (hypertensive crisis)'},
    {cls:'Mirtazapine', drugs:'Mirtazapine (Remeron)', mech:'NaSSA: α2 antagonist, H1 antagonist', targets:['NE↑','5-HT↑','H1↓'], col:'#16a34a', note:'Sedating; weight gain; no sexual SE'},
    {cls:'Bupropion', drugs:'Bupropion (Wellbutrin)', mech:'NE+DA reuptake inhibition (NDRI)', targets:['NE↑','DA↑'], col:'#0891b2', note:'No sexual SE; seizure risk; smoking cessation'},
  ];
  const rowH=(h-32)/classes.length;
  classes.forEach((c,i)=>{
    const y=28+i*rowH;
    ctx.fillStyle=c.col+'18'; ctx.fillRect(4,y,w-8,rowH-2);
    ctx.fillStyle=c.col; ctx.lineWidth=2; 
    ctx.fillRect(4,y,4,rowH-2);
    ctx.fillStyle=c.col; ctx.font='bold '+fs(0.019)+'px sans-serif'; ctx.textAlign='left';
    ctx.fillText(c.cls, 14, y+14);
    ctx.fillStyle='#374151'; ctx.font=fs(0.014)+'px sans-serif';
    const drugStr=c.drugs.length>Math.floor(w*0.45/8)?c.drugs.slice(0,Math.floor(w*0.45/8))+'…':c.drugs;
    ctx.fillText(drugStr, 14, y+27);
    ctx.fillStyle='#1e3a5f'; ctx.font='bold '+fs(0.013)+'px sans-serif';
    ctx.fillText(c.mech, 14, y+40);
    // Note on right
    ctx.fillStyle='#64748b'; ctx.font=fs(0.013)+'px sans-serif'; ctx.textAlign='right';
    const noteStr=c.note.length>30?c.note.slice(0,29)+'…':c.note;
    ctx.fillText(noteStr, w-10, y+14);
  });
}

function drawIBD() {
  const d = getCanvasCtx('ibdCanvas'); if (!d) return;
  const {ctx, w, h} = d;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#f0fdf4'; ctx.fillRect(0,0,w,h);
  const fs = n => Math.max(8, w*n);
  ctx.fillStyle='#14532d'; ctx.font='bold '+fs(0.022)+'px sans-serif'; ctx.textAlign='center';
  ctx.fillText('IBD Therapy Pyramid: UC vs Crohn\u2019s Disease', w/2, 18);
  // Two side-by-side pyramids
  const halfW = (w-24)/2;
  const titles = ['Ulcerative Colitis', "Crohn's Disease"];
  const tiers = [
    ['Mild-Mod','5-ASA (mesalamine) oral + rectal','Corticosteroids for acute flare'],
    ['Mod-Severe','Azathioprine/6-MP or MTX (maintenance)','IV steroids + anti-TNF induction'],
    ['Biologic','Anti-TNF: Infliximab, Adalimumab, Golimumab','Anti-integrin: Vedolizumab'],
    ['Advanced','IL-12/23: Ustekinumab (Crohn)','JAK inhibitor: Tofacitinib (UC), Upadacitinib'],
  ];
  const ucSpecific = ['Mesalamine 1st line for ALL UC severities','Vedolizumab (gut-selective) preferred in UC biologic-naive'];
  const cdSpecific = ['5-ASA limited role in luminal Crohn','Perianal: IFX preferred; check TB, HBV, live vaccines first'];
  [0,1].forEach(side=>{
    const ox = 10 + side*(halfW+4);
    ctx.fillStyle=side===0?'#166534':'#1e3a8a'; ctx.font='bold '+fs(0.018)+'px sans-serif'; ctx.textAlign='center';
    ctx.fillText(titles[side], ox+halfW/2, 36);
    const tierColors = ['#bbf7d0','#6ee7b7','#34d399','#059669'];
    tiers.forEach((tier,ti)=>{
      const y=48+ti*((h-80)/tiers.length);
      const tw=halfW*(0.97-ti*0.04);
      const tx=ox+(halfW-tw)/2;
      const thh=(h-80)/tiers.length-4;
      ctx.fillStyle=tierColors[ti];
      ctx.fillRect(tx,y,tw,thh);
      ctx.strokeStyle='#064e3b'; ctx.lineWidth=0.5; ctx.strokeRect(tx,y,tw,thh);
      ctx.fillStyle='#064e3b'; ctx.font='bold '+fs(0.014)+'px sans-serif'; ctx.textAlign='center';
      ctx.fillText(tier[0], ox+halfW/2, y+12);
      ctx.fillStyle='#1e293b'; ctx.font=fs(0.012)+'px sans-serif';
      const drugTxt = tier[1+side].length>Math.floor(tw/7)?tier[1+side].slice(0,Math.floor(tw/7)-2)+'…':tier[1+side];
      ctx.fillText(drugTxt, ox+halfW/2, y+26);
    });
    // Bottom note
    const noteY = h-26;
    const notes = side===0?ucSpecific:cdSpecific;
    ctx.fillStyle=side===0?'#14532d':'#1e3a8a'; ctx.font=fs(0.012)+'px sans-serif'; ctx.textAlign='center';
    ctx.fillText(notes[0], ox+halfW/2, noteY);
  });
}

function initMindMap() {
  mmSvgEl=document.getElementById('mindmapSvg');
  if (!mmSvgEl) return;
  const svgW=mmSvgEl.clientWidth||600, svgH=mmSvgEl.clientHeight||460;
  const nodes=mmNodes.map(n=>({...n,px:n.x*svgW,py:n.y*svgH}));
  const renderMM = ()=>{
    mmSvgEl.innerHTML='';
    const ns='http://www.w3.org/2000/svg';
    const defs=document.createElementNS(ns,'defs');
    const filter=document.createElementNS(ns,'filter'); filter.id='mmblur';
    const blur=document.createElementNS(ns,'feDropShadow');
    blur.setAttribute('dx','0'); blur.setAttribute('dy','1'); blur.setAttribute('stdDeviation','2'); blur.setAttribute('flood-opacity','0.15');
    filter.appendChild(blur); defs.appendChild(filter); mmSvgEl.appendChild(defs);
    mmEdges.forEach(([a,b])=>{
      const na=nodes[a],nb=nodes[b];
      const line=document.createElementNS(ns,'line');
      line.setAttribute('x1',na.px); line.setAttribute('y1',na.py);
      line.setAttribute('x2',nb.px); line.setAttribute('y2',nb.py);
      line.setAttribute('stroke',na.color+'55'); line.setAttribute('stroke-width','1.5');
      mmSvgEl.appendChild(line);
    });
    nodes.forEach((n,i)=>{
      const g=document.createElementNS(ns,'g');
      g.setAttribute('transform',`translate(${n.px},${n.py})`);
      g.style.cursor='grab';
      const c=document.createElementNS(ns,'circle');
      c.setAttribute('r',n.r); c.setAttribute('fill',n.color);
      c.setAttribute('filter','url(#mmblur)');
      c.setAttribute('opacity','0.92');
      g.appendChild(c);
      const t=document.createElementNS(ns,'text');
      t.setAttribute('text-anchor','middle'); t.setAttribute('fill',n.textColor);
      t.setAttribute('font-size',Math.max(8,Math.min(11,n.r/2.2)));
      t.setAttribute('font-weight','bold'); t.setAttribute('pointer-events','none');
      const lines2=n.label.split('\n');
      lines2.forEach((l,li)=>{
        const ts=document.createElementNS(ns,'tspan');
        ts.setAttribute('x','0'); ts.setAttribute('dy',li===0?`-${(lines2.length-1)*5}`:12);
        ts.textContent=l; t.appendChild(ts);
      });
      g.appendChild(t);
      g.addEventListener('mousedown',e=>{mmDrag={i,ox:e.clientX-n.px,oy:e.clientY-n.py};e.preventDefault();});
      g.addEventListener('touchstart',e=>{const t2=e.touches[0];mmDrag={i,ox:t2.clientX-n.px,oy:t2.clientY-n.py};e.preventDefault();},{passive:false});
      mmSvgEl.appendChild(g);
    });
  };
  renderMM();
  const move=(cx,cy)=>{
    if(mmDrag===null)return;
    nodes[mmDrag.i].px=cx-mmDrag.ox; nodes[mmDrag.i].py=cy-mmDrag.oy;
    renderMM();
  };
  document.addEventListener('mousemove',e=>move(e.clientX,e.clientY));
  document.addEventListener('mouseup',()=>mmDrag=null);
  document.addEventListener('touchmove',e=>{const t2=e.touches[0];move(t2.clientX,t2.clientY);},{passive:true});
  document.addEventListener('touchend',()=>mmDrag=null);
}

// ── SPOTLIGHT SEARCH ENGINE ────────────────────────────────────────────────
let spotlightOpen = false;
let _spotlightIndex = null;
let _spotlightFocusIdx = -1;

function buildSpotlightIndex() {
  const idx = [];
  // ── Quiz questions ──────────────────────────────────────────────────────────
  quizData.forEach((q, i) => {
    idx.push({ type:'quiz', icon:'🧠', title: q.q.slice(0,80)+(q.q.length>80?'…':''),
      sub: q.topic + (q.domain?' · '+q.domain:'') + ' · ' + ({exam:'Exam Level',hard:'Hard',expert:'Expert'}[q.diff]||q.diff),
      search: (q.q+' '+q.topic+' '+(q.exp||'')).toLowerCase(),
      action: ()=>{ switchSection('quiz'); setTimeout(()=>{ loadQuestionById(i); },150); } });
  });
  // ── Flashcards ──────────────────────────────────────────────────────────────
  flashData.forEach((f, i) => {
    idx.push({ type:'flash', icon:'🃏', title: f.front.slice(0,80)+(f.front.length>80?'…':''),
      sub: f.topic,
      search: (f.front+' '+f.back+' '+f.topic).toLowerCase(),
      action: ()=>{ switchSection('flash'); setTimeout(()=>{ goToFlashCard(i); },150); } });
  });
  // ── Drug reference database entries (DRUG_DB) ───────────────────────────────
  if (typeof DRUG_DB !== 'undefined') {
    DRUG_DB.forEach(drug => {
      idx.push({ type:'drug', icon:'💊',
        title: drug.name + (drug.brand ? ' (' + drug.brand + ')' : ''),
        sub: drug.area + (drug.class ? ' · ' + drug.class : ''),
        search: (
          drug.name + ' ' + (drug.brand||'') + ' ' + (drug.class||'') + ' ' +
          (drug.moa||'') + ' ' + (drug.indications||'') + ' ' +
          drug.area + ' ' + (drug.ades||'').slice(0,200) + ' ' +
          (drug.pearls||'').slice(0,200) + ' ' + (drug.highyield||'').slice(0,200)
        ).toLowerCase(),
        action: ()=>{
          switchSection('concepts');
          setTimeout(()=>{
            const inp = document.getElementById('drugSearch');
            if (inp) { inp.value = drug.name; drugFilterState.query = drug.name.toLowerCase(); drugRender(); inp.focus(); }
          }, 250);
        }
      });
    });
  }
  // ── Evidence trials ─────────────────────────────────────────────────────────
  if (typeof evidenceData !== 'undefined') {
    evidenceData.forEach((t, i) => {
      idx.push({ type:'evidence', icon:'🏛️', title: t.trial+(t.year?' ('+t.year+')':''),
        sub: t.area + ' · ' + t.subtitle,
        search: (t.trial+' '+t.area+' '+t.subtitle+' '+(t.finding||'')+' '+(t.drug||'')).toLowerCase(),
        action: ()=>{ switchSection('evidence'); setTimeout(()=>{ highlightEvCard(i); },200); } });
    });
  }
  // ── Glossary terms (GLO_TERMS) ──────────────────────────────────────────────
  if (typeof GLO_TERMS !== 'undefined') {
    GLO_TERMS.forEach((g, i) => {
      idx.push({ type:'glo', icon:'📖',
        title: g.term + (g.abbrev ? ' (' + g.abbrev + ')' : ''),
        sub: (g.cat || 'Glossary') + (g.chapter ? ' · ' + g.chapter : ''),
        search: (g.term + ' ' + (g.abbrev||'') + ' ' + (g.def||'') + ' ' + (g.cat||'')).toLowerCase(),
        action: ()=>{
          switchSection('glossary');
          setTimeout(()=>{
            const gInp = document.getElementById('gloSearch');
            if (gInp) { gInp.value = g.term; if(typeof window.updateGloFilterCounts === 'function') window.updateGloFilterCounts(); gInp.dispatchEvent(new Event('input')); }
          }, 200);
        }
      });
    });
  }
  // ── ACCP Mock Exam questions (accpData) ─────────────────────────────────────
  try {
    const _accpEl = ({textContent: JSON.stringify(window.__accpData)});
    if (_accpEl) {
      const _accpQ = JSON.parse(_accpEl.textContent);
      _accpQ.forEach((q) => {
        idx.push({ type:'accp', icon:'📋',
          title: 'Q' + q.num + '. ' + q.stem.slice(0,70) + (q.stem.length>70?'…':''),
          sub: q.category + ' · ACCP Mock Exam',
          search: (q.stem + ' ' + q.category + ' ' + (q.exp||'') + ' ' + (q.choices||[]).join(' ')).toLowerCase(),
          action: ()=>{
            switchSection('accp');
            setTimeout(()=>{
              const qi = q.num - 1;
              if (typeof window._aq !== 'undefined') {
                window._aq = qi;
                if (typeof window.renderAccpQ === 'function') window.renderAccpQ();
              }
            }, 200);
          }
        });
      });
    }
  } catch(e) { /* accpData unavailable */ }
  // ── Study Guide chapters ────────────────────────────────────────────────────
  const _studyChapters = window.__studyChapters;;
  _studyChapters.forEach((title) => {
    idx.push({ type:'chapter', icon:'📗',
      title: title,
      sub: 'Study Guide · BCPS Pharmacotherapy',
      search: title.toLowerCase(),
      action: ()=>{
        switchSection('study');
        setTimeout(()=>{
          const cards = document.querySelectorAll('.chapter-card');
          for (const card of cards) {
            const h3 = card.querySelector('h3 span');
            if (h3 && h3.textContent.trim() === title) {
              card.classList.add('open');
              card.scrollIntoView({behavior:'smooth', block:'start'});
              break;
            }
          }
        }, 300);
      }
    });
  });
  return idx;
}

function openSpotlight() {
  spotlightOpen = true;
  const ov = document.getElementById('spotlightOverlay');
  ov.classList.add('open');
  const inp = document.getElementById('spotlightInput');
  inp.value = '';
  inp.focus();
  if (!_spotlightIndex) _spotlightIndex = buildSpotlightIndex();
  searchSpotlight('');
}

function closeSpotlight() {
  spotlightOpen = false;
  document.getElementById('spotlightOverlay').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if ((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); openSpotlight(); }
  if (e.key==='Escape' && spotlightOpen) closeSpotlight();
});

function spotlightKeyNav(e) {
  const items = document.querySelectorAll('.spotlight-item');
  if (e.key==='ArrowDown') { e.preventDefault(); _spotlightFocusIdx = Math.min(_spotlightFocusIdx+1,items.length-1); }
  else if (e.key==='ArrowUp') { e.preventDefault(); _spotlightFocusIdx = Math.max(_spotlightFocusIdx-1,0); }
  else if (e.key==='Enter') { if (_spotlightFocusIdx>=0 && items[_spotlightFocusIdx]) items[_spotlightFocusIdx].click(); return; }
  items.forEach((el,i) => el.classList.toggle('focused', i===_spotlightFocusIdx));
  if (items[_spotlightFocusIdx]) items[_spotlightFocusIdx].scrollIntoView({block:'nearest'});
}

function hlMatch(text, q) {
  if (!q) return text;
  const re = new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
  return text.replace(re,'<mark class="hl-match">$1</mark>');
}

function searchSpotlight(raw) {
  _spotlightFocusIdx = -1;
  const q = raw.trim().toLowerCase();
  const container = document.getElementById('spotlightResults');
  if (!_spotlightIndex) _spotlightIndex = buildSpotlightIndex();

  // ── Global action store: avoids serializing closures into onclick strings ──
  if (!window._spAct) window._spAct = [];
  window._spAct = []; // reset on each search

  function _spItem(it) {
    const k = window._spAct.length;
    window._spAct.push(it.action);
    return `<div class="spotlight-item" tabindex="0"
      onclick="window._spAct[${k}]();closeSpotlight();"
      onkeydown="if(event.key==='Enter'){window._spAct[${k}]();closeSpotlight();}">
      <span class="spotlight-item-icon">${it.icon}</span>
      <div class="spotlight-item-body">
        <div class="spotlight-item-title">${hlMatch(it.title, raw)}</div>
        <div class="spotlight-item-sub">${it.sub}</div>
      </div></div>`;
  }

  if (!q) {
    // Quick Jump — these actions use no closure vars, safe to call directly
    const qj = [
      {icon:'📖',title:'Study Guide',sub:'22 chapters of BCPS pharmacotherapy',action:()=>{switchSection('study');closeSpotlight();}},
      {icon:'🧠',title:'Quiz Mode',sub:quizData.length+' questions — all topics',action:()=>{switchSection('quiz');closeSpotlight();}},
      {icon:'🃏',title:'Flashcards',sub:flashData.length+' spaced-repetition cards',action:()=>{switchSection('flash');closeSpotlight();}},
      {icon:'💊',title:'Drug Reference',sub:'70 BCPS drugs with PK, interactions, pearls',action:()=>{switchSection('concepts');closeSpotlight();}},
      {icon:'🔬',title:'Visual Pharmacology',sub:'Pathways, cascades, mechanism diagrams',action:()=>{switchSection('visuals');closeSpotlight();}},
      {icon:'🏛️',title:'Evidence-Based References',sub:'Landmark trials & major guidelines',action:()=>{switchSection('evidence');closeSpotlight();}},
      {icon:'📋',title:'ACCP Mock Exam',sub:'150 practice questions · Category-based review',action:()=>{switchSection('accp');closeSpotlight();}},
      {icon:'🎯',title:'Exam Psychology',sub:'Strategy, timing, cognitive biases',action:()=>{switchSection('exampsych');closeSpotlight();}}
    ];
    container.innerHTML = '<div class="spotlight-cat">Quick Jump</div>' +
      qj.map(it => _spItem(it)).join('');
    return;
  }

  // ── Filter with title-match priority ───────────────────────────────────────
  // Score: 2 = title starts with query, 1 = title contains query, 0 = body match
  const allMatches = _spotlightIndex
    .filter(it => it.search.includes(q))
    .map(it => {
      const tl = it.title.toLowerCase();
      const score = tl.startsWith(q) ? 2 : tl.includes(q) ? 1 : 0;
      return { it, score };
    })
    .sort((a, b) => b.score - a.score);

  if (!allMatches.length) {
    container.innerHTML = `<div class="spotlight-empty">No results for "<strong>${raw}</strong>"<br><span style="font-size:0.78rem;color:var(--label2)">Try a drug name, topic, or clinical term</span></div>`;
    return;
  }

  // ── Group by type, cap at 8 per type ──────────────────────────────────────
  // Type display order: specific reference types first, then broad question banks
  const typeLabel = {
    drug:     'Drug Reference',
    chapter:  'Study Guide Chapters',
    glo:      'Glossary',
    accp:     'ACCP Mock Exam',
    evidence: 'Evidence / Trials',
    flash:    'Flashcards',
    quiz:     'Quiz Questions'
  };
  const PER_TYPE = 8;
  const groups = {};
  allMatches.forEach(({it}) => {
    if (!groups[it.type]) groups[it.type] = [];
    if (groups[it.type].length < PER_TYPE) groups[it.type].push(it);
  });

  let html = '';
  Object.keys(typeLabel).forEach(type => {
    if (!groups[type] || !groups[type].length) return;
    const totalForType = allMatches.filter(({it}) => it.type === type).length;
    const shown = groups[type].length;
    const moreStr = totalForType > shown ? ` — showing top ${shown}` : '';
    html += `<div class="spotlight-cat">${typeLabel[type]} (${totalForType}${moreStr})</div>`;
    html += groups[type].map(it => _spItem(it)).join('');
  });
  container.innerHTML = html;
}

function loadQuestionById(idx) {
  if (idx >= 0 && idx < quizData.length) {
    if (!quizInitialized) initQuiz();
    renderQuestion(quizData[idx]);
  }
}
function goToFlashCard(idx) {
  if (!flashInitialized) initFlash();
  currentFlash = idx;
  renderFlash();
}

// ── EVIDENCE-BASED REFERENCES ──────────────────────────────────────────────
let evidenceInitialized = false;
let evActiveFilter = 'all';
let evidenceData = window.__evidenceData;;


function initEvidence() {
  evidenceInitialized = true;
  // Rebuild spotlight index to include evidence
  _spotlightIndex = null;
  renderEvidence('all','');
}

let evActiveArea = 'all';
function setEvFilter(filter, btn) {
  evActiveArea = filter;
  document.querySelectorAll('.ev-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderEvidence(filter, document.getElementById('evSearch').value);
}

function filterEvidence(q) {
  renderEvidence(evActiveArea, q);
}

function renderEvidence(areaFilter, query) {
  const container = document.getElementById('evContent');
  const q = (query||'').toLowerCase().trim();
  let shown = 0;
  container.innerHTML = '';
  evidenceData.forEach((t, i) => {
    const areaMatch = areaFilter==='all' || t.area===areaFilter || t.type===areaFilter || (areaFilter==='landmark' && t.type==='landmark') || (areaFilter==='guideline' && t.type==='guideline');
    const textMatch = !q || [t.trial,t.subtitle,t.area,t.finding,t.drug,t.impact,(t.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
    if (!areaMatch || !textMatch) return;
    shown++;
    const card = document.createElement('div');
    card.className = `ev-card ev-${t.type}`;
    card.id = 'ev-card-'+i;
    const tagsHtml = (t.tags||[]).map(tg=>`<span class="ev-tag">${tg}</span>`).join('');
    const pubmedHtml = t.pubmed ? `<a href="https://pubmed.ncbi.nlm.nih.gov/${t.pubmed}/" target="_blank" class="ev-pubmed-link">📗 PubMed ${t.pubmed}</a>` : '';
    card.innerHTML = `
      <div class="ev-card-header" onclick="this.closest('.ev-card').classList.toggle('open')">
        <span class="ev-card-year">${t.year||'Guide'}</span>
        <div class="ev-card-info">
          <div class="ev-card-title">${t.trial}</div>
          <div class="ev-card-subtitle">${t.subtitle}</div>
        </div>
        <span class="ev-card-chevron">▼</span>
      </div>
      <div class="ev-card-body">
        <div class="ev-detail-grid">
          <div class="ev-detail-cell"><div class="ev-detail-label">Drug / Intervention</div><div class="ev-detail-val">${t.drug||'—'}</div></div>
          <div class="ev-detail-cell"><div class="ev-detail-label">Design / N</div><div class="ev-detail-val">${t.design||'—'} · ${t.n||'—'}</div></div>
          <div class="ev-detail-cell"><div class="ev-detail-label">Primary Endpoint</div><div class="ev-detail-val">${t.endpoint||'—'}</div></div>
          <div class="ev-detail-cell"><div class="ev-detail-label">Area</div><div class="ev-detail-val">${t.area}</div></div>
        </div>
        <div class="ev-finding">🔬 <strong>Key Finding:</strong> ${t.finding}</div>
        <div class="ev-impact">✅ <strong>Clinical Impact / Guideline Change:</strong> ${t.impact}</div>
        <div class="ev-tags">${tagsHtml}</div>
        ${pubmedHtml}
      </div>`;
    container.appendChild(card);
  });
  if (!shown) container.innerHTML = '<div class="empty-state"><h3>No matching trials</h3><p>Try adjusting the filter or search term.</p></div>';
}

function highlightEvCard(i) {
  const card = document.getElementById('ev-card-'+i);
  if (card) { card.classList.add('open'); card.scrollIntoView({behavior:'smooth',block:'center'}); }
}

// ── EXAM PSYCH DRILLS ──────────────────────────────────────────────────────
const epDrills = window.__epDrills;;
let epIdx=0, epScore=0, epTotal=0;
function initEpDrills() {
  epIdx=0; epScore=0; epTotal=0;
  showEpDrill();
}
function showEpDrill() {
  if (epIdx >= epDrills.length) {
    document.getElementById('drillContent').innerHTML=`<div style="text-align:center;padding:1rem"><div style="font-size:2rem">🎉</div><div style="font-size:1.1rem;font-weight:700;margin:0.5rem 0">Drill Complete!</div><div style="color:#64748b">Score: ${epScore}/${epDrills.length}</div><button class="btn btn-primary" style="margin-top:0.75rem" onclick="initEpDrills()">Restart Drills</button></div>`;
    document.getElementById('drillNextBtn').style.display='none';
    document.getElementById('drillBar').style.width='100%';
    return;
  }
  const d=epDrills[epIdx];
  document.getElementById('drillScore').textContent=`Question ${epIdx+1} of ${epDrills.length} | Score: ${epScore}/${epTotal}`;
  document.getElementById('drillBar').style.width=`${epIdx/epDrills.length*100}%`;
  document.getElementById('drillNextBtn').style.display='none';
  document.getElementById('drillContent').innerHTML=`
    <div class="ep-drill">
      <div class="ep-drill-q">${d.q}</div>
      ${d.opts.map((o,i)=>`<button class="ep-drill-opt" onclick="answerEpDrill(${i})">${'ABCD'[i]}. ${o}</button>`).join('')}
      <div class="ep-drill-exp" id="drillExp">${d.exp}</div>
    </div>`;
}
function answerEpDrill(i) {
  const d=epDrills[epIdx]; epTotal++;
  if (i===d.correct) epScore++;
  const btns=document.querySelectorAll('.ep-drill-opt');
  btns.forEach((b,j)=>{b.disabled=true; if(j===d.correct)b.classList.add('correct'); else if(j===i)b.classList.add('wrong');});
  document.getElementById('drillExp').style.display='block';
  document.getElementById('drillScore').textContent=`Question ${epIdx+1} of ${epDrills.length} | Score: ${epScore}/${epTotal}`;
  document.getElementById('drillNextBtn').style.display='block';
}
function nextEpDrill() { epIdx++; showEpDrill(); }

function calcTiming() {
  const tq=parseInt(document.getElementById('tq').value)||185;
  const tt=parseInt(document.getElementById('tt').value)||250;
  const tb=parseInt(document.getElementById('tb').value)||10;
  const perQ=(tt*60/tq);
  const mins=Math.floor(perQ/60), secs=Math.floor(perQ%60);
  document.getElementById('tVal1').textContent=`${mins}:${secs<10?'0':''}${secs}`;
  const at50=Math.round(50*perQ/60);
  const at100=Math.round(100*perQ/60);
  document.getElementById('tVal2').textContent=`${tt-at50} min remaining`;
  document.getElementById('tVal3').textContent=`${tt-at100} min remaining`;
  const reserve=Math.round(tt*(tb/100));
  document.getElementById('tVal4').textContent=`${reserve} min`;
}

// ── EXTEND switchSection to init new sections ─────────────────────────────
/* switchSection: merged above */

;
/* ───── next block ───── */

const GLO_TERMS = window.__GLO_TERMS;;

let gloCurCat = 'ALL';
let gloCurQ = '';

function gloInit() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const az = document.getElementById('gloAZ');
  const used = new Set(GLO_TERMS.map(t => t.term[0].toUpperCase()));
  letters.forEach(l => {
    const btn = document.createElement('button');
    btn.className = 'glo-az-btn' + (used.has(l) ? ' has-terms' : '');
    btn.textContent = l;
    btn.onclick = () => { const el = document.getElementById('glo-letter-' + l); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); };
    az.appendChild(btn);
  });
  gloRender();
  // Add count to each filter button
  document.querySelectorAll('.glo-filter-btn').forEach(btn => {
    const cat = btn.getAttribute('onclick').match(/'([^']+)'/)?.[1];
    if (!cat) return;
    const n = cat === 'ALL' ? GLO_TERMS.length : GLO_TERMS.filter(t => t.cat === cat).length;
    btn.textContent = btn.textContent + ' (' + n + ')';
  });
}

function gloFilter() {
  gloCurQ = document.getElementById('gloSearch').value.toLowerCase();
  gloRender();
}

function gloSetCat(btn, cat) {
  document.querySelectorAll('.glo-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  gloCurCat = cat;
  gloRender();
}

function gloRender() {
  const q = gloCurQ;
  let terms = GLO_TERMS;
  if (gloCurCat !== 'ALL') terms = terms.filter(t => t.cat === gloCurCat);
  if (q) terms = terms.filter(t =>
    t.term.toLowerCase().includes(q) ||
    (t.abbrev && t.abbrev.toLowerCase().includes(q)) ||
    t.def.toLowerCase().includes(q) ||
    (t.related && t.related.join(' ').toLowerCase().includes(q))
  );

  document.getElementById('gloCount').textContent = terms.length + ' term' + (terms.length !== 1 ? 's' : '');
  const out = document.getElementById('gloOutput');

  if (terms.length === 0) {
    out.innerHTML = '<div class="glo-no-results">No terms found for "' + q + '"</div>';
    return;
  }

  const groups = {};
  terms.forEach(t => {
    const l = t.term[0].toUpperCase();
    if (!groups[l]) groups[l] = [];
    groups[l].push(t);
  });

  const catColors = {
    'PK/PD': '#4f6d8a', 'Pharmacology': '#7a6aa8', 'Cardiovascular': '#b0533a',
    'Infectious Disease': '#5a7d4a', 'Critical Care': '#a8763a',
    'Endocrinology': '#8a6d3a', 'Neurology': '#6a5a8a', 'Nephrology': '#4f7d7a',
    'Hematology': '#9a4a4a', 'Pulmonology': '#5a7d7a', 'Lab Values': '#5a6478',
    'Abbreviations': '#8a8578', 'Psychiatry': '#8a5a7a', 'Oncology': '#6a5a8a'
  };

  let html = '';
  Object.keys(groups).sort().forEach(letter => {
    html += '<div class="glo-letter-group" id="glo-letter-' + letter + '">';
    html += '<span class="glo-letter-anchor">' + letter + '</span>';
    html += '<div class="glo-grid">';
    groups[letter].forEach(t => {
      const cc = catColors[t.cat] || '#4a9eff';
      const abbrevHtml = t.abbrev ? '<span class="glo-abbrev">' + t.abbrev + '</span>' : '';
      const relatedHtml = (t.related && t.related.length) ? '<div style="margin-top:5px">' + t.related.map(r => '<span class="glo-related-tag" data-gloterm="' + r.replace(/"/g,'&quot;') + '" onclick="gloSearchFor(this.dataset.gloterm)">' + r + '</span>').join('') + '</div>' : '';
      const chapterHtml = t.chapter ? '<span class="glo-meta-item">📖 ' + t.chapter + '</span>' : '';
      const srcHtml = t.src ? '<span class="glo-meta-item">📄 ' + t.src + '</span>' : '';

      html += '<div class="glo-card">';
      html += '<div class="glo-card-header"><span class="glo-term">' + t.term + '</span>' + abbrevHtml;
      html += '<span class="glo-cat-badge" style="background:' + cc + '22;color:' + cc + ';border:1px solid ' + cc + '44">' + t.cat + '</span></div>';
      html += '<div class="glo-def">' + t.def + '</div>';
      if (relatedHtml) html += relatedHtml;
      if (chapterHtml || srcHtml) html += '<div class="glo-meta">' + chapterHtml + srcHtml + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });

  out.innerHTML = html;
}

function gloSearchFor(term) {
  document.getElementById('gloSearch').value = term;
  gloCurCat = 'ALL';
  document.querySelectorAll('.glo-filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.glo-filter-btn[onclick*="ALL"]').classList.add('active');
  gloCurQ = term.toLowerCase();
  gloRender();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', gloInit);
} else {
  gloInit();
}


;
/* ───── next block ───── */

const DRUG_DB = window.__DRUG_DB;;


// Drug Database & UI Management
let drugFilterState = { query: '', area: 'ALL' };
let drugExpandedCards = new Set();
let drugSearchTimeout;

function drugInit() {
  const searchInput = document.getElementById('drugSearch');
  const expandAllBtn = document.getElementById('drugExpandAll');
  const collapseAllBtn = document.getElementById('drugCollapseAll');

  // Search input listener (debounced)
  searchInput.addEventListener('input', (e) => {
    clearTimeout(drugSearchTimeout);
    drugSearchTimeout = setTimeout(() => {
      drugFilterState.query = e.target.value.toLowerCase();
      drugRender();
    }, 150);
  });

  // Expand/Collapse all buttons
  expandAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.drug-card').forEach(card => {
      const id = card.getAttribute('data-id');
      drugExpandedCards.add(id);
    });
    drugRender();
  });

  collapseAllBtn.addEventListener('click', () => {
    drugExpandedCards.clear();
    drugRender();
  });

  // Area filter buttons
  document.querySelectorAll('.drug-area-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.drug-area-btn').forEach(b => b.style.opacity = '0.6');
      e.target.style.opacity = '1';
      drugFilterState.area = e.target.getAttribute('data-area');
      drugRender();
    });
  });

  // Initial render
  drugRender();
}

const AREA_COLORS = {
  'Cardiovascular':    '#b0533a',
  'Infectious Disease':'#5a7d4a',
  'Critical Care':     '#a8763a',
  'Endocrinology':     '#7a6aa8',
  'Neurology':         '#4f6d8a',
  'Hematology':        '#9a4a4a',
  'Pulmonology':       '#5a7d7a',
  'Nephrology':        '#4f7d7a',
  'GI/Hepatology':     '#8a6d3a',
  'Psychiatry':        '#8a5a7a',
  'Oncology':          '#6a5a8a',
  'Transplant':        '#5a7d5a',
  'Pain':              '#7a6a5a',
};
function drugRender() {
  const listEl = document.getElementById('drugList');
  listEl.innerHTML = '';

  let filtered = DRUG_DB.filter(drug => {
    const matchArea = drugFilterState.area === 'ALL' || drug.area === drugFilterState.area;
    const q = drugFilterState.query;
    const matchQuery = !q ||
      drug.name.toLowerCase().includes(q) ||
      (drug.brand||'').toLowerCase().includes(q) ||
      (drug.class||'').toLowerCase().includes(q) ||
      (drug.moa||'').toLowerCase().includes(q) ||
      (drug.indications||'').toLowerCase().includes(q) ||
      drug.area.toLowerCase().includes(q) ||
      (drug.ades||'').toLowerCase().includes(q) ||
      (drug.pearls||'').toLowerCase().includes(q) ||
      (drug.highyield||'').toLowerCase().includes(q) ||
      (drug.ddi||'').toLowerCase().includes(q);
    return matchArea && matchQuery;
  });

  filtered.forEach(drug => {
    const areaColor = AREA_COLORS[drug.area] || '#999';
    const isExpanded = drugExpandedCards.has(drug.id);

    const cardEl = document.createElement('div');
    cardEl.className = 'drug-card' + (isExpanded ? ' expanded' : '');
    cardEl.setAttribute('data-id', drug.id);
    cardEl.style.cssText = `
      background: var(--card);
      border: 1px solid var(--sep, #e5e7eb);
      border-left: 4px solid ${areaColor};
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    `;

    // Header (always visible, clickable)
    const headerEl = document.createElement('div');
    headerEl.className = 'drug-card-header';
    headerEl.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider);
      cursor: pointer;
    `;

    const badgeEl = document.createElement('span');
    badgeEl.className = 'drug-class-badge';
    badgeEl.style.cssText = `
      background: ${areaColor};
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      white-space: nowrap;
    `;
    badgeEl.textContent = drug.area;

    const nameEl = document.createElement('div');
    nameEl.style.flex = '1';
    nameEl.innerHTML = `
      <div class="drug-name" style="font-weight: bold; font-size: 16px;">${drug.name}</div>
      <div class="drug-brand" style="font-size: 13px; color: var(--label2);">${drug.brand} • ${drug.class}</div>
      <div class="drug-moa" style="font-size: 12px; color: var(--label3); margin-top: 4px; font-style: italic;">${drug.moa}</div>
    `;

    const chevronEl = document.createElement('span');
    chevronEl.style.cssText = `
      font-size: 20px;
      transition: transform 0.2s ease;
      transform: ${isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
      color: var(--primary);
    `;
    chevronEl.textContent = '▼';

    headerEl.appendChild(badgeEl);
    headerEl.appendChild(nameEl);
    headerEl.appendChild(chevronEl);

    headerEl.addEventListener('click', () => {
      if (drugExpandedCards.has(drug.id)) {
        drugExpandedCards.delete(drug.id);
      } else {
        drugExpandedCards.add(drug.id);
      }
      drugRender();
    });

    cardEl.appendChild(headerEl);

    // Detail section (hidden by default)
    if (isExpanded) {
      const detailEl = document.createElement('div');
      detailEl.className = 'drug-detail';
      detailEl.style.cssText = 'padding-top: 12px; margin-top: 12px; border-top: 1px solid var(--divider);';

      // ── Black Box Warning (if present) ──────────────────────────────────
      if (drug.bbw) {
        const bbwDiv = document.createElement('div');
        bbwDiv.style.cssText = `
          background: #FEE2E2;
          border: 2px solid #DC2626;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 14px;
        `;
        bbwDiv.innerHTML = `
          <div style="font-weight: bold; color: #DC2626; font-size: 12px; letter-spacing: 0.05em; margin-bottom: 4px;">⚠ BLACK BOX WARNING</div>
          <div style="font-size: 13px; line-height: 1.5; color: #7F1D1D;">${drug.bbw}</div>
        `;
        detailEl.appendChild(bbwDiv);
      }

      // ── High-Yield Exam Points ────────────────────────────────────────────
      if (drug.highyield) {
        const hyDiv = document.createElement('div');
        hyDiv.style.cssText = `
          background: #FEFCE8;
          border: 2px solid #EAB308;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 14px;
        `;
        const hyLines = drug.highyield.split('\n').map(l => `<div style="padding: 2px 0;">${l}</div>`).join('');
        hyDiv.innerHTML = `
          <div style="font-weight: bold; color: #92400E; font-size: 12px; letter-spacing: 0.05em; margin-bottom: 6px;">⭐ HIGH-YIELD EXAM POINTS</div>
          <div style="font-size: 13px; line-height: 1.6; color: #78350F;">${hyLines}</div>
        `;
        detailEl.appendChild(hyDiv);
      }

      // ── Standard detail sections ─────────────────────────────────────────
      const sections = [
        { label: 'Indications', value: drug.indications, icon: '🎯' },
        { label: 'Pharmacokinetics', value: drug.pk, icon: '⚗️' },
        { label: 'Dosing', value: drug.dosing, icon: '💊' },
        { label: 'Renal Dose Adjustment', value: drug.renal, icon: '🫘' },
        { label: 'Hepatic Dose Adjustment', value: drug.hepatic, icon: '🫀' },
        { label: 'Adverse Effects', value: drug.ades, icon: '⚡' },
        { label: 'Monitoring', value: drug.monitoring, icon: '📊' },
        { label: 'Drug Interactions', value: drug.ddi, icon: '🔄' },
        { label: 'Clinical Pearls', value: drug.pearls, icon: '💎' },
        { label: 'Key Trials', value: drug.trials, icon: '📋' }
      ];

      sections.forEach(sec => {
        if (!sec.value) return;
        const sectionDiv = document.createElement('div');
        sectionDiv.style.cssText = 'margin-bottom: 12px;';
        sectionDiv.innerHTML = `
          <div class="drug-section-label" style="font-weight: bold; color: var(--primary); margin-bottom: 4px;">${sec.icon} ${sec.label}:</div>
          <div style="font-size: 13px; line-height: 1.5; color: var(--label1);">${sec.value}</div>
        `;
        detailEl.appendChild(sectionDiv);
      });

      // Links section
      const linksDiv = document.createElement('div');
      linksDiv.className = 'drug-links';
      linksDiv.style.cssText = 'display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--divider);';

      const dailymedBtn = document.createElement('a');
      dailymedBtn.className = 'drug-link-btn';
      dailymedBtn.href = drug.dailymed;
      dailymedBtn.target = '_blank';
      dailymedBtn.rel = 'noopener noreferrer';
      dailymedBtn.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: var(--primary);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      `;
      dailymedBtn.innerHTML = '🔗 DailyMed';

      const pubmedBtn = document.createElement('a');
      pubmedBtn.className = 'drug-link-btn';
      pubmedBtn.href = drug.pubmed;
      pubmedBtn.target = '_blank';
      pubmedBtn.rel = 'noopener noreferrer';
      pubmedBtn.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: #00796B;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      `;
      pubmedBtn.innerHTML = '🔍 PubMed';

      linksDiv.appendChild(dailymedBtn);
      linksDiv.appendChild(pubmedBtn);
      detailEl.appendChild(linksDiv);

      cardEl.appendChild(detailEl);
    }

    listEl.appendChild(cardEl);
  });

  // Update button opacity
  const allBtn = document.querySelector('[data-area="ALL"]');
  document.querySelectorAll('.drug-area-btn').forEach(btn => {
    btn.style.opacity = '';
    btn.classList.toggle('active', btn.getAttribute('data-area') === drugFilterState.area);
  });
}


// ─── Deferred initialization: called after all scripts load ───────────────
window.addEventListener('DOMContentLoaded', function() {
  // gloInit is called above; drugInit is triggered by switchSection('concepts')
  // But pre-render drugs for instant tab switch:
  if (typeof drugInit === 'function' && !window._drugInitDone) {
    drugInit();
    window._drugInitDone = true;
  }
});

;
/* ───── next block ───── */


// ═══ LIGHTBOX / ZOOM SYSTEM ══════════════════════════════════════════════
let _vizLbSrc = null;
let _vizLbZoom = 1;
let _vizLbTitle = '';

function vizLbOpen(canvasId, title) {
  const src = document.getElementById(canvasId);
  if (!src) return;
  _vizLbSrc = src;
  _vizLbTitle = title || canvasId;
  const lb = document.getElementById('vizLightbox');
  const lbCanvas = document.getElementById('vizLbCanvas');
  lbCanvas.width = src.width;
  lbCanvas.height = src.height;
  const ctx = lbCanvas.getContext('2d');
  ctx.drawImage(src, 0, 0);
  document.getElementById('vizLbTitle').textContent = _vizLbTitle;
  _vizLbZoom = 1;
  vizLbApplyZoom();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function vizLbClose() {
  document.getElementById('vizLightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function vizLbZoom(delta) {
  vizLbSetZoom(Math.max(0.5, Math.min(3, _vizLbZoom + delta)));
}

function vizLbSetZoom(z) {
  _vizLbZoom = Math.max(0.5, Math.min(3, z));
  vizLbApplyZoom();
}

function vizLbApplyZoom() {
  const c = document.getElementById('vizLbCanvas');
  c.style.transform = `scale(${_vizLbZoom})`;
  document.getElementById('vizLbZoomPct').textContent = Math.round(_vizLbZoom * 100) + '%';
  document.getElementById('vizZoomSlider').value = _vizLbZoom;
}

function vizLbFit() {
  const body = document.getElementById('vizLbBody');
  const canvas = document.getElementById('vizLbCanvas');
  const fitScale = Math.min(
    (body.clientWidth - 40) / canvas.width,
    (body.clientHeight - 40) / canvas.height
  );
  vizLbSetZoom(Math.max(0.5, Math.min(3, fitScale)));
}

function vizLbDownload() {
  const canvas = document.getElementById('vizLbCanvas');
  const a = document.createElement('a');
  a.download = (_vizLbTitle || 'visual').replace(/[^a-z0-9]/gi,'_') + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
}

// Keyboard shortcuts for lightbox
document.addEventListener('keydown', function(e) {
  if (!document.getElementById('vizLightbox').classList.contains('open')) return;
  if (e.key === 'Escape') vizLbClose();
  if (e.key === '+' || e.key === '=') vizLbZoom(0.25);
  if (e.key === '-') vizLbZoom(-0.25);
  if (e.key === '0') vizLbSetZoom(1);
  if (e.key === 'f' || e.key === 'F') vizLbFit();
});

// Close on backdrop click
document.getElementById('vizLightbox').addEventListener('click', function(e) {
  if (e.target === this || e.target === document.getElementById('vizLbBody')) vizLbClose();
});


;
/* ───── next block ───── */

// ── QUIZ KEYBOARD SHORTCUTS ───────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  // Only when quiz section is active
  const quizEl = document.getElementById('quiz');
  if (!quizEl || !quizEl.classList.contains('active')) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  const optBtns = document.querySelectorAll('.option-btn:not(:disabled)');
  const nextBtn = document.querySelector('.next-question-btn');

  if (e.key === '1' && optBtns[0]) { e.preventDefault(); optBtns[0].click(); }
  else if (e.key === '2' && optBtns[1]) { e.preventDefault(); optBtns[1].click(); }
  else if (e.key === '3' && optBtns[2]) { e.preventDefault(); optBtns[2].click(); }
  else if (e.key === '4' && optBtns[3]) { e.preventDefault(); optBtns[3].click(); }
  else if ((e.key === ' ' || e.key === 'Enter') && nextBtn) {
    e.preventDefault(); nextBtn.click();
  }
  else if (e.key === '?' || e.key === '/') {
    e.preventDefault();
    const existing = document.getElementById('quizKbHelp');
    if (existing) { existing.remove(); return; }
    const div = document.createElement('div');
    div.id = 'quizKbHelp';
    div.style.cssText = 'position:fixed;bottom:80px;right:20px;background:var(--card);border:1px solid var(--sep);border-radius:14px;padding:16px 20px;z-index:999;font-size:0.82rem;line-height:1.8;box-shadow:0 4px 20px rgba(0,0,0,.12)';
    div.innerHTML = '<strong>⌨️ Quiz shortcuts</strong><br>1–4 · Select answer<br>Space / Enter · Next question<br>? · Toggle this help';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
  }
});


// ── REVIEW MISSED QUESTIONS ────────────────────────────────────────────────
window.missedQIds = new Set();
window.reviewMissedMode = false;

function trackMissed(questionIndex, correct) {
  if (!window.missedQIds) window.missedQIds = new Set();
  if (!correct) window.missedQIds.add(questionIndex);
  else window.missedQIds.delete(questionIndex);
  const btn = document.getElementById('reviewMissedBtn');
  if (btn) {
    btn.style.display = window.missedQIds.size > 0 ? '' : 'none';
    if (!window.reviewMissedMode) btn.textContent = `📋 Review Missed (${window.missedQIds.size})`;
  }
}

function toggleReviewMissed() {
  window.reviewMissedMode = !window.reviewMissedMode;
  const btn = document.getElementById('reviewMissedBtn');
  if (btn) {
    btn.textContent = window.reviewMissedMode ? '✅ All Questions' : `📋 Review Missed (${window.missedQIds.size})`;
    btn.style.background = window.reviewMissedMode ? 'var(--red, #FF3B30)' : '';
    btn.style.color = window.reviewMissedMode ? '#fff' : '';
  }
  if (typeof loadQuestion === 'function') loadQuestion();
}


// ── TOPIC ACCURACY TRACKING ────────────────────────────────────────────────
window.topicStats = {}; // { topic: { correct: 0, total: 0 } }

window.recordTopicStat = function recordTopicStat(topic, isCorrect) {
  if (!window.topicStats[topic]) window.topicStats[topic] = { correct: 0, total: 0 };
  window.topicStats[topic].total++;
  if (isCorrect) window.topicStats[topic].correct++;
  // Persist to sessionStorage
  try { sessionStorage.setItem('bcps_topic_stats', JSON.stringify(topicStats)); } catch(e) {}
}

function openTopicStats() {
  const body = document.getElementById('topicStatsBody');
  const entries = Object.entries(window.topicStats || {})
    .filter(([,v]) => v.total > 0)
    .sort((a,b) => (b[1].correct/b[1].total) - (a[1].correct/a[1].total));
  if (!entries.length) {
    body.innerHTML = '<p style="color:var(--label2);text-align:center;padding:20px">Answer some questions to see stats!</p>';
  } else {
    body.innerHTML = entries.map(([topic, s]) => {
      const pct = Math.round(s.correct / s.total * 100);
      const color = pct >= 80 ? '#34C759' : pct >= 60 ? '#FF9500' : '#FF3B30';
      return `<div class="ts-row">
        <span class="ts-topic">${topic}</span>
        <div class="ts-bar-wrap"><div class="ts-bar" style="width:${pct}%;background:${color}"></div></div>
        <span class="ts-pct" style="color:${color}">${pct}%</span>
        <span class="ts-count">${s.correct}/${s.total}</span>
      </div>`;
    }).join('');
  }
  document.getElementById('topicStatsOverlay').classList.add('open');
}

function closeTopicStats() {
  document.getElementById('topicStatsOverlay').classList.remove('open');
}


// ── DARK MODE ──────────────────────────────────────────────────────────────
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  document.getElementById('darkModeToggle').textContent = isDark ? '☀️' : '🌙';
  try { localStorage.setItem('bcps_dark', isDark ? '1' : '0'); } catch(e) {}
}
// Restore preference
(function() {
  try {
    if (localStorage.getItem('bcps_dark') === '1') {
      document.body.classList.add('dark-mode');
      const btn = document.getElementById('darkModeToggle');
      if (btn) btn.textContent = '☀️';
    }
  } catch(e) {}
})();


// ── GLOSSARY FILTER COUNTS ─────────────────────────────────────────────────
window.updateGloFilterCounts = function updateGloFilterCounts() {
  const catCounts = {};
  GLO_TERMS.forEach(t => {
    const c = t.cat || 'Other';
    catCounts[c] = (catCounts[c] || 0) + 1;
  });
  document.querySelectorAll('.glo-filter-btn').forEach(btn => {
    const cat = btn.dataset.cat;
    if (!cat) return;
    const base = btn.dataset.label || btn.textContent.replace(/\s*\(\d+\)/, '').trim();
    btn.dataset.label = base;
    if (cat === 'all') {
      btn.textContent = `All (${GLO_TERMS.length})`;
    } else if (catCounts[cat]) {
      btn.textContent = `${base} (${catCounts[cat]})`;
    }
  });
}

;
/* ───── next block ───── */

// ── SESSION TIMER ──────────────────────────────────────────────────────────
(function() {
  const start = Date.now();
  const el = document.getElementById('sessionTimer');
  const val = document.getElementById('sessionTimerVal');
  if (!el || !val) return;
  // Show after 5 seconds of activity
  setTimeout(() => el.classList.add('visible'), 5000);
  setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    val.textContent = `${m}:${ss}`;
  }, 1000);
})();

;
/* ───── next block ───── */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BCPS LEARNING HUB — Progress Persistence + Supabase Auth  (Script 8)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── CONFIGURATION ────────────────────────────────────────────────────────────
// After creating your free Supabase project, replace these two values.
// Get them at: https://supabase.com → your project → Settings → API
const SUPABASE_URL      = '';
const SUPABASE_ANON_KEY = '';

// ── INIT ─────────────────────────────────────────────────────────────────────
const _cfgd = SUPABASE_URL !== 'YOUR_SUPABASE_URL';
const _sb   = (_cfgd && typeof window.supabase !== 'undefined')
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

window._currentUser  = null;
window.quizHistory   = [];
window._authSignupMode = false;
const _PROG_KEY = 'bcps_progress_v2';

// ── SNAPSHOT ─────────────────────────────────────────────────────────────────
function _snap() {
  return {
    missedQIds:  Array.from(window.missedQIds || []),
    topicStats:  window.topicStats  || {},
    quizHistory: window.quizHistory || [],
    srData:      localStorage.getItem(typeof SR_KEY !== 'undefined' ? SR_KEY : 'bcps_sr_v1') || '{}',
    streakData:  localStorage.getItem(typeof STREAK_KEY !== 'undefined' ? STREAK_KEY : 'bcps_streak_v1') || '{}',
    lastSaved:   new Date().toISOString(),
  };
}

// ── LOCAL PERSISTENCE ─────────────────────────────────────────────────────────
function _saveLocal() {
  try { localStorage.setItem(_PROG_KEY, JSON.stringify(_snap())); _showBadge('✓ Saved'); } catch(e) {}
}
function _loadLocal() {
  try { const r = localStorage.getItem(_PROG_KEY); return r ? JSON.parse(r) : null; }
  catch(e) { return null; }
}
function _applyProgress(d) {
  if (!d) return;
  if (Array.isArray(d.missedQIds))  window.missedQIds  = new Set(d.missedQIds);
  if (d.topicStats)                 window.topicStats   = d.topicStats;
  if (Array.isArray(d.quizHistory)) window.quizHistory  = d.quizHistory;
  if (d.srData)     localStorage.setItem(typeof SR_KEY !== 'undefined' ? SR_KEY : 'bcps_sr_v1', d.srData);
  if (d.streakData) localStorage.setItem(typeof STREAK_KEY !== 'undefined' ? STREAK_KEY : 'bcps_streak_v1', d.streakData);
}

// ── CLOUD SAVE/LOAD ───────────────────────────────────────────────────────────
async function _saveCloud() {
  if (!_sb || !window._currentUser) return;
  try {
    await _sb.from('bcps_progress').upsert(
      { user_id: window._currentUser.id, data: _snap(), updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    _showBadge('✓ Synced');
  } catch(e) { console.warn('[BCPS] cloud save:', e); }
}
async function _loadCloud() {
  if (!_sb || !window._currentUser) return false;
  try {
    const { data, error } = await _sb
      .from('bcps_progress').select('data,updated_at')
      .eq('user_id', window._currentUser.id).single();
    if (error || !data) return false;
    const local = _loadLocal();
    const cloudT = new Date(data.updated_at);
    const localT = local?.lastSaved ? new Date(local.lastSaved) : new Date(0);
    if (cloudT >= localT) {
      _applyProgress(data.data);
      _saveLocal();
    }
    const el = document.getElementById('authLastSync');
    if (el) el.textContent = 'Synced: ' + cloudT.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    return true;
  } catch(e) { console.warn('[BCPS] cloud load:', e); return false; }
}

// ── DEBOUNCED QUEUE ───────────────────────────────────────────────────────────
let _saveTimer;
window.queueProgressSave = function() {
  _saveLocal();
  _showBadge('💾 Saving...');
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    _saveCloud();
    setTimeout(() => _showBadge('✓ Saved'), 500);
  }, 1500);
  // Update live code preview after save (debounced)
  clearTimeout(window._previewTimer);
  window._previewTimer = setTimeout(_refreshLivePreview, 2000);
};

// ── SYNC BADGE ────────────────────────────────────────────────────────────────
let _badgeHideTimer;
function _showBadge(txt) {
  const el = document.getElementById('syncBadge');
  if (!el) return;
  el.textContent = txt;
  el.style.display = 'inline-block';
  clearTimeout(_badgeHideTimer);
  if (txt === '✓ Saved' || txt === '✓ Synced') {
    el.style.background = 'rgba(34,197,94,0.15)'; el.style.color = '#16a34a';
    _badgeHideTimer = setTimeout(() => { el.style.display = 'none'; }, 4000);
  } else {
    el.style.background = 'rgba(59,130,246,0.12)'; el.style.color = 'var(--primary)';
  }
}

// ── AUTH UI HELPERS ───────────────────────────────────────────────────────────
function _updateHeaderBtn(user) {
  const btn  = document.getElementById('authHeaderBtn');
  const badge = document.getElementById('syncBadge');
  if (!btn) return;
  if (user) {
    const ini = (user.email || 'U').slice(0, 2).toUpperCase();
    btn.innerHTML = `<span style="background:var(--primary,#0071e3);color:white;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${ini}</span> <span id="authBtnText">${(user.email||'').split('@')[0]}</span>`;
    _showBadge('✓ Synced');
  } else {
    btn.innerHTML = '👤 <span id="authBtnText">Login</span>';
    if (badge) badge.style.display = 'none';
  }
}
function _showLoggedIn(user) {
  document.getElementById('authUserCard').style.display       = 'block';
  document.getElementById('authForm').style.display            = 'none';
  document.getElementById('authLoggedInActions').style.display = 'block';
  document.getElementById('authTitle').textContent     = 'Progress Synced ☁️';
  document.getElementById('authSubtitle').textContent  = 'Your data saves automatically';
  const ini = (user.email || 'U').slice(0, 2).toUpperCase();
  document.getElementById('authAvatar').textContent    = ini;
  document.getElementById('authUserEmail').textContent = user.email || '';
}
function _showLoggedOut() {
  document.getElementById('authUserCard').style.display       = 'none';
  document.getElementById('authForm').style.display            = 'block';
  document.getElementById('authLoggedInActions').style.display = 'none';
  document.getElementById('authTitle').textContent    = 'Sync Your Progress';
  document.getElementById('authSubtitle').textContent = 'Quiz scores, flashcards & streaks across all devices';
  document.getElementById('authError').style.display  = 'none';
  window._authSignupMode = false;
  const sb = document.getElementById('authSubmitBtn');
  const tb = document.getElementById('authToggleBtn');
  if (sb) { sb.disabled = false; sb.textContent = 'Sign In'; }
  if (tb) tb.textContent = 'Create Free Account';
}

// ── AUTH MODAL PUBLIC API ─────────────────────────────────────────────────────
window.toggleAuthModal = function() {
  const ov = document.getElementById('authOverlay');
  const next = ov.style.display !== 'flex';
  ov.style.display = next ? 'flex' : 'none';
};
window.hideAuthModal = function() {
  document.getElementById('authOverlay').style.display = 'none';
};
window.toggleAuthMode = function() {
  window._authSignupMode = !window._authSignupMode;
  const su = window._authSignupMode;
  document.getElementById('authTitle').textContent    = su ? 'Create Account' : 'Sync Your Progress';
  document.getElementById('authSubtitle').textContent = su ? 'Free — no credit card needed' : 'Quiz scores, flashcards & streaks across all devices';
  document.getElementById('authSubmitBtn').textContent = su ? 'Create Account' : 'Sign In';
  document.getElementById('authToggleBtn').textContent = su ? 'Back to Sign In' : 'Create Free Account';
  document.getElementById('authError').style.display   = 'none';
};
window.authSubmit = function() {
  const username = (document.getElementById('authEmail').value || '').trim();
  const pass     = (document.getElementById('authPassword').value || '');
  const errEl    = document.getElementById('authError');
  const btn      = document.getElementById('authSubmitBtn');

  if (!username || !pass) {
    errEl.textContent = 'Please enter your username and password.';
    errEl.style.background = '#FEE2E2'; errEl.style.color = '#DC2626';
    errEl.style.display = 'block'; return;
  }

  // ── Local auth check ──────────────────────────────────────────────────
  const validUsers = [];;
  const match = validUsers.find(u =>
    u.name.toLowerCase() === username.toLowerCase() && u.pass === pass
  );

  if (match) {
    // Store 30-day session in localStorage
    localStorage.setItem('bcps_session', JSON.stringify({
      username: match.name, ts: Date.now()
    }));
    window._currentUser = { email: match.name, id: 'local-' + match.name.toLowerCase() };
    _updateHeaderBtn(window._currentUser);
    _showLoggedIn(window._currentUser);
    hideAuthModal();
    // Load saved progress snapshot
    const snap = _loadLocal();
    if (snap) _applyProgress(snap);
    if (typeof renderProgressStats === 'function') renderProgressStats();
    // Optional background Supabase sign-in (non-blocking)
    if (_sb) { _sb.auth.signInWithPassword({ email: 'olaiya@bcps.study', password: pass }).catch(()=>{}); }
    return;
  }

  errEl.textContent = 'Incorrect username or password.';
  errEl.style.background = '#FEE2E2'; errEl.style.color = '#DC2626';
  errEl.style.display = 'block';
};
window.authSignOut = function() {
  localStorage.removeItem('bcps_session');
  window._currentUser = null;
  _updateHeaderBtn(null);
  _showLoggedOut();
  _saveLocal();
  if (_sb) _sb.auth.signOut().catch(()=>{});
};
window.syncNow = async function() {
  if (!_sb || !window._currentUser) return;
  _showBadge('⟳ Syncing...');
  await _saveCloud();
};

// ── SUPABASE AUTH STATE LISTENER ──────────────────────────────────────────────
if (_sb) {
  _sb.auth.onAuthStateChange(async (event, session) => {
    if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
      window._currentUser = session.user;
      _updateHeaderBtn(session.user);
      _showLoggedIn(session.user);
      await _loadCloud();
      hideAuthModal();
      renderProgressStats();
    } else if (event === 'SIGNED_OUT') {
      window._currentUser = null;
      _updateHeaderBtn(null);
      _showLoggedOut();
    }
  });
}

// ── PATCH EXISTING FUNCTIONS FOR AUTO-SAVE ────────────────────────────────────
(function() {
  // Patch trackMissed → save after every quiz answer
  const _orig_tm = window.trackMissed;
  window.trackMissed = function(idx, isCorrect) {
    if (typeof _orig_tm === 'function') _orig_tm(idx, isCorrect);
    window.queueProgressSave();
  };
  // Patch recordTopicStat → record session history entry
  const _orig_rts = window.recordTopicStat;
  window.recordTopicStat = function(topic, isCorrect) {
    if (typeof _orig_rts === 'function') _orig_rts(topic, isCorrect);
    // Build a lightweight running-session record for history tab
    if (!window._sessionRecord) {
      window._sessionRecord = { date: new Date().toISOString(), correct: 0, total: 0, topics: {} };
    }
    window._sessionRecord.total++;
    if (isCorrect) window._sessionRecord.correct++;
    window._sessionRecord.topics[topic] = window._sessionRecord.topics[topic] || { c: 0, t: 0 };
    window._sessionRecord.topics[topic].t++;
    if (isCorrect) window._sessionRecord.topics[topic].c++;
  };
  // Patch nextCard to save SR data after every card interaction
  const _orig_nc = window.nextCard;
  if (typeof _orig_nc === 'function') {
    window.nextCard = function(...a) { _orig_nc(...a); setTimeout(window.queueProgressSave, 400); };
  }
  const _orig_pc = window.prevCard;
  if (typeof _orig_pc === 'function') {
    window.prevCard = function(...a) { _orig_pc(...a); setTimeout(window.queueProgressSave, 400); };
  }
})();

// ── FLUSH SESSION RECORD TO QUIZ HISTORY ON SECTION SWITCH ───────────────────
window.addEventListener('bcps:tab', function(e) {
  if (e.detail !== 'quiz' && window._sessionRecord && window._sessionRecord.total >= 3) {
    if (!window.quizHistory) window.quizHistory = [];
    window.quizHistory.unshift({
      date:    window._sessionRecord.date,
      correct: window._sessionRecord.correct,
      total:   window._sessionRecord.total,
      pct:     Math.round(window._sessionRecord.correct / window._sessionRecord.total * 100),
      topics:  window._sessionRecord.topics,
    });
    if (window.quizHistory.length > 50) window.quizHistory.length = 50; // cap at 50 sessions
    window._sessionRecord = null;
    window.queueProgressSave();
  }
  if (e.detail === 'study' || e.detail === 'home') setTimeout(renderProgressStats, 120);
});

// ── PROGRESS STATS PANEL ──────────────────────────────────────────────────────
function renderHomeStats() {
  const homeEl = document.getElementById('homeProgressPanel');
  if (!homeEl) return;
  const hist    = window.quizHistory || [];
  const ts      = window.topicStats  || {};
  const missed  = (window.missedQIds || new Set()).size;
  const totalQ  = hist.reduce((s, h) => s + (h.total || 0), 0);
  const totalC  = hist.reduce((s, h) => s + (h.correct || 0), 0);
  const acc     = totalQ ? Math.round(totalC / totalQ * 100) : 0;
  const sessions = hist.length;
  let streak = 0;
  try { streak = JSON.parse(localStorage.getItem('bcps_streak_v1') || '{}').streak || 0; } catch(e) {}

  // Update last-saved timestamp
  const snap = JSON.parse(localStorage.getItem('bcps_progress_v2') || 'null');
  const lsEl = document.getElementById('homeLastSaved');

  if (!totalQ && !streak && !snap) {
    // No data yet — hide the panel, show sign-in prompt
    homeEl.style.display = 'none';
    return;
  }
  // Hide sign-in prompt if we have data (user has progress)
  const sp = document.getElementById('homeSignInPrompt');
  if (sp && window._currentUser) sp.style.display = 'none';

  homeEl.style.display = 'block';
  homeEl.innerHTML = `
    <div style="background:var(--card);border-radius:14px;padding:16px;border:1px solid var(--sep);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin:0 0 10px;">
          <span style="font-size:13px;font-weight:700;color:var(--label2);text-transform:uppercase;letter-spacing:.5px;">📊 Your Progress</span>
          <span style="font-size:11px;color:var(--label3);font-style:italic;" id="homeLastSaved"></span>
        </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;margin-bottom:12px;">
        <div style="background:var(--fill);border-radius:10px;padding:10px 6px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:var(--primary,#0071e3);">${acc}%</div>
          <div style="font-size:10px;color:var(--label2);">Accuracy</div>
        </div>
        <div style="background:var(--fill);border-radius:10px;padding:10px 6px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#22c55e;">${totalC}</div>
          <div style="font-size:10px;color:var(--label2);">Correct</div>
        </div>
        <div style="background:var(--fill);border-radius:10px;padding:10px 6px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#f59e0b;">${missed}</div>
          <div style="font-size:10px;color:var(--label2);">Missed</div>
        </div>
        <div style="background:var(--fill);border-radius:10px;padding:10px 6px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#8b5cf6;">${sessions}</div>
          <div style="font-size:10px;color:var(--label2);">Sessions</div>
        </div>
        <div style="background:var(--fill);border-radius:10px;padding:10px 6px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#ef4444;">${streak}🔥</div>
          <div style="font-size:10px;color:var(--label2);">Streak</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-top:4px;">
        ${hist.length > 0 ? `<div style="font-size:12px;color:var(--label2);">Last session: ${hist[0].correct}/${hist[0].total} (${hist[0].pct}%) · <a onclick="switchSection('study')" style="color:var(--primary);cursor:pointer;text-decoration:none;">View full history →</a></div>` : '<div></div>'}
        <button onclick="confirmResetProgress()" style="font-size:11px;padding:4px 10px;background:transparent;color:#ef4444;border:1px solid #ef4444;border-radius:6px;cursor:pointer;font-weight:600;">🗑 Reset Progress</button>
      </div>
    </div>`;
  // Update timestamp
  const tsEl = document.getElementById('homeLastSaved');
  if (tsEl && snap && snap.lastSaved) {
    const d = new Date(snap.lastSaved);
    tsEl.textContent = '💾 Auto-saved ' + d.toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
  }
}

function renderProgressStats() {
  const el = document.getElementById('progressStatsPanel');
  renderHomeStats();
  if (!el) return;

  const hist    = window.quizHistory || [];
  const ts      = window.topicStats  || {};
  const missed  = (window.missedQIds || new Set()).size;
  const totalQ  = hist.reduce((s, h) => s + (h.total || 0), 0);
  const totalC  = hist.reduce((s, h) => s + (h.correct || 0), 0);
  const acc     = totalQ ? Math.round(totalC / totalQ * 100) : 0;
  const sessions = hist.length;

  let streak = 0;
  try {
    const sk = typeof STREAK_KEY !== 'undefined' ? STREAK_KEY : 'bcps_streak_v1';
    streak = JSON.parse(localStorage.getItem(sk) || '{}').streak || 0;
  } catch(e) {}

  const syncCard = window._currentUser
    ? `<div class="ps-card" style="background:linear-gradient(135deg,var(--primary,#0071e3),#5b5bd6);">
         <div class="ps-val" style="color:white;font-size:1rem;">☁️</div>
         <div class="ps-lbl" style="color:rgba(255,255,255,0.85);">${(window._currentUser.email||'').split('@')[0]}</div>
       </div>`
    : `<div class="ps-card" style="border:1.5px dashed var(--primary,#0071e3);cursor:pointer;" onclick="toggleAuthModal()">
         <div class="ps-val" style="color:var(--primary,#0071e3);font-size:1.2rem;">☁️</div>
         <div class="ps-lbl" style="color:var(--primary,#0071e3);">Sync login</div>
       </div>`;

  // Build topic breakdown (top 5)
  const topicRows = Object.entries(ts)
    .sort((a, b) => (b[1].total || 0) - (a[1].total || 0))
    .slice(0, 5)
    .map(([topic, d]) => {
      const pct = d.total ? Math.round(d.correct / d.total * 100) : 0;
      const bar = `<div style="height:5px;border-radius:3px;background:var(--divider,#e5e7eb);margin-top:3px;">
        <div style="height:5px;border-radius:3px;width:${pct}%;background:${pct>=70?'#22c55e':pct>=50?'#f59e0b':'#ef4444'};"></div>
      </div>`;
      return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--divider,#e5e7eb);">
        <div style="flex:1;font-size:12px;color:var(--label1,#111);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${topic}</div>
        <div style="font-size:12px;font-weight:700;color:${pct>=70?'#22c55e':pct>=50?'#f59e0b':'#ef4444'};min-width:34px;text-align:right;">${pct}%</div>
        <div style="font-size:11px;color:var(--label3,#888);min-width:40px;text-align:right;">${d.correct||0}/${d.total||0}</div>
      </div>`;
    }).join('');

  // Recent quiz history (last 5)
  const histRows = hist.slice(0, 5).map(h => {
    const d = new Date(h.date);
    const ds = d.toLocaleDateString([], {month:'short', day:'numeric'});
    const col = h.pct >= 70 ? '#22c55e' : h.pct >= 50 ? '#f59e0b' : '#ef4444';
    return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--divider,#e5e7eb);">
      <div style="font-size:11px;color:var(--label3,#888);min-width:44px;">${ds}</div>
      <div style="flex:1;font-size:12px;color:var(--label1,#111);">${h.correct}/${h.total} questions</div>
      <div style="font-size:13px;font-weight:700;color:${col};">${h.pct}%</div>
    </div>`;
  }).join('') || '<div style="font-size:12px;color:var(--label3,#888);padding:8px 0;">No sessions yet — take a quiz!</div>';

  el.innerHTML = `
    
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px;margin-bottom:14px;">
      <div class="ps-card"><div class="ps-val" style="color:var(--primary,#0071e3);">${acc}%</div><div class="ps-lbl">Accuracy</div></div>
      <div class="ps-card"><div class="ps-val" style="color:#22c55e;">${totalC}</div><div class="ps-lbl">Correct</div></div>
      <div class="ps-card"><div class="ps-val" style="color:#f59e0b;">${missed}</div><div class="ps-lbl">Missed Q's</div></div>
      <div class="ps-card"><div class="ps-val" style="color:#8b5cf6;">${sessions}</div><div class="ps-lbl">Sessions</div></div>
      <div class="ps-card"><div class="ps-val" style="color:#ef4444;">${streak}</div><div class="ps-lbl">Day Streak 🔥</div></div>
      ${syncCard}
    </div>
    ${Object.keys(ts).length > 0 ? `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div style="background:var(--card,#fff);border:1px solid var(--divider,#e5e7eb);border-radius:10px;padding:12px;">
        <div style="font-size:12px;font-weight:700;color:var(--label2,#555);margin-bottom:6px;">📊 Topic Accuracy</div>
        ${topicRows}
      </div>
      <div style="background:var(--card,#fff);border:1px solid var(--divider,#e5e7eb);border-radius:10px;padding:12px;">
        <div style="font-size:12px;font-weight:700;color:var(--label2,#555);margin-bottom:6px;">📅 Recent Sessions</div>
        ${histRows}
      </div>
    </div>` : ''}
  `;
}

// ── INITIALIZE ON PAGE LOAD ───────────────────────────────────────────────────
(async function init() {
  // 1. Load local progress immediately (instant)
  const local = _loadLocal();
  if (local) {
    _applyProgress(local);
    console.log('[BCPS] Local progress loaded from', local.lastSaved);
  }
  // 2. Restore local session (30-day token stored in localStorage) ────────────
  try {
    const sess = JSON.parse(localStorage.getItem('bcps_session') || 'null');
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (sess && sess.username && (Date.now() - sess.ts < THIRTY_DAYS)) {
      window._currentUser = { email: sess.username, id: 'local-' + sess.username.toLowerCase() };
      _updateHeaderBtn(window._currentUser);
      _showLoggedIn(window._currentUser);
    }
  } catch(e) {}
  // 3. Optional: check Supabase session (non-blocking, best-effort)
  if (_sb) {
    _sb.auth.getSession().then(({ data }) => {
      if (data?.session?.user && !window._currentUser) {
        window._currentUser = data.session.user;
        _updateHeaderBtn(data.session.user);
        _showLoggedIn(data.session.user);
        _loadCloud().catch(()=>{});
      }
    }).catch(()=>{});
  }
  // 4. Render progress panel
  setTimeout(renderProgressStats, 300);
  setTimeout(_refreshLivePreview, 400);
  // 5. Show import success banner (set by importProgressCode before reload)
  if (localStorage.getItem('bcps_justImported') === '1') {
    localStorage.removeItem('bcps_justImported');
    const banner = document.getElementById('importSuccessBanner');
    if (banner) {
      banner.style.display = 'block';
      setTimeout(() => { banner.style.opacity = '0'; banner.style.transition = 'opacity 1s'; setTimeout(() => { banner.style.display = 'none'; banner.style.opacity = '1'; }, 1000); }, 5000);
    }
  }
})();

// ── AUTO-SAVE ON TAB HIDE ─────────────────────────────────────────────────────
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    _saveLocal();
    if (_sb && window._currentUser) _saveCloud();
  }
});

// Periodic auto-save every 60 seconds while active
setInterval(() => {
  if (document.visibilityState === 'visible') {
    _saveLocal();
  }
}, 60000);

;
/* ───── next block ───── */

// ── ACCP MOCK EXAM REVIEW ─────────────────────────────────────────────────
(function() {
  let _aq = null;       // filtered question list
  let _allQ = null;     // all 150
  let _idx = 0;         // current index in filtered list
  let _reviewed = {};   // num -> bool

  function getData() {
    if (!_allQ) {
      _allQ = JSON.parse(({textContent: JSON.stringify(window.__accpData)}).textContent);
    }
    return _allQ;
  }

  window.initAccpReview = function() {
    getData();
    _aq = _allQ.slice();
    _idx = 0;
    renderQ();
    // Load saved progress from Supabase
    if (typeof sbLoadAccpProgress === 'function') {
      sbLoadAccpProgress().then(saved => {
        if (saved && Object.keys(saved).length) {
          Object.assign(_reviewed, saved);
          _updateStats();
          renderQ();
        }
      }).catch(() => {});
    }
  };

  window.accpFilter = function() {
    const cat = document.getElementById('accpCatFilter').value;
    getData();
    _aq = cat ? _allQ.filter(q => q.category === cat) : _allQ.slice();
    _idx = 0;
    document.getElementById('accpStats').querySelector('#accpCatName').textContent = cat || 'All categories';
    document.getElementById('accpTotal').textContent = _aq.length;
    renderQ();
  };

  window.accpNav = function(dir) {
    if (!_aq) return;
    _idx = Math.max(0, Math.min(_aq.length - 1, _idx + dir));
    renderQ();
  };

  window.accpSelectChoice = function(idx) {
    document.querySelectorAll('.accp-choice-btn').forEach((el, i) => {
      el.classList.toggle('selected', i === idx);
    });
  };

  window.accpReveal = function() {
    const q = _aq[_idx];
    // Highlight choices with new CSS classes
    document.querySelectorAll('.accp-choice-btn').forEach((el, i) => {
      el.disabled = true;
      el.classList.remove('selected');
      if (i === q.correctIdx) el.classList.add('correct');
      else el.classList.add('wrong');
    });
    // Show styled explanation
    const expDiv = document.getElementById('accpExplanation');
    expDiv.style.display = 'block';
    expDiv.innerHTML =
      `<div class="accp-exp-header">
        <span class="accp-exp-correct-pill">✓ Answer ${'ABCD'[q.correctIdx]}</span>
        <strong style="font-size:13.5px;">${escH(q.choices[q.correctIdx])}</strong>
      </div>
      <div class="accp-exp-text">${escH(q.exp || 'No explanation available.')}</div>`;
    document.getElementById('accpRevealBtn').disabled = true;
    document.getElementById('accpRevealBtn').style.opacity = '0.45';
  };

  window.accpMarkReviewed = function() {
    const q = _aq[_idx];
    _reviewed[q.num] = true;
    if (typeof sbMarkAccpReviewed === 'function') sbMarkAccpReviewed(q.num);
    _updateStats();
    // Auto-advance
    if (_idx < _aq.length - 1) {
      _idx++;
      renderQ();
    }
  };

  function escH(s) {
    if (!s) return '';
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Domain color map
  const _domainColor = {
    '1A': 'var(--accp-1a,#0ea5e9)', '1B': 'var(--accp-1b,#6366f1)',
    '1C': 'var(--accp-1c,#8b5cf6)', '2A': 'var(--accp-2a,#10b981)',
    '2B': 'var(--accp-2b,#059669)', '2C': 'var(--accp-2c,#0d9488)',
    '3A': 'var(--accp-3a,#f59e0b)', '3B': 'var(--accp-3b,#ef4444)',
    '3C': 'var(--accp-3c,#ec4899)'
  };

  function _getDomainColor(catCode) {
    const prefix = catCode.slice(0,2).toUpperCase();
    return _domainColor[prefix] || '#6366f1';
  }

  function _updateStats() {
    const rev = Object.keys(_reviewed).length;
    const total = _allQ ? _allQ.length : 150;
    const qLen = _aq ? _aq.length : total;
    document.getElementById('accpReviewedCount').textContent = rev;
    document.getElementById('accpRemaining').textContent = total - rev;
    document.getElementById('accpTotal').textContent = qLen;
    const pct = total > 0 ? (rev / total * 100) : 0;
    const fill = document.getElementById('accpProgFill');
    if (fill) fill.style.width = pct.toFixed(1) + '%';
  }

  window.renderAccpQ = function() { renderQ(); };

  function renderQ() {
    if (!_aq || !_aq.length) {
      document.getElementById('accpCard').innerHTML = '<div style="padding:40px;text-align:center;color:var(--label2,#888);">No questions match this filter.</div>';
      return;
    }
    const q = _aq[_idx];
    const letters = ['A','B','C','D'];
    const catParts = q.category ? q.category.split('. ') : ['',''];
    const catCode = catParts[0] || '';
    const catName = catParts.slice(1).join('. ') || q.category;
    const domColor = _getDomainColor(catCode);
    const isRev = !!_reviewed[q.num];

    // Meta badges
    document.getElementById('accpMeta').innerHTML =
      `<span class="accp-num-badge">Q${q.num}</span>` +
      `<span class="accp-domain-badge" style="color:${domColor};border-color:${domColor};">${escH(catCode)}</span>` +
      `<span class="accp-cat-badge">${escH(catName)}</span>` +
      (isRev ? `<span class="accp-reviewed-badge">✓ Reviewed</span>` : '');

    // Stem
    document.getElementById('accpStem').textContent = q.stem;

    // Choices — as clickable buttons (no reveal-gating needed)
    const choicesHtml = (q.choices||[]).map((c, i) =>
      `<button class="accp-choice-btn" id="accpChoice_${i}" onclick="accpSelectChoice(${i})"
        data-idx="${i}">
        <span class="accp-choice-letter">${letters[i]}</span>
        <span>${escH(c)}</span>
      </button>`
    ).join('');
    document.getElementById('accpChoices').innerHTML = choicesHtml;

    // Counter
    document.getElementById('accpCounter').textContent = (_idx+1) + ' / ' + _aq.length;
    document.getElementById('accpCatName').textContent =
      document.getElementById('accpCatFilter').options[document.getElementById('accpCatFilter').selectedIndex].text.split('(')[0].trim() || 'All categories';

    // Hide explanation, re-enable reveal
    const expDiv = document.getElementById('accpExplanation');
    expDiv.style.display = 'none';
    const revBtn = document.getElementById('accpRevealBtn');
    revBtn.disabled = false;
    revBtn.style.opacity = '1';

    _updateStats();
  }
})();

;
/* ───── next block ───── */



// ── PROGRESS CODE: export / import all localStorage progress ─────────────────
function _buildProgressCode() {
  const data = {
    sr:       localStorage.getItem('bcps_sr_v2'),
    streak:   localStorage.getItem('bcps_streak_v1'),
    progress: localStorage.getItem('bcps_progress_v2'),
    custom:   localStorage.getItem('bcps_custom_cards'),
    accp:     localStorage.getItem('bcps_accp_reviewed'),
    v: 3, ts: Date.now()
  };
  Object.keys(data).forEach(k => { if (data[k] === null) delete data[k]; });
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}
function _refreshLivePreview() {
  const ta = document.getElementById('liveCodePreview');
  const ts = document.getElementById('backupTimestamp');
  try {
    const code = _buildProgressCode();
    if (ta) ta.value = code;
    const snap = JSON.parse(localStorage.getItem('bcps_progress_v2') || 'null');
    if (ts && snap && snap.lastSaved) {
      const d = new Date(snap.lastSaved);
      ts.textContent = 'Saved: ' + d.toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    } else if (ts) {
      ts.textContent = 'No progress yet';
    }
  } catch(e) { if (ta) ta.value = ''; }
}
function emailProgressCode() {
  try {
    const code = _buildProgressCode();
    const subject = encodeURIComponent('BCPS Hub — Progress Backup ' + new Date().toLocaleDateString());
    const body = encodeURIComponent('Paste this code into the BCPS Learning Hub → Cross-Device Backup to restore your progress:\n\n' + code);
    window.open('mailto:?subject=' + subject + '&body=' + body);
  } catch(e) { alert('Could not open email client.'); }
}
function copyProgressCode() {
  try {
    const code = _buildProgressCode();
    const msg = document.getElementById('importCodeMsg');
    navigator.clipboard.writeText(code).then(
      () => {
        if (msg) { msg.style.color='#34C759'; msg.textContent='✓ Code copied!'; setTimeout(() => msg.textContent='', 3000); }
        _refreshLivePreview();
      },
      () => { prompt('Copy this code:', code); }
    );
  } catch(e) { alert('Error generating code: ' + e.message); }
}

function importProgressCode() {
  const inp = document.getElementById('importCodeInput');
  const msg = document.getElementById('importCodeMsg');
  const raw = (inp ? inp.value : '').trim();
  if (!raw) { if (msg) { msg.style.color='#ef4444'; msg.textContent='Please paste a code first.'; } return; }
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(raw))));
    if (data.sr)       localStorage.setItem('bcps_sr_v2',           data.sr);
    if (data.streak)   localStorage.setItem('bcps_streak_v1',       data.streak);
    if (data.progress) localStorage.setItem('bcps_progress_v2',     data.progress);
    if (data.custom)   localStorage.setItem('bcps_custom_cards',    data.custom);
    if (data.accp)     localStorage.setItem('bcps_accp_reviewed',   data.accp);
    if (msg) { msg.style.color='#34C759'; msg.textContent='✓ Progress loaded! Refreshing in 2 seconds…'; }
    localStorage.setItem('bcps_justImported', '1');
    setTimeout(() => location.reload(), 2000);
  } catch(e) {
    if (msg) { msg.style.color='#ef4444'; msg.textContent='Invalid code. Please check and try again.'; }
  }
}

// ── Reset Progress ────────────────────────────────────────────────────────────
function confirmResetProgress() {
  const modal = document.getElementById('resetModal');
  if (modal) { modal.style.display = 'flex'; }
}

function resetSection(which) {
  const modal = document.getElementById('resetModal');
  if (modal) modal.style.display = 'none';

  const KEYS = {
    quiz:  ['bcps_progress_v2', 'bcps_streak_v1'],
    flash: ['bcps_sr_v2', 'bcps_custom_cards'],
    all:   ['bcps_progress_v2', 'bcps_sr_v2', 'bcps_streak_v1', 'bcps_custom_cards', 'bcps_accp_reviewed'],
  };
  const labels = { quiz: 'quiz history', flash: 'flashcard progress', all: 'all progress' };
  const toRemove = KEYS[which] || KEYS.all;
  toRemove.forEach(k => localStorage.removeItem(k));

  // Reset in-memory vars
  if (which === 'all' || which === 'quiz') {
    window.quizHistory = [];
    window.topicStats  = {};
    window.missedQIds  = new Set();
  }
  if (which === 'all' || which === 'flash') {
    if (typeof srState !== 'undefined')    srState    = {};
    if (typeof streakData !== 'undefined') streakData = {};
    if (typeof customCards !== 'undefined') customCards = [];
    if (typeof updateSrStats === 'function') updateSrStats();
  }
  // Save cleared snapshot
  if (typeof _saveLocal === 'function') _saveLocal();
  if (typeof renderProgressStats === 'function') renderProgressStats();

  // Show confirmation toast
  const banner = document.getElementById('importSuccessBanner');
  if (banner) {
    banner.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
    banner.textContent = '🗑 ' + (labels[which] || 'progress') + ' has been reset.';
    banner.style.display = 'block';
    banner.style.opacity = '1';
    setTimeout(() => {
      banner.style.transition = 'opacity 1s';
      banner.style.opacity = '0';
      setTimeout(() => { banner.style.display = 'none'; banner.style.opacity = '1'; banner.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)'; banner.style.transition = ''; }, 1000);
    }, 3000);
  }
}

// ── Quick Sign-In for Olaiya ──────────────────────────────────────────────
function quickDemoLogin() {
  const emailEl = document.getElementById('authEmail');
  const passEl  = document.getElementById('authPassword');
  if (emailEl) emailEl.value = '';
  if (passEl)  passEl.value  = '';
  if (typeof window.authSubmit === 'function') window.authSubmit();
  else toggleAuthModal(); // fallback: just open modal pre-filled
}
