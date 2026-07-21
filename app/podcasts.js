/* Podcasts — episode list with a lazy inline player, resume position, and
   playback speed. Audio streams directly from R2; nothing is bundled or cached
   by the app itself. Progress is local only, same as the rest of the hub. */
(function () {
  'use strict';
  var LS_KEY = 'bcps_podcast_progress';
  var episodes = window.__PODCASTS || [];
  var base = window.__PODCASTS_BASE || '';

  function slugOf(file) { return file.replace(/\.[^.]+$/, ''); }
  function readProgress() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; } }
  function writeProgress(p) { try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch (e) { } }
  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) return '--:--';
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function render() {
    var el = document.getElementById('podcastList');
    if (!el) return;
    var progress = readProgress();
    el.innerHTML = episodes.map(function (ep, i) {
      var slug = slugOf(ep.file);
      var p = progress[slug];
      var pct = (p && p.duration) ? Math.min(100, Math.round(100 * p.position / p.duration)) : 0;
      var done = p && p.completed;
      return (
        '<div class="podcast-ep' + (done ? ' done' : '') + '" id="ep-' + i + '">' +
        '<div class="podcast-ep-row" onclick="window.BCPS_togglePodcast(' + i + ')">' +
        '<button type="button" class="podcast-play-btn" aria-label="Play">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
        '</button>' +
        '<div class="podcast-ep-info">' +
        '<div class="podcast-ep-title">' + ep.title + (done ? ' <span class="podcast-done-badge">Listened</span>' : '') + '</div>' +
        '<div class="podcast-ep-blurb">' + ep.blurb + '</div>' +
        '<div class="podcast-ep-meta"><span class="tag">' + ep.area + '</span>' +
        (pct > 0 && !done ? '<span class="podcast-resume">' + pct + '% listened</span>' : '') + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="podcast-player-wrap" id="player-' + i + '"></div>' +
        '</div>'
      );
    }).join('');
  }

  var openIdx = null;
  window.BCPS_togglePodcast = function (i) {
    if (openIdx === i) { closePlayer(i); openIdx = null; return; }
    if (openIdx != null) closePlayer(openIdx);
    openPlayer(i);
    openIdx = i;
  };

  function closePlayer(i) {
    var wrap = document.getElementById('player-' + i);
    if (wrap) wrap.innerHTML = '';
  }

  function openPlayer(i) {
    var ep = episodes[i];
    var slug = slugOf(ep.file);
    var wrap = document.getElementById('player-' + i);
    if (!wrap) return;
    var src = base + encodeURIComponent(ep.file);
    var progress = readProgress();
    var saved = progress[slug];

    wrap.innerHTML =
      '<audio id="audio-' + i + '" preload="metadata" src="' + src + '"></audio>' +
      '<div class="podcast-controls">' +
      '<button type="button" class="btn btn-secondary podcast-ctl-btn" onclick="window.BCPS_podcastSeek(' + i + ',-15)">&laquo; 15s</button>' +
      '<button type="button" class="btn btn-primary podcast-ctl-btn" id="ppbtn-' + i + '" onclick="window.BCPS_podcastPlayPause(' + i + ')">Play</button>' +
      '<button type="button" class="btn btn-secondary podcast-ctl-btn" onclick="window.BCPS_podcastSeek(' + i + ',15)">15s &raquo;</button>' +
      '<span class="podcast-time" id="ptime-' + i + '">--:-- / --:--</span>' +
      '<select class="podcast-speed" onchange="window.BCPS_podcastSpeed(' + i + ',this.value)">' +
      '<option value="0.75">0.75x</option><option value="1" selected>1x</option>' +
      '<option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option>' +
      '</select>' +
      '<button type="button" class="btn btn-secondary podcast-ctl-btn" onclick="window.BCPS_podcastMarkDone(' + i + ')">Mark listened</button>' +
      '</div>' +
      '<div class="podcast-progress-track" onclick="window.BCPS_podcastScrub(' + i + ', event)"><div class="podcast-progress-fill" id="pfill-' + i + '"></div></div>';

    var audio = document.getElementById('audio-' + i);
    audio.addEventListener('loadedmetadata', function () {
      if (saved && saved.position && saved.position < audio.duration - 5) audio.currentTime = saved.position;
      updateTimeDisplay(i, audio);
    });
    audio.addEventListener('timeupdate', function () {
      updateTimeDisplay(i, audio);
      saveTick(slug, audio);
    });
    audio.addEventListener('play', function () { var b = document.getElementById('ppbtn-' + i); if (b) b.textContent = 'Pause'; });
    audio.addEventListener('pause', function () { var b = document.getElementById('ppbtn-' + i); if (b) b.textContent = 'Play'; });
    audio.addEventListener('ended', function () {
      var p = readProgress(); p[slug] = { position: 0, duration: audio.duration, completed: true }; writeProgress(p);
      render();
    });
  }

  var lastSave = 0;
  function saveTick(slug, audio) {
    var now = Date.now();
    if (now - lastSave < 4000) return;
    lastSave = now;
    var p = readProgress();
    var wasDone = p[slug] && p[slug].completed;
    p[slug] = { position: audio.currentTime, duration: audio.duration, completed: !!wasDone };
    writeProgress(p);
  }

  function updateTimeDisplay(i, audio) {
    var t = document.getElementById('ptime-' + i);
    if (t) t.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
    var fill = document.getElementById('pfill-' + i);
    if (fill && audio.duration) fill.style.width = Math.min(100, 100 * audio.currentTime / audio.duration) + '%';
  }

  window.BCPS_podcastPlayPause = function (i) {
    var a = document.getElementById('audio-' + i); if (!a) return;
    if (a.paused) a.play(); else a.pause();
  };
  window.BCPS_podcastSeek = function (i, delta) {
    var a = document.getElementById('audio-' + i); if (!a) return;
    a.currentTime = Math.max(0, Math.min((a.duration || 0), a.currentTime + delta));
  };
  window.BCPS_podcastSpeed = function (i, rate) {
    var a = document.getElementById('audio-' + i); if (a) a.playbackRate = parseFloat(rate);
  };
  window.BCPS_podcastScrub = function (i, evt) {
    var a = document.getElementById('audio-' + i); if (!a || !a.duration) return;
    var track = evt.currentTarget; var rect = track.getBoundingClientRect();
    var pct = (evt.clientX - rect.left) / rect.width;
    a.currentTime = Math.max(0, Math.min(a.duration, pct * a.duration));
  };
  window.BCPS_podcastMarkDone = function (i) {
    var ep = episodes[i]; var slug = slugOf(ep.file);
    var a = document.getElementById('audio-' + i);
    var p = readProgress();
    p[slug] = { position: 0, duration: (a && a.duration) || (p[slug] && p[slug].duration) || 0, completed: true };
    writeProgress(p);
    render();
  };

  window.addEventListener('bcps:tab', function (e) { if (e.detail === 'podcasts') { openIdx = null; render(); } });
  document.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();
})();
