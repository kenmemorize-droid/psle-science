/* P3 Life cycles focus: reading a stage-days bar graph. Bars -> timeline -> test four statements, then the questions. */
(function () {
  'use strict';
  var P = window.PSLE; if (!P) return;
  function $(id) { return document.getElementById(id); }
  var ST = [{ n: 'Egg', d: 10, f: 'var(--fa)' }, { n: 'Young', d: 15, f: 'var(--fb)' }, { n: 'Adult', d: 20, f: 'var(--fc)' }];
  var TOTAL = 45, sel = -1, day = 0, hl = [];

  function bounds(i) { var s = 0, k; for (k = 0; k < i; k++) s += ST[k].d; return [s, s + ST[i].d]; }
  function stageAt(d) { for (var i = 0; i < ST.length; i++) { var b = bounds(i); if (d < b[1]) return i; } return ST.length - 1; }

  /* ---------- bar chart ---------- */
  function bars() {
    var base = 205, ys = 6.4, x0 = 56, bw = 76, gap = 26, s = '';
    s += '<svg class="barsvg" viewBox="0 0 380 265" role="group" aria-label="Bar graph of days spent at each stage of organism T">';
    for (var t = 0; t <= 25; t += 5) {
      var y = base - t * ys;
      s += '<line x1="' + x0 + '" y1="' + y + '" x2="360" y2="' + y + '" style="stroke:var(--line);stroke-width:1"/>' +
        '<text x="' + (x0 - 6) + '" y="' + (y + 4) + '" text-anchor="end" style="fill:var(--ink);font-size:12px">' + t + '</text>';
    }
    s += '<line x1="' + x0 + '" y1="' + base + '" x2="' + x0 + '" y2="' + (base - 25 * ys - 6) + '" style="stroke:var(--stroke);stroke-width:2"/>' +
      '<line x1="' + x0 + '" y1="' + base + '" x2="360" y2="' + base + '" style="stroke:var(--stroke);stroke-width:2"/>' +
      '<text x="' + (x0 - 40) + '" y="14" text-anchor="start" style="fill:var(--ink);font-size:12px;font-weight:700">Number of days</text>';
    ST.forEach(function (b, i) {
      var x = x0 + gap * (i + 1) + bw * i, h = b.d * ys;
      s += '<g class="sbar' + (sel === i ? ' sel' : '') + '" data-i="' + i + '" tabindex="0" role="button" aria-pressed="' + (sel === i) + '" aria-label="' + b.n + ' stage: ' + b.d + ' days">' +
        '<rect x="' + x + '" y="' + (base - h) + '" width="' + bw + '" height="' + h + '" style="fill:' + (sel === i ? 'var(--primary-soft)' : b.f) + '"/>' +
        '<text x="' + (x + bw / 2) + '" y="' + (base - h - 6) + '" text-anchor="middle" style="font-size:13px;font-weight:700">' + (sel === i || hl.indexOf(i) > -1 ? b.d + ' days' : '') + '</text>' +
        '<text x="' + (x + bw / 2) + '" y="' + (base + 18) + '" text-anchor="middle" style="font-size:13px">' + b.n + '</text></g>';
    });
    s += '<text x="' + (x0 + 150) + '" y="243" text-anchor="middle" style="fill:var(--ink);font-size:12px;font-weight:700">Stages</text></svg>';
    return s;
  }
  function drawBars() {
    var h = $('bars');
    h.innerHTML = bars() + '<p class="rd" aria-live="polite">' + (sel < 0 ? 'No bar tapped yet.' : ST[sel].n + ' stage: this stage lasts ' + ST[sel].d + ' days. It is one stage only.') + '</p>';
  }
  $('bars').addEventListener('click', function (e) {
    var g = e.target.closest('.sbar'); if (!g) return; sel = +g.getAttribute('data-i'); hl = []; drawBars();
    var n = $('bars').querySelector('.sbar[data-i="' + sel + '"]'); if (n) n.focus();
  });
  $('bars').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return; var g = e.target.closest('.sbar'); if (!g) return; e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  /* ---------- timeline ---------- */
  var SC = 7.4, X0 = 14;
  function line() {
    var s = '<svg class="linesvg" viewBox="0 0 360 120" role="img" aria-label="The three bars placed end to end: egg 0 to 10 days, young 10 to 25 days, adult 25 to 45 days">';
    ST.forEach(function (b, i) {
      var r = bounds(i), x = X0 + r[0] * SC, w = b.d * SC;
      s += '<rect x="' + x + '" y="34" width="' + w + '" height="34" style="fill:' + b.f + ';stroke:var(--stroke);stroke-width:' + (hl.indexOf(i) > -1 ? 4 : 2) + '"/>' +
        '<text x="' + (x + w / 2) + '" y="55" text-anchor="middle" style="fill:var(--ink);font-size:13px;font-weight:700">' + b.n + ' ' + b.d + '</text>';
    });
    [0, 10, 25, 45].forEach(function (d) {
      s += '<text x="' + (X0 + d * SC) + '" y="90" text-anchor="middle" style="fill:var(--ink);font-size:12px">' + d + '</text>' +
        '<line x1="' + (X0 + d * SC) + '" y1="68" x2="' + (X0 + d * SC) + '" y2="74" style="stroke:var(--stroke);stroke-width:2"/>';
    });
    var mx = X0 + day * SC;
    s += '<path d="M' + (mx - 7) + ' 20 L' + (mx + 7) + ' 20 L' + mx + ' 32 Z" style="fill:var(--primary);stroke:var(--stroke);stroke-width:2"/>' +
      '<text x="180" y="112" text-anchor="middle" style="fill:var(--muted);font-size:12px">Days since the egg was laid</text></svg>';
    return s;
  }
  function readout() {
    var i = stageAt(day), b = bounds(i), out;
    if (day >= TOTAL) out = 'After 45 days the adult stage is over: the life cycle is complete.';
    else out = 'After ' + day + ' days: ' + ST[i].n + ' stage (days ' + b[0] + ' to ' + b[1] + ').' +
      (i > 0 ? ' It hatched ' + (day - 10) + ' day' + (day - 10 === 1 ? '' : 's') + ' ago.' : ' It has not hatched yet.');
    return out;
  }
  function drawLine() {
    var h = $('line');
    h.innerHTML = line() + '<div class="sl"><input type="range" id="sld" min="0" max="45" step="1" value="' + day + '" aria-label="Days since the egg was laid"><output id="dout" for="sld">' + day + ' days</output></div><p class="rd" id="rdl" aria-live="polite">' + readout() + '</p>';
    $('sld').addEventListener('input', function () { day = +this.value; hl = []; sel = -1; update(); });
  }
  function update() {
    var h = $('line'), r = $('rdl'), o = $('dout'), sv = h.querySelector('svg');
    $('sld').value = day; o.textContent = day + ' days'; r.textContent = readout();
    var tmp = document.createElement('div'); tmp.innerHTML = line(); sv.parentNode.replaceChild(tmp.firstChild, sv);
    drawBars();
  }

  /* ---------- four choices ---------- */
  var TESTS = [
    { n: '(1) It has a nymph stage in its life cycle.', day: null, hl: [], ok: false,
      v: 'Not supported. The graph names three stages: Egg, Young, Adult. It does not say the young stage is a nymph. A chicken also has an egg, a young stage and an adult stage.' },
    { n: '(2) It is at its young stage on the fifth day.', day: 5, hl: [0], ok: false,
      v: 'False. Slide to day 5: the animal is still an egg. The egg stage lasts 10 days. The young stage starts after day 10.' },
    { n: '(3) It lives for twenty days after it is hatched from the egg.', day: 45, hl: [1, 2], ok: false,
      v: 'False. After hatching, it spends 15 days as young and 20 days as an adult: 15 + 20 = 35 days. Twenty days is the adult stage only.' },
    { n: '(4) It takes fifteen days to become an adult after it is hatched from the egg.', day: 25, hl: [1], ok: true,
      v: 'True. The young stage starts when the egg hatches and lasts 15 days. When it ends, the animal is an adult.' }
  ];
  (function () {
    var box = $('tests'), cur = -1;
    TESTS.forEach(function (t, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'testbtn'; b.textContent = t.n; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        cur = i; hl = t.hl.slice(); sel = -1; if (t.day !== null) day = t.day;
        Array.prototype.forEach.call(box.children, function (c, k) { c.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
        update();
        var vd = $('verdict'); vd.className = 'verdict ' + (t.ok ? 'ok' : 'no'); vd.textContent = (t.ok ? '✔ ' : '✖ ') + t.v;
      });
      box.appendChild(b);
    });
  })();

  drawBars(); drawLine();
  P.Q.set($('qs'), P.data.questions, {});
})();
