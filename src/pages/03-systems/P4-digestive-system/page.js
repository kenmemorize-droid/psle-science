/* P4 Digestive system unit: knowledge cards, four Explore stations, two Beyond toggles, unit check. */
(function () {
  'use strict';
  var P = window.PSLE, $ = P.$, $$ = P.$$;

  if (window.matchMedia && matchMedia('(max-width: 640px)').matches)
    $$('#know details.kcard').forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });

  function txt(x, y, s, anchor, cls) { return '<text class="lbl' + (cls == null ? ' sm' : cls ? ' ' + cls : '') + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  function press(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val)); }); }
  function tube(d, w, fill) {
    return '<path d="' + d + '" style="fill:none;stroke:var(--stroke);stroke-width:' + w + ';stroke-linecap:round;stroke-linejoin:round"/>' +
      '<path d="' + d + '" style="fill:none;stroke:' + fill + ';stroke-width:' + (w - 5) + ';stroke-linecap:round;stroke-linejoin:round"/>';
  }
  function run(steps, ms, each, done) {   /* timer-driven animation: does not depend on animation frames */
    var i = 0; if (P.reduced) { each(steps, steps); if (done) done(); return null; }
    var id = setInterval(function () { i++; each(i, steps); if (i >= steps) { clearInterval(id); if (done) done(); } }, ms);
    return id;
  }

  /* ---------- E1 · five body systems ---------- */
  function body() {
    var limbs = 'M86 98 L56 186 M154 98 L184 186 M100 206 L96 342 M140 206 L144 342';
    return '<path class="d-limb" d="' + limbs + '" style="stroke:var(--stroke);stroke-width:30"/>' +
      '<path class="d-limb" d="' + limbs + '" style="stroke:var(--card);stroke-width:25"/>' +
      '<path class="d-skin" d="M78 84 Q120 70 162 84 L168 204 Q120 218 72 204 Z"/>' +
      '<rect x="110" y="66" width="20" height="16" style="fill:var(--card)"/>' +
      '<circle class="d-skin" cx="120" cy="40" r="28"/>';
  }
  function lab(s, y, tx, ty) { return '<line x1="204" y1="' + (y - 4) + '" x2="' + tx + '" y2="' + ty + '" style="stroke:var(--stroke);stroke-width:1.2"/>' + txt(208, y, s, 'start', ''); }
  var SYS = {
    resp: {
      name: 'Respiratory system', does: ['takes in oxygen', 'removes carbon dioxide'], parts: 'nose, windpipe, lungs',
      draw: function () {
        return '<path d="M120 36 L114 50 H123" style="fill:none;stroke:var(--stroke);stroke-width:2"/>' +
          '<path d="M120 62 V104 M120 104 L108 116 M120 104 L132 116" style="fill:none;stroke:var(--sim-1);stroke-width:6;stroke-linecap:round"/>' +
          '<path class="d-sys" d="M114 108 Q82 116 86 158 Q100 168 116 156 Z"/><path class="d-sys" d="M126 108 Q158 116 154 158 Q140 168 124 156 Z"/>' +
          lab('nose', 46, 124, 44) + lab('windpipe', 92, 122, 88) + lab('lungs', 142, 150, 140);
      }
    },
    circ: {
      name: 'Circulatory system', does: ['carries digested food, water and oxygen to all parts of the body', 'carries carbon dioxide and other waste away'], parts: 'heart, blood, blood vessels',
      draw: function () {
        return '<path class="d-vessel" d="M126 116 V58 M122 122 L86 104 L60 180 M136 120 L154 104 L180 180 M128 140 V196 L102 210 L98 336 M128 196 L138 210 L142 336"/>' +
          '<path class="d-heart" d="M130 142 C110 128 112 112 124 114 C128 115 130 119 130 121 C130 119 132 115 136 114 C148 112 150 128 130 142 Z"/>' +
          lab('heart', 128, 146, 126) + lab('blood vessels', 262, 142, 262);
      }
    },
    dig: {
      name: 'Digestive system', does: ['breaks down food into simpler substances that can pass into the blood'], parts: 'mouth, gullet, stomach, small intestine, large intestine',
      draw: function () {
        return '<ellipse class="d-organ" cx="120" cy="54" rx="9" ry="4"/>' + tube('M120 60 V124', 8, 'var(--fb)') +
          '<path class="d-organ" d="M116 122 Q102 150 124 158 Q148 162 150 144 Q150 130 138 134 Q128 134 126 122 Z"/>' +
          tube('M100 200 V170 Q120 160 142 170 V198', 10, 'var(--fc)') + tube('M134 172 Q112 176 112 182 Q114 190 130 188 Q142 188 120 196', 6, 'var(--fb)') +
          lab('mouth', 58, 130, 56) + lab('gullet', 96, 124, 96) + lab('stomach', 146, 152, 146) + lab('intestines', 186, 146, 184);
      }
    },
    skel: {
      name: 'Skeletal system', does: ['supports the body and gives it shape', 'protects soft organs: the bones of the head protect the brain, and the bones of the chest protect the heart and lungs'], parts: 'bones',
      draw: function () {
        var s = '<circle cx="120" cy="38" r="20" class="d-bone" style="stroke-width:4"/><path class="d-bone" style="stroke-width:4" d="M120 68 V200 M100 198 Q120 214 140 198"/>';
        [100, 114, 128, 142].forEach(function (y) { s += '<path class="d-bone" style="stroke-width:3" d="M120 ' + y + ' Q96 ' + (y + 2) + ' 92 ' + (y + 14) + ' M120 ' + y + ' Q144 ' + (y + 2) + ' 148 ' + (y + 14) + '"/>'; });
        return s + '<path class="d-bone" d="M88 100 L60 182 M152 100 L180 182 M104 212 L100 336 M136 212 L140 336"/>' + lab('bones', 120, 152, 122);
      }
    },
    musc: {
      name: 'Muscular system', does: ['works with the skeletal system to move parts of the body'], parts: 'muscles',
      draw: function () {
        return '<ellipse class="d-muscle" cx="76" cy="132" rx="9" ry="24" transform="rotate(20 76 132)"/><ellipse class="d-muscle" cx="164" cy="132" rx="9" ry="24" transform="rotate(-20 164 132)"/>' +
          '<ellipse class="d-muscle" cx="101" cy="248" rx="11" ry="30"/><ellipse class="d-muscle" cx="139" cy="248" rx="11" ry="30"/>' +
          '<ellipse class="d-muscle" cx="98" cy="306" rx="8" ry="20"/><ellipse class="d-muscle" cx="142" cy="306" rx="8" ry="20"/>' +
          lab('muscles', 250, 150, 250);
      }
    }
  };
  function showSys(k) {
    var s = SYS[k];
    $('#bodySvg').innerHTML = body() + (s ? s.draw() : '');
    $('#bodySvg').setAttribute('aria-label', s ? 'An outline of a human body showing the ' + s.name.toLowerCase() : 'An outline of a human body');
    press('[data-sys]', 'data-sys', k);
    $('#sysInfo').innerHTML = !s ? '<p class="note-s">Pick a system.</p>' :
      '<h4>' + s.name + '</h4><p>What it does:</p><ul>' + s.does.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul><p><b>Main parts:</b> ' + s.parts + '</p>';
  }
  $$('[data-sys]').forEach(function (b) { b.addEventListener('click', function () { showSys(b.getAttribute('data-sys')); }); });
  showSys(null);

  P.widgets.classify($('#sysSort'), {
    prompt: 'Tap a card, then tap the system it belongs to.',
    bins: [{ id: 'resp', label: 'Respiratory' }, { id: 'circ', label: 'Circulatory' }, { id: 'dig', label: 'Digestive' }, { id: 'skel', label: 'Skeletal' }, { id: 'musc', label: 'Muscular' }],
    items: [
      { id: 'o2', label: 'takes in oxygen', bin: 'resp', why: 'Respiratory. It also removes carbon dioxide.' },
      { id: 'rp', label: 'nose, windpipe and lungs', bin: 'resp', why: 'These are the main parts of the respiratory system.' },
      { id: 'carry', label: 'carries digested food and oxygen to all parts of the body', bin: 'circ', why: 'Circulatory. The digestive system breaks food down; the blood carries it around.' },
      { id: 'cp', label: 'heart, blood and blood vessels', bin: 'circ', why: 'These are the main parts of the circulatory system.' },
      { id: 'break', label: 'breaks food down so it can pass into the blood', bin: 'dig', why: 'Digestive. Only digested food can pass into the blood.' },
      { id: 'dp', label: 'mouth, gullet, stomach and intestines', bin: 'dig', why: 'These are the parts of the digestive system.' },
      { id: 'support', label: 'supports the body and gives it shape', bin: 'skel', why: 'Skeletal. The bones hold the body up.' },
      { id: 'protect', label: 'protects the brain, heart and lungs', bin: 'skel', why: 'Skeletal. Bones protect soft organs.' },
      { id: 'bones', label: 'bones', bin: 'skel', why: 'The skeletal system is made of bones.' },
      { id: 'move', label: 'works with the bones to move parts of the body', bin: 'musc', why: "Muscular. Bones can't move on their own." },
      { id: 'mus', label: 'muscles', bin: 'musc', why: 'The muscular system is made of muscles.' }
    ]
  });

  /* ---------- E2 · follow the food ---------- */
  var SI_PATH = 'M362 200 Q362 214 348 214 C330 214 330 196 312 196 C294 196 294 224 276 224 C258 224 258 196 240 196 C222 196 222 224 204 224 C190 224 186 210 170 210';
  function tubeScene() {
    return '<path class="d-blood" d="M384 266 H30"/>' + txt(206, 296, 'blood vessel', 'middle', '') +
      tube('M89 80 H206', 26, 'var(--fb)') +
      '<ellipse class="d-organ" cx="55" cy="80" rx="34" ry="24"/>' +
      tube('M300 112 Q362 120 362 170 V200', 26, 'var(--fb)') +
      '<path class="d-organ" d="M204 62 Q204 40 246 42 Q322 44 324 86 Q326 128 272 124 Q240 122 226 104 Q212 96 204 98 Z"/>' +
      tube('M170 210 H40', 40, 'var(--fc)') + tube(SI_PATH, 26, 'var(--fb)') +
      '<path d="M20 210 H6 M12 204 L6 210 L12 216" style="fill:none;stroke:var(--stroke);stroke-width:2;stroke-linecap:round"/>' +
      txt(55, 36, 'mouth', 'middle', '') + txt(148, 56, 'gullet', 'middle', '') + txt(266, 30, 'stomach', 'middle', '') +
      txt(266, 178, 'small intestine', 'middle', '') + txt(105, 172, 'large intestine', 'middle', '');
  }
  var POS = [[55, 80], [148, 80], [266, 84], [268, 210], [105, 210]];
  var SQ = function (x, y, s) { return '<rect class="d-food" x="' + (x - s / 2).toFixed(1) + '" y="' + (y - s / 2).toFixed(1) + '" width="' + s + '" height="' + s + '"/>'; };
  var FIB = function (x, y) { return '<path class="d-fibre" d="M' + (x - 9) + ' ' + y + ' q4 -7 9 -1 t9 -1"/>'; };
  var DROP = function (x, y) { return '<circle class="d-water" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.5"/>'; };
  var DOT = function (x, y) { return '<circle class="d-dig" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3"/>'; };
  function ring(cx, cy, n, r, f) { var s = ''; for (var i = 0; i < n; i++) { var a = i * 2 * Math.PI / n; s += f(cx + r * Math.cos(a), cy + r * Math.sin(a)); } return s; }
  function ball(stage, x, y, t) {
    var s = '';
    if (stage === 0) s += ring(x, y, 7, 11, function (a, b) { return SQ(a, b, 7); }) + SQ(x, y, 7) + FIB(x - 2, y + 18) + FIB(x + 4, y - 17);
    else if (stage === 1) s += '<ellipse cx="' + x + '" cy="' + y + '" rx="22" ry="9" style="fill:var(--fb);stroke:none"/>' + ring(x, y, 6, 7, function (a, b) { return SQ(a * 1.4 - x * 0.4, b, 6); }) + FIB(x - 10, y + 2) + FIB(x + 10, y - 2);
    else if (stage === 2) {
      s += '<ellipse cx="' + x + '" cy="' + y + '" rx="34" ry="20" style="fill:var(--sim-2);fill-opacity:.3;stroke:none"/>';
      for (var i = 0; i < 14; i++) s += SQ(x - 26 + (i % 7) * 8.6, y - 7 + Math.floor(i / 7) * 12, 4);
      s += FIB(x - 14, y + 14) + FIB(x + 12, y - 14) + DROP(x + 26, y + 8) + DROP(x - 28, y - 4);
    } else if (stage === 3) {
      /* digested food leaves the tube for the blood; fibre and water stay */
      for (var k = 0; k < 10; k++) {
        var sx = 196 + k * 16, sy = 210, ex = sx - 20 - 40 * t, ey = 266;
        var u = Math.min(1, t * 1.6);
        s += DOT(sx + (ex - sx) * u, sy + (ey - sy) * u);
      }
      s += FIB(x - 10, y + 2) + FIB(x + 14, y - 3) + DROP(x + 30, y + 4) + DROP(x - 30, y - 2);
    } else {
      for (var j = 0; j < 4; j++) {
        var wx = x - 36 + j * 24, u2 = Math.min(1, t * 1.6);
        s += DROP(wx, 210 + (266 - 210) * u2);
      }
      s += '<ellipse class="d-faeces" cx="' + x + '" cy="' + y + '" rx="' + (20 - 4 * t).toFixed(1) + '" ry="10"/>' + FIB(x - 6, y - 1) + FIB(x + 6, y + 2);
      if (t >= 1) s += txt(x, y + 40, 'faeces', 'middle', '');
    }
    return s;
  }
  var FSTEPS = [
    ['Mouth', 'Digestion begins. The teeth cut and grind the food into smaller pieces. Saliva, a digestive juice, softens the food and starts to digest it. The tongue rolls it into a ball to swallow.', 'begins', 'nothing', 'nothing'],
    ['Gullet', 'Its muscles squeeze the food down to the stomach. No digestion takes place here.', 'none here', 'nothing', 'nothing'],
    ['Stomach', 'Its muscles churn the food while gastric juice mixes in. The food is partly digested into a thick liquid.', 'partly digested', 'nothing', 'nothing'],
    ['Small intestine', 'Digestion is completed. The digested food passes through the wall into the blood. The fibre cannot be digested, so it moves on with some water.', 'completed', 'digested food', 'nothing'],
    ['Large intestine', 'Water is absorbed from the undigested food. What is left becomes faeces. No digestion takes place here. The faeces leave the body.', 'none here', 'nothing', 'water']
  ];
  var fstep = 0, ftimer = null;
  function drawFood(t) {
    var from = POS[Math.max(0, fstep - 1)], to = POS[fstep], m = fstep && t < 0.5 ? t * 2 : 1;
    var x = from[0] + (to[0] - from[0]) * m, y = from[1] + (to[1] - from[1]) * m;
    var stageT = fstep ? Math.max(0, (t - 0.5) * 2) : t;
    $('#tubeSvg').innerHTML = tubeScene() + (fstep === 1 && t >= 1 ? '<path d="M120 62 l6 8 M176 62 l-6 8 M120 98 l6 -8 M176 98 l-6 -8" style="stroke:var(--stroke);stroke-width:2"/>' + txt(148, 120, 'muscles squeeze', 'middle', '') : '') +
      ball(m < 1 ? fstep - 1 : fstep, x, y, stageT);
  }
  function setFood(animate) {
    var s = FSTEPS[fstep];
    $('#foodTitle').textContent = 'Step ' + (fstep + 1) + ' of 5: ' + s[0];
    $('#foodMsg').textContent = s[1];
    $('#stDig').textContent = s[2]; $('#stBlood').textContent = s[3]; $('#stWater').textContent = s[4];
    $('#foodBack').disabled = fstep === 0; $('#foodNext').disabled = fstep === FSTEPS.length - 1;
    if (ftimer) clearInterval(ftimer);
    if (animate) ftimer = run(30, 50, function (i, n) { drawFood(i / n); }); else drawFood(1);
  }
  $('#foodBack').addEventListener('click', function () { if (fstep > 0) { fstep--; setFood(false); } });
  $('#foodNext').addEventListener('click', function () { if (fstep < FSTEPS.length - 1) { fstep++; setFood(true); } });
  setFood(false);

  /* ---------- E3 · what happens where? ---------- */
  P.widgets.classify($('#partSort'), {
    prompt: 'Tap a job, then tap the part that does it.',
    bins: [{ id: 'm', label: 'Mouth' }, { id: 'g', label: 'Gullet' }, { id: 's', label: 'Stomach' }, { id: 'si', label: 'Small intestine' }, { id: 'li', label: 'Large intestine' }],
    items: [
      { id: 'teeth', label: 'teeth cut and grind the food', bin: 'm', why: 'Mouth. Smaller pieces are digested faster.' },
      { id: 'saliva', label: 'saliva mixes with the food and starts to digest it', bin: 'm', why: 'Mouth. Saliva is a digestive juice, so digestion begins here.' },
      { id: 'tongue', label: 'the tongue rolls the food into a ball to swallow', bin: 'm', why: 'Mouth.' },
      { id: 'squeeze', label: 'muscles squeeze the food down to the stomach', bin: 'g', why: 'Gullet. No digestion takes place there.' },
      { id: 'churn', label: 'muscles churn the food with gastric juice', bin: 's', why: 'Stomach.' },
      { id: 'partly', label: 'the food is partly digested into a thick liquid', bin: 's', why: 'Stomach. Digestion is not finished yet.' },
      { id: 'complete', label: 'digestion is completed', bin: 'si', why: 'Small intestine.' },
      { id: 'blood', label: 'digested food passes into the blood', bin: 'si', why: 'Small intestine. Digested food passes through its wall into the blood.' },
      { id: 'water', label: 'water is absorbed from undigested food', bin: 'li', why: 'Large intestine. Only undigested food reaches it.' },
      { id: 'faeces', label: 'what is left becomes faeces', bin: 'li', why: 'Large intestine.' }
    ]
  });

  /* ---------- E4 · the tick table ---------- */
  var COLS = ['digestion takes place', 'digested food passes into the blood', 'water is absorbed from undigested food'];
  var ROWS = [
    ['Mouth', [1, 0, 0], 'Digestion begins here, with saliva. Nothing passes into the blood and no water is absorbed.'],
    ['Gullet', [0, 0, 0], 'No digestion here. Its muscles only push the food down.'],
    ['Stomach', [1, 0, 0], 'The food is partly digested. Nothing passes into the blood here.'],
    ['Small intestine', [1, 1, 0], 'Digestion is completed, and the digested food passes into the blood.'],
    ['Large intestine', [0, 0, 1], 'No digestion. Water is absorbed from the undigested food.']
  ];
  var ticks = ROWS.map(function () { return [0, 0, 0]; });
  function cellLabel(r, c) { return ROWS[r][0] + ': ' + COLS[c] + (ticks[r][c] ? ', ticked' : ', not ticked'); }
  function drawTick(marks) {
    $('#tickTable tbody').innerHTML = ROWS.map(function (row, r) {
      var m = marks ? (marks[r] ? ' class="ok"' : ' class="no"') : '';
      return '<tr' + m + '><th scope="row">' + (marks ? (marks[r] ? '✓ ' : '✗ ') : '') + row[0] + '</th>' + [0, 1, 2].map(function (c) {
        return '<td><button type="button" class="d-cell" data-r="' + r + '" data-c="' + c + '" aria-pressed="' + !!ticks[r][c] + '" aria-label="' + cellLabel(r, c) + '">' + (ticks[r][c] ? '✓' : '') + '</button></td>';
      }).join('') + '</tr>';
    }).join('');
  }
  $('#tickTable').addEventListener('click', function (e) {
    var b = e.target.closest('.d-cell'); if (!b) return;
    var r = +b.getAttribute('data-r'), c = +b.getAttribute('data-c');
    ticks[r][c] = ticks[r][c] ? 0 : 1; drawTick(null); $('#tickMsg').innerHTML = '';
    var nb = $('#tickTable .d-cell[data-r="' + r + '"][data-c="' + c + '"]'); if (nb) nb.focus();
  });
  $('#tickCheck').addEventListener('click', function () {
    var marks = ROWS.map(function (row, r) { return row[1].every(function (v, c) { return v === ticks[r][c]; }); });
    var n = marks.filter(Boolean).length;
    drawTick(marks);
    $('#tickMsg').innerHTML = '<p><b>' + n + ' of 5 rows right.</b>' + (n === 5 ? ' Well done.' : '') + '</p><ul>' + ROWS.map(function (row, r) {
      return '<li' + (marks[r] ? ' class="ok"' : '') + '>' + (marks[r] ? '✓ Right. ' : '✗ Check this row. ') + '<b>' + row[0] + ':</b> ' + row[2] + '</li>';
    }).join('') + '</ul>';
  });
  $('#tickShow').addEventListener('click', function () { ticks = ROWS.map(function (row) { return row[1].slice(); }); drawTick(null); $('#tickMsg').innerHTML = '<p>This is the answer. Compare it with your own ticks.</p>'; });
  $('#tickClear').addEventListener('click', function () { ticks = ROWS.map(function () { return [0, 0, 0]; }); drawTick(null); $('#tickMsg').innerHTML = ''; });
  drawTick(null);

  /* ---------- unit check ---------- */
  P.Q.set($('#qs'), P.data.questions, {});
})();
