/* P4 Heat unit: knowledge cards, six Explore stations, Beyond toggle, unit check. */
(function () {
  'use strict';
  var P = window.PSLE, $ = P.$, $$ = P.$$;

  if (window.matchMedia && matchMedia('(max-width: 640px)').matches)
    $$('#know details.kcard').forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });

  function txt(x, y, s, anchor, cls) { return '<text class="lbl' + (cls == null ? ' sm' : cls ? ' ' + cls : '') + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  function harrow(x1, y1, x2, y2, w) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, s = 8 + w * 2;
    var bx = x2 - ux * s, by = y2 - uy * s, px = -uy * (4 + w), py = ux * (4 + w);
    return '<line class="heatarrow" style="stroke-width:' + w + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) + '"/>' +
      '<polygon class="heattip" points="' + x2 + ',' + y2 + ' ' + (bx + px).toFixed(1) + ',' + (by + py).toFixed(1) + ' ' + (bx - px).toFixed(1) + ',' + (by - py).toFixed(1) + '"/>';
  }
  function press(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)); }); }
  function run(steps, ms, each, done) {   /* timer-driven animation: does not depend on animation frames */
    var i = 0; if (P.reduced) { each(steps, steps); if (done) done(); return null; }
    var id = setInterval(function () { i++; each(i, steps); if (i >= steps) { clearInterval(id); if (done) done(); } }, ms);
    return id;
  }

  /* ---------- E1 · source of heat or not? ---------- */
  var SRC = 'It produces heat.';
  P.widgets.classify($('#classify'), {
    prompt: 'Tap a card, then tap the group it belongs in.',
    bins: [{ id: 's', label: 'Source of heat' }, { id: 'n', label: 'Not a source of heat' }],
    items: [
      { id: 'sun', label: 'the Sun', bin: 's', why: SRC },
      { id: 'candle', label: 'a burning candle', bin: 's', why: 'Burning things produce heat.' },
      { id: 'wood', label: 'burning wood', bin: 's', why: 'Burning things produce heat.' },
      { id: 'iron', label: 'a switched-on iron', bin: 's', why: 'A switched-on electrical appliance produces heat.' },
      { id: 'toaster', label: 'a switched-on toaster', bin: 's', why: 'A switched-on electrical appliance produces heat.' },
      { id: 'rub', label: 'rubbing your hands together', bin: 's', why: 'Rubbing two things together produces heat.' },
      { id: 'ice', label: 'an ice cube', bin: 'n', why: 'Ice produces no heat. It feels cold because it takes heat from your hand.' },
      { id: 'ironoff', label: 'a switched-off iron', bin: 'n', why: 'An appliance produces heat only while it is switched on.' },
      { id: 'glass', label: 'a glass of water at room temperature', bin: 'n', why: 'It produces no heat. It is simply at the same temperature as the room.' },
      { id: 'moon', label: 'the Moon', bin: 'n', why: 'The Moon reflects sunlight. It produces no heat of its own.' },
      { id: 'snow', label: 'snow', bin: 'n', why: 'Snow produces no heat. Cold is just less heat.' },
      { id: 'spoon', label: 'a metal spoon', bin: 'n', why: 'A spoon produces no heat. It only passes heat along when something hot touches it.' }
    ]
  });

  /* ---------- E2 · hot cup in a cold basin ---------- */
  function Tc(t) { return 32 + 48 * Math.exp(-t / 6); }
  function Tb(t) { return 32 - 12 * Math.exp(-t / 6); }
  function gx(t) { return 40 + 10 * t; }
  function gy(T) { return 210 - 2 * T; }
  function axes(h) {
    var s = '';
    for (var T = 0; T <= 80; T += 20) s += '<line class="ggrid" x1="40" y1="' + gy(T) + '" x2="340" y2="' + gy(T) + '"/>' + txt(34, gy(T) + 4, T, 'end');
    for (var t = 0; t <= 30; t += 10) s += txt(gx(t), 226, t);
    return s + '<line class="gaxis" x1="40" y1="210" x2="340" y2="210"/><line class="gaxis" x1="40" y1="30" x2="40" y2="210"/>' +
      txt(190, 239, 'time (min)') + txt(44, 22, 'temperature (°C)', 'start') + (h || '');
  }
  function poly(f, t1, cls) {
    var pts = [];
    for (var t = 0; t <= t1 + 1e-9; t += 0.5) pts.push(gx(t).toFixed(1) + ',' + gy(f(t)).toFixed(1));
    return '<polyline class="gline ' + cls + '" points="' + pts.join(' ') + '"/>';
  }
  function drawFlow(t) {
    var c = Tc(t), b = Tb(t), d = c - b, w = Math.max(0, Math.min(6, d / 8));
    var h = '<rect class="t-cold" style="fill-opacity:.3" x="32" y="100" width="296" height="108"/>' +
      '<path class="ln" d="M30 70 V210 H330 V70"/>' +
      '<rect class="t-hot" style="fill-opacity:' + (0.15 + 0.6 * (c - 20) / 60).toFixed(2) + '" x="142" y="70" width="76" height="108"/>' +
      '<path class="ln" d="M140 50 V180 H220 V50"/>';
    if (d >= 1) h += harrow(144, 140, 96, 140, w) + harrow(216, 140, 264, 140, w);
    h += '<text class="lbl" x="180" y="40" text-anchor="middle">cup ' + Math.round(c) + ' °C</text>' +
      '<text class="lbl" x="276" y="198" text-anchor="middle">basin ' + Math.round(b) + ' °C</text>';
    $('#flowSvg').innerHTML = h;
    $('#flowGraph').innerHTML = axes(poly(Tc, t, 'hotl') + poly(Tb, t, 'coldl') +
      '<circle cx="' + gx(t) + '" cy="' + gy(c).toFixed(1) + '" r="5" class="t-hot"/><circle cx="' + gx(t) + '" cy="' + gy(b).toFixed(1) + '" r="5" class="t-cold"/>' +
      txt(gx(t) + (t > 22 ? -8 : 8), gy(c) - 8, 'cup', t > 22 ? 'end' : 'start') +
      txt(gx(t) + (t > 22 ? -8 : 8), gy(b) + 18, 'basin', t > 22 ? 'end' : 'start'));
    $('#tOut').textContent = t;
    $('#flowMsg').innerHTML = t === 0
      ? 'At the start the cup is at 80 °C and the basin at 20 °C. Heat flows from the <b>hotter</b> cup to the <b>colder</b> basin.'
      : d >= 1
        ? 'Cup: ' + Math.round(c) + ' °C, falling because it is <b>losing heat</b>. Basin: ' + Math.round(b) + ' °C, rising because it is <b>gaining heat</b>.'
        : 'Both are at about <b>32 °C</b>. Heat stops flowing when the temperatures are the same.';
  }
  $('#tFlow').addEventListener('input', function () { drawFlow(+this.value); });
  drawFlow(0);

  $('#iceSvg').innerHTML = '<rect class="t-warm" style="fill-opacity:.4" x="122" y="60" width="116" height="118"/>' +
    '<path class="ln" d="M120 30 V180 H240 V30"/>' +
    '<rect x="165" y="78" width="30" height="30" rx="4" style="fill:var(--card);stroke:var(--stroke);stroke-width:2"/>' +
    harrow(132, 93, 160, 93, 3) + harrow(228, 93, 200, 93, 3) + harrow(180, 160, 180, 113, 3) +
    txt(180, 196, 'juice') + txt(180, 72, 'ice') + txt(300, 95, 'heat flows', 'middle') + txt(300, 111, 'into the ice', 'middle');

  /* ---------- E3 · heat or temperature? ---------- */
  var heatTimer = null;
  function drawHeat(tau, on) {
    var t50 = Math.min(60, 25 + 17.5 * tau), t100 = Math.min(60, 25 + 8.75 * tau);
    var done50 = tau >= 2, done100 = tau >= 4;
    function beaker(cx, vol, hgt, T, time, done, burning) {
      var x = cx - 40;
      return '<rect class="water" x="' + (x + 2) + '" y="' + (170 - hgt) + '" width="76" height="' + hgt + '"/>' +
        '<path class="ln" d="M' + x + ' 60 V170 H' + (x + 80) + ' V60"/>' +
        '<rect class="sl" x="' + (x + 10) + '" y="176" width="60" height="14" rx="3"/>' +
        (burning ? '<path class="t-hot" d="M' + (cx - 8) + ' 176 q8 -18 8 -26 q8 8 8 26 z" style="stroke:var(--stroke);stroke-width:1.5"/>' : '') +
        '<text class="lbl" x="' + cx + '" y="44" text-anchor="middle">' + Math.round(T) + ' °C</text>' +
        txt(cx, 208, vol + ' · ' + (done ? 'reached 60 °C after ' + time + ' min' : (tau > 0 ? 'heating… ' + tau.toFixed(1) + ' min' : 'not heated yet')));
    }
    $('#heatSvg').innerHTML = beaker(150, '50 mL', 40, t50, 2, done50, on && !done50) + beaker(390, '100 mL', 80, t100, 4, done100, on && !done100);
    $('#heatMsg').innerHTML = !on && tau === 0 ? 'Both beakers start at 25 °C. Which one will need more heat to reach 60 °C?'
      : done100 ? 'Both are now at <b>60 °C: the same temperature</b>. The 100 mL beaker needed twice as long on the same burner, so it took in twice as much heat. It now holds <b>more heat</b>.'
      : done50 ? 'The 50 mL beaker has reached 60 °C. The 100 mL beaker is still heating.' : 'Heating…';
  }
  $('#heatBtn').addEventListener('click', function () {
    if (heatTimer) clearInterval(heatTimer);
    heatTimer = run(40, 60, function (i, n) { drawHeat(4 * i / n, true); });
  });
  $('#heatReset').addEventListener('click', function () { if (heatTimer) clearInterval(heatTimer); drawHeat(0, false); });
  drawHeat(0, false);

  /* ---------- E4 · ball and ring, balloon, change of state ---------- */
  function drawBall(s) {
    var hot = s === 'hot', r = hot ? 38 : 30, h = '';
    h += '<ellipse cx="130" cy="120" rx="34" ry="8" style="fill:none;stroke:var(--stroke);stroke-width:5"/>' +
      '<line class="ln" x1="96" y1="120" x2="40" y2="120"/><line class="ln" x1="40" y1="110" x2="40" y2="210"/>';
    h += hot ? '<circle cx="130" cy="' + (120 - r + 6) + '" r="' + r + '" class="t-hot" style="stroke:var(--stroke);stroke-width:2"/>'
      : '<circle cx="130" cy="176" r="' + r + '" class="sl"/>' + txt(204, 180, 'passed', 'start') + txt(204, 194, 'through', 'start');
    h += txt(130, 18, 'Mass of the ball: 150 g', 'middle', '');
    $('#ballSvg').innerHTML = h;
    $('#ballMsg').innerHTML = s === 'hot' ? 'The ball <b>gained heat and expanded</b>, so it is too big to pass through the ring. Its mass is still 150 g.'
      : s === 'cool' ? 'The ball <b>lost heat and contracted</b>, so it passes through again. Its mass is still 150 g.'
      : 'The ball just passes through the ring.';
  }
  function drawBalloon(s) {
    var rx = s === 'hot' ? 30 : s === 'ice' ? 7 : 11, ry = s === 'hot' ? 32 : s === 'ice' ? 5 : 9;
    var basin = s === 'hot' ? 't-hot' : s === 'ice' ? 't-cold' : 'water';
    var h = '<rect class="' + basin + '" style="fill-opacity:.35" x="40" y="160" width="180" height="50"/>' +
      '<path class="ln" d="M36 140 V212 H224 V140"/>' +
      '<path class="sl" d="M100 205 V110 Q100 96 118 92 V64 H142 V92 Q160 96 160 110 V205 Z" style="fill-opacity:.25"/>' +
      '<ellipse cx="130" cy="' + (64 - ry + 2) + '" rx="' + rx + '" ry="' + ry + '" style="fill:var(--sim-3);fill-opacity:.55;stroke:var(--stroke);stroke-width:2"/>' +
      txt(130, 234, 'Basin: ' + (s === 'hot' ? 'hot water' : s === 'ice' ? 'ice' : 'water at room temperature'));
    $('#balSvg').innerHTML = h;
    $('#balMsg').innerHTML = s === 'hot' ? 'The air in the bottle <b>gains heat and expands</b>, so it inflates the balloon.'
      : s === 'ice' ? 'The air in the bottle <b>loses heat and contracts</b>, so the balloon goes limp.'
      : 'The balloon is limp. The bottle is full of air at room temperature.';
  }
  var ST = {
    melt: ['Ice <b>gains heat</b> and <b>melts</b> into water. Example: ice cream melting on a hot day.', 0],
    boil: ['Water <b>gains heat</b> and <b>boils</b> or <b>evaporates</b> into water vapour. Example: a puddle drying in the sun.', 1],
    cond: ['Water vapour <b>loses heat</b> and <b>condenses</b> into water. Example: droplets on the outside of a glass of iced water.', 2],
    freeze: ['Water <b>loses heat</b> and <b>freezes</b> into ice. Example: water in the freezer turning into ice cubes.', 3]
  };
  function drawState(sel) {
    var boxes = [[40, 'ice'], [210, 'water'], [380, 'water vapour']], h = '';
    boxes.forEach(function (b) { h += '<rect class="sl" x="' + b[0] + '" y="50" width="120" height="44" rx="8"/><text class="lbl" x="' + (b[0] + 60) + '" y="77" text-anchor="middle">' + b[1] + '</text>'; });
    var arrows = [[160, 210, 40, 'gains heat'], [330, 380, 40, 'gains heat'], [380, 330, 112, 'loses heat'], [210, 160, 112, 'loses heat']];
    arrows.forEach(function (a, i) {
      var on = sel != null && ST[sel][1] === i;
      h += '<g style="opacity:' + (sel == null || on ? 1 : 0.3) + '">' + harrow(a[0] + (a[0] < a[1] ? 4 : -4), a[2], a[1] + (a[0] < a[1] ? -4 : 4), a[2], on ? 4 : 2.5) +
        txt((a[0] + a[1]) / 2, a[2] + (a[2] < 60 ? -10 : 20), a[3]) + '</g>';
    });
    $('#stateSvg').innerHTML = h;
    $('#stateMsg').innerHTML = sel ? ST[sel][0] : 'Tap a change to see whether it needs heat gain or heat loss.';
  }
  $('#explore').addEventListener('click', function (e) {
    var b = e.target.closest('[data-ball]'); if (b) { press('[data-ball]', 'data-ball', b.getAttribute('data-ball')); drawBall(b.getAttribute('data-ball')); return; }
    b = e.target.closest('[data-bal]'); if (b) { press('[data-bal]', 'data-bal', b.getAttribute('data-bal')); drawBalloon(b.getAttribute('data-bal')); return; }
    b = e.target.closest('[data-st]'); if (b) drawState(b.getAttribute('data-st'));
  });
  drawBall('start'); drawBalloon('start'); drawState(null);

  /* ---------- E5 · spoons and benches ---------- */
  var spoonTimer = null;
  function drawSpoons(sec) {
    var names = ['metal', 'plastic', 'wooden'], xs = [150, 270, 390], melt = [25, Infinity, Infinity];
    var fills = ['var(--fc)', 'var(--fa)', 'var(--fb)'];   /* labels name each spoon; colour is only a cue */
    var h = '<rect class="t-hot" style="fill-opacity:.3" x="62" y="122" width="416" height="86"/><path class="ln" d="M60 100 V210 H480 V100"/>';
    xs.forEach(function (x, i) {
      var gone = sec >= melt[i], st = 'fill:' + fills[i] + ';stroke:var(--stroke);stroke-width:2';
      h += '<rect x="' + (x - 5) + '" y="44" width="10" height="150" rx="5" style="' + st + '"/>' +
        '<ellipse cx="' + x + '" cy="196" rx="15" ry="9" style="' + st + '"/>' +
        (gone ? '<path class="wax" d="M' + (x + 5) + ' 50 q7 0 7 12 v14 a3.5 3.5 0 0 1 -7 0 Z"/>' + txt(x, 28, names[i] + ': wax melted', 'middle', '')
              : '<circle class="wax" cx="' + (x + 10) + '" cy="54" r="7"/>' + txt(x, 28, names[i], 'middle', ''));
    });
    h += '<text class="lbl" x="530" y="80" text-anchor="end">time: ' + Math.round(sec) + ' s</text>';
    $('#spoonSvg').innerHTML = h;
    $('#spoonMsg').innerHTML = sec === 0 ? 'Which wax will melt first?'
      : sec < 180 ? (sec >= 25 ? 'The wax on the <b>metal</b> spoon has melted. The others are still solid…' : 'Waiting…')
      : 'The wax on the metal spoon melted after about 25 s. The wax on the plastic and wooden spoons had not melted after 3 minutes. <b>Metal is a good conductor of heat. Plastic and wood are poor conductors.</b>';
  }
  $('#spoonBtn').addEventListener('click', function () {
    if (spoonTimer) clearInterval(spoonTimer);
    spoonTimer = run(60, 50, function (i, n) { drawSpoons(180 * i / n); });
  });
  $('#spoonReset').addEventListener('click', function () { if (spoonTimer) clearInterval(spoonTimer); drawSpoons(0); });
  drawSpoons(0);

  $('#touchSvg').innerHTML =
    '<rect x="60" y="112" width="190" height="20" rx="3" class="sl" style="fill:var(--fc)"/><rect x="300" y="112" width="190" height="20" rx="3" class="sl fb2"/>' +
    '<rect x="115" y="40" width="80" height="34" rx="14" style="fill:var(--card);stroke:var(--stroke);stroke-width:2"/><rect x="355" y="40" width="80" height="34" rx="14" style="fill:var(--card);stroke:var(--stroke);stroke-width:2"/>' +
    harrow(130, 78, 130, 110, 4) + harrow(155, 78, 155, 110, 4) + harrow(180, 78, 180, 110, 4) + harrow(395, 78, 395, 110, 1.5) +
    txt(155, 30, 'hand') + txt(395, 30, 'hand') +
    txt(155, 150, 'metal bench: 28 °C') + txt(395, 150, 'wooden bench: 28 °C') +
    txt(155, 170, 'heat leaves fast: feels cold') + txt(395, 170, 'heat leaves slowly');

  /* ---------- E6 · thermometer and datalogger ---------- */
  function thermo(T) {
    var y = function (v) { return 220 - (v - 20) * 6; }, h = '';
    h += '<rect x="92" y="20" width="16" height="210" rx="8" style="fill:var(--card);stroke:var(--stroke);stroke-width:2"/>' +
      '<rect x="96" y="' + y(T).toFixed(1) + '" width="8" height="' + (230 - y(T)).toFixed(1) + '" class="t-hot"/>' +
      '<circle cx="100" cy="236" r="14" class="t-hot" style="stroke:var(--stroke);stroke-width:2"/>';
    for (var v = 20; v <= 50; v++) {
      var big = v % 5 === 0;
      h += '<line x1="108" y1="' + y(v) + '" x2="' + (big ? 126 : 117) + '" y2="' + y(v) + '" style="stroke:var(--stroke);stroke-width:' + (big ? 1.6 : 1) + '"/>';
      if (big) h += '<text class="lbl" x="131" y="' + (y(v) + 4) + '">' + v + '</text>';
    }
    return h + '<text class="lbl" x="158" y="252">°C</text>';
  }
  /* readings differ from U10 (37 °C) so the station does not give the unit-check answer away */
  var READS = [[33, [30, 33, 34, 43]], [42, [40, 42, 43, 52]], [26, [25, 26, 27, 36]]], ri = 0;
  function drawThermo() {
    var r = READS[ri];
    $('#thermoSvg').innerHTML = thermo(r[0]);
    $('#thMsg').textContent = '';
    $('#thChips').innerHTML = r[1].map(function (v) { return '<button type="button" class="chip-btn" data-v="' + v + '">' + v + ' °C</button>'; }).join('');
  }
  $('#thChips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-v]'); if (!b) return;
    var v = +b.getAttribute('data-v'), T = READS[ri][0];
    if (v === T) { b.classList.add('ok'); $('#thMsg').innerHTML = '✓ <b>' + T + ' °C.</b> Each short mark is 1 °C.'; }
    else { b.classList.add('no'); $('#thMsg').innerHTML = '✗ Not ' + v + ' °C. The long marks are labelled every 5 °C and each short mark is 1 °C. Count up from the labelled number just below the top of the liquid.'; }
  });
  $('#thNext').addEventListener('click', function () { ri = (ri + 1) % READS.length; drawThermo(); });
  drawThermo();

  var logTimer = null;
  function drawLog(n) {
    var pts = '';
    for (var t = 0; t < n; t++) pts += '<circle cx="' + gx(t) + '" cy="' + gy(Tc(t)).toFixed(1) + '" r="4" class="t-hot"/>';
    $('#logSvg').innerHTML = axes(pts);
    $('#logMsg').innerHTML = n === 0 ? 'Press Record.' : n < 21 ? 'Recording… ' + (n - 1) + ' min'
      : 'The datalogger took 21 readings by itself. The graph shows the hot water <b>losing heat</b>, so its temperature falls: quickly at first, then more slowly as it gets closer to the temperature of its surroundings.';
  }
  $('#logBtn').addEventListener('click', function () {
    if (logTimer) clearInterval(logTimer);
    logTimer = run(21, 120, function (i) { drawLog(i); });
  });
  drawLog(0);

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
