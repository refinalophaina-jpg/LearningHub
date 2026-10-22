'use strict';
// Structural integrity of every study bank. These checks catch the defects a
// reader cannot see across ~1,500 items: malformed or merged options, keys out
// of range, duplicate entries that drift apart, and explanations that name a
// different letter than the key.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

const load = f => JSON.parse(fs.readFileSync('assets/data/' + f, 'utf8'));
const norm = t => String(t).toLowerCase().replace(/\W+/g, ' ').trim();
const list = v => (Array.isArray(v) ? v : JSON.parse(String(v).replace(/'/g, '"')));
const dupes = keys => { const seen = new Set(), out = []; for (const k of keys) { if (seen.has(k)) out.push(k); seen.add(k); } return out; };

test('quiz items are well formed and unambiguous in structure', () => {
  const quiz = load('quiz.json');
  quiz.forEach((q, i) => {
    const id = 'Q' + String(i).padStart(3, '0');
    assert.equal(q.opts.length, 4, id + ' needs four options');
    assert.deepEqual(q.opts.map(o => o.slice(0, 3)), ['A. ', 'B. ', 'C. ', 'D. '], id + ' option labels');
    assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4, id + ' key in range');
    assert.equal(new Set(q.opts.map(o => norm(o.slice(3)))).size, 4, id + ' has duplicate options');
    q.opts.forEach(o => assert.doesNotMatch(o.slice(3), /\b[A-D]\. [A-Z]/, id + ' option text contains another option'));
    assert.ok(q.exp && q.exp.trim(), id + ' needs an explanation');
    const named = /(?:correct answer|answer) is \(?([A-D])\)?\b/i.exec(q.exp);
    if (named) assert.equal('ABCD'.indexOf(named[1].toUpperCase()), q.correct, id + ' explanation names a different letter');
    for (const f of ['topic', 'domain', 'diff', 'ref']) assert.ok(String(q[f] || '').trim(), id + ' missing ' + f);
  });
  assert.deepEqual(dupes(quiz.map(q => norm(q.q))), [], 'duplicate quiz stems');
});

test('mock items are well formed', () => {
  const mock = load('mock_exam.json');
  mock.forEach(m => {
    const choices = list(m.choices);
    assert.equal(choices.length, 4, m.id + ' needs four choices');
    const k = Number(m.correctIdx);
    assert.ok(Number.isInteger(k) && k >= 0 && k < 4, m.id + ' key in range');
    assert.equal(new Set(choices.map(norm)).size, 4, m.id + ' has duplicate choices');
    assert.ok(m.exp && m.exp.trim(), m.id + ' needs an explanation');
  });
  assert.deepEqual(dupes(mock.map(m => m.id)), [], 'duplicate mock ids');
  assert.deepEqual(dupes(mock.map(m => norm(m.stem))), [], 'duplicate mock stems');
});

test('reference banks have one entry per concept', () => {
  assert.deepEqual(dupes(load('glo_terms.json').map(t => norm(t.term))), [], 'glossary terms defined twice drift apart');
  const drugs = load('drug_db.json');
  assert.deepEqual(dupes(drugs.map(d => norm(d.name))), [], 'drug monographs duplicated');
  assert.deepEqual(dupes(drugs.map(d => d.id)), [], 'drug ids must be unique (expansion state keys on id)');
  assert.deepEqual(dupes(load('flash.json').map(f => norm(f.front))), [], 'duplicate flashcards');
  load('flash.json').forEach((f, i) => assert.equal((f.front.match(/\[\[/g) || []).length, (f.front.match(/\]\]/g) || []).length, 'flash ' + i + ' cloze brackets'));
});

test('lithium targets match the 2024 chapter everywhere', () => {
  const corpus = ['quiz.json', 'flash.json', 'glo_terms.json', 'drug_db.json', 'evidencedata.json', 'mock_exam.json']
    .map(f => fs.readFileSync('assets/data/' + f, 'utf8')).join('\n') + fs.readFileSync('app/index.html', 'utf8');
  const near = [...corpus.matchAll(/lithium[^"\n]{0,160}/gi)].map(m => m[0]);
  for (const s of near) {
    assert.doesNotMatch(s, /0\.6\s*[-–]\s*1\.2\s*(mEq\/L)?\s*\(?(for\s+)?(maintenance|acute)/i, 'lithium phase range: ' + s.slice(0, 120));
    assert.doesNotMatch(s, /maintenance[^.;]{0,20}0\.(4|6)\s*[-–]\s*0\.8|0\.4\s*[-–]\s*1(\.0)?\s*(mEq\/L\s*)?maintenance/i, 'lithium maintenance range: ' + s.slice(0, 120));
  }
});

test('later changes use the two note markers the site renders as callouts', () => {
  const corpus = ['quiz.json', 'flash.json', 'glo_terms.json', 'drug_db.json', 'evidencedata.json', 'mock_exam.json', 'epdrills.json']
    .map(f => fs.readFileSync('assets/data/' + f, 'utf8')).join('\n') + fs.readFileSync('app/index.html', 'utf8');
  assert.doesNotMatch(corpus, /Updated since 2024:|Recent change —/, 'legacy note format would render as plain text');
  const updates = load('updates.json');
  assert.ok(updates.length > 0, 'the changes page needs entries');
  assert.deepEqual(dupes(updates.map(u => u.id)), [], 'duplicate change ids');
  updates.forEach(u => {
    for (const k of ['domain', 'date', 'change', 'practice_impact', 'source']) assert.ok(u[k] && String(u[k]).trim(), u.id + ' needs ' + k);
    assert.match(u.date, /^20\d\d-\d\d$/, u.id + ' date');
    assert.match(u.url, /^https:\/\//, u.id + ' needs a source link');
  });
});
