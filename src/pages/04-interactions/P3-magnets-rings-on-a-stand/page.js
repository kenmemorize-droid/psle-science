/* P3 Magnets focus: four rings on a wooden stand. Load each drawing, turn the magnets over, and see what really happens. */
(function () {
  'use strict';
  var P = window.PSLE; if (!P) return;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }

  /*RINGS-START*/
  /* Side view of rings threaded on a wooden stand. tokens run bottom to top; '|' marks a gap.
     o: { scale, labels, poles: {m1:'N'|'S', m2:...} (pole on the TOP face), push, aria } */
  var RING_NAMES = { m1: 'magnet 1', m2: 'magnet 2', mm: 'magnetic material', nm: 'non-magnetic material' };
  function ringsSVG(tokens, o) {
    o = o || {};
    var k = o.scale || 1, W = 100 * k, H = 20 * k, G = 26 * k, BH = 12 * k, ROD = 18 * k, padL = o.poles ? 34 * k : 8 * k;
    var labW = o.labels ? 180 * k : 0, BW = o.bare ? W : 140 * k, top = o.bare ? 4 : 22 * k;
    var cx = padL + Math.max(W, BW) / 2, x0 = cx - W / 2;
    var rings = tokens.filter(function (t) { return t !== '|'; }).length, gaps = tokens.length - rings;
    var h = o.bare ? H + 8 : top + rings * H + gaps * G + 4 * k + BH + 4;
    var w = padL + Math.max(W, BW) + 10 * k + labW;
    var S = 'style="fill:var(--card);stroke:var(--stroke)" stroke-width="2"';
    var L = 'style="stroke:var(--stroke)" stroke-width="' + (1.4 * k).toFixed(1) + '"';
    var out = [], y = h - 4 - BH;
    if (o.bare) y = h - 4;
    else {
      out.push('<rect x="' + (cx - BW / 2) + '" y="' + y + '" width="' + BW + '" height="' + BH + '" ' + S + '/>');
      out.push('<rect x="' + (cx - ROD / 2) + '" y="' + (top - 14 * k) + '" width="' + ROD + '" height="' + (y - top + 14 * k) + '" ' + S + '/>');
      y -= 4 * k;
    }
    var fs = (12.5 * k).toFixed(1);
    tokens.forEach(function (t, i) {
      if (t === '|') {
        var gt = y - G;
        if (o.push) {
          var ax = cx + W / 2 - 18 * k, m = y - G / 2;
          out.push('<path d="M' + ax + ' ' + (m - 3) + ' V' + (gt + 3) + ' M' + (ax - 5) + ' ' + (gt + 9) + ' L' + ax + ' ' + (gt + 3) + ' L' + (ax + 5) + ' ' + (gt + 9) +
            ' M' + ax + ' ' + (m + 3) + ' V' + (y - 3) + ' M' + (ax - 5) + ' ' + (y - 9) + ' L' + ax + ' ' + (y - 3) + ' L' + (ax + 5) + ' ' + (y - 9) + '" fill="none" style="stroke:var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>');
          out.push('<text x="' + (ax - 10 * k) + '" y="' + (m + 4 * k) + '" text-anchor="end" font-size="' + fs + '" font-weight="700" style="fill:var(--primary);font-family:var(--f-label)">push</text>');
        }
        y = gt; return;
      }
      var ry = y - H;
      out.push('<rect x="' + x0 + '" y="' + ry + '" width="' + W + '" height="' + H + '" ' + S + '/>');
      var p = [];
      if (t === 'm1') {
        for (var d = 0; d < 22; d++) {
          var dx = x0 + 5 * k + ((d * 41) % 90) * k, dy = ry + 4 * k + ((d * 7) % 12) * k;
          p.push('<circle cx="' + dx.toFixed(1) + '" cy="' + dy.toFixed(1) + '" r="' + (1.4 * k).toFixed(1) + '" style="fill:var(--stroke)"/>');
        }
      } else if (t === 'm2') {
        for (var sx = x0 + 6 * k; sx < x0 + W - 2; sx += 6 * k) p.push('<line x1="' + sx.toFixed(1) + '" y1="' + ry + '" x2="' + sx.toFixed(1) + '" y2="' + (ry + H) + '" ' + L + '/>');
      } else if (t === 'mm') {
        for (var r = 0; r < 3; r++) {
          var by = ry + r * H / 3;
          if (r) p.push('<line x1="' + x0 + '" y1="' + by.toFixed(1) + '" x2="' + (x0 + W) + '" y2="' + by.toFixed(1) + '" ' + L + '/>');
          for (var bx = x0 + (r % 2 ? 7 : 14) * k; bx < x0 + W - 2; bx += 14 * k) p.push('<line x1="' + bx.toFixed(1) + '" y1="' + by.toFixed(1) + '" x2="' + bx.toFixed(1) + '" y2="' + (by + H / 3).toFixed(1) + '" ' + L + '/>');
        }
      }
      out.push(p.join(''));
      if (o.poles && (t === 'm1' || t === 'm2')) {
        var tp = o.poles[t], bp = tp === 'N' ? 'S' : 'N';
        [[tp, ry + H * 0.27], [bp, ry + H * 0.73]].forEach(function (q) {
          out.push('<circle cx="' + (x0 - 15 * k) + '" cy="' + q[1].toFixed(1) + '" r="' + (H * 0.21).toFixed(1) + '" style="fill:var(--' + (q[0] === 'N' ? 'npole' : 'spole') + ');stroke:var(--stroke)" stroke-width="1"/>' +
            '<text x="' + (x0 - 15 * k) + '" y="' + (q[1] + 3.2 * k).toFixed(1) + '" text-anchor="middle" font-size="' + (8.5 * k).toFixed(1) + '" font-weight="700" style="fill:var(--card);font-family:var(--f-label)">' + q[0] + '</text>');
        });
      }
      if (o.labels) out.push('<text x="' + (cx + Math.max(W, BW) / 2 + 10 * k) + '" y="' + (ry + H / 2 + 4.5 * k).toFixed(1) + '" font-size="' + fs + '" style="fill:var(--ink);font-family:var(--f-label)">' + RING_NAMES[t] + '</text>');
      y = ry;
    });
    if (o.labels && !o.bare) out.push('<text x="' + (cx + Math.max(W, BW) / 2 + 10 * k) + '" y="' + (h - 4 - BH / 2 + 4.5 * k).toFixed(1) + '" font-size="' + fs + '" style="fill:var(--muted);font-family:var(--f-label)">wooden stand</text>');
    var aria = o.aria || ('From bottom to top: ' + tokens.map(function (t) { return t === '|' ? 'a gap' : RING_NAMES[t]; }).join(', ') + '.');
    return '<svg viewBox="0 0 ' + w.toFixed(0) + ' ' + h.toFixed(0) + '" width="' + (o.width || w.toFixed(0)) + '" role="img" aria-label="' + aria + '" style="max-width:100%;height:auto">' + out.join('') + '</svg>';
  }
  /*RINGS-END*/

  /* ---------- the physics, P3 rules only ---------- */
  var NAME = { m1: 'Magnet 1', m2: 'Magnet 2', mm: 'The magnetic material ring', nm: 'The non-magnetic ring' };
  function lc(t) { return t === 'm1' || t === 'm2' ? NAME[t] : NAME[t].charAt(0).toLowerCase() + NAME[t].slice(1); }
  function isMag(t) { return t === 'm1' || t === 'm2'; }
  function opp(p) { return p === 'N' ? 'S' : 'N'; }
  function below(stack, i) { var j = i; while (j >= 0 && stack[j] === 'nm') j--; return j; }

  /* gap[i] is true when the ring above position i floats */
  function simulate(stack, up) {
    var gaps = [], why = [];
    if (stack.length) why.push({ i: -1, gap: false, t: NAME[stack[0]] + ' rests on the wooden base.' });
    for (var i = 0; i < stack.length - 1; i++) {
      var lo = stack[i], hi = stack[i + 1], j = below(stack, i), thr = j >= 0 && j < i;
      var via = thr ? ' through the non-magnetic ring' : '';
      var g = isMag(hi) && j >= 0 && isMag(stack[j]) && up[stack[j]] === opp(up[hi]);
      gaps.push(g);
      var t;
      if (g) {
        t = '↑ ' + NAME[hi] + ' floats. ' + NAME[stack[j]] + '’s ' + up[stack[j]] + ' pole faces ' + lc(hi) + '’s ' + opp(up[hi]) + ' pole: like poles repel' +
          (thr ? '. The push acts through the non-magnetic ring.' : '.');
      } else if (hi === 'nm') {
        t = NAME.nm + ' rests on ' + lc(lo) + '. A magnet does not push or pull it, so it simply sits on whatever is under it.';
      } else if (hi === 'mm') {
        if (j >= 0 && isMag(stack[j])) t = NAME[stack[j]] + ' pulls the magnetic material' + via + ', so it sits on ' + lc(lo) + '. A magnetic material is only ever pulled, never pushed.';
        else t = NAME.mm + ' rests on ' + lc(lo) + '. There is no magnet beside it.';
      } else {
        if (j < 0) t = NAME[hi] + ' rests on ' + lc(lo) + '.';
        else if (stack[j] === 'mm') t = NAME[hi] + ' attracts the magnetic material' + via + ', so it is pulled down onto ' + lc(lo) + '.';
        else t = NAME[stack[j]] + '’s ' + up[stack[j]] + ' pole faces ' + lc(hi) + '’s ' + opp(up[hi]) + ' pole: unlike poles attract' + via + ', so ' + lc(hi) + ' is pulled down onto ' + lc(lo) + '.';
      }
      why.push({ i: i, gap: g, t: t });
    }
    return { gaps: gaps, why: why };
  }
  function tokensOf(stack, gaps) {
    var t = [];
    stack.forEach(function (s, i) { if (i && gaps[i - 1]) t.push('|'); t.push(s); });
    return t;
  }
  function parse(tokens) {
    var stack = [], gaps = [];
    tokens.forEach(function (t) { if (t === '|') gaps[stack.length - 1] = true; else { if (stack.length) gaps[stack.length - 1] = !!gaps[stack.length - 1]; stack.push(t); } });
    return { stack: stack, gaps: gaps };
  }
  var COMBOS = [{ m1: 'N', m2: 'N' }, { m1: 'S', m2: 'N' }, { m1: 'N', m2: 'S' }, { m1: 'S', m2: 'S' }];
  function same(a, b) { if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (!!a[i] !== !!b[i]) return false; return true; }

  /* ---------- the three drawings from the question (bottom to top) ---------- */
  var DRAW = {
    '1': ['mm', 'm1', '|', 'm2', 'nm'],
    '2': ['m2', 'nm', '|', 'm1', 'mm'],
    '3': ['nm', 'm1', '|', 'mm', 'm2']
  };

  var st = { mode: '2', stack: [], up: { m1: 'N', m2: 'N' }, tried: {}, everyWay: false };

  function load(mode) {
    st.mode = mode; st.tried = {}; st.everyWay = false;
    if (mode === 'build') st.stack = [];
    else st.stack = parse(DRAW[mode]).stack.slice();
    st.up = { m1: 'N', m2: 'N' };
    render();
  }

  function render() {
    var build = st.mode === 'build';
    var bs = $('loadRow').querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-m') === st.mode ? 'true' : 'false');
    $('drawCol').classList.toggle('hidden', build);
    document.querySelector('.ringlab').classList.toggle('solo', build);
    $('buildBox').classList.toggle('hidden', !build);
    $('everyBtn').classList.toggle('hidden', build);

    var sim = simulate(st.stack, st.up);
    var real = tokensOf(st.stack, sim.gaps);
    $('realSvg').innerHTML = st.stack.length
      ? ringsSVG(real, { scale: 1.5, labels: true, poles: st.up, push: true, width: '100%' })
      : '<p class="empty">The stand is empty. Tap a ring below to put it on.</p>';

    ['m1', 'm2'].forEach(function (m) {
      var b = $('turn-' + m), on = st.stack.indexOf(m) >= 0;
      b.disabled = !on;
      b.innerHTML = 'Turn ' + RING_NAMES[m] + ' over <small>(' + st.up[m] + ' on top)</small>';
    });

    var lines = $('whyLines'); lines.innerHTML = '';
    sim.why.slice().reverse().forEach(function (w) { lines.appendChild(el('div', 'line' + (w.gap ? ' gapline' : ''), w.t)); });

    var chips = $('matchChips'), v = $('verdict'), allBox = $('everyWay');
    chips.innerHTML = ''; v.textContent = ''; v.className = 'verdict'; allBox.innerHTML = '';
    if (build) {
      var shelf = $('shelf').querySelectorAll('button');
      for (var s = 0; s < shelf.length; s++) shelf[s].disabled = st.stack.indexOf(shelf[s].getAttribute('data-k')) >= 0;
      $('takeBtn').disabled = !st.stack.length;
      return;
    }

    var d = parse(DRAW[st.mode]);
    $('drawSvg').innerHTML = ringsSVG(DRAW[st.mode], { scale: 1.1, labels: true, width: '100%' });
    var ok = same(d.gaps, sim.gaps);
    st.tried[st.up.m1 + st.up.m2] = ok;
    d.gaps.forEach(function (g, i) {
      var match = !!g === !!sim.gaps[i];
      var where = (g ? 'Gap' : 'Touching') + ' between ' + RING_NAMES[d.stack[i]] + ' and ' + RING_NAMES[d.stack[i + 1]];
      chips.appendChild(el('span', 'chip ' + (match ? 'ok' : 'no'), (match ? '✓ ' : '✗ ') + where));
    });
    if (ok) { v.className = 'verdict ok'; v.textContent = '✓ With the magnets this way round, the real result matches drawing (' + st.mode + '). So drawing (' + st.mode + ') is possible.'; }
    else {
      var n = Object.keys(st.tried).length;
      v.className = 'verdict no';
      v.textContent = '✗ This way round, the real result does not match drawing (' + st.mode + '). ' + (n < 4 ? 'Turn a magnet over and look again (' + n + ' of 4 ways tried).' : 'You have tried all 4 ways round.');
    }
    if (st.everyWay || Object.keys(st.tried).length === 4) {
      var any = false, rows = COMBOS.map(function (c) {
        var m = same(d.gaps, simulate(d.stack, c).gaps); any = any || m;
        return '<tr><td>' + c.m1 + ' on top</td><td>' + c.m2 + ' on top</td><td>' + (m ? '✓ matches' : '✗ does not match') + '</td></tr>';
      }).join('');
      allBox.innerHTML = '<table class="qtable"><thead><tr><th>Magnet 1</th><th>Magnet 2</th><th>Drawing (' + st.mode + ')</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="verdict ' + (any ? 'ok' : 'no') + '">' + (any
          ? '✓ Possible. At least one way round gives this drawing.'
          : '✗ Not possible. No way of turning the magnets gives this drawing.') + '</p>';
    }
  }

  /* ---------- wire up ---------- */
  (function () {
    var row = $('loadRow');
    [['1', 'Drawing (1)'], ['2', 'Drawing (2)'], ['3', 'Drawing (3)'], ['build', 'Build your own']].forEach(function (b) {
      var x = el('button', 'btn', b[1]); x.type = 'button'; x.setAttribute('data-m', b[0]);
      x.addEventListener('click', function () { load(b[0]); });
      row.appendChild(x);
    });
    ['m1', 'm2'].forEach(function (m) {
      $('turn-' + m).addEventListener('click', function () { st.up[m] = opp(st.up[m]); render(); });
    });
    $('everyBtn').addEventListener('click', function () { st.everyWay = true; render(); });
    var shelf = $('shelf');
    ['m1', 'm2', 'mm', 'nm'].forEach(function (k) {
      var b = el('button', 'tile', ringsSVG([k], { scale: 0.8, bare: true }) + '<small>' + RING_NAMES[k] + '</small>');
      b.type = 'button'; b.setAttribute('data-k', k);
      b.addEventListener('click', function () { if (st.stack.indexOf(k) < 0) { st.stack.push(k); render(); } });
      shelf.appendChild(b);
    });
    $('takeBtn').addEventListener('click', function () { st.stack.pop(); render(); });
    $('clearBtn').addEventListener('click', function () { st.stack = []; render(); });

    /* the original question's figure: key and the three drawings */
    var key = $('origKey');
    ['m1', 'm2', 'mm', 'nm'].forEach(function (k) {
      key.appendChild(el('figure', 'keyitem', ringsSVG([k], { scale: 0.9, bare: true }) + '<figcaption>' + RING_NAMES[k] + '</figcaption>'));
    });
    var opts = $('origOpts');
    ['1', '2', '3'].forEach(function (n) {
      var tag = n === '2' ? '<span class="badge no">✗ your answer</span>' : n === '3' ? '<span class="badge ok">✓ answer</span>' : '';
      opts.appendChild(el('figure', 'origopt', '<figcaption><b>(' + n + ')</b> ' + tag + '</figcaption>' + ringsSVG(DRAW[n], { scale: 0.9 })));
    });
  })();

  load('2');
  P.Q.set(document.getElementById('qs'), P.data.questions, {});
})();
