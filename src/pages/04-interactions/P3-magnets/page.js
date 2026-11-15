/* P3 Magnets unit: knowledge cards, four Explore stations, two Beyond toggles, unit check. */
(function () {
  'use strict';
  var P = window.PSLE, $ = P.$, $$ = P.$$;

  if (window.matchMedia && matchMedia('(max-width: 640px)').matches)
    $$('#know details.kcard').forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });

  function txt(x, y, s, anchor, cls) { return '<text class="lbl' + (cls == null ? ' sm' : cls ? ' ' + cls : '') + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  function press(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)); }); }
  function run(steps, ms, each, done) {   /* timer-driven animation: does not depend on animation frames */
    var i = 0; if (P.reduced) { each(steps, steps); if (done) done(); return null; }
    var id = setInterval(function () { i++; each(i, steps); if (i >= steps) { clearInterval(id); if (done) done(); } }, ms);
    return id;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* a bar magnet, poles labelled as well as coloured */
  function bar(x, y, w, h, left) {
    var l = left === 'N', hw = w / 2;
    return '<rect class="' + (l ? 'g-n' : 'g-s') + '" x="' + x.toFixed(1) + '" y="' + y + '" width="' + hw + '" height="' + h + '"/>' +
      '<rect class="' + (l ? 'g-s' : 'g-n') + '" x="' + (x + hw).toFixed(1) + '" y="' + y + '" width="' + hw + '" height="' + h + '"/>' +
      '<text class="g-pl" x="' + (x + hw / 2).toFixed(1) + '" y="' + (y + h / 2 + 6) + '" text-anchor="middle">' + (l ? 'N' : 'S') + '</text>' +
      '<text class="g-pl" x="' + (x + hw * 1.5).toFixed(1) + '" y="' + (y + h / 2 + 6) + '" text-anchor="middle">' + (l ? 'S' : 'N') + '</text>';
  }
  function clip(x, y) { return '<rect class="g-clip" x="' + (x - 3).toFixed(1) + '" y="' + y.toFixed(1) + '" width="6" height="15" rx="3"/>'; }
  function arrow(x1, x2, y) {
    var d = x2 > x1 ? -6 : 6;
    return '<path class="g-arrow" d="M' + x1 + ' ' + y + ' H' + x2 + ' M' + (x2 + d) + ' ' + (y - 5) + ' L' + x2 + ' ' + y + ' L' + (x2 + d) + ' ' + (y + 5) + '"/>';
  }

  /* ---------- E1 · push or pull ---------- */
  var aFlip = false, bFlip = false, broken = false, bX = 250, pTimer = null;
  function aLeft() { return aFlip ? 'S' : 'N'; }
  function aRight() { return aFlip ? 'N' : 'S'; }
  function bLeft() { return bFlip ? 'S' : 'N'; }
  function drawPoles(extra) {
    var s = '<path class="ln" d="M16 112 H404"/>';
    s += broken ? bar(30, 70, 66, 36, aLeft()) + bar(104, 70, 66, 36, aLeft()) : bar(30, 70, 140, 36, aLeft());
    s += bar(bX, 70, 140, 36, bFlip ? 'S' : 'N');
    s += txt(100, 132, broken ? 'magnet A, broken into two' : 'magnet A', 'middle', '') + txt(bX + 70, 132, 'magnet B', 'middle', '');
    $('#polesSvg').innerHTML = s + (extra || '');
  }
  function polesIdle() {
    if (pTimer) clearInterval(pTimer);
    bX = 250; drawPoles();
    $('#polesMsg').innerHTML = 'Facing each other: magnet A\'s <b>' + aRight() + '</b> pole and magnet B\'s <b>' + bLeft() + '</b> pole. ' +
      (broken ? 'Each piece of magnet A is a magnet with its own N and S poles. ' : '') + 'Press <b>Bring them together</b>.';
  }
  $('#flipA').addEventListener('click', function () { aFlip = !aFlip; polesIdle(); });
  $('#flipB').addEventListener('click', function () { bFlip = !bFlip; polesIdle(); });
  $('#breakA').addEventListener('click', function () {
    broken = !broken; this.textContent = broken ? 'Join magnet A again' : 'Break magnet A'; polesIdle();
    if (broken) $('#polesMsg').innerHTML = 'Magnet A broke into two pieces. <b>Each piece is a magnet with its own N and S poles.</b> The piece on the right still has a ' + aRight() + ' pole facing magnet B.';
  });
  $('#bring').addEventListener('click', function () {
    if (pTimer) clearInterval(pTimer);
    var attract = aRight() !== bLeft();
    pTimer = run(30, 40, function (i, n) {
      var t = i / n;
      bX = attract ? 250 - 80 * Math.min(1, t * 1.3) : (t < 0.5 ? 250 - 50 * (t / 0.5) : 200 + 90 * ((t - 0.5) / 0.5));
      drawPoles(t >= 1 ? (attract ? arrow(120, 160, 46) + arrow(220, 180, 46) + txt(170, 30, 'attract', 'middle', '') : arrow(150, 130, 46) + arrow(260, 290, 46) + txt(210, 30, 'repel', 'middle', '')) : '');
    }, function () {
      $('#polesMsg').innerHTML = attract
        ? 'Unlike poles (' + aRight() + ' and ' + bLeft() + ') are facing, so the magnets <b>attract</b>: they pull together.'
        : 'Like poles (' + aRight() + ' and ' + bLeft() + ') are facing, so the magnets <b>repel</b>: they push apart before they even touch.';
    });
  });
  polesIdle();

  var dipped = false;
  function drawDip() {
    var s = '<rect class="g-tray" x="60" y="150" width="300" height="30" rx="4"/>' + txt(210, 200, 'tray of steel paper clips', 'middle', '');
    var i, n = dipped ? 12 : 30;
    for (i = 0; i < n; i++) s += clip(76 + (i * 41) % 270, 152 + (i % 3) * 4);
    if (!dipped) return s + bar(110, 40, 200, 30, 'N');
    s += bar(110, 40, 200, 30, 'N');
    for (i = 0; i < 9; i++) { s += clip(116 + (i % 3) * 9, 72 + Math.floor(i / 3) * 16); s += clip(286 + (i % 3) * 9, 72 + Math.floor(i / 3) * 16); }
    s += clip(210, 72);
    return s + txt(126, 134, '9 clips', 'middle', '') + txt(210, 104, '1 clip', 'middle', '') + txt(296, 134, '9 clips', 'middle', '');
  }
  $('#dipBtn').addEventListener('click', function () {
    dipped = !dipped; this.textContent = dipped ? 'Put the clips back' : 'Dip the magnet into paper clips';
    $('#dipSvg').innerHTML = drawDip();
    $('#dipMsg').innerHTML = dipped ? 'About 9 clips cling to each end, and only 1 to the middle. <b>A magnet is strongest at its poles.</b>' : '';
  });
  $('#dipSvg').innerHTML = drawDip();

  /* ---------- E2 · what does a magnet attract? ---------- */
  var OBJ = [
    { id: 'nail', name: 'iron nail', on: true, w: 70, d: function (x, y) { return '<rect class="g-metal" x="' + x + '" y="' + (y - 3) + '" width="64" height="6"/><rect class="g-metal" x="' + (x + 62) + '" y="' + (y - 8) + '" width="6" height="16"/>'; } },
    { id: 'clip', name: 'steel paper clip', on: true, w: 40, d: function (x, y) { return '<rect class="g-clip" x="' + x + '" y="' + (y - 8) + '" width="38" height="16" rx="8"/><rect class="g-clip" x="' + (x + 6) + '" y="' + (y - 4) + '" width="26" height="8" rx="4"/>'; } },
    { id: 'scan', name: 'steel can', on: true, w: 44, d: function (x, y) { return '<rect class="g-metal" x="' + x + '" y="' + (y - 32) + '" width="44" height="64" rx="4"/><path class="ln" d="M' + x + ' ' + (y - 24) + ' h44 M' + x + ' ' + (y + 24) + ' h44"/>'; } },
    { id: 'spoon', name: 'steel spoon', on: true, w: 76, d: function (x, y) { return '<ellipse class="g-metal" cx="' + (x + 12) + '" cy="' + y + '" rx="12" ry="8"/><rect class="g-metal" x="' + (x + 22) + '" y="' + (y - 3) + '" width="54" height="6" rx="3"/>'; } },
    { id: 'acan', name: 'aluminium can', on: false, w: 44, d: function (x, y) { return '<rect class="g-metal" x="' + x + '" y="' + (y - 32) + '" width="44" height="64" rx="4"/><path class="ln" d="M' + x + ' ' + (y - 24) + ' h44 M' + x + ' ' + (y + 24) + ' h44"/>'; } },
    { id: 'foil', name: 'aluminium foil', on: false, w: 50, d: function (x, y) { return '<path class="g-metal" d="M' + x + ' ' + (y + 10) + ' l8 -22 l14 6 l10 -10 l18 14 l-6 18 l-16 6 l-14 -8 Z"/>'; } },
    { id: 'copper', name: 'copper wire', on: false, w: 60, d: function (x, y) { return '<path class="g-wire" d="M' + x + ' ' + y + ' q8 -14 15 0 t15 0 t15 0 t15 0"/>'; } },
    { id: 'ruler', name: 'wooden ruler', on: false, w: 90, d: function (x, y) { return '<rect class="g-wood" x="' + x + '" y="' + (y - 8) + '" width="90" height="16"/>'; } },
    { id: 'cup', name: 'plastic cup', on: false, w: 46, d: function (x, y) { return '<path class="g-plastic" d="M' + x + ' ' + (y - 30) + ' h46 l-6 60 h-34 Z"/>'; } },
    { id: 'marble', name: 'glass marble', on: false, w: 22, d: function (x, y) { return '<circle class="g-glass" cx="' + (x + 11) + '" cy="' + y + '" r="11"/>'; } }
  ];
  var objResults = [], oTimer = null;
  $('#objChips').innerHTML = OBJ.map(function (o) { return '<button type="button" class="chip-btn" data-o="' + o.id + '" aria-pressed="false">' + cap(o.name) + '</button>'; }).join('');
  function drawObj(o, t) {
    var ox = 300, mx = 30 + Math.min(1, t / 0.6) * (ox - 30 - 110 - 30), s = '<path class="ln" d="M16 120 H404"/>';
    if (o && o.on && t > 0.6) ox = ox - Math.min(1, (t - 0.6) / 0.3) * 30;
    s += bar(mx, 60, 110, 32, 'N') + txt(mx + 55, 52, 'magnet', 'middle', '');
    if (o) {
      s += o.d(ox, 76) + txt(ox + o.w / 2, 146, o.name, 'middle', '');
      if (t >= 1) s += txt(300 + o.w / 2, 30, o.on ? 'attracted' : 'not attracted', 'middle', '');
    }
    $('#objSvg').innerHTML = s;
  }
  function drawObjTable() {
    $('#objTable').innerHTML = objResults.length ? objResults.map(function (r) { return '<tr><th scope="row">' + cap(r[0]) + '</th><td>' + r[1] + '</td></tr>'; }).join('') : '<tr><td colspan="2" class="note-s">Nothing tested yet.</td></tr>';
  }
  $('#objChips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-o]'); if (!b) return;
    var o = OBJ.filter(function (x) { return x.id === b.getAttribute('data-o'); })[0];
    press('#objChips [data-o]', 'data-o', o.id);
    if (oTimer) clearInterval(oTimer);
    $('#objMsg').textContent = 'Bringing the magnet close…';
    oTimer = run(30, 40, function (i, n) { drawObj(o, i / n); }, function () {
      if (!objResults.some(function (r) { return r[0] === o.name; })) objResults.push([o.name, o.on ? 'attracted' : 'not attracted']);
      b.classList.add('done'); drawObjTable();
      var msg = 'The ' + o.name + (o.on ? ' is <b>attracted</b>: it is made of a magnetic material.' : ' is <b>not attracted</b>: it is made of a non-magnetic material.');
      if (o.id === 'acan' || o.id === 'foil' || o.id === 'copper') msg += ' <b>Not every metal is attracted. ' + (o.id === 'copper' ? 'Copper' : 'Aluminium') + ' is a metal, but it is not a magnetic material.</b>';
      $('#objMsg').innerHTML = msg;
    });
  });
  drawObj(null, 0); drawObjTable();

  P.widgets.classify($('#magSort'), {
    prompt: 'Tap an object, then tap the group it belongs in.',
    bins: [{ id: 'mag', label: 'Magnetic material' }, { id: 'non', label: 'Non-magnetic material' }],
    items: OBJ.map(function (o) {
      return { id: o.id, label: o.name, bin: o.on ? 'mag' : 'non', why: o.on ? 'It is made of iron or steel, which a magnet attracts.' : (/aluminium|copper/.test(o.name) ? 'It is a metal, but not a magnetic one. A magnet does not attract it.' : 'A magnet does not attract it.') };
    }).concat([
      { id: 'eraser', label: 'rubber eraser', bin: 'non', why: 'Rubber is not attracted by a magnet.' },
      { id: 'card', label: 'paper card', bin: 'non', why: 'Paper is not attracted by a magnet.' }
    ])
  });

  /* ---------- E3 · make a magnet ---------- */
  var sObj = 'steel', sWay = 'one', strokes = 0, power = 0, sTimer = null;
  function drawStroke(t, active) {
    var s = '<rect class="g-metal" x="70" y="70" width="280" height="12" rx="6"/>' + txt(210, 102, sObj === 'steel' ? 'steel knitting needle' : 'aluminium rod', 'middle', '');
    var mx = 70 + 200 * (sWay === 'back' ? (t < 0.5 ? t * 2 : 2 - t * 2) : t), pole = sWay === 'both' && t > 0.5 ? 'S' : 'N';
    s += bar(mx, 32, 80, 24, pole === 'N' ? 'S' : 'N');
    if (active) s += sWay === 'one' ? arrow(150, 290, 18) : sWay === 'back' ? arrow(200, 290, 18) + arrow(200, 110, 18) : arrow(150, 290, 18) + txt(330, 22, 'N, then S', 'start');
    var clips = 3 * power;
    for (var i = 0; i < clips; i++) s += clip(320 + (i % 4) * 8, 86 + Math.floor(i / 4) * 16);
    s += txt(336, 160, clips + ' paper clips', 'middle', '');
    $('#strokeSvg').innerHTML = s;
  }
  function strokeMsg() {
    if (!strokes) return 'Choose an object and a way to stroke, then press <b>Stroke ×10</b>.';
    if (sObj === 'alu') return 'Strokes so far: ' + strokes + '. 0 paper clips. <b>Aluminium is not a magnetic material, so it cannot be made into a magnet.</b>';
    if (sWay !== 'one') return 'Strokes so far: ' + strokes + '. 0 paper clips. <b>Stroking back and forth, or with both poles, undoes the work.</b> Stroke in one direction, with the same pole.';
    return 'Strokes so far: ' + strokes + '. The needle picks up <b>' + 3 * power + ' paper clips</b>. It has become a magnet.' + (power >= 4 ? ' More stroking won\'t make it any stronger.' : ' More strokes make it stronger.');
  }
  $$('[data-obj]').forEach(function (b) { b.addEventListener('click', function () { sObj = b.getAttribute('data-obj'); press('[data-obj]', 'data-obj', sObj); strokes = 0; power = 0; drawStroke(0, false); $('#strokeMsg').innerHTML = strokeMsg(); }); });
  $$('[data-way]').forEach(function (b) { b.addEventListener('click', function () { sWay = b.getAttribute('data-way'); press('[data-way]', 'data-way', sWay); drawStroke(0, false); }); });
  $('#strokeBtn').addEventListener('click', function () {
    if (sTimer) clearInterval(sTimer);
    sTimer = run(24, 45, function (i, n) { drawStroke(i / n, true); }, function () {
      strokes += 10;
      power = sObj === 'steel' && sWay === 'one' ? Math.min(4, power + 1) : 0;
      drawStroke(1, true); $('#strokeMsg').innerHTML = strokeMsg();
    });
  });
  $('#strokeReset').addEventListener('click', function () { strokes = 0; power = 0; drawStroke(0, false); $('#strokeMsg').innerHTML = strokeMsg(); });
  drawStroke(0, false); $('#strokeMsg').innerHTML = strokeMsg();

  var coils = 10, batt = 1, runs = [], eTimer = null;
  function drawEM(clips) {
    var s = '<rect class="g-metal" x="110" y="60" width="210" height="14" rx="2"/><path class="g-metal" d="M320 60 l18 7 l-18 7 Z"/>' + txt(150, 50, 'iron nail', 'middle', '');
    var loops = coils / 2, x0 = 140, x1 = 300, step = (x1 - x0) / loops;
    for (var i = 0; i < loops; i++) s += '<ellipse cx="' + (x0 + step * (i + 0.5)).toFixed(1) + '" cy="67" rx="' + Math.max(2, step / 2 - 0.5).toFixed(1) + '" ry="12" style="fill:none;stroke:var(--sim-2);stroke-width:2"/>';
    s += '<path class="g-wire" d="M' + x0 + ' 79 V150 H170 M' + x1 + ' 79 V150 H' + (170 + batt * 50) + '"/>';
    for (var b = 0; b < batt; b++) s += '<rect class="g-metal" x="' + (172 + b * 50) + '" y="140" width="46" height="20" rx="3"/>';
    s += txt(170 + batt * 25, 176, batt > 1 ? '2 batteries' : 'battery');
    s += txt(220, 30, coils + ' coils, ' + batt + ' batter' + (batt > 1 ? 'ies' : 'y'), 'middle', '');
    for (var c = 0; c < (clips || 0); c++) s += clip(338 + (c % 4) * 9, 80 + Math.floor(c / 4) * 17);
    if (clips != null) s += txt(360, 196, clips + ' paper clips', 'middle', '');
    $('#emSvg').innerHTML = s;
  }
  function emNote() {
    var found = '';
    runs.forEach(function (a) { runs.forEach(function (b) { if (a === b) return; if (a[0] !== b[0] && a[1] === b[1]) found = found || 'coils'; if (a[1] !== b[1] && a[0] === b[0]) found = found || 'batt'; }); });
    return found ? ' <b>More coils, or more batteries, make a stronger magnet.</b>' : ' Change only the coils, or only the batteries, and compare.';
  }
  $$('[data-coils]').forEach(function (b) { b.addEventListener('click', function () { coils = +b.getAttribute('data-coils'); press('[data-coils]', 'data-coils', String(coils)); drawEM(null); }); });
  $$('[data-batt]').forEach(function (b) { b.addEventListener('click', function () { batt = +b.getAttribute('data-batt'); press('[data-batt]', 'data-batt', String(batt)); drawEM(null); }); });
  $('#switchBtn').addEventListener('click', function () {
    var n = 3 * (coils / 10) * batt;
    if (eTimer) clearInterval(eTimer);
    eTimer = run(n, 70, function (i) { drawEM(i); }, function () {
      runs = runs.filter(function (r) { return !(r[0] === coils && r[1] === batt); }); runs.push([coils, batt, n]);
      runs.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      $('#emTable').innerHTML = runs.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('');
      $('#emMsg').innerHTML = 'With ' + coils + ' coils and ' + batt + ' batter' + (batt > 1 ? 'ies' : 'y') + ', the nail picks up <b>' + n + ' paper clips</b>.' + emNote();
    });
  });
  drawEM(null);
  $('#emTable').innerHTML = '<tr><td colspan="3" class="note-s">Nothing tested yet.</td></tr>';
  $('#emMsg').innerHTML = 'Choose the coils and batteries, then press <b>Switch on</b>.';

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
