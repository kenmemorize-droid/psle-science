/* =====================================================================
   PSLE Science engine — the one question component
   PSLE.Q.render(el, q, opts)   one question (page or recap mode)
   PSLE.Q.set(el, qs, opts)     a numbered set with status pills

   Scoring: the FIRST answer is the score and the only one logged.
   Page mode: after a wrong first answer the option is struck out and the
   student keeps going (unscored) until correct; then every option's
   rationale is shown. Recap mode: one answer, then full rationale.

   Optional bench (page interactive that gates the options):
     opts.bench = { init(q) -> state, render(q, state, host, api),
                    done(q, state) -> bool, todo(q, state) -> string,
                    onWrong(q, state, optionIndex), clashes(q, state, i) -> [html] }
   ===================================================================== */
(function () {
  'use strict';
  var P = window.PSLE; if (!P) return;
  var esc = P.esc;

  function num(i) { return '(' + (i + 1) + ')'; }
  function isTable(q) { return q.layout === 'table' && Array.isArray(q.cols) && q.cols.length > 1; }
  function textOf(op) { return Array.isArray(op.text) ? op.text.join(' / ') : op.text; }
  function correctIndex(q) { for (var i = 0; i < q.options.length; i++) if (q.options[i].correct) return i; return -1; }
  function newState() { return { choice: null, missed: [], first: null, solved: false, hints: 0, bench: null }; }

  function render(el, q, o) {
    o = o || {};
    var mode = o.mode === 'recap' ? 'recap' : 'page';
    var st = o.state || newState();
    var bench = (mode === 'page' && o.bench && q.bench) ? o.bench : null;
    if (bench && st.bench == null) st.bench = bench.init ? bench.init(q) : {};
    var ci = correctIndex(q), table = isTable(q), name = 'r-' + q.id.replace(/[^a-z0-9]/gi, '-');

    function locked() { return !st.solved && !!bench && bench.done && !bench.done(q, st.bench); }
    function dis(i) { return locked() || st.solved || st.missed.indexOf(i) >= 0; }
    function chosen(i) { return st.missed.indexOf(i) >= 0 || (i === ci && st.solved && (mode === 'page' || st.first === i)); }
    function clashes(i) {
      var op = q.options[i];
      if (op.clash && op.clash.length) return op.clash;
      if (bench && bench.clashes) return bench.clashes(q, st.bench, i) || [];
      return [];
    }

    var showFig = q.figure && (mode === 'recap' || !bench || q.showFigureOnPage);
    var art = document.createElement('article');
    art.className = 'q';
    art.setAttribute('data-qid', q.id);
    art.innerHTML =
      (o.n ? '<p class="q-n">' + (mode === 'recap' ? 'Recap question ' : 'Question ') + o.n + (o.total ? ' of ' + o.total : '') + '</p>' : '') +
      '<h3>' + (q.title || 'Question') + '</h3>' +
      (bench && q.pageIntro ? '<p class="q-intro">' + q.pageIntro + '</p>' : '') +
      (bench ? '<div class="q-bench"></div>' : '') +
      '<div class="q-stem">' + q.stem + '</div>' +
      (showFig ? '<div class="q-fig">' + q.figure + '</div>' : '') +
      '<div class="q-hints-host"></div>' +
      '<div class="q-opts"></div>' +
      '<div class="q-fb" aria-live="polite"></div>';
    el.innerHTML = '';
    el.appendChild(art);

    var api = { update: function () { paintOpts(); }, refresh: function () { if (bench) bench.render(q, st.bench, art.querySelector('.q-bench'), api); paintOpts(); } };

    function optsHTML() {
      var h;
      if (table) {
        h = '<div class="scroll"><table class="exam"><thead><tr><th scope="col"><span class="vh">Option</span></th>' +
          q.cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          q.options.map(function (op, i) {
            var m = st.missed.indexOf(i) >= 0, r = st.solved && i === ci, d = dis(i);
            return '<tr class="o' + (m ? ' missed' : '') + (r ? ' right' : '') + (d ? ' locked' : '') + '" data-i="' + i + '" aria-checked="' + (st.choice === i) + '">' +
              '<td><input type="radio" name="' + name + '" id="' + name + '-' + i + '" value="' + i + '"' + (st.choice === i || r ? ' checked' : '') + (d ? ' disabled' : '') + '> ' +
              '<label for="' + name + '-' + i + '">' + num(i) + '</label>' +
              (m ? '<br><small>✗ not this one</small>' : '') + (r ? '<br><small>✓ answer</small>' : '') + '</td>' +
              op.text.map(function (t) { return '<td>' + t + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>';
      } else {
        h = '<div class="opts" role="radiogroup" aria-label="Answer options">' +
          q.options.map(function (op, i) {
            var m = st.missed.indexOf(i) >= 0, r = st.solved && i === ci;
            return '<button type="button" class="opt' + (m ? ' missed' : '') + (r ? ' right' : '') + '" role="radio" aria-checked="' + (st.choice === i) + '" data-i="' + i + '"' + (dis(i) ? ' disabled' : '') + '>' +
              '<span class="on">' + num(i) + '</span><span class="ot">' + textOf(op) + '</span>' +
              '<span class="mk">' + (m ? '✗ not this one' : r ? '✓ answer' : '') + '</span></button>';
          }).join('') + '</div>';
      }
      if (locked()) h += '<p class="q-lock"><b>Locked.</b> ' + esc(bench.lockMsg || 'Finish the bench to unlock the options.') +
        (bench.todo ? ' Still to do: ' + esc(bench.todo(q, st.bench)) + '.' : '') + '</p>';
      if (!st.solved) h += '<div class="actions"><button type="button" class="btn primary" data-qa="check"' + (st.choice == null || locked() ? ' disabled' : '') + '>Check answer</button></div>';
      return h;
    }

    function hintsHTML() {
      if (mode !== 'page' || st.solved || !q.hints || !q.hints.length) return '';
      return '<div class="box q-hints"><p class="box-h">Hints</p>' +
        (st.hints ? '<ol>' + q.hints.slice(0, st.hints).map(function (h) { return '<li>' + h + '</li>'; }).join('') + '</ol>' : '') +
        (st.hints < q.hints.length ? '<button type="button" class="btn small" data-qa="hint">Show hint ' + (st.hints + 1) + ' of ' + q.hints.length + '</button>' : '<p class="empty">No more hints.</p>') +
        '</div>';
    }

    function cardsHTML() {
      return q.options.map(function (op, i) {
        var right = i === ci, mis = op.mis ? P.mis(op.mis) : null, cl = right ? [] : clashes(i);
        var what = table
          ? op.text.map(function (t, k) { return '<span class="tagchip">' + esc(q.cols[k]) + ': ' + t + '</span>'; }).join('')
          : '<span class="tagchip">' + textOf(op) + '</span>';
        return '<div class="optcard' + (right ? ' right' : '') + '"><div class="who"><b>' + (right ? '✓ ' : '✗ ') + 'Option ' + num(i) + '</b>' + what +
          (chosen(i) ? '<span class="you">you chose this</span>' : '') + '</div>' +
          '<p><span class="lbl-t">' + (right ? 'How to reach it. ' : 'Why someone would choose it. ') + '</span>' + op.pick + '</p>' +
          '<p><span class="lbl-t">' + (right ? 'Why it is correct. ' : 'Why it is not correct. ') + '</span>' + op.why + '</p>' +
          (cl.length ? '<ul class="clash">' + cl.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' : '') +
          (mis ? '<p class="misline">The idea behind this option: ' + esc(mis.label) + '</p>' : '') + '</div>';
      }).join('');
    }

    function fbHTML() {
      var c = q.options[ci];
      var after = o.after ? '<div class="actions">' + o.after(st) + '</div>' : '';
      var key = q.key ? '<p class="key"><b>Key idea.</b> ' + q.key + '</p>' : '';
      if (st.solved) {
        var ok = st.first === ci, head, lead = '';
        if (mode === 'recap') {
          head = ok ? '<h4>✓ Correct: option ' + num(ci) + '</h4>' : '<h4>✗ Not this time. The answer is option ' + num(ci) + '</h4>';
          if (o.recapNote) lead = '<p>' + o.recapNote(ok) + '</p>';
        } else {
          head = '<h4>✓ Correct: option ' + num(ci) + '</h4>';
          if (ok) lead = '<p><b>Right first time.</b></p>';
          else {
            var fm = P.mis(q.options[st.first].mis);
            lead = '<p><b>Your first answer was ' + num(st.first) + ', so it counts as a miss.</b>' +
              (fm ? ' The idea behind it, <i>' + esc(fm.label.charAt(0).toLowerCase() + fm.label.slice(1)) + '</i>, goes into your recap queue. Tomorrow you will get a different question on it.' : '') + '</p>';
          }
        }
        return '<div class="fb ' + (ok || mode === 'page' ? 'good' : 'bad') + '">' + head + lead + '<p>' + c.why + '</p>' + key +
          '<h5>Every option, and why it works or does not</h5>' + cardsHTML() + after + '</div>';
      }
      if (st.missed.length) {
        var m = st.missed[st.missed.length - 1], op = q.options[m], cl = clashes(m), left = q.options.length - st.missed.length;
        return '<div class="fb bad"><h4>✗ Not option ' + num(m) + '</h4>' +
          '<p><b>Why it looks right.</b> ' + op.pick + '</p><p><b>Why it is not correct.</b> ' + op.why + '</p>' +
          (cl.length ? '<p><b>Check it against your results.</b></p><ul class="clash">' + cl.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') +
          '<p>' + (left > 1 ? 'Pick another option. ' + left + ' left.' : 'One option left.') + '</p></div>';
      }
      return '';
    }

    function paintOpts() { art.querySelector('.q-opts').innerHTML = optsHTML(); }
    function paintHints() { art.querySelector('.q-hints-host').innerHTML = hintsHTML(); }
    function paint() { paintOpts(); paintHints(); art.querySelector('.q-fb').innerHTML = fbHTML(); }

    function select(i) {
      if (dis(i)) return;
      st.choice = i;
      paintOpts();
      var b = art.querySelector('[data-qa="check"]'); if (b) b.disabled = false;
    }
    function check() {
      if (st.choice == null || locked()) return;
      var i = st.choice, op = q.options[i], ok = !!op.correct;
      if (st.first === null) {
        st.first = i;
        P.record({ q: q.id, page: o.page || q.page, choice: i, ok: ok, mode: mode, mis: op.mis, for: o.recapFor });
        if (o.onFirst) o.onFirst(ok, i, st);
      }
      if (mode === 'recap') { st.solved = true; if (!ok) st.missed.push(i); }
      else if (ok) st.solved = true;
      else { st.missed.push(i); st.choice = null; if (bench && bench.onWrong) bench.onWrong(q, st.bench, i); }
      if (bench) { st.bench.solved = st.solved; bench.render(q, st.bench, art.querySelector('.q-bench'), api); }
      paint();
      var fb = art.querySelector('.q-fb');
      if (fb && fb.scrollIntoView) fb.scrollIntoView({ behavior: P.reduced ? 'auto' : 'smooth', block: 'nearest' });
      if (st.solved && o.onSolved) o.onSolved(st);
    }

    art.addEventListener('click', function (e) {
      var a = e.target.closest('[data-qa]');
      if (a && art.contains(a)) {
        var n = a.getAttribute('data-qa');
        if (n === 'check') check();
        else if (n === 'hint') { st.hints++; paintHints(); }
        else if (o.onAction) o.onAction(n, a, st);
        return;
      }
      var b = e.target.closest('.opt[data-i], tr.o[data-i]');
      if (b && art.contains(b)) select(+b.getAttribute('data-i'));
    });
    art.addEventListener('change', function (e) {
      if (e.target && e.target.name === name) select(+e.target.value);
    });

    if (bench) bench.render(q, st.bench, art.querySelector('.q-bench'), api);
    paint();
    return { state: st, api: api, el: art };
  }

  function set(el, qs, o) {
    o = o || {};
    var runs = {}, cur = Math.min(o.start || 0, qs.length - 1);
    function status(q) {
      var last = null;
      P.attempts().forEach(function (r) { if (r.q === q.id && r.mode === 'page') last = r; });
      return last ? (last.ok ? 'right' : 'missed') : '';
    }
    function pillsHTML() {
      return qs.map(function (q, i) {
        var s = status(q);
        return '<button type="button" class="qpill' + (s ? ' ' + s : '') + (i === cur ? ' cur' : '') + '" data-go="' + i + '" aria-label="Question ' + (i + 1) +
          (s === 'right' ? ', right first time' : s === 'missed' ? ', missed, in your recap queue' : '') + '"' + (i === cur ? ' aria-current="true"' : '') + '>' +
          (i + 1) + '<i aria-hidden="true">' + (s === 'right' ? '✓' : s === 'missed' ? '↻' : '') + '</i></button>';
      }).join('');
    }
    function paintPills() { var p = el.querySelector('.qpills'); if (p) p.innerHTML = pillsHTML(); }
    function show(scroll) {
      var q = qs[cur];
      if (!runs[q.id]) runs[q.id] = newState();
      el.innerHTML = '<div class="qset"><div class="qpills" role="group" aria-label="Questions">' + pillsHTML() + '</div>' +
        '<p class="qlegend">✓ right first time · ↻ missed, so it is in your recap queue. Only your first answer counts.</p><div class="qhost"></div></div>';
      var opts = {};
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) opts[k] = o[k];
      opts.state = runs[q.id]; opts.n = cur + 1; opts.total = qs.length;
      opts.onFirst = function () { paintPills(); };
      opts.after = function () {
        return (cur < qs.length - 1 ? '<button type="button" class="btn primary" data-qa="next">Next question →</button>' : '<span class="muted">That was the last question in this set.</span>') +
          '<button type="button" class="btn" data-qa="redo">Try this question again</button>';
      };
      opts.onAction = function (n) {
        if (n === 'next') { cur = Math.min(cur + 1, qs.length - 1); show(true); }
        else if (n === 'redo') { delete runs[q.id]; show(true); }
        else if (o.onAction) o.onAction(n);
      };
      render(el.querySelector('.qhost'), q, opts);
      if (scroll && el.scrollIntoView) el.scrollIntoView({ behavior: P.reduced ? 'auto' : 'smooth', block: 'start' });
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go]');
      if (b && el.contains(b)) { cur = +b.getAttribute('data-go'); show(false); }
    });
    show(false);
    return { go: function (i) { cur = i; show(true); } };
  }

  P.Q = { render: render, set: set, newState: newState };
})();
