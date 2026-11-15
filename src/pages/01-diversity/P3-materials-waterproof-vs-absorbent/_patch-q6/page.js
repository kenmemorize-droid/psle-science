/* Waterproof vs absorbent: soaking bench with two graphs (mass after vs water absorbed),
   and a droplet bench (one droplet on each paper, read the droplet and the wet patch over 5 minutes).
   q.bench.kind === 'drop' selects the droplet bench; anything else is the soaking bench. */
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

  var SOAK = {
    lockMsg: 'Soak and weigh every material to unlock the options.',
    init: function () { return { done: {}, last: null, view: 'lab' }; },
    done: function (q, s) { return q.bench.materials.every(function (m) { return s.done[m.id]; }); },
    todo: function (q, s) { return q.bench.materials.filter(function (m) { return !s.done[m.id]; }).map(function (m) { return 'soak ' + m.id; }).join(', '); },
    render: function (q, s, host, api) {
      var mats = q.bench.materials, all = SOAK.done(q, s), v = s.view, stage, msg;
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

  /* ---------- droplet bench ----------
     Materials: { id, ref?, rem: [..4], patch: [..4] }
       rem   = fraction of the droplet still on top at 0, 1, 3, 5 minutes (1 = unchanged, 0 = gone)
       patch = size of the wet patch at those times (0 = none, 1 = largest)
     A material with ref:true is shown for comparison and is not needed to unlock the options. */
  var STEPS = [0, 1, 3, 5];
  function dName(m) { return m.ref ? 'Plastic sheet' : 'Paper ' + m.id; }
  function dShort(m) { return m.ref ? 'Plastic' : m.id; }
  function dById(mats, id) { return mats.filter(function (m) { return m.id === id; })[0]; }
  function dRead(m, i) {
    var r = m.rem[i], p = m.patch[i];
    var d = r >= 0.99 ? 'The droplet is unchanged' : r > 0.03 ? 'The droplet is smaller' : 'No droplet is left';
    var w = p <= 0 ? 'no wet patch' : p < 0.35 ? 'a small wet patch' : p < 0.7 ? 'a medium wet patch' : 'a large wet patch';
    var so = p <= 0 ? 'No water went into it.' : r <= 0.03 ? 'All the water went into it.' : 'Some water went into it.';
    return d + ', with ' + w + '. ' + so;
  }
  function dLabels(m, i) {
    var r = m.rem[i], p = m.patch[i], out = [];
    if (r > 0.03) out.push('water droplet');
    if (p > 0) { if (r > 0.03) out.push('wet patch'); else { out.push('wet patch with'); out.push('no water droplet'); } }
    return out;
  }
  function dScene(q, s) {
    var mats = q.bench.materials, n = mats.length, w = Math.floor(600 / n), i = STEPS.indexOf(s.t);
    var aria = !s.dropped ? 'Dry pieces of ' + mats.map(dName).join(', ') + '. No water has been dropped yet.'
      : 'After ' + s.t + ' minutes. ' + mats.map(function (m) { return dName(m) + ': ' + dRead(m, i); }).join(' ');
    var out = '<svg viewBox="0 0 600 226" role="img" aria-label="' + esc(aria) + '">';
    mats.forEach(function (m, k) {
      var x = k * w, cx = x + w / 2, cy = 106;
      out += '<g><text class="lbl" x="' + cx + '" y="24" text-anchor="middle">' + esc(dName(m)) + '</text>';
      if (m.ref) out += '<text class="lbl sm" x="' + cx + '" y="40" text-anchor="middle">for comparison</text>';
      out += '<path class="sl" d="M' + (x + 16) + ' 62 L' + (x + w - 28) + ' 54 L' + (x + w - 16) + ' 150 L' + (x + 28) + ' 158 z"/>';
      if (s.dropped) {
        var r = m.rem[i], p = m.patch[i];
        if (p > 0) out += '<ellipse class="ln fa" stroke-dasharray="5 4" cx="' + cx + '" cy="' + cy + '" rx="' + (8 + p * 34).toFixed(1) + '" ry="' + (6 + p * 26).toFixed(1) + '"/>';
        if (r > 0.03) { var rr = 4 + 11 * Math.sqrt(r); out += '<ellipse class="ln fa hot" cx="' + cx + '" cy="' + cy + '" rx="' + rr.toFixed(1) + '" ry="' + (rr * 0.78).toFixed(1) + '"/>'; }
        dLabels(m, i).forEach(function (t, j) { out += '<text class="lbl sm" x="' + cx + '" y="' + (184 + j * 15) + '" text-anchor="middle">' + esc(t) + '</text>'; });
      }
      out += '</g>';
    });
    return out + '</svg>';
  }

  var DROP = {
    init: function () { return { dropped: false, t: 0, insp: {}, log: {}, last: null }; },
    req: function (q) { return q.bench.materials.filter(function (m) { return !m.ref; }); },
    done: function (q, s) { return !!s.dropped && s.t === 5 && DROP.req(q).every(function (m) { return s.insp[m.id]; }); },
    todo: function (q, s) {
      var out = [];
      if (!s.dropped) out.push('drop the water');
      else {
        if (s.t !== 5) out.push('wait until 5 min');
        DROP.req(q).forEach(function (m) { if (!s.insp[m.id]) out.push('inspect ' + dName(m) + ' at 5 min'); });
      }
      return out.join(', ');
    },
    render: function (q, s, host, api) {
      var mats = q.bench.materials, i = STEPS.indexOf(s.t), msg;
      if (!s.dropped) msg = 'The same size of paper, the same size of droplet, the same time: only the type of paper changes. Tap the button to drop the water.';
      else if (s.last) { var lm = dById(mats, s.last); msg = '<b>' + esc(dName(lm)) + ' after ' + s.t + ' min:</b> ' + esc(dRead(lm, i)) + (s.t < 5 ? ' The question is about five minutes, so wait until 5 min.' : ''); }
      else msg = 'After ' + s.t + ' min. Tap each paper to inspect it.' + (s.t < 5 ? ' The question is about five minutes.' : '');
      var tiles = mats.map(function (m) {
        var d = !!s.insp[m.id];
        return '<button type="button" class="tile" data-b="insp" data-id="' + esc(m.id) + '" aria-pressed="' + d + '"' + (s.dropped ? '' : ' disabled') + '><b>' + esc(dName(m)) + '</b><small>' + (d ? '✓ inspected' : (m.ref ? 'optional' : 'tap to inspect')) + '</small></button>';
      }).join('');
      var controls = !s.dropped
        ? '<button type="button" class="btn primary" data-b="drop">Drop one droplet on each paper</button>'
        : STEPS.map(function (n) { return '<button type="button" class="btn" data-b="time" data-v="' + n + '" aria-pressed="' + (s.t === n) + '">' + n + ' min</button>'; }).join('') +
          '<button type="button" class="btn" data-b="reset">Start again</button>';
      var rows = mats.filter(function (m) { return s.log[m.id]; }).map(function (m) {
        return '<div class="logrow"><b>' + esc(dShort(m)) + '</b><span>' + s.log[m.id].t + ' min: ' + esc(s.log[m.id].text) + '</span></div>';
      });
      host.innerHTML = '<div class="bench"><div><div class="stage">' + dScene(q, s) + '</div><p class="stage-msg" aria-live="polite">' + msg + '</p>' +
        '<div class="shelf">' + tiles + '</div><p class="note-s">' + (DROP.done(q, s) ? 'All inspected at 5 minutes.' : 'Wait until 5 min, then inspect each paper to unlock the options.') + '</p>' +
        '<div class="row">' + controls + '</div></div>' +
        '<div><div class="box"><p class="box-h">Your readings (at 5 min)</p>' + (rows.length ? rows.join('') : '<p class="empty">Inspect a paper at 5 min and its reading appears here.</p>') + '</div>' +
        '<p class="note-s">A wet patch is the evidence that water has gone into the paper. Water sitting on top has not.</p></div></div>';
      if (!host._wired) {
        host._wired = true;
        host.addEventListener('click', function (e) {
          var b = e.target.closest('[data-b]'); if (!b || b.disabled) return;
          var a = b.getAttribute('data-b');
          if (a === 'drop') { s.dropped = true; s.t = 0; s.last = null; s.insp = {}; s.log = {}; }
          else if (a === 'time') { if (!s.dropped) return; s.t = +b.getAttribute('data-v'); }
          else if (a === 'insp') {
            if (!s.dropped) return;
            var m = dById(mats, b.getAttribute('data-id')); if (!m) return;
            s.last = m.id;
            if (s.t === 5) { s.insp[m.id] = true; s.log[m.id] = { t: 5, text: dRead(m, STEPS.indexOf(5)) }; }
          }
          else if (a === 'reset') { s.dropped = false; s.t = 0; s.last = null; s.insp = {}; s.log = {}; }
          api.refresh();
        });
      }
    }
  };

  /* One bench object for the engine; each question picks its own bench with q.bench.kind. */
  function impl(q) { return (q.bench && q.bench.kind === 'drop') ? DROP : SOAK; }
  var BENCH = {
    lockMsg: 'Finish the bench to unlock the options.',
    init: function (q) { return impl(q).init(q); },
    done: function (q, s) { return impl(q).done(q, s); },
    todo: function (q, s) { return impl(q).todo(q, s); },
    render: function (q, s, host, api) { impl(q).render(q, s, host, api); }
  };

  P.Q.set(document.getElementById('qs'), P.data.questions, { bench: BENCH });
})();
