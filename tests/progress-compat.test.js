'use strict';
// Saved progress lives in each reader's browser and is keyed by item position
// (quiz Q###, flashcard F###) and by fixed storage keys. A content update that
// reorders or deletes items, or renames a key, silently attaches someone's
// history to the wrong question or drops it. These checks fail before that
// can ship. To retire an item, rewrite it in place; add new items at the end.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

const load = f => JSON.parse(fs.readFileSync('assets/data/' + f, 'utf8'));
const pad = i => String(i).padStart(3, '0');
const code = ['app.js', 'study-features.js', 'mock-exam.js', 'progress-code.js', 'backup-files.js', 'podcasts.js']
  .map(f => fs.readFileSync('app/' + f, 'utf8')).join('\n');

// Counts and ids as of 2026-10-23, when a reader's saved progress already existed.
const SHIPPED = { quiz: 449, flash: 206, mock: 150 };

test('quiz and flashcard positions never move', () => {
  for (const [file, prefix, n] of [['quiz.json', 'Q', SHIPPED.quiz], ['flash.json', 'F', SHIPPED.flash]]) {
    const items = load(file);
    assert.ok(items.length >= n, file + ' lost items: progress for later items would shift onto the wrong ones');
    items.forEach((x, i) => assert.equal(x.id, prefix + pad(i), file + ' item at position ' + i + ' must keep id ' + prefix + pad(i) + ' (was it moved, deleted, or inserted mid-list?)'));
  }
});

test('mock exam ids that readers may have answered still exist', () => {
  const ids = new Set(load('mock_exam.json').map(m => m.id));
  for (let i = 1; i <= SHIPPED.mock; i++) assert.ok(ids.has('AD-MOCK-' + pad(i)), 'AD-MOCK-' + pad(i) + ' is referenced by saved mock history');
});

test('storage keys holding reader progress are still read', () => {
  const keys = ['bcps_sr_v2', 'bcps_streak_v1', 'bcps_progress_v2', 'bcps_custom_cards', 'bcps_quiz_srs_20261019',
    'bcps_confidence_log_20261019', 'bcps_mock_history', 'bcps_mock_session_20261019_v2', 'bcps_mock_result_v2',
    'bcps_exam_date', 'bcps_podcast_progress'];
  for (const k of keys) assert.ok(code.includes("'" + k + "'"), k + ' is no longer referenced: renaming a key needs a migration from the old one');
  const backup = fs.readFileSync('app/progress-code.js', 'utf8');
  for (const k of keys.slice(0, 9)) assert.ok(backup.includes("'" + k + "'"), k + ' must stay in the backup file format');
});

test('custom flashcards are keyed apart from built-in cards', () => {
  assert.match(code, /function cardId\(i\) \{ return i < flashData\.length \? 'c' \+ i : 'u' \+ \(i - flashData\.length\); \}/);
  assert.match(code, /const LEGACY_FLASH_COUNT = 206;/, 'legacy custom-card ids were counted after 206 built-in cards');
  assert.doesNotMatch(code, /_id:'c'\+i|isDue\('c'\+i\)|isNew\('c'\+i\)/, 'flashcard ids must come from cardId()');
});
