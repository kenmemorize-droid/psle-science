/* Four magnets and the compass at A: chain labeller with joint checks, step-through answer,
   beside-or-past-the-end compass explorer, questions. */
(function () {
  'use strict';
  var P = window.PSLE;
  var NS = 'http://www.w3.org/2000/svg';

  /* SVG helpers: colours given as var(--token) are applied as styles so they follow the palette. */
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name), st = '';
    for (var k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null) continue;
      var v = String(attrs[k]);
      if ((k === 'fill' || k === 'stroke' || k === 'font-family') && v.indexOf('var(') === 0) st += k + ':' + v + ';';
      else n.setAttribute(k, v);
    }
    if (st) n.setAttribute('style', st + (n.getAttribute('style') || ''));
    if (parent) parent.appendChild(n);
    return n;
  }
  function txt(parent, x, y, s, attrs) {
    var a = { x: x, y: y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': 'var(--f-label)', 'font-size': 15, fill: 'var(--ink)' };
    for (var k in (attrs || {})) a[k] = attrs[k];
    var t = el('text', a, parent); t.textContent = s; return t;
  }
  function compass(parent, cx, cy, r, dashed) {
    var g = el('g', {}, parent);
    el('circle', { cx: cx, cy: cy, r: r, fill: 'var(--card)', stroke: 'var(--stroke)', 'stroke-width': 2, 'stroke-dasharray': dashed ? '6 6' : null }, g);
    var ng = el('g', {}, g), k = r * 0.78, w = r * 0.26;
    el('polygon', { points: cx + ',' + (cy - k) + ' ' + (cx - w) + ',' + cy + ' ' + (cx + w) + ',' + cy, fill: 'var(--npole)', stroke: 'var(--stroke)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, ng);
    el('polygon', { points: cx + ',' + (cy + k) + ' ' + (cx - w) + ',' + cy + ' ' + (cx + w) + ',' + cy, fill: 'var(--needle-s)', stroke: 'var(--stroke)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, ng);
    var q = txt(g, cx, cy + 1, '?', { 'font-size': 24, 'font-weight': '700', fill: 'var(--muted)' });
    function point(deg) { ng.setAttribute('transform', 'rotate(' + deg + ' ' + cx + ' ' + cy + ')'); }
    function show(on) { ng.setAttribute('opacity', on ? '1' : '0'); q.setAttribute('opacity', on ? '0' : '1'); }
    return { g: g, point: point, show: show };
  }
  function opp(p) { return p === 'N' ? 'S' : 'N'; }
  function dirWord(deg) { return { 0: 'up', 90: 'right', 180: 'down', 270: 'left' }[deg]; }

  /* ---------- the four answer choices (exam numbering) ---------- */
  (function () {
    var svg = document.getElementById('optSvg'); if (!svg) return;
    [{ n: '(1)', deg: 90, d: 'N end right' }, { n: '(2)', deg: 0, d: 'N end up' }, { n: '(3)', deg: 180, d: 'N end down' }, { n: '(4)', deg: 270, d: 'N end left' }].forEach(function (o, i) {
      var x = 100 + i * 160;
      txt(svg, x, 22, o.n, { 'font-size': 20, 'font-weight': '700' });
      var c = compass(svg, x, 86, 36); c.point(o.deg); c.show(true);
      txt(svg, x, 150, o.d, { 'font-size': 18, fill: 'var(--muted)' });
    });
  })();

  /* ---------- 1. label the four magnets ---------- */
  (function () {
    var svg = document.getElementById('chainSvg'); if (!svg) return;
    /* a = top end (vertical) or left end (magnet 3) */
    var M = [
      { x: 150, y: 30, w: 62, h: 200, v: true, name: 'Magnet 1', a: 'top', b: 'bottom' },
      { x: 212, y: 30, w: 62, h: 200, v: true, name: 'Magnet 2', a: 'top', b: 'bottom' },
      { x: 274, y: 30, w: 208, h: 62, v: false, name: 'Magnet 3 (across the top)', a: 'left', b: 'right' },
      { x: 420, y: 92, w: 62, h: 200, v: true, name: 'Magnet 4 (beside A)', a: 'top', b: 'bottom' }
    ];
    var o = [null, null, null, null], PAPER = ['N', 'S', 'N', 'S'];
    var tags = [];
    M.forEach(function (m, i) {
      var g = el('g', { style: 'cursor:pointer', role: 'button', tabindex: '0', 'aria-label': m.name + ': tap to turn it round' }, svg);
      el('rect', { x: m.x, y: m.y, width: m.w, height: m.h, fill: 'var(--card)', stroke: 'var(--stroke)', 'stroke-width': 2 }, g);
      var pa = m.v ? [m.x + m.w / 2, m.y + 38] : [m.x + 40, m.y + m.h / 2];
      var pb = m.v ? [m.x + m.w / 2, m.y + m.h - 38] : [m.x + m.w - 40, m.y + m.h / 2];
      var mid = [m.x + m.w / 2, m.y + m.h / 2];
      txt(g, mid[0], mid[1], String(i + 1), { 'font-size': 15, fill: 'var(--muted)' });
      tags.push([tag(g, pa), tag(g, pb)]);
      g.addEventListener('click', function () { turn(i); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); turn(i); } });
    });
    function tag(g, p) {
      var t = el('g', {}, g);
      var c = el('circle', { cx: p[0], cy: p[1], r: 16, stroke: 'var(--stroke)', 'stroke-width': 2 }, t);
      var s = txt(t, p[0], p[1] + 1, '?', { 'font-size': 16, 'font-weight': '700' });
      return { c: c, s: s };
    }
    txt(svg, 181, 250, 'R', { 'font-size': 18, 'font-weight': '700' });
    el('line', { x1: 181, y1: 238, x2: 181, y2: 232, stroke: 'var(--stroke)', 'stroke-width': 2 }, svg);
    var cR = compass(svg, 82, 190, 34); cR.point(180); cR.show(true);
    txt(svg, 82, 140, 'given', { 'font-size': 16, fill: 'var(--muted)' });
    var cA = compass(svg, 548, 252, 36, true);
    txt(svg, 548, 200, 'A', { 'font-size': 18, 'font-weight': '700' });
    var J = [{ p: [212, 130] }, { p: [274, 61] }, { p: [451, 92] }];
    J.forEach(function (j) {
      j.g = el('g', { opacity: 0 }, svg);
      j.c = el('circle', { cx: j.p[0], cy: j.p[1], r: 14, stroke: 'var(--stroke)', 'stroke-width': 2 }, j.g);
      j.t = txt(j.g, j.p[0], j.p[1] + 1, '', { 'font-size': 15, 'font-weight': '700', fill: '#fff' });
    });
    var ring = el('circle', { cx: 0, cy: 0, r: 42, fill: 'none', stroke: 'var(--hl)', 'stroke-width': 4, opacity: 0 }, svg);

    /* segmented controls */
    var segs = document.getElementById('segs'), segBtns = [];
    M.forEach(function (m, i) {
      var wrap = document.createElement('div');
      wrap.innerHTML = '<h3>' + m.name + '</h3>';
      var row = document.createElement('div'); row.className = 'seg'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', m.name);
      var bs = ['N', 'S'].map(function (p) {
        var b = document.createElement('button'); b.type = 'button';
        b.textContent = p + ' at ' + m.a + ', ' + opp(p) + ' at ' + m.b;
        b.addEventListener('click', function () { o[i] = p; paint(); });
        row.appendChild(b); return b;
      });
      segBtns.push(bs); wrap.appendChild(row); segs.appendChild(wrap);
    });

    function turn(i) { o[i] = o[i] === 'N' ? 'S' : 'N'; paint(); }
    function poleAt(i, end) { return o[i] == null ? null : (end === 'a' ? o[i] : opp(o[i])); }
    function checks() {
      var r = [];
      var rb = poleAt(0, 'b');
      r.push({ ok: rb == null ? null : rb === 'S', text: 'The compass at R',
        say: rb == null ? 'Label magnet 1 first.' : (rb === 'S' ? 'R is S. The needle’s N end points down along magnet 1, towards its S end.' : 'R is N, but then the needle’s N end would be pushed away from R. The given needle points down towards R’s end, so R must be S.') });
      var pairs = [
        { i: 0, ei: 'a', j: 1, ej: 'a', name: 'Magnets 1 and 2 (side by side)' },
        { i: 1, ei: 'a', j: 2, ej: 'a', name: 'Magnets 2 and 3 (end against the top of magnet 2)' },
        { i: 2, ei: 'b', j: 3, ej: 'a', name: 'Magnets 3 and 4 (at the corner)' }
      ];
      pairs.forEach(function (q) {
        var a = poleAt(q.i, q.ei), b = poleAt(q.j, q.ej);
        r.push({ ok: a == null || b == null ? null : a !== b, text: q.name,
          say: a == null || b == null ? 'Label both magnets.' : (a !== b ? a + ' meets ' + b + ': unlike poles attract.' : a + ' meets ' + b + ': like poles repel, so these two would push apart. The question says they attract.') });
      });
      return r;
    }
    function paint() {
      M.forEach(function (m, i) {
        ['a', 'b'].forEach(function (e, k) {
          var p = poleAt(i, e), t = tags[i][k];
          t.c.setAttribute('style', 'fill:' + (p === 'N' ? 'var(--npole)' : p === 'S' ? 'var(--spole)' : 'var(--sunk)') + ';stroke:var(--stroke)');
          t.s.textContent = p || '?';
          t.s.setAttribute('style', 'fill:' + (p ? '#fff' : 'var(--muted)') + ';font-family:var(--f-label)');
        });
        segBtns[i][0].setAttribute('aria-pressed', String(o[i] === 'N'));
        segBtns[i][1].setAttribute('aria-pressed', String(o[i] === 'S'));
      });
      var cs = checks(), html = '';
      cs.forEach(function (c, k) {
        var mark = c.ok == null ? '–' : c.ok ? '✓' : '✗';
        html += '<div class="line ' + (c.ok == null ? '' : c.ok ? 'ok' : 'no') + '"><b>' + mark + ' ' + c.text + '.</b> ' + c.say + '</div>';
        if (k > 0) {
          var j = J[k - 1]; j.g.setAttribute('opacity', c.ok == null ? '0' : '1');
          j.c.setAttribute('style', 'fill:' + (c.ok ? 'var(--ok)' : 'var(--no)') + ';stroke:var(--stroke)');
          j.t.textContent = c.ok ? '✓' : '✗';
        }
      });
      document.getElementById('checks').innerHTML = html;
      var all = cs.every(function (c) { return c.ok === true; }), bottom4 = poleAt(3, 'b');
      var v = document.getElementById('verdict');
      if (bottom4 == null) { cA.show(false); v.className = 'verdict'; v.textContent = 'Label magnet 4 to see the needle at A.'; }
      else {
        var deg = bottom4 === 'S' ? 180 : 0; cA.point(deg); cA.show(true);
        if (all) { v.className = 'verdict ok'; v.textContent = '✓ Every joint attracts and R is S. Magnet 4 has S at the bottom, so the needle at A points down, towards it: answer (3).'; }
        else { v.className = 'verdict no'; v.textContent = '✗ The needle at A points ' + dirWord(deg) + ' for these labels, but at least one check above fails, so these labels cannot be right.'; }
      }
    }

    document.getElementById('btnPaper').addEventListener('click', function () { o = PAPER.slice(); paint(); ring.setAttribute('cx', 451); ring.setAttribute('cy', 92); ring.setAttribute('opacity', 0.9); });
    document.getElementById('btnClear').addEventListener('click', function () { o = [null, null, null, null]; ring.setAttribute('opacity', 0); paint(); });

    /* step-through */
    var steps = [
      { set: [0, 'N'], focus: [82, 190], text: "Start from the only clue: the compass at R. Its shaded N end points <b>down</b>, along magnet 1 towards R. A needle's N end is pulled towards a S pole, so <b>R is S</b> and the top of magnet 1 is <b>N</b>." },
      { set: [1, 'S'], focus: [212, 130], text: "Magnets 1 and 2 lie <b>side by side</b> and stay together. Side by side, magnets attract only when they lie opposite ways round, so N sits beside S. Magnet 2: <b>S at the top, N at the bottom</b>." },
      { set: [2, 'N'], focus: [274, 61], text: "Magnet 3's left end touches the top of magnet 2, which is S. They attract, so magnet 3's left end is <b>N</b> and its right end is <b>S</b>." },
      { set: [3, 'N'], focus: [451, 92], text: "Magnet 4's top touches magnet 3 right at its S end. They attract, so magnet 4's top is <b>N</b> and its bottom is <b>S</b>. This is the joint the labels on the paper got wrong: they put S against S, which would repel." },
      { set: null, focus: [548, 252], text: "Now compare A with R. Magnet 4 is the same way round as magnet 1 (N at the top, S at the bottom), and A sits beside it near its S end, just as the compass sits beside magnet 1 near R. So the needle points the same way as at R: <b>down</b>." }
    ];
    var i = 0, stepNo = document.getElementById('stepNo'), stepText = document.getElementById('stepText');
    var bNext = document.getElementById('btnNext'), bBack = document.getElementById('btnBack');
    var an = document.getElementById('answerNote'), firstNote = an.innerHTML;
    function drawStep() {
      o = [null, null, null, null];
      for (var s = 0; s < i; s++) if (steps[s].set) o[steps[s].set[0]] = steps[s].set[1];
      paint();
      if (i === 0) { stepNo.textContent = '0'; stepText.innerHTML = 'Press <b>Next step</b> to work from the compass at R all the way to A.'; ring.setAttribute('opacity', 0); }
      else { var st = steps[i - 1]; stepNo.textContent = String(i); stepText.innerHTML = st.text; ring.setAttribute('cx', st.focus[0]); ring.setAttribute('cy', st.focus[1]); ring.setAttribute('opacity', 0.9); }
      bBack.disabled = i === 0; bNext.disabled = i === steps.length;
      bNext.textContent = i === steps.length ? 'Done' : 'Next step';
      an.innerHTML = i === steps.length
        ? '<b>Answer: (3)</b>, N end pointing down. <b>(4)</b> points the needle straight at magnet 4’s S end, but the compass at R shows that a needle beside these magnets does not point straight at them. <b>(2)</b> comes from the S-against-S label at the corner. <b>(1)</b> has the S pole pushing the needle’s N end away, which never happens.'
        : firstNote;
    }
    bNext.addEventListener('click', function () { if (i < steps.length) { i++; drawStep(); } });
    bBack.addEventListener('click', function () { if (i > 0) { i--; drawStep(); } });
    document.getElementById('btnRestart').addEventListener('click', function () { i = 0; drawStep(); });
    drawStep();
  })();

  /* ---------- 2. beside the magnet, or past its end? ---------- */
  (function () {
    var svg = document.getElementById('besideSvg'); if (!svg) return;
    var flipped = false, seen = {}, last = null;
    el('rect', { x: 229, y: 90, width: 62, height: 200, rx: 4, fill: 'var(--card)', stroke: 'var(--stroke)', 'stroke-width': 2 }, svg);
    el('line', { x1: 229, y1: 190, x2: 291, y2: 190, stroke: 'var(--stroke)', 'stroke-width': 2 }, svg);
    var topC = el('circle', { cx: 260, cy: 128, r: 19, stroke: 'var(--stroke)', 'stroke-width': 2 }, svg);
    var topT = txt(svg, 260, 129, 'N', { 'font-size': 17, 'font-weight': '700', fill: '#fff' });
    var botC = el('circle', { cx: 260, cy: 252, r: 19, stroke: 'var(--stroke)', 'stroke-width': 2 }, svg);
    var botT = txt(svg, 260, 253, 'S', { 'font-size': 17, 'font-weight': '700', fill: '#fff' });
    var SP = [
      { id: 'top', x: 260, y: 45, lx: 300, ly: 45, label: 'Past the top end', kind: 'end', end: 'top' },
      { id: 'bot', x: 260, y: 335, lx: 300, ly: 335, label: 'Past the bottom end', kind: 'end', end: 'bottom' },
      { id: 'left', x: 120, y: 190, lx: 120, ly: 240, label: 'Beside, on the left', kind: 'side' },
      { id: 'right', x: 400, y: 190, lx: 400, ly: 240, label: 'Beside, on the right', kind: 'side' }
    ];
    var host = document.getElementById('spotBtns'), out = document.getElementById('spotOut');
    SP.forEach(function (s) {
      s.c = compass(svg, s.x, s.y, 30);
      var hit = el('circle', { cx: s.x, cy: s.y, r: 40, fill: 'transparent', style: 'cursor:pointer' }, svg);
      hit.addEventListener('click', function () { pick(s); });
      txt(svg, s.lx, s.ly, s.label, { 'font-size': 17, fill: 'var(--muted)', 'text-anchor': s.kind === 'end' ? 'start' : 'middle' });
      s.btn = document.createElement('button'); s.btn.type = 'button'; s.btn.className = 'btn'; s.btn.textContent = s.label;
      s.btn.addEventListener('click', function () { pick(s); }); host.appendChild(s.btn);
    });
    function tp() { return flipped ? 'S' : 'N'; }
    function degFor(s) {
      if (s.kind === 'end') return tp() === 'N' ? 0 : 180;   /* past either end, the needle points along the line */
      return tp() === 'N' ? 180 : 0;                          /* beside: N end towards the S pole */
    }
    function explain(s) {
      var t = tp(), b = opp(t), d = dirWord(degFor(s));
      if (s.kind === 'end') {
        var near = s.end === 'top' ? t : b;
        return '<b>' + s.label + ', on the magnet’s line.</b> The ' + near + ' pole is much closer than the other pole, so it wins. It ' +
          (near === 'N' ? 'pushes the needle’s N end away' : 'pulls the needle’s N end towards it') + '. The needle points along the line, ' +
          (near === 'N' ? 'away from' : 'towards') + ' the magnet: <b>' + d + '</b>.';
      }
      return '<b>' + s.label + '.</b> Both poles are about as close. The ' + t + ' pole at the top ' +
        (t === 'N' ? 'pushes the needle’s N end away from it, downwards' : 'pulls the needle’s N end up towards it') + '. The ' + b + ' pole at the bottom ' +
        (b === 'S' ? 'pulls the N end down towards it' : 'pushes the N end away from it, upwards') +
        '. Both turn it the same way, so the needle lies <b>alongside</b> the magnet, N end pointing <b>' + d + '</b>, towards the S pole. It does not point at the magnet.';
    }
    function pick(s) { seen[s.id] = true; last = s; paint(); }
    function paint() {
      topC.setAttribute('style', 'fill:' + (tp() === 'N' ? 'var(--npole)' : 'var(--spole)') + ';stroke:var(--stroke)');
      botC.setAttribute('style', 'fill:' + (tp() === 'N' ? 'var(--spole)' : 'var(--npole)') + ';stroke:var(--stroke)');
      topT.textContent = tp(); botT.textContent = opp(tp());
      SP.forEach(function (s) { s.c.show(!!seen[s.id]); s.c.point(degFor(s)); s.btn.setAttribute('aria-pressed', String(last === s)); });
      out.innerHTML = last ? explain(last) : 'Tap a compass.';
    }
    document.getElementById('btnFlip').addEventListener('click', function () { flipped = !flipped; paint(); });
    paint();
  })();

  P.Q.set(document.getElementById('qs'), P.data.questions, {});
})();
