/* Magnet or not? Pair-testing bench. Each question has its own objects and observations. */
(function () {
  'use strict';
  var P = window.PSLE, esc = P.esc;
  var TYPE = { 'Magnet': 'magnet', 'Steel block': 'mat', 'Iron block': 'mat', 'Plastic block': 'non', 'Wooden block': 'non' };
  var OBS = { attract: 'attract', repel: 'repel', none: 'no force' };
  var SYMBOL = { attract: '→ ←', repel: '← →', none: '| |' };
  var RES = { attract: 'attract (pull)', repel: 'repel (push)', none: 'no force' };
  var W = 84, GMAX = 120, GMIN = 4;

  function possible(a, b) {
    var s = [a, b].sort().join('+');
    if (s === 'magnet+magnet') return ['attract', 'repel'];
    if (s === 'magnet+mat') return ['attract'];
    return ['none'];
  }
  function idx(q, id) { return q.bench.objects.map(function (o) { return o.id; }).indexOf(id); }
  function pairKey(q, a, b) { return idx(q, a) < idx(q, b) ? a + '-' + b : b + '-' + a; }
  function art(n) { return (/^[AEIOU]/.test(n) ? 'an ' : 'a ') + n.toLowerCase(); }
  function clashList(q, i) {
    var names = q.options[i].text, out = [];
    Object.keys(q.bench.pairs).forEach(function (key) {
      var obs = q.bench.pairs[key], ab = key.split('-');
      var na = names[idx(q, ab[0])], nb = names[idx(q, ab[1])], poss = possible(TYPE[na], TYPE[nb]);
      if (poss.indexOf(obs) < 0) out.push({ key: key, obs: obs, na: na, nb: nb, poss: poss });
    });
    return out;
  }
  function clashText(c) {
    var rule = c.poss.length === 2 ? 'always attract or repel' : (c.poss[0] === 'attract' ? 'can only attract' : 'show no force');
    return c.key.replace('-', '–') + ': you saw ' + OBS[c.obs] + ', but ' + art(c.na) + ' and ' + art(c.nb) + ' ' + rule + '.';
  }
  function arrowSVG(dir) {
    return '<svg class="arrow" viewBox="0 0 72 18" width="72" height="18" aria-hidden="true" style="transform:scaleX(' + dir + ')"><line x1="3" y1="9" x2="58" y2="9"/><polygon points="57,2 71,9 57,16"/></svg>';
  }
  function allTested(q, s) { return Object.keys(q.bench.pairs).every(function (k) { return s.tested[k]; }); }

  var BENCH = {
    lockMsg: 'Test every pair on the bench to unlock the options.',
    init: function () { return { tested: {}, selected: [], last: null, anim: false, lastWrong: null, solved: false }; },
    done: allTested,
    todo: function (q, s) { return Object.keys(q.bench.pairs).filter(function (k) { return !s.tested[k]; }).map(function (k) { return k.replace('-', ' + '); }).join(', '); },
    onWrong: function (q, s, i) { s.lastWrong = i; },
    clashes: function (q, s, i) { return clashList(q, i).map(clashText); },
    render: function (q, s, host, api) {
      var B = q.bench, t = s.last;
      var clashKeys = (s.lastWrong != null && !s.solved) ? clashList(q, s.lastWrong).map(function (c) { return c.key; }) : [];
      var stage, msg = '', mcls = '';
      if (!t) stage = '<p class="mstage-hint">Nothing on the bench yet.</p>';
      else {
        var res = t.result, dirL = res === 'attract' ? 1 : -1, arrows = res !== 'none';
        var mk = function (id, side, dir) { return '<div class="slot ' + side + '">' + (arrows ? arrowSVG(dir) : '') + '<div class="obj p' + idx(q, id) + '"><span>' + esc(id) + '</span></div></div>'; };
        stage = '<div class="pair ' + res + '">' + mk(t.order[0], 'l', dirL) + mk(t.order[1], 'r', -dirL) + '</div>';
        mcls = res;
        msg = res === 'attract' ? t.order[0] + ' and ' + t.order[1] + ' attract: they pull towards each other.'
          : res === 'repel' ? t.order[0] + ' and ' + t.order[1] + ' repel: they push away from each other.'
          : t.order[0] + ' and ' + t.order[1] + ' show no force: nothing pulls or pushes.';
      }
      var tiles = B.objects.map(function (o, i) {
        var sel = s.selected.indexOf(o.id) >= 0;
        return '<button type="button" class="mtile' + (s.solved ? ' revealed' : '') + '" data-b="obj" data-id="' + esc(o.id) + '" aria-pressed="' + sel + '" aria-label="Object ' + esc(o.id) + (s.solved ? ', ' + esc(o.truth) : '') + '">' +
          '<div class="obj p' + i + '"><span>' + esc(o.id) + '</span></div><small>' + (s.solved ? esc(o.truth) : 'unknown') + '</small></button>';
      }).join('');
      var chips = Object.keys(B.pairs).map(function (k) {
        return '<button type="button" class="btn small" data-b="pair" data-key="' + k + '">' + (s.tested[k] ? '✓ ' : '') + k.replace('-', ' + ') + '</button>';
      }).join('');
      var rows = Object.keys(B.pairs).map(function (k) {
        var ab = k.split('-'), res = B.pairs[k];
        return '<tr class="' + (clashKeys.indexOf(k) >= 0 ? 'clash' : '') + '"><th scope="row">' + esc(ab[0]) + ' and ' + esc(ab[1]) + '</th><td>' +
          (s.tested[k] ? '<span class="mbadge ' + res + '">' + SYMBOL[res] + ' ' + RES[res] + '</span>' : '<span class="untested">not tested</span>') + '</td></tr>';
      }).join('');
      var n = Object.keys(B.pairs).filter(function (k) { return s.tested[k]; }).length;
      host.innerHTML = '<div class="bench"><div><div class="mstage">' + stage + '</div><p class="mmsg ' + mcls + '" aria-live="polite">' + esc(msg) + '</p>' +
        '<div class="shelf">' + tiles + '</div><p class="note-s">' + (s.selected.length === 1 ? 'Now tap a second object to place it beside ' + esc(s.selected[0]) + '.' : 'Tap two objects to place them beside each other, or use a shortcut:') + '</p>' +
        '<div class="row">' + chips + '</div></div>' +
        '<div><div class="box"><p class="box-h">Observation log</p><table class="mlog"><thead><tr><th scope="col">Pair</th><th scope="col">What you saw</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="note-s">' + n + ' of ' + Object.keys(B.pairs).length + ' pairs tested' + (clashKeys.length ? '. Red rows are the results your last choice breaks.' : '') + '</p></div></div></div>';
      if (t) {
        var pair = host.querySelector('.pair'), l = pair.querySelector('.l'), r = pair.querySelector('.r');
        var startG = t.result === 'attract' ? GMAX : (t.result === 'repel' ? GMIN : 60);
        var endG = t.result === 'attract' ? GMIN : (t.result === 'repel' ? GMAX : 60);
        var place = function (g) { l.style.transform = 'translateX(' + (-(W + g / 2)) + 'px)'; r.style.transform = 'translateX(' + (g / 2) + 'px)'; };
        if (s.anim && !P.reduced) {
          l.style.transition = r.style.transition = 'none'; place(startG); void pair.offsetWidth;
          l.style.transition = r.style.transition = '';
          requestAnimationFrame(function () { place(endG); pair.classList.add('on'); });
        } else { l.style.transition = r.style.transition = 'none'; place(endG); pair.classList.add('on'); }
        s.anim = false;
      }
      if (!host._wired) {
        host._wired = true;
        host.addEventListener('click', function (e) {
          var b = e.target.closest('[data-b]'); if (!b) return;
          var kind = b.getAttribute('data-b');
          function test(a, c) { var k = pairKey(q, a, c); s.tested[k] = true; s.last = { order: [a, c], result: q.bench.pairs[k], key: k }; s.anim = true; }
          if (kind === 'pair') { var ab = b.getAttribute('data-key').split('-'); s.selected = []; test(ab[0], ab[1]); }
          else {
            var id = b.getAttribute('data-id');
            if (s.selected.indexOf(id) >= 0) s.selected = s.selected.filter(function (x) { return x !== id; });
            else { s.selected.push(id); if (s.selected.length === 2) { var pr = s.selected; s.selected = []; test(pr[0], pr[1]); } }
          }
          api.refresh();
        });
      }
    }
  };

  P.Q.set(document.getElementById('qs'), P.data.questions, { bench: BENCH });
})();
