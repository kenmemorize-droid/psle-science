/* P4 Light unit: knowledge cards, four Explore stations, Beyond toggle, unit check. */
(function () {
  'use strict';
  var P = window.PSLE, $ = P.$, $$ = P.$$;

  if (window.matchMedia && matchMedia('(max-width: 640px)').matches)
    $$('#know details.kcard').forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });

  function f1(x) { return (Math.round(x * 10) / 10).toString(); }
  function arrow(x1, y1, x2, y2, cls) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    var bx = x2 - ux * 11, by = y2 - uy * 11, px = -uy * 5.5, py = ux * 5.5;
    return '<line class="ray' + (cls ? ' ' + cls : '') + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) + '"/>' +
      '<polygon class="raytip" points="' + x2 + ',' + y2 + ' ' + (bx + px).toFixed(1) + ',' + (by + py).toFixed(1) + ' ' + (bx - px).toFixed(1) + ',' + (by - py).toFixed(1) + '"/>';
  }
  function eye(cx, cy, look) {
    var px = look === 'up' ? cx : cx - 7, py = look === 'up' ? cy - 5 : cy;
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="22" ry="13" style="fill:var(--card);stroke:var(--stroke);stroke-width:2.5"/>' +
      '<circle cx="' + px + '" cy="' + py + '" r="6" style="fill:var(--stroke)"/>';
  }
  function txt(x, y, s, anchor) { return '<text class="lbl sm" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  function press(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)); }); }

  /* ---------- E1 · source of light or not? ---------- */
  var SRC = 'It gives off its own light.', REF = 'It gives off no light of its own. It is seen only because it reflects light into our eyes.';
  P.widgets.classify($('#classify'), {
    prompt: 'Tap a card, then tap the group it belongs in.',
    bins: [{ id: 's', label: 'Source of light' }, { id: 'n', label: 'Not a source of light' }],
    items: [
      { id: 'sun', label: 'the Sun', bin: 's', why: SRC },
      { id: 'star', label: 'a star', bin: 's', why: SRC },
      { id: 'lightning', label: 'lightning', bin: 's', why: SRC },
      { id: 'firefly', label: 'a firefly', bin: 's', why: SRC },
      { id: 'candle', label: 'a lit candle', bin: 's', why: 'Its flame gives off its own light.' },
      { id: 'lamp', label: 'a switched-on table lamp', bin: 's', why: SRC },
      { id: 'moon', label: 'the Moon', bin: 'n', why: 'The Moon reflects light from the Sun. It gives off no light of its own.' },
      { id: 'mirror', label: 'a mirror', bin: 'n', why: REF },
      { id: 'bird', label: 'a bird in sunlight', bin: 'n', why: REF },
      { id: 'book', label: 'a book', bin: 'n', why: REF },
      { id: 'torch', label: 'a switched-off torch', bin: 'n', why: 'A torch is a source of light only while it is switched on.' },
      { id: 'spoon', label: 'a shiny spoon', bin: 'n', why: 'Shiny things look bright because they reflect a lot of light, but they give off none of their own.' }
    ]
  });

  /* ---------- E2a · the room ---------- */
  var lampOn = true;
  function drawRoom() {
    var h = '';
    if (lampOn) h += '<circle class="beam" cx="90" cy="78" r="46"/>';
    h += '<line class="ln" x1="90" y1="86" x2="90" y2="170"/><rect class="sl" x="70" y="168" width="40" height="8" rx="2"/>' +
      '<path class="sl" d="M60 70 L120 70 L105 40 L75 40 Z"/>' +
      '<circle cx="90" cy="78" r="9" style="stroke:var(--stroke);stroke-width:2;fill:' + (lampOn ? 'var(--hl)' : 'var(--fc)') + '"/>' +
      '<line class="ln" x1="200" y1="170" x2="390" y2="170"/><line class="ln" x1="215" y1="170" x2="215" y2="205"/><line class="ln" x1="375" y1="170" x2="375" y2="205"/>' +
      '<rect class="' + (lampOn ? 'sl fb2' : 'unseen') + '" x="255" y="140" width="70" height="30" rx="2"/>' +
      eye(470, 110);
    if (lampOn) h += arrow(102, 86, 262, 140) + arrow(318, 140, 446, 114);
    h += txt(90, 200, 'lamp') + txt(290, 192, 'book') + txt(470, 140, 'eye');
    $('#roomSvg').innerHTML = h;
    $('#roomMsg').innerHTML = lampOn
      ? 'Light from the lamp is <b>reflected</b> by the book <b>into the eye</b>, so the book is seen.'
      : 'No light reaches the book, so none is reflected into the eye. <b>The book cannot be seen.</b> In complete darkness nothing can be seen.';
    var b = $('#lampBtn'); b.setAttribute('aria-pressed', String(lampOn)); b.textContent = lampOn ? 'Lamp on' : 'Lamp off';
  }
  $('#lampBtn').addEventListener('click', function () { lampOn = !lampOn; drawRoom(); });
  drawRoom();

  /* ---------- E2b · around a corner with two mirrors ---------- */
  var mirrors = false;
  function drawCorner() {
    var h = '<path class="sl fb2" d="M70 172 Q100 136 130 172 Z"/><path class="ln" d="M100 172 V200 q0 8 -8 8"/>' +
      '<rect class="sl" x="220" y="80" width="110" height="135"/>' + txt(275, 152, 'wall') + eye(460, 180, 'up') +
      txt(100, 128, 'umbrella') + txt(460, 210, 'eye');
    if (mirrors) {
      h += '<line x1="88" y1="62" x2="112" y2="38" style="stroke:var(--primary);stroke-width:6;stroke-linecap:round"/>' +
        '<line x1="448" y1="38" x2="472" y2="62" style="stroke:var(--primary);stroke-width:6;stroke-linecap:round"/>' +
        txt(72, 30, 'mirror 1', 'start') + txt(488, 30, 'mirror 2', 'end') +
        arrow(100, 140, 100, 58) + arrow(108, 50, 444, 50) + arrow(460, 58, 460, 162);
    } else {
      h += arrow(134, 176, 216, 176, 'dash') + '<text class="lbl" x="206" y="168" text-anchor="end">✗</text>' + arrow(100, 136, 100, 24, 'dash');
    }
    $('#cornerSvg').innerHTML = h;
    $('#cornerMsg').innerHTML = mirrors
      ? 'The two mirrors <b>reflect</b> light from the umbrella over the wall <b>into the eye</b>, so the umbrella can be seen.'
      : 'The wall blocks the straight path from the umbrella to the eye, so no light from the umbrella enters the eye. It cannot be seen.';
    var b = $('#mirrorBtn'); b.setAttribute('aria-pressed', String(mirrors)); b.textContent = mirrors ? 'Take the mirrors out' : 'Put the mirrors in';
  }
  $('#mirrorBtn').addEventListener('click', function () { mirrors = !mirrors; drawCorner(); });
  drawCorner();

  /* ---------- E3 · three cards with holes ---------- */
  function drawHoles(off) {
    var h = '', ok = Math.abs(off) < 4;
    [[160, 0], [270, off], [380, 0]].forEach(function (c, i) {
      var x = c[0], y = 100 + c[1];
      h += '<rect class="sl" x="' + (x - 11) + '" y="10" width="22" height="' + (y - 12 - 10) + '"/>' +
        '<rect class="sl" x="' + (x - 11) + '" y="' + (y + 12) + '" width="22" height="' + (190 - y - 12) + '"/>' +
        txt(x, 198, ['P', 'Q', 'R'][i]);
    });
    h += '<rect x="474" y="104" width="14" height="46" rx="2" style="fill:var(--sim-3);stroke:var(--stroke);stroke-width:2"/>' +
      '<path d="M481 102 q-8 -14 0 -26 q8 12 0 26 z" style="fill:var(--hl);stroke:var(--stroke);stroke-width:2"/>' + eye(40, 100);
    h += ok ? arrow(466, 100, 64, 100, 'dash') : arrow(466, 100, 283, 100, 'dash');
    $('#holesSvg').innerHTML = h;
    $('#holesMsg').innerHTML = ok
      ? 'The holes are in a <b>straight line</b>, so light from the candle reaches the eye. The candle can be seen.'
      : 'Card Q is out of line. Light travels in <b>straight lines</b> and cannot bend through the holes, so card Q blocks it. The candle cannot be seen.';
  }
  $('#holeSlide').addEventListener('input', function () { drawHoles(+this.value); });
  drawHoles(0);

  /* ---------- E4 · shadow lab ---------- */
  var lab = { obj: 'plate', turn: 'face', mat: 'none', size: 'small', d1: 20, d2: 30, trials: [] };
  var OBJ_NAME = { plate: 'Round plate', card: 'Square card', can: 'Can' };
  var MAT_NAME = { none: 'lets no light through', some: 'lets some light through', most: 'lets most light through' };
  var DARK = { none: 0.85, some: 0.4, most: 0.08 };
  function geom() {
    var big = lab.size === 'big', o = lab.obj, face = lab.turn === 'face';
    if (o === 'plate') { var D = big ? 8 : 5; return face ? { h: D, w: D, shape: 'circle' } : { h: D, w: 0.5, shape: 'thin bar' }; }
    if (o === 'card') { var s = big ? 8 : 5; return face ? { h: s, w: s, shape: 'square' } : { h: s, w: 0.3, shape: 'thin bar' }; }
    var H = big ? 10 : 6, d = big ? 6 : 4;
    return face ? { h: H, w: d, shape: 'rectangle', H: H, d: d } : { h: d, w: d, shape: 'circle', H: H, d: d };
  }
  function turnLabels() {
    $('#turnFace').textContent = lab.obj === 'can' ? 'Side-on' : 'Face-on';
    $('#turnEdge').textContent = lab.obj === 'can' ? 'End-on' : 'Edge-on';
  }
  function drawLab() {
    var g = geom(), f = (lab.d1 + lab.d2) / lab.d1, SH = g.h * f, SW = g.w * f;
    var ox = 30 + 4 * lab.d1, sx = 30 + 4 * (lab.d1 + lab.d2), oh = g.h * 1.5, sh = SH * 1.5, op = DARK[lab.mat];
    var objOp = lab.mat === 'none' ? 1 : lab.mat === 'some' ? 0.5 : 0.18;
    var h = '<polygon class="beam" points="34,130 ' + sx + ',14 ' + sx + ',246"/>' +
      '<polygon class="shadowfill" style="opacity:' + (op * 0.6).toFixed(2) + '" points="' + ox + ',' + (130 - oh) + ' ' + sx + ',' + (130 - sh) + ' ' + sx + ',' + (130 + sh) + ' ' + ox + ',' + (130 + oh) + '"/>' +
      '<line class="ray dash" style="stroke-width:1.5" x1="34" y1="130" x2="' + sx + '" y2="' + (130 - sh).toFixed(1) + '"/>' +
      '<line class="ray dash" style="stroke-width:1.5" x1="34" y1="130" x2="' + sx + '" y2="' + (130 + sh).toFixed(1) + '"/>' +
      '<rect class="sl fb2" x="8" y="118" width="26" height="24" rx="4"/>' +
      '<line class="ln" x1="' + sx + '" y1="12" x2="' + sx + '" y2="248" style="stroke-width:5"/>';
    var st = 'style="fill-opacity:' + objOp + '"';
    if (lab.obj === 'plate' || lab.obj === 'card') {
      if (lab.turn === 'face') h += '<rect class="sl fb2" ' + st + ' x="' + (ox - 2) + '" y="' + (130 - oh) + '" width="4" height="' + (2 * oh) + '"/>';
      else if (lab.obj === 'plate') h += '<circle class="sl fb2" ' + st + ' cx="' + ox + '" cy="130" r="' + oh + '"/>';
      else h += '<rect class="sl fb2" ' + st + ' x="' + (ox - oh) + '" y="' + (130 - oh) + '" width="' + (2 * oh) + '" height="' + (2 * oh) + '"/>';
    } else if (lab.turn === 'face') h += '<rect class="sl fb2" ' + st + ' x="' + (ox - g.d * 0.75) + '" y="' + (130 - oh) + '" width="' + (g.d * 1.5) + '" height="' + (2 * oh) + '" rx="3"/>';
    else h += '<rect class="sl fb2" ' + st + ' x="' + ox + '" y="' + (130 - oh) + '" width="' + (g.H * 4) + '" height="' + (2 * oh) + '" rx="3"/>';
    h += txt(21, 160, 'torch') + txt(ox, Math.min(252, 130 + oh + 16), 'object') + txt(sx - 6, 254, 'screen', 'end') +
      txt((34 + ox) / 2, 26, lab.d1 + ' cm') + txt((ox + sx) / 2, 26, lab.d2 + ' cm');
    $('#labSide').innerHTML = h;

    var fh = '<rect x="10" y="10" width="180" height="240" rx="6" style="fill:var(--card);stroke:var(--stroke);stroke-width:2"/>', H2 = SH * 1.8, W2 = Math.max(SW * 1.8, 3);
    var fs = 'class="shadowfill" style="opacity:' + op + '"';
    if (g.shape === 'circle') fh += '<ellipse ' + fs + ' cx="100" cy="130" rx="' + (W2 / 2) + '" ry="' + (H2 / 2) + '"/>';
    else fh += '<rect ' + fs + ' x="' + (100 - W2 / 2) + '" y="' + (130 - H2 / 2) + '" width="' + W2 + '" height="' + H2 + '"/>';
    fh += txt(100, 244, 'the screen, from the front');
    $('#labFace').innerHTML = fh;

    var dark = lab.mat === 'none' ? 'a <b>dark</b> shadow' : lab.mat === 'some' ? 'a <b>lighter</b> shadow' : '<b>almost no shadow</b>';
    $('#labMsg').innerHTML = 'Shadow: <b>' + g.shape + '</b>, <b>' + f1(SH) + ' cm</b> tall. The object ' + MAT_NAME[lab.mat] + ', so it makes ' + dark + '.';
    $('#d1Out').textContent = lab.d1; $('#d2Out').textContent = lab.d2;
  }
  function drawTrials() {
    $('#trialLog tbody').innerHTML = lab.trials.map(function (t, i) {
      return '<tr><td>' + (i + 1) + '</td><td class="rowname">' + t.obj + '</td><td>' + t.turn + '</td><td>' + t.mat + '</td><td>' + t.size + '</td><td>' + t.d1 + '</td><td>' + t.d2 + '</td><td>' + t.shadow + '</td></tr>';
    }).join('');
  }
  $('#explore').addEventListener('click', function (e) {
    var b = e.target.closest('[data-obj],[data-turn],[data-mat],[data-size]'); if (!b) return;
    ['obj', 'turn', 'mat', 'size'].forEach(function (k) {
      var v = b.getAttribute('data-' + k); if (v == null) return;
      lab[k] = v; press('[data-' + k + ']', 'data-' + k, v);
    });
    turnLabels(); drawLab();
  });
  $('#d1').addEventListener('input', function () { lab.d1 = +this.value; drawLab(); });
  $('#d2').addEventListener('input', function () { lab.d2 = +this.value; drawLab(); });
  $('#recBtn').addEventListener('click', function () {
    var g = geom(), f = (lab.d1 + lab.d2) / lab.d1;
    lab.trials.push({ obj: OBJ_NAME[lab.obj], turn: lab.obj === 'can' ? (lab.turn === 'face' ? 'side-on' : 'end-on') : (lab.turn === 'face' ? 'face-on' : 'edge-on'),
      mat: lab.mat === 'none' ? 'no light' : lab.mat === 'some' ? 'some light' : 'most light', size: lab.size, d1: lab.d1, d2: lab.d2,
      shadow: (lab.mat === 'most' ? 'almost none' : (lab.mat === 'some' ? 'lighter ' : 'dark ') + g.shape + ', ' + f1(g.h * f) + ' cm tall') });
    drawTrials();
  });
  $('#clearBtn').addEventListener('click', function () { lab.trials = []; drawTrials(); });
  turnLabels(); drawLab();

  /* ---------- Beyond syllabus · shadow length through the day ---------- */
  var T = ['8 am', '10 am', '12 pm', '3 pm', '5 pm'], ELEV = [20, 50, 85, 50, 20];
  function drawSun(i) {
    var e = ELEV[i] * Math.PI / 180, left = i < 2, mid = i === 2;
    var sx = mid ? 270 : (left ? 270 - 150 * Math.cos(e) : 270 + 150 * Math.cos(e)), sy = 180 - 150 * Math.sin(e);
    var L = Math.min(240, 80 / Math.tan(e)), tip = left ? 270 + L : 270 - L;
    var h = '<line class="ln" x1="10" y1="180" x2="530" y2="180"/>' + txt(14, 204, 'East', 'start') + txt(526, 204, 'West', 'end') +
      '<rect class="shadowfill" style="opacity:.55" x="' + Math.min(270, tip) + '" y="177" width="' + Math.max(2, Math.abs(tip - 270)) + '" height="7"/>' +
      '<rect class="sl fb2" x="266" y="100" width="8" height="80"/>' +
      '<line class="ray dash" style="stroke-width:1.5" x1="' + sx.toFixed(1) + '" y1="' + sy.toFixed(1) + '" x2="' + tip.toFixed(1) + '" y2="180"/>' +
      '<circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="14" style="fill:var(--hl);stroke:var(--stroke);stroke-width:2"/>' +
      txt(270, 214, T[i] + ': ' + (mid ? 'the Sun is high and the shadow is shortest' : 'the Sun is low and the shadow is long'));
    $('#sunSvg').innerHTML = h; $('#sunOut').textContent = T[i];
  }
  $('#sunT').addEventListener('input', function () { drawSun(+this.value); });
  drawSun(0);

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
