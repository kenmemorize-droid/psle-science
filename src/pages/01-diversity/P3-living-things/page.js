/* P3 Living things unit: knowledge cards, four Explore stations, three Beyond toggles, unit check. */
(function () {
  'use strict';
  var P = window.PSLE, $ = P.$, $$ = P.$$;

  if (window.matchMedia && matchMedia('(max-width: 640px)').matches)
    $$('#know details.kcard').forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });

  function txt(x, y, s, anchor, cls) { return '<text class="lbl' + (cls == null ? ' sm' : cls ? ' ' + cls : '') + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  function press(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)); }); }

  /* ---------- E1 · alive or not? ---------- */
  var DAYS = {
    0: 'Day 0: the bean seed is small and hard. The pebble is grey and hard. Both sit on wet cotton wool.',
    2: 'Day 2: the seed has swollen, and a tiny root has come out. The pebble looks the same.',
    5: 'Day 5: the root is longer, and a shoot has grown upwards. The pebble looks the same.',
    8: 'Day 8: the shoot has leaves. <b>The seed grew, so it is living.</b> The pebble did not change: <b>it is not living.</b>'
  };
  function drawSeed(d) {
    var s = '<rect class="v-wool" x="40" y="130" width="340" height="34" rx="10"/><rect class="v-wet" x="44" y="134" width="332" height="26" rx="8"/>' + txt(210, 186, 'wet cotton wool');
    var sw = d >= 2 ? 1.2 : 1;
    s += '<ellipse class="v-seed" cx="130" cy="122" rx="' + (16 * sw) + '" ry="' + (11 * sw) + '"/>';
    if (d >= 2) s += '<path class="v-root" d="M134 132 Q138 ' + (140 + (d >= 5 ? 10 : 0)) + ' ' + (136 + (d >= 5 ? 8 : 0)) + ' ' + (146 + (d >= 5 ? 14 : 0) + (d >= 8 ? 4 : 0)) + '"/>';
    if (d >= 5) s += '<path class="v-shoot" d="M128 112 Q124 ' + (d >= 8 ? 70 : 90) + ' 132 ' + (d >= 8 ? 50 : 82) + '"/>';
    if (d >= 8) s += '<ellipse class="v-leaf" cx="116" cy="50" rx="18" ry="8" transform="rotate(-25 116 50)"/><ellipse class="v-leaf" cx="148" cy="48" rx="18" ry="8" transform="rotate(25 148 48)"/>';
    s += '<path class="v-rock" d="M272 132 l6 -18 l20 -6 l16 8 l4 16 Z"/>';
    s += txt(130, 30, 'bean seed', 'middle', '') + txt(290, 30, 'pebble', 'middle', '');
    $('#seedSvg').innerHTML = s;
    $('#seedMsg').innerHTML = DAYS[d];
    press('[data-day]', 'data-day', String(d));
  }
  $$('[data-day]').forEach(function (b) { b.addEventListener('click', function () { drawSeed(+b.getAttribute('data-day')); }); });
  drawSeed(0);

  P.widgets.classify($('#livSort'), {
    prompt: 'Tap a card, then tap the group it belongs in.',
    bins: [{ id: 'liv', label: 'Living' }, { id: 'non', label: 'Not living' }],
    items: [
      { id: 'cat', label: 'a cat', bin: 'liv', why: 'It needs food, water and air, grows, responds and reproduces.' },
      { id: 'rose', label: 'a rose bush', bin: 'liv', why: 'Plants are living: they grow, respond and reproduce.' },
      { id: 'seed', label: 'a bean seed', bin: 'liv', why: 'A seed is living. It grows when it gets water.' },
      { id: 'mush', label: 'a mushroom', bin: 'liv', why: 'A mushroom is a fungus, a living thing.' },
      { id: 'mould', label: 'mould on bread', bin: 'liv', why: 'Mould is a fungus. It grows and spreads.' },
      { id: 'yeast', label: 'yeast', bin: 'liv', why: 'Yeast is a fungus, a living thing.' },
      { id: 'bact', label: 'bacteria', bin: 'liv', why: 'Bacteria are tiny living things.' },
      { id: 'pebble', label: 'a pebble', bin: 'non', why: 'It does not grow, respond or reproduce.' },
      { id: 'car', label: 'a toy car that moves', bin: 'non', why: 'It moves, but it does not grow, reproduce or need food, water and air.' },
      { id: 'robot', label: 'a toy robot dog that barks', bin: 'non', why: "It moves and makes sounds, but it doesn't grow, reproduce or need food, water and air." },
      { id: 'balloon', label: 'a balloon being blown up', bin: 'non', why: 'It gets bigger only because air is pushed in. It cannot grow by itself.' },
      { id: 'clock', label: 'a ticking clock', bin: 'non', why: 'Its hands move, but it does not grow or reproduce.' },
      { id: 'chair', label: 'a wooden chair', bin: 'non', why: 'The wood came from a tree, but the chair is not living now.' }
    ]
  });
  P.widgets.classify($('#charSort'), {
    prompt: 'Which characteristic of living things does each example show?',
    bins: [{ id: 'need', label: 'Needs water, food and air' }, { id: 'grow', label: 'Grows' }, { id: 'resp', label: 'Responds' }, { id: 'repro', label: 'Reproduces' }],
    items: [
      { id: 'hen', label: 'a chick becomes a hen', bin: 'grow', why: 'Getting bigger over time is growing.' },
      { id: 'tall', label: 'a seedling gets taller', bin: 'grow', why: 'Getting bigger over time is growing.' },
      { id: 'snail', label: 'a snail pulls into its shell when touched', bin: 'resp', why: 'It reacts to the touch: it responds.' },
      { id: 'bend', label: 'a plant bends towards a window', bin: 'resp', why: 'It reacts to the light: it responds.' },
      { id: 'kits', label: 'a cat has kittens', bin: 'repro', why: 'Making young of its own kind is reproducing.' },
      { id: 'seeds', label: 'a plant makes seeds', bin: 'repro', why: 'Seeds grow into new plants: the plant reproduces.' },
      { id: 'ham', label: 'a hamster must be given food and water', bin: 'need', why: 'It needs food and water to survive.' },
      { id: 'fish', label: 'a goldfish dies if its water has no air in it', bin: 'need', why: 'It needs air to survive.' }
    ]
  });

  /* ---------- E2 · six groups of animals ---------- */
  var GRP = [
    { id: 'mam', name: 'Mammals', see: ['bodies covered with hair or fur'], book: 'breathe with lungs; feed their young milk',
      art: function () { var s = '<rect x="40" y="35" width="160" height="80" rx="30" style="fill:var(--wood);fill-opacity:.5;stroke:var(--stroke);stroke-width:2"/>'; for (var i = 0; i < 22; i++) { var x = 52 + (i % 11) * 13, y = 50 + Math.floor(i / 11) * 34; s += '<path d="M' + x + ' ' + y + ' q4 10 0 20" style="fill:none;stroke:var(--stroke);stroke-width:1.5"/>'; } return s + txt(120, 140, 'fur', 'middle', ''); } },
    { id: 'bird', name: 'Birds', see: ['feathers', 'a beak', 'two wings and two legs'], book: 'lay eggs; breathe with lungs',
      art: function () { var s = '<path d="M60 120 Q90 20 180 25 Q150 90 60 120 Z" style="fill:var(--fa);stroke:var(--stroke);stroke-width:2"/><path d="M60 120 L170 30" style="stroke:var(--stroke);stroke-width:2"/>'; for (var i = 1; i < 7; i++) s += '<path d="M' + (60 + i * 15) + ' ' + (120 - i * 12) + ' l-10 -14 M' + (60 + i * 15) + ' ' + (120 - i * 12) + ' l14 8" style="stroke:var(--stroke);stroke-width:1"/>'; return s + txt(120, 140, 'a feather', 'middle', ''); } },
    { id: 'fish', name: 'Fish', see: ['scales', 'fins', 'they live in water'], book: 'breathe with gills',
      art: function () { var s = '<path d="M30 75 Q90 20 170 75 Q90 130 30 75 Z" style="fill:var(--sim-1);fill-opacity:.35;stroke:var(--stroke);stroke-width:2"/><path d="M170 75 L210 45 L210 105 Z" style="fill:var(--sim-1);fill-opacity:.35;stroke:var(--stroke);stroke-width:2"/>'; for (var r = 0; r < 3; r++) for (var c = 0; c < (r === 1 ? 5 : 4); c++) s += '<path d="M' + (68 + c * 16 + (r === 1 ? 0 : 8)) + ' ' + (64 + r * 12) + ' a8 8 0 0 1 16 0" style="fill:none;stroke:var(--stroke);stroke-width:1.2"/>'; return s + txt(120, 140, 'scales and fins', 'middle', ''); } },
    { id: 'amph', name: 'Amphibians', see: ['moist, smooth skin with no scales'], book: 'young breathe with gills; adults with lungs or moist skin',
      art: function () { var s = '<rect x="40" y="35" width="160" height="80" rx="40" style="fill:var(--leaf);stroke:var(--stroke);stroke-width:2"/>'; [[70, 60], [110, 80], [150, 55], [170, 90], [90, 95]].forEach(function (d) { s += '<path d="M' + d[0] + ' ' + d[1] + ' q5 8 0 12 q-5 -4 0 -12 Z" style="fill:var(--sim-1);stroke:var(--stroke);stroke-width:1"/>'; }); return s + txt(120, 140, 'moist, smooth skin', 'middle', ''); } },
    { id: 'rept', name: 'Reptiles', see: ['dry, scaly skin'], book: 'lay eggs with leathery shells; breathe with lungs',
      art: function () { var s = '<rect x="40" y="35" width="160" height="80" rx="12" style="fill:var(--sim-2);fill-opacity:.35;stroke:var(--stroke);stroke-width:2"/>'; for (var r = 0; r < 4; r++) for (var c = 0; c < (r % 2 ? 7 : 8); c++) s += '<rect x="' + (48 + c * 19 + (r % 2) * 9) + '" y="' + (42 + r * 18) + '" width="15" height="13" rx="3" style="fill:none;stroke:var(--stroke);stroke-width:1.2"/>'; return s + txt(120, 140, 'dry, scaly skin', 'middle', ''); } },
    { id: 'ins', name: 'Insects', see: ['a hard body covering', '3 body parts: head, thorax, abdomen', '6 legs', 'most have wings'], book: 'breathe through tiny holes called spiracles',
      art: function () {
        var s = '<circle cx="60" cy="70" r="14" style="fill:var(--wood);fill-opacity:.6;stroke:var(--stroke);stroke-width:2"/><ellipse cx="100" cy="70" rx="24" ry="16" style="fill:var(--wood);fill-opacity:.6;stroke:var(--stroke);stroke-width:2"/><ellipse cx="160" cy="70" rx="36" ry="20" style="fill:var(--wood);fill-opacity:.6;stroke:var(--stroke);stroke-width:2"/>';
        [84, 100, 116].forEach(function (x) { s += '<path d="M' + x + ' 82 l-8 26 M' + x + ' 58 l-8 -26" style="stroke:var(--stroke);stroke-width:2"/>'; });
        return s + txt(60, 108, 'head') + txt(104, 124, 'thorax') + txt(160, 104, 'abdomen') + txt(120, 144, '3 body parts, 6 legs', 'middle', '');
      } }
  ];
  $('#grpBtns').innerHTML = GRP.map(function (g) { return '<button type="button" class="chip-btn" data-g="' + g.id + '" aria-pressed="false">' + g.name + '</button>'; }).join('');
  function showGrp(id) {
    var g = GRP.filter(function (x) { return x.id === id; })[0];
    press('[data-g]', 'data-g', id);
    $('#grpSvg').innerHTML = g ? g.art() : txt(120, 80, 'Tap a group', 'middle', '');
    $('#grpSvg').setAttribute('aria-label', g ? 'A drawing of what you can see on ' + g.name.toLowerCase() : 'No group chosen yet');
    $('#grpInfo').innerHTML = !g ? '<p class="note-s">Nothing chosen yet.</p>' :
      '<h4>' + g.name + '</h4><p>What you can see:</p><ul>' + g.see.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p class="note-s"><b>Your book also says</b> (not tested): ' + g.book + '.</p>';
  }
  $('#grpBtns').addEventListener('click', function (e) { var b = e.target.closest('[data-g]'); if (b) showGrp(b.getAttribute('data-g')); });
  showGrp(null);

  P.widgets.classify($('#animalSort'), {
    prompt: 'Tap an animal, then tap its group. Look at its body features.',
    bins: GRP.map(function (g) { return { id: g.id, label: g.name }; }).concat([{ id: 'none', label: 'None of these six' }]),
    items: [
      { id: 'bat', label: 'a flying animal with fur on its body (a bat)', bin: 'mam', why: 'Fur makes it a mammal, even though it flies.' },
      { id: 'rabbit', label: 'an animal with fur that lives in a burrow (a rabbit)', bin: 'mam', why: 'Fur makes it a mammal.' },
      { id: 'penguin', label: 'a swimming animal with feathers, a beak and two wings that cannot fly (a penguin)', bin: 'bird', why: 'Feathers and a beak make it a bird, even though it cannot fly.' },
      { id: 'eagle', label: 'an animal with feathers and a hooked beak (an eagle)', bin: 'bird', why: 'Feathers and a beak make it a bird.' },
      { id: 'shark', label: 'a sea animal with scales and fins (a shark)', bin: 'fish', why: 'Scales and fins make it a fish.' },
      { id: 'frog', label: 'an animal with moist, smooth skin that lives near ponds (a frog)', bin: 'amph', why: 'Moist, smooth skin makes it an amphibian.' },
      { id: 'turtle', label: 'a sea animal with flippers and dry, scaly skin that lays eggs on the beach (a sea turtle)', bin: 'rept', why: 'Dry, scaly skin makes it a reptile, even though it lives in the sea.' },
      { id: 'snake', label: 'a long animal with no legs and dry, scaly skin (a snake)', bin: 'rept', why: 'Dry, scaly skin makes it a reptile.' },
      { id: 'ant', label: 'an animal with 6 legs, 3 body parts and no wings (an ant)', bin: 'ins', why: '6 legs and 3 body parts make it an insect, even without wings.' },
      { id: 'fly', label: 'an animal with 6 legs, 3 body parts and 2 pairs of wings (a butterfly)', bin: 'ins', why: '6 legs and 3 body parts make it an insect.' },
      { id: 'spider', label: 'an animal with 8 legs and 2 body parts (a spider)', bin: 'none', why: 'A spider has 8 legs and 2 body parts, so it is not an insect, or in any of these six groups.' }
    ]
  });

  /* ---------- E3 · plants and classification charts ---------- */
  P.widgets.classify($('#flowerSort'), {
    prompt: 'Tap a plant, then tap its group.',
    bins: [{ id: 'f', label: 'Flowering plant' }, { id: 'n', label: 'Non-flowering plant' }],
    items: [
      { id: 'hib', label: 'hibiscus', bin: 'f', why: 'Hibiscus makes large flowers.' },
      { id: 'sun', label: 'sunflower', bin: 'f', why: 'A sunflower makes a big flower.' },
      { id: 'bal', label: 'balsam', bin: 'f', why: 'Balsam makes flowers, then seeds.' },
      { id: 'mango', label: 'mango tree', bin: 'f', why: 'A mango tree flowers before it fruits.' },
      { id: 'rose', label: 'rose', bin: 'f', why: 'A rose makes flowers.' },
      { id: 'fern', label: 'fern', bin: 'n', why: 'A fern has leaves, a stem and roots, but it never makes flowers.' },
      { id: 'moss', label: 'moss', bin: 'n', why: 'Moss never makes flowers. It is still a plant.' }
    ]
  });

  var PLANTS = [
    { n: 'mango tree', f: 1, w: 0, c: 0, r: 0 }, { n: 'hibiscus', f: 1, w: 0, c: 0, r: 0 },
    { n: 'morning glory (climbs a fence)', f: 1, w: 0, c: 1, r: 0 }, { n: 'passion fruit vine (climbs a frame)', f: 1, w: 0, c: 1, r: 0 },
    { n: 'water lily (floats on a pond)', f: 1, w: 1, c: 0, r: 0 }, { n: 'lotus (grows in a pond)', f: 1, w: 1, c: 0, r: 0 },
    { n: 'fern', f: 0, w: 0, c: 0, r: 0 }, { n: 'moss', f: 0, w: 0, c: 0, r: 0 }
  ];
  var CQ = [{ k: 'f', q: 'Does it have flowers?' }, { k: 'w', q: 'Does it grow in water?' }, { k: 'c', q: 'Does it climb up a support?' }, { k: 'r', q: 'Are some of its roots above the ground?' }];
  var PUZ = [{ k: 'f', a: ['fern', 'moss'] }, { k: 'w', a: ['water lily (floats on a pond)', 'lotus (grows in a pond)'] }, { k: 'c', a: ['morning glory (climbs a fence)', 'passion fruit vine (climbs a frame)'] }];
  var pz = 0;
  function short(n) { return n.replace(/ \(.*\)$/, ''); }
  function showPuzzle() {
    var t = PUZ[pz];
    $('#chartTarget').innerHTML = '<b>Puzzle ' + (pz + 1) + ' of ' + PUZ.length + '.</b> Group A: ' + t.a.map(short).join(', ') + ' · Group B: all the others (' + PLANTS.filter(function (p) { return t.a.indexOf(p.n) < 0; }).map(function (p) { return short(p.n); }).join(', ') + ').';
    $('#chartQs').innerHTML = CQ.map(function (c) { return '<button type="button" class="chip-btn" data-cq="' + c.k + '" aria-pressed="false">' + c.q + '</button>'; }).join('');
    $('#chartCols').innerHTML = ''; $('#chartMsg').innerHTML = '';
  }
  $('#chartQs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cq]'); if (!b) return;
    var k = b.getAttribute('data-cq'), t = PUZ[pz], q = CQ.filter(function (c) { return c.k === k; })[0];
    press('[data-cq]', 'data-cq', k);
    var yes = PLANTS.filter(function (p) { return p[k]; }), no = PLANTS.filter(function (p) { return !p[k]; });
    var col = function (h, list) { return '<div class="v-col"><h5>' + h + '</h5>' + (list.length ? '<ul>' + list.map(function (p) { return '<li>' + p.n + '</li>'; }).join('') + '</ul>' : '<p class="note-s">none</p>') + '</div>'; };
    $('#chartCols').innerHTML = col('Yes', yes) + col('No', no);
    var groupA = PLANTS.filter(function (p) { return t.a.indexOf(p.n) >= 0; });
    var match = function (list) { return list.length === groupA.length && list.every(function (p) { return t.a.indexOf(p.n) >= 0; }); };
    var ok = match(yes) || match(no);
    $('#chartMsg').innerHTML = ok ? '✓ <b>Right.</b> "' + q.q + '" puts ' + groupA.map(function (p) { return short(p.n); }).join(' and ') + ' on one side and every other plant on the other.'
      : '✗ <b>Not this one.</b> "' + q.q + '" splits the plants differently. Look at what Group A has, or lacks, that every other plant does not.';
  });
  $('#chartNext').addEventListener('click', function () { pz = (pz + 1) % PUZ.length; showPuzzle(); });
  showPuzzle();

  /* ---------- E4 · fungi and bacteria ---------- */
  var MP = {
    cap: ['the top of the mushroom', '<path class="v-hl" d="M40 100Q150 -10 260 100Z"/>'],
    gills: ['thin folds under the cap, where the spores are made', '<rect class="v-hl" x="58" y="98" width="184" height="26" rx="6"/>'],
    spores: ['tiny specks that drop from the gills. Each one can grow into a new mushroom', '<circle class="v-hl" cx="96" cy="150" r="22"/><circle class="v-hl" cx="204" cy="158" r="26"/>'],
    stalk: ['holds the cap up', '<rect class="v-hl" x="116" y="116" width="68" height="94" rx="6"/>']
  };
  function drawMush(k) {
    var s = '<path class="v-cap" d="M40 100Q150 -10 260 100Z"/><path class="ln" d="M48 100H252"/>';
    [70, 95, 120, 150, 180, 205, 230].forEach(function (x, i) { s += '<line class="v-gill" x1="' + x + '" y1="100" x2="' + x + '" y2="' + (114 + (i % 3) * 3) + '"/>'; });
    s += '<path class="v-stalk" d="M128 120Q124 190 118 205H182Q176 190 172 120Z"/>';
    [[105, 140], [92, 155], [200, 140], [212, 158], [196, 175]].forEach(function (p) { s += '<circle class="v-spore" cx="' + p[0] + '" cy="' + p[1] + '" r="2.5"/>'; });
    s += txt(262, 40, 'cap', 'start', '') + txt(14, 132, 'gills', 'start', '') + txt(222, 190, 'spores', 'start', '') + txt(190, 214, 'stalk', 'start', '');
    if (k) s += MP[k][1];
    $('#mushSvg').innerHTML = s;
    press('[data-mp]', 'data-mp', k || '');
    $('#mushMsg').innerHTML = k ? '<b>' + k.charAt(0).toUpperCase() + k.slice(1) + ':</b> ' + MP[k][0] + '.' : 'Tap a part of the mushroom.';
  }
  $$('[data-mp]').forEach(function (b) { b.addEventListener('click', function () { drawMush(b.getAttribute('data-mp')); }); });
  drawMush(null);

  var MOULD = { 1: [], 4: [[90, 70, 10], [190, 100, 8]], 7: [[90, 70, 22], [190, 100, 18], [140, 55, 12], [210, 60, 10], [120, 110, 14]] };
  var MMSG = { 1: 'Day 1: a fresh slice of bread, kept in a damp, warm place.', 4: 'Day 4: small fuzzy spots have appeared.', 7: 'Day 7: the fuzzy patches have spread. <b>Mould is a fungus. It grows on food, especially in damp, warm places.</b>' };
  function drawMould(d) {
    var s = '<path class="v-bread" d="M60 150 V60 Q60 20 100 24 Q150 4 200 24 Q240 20 240 60 V150 Z"/><path class="v-crust" d="M60 150 V60 Q60 20 100 24 Q150 4 200 24 Q240 20 240 60 V150 Z"/>';
    MOULD[d].forEach(function (m) {
      for (var i = 0; i < 9; i++) { var a = i * 0.7, k = 0.45 + (i % 3) * 0.12; s += '<circle class="v-mould" cx="' + (m[0] + Math.cos(a) * m[2] * k).toFixed(1) + '" cy="' + (m[1] + Math.sin(a) * m[2] * k).toFixed(1) + '" r="' + (m[2] * 0.42).toFixed(1) + '"/>'; }
      s += '<circle class="v-mould" style="stroke:none" cx="' + m[0] + '" cy="' + m[1] + '" r="' + (m[2] * 0.6).toFixed(1) + '"/>';
    });
    if (d > 1) s += txt(150, 166, 'fuzzy patches of mould', 'middle', '');
    $('#mouldSvg').innerHTML = s; $('#mouldMsg').innerHTML = MMSG[d];
    press('[data-mday]', 'data-mday', String(d));
  }
  $$('[data-mday]').forEach(function (b) { b.addEventListener('click', function () { drawMould(+b.getAttribute('data-mday')); }); });
  drawMould(1);

  var scope = false;
  function drawScope() {
    var s;
    if (!scope) s = '<path d="M150 40 Q190 100 150 130 Q110 100 150 40 Z" style="fill:var(--sim-1);fill-opacity:.3;stroke:var(--stroke);stroke-width:2"/>' + txt(150, 156, 'a drop of pond water: you see nothing living', 'middle', '');
    else {
      s = '<circle cx="150" cy="80" r="70" style="fill:var(--sunk);stroke:var(--stroke);stroke-width:3"/>';
      [[110, 60, 0], [140, 95, 30], [180, 70, -20], [165, 110, 60], [125, 110, 10]].forEach(function (b) { s += '<rect class="v-bact" x="' + (b[0] - 10) + '" y="' + (b[1] - 4) + '" width="20" height="8" rx="4" transform="rotate(' + b[2] + ' ' + b[0] + ' ' + b[1] + ')"/>'; });
      [[130, 40], [160, 45], [190, 100], [100, 90], [150, 130]].forEach(function (b) { s += '<circle class="v-bact" cx="' + b[0] + '" cy="' + b[1] + '" r="5"/>'; });
      s += txt(150, 166, 'through a microscope: tiny rods and balls', 'middle', '');
    }
    $('#scopeSvg').innerHTML = s;
    $('#scopeBtn').setAttribute('aria-pressed', String(scope));
    $('#scopeBtn').textContent = scope ? 'Look with your eyes only' : 'Look through a microscope';
    $('#scopeMsg').innerHTML = scope ? '<b>Bacteria are living things too small to see with your eyes alone.</b> They are found everywhere.' : 'With your eyes alone, the drop looks empty.';
  }
  $('#scopeBtn').addEventListener('click', function () { scope = !scope; drawScope(); });
  drawScope();

  P.widgets.classify($('#kingdomSort'), {
    prompt: 'Tap a living thing, then tap its group.',
    bins: [{ id: 'plant', label: 'Plant' }, { id: 'animal', label: 'Animal' }, { id: 'fungus', label: 'Fungus' }, { id: 'bact', label: 'Bacteria' }],
    items: [
      { id: 'mush', label: 'mushroom', bin: 'fungus', why: 'A fungus, not a plant: it is not green and cannot make its own food.' },
      { id: 'mould', label: 'mould', bin: 'fungus', why: 'Mould is a fungus.' },
      { id: 'yeast', label: 'yeast', bin: 'fungus', why: 'Yeast is a fungus.' },
      { id: 'yog', label: 'bacteria in yoghurt', bin: 'bact', why: 'Bacteria: tiny living things seen only through a microscope.' },
      { id: 'fern', label: 'fern', bin: 'plant', why: 'A green plant that never makes flowers.' },
      { id: 'moss', label: 'moss', bin: 'plant', why: 'A green plant that never makes flowers.' },
      { id: 'frog', label: 'frog', bin: 'animal', why: 'An amphibian, which is a group of animals.' },
      { id: 'butterfly', label: 'butterfly', bin: 'animal', why: 'An insect, which is a group of animals.' }
    ]
  });

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
