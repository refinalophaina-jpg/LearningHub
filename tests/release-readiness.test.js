const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const q = require('../assets/data/quiz.json');
const read = p => fs.readFileSync(p, 'utf8');

test('quiz content has valid, unique choices and no retired mock provenance', () => {
  assert.equal(q.length, 449);
  for (const [i, item] of q.entries()) {
    assert.equal(item.opts.length, 4, `item ${i}`);
    assert.equal(new Set(item.opts.map(x => x.replace(/^[A-D]\.\s*/, '').trim().toLowerCase())).size, 4, `duplicate choices ${i}`);
    assert.ok(Number.isInteger(item.correct) && item.correct >= 0 && item.correct < 4, `key ${i}`);
    assert.ok(item.q && item.exp && item.ref, `incomplete ${i}`);
    assert.doesNotMatch(item.ref, /mock exam/i, `copied provenance ${i}`);
    if (item.opts_exp.length === 4) item.opts_exp.forEach((r, n) => {
      if (/\bCORRECT\b/.test(r)) assert.equal(n, item.correct, `key/rationale conflict ${i}`);
    });
  }
});

test('all 73 replacement drafts have four rationales and original provenance', () => {
  const originals = q.filter(x => x.provenance?.kind === 'original');
  assert.equal(originals.length, 73);
  for (const x of originals) {
    assert.equal(x.opts_exp.length, 4);
    assert.equal(x.provenance.reviewStatus, 'draft');
    assert.ok(x.opts_exp.every(r => r.replace(/^[A-D]\.\s*/, '').trim().length > 0));
  }
});

test('targeted arithmetic and prescribing corrections have consistent keys', () => {
  assert.equal(q[52].correct, 1); assert.match(q[52].exp, /contraindicated/);
  assert.equal(q[166].correct, 1); assert.match(q[166].exp, /without oral supplementation/);
  assert.equal(q[267].correct, 1); assert.doesNotMatch(q[267].exp, /Wait|closest/);
  assert.equal(q[300].correct, 1); assert.match(q[300].exp, /1000 mg/);
  assert.equal(q[305].correct, 0);
  assert.equal(q[372].correct, 1); assert.match(q[372].opts[1], /450 mg once daily/);
  assert.match(q[311].opts[1], /one business day.*45 days/);
});

test('revision migration preserves old stores and only transfers unchanged mastery', () => {
  const data = new Map([
    ['bcps_quiz_srs', JSON.stringify({10:{graduated:true},52:{graduated:true},376:{graduated:true}})],
    ['bcps_confidence_log', JSON.stringify([{i:10,c:'certain'},{i:52,c:'certain'},{i:376,c:'certain'}])]
  ]);
  const legacy = new Map(data);
  const localStorage = {getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v))};
  const src = read('app/study-features.js');
  const prefix = src.slice(0, src.indexOf('  // ── Exam date anchor')) + '\n})();';
  vm.runInNewContext(prefix,{localStorage,Set,Date});
  assert.deepEqual(JSON.parse(data.get('bcps_quiz_srs_20261019')), {10:{graduated:true}});
  assert.deepEqual(JSON.parse(data.get('bcps_confidence_log_20261019')), [{i:10,c:'certain'}]);
  for (const [k,v] of legacy) assert.equal(data.get(k),v);
  data.set('bcps_quiz_srs_20261019',JSON.stringify({376:{graduated:true}}));
  vm.runInNewContext(prefix,{localStorage,Set,Date});
  assert.deepEqual(JSON.parse(data.get('bcps_quiz_srs_20261019')),{376:{graduated:true}});
});

test('progress backup includes revision-aware spaced review, confidence, history, and exam date', () => {
  const src=read('app/app.js');
  const fn=src.slice(src.indexOf('function _buildProgressCode()'),src.indexOf('function _refreshLivePreview()'));
  const entries = {'bcps_sr_v2':'{}','bcps_quiz_srs_20261019':'{"10":{"graduated":true}}','bcps_confidence_log_20261019':'[]','bcps_mock_history':'[]','bcps_exam_date':'2026-12-01'};
  const ctx={localStorage:{getItem:k=>entries[k]??null}, btoa:s=>Buffer.from(s,'binary').toString('base64'),unescape,encodeURIComponent,Date};
  const code=vm.runInNewContext(fn+';_buildProgressCode()',ctx);
  const backup=JSON.parse(Buffer.from(code,'base64').toString());
  assert.equal(backup.v,4); assert.equal(backup.studyRevision,'2026-10-19');
  assert.equal(backup.quizSrs,entries.bcps_quiz_srs_20261019);
  assert.equal(backup.confidence,'[]');assert.equal(backup.mockHistory,'[]');assert.equal(backup.examDate,'2026-12-01');
});

test('source UI is reachable and makes review limits explicit', () => {
  const html=read('app/index.html');
  assert.equal((html.match(/name="viewport"/g)||[]).length,1);
  assert.match(html,/id="sources"/);assert.match(html,/Full content review is still in progress/);
  assert.match(read('app/app.js'),/'glossary', 'sources'/);
  assert.ok(!fs.existsSync('assets/data/accp.json'));
  assert.ok(!fs.existsSync('2024_BCPS_Prep_Volume_1_Combined.pdf'));
  assert.ok(!fs.existsSync('2024_BCPS_Prep_Volume_2_Combined.pdf'));
});
