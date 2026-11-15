/* P3 Life cycles unit: knowledge cards, four Explore stations, Beyond toggle, unit check. */
(function () {
  'use strict';
  var P = window.PSLE, $ = P.$, $$ = P.$$;

  if (window.matchMedia && matchMedia('(max-width: 640px)').matches)
    $$('#know details.kcard').forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });

  /* Life-cycle stage drawings and a ring diagram. Plain ES5, inline var() styles only, so the same code
   works in a page script and in question figures shown in the hub. Copied into P3-life-cycles/page.js. */
var CYC = (function () {
  function st(fill, extra) { return "style='fill:" + fill + ";stroke:var(--stroke);stroke-width:1.6" + (extra || '') + "'"; }
  function line(d, w, c) { return "<path d='" + d + "' style='fill:none;stroke:" + (c || 'var(--stroke)') + ";stroke-width:" + (w || 1.6) + ";stroke-linecap:round'/>"; }
  function insect(scale, wings, wingFill) {
    var s = '';
    if (wings) s += "<ellipse cx='-2' cy='-10' rx='13' ry='6' transform='rotate(-25 -2 -10)' " + st(wingFill || 'var(--fa)', ';fill-opacity:.8') + "/><ellipse cx='-2' cy='10' rx='13' ry='6' transform='rotate(25 -2 10)' " + st(wingFill || 'var(--fa)', ';fill-opacity:.8') + "/>";
    s += line('M-6 -4 l-5 -12 M0 -4 l0 -13 M6 -4 l5 -12 M-6 4 l-5 12 M0 4 l0 13 M6 4 l5 12');
    s += "<circle cx='-17' cy='0' r='5' " + st('var(--wood)') + "/><ellipse cx='-6' cy='0' rx='7' ry='5' " + st('var(--wood)') + "/><ellipse cx='10' cy='0' rx='11' ry='6' " + st('var(--wood)') + "/>";
    return "<g transform='scale(" + scale + ")'>" + s + '</g>';
  }
  var ICON = {
    egg: function () { return "<ellipse rx='11' ry='15' " + st('var(--card)') + "/>"; },
    eggs: function () { return "<ellipse cx='-8' cy='4' rx='6' ry='8' " + st('var(--card)') + "/><ellipse cx='6' cy='4' rx='6' ry='8' " + st('var(--card)') + "/><ellipse cx='-1' cy='-8' rx='6' ry='8' " + st('var(--card)') + "/>"; },
    chick: function () { return "<circle cx='-2' cy='5' r='12' " + st('var(--sim-2)', ';fill-opacity:.6') + "/><circle cx='9' cy='-9' r='7' " + st('var(--sim-2)', ';fill-opacity:.6') + "/><path d='M16 -10 l6 2 l-6 2 Z' style='fill:var(--sim-2)'/>"; },
    hen: function () { return line('M-4 12 v10 M4 12 v10') + "<ellipse cx='-3' cy='2' rx='17' ry='12' " + st('var(--card)') + "/><circle cx='13' cy='-12' r='7' " + st('var(--card)') + "/><path d='M10 -19 q3 -6 6 0 q3 -5 5 1 Z' style='fill:var(--sim-3)'/><path d='M20 -12 l6 2 l-6 2 Z' style='fill:var(--sim-2)'/>"; },
    tadpole: function () { return "<path d='M2 0 q12 -8 22 0 q-10 8 -22 0 Z' " + st('var(--muted)') + "/><ellipse cx='-6' cy='0' rx='11' ry='9' " + st('var(--muted)') + "/>"; },
    frog: function () { return line('M-14 6 l-8 8 M14 6 l8 8') + "<ellipse cx='0' cy='4' rx='17' ry='11' " + st('var(--leaf)') + "/><circle cx='-8' cy='-8' r='5' " + st('var(--leaf)') + "/><circle cx='8' cy='-8' r='5' " + st('var(--leaf)') + "/>"; },
    nymph: function () { return insect(0.75, false); },
    insect: function () { return insect(1, true); },
    butterfly: function () { return "<ellipse cx='-9' cy='-8' rx='10' ry='8' " + st('var(--sim-3)', ';fill-opacity:.6') + "/><ellipse cx='9' cy='-8' rx='10' ry='8' " + st('var(--sim-3)', ';fill-opacity:.6') + "/><ellipse cx='-7' cy='8' rx='7' ry='6' " + st('var(--sim-3)', ';fill-opacity:.6') + "/><ellipse cx='7' cy='8' rx='7' ry='6' " + st('var(--sim-3)', ';fill-opacity:.6') + "/>" + line('M0 -14 v28', 3) + line('M0 -14 l-5 -6 M0 -14 l5 -6', 1.2); },
    larva: function () { var s = ''; for (var i = 0; i < 5; i++) s += "<circle cx='" + (-16 + i * 8) + "' cy='0' r='5' " + st(i === 4 ? 'var(--stem)' : 'var(--leaf)') + "/>"; return s; },
    pupa: function () { return line('M0 -22 v6') + "<ellipse cx='0' cy='2' rx='8' ry='16' " + st('var(--wood)', ';fill-opacity:.7') + "/>"; },
    seed: function () { return "<ellipse rx='10' ry='7' " + st('var(--wood)', ';fill-opacity:.8') + "/>"; },
    young: function () { return line('M-16 12 H16', 1.2) + line('M0 12 v8 M0 14 l-5 6', 2, 'var(--wood)') + line('M0 12 V-6', 3, 'var(--stem)') + "<ellipse cx='-8' cy='-8' rx='8' ry='4' transform='rotate(-25 -8 -8)' " + st('var(--leaf)') + "/><ellipse cx='8' cy='-8' rx='8' ry='4' transform='rotate(25 8 -8)' " + st('var(--leaf)') + "/>"; },
    adult: function () { return line('M-18 18 H18', 1.2) + line('M0 18 V-12', 3, 'var(--stem)') + "<ellipse cx='-8' cy='4' rx='9' ry='4' transform='rotate(-20 -8 4)' " + st('var(--leaf)') + "/><ellipse cx='8' cy='-2' rx='9' ry='4' transform='rotate(20 8 -2)' " + st('var(--leaf)') + "/><circle cx='0' cy='-16' r='6' " + st('var(--sim-3)', ';fill-opacity:.7') + "/><circle cx='0' cy='-16' r='2.5' style='fill:var(--sim-2)'/>"; },
    fruit: function () { return "<path d='M-18 4 Q-14 -10 0 -8 Q16 -8 18 -2 Q14 10 0 8 Q-12 10 -18 4 Z' " + st('var(--leaf)') + "/><circle cx='-8' cy='0' r='3' " + st('var(--wood)') + "/><circle cx='0' cy='0' r='3' " + st('var(--wood)') + "/><circle cx='8' cy='0' r='3' " + st('var(--wood)') + "/>"; },
    q: function () { return "<text x='0' y='9' text-anchor='middle' style='font:700 26px var(--f-label);fill:var(--ink)'>?</text>"; }
  };
  /* ring diagram: nodes [{icon, label}], o = {hi, closed (default true), w, h} */
  function ring(nodes, o) {
    o = o || {};
    var n = nodes.length, W = o.w || 400, H = o.h || 270, cx = W / 2, cy = H / 2 - 6, R = Math.min(W, H) / 2 - 52, NR = 30, s = '', P = [];
    for (var i = 0; i < n; i++) { var a = (-90 + i * 360 / n) * Math.PI / 180; P.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    for (var k = 0; k < n; k++) {
      if (k === n - 1 && o.closed === false) break;
      var p1 = P[k], p2 = P[(k + 1) % n], dx = p2[0] - p1[0], dy = p2[1] - p1[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
      var x1 = p1[0] + ux * (NR + 6), y1 = p1[1] + uy * (NR + 6), x2 = p2[0] - ux * (NR + 8), y2 = p2[1] - uy * (NR + 8);
      var bx = x2 - ux * 9, by = y2 - uy * 9, px = -uy * 5, py = ux * 5;
      s += "<line x1='" + x1.toFixed(1) + "' y1='" + y1.toFixed(1) + "' x2='" + x2.toFixed(1) + "' y2='" + y2.toFixed(1) + "' style='stroke:var(--stroke);stroke-width:2'/>" +
        "<path d='M" + (bx + px).toFixed(1) + ' ' + (by + py).toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' L' + (bx - px).toFixed(1) + ' ' + (by - py).toFixed(1) + "' style='fill:none;stroke:var(--stroke);stroke-width:2'/>";
    }
    nodes.forEach(function (nd, j) {
      var p = P[j], hi = o.hi === j;
      s += "<circle cx='" + p[0].toFixed(1) + "' cy='" + p[1].toFixed(1) + "' r='" + NR + "' style='fill:var(--card);stroke:" + (hi ? 'var(--primary)' : 'var(--stroke)') + ';stroke-width:' + (hi ? 4 : 1.6) + "'/>";
      s += "<g transform='translate(" + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ")'>" + (ICON[nd.icon] ? ICON[nd.icon]() : '') + '</g>';
      /* labels: below the node; nodes on the left or right side get their label pushed outwards,
         clear of the arrows, and long labels wrap at " (" or at the last space */
      var side = p[0] > cx + 20 ? 1 : p[0] < cx - 20 ? -1 : 0, anchor = side > 0 ? 'start' : side < 0 ? 'end' : 'middle';
      var lx = side > 0 ? p[0] - 6 : side < 0 ? p[0] + 6 : p[0], lab = nd.label, l1 = lab, l2 = '';
      if (lab.length > 12) { var cut = lab.indexOf(' ('); if (cut < 0) cut = lab.lastIndexOf(' '); if (cut > 0) { l1 = lab.slice(0, cut); l2 = lab.slice(cut + 1); } }
      var fw = hi ? " style='font-weight:700'" : '';
      s += "<text class='lbl' x='" + lx.toFixed(1) + "' y='" + (p[1] + NR + 16).toFixed(1) + "' text-anchor='" + anchor + "'" + fw + '>' + l1 + '</text>';
      if (l2) s += "<text class='lbl' x='" + lx.toFixed(1) + "' y='" + (p[1] + NR + 31).toFixed(1) + "' text-anchor='" + anchor + "'" + fw + '>' + l2 + '</text>';
    });
    return s;
  }
  return { ICON: ICON, ring: ring };
})();



  function txt(x, y, s, anchor, cls) { return '<text class="lbl' + (cls == null ? ' sm' : cls ? ' ' + cls : '') + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  function press(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)); }); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------- E1 · a plant's life cycle ---------- */
  var PNODES = [{ icon: 'seed', label: 'Seed' }, { icon: 'young', label: 'Young plant' }, { icon: 'adult', label: 'Adult plant' }, { icon: 'fruit', label: 'Fruits with seeds' }];
  var PSTEPS = [
    [0, 'Seed', 'A new green bean plant starts from a seed.'],
    [1, 'Young plant', 'A root grows out first, then a shoot, then the first leaves. The young plant has roots, a stem and leaves, but no flowers yet.'],
    [2, 'Adult plant', 'The plant grows bigger and makes flowers.'],
    [3, 'Fruits with seeds', 'The flowers become bean pods: fruits with seeds inside.'],
    [0, 'Back to the seed', '<b>The new seeds can grow into new plants. The stages repeat: it is a cycle.</b>']
  ];
  var ps = 0;
  function drawPlant() {
    var s = PSTEPS[ps];
    $('#plantRing').innerHTML = CYC.ring(PNODES, { hi: s[0] });
    $('#plantTitle').textContent = 'Step ' + (ps + 1) + ' of ' + PSTEPS.length + ': ' + s[1];
    $('#plantMsg').innerHTML = s[2];
    $('#plantBack').disabled = ps === 0; $('#plantNext').disabled = ps === PSTEPS.length - 1;
  }
  $('#plantBack').addEventListener('click', function () { if (ps > 0) { ps--; drawPlant(); } });
  $('#plantNext').addEventListener('click', function () { if (ps < PSTEPS.length - 1) { ps++; drawPlant(); } });
  drawPlant();

  (function timeline() {
    var X = function (d) { return 100 + d * 3.8; }, s = '';
    s += '<path class="ln" d="M100 146 H404"/>';
    for (var d = 0; d <= 80; d += 20) s += '<line x1="' + X(d) + '" y1="142" x2="' + X(d) + '" y2="150" style="stroke:var(--stroke);stroke-width:1.5"/>' + txt(X(d), 164, String(d));
    s += txt(252, 180, 'days after the seed was planted');
    [['Green bean', 40, [5, 40, 55]], ['Balsam', 106, [7, 60, 75]]].forEach(function (r) {
      var y = r[1], dd = r[2];
      s += txt(92, y + 4, r[0], 'end', '') + '<line x1="' + X(0) + '" y1="' + y + '" x2="' + X(dd[2]) + '" y2="' + y + '" style="stroke:var(--line);stroke-width:6;stroke-linecap:round"/>';
      s += '<g transform="translate(' + X(dd[0]) + ' ' + y + ') scale(.6)">' + CYC.ICON.young() + '</g>' + txt(X(dd[0]), y - 16, 'leaves: ' + dd[0]);
      s += '<g transform="translate(' + X(dd[1]) + ' ' + y + ') scale(.6)">' + CYC.ICON.adult() + '</g>' + txt(X(dd[1]), y - 18, 'flowers: ' + dd[1]);
      s += '<g transform="translate(' + X(dd[2]) + ' ' + y + ') scale(.6)">' + CYC.ICON.fruit() + '</g>' + txt(X(dd[2]) + 4, y + 22, 'seeds: ' + dd[2]);
    });
    $('#timeline').innerHTML = s;
  })();

  /* ---------- E2 · animal life cycles ---------- */
  var T = {
    egg: 'The cycle starts with an egg laid by the adult.',
    young: 'The young hatches from the egg and grows into an adult.',
    tadpole: "The young (a tadpole) hatches from the egg. It doesn't look like the adult frog yet, but it grows into one.",
    larva: 'The <b>larva</b> does not look like the adult. It eats a lot and sheds its skin (moults) several times before it becomes a pupa.',
    pupa: 'The <b>pupa</b> does not look like the adult. It does not feed or move. The adult forms inside it.',
    nymph: 'The <b>nymph</b> looks like the adult, but it is smaller and has no wings. It sheds its skin (moults) several times as it grows into the adult.',
    adult: 'The adult can reproduce. It lays eggs, and the cycle begins again.'
  };
  function A(name, book, nodes) { return { name: name, book: book, nodes: nodes }; }
  var EGG = { icon: 'egg', label: 'Egg', t: 'egg' }, ADULT = { icon: 'insect', label: 'Adult', t: 'adult' }, NYMPH = { icon: 'nymph', label: 'Nymph', t: 'nymph' }, PUPA = { icon: 'pupa', label: 'Pupa', t: 'pupa' };
  var ANI = [
    A('chicken', false, [EGG, { icon: 'chick', label: 'Chick (young)', t: 'young' }, { icon: 'hen', label: 'Adult', t: 'adult' }]),
    A('frog', false, [{ icon: 'eggs', label: 'Eggs', t: 'egg' }, { icon: 'tadpole', label: 'Tadpole (young)', t: 'tadpole' }, { icon: 'frog', label: 'Adult', t: 'adult' }]),
    A('cockroach', false, [EGG, NYMPH, ADULT]),
    A('grasshopper', false, [EGG, NYMPH, ADULT]),
    A('butterfly', false, [EGG, { icon: 'larva', label: 'Larva (caterpillar)', t: 'larva' }, PUPA, { icon: 'butterfly', label: 'Adult', t: 'adult' }]),
    A('beetle', false, [EGG, { icon: 'larva', label: 'Larva (mealworm)', t: 'larva' }, PUPA, ADULT]),
    A('mosquito', false, [EGG, { icon: 'larva', label: 'Larva (wriggler)', t: 'larva' }, PUPA, ADULT]),
    A('dragonfly', true, [EGG, NYMPH, ADULT]),
    A('ladybird', true, [EGG, { icon: 'larva', label: 'Larva', t: 'larva' }, PUPA, ADULT]),
    A('wasp', true, [EGG, { icon: 'larva', label: 'Larva', t: 'larva' }, PUPA, ADULT]),
    A('housefly', true, [EGG, { icon: 'larva', label: 'Larva (maggot)', t: 'larva' }, PUPA, ADULT])
  ];
  $('#aniBtns').innerHTML = ANI.map(function (a, i) { return '<button type="button" class="chip-btn' + (a.book ? ' book' : '') + '" data-ani="' + i + '" aria-pressed="false">' + cap(a.name) + (a.book ? ' (from your book)' : '') + '</button>'; }).join('');
  var ai = 4, as = 0;
  function drawAni() {
    var a = ANI[ai], n = a.nodes[as];
    $('#aniRing').innerHTML = CYC.ring(a.nodes, { hi: as });
    $('#aniRing').setAttribute('aria-label', 'The life cycle of a ' + a.name + ': ' + a.nodes.map(function (x) { return x.label; }).join(', then '));
    $('#aniTitle').textContent = cap(a.name) + ' (' + a.nodes.length + ' stages) · stage ' + (as + 1) + ': ' + n.label;
    $('#aniMsg').innerHTML = T[n.t];
    $('#aniBack').disabled = as === 0; $('#aniNext').disabled = as === a.nodes.length - 1;
    press('[data-ani]', 'data-ani', String(ai));
  }
  $('#aniBtns').addEventListener('click', function (e) { var b = e.target.closest('[data-ani]'); if (b) { ai = +b.getAttribute('data-ani'); as = 0; drawAni(); } });
  $('#aniBack').addEventListener('click', function () { if (as > 0) { as--; drawAni(); } });
  $('#aniNext').addEventListener('click', function () { if (as < ANI[ai].nodes.length - 1) { as++; drawAni(); } });
  drawAni();

  P.widgets.classify($('#stageSort'), {
    prompt: 'Tap an animal, then tap the kind of life cycle it has.',
    bins: [{ id: '3', label: '3-stage life cycle' }, { id: '4', label: '4-stage life cycle' }],
    items: ANI.map(function (a) {
      var four = a.nodes.length === 4, mid = a.nodes[1].t;
      return { id: a.name, label: a.name + (a.book ? ' (from your book)' : ''), bin: four ? '4' : '3',
        why: four ? 'egg → larva → pupa → adult.' : 'egg → ' + (mid === 'nymph' ? 'nymph' : 'young') + ' → adult. There is no pupa.' };
    })
  });

  /* ---------- E3 · larva, pupa or nymph ---------- */
  P.widgets.classify($('#lpnSort'), {
    prompt: 'Tap a description, then tap the stage it describes.',
    bins: [{ id: 'l', label: 'Larva' }, { id: 'p', label: 'Pupa' }, { id: 'n', label: 'Nymph' }],
    items: [
      { id: 'l1', label: 'does not look like the adult, and eats a lot', bin: 'l', why: 'A larva eats a lot and grows.' },
      { id: 'l2', label: "a butterfly's caterpillar", bin: 'l', why: 'A caterpillar is the larva of a butterfly.' },
      { id: 'l3', label: 'grows and sheds its skin before it becomes a pupa', bin: 'l', why: 'The larva comes before the pupa.' },
      { id: 'p1', label: 'does not feed or move', bin: 'p', why: 'The pupa is a still, resting stage.' },
      { id: 'p2', label: 'the adult forms inside it', bin: 'p', why: 'The adult forms inside the pupa.' },
      { id: 'p3', label: 'comes just before the adult in a 4-stage cycle', bin: 'p', why: 'Egg → larva → pupa → adult.' },
      { id: 'n1', label: 'looks like the adult but smaller', bin: 'n', why: 'A nymph looks like a small adult.' },
      { id: 'n2', label: 'has no wings yet', bin: 'n', why: 'A nymph grows its wings as it becomes an adult.' },
      { id: 'n3', label: 'a young grasshopper', bin: 'n', why: 'A grasshopper has 3 stages: egg, nymph, adult.' }
    ]
  });

  /* ---------- E4 · put the stages in order ---------- */
  var PUZ = [
    { name: 'butterfly', nodes: [{ icon: 'egg', label: 'Egg' }, { icon: 'larva', label: 'Larva (caterpillar)' }, { icon: 'pupa', label: 'Pupa' }, { icon: 'butterfly', label: 'Adult butterfly' }], shuffle: [2, 0, 3, 1] },
    { name: 'cockroach', nodes: [{ icon: 'egg', label: 'Egg' }, { icon: 'nymph', label: 'Nymph' }, { icon: 'insect', label: 'Adult cockroach' }], shuffle: [1, 2, 0] },
    { name: 'chicken', nodes: [{ icon: 'egg', label: 'Egg' }, { icon: 'chick', label: 'Chick' }, { icon: 'hen', label: 'Adult chicken' }], shuffle: [2, 1, 0] },
    { name: 'green bean plant', nodes: [{ icon: 'seed', label: 'Seed' }, { icon: 'young', label: 'Young plant' }, { icon: 'adult', label: 'Adult plant' }, { icon: 'fruit', label: 'Fruits with seeds' }], shuffle: [3, 1, 0, 2] }
  ];
  var pz = 0, picks = [], checked = null;
  $('#puzBtns').innerHTML = PUZ.map(function (p, i) { return '<button type="button" class="chip-btn" data-pz="' + i + '" aria-pressed="false">' + cap(p.name) + '</button>'; }).join('');
  function drawPuz() {
    var p = PUZ[pz], n = p.nodes.length;
    press('[data-pz]', 'data-pz', String(pz));
    $('#puzTitle').textContent = 'The life cycle of a ' + p.name + ' (' + n + ' stages)';
    var slots = '';
    for (var i = 0; i < n; i++) {
      var k = picks[i], st = checked ? (checked[i] ? ' ok' : ' no') : '';
      slots += '<div class="y-slot' + (k != null ? ' full' : '') + st + '">' + (checked ? (checked[i] ? '✓ ' : '✗ ') : '') + (k != null ? p.nodes[k].label : (i + 1) + '. ?') + '</div>' + (i < n - 1 ? '<span class="y-arrow" aria-hidden="true">→</span>' : '');
    }
    $('#puzSlots').innerHTML = slots;
    $('#puzCards').innerHTML = p.shuffle.map(function (k) { return '<button type="button" class="chip-btn" data-card="' + k + '"' + (picks.indexOf(k) >= 0 || checked ? ' disabled' : '') + '>' + p.nodes[k].label + '</button>'; }).join('');
    $('#puzCheck').disabled = picks.length < n || !!checked;
    var allOk = checked && checked.every(Boolean);
    $('#puzRingBox').hidden = !allOk;
    if (allOk) $('#puzRing').innerHTML = CYC.ring(p.nodes, {});
  }
  $('#puzBtns').addEventListener('click', function (e) { var b = e.target.closest('[data-pz]'); if (b) { pz = +b.getAttribute('data-pz'); picks = []; checked = null; $('#puzMsg').innerHTML = ''; drawPuz(); } });
  $('#puzCards').addEventListener('click', function (e) { var b = e.target.closest('[data-card]'); if (!b || b.disabled) return; picks.push(+b.getAttribute('data-card')); drawPuz(); });
  $('#puzUndo').addEventListener('click', function () { if (checked) checked = null; picks.pop(); $('#puzMsg').innerHTML = ''; drawPuz(); });
  $('#puzClear').addEventListener('click', function () { picks = []; checked = null; $('#puzMsg').innerHTML = ''; drawPuz(); });
  $('#puzCheck').addEventListener('click', function () {
    checked = picks.map(function (k, i) { return k === i; });
    var n = checked.filter(Boolean).length;
    $('#puzMsg').innerHTML = n === checked.length ? '✓ <b>All in order.</b> The adult makes ' + (PUZ[pz].nodes[0].icon === 'seed' ? 'seeds' : 'eggs') + ', so the cycle starts again.'
      : '✗ <b>' + n + ' of ' + checked.length + ' in the right place.</b> Press Clear and try again. Every cycle starts with the ' + PUZ[pz].nodes[0].label.toLowerCase() + '.';
    drawPuz();
  });
  drawPuz();

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
