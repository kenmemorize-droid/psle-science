/* P4 Plant parts unit: knowledge cards, four Explore stations, Beyond toggle, unit check. */
(function () {
  'use strict';
  var P = window.PSLE, $ = P.$, $$ = P.$$;

  if (window.matchMedia && matchMedia('(max-width: 640px)').matches)
    $$('#know details.kcard').forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });

  function txt(x, y, s, anchor, cls) { return '<text class="lbl' + (cls == null ? ' sm' : cls ? ' ' + cls : '') + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  function ell(x, y, rx, ry, rot, cls, extra) { return '<ellipse class="' + cls + '" cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' + (extra || '') + '/>'; }
  function path(d, cls, w, extra) { return '<path class="' + cls + '" d="' + d + '" style="stroke-width:' + w + '"' + (extra || '') + '/>'; }
  function press(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)); }); }
  function mark(n, x, y, tx, ty) {
    return '<line x1="' + x + '" y1="' + y + '" x2="' + tx + '" y2="' + ty + '" style="stroke:var(--stroke);stroke-width:1.5"/>' +
      '<circle class="p-mark" cx="' + x + '" cy="' + y + '" r="15"/>' + txt(x, y + 5, n, 'middle', 'lbl-t');
  }

  /* ---------- the big plant (E1, E2) ---------- */
  var ROOTS = ['M180 212 Q170 250 132 290', 'M180 212 Q194 254 234 284', 'M180 216 Q183 262 176 310', 'M177 240 Q156 246 142 262', 'M186 248 Q206 254 220 268'];
  var STEMS = [['M180 213 V64', 8], ['M180 128 Q212 110 238 90', 6], ['M180 150 Q152 136 130 124', 6], ['M130 124 V132', 3]];
  var LEAVES = [[148, 184, -20], [212, 178, 22], [146, 104, -35], [214, 114, 30], [160, 60, -55], [200, 58, 50]];
  var FLOWER = [242, 86], FRUIT = [130, 144];
  function flower(x, y, cls) {
    var s = '';
    for (var k = 0; k < 5; k++) { var a = k * 72 * Math.PI / 180; s += '<circle class="' + (cls || 'p-petal') + '" cx="' + (x + 10 * Math.cos(a)).toFixed(1) + '" cy="' + (y + 10 * Math.sin(a)).toFixed(1) + '" r="8"/>'; }
    return s + (cls ? '' : '<circle class="p-ctr" cx="' + x + '" cy="' + y + '" r="6"/>');
  }
  function bigPlant(sel, sun) {
    var h = '<rect class="p-soil" x="10" y="212" width="340" height="110" rx="6"/><path class="ln" d="M10 212 H350"/>';
    if (sun) {
      h += '<circle class="p-sun" cx="44" cy="44" r="17"/>';
      for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; h += '<line class="p-ray" x1="' + (44 + 23 * Math.cos(a)).toFixed(1) + '" y1="' + (44 + 23 * Math.sin(a)).toFixed(1) + '" x2="' + (44 + 31 * Math.cos(a)).toFixed(1) + '" y2="' + (44 + 31 * Math.sin(a)).toFixed(1) + '"/>'; }
      h += txt(44, 92, 'Sun', 'middle', '');
    }
    if (sel === 'root') ROOTS.forEach(function (d) { h += path(d, 'p-halo', 12, ' fill="none"'); });
    ROOTS.forEach(function (d) { h += path(d, 'p-root', 4); });
    if (sel === 'stem') STEMS.forEach(function (s) { h += path(s[0], 'p-halo', s[1] + 10, ' fill="none"'); });
    STEMS.forEach(function (s) { h += path(s[0], 'p-stem', s[1]); });
    if (sel === 'leaf') LEAVES.forEach(function (l) { h += ell(l[0], l[1], 36, 17, l[2], 'p-halo'); });
    LEAVES.forEach(function (l) { h += ell(l[0], l[1], 30, 11, l[2], 'p-leaf'); });
    if (sel === 'flower') h += '<circle class="p-halo" cx="' + FLOWER[0] + '" cy="' + FLOWER[1] + '" r="25"/>';
    h += flower(FLOWER[0], FLOWER[1]);
    if (sel === 'fruit') h += '<circle class="p-halo" cx="' + FRUIT[0] + '" cy="' + FRUIT[1] + '" r="19"/>';
    h += '<circle class="p-fruit" cx="' + FRUIT[0] + '" cy="' + FRUIT[1] + '" r="12"/>';
    return h;
  }
  function hitAreas() {
    var h = '<rect class="p-hit" data-part="root" x="96" y="216" width="168" height="104"/>' +
      '<path class="p-hitline" data-part="stem" d="M180 210 V64"/><path class="p-hitline" data-part="stem" d="M180 128 Q212 110 230 96"/>';
    LEAVES.forEach(function (l) { h += ell(l[0], l[1], 34, 16, l[2], 'p-hit', ' data-part="leaf"'); });
    return h + '<circle class="p-hit" data-part="flower" cx="' + FLOWER[0] + '" cy="' + FLOWER[1] + '" r="24"/>' +
      '<circle class="p-hit" data-part="fruit" cx="' + FRUIT[0] + '" cy="' + FRUIT[1] + '" r="20"/>';
  }

  /* ---------- E1 · parts and their jobs ---------- */
  var INFO = {
    leaf: ['Leaves', ['make food for the whole plant', 'need sunlight to do this'], 'A plant does not take in food from the soil. It makes its own food, in its leaves.'],
    stem: ['Stem', ['holds the plant upright and supports its branches, leaves, flowers and fruits, so the leaves get as much sunlight as possible', 'carries water and mineral salts up from the roots to the leaves and other parts', 'carries food from the leaves to all the other parts, including down to the roots'], ''],
    root: ['Roots', ['hold the plant firmly in the ground', 'take in water and mineral salts from the soil'], 'Tiny root hairs help the roots take in more water. Mineral salts are not food.'],
    flower: ['Flower', null, "This is a flower. You'll learn what it does in P5."],
    fruit: ['Fruit', null, "This is a fruit. You'll learn what it does in P5."]
  };
  function showPart(k) {
    $('#plantSvg').innerHTML = bigPlant(k) + hitAreas();
    press('.row [data-part]', 'data-part', k);
    var i = INFO[k];
    $('#partInfo').innerHTML = !i ? '<p class="note-s">Nothing chosen yet.</p>' :
      '<h4>' + i[0] + '</h4>' + (i[1] ? '<p>The ' + i[0].toLowerCase() + ':</p><ul>' + i[1].map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' : '') +
      (i[2] ? '<p class="note-s">' + i[2] + '</p>' : '');
  }
  $$('.row [data-part]').forEach(function (b) { b.addEventListener('click', function () { showPart(b.getAttribute('data-part')); }); });
  $('#plantSvg').addEventListener('click', function (e) { var t = e.target.closest('[data-part]'); if (t) showPart(t.getAttribute('data-part')); });
  showPart(null);

  P.widgets.classify($('#classify'), {
    prompt: 'Tap a job, then tap the part that does it. Some jobs are done by no part at all.',
    bins: [{ id: 'leaf', label: 'Leaf' }, { id: 'stem', label: 'Stem' }, { id: 'root', label: 'Root' }, { id: 'none', label: 'No part does this' }],
    items: [
      { id: 'food', label: 'makes food for the plant', bin: 'leaf', why: 'The leaves make food for the whole plant.' },
      { id: 'sun', label: 'needs sunlight to make food', bin: 'leaf', why: 'The leaves need sunlight to make food.' },
      { id: 'up', label: 'holds the plant upright', bin: 'stem', why: 'The stem. The roots hold the plant in the ground; the stem holds it up.' },
      { id: 'hold', label: 'holds the leaves up to the sunlight', bin: 'stem', why: 'The stem holds the leaves up so they get as much sunlight as possible.' },
      { id: 'wup', label: 'carries water up from the roots', bin: 'stem', why: 'The stem carries water and mineral salts up to the leaves and other parts.' },
      { id: 'fdown', label: 'carries food from the leaves to the roots', bin: 'stem', why: 'The stem. Food travels down the stem as well as up.' },
      { id: 'anchor', label: 'holds the plant firmly in the ground', bin: 'root', why: 'The roots spread through the soil and hold the plant firmly in the ground.' },
      { id: 'win', label: 'takes in water from the soil', bin: 'root', why: 'The roots take in water from the soil. The stem only carries it.' },
      { id: 'min', label: 'takes in mineral salts from the soil', bin: 'root', why: 'The roots take in mineral salts, together with water.' },
      { id: 'soilfood', label: 'takes in food from the soil', bin: 'none', why: 'No part does this. A plant makes its own food in its leaves. The roots take in water and mineral salts, which are not food.' },
      { id: 'under', label: 'makes food underground', bin: 'none', why: 'No part does this. Only the leaves make food, and they need sunlight.' },
      { id: 'stemwater', label: 'takes in water through the stem from the soil', bin: 'none', why: 'No part does this. The roots take in the water; the stem carries it up.' },
      { id: 'store', label: 'stores food taken in from the soil', bin: 'none', why: 'No part does this. No food is taken in from the soil: the leaves make it.' }
    ]
  });

  /* ---------- E2 · follow the water and the food ---------- */
  var W_IN = [[[132, 290], [162, 252], [180, 214]], [[234, 284], [200, 250], [180, 214]], [[176, 310], [182, 262], [180, 216]], [[142, 262], [165, 246], [180, 232]]];
  var W_UP = [[[180, 212], [180, 70]], [[180, 212], [180, 128], [236, 92]], [[180, 212], [180, 150], [132, 125]], [[180, 212], [180, 188], [152, 184]], [[180, 212], [180, 182], [210, 178]]];
  var F_OUT = [[[146, 104], [180, 112], [180, 212], [176, 302]], [[160, 60], [180, 72], [180, 128], [236, 92]], [[214, 114], [180, 140], [180, 150], [130, 124], [130, 140]], [[148, 184], [180, 192], [180, 214], [142, 262]], [[200, 58], [180, 70], [180, 212], [232, 282]]];
  function keyW(x, y, s) { return '<circle class="p-water" cx="' + x + '" cy="' + (y - 4) + '" r="5"/>' + txt(x + 10, y, s, 'start', ''); }
  function keyF(x, y, s) { return '<rect class="p-food" x="' + (x - 4.5) + '" y="' + (y - 8.5) + '" width="9" height="9"/>' + txt(x + 10, y, s, 'start', ''); }
  var STEPS = [
    ['The roots take in water and mineral salts from the soil.', [W_IN], [], keyW(30, 236, 'water in the soil')],
    ['The stem carries the water up to the leaves and the other parts.', [W_UP], [], keyW(250, 186, 'water goes up')],
    ['The leaves make food, using sunlight.', [], 'made', keyF(252, 150, 'food is made') + txt(262, 166, 'in the leaves', 'start', '')],
    ['The stem carries the food to all the other parts: the flowers, the fruits, and down to the roots.', [], [F_OUT], keyF(250, 186, 'food goes to') + txt(260, 200, 'all parts', 'start', '')],
    ['Water goes up from the roots. Food goes from the leaves to every part.', [W_IN, W_UP], [F_OUT], keyW(250, 166, 'water goes up') + keyF(250, 186, 'food goes to') + txt(260, 200, 'all parts', 'start', '')]
  ];
  function along(pts, f) {
    var L = [], tot = 0, i;
    for (i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
    var s = f * tot;
    for (i = 0; i < L.length; i++) {
      if (s <= L[i] || i === L.length - 1) { var u = L[i] ? Math.min(1, s / L[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; }
      s -= L[i];
    }
    return pts[pts.length - 1];
  }
  function drop(p) { return '<circle class="p-water" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5"/>'; }
  function sq(p) { return '<rect class="p-food" x="' + (p[0] - 4.5).toFixed(1) + '" y="' + (p[1] - 4.5).toFixed(1) + '" width="9" height="9"/>'; }
  var step = 0, phase = 0, flowTimer = null;
  function tokens() {
    var s = STEPS[step], h = '', fr = P.reduced ? [0.25, 0.6, 0.95] : [phase, (phase + 0.34) % 1, (phase + 0.67) % 1];
    s[1].forEach(function (set) { set.forEach(function (pts) { fr.forEach(function (f) { h += drop(along(pts, f)); }); }); });
    if (s[2] === 'made') LEAVES.forEach(function (l, i) { if (P.reduced || (phase * 6 + i) % 6 < 5) h += sq([l[0], l[1]]); });
    else s[2].forEach(function (set) { set.forEach(function (pts) { fr.forEach(function (f) { h += sq(along(pts, f)); }); }); });
    $('#flowTok').innerHTML = h;
  }
  function drawStep() {
    var s = STEPS[step];
    $('#flowSvg').innerHTML = bigPlant(null, step >= 2) + s[3] + '<g id="flowTok"></g>';
    $('#stepTitle').textContent = 'Step ' + (step + 1) + ' of ' + STEPS.length;
    $('#stepMsg').textContent = s[0];
    $('#stepBack').disabled = step === 0;
    $('#stepNext').disabled = step === STEPS.length - 1;
    tokens();
  }
  if (!P.reduced) flowTimer = setInterval(function () { phase = (phase + 0.01) % 1; tokens(); }, 60);
  $('#stepBack').addEventListener('click', function () { if (step > 0) { step--; drawStep(); } });
  $('#stepNext').addEventListener('click', function () { if (step < STEPS.length - 1) { step++; drawStep(); } });
  drawStep();

  /* ---------- E3 · what if a part is damaged? ---------- */
  /* small plant drawn with its base at (0,0), growing up */
  function smallPlant(o) {
    var hgt = o.h || 120, wilt = o.leaves === 'wilt', col = o.brown ? 'p-root' : 'p-stem', h = '';
    if (o.roots !== false) ['M0 0 Q-8 22 -30 42', 'M0 0 Q8 24 30 40', 'M0 2 Q2 26 -2 48'].forEach(function (d) { h += path(d, 'p-root', 3); });
    h += path(wilt ? 'M0 0 V' + (-hgt * 0.6) + ' Q0 ' + (-hgt) + ' 20 ' + (-hgt + 8) : 'M0 0 V' + (-hgt), col, 5);
    if (o.cut) h += '<path class="ln" d="M-7 ' + (-hgt) + ' H7"/>';
    if (o.leaves === 'none') return h;
    var fr = o.leaves === 'many' ? [0.22, 0.36, 0.5, 0.64, 0.78] : [0.38, 0.52, 0.66, 0.8];
    fr.forEach(function (f, i) {
      var y = -f * hgt, left = i % 2 === 0;
      h += wilt ? ell(left ? -14 : 14, y + 12, 20, 7, left ? 65 : -65, 'p-leaf') : ell(left ? -24 : 24, y - 6, 22, 8, left ? -25 : 25, 'p-leaf');
    });
    h += wilt ? ell(24, -hgt + 24, 18, 7, 80, 'p-leaf') + ell(14, -hgt + 26, 16, 6, 100, 'p-leaf')
      : ell(-12, -hgt - 8, 18, 7, -60, 'p-leaf') + ell(12, -hgt - 8, 18, 7, 60, 'p-leaf');
    return h;
  }
  /* sx < 1 flattens the leaves of a plant lying on its side */
  function at(x, y, rot, s, sx) { return '<g transform="translate(' + x + ' ' + y + ')' + (rot ? ' rotate(' + rot + ')' : '') + (sx ? ' scale(' + sx + ' 1)' : '') + '">' + s + '</g>'; }
  function pot(cx) { return '<path class="sl" d="M' + (cx - 50) + ' 200 H' + (cx + 50) + ' L' + (cx + 40) + ' 252 H' + (cx - 40) + ' Z"/><rect class="p-soil" x="' + (cx - 46) + '" y="194" width="92" height="10" rx="4" style="stroke:var(--stroke);stroke-width:1.5"/>'; }
  var cutRoots = at(300, 248, 0, ['M0 0 Q12 -6 30 -2', 'M4 2 Q18 6 34 4', 'M8 -2 Q16 -12 26 -12'].map(function (d) { return path(d, 'p-root', 3); }).join('')) + txt(318, 268, 'cut roots');
  var SCENES = {
    pull: {
      when: 'A few hours later',
      b: function (after) { return at(334, 236, 90, smallPlant({}), after ? 0.3 : 0.7) + txt(400, 272, after ? 'wilted, lying on the table' : 'lying on the table'); },
      msg: 'A few hours later, the leaves have wilted. The roots are out of the soil, so they cannot take in water, and no water reaches the leaves.'
    },
    roots: {
      b: function (after) { return (after ? at(405, 200, 68, smallPlant({ leaves: 'wilt', roots: false })) : at(405, 200, 0, smallPlant({ roots: false }))) + pot(405) + cutRoots + (after ? txt(440, 272, 'fallen over and wilted') : ''); },
      when: 'The next day',
      msg: 'The next day, the plant has fallen over and wilted. Nothing holds it firmly in the ground, and nothing takes in water.'
    },
    stem: {
      b: function (after) { return at(372, 200, 0, smallPlant({ h: 50, leaves: 'none', cut: true })) + pot(372) + at(436, 244, 90, smallPlant({ h: 70, roots: false }), after ? 0.3 : 0.6) + txt(470, 272, after ? 'top part, wilted' : 'top part'); },
      when: 'The next day',
      msg: 'The next day, the top part has wilted. Water from the roots cannot reach it.'
    },
    leaves: {
      b: function (after) { return at(405, 200, 0, smallPlant({ leaves: 'none', brown: after })) + pot(405) + (after ? txt(405, 272, 'not grown, dying') : ''); },
      a: function (after) { return after ? smallPlant({ h: 150, leaves: 'many' }) : null; },
      aLbl: 'grown taller',
      when: 'Some weeks later',
      msg: 'Some weeks later, plant B has not grown, and in time it dies. With no leaves, no food is made, so the stem and roots get no food. Plant A has grown.'
    }
  };
  var dmg = null, after = false;
  function drawDmg() {
    var sc = dmg && SCENES[dmg];
    var aPlant = (sc && sc.a && sc.a(after)) || smallPlant({});
    var h = txt(135, 22, 'Plant A (left alone)', 'middle', '') + txt(405, 22, 'Plant B', 'middle', '') +
      (sc ? txt(270, 48, after ? sc.when : 'Just after the change', 'middle', 'lbl-t') : '') +
      '<path class="ln" d="M270 60 V290" style="stroke-dasharray:5 5;opacity:.5"/>' +
      '<g transform="translate(0 34)"><path class="ln" d="M10 256 H530"/>' +
      at(135, 200, 0, aPlant) + pot(135) + (sc && sc.aLbl && after ? txt(135, 272, sc.aLbl) : '') +
      (sc ? sc.b(after) : at(405, 200, 0, smallPlant({})) + pot(405)) + '</g>';
    $('#dmgSvg').innerHTML = h;
    $('#dmgGo').disabled = !sc || after;
    $('#dmgMsg').innerHTML = !sc ? 'Pick a change for plant B.' : after ? sc.msg + ' <b>Damage to one part affects the whole plant.</b>' : 'Now press <b>See what happens</b>.';
  }
  $$('[data-dmg]').forEach(function (b) { b.addEventListener('click', function () { dmg = b.getAttribute('data-dmg'); after = false; press('[data-dmg]', 'data-dmg', dmg); drawDmg(); }); });
  $('#dmgGo').addEventListener('click', function () { after = true; drawDmg(); });
  $('#dmgReset').addEventListener('click', function () { dmg = null; after = false; press('[data-dmg]', 'data-dmg', ''); drawDmg(); });
  drawDmg();

  /* ---------- E4 · observe like a scientist ---------- */
  var NAMES = { leaf: 'leaf', stem: 'stem', root: 'root' };
  var HINT = { leaf: 'This part is green and grows up where the sunlight is.', stem: 'This part holds the plant up and joins the roots to the leaves.', root: 'This part is under the ground, holding the plant in.' };
  var OBS = {
    seedling: {
      draw: function () {
        return '<rect class="p-soil" x="10" y="190" width="280" height="100" rx="6"/><path class="ln" d="M10 190 H290"/>' +
          path('M150 192 Q146 236 152 282', 'p-root', 5) + path('M149 214 Q136 222 128 236', 'p-root', 3) + path('M151 236 Q164 244 170 258', 'p-root', 3) +
          path('M150 192 V122', 'p-stem', 6) + ell(118, 112, 32, 12, -20, 'p-leaf') + ell(182, 112, 32, 12, 20, 'p-leaf') +
          mark(1, 236, 250, 156, 250) + mark(2, 56, 72, 104, 104) + mark(3, 236, 156, 155, 156);
      },
      parts: ['root', 'leaf', 'stem'],
      good: { root: '✓ Yes, a root. Even a tiny seedling has roots. They hold it in the soil and take in water.' }
    },
    balsam: {
      draw: function () {
        var h = '<rect class="p-soil" x="10" y="230" width="280" height="62" rx="6"/><path class="ln" d="M10 230 H290"/>' +
          path('M150 232 Q140 256 112 278', 'p-root', 4) + path('M150 232 Q160 258 190 276', 'p-root', 4) + path('M150 234 V286', 'p-root', 4) +
          path('M150 232 V48', 'p-stem', 9);
        [[118, 200, -25], [184, 186, 25], [120, 160, -30], [182, 146, 30], [124, 118, -35], [178, 104, 35], [136, 70, -55], [166, 62, 55]].forEach(function (l) { h += ell(l[0], l[1], 34, 9, l[2], 'p-leaf'); });
        [[162, 172], [139, 132], [161, 92]].forEach(function (f) { h += '<circle class="p-fruit" cx="' + f[0] + '" cy="' + f[1] + '" r="7"/>'; });
        return h + mark(1, 240, 220, 156, 220) + mark(2, 248, 268, 186, 272) + mark(3, 36, 120, 104, 122);
      },
      parts: ['stem', 'root', 'leaf'],
      good: {}
    },
    tree: {
      draw: function () {
        return '<rect class="p-soil" x="10" y="200" width="280" height="92" rx="6"/><path class="ln" d="M10 200 H290"/>' +
          path('M150 204 Q130 232 96 254', 'p-root', 7) + path('M150 204 Q174 236 212 252', 'p-root', 7) + path('M150 206 Q148 242 152 280', 'p-root', 6) +
          '<rect class="p-wood" x="141" y="92" width="18" height="112"/>' + path('M150 120 L118 92', 'p-root', 8) + path('M150 108 L186 84', 'p-root', 8) +
          '<g class="p-leaf"><circle cx="112" cy="78" r="30"/><circle cx="190" cy="74" r="32"/><circle cx="150" cy="50" r="34"/><circle cx="140" cy="96" r="22"/><circle cx="172" cy="100" r="20"/></g>' +
          mark(1, 40, 40, 90, 62) + mark(2, 240, 150, 162, 150) + mark(3, 252, 262, 212, 254);
      },
      parts: ['leaf', 'stem', 'root'],
      good: { stem: "✓ Yes, the trunk is the tree's stem. It holds the tree upright and carries water and food, just like the balsam's stem." }
    }
  };
  var obsState = { seedling: {}, balsam: {}, tree: {} }, cur = 'seedling';
  function obsCount() {
    var n = 0; Object.keys(obsState).forEach(function (k) { Object.keys(obsState[k]).forEach(function (i) { if (obsState[k][i].ok) n++; }); });
    $('#obsCount').innerHTML = n < 9 ? 'Named: <b>' + n + ' of 9</b> parts.' : '<b>All 9 named.</b> All three plants have leaves, a stem and roots, even though they look very different.';
  }
  function drawObs() {
    var o = OBS[cur], st = obsState[cur];
    $('#obsSvg').innerHTML = o.draw();
    $('#obsRows').innerHTML = o.parts.map(function (part, i) {
      var s = st[i] || { tried: {} };
      return '<div class="p-orow"><p><b>Part ' + (i + 1) + '</b> is the…</p><div class="row" role="group" aria-label="Part ' + (i + 1) + '">' +
        ['leaf', 'stem', 'root'].map(function (k) {
          var cls = s.ok && k === part ? ' ok' : s.tried[k] ? ' no' : '';
          return '<button type="button" class="chip-btn' + cls + '" data-i="' + i + '" data-pick="' + k + '"' + (s.ok ? ' disabled' : '') + '>' + (cls === ' ok' ? '✓ ' : cls === ' no' ? '✗ ' : '') + k.charAt(0).toUpperCase() + k.slice(1) + '</button>';
        }).join('') + '</div><p class="p-ofb">' + (s.msg || '') + '</p></div>';
    }).join('');
    press('[data-obs]', 'data-obs', cur);
    obsCount();
  }
  $('#obsRows').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b || b.disabled) return;
    var i = +b.getAttribute('data-i'), k = b.getAttribute('data-pick'), o = OBS[cur], part = o.parts[i];
    var s = obsState[cur][i] = obsState[cur][i] || { tried: {} };
    if (k === part) {
      s.ok = true;
      s.msg = o.good[part] || ({ leaf: '✓ Yes, a leaf. Leaves make food for the plant.', stem: '✓ Yes, the stem. It holds the plant up and carries water and food.', root: '✓ Yes, the roots. They hold the plant in the ground and take in water.' })[part];
    } else { s.tried[k] = true; s.msg = '✗ Not the ' + NAMES[k] + '. ' + HINT[part]; }
    drawObs();
  });
  $$('[data-obs]').forEach(function (b) { b.addEventListener('click', function () { cur = b.getAttribute('data-obs'); drawObs(); }); });
  drawObs();

  /* hand lens */
  var LP = [[72, 82, 'leaf'], [100, 132, 'stem'], [100, 236, 'root']], li = 0;
  var VIEW = { cx: 262, cy: 146, r: 84 };
  function viewContent(k) {
    var x = VIEW.cx, y = VIEW.cy, h = '';
    if (k === 'leaf') {
      h += '<rect x="' + (x - 90) + '" y="' + (y - 90) + '" width="180" height="180" style="fill:var(--leaf)"/>' + path('M' + (x - 80) + ' ' + (y + 70) + ' L' + (x + 80) + ' ' + (y - 70), 'p-stem', 5);
      for (var t = -0.6; t <= 0.61; t += 0.3) { var px = x + 80 * t, py = y - 70 * t; h += path('M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' l-34 -24 M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' l30 34', 'p-stem', 2); }
    } else if (k === 'stem') {
      h += '<rect x="' + (x - 90) + '" y="' + (y - 90) + '" width="180" height="180" style="fill:var(--sunk)"/><rect x="' + (x - 36) + '" y="' + (y - 90) + '" width="72" height="180" style="fill:var(--stem);stroke:var(--stroke);stroke-width:2"/>';
      for (var s = -24; s <= 24; s += 12) h += '<line x1="' + (x + s) + '" y1="' + (y - 90) + '" x2="' + (x + s) + '" y2="' + (y + 90) + '" style="stroke:var(--leaf);stroke-width:2;opacity:.7"/>';
    } else {
      h += '<rect x="' + (x - 90) + '" y="' + (y - 90) + '" width="180" height="180" style="fill:var(--sunk)"/>';
      for (var yy = y - 76; yy <= y + 76; yy += 9) {
        var len = 16 + ((yy * 7) % 11);
        h += '<line x1="' + (x - 8) + '" y1="' + yy + '" x2="' + (x - 8 - len) + '" y2="' + (yy + 6) + '" style="stroke:var(--wood);stroke-width:1.5;stroke-linecap:round"/>' +
          '<line x1="' + (x + 8) + '" y1="' + (yy + 4) + '" x2="' + (x + 8 + len) + '" y2="' + (yy + 10) + '" style="stroke:var(--wood);stroke-width:1.5;stroke-linecap:round"/>';
      }
      h += path('M' + x + ' ' + (y - 90) + ' V' + (y + 90), 'p-root', 18);
    }
    return h;
  }
  var LMSG = {
    leaf: 'The hand lens makes the leaf look bigger. You can see fine lines running across it. Move the lens down to the root.',
    stem: 'The stem looks bigger too. It is green and soft. Keep going down to the root.',
    root: '✓ Through the hand lens you can see <b>tiny root hairs</b> all along the root. They help the root take in more water.'
  };
  function drawLens() {
    var p = LP[li], h = '';
    h += path('M100 172 Q96 222 102 282', 'p-root', 5) + path('M99 200 Q86 208 78 222', 'p-root', 3) + path('M101 236 Q114 244 120 258', 'p-root', 3);
    for (var yy = 184; yy <= 276; yy += 8) h += '<line x1="98" y1="' + yy + '" x2="91" y2="' + (yy + 3) + '" style="stroke:var(--wood);stroke-width:.8"/><line x1="103" y1="' + (yy + 3) + '" x2="110" y2="' + (yy + 6) + '" style="stroke:var(--wood);stroke-width:.8"/>';
    h += path('M100 172 V92', 'p-stem', 6) + ell(70, 82, 30, 11, -20, 'p-leaf') + ell(130, 82, 30, 11, 20, 'p-leaf');
    h += '<clipPath id="lensClip"><circle cx="' + VIEW.cx + '" cy="' + VIEW.cy + '" r="' + VIEW.r + '"/></clipPath>' +
      '<line x1="' + (p[0] + 24) + '" y1="' + p[1] + '" x2="' + (VIEW.cx - VIEW.r) + '" y2="' + VIEW.cy + '" style="stroke:var(--stroke);stroke-width:1.5;stroke-dasharray:4 4"/>' +
      '<g clip-path="url(#lensClip)">' + viewContent(p[2]) + '</g>' +
      '<circle cx="' + VIEW.cx + '" cy="' + VIEW.cy + '" r="' + VIEW.r + '" style="fill:none;stroke:var(--stroke);stroke-width:3"/>' +
      txt(VIEW.cx, VIEW.cy + VIEW.r + 20, 'seen through the hand lens', 'middle', '') +
      '<g class="p-lens" id="lens"><line class="p-handle" x1="' + (p[0] + 18) + '" y1="' + (p[1] + 18) + '" x2="' + (p[0] + 40) + '" y2="' + (p[1] + 40) + '"/>' +
      '<circle class="p-lensglass" cx="' + p[0] + '" cy="' + p[1] + '" r="24"/></g>';
    $('#lensSvg').innerHTML = h;
    $('#lensMsg').innerHTML = LMSG[p[2]];
    $('#lensUp').disabled = li === 0;
    $('#lensDown').disabled = li === LP.length - 1;
  }
  $('#lensUp').addEventListener('click', function () { if (li > 0) { li--; drawLens(); } });
  $('#lensDown').addEventListener('click', function () { if (li < LP.length - 1) { li++; drawLens(); } });
  (function () {
    var svg = $('#lensSvg'), drag = false;
    function svgY(e) { var m = svg.getScreenCTM(); return m ? (e.clientY - m.f) / m.d : 0; }
    svg.addEventListener('pointerdown', function (e) { if (e.target.closest('#lens')) { drag = true; try { svg.setPointerCapture(e.pointerId); } catch (err) { } e.preventDefault(); } });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var y = svgY(e), best = 0;
      LP.forEach(function (p, i) { if (Math.abs(p[1] - y) < Math.abs(LP[best][1] - y)) best = i; });
      if (best !== li) { li = best; drawLens(); }
    });
    function end() { drag = false; }
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  })();
  drawLens();

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
