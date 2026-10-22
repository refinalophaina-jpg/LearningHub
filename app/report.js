/* Report a problem with a study item. The site is static, so a report is
   assembled on the device: email it to the reviewer, copy it, or open a
   pre-filled public GitHub issue. Nothing is sent unless the reader chooses to. */
(function () {
  'use strict';
  const ISSUE_URL = 'https://github.com/refinalophaina-jpg/LearningHub/issues/new';
  const EMAIL = 'AyialoPharmD@gmail.com';
  const strip = h => String(h == null ? '' : h).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  let dlg, current;

  function describe(item) {
    if (item.text) return item.text;
    if (item.kind === 'Quiz') {
      const q = (window.__quizData || [])[item.index];
      if (!q) return '';
      return 'Question: ' + strip(q.q) + '\n' + q.opts.map((o, i) => (i === q.correct ? '* ' : '  ') + strip(o)).join('\n') + '\nReference: ' + strip(q.ref);
    }
    if (item.kind === 'Mock') {
      const m = (window.__mockExamData || []).find(x => x.id === item.id);
      if (!m) return '';
      const ch = Array.isArray(m.choices) ? m.choices : [];
      return 'Question: ' + strip(m.stem) + '\n' + ch.map((c, i) => (i === Number(m.correctIdx) ? '* ' : '  ') + 'ABCD'[i] + '. ' + strip(c)).join('\n');
    }
    if (item.kind === 'Flashcard') {
      const f = (window.__flashData || [])[item.index];
      return f ? 'Front: ' + strip(f.front) + '\nBack: ' + strip(f.back) : '';
    }
    return '';
  }

  function reportText(note) {
    return 'Item: ' + current.kind + ' ' + current.id + '\n' + describe(current) +
      '\n\nWhat looks wrong:\n' + (note.trim() || '(not specified)') + '\n\nReported from bcps.ainadara.com';
  }

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'report-dialog';
    dlg.setAttribute('aria-labelledby', 'reportTitle');
    dlg.innerHTML =
      '<form method="dialog" class="report-form">' +
      '<h2 id="reportTitle">Report a problem</h2>' +
      '<p class="report-item" id="reportItem"></p>' +
      '<label for="reportNote">What looks wrong? Include the source if you have one.</label>' +
      '<textarea id="reportNote" rows="4" placeholder="e.g. Option C is also correct per the 2024 IDSA guideline"></textarea>' +
      '<p class="report-help">Email opens your mail app with the report filled in, addressed to <span class="report-email">' + EMAIL + '</span>. No mail app? Copy the report and send it there. A public GitHub issue also works if you have an account.</p>' +
      '<div class="report-actions">' +
      '<button type="button" class="btn btn-primary" id="reportEmail">Email report</button>' +
      '<button type="button" class="btn btn-secondary" id="reportCopy">Copy report</button>' +
      '<button type="button" class="btn btn-secondary" id="reportIssue">Open GitHub issue</button>' +
      '<button type="submit" class="btn btn-secondary" value="close">Close</button>' +
      '</div><p class="report-status" id="reportStatus" role="status"></p></form>';
    document.body.appendChild(dlg);
    dlg.querySelector('#reportCopy').addEventListener('click', copy);
    dlg.querySelector('#reportEmail').addEventListener('click', () => {
      // Mail clients truncate long mailto links; keep the body well under 2,000 characters.
      const body = reportText(dlg.querySelector('#reportNote').value).slice(0, 1800);
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('BCPS Hub report: ' + current.kind + ' ' + current.id) + '&body=' + encodeURIComponent(body);
      dlg.querySelector('#reportStatus').textContent = 'If no email opened, copy the report and send it to ' + EMAIL + '.';
    });
    dlg.querySelector('#reportIssue').addEventListener('click', () => {
      const body = reportText(dlg.querySelector('#reportNote').value).slice(0, 6000);
      const url = ISSUE_URL + '?title=' + encodeURIComponent('Content issue: ' + current.kind + ' ' + current.id) + '&body=' + encodeURIComponent(body);
      window.open(url, '_blank', 'noopener');
    });
  }

  async function copy() {
    const text = reportText(dlg.querySelector('#reportNote').value);
    const status = dlg.querySelector('#reportStatus');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Report copied. Paste it into an email to ' + EMAIL + '.';
    } catch (_) {
      const ta = dlg.querySelector('#reportNote');
      ta.value = text; ta.select();
      status.textContent = 'Copy is blocked in this browser. The full report is selected above; copy it manually.';
    }
  }

  window.BCPS_report = function (item) {
    if (!dlg) build();
    current = item;
    dlg.querySelector('#reportItem').textContent = item.kind + ' ' + item.id;
    dlg.querySelector('#reportNote').value = '';
    dlg.querySelector('#reportStatus').textContent = '';
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.querySelector('#reportNote').focus();
  };
})();
