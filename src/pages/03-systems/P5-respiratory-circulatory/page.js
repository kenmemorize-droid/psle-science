/* P5 Breathing and blood: tap-a-part diagram, breathing bars, blood loop step-through, unit check. */
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
    var t = el('text', { x: x, y: y, class: cls || 'plab', 'text-anchor': anchor || 'start' }, parent);
    t.textContent = s; return t;
  }
  function byId(id) { return document.getElementById(id); }

  /* ---------------- 1. Tap each part ---------------- */
  (function parts() {
    var svg = byId('bodySvg'); if (!svg) return;
    var nameEl = byId('partName'), textEl = byId('partText');
    var INFO = {
      nose: ['Nose', 'Takes in air, and filters, warms and moistens it before it goes down the windpipe.'],
      windpipe: ['Windpipe', 'A tube that carries air between the nose and the lungs. No oxygen passes into the blood here.'],
      lungs: ['Lungs', 'Where oxygen passes from the air into the blood, and carbon dioxide passes from the blood into the air.'],
      heart: ['Heart', 'Pumps blood around the body. It is part of the circulatory system, not the respiratory system.'],
      vessels: ['Blood vessels', 'Tubes that carry blood to every part of the body. They do not pump: the heart does that.'],
      cells: ['Body cells', 'Use the oxygen to release energy from digested food, and make carbon dioxide, which the blood carries away.']
    };
    var g = el('g', {}, svg);
    el('ellipse', { cx: 210, cy: 240, rx: 130, ry: 160, class: 'skin' }, g);
    el('circle', { cx: 210, cy: 58, r: 40, class: 'skin' }, g);

    function part(id, build, labelX, labelY, labelText, anchor) {
      var gg = el('g', { class: 'part', tabindex: 0, role: 'button', 'aria-pressed': 'false', 'aria-label': INFO[id][0] }, g);
      build(gg);
      txt(gg, labelX, labelY, labelText, 'plab', anchor);
      function choose() {
        Array.prototype.forEach.call(svg.querySelectorAll('.part'), function (p) { p.setAttribute('aria-pressed', 'false'); });
        gg.setAttribute('aria-pressed', 'true');
        nameEl.innerHTML = '<b>' + P.esc(INFO[id][0]) + '</b>';
        textEl.textContent = INFO[id][1];
      }
      gg.addEventListener('click', choose);
      gg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
      return gg;
    }
    part('nose', function (p) { el('path', { d: 'M210 70 l-12 22 h24 z', class: 'pshape', fill: 'var(--soil)' }, p); }, 258, 80, 'nose');
    part('windpipe', function (p) { el('line', { x1: 210, y1: 96, x2: 210, y2: 168, class: 'tube' }, p); }, 258, 140, 'windpipe');
    part('lungs', function (p) {
      el('ellipse', { cx: 158, cy: 212, rx: 44, ry: 60, class: 'pshape lung' }, p);
      el('ellipse', { cx: 262, cy: 212, rx: 44, ry: 60, class: 'pshape lung' }, p);
      el('line', { x1: 210, y1: 168, x2: 178, y2: 186, class: 'tube' }, p);
      el('line', { x1: 210, y1: 168, x2: 242, y2: 186, class: 'tube' }, p);
    }, 62, 170, 'lungs');
    part('heart', function (p) { el('path', { d: 'M210 266 c-26 -26 -46 -6 -34 14 c9 15 26 24 34 30 c8 -6 25 -15 34 -30 c12 -20 -8 -40 -34 -14 z', class: 'pshape heart' }, p); }, 258, 290, 'heart');
    part('vessels', function (p) {
      el('path', { d: 'M196 310 C150 330 140 352 150 372', class: 'vessel' }, p);
      el('path', { d: 'M224 310 C270 330 280 352 270 372', class: 'vessel' }, p);
    }, 408, 352, 'blood vessels', 'end');
    part('cells', function (p) {
      [150, 186, 222, 258].forEach(function (x) { el('rect', { x: x - 14, y: 378, width: 28, height: 22, rx: 5, class: 'pshape cells' }, p); });
    }, 210, 422, 'body cells', 'middle');
  })();

  /* ---------------- 2. Air in, air out ---------------- */
  (function breathing() {
    var svg = byId('lungSvg'); if (!svg) return;
    var msg = byId('brMsg');
    var GAS = [
      { k: 'Nitrogen', cls: '', inn: 78, out: 78, note: 'unchanged' },
      { k: 'Oxygen', cls: 'o2', inn: 21, out: 16, note: 'less' },
      { k: 'Carbon dioxide', cls: 'co2', inn: 1, out: 4, note: 'more' },
      { k: 'Water vapour', cls: 'wv', inn: 1, out: 6, note: 'more' }
    ];
    function bars(host, key) {
      host.innerHTML = GAS.map(function (gsp) {
        var v = gsp[key];
        return '<div class="gbar"><span>' + P.esc(gsp.k) + '</span><span class="track"><span class="fill ' + gsp.cls + '" style="width:' + v + '%"></span></span><b>' + v + '%</b></div>';
      }).join('');
    }
    bars(byId('barsIn'), 'inn'); bars(byId('barsOut'), 'out');

    var g = el('g', {}, svg);
    el('line', { x1: 210, y1: 30, x2: 210, y2: 108, class: 'tube' }, g);
    txt(g, 226, 64, 'windpipe');
    var left = el('ellipse', { cx: 150, cy: 180, rx: 50, ry: 62, class: 'pshape lung' }, g);
    var right = el('ellipse', { cx: 270, cy: 180, rx: 50, ry: 62, class: 'pshape lung' }, g);
    el('line', { x1: 210, y1: 108, x2: 172, y2: 132, class: 'tube' }, g);
    el('line', { x1: 210, y1: 108, x2: 248, y2: 132, class: 'tube' }, g);
    var dots = el('g', {}, g);
    var raf = null;
    function setSize(scale, cb) {
      var t0 = null, from = parseFloat(left.getAttribute('rx')), toR = 50 * scale, fromY = parseFloat(left.getAttribute('ry')), toY = 62 * scale;
      if (raf) cancelAnimationFrame(raf);
      function frame(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / 900);
        var rx = from + (toR - from) * p, ry = fromY + (toY - fromY) * p;
        [left, right].forEach(function (n) { n.setAttribute('rx', rx); n.setAttribute('ry', ry); });
        if (p < 1) raf = requestAnimationFrame(frame); else { raf = null; if (cb) cb(); }
      }
      raf = requestAnimationFrame(frame);
    }
    function flow(down) {
      while (dots.firstChild) dots.removeChild(dots.firstChild);
      for (var i = 0; i < 6; i++) {
        var c = el('circle', { cx: 210, cy: down ? 30 + i * 14 : 108 - i * 14, r: 5, fill: 'var(--sim-1)' }, dots);
        var a = el('animate', { attributeName: 'cy', from: down ? 24 : 112, to: down ? 112 : 24, dur: '0.9s', begin: (i * 0.1) + 's', fill: 'freeze' }, c);
        if (a.beginElement) { try { a.beginElement(); } catch (e) {} }
      }
    }
    byId('brIn').onclick = function () {
      flow(true); setSize(1.18);
      msg.textContent = 'Breathing in: air travels nose → windpipe → lungs. In the lungs, oxygen passes into the blood.';
    };
    byId('brOut').onclick = function () {
      flow(false); setSize(1);
      msg.textContent = 'Breathing out: the air leaving has less oxygen, more carbon dioxide and more water vapour than the air that went in.';
    };
  })();

  /* ---------------- 3. Follow one drop of blood ---------------- */
  (function loop() {
    var svg = byId('loopSvg'); if (!svg) return;
    var stepEl = byId('loopStep'), next = byId('loopNext'), back = byId('loopBack');
    var g = el('g', {}, svg);
    var HEART = { x: 220, y: 160 }, LUNG = { x: 220, y: 54 }, CELL = { x: 220, y: 266 };
    el('path', { d: 'M196 140 C120 120 120 70 186 58', class: 'vessel' }, g);
    el('path', { d: 'M254 58 C320 70 320 120 244 140', class: 'vessel' }, g);
    el('path', { d: 'M244 182 C320 202 320 252 254 264', class: 'vessel' }, g);
    el('path', { d: 'M186 264 C120 252 120 202 196 182', class: 'vessel' }, g);
    el('ellipse', { cx: LUNG.x, cy: LUNG.y, rx: 62, ry: 30, class: 'pshape lung' }, g);
    txt(g, LUNG.x, LUNG.y + 5, 'LUNGS', 'plab', 'middle');
    el('rect', { x: HEART.x - 46, y: HEART.y - 26, width: 92, height: 52, rx: 10, class: 'pshape heart' }, g);
    txt(g, HEART.x, HEART.y + 5, 'HEART', 'plab', 'middle').setAttribute('fill', 'var(--card)');
    el('rect', { x: CELL.x - 62, y: CELL.y - 26, width: 124, height: 52, rx: 10, class: 'pshape cells' }, g);
    txt(g, CELL.x, CELL.y + 5, 'BODY CELLS', 'plab', 'middle');
    var drop = el('circle', { cx: HEART.x, cy: HEART.y - 44, r: 9, class: 'dropCO2' }, g);
    var tag = txt(g, HEART.x + 16, HEART.y - 18, '', 'plab');

    var STEPS = [
      { at: HEART, o2: false, text: '<b>Step 1.</b> Blood with <b>more carbon dioxide</b> arrives back at the heart from the body.' },
      { at: LUNG, o2: false, text: '<b>Step 2.</b> The heart pumps it to the <b>lungs</b>. Here carbon dioxide passes out of the blood and into the air you breathe out.' },
      { at: LUNG, o2: true, text: '<b>Step 3.</b> At the same time <b>oxygen</b> passes from the air into the blood. The blood now has more oxygen and less carbon dioxide.' },
      { at: HEART, o2: true, text: '<b>Step 4.</b> The blood returns to the <b>heart</b>, which pumps it out to the rest of the body.' },
      { at: CELL, o2: true, text: '<b>Step 5.</b> At the <b>body cells</b>, oxygen leaves the blood. The cells use it to release energy from digested food.' },
      { at: CELL, o2: false, text: '<b>Step 6.</b> The cells make <b>carbon dioxide</b>, which passes into the blood. The blood carries it back to the heart, and the loop starts again.' }
    ];
    var i = -1;
    function paint() {
      if (i < 0) {
        drop.setAttribute('cx', HEART.x); drop.setAttribute('cy', HEART.y - 44);
        drop.setAttribute('class', 'dropCO2'); tag.textContent = '';
        stepEl.innerHTML = '<b>Step 0.</b> Press <b>Next step</b> to send one drop of blood round the loop.';
      } else {
        var s = STEPS[i];
        drop.setAttribute('cx', s.at.x); drop.setAttribute('cy', s.at.y - 38);
        drop.setAttribute('class', s.o2 ? 'dropO2' : 'dropCO2');
        tag.setAttribute('x', s.at.x + 16); tag.setAttribute('y', s.at.y - 42);
        tag.textContent = s.o2 ? 'more oxygen' : 'more carbon dioxide';
        stepEl.innerHTML = s.text;
      }
      back.disabled = i < 0;
      next.disabled = i >= STEPS.length - 1;
      next.textContent = i >= STEPS.length - 1 ? 'End of the loop' : 'Next step';
    }
    next.onclick = function () { if (i < STEPS.length - 1) { i++; paint(); } };
    back.onclick = function () { if (i >= 0) { i--; paint(); } };
    byId('loopReset').onclick = function () { i = -1; paint(); };
    paint();
  })();

  /* ---------------- unit check ---------------- */
  P.Q.set(document.getElementById('qs'), P.data.questions, {});
})();
