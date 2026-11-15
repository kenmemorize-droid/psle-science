/* PSLE Science hub: Library · Recap · Mistake book · Report */
(function () {
  'use strict';
  var P = window.PSLE, D = P.data, esc = P.esc, $ = P.$;
  var TABS = [['library', 'Library'], ['recap', 'Recap'], ['mistakes', 'Mistake book'], ['report', 'Report']];
  var view = 'library', level = 'all', session = null;
  var Q = {}, CAT = {}, PAGE_TAGS = {};
  D.questions.forEach(function (q) {
    Q[q.id] = q;
    q.options.forEach(function (o) { if (o.mis) (PAGE_TAGS[q.page] = PAGE_TAGS[q.page] || {})[o.mis] = 1; });
  });
  D.catalogue.forEach(function (c) { CAT[c.id] = c; });

  function learnHref(tag) {
    var l = (D.mis[tag] || {}).learn; if (!l) return null;
    var parts = l.split('#'), c = CAT[parts[0].replace(/\.html$/, '')];
    return c ? c.href + (parts[1] ? '#' + parts[1] : '') : null;
  }
  function lower(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ''; }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function optText(q, i) { var o = q.options[i]; return o ? (Array.isArray(o.text) ? o.text.join(' / ') : o.text) : '?'; }

  /* ---------- tabs ---------- */
  function renderTabs() {
    var due = P.dueTags().length;
    $('#hubTabs').innerHTML = TABS.map(function (t) {
      return '<button type="button" class="htab" role="tab" data-tab="' + t[0] + '" aria-selected="' + (view === t[0]) + '">' + t[1] +
        (t[0] === 'recap' && due ? ' <span class="cnt" aria-label="' + due + ' due">' + due + '</span>' : '') + '</button>';
    }).join('');
  }
  function go(v) { view = v; if (location.hash !== '#' + v) history.replaceState(null, '', '#' + v); renderTabs(); render(); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab]'); if (t) { go(t.getAttribute('data-tab')); return; }
    var l = e.target.closest('[data-level]'); if (l) { level = l.getAttribute('data-level'); render(); return; }
    var a = e.target.closest('[data-hub]'); if (!a) return;
    var act = a.getAttribute('data-hub');
    if (act === 'start') { session = { items: buildSession(), i: 0, results: [] }; renderRecap(); }
    if (act === 'recap') go('recap');
  });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (TABS.some(function (t) { return t[0] === h; })) { view = h; renderTabs(); render(); } });

  function render() {
    var v = $('#hubView');
    if (view === 'recap') renderRecap();
    else if (view === 'mistakes') v.innerHTML = mistakesHTML();
    else if (view === 'report') v.innerHTML = reportHTML();
    else v.innerHTML = libraryHTML();
  }

  /* ---------- page status ---------- */
  function pageStatus(c, att, dueSet, visits) {
    var tags = PAGE_TAGS[c.id] || {};
    if (Object.keys(tags).some(function (t) { return dueSet[t]; })) return 'recap';
    var right = {}, any = false;
    att.forEach(function (r) { if (r.page === c.id && r.mode === 'page') { any = true; if (r.ok) right[r.q] = 1; } });
    if (c.qs.length && c.qs.every(function (id) { return right[id]; })) return 'done';
    if (any || visits[c.id]) return 'started';
    return 'new';
  }
  var BADGE = { new: '<span class="badge none">Not started</span>', started: '<span class="badge info">• In progress</span>',
    done: '<span class="badge ok">✓ All questions right</span>', recap: '<span class="badge due">↻ Recap due</span>' };

  /* ---------- library ---------- */
  function libraryHTML() {
    var att = P.attempts(), S = P.tagStates(att), due = P.dueTags(S), dueSet = {}, visits = P.pages();
    due.forEach(function (s) { dueSet[s.id] = 1; });
    var active = Object.keys(S).filter(function (k) { return S[k].active; }).length;
    var head = '<section class="card"><div class="hub-stats">' +
      '<div class="stat"><b>' + due.length + '</b>recap question' + (due.length === 1 ? '' : 's') + ' due today</div>' +
      '<div class="stat"><b>' + active + '</b>idea' + (active === 1 ? '' : 's') + ' in the mistake book</div>' +
      '<div class="stat"><b>' + D.catalogue.length + '</b>interactive page' + (D.catalogue.length === 1 ? '' : 's') + '</div></div>' +
      (due.length ? '<div class="actions"><button type="button" class="btn primary" data-hub="recap">Start today\'s recap</button></div>' : '') + '</section>';
    var lv = '<div class="lvl" role="group" aria-label="Filter by level">' + ['all', 'P3', 'P4', 'P5', 'P6'].map(function (l) {
      return '<button type="button" class="btn small" data-level="' + l + '" aria-pressed="' + (level === l) + '">' + (l === 'all' ? 'All levels' : l) + '</button>';
    }).join('') + '</div>';
    var themes = Object.keys(D.themes).sort(function (a, b) { return D.themes[a].order - D.themes[b].order; });
    var body = themes.map(function (th) {
      var topics = Object.keys(D.topics).filter(function (k) { return D.topics[k].theme === th && (level === 'all' || D.topics[k].level === level); })
        .sort(function (a, b) { return D.topics[a].level.localeCompare(D.topics[b].level) || D.topics[a].order - D.topics[b].order; });
      if (!topics.length) return '';
      return '<section class="card"><div class="theme-h"><h2>' + esc(D.themes[th].name) + '</h2></div>' + topics.map(function (code) {
        var t = D.topics[code], pages = D.catalogue.filter(function (c) { return c.topic === code; })
          .sort(function (a, b) { return (b.type === 'unit') - (a.type === 'unit') || a.order - b.order; });
        var unit = pages.filter(function (c) { return c.type === 'unit'; })[0];
        var leg = (D.legacy.topics[code] || []);
        return '<div class="topic"><div class="topic-h"><span class="badge info">' + t.level + '</span><h3>' + esc(t.short) + '</h3></div>' +
          '<p class="small muted" style="margin:0 0 6px">' + esc(t.name) + '</p>' +
          (pages.length ? '<ul class="plist">' + pages.map(function (c) {
            var s = pageStatus(c, att, dueSet, visits);
            return '<li><a class="pitem' + (c.type === 'unit' ? ' unit' : '') + '" href="' + esc(c.href) + '"><span class="pt"><b>' + (c.type === 'unit' ? 'Unit: ' : '') + esc(c.title) + '</b>' + BADGE[s] + '</span>' +
              '<span class="pf2 small" style="display:block">' + esc(c.fixes) + '</span>' +
              '<span class="chips">' + c.lo.map(function (id) { return '<span class="chip">' + esc(id) + '</span>'; }).join('') +
              '<span class="chip">' + (c.updated !== c.built ? 'updated ' + esc(c.updated) : 'built ' + esc(c.built)) + '</span></span></a></li>';
          }).join('') + '</ul>' : '') +
          (!unit ? '<p class="legacy">Unit page not built yet.' + (leg.length ? ' Old-format sketchnotes: ' + leg.map(function (m) {
            return '<a href="' + esc(D.legacy.file) + '#' + esc(m[0]) + '">' + esc(m[1]) + '</a>';
          }).join(' · ') : '') + '</p>' : '') + '</div>';
      }).join('') + '</section>';
    }).join('');
    return head + lv + (body || '<p class="empty">No topics at this level.</p>');
  }

  /* ---------- recap ---------- */
  function buildSession() {
    var att = P.attempts(), S = P.tagStates(att), due = P.dueTags(S).slice(0, 10), last = {}, used = {};
    att.forEach(function (r) { last[r.q] = r.at; });
    return due.map(function (s) {
      var c = D.questions.filter(function (q) { return !used[q.id] && q.options.some(function (o) { return o.mis === s.id; }); });
      if (!c.length) return null;
      var now = Date.now();
      function key(q) {
        var l = last[q.id]; if (!l) return [0, q.pool === 'recap' ? 0 : 1, Math.random()];
        var age = (now - Date.parse(l)) / 864e5; return [age >= 7 ? 1 : 2, -age, 0];
      }
      c.sort(function (a, b) { var x = key(a), y = key(b); for (var i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; });
      var q = c[0], reused = !!(last[q.id] && (now - Date.parse(last[q.id])) / 864e5 < 7);
      used[q.id] = 1;
      if (last[q.id]) q = Object.assign({}, q, { options: P.shuffle(q.options) });
      return { tag: s.id, step: s.step, q: q, reused: reused };
    }).filter(Boolean);
  }
  function renderRecap() {
    var v = $('#hubView');
    if (session && session.i < session.items.length) {
      var it = session.items[session.i], m = D.mis[it.tag] || {};
      v.innerHTML = '<section class="card"><div id="rqHost"></div></section>';
      P.Q.render($('#rqHost'), it.q, {
        mode: 'recap', recapFor: it.tag, page: it.q.page, n: session.i + 1, total: session.items.length,
        recapNote: function (ok) {
          var next = ok ? (it.step >= 2 ? 'That was the last check: this idea is now cleared from your mistake book.' :
            'Next check on this idea in ' + (it.step === 0 ? 3 : 7) + ' days, with a different question.') :
            'This idea comes back tomorrow with a different question.';
          return '<b>This question checked the idea:</b> ' + esc(lower(m.label)) + '. ' + esc(m.fix) + ' <br><span class="muted">' + next + '</span>';
        },
        onFirst: function (ok) { session.results.push({ tag: it.tag, ok: ok, title: it.q.title }); },
        after: function () {
          var h = learnHref(it.tag);
          return '<button type="button" class="btn primary" data-qa="next">' + (session.i < session.items.length - 1 ? 'Next recap question →' : 'Finish') + '</button>' +
            (h ? '<a class="btn" href="' + esc(h) + '">Re-learn this idea</a>' : '');
        },
        onAction: function (n) { if (n === 'next') { session.i++; renderRecap(); window.scrollTo(0, 0); } }
      });
      return;
    }
    if (session && session.results.length) {
      var S = P.tagStates();
      v.innerHTML = '<section class="card"><h2>Recap done</h2><p>' + session.results.filter(function (r) { return r.ok; }).length + ' of ' + session.results.length + ' right.</p><ul class="rq-summary">' +
        session.results.map(function (r) {
          var s = S[r.tag] || {}, m = D.mis[r.tag] || {};
          var when = s.active ? 'next check ' + P.dayLabel(s.due) : '✓ cleared';
          return '<li>' + (r.ok ? '✓ ' : '✗ ') + '<b>' + esc(m.label) + '</b>: ' + esc(when) + '</li>';
        }).join('') + '</ul><div class="actions"><button type="button" class="btn" data-tab="mistakes">Open the mistake book</button><button type="button" class="btn" data-tab="library">Back to the library</button></div></section>';
      session = null; renderTabs(); return;
    }
    session = null;
    var S2 = P.tagStates(), due = P.dueTags(S2), act = Object.keys(S2).map(function (k) { return S2[k]; }).filter(function (s) { return s.active; });
    if (due.length) {
      var n = Math.min(due.length, 10);
      v.innerHTML = '<section class="card"><h2>Today\'s recap</h2><p>' + plural(n, 'question') + ' today, one for each idea that is due. Each one is a <b>different</b> question from the one you missed, so you cannot just remember the answer.</p>' +
        (due.length > 10 ? '<p class="muted">' + (due.length - 10) + ' more ideas are due. They wait until tomorrow so today stays short.</p>' : '') +
        '<div class="actions"><button type="button" class="btn primary" data-hub="start">Start recap</button></div></section>';
    } else if (act.length) {
      var nextDue = act.map(function (s) { return s.due; }).sort(function (a, b) { return a - b; })[0];
      v.innerHTML = '<section class="card"><h2>Nothing due today</h2><p>' + plural(act.length, 'idea') + ' ' + (act.length === 1 ? 'is' : 'are') + ' in your mistake book. The next recap is <b>' + esc(P.dayLabel(nextDue)) + '</b>.</p>' +
        '<div class="actions"><button type="button" class="btn" data-tab="mistakes">See the mistake book</button></div></section>';
    } else {
      v.innerHTML = '<section class="card"><h2>Nothing to recap yet</h2><p>When your first answer to a question is wrong, the idea behind that answer is saved here. The next day you get a different question on the same idea, then again 3 days later and 7 days later. Three right in a row clears it.</p></section>';
    }
  }

  /* ---------- mistake book ---------- */
  function mistakesHTML() {
    var S = P.tagStates(), t = P.today();
    var list = Object.keys(S).map(function (k) { return S[k]; }).filter(function (s) { return s.misses.length; });
    var active = list.filter(function (s) { return s.active; }).sort(function (a, b) { return a.due - b.due; });
    var cleared = list.filter(function (s) { return !s.active; });
    var dueN = active.filter(function (s) { return s.due <= t; }).length;
    var wrong = list.reduce(function (n, s) { return n + s.misses.length; }, 0);
    function card(s) {
      var m = D.mis[s.id] || { label: s.id, fix: '' }, h = learnHref(s.id);
      var status = s.active
        ? '<span class="steps" aria-hidden="true">' + [0, 1, 2].map(function (i) { return '<i class="' + (i < s.step ? 'on' : '') + '"></i>'; }).join('') + '</span> ' +
          s.step + ' of 3 recaps done · ' + (s.due <= t ? '<b>due now</b>' : 'next: ' + esc(P.dayLabel(s.due)))
        : '<span class="badge ok">✓ Cleared ' + esc(new Date(s.cleared).toLocaleDateString()) + '</span>';
      var seen = {};
      var misses = s.misses.slice().reverse().filter(function (r) { if (seen[r.q]) return false; seen[r.q] = 1; return true; }).slice(0, 6).map(function (r) {
        var q = Q[r.q]; if (!q) return '';
        var c = CAT[q.page];
        return '<li>' + esc(q.title) + ': you chose (' + (r.choice + 1) + ') <i>' + optText(q, r.choice) + '</i>' + (r.mode === 'recap' ? ' (recap)' : '') +
          (c ? ' · <a href="' + esc(c.href) + '">' + esc(c.title) + '</a>' : '') + '</li>';
      }).join('');
      return '<div class="mist"><h3>' + esc(m.label) + '</h3><p class="small">' + status + '</p><p class="fix"><b>Fix:</b> ' + esc(m.fix) + '</p>' +
        '<ul>' + misses + '</ul>' + (h ? '<div class="actions"><a class="btn small" href="' + esc(h) + '">Re-learn this idea</a></div>' : '') + '</div>';
    }
    return '<section class="card"><h2>Mistake book</h2><div class="hub-stats">' +
      '<div class="stat"><b>' + active.length + '</b>ideas to fix</div><div class="stat"><b>' + dueN + '</b>due now</div>' +
      '<div class="stat"><b>' + cleared.length + '</b>cleared</div><div class="stat"><b>' + wrong + '</b>wrong answers logged</div></div>' +
      (dueN ? '<div class="actions"><button type="button" class="btn primary" data-hub="recap">Start today\'s recap</button></div>' : '') + '</section>' +
      '<section class="card"><h2>Ideas to fix</h2>' + (active.length ? active.map(card).join('') : '<p class="empty">Nothing here. Wrong first answers appear here, grouped by the idea behind them.</p>') + '</section>' +
      (cleared.length ? '<section class="card"><h2>Cleared</h2>' + cleared.map(card).join('') + '</section>' : '');
  }

  /* ---------- report (for the adult) ---------- */
  function reportHTML() {
    var att = P.attempts(), first = {};
    att.forEach(function (r) { if (r.mode === 'page' && !first[r.q]) first[r.q] = r; });
    var byTopic = {}, byLo = {};
    Object.keys(first).forEach(function (id) {
      var q = Q[id]; if (!q) return; var c = CAT[q.page]; if (!c) return;
      var t = byTopic[c.topic] = byTopic[c.topic] || { n: 0, ok: 0 }; t.n++; if (first[id].ok) t.ok++;
      q.lo.forEach(function (lo) { var x = byLo[lo] = byLo[lo] || { n: 0, ok: 0 }; x.n++; if (first[id].ok) x.ok++; });
    });
    function meter(x) { var p = Math.round(100 * x.ok / x.n); return '<span class="meter" aria-hidden="true"><span style="width:' + p + '%"></span></span>' + x.ok + ' of ' + x.n + ' (' + p + '%)'; }
    var topics = Object.keys(byTopic).sort();
    var los = Object.keys(byLo).sort();
    var S = P.tagStates(att), tags = Object.keys(S).map(function (k) { return S[k]; }).filter(function (s) { return s.misses.length; });
    var days = [], t = P.today(), counts = {};
    att.forEach(function (r) { var d = P.dayOf(r.at); counts[d] = (counts[d] || 0) + 1; });
    for (var d = t - 29; d <= t; d++) days.push(counts[d] || 0);
    var mx = Math.max.apply(null, days.concat([1]));
    var loText = {}; Object.keys(D.topics).forEach(function (k) { D.topics[k].los.forEach(function (l) { loText[l.id] = l.text; }); });
    return '<section class="card"><h2>Report</h2><p class="lead">First-try accuracy uses only the first time each question was ever answered on its page. Recap answers are not counted here.</p>' +
      (topics.length ? '<div class="scroll"><table class="rep"><thead><tr><th>Topic</th><th>Right first time</th></tr></thead><tbody>' +
        topics.map(function (k) { return '<tr><td>' + esc(D.topics[k].level + ' ' + D.topics[k].short) + '</td><td>' + meter(byTopic[k]) + '</td></tr>'; }).join('') + '</tbody></table></div>'
        : '<p class="empty">No questions answered yet.</p>') + '</section>' +
      (los.length ? '<section class="card"><h2>By learning outcome</h2><div class="scroll"><table class="rep"><thead><tr><th>LO</th><th>Right first time</th></tr></thead><tbody>' +
        los.map(function (id) { return '<tr><td><b>' + esc(id) + '</b><br><span class="small muted">' + esc(loText[id] || '') + '</span></td><td>' + meter(byLo[id]) + '</td></tr>'; }).join('') + '</tbody></table></div></section>' : '') +
      '<section class="card"><h2>Ideas</h2><div class="hub-stats"><div class="stat"><b>' + tags.filter(function (s) { return s.active; }).length + '</b>active</div>' +
      '<div class="stat"><b>' + tags.filter(function (s) { return !s.active; }).length + '</b>cleared</div><div class="stat"><b>' + att.filter(function (r) { return r.mode === 'recap'; }).length + '</b>recap answers</div></div>' +
      '<h3>Activity, last 30 days</h3><div class="days" role="img" aria-label="Answers per day over the last 30 days">' + days.map(function (n) {
        return '<span class="' + (n ? '' : 'zero') + '" style="height:' + Math.max(3, Math.round(80 * n / mx)) + 'px" title="' + n + '"></span>';
      }).join('') + '</div><p class="small muted">' + days.reduce(function (a, b) { return a + b; }, 0) + ' answers in 30 days · ' + days.filter(Boolean).length + ' active days</p>' +
      (D.needVariants.length ? '<h3>Ideas that still need more recap questions</h3><p class="small muted">Recap reuses older questions for these until more are written.</p><ul class="small">' +
        D.needVariants.map(function (id) { return '<li><b>' + esc(id) + '</b> ' + esc((D.mis[id] || {}).label || '') + '</li>'; }).join('') + '</ul>' : '') + '</section>';
  }

  /* ---------- boot ---------- */
  var h0 = location.hash.slice(1);
  if (TABS.some(function (t) { return t[0] === h0; })) view = h0;
  renderTabs(); render();
  P.onChange(function () { renderTabs(); if (view !== 'recap') render(); });
})();
