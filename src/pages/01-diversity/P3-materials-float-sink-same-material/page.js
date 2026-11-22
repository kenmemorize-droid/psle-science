/* P3 Materials focus: same result, same material? Two-block lab, then the questions. */
(function () {
  'use strict';
  var P = window.PSLE, esc = P.esc;
  var host = document.getElementById('pairLab');

  var B = {
    glass: { name: 'glass', sink: true, light: 'most' },
    metal: { name: 'metal', sink: true, light: 'none' },
    wood:  { name: 'wood',  sink: false, light: 'none' }
  };
  var PAIRS = [
    { id: 'p1', label: 'Pair 1', a: 'glass', b: 'metal' },
    { id: 'p2', label: 'Pair 2', a: 'metal', b: 'wood' }
  ];
  var TESTS = ['float', 'light'];
  var TN = { float: 'Float test', light: 'Light test' };
  var LW = { most: 'lets most light through', none: 'lets no light through' };
  var cur = 0, done = {}, last = null;

  function res(t, k) { return t === 'float' ? (B[k].sink ? 'sinks' : 'floats') : LW[B[k].light]; }
  function key(t) { return cur + '|' + t; }

  function stage() {
    var p = PAIRS[cur], s;
    if (!last) return '<svg viewBox="0 0 520 200" role="img" aria-label="Two unknown blocks, 1 and 2, waiting to be tested">' +
      '<rect class="sl" x="140" y="70" width="90" height="60" rx="3"/><text class="lbl" x="185" y="106" text-anchor="middle">1</text>' +
      '<rect class="sl" x="290" y="70" width="90" height="60" rx="3"/><text class="lbl" x="335" y="106" text-anchor="middle">2</text>' +
      '<text class="lbl sm" x="260" y="170" text-anchor="middle">Choose a test.</text></svg>';
    if (last === 'float') {
      var ys = [p.a, p.b].map(function (k) { return B[k].sink ? 140 : 56; });
      s = '<svg viewBox="0 0 520 200" role="img" aria-label="Float test. Block 1 ' + res('float', p.a) + '. Block 2 ' + res('float', p.b) + '.">' +
        '<rect class="wtr" x="40" y="70" width="440" height="116"/><path class="ln" d="M40 14 V186 H480 V14"/><path class="ln" d="M40 70 H480"/>';
      [p.a, p.b].forEach(function (k, i) {
        var x = i ? 300 : 120;
        s += '<rect class="sl" x="' + x + '" y="' + ys[i] + '" width="90" height="44" rx="3"/><text class="lbl" x="' + (x + 45) + '" y="' + (ys[i] + 28) + '" text-anchor="middle">' + (i + 1) + '</text>';
      });
      return s + '</svg>';
    }
    s = '<svg viewBox="0 0 520 200" role="img" aria-label="Light test. Block 1 ' + res('light', p.a) + '. Block 2 ' + res('light', p.b) + '.">';
    [p.a, p.b].forEach(function (k, i) {
      var y = i ? 130 : 40;
      s += '<circle class="sl fb2" cx="50" cy="' + (y + 20) + '" r="18"/><path class="ln" d="M72 ' + (y + 20) + ' H190"/>' +
        '<rect class="sl" x="190" y="' + y + '" width="40" height="40" rx="3"/><text class="lbl" x="210" y="' + (y + 26) + '" text-anchor="middle">' + (i + 1) + '</text>' +
        (B[k].light === 'most' ? '<path class="ln" d="M230 ' + (y + 20) + ' H400"/>' : '') +
        '<path class="ln" d="M410 ' + (y - 8) + ' v56"/>';
    });
    return s + '<text class="lbl sm" x="440" y="105">screen</text></svg>';
  }

  function render() {
    var p = PAIRS[cur], n = TESTS.filter(function (t) { return done[key(t)]; });
    var anyDiff = n.some(function (t) { return res(t, p.a) !== res(t, p.b); });
    var msg = 'Nothing tested yet.';
    if (last) {
      var d = res(last, p.a) !== res(last, p.b);
      msg = '<b>' + TN[last] + ':</b> Block 1 ' + res(last, p.a) + '. Block 2 ' + res(last, p.b) + '. ' +
        (d ? '<b>≠ Different results,</b> so the blocks are made of different materials.' : '<b>= Same result,</b> so you still cannot tell. Try the other test.');
    }
    var pairs = PAIRS.map(function (q, i) {
      return '<button type="button" class="tile" data-pair="' + i + '" aria-pressed="' + (i === cur) + '"><b>' + q.label + '</b><small>Blocks 1 and 2</small></button>';
    }).join('');
    var btns = TESTS.map(function (t) { return '<button type="button" class="btn" data-t="' + t + '">' + (done[key(t)] ? '↻ ' : '') + TN[t] + '</button>'; }).join('');
    var rows = n.map(function (t) {
      var d = res(t, p.a) !== res(t, p.b);
      return '<div class="logrow ' + (d ? 'diff' : 'same') + '"><b>' + TN[t] + '</b><span>1 ' + res(t, p.a) + '; 2 ' + res(t, p.b) + (d ? ' → ≠ different' : ' → = same') + '</span></div>';
    }).join('');
    var verdict = '';
    if (n.length) verdict = anyDiff
      ? '<p class="verd ok" aria-live="polite">✔ Proven: Blocks 1 and 2 are made of different materials.</p>'
      : '<p class="verd maybe" aria-live="polite">? Not proven. Every result so far matches, which does not show the blocks are the same material.</p>';
    var reveal = n.length === TESTS.length ? '<p class="note-s">Revealed: Block 1 is <b>' + B[p.a].name + '</b> and Block 2 is <b>' + B[p.b].name + '</b>.' +
      (anyDiff ? '' : '') + '</p>' : '';
    host.innerHTML = '<div class="cmp"><div><div class="stage">' + stage() + '</div><p class="stage-msg" aria-live="polite">' + msg + '</p>' +
      '<div class="shelf pairrow">' + pairs + '</div><p class="note-s instr">Choose a pair, then run each test.</p><div class="row">' + btns + '</div></div>' +
      '<div><div class="box"><p class="box-h">Your results</p>' + (rows || '<p class="empty">Your results appear here as you test.</p>') + '</div>' + verdict + reveal + '</div></div>';
  }

  host.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pair],[data-t]'); if (!b) return;
    if (b.hasAttribute('data-pair')) { cur = +b.getAttribute('data-pair'); last = null; }
    else { last = b.getAttribute('data-t'); done[key(last)] = true; }
    render();
  });
  render();

  P.Q.set(document.getElementById('qs'), P.data.questions, {});
})();
