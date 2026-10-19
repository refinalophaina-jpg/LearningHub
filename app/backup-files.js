/* A backup file is the main cross-device flow; codes remain an optional fallback. */
(function () {
  'use strict';
  const undoKey = 'bcps_restore_undo_v1', noticeKey = 'bcps_restore_notice';
  let pending = null;
  const message = document.getElementById('backupFileMessage');
  const input = document.getElementById('backupFileInput');
  function say(text, error) { message.textContent = text; message.classList.toggle('backup-error', !!error); window.dispatchEvent(new CustomEvent('bcps:backup-status',{detail:{text,error:!!error}})); }
  function reloadAfterRestore() {
    try { localStorage.setItem(noticeKey, 'restored'); } catch (_) {}
    say('Progress restored. Opening your study desk…');
    setTimeout(() => location.reload(), 700);
  }
  window.BCPS_saveBackupFile = function () {
    try {
      const file = BCPSProgressCode.makeFile(_buildProgressCode());
      const link = document.createElement('a'), url = URL.createObjectURL(new Blob([file], {type:'application/json'}));
      const day = new Date().toLocaleDateString('en-CA');
      link.href = url; link.download = 'BCPS-progress-' + day + '.json';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      say('Backup download started. Keep the file in Downloads, Files, or your cloud drive.');
      try { localStorage.setItem('bcps_last_backup_file', new Date().toISOString()); } catch (_) {}
    } catch (_) { say('We could not create a backup. Try the progress-code option below, or use another browser.', true); }
  };
  window.BCPS_chooseBackupFile = function () { input.value = ''; input.click(); };
  input.addEventListener('change', async () => {
    const file = input.files[0]; if (!file) return;
    pending = null;
    try {
      if (file.size > 7_000_000) throw new Error('This file is too large. Choose the progress backup saved by this hub.');
      pending = BCPSProgressCode.readFile(await file.text());
      document.getElementById('backupRestoreSummary').textContent = pending.date ? 'Restore your saved progress from ' + pending.date + '?' : 'Restore the progress saved in this backup?';
      document.getElementById('backupRestoreCheck').hidden = false;
      document.getElementById('backupRestoreSummary').focus();
      say('File checked. Your current progress has not changed.');
    } catch (error) { document.getElementById('backupRestoreCheck').hidden = true; say(error.message, true); }
  });
  window.BCPS_confirmFileRestore = function () {
    if (!pending) return;
    try {
      BCPSProgressCode.decode(pending.code);
      localStorage.setItem(undoKey, JSON.stringify(BCPSProgressCode.capture(localStorage)));
      BCPSProgressCode.restore(pending.code, localStorage);
      pending = null; reloadAfterRestore();
    } catch (error) { say(error.message || 'This browser could not restore the file. Your current progress is unchanged.', true); }
  };
  window.BCPS_cancelFileRestore = function () {
    pending = null; document.getElementById('backupRestoreCheck').hidden = true;
    say('Restore cancelled. Your progress has not changed.');
    document.getElementById('restoreBackupButton').focus();
  };
  window.BCPS_undoFileRestore = function () {
    try {
      const previous = JSON.parse(localStorage.getItem(undoKey));
      BCPSProgressCode.restoreSnapshot(previous, localStorage);
      localStorage.removeItem(undoKey); localStorage.removeItem(noticeKey);
      say('Your previous progress is back. Opening your study desk…');
      setTimeout(() => location.reload(), 700);
    } catch (error) { say(error.message || 'We could not recover the previous progress. Keep your saved backup file.', true); }
  };
  window.BCPS_dismissRestoreNotice = function () {
    document.getElementById('restoreNotice').hidden = true;
    try { localStorage.removeItem(noticeKey); } catch (_) {}
  };
  try {
    const hasUndo = !!localStorage.getItem(undoKey);
    document.getElementById('undoBackupButton').hidden = !hasUndo;
    document.getElementById('restoreNotice').hidden = !hasUndo || !localStorage.getItem(noticeKey);
  } catch (_) {}
})();
