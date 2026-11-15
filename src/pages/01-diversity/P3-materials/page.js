/* P3 Materials unit: knowledge cards, three Explore stations, two Beyond toggles, unit check. */
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

  /* ---------- E1 · the test bench ---------- */
  function strip(x1, x2, y, sag, cls) {
    return '<path class="' + cls + '" d="M' + x1 + ' ' + (y - 5) + ' Q' + ((x1 + x2) / 2) + ' ' + (y - 5 + sag * 2) + ' ' + x2 + ' ' + (y - 5) + ' L' + x2 + ' ' + (y + 5) + ' Q' + ((x1 + x2) / 2) + ' ' + (y + 5 + sag * 2) + ' ' + x1 + ' ' + (y + 5) + ' Z"/>';
  }
  function weights(x, y, n) { var s = '<line x1="' + x + '" y1="' + (y - 14) + '" x2="' + x + '" y2="' + y + '" style="stroke:var(--stroke);stroke-width:2"/>'; for (var i = 0; i < n; i++) s += '<rect class="m-weight" x="' + (x - 16) + '" y="' + (y + i * 15) + '" width="32" height="12" rx="2"/>'; return s; }

  var TABS = {
    strength: {
      how: 'A strip rests on two supports. Weights are hung from its middle, one at a time, up to 5.',
      items: [
        { id: 'paper', name: 'paper', cls: 'm-plain', ok: false, res: 'not strong: tore with 1 weight', msg: 'The paper strip tore as soon as 1 weight was hung on it. Paper is <b>not strong</b>.' },
        { id: 'wood', name: 'wood', cls: 'm-wood', ok: true, res: 'strong: held all 5 weights', msg: 'The wooden strip held all 5 weights without breaking. Wood is <b>strong</b>.' },
        { id: 'metal', name: 'metal', cls: 'm-metal', ok: true, res: 'strong: held all 5 weights', msg: 'The metal strip held all 5 weights without breaking. Metal is <b>strong</b>.' }
      ],
      draw: function (it, t) {
        var s = '<rect class="m-plain" x="50" y="92" width="44" height="120"/><rect class="m-plain" x="306" y="92" width="44" height="120"/><path class="ln" d="M20 212 H380"/>';
        var n = it.ok ? Math.min(5, Math.ceil(t * 5)) : (t > 0 ? 1 : 0);
        if (!it.ok && t > 0.35) {
          s += '<path class="' + it.cls + '" d="M50 82 L196 112 L194 122 L50 92 Z"/><path class="' + it.cls + '" d="M350 82 L204 112 L206 122 L350 92 Z"/>' + weights(200, 198, 1).replace(/<line[^>]*>/, '');
          return s + txt(200, 40, 'torn!', 'middle', '') + txt(200, 232, 'the weight fell');
        }
        return s + strip(50, 350, 87, it.ok ? n * 0.8 : 0, it.cls) + txt(200, 76, it.name, 'middle', '') + weights(200, 106 + (it.ok ? n * 0.8 : 0), n) + txt(320, 40, 'weights: ' + n, 'middle', '');
      }
    },
    flex: {
      how: 'One end of the strip is clamped. The other end is pushed down to bend it.',
      items: [
        { id: 'rubber', name: 'rubber', cls: 'm-rubber', ok: true, res: 'flexible: bent without breaking', msg: 'The rubber strip bent a long way without breaking. Rubber is <b>flexible</b>.' },
        { id: 'fabric', name: 'fabric', cls: 'm-fabric', ok: true, res: 'flexible: bent without breaking', msg: 'The fabric strip bent a long way without breaking. Fabric is <b>flexible</b>.' },
        { id: 'ceramic', name: 'ceramic tile', cls: 'm-clay', ok: false, res: 'not flexible: snapped', msg: 'The ceramic tile snapped as soon as it was bent. Ceramic is <b>not flexible</b>.' },
        { id: 'glass', name: 'glass strip', cls: 'm-glass', ok: false, res: 'not flexible: snapped', msg: 'The glass strip snapped as soon as it was bent. Glass is <b>not flexible</b>.' }
      ],
      draw: function (it, t) {
        var s = '<rect class="m-metal" x="40" y="92" width="60" height="60" rx="4"/>' + txt(70, 168, 'clamp') + '<path class="ln" d="M20 212 H380"/>';
        var d, ex = 330;
        if (it.ok) {
          d = t * 70;
          s += '<path class="' + it.cls + '" d="M100 117 Q230 117 ' + ex + ' ' + (117 + d) + ' L' + (ex - 4) + ' ' + (127 + d) + ' Q226 127 100 127 Z"/>';
          s += '<path class="m-arrow" d="M' + (ex - 6) + ' ' + (80 + d) + ' V' + (106 + d) + ' M' + (ex - 12) + ' ' + (98 + d) + ' L' + (ex - 6) + ' ' + (106 + d) + ' L' + ex + ' ' + (98 + d) + '"/>';
          return s + txt(210, 70, it.name, 'middle', '') + (t >= 1 ? txt(210, 196, 'bent, not broken', 'middle', '') : '');
        }
        d = Math.min(t, 0.3) * 30;
        if (t <= 0.3) return s + '<path class="' + it.cls + '" d="M100 112 L' + ex + ' ' + (112 + d) + ' L' + ex + ' ' + (122 + d) + ' L100 122 Z"/>' + '<path class="m-arrow" d="M' + (ex - 6) + ' ' + (82 + d) + ' V' + (104 + d) + '"/>' + txt(210, 70, it.name, 'middle', '');
        return s + '<path class="' + it.cls + '" d="M100 112 L214 116 L218 120 L210 126 L100 122 Z"/>' +
          '<g transform="rotate(-6 280 207)"><path class="' + it.cls + '" d="M232 202 L334 202 L334 211 L228 211 L236 206 Z"/></g>' + txt(210, 70, it.name, 'middle', '') + txt(210, 168, 'snapped!', 'middle', '') + txt(284, 230, 'the broken piece fell');
      }
    },
    float: {
      how: 'Each object is dropped gently into a tank of water.',
      items: [
        { id: 'cork', name: 'cork', ok: true, w: 30, h: 20, shape: function (x, y) { return '<rect class="m-wood" style="fill-opacity:.55" x="' + (x - 15) + '" y="' + (y - 10) + '" width="30" height="20" rx="5"/>'; } },
        { id: 'styro', name: 'Styrofoam', ok: true, w: 44, h: 24, shape: function (x, y) { return '<rect class="m-plain" x="' + (x - 22) + '" y="' + (y - 12) + '" width="44" height="24" rx="2"/>'; } },
        { id: 'block', name: 'wooden block', ok: true, w: 40, h: 26, shape: function (x, y) { return '<rect class="m-wood" x="' + (x - 20) + '" y="' + (y - 13) + '" width="40" height="26"/>'; } },
        { id: 'log', name: 'large wooden log', ok: true, w: 170, h: 34, shape: function (x, y) { return '<rect class="m-wood" x="' + (x - 85) + '" y="' + (y - 17) + '" width="170" height="34" rx="17"/><ellipse cx="' + (x + 70) + '" cy="' + y + '" rx="9" ry="15" style="fill:none;stroke:var(--stroke);stroke-width:1"/>'; } },
        { id: 'spoon', name: 'metal spoon', ok: false, w: 70, h: 16, shape: function (x, y) { return '<ellipse class="m-metal" cx="' + (x - 24) + '" cy="' + y + '" rx="12" ry="8"/><rect class="m-metal" x="' + (x - 12) + '" y="' + (y - 3) + '" width="46" height="6" rx="3"/>'; } },
        { id: 'nail', name: 'small steel nail', ok: false, w: 34, h: 10, shape: function (x, y) { return '<rect class="m-metal" x="' + (x - 15) + '" y="' + (y - 2) + '" width="32" height="4"/><rect class="m-metal" x="' + (x - 17) + '" y="' + (y - 5) + '" width="4" height="10"/>'; } },
        { id: 'marble', name: 'glass marble', ok: false, w: 18, h: 18, shape: function (x, y) { return '<circle class="m-glass" cx="' + x + '" cy="' + y + '" r="9"/>'; } },
        { id: 'clay', name: 'clay ball', ok: false, w: 28, h: 28, shape: function (x, y) { return '<circle class="m-clay" cx="' + x + '" cy="' + y + '" r="14"/>'; } },
        { id: 'rock', name: 'rock', ok: false, w: 40, h: 28, shape: function (x, y) { return '<path class="m-rock" d="M' + (x - 20) + ' ' + (y + 10) + ' L' + (x - 14) + ' ' + (y - 10) + ' L' + (x + 6) + ' ' + (y - 14) + ' L' + (x + 20) + ' ' + (y - 2) + ' L' + (x + 14) + ' ' + (y + 14) + ' Z"/>'; } }
      ],
      draw: function (it, t) {
        var top = 20, surf = 90, bottom = 216 - it.h / 2, y;
        if (t < 0.4) y = top + (surf - top) * (t / 0.4);
        else y = it.ok ? surf + it.h * 0.15 : surf + (bottom - surf) * Math.min(1, (t - 0.4) / 0.5);
        var s = '<rect class="m-water" x="92" y="90" width="216" height="128"/><path class="m-waterline" d="M92 90 H308"/><path class="ln" d="M90 50 V220 H310 V50"/>';
        s += it.shape(200, y);
        if (t >= 1) s += txt(200, it.ok ? 66 : 236, it.name + (it.ok ? ': floats' : ': sinks'), 'middle', '');
        return s;
      }
    },
    water: {
      how: 'A drop of water is put on a flat piece of each material.',
      items: [
        { id: 'plastic', name: 'plastic', cls: 'm-glass', ok: true },
        { id: 'rubber', name: 'rubber', cls: 'm-rubber', ok: true },
        { id: 'glass', name: 'glass', cls: 'm-glass', ok: true },
        { id: 'cotton', name: 'cotton fabric', cls: 'm-fabric', ok: false }
      ],
      draw: function (it, t) {
        var s = '<path class="m-metal" d="M188 14 H212 V34 L204 46 H196 L188 34 Z"/>' + txt(232, 30, 'dropper', 'start') +
          '<rect class="' + it.cls + '" x="90" y="150" width="220" height="20" rx="3"/>' + txt(200, 194, it.name, 'middle', '');
        if (t < 0.5) { var y = 52 + (138 - 52) * (t / 0.5); return s + '<ellipse class="m-drop" cx="200" cy="' + y.toFixed(1) + '" rx="7" ry="9"/>'; }
        var u = Math.min(1, (t - 0.5) / 0.5);
        if (it.ok) return s + '<ellipse class="m-drop" cx="200" cy="143" rx="' + (10 + 3 * u).toFixed(1) + '" ry="7"/>' + (t >= 1 ? txt(200, 122, 'the drop stays on top', 'middle', '') : '');
        return s + '<ellipse class="m-wet" cx="200" cy="160" rx="' + (12 + 28 * u).toFixed(1) + '" ry="8"/>' + (u < 1 ? '<ellipse class="m-drop" cx="200" cy="' + (143 + 8 * u).toFixed(1) + '" rx="' + (10 * (1 - u) + 1).toFixed(1) + '" ry="' + (7 * (1 - u) + 1).toFixed(1) + '"/>' : '') + (t >= 1 ? txt(200, 122, 'the drop soaks in', 'middle', '') : '');
      }
    },
    light: {
      how: 'A torch shines through a sheet of the material onto a screen.',
      items: [
        { id: 'clear', name: 'clear glass', cls: 'm-glass', lvl: 2 },
        { id: 'wrap', name: 'clear plastic food wrap', cls: 'm-glass', lvl: 2 },
        { id: 'frosted', name: 'frosted glass', cls: 'm-plain', lvl: 1 },
        { id: 'tracing', name: 'tracing paper', cls: 'm-plain', lvl: 1 },
        { id: 'wood', name: 'wood', cls: 'm-wood', lvl: 0 },
        { id: 'rubber', name: 'rubber', cls: 'm-rubber', lvl: 0 },
        { id: 'metal', name: 'metal', cls: 'm-metal', lvl: 0 }
      ],
      draw: function (it, t) {
        var on = t > 0, s = '<rect class="m-metal" x="16" y="106" width="50" height="28" rx="4"/><rect class="m-plain" x="66" y="102" width="8" height="36"/>' + txt(42, 156, 'torch');
        if (on) s += '<path class="m-beam" d="M74 108 L196 76 V164 L74 132 Z"/>';
        var op = [0, 0.14, 0.35][it.lvl] * Math.min(1, t * 2);
        if (on && it.lvl) s += '<path class="m-beam" style="fill-opacity:' + op.toFixed(2) + '" d="M204 76 L326 60 V180 L204 164 Z"/>';
        s += '<rect class="' + it.cls + '" x="196" y="66" width="8" height="108"' + (it.id === 'frosted' ? ' style="fill-opacity:.9"' : '') + '/>' + txt(200, 196, it.name, 'middle', '');
        s += '<rect class="m-plain" x="326" y="40" width="12" height="160"/>' + txt(332, 30, 'screen');
        if (on && it.lvl) s += '<rect class="m-light" x="326" y="66" width="12" height="108" style="opacity:' + ([0, 0.4, 1][it.lvl] * Math.min(1, t * 2)).toFixed(2) + '"/>';
        if (t >= 1) s += txt(332, 222, ['dark', 'dim', 'bright'][it.lvl], 'middle', '');
        return s;
      }
    }
  };
  var LVL = ['no light through (screen dark)', 'some light through (screen dim)', 'most light through (screen bright)'];
  function resultOf(tab, it) {
    if (tab === 'strength' || tab === 'flex') return it.res;
    if (tab === 'float') return it.ok ? 'floats' : 'sinks';
    if (tab === 'water') return it.ok ? 'waterproof: the drop stayed on top' : 'absorbent: the drop soaked in';
    return 'lets ' + LVL[it.lvl];
  }
  function msgOf(tab, it) {
    if (it.msg) return it.msg;
    if (tab === 'float') return 'The ' + it.name + (it.ok ? ' <b>floats</b>: it stays on the surface.' : ' <b>sinks</b> to the bottom.');
    if (tab === 'water') return it.ok ? 'The drop stays on top of the ' + it.name + '. ' + cap(it.name) + ' is <b>waterproof</b>.' : 'The drop soaks into the ' + it.name + '. Cotton fabric is <b>absorbent</b>.';
    return 'The screen behind the ' + it.name + ' is ' + ['dark', 'dim', 'bright'][it.lvl] + ': ' + it.name + ' lets <b>' + ['no', 'some', 'most'][it.lvl] + ' light</b> through.';
  }
  var tab = 'strength', results = { strength: [], flex: [], float: [], water: [], light: [] }, cur = null, bTimer = null;
  function drawResults() {
    var r = results[tab];
    $('#benchTable').innerHTML = r.length ? r.map(function (x) { return '<tr><th scope="row">' + cap(x[0]) + '</th><td>' + x[1] + '</td></tr>'; }).join('') : '<tr><td colspan="2" class="note-s">Nothing tested yet.</td></tr>';
  }
  function showTab(k) {
    tab = k; cur = null; if (bTimer) clearInterval(bTimer);
    press('[data-tab]', 'data-tab', k);
    $('#benchHow').textContent = TABS[k].how;
    $('#benchChips').innerHTML = TABS[k].items.map(function (it) {
      var done = results[k].some(function (x) { return x[0] === it.name; });
      return '<button type="button" class="chip-btn' + (done ? ' done' : '') + '" data-mat="' + it.id + '" aria-pressed="false">' + cap(it.name) + '</button>';
    }).join('');
    $('#benchSvg').innerHTML = TABS[k].draw(TABS[k].items[0], 0).replace(/<text[^>]*>[^<]*<\/text>/g, '') ;
    $('#benchSvg').innerHTML = k === 'float' ? '<rect class="m-water" x="92" y="90" width="216" height="128"/><path class="m-waterline" d="M92 90 H308"/><path class="ln" d="M90 50 V220 H310 V50"/>' : $('#benchSvg').innerHTML;
    $('#benchMsg').innerHTML = 'Tap a material to test it.';
    drawResults();
  }
  function test(id) {
    var T = TABS[tab], it = T.items.filter(function (x) { return x.id === id; })[0]; if (!it) return;
    cur = id; press('#benchChips [data-mat]', 'data-mat', id);
    if (bTimer) clearInterval(bTimer);
    $('#benchMsg').innerHTML = 'Testing ' + it.name + '…';
    bTimer = run(30, 45, function (i, n) { $('#benchSvg').innerHTML = T.draw(it, i / n); }, function () {
      var r = results[tab], name = it.name;
      if (!r.some(function (x) { return x[0] === name; })) r.push([name, resultOf(tab, it)]);
      var extra = '';
      if (tab === 'float' && r.some(function (x) { return x[0] === 'large wooden log'; }) && r.some(function (x) { return x[0] === 'small steel nail'; }))
        extra = ' <b>The big log floats and the tiny nail sinks. Whether something floats depends on what it is made of, not on how big it is.</b>';
      $('#benchMsg').innerHTML = msgOf(tab, it) + extra;
      var b = $('#benchChips [data-mat="' + id + '"]'); if (b) b.classList.add('done');
      drawResults();
    });
  }
  $$('[data-tab]').forEach(function (b) { b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); }); });
  $('#benchChips').addEventListener('click', function (e) { var b = e.target.closest('[data-mat]'); if (b) test(b.getAttribute('data-mat')); });
  showTab('strength');

  /* ---------- E2 · seven materials ---------- */
  var MATS = [
    { id: 'wood', name: 'Wood', props: ['strong', 'most wood floats'], uses: 'benches, cardboard, paper', obj: 'wooden bench',
      art: '<rect class="m-wood" x="40" y="36" width="160" height="12" rx="3"/><rect class="m-wood" x="40" y="70" width="160" height="14" rx="3"/><rect class="m-wood" x="52" y="84" width="10" height="44"/><rect class="m-wood" x="178" y="84" width="10" height="44"/><rect class="m-wood" x="52" y="48" width="8" height="22"/><rect class="m-wood" x="180" y="48" width="8" height="22"/>' },
    { id: 'metal', name: 'Metal', props: ['strong', 'sinks'], uses: 'electric wires, pots', obj: 'metal pot', more: true,
      art: '<rect class="m-metal" x="70" y="56" width="100" height="72" rx="8"/><rect class="m-metal" x="62" y="48" width="116" height="10" rx="4"/><path class="m-arrow" style="stroke-width:6" d="M62 70 H44 M178 70 H196"/>' },
    { id: 'glass', name: 'Glass', props: ['clear glass lets most light through', 'waterproof', 'not flexible: it breaks when bent', 'sinks'], uses: 'windows, laboratory beakers', obj: 'glass beaker',
      art: '<rect class="m-water" x="88" y="80" width="64" height="52"/><path class="m-glass" style="fill-opacity:.25" d="M86 30 V128 Q86 136 94 136 H146 Q154 136 154 128 V30"/><path class="ln" d="M86 30 V128 Q86 136 94 136 H146 Q154 136 154 128 V30 M80 30 H92"/>' },
    { id: 'ceramic', name: 'Ceramic', props: ['not flexible: it breaks when bent', 'clay sinks'], uses: 'vases, flower pots, bricks, clay pots', obj: 'ceramic flower pot',
      art: '<path class="m-clay" d="M76 62 H164 L152 134 H88 Z"/><rect class="m-clay" x="70" y="52" width="100" height="14" rx="3"/><path d="M120 52 V22 M120 34 Q100 20 92 30 M120 30 Q140 16 150 26" style="fill:none;stroke:var(--stem);stroke-width:4;stroke-linecap:round"/>' },
    { id: 'plastic', name: 'Plastic', props: ['waterproof', 'different plastics let most, some or no light through'], uses: 'bottles, bags, chairs; Styrofoam cups (Styrofoam floats)', obj: 'plastic bottle',
      art: '<path class="m-glass" d="M108 18 H132 V34 Q152 46 152 66 V128 Q152 136 144 136 H96 Q88 136 88 128 V66 Q88 46 108 34 Z"/><rect class="m-rubber" x="106" y="10" width="28" height="12" rx="2"/><rect class="m-water" x="90" y="80" width="60" height="54"/>' },
    { id: 'rubber', name: 'Rubber', props: ['waterproof', 'flexible', 'lets no light through'], uses: 'gloves, erasers, boots, tyres', obj: 'rubber boot',
      art: '<path class="m-rubber" d="M96 20 H140 V100 Q176 104 180 124 V134 H96 Z"/><path class="ln" d="M96 34 H140"/>' },
    { id: 'fabric', name: 'Fabric', props: ['flexible', 'absorbent: it soaks up water'], uses: 'scarves, socks, clothes, towels, jackets', obj: 'fabric towel',
      art: '<path class="m-fabric" d="M60 30 H180 V120 Q150 132 120 120 Q90 108 60 120 Z"/><path class="ln" d="M60 46 H180 M60 104 H180"/>' }
  ];
  $('#matBtns').innerHTML = MATS.map(function (m) { return '<button type="button" class="btn small" data-m="' + m.id + '" aria-pressed="false">' + m.name + '</button>'; }).join('');
  function showMat(id) {
    var m = MATS.filter(function (x) { return x.id === id; })[0];
    press('[data-m]', 'data-m', id);
    $('#matSvg').innerHTML = m ? m.art + txt(120, 154, m.obj, 'middle', '') : txt(120, 84, 'Tap a material', 'middle', '');
    $('#matSvg').setAttribute('aria-label', m ? 'A drawing of a ' + m.obj : 'No material chosen yet');
    $('#matInfo').innerHTML = !m ? '<p class="note-s">Nothing chosen yet.</p>' :
      '<h4>' + m.name + '</h4><p>Its properties:</p><ul>' + m.props.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p><b>Used for:</b> ' + m.uses + '.</p>' +
      (m.more ? '<p class="note-s">See also: <a href="../05-energy/P4-heat.html#e5">P4 Heat, good and poor conductors</a>, which explains why pots are made of metal.</p>' : '');
  }
  $('#matBtns').addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) showMat(b.getAttribute('data-m')); });
  showMat(null);

  P.widgets.classify($('#matSort'), {
    prompt: 'Tap an object, then tap the material it is made of.',
    bins: MATS.map(function (m) { return { id: m.id, label: m.name }; }),
    items: [
      { id: 'bench', label: 'wooden bench', bin: 'wood', why: 'Wood. It is strong enough to hold people up.' },
      { id: 'card', label: 'cardboard box', bin: 'wood', why: 'Wood. Cardboard and paper are made from wood.' },
      { id: 'wire', label: 'electric wire', bin: 'metal', why: 'Metal. The inside of an electric wire is metal.' },
      { id: 'pot', label: 'cooking pot', bin: 'metal', why: 'Metal. It is strong.' },
      { id: 'beaker', label: 'laboratory beaker', bin: 'glass', why: 'Glass. You can see the liquid through it.' },
      { id: 'pane', label: 'window pane', bin: 'glass', why: 'Glass. Clear glass lets most light through.' },
      { id: 'fpot', label: 'flower pot', bin: 'ceramic', why: 'Ceramic. It is made from clay.' },
      { id: 'brick', label: 'brick', bin: 'ceramic', why: 'Ceramic. Bricks are made from clay.' },
      { id: 'bottle', label: 'plastic bottle', bin: 'plastic', why: 'Plastic. It is waterproof.' },
      { id: 'styro', label: 'Styrofoam cup', bin: 'plastic', why: 'Plastic. Styrofoam is a kind of plastic, and it floats.' },
      { id: 'boots', label: 'rain boots', bin: 'rubber', why: 'Rubber. It is waterproof and flexible.' },
      { id: 'eraser', label: 'eraser', bin: 'rubber', why: 'Rubber. It is flexible.' },
      { id: 'towel', label: 'towel', bin: 'fabric', why: 'Fabric. It is absorbent.' },
      { id: 'scarf', label: 'wool scarf', bin: 'fabric', why: 'Fabric. Wool is a fabric, and it is flexible.' }
    ]
  });

  /* ---------- E3 · why that material? ---------- */
  P.widgets.classify($('#useSort'), {
    prompt: 'Tap an object, then tap the property that makes its material right for the job.',
    bins: [{ id: 'strong', label: 'Strong' }, { id: 'flex', label: 'Flexible' }, { id: 'float', label: 'Floats' }, { id: 'wp', label: 'Waterproof' }, { id: 'abs', label: 'Absorbent' }, { id: 'light', label: 'Lets light through' }],
    items: [
      { id: 'bench', label: 'wooden bench seat', bin: 'strong', why: 'Strong. Wood holds people up without breaking.' },
      { id: 'pylon', label: 'metal electric pylon', bin: 'strong', why: 'Strong. Metal holds up the heavy cables.' },
      { id: 'band', label: 'rubber band', bin: 'flex', why: 'Flexible. Rubber bends and stretches without breaking.' },
      { id: 'scarf', label: 'fabric scarf that wraps around your neck', bin: 'flex', why: 'Flexible. Fabric bends without breaking.' },
      { id: 'cork', label: 'cork float on a fishing line', bin: 'float', why: 'Floats. Cork stays on the surface of the water.' },
      { id: 'board', label: 'Styrofoam float board', bin: 'float', why: 'Floats. Styrofoam stays on the surface of the water.' },
      { id: 'coat', label: 'plastic raincoat', bin: 'wp', why: 'Waterproof. Plastic does not absorb water, so you stay dry.' },
      { id: 'bottle', label: 'plastic bottle', bin: 'wp', why: 'Waterproof. The drink stays inside.' },
      { id: 'towel', label: 'fabric towel', bin: 'abs', why: 'Absorbent. Fabric soaks up water to dry you.' },
      { id: 'mop', label: 'cotton mop head', bin: 'abs', why: 'Absorbent. Cotton soaks up the spilled water.' },
      { id: 'window', label: 'glass window', bin: 'light', why: 'Lets light through. Clear glass lets most light in.' },
      { id: 'frosted', label: 'frosted glass bathroom window', bin: 'light', why: "Lets light through. Frosted glass lets some light through, so the room is bright, but people outside can't see in clearly." }
    ]
  });

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
