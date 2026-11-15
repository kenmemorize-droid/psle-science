/* Why a compass needle swings: draggable magnet field, Lucy's chain step-through, questions. */
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
  function barMagnet(parent, x, y, w, h, horizontal) {
    var g = el('g', {}, parent);
    el('rect', { x: x, y: y, width: w, height: h, rx: 4, fill: 'var(--card)', stroke: 'var(--stroke)', 'stroke-width': 2 }, g);
    if (horizontal) el('line', { x1: x + w / 2, y1: y, x2: x + w / 2, y2: y + h, stroke: 'var(--stroke)', 'stroke-width': 2 }, g);
    else el('line', { x1: x, y1: y + h / 2, x2: x + w, y2: y + h / 2, stroke: 'var(--stroke)', 'stroke-width': 2 }, g);
    return g;
  }
  function poleLabel(parent, cx, cy, pole, id) {
    var g = el('g', { id: id, opacity: 0 }, parent);
    el('circle', { cx: cx, cy: cy, r: 17, fill: pole === 'N' ? 'var(--npole)' : 'var(--spole)', stroke: 'var(--stroke)', 'stroke-width': 2 }, g);
    txt(g, cx, cy + 1, pole, { fill: '#fff', 'font-size': 16, 'font-weight': '700' });
    return g;
  }
  function compass(parent, cx, cy, r, id) {
    var g = el('g', {}, parent);
    el('circle', { cx: cx, cy: cy, r: r, fill: 'var(--card)', stroke: 'var(--stroke)', 'stroke-width': 2 }, g);
    var ng = el('g', { id: id || null }, g), k = r * 0.78, w = r * 0.26;
    el('polygon', { points: cx + ',' + (cy - k) + ' ' + (cx - w) + ',' + cy + ' ' + (cx + w) + ',' + cy, fill: 'var(--npole)', stroke: 'var(--stroke)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, ng);
    el('polygon', { points: cx + ',' + (cy + k) + ' ' + (cx - w) + ',' + cy + ' ' + (cx + w) + ',' + cy, fill: 'var(--needle-s)', stroke: 'var(--stroke)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, ng);
    ng.setAttribute('data-cx', cx); ng.setAttribute('data-cy', cy);
    return { g: g, needle: ng };
  }
  function pointNeedle(ng, deg) { ng.setAttribute('transform', 'rotate(' + deg + ' ' + ng.getAttribute('data-cx') + ' ' + ng.getAttribute('data-cy') + ')'); }

  /* ---------- 1. draggable magnet + field of compasses ---------- */
  (function () {
    var svg = document.getElementById('fieldSvg'); if (!svg) return;
    var W = 720, H = 420, MLEN = 150, MW = 46, M = 3000, EARTH = 0.22, MINR = 22;
    var state = { mx: 360, my: 200, ang: 0, flipped: false, px: 262, py: 264 };
    var gridG = el('g', {}, svg), magG = el('g', { style: 'cursor:grab' }, svg), probeG = el('g', { style: 'cursor:grab' }, svg);
    var grid = [];
    for (var gx = 50; gx <= W - 50; gx += 84) for (var gy = 46; gy <= H - 46; gy += 84) {
      var c = compass(gridG, gx, gy, 17); grid.push({ x: gx, y: gy, n: c.needle, g: c.g });
    }
    var mg = el('g', {}, magG);
    el('rect', { x: -MLEN / 2, y: -MW / 2, width: MLEN, height: MW, rx: 5, fill: 'var(--card)', stroke: 'var(--stroke)', 'stroke-width': 2 }, mg);
    var leftHalf = el('rect', { x: -MLEN / 2, y: -MW / 2, width: MLEN / 2, height: MW, rx: 5, opacity: '.9' }, mg);
    var rightHalf = el('rect', { x: 0, y: -MW / 2, width: MLEN / 2, height: MW, rx: 5, opacity: '.9' }, mg);
    el('rect', { x: -MLEN / 2, y: -MW / 2, width: MLEN, height: MW, rx: 5, fill: 'none', stroke: 'var(--stroke)', 'stroke-width': 2 }, mg);
    var labL = txt(mg, -MLEN / 4, 1, 'N', { fill: '#fff', 'font-size': 18, 'font-weight': '700' });
    var labR = txt(mg, MLEN / 4, 1, 'S', { fill: '#fff', 'font-size': 18, 'font-weight': '700' });
    compass(probeG, 0, 0, 30, 'probeNeedle');
    txt(probeG, 0, 46, 'your compass', { 'font-size': 13, fill: 'var(--muted)' });

    function poles() {
      var a = state.ang * Math.PI / 180, dx = Math.cos(a) * MLEN / 2, dy = Math.sin(a) * MLEN / 2;
      var pN = { x: state.mx - dx, y: state.my - dy }, pS = { x: state.mx + dx, y: state.my + dy };
      if (state.flipped) { var t = pN; pN = pS; pS = t; }
      return { N: pN, S: pS };
    }
    function magnetAt(x, y) {
      var p = poles(), bx = 0, by = 0, ends = [{ p: p.N, s: 1 }, { p: p.S, s: -1 }];
      for (var i = 0; i < 2; i++) {
        var ex = x - ends[i].p.x, ey = y - ends[i].p.y, r = Math.sqrt(ex * ex + ey * ey); if (r < MINR) r = MINR;
        var f = ends[i].s * M / (r * r * r); bx += f * ex; by += f * ey;
      }
      return { x: bx, y: by };
    }
    function angleAt(x, y) { var b = magnetAt(x, y); return Math.atan2(b.x, -(b.y - EARTH)) * 180 / Math.PI; }
    function render() {
      magG.setAttribute('transform', 'translate(' + state.mx + ',' + state.my + ') rotate(' + state.ang + ')');
      labL.textContent = state.flipped ? 'S' : 'N'; labR.textContent = state.flipped ? 'N' : 'S';
      leftHalf.style.fill = state.flipped ? 'var(--spole)' : 'var(--npole)';
      rightHalf.style.fill = state.flipped ? 'var(--npole)' : 'var(--spole)';
      probeG.setAttribute('transform', 'translate(' + state.px + ',' + state.py + ')');
      grid.forEach(function (c) {
        var d = Math.sqrt(Math.pow(c.x - state.mx, 2) + Math.pow(c.y - state.my, 2));
        c.g.setAttribute('opacity', d < MLEN / 2 + 14 ? '0.12' : '1');
        pointNeedle(c.n, angleAt(c.x, c.y));
      });
      pointNeedle(document.getElementById('probeNeedle'), angleAt(state.px, state.py));
      var b = magnetAt(state.px, state.py), strong = Math.sqrt(b.x * b.x + b.y * b.y) > EARTH;
      document.getElementById('pillWho').textContent = strong ? 'A magnet is close: it decides where the needle points' : 'No magnet close by';
      document.getElementById('pillWhy').textContent = strong ? "The needle's N end turns towards the magnet's S pole and away from its N pole" : "The needle's N end rests pointing north";
    }
    function toSvg(evt) {
      var pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
      var m = svg.getScreenCTM(); if (!m) return { x: state.mx, y: state.my };
      var p = pt.matrixTransform(m.inverse()); return { x: p.x, y: p.y };
    }
    function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
    function makeDrag(node, setter) {
      var active = false;
      node.addEventListener('pointerdown', function (e) { active = true; try { node.setPointerCapture(e.pointerId); } catch (err) {} e.preventDefault(); });
      node.addEventListener('pointermove', function (e) { if (!active) return; var p = toSvg(e); setter(clamp(p.x, 40, W - 40), clamp(p.y, 40, H - 40)); render(); });
      function up(e) { if (active) { active = false; try { node.releasePointerCapture(e.pointerId); } catch (err) {} } }
      node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
    }
    makeDrag(magG, function (x, y) { state.mx = x; state.my = y; });
    makeDrag(probeG, function (x, y) { state.px = x; state.py = y; });
    document.getElementById('btnFlip').addEventListener('click', function () { state.flipped = !state.flipped; render(); });
    document.getElementById('btnTurn').addEventListener('click', function () { state.ang = (state.ang + 45) % 360; render(); });
    document.getElementById('btnReset').addEventListener('click', function () { state = { mx: 360, my: 200, ang: 0, flipped: false, px: 262, py: 264 }; render(); });
    render();
  })();

  /* ---------- Beyond syllabus: the Earth drawn as a giant magnet ---------- */
  (function () {
    var svg = document.getElementById('earthSvg'); if (!svg) return;
    var cx = 300, cy = 200, R = 150, bw = 54, bh = 230;
    el('circle', { cx: cx, cy: cy, r: R, fill: 'var(--card)', stroke: 'var(--stroke)', 'stroke-width': 2 }, svg);
    el('ellipse', { cx: cx, cy: cy, rx: R * 0.42, ry: R, fill: 'none', stroke: 'var(--line)', 'stroke-width': 2 }, svg);
    el('line', { x1: cx - R, y1: cy, x2: cx + R, y2: cy, stroke: 'var(--line)', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, svg);
    txt(svg, cx + R - 28, cy - 12, 'equator', { 'font-size': 12, fill: 'var(--muted)' });
    el('rect', { x: cx - bw / 2, y: cy - bh / 2, width: bw, height: bh, rx: 8, fill: 'var(--spole)', opacity: '.25', stroke: 'var(--stroke)', 'stroke-width': 2, 'stroke-dasharray': '5 5' }, svg);
    el('line', { x1: cx - bw / 2, y1: cy, x2: cx + bw / 2, y2: cy, stroke: 'var(--stroke)', 'stroke-width': 2, 'stroke-dasharray': '5 5' }, svg);
    txt(svg, cx, cy - bh / 2 + 30, 'S', { 'font-size': 22, 'font-weight': '700', fill: 'var(--spole)' });
    txt(svg, cx, cy + bh / 2 - 30, 'N', { 'font-size': 22, 'font-weight': '700', fill: 'var(--npole)' });
    txt(svg, cx, cy - bh / 2 - 22, 'geographic North', { 'font-size': 13, fill: 'var(--muted)' });
    txt(svg, cx, cy + bh / 2 + 24, 'geographic South', { 'font-size': 13, fill: 'var(--muted)' });
    var spots = [{ x: cx - R - 4, y: cy - 36 }, { x: cx + R + 4, y: cy - 36 }, { x: cx, y: cy + R + 34 }];
    var notes = ['On the left of the globe the needle still turns to point north.', 'On the right of the globe the needle still turns to point north.', "Even near the bottom, the needle's N end points towards geographic North."];
    var out = document.getElementById('earthOut');
    spots.forEach(function (s, i) {
      var c = compass(svg, s.x, s.y, 26);
      pointNeedle(c.needle, Math.atan2(cx - s.x, -((cy - bh / 2) - s.y)) * 180 / Math.PI);
      c.g.setAttribute('style', 'cursor:pointer');
      el('circle', { cx: s.x, cy: s.y, r: 34, fill: 'transparent' }, c.g);
      c.g.addEventListener('click', function () { out.textContent = notes[i]; });
    });
    txt(svg, 560, 120, 'N end of every', { 'font-size': 14, fill: 'var(--muted)' });
    txt(svg, 560, 140, 'needle turns', { 'font-size': 14, fill: 'var(--muted)' });
    txt(svg, 560, 160, 'the same way', { 'font-size': 14, fill: 'var(--muted)' });
  })();

  /* ---------- Lucy's three magnets, step by step ---------- */
  (function () {
    var svg = document.getElementById('chainSvg'); if (!svg) return;
    var A = { x: 150, y: 70, w: 56, h: 230 }, C = { x: 420, y: 70, w: 56, h: 230 }, B = { x: 206, y: 76, w: 214, h: 52 };
    barMagnet(svg, A.x, A.y, A.w, A.h, false); barMagnet(svg, C.x, C.y, C.w, C.h, false); barMagnet(svg, B.x, B.y, B.w, B.h, true);
    txt(svg, A.x - 24, A.y + A.h / 2 + 40, 'A', { 'font-size': 16, fill: 'var(--muted)' });
    txt(svg, B.x + B.w / 2, B.y + B.h + 22, 'B', { 'font-size': 16, fill: 'var(--muted)' });
    txt(svg, C.x + C.w + 24, C.y + C.h / 2 + 40, 'C', { 'font-size': 16, fill: 'var(--muted)' });
    var cxX = A.x + A.w / 2, cyX = 352, cX = compass(svg, cxX, cyX, 32);
    pointNeedle(cX.needle, 0);
    el('line', { x1: cxX - 70, y1: cyX, x2: cxX - 34, y2: cyX, stroke: 'var(--stroke)', 'stroke-width': 2 }, svg);
    txt(svg, cxX - 104, cyX, 'compass X', { 'font-size': 14 });
    var cxY = 572, cyY = 250;
    compass(svg, cxY, cyY, 32, 'needleY');
    document.getElementById('needleY').setAttribute('opacity', '0');
    txt(svg, cxY, cyY - 50, 'compass Y', { 'font-size': 14 });
    var qmark = txt(svg, cxY, cyY + 1, '?', { 'font-size': 26, fill: 'var(--muted)', 'font-weight': '700' });
    poleLabel(svg, A.x + A.w / 2, A.y + A.h - 34, 'S', 'p1');
    poleLabel(svg, A.x + A.w / 2, A.y + 34, 'N', 'p2');
    poleLabel(svg, B.x + 30, B.y + B.h / 2, 'S', 'p3');
    poleLabel(svg, B.x + B.w - 30, B.y + B.h / 2, 'N', 'p4');
    poleLabel(svg, C.x + C.w / 2, C.y + 34, 'S', 'p5');
    poleLabel(svg, C.x + C.w / 2, C.y + C.h - 34, 'N', 'p6');
    var ring = el('circle', { cx: 0, cy: 0, r: 30, fill: 'none', stroke: 'var(--hl)', 'stroke-width': 4, opacity: 0 }, svg);
    var steps = [
      { reveal: null, focus: [cxX, cyX], text: "Compass X's needle rests with its shaded <b>N</b> end pointing <b>up</b>, towards the bottom end of magnet A." },
      { reveal: 'p1', focus: [A.x + A.w / 2, A.y + A.h - 34], text: "A needle's N end is attracted to a <b>S</b> pole. So the bottom end of magnet A must be <b>S</b>." },
      { reveal: 'p2', focus: [A.x + A.w / 2, A.y + 34], text: "Every magnet has two different poles. If A's bottom is S, A's top must be <b>N</b>." },
      { reveal: 'p3', focus: [B.x + 30, B.y + B.h / 2], text: "Magnet B's left end is touching A's top (N) and they stay together. Only unlike poles attract, so B's left end is <b>S</b>." },
      { reveal: 'p4', focus: [B.x + B.w - 30, B.y + B.h / 2], text: "B's other end is therefore <b>N</b>." },
      { reveal: 'p5', focus: [C.x + C.w / 2, C.y + 34], text: "B's right end (N) is touching the top of magnet C and they stay together, so C's top is <b>S</b>." },
      { reveal: 'p6', focus: [C.x + C.w / 2, C.y + C.h - 34], text: "C's bottom end is therefore <b>N</b>, and that is the end compass Y is sitting next to." },
      { reveal: 'Y', focus: [cxY, cyY], text: "Like poles repel. C's N pole pushes the needle's N end <b>away, to the right</b>, and pulls its S end towards the magnet. The needle lies flat, N pointing right." }
    ];
    var i = 0, stepNo = document.getElementById('stepNo'), stepText = document.getElementById('stepText');
    var bNext = document.getElementById('btnNext'), bBack = document.getElementById('btnBack'), bRe = document.getElementById('btnRestart');
    var an = document.getElementById('answerNote'), firstNote = an.innerHTML;
    function draw() {
      for (var k = 1; k <= 6; k++) {
        var on = false; for (var s = 0; s < i; s++) if (steps[s].reveal === 'p' + k) on = true;
        var node = document.getElementById('p' + k); node.setAttribute('opacity', on ? '1' : '0'); node.style.transition = 'opacity .3s ease';
      }
      var ny = document.getElementById('needleY'), yOn = i >= steps.length;
      ny.setAttribute('opacity', yOn ? '1' : '0'); if (yOn) pointNeedle(ny, 90);
      qmark.setAttribute('opacity', yOn ? '0' : '1');
      if (i === 0) { stepNo.textContent = '0'; stepText.innerHTML = 'Press <b>Next step</b> to follow the chain of reasoning from compass X all the way to compass Y.'; ring.setAttribute('opacity', 0); }
      else { var st = steps[i - 1]; stepNo.textContent = String(i); stepText.innerHTML = st.text; ring.setAttribute('cx', st.focus[0]); ring.setAttribute('cy', st.focus[1]); ring.setAttribute('opacity', 0.9); }
      bBack.disabled = i === 0; bNext.disabled = i === steps.length;
      bNext.textContent = i === steps.length ? 'Done' : 'Next step';
      an.innerHTML = i === steps.length
        ? '<b>Answer: (3)</b>, the flat needle with its shaded N end pointing right, away from magnet C. Choosing <b>(1)</b> treats the compass as if no magnet were near it. Choosing <b>(2)</b> means the needle\'s N end was pulled <i>towards</i> a N pole, which never happens.'
        : firstNote;
    }
    bNext.addEventListener('click', function () { if (i < steps.length) { i++; draw(); } });
    bBack.addEventListener('click', function () { if (i > 0) { i--; draw(); } });
    bRe.addEventListener('click', function () { i = 0; draw(); });
    draw();
  })();

  /* ---------- the four answer choices for Lucy's question ---------- */
  (function () {
    var svg = document.getElementById('optSvg'); if (!svg) return;
    [{ n: '(1)', deg: 0, d: 'N end up' }, { n: '(2)', deg: 270, d: 'N end left' }, { n: '(3)', deg: 90, d: 'N end right' }, { n: '(4)', deg: 180, d: 'N end down' }].forEach(function (o, i) {
      var x = 110 + i * 160;
      txt(svg, x, 24, o.n, { 'font-size': 16, 'font-weight': '700' });
      pointNeedle(compass(svg, x, 86, 36).needle, o.deg);
      txt(svg, x, 152, o.d, { 'font-size': 14, fill: 'var(--muted)' });
    });
  })();

  P.Q.set(document.getElementById('qs'), P.data.questions, {});
})();
