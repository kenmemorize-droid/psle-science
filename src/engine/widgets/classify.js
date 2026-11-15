/* =====================================================================
   PSLE Science widget: classify (sort cards into groups)
   PSLE.widgets.classify(el, {
     bins:  [{id, label}],
     items: [{id, label, bin, why}],   // why: shown after each placement
     prompt, done(rightFirstTime, total)
   })
   Tap a card, then tap a group (touch-first). Mouse users can also drag.
   Practice only: nothing is written to the attempt log.
   ===================================================================== */
(function () {
  'use strict';
  var P = window.PSLE; if (!P) return;
  var esc = P.esc;

  function classify(el, cfg) {
    var st, order;
    function reset() { st = { placed: {}, sel: null, tries: {}, msg: '', ok: null }; order = P.shuffle(cfg.items); }
    function item(id) { return order.filter(function (x) { return x.id === id; })[0]; }
    function score() { return order.filter(function (it) { return !st.tries[it.id]; }).length; }

    function paint() {
      var left = order.filter(function (it) { return !st.placed[it.id]; });
      el.innerHTML = '<div class="cls">' +
        '<p class="note-s">' + esc(cfg.prompt || 'Tap a card, then tap the group it belongs in.') + '</p>' +
        '<div class="cls-cards" role="group" aria-label="Cards to sort">' +
        (left.length ? left.map(function (it) {
          return '<button type="button" class="cls-card" draggable="true" data-id="' + esc(it.id) + '" aria-pressed="' + (st.sel === it.id) + '">' + esc(it.label) + '</button>';
        }).join('') : '<p class="empty">All sorted.</p>') + '</div>' +
        '<p class="cls-msg' + (st.ok === true ? ' ok' : st.ok === false ? ' no' : '') + '" aria-live="polite">' + st.msg + '</p>' +
        '<div class="cls-bins">' + cfg.bins.map(function (b) {
          var inBin = order.filter(function (it) { return st.placed[it.id] === b.id; });
          return '<div class="cls-bin" data-bin="' + esc(b.id) + '"><button type="button" class="btn cls-drop" data-bin="' + esc(b.id) + '"' + (st.sel ? '' : ' disabled') + '>' +
            (st.sel ? 'Put it in: ' : '') + esc(b.label) + '</button>' +
            '<ul>' + inBin.map(function (it) { return '<li>✓ ' + esc(it.label) + '</li>'; }).join('') + '</ul></div>';
        }).join('') + '</div>' +
        (left.length ? '' : '<p class="cls-score"><b>' + score() + ' of ' + order.length + '</b> placed right first time.</p>' +
          '<div class="actions"><button type="button" class="btn small" data-cls="again">Sort again</button></div>') +
        '</div>';
    }
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    function place(id, bin) {
      var it = item(id); if (!it || st.placed[id]) return;
      if (it.bin === bin) { st.placed[id] = bin; st.ok = true; st.msg = '✓ <b>' + esc(cap(it.label)) + ':</b> ' + it.why; }
      else { st.tries[id] = (st.tries[id] || 0) + 1; st.ok = false; st.msg = '✗ <b>Not there. ' + esc(cap(it.label)) + ':</b> ' + it.why; }
      st.sel = null;
      paint();
      if (order.every(function (x) { return st.placed[x.id]; }) && cfg.done) cfg.done(score(), order.length);
    }

    el.addEventListener('click', function (e) {
      var c = e.target.closest('.cls-card');
      if (c) { st.sel = st.sel === c.getAttribute('data-id') ? null : c.getAttribute('data-id'); st.msg = ''; st.ok = null; paint(); return; }
      var b = e.target.closest('.cls-drop');
      if (b && st.sel) { place(st.sel, b.getAttribute('data-bin')); return; }
      if (e.target.closest('[data-cls="again"]')) { reset(); paint(); }
    });
    el.addEventListener('dragstart', function (e) {
      var c = e.target.closest('.cls-card');
      if (c && e.dataTransfer) e.dataTransfer.setData('text/plain', c.getAttribute('data-id'));
    });
    el.addEventListener('dragover', function (e) { if (e.target.closest('.cls-bin')) e.preventDefault(); });
    el.addEventListener('drop', function (e) {
      var b = e.target.closest('.cls-bin'); if (!b || !e.dataTransfer) return;
      e.preventDefault(); place(e.dataTransfer.getData('text/plain'), b.getAttribute('data-bin'));
    });
    reset(); paint();
  }

  P.widgets = P.widgets || {};
  P.widgets.classify = classify;
})();
