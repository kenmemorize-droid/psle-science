/* P3 Magnets focus: the floating globe. Build the set-up, test the four answer choices, then the questions. */
(function () {
  'use strict';
  var P = window.PSLE; if (!P) return;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }

  var TYPES = [['magnet', 'Magnet'], ['magnetic', 'Magnetic material'], ['non', 'Non-magnetic material']];
  var cfg = { stand: 'magnet', globe: 'magnetic' };
  var side = 'K', showPoles = false, dy = 0, touched = false;
  var FLOAT = -55;

  /* two magnets: unlike poles meet with side K up (attract), like poles meet once flipped (repel) */
  function force(stand, globe, s) {
    if (stand === 'magnet' && globe === 'magnet') return s === 'K' ? 'attract' : 'repel';
    if ((stand === 'magnet' && globe === 'magnetic') || (stand === 'magnetic' && globe === 'magnet')) return 'attract';
    return 'none';
  }
  var OUT = {
    attract: { icon: '↓', word: 'Attract (pull)', res: 'the globe is pulled onto the stand and rests.' },
    repel: { icon: '↑', word: 'Repel (push)', res: 'the globe is pushed away and floats.' },
    none: { icon: '○', word: 'No magnetic force', res: 'the globe simply rests on the stand.' }
  };
  function settleDy() { return force(cfg.stand, cfg.globe, side) === 'repel' ? FLOAT : 0; }

  function buildSeg(id, key) {
    var box = $(id); box.innerHTML = '';
    TYPES.forEach(function (t) {
      var b = el('button', null, t[1]);
      b.type = 'button'; b.setAttribute('data-v', t[0]);
      b.addEventListener('click', function () { cfg[key] = t[0]; render(true); });
      box.appendChild(b);
    });
  }
  function pole(rectId, txtId, p, on) {
    $(rectId).classList.toggle('hidden', !on);
    $(txtId).classList.toggle('hidden', !on);
    if (on) { $(rectId).setAttribute('class', 's ' + (p === 'N' ? 'pole-N' : 'pole-S')); $(txtId).textContent = p + ' pole'; }
  }
  function applyDy() {
    $('globeG').setAttribute('transform', 'translate(0,' + dy + ')');
    $('globeG').setAttribute('aria-valuenow', String(Math.round(-dy)));
    $('gHint').classList.toggle('hidden', dy < -4 || touched);
  }
  function render(settle) {
    [['standSeg', 'stand'], ['globeSeg', 'globe']].forEach(function (p) {
      var bs = $(p[0]).children;
      for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-v') === cfg[p[1]] ? 'true' : 'false');
    });
    $('topLbl').textContent = 'Top face: side ' + side;
    $('botLbl').textContent = 'Bottom face: side ' + (side === 'K' ? 'L' : 'K');
    var sm = cfg.stand === 'magnet', gm = cfg.globe === 'magnet';
    pole('topPole', 'topPoleT', side === 'K' ? 'N' : 'S', showPoles && sm);
    pole('botPole', 'botPoleT', side === 'K' ? 'S' : 'N', showPoles && sm);
    pole('gPole', 'gPoleT', 'S', showPoles && gm);

    var lines = $('outLines'); lines.innerHTML = '';
    ['K', 'L'].forEach(function (s) {
      var o = OUT[force(cfg.stand, cfg.globe, s)];
      lines.appendChild(el('div', 'line', '<b>Side ' + s + ' up:</b> ' + o.icon + ' ' + o.word + ' — ' + o.res));
    });
    var restK = force(cfg.stand, cfg.globe, 'K') !== 'repel', floatL = force(cfg.stand, cfg.globe, 'L') === 'repel';
    var mc = $('matchChips'); mc.innerHTML = '';
    mc.appendChild(el('span', 'chip ' + (restK ? 'ok' : 'no'), (restK ? '✓' : '✗') + ' Side K up: rests'));
    mc.appendChild(el('span', 'chip ' + (floatL ? 'ok' : 'no'), (floatL ? '✓' : '✗') + ' Side L up: floats'));
    var v = $('verdict');
    if (restK && floatL) { v.className = 'verdict ok'; v.textContent = '✓ This set-up gives both of Ms Tan’s observations.'; }
    else {
      v.className = 'verdict no';
      v.textContent = '✗ This set-up cannot give both observations. ' + (!floatL
        ? 'With side L up the globe would not float, because nothing pushes it.'
        : 'With side K up the globe would float, but Ms Tan saw it rest.');
    }
    var f = force(cfg.stand, cfg.globe, side), ar = $('arrow');
    if (f === 'none') ar.classList.add('hidden');
    else {
      ar.classList.remove('hidden');
      if (f === 'repel') {
        $('arrLine').setAttribute('y1', '265'); $('arrLine').setAttribute('y2', '205');
        $('arrHead').setAttribute('d', 'M337 215 L345 203 L353 215');
        $('arrTxt').textContent = 'push ↑';
      } else {
        $('arrLine').setAttribute('y1', '205'); $('arrLine').setAttribute('y2', '265');
        $('arrHead').setAttribute('d', 'M337 255 L345 267 L353 255');
        $('arrTxt').textContent = 'pull ↓';
      }
    }
    if (settle) { dy = settleDy(); applyDy(); }
  }

  buildSeg('standSeg', 'stand');
  buildSeg('globeSeg', 'globe');

  $('flipBtn').addEventListener('click', function () {
    var g = $('standG'); g.classList.add('flip');
    setTimeout(function () { side = side === 'K' ? 'L' : 'K'; render(true); g.classList.remove('flip'); }, 160);
  });
  $('poleBtn').addEventListener('click', function () {
    showPoles = !showPoles;
    this.setAttribute('aria-pressed', showPoles ? 'true' : 'false');
    this.textContent = 'Show poles: ' + (showPoles ? 'on' : 'off');
    render(false);
  });
  $('liftBtn').addEventListener('click', function () {
    touched = true; dy = -120; applyDy();
    setTimeout(function () { dy = settleDy(); applyDy(); }, 350);
  });

  /* drag or key the globe up and down */
  (function () {
    var g = $('globeG'), svg = $('globeSvg'), startY = 0, startDy = 0, active = false;
    function scale() { var r = svg.getBoundingClientRect(); return r.height ? 360 / r.height : 1; }
    g.addEventListener('pointerdown', function (e) {
      active = true; touched = true; startY = e.clientY; startDy = dy; g.classList.add('drag');
      try { g.setPointerCapture(e.pointerId); } catch (x) {}
      e.preventDefault();
    });
    g.addEventListener('pointermove', function (e) {
      if (!active) return;
      dy = Math.max(-150, Math.min(0, startDy + (e.clientY - startY) * scale()));
      applyDy();
    });
    function end() { if (!active) return; active = false; g.classList.remove('drag'); dy = settleDy(); applyDy(); }
    g.addEventListener('pointerup', end);
    g.addEventListener('pointercancel', end);
    g.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') { touched = true; dy = Math.max(-150, dy - 20); applyDy(); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { dy = Math.min(0, dy + 20); applyDy(); e.preventDefault(); }
      else if (e.key === 'Enter' || e.key === ' ') { dy = settleDy(); applyDy(); e.preventDefault(); }
    });
    g.addEventListener('blur', function () { dy = settleDy(); applyDy(); });
  })();

  /* load each answer choice into the lab */
  var TESTS = [
    { n: '(1) Only the stand is a magnet', stand: 'magnet', globe: 'magnetic', note: 'Loaded: stand = magnet, globe = magnetic material. Try the other reading too, with the globe set to non-magnetic. Neither reading gives a push with side L up.' },
    { n: '(2) Only the globe is made of a magnetic material', stand: 'non', globe: 'magnetic', note: 'Loaded: stand = non-magnetic, globe = magnetic material. Nothing pushes or pulls.' },
    { n: '(3) Both are made of magnetic materials', stand: 'magnetic', globe: 'magnetic', note: 'Loaded: both = magnetic material that is not a magnet. Magnetic materials do not act on each other, so nothing happens. Now set both to Magnet: that works. So (3) fits only if “made of magnetic materials” is read as “made of iron or steel that has become magnets”.' },
    { n: '(4) Stand non-magnetic, globe a magnet', stand: 'non', globe: 'magnet', note: 'Loaded: stand = non-magnetic, globe = magnet. A non-magnetic stand gives no force at all.' },
    { n: 'Both are magnets (not one of the four choices)', stand: 'magnet', globe: 'magnet', note: 'Loaded: both are magnets. Side K up: unlike poles meet, so they attract and the globe rests. Flip the stand: like poles meet, so they repel and the globe floats. This is the only set-up that gives both observations.' }
  ];
  (function () {
    var box = $('tests');
    TESTS.forEach(function (t) {
      var b = el('button', 'testbtn', t.n); b.type = 'button';
      b.addEventListener('click', function () {
        cfg.stand = t.stand; cfg.globe = t.globe; side = 'K'; render(true);
        $('testNote').textContent = t.note; $('testNote').classList.remove('hidden');
        $('see-it').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      box.appendChild(b);
    });
  })();

  render(true);
  P.Q.set(document.getElementById('qs'), P.data.questions, {});
})();
