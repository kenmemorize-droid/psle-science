/* Air in a bottle with a balloon: particle model (canvas), then questions. */
(function () {
  'use strict';
  var P = window.PSLE;

  /* ---------- geometry ---------- */
  var W = 520, H = 650, CX = 260, MOUTH = 46, NB = 140, TOP = NB + 2, BOTTOM = 598;
  var NECK_HW = 20, TUBE_HW = 15, BODY_HW = 130, SH_END = 220, RC = 44, PR = 4.2, R = 1.45, HOLE = 13;
  var BOTTLE_ML = 500, N_TRAP0 = 170, V0 = 88, BLOW_RATE = 16, EL = 0.18, PMAXF = 1.24;

  function hw(y) {
    if (y <= NB) return NECK_HW;
    if (y < SH_END) { var u = (y - NB) / (SH_END - NB); return NECK_HW + (BODY_HW - NECK_HW) * (1 - (1 - u) * (1 - u)); }
    var c0 = BOTTOM - RC; if (y <= c0) return BODY_HW;
    var dy = Math.min(y - c0, RC); return (BODY_HW - RC) + Math.sqrt(RC * RC - dy * dy);
  }
  function dhw(y) { return (hw(y + 1) - hw(y - 1)) / 2; }
  var ATOT = 0;
  for (var yy = NB; yy < BOTTOM; yy += 1) ATOT += 2 * hw(yy + 0.5);
  function fits(rx) {
    var ry = R * rx, cy = TOP + ry;
    for (var i = 0; i <= 180; i++) {
      var th = Math.PI * 2 * i / 180, x = rx * Math.sin(th), y = cy - ry * Math.cos(th);
      if (y > BOTTOM - 5 || Math.abs(x) > hw(y) - 5) return false;
    }
    return true;
  }
  var lo = 18, hi = 220;
  for (var k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (fits(m)) lo = m; else hi = m; }
  var RX_MAX = lo, RX0 = 18;
  var A0 = Math.PI * R * RX0 * RX0, A_MAX = Math.PI * R * RX_MAX * RX_MAX;
  var RHO0 = N_TRAP0 / (ATOT - A0), PMAX = PMAXF * RHO0;
  function eq(nIn, nOut, sealed) {
    function f(A) { return nIn / A - (sealed ? nOut / (ATOT - A) : RHO0) - EL * RHO0 * (A - A0) / (A_MAX - A0); }
    if (f(A0) <= 0) return A0;
    if (f(A_MAX) >= 0) return A_MAX;
    var l = A0, h = A_MAX;
    for (var i = 0; i < 40; i++) { var mm = (l + h) / 2; if (f(mm) > 0) l = mm; else h = mm; }
    return (l + h) / 2;
  }

  /* ---------- state ---------- */
  var canvas = document.getElementById('scene'); if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var blowBtn = document.getElementById('blow'), pauseBtn = document.getElementById('pause'), resetBtn = document.getElementById('reset');
  var reduced = P.reduced, speedK = reduced ? 0.5 : 1;
  var ps = [], A = A0, rx = RX0, ry = R * RX0, cy = TOP + R * RX0;
  var sealed = true, blowing = false, paused = false, blocked = false, acc = 0, escTimer = 0, escaping = 0, T = {};

  function rnd() { return Math.random(); }
  function geom() { rx = Math.sqrt(A / (Math.PI * R)); ry = R * rx; cy = TOP + ry; }
  function inBalloon(x, y, pad) { var a = (x - CX) / (rx + pad), b = (y - cy) / (ry + pad); return a * a + b * b < 1; }
  function countIn() { var n = 0; for (var i = 0; i < ps.length; i++) if (ps[i].k === 'in') n++; return n; }
  function countOut() { var n = 0; for (var i = 0; i < ps.length; i++) if (ps[i].k === 'out' && ps[i].s === 'free') n++; return n; }
  function speedVec() { var a = rnd() * 6.2832, s = V0 * (0.55 + 0.9 * rnd()) * speedK; return [Math.cos(a) * s, Math.sin(a) * s]; }
  function spawnOut(n) {
    var c = 0, tries = 0;
    while (c < n && tries < 40000) {
      tries++;
      var y = NB + PR + rnd() * (BOTTOM - NB - 2 * PR), h = hw(y) - PR - 2;
      if (h <= 0 || rnd() * BODY_HW > h) continue;
      var x = CX + (rnd() * 2 - 1) * h;
      if (inBalloon(x, y, PR + 1)) continue;
      var v = speedVec(); ps.push({ k: 'out', s: 'free', x: x, y: y, vx: v[0], vy: v[1], a: 1 }); c++;
    }
  }
  function spawnIn(inside) {
    var v = speedVec();
    if (inside) { var a = rnd() * 6.2832, r = Math.sqrt(rnd()) * 0.7; ps.push({ k: 'in', s: 'free', x: CX + Math.cos(a) * r * rx, y: cy + Math.sin(a) * r * ry, vx: v[0], vy: v[1], a: 1 }); }
    else ps.push({ k: 'in', s: 'enter', x: CX + (rnd() * 2 - 1) * 6, y: MOUTH - 26, vx: 0, vy: 0, a: 1 });
  }
  function reset() { ps = []; A = A0; geom(); acc = 0; escTimer = 0; blocked = false; spawnIn(true); spawnIn(true); spawnOut(N_TRAP0); lastCaption = ''; }

  /* ---------- physics ---------- */
  function collideIn(p) {
    var a = rx - PR, b = ry - PR; if (a < 2) return;
    var qx = (p.x - CX) / a, qy = (p.y - cy) / b, d2 = qx * qx + qy * qy;
    if (d2 > 1) {
      var d = Math.sqrt(d2); p.x = CX + qx / d * a; p.y = cy + qy / d * b;
      var nx = qx / a, ny = qy / b, nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
      var dot = p.vx * nx + p.vy * ny; if (dot > 0) { p.vx -= 2 * dot * nx; p.vy -= 2 * dot * ny; }
    }
  }
  function collideOut(p) {
    var a = rx + PR, b = ry + PR, qx = (p.x - CX) / a, qy = (p.y - cy) / b, d2 = qx * qx + qy * qy;
    if (d2 < 1) {
      var d = Math.sqrt(d2) || 1e-6; if (d2 < 1e-10) { qx = 0; qy = 1; d = 1; }
      p.x = CX + qx / d * a; p.y = cy + qy / d * b;
      var nx = qx / a, ny = qy / b, nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
      var dot = p.vx * nx + p.vy * ny; if (dot < 0) { p.vx -= 2 * dot * nx; p.vy -= 2 * dot * ny; }
    }
    var h = hw(p.y) - PR - 1, dx = p.x - CX;
    if (Math.abs(dx) > h) {
      var sg = dx < 0 ? -1 : 1; p.x = CX + sg * h;
      var wx = sg, wy = -dhw(p.y) * sg * sg, wl = Math.hypot(wx, wy); wx /= wl; wy /= wl;
      var dw = p.vx * wx + p.vy * wy; if (dw > 0) { p.vx -= 2 * dw * wx; p.vy -= 2 * dw * wy; }
    }
    if (p.y > BOTTOM - PR - 1) { p.y = BOTTOM - PR - 1; if (p.vy > 0) p.vy = -p.vy; }
    if (p.y < NB + PR) { p.y = NB + PR; if (p.vy < 0) p.vy = -p.vy; }
  }
  function substep(dt) {
    geom(); escaping = 0;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (p.s === 'enter') { p.y += 240 * dt; if (p.y >= cy - ry + 8) { var v = speedVec(); p.s = 'free'; p.vx = v[0]; p.vy = Math.abs(v[1]) + 20; } continue; }
      if (p.s === 'escape') {
        escaping++;
        var dx = CX - p.x, dy = BOTTOM + 10 - p.y, d = Math.hypot(dx, dy) || 1;
        if (p.y > BOTTOM + 2 && Math.abs(p.x - CX) < HOLE + 2) { p.s = 'fade'; p.vx = (rnd() - 0.5) * 40; p.vy = 110; }
        else { p.x += dx / d * 170 * dt; p.y += dy / d * 170 * dt; }
        continue;
      }
      if (p.s === 'fade') { escaping++; p.x += p.vx * dt; p.y += p.vy * dt; p.a -= dt * 1.5; continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.k === 'in') collideIn(p); else collideOut(p);
    }
  }
  function step(dt) {
    var nIn = countIn(), nOut = countOut();
    if (blowing) {
      var A1 = eq(nIn + 1, nOut, sealed);
      blocked = (nIn + 1) / A1 > PMAX;
      if (!blocked) { acc += BLOW_RATE * dt; while (acc >= 1) { spawnIn(false); acc -= 1; } } else acc = 0;
    } else { blocked = false; acc = 0; }
    nIn = countIn(); nOut = countOut();
    var tgt = eq(nIn, nOut, sealed);
    A = reduced ? tgt : A + (tgt - A) * (1 - Math.exp(-dt * 7));
    A = Math.max(A0, Math.min(A_MAX, A));
    if (!sealed) {
      escTimer -= dt;
      if (escTimer <= 0) {
        var want = Math.round(RHO0 * (ATOT - A));
        if (nOut > want) {
          var best = -1, bd = 1e9;
          for (var i = 0; i < ps.length; i++) { var p = ps[i]; if (p.k === 'out' && p.s === 'free') { var d = Math.hypot(p.x - CX, p.y - BOTTOM); if (d < bd) { bd = d; best = i; } } }
          if (best >= 0) ps[best].s = 'escape';
          escTimer = 0.035;
        } else escTimer = 0.05;
      }
    }
    var n = 2, h = dt / n;
    for (var s = 0; s < n; s++) substep(h);
    for (var j = ps.length - 1; j >= 0; j--) if (ps[j].s === 'fade' && ps[j].a <= 0) ps.splice(j, 1);
  }

  /* ---------- drawing ---------- */
  var left = [], right = [], bottom = [];
  (function () {
    var y;
    for (y = MOUTH; y < BOTTOM; y += 3) { left.push([CX - hw(y), y]); right.push([CX + hw(y), y]); }
    left.push([CX - hw(BOTTOM), BOTTOM]); right.push([CX + hw(BOTTOM), BOTTOM]);
    for (var x = CX - hw(BOTTOM); x <= CX + hw(BOTTOM) + 0.1; x += 4) bottom.push([x, BOTTOM]);
  })();
  function trace(pts, first) { for (var i = 0; i < pts.length; i++) { if (first && i === 0) ctx.moveTo(pts[i][0], pts[i][1]); else ctx.lineTo(pts[i][0], pts[i][1]); } }
  function rev(a) { return a.slice().reverse(); }
  function readTheme() {
    var css = P.theme.css, dark = P.theme.get() === 'mission';
    T = { ink: css('--ink') || '#1F2A37', soft: css('--muted') || '#5C6773', balloon: css('--sim-3') || '#D9466A',
      blown: css('--sim-1') || '#0C8F9E', trapped: css('--sim-2') || '#C27803',
      glass: dark ? 'rgba(130,190,240,.10)' : 'rgba(110,175,225,.17)', paper: css('--sunk') || '#F3ECDD' };
  }
  function drawBottle() {
    ctx.beginPath(); trace(left, true); trace(bottom, false); trace(rev(right), false); ctx.closePath();
    ctx.fillStyle = T.glass; ctx.fill();
    ctx.lineWidth = 3.5; ctx.strokeStyle = T.ink; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (sealed) { ctx.beginPath(); trace(left, true); trace(bottom, false); trace(rev(right), false); ctx.stroke(); }
    else {
      var lb = bottom.filter(function (p) { return p[0] < CX - HOLE; }), rb = bottom.filter(function (p) { return p[0] > CX + HOLE; });
      ctx.beginPath(); trace(left, true); trace(lb, false); ctx.stroke();
      ctx.beginPath(); trace(rb, true); trace(rev(right), false); ctx.stroke();
    }
    ctx.save(); ctx.globalAlpha = 0.35; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(CX - BODY_HW + 16, 260); ctx.lineTo(CX - BODY_HW + 16, 500); ctx.stroke(); ctx.restore();
  }
  function drawBalloon() {
    var c = TUBE_HW / rx, s = Math.sqrt(Math.max(0, 1 - c * c));
    var phL = Math.atan2(-s, -c) + Math.PI * 2, phR = Math.atan2(-s, c);
    ctx.beginPath(); ctx.moveTo(CX - TUBE_HW, MOUTH + 4);
    for (var i = 0; i <= 70; i++) { var ph = phL + (phR - phL) * i / 70; ctx.lineTo(CX + rx * Math.cos(ph), cy + ry * Math.sin(ph)); }
    ctx.lineTo(CX + TUBE_HW, MOUTH + 4); ctx.closePath();
    ctx.save(); ctx.globalAlpha = 0.26; ctx.fillStyle = T.balloon; ctx.fill(); ctx.restore();
    ctx.lineWidth = 3; ctx.strokeStyle = T.balloon; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = '#fff'; ctx.beginPath();
    ctx.ellipse(CX - rx * 0.5, cy - ry * 0.32, Math.max(2, rx * 0.1), Math.max(3, ry * 0.2), -0.35, 0, 6.2832); ctx.fill(); ctx.restore();
  }
  function drawLip() {
    ctx.fillStyle = T.balloon; ctx.beginPath();
    var x = CX - NECK_HW - 9, y = MOUTH - 10, w = 2 * (NECK_HW + 9), h = 16;
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 7); else ctx.rect(x, y, w, h);
    ctx.fill();
  }
  function drawParticles(kind) {
    ctx.fillStyle = kind === 'in' ? T.blown : T.trapped; ctx.strokeStyle = T.paper; ctx.lineWidth = 1;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i]; if (p.k !== kind) continue;
      ctx.globalAlpha = Math.max(0, p.a); ctx.beginPath(); ctx.arc(p.x, p.y, PR, 0, 6.2832); ctx.fill(); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function drawLabels(t) {
    ctx.font = '500 15px ' + (P.theme.css('--f-label') || 'system-ui, sans-serif'); ctx.textBaseline = 'middle';
    ctx.fillStyle = T.soft; ctx.strokeStyle = T.soft; ctx.lineWidth = 1.5;
    ctx.textAlign = 'left'; ctx.fillText('balloon', 402, cy);
    ctx.beginPath(); ctx.moveTo(CX + rx + 6, cy); ctx.lineTo(396, cy); ctx.stroke();
    ctx.textAlign = 'right'; ctx.fillText('air in the', 116, 470); ctx.fillText('bottle', 116, 490);
    ctx.beginPath(); ctx.moveTo(122, 480); ctx.lineTo(158, 480); ctx.stroke();
    if (!sealed) { ctx.textAlign = 'center'; ctx.fillText('hole', CX, BOTTOM + 38); }
    var bob = (blowing && !reduced) ? (t / 40) % 8 : 0;
    ctx.save(); ctx.globalAlpha = blowing ? 1 : 0.55; ctx.strokeStyle = T.ink; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(CX, 6 + bob); ctx.lineTo(CX, 26 + bob); ctx.moveTo(CX - 7, 19 + bob); ctx.lineTo(CX, 27 + bob); ctx.lineTo(CX + 7, 19 + bob); ctx.stroke();
    ctx.restore();
    ctx.textAlign = 'left'; ctx.fillStyle = T.soft; ctx.fillText('blow in', CX + 16, 16);
  }
  function draw(t) { geom(); ctx.clearRect(0, 0, W, H); drawBottle(); drawParticles('out'); drawBalloon(); drawParticles('in'); drawLip(); drawLabels(t); }

  /* ---------- readouts ---------- */
  var elVB = document.getElementById('vB'), elNB = document.getElementById('nB'), elVA = document.getElementById('vA'),
      elNA = document.getElementById('nA'), elCrowd = document.getElementById('crowd'), elSeg = document.getElementById('segB'),
      elCap = document.getElementById('caption'), lastCaption = '';
  function captionFor(nIn) {
    var nearEmpty = A < A0 * 1.15 && nIn <= 3;
    if (escaping > 0 && !sealed) return 'The bottle\'s own air (amber dots) is leaving through the hole, so the balloon can take over the space that air was using.';
    if (blowing && !sealed && A >= A_MAX * 0.985) return 'The balloon is as big as the bottle lets it be. It is touching the walls.';
    if (blowing && !sealed) return 'The bottle\'s air can leave through the hole, so nothing pushes back much and the balloon keeps growing.';
    if (blowing && sealed && blocked) return 'The balloon stops growing. The bottle\'s air cannot leave, so it is squashed and pushes back. This is why the balloon only inflates a little.';
    if (blowing && sealed) return 'The blown-in air (teal dots) stretches the balloon. The balloon now takes up space the bottle\'s air was using, so that air is squashed into less room.';
    if (nearEmpty) return 'The bottle is not empty. It is full of air (amber dots). The balloon is limp, with almost no air in it.';
    if (!sealed) return 'The balloon stayed big because the bottle\'s air was free to leave. The bottle\'s air is not squashed.';
    return 'Blowing has stopped. The balloon is a little bigger, and the bottle\'s air is a little more squashed than at the start.';
  }
  function updateUI() {
    var nIn = countIn(), nOut = countOut(), vB = Math.round(A / ATOT * BOTTLE_ML), vA = BOTTLE_ML - vB;
    elVB.textContent = vB + ' mL'; elVA.textContent = vA + ' mL'; elNB.textContent = nIn; elNA.textContent = nOut;
    elSeg.style.width = (vB / BOTTLE_ML * 100) + '%';
    elCrowd.textContent = Math.round(nOut / (ATOT - A) / RHO0 * 100) + '%';
    var c = captionFor(nIn); if (c !== lastCaption) { elCap.textContent = c; lastCaption = c; }
  }

  /* ---------- controls ---------- */
  function setBlow(v) {
    if (v && paused) return;
    if (blowing === v) return;
    blowing = v; blowBtn.classList.toggle('on', v); blowBtn.textContent = v ? 'Blowing…' : 'Hold to blow';
    if (v) {
      var nIn = countIn(), nOut = countOut();
      for (var i = 0; i < 3; i++) { var A1 = eq(nIn + 1, nOut, sealed); if ((nIn + 1) / A1 > PMAX) break; spawnIn(false); nIn++; }
    }
  }
  blowBtn.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    if (blowBtn.setPointerCapture) { try { blowBtn.setPointerCapture(e.pointerId); } catch (err) {} }
    setBlow(true);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) { blowBtn.addEventListener(n, function () { setBlow(false); }); });
  blowBtn.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) setBlow(true); } });
  blowBtn.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setBlow(false); } });
  blowBtn.addEventListener('blur', function () { setBlow(false); });
  blowBtn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  pauseBtn.addEventListener('click', function () { paused = !paused; pauseBtn.textContent = paused ? 'Play' : 'Pause'; if (paused) setBlow(false); });
  resetBtn.addEventListener('click', function () { setBlow(false); reset(); updateUI(); });
  P.$$('input[name="mode"]').forEach(function (r) { r.addEventListener('change', function () { if (r.checked) sealed = r.value === 'sealed'; }); });

  function fit() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fit(); window.addEventListener('resize', fit);
  readTheme(); P.theme.on(readTheme);
  reset(); updateUI();
  var last = performance.now(), lastUI = 0;
  function frame(now) {
    var dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    if (!paused) step(dt);
    draw(now);
    if (now - lastUI > 100) { updateUI(); lastUI = now; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  P.Q.set(document.getElementById('qs'), P.data.questions, {});
})();
