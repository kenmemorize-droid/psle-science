/* Match a part to its properties: inspect parts, try materials against them. */
(function () {
  'use strict';
  var P = window.PSLE, esc = P.esc;

  function part(q, id) { return q.bench.parts.filter(function (p) { return p.id === id; })[0]; }
  function missing(q, p, m) { var has = q.bench.table.has[m] || []; return p.needs.filter(function (n) { return has.indexOf(n) < 0; }); }

  var BENCH = {
    lockMsg: 'Inspect every part of the object to unlock the options.',
    init: function () { return { seen: {}, sel: null, mat: null }; },
    done: function (q, s) { return q.bench.parts.every(function (p) { return s.seen[p.id]; }); },
    todo: function (q, s) { return q.bench.parts.filter(function (p) { return !s.seen[p.id]; }).map(function (p) { return 'inspect part ' + p.id; }).join(', '); },
    clashes: function (q, s, i) {
      var o = q.options[i], out = [];
      q.bench.parts.forEach(function (p, k) {
        var m = o.text[k], miss = missing(q, p, m);
        if (miss.length) out.push('Part ' + p.id + ' (the ' + p.label + ') needs to be ' + p.needs.join(', ') + ', but ' + m + ' is not ' + miss.join(' and not ') + '.');
      });
      return out;
    },
    render: function (q, s, host, api) {
      var msg;
      if (!s.sel) msg = 'Tap a part below to find out what it has to do. Do that before you look at the materials.';
      else {
        var p = part(q, s.sel);
        msg = '<b>Part ' + esc(p.id) + ', the ' + esc(p.label) + '.</b> ' + p.job + ' It needs to be <b>' + p.needs.join(', ') + '</b>.';
        if (s.mat) {
          var miss = missing(q, p, s.mat);
          msg += '<span class="needrow ' + (miss.length ? 'fail' : 'met') + '"><b>' + (miss.length ? '✗ ' : '✓ ') + esc(s.mat) + '</b><span>' +
            (miss.length ? 'is not ' + miss.join(' and not ') + ', so it fails this part.' : 'has every property this part needs.') + '</span></span>';
        }
      }
      var tiles = q.bench.parts.map(function (p) {
        return '<button type="button" class="tile" data-b="part" data-id="' + esc(p.id) + '" aria-pressed="' + (s.sel === p.id) + '"><b>Part ' + esc(p.id) + '</b><span>' + esc(p.label) + '</span><small>' + (s.seen[p.id] ? '✓ inspected' : 'not inspected') + '</small></button>';
      }).join('');
      var chips = s.sel ? q.bench.table.mats.map(function (m) {
        return '<button type="button" class="btn" data-b="mat" data-m="' + esc(m) + '" aria-pressed="' + (s.mat === m) + '">Try ' + esc(m) + ' for part ' + esc(s.sel) + '</button>';
      }).join('') : '';
      var log = q.bench.parts.filter(function (p) { return s.seen[p.id]; }).map(function (p) {
        return '<div class="logrow"><b>Part ' + esc(p.id) + '</b><span>the ' + esc(p.label) + ' needs: ' + p.needs.join(', ') + '</span></div>';
      });
      host.innerHTML = '<div class="bench"><div><div class="stage">' + q.figure + '</div><p class="stage-msg" aria-live="polite">' + msg + '</p>' +
        '<div class="shelf">' + tiles + '</div>' +
        '<p class="note-s">' + (s.sel ? 'Optional: try a material against part ' + esc(s.sel) + '.' : 'Inspect every part before the options unlock.') + '</p>' +
        '<div class="row">' + chips + '</div></div>' +
        '<div><div class="box"><p class="box-h">What each part must do</p>' + (log.length ? log.join('') : '<p class="empty">Inspect a part and its job list appears here.</p>') + '</div></div></div>';
      P.$$('[data-part]', host).forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-part') === s.sel); });
      if (!host._wired) {
        host._wired = true;
        host.addEventListener('click', function (e) {
          var b = e.target.closest('[data-b]');
          var hit = b ? null : e.target.closest('[data-part]');
          if (!b && !hit) return;
          if (hit || b.getAttribute('data-b') === 'part') { var id = hit ? hit.getAttribute('data-part') : b.getAttribute('data-id'); s.sel = id; s.seen[id] = true; s.mat = null; }
          else s.mat = b.getAttribute('data-m');
          api.refresh();
        });
      }
    }
  };

  P.Q.set(document.getElementById('qs'), P.data.questions, { bench: BENCH });
})();
