/* P3 Magnets focus: which statements are true? Poles lab, make-a-magnet lab, drop lab (beyond syllabus), then the questions. */
(function () {
  'use strict';
  var P = window.PSLE; if (!P) return;
  function $(id) { return document.getElementById(id); }
  var reduced = P.reduced;

  /* ---------- statement A: poles ---------- */
  (function () {
    var host = $('polesLab'); if (!host) return;
    var like = false, moved = false;
    function mag(x, leftPole) {
      var rightPole = leftPole === 'N' ? 'S' : 'N';
      return '<rect class="p' + leftPole + '" x="' + x + '" y="70" width="60" height="40"/><text class="pt" x="' + (x + 30) + '" y="96" text-anchor="middle">' + leftPole + '</text>' +
        '<rect class="p' + rightPole + '" x="' + (x + 60) + '" y="70" width="60" height="40"/><text class="pt" x="' + (x + 90) + '" y="96" text-anchor="middle">' + rightPole + '</text>';
    }
    function draw(anim) {
      var dx = like ? 60 : -52;
      var arrows = like
        ? '<path class="ln" d="M185 40 H165 M171 34 L163 40 L171 46"/><path class="ln" d="M235 40 H255 M249 34 L257 40 L249 46"/><text x="210" y="30" text-anchor="middle">push apart</text>'
        : '<path class="ln" d="M165 40 H185 M179 34 L187 40 L179 46"/><path class="ln" d="M255 40 H235 M241 34 L233 40 L241 46"/><text x="210" y="30" text-anchor="middle">pull together</text>';
      var out = like ? 'The N pole of the right magnet faces the N pole of the left magnet. Two N poles are like poles. Like poles repel.'
                     : 'The S pole of the right magnet faces the N pole of the left magnet. N and S are unlike poles. Unlike poles attract.';
      var seg = '<h3>Which end of the right-hand magnet faces the left-hand magnet?</h3><div class="seg" role="group" aria-label="Pole facing the left magnet">' +
        '<button type="button" data-p="unlike" aria-pressed="' + (moved && !like) + '">Its S pole</button><button type="button" data-p="like" aria-pressed="' + (moved && like) + '">Its N pole</button></div>';
      host.innerHTML = '<div class="mlab"><div>' +
        '<svg viewBox="0 0 420 150" role="img" aria-label="Two bar magnets. ' + (moved ? (like ? 'Two N poles face each other and the magnets move apart.' : 'An N pole faces an S pole and the magnets move together.') : 'The magnets have not moved yet.') + '">' +
        mag(20, 'S') + '<g class="mv" id="rm" transform="translate(' + (moved ? dx : 0) + ',0)">' + mag(200, like ? 'N' : 'S') + '</g>' + (moved ? arrows : '') +
        '</svg></div>' +
        '<div class="panel">' + seg + '<div class="mout ' + (moved ? (like ? 'no' : 'ok') : '') + '" aria-live="polite">' + (moved ? (like ? '✖ Repel. ' : '✔ Attract. ') + out : 'Choose which pole faces the left-hand magnet.') + '</div>' +
        (moved && !like ? '<p class="verdict ok">✔ Statement A is true: unlike poles of two magnets attract each other.</p>' : '') + '</div></div>';
      if (moved && anim && !reduced) { var g = $('rm'); g.setAttribute('transform', 'translate(0,0)'); void g.getBoundingClientRect(); requestAnimationFrame(function () { g.setAttribute('transform', 'translate(' + dx + ',0)'); }); }
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-p]'); if (!b) return;
      like = b.getAttribute('data-p') === 'like'; moved = true; draw(true);
      var n = host.querySelector('[data-p="' + (like ? 'like' : 'unlike') + '"]'); if (n) n.focus();
    });
    draw(false);
  })();

  /* ---------- statement C: make a magnet ---------- */
  (function () {
    var host = $('makeLab'); if (!host) return;
    var OBJ = [
      { n: 'Iron nail', metal: true, ok: true }, { n: 'Steel needle', metal: true, ok: true },
      { n: 'Aluminium foil strip', metal: true, ok: false }, { n: 'Copper wire', metal: true, ok: false },
      { n: 'Plastic ruler', metal: false, ok: false }, { n: 'Wooden stick', metal: false, ok: false }
    ];
    var METH = ['Stroke with a magnet', 'Electrical method'];
    var obj = 0, meth = 0, res = null, tried = {};
    function clips(n) {
      var s = '', i;
      for (i = 0; i < n; i++) s += '<rect class="ln" x="' + (110 + (i % 4) * 22) + '" y="' + (112 + Math.floor(i / 4) * 16) + '" width="14" height="22" rx="7" style="fill:var(--card)"/>';
      return s;
    }
    function scene() {
      var o = OBJ[obj], s = '<rect class="ln" x="90" y="76" width="140" height="28" rx="4" style="fill:var(--sunk)"/><text x="160" y="95" text-anchor="middle">' + P.esc(o.n) + '</text>';
      if (meth === 1) {
        s += '<path class="ln" d="M96 76 C104 62 112 90 120 76 C128 62 136 90 144 76 C152 62 160 90 168 76 C176 62 184 90 192 76 C200 62 208 90 216 76 C224 62 232 90 230 76"/>' +
          '<path class="ln" d="M96 76 V44 H70 M230 76 V44 H256"/><rect class="ln" x="256" y="30" width="30" height="28" style="fill:var(--card)"/><text x="271" y="49" text-anchor="middle">+ −</text><text x="271" y="22" text-anchor="middle">battery</text>';
      } else {
        s += '<rect class="pS" x="40" y="32" width="40" height="22"/><text class="pt" x="60" y="48" text-anchor="middle">S</text><rect class="pN" x="80" y="32" width="40" height="22"/><text class="pt" x="100" y="48" text-anchor="middle">N</text>' +
          '<path class="ln" d="M140 40 H230 M222 34 L230 40 L222 46"/><text x="185" y="30" text-anchor="middle">stroke</text>';
      }
      if (res !== null && res.ok) s += clips(4);
      return '<svg viewBox="0 0 320 170" role="img" aria-label="' + P.esc(o.n) + ' with the ' + METH[meth].toLowerCase() + (res ? (res.ok ? '; it picks up paper clips' : '; it picks up no paper clips') : '') + '">' + s + '</svg>';
    }
    function verdict() {
      var failM = OBJ.filter(function (o, i) { return o.metal && !o.ok && tried[i]; });
      var any = Object.keys(tried).length;
      if (failM.length) return '<p class="verdict ok">✔ Statement C is false. ' + P.esc(failM[0].n) + ' is a metal, but it could not be made into a magnet. Only iron and steel can be made into magnets.</p>';
      if (any) return '<p class="verdict">So far every metal you tried has worked. Now try aluminium and copper.</p>';
      return '';
    }
    function draw() {
      var ob = OBJ.map(function (o, i) { return '<button type="button" data-o="' + i + '" aria-pressed="' + (obj === i) + '">' + o.n + '</button>'; }).join('');
      var mb = METH.map(function (m, i) { return '<button type="button" data-m="' + i + '" aria-pressed="' + (meth === i) + '">' + m + '</button>'; }).join('');
      var list = OBJ.map(function (o, i) { return tried[i] ? '<li>' + (o.ok ? '✔' : '✖') + ' ' + P.esc(o.n) + (o.metal ? ' (a metal)' : ' (not a metal)') + ': ' + (o.ok ? 'made into a magnet' : 'not made into a magnet') + '</li>' : ''; }).join('');
      host.innerHTML = '<div class="mlab"><div>' + scene() + '<p class="mout ' + (res ? (res.ok ? 'ok' : 'no') : '') + '" aria-live="polite">' +
        (res ? (res.ok ? '✔ Paper clips picked up: 4. The ' + P.esc(OBJ[obj].n.toLowerCase()) + ' is now a magnet.' : '✖ Paper clips picked up: 0. The ' + P.esc(OBJ[obj].n.toLowerCase()) + ' was not made into a magnet.') : 'Nothing tested yet.') + '</p></div>' +
        '<div class="panel"><h3>Object</h3><div class="seg" role="group" aria-label="Object">' + ob + '</div><h3>Method</h3><div class="seg" role="group" aria-label="Method">' + mb + '</div>' +
        '<div class="actions"><button type="button" class="btn primary" data-go="1">Make it, then test it</button></div>' +
        (list ? '<ul class="tried">' + list + '</ul>' : '') + verdict() + '</div></div>';
    }
    host.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-o]'))) { obj = +b.getAttribute('data-o'); res = null; draw(); var n = host.querySelector('[data-o="' + obj + '"]'); if (n) n.focus(); return; }
      if ((b = e.target.closest('[data-m]'))) { meth = +b.getAttribute('data-m'); res = null; draw(); n = host.querySelector('[data-m="' + meth + '"]'); if (n) n.focus(); return; }
      if (e.target.closest('[data-go]')) { res = { ok: OBJ[obj].ok }; tried[obj] = true; draw(); n = host.querySelector('[data-go]'); if (n) n.focus(); }
    });
    draw();
  })();

  /* ---------- statement D (beyond syllabus): drop the magnet ---------- */
  (function () {
    var host = $('dropLab'); if (!host) return;
    var CLIPS = [8, 7, 6, 5, 4, 4, 3, 3, 3], drops = 0;
    function draw() {
      var n = CLIPS[Math.min(drops, CLIPS.length - 1)], s = '', i;
      for (i = 0; i < n; i++) s += '<rect class="ln" x="' + (60 + (i % 4) * 22) + '" y="' + (88 + Math.floor(i / 4) * 16) + '" width="14" height="22" rx="7" style="fill:var(--card)"/>';
      host.innerHTML = '<div class="mlab"><div><svg viewBox="0 0 240 150" role="img" aria-label="A bar magnet holding ' + n + ' paper clips"><rect class="pS" x="40" y="40" width="70" height="40"/><text class="pt" x="75" y="66" text-anchor="middle">S</text><rect class="pN" x="110" y="40" width="70" height="40"/><text class="pt" x="145" y="66" text-anchor="middle">N</text>' + s + '</svg></div>' +
        '<div class="panel"><div class="actions"><button type="button" class="btn primary" data-d="drop">Drop the magnet</button><button type="button" class="btn" data-d="reset">Start again</button></div>' +
        '<p class="mout" aria-live="polite">Times dropped: ' + drops + '. Paper clips held: ' + n + '.</p>' +
        (drops >= 5 ? '<p class="verdict ok">✔ Statement D is true: dropping a magnet many times can cause it to lose some of its magnetism.</p>' : '') + '</div></div>';
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-d]'); if (!b) return;
      var k = b.getAttribute('data-d'); if (k === 'drop') drops = Math.min(drops + 1, 12); else drops = 0;
      draw(); var nb = host.querySelector('[data-d="' + k + '"]'); if (nb) nb.focus();
    });
    draw();
  })();

  P.Q.set($('qs'), P.data.questions, {});
})();
