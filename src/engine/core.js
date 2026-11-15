/* =====================================================================
   PSLE Science engine — core
   Storage (psle-sci: keys only), attempt log, spaced-recap state,
   palette, header tools, export/import, toast, recap banner.
   Pages never touch localStorage directly: use window.PSLE.
   ===================================================================== */
(function () {
  'use strict';

  var DATA = {};
  try { DATA = JSON.parse(document.getElementById('psle-data').textContent) || {}; } catch (e) { DATA = {}; }

  var K = { theme: 'psle-sci:theme', attempts: 'psle-sci:attempts', pages: 'psle-sci:pages', meta: 'psle-sci:meta' };
  var THEMES = ['notebook', 'lab', 'mission'];
  var MAX_ATTEMPTS = 5000;
  var mem = {};

  /* ---------- storage: every access guarded, memory fallback ---------- */
  function read(k, d) {
    try { var v = localStorage.getItem(k); if (v !== null) return JSON.parse(v); } catch (e) {}
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : d;
  }
  function write(k, v) {
    mem[k] = v;
    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
  }

  /* ---------- small helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- calendar days (local date -> integer day number) ---------- */
  function dayOf(t) { var d = new Date(t); return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  function today() { return dayOf(Date.now()); }
  function dayLabel(n) {
    var t = today();
    if (n === t) return 'today';
    if (n === t + 1) return 'tomorrow';
    if (n === t - 1) return 'yesterday';
    var d = new Date(n * 864e5);
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  }

  /* ---------- change listeners ---------- */
  var listeners = [];
  function onChange(f) { listeners.push(f); }
  function fire() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf('psle-sci:') !== 0) return;
    if (e.key === K.theme) applyTheme(getTheme());
    fire();
  });

  /* ---------- palette ---------- */
  var themeFns = [];
  function getTheme() { var t = read(K.theme, 'notebook'); return THEMES.indexOf(t) >= 0 ? t : 'notebook'; }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    $$('[data-set-theme]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-theme') === t)); });
    themeFns.forEach(function (f) { try { f(t); } catch (e) {} });
  }
  function setTheme(t) { if (THEMES.indexOf(t) < 0) return; write(K.theme, t); applyTheme(t); }
  function onTheme(f) { themeFns.push(f); }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  /* ---------- attempt log ----------
     Only first answers (page mode) and recap answers are logged:
     {q, page, choice, ok, mode:'page'|'recap', at, mis?, for?}
     mis = misconception tag of the option chosen (wrong answers only)
     for = the tag a recap question was served for                        */
  function attempts() { var a = read(K.attempts, []); return Array.isArray(a) ? a : []; }
  function record(o) {
    var rec = { q: o.q, page: o.page || (DATA.page && DATA.page.id) || 'hub', choice: o.choice, ok: !!o.ok,
      mode: o.mode === 'recap' ? 'recap' : 'page', at: new Date().toISOString() };
    if (!rec.ok && o.mis) rec.mis = o.mis;
    if (o.for) rec.for = o.for;
    var a = attempts(); a.push(rec);
    if (a.length > MAX_ATTEMPTS) a.splice(0, a.length - MAX_ATTEMPTS);
    write(K.attempts, a);
    ensureMeta();
    fire();
    return rec;
  }
  function ensureMeta() { var m = read(K.meta, null); if (!m) write(K.meta, { schema: 2, created: new Date().toISOString() }); }
  function byTime(x, y) { return x.at < y.at ? -1 : x.at > y.at ? 1 : 0; }

  /* ---------- spaced recap state, worked out from the log ----------
     wrong first answer on tag T  -> T active, due tomorrow
     recap right (on/after due)   -> step 1: +3 days, step 2: +7 days, step 3: cleared
     recap wrong                  -> back to start, due tomorrow
     a wrong recap choice tagged with another idea activates that idea too  */
  function tagStates(list) {
    var a = (list || attempts()).slice().sort(byTime), S = {};
    function get(id) { return S[id] || (S[id] = { id: id, active: false, step: 0, due: null, misses: [], recaps: [], cleared: null, activated: null }); }
    function activate(id, r, d) { var s = get(id); s.active = true; s.step = 0; s.due = d + 1; s.misses.push(r); s.activated = r.at; s.cleared = null; }
    a.forEach(function (r) {
      var d = dayOf(r.at);
      if (r.mode === 'page') { if (!r.ok && r.mis) activate(r.mis, r, d); return; }
      if (r.for) {
        var s = get(r.for); s.recaps.push(r);
        if (s.active) {
          if (r.ok) {
            if (s.due != null && d >= s.due) {
              s.step++;
              if (s.step === 1) s.due = d + 3;
              else if (s.step === 2) s.due = d + 7;
              else { s.active = false; s.cleared = r.at; s.due = null; }
            }
          } else { s.step = 0; s.due = d + 1; s.misses.push(r); }
        }
      }
      if (!r.ok && r.mis && r.mis !== r.for) activate(r.mis, r, d);
    });
    return S;
  }
  function dueTags(S, t) {
    S = S || tagStates(); t = t == null ? today() : t;
    return Object.keys(S).map(function (k) { return S[k]; })
      .filter(function (s) { return s.active && s.due != null && s.due <= t; })
      .sort(function (x, y) { return x.due - y.due || (x.activated < y.activated ? -1 : 1); });
  }

  /* ---------- page visits ---------- */
  function visit() {
    if (!DATA.page) return;
    var p = read(K.pages, {}) || {}, id = DATA.page.id, now = new Date().toISOString();
    var e = p[id] || { v: now }; e.last = now; p[id] = e; write(K.pages, p);
  }
  function pages() { return read(K.pages, {}) || {}; }

  /* ---------- export / import (merge, never overwrite) ---------- */
  function snapshot() {
    return { app: 'psle-science', schema: 2, exportedAt: new Date().toISOString(),
      data: { attempts: attempts(), pages: pages(), theme: getTheme() } };
  }
  function exportData() {
    try {
      var blob = new Blob([JSON.stringify(snapshot(), null, 1)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'psle-science-progress-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
      toast('Progress exported. Keep the file somewhere safe.');
    } catch (e) { toast('Export did not work in this browser.'); }
  }
  function merge(data) {
    var cur = attempts(), seen = {}, added = 0;
    cur.forEach(function (r) { seen[r.q + '|' + r.at + '|' + r.mode] = 1; });
    (data.attempts || []).forEach(function (r) {
      if (!r || !r.q || !r.at) return;
      var k = r.q + '|' + r.at + '|' + r.mode;
      if (!seen[k]) { seen[k] = 1; cur.push(r); added++; }
    });
    cur.sort(byTime);
    if (cur.length > MAX_ATTEMPTS) cur.splice(0, cur.length - MAX_ATTEMPTS);
    write(K.attempts, cur);
    var p = pages(), q = data.pages || {};
    Object.keys(q).forEach(function (id) {
      var x = p[id], y = q[id]; if (!y) return;
      if (!x) { p[id] = y; return; }
      p[id] = { v: (x.v && y.v) ? (x.v < y.v ? x.v : y.v) : (x.v || y.v), last: (x.last && y.last) ? (x.last > y.last ? x.last : y.last) : (x.last || y.last) };
    });
    write(K.pages, p);
    ensureMeta();
    return added;
  }
  function importFile(file, done) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var j = JSON.parse(r.result);
        if (j.app !== 'psle-science' || !j.data) throw new Error('not ours');
        var n = merge(j.data);
        toast(n ? n + ' answer' + (n > 1 ? 's' : '') + ' added from the file.' : 'Nothing new in that file.');
        fire(); if (done) done(n);
      } catch (e) { toast('That file is not a progress export from this site.'); }
    };
    r.readAsText(file);
  }

  /* ---------- toast ---------- */
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  /* ---------- header tools ---------- */
  function wireTools() {
    document.addEventListener('click', function (e) {
      var tb = e.target.closest ? e.target.closest('[data-set-theme]') : null;
      if (tb) { setTheme(tb.getAttribute('data-set-theme')); var d = tb.closest('details'); if (d) d.removeAttribute('open'); return; }
      var ps = e.target.closest ? e.target.closest('[data-ps]') : null;
      if (ps) {
        var act = ps.getAttribute('data-ps');
        if (act === 'export') exportData();
        else if (act === 'import') { var f = $('input[data-ps="file"]'); if (f) f.click(); }
      }
      $$('details.look[open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
    });
    var fi = $('input[data-ps="file"]');
    if (fi) fi.addEventListener('change', function () { var f = fi.files && fi.files[0]; if (f) importFile(f); fi.value = ''; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') $$('details.look[open]').forEach(function (d) { d.removeAttribute('open'); });
    });
    var lo = $('.ph-lo');
    if (lo && window.matchMedia && matchMedia('(max-width: 640px)').matches) lo.removeAttribute('open');
  }

  /* ---------- recap banner on content pages ---------- */
  function pageTags() {
    var set = {};
    (DATA.questions || []).forEach(function (q) { (q.options || []).forEach(function (o) { if (o.mis) set[o.mis] = 1; }); });
    return set;
  }
  function paintBanner() {
    var host = $('#psle-banner'); if (!host || !DATA.page) return;
    var mine = pageTags(), due = dueTags().filter(function (s) { return mine[s.id]; });
    host.innerHTML = due.length
      ? '<div class="banner" role="status"><span><b>Recap due:</b> ' + due.length + ' idea' + (due.length > 1 ? 's' : '') +
        ' from this page ' + (due.length > 1 ? 'are' : 'is') + ' waiting for a recap question today.</span>' +
        '<a class="btn small primary" href="' + esc(DATA.hub || '../index.html') + '#recap">Open recap</a></div>'
      : '';
  }

  /* ---------- unit pages: "Go deeper" list of the topic's focus pages ---------- */
  function paintDeeper() {
    var host = $('#psle-deeper'); if (!host || !DATA.deeper) return;
    if (!DATA.deeper.length) { host.innerHTML = '<p class="empty">No focus pages for this topic yet. They are added when a question shows a specific idea needs more work.</p>'; return; }
    var att = attempts();
    host.innerHTML = '<ul class="dlist">' + DATA.deeper.map(function (d) {
      var right = {}, any = false;
      att.forEach(function (r) { if (r.page === d.id && r.mode === 'page') { any = true; if (r.ok) right[r.q] = 1; } });
      var all = d.qs.length && d.qs.every(function (id) { return right[id]; });
      var badge = all ? '<span class="badge ok">✓ All questions right</span>' : any ? '<span class="badge info">• In progress</span>' : '<span class="badge none">Not started</span>';
      return '<li><a href="' + esc(d.href) + '"><span class="dt"><b>' + esc(d.title) + '</b>' + badge + '</span><span class="df">' + esc(d.fixes) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  /* ---------- public API ---------- */
  window.PSLE = {
    data: DATA, K: K, read: read, write: write,
    $: $, $$: $$, esc: esc, shuffle: shuffle, reduced: reduced,
    today: today, dayOf: dayOf, dayLabel: dayLabel,
    theme: { get: getTheme, set: setTheme, on: onTheme, css: css },
    attempts: attempts, record: record, tagStates: tagStates, dueTags: dueTags,
    pages: pages, visit: visit, onChange: onChange, fire: fire,
    exportData: exportData, importFile: importFile, merge: merge, snapshot: snapshot,
    toast: toast,
    mis: function (id) { return (DATA.mis && DATA.mis[id]) || null; }
  };

  applyTheme(getTheme());
  function boot() { wireTools(); visit(); paintBanner(); paintDeeper(); onChange(paintBanner); onChange(paintDeeper); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
