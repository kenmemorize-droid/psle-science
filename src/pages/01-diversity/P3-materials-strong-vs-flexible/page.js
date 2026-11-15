/* Strong vs flexible: property test bench (one bench per question). */
(function () {
  'use strict';
  var P = window.PSLE, esc = P.esc;

  var TESTS = {
    strong: { name: 'load test', pass: 'held the load without breaking', fail: 'broke under the load', pw: 'strong', fw: 'not strong' },
    flex:   { name: 'bend test', pass: 'bent without breaking', fail: 'snapped as soon as it was bent', pw: 'flexible', fw: 'not flexible' },
    water:  { name: 'water test', pass: 'did not absorb water, so its mass did not change', fail: 'absorbed water, so its mass went up', pw: 'waterproof', fw: 'not waterproof' },
    float:  { name: 'float test', pass: 'stayed near the surface', fail: 'sank to the bottom', pw: 'able to float', fw: 'not able to float' },
    light:  { name: 'light test', most: 'let most light through', some: 'let some light through', none: 'let no light through' }
  };
  function resultOf(spec, t) {
    if (t === 'light') return { ok: spec.props.light === 'most', word: TESTS.light[spec.props.light], state: spec.props.light };
    var p = !!spec.props[t];
    return { ok: p, word: p ? TESTS[t].pass : TESTS[t].fail, state: p ? 'pass' : 'fail' };
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function svg(inner) { return '<svg viewBox="0 0 520 220" role="img" aria-label="Property test bench">' + inner + '</svg>'; }

  function idle() {
    return svg('<rect class="sl" x="190" y="90" width="140" height="44" rx="5"/>' +
      '<text class="lbl" x="260" y="118" text-anchor="middle">specimen</text>' +
      '<text class="lbl sm" x="260" y="170" text-anchor="middle">Pick a material, then pick a test.</text>');
  }
  function draw(spec, test, r) {
    var c = '<text class="lbl" x="260" y="16" text-anchor="middle">' + esc(spec.name) + ' (' + esc(spec.id) + ') · ' + TESTS[test].name + '</text>';
    if (test === 'strong') return svg(c +
      '<rect class="sl" x="34" y="100" width="34" height="86" rx="4"/><rect class="sl" x="452" y="100" width="34" height="86" rx="4"/>' +
      (r.ok ? '<path class="ln" d="M60 110 Q260 132 460 110"/><line class="ln" x1="260" y1="128" x2="260" y2="150"/>' +
              '<rect class="sl fb2" x="226" y="150" width="68" height="40" rx="5"/><text class="lbl" x="260" y="175" text-anchor="middle">load</text>'
            : '<path class="ln" d="M60 110 L236 150"/><path class="ln" d="M286 152 L460 110"/>' +
              '<rect class="sl fb2" x="226" y="162" width="68" height="40" rx="5"/><text class="lbl" x="260" y="187" text-anchor="middle">load</text>' +
              '<path class="ln" d="M250 120 l10 -14 M268 122 l8 -16"/>'));
    if (test === 'flex') return svg(c +
      (r.ok ? '<path class="ln" d="M80 170 Q260 40 440 170"/><path class="ln" d="M80 170 l-16 -8 M80 170 l-8 -16"/><path class="ln" d="M440 170 l16 -8 M440 170 l8 -16"/>' +
              '<text class="lbl sm" x="260" y="200" text-anchor="middle">bent right over, still in one piece</text>'
            : '<path class="ln" d="M80 170 L238 108"/><path class="ln" d="M284 108 L440 170"/>' +
              '<path class="ln" d="M246 96 l-6 -16 M262 94 l2 -18 M278 96 l8 -16"/>' +
              '<text class="lbl sm" x="260" y="200" text-anchor="middle">it snapped into two pieces</text>'));
    if (test === 'water') return svg(c +
      '<rect class="sl' + (r.ok ? '' : ' fa') + '" x="170" y="104" width="180" height="62" rx="5"/>' +
      (r.ok ? '<path class="ln fa" d="M260 56 c 14 20 23 31 23 40 a23 23 0 0 1 -46 0 c0 -9 9 -20 23 -40 z"/>' +
              '<text class="lbl sm" x="260" y="192" text-anchor="middle">the drop sits on top · mass stays the same</text>'
            : '<path class="ln" d="M260 56 v30 M250 74 l10 12 l10 -12"/>' +
              '<text class="lbl sm" x="260" y="192" text-anchor="middle">the water went in · mass goes up</text>'));
    if (test === 'float') return svg(c +
      '<path class="ln" d="M150 36 v150 h220 v-150"/><path class="ln fa" d="M150 82 h220 v104 h-220 z"/>' +
      (r.ok ? '<rect class="sl fc2" x="232" y="62" width="58" height="40" rx="4"/><text class="lbl sm" x="260" y="206" text-anchor="middle">floating at the surface</text>'
            : '<rect class="sl fc2" x="232" y="144" width="58" height="40" rx="4"/><text class="lbl sm" x="260" y="206" text-anchor="middle">resting on the bottom</text>'));
    var beams = { most: '<path class="ln" d="M268 92 H404 M268 110 H404 M268 128 H404"/>', some: '<path class="ln" d="M268 110 H404" stroke-dasharray="7 8"/>', none: '' }[r.state];
    return svg(c +
      '<circle class="sl fb2" cx="72" cy="110" r="24"/><text class="lbl sm" x="72" y="156" text-anchor="middle">torch</text>' +
      '<path class="ln" d="M100 92 H228 M100 110 H228 M100 128 H228"/>' +
      '<rect class="sl" x="228" y="54" width="40" height="112" rx="4"/>' + beams +
      '<path class="ln" d="M408 44 v132"/><text class="lbl sm" x="436" y="114">screen</text>' +
      '<text class="lbl sm" x="260" y="200" text-anchor="middle">' + r.word + '</text>');
  }

  function specOf(q, id) { return q.bench.specimens.filter(function (s) { return s.id === id; })[0]; }

  var BENCH = {
    lockMsg: 'Run every test on the bench to unlock the options.',
    init: function (q) { return { done: {}, sel: q.bench.specimens.length === 1 ? q.bench.specimens[0].id : null, last: null }; },
    done: function (q, s) { return q.bench.specimens.every(function (sp) { return q.bench.tests.every(function (t) { return s.done[sp.id + '|' + t]; }); }); },
    todo: function (q, s) {
      var left = [];
      q.bench.specimens.forEach(function (sp) { q.bench.tests.forEach(function (t) { if (!s.done[sp.id + '|' + t]) left.push(sp.id + ' ' + TESTS[t].name); }); });
      return left.join(', ');
    },
    render: function (q, s, host, api) {
      var B = q.bench, stage, msg;
      if (!s.last) { stage = idle(); msg = 'Nothing tested yet.'; }
      else {
        var sp = specOf(q, s.last.spec), t = s.last.test, r = resultOf(sp, t);
        stage = draw(sp, t, r);
        var word = t === 'light' ? r.word.replace('let ', 'lets ') : (r.ok ? TESTS[t].pw : TESTS[t].fw);
        msg = '<b>' + esc(sp.id) + ':</b> ' + r.word + '. So ' + esc(sp.id) + ' ' + (t === 'light' ? '' : 'is ') + '<b>' + word + '</b>.';
      }
      var shelf = B.specimens.map(function (sp) {
        var n = B.tests.filter(function (t) { return s.done[sp.id + '|' + t]; }).length;
        return '<button type="button" class="tile" data-b="spec" data-id="' + esc(sp.id) + '" aria-pressed="' + (s.sel === sp.id) + '"><b>' + esc(sp.id) + '</b><span>' + esc(sp.name) + '</span><small>' + n + ' of ' + B.tests.length + ' tests</small></button>';
      }).join('');
      var chips = B.tests.map(function (t) {
        var d = s.sel && s.done[s.sel + '|' + t];
        return '<button type="button" class="btn" data-b="test" data-t="' + t + '"' + (s.sel ? '' : ' disabled') + '>' + (d ? '↻ ' : '') + cap(TESTS[t].name) + '</button>';
      }).join('');
      var rows = [];
      B.specimens.forEach(function (sp) {
        B.tests.forEach(function (t) {
          if (!s.done[sp.id + '|' + t]) return;
          var r = resultOf(sp, t);
          rows.push('<div class="logrow ' + (t === 'light' ? '' : (r.ok ? 'good' : 'bad')) + '"><b>' + esc(sp.id) + '</b><span>' + cap(TESTS[t].name) + ': ' + r.word + (t === 'light' ? '' : (r.ok ? ' ✓' : ' ✗')) + '</span></div>');
        });
      });
      host.innerHTML = '<div class="bench"><div><div class="stage">' + stage + '</div><p class="stage-msg" aria-live="polite">' + msg + '</p>' +
        '<div class="shelf">' + shelf + '</div><p class="note-s">' + (s.sel ? 'Now choose a test to run on <b>' + esc(s.sel) + '</b>:' : 'Tap a material first, then choose a test.') + '</p>' +
        '<div class="row">' + chips + '</div></div>' +
        '<div><div class="box"><p class="box-h">Your results</p>' + (rows.length ? rows.join('') : '<p class="empty">Your results appear here as you test.</p>') + '</div></div></div>';
      if (!host._wired) {
        host._wired = true;
        host.addEventListener('click', function (e) {
          var b = e.target.closest('[data-b]'); if (!b) return;
          if (b.getAttribute('data-b') === 'spec') s.sel = b.getAttribute('data-id');
          else if (s.sel) { var t = b.getAttribute('data-t'); s.done[s.sel + '|' + t] = true; s.last = { spec: s.sel, test: t }; }
          api.refresh();
        });
      }
    }
  };

  P.Q.set(document.getElementById('qs'), P.data.questions, { bench: BENCH });
})();
