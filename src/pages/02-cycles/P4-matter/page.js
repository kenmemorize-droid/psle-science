/* P4 Matter unit: knowledge cards, three Explore stations, unit check. */
(function () {
  'use strict';
  var P = window.PSLE, $ = P.$, $$ = P.$$;

  /* knowledge cards: tap to reveal on narrow screens */
  if (window.matchMedia && matchMedia('(max-width: 640px)').matches)
    $$('#know details.kcard').forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });

  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function pts(seed, n) { var r = rng(seed), a = []; for (var i = 0; i < n; i++) a.push([r(), r()]); return a; }
  function pressGroup(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)); }); }

  /* ---------- E1 · Matter or not? ---------- */
  var M = 'It has mass and takes up space, so it is matter.';
  P.widgets.classify($('#classify'), {
    prompt: 'Tap a card, then tap Matter or Not matter.',
    bins: [{ id: 'm', label: 'Matter' }, { id: 'n', label: 'Not matter' }],
    items: [
      { id: 'air', label: 'air in a balloon', bin: 'm', why: 'You cannot see air, but it has mass and takes up space, so it is matter.' },
      { id: 'water', label: 'water', bin: 'm', why: M },
      { id: 'stone', label: 'a stone', bin: 'm', why: M },
      { id: 'steam', label: 'steam', bin: 'm', why: 'Steam is water as a gas. Gases have mass and take up space, so steam is matter.' },
      { id: 'sand', label: 'sand', bin: 'm', why: 'Each grain has mass and takes up space, so sand is matter.' },
      { id: 'oxygen', label: 'oxygen', bin: 'm', why: 'Oxygen is a gas. It has mass and takes up space, so it is matter.' },
      { id: 'juice', label: 'orange juice', bin: 'm', why: M },
      { id: 'wood', label: 'a wooden block', bin: 'm', why: M },
      { id: 'light', label: 'light', bin: 'n', why: 'Light is a form of energy. It has no mass and takes up no space.' },
      { id: 'heat', label: 'heat', bin: 'n', why: 'Heat is a form of energy. It has no mass and takes up no space.' },
      { id: 'sound', label: 'sound', bin: 'n', why: 'Sound is a form of energy. It has no mass and takes up no space.' },
      { id: 'shadow', label: 'a shadow', bin: 'n', why: 'A shadow is only the area where light is blocked. It has no mass and takes up no space.' }
    ]
  });

  /* ---------- E2a · three sealed syringes ---------- */
  var AIR = pts(11, 18);
  function drawSyringes(p) {
    var off = p / 100 * 70, cxs = [100, 270, 440], names = ['Wooden block', 'Water', 'Air'], h = '', pct = 100;
    cxs.forEach(function (cx, k) {
      var top = 80 + (k === 2 ? off : 0);
      if (k === 0) h += '<rect class="sl fb2" x="' + (cx - 33) + '" y="80" width="66" height="148"/>';
      if (k === 1) h += '<rect class="fa" x="' + (cx - 33) + '" y="80" width="66" height="148"/>';
      if (k === 2) {
        pct = Math.round((228 - top) / 148 * 100);
        AIR.forEach(function (d) { h += '<circle class="dot-gas" cx="' + (cx - 27 + d[0] * 54).toFixed(1) + '" cy="' + (top + 6 + d[1] * (216 - top)).toFixed(1) + '" r="4"/>'; });
      }
      h += '<path class="ln" d="M' + (cx - 35) + ' 56 V230 H' + (cx + 35) + ' V56"/>' +
        '<rect class="sl" x="' + (cx - 6) + '" y="230" width="12" height="12"/><rect class="sl" x="' + (cx - 10) + '" y="242" width="20" height="8" rx="2"/>' +
        '<rect class="sl" x="' + (cx - 33) + '" y="' + (top - 10) + '" width="66" height="10"/>' +
        '<rect class="sl" x="' + (cx - 5) + '" y="' + (top - 70) + '" width="10" height="60"/>' +
        '<rect class="sl" x="' + (cx - 25) + '" y="' + (top - 78) + '" width="50" height="8" rx="3"/>';
      if (k === 2 && p > 20) h += '<text class="lbl sm" x="' + (cx + 42) + '" y="' + (top + 20) + '">pushes</text><text class="lbl sm" x="' + (cx + 42) + '" y="' + (top + 34) + '">back</text>';
      h += '<text class="lbl" x="' + cx + '" y="266" text-anchor="middle">' + names[k] + (k === 2 ? ' (volume ' + pct + '%)' : '') + '</text>';
    });
    $('#sySvg').innerHTML = h;
    $('#syMsg').innerHTML = p < 10 ? 'Drag the slider to push all three plungers at once.'
      : 'The wooden block and the water have not moved: each has a <b>definite volume</b> and cannot be squashed. The air has been squashed into <b>less space</b> (' + pct + '% of where it started), and it pushes back harder the further you push. A gas has no definite volume.';
  }
  $('#push').addEventListener('input', function () { drawSyringes(+this.value); });
  drawSyringes(0);

  /* ---------- E2b · pour it ---------- */
  var CONT = {
    tall: { x: 230, y: 40, w: 80, h: 180, name: 'tall, narrow jar' },
    wide: { x: 140, y: 160, w: 260, h: 60, name: 'wide, flat dish' },
    box: { x: 120, y: 90, w: 300, h: 130, name: 'big box' }
  };
  var SAMPLE = { block: 'Wooden block', water: '200 mL of water', gas: 'Coloured gas' };
  var GAS = pts(5, 40), pour = { s: 'block', c: 'tall', log: [] };
  function drawPour() {
    var C = CONT[pour.c], bottom = C.y + C.h, h = '', msg;
    if (pour.s === 'water') {
      var wh = 8800 / C.w;
      h += '<rect class="fa" x="' + C.x + '" y="' + (bottom - wh).toFixed(1) + '" width="' + C.w + '" height="' + wh.toFixed(1) + '"/>' +
        '<text class="lbl" x="' + (C.x + C.w + 12) + '" y="' + (bottom - wh / 2 + 4).toFixed(1) + '">200 mL</text>';
      msg = 'The water takes the shape of the ' + C.name + ', but it is still 200 mL. A <b>liquid</b> has a definite volume but no definite shape.';
    } else if (pour.s === 'gas') {
      GAS.forEach(function (d) { h += '<circle class="dot-gas" cx="' + (C.x + 6 + d[0] * (C.w - 12)).toFixed(1) + '" cy="' + (C.y + 6 + d[1] * (C.h - 12)).toFixed(1) + '" r="3.5"/>'; });
      msg = 'The gas spreads out to fill the whole ' + C.name + '. A <b>gas</b> has no definite shape and no definite volume. (The dots are a simplified model.)';
    } else {
      h += '<rect class="sl fb2" x="240" y="' + (bottom - 44) + '" width="60" height="44" rx="2"/>';
      msg = 'The block keeps its own shape and volume in every container. A <b>solid</b> has a definite shape and a definite volume.';
    }
    h += '<path class="ln" d="M' + C.x + ' ' + C.y + ' V' + bottom + ' H' + (C.x + C.w) + ' V' + C.y + '"/>' +
      '<path class="ln" style="stroke-width:4" d="M' + (C.x - 6) + ' ' + (C.y - 2) + ' H' + (C.x + C.w + 6) + '"/>' +
      '<text class="lbl sm" x="' + (C.x + C.w / 2) + '" y="' + (C.y - 10) + '" text-anchor="middle">lid</text>';
    $('#pourSvg').innerHTML = h;
    $('#pourMsg').innerHTML = msg;
    var key = pour.s + '|' + pour.c;
    if (pour.log.indexOf(key) < 0) pour.log.push(key);
    $('#pourLog tbody').innerHTML = pour.log.map(function (kk) {
      var ab = kk.split('|'), S = ab[0], Cn = CONT[ab[1]].name;
      var sh = S === 'water' ? 'Took the shape of the ' + Cn : S === 'gas' ? 'Filled the whole ' + Cn : 'Kept its own shape';
      var vo = S === 'water' ? '200 mL (the same)' : S === 'gas' ? 'All the space in the ' + Cn : 'Kept its own volume';
      return '<tr><td class="rowname">' + SAMPLE[S] + '</td><td>' + Cn + '</td><td>' + sh + '</td><td>' + vo + '</td></tr>';
    }).join('');
  }
  $('#explore').addEventListener('click', function (e) {
    var s = e.target.closest('[data-s]'), c = e.target.closest('[data-c]');
    if (s) { pour.s = s.getAttribute('data-s'); pressGroup('[data-s]', 'data-s', pour.s); drawPour(); }
    if (c) { pour.c = c.getAttribute('data-c'); pressGroup('[data-c]', 'data-c', pour.c); drawPour(); }
  });
  drawPour();

  /* ---------- E2c · sand under a magnifier ---------- */
  var GRAINS = [
    [345, 80, 'M0 -14 L12 -6 L10 10 L-6 14 L-14 2 Z'], [395, 70, 'M-12 -10 L8 -12 L14 4 L2 14 L-12 6 Z'],
    [445, 85, 'M-10 -12 L10 -10 L12 8 L-4 12 L-14 0 Z'], [360, 130, 'M-14 -4 L-2 -14 L12 -6 L10 10 L-8 12 Z'],
    [410, 120, 'M-8 -14 L12 -8 L14 6 L0 14 L-14 4 Z'], [455, 140, 'M-12 -8 L6 -14 L14 2 L4 12 L-10 10 Z'],
    [400, 165, 'M-12 -6 L2 -14 L14 -2 L8 12 L-10 10 Z']
  ];
  function drawSand(where) {
    var h = '', hx, hy;
    if (where === 'tall') { h += '<path class="sand" d="M70 210 V118 Q110 100 150 118 V210 Z"/><path class="ln" d="M70 40 V210 H150 V40"/>'; hx = 110; hy = 140; }
    else { h += '<path class="sand" d="M30 210 V186 Q130 172 230 186 V210 Z"/><path class="ln" d="M30 160 V210 H230 V160"/>'; hx = 130; hy = 196; }
    h += '<line class="ln" x1="' + hx + '" y1="' + hy + '" x2="312" y2="118" style="stroke-dasharray:5 5"/>' +
      '<circle cx="400" cy="115" r="90" style="fill:var(--card);stroke:var(--stroke);stroke-width:3"/>';
    GRAINS.forEach(function (g) { h += '<path class="grain" transform="translate(' + g[0] + ' ' + g[1] + ')" d="' + g[2] + '"/>'; });
    h += '<text class="lbl sm" x="400" y="224" text-anchor="middle">close up: the same grains every time</text>';
    $('#sandSvg').innerHTML = h;
  }
  $('#explore').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sand]'); if (!b) return;
    pressGroup('[data-sand]', 'data-sand', b.getAttribute('data-sand')); drawSand(b.getAttribute('data-sand'));
  });
  drawSand('tall');

  /* ---------- E3 station 1 · the balance ---------- */
  var OBJ = { stone: { name: 'Small stone', mass: 120 }, sponge: { name: 'Big sponge', mass: 20 }, block: { name: 'Wooden block', mass: 60 } };
  var bal = { on: null, done: {} };
  function drawBal() {
    var h = '';
    if (bal.on === 'stone') h += '<path class="sl" d="M248 128 l6 -18 l18 -6 l16 8 l-2 16 z"/>';
    if (bal.on === 'sponge') h += '<rect class="sl fb2" x="200" y="56" width="140" height="72" rx="14"/><circle class="ln" cx="230" cy="80" r="6"/><circle class="ln" cx="290" cy="100" r="8"/><circle class="ln" cx="315" cy="74" r="5"/><circle class="ln" cx="255" cy="108" r="4"/>';
    if (bal.on === 'block') h += '<rect class="sl fb2" x="236" y="88" width="68" height="40" rx="2"/>';
    h += '<rect class="sl" x="196" y="128" width="148" height="12" rx="3"/><rect class="sl" x="170" y="140" width="200" height="44" rx="6"/>' +
      '<rect class="fa" x="236" y="150" width="68" height="24" rx="3" style="stroke:var(--stroke);stroke-width:1.5"/>' +
      '<text class="lbl" x="270" y="167" text-anchor="middle">' + (bal.on ? OBJ[bal.on].mass : 0) + ' g</text>' +
      '<text class="lbl sm" x="270" y="198" text-anchor="middle">electronic balance</text>';
    $('#balSvg').innerHTML = h;
    var all = Object.keys(OBJ).every(function (k) { return bal.done[k]; });
    $('#balMsg').innerHTML = !bal.on ? 'Put an object on the balance.'
      : '<b>' + OBJ[bal.on].name + ': ' + OBJ[bal.on].mass + ' g.</b> ' + (all
        ? 'The big sponge takes up the most space but has the smallest mass. Size tells you volume, not mass.'
        : 'Weigh the other objects too.');
  }
  $('#explore').addEventListener('click', function (e) {
    var b = e.target.closest('[data-o]'); if (!b) return;
    bal.on = b.getAttribute('data-o'); bal.done[bal.on] = true; drawBal();
  });
  drawBal();

  /* ---------- measuring cylinder drawing (stations 2 and 3) ---------- */
  function cylinder(level, extra) {
    var h = level > 0 ? '<rect class="fa" x="126" y="' + (230 - 2 * level).toFixed(1) + '" width="48" height="' + (2 * level).toFixed(1) + '"/>' : '';
    h += (extra || '') + '<path class="ln" d="M125 22 V230 H175 V22"/><path class="ln" d="M112 234 H188"/>';
    for (var v = 0; v <= 100; v += 5) {
      var y = 230 - 2 * v, big = v % 10 === 0;
      h += '<line class="ln" style="stroke-width:1.5" x1="' + (big ? 160 : 167) + '" y1="' + y + '" x2="175" y2="' + y + '"/>';
      if (v % 20 === 0) h += '<text class="lbl sm" x="183" y="' + (y + 4) + '">' + v + '</text>';
    }
    return h + '<text class="lbl sm" x="150" y="252" text-anchor="middle">mL</text>';
  }
  function chips(host, values, onPick) {
    host.innerHTML = values.map(function (v) { return '<button type="button" class="chip-btn" data-v="' + v + '">' + v + '</button>'; }).join('');
    host.onclick = function (e) { var b = e.target.closest('[data-v]'); if (b) onPick(+b.getAttribute('data-v'), b); };
  }

  /* ---------- E3 station 2 · reading the cylinder ---------- */
  var READS = [[35, [30, 35, 40, 45]], [70, [60, 70, 75, 80]], [85, [80, 85, 90, 95]]], ri = 0;
  function drawRead() {
    var r = READS[ri];
    $('#cylSvg').innerHTML = cylinder(r[0]);
    $('#cylMsg').textContent = '';
    chips($('#cylChips'), r[1].map(function (v) { return v; }), function (v, b) {
      if (v === r[0]) { b.classList.add('ok'); $('#cylMsg').innerHTML = '✓ <b>' + v + ' mL.</b> The top of the water lines up with that mark.'; }
      else { b.classList.add('no'); $('#cylMsg').innerHTML = '✗ Not ' + v + ' mL. Each long mark is 10 mL and each short mark is 5 mL. Count up from the nearest number.'; }
    });
    $$('#cylChips .chip-btn').forEach(function (b) { b.textContent = b.getAttribute('data-v') + ' mL'; });
  }
  $('#cylNext').addEventListener('click', function () { ri = (ri + 1) % READS.length; drawRead(); });
  drawRead();

  /* ---------- E3 station 3 · displacement ---------- */
  var TRIALS = [{ b: 50, a: 72, c: [22, 50, 72, 122] }, { b: 40, a: 55, c: [55, 15, 95, 40] }], ti = 0, lowered = false, anim = null;
  var STONE = 'l6 -16 l18 -6 l14 8 l-4 14 z';
  function drawDisp(level) {
    var t = TRIALS[ti];
    var stone = lowered ? '<path class="sl" d="M136 228 ' + STONE + '"/>'
      : '<line class="ln" x1="150" y1="0" x2="150" y2="6"/><path class="sl" d="M138 20 ' + STONE + '"/>';
    $('#dispSvg').innerHTML = cylinder(level == null ? t.b : level, stone);
  }
  function resetDisp() {
    var t = TRIALS[ti]; lowered = false; if (anim) cancelAnimationFrame(anim);
    drawDisp(t.b);
    $('#dispAsk').innerHTML = 'The cylinder holds <b>' + t.b + ' mL</b> of water. Lower the stone in and read the new level.';
    $('#dispChips').innerHTML = ''; $('#dispMsg').textContent = '';
    $('#dispLower').disabled = false;
  }
  $('#dispLower').addEventListener('click', function () {
    var t = TRIALS[ti]; if (lowered) return;
    lowered = true; $('#dispLower').disabled = true;
    var t0 = performance.now(), dur = P.reduced ? 0 : 700, finished = false, myTrial = ti;
    function finish() {
      if (finished || myTrial !== ti || !lowered) return;
      finished = true; if (anim) cancelAnimationFrame(anim);
      drawDisp(t.a);
      {
        $('#dispAsk').innerHTML = 'Before: <b>' + t.b + ' mL</b>. After: <b>' + t.a + ' mL</b>. What is the volume of the stone?';
        chips($('#dispChips'), t.c, function (v, b) {
          var d = t.a - t.b;
          if (v === d) { b.classList.add('ok'); $('#dispMsg').innerHTML = '✓ <b>' + d + ' cm³.</b> ' + t.a + ' − ' + t.b + ' = ' + d + ' mL, and 1 mL = 1 cm³.'; }
          else {
            b.classList.add('no');
            $('#dispMsg').innerHTML = '✗ ' + (v === t.a ? t.a + ' mL is the water and the stone together. Subtract the water.'
              : v === t.b ? t.b + ' mL is the water before the stone went in. It says nothing about the stone.'
              : 'The stone\'s volume is the change in the level, so subtract. Do not add.');
          }
        });
        $$('#dispChips .chip-btn').forEach(function (b) { b.textContent = b.getAttribute('data-v') + ' cm³'; });
      }
    }
    /* animate the rise; the timer guarantees the end state even if frames are paused */
    (function step(now) {
      if (finished) return;
      var k = dur ? Math.min(1, (now - t0) / dur) : 1;
      if (k < 1) { drawDisp(t.b + (t.a - t.b) * k); anim = requestAnimationFrame(step); } else finish();
    })(t0);
    setTimeout(finish, dur + 60);
  });
  $('#dispNext').addEventListener('click', function () { ti = (ti + 1) % TRIALS.length; resetDisp(); });
  resetDisp();

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
