/* Fungi on feet. A conditions explorer, then a bench where each answer option is tried before the question unlocks. */
(function () {
  'use strict';
  var P = window.PSLE, esc = P.esc;
  var FACT = [
    { k: 'warm', on: 'Warm', off: 'Cool' },
    { k: 'dark', on: 'Dark', off: 'Bright' },
    { k: 'damp', on: 'Damp', off: 'Dry' },
    { k: 'food', on: 'Food there', off: 'No food' }
  ];
  var COUNT = [0, 2, 3, 5, 8], SCALE = [0.6, 0.75, 0.9, 1.05, 1.2];
  var LVL = ['Fungi cannot grow.', 'Fungi hardly grow.', 'Fungi grow slowly.', 'Fungi keep growing.', 'Fungi grow fast.'];
  var PATCH = '<g class="patch"><circle r="9" fill="#4E6B3C"/><circle cx="8" cy="-5" r="6" fill="#5C7A47"/><circle cx="-7" cy="5" r="6" fill="#43603A"/><circle cx="-2" cy="-3" r="1.6" fill="#fff"/><circle cx="6" cy="3" r="1.4" fill="#fff"/><circle cx="-8" cy="7" r="1.3" fill="#fff"/></g>';
  var SK = 'class="ln" fill="#F2C9A5"';
  var SHAPES = {
    foot: { label: "Kok Ming's foot (sole)",
      svg: '<path ' + SK + ' d="M118 178 C78 172 66 136 80 98 C88 78 98 66 112 58 C128 50 152 50 168 60 C190 74 196 106 190 136 C186 162 162 182 118 178 Z"/>' +
        '<circle ' + SK + ' cx="96" cy="46" r="13"/><circle ' + SK + ' cx="124" cy="36" r="10"/><circle ' + SK + ' cx="147" cy="35" r="9"/><circle ' + SK + ' cx="166" cy="41" r="8"/><circle ' + SK + ' cx="182" cy="52" r="7"/>' +
        '<path class="ln" fill="none" d="M112 120 C112 100 130 96 142 108 C150 118 146 140 132 150"/>',
      pts: [[110, 62], [136, 54], [156, 54], [174, 62], [104, 78], [150, 72], [128, 74], [170, 84]] },
    bread: { label: 'Slice of bread',
      svg: '<path class="ln" fill="#D9A55B" d="M80 160 V92 C58 88 56 52 92 44 C122 37 178 37 208 44 C244 52 242 88 220 92 V160 Z"/><path fill="#F3DDA8" d="M92 150 V86 C74 82 74 58 98 53 C124 48 176 48 202 53 C226 58 226 82 208 86 V150 Z"/>',
      pts: [[112, 72], [150, 66], [190, 74], [120, 108], [176, 112], [104, 134], [150, 132], [196, 134]] },
    shoe: { label: "Ali's school shoe",
      svg: '<path class="ln" fill="#8FA2B6" d="M52 146 V86 Q52 70 70 70 H104 Q116 104 156 108 Q216 112 252 128 Q274 136 274 146 Z"/><rect class="ln" fill="#1F2A37" x="50" y="146" width="226" height="14" rx="4"/><path class="ln" fill="none" d="M104 70 L150 72"/>',
      pts: [[78, 98], [98, 122], [132, 126], [164, 124], [196, 130], [226, 134], [256, 140], [118, 98]] },
    dish: { label: 'Test sample',
      svg: '<circle class="ln" fill="#F6EBD0" cx="150" cy="100" r="82"/><circle fill="none" stroke="#C8B98F" stroke-width="2" cx="150" cy="100" r="68"/>',
      pts: [[118, 70], [150, 58], [184, 72], [96, 100], [204, 104], [122, 134], [158, 144], [190, 130]] }
  };
  function count(c) { return c.split('').filter(function (x) { return x === '1'; }).length; }
  function stage(scene, lvl, label) {
    var sh = SHAPES[scene], n = lvl == null ? 0 : COUNT[lvl], sc = lvl == null ? 1 : SCALE[lvl];
    var patches = sh.pts.slice(0, n).map(function (p, i) {
      return '<g transform="translate(' + p[0] + ',' + p[1] + ') scale(' + sc + ')"><g class="pw" style="transition-delay:' + (i * 70) + 'ms">' + PATCH + '</g></g>';
    }).join('');
    return '<div class="fstage"><span class="fday">' + (lvl == null ? 'Day 0' : 'Day 3') + '</span><span class="fwhat">' + esc(label || sh.label) + '</span>' +
      '<svg viewBox="0 0 300 200" role="img" aria-label="' + esc(sh.label) + (n ? ' with ' + n + ' patches of fungi' : ' with no fungi') + '">' + sh.svg + patches + '</svg></div>';
  }
  function grow(host, anim) {
    var ps = host.querySelectorAll('.pw');
    function on() { Array.prototype.forEach.call(ps, function (p) { p.classList.add('on'); }); }
    if (anim && !P.reduced) { void host.offsetWidth; requestAnimationFrame(function () { requestAnimationFrame(on); }); }
    else { host.classList.add('still'); on(); }
  }
  function condRows(c) {
    return '<ul class="fcond">' + FACT.map(function (f, i) {
      var y = c ? c.charAt(i) === '1' : null;
      if (y === null) return '<li class="fc"><span class="fi" aria-hidden="true">–</span><b>' + esc(f.on + ' or ' + f.off.toLowerCase()) + '</b><span class="ft">not tried yet</span></li>';
      return '<li class="fc ' + (y ? 'yes' : 'no') + '"><span class="fi" aria-hidden="true">' + (y ? '✔' : '✖') + '</span><b>' + esc(y ? f.on : f.off) + '</b><span class="ft">' + (y ? 'helps fungi' : 'does not help fungi') + '</span></li>';
    }).join('') + '</ul>';
  }

  /* ---------- explorer ---------- */
  (function () {
    var host = document.getElementById('lab'); if (!host) return;
    var cond = [1, 1, 1, 1], anim = true;
    function draw() {
      var c = cond.join(''), n = count(c), gone = FACT.filter(function (f, i) { return !cond[i]; }).map(function (f) { return f.on === 'Food there' ? 'food' : f.on.toLowerCase(); });
      var sw = FACT.map(function (f, i) {
        return '<button type="button" class="fsw ' + (cond[i] ? 'on' : 'off') + '" data-i="' + i + '" aria-pressed="' + (cond[i] ? 'true' : 'false') + '">' +
          '<span class="fi" aria-hidden="true">' + (cond[i] ? '✔' : '✖') + '</span><span><b>' + esc(cond[i] ? f.on : f.off) + '</b><small>' + (cond[i] ? 'helps fungi' : 'does not help fungi') + '</small></span></button>';
      }).join('');
      host.innerHTML = '<div class="bench fbench"><div>' + stage('bread', n, 'Slice of bread') +
        '<p class="fmsg" aria-live="polite">' + esc(LVL[n]) + ' ' + n + ' of the 4 things fungi like.' + (gone.length ? ' You took away: ' + gone.join(', ') + '.' : '') + '</p></div>' +
        '<div class="box"><p class="box-h">Change the bread’s surroundings</p><div class="fsws">' + sw + '</div></div></div>';
      grow(host, anim); anim = false;
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('.fsw'); if (!b) return;
      var i = +b.getAttribute('data-i'); cond[i] = cond[i] ? 0 : 1; anim = true; draw();
      var nb = host.querySelector('.fsw[data-i="' + i + '"]'); if (nb) nb.focus();
    });
    draw();
  })();

  /* ---------- question bench ---------- */
  function lvls(q) { return q.bench.tests.map(function (t) { return count(t.conds); }); }
  var BENCH = {
    lockMsg: 'Try all four choices on the bench to unlock the options.',
    init: function () { return { tested: {}, last: null, anim: false }; },
    done: function (q, s) { return q.bench.tests.every(function (t, i) { return s.tested[i]; }); },
    todo: function (q, s) { return q.bench.tests.filter(function (t, i) { return !s.tested[i]; }).map(function (t) { return t.label; }).join(', '); },
    onWrong: function () {},
    clashes: function (q, s, i) {
      var L = lvls(q), T = q.bench.tests, reduce = q.bench.goal === 'reduce';
      var best = reduce ? Math.min.apply(null, L) : Math.max.apply(null, L), bi = L.indexOf(best);
      if (i === bi) return [];
      return [reduce
        ? T[i].label + ': in your test the fungi still had ' + L[i] + ' of the 4 things they like. ' + T[bi].label + ' left them only ' + L[bi] + '.'
        : T[i].label + ': in your test the fungi had only ' + L[i] + ' of the 4 things they like. ' + T[bi].label + ' gave them ' + L[bi] + '.'];
    },
    render: function (q, s, host, api) {
      var B = q.bench, T = B.tests, L = lvls(q), last = s.last;
      var t = last == null ? null : T[last];
      var stg = stage(B.scene, t ? L[last] : null);
      var msg = t ? t.label + ': ' + L[last] + ' of the 4 things fungi like. ' + LVL[L[last]] : 'Nothing tried yet. Tap a choice below.';
      var btns = T.map(function (x, i) {
        return '<button type="button" class="btn small' + (last === i ? ' cur' : '') + '" data-b="test" data-i="' + i + '" aria-pressed="' + (last === i) + '">' + (s.tested[i] ? '✔ ' : '') + esc(x.label) + '</button>';
      }).join('');
      var rows = T.map(function (x, i) {
        return '<tr' + (last === i ? ' class="now"' : '') + '><th scope="row">' + esc(x.label) + '</th>' +
          (s.tested[i] ? '<td>' + L[i] + ' of 4</td><td>' + esc(LVL[L[i]]) + '</td>' : '<td colspan="2" class="untested">not tried</td>') + '</tr>';
      }).join('');
      var n = T.filter(function (x, i) { return s.tested[i]; }).length;
      host.classList.remove('still');
      host.innerHTML = '<div class="bench fbench"><div>' + stg + '<p class="fmsg" aria-live="polite">' + esc(msg) + '</p>' +
        '<p class="note-s instr">Tap a choice to try it on the bench.</p><div class="row">' + btns + '</div></div>' +
        '<div><div class="box"><p class="box-h">What the fungi get</p>' + condRows(t ? t.conds : null) + '</div>' +
        '<div class="box"><p class="box-h">Test log</p><table class="flog"><thead><tr><th scope="col">Choice</th><th scope="col">Things fungi like</th><th scope="col">After 3 days</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="note-s">' + n + ' of ' + T.length + ' choices tried</p></div></div></div>';
      if (t) { grow(host, s.anim); } s.anim = false;
      if (!host._wired) {
        host._wired = true;
        host.addEventListener('click', function (e) {
          var b = e.target.closest('[data-b="test"]'); if (!b) return;
          var i = +b.getAttribute('data-i'); s.tested[i] = true; s.last = i; s.anim = true; api.refresh();
        });
      }
    }
  };

  P.Q.set(document.getElementById('qs'), P.data.questions, { bench: BENCH });
})();
