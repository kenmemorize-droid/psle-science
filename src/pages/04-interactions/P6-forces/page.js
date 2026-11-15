/* P6 Forces: effects bench, gravity arrow, friction bench, spring lab, unit check. */
(function () {
  'use strict';
  var P = window.PSLE; if (!P) return;
  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] != null) n.setAttribute(k, String(attrs[k]));
    if (parent) parent.appendChild(n);
    return n;
  }
  function txt(parent, x, y, s, cls, anchor) {
    var t = el('text', { x: x, y: y, class: cls || 'slab', 'text-anchor': anchor || 'start' }, parent);
    t.textContent = s; return t;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function byId(id) { return document.getElementById(id); }

  /* ---------------- 1. What a force does ---------------- */
  (function effects() {
    var svg = byId('fxSvg'); if (!svg) return;
    var log = byId('fxLog'), msg = byId('fxMsg');
    var seen = {}, x = 300, v = 0, squashed = false, raf = null, arrow = null, arrowT = 0;
    var g = el('g', {}, svg);
    el('line', { x1: 40, y1: 190, x2: 600, y2: 190, class: 'ground' }, g);
    var puck = el('rect', { x: x - 26, y: 150, width: 52, height: 38, rx: 6, class: 'puck' }, g);
    var clay = el('ellipse', { cx: 120, cy: 168, rx: 34, ry: 22, class: 'clay' }, g);
    txt(g, 120, 212, 'clay ball', 'slab', 'middle');
    var arrowG = el('g', {}, g);

    var EFFECTS = {
      start: 'A force can move a stationary object.',
      speed: 'A force can speed up a moving object.',
      slow: 'A force can slow down a moving object.',
      turn: 'A force can change the direction of motion.',
      stop: 'A force can stop a moving object.',
      shape: 'A force may change the shape of an object.'
    };
    function note(key) {
      if (!seen[key]) {
        seen[key] = 1;
        if (log.querySelector('.empty')) log.innerHTML = '';
        var d = document.createElement('div');
        d.className = 'fxitem';
        d.innerHTML = '<i aria-hidden="true">✓</i><span>' + P.esc(EFFECTS[key]) + '</span>';
        d.insertAdjacentHTML('beforeend', '');
        log.appendChild(d);
      }
      msg.textContent = EFFECTS[key];
    }
    function showArrow(dir) {
      clear(arrowG); arrowT = 14;
      var ax = dir > 0 ? x - 70 : x + 70, bx = dir > 0 ? x - 32 : x + 32;
      el('line', { x1: ax, y1: 169, x2: bx, y2: 169, class: 'farrow' }, arrowG);
      el('polygon', { points: (bx) + ',169 ' + (bx - dir * 12) + ',163 ' + (bx - dir * 12) + ',175', class: 'farrow' }, arrowG);
      txt(arrowG, (ax + bx) / 2, 155, 'push', 'flabel', 'middle');
    }
    function push(dir) {
      var was = v;
      showArrow(dir);
      v += dir * 2.4;
      if (was === 0) note('start');
      else if (was * dir > 0) note('speed');
      else if (Math.abs(v) < 0.4) { v = 0; note('stop'); }
      else if (was * v < 0) note('turn');
      else note('slow');
      run();
    }
    function block() {
      if (v === 0) { msg.textContent = 'The puck is already still. Push it first.'; return; }
      showArrow(v > 0 ? -1 : 1); v = 0; note('stop'); run();
    }
    function squash() {
      if (squashed) { clay.setAttribute('rx', 34); clay.setAttribute('ry', 22); clay.setAttribute('cy', 168); squashed = false; msg.textContent = 'The clay keeps its new shape until another force changes it.'; return; }
      clay.setAttribute('rx', 46); clay.setAttribute('ry', 13); clay.setAttribute('cy', 177); squashed = true; note('shape');
    }
    function frame() {
      raf = null;
      if (arrowT > 0 && --arrowT === 0) clear(arrowG);
      if (v !== 0) {
        x += v;
        if (x < 70) { x = 70; v = 0; }
        if (x > 570) { x = 570; v = 0; }
        puck.setAttribute('x', x - 26);
      }
      if (v !== 0 || arrowT > 0) run();
    }
    function run() { if (!raf) raf = requestAnimationFrame(frame); }
    byId('fxLeft').onclick = function () { push(1); };
    byId('fxRight').onclick = function () { push(-1); };
    byId('fxBlock').onclick = block;
    byId('fxSquash').onclick = squash;
    byId('fxReset').onclick = function () {
      x = 300; v = 0; puck.setAttribute('x', x - 26); clear(arrowG);
      clay.setAttribute('rx', 34); clay.setAttribute('ry', 22); clay.setAttribute('cy', 168); squashed = false;
      msg.textContent = 'The puck is still. A force is needed to start it moving.';
    };
  })();

  /* ---------------- 2. Gravity never switches off ---------------- */
  (function gravity() {
    var svg = byId('gvSvg'); if (!svg) return;
    var msg = byId('gvMsg');
    var g = el('g', {}, svg);
    el('line', { x1: 20, y1: 272, x2: 620, y2: 272, class: 'ground' }, g);
    var ball = el('circle', { cx: 180, cy: 248, r: 18, class: 'puck' }, g);
    var arrowG = el('g', {}, g);
    var bookG = el('g', { opacity: 0 }, g);
    el('rect', { x: 420, y: 232, width: 150, height: 10, class: 'sl' }, bookG);
    el('rect', { x: 430, y: 240, width: 10, height: 28, class: 'ln' }, bookG);
    el('rect', { x: 550, y: 240, width: 10, height: 28, class: 'ln' }, bookG);
    el('rect', { x: 462, y: 208, width: 66, height: 24, rx: 3, class: 'clay' }, bookG);
    txt(bookG, 495, 200, 'book at rest', 'slab', 'middle');
    var bookArrow = el('g', {}, bookG);

    /* the arrow is drawn beside the object so it never runs into the ground line or a caption */
    function pullArrow(parent, cx, cy, label, side) {
      clear(parent);
      side = side || 1;
      var ax = cx + 34 * side, top = cy - 16, bot = cy + 20;
      el('line', { x1: ax, y1: top, x2: ax, y2: bot, class: 'farrow' }, parent);
      el('polygon', { points: ax + ',' + (bot + 9) + ' ' + (ax - 7) + ',' + (bot - 2) + ' ' + (ax + 7) + ',' + (bot - 2), class: 'farrow' }, parent);
      txt(parent, ax + 10 * side, cy + 4, label, 'flabel', side > 0 ? 'start' : 'end');
    }
    var t = 0, raf = null;
    function frame() {
      raf = null; t += 1 / 60;
      var u = 170, a = 240, y = 248 - (u * t - 0.5 * a * t * t) * 1.0;
      if (y >= 248) { y = 248; t = 0; raf = null; msg.textContent = 'Back on the ground. The arrow never disappeared: gravitational force acted the whole time.'; ball.setAttribute('cy', 248); pullArrow(arrowG, 180, 248, 'gravitational force'); return; }
      ball.setAttribute('cy', y);
      pullArrow(arrowG, 180, y, 'gravitational force');
      var phase = y < 118 ? 'At the top the ball is still for a moment — and gravity is still pulling it down.' :
        (t < 0.7 ? 'Going up and slowing down: gravity pulls downwards.' : 'Coming down and speeding up: the same pull, now in the direction of motion.');
      msg.textContent = phase;
      raf = requestAnimationFrame(frame);
    }
    pullArrow(arrowG, 180, 248, 'gravitational force');
    byId('gvThrow').onclick = function () { if (raf) return; t = 0; raf = requestAnimationFrame(frame); };
    byId('gvBook').onclick = function () {
      var on = bookG.getAttribute('opacity') === '1';
      bookG.setAttribute('opacity', on ? 0 : 1);
      if (!on) { pullArrow(bookArrow, 495, 220, 'gravitational force', -1); msg.textContent = 'The book is not moving, yet gravitational force still pulls it down. The table stops it from falling.'; }
    };
  })();

  /* ---------------- 3. Friction bench ---------------- */
  (function friction() {
    var svg = byId('frSvg'); if (!svg) return;
    var pick = byId('frPick'), msg = byId('frMsg'), tbody = byId('frTable').querySelector('tbody');
    var SURFACES = [
      { id: 'glass', name: 'Glass', dist: 120, note: 'very smooth, so a small frictional force' },
      { id: 'wood', name: 'Wood', dist: 80, note: 'a little rougher' },
      { id: 'carpet', name: 'Carpet', dist: 35, note: 'rough, so a large frictional force' },
      { id: 'sandpaper', name: 'Sandpaper', dist: 20, note: 'the roughest, so the greatest frictional force' }
    ];
    var cur = SURFACES[0], done = {};
    var g = el('g', {}, svg);
    el('polygon', { points: '40,170 150,170 40,90', class: 'sl' }, g);
    var strip = el('rect', { x: 150, y: 166, width: 450, height: 14, class: 'surf-glass', stroke: 'var(--stroke)', 'stroke-width': 2 }, g);
    var stripLabel = txt(g, 375, 200, 'Glass', 'slab', 'middle');
    var block = el('rect', { x: 60, y: 112, width: 34, height: 26, rx: 4, class: 'puck' }, g);
    var fArrow = el('g', {}, g);
    var marks = el('g', {}, g);
    for (var d = 0; d <= 120; d += 20) {
      var mx = 150 + d * 3.6;
      el('line', { x1: mx, y1: 180, x2: mx, y2: 188, class: 'rule' }, marks);
      txt(marks, mx, 160, String(d), 'slab', 'middle').setAttribute('font-size', '11');
    }
    function paintPick() {
      pick.innerHTML = '';
      SURFACES.forEach(function (s) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'tile'; b.setAttribute('aria-pressed', String(s === cur));
        b.innerHTML = '<b>' + P.esc(s.name) + '</b><small>' + (done[s.id] ? 'done' : 'not tried') + '</small>';
        b.onclick = function () { cur = s; strip.setAttribute('class', 'surf-' + s.id); stripLabel.textContent = s.name; paintPick(); };
        pick.appendChild(b);
      });
    }
    function row(s) {
      var tr = document.createElement('tr');
      tr.className = 'new';
      tr.innerHTML = '<th scope="row">' + P.esc(s.name) + '</th><td>' + s.dist + '</td>';
      tbody.appendChild(tr);
      setTimeout(function () { tr.className = ''; }, 1200);
    }
    var raf = null;
    function slide() {
      if (raf) return;
      var startX = 60, endX = 150 + cur.dist * 3.6 - 34, x = startX, t0 = null;
      clear(fArrow);
      function frame(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
        x = startX + (endX - startX) * e;
        var y = x < 150 ? 112 + (x - 60) * 0.5 : 140;
        block.setAttribute('x', x); block.setAttribute('y', y);
        if (p < 1) { raf = requestAnimationFrame(frame); return; }
        raf = null;
        el('line', { x1: x + 40, y1: 153, x2: x + 6, y2: 153, class: 'farrow' }, fArrow);
        el('polygon', { points: (x + 2) + ',153 ' + (x + 14) + ',147 ' + (x + 14) + ',159', class: 'farrow' }, fArrow);
        txt(fArrow, x + 46, 157, 'frictional force', 'flabel');
        if (!done[cur.id]) { done[cur.id] = 1; row(cur); paintPick(); }
        msg.textContent = cur.name + ': the block travelled ' + cur.dist + ' cm. ' + cur.name + ' is ' + cur.note + '. The frictional force points backwards, against the motion.';
      }
      block.setAttribute('x', startX); block.setAttribute('y', 112);
      raf = requestAnimationFrame(frame);
    }
    byId('frGo').onclick = slide;
    byId('frClear').onclick = function () { done = {}; tbody.innerHTML = ''; paintPick(); msg.textContent = 'Nothing recorded yet.'; };
    paintPick();
  })();

  /* ---------------- 4. Spring lab ---------------- */
  (function spring() {
    var svg = byId('spSvg'); if (!svg) return;
    var msg = byId('spMsg'), tbody = byId('spTable').querySelector('tbody');
    var ORIG = 10, PER = 2, load = 0, maxLoad = 300;
    var g = el('g', {}, svg);
    el('rect', { x: 40, y: 30, width: 120, height: 10, class: 'sl' }, g);
    el('rect', { x: 44, y: 40, width: 10, height: 250, class: 'sl' }, g);
    var coil = el('path', { d: '', class: 'spring' }, g);
    var hook = el('circle', { cx: 150, cy: 0, r: 5, class: 'sl' }, g);
    var loads = el('g', {}, g);
    var ruler = el('g', {}, g);
    for (var cm = 0; cm <= 24; cm += 4) {
      var y = 48 + cm * 9;
      el('line', { x1: 232, y1: y, x2: 244, y2: y, class: 'rule' }, ruler);
      txt(ruler, 250, y + 4, cm + ' cm', 'slab').setAttribute('font-size', '10');
    }
    el('line', { x1: 238, y1: 48, x2: 238, y2: 264, class: 'rule' }, ruler);
    function lengthCm() { return ORIG + (load / 50) * PER; }
    function draw() {
      var L = lengthCm() * 9, top = 48, turns = 9, d = 'M150 ' + top, step = L / turns;
      for (var i = 0; i < turns; i++) {
        var y0 = top + i * step;
        d += ' L' + (i % 2 ? 128 : 172) + ' ' + (y0 + step / 2) + ' L150 ' + (y0 + step);
      }
      coil.setAttribute('d', d);
      hook.setAttribute('cy', top + L);
      clear(loads);
      for (var n = 0; n < load / 50; n++) {
        el('rect', { x: 126, y: top + L + 6 + n * 16, width: 48, height: 14, rx: 2, class: 'loadbox' }, loads);
      }
      if (load) txt(loads, 196, top + L + 20, load + ' g', 'slab');
    }
    function addRow() {
      var tr = document.createElement('tr');
      tr.className = 'new';
      tr.innerHTML = '<th scope="row">' + load + '</th><td>' + lengthCm() + '</td><td>' + (lengthCm() - ORIG) + '</td>';
      tbody.appendChild(tr);
      setTimeout(function () { tr.className = ''; }, 1200);
    }
    function redraw(changed) {
      draw();
      if (changed) {
        msg.textContent = load === 0
          ? 'No load: the spring is back to its original length, 10 cm.'
          : load + ' g gives a length of ' + lengthCm() + ' cm, so the extension is ' + (lengthCm() - ORIG) + ' cm.';
      }
    }
    byId('spAdd').onclick = function () {
      if (load >= maxLoad) { msg.textContent = 'Stop there. Adding much more would stretch this spring too far to follow the pattern.'; return; }
      load += 50; redraw(true); addRow();
    };
    byId('spRemove').onclick = function () {
      if (!load) { msg.textContent = 'There is no load on the spring.'; return; }
      load -= 50; redraw(true);
      if (tbody.lastChild) tbody.removeChild(tbody.lastChild);
    };
    byId('spReset').onclick = function () { load = 0; tbody.innerHTML = ''; redraw(true); };
    redraw(false);
  })();

  /* ---------------- unit check ---------------- */
  P.Q.set(document.getElementById('qs'), P.data.questions, {});
})();
