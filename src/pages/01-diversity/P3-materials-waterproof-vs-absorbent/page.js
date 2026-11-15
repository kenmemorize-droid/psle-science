/* Waterproof vs absorbent: soaking bench with two graphs (mass after vs water absorbed). */
(function () {
  'use strict';
  var P = window.PSLE, esc = P.esc;
  function gain(m) { return m.after - m.before; }

  function beakers(mats, s) {
    var n = mats.length, w = Math.floor(500 / n), inner = w - 22;
    return '<svg viewBox="0 0 520 196" role="img" aria-label="Containers of water holding each material.">' + mats.map(function (m, i) {
      var x = 12 + i * w, soaked = !!s.done[m.id], wet = soaked && gain(m) > 0;
      return '<g><path class="ln" d="M' + x + ' 34 v128 h' + inner + ' v-128"/>' +
        '<path class="ln fa" d="M' + (x + 4) + ' 70 h' + (inner - 8) + ' v88 h-' + (inner - 8) + ' z"/>' +
        '<rect class="sl' + (wet ? ' fa' : '') + '" x="' + (x + inner / 2 - 24) + '" y="98" width="48" height="52" rx="3"/>' +
        '<text class="lbl" x="' + (x + inner / 2) + '" y="130" text-anchor="middle">' + esc(m.id) + '</text>' +
        '<text class="lbl sm" x="' + (x + inner / 2) + '" y="182" text-anchor="middle">' + (soaked ? m.before + ' → ' + m.after + ' g' : m.before + ' g, not soaked') + '</text></g>';
    }).join('') + '</svg>';
  }
  function chart(mats, kind) {
    var n = mats.length, w = Math.floor(460 / n);
    var vals = mats.map(function (m) { return kind === 'after' ? m.after : gain(m); });
    var top = Math.max.apply(null, vals), max = top * 1.18 || 1, best = vals.indexOf(top);
    return '<svg viewBox="0 0 520 210" role="img" aria-label="Bar chart of ' + (kind === 'after' ? 'mass after soaking' : 'water absorbed') + '.">' +
      '<text class="lbl" x="260" y="16" text-anchor="middle">' + (kind === 'after' ? 'Mass after soaking (g)' : 'Water absorbed = after − before (g)') + '</text>' +
      '<line class="ln" x1="56" y1="176" x2="508" y2="176"/><line class="ln" x1="56" y1="26" x2="56" y2="176"/>' +
      mats.map(function (m, i) {
        var v = vals[i], h = Math.round(v / max * 142), x = 60 + i * w + 8, bw = w - 28;
        return '<rect class="bar' + (i === best ? ' hi' : '') + '" x="' + x + '" y="' + (176 - h) + '" width="' + bw + '" height="' + h + '"/>' +
          '<text class="lbl" x="' + (x + bw / 2) + '" y="' + (176 - h - 7) + '" text-anchor="middle">' + v + ' g</text>' +
          '<text class="lbl" x="' + (x + bw / 2) + '" y="196" text-anchor="middle">' + esc(m.id) + '</text>';
      }).join('') + '</svg>';
  }

  var BENCH = {
    lockMsg: 'Soak and weigh every material to unlock the options.',
    init: function () { return { done: {}, last: null, view: 'lab' }; },
    done: function (q, s) { return q.bench.materials.every(function (m) { return s.done[m.id]; }); },
    todo: function (q, s) { return q.bench.materials.filter(function (m) { return !s.done[m.id]; }).map(function (m) { return 'soak ' + m.id; }).join(', '); },
    render: function (q, s, host, api) {
      var mats = q.bench.materials, all = BENCH.done(q, s), v = s.view, stage, msg;
      if (v === 'after') { stage = chart(mats, 'after'); msg = 'This graph answers "which is heaviest now?". Part of every bar is just the material itself.'; }
      else if (v === 'gain') { stage = chart(mats, 'gain'); msg = 'This graph answers "which absorbed the most water?". That is the one that decides a towel or raincoat question.'; }
      else {
        stage = beakers(mats, s);
        if (!s.last) msg = 'Each piece is the same size, in the same amount of water, for the same 10 minutes. Tap a material to soak it and weigh it again.';
        else { var m = s.last, g = gain(m); msg = '<b>' + esc(m.id) + ':</b> ' + m.before + ' g before, ' + m.after + ' g after. ' + m.after + ' − ' + m.before + ' = <b>' + g + ' g</b> of water absorbed' + (g === 0 ? ', so ' + esc(m.id) + ' is <b>waterproof</b>.' : '.'); }
      }
      var tiles = mats.map(function (m) {
        var d = !!s.done[m.id];
        return '<button type="button" class="tile" data-b="soak" data-id="' + esc(m.id) + '" aria-pressed="' + d + '"><b>' + esc(m.id) + '</b><span>' + m.before + ' g</span><small>' + (d ? m.after + ' g after' : 'tap to soak') + '</small></button>';
      }).join('');
      var chips = all ? [['lab', 'Back to the containers'], ['after', 'Graph: mass after soaking'], ['gain', 'Graph: water absorbed']].map(function (c) {
        return '<button type="button" class="btn" data-b="view" data-v="' + c[0] + '" aria-pressed="' + (v === c[0]) + '">' + c[1] + '</button>';
      }).join('') : '';
      var rows = mats.filter(function (m) { return s.done[m.id]; }).map(function (m) {
        var g = gain(m);
        return '<div class="logrow ' + (g === 0 ? 'bad' : 'good') + '"><b>' + esc(m.id) + '</b><span>' + m.before + ' g → ' + m.after + ' g, absorbed <b>' + g + ' g</b>' + (g === 0 ? ' (waterproof)' : '') + '</span></div>';
      });
      host.innerHTML = '<div class="bench"><div><div class="stage">' + stage + '</div><p class="stage-msg" aria-live="polite">' + msg + '</p>' +
        '<div class="shelf">' + tiles + '</div><p class="note-s">' + (all ? 'All weighed. Compare them two ways:' : 'Soak and weigh every material to unlock the options.') + '</p>' +
        '<div class="row">' + chips + '</div></div>' +
        '<div><div class="box"><p class="box-h">Your readings</p>' + (rows.length ? rows.join('') : '<p class="empty">Soak a material and its reading appears here.</p>') + '</div></div></div>';
      if (!host._wired) {
        host._wired = true;
        host.addEventListener('click', function (e) {
          var b = e.target.closest('[data-b]'); if (!b) return;
          if (b.getAttribute('data-b') === 'soak') {
            var m = mats.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0];
            s.done[m.id] = true; s.last = m; s.view = 'lab';
          } else s.view = b.getAttribute('data-v');
          api.refresh();
        });
      }
    }
  };

  P.Q.set(document.getElementById('qs'), P.data.questions, { bench: BENCH });
})();
