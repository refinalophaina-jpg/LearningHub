/* Validate the complete portable backup before changing any browser storage. */
(function (root) {
  'use strict';
  const fields = {
    sr: ['bcps_sr_v2', 'object'], streak: ['bcps_streak_v1', 'object'],
    progress: ['bcps_progress_v2', 'object'], custom: ['bcps_custom_cards', 'array'],
    accp: ['bcps_accp_reviewed', 'object'], quizSrs: ['bcps_quiz_srs_20261019', 'object'],
    confidence: ['bcps_confidence_log_20261019', 'array'], mockHistory: ['bcps_mock_history', 'array'],
    mockSession: ['bcps_mock_session_20261019', 'object'], mockResult: ['bcps_mock_result_v1', 'object'],
    currentMockSession: ['bcps_mock_session_20261019_v2', 'object'], currentMockResult: ['bcps_mock_result_v2', 'object'],
    pdfStudy: ['bcps_pdf_study_v1', 'object']
  };
  const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  function decode(raw) {
    if (typeof raw !== 'string' || raw.length > 7_000_000) throw new Error('This code is too large. Use a code exported by this hub.');
    let data;
    try { data = JSON.parse(decodeURIComponent(escape(atob(raw.trim())))); }
    catch (_) { throw new Error('This code could not be read. Copy the complete code and try again.'); }
    if (!object(data) || ![3, 4].includes(data.v)) throw new Error('This backup version is not supported. Export a new code from the hub.');
    if (data.v === 4 && data.studyRevision !== '2026-10-19') throw new Error('This code uses a different question edition. Your progress has not changed.');
    const writes = [];
    for (const [field, [key, shape]] of Object.entries(fields)) {
      if (data[field] == null) continue;
      if (data.v === 3 && ['quizSrs', 'confidence', 'mockHistory', 'mockSession', 'mockResult', 'currentMockSession', 'currentMockResult', 'pdfStudy'].includes(field)) continue;
      if (typeof data[field] !== 'string') throw new Error('The backup contains an invalid ' + field + ' record.');
      let value;
      try { value = JSON.parse(data[field]); } catch (_) { throw new Error('The backup contains an incomplete ' + field + ' record.'); }
      if (!(shape === 'array' ? Array.isArray(value) : object(value))) throw new Error('The backup contains an invalid ' + field + ' format.');
      if (field === 'pdfStudy') {
        const pdfStore = root.BCPSPDFStore || (typeof require === 'function' ? require('./pdf-store.js') : null);
        if (!pdfStore || !pdfStore.valid(value)) throw new Error('The backup contains invalid PDF notes. Your progress has not changed.');
      }
      writes.push([key, data[field]]);
    }
    if (data.examDate != null) {
      if (typeof data.examDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.examDate) || !Number.isFinite(Date.parse(data.examDate)) || new Date(data.examDate).toISOString().slice(0, 10) !== data.examDate) throw new Error('The saved exam date is invalid.');
      writes.push(['bcps_exam_date', data.examDate]);
    }
    if (!writes.length) throw new Error('This code contains no saved progress to restore.');
    return writes;
  }
  function apply(writes, storage) {
    const previous = writes.map(([key]) => [key, storage.getItem(key)]);
    let written = 0;
    try {
      for (const [key, value] of writes) { value === null ? storage.removeItem(key) : storage.setItem(key, value); written++; }
    } catch (_) {
      let rollbackFailed = false;
      for (let i = written - 1; i >= 0; i--) {
        const [key, value] = previous[i];
        try { value === null ? storage.removeItem(key) : storage.setItem(key, value); } catch (_) { rollbackFailed = true; }
      }
      throw new Error(rollbackFailed ? 'Storage failed while restoring. Keep your backup code and check browser storage before trying again.' : 'Your browser could not save this backup. Previous progress was restored; free browser storage or try another browser.');
    }
    return writes.length;
  }
  const keys = [...Object.values(fields).map(x => x[0]), 'bcps_exam_date'];
  function capture(storage) { return Object.fromEntries(keys.map(key => [key, storage.getItem(key)])); }
  function restoreSnapshot(snapshot, storage) {
    if (!object(snapshot) || keys.some(key => snapshot[key] !== null && typeof snapshot[key] !== 'string')) throw new Error('The previous progress copy could not be read. Keep your backup file.');
    return apply(keys.map(key => [key, snapshot[key]]), storage);
  }
  function restore(raw, storage) { return apply(decode(raw), storage); }
  function readFile(text) {
    let data;
    try { data = JSON.parse(text); } catch (_) { throw new Error('Choose a BCPS progress backup file saved from this hub. Your progress has not changed.'); }
    if (!object(data)) throw new Error('Choose a BCPS progress backup file saved from this hub. Your progress has not changed.');
    if (data.format === 'AinaDara BCPS progress' && data.version === 1) data = data.progress;
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    decode(code);
    return { code, date: Number.isFinite(data.ts) ? new Date(data.ts).toLocaleDateString(undefined, {month:'long',day:'numeric',year:'numeric'}) : null };
  }
  function makeFile(code) {
    decode(code);
    return JSON.stringify({format:'AinaDara BCPS progress',version:1,progress:JSON.parse(decodeURIComponent(escape(atob(code))))},null,2);
  }
  root.BCPSProgressCode = { decode, restore, capture, restoreSnapshot, readFile, makeFile };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.BCPSProgressCode;
})(typeof window === 'undefined' ? globalThis : window);
