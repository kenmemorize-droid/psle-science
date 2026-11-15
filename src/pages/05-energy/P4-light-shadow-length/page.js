/* Shadows on the move: 2D canvas + optional Three.js 3D view (ported from the legacy page). */
(function(){
'use strict';
const $ = id => document.getElementById(id);
const TAU = Math.PI*2;
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const f1 = v => (Math.round(v*10)/10).toFixed(1);
const COL = {A:'#ffb703', B:'#4cc9f0'};
const DEF = {h:1.5, H:5, D:12};
const S = {h:DEF.h, H:DEF.H, D:DEF.D, x:3, speed:1, playing:false, dir:1, face:1, rays:true, loop:true,
           hold:0, phase:0, moveT:0, walkAmp:0, view:'2d'};
const WALK = 1.2;      // metres per second at normal speed
let dirty = true, layoutDirty = true;

function geom(){
  const k = S.h/(S.H-S.h);
  const dA = S.x, dB = S.D-S.x;
  return {k:k, dA:dA, dB:dB, LA:k*dA, LB:k*dB, tipA:S.x+k*dA, tipB:S.x-k*dB};
}
function setX(nx){
  nx = clamp(nx, 0, S.D);
  const dx = nx - S.x;
  if (Math.abs(dx) > 1e-6){ S.phase += Math.abs(dx)*TAU/1.4; S.face = dx>0 ? 1 : -1; S.moveT = 0.25; }
  S.x = nx; dirty = true;
}
function pause(){ S.playing = false; updatePlayBtn(); }
function updatePlayBtn(){ $('btnPlay').textContent = S.playing ? '⏸ Pause' : '▶ Walk'; }

/* ---------------------------------------------------------------- 2D view */
const c2 = $('c2d'), g = c2.getContext('2d');
let W = 0, Hc = 0, dpr = 1;
function resize2D(){
  const r = $('stage').getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio||1, 2);
  W = r.width; Hc = r.height;
  c2.width = Math.round(W*dpr); c2.height = Math.round(Hc*dpr);
  dirty = true;
}
function rnd(seed){ let s = seed; return function(){ s = (s*16807) % 2147483647; return (s-1)/2147483646; }; }
const R1 = rnd(7);
const STARS = Array.from({length:70}, () => [R1(), R1()*0.55, 0.5+R1()*1.3]);
const R2 = rnd(21);
const BLDG = Array.from({length:26}, () => [R2(), 0.025+R2()*0.04, 22+R2()*70, R2()]);

function view2D(){
  const G = geom();
  const xmin = -G.k*S.D - 1.5, xmax = S.D + G.k*S.D + 1.5;
  const groundY = Math.round(Hc*0.6);
  const sH = (groundY - 62)/(S.H + 0.4);
  const sW = (W - 24)/(xmax - xmin);
  const s = Math.min(sH, sW);
  const x0 = W/2 - s*(xmin+xmax)/2;
  return {G:G, xmin:xmin, xmax:xmax, groundY:groundY, s:s, x0:x0};
}
function rr(x,y,w,h,r){
  r = Math.min(r, Math.abs(w)/2, Math.abs(h)/2);
  g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r);
  g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath();
}
function bracket(x1,x2,y,col,label,dashed){
  g.strokeStyle = col; g.lineWidth = 2;
  g.setLineDash(dashed ? [5,4] : []);
  if (Math.abs(x2-x1) > 1){ g.beginPath(); g.moveTo(x1,y); g.lineTo(x2,y); g.stroke(); }
  g.setLineDash([]);
  g.beginPath(); g.moveTo(x1,y-5); g.lineTo(x1,y+5); g.moveTo(x2,y-5); g.lineTo(x2,y+5); g.stroke();
  g.fillStyle = col; g.font = '600 12px "Avenir Next","Trebuchet MS","Segoe UI",sans-serif';
  g.textAlign = 'center'; g.fillText(label, (x1+x2)/2, y-9);
}
function drawPerson(cx, gy, u, face, phase, amp){
  const a = Math.sin(phase)*0.5*amp;
  const hipY = gy-0.47*u, shY = gy-0.82*u, rHead = Math.max(0.075*u, 3);
  g.lineCap = 'round';
  // far arm and leg first
  g.strokeStyle = '#6d8fc4'; g.lineWidth = Math.max(0.075*u,3);
  g.beginPath(); g.moveTo(cx,hipY); g.lineTo(cx+Math.sin(-a)*0.47*u, hipY+Math.cos(a)*0.47*u); g.stroke();
  g.strokeStyle = '#d98466'; g.lineWidth = Math.max(0.055*u,2.4);
  g.beginPath(); g.moveTo(cx,shY); g.lineTo(cx+Math.sin(a)*0.34*u, shY+Math.cos(a)*0.34*u); g.stroke();
  // torso
  g.strokeStyle = '#ff7b54'; g.lineWidth = Math.max(0.17*u,6);
  g.beginPath(); g.moveTo(cx,hipY-0.02*u); g.lineTo(cx,shY); g.stroke();
  // near leg and arm
  g.strokeStyle = '#8ecae6'; g.lineWidth = Math.max(0.085*u,3.4);
  g.beginPath(); g.moveTo(cx,hipY); g.lineTo(cx+Math.sin(a)*0.47*u, hipY+Math.cos(a)*0.47*u); g.stroke();
  g.strokeStyle = '#ff9a76'; g.lineWidth = Math.max(0.06*u,2.6);
  g.beginPath(); g.moveTo(cx,shY); g.lineTo(cx+Math.sin(-a)*0.34*u, shY+Math.cos(a)*0.34*u); g.stroke();
  // head (top of head is exactly at height u)
  g.fillStyle = '#ffd7a8'; g.beginPath(); g.arc(cx, gy-u+rHead, rHead, 0, TAU); g.fill();
  g.fillStyle = '#2a2140'; g.beginPath(); g.arc(cx+face*rHead*0.45, gy-u+rHead*0.9, Math.max(rHead*0.14,0.7), 0, TAU); g.fill();
}
function draw2D(){
  const V = view2D(), G = V.G, s = V.s, gy = V.groundY;
  const px = x => V.x0 + s*x;
  g.setTransform(dpr,0,0,dpr,0,0);
  g.clearRect(0,0,W,Hc);
  // sky
  const sky = g.createLinearGradient(0,0,0,gy);
  sky.addColorStop(0,'#070b1f'); sky.addColorStop(1,'#2b3070');
  g.fillStyle = sky; g.fillRect(0,0,W,gy+14);
  g.fillStyle = '#e8ecff';
  STARS.forEach(st => { g.globalAlpha = 0.35+0.4*st[2]/1.8; g.beginPath(); g.arc(st[0]*W, st[1]*gy, st[2]*0.8, 0, TAU); g.fill(); });
  g.globalAlpha = 1;
  // skyline
  BLDG.forEach(b => {
    const bw = Math.max(18, b[1]*W), bx = b[0]*W, bh = b[2];
    g.fillStyle = '#0e1440'; g.fillRect(bx, gy-bh, bw, bh);
    g.fillStyle = 'rgba(255,214,120,.35)';
    for (let wy = gy-bh+8; wy < gy-10; wy += 14){ for (let wx = bx+5; wx < bx+bw-6; wx += 10){ if (((wx*7+wy*3+b[3]*100)|0)%5===0) g.fillRect(wx, wy, 3, 4); } }
  });
  // pavement slab and measuring band
  const slab = g.createLinearGradient(0,gy,0,gy+14);
  slab.addColorStop(0,'#939bb8'); slab.addColorStop(1,'#68708f');
  g.fillStyle = slab; g.fillRect(0,gy,W,14);
  g.fillStyle = '#161c47'; g.fillRect(0,gy+14,W,Hc-gy-14);
  g.fillStyle = '#c5cbe6'; g.fillRect(0,gy,W,1);
  // light pools on the pavement and glow in the air
  [0,S.D].forEach(p => {
    const cx = px(p), R = Math.max(S.H*s*1.4, 90);
    const gr = g.createRadialGradient(cx,gy,0,cx,gy,R);
    gr.addColorStop(0,'rgba(255,224,150,.5)'); gr.addColorStop(1,'rgba(255,224,150,0)');
    g.fillStyle = gr; g.fillRect(cx-R, gy, 2*R, 14);
    const by = gy - S.H*s, R2 = Math.max(S.H*s*0.8, 70);
    const ga = g.createRadialGradient(cx,by,0,cx,by,R2);
    ga.addColorStop(0,'rgba(255,224,150,.28)'); ga.addColorStop(1,'rgba(255,224,150,0)');
    g.fillStyle = ga; g.beginPath(); g.arc(cx,by,R2,0,TAU); g.fill();
  });
  // ruler (distance from lamp A)
  g.strokeStyle = '#5b66a8'; g.fillStyle = '#8f9ad0'; g.lineWidth = 1;
  g.font = '11px "Avenir Next","Trebuchet MS","Segoe UI",sans-serif'; g.textAlign = 'center';
  for (let m = Math.ceil(V.xmin); m <= Math.floor(V.xmax); m++){
    const tx = px(m), major = (m%2===0);
    g.beginPath(); g.moveTo(tx, gy+14); g.lineTo(tx, gy+14+(major?8:4)); g.stroke();
    if (major && m >= 0 && m <= S.D && s*2 > 20) g.fillText(m, tx, gy+36);
  }
  g.textAlign = 'left'; g.fillText('metres from lamp A', 8, gy+36); g.textAlign = 'center';
  // shadows on the pavement (overlap is darker)
  const barY = gy+3;
  [[px(S.x), px(G.tipA)], [px(S.x), px(G.tipB)]].forEach(ab => {
    const x1 = Math.min(ab[0],ab[1]), w = Math.abs(ab[1]-ab[0]);
    if (w < 1) return;
    g.fillStyle = 'rgba(5,7,24,.62)'; rr(x1, barY, w, 8, 4); g.fill();
  });
  // lampposts
  [0,S.D].forEach((p,i) => {
    const cx = px(p), topY = gy - S.H*s, pw = Math.max(3, 0.1*s), hw = Math.max(9, 0.38*s), r = Math.max(4, 0.13*s);
    g.fillStyle = '#3d4580'; g.fillRect(cx-pw/2, topY, pw, gy-topY);
    rr(cx-pw*1.6, gy-6, pw*3.2, 8, 3); g.fill();
    g.beginPath(); g.moveTo(cx-hw, topY-2); g.lineTo(cx-hw*0.4, topY-r-7); g.lineTo(cx+hw*0.4, topY-r-7); g.lineTo(cx+hw, topY-2); g.closePath(); g.fill();
    g.fillStyle = '#fff3c4'; g.beginPath(); g.arc(cx, topY, r, 0, TAU); g.fill();
    g.fillStyle = i ? COL.B : COL.A; g.beginPath(); g.arc(cx, topY-r-24, 11, 0, TAU); g.fill();
    g.fillStyle = '#08101f'; g.font = '800 13px "Avenir Next","Trebuchet MS",sans-serif'; g.textAlign = 'center';
    g.fillText(i ? 'B' : 'A', cx, topY-r-19.5);
  });
  // light rays: lamp, past the top of the head, down to the tip of the shadow
  const headY = gy - S.h*s;
  if (S.rays){
    [[0,G.tipA,COL.A],[S.D,G.tipB,COL.B]].forEach(r => {
      g.strokeStyle = r[2]; g.globalAlpha = .9; g.lineWidth = 1.8; g.setLineDash([7,5]);
      g.beginPath(); g.moveTo(px(r[0]), gy-S.H*s); g.lineTo(px(r[1]), gy); g.stroke();
      g.setLineDash([]); g.globalAlpha = 1;
      g.fillStyle = r[2]; g.beginPath(); g.arc(px(r[1]), gy, 4.5, 0, TAU); g.fill();
    });
  }
  // person
  drawPerson(px(S.x), gy, S.h*s, S.face, S.phase, S.walkAmp);
  // brackets under the pavement
  bracket(px(S.x), px(G.tipA), gy+60, COL.A, 'Lamp A shadow: '+f1(G.LA)+' m', false);
  bracket(px(S.x), px(G.tipB), gy+84, COL.B, 'Lamp B shadow: '+f1(G.LB)+' m', false);
  bracket(px(0), px(S.x), gy+110, COL.A, f1(G.dA)+' m from lamp A', true);
  bracket(px(S.x), px(S.D), gy+110, COL.B, f1(G.dB)+' m from lamp B', true);
}

/* ---------------------------------------------------------------- graph */
const cg = $('cGraph');
function drawGraph(){
  const r = cg.getBoundingClientRect(), w = r.width, h = r.height, d = Math.min(window.devicePixelRatio||1,2);
  if (!w || !h) return;
  if (cg.width !== Math.round(w*d) || cg.height !== Math.round(h*d)){ cg.width = Math.round(w*d); cg.height = Math.round(h*d); }
  const x = cg.getContext('2d'); x.setTransform(d,0,0,d,0,0); x.clearRect(0,0,w,h);
  const G = geom(), kD = G.k*S.D;
  const step = kD <= 3 ? 0.5 : (kD <= 6 ? 1 : 2), ymax = Math.max(step, Math.ceil(kD/step)*step);
  const pl = 44, pr = 14, pt = 26, pb = 40;
  const xs = v => pl + v/S.D*(w-pl-pr), ys = v => h-pb - v/ymax*(h-pt-pb);
  x.font = '12px "Avenir Next","Trebuchet MS","Segoe UI",sans-serif'; x.lineWidth = 1;
  x.strokeStyle = '#26307a'; x.fillStyle = '#9aa5dc'; x.textAlign = 'right';
  for (let v = 0; v <= ymax+1e-9; v += step){ x.beginPath(); x.moveTo(pl,ys(v)); x.lineTo(w-pr,ys(v)); x.stroke(); x.fillText(String(Math.round(v*10)/10), pl-6, ys(v)+4); }
  x.textAlign = 'center';
  const xstep = S.D <= 8 ? 1 : 2;
  for (let v = 0; v <= S.D+1e-9; v += xstep){ x.beginPath(); x.moveTo(xs(v),h-pb); x.lineTo(xs(v),h-pb+5); x.stroke(); x.fillText(String(v), xs(v), h-pb+18); }
  x.fillStyle = '#c3caf0'; x.fillText('distance from lamp A (m)', pl+(w-pl-pr)/2, h-6);
  x.save(); x.translate(12, pt+(h-pt-pb)/2); x.rotate(-Math.PI/2); x.fillText('shadow length (m)', 0, 0); x.restore();
  x.lineWidth = 2.5;
  x.strokeStyle = COL.A; x.beginPath(); x.moveTo(xs(0),ys(0)); x.lineTo(xs(S.D),ys(kD)); x.stroke();
  x.strokeStyle = COL.B; x.beginPath(); x.moveTo(xs(0),ys(kD)); x.lineTo(xs(S.D),ys(0)); x.stroke();
  x.font = '700 12px "Avenir Next","Trebuchet MS",sans-serif';
  x.fillStyle = COL.A; x.textAlign = 'right'; x.fillText('Lamp A shadow', xs(S.D), ys(kD)-8);
  x.fillStyle = COL.B; x.textAlign = 'left'; x.fillText('Lamp B shadow', xs(0)+4, ys(kD)-8);
  x.strokeStyle = '#eef1ff'; x.lineWidth = 1.2; x.setLineDash([4,4]);
  x.beginPath(); x.moveTo(xs(S.x), h-pb); x.lineTo(xs(S.x), pt-6); x.stroke(); x.setLineDash([]);
  [[G.LA,COL.A],[G.LB,COL.B]].forEach(p => { x.fillStyle = p[1]; x.strokeStyle = '#fff'; x.lineWidth = 2; x.beginPath(); x.arc(xs(S.x), ys(p[0]), 6, 0, TAU); x.fill(); x.stroke(); });
}

/* ---------------------------------------------------------------- readouts */
function caption(G){
  const A = '<span class="tagA">lamp A</span>', B = '<span class="tagB">lamp B</span>';
  const AU = '<span class="tagA">Lamp A</span>', BU = '<span class="tagB">Lamp B</span>';
  if (S.x < 0.05) return 'The person is right under '+A+'. Its light shines straight down, so its shadow is just a patch at the feet (0 m). '+BU+' is the farthest away, so its shadow is the longest ('+f1(G.LB)+' m).';
  if (S.D-S.x < 0.05) return 'The person is right under '+B+'. Its light shines straight down, so its shadow is just a patch at the feet (0 m). '+AU+' is the farthest away, so its shadow is the longest ('+f1(G.LA)+' m).';
  if (Math.abs(G.dA-G.dB) < 0.15) return 'The person is halfway between the lamps. Both lamps are the same distance away, so both shadows are equally long ('+f1(G.LA)+' m).';
  const nearA = G.dA < G.dB;
  const nn = nearA ? AU : BU, ff = nearA ? BU : AU;
  const dn = nearA ? G.dA : G.dB, df = nearA ? G.dB : G.dA, ln = nearA ? G.LA : G.LB, lf = nearA ? G.LB : G.LA;
  return nn+' is nearer ('+f1(dn)+' m away), so its shadow is shorter ('+f1(ln)+' m). '+ff+' is farther ('+f1(df)+' m away), so its shadow is longer ('+f1(lf)+' m). A shadow always points away from its own lamp.';
}
function ui(){
  const G = geom();
  $('dA').textContent = f1(G.dA)+' m'; $('dB').textContent = f1(G.dB)+' m';
  $('LA').textContent = f1(G.LA)+' m'; $('LB').textContent = f1(G.LB)+' m';
  $('why').innerHTML = caption(G);
  $('pos').value = Math.round(S.x/S.D*1000);
  $('fmA').innerHTML = '<span class="tagA">A</span> '+f1(S.h)+' × '+f1(G.dA)+' ÷ ('+f1(S.H)+' − '+f1(S.h)+') = '+f1(G.LA)+' m';
  $('fmB').innerHTML = '<span class="tagB">B</span> '+f1(S.h)+' × '+f1(G.dB)+' ÷ ('+f1(S.H)+' − '+f1(S.h)+') = '+f1(G.LB)+' m';
}

/* ---------------------------------------------------------------- 3D view */
let T = null, T_failed = false;
function fail3D(msg){
  T_failed = true;
  $('c3dwrap').innerHTML = '<p class="nogl">'+msg+'</p>';
}
function radialTex(inner, outer){
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), gr = x.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,inner); gr.addColorStop(1,outer); x.fillStyle = gr; x.fillRect(0,0,128,128);
  return new THREE.CanvasTexture(c);
}
function letterTex(ch, col){
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = col; x.beginPath(); x.arc(64,64,56,0,TAU); x.fill();
  x.fillStyle = '#08101f'; x.font = '800 78px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch,64,70);
  return new THREE.CanvasTexture(c);
}
function tileTex(){
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = '#a2abc4'; x.fillRect(0,0,128,128);
  x.strokeStyle = '#7b84a3'; x.lineWidth = 5; x.strokeRect(0,0,128,128);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}
function init3D(){
  if (T) return true;
  if (T_failed) return false;
  if (typeof THREE === 'undefined'){ fail3D('The 3D library could not load. The 2D view still works.'); return false; }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true}); }
  catch (e) { fail3D('This device could not start 3D graphics. The 2D view still works.'); return false; }
  const wrap = $('c3dwrap');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  wrap.insertBefore(renderer.domElement, wrap.firstChild);
  const el = renderer.domElement;
  el.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;cursor:grab';
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f26);
  const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 400);
  scene.add(new THREE.HemisphereLight(0x8c9bd6, 0x1a1f33, 0.45));

  const tile = tileTex();
  const walk = new THREE.Mesh(new THREE.BoxGeometry(1,0.1,1), new THREE.MeshStandardMaterial({map:tile, roughness:0.95, metalness:0}));
  walk.position.y = -0.05; walk.receiveShadow = true; scene.add(walk);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400,400), new THREE.MeshStandardMaterial({color:0x141c38, roughness:1}));
  ground.rotation.x = -Math.PI/2; ground.position.y = -0.08; ground.receiveShadow = true; scene.add(ground);

  // lampposts: pole beside the path, arm reaching over it, bulb right above the walking line
  const glowTex = radialTex('rgba(255,236,170,0.9)','rgba(255,220,140,0)');
  const matPole = new THREE.MeshStandardMaterial({color:0x3d4580, roughness:0.7});
  const lamps = [0,1].map(i => {
    const grp = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,1,12), matPole);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,0.9), matPole);
    const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.4,0.22,18,1,true), new THREE.MeshStandardMaterial({color:0x3d4580, side:THREE.DoubleSide}));
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16,16,12), new THREE.MeshBasicMaterial({color:0xfff1c0}));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex, blending:THREE.AdditiveBlending, depthWrite:false, transparent:true}));
    glow.scale.set(4.2,4.2,1);
    const tag = new THREE.Sprite(new THREE.SpriteMaterial({map:letterTex(i?'B':'A', i?COL.B:COL.A), depthWrite:false}));
    tag.scale.set(0.9,0.9,1);
    [pole,arm,hood,bulb,glow,tag].forEach(m => grp.add(m));
    scene.add(grp);
    const light = new THREE.PointLight(0xffe2a8, 1.1, 48, 2);
    light.castShadow = true; light.shadow.mapSize.set(1024,1024);
    light.shadow.camera.near = 0.3; light.shadow.camera.far = 80;
    light.shadow.bias = -0.0008; light.shadow.normalBias = 0.02;
    scene.add(light);
    return {grp:grp, pole:pole, arm:arm, hood:hood, bulb:bulb, glow:glow, tag:tag, light:light};
  });

  // the walker, built 1 unit tall and scaled to the chosen height (faces +z)
  const person = new THREE.Group();
  const mShirt = new THREE.MeshStandardMaterial({color:0xff7b54, roughness:0.8});
  const mLeg = new THREE.MeshStandardMaterial({color:0x8ecae6, roughness:0.8});
  const mSkin = new THREE.MeshStandardMaterial({color:0xffd7a8, roughness:0.8});
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.085,0.22,4,10), mShirt); torso.position.y = 0.655;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.07,18,14), mSkin); head.position.y = 0.93;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.06,8), mSkin); neck.position.y = 0.875;
  function limb(r1, r2, len, mat, x, y){
    const pv = new THREE.Group(); pv.position.set(x,y,0);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,len,10), mat); m.position.y = -len/2; m.castShadow = true;
    pv.add(m); person.add(pv); return pv;
  }
  const legL = limb(0.036,0.03,0.47,mLeg,-0.045,0.47), legR = limb(0.036,0.03,0.47,mLeg,0.045,0.47);
  const armL = limb(0.026,0.022,0.34,mShirt,-0.12,0.82), armR = limb(0.026,0.022,0.34,mShirt,0.12,0.82);
  [torso,head,neck].forEach(m => { m.castShadow = true; person.add(m); });
  scene.add(person);

  // measuring tapes laid beside the path, tip markers, and light rays
  const mkTape = col => new THREE.Mesh(new THREE.BoxGeometry(1,0.03,0.1), new THREE.MeshBasicMaterial({color:col}));
  const mkTip = col => new THREE.Mesh(new THREE.SphereGeometry(0.1,14,10), new THREE.MeshBasicMaterial({color:col}));
  const tapeA = mkTape(0xffb703), tapeB = mkTape(0x4cc9f0), tipA = mkTip(0xffb703), tipB = mkTip(0x4cc9f0);
  [tapeA,tapeB,tipA,tipB].forEach(m => scene.add(m));
  const mkRay = col => new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,1,6), new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:0.6, depthWrite:false}));
  const rayA = mkRay(0xffb703), rayB = mkRay(0x4cc9f0);
  scene.add(rayA); scene.add(rayB);

  T = {renderer:renderer, scene:scene, camera:camera, walk:walk, tile:tile, lamps:lamps, person:person,
       legL:legL, legR:legR, armL:armL, armR:armR, tapeA:tapeA, tapeB:tapeB, tipA:tipA, tipB:tipB, rayA:rayA, rayB:rayB,
       yaw:Math.PI/2, camMode:'persp', cam:{az:0.55, pol:1.1, r:20}, target:new THREE.Vector3(0,1,0)};

  // orbit camera: drag to turn, wheel or pinch to zoom
  const pts = new Map(); let pinch0 = 0;
  const pdist = () => { const a = Array.from(pts.values()); return Math.hypot(a[0].x-a[1].x, a[0].y-a[1].y); };
  el.addEventListener('pointerdown', e => {
    el.setPointerCapture(e.pointerId); pts.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if (pts.size === 2) pinch0 = pdist();
    el.style.cursor = 'grabbing';
  });
  el.addEventListener('pointermove', e => {
    const p = pts.get(e.pointerId); if (!p) return;
    const dx = e.clientX-p.x, dy = e.clientY-p.y; p.x = e.clientX; p.y = e.clientY;
    if (pts.size === 1){
      T.cam.az -= dx*0.008; T.cam.pol = clamp(T.cam.pol - dy*0.006, 0.05, 1.52);
      setCamBtn(null); T.camMode = 'free';
    } else if (pts.size === 2){
      const d = pdist(); if (pinch0 > 0) T.cam.r = clamp(T.cam.r*pinch0/d, 4, 90); pinch0 = d;
    }
    applyCam(); dirty = true;
  });
  const up = e => { pts.delete(e.pointerId); pinch0 = 0; el.style.cursor = 'grab'; };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  el.addEventListener('wheel', e => { e.preventDefault(); T.cam.r = clamp(T.cam.r*Math.exp(e.deltaY*0.001), 4, 90); applyCam(); dirty = true; }, {passive:false});
  return true;
}
function applyCam(){
  const c = T.cam, t = T.target;
  T.camera.position.set(t.x + c.r*Math.sin(c.pol)*Math.sin(c.az), t.y + c.r*Math.cos(c.pol), t.z + c.r*Math.sin(c.pol)*Math.cos(c.az));
  T.camera.lookAt(t);
}
function setCamBtn(mode){
  document.querySelectorAll('#camBtns .btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cam === mode)));
}
function fitRadius(mode){
  const G = geom(), tanH = Math.tan(THREE.MathUtils.degToRad(T.camera.fov/2)), asp = T.camera.aspect || 2;
  const halfW = (S.D + 2*Math.min(G.k*S.D, 14) + 6)/2;
  let r = halfW/(tanH*asp);
  r = Math.max(r, (mode === 'top' ? 4.5 : (S.H/2 + 2.2))/tanH);
  return r*1.04;
}
function setCam(mode){
  if (!T) return;
  T.camMode = mode;
  if (mode === 'side'){ T.cam.az = 0; T.cam.pol = Math.PI/2 - 0.1; T.target.set(0, Math.min(S.H/2, 2.6), 0); }
  else if (mode === 'top'){ T.cam.az = 0; T.cam.pol = 0.06; T.target.set(0, 0, 0); }
  else { T.cam.az = 0.55; T.cam.pol = 1.1; T.target.set(0, Math.min(S.H/2, 2.6), 0); }
  T.cam.r = fitRadius(mode);
  applyCam(); setCamBtn(mode); dirty = true;
}
function resize3D(){
  if (!T) return;
  const r = $('stage').getBoundingClientRect();
  if (!r.width || !r.height) return;
  T.renderer.setSize(r.width, r.height, false);
  T.camera.aspect = r.width/r.height; T.camera.updateProjectionMatrix();
  if (T.camMode !== 'free') T.cam.r = fitRadius(T.camMode);
  applyCam(); dirty = true;
}
function layout3D(){
  if (!T) return;
  const G = geom(), D = S.D, H = S.H;
  const margin = Math.min(G.k*D, 16) + 3, len = D + 2*margin;
  T.walk.scale.set(len, 1, 5); T.walk.position.x = 0;
  T.tile.repeat.set(len, 5); T.tile.offset.set((((-margin) % 1) + 1) % 1, 0);
  T.lamps.forEach((L, i) => {
    const x = i ? D/2 : -D/2;
    L.grp.position.set(x, 0, 0);
    L.pole.scale.y = H; L.pole.position.set(0, H/2, -0.9);
    L.arm.position.set(0, H, -0.45);
    L.hood.position.set(0, H+0.16, 0);
    L.bulb.position.set(0, H, 0); L.glow.position.set(0, H, 0); L.tag.position.set(0, H+1.1, 0);
    L.light.position.set(x, H, 0);
  });
  T.person.scale.setScalar(S.h);
  if (T.camMode !== 'free') setCam(T.camMode);
  layoutDirty = false; dirty = true;
}
function placeRay(mesh, p1, p2){
  const d = new THREE.Vector3().subVectors(p2, p1), len = d.length();
  mesh.position.copy(p1).addScaledVector(d, 0.5);
  mesh.scale.set(1, len, 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), d.normalize());
}
function place3DLabel(el, x, y, z){
  const v = new THREE.Vector3(x, y, z).project(T.camera);
  const r = $('stage').getBoundingClientRect();
  if (v.z > 1){ el.hidden = true; return; }
  el.hidden = false;
  el.style.left = ((v.x*0.5+0.5)*r.width)+'px';
  el.style.top = ((-v.y*0.5+0.5)*r.height)+'px';
}
function update3D(){
  const G = geom(), D = S.D, px = S.x - D/2;
  T.person.position.set(px, 0, 0);
  T.person.rotation.y = T.yaw;
  const a = Math.sin(S.phase)*0.5*S.walkAmp;
  T.legL.rotation.x = a; T.legR.rotation.x = -a; T.armL.rotation.x = -a*0.9; T.armR.rotation.x = a*0.9;
  // tape for lamp A lies on the +z side and extends in +x; tape for lamp B on the -z side and extends in -x
  const showTapes = true;
  T.tapeA.visible = T.tipA.visible = showTapes && G.LA > 0.02;
  T.tapeB.visible = T.tipB.visible = showTapes && G.LB > 0.02;
  T.tapeA.scale.x = Math.max(G.LA, 0.001); T.tapeA.position.set(px + G.LA/2, 0.03, 0.55);
  T.tapeB.scale.x = Math.max(G.LB, 0.001); T.tapeB.position.set(px - G.LB/2, 0.03, -0.55);
  T.tipA.position.set(px + G.LA, 0.1, 0.55);
  T.tipB.position.set(px - G.LB, 0.1, -0.55);
  T.rayA.visible = T.rayB.visible = S.rays;
  if (S.rays){
    placeRay(T.rayA, new THREE.Vector3(-D/2, S.H, 0), new THREE.Vector3(px + G.LA, 0.02, 0));
    placeRay(T.rayB, new THREE.Vector3(D/2, S.H, 0), new THREE.Vector3(px - G.LB, 0.02, 0));
  }
  const lA = $('lblA'), lB = $('lblB');
  lA.textContent = 'Lamp A shadow '+f1(G.LA)+' m'; lB.textContent = 'Lamp B shadow '+f1(G.LB)+' m';
  place3DLabel(lA, px + G.LA/2, 0.1, 0.55);
  place3DLabel(lB, px - G.LB/2, 0.1, -0.55);
}
function render3D(){
  if (layoutDirty) layout3D();
  update3D();
  T.renderer.render(T.scene, T.camera);
}

/* ---------------------------------------------------------------- view switching */
function setView(v){
  if (v === '3d' && !init3D()){ /* fall through: message is shown inside the 3D panel */ }
  S.view = v;
  const is3 = v === '3d';
    $('tab2d').setAttribute('aria-pressed', String(!is3)); $('tab3d').setAttribute('aria-pressed', String(is3));
  c2.hidden = is3; $('c3dwrap').hidden = !is3; $('camBtns').hidden = !is3 || !T;
  $('lblA').hidden = !is3 || !T; $('lblB').hidden = !is3 || !T;
  $('hint').textContent = is3 ? 'Drag to turn the camera. Scroll or pinch to zoom. Use the slider to move the person.' : 'Drag along the road to move the person.';
  if (is3 && T){ resize3D(); layoutDirty = true; }
  else resize2D();
  dirty = true;
}

/* ---------------------------------------------------------------- controls */
function pointerToX(e){ const r = c2.getBoundingClientRect(); const V = view2D(); return (e.clientX - r.left - V.x0)/V.s; }
let drag2d = false;
c2.addEventListener('pointerdown', e => { drag2d = true; c2.setPointerCapture(e.pointerId); pause(); setX(pointerToX(e)); });
c2.addEventListener('pointermove', e => { if (drag2d) setX(pointerToX(e)); });
['pointerup','pointercancel'].forEach(n => c2.addEventListener(n, () => { drag2d = false; }));

$('pos').addEventListener('input', e => { pause(); setX(+e.target.value/1000*S.D); });
$('btnPlay').addEventListener('click', () => {
  if (!S.playing){
    if (S.x >= S.D-0.01) S.dir = -1; else if (S.x <= 0.01) S.dir = 1;
    S.hold = 0;
  }
  S.playing = !S.playing; updatePlayBtn(); dirty = true;
});
$('btnReset').addEventListener('click', () => { S.playing = false; S.dir = 1; S.hold = 0; setX(0); S.face = 1; updatePlayBtn(); });
$('speed').addEventListener('change', e => { S.speed = +e.target.value; });
$('optLoop').addEventListener('change', e => { S.loop = e.target.checked; });
$('optRays').addEventListener('change', e => { S.rays = e.target.checked; dirty = true; });
$('tab2d').addEventListener('click', () => setView('2d'));
$('tab3d').addEventListener('click', () => setView('3d'));
document.querySelectorAll('#camBtns .btn').forEach(b => b.addEventListener('click', () => setCam(b.dataset.cam)));

function syncSettings(){
  const Hmin = Math.max(3.5, Math.ceil(S.h*1.7*4)/4);
  $('inL').min = Hmin; if (S.H < Hmin) S.H = Hmin;
  $('inh').value = S.h; $('inL').value = S.H; $('inD').value = S.D;
  $('vh').textContent = f1(S.h)+' m'; $('vL').textContent = f1(S.H)+' m'; $('vD').textContent = S.D+' m';
}
function changed(){ syncSettings(); layoutDirty = true; dirty = true; }
$('inh').addEventListener('input', e => { S.h = +e.target.value; changed(); });
$('inL').addEventListener('input', e => { S.H = +e.target.value; changed(); });
$('inD').addEventListener('input', e => { const fr = S.x/S.D; S.D = +e.target.value; S.x = fr*S.D; changed(); });
$('btnDefaults').addEventListener('click', () => { const fr = S.x/S.D; S.h = DEF.h; S.H = DEF.H; S.D = DEF.D; S.x = fr*S.D; changed(); });

/* ---------------------------------------------------------------- main loop */
let last = performance.now();
function frame(now){
  const dt = Math.min(0.05, (now-last)/1000); last = now;
  if (S.playing){
    if (S.hold > 0){ S.hold -= dt; S.moveT = 0; dirty = true; }
    else {
      setX(S.x + S.dir*WALK*S.speed*dt); S.moveT = 0.25;
      if (S.x >= S.D || S.x <= 0){
        const side = S.x >= S.D ? 1 : -1;
        if (S.loop){ S.dir = -side; S.hold = 0.8; } else { S.playing = false; updatePlayBtn(); }
      }
    }
  }
  if (S.moveT > 0){ S.moveT -= dt; dirty = true; }
  const want = S.moveT > 0 ? 1 : 0;
  if (Math.abs(S.walkAmp-want) > 0.002){ S.walkAmp += (want-S.walkAmp)*Math.min(1, dt*12); dirty = true; } else S.walkAmp = want;
  if (T){
    const target = S.face > 0 ? Math.PI/2 : -Math.PI/2;
    if (Math.abs(T.yaw-target) > 0.002){ T.yaw += (target-T.yaw)*Math.min(1, dt*10); dirty = true; } else T.yaw = target;
  }
  if (dirty){
    dirty = false;
    ui();
    if (S.view === '2d') draw2D(); else if (T) render3D();
    drawGraph();
  }
  requestAnimationFrame(frame);
}

if (window.ResizeObserver) new ResizeObserver(() => { resize2D(); resize3D(); }).observe($('stage'));
window.addEventListener('resize', () => { resize2D(); resize3D(); });
syncSettings(); resize2D(); updatePlayBtn();
requestAnimationFrame(frame);

window.PSLE.Q.set(document.getElementById('qs'), window.PSLE.data.questions, {});
})();
