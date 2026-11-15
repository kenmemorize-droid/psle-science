/* Follow a meal through the body: 2D canvas + optional Three.js view, checkpoints via the PSLE engine. */
(()=>{
'use strict';
/* ------------------------------------------------------------------ utils */
const $=(s,r=document)=>r.querySelector(s);
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hex2rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mixHex=(a,b,t)=>{const A=hex2rgb(a),B=hex2rgb(b);return `rgb(${(lerp(A[0],B[0],t))|0},${(lerp(A[1],B[1],t))|0},${(lerp(A[2],B[2],t))|0})`;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* --------------------------------------------------------------- geometry */
function catmull(pts,per){
  const out=[],n=pts.length;
  for(let i=0;i<n-1;i++){
    const p0=pts[Math.max(i-1,0)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(i+2,n-1)];
    for(let k=0;k<per;k++){
      const t=k/per,t2=t*t,t3=t2*t,q=[0,0,0];
      for(let d=0;d<3;d++) q[d]=0.5*((2*p1[d])+(-p0[d]+p2[d])*t+(2*p0[d]-5*p1[d]+4*p2[d]-p3[d])*t2+(-p0[d]+3*p1[d]-3*p2[d]+p3[d])*t3);
      out.push(q);
    }
  }
  out.push(pts[n-1].slice());
  return out;
}
const d3=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
function resample(poly,ds){
  const out=[poly[0].slice()];
  let a=poly[0].slice(),i=1,need=ds;
  while(i<poly.length){
    const b=poly[i],seg=d3(a,b);
    if(seg>=need){const t=need/seg;a=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];out.push(a.slice());need=ds;}
    else{need-=seg;a=b.slice();i++;}
  }
  const last=poly[poly.length-1];
  if(d3(out[out.length-1],last)>ds*0.5) out.push(last.slice());
  return out;
}
const DS=3;
function siCtrl(){
  const c=[[318,448,6],[322,470,10],[326,492,12]];
  const rows=7,y0=508,dy=22,xL=262,xR=336;
  for(let k=0;k<rows;k++){
    const y=y0+k*dy,left=k%2===0,a=left?xR:xL,b=left?xL:xR,z=12+4*Math.sin(k*1.7);
    c.push([a,y,z],[(a+b)/2,y+(left?-3:3),z],[b,y,z]);
    if(k<rows-1) c.push([b+(left?-6:6),y+dy/2,z]);
  }
  c.push([244,646,6],[226,652,0]);
  return c;
}
const ORGANS=[
  {id:'mouth',  name:'Mouth',           tissue:'#d06a7c',edge:'#7a2d3b',speed:12,R:()=>26,
    ctrl:[[300,112,10],[300,128,10],[300,150,2]]},
  {id:'gullet', name:'Gullet',          tissue:'#a86a9b',edge:'#5c3a63',speed:52,R:()=>11,
    ctrl:[[300,150,2],[300,190,-4],[299,260,-8],[298,320,-6],[298,345,0]]},
  {id:'stomach',name:'Stomach',         tissue:'#d98a6e',edge:'#8a4630',speed:14,R:t=>9+27*Math.pow(Math.sin(Math.PI*t),0.9),
    ctrl:[[298,345,0],[320,352,6],[352,376,8],[368,408,8],[352,436,6],[326,446,6],[318,448,6]]},
  {id:'small',  name:'Small intestine', tissue:'#e8a2ab',edge:'#b83a52',speed:52,R:()=>9,ctrl:siCtrl()},
  {id:'large',  name:'Large intestine', tissue:'#b9926a',edge:'#9a4a50',speed:44,R:()=>14,
    ctrl:[[222,656,-6],[222,620,-14],[222,540,-18],[222,500,-18],[228,480,-18],[246,470,-18],[300,474,-18],[354,470,-18],[372,480,-18],[378,500,-18],[378,570,-18],[375,610,-14],[358,640,-8],[332,664,-4],[310,686,0],[300,704,0]]},
  {id:'anus',   name:'Anus',            tissue:'#c47b7b',edge:'#7a3a3a',speed:22,R:()=>10,beyond:true,
    ctrl:[[300,704,0],[300,722,0],[300,742,0]]}
];
const OBY={};ORGANS.forEach((o,i)=>{o.idx=i;OBY[o.id]=o;});
const P=[],RAD=[],ORGI=[];
ORGANS.forEach((o,oi)=>{
  let pts=resample(catmull(o.ctrl,16),DS);
  if(P.length&&d3(P[P.length-1],pts[0])<1.5) pts=pts.slice(1);
  o.i0=P.length;
  pts.forEach((q,k)=>{P.push(q);RAD.push(o.R(k/Math.max(1,pts.length-1)));ORGI.push(oi);});
  o.i1=P.length-1;
});
const N=P.length;
const TAN=P.map((_,i)=>{const a=P[Math.max(i-1,0)],b=P[Math.min(i+1,N-1)];const t=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];const l=Math.hypot(...t)||1;return [t[0]/l,t[1]/l,t[2]/l];});
ORGANS.forEach(o=>{
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(let i=o.i0;i<=o.i1;i++){const r=RAD[i];x0=Math.min(x0,P[i][0]-r);x1=Math.max(x1,P[i][0]+r);y0=Math.min(y0,P[i][1]-r);y1=Math.max(y1,P[i][1]+r);}
  if(o.id==='mouth'){x0=256;x1=344;y0=100;y1=156;}
  if(o.id==='large'){y1=Math.max(y1,679);}
  if(o.id==='anus'){x0=262;x1=338;y0=668;y1=750;}
  o.bb=[x0,y0,x1,y1];
});
const LIEND=OBY.large.i1*DS, MAXS=(N-1)*DS;
const VEIN=resample(catmull([[356,650,-2],[356,560,-2],[358,500,0],[385,486,0],[414,470,0],[420,420,0],[420,340,0],[398,302,0],[362,292,0]],16),DS);
const VEINLEN=(VEIN.length-1)*DS;
const BODY_R=[[0,18],[38,26],[66,64],[73,112],[64,152],[44,184],[32,202],[30,236],[74,254],[132,268],[160,298],[166,360],[160,440],[148,520],[150,600],[160,680],[168,770]];
const half=resample(catmull(BODY_R.map(p=>[p[0],p[1],0]),12),4);
const BODY=[...half.map(p=>[300+p[0],p[1]]),...half.slice().reverse().map(p=>[300-p[0],p[1]])];
const HEART=[338,288];

/* ---------------------------------------------------------------- content */
const CONTENT={
  mouth:{does:'Teeth cut and grind the food into small pieces. The tongue mixes the food with saliva and pushes it to the back of the mouth to be swallowed.',
    digested:'Hardly any food is completely digested here. Digestion has only just started.',
    undigested:'Fibre is chewed into smaller pieces too, but it can never be digested.',
    juice:'Saliva is a digestive juice. It mixes with the food and starts to digest it.',
    beyond:'Saliva contains an enzyme that starts to break down starch (in rice and bread) into sugar.'},
  gullet:{does:'A muscular tube that joins the mouth to the stomach. Muscles in its wall squeeze in waves and push the food down.',
    digested:'None yet. The food has not been digested, so nothing passes into the blood here.',
    undigested:'Food and fibre are pushed down together, one squeeze at a time.',
    juice:'No digestive juice is made here. The gullet only moves the food along.',
    beyond:'This wave-like squeezing is called peristalsis. It works even when you swallow upside down.'},
  stomach:{does:'A stretchy bag with strong muscles. The muscles churn the food while gastric juice mixes in, turning the food into a thick liquid.',
    digested:'Food is only partly digested here. The pieces are not yet small enough to pass into the blood.',
    undigested:'Fibre is churned along with the rest of the food, but the juice cannot digest it. It moves on to the small intestine.',
    juice:'Gastric juice is made by the wall of the stomach. It digests the food, and its acid kills many germs.',
    beyond:'The acid in gastric juice is hydrochloric acid, and an enzyme called pepsin digests protein.'},
  small:{does:'The longest part of the digestive system, about 6 m in an adult. Digestion is finished here, and the digested food passes through its thin wall into the blood.',
    digested:'The food is now completely digested into tiny pieces that dissolve. They pass through the wall of the small intestine into the blood, which carries them to all parts of the body.',
    undigested:'Fibre cannot be digested or absorbed. It stays inside the tube and moves on to the large intestine.',
    juice:'Digestive juices finish digesting the food here.',
    beyond:'Bile from the liver and juice from the pancreas also flow in. The inner wall is covered with tiny finger-like villi, which give a large surface for absorption.'},
  large:{does:'A wide tube, shorter than the small intestine. It receives the undigested food, absorbs water from it, and the rest becomes solid waste called faeces.',
    digested:'None arrives here. All the digested food was already absorbed into the blood in the small intestine.',
    undigested:'Undigested food arrives as a watery mixture. Water is absorbed from it into the blood, and what is left becomes faeces.',
    juice:'No digestive juice is added here.',
    beyond:'The last part of the large intestine is the rectum, where faeces are stored until they are passed out.'},
  anus:{does:'The opening at the end of the digestive system. Faeces are pushed out of the body through it.',
    digested:'None. The digested food was absorbed much earlier, in the small intestine.',
    undigested:'Undigested food leaves the body as faeces.',
    juice:'No digestive juice is added here.',
    beyond:'Passing faeces out of the body is called egestion.'}
};
const CALL={
  mouth:[{a:[326,117,10],dx:100,dy:-34,text:'Teeth cut and grind the food'},{a:[272,136,10],dx:-104,dy:30,text:'Saliva mixes with the food'}],
  gullet:[{a:[299,262,-8],dx:112,dy:-8,text:'Muscles squeeze the food down'}],
  stomach:[{a:[374,404,8],dx:96,dy:-36,text:'Muscles churn the food'},{a:[330,370,6],dx:-104,dy:-40,text:'Gastric juice digests it into a thick liquid'}],
  small:[{a:[300,527,12],dx:-150,dy:-70,text:'Digestive juices finish digesting the food'},
         {a:[336,596,12],dx:140,dy:44,text:'Digested food passes through the wall into the blood'},
         {a:[356,545,-2],dx:150,dy:-34,text:'Blood carries it to all parts of the body'},
         {a:[262,640,6],dx:-130,dy:54,text:'Undigested food moves on'}],
  large:[{a:[222,560,-18],dx:-128,dy:-8,text:'Water is absorbed from the undigested food'},
         {a:[378,560,-18],dx:128,dy:6,text:'What is left becomes faeces'},
         {a:[224,650,-6],dx:-128,dy:50,text:'Undigested food arrives from the small intestine'}],
  anus:[{a:[300,730,0],dx:120,dy:8,text:'Faeces leave the body'}]
};
const NAMES=[
  {id:'mouth',a:[342,126,10],dx:78,dy:-6,text:'Mouth'},
  {id:'gullet',a:[299,232,-8],dx:-84,dy:0,text:'Gullet'},
  {id:'stomach',a:[392,398,8],dx:70,dy:-14,text:'Stomach'},
  {id:'small',a:[300,570,12],dx:-165,dy:-10,text:'Small intestine'},
  {id:'large',a:[222,540,-18],dx:-120,dy:-52,text:'Large intestine'},
  {id:'anus',a:[300,730,0],dx:88,dy:4,text:'Anus'}
];
const MATRIX=[
  {k:'food',label:'Food not yet digested',cells:{mouth:'chewed',gullet:'pushed down',stomach:'churned',small:'finished off'}},
  {k:'dig',label:'Digested food',cells:{small:'absorbed into blood'}},
  {k:'fibre',label:'Undigested food',cells:{mouth:'chewed',gullet:'pushed down',stomach:'churned',small:'passes through',large:'becomes faeces',anus:'leaves body'}},
  {k:'water',label:'Water',cells:{large:'absorbed'}}
];
const QS=window.PSLE.data.questions.filter(q=>q.journey);
const CPS=QS.map((q,i)=>({id:q.id.split('.').pop(),after:q.journey.after,next:q.journey.next,n:i+1,q:q}));
const CPBY={};CPS.forEach(c=>{CPBY[c.id]=c;});
const CP_AFTER={};CPS.forEach(c=>CP_AFTER[c.after]=c);

/* ------------------------------------------------------------------ state */
const S={view:'2d',sel:null,beyond:false,paused:false,speed:reduce?0.5:1,
  filters:{food:true,dig:true,fibre:true,juice:true,water:true},
  mode:'intro',cp:null,cpDone:false,flow:false};
const att=id=>window.PSLE.attempts().filter(r=>r.q===CPBY[id].q.id&&r.mode==='page');
const lastOk=id=>{const a=att(id);return a.length?a[a.length-1].ok:null;};
const everWrong=id=>att(id).some(a=>!a.ok);
const unresolved=()=>CPS.filter(c=>everWrong(c.id)&&lastOk(c.id)===false).length;

/* ------------------------------------------------------------- simulation */
const SPEED=ORGANS.map(o=>o.speed);
const oiAt=s=>ORGI[clamp(Math.round(s/DS),0,N-1)];
let parts=[],tSim=0,heartPulse=0,bloodQ=[];
const tN={food:0,fibre:0.7,juice:0};
const SI=OBY.small,LI=OBY.large,MO=OBY.mouth;
function spawnFood(){parts.push({type:'food',s:MO.i0*DS+rand(0,6),u:rand(-.6,.6),v:rand(-.6,.6),size:6.2,spd:rand(.85,1.15),conv:rand(.12,.34),rot:rand(0,6.28),rs:rand(-1.2,1.2),shape:(Math.random()*3)|0,seed:rand(0,6.28),chyme:0});}
function spawnFibre(){parts.push({type:'fibre',s:MO.i0*DS+rand(0,6),u:rand(-.6,.6),v:rand(-.6,.6),size:5.4,spd:rand(.85,1.15),rot:rand(0,6.28),rs:rand(-.8,.8),shape:(Math.random()*3)|0,seed:rand(0,6.28),dark:0,watered:false});}
function spawnJuice(){
  const r=Math.random(),o=r<.22?MO:r<.5?OBY.stomach:SI;
  parts.push({type:'juice',s:rand(o.i0,o.i1)*DS,u:(Math.random()<.5?-1:1)*.98,v:rand(-.4,.4),age:0,life:rand(1.1,1.7),size:1.9,alpha:1});
}
function spawnBlood(){parts.push({type:'blood',s:0,size:2.1,u:0,v:0});}
function wander(p,dt,k){
  p.u+=(Math.random()-.5)*k*dt*6-p.u*dt*.9;
  p.v+=(Math.random()-.5)*k*dt*6-p.v*dt*.9;
  const m=Math.hypot(p.u,p.v);if(m>1){p.u/=m;p.v/=m;}
}
function absorbStep(p,dt){
  const k=Math.min(1,dt*1.9);
  p.u+=(p.tu-p.u)*k;p.v+=(p.tv-p.v)*k;
  const r=Math.hypot(p.u,p.v);
  p.fade=r>1?clamp((1.22-r)/.22,0,1):1;
  return r>1.22;
}
function pickAbsorb(p){p.absorbing=true;const a=rand(-.9,.9),sg=Math.random()<.5?-1:1;p.tu=sg*Math.cos(a)*1.45;p.tv=Math.sin(a)*1.45;}
function stepP(p,dt,endS){
  if(p.type==='blood'){p.s+=70*dt;if(p.s>=VEINLEN){p.dead=true;heartPulse=1;}return;}
  if(p.type==='juice'){
    p.age+=dt;p.u*=(1-dt*1.7);p.v*=(1-dt*1.0);p.s+=SPEED[oiAt(p.s)]*.12*dt;
    p.alpha=1-(p.age/p.life)*(p.age/p.life);
    if(p.age>=p.life) p.dead=true;return;
  }
  const oi=oiAt(p.s),o=ORGANS[oi],prog=clamp((p.s/DS-o.i0)/Math.max(1,o.i1-o.i0),0,1);
  if(p.type==='food'){
    const tg=oi===0?6.2-1.7*prog:oi===1?4.5:oi===2?4.5-1.5*prog:3.0-.5*prog;
    p.size+=(tg-p.size)*Math.min(1,dt*3);
    p.chyme=oi<2?0:oi===2?prog:1;
    if(oi===0){p.u=Math.sin(tSim*5+p.seed)*.55;p.v=Math.cos(tSim*4+p.seed)*.4;}
    else if(oi===2){const a=1.5*dt,c=Math.cos(a),s=Math.sin(a),u=p.u*c-p.v*s,v=p.u*s+p.v*c;p.u=u;p.v=v;wander(p,dt,.8);}
    else wander(p,dt,.6);
    p.s+=SPEED[oi]*p.spd*dt;p.rot+=p.rs*dt;
    if(oi===3&&prog>p.conv){
      for(let k=0;k<3;k++) parts.push({type:'dig',s:p.s+rand(-3,3),u:clamp(p.u+rand(-.3,.3),-.9,.9),v:clamp(p.v+rand(-.3,.3),-.9,.9),size:1.9,spd:rand(.9,1.1),absS:(SI.i0+(SI.i1-SI.i0)*rand(.45,.92))*DS,absorbing:false,fade:1});
      p.dead=true;
    }
  }else if(p.type==='fibre'){
    const tg=oi===0?5.4-1.0*prog:oi===4?4.4-.8*prog:4.4;
    p.size+=(tg-p.size)*Math.min(1,dt*3);
    p.dark=oi===4?prog:oi>4?1:0;
    if(oi===0){p.u=Math.sin(tSim*5+p.seed)*.55;p.v=Math.cos(tSim*4+p.seed)*.4;}
    else if(oi===2){const a=1.2*dt,c=Math.cos(a),s=Math.sin(a),u=p.u*c-p.v*s,v=p.u*s+p.v*c;p.u=u;p.v=v;wander(p,dt,.8);}
    else wander(p,dt,.5);
    p.s+=SPEED[oi]*p.spd*(oi===4?.85:1)*dt;p.rot+=p.rs*dt;
    if(oi===4&&!p.watered){
      p.watered=true;
      for(let k=0;k<2;k++) parts.push({type:'water',s:p.s+rand(-6,6),u:clamp(p.u+rand(-.4,.4),-.9,.9),v:clamp(p.v+rand(-.4,.4),-.9,.9),size:1.9,spd:rand(.85,1),absS:(LI.i0+(LI.i1-LI.i0)*rand(.2,.7))*DS,absorbing:false,fade:1});
    }
  }else if(p.type==='dig'||p.type==='water'){
    const base=p.type==='dig'?3:4;
    p.s+=SPEED[base]*p.spd*(p.absorbing?.2:1)*(p.type==='water'?.85:1)*dt;
    if(!p.absorbing){wander(p,dt,1);if(p.s>=p.absS||oiAt(p.s)!==base) pickAbsorb(p);}
    else if(absorbStep(p,dt)){p.dead=true;if(p.type==='dig') bloodQ.push(tSim+rand(.3,.9));}
  }
  if(p.s>=endS) p.dead=true;
}
function sim(dt){
  tSim+=dt;
  tN.food-=dt;while(tN.food<=0){tN.food+=1.5;spawnFood();}
  tN.fibre-=dt;while(tN.fibre<=0){tN.fibre+=2.3;spawnFibre();}
  tN.juice-=dt;while(tN.juice<=0){tN.juice+=.16;spawnJuice();}
  for(let k=bloodQ.length-1;k>=0;k--) if(tSim>=bloodQ[k]){bloodQ.splice(k,1);spawnBlood();}
  heartPulse=Math.max(0,heartPulse-dt*2.5);
  const endS=S.beyond?MAXS:LIEND;
  for(const p of parts) stepP(p,dt,endS);
  parts=parts.filter(p=>!p.dead);
}
for(let i=0;i<1300;i++) sim(.05);

const tmp={x:0,y:0,z:0};
function posOf(p){
  if(p.type==='blood'){
    const idx=clamp(p.s/DS,0,VEIN.length-1.001),i=idx|0,f=idx-i,a=VEIN[i],b=VEIN[i+1];
    tmp.x=lerp(a[0],b[0],f);tmp.y=lerp(a[1],b[1],f);tmp.z=lerp(a[2],b[2],f);return tmp;
  }
  const idx=clamp(p.s/DS,0,N-1.001),i=idx|0,f=idx-i,a=P[i],b=P[i+1],R=RAD[i],t=TAN[i];
  const nl=Math.hypot(t[0],t[1])||1,nx=-t[1]/nl,ny=t[0]/nl;
  const lat=(p.type==='dig'||p.type==='water'||p.type==='juice')?R*.95:Math.max(.5,R*.9-p.size);
  tmp.x=lerp(a[0],b[0],f)+nx*p.u*lat;tmp.y=lerp(a[1],b[1],f)+ny*p.u*lat;tmp.z=lerp(a[2],b[2],f)+p.v*lat;
  return tmp;
}
const typeKey=p=>p.type==='blood'?'dig':p.type;
const partOrgan=p=>p.type==='blood'?'small':ORGANS[oiAt(p.s)].id;
const dimmed=p=>S.sel&&partOrgan(p)!==S.sel;

/* ---------------------------------------------------------------- stage */
const stage=$('#stage'),c2d=$('#c2d'),c3d=$('#c3d'),hint=$('#hint');
let W=800,H=600,DPR=1;
const v2={x:300,y:394,s:.7},v2t={x:300,y:394,s:.7};
const cam={x:0,y:4,z:0,theta:0,pitch:.05,dist:1300},camT={x:0,y:4,z:0,theta:0,pitch:.05,dist:1300};
const TANH=Math.tan(19*Math.PI/180);

function setTargets(){
  const aspect=W/H;
  if(!S.sel){
    v2t.x=300;v2t.y=394;v2t.s=Math.min(H*.94/770,W*.84/340);
    camT.x=0;camT.y=4;camT.z=0;camT.theta=0;camT.pitch=.05;
    camT.dist=Math.max(770/(.92*2*TANH),340/(.8*2*TANH*aspect));
  }else{
    const o=OBY[S.sel],[x0,y0,x1,y1]=o.bb,bw=x1-x0+30,bh=y1-y0+30;
    v2t.x=(x0+x1)/2;v2t.y=(y0+y1)/2;v2t.s=clamp(Math.min(W*.58/bw,H*.76/bh),.5,4.6);
    camT.x=(x0+x1)/2-300;camT.y=400-(y0+y1)/2;camT.z=0;camT.theta=.28;camT.pitch=.1;
    camT.dist=Math.max(bh/(.78*2*TANH),bw/(.58*2*TANH*aspect),150);
  }
  if(reduce){Object.assign(v2,v2t);Object.assign(cam,camT);}
}
function resize(){
  const r=stage.getBoundingClientRect();
  W=Math.max(200,r.width);H=Math.max(200,r.height);DPR=Math.min(window.devicePixelRatio||1,2);
  c2d.width=W*DPR;c2d.height=H*DPR;
  if(T3.ready){T3.renderer.setPixelRatio(DPR);T3.renderer.setSize(W,H,false);T3.camera.aspect=W/H;T3.camera.updateProjectionMatrix();}
  if(!userMoved) setTargets();
}
let userMoved=false;
new ResizeObserver(resize).observe(stage);

/* ------------------------------------------------------------ 2D renderer */
const ctx=c2d.getContext('2d');
const bodyPath=new Path2D();BODY.forEach((p,i)=>i?bodyPath.lineTo(p[0],p[1]):bodyPath.moveTo(p[0],p[1]));bodyPath.closePath();
function linePath(o,pre){const p=new Path2D();if(pre)p.moveTo(pre[0],pre[1]);for(let i=o.i0;i<=o.i1;i++){(i===o.i0&&!pre)?p.moveTo(P[i][0],P[i][1]):p.lineTo(P[i][0],P[i][1]);}return p;}
ORGANS.forEach(o=>{if(o.id!=='mouth') o.line=linePath(o,o.id==='large'?[222,664]:null);});
function stampPath(o,sc,add){const p=new Path2D();for(let i=o.i0;i<=o.i1;i++){const r=RAD[i]*sc+add;p.moveTo(P[i][0]+r,P[i][1]);p.arc(P[i][0],P[i][1],r,0,6.2832);}return p;}
const st=OBY.stomach;st.pEdge=stampPath(st,1,3);st.pTis=stampPath(st,1,0);st.pLum=stampPath(st,.64,0);
st.cx=(st.bb[0]+st.bb[2])/2;st.cy=(st.bb[1]+st.bb[3])/2;
const veinPath=new Path2D();VEIN.forEach((p,i)=>i?veinPath.lineTo(p[0],p[1]):veinPath.moveTo(p[0],p[1]));
const LUMEN='#141d2b';
const EDGEW={gullet:3,small:3.5,large:4,anus:3};
const SHAPES=[[.9,.5,1,.6,.95,.4,.8],[.6,1,.5,.9,.45,1,.7],[1,.7,.45,.85,1,.55,.6]];
let hover=null;
const lw=px=>px/v2.s;

function drawTube(o,alpha,hot){
  ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.lineJoin='round';
  const R=RAD[o.i0],e=EDGEW[o.id]||3;
  if(hot){ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=2*R+e+lw(7);ctx.stroke(o.line);}
  ctx.strokeStyle=o.edge;ctx.lineWidth=2*R+e;ctx.stroke(o.line);
  ctx.strokeStyle=o.tissue;ctx.lineWidth=2*R;ctx.stroke(o.line);
  ctx.strokeStyle=LUMEN;ctx.lineWidth=2*R*.64;ctx.stroke(o.line);
}
function drawStomach(alpha,hot){
  ctx.save();ctx.globalAlpha=alpha;
  const sc=1+.025*Math.sin(tSim*2.2);
  ctx.translate(st.cx,st.cy);ctx.scale(sc,sc);ctx.translate(-st.cx,-st.cy);
  if(hot){ctx.fillStyle='rgba(255,255,255,.7)';ctx.fill(st.pEdge);ctx.lineWidth=lw(7);ctx.strokeStyle='rgba(255,255,255,.7)';ctx.stroke(st.pEdge);}
  ctx.fillStyle=st.edge;ctx.fill(st.pEdge);
  ctx.fillStyle=st.tissue;ctx.fill(st.pTis);
  ctx.fillStyle=LUMEN;ctx.fill(st.pLum);
  ctx.restore();
}
function drawMouth(alpha,hot){
  ctx.globalAlpha=alpha;
  ctx.beginPath();ctx.ellipse(300,128,43,28,0,0,6.2832);
  if(hot){ctx.lineWidth=lw(8);ctx.strokeStyle='rgba(255,255,255,.7)';ctx.stroke();}
  ctx.fillStyle=MO.tissue;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=MO.edge;ctx.stroke();
  ctx.beginPath();ctx.ellipse(300,128,36,21,0,0,6.2832);ctx.fillStyle=LUMEN;ctx.fill();
  ctx.fillStyle='#e9788c';ctx.beginPath();ctx.ellipse(300,140,23,8.5,0,0,6.2832);ctx.fill();
  ctx.fillStyle='#fdfdfb';
  for(let k=-3;k<=3;k++){
    const x=300+k*9.6,dy=Math.abs(k)*1.1;
    ctx.beginPath();ctx.roundRect(x-4,107+dy*.6,8,9,2);ctx.fill();
    ctx.beginPath();ctx.roundRect(x-4,141-dy*.3,8,9,2);ctx.fill();
  }
}
function drawHeart(){
  const s=17*(1+.07*Math.sin(tSim*6)+.12*heartPulse),[cx,cy]=HEART;
  ctx.beginPath();ctx.moveTo(cx,cy+s*.95);
  ctx.bezierCurveTo(cx-s*1.5,cy+s*.1,cx-s*1.0,cy-s*1.0,cx,cy-s*.38);
  ctx.bezierCurveTo(cx+s*1.0,cy-s*1.0,cx+s*1.5,cy+s*.1,cx,cy+s*.95);
  ctx.fillStyle='#d6354b';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#7d1626';ctx.stroke();
}
function chunkShape(x,y,r,rot,shape,fill,stroke){
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();
  const sh=SHAPES[shape];
  for(let k=0;k<7;k++){const a=k/7*6.2832,rr=r*(.8+.3*sh[k]);k?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}
  ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=Math.max(.5,r*.14);ctx.strokeStyle=stroke;ctx.stroke();
  ctx.restore();
}
function dropShape(x,y,r,fill,glow){
  ctx.beginPath();ctx.arc(x,y,r*2.3,0,6.2832);ctx.fillStyle=glow;ctx.fill();
  ctx.beginPath();ctx.moveTo(x,y-r*1.8);ctx.bezierCurveTo(x+r*.2,y-r,x+r,y-r*.3,x+r,y+r*.4);
  ctx.arc(x,y+r*.4,r,0,Math.PI,false);ctx.bezierCurveTo(x-r,y-r*.3,x-r*.2,y-r,x,y-r*1.8);ctx.closePath();
  ctx.fillStyle=fill;ctx.fill();
}
function draw2D(dt){
  const k=reduce?1:1-Math.exp(-dt*5.5);
  v2.x+=(v2t.x-v2.x)*k;v2.y+=(v2t.y-v2.y)*k;v2.s*=Math.exp(Math.log(v2t.s/v2.s)*k);
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);
  ctx.setTransform(DPR*v2.s,0,0,DPR*v2.s,DPR*(W/2-v2.x*v2.s),DPR*(H/2-v2.y*v2.s));
  ctx.globalAlpha=1;
  ctx.fillStyle='rgba(150,215,225,.07)';ctx.fill(bodyPath);
  ctx.lineWidth=lw(2);ctx.strokeStyle='rgba(170,225,235,.4)';ctx.stroke(bodyPath);
  ctx.fillStyle='rgba(190,235,242,.55)';
  ctx.beginPath();ctx.arc(278,84,3.4,0,6.2832);ctx.arc(322,84,3.4,0,6.2832);ctx.fill();
  drawHeart();
  const alphaOf=id=>S.sel&&S.sel!==id?.42:1;
  const hotOf=id=>hover===id||S.sel===id;
  ctx.globalAlpha=alphaOf('small')*.9;
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.strokeStyle='#7d1626';ctx.lineWidth=7;ctx.stroke(veinPath);
  ctx.strokeStyle='#e0455a';ctx.lineWidth=4;ctx.stroke(veinPath);
  drawTube(LI,alphaOf('large'),hotOf('large'));
  drawTube(SI,alphaOf('small'),hotOf('small'));
  drawStomach(alphaOf('stomach'),hotOf('stomach'));
  drawTube(OBY.gullet,alphaOf('gullet'),hotOf('gullet'));
  if(S.beyond){
    drawTube(OBY.anus,alphaOf('anus'),hotOf('anus'));
    ctx.globalAlpha=alphaOf('anus');ctx.strokeStyle='#f3c0b0';ctx.lineWidth=lw(2);
    ctx.beginPath();ctx.ellipse(300,716,11,3.2,0,0,6.2832);ctx.stroke();
  }
  drawMouth(alphaOf('mouth'),hotOf('mouth'));
  // peristalsis bands
  const gu=OBY.gullet,gl=(gu.i1-gu.i0);
  ctx.globalAlpha=alphaOf('gullet');ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=lw(2.4);
  for(let q=0;q<3;q++){
    const i=gu.i0+Math.floor(((tSim*9+q*gl/3)%gl)),pp=P[i],R=RAD[i]+1;
    ctx.beginPath();ctx.moveTo(pp[0]-R,pp[1]-1.5);ctx.quadraticCurveTo(pp[0],pp[1]+3,pp[0]+R,pp[1]-1.5);ctx.stroke();
  }
  // particles
  for(const p of parts){
    if(!S.filters[typeKey(p)]) continue;
    const q=posOf(p);
    ctx.globalAlpha=dimmed(p)?.35:1;
    switch(p.type){
      case 'food':chunkShape(q.x,q.y,p.size,p.rot,p.shape,mixHex('#ffb347','#ffe6b0',p.chyme),'#a55f12');break;
      case 'fibre':{chunkShape(q.x,q.y,p.size,p.rot,p.shape,mixHex('#b07a4a','#6e4a2a',p.dark),'#3d2610');
        ctx.save();ctx.translate(q.x,q.y);ctx.rotate(p.rot);ctx.strokeStyle='rgba(235,200,150,.7)';ctx.lineWidth=Math.max(.4,p.size*.1);
        ctx.beginPath();ctx.moveTo(-p.size*.6,-p.size*.15);ctx.lineTo(p.size*.6,-p.size*.15);ctx.moveTo(-p.size*.5,p.size*.25);ctx.lineTo(p.size*.5,p.size*.25);ctx.stroke();ctx.restore();break;}
      case 'dig':case 'blood':{
        const f=p.fade===undefined?1:p.fade,r=p.size*(.4+.6*f);
        ctx.beginPath();ctx.arc(q.x,q.y,r*2.2,0,6.2832);ctx.fillStyle='rgba(255,225,77,.28)';ctx.fill();
        ctx.beginPath();ctx.arc(q.x,q.y,r,0,6.2832);ctx.fillStyle='#ffe14d';ctx.fill();
        ctx.beginPath();ctx.arc(q.x-r*.3,q.y-r*.3,r*.35,0,6.2832);ctx.fillStyle='#fffbe0';ctx.fill();break;}
      case 'juice':ctx.globalAlpha=(dimmed(p)?.35:1)*clamp(p.alpha*1.4,0,1);dropShape(q.x,q.y,p.size,'#d17cff','rgba(209,124,255,.25)');break;
      case 'water':{const f=p.fade===undefined?1:p.fade;ctx.globalAlpha=(dimmed(p)?.35:1)*f;dropShape(q.x,q.y,p.size,'#5cc8ff','rgba(92,200,255,.25)');break;}
    }
  }
  ctx.globalAlpha=1;
}
function pick2D(wx,wy){
  let best=null,bd=1e9;
  const test=(id,d)=>{if(d<bd){bd=d;best=id;}};
  if(((wx-300)/43)**2+((wy-128)/28)**2<=1) test('mouth',-20);
  for(const o of ORGANS){
    if(o.id==='mouth'||(o.id==='anus'&&!S.beyond)) continue;
    for(let i=o.i0;i<=o.i1;i++){const d=Math.hypot(wx-P[i][0],wy-P[i][1])-RAD[i];if(d<4) test(o.id,d);}
    if(o.id==='large'){const d=Math.hypot(wx-222,wy-664)-14;if(d<4) test('large',d);}
  }
  return bd<4?best:null;
}
const toWorld2D=(px,py)=>({x:(px-W/2)/v2.s+v2.x,y:(py-H/2)/v2.s+v2.y});

/* ------------------------------------------------------------ 3D renderer */
const T3={ready:false,failed:false};
const toV=a=>new THREE.Vector3(a[0]-300,400-a[1],a[2]);
function buildTube(pts,rads,seg){
  const n=pts.length,pos=new Float32Array(n*seg*3),idx=[];
  const nrm=new THREE.Vector3(),tan=new THREE.Vector3(),bin=new THREE.Vector3();
  for(let k=0;k<n;k++){
    tan.subVectors(pts[Math.min(k+1,n-1)],pts[Math.max(k-1,0)]).normalize();
    if(k===0){nrm.set(0,0,1);if(Math.abs(tan.dot(nrm))>.9)nrm.set(1,0,0);}
    nrm.sub(tan.clone().multiplyScalar(nrm.dot(tan))).normalize();
    bin.crossVectors(tan,nrm);
    for(let j=0;j<seg;j++){
      const a=j/seg*Math.PI*2,cx=Math.cos(a)*rads[k],cy=Math.sin(a)*rads[k],o=(k*seg+j)*3;
      pos[o]=pts[k].x+nrm.x*cx+bin.x*cy;pos[o+1]=pts[k].y+nrm.y*cx+bin.y*cy;pos[o+2]=pts[k].z+nrm.z*cx+bin.z*cy;
    }
  }
  for(let k=0;k<n-1;k++)for(let j=0;j<seg;j++){
    const a=k*seg+j,b=k*seg+(j+1)%seg,c=(k+1)*seg+j,d=(k+1)*seg+(j+1)%seg;idx.push(a,b,c,b,d,c);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function centered(geom,mat,organ){
  geom.computeBoundingBox();const c=new THREE.Vector3();geom.boundingBox.getCenter(c);geom.translate(-c.x,-c.y,-c.z);
  const m=new THREE.Mesh(geom,mat);m.position.copy(c);m.userData.organ=organ;return m;
}
function init3D(){
  if(T3.ready) return true;
  if(T3.failed||!window.THREE) return false;
  try{
    const renderer=new THREE.WebGLRenderer({canvas:c3d,antialias:true,alpha:true});
    renderer.setPixelRatio(DPR);renderer.setSize(W,H,false);renderer.setClearColor(0x000000,0);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,W/H,5,6000);
    scene.add(new THREE.AmbientLight(0xffffff,.62));
    const l1=new THREE.DirectionalLight(0xffffff,.7);l1.position.set(200,300,500);scene.add(l1);
    const l2=new THREE.DirectionalLight(0x8fd0ff,.45);l2.position.set(-300,100,-250);scene.add(l2);
    Object.assign(T3,{renderer,scene,camera,organMeshes:[],mats:{}});
    // body shell
    const shape=new THREE.Shape();BODY.forEach((p,i)=>i?shape.lineTo(p[0]-300,400-p[1]):shape.moveTo(p[0]-300,400-p[1]));
    const sg=new THREE.ExtrudeGeometry(shape,{depth:96,bevelEnabled:true,bevelThickness:8,bevelSize:6,bevelSegments:3,curveSegments:1});
    sg.translate(0,0,-48);
    const shell=new THREE.Mesh(sg,new THREE.MeshPhongMaterial({color:0x8fd3e3,transparent:true,opacity:.09,side:THREE.DoubleSide,depthWrite:false}));
    shell.renderOrder=0;scene.add(shell);
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(sg,35),new THREE.LineBasicMaterial({color:0x9fe0ee,transparent:true,opacity:.22}));scene.add(edges);
    // organs
    const mk=(o,extra)=>{
      const mat=new THREE.MeshPhongMaterial({color:o.tissue,emissive:new THREE.Color(o.tissue).multiplyScalar(.06),transparent:true,opacity:.4,side:THREE.DoubleSide,depthWrite:false,shininess:30,specular:0x222222});
      T3.mats[o.id]=T3.mats[o.id]||[];T3.mats[o.id].push(mat);return mat;
    };
    ORGANS.forEach(o=>{
      let mesh;
      if(o.id==='mouth'){
        mesh=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),mk(o));mesh.scale.set(40,24,26);mesh.position.copy(toV([300,128,10]));mesh.userData.organ='mouth';
        const tongue=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),new THREE.MeshPhongMaterial({color:0xe9788c}));tongue.scale.set(20,7,14);tongue.position.copy(toV([300,140,10]));
        const tm=new THREE.MeshPhongMaterial({color:0xfdfdfb});
        for(let k=-3;k<=3;k++){for(const top of [1,0]){const t=new THREE.Mesh(new THREE.BoxGeometry(7,8,6),tm);t.position.copy(toV([300+k*9.5,top?111:146,10+22-Math.abs(k)*1.5]));scene.add(t);}}
        scene.add(tongue);
      }else{
        const pts=[],rads=[];for(let i=o.i0;i<=o.i1;i++){pts.push(toV(P[i]));rads.push(RAD[i]);}
        mesh=centered(buildTube(pts,rads,14),mk(o),o.id);
      }
      mesh.renderOrder=2;scene.add(mesh);T3.organMeshes.push(mesh);o.mesh=mesh;
    });
    const pouch=new THREE.Mesh(new THREE.SphereGeometry(14,16,12),mk(LI));pouch.position.copy(toV([222,662,-8]));pouch.userData.organ='large';pouch.renderOrder=2;scene.add(pouch);T3.organMeshes.push(pouch);
    // vein + heart
    const vp=VEIN.map(toV),vm=new THREE.MeshPhongMaterial({color:0xe0455a,transparent:true,opacity:.9});
    const vein=new THREE.Mesh(buildTube(vp,vp.map(()=>2.4),8),vm);vein.renderOrder=1;scene.add(vein);T3.vein=vm;
    const heart=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),new THREE.MeshPhongMaterial({color:0xd6354b,shininess:50}));heart.scale.set(22,24,18);heart.position.copy(toV([HEART[0],HEART[1],0]));scene.add(heart);T3.heart=heart;
    // peristalsis rings
    T3.rings=[];const gu=OBY.gullet;
    for(let q=0;q<3;q++){const r=new THREE.Mesh(new THREE.TorusGeometry(RAD[gu.i0]+1.5,1.1,6,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.65}));r.rotation.x=Math.PI/2;scene.add(r);T3.rings.push(r);}
    // particles
    const inst=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),new THREE.MeshLambertMaterial({color:0xffffff}),600);
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);inst.frustumCulled=false;inst.renderOrder=1;scene.add(inst);T3.inst=inst;
    inst.setColorAt(0,new THREE.Color(1,1,1));
    T3.dummy=new THREE.Object3D();T3.col=new THREE.Color();T3.ray=new THREE.Raycaster();
    T3.ready=true;
    Object.assign(cam,camT);
    return true;
  }catch(e){T3.failed=true;console.warn('3D unavailable',e);return false;}
}
const PCOL={food:new THREE.Color(0xffb347),chyme:new THREE.Color(0xffe6b0),fibre:new THREE.Color(0xb07a4a),fibreD:new THREE.Color(0x6e4a2a),dig:new THREE.Color(0xffe14d),juice:new THREE.Color(0xd17cff),water:new THREE.Color(0x5cc8ff)};
function draw3D(dt){
  const T=T3,k=reduce?1:1-Math.exp(-dt*5.5);
  for(const key of ['x','y','z','theta','pitch']) cam[key]+=(camT[key]-cam[key])*k;
  cam.dist*=Math.exp(Math.log(camT.dist/cam.dist)*k);
  const cp=Math.cos(cam.pitch);
  T.camera.position.set(cam.x+cam.dist*Math.sin(cam.theta)*cp,cam.y+cam.dist*Math.sin(cam.pitch),cam.z+cam.dist*Math.cos(cam.theta)*cp);
  T.camera.lookAt(cam.x,cam.y,cam.z);
  for(const o of ORGANS){
    const on=!!S.sel,isSel=S.sel===o.id,tg=on?(isSel?.42:.12):.36,vis=o.id!=='anus'||S.beyond;
    for(const m of T.mats[o.id]){m.opacity+=((vis?tg:0)-m.opacity)*Math.min(1,dt*6);m.visible=m.opacity>.01;}
  }
  T.mats.anus.forEach(m=>{});
  if(T.vein) T.vein.opacity=S.sel&&S.sel!=='small'?.3:.9;
  const sc=1+.025*Math.sin(tSim*2.2);OBY.stomach.mesh.scale.setScalar(sc);
  T.heart.scale.set(22,24,18).multiplyScalar(1+.07*Math.sin(tSim*6)+.12*heartPulse);
  const gu=OBY.gullet,gl=gu.i1-gu.i0;
  T.rings.forEach((r,q)=>{const i=gu.i0+Math.floor(((tSim*9+q*gl/3)%gl)),p=toV(P[i]);r.position.copy(p);});
  let n=0;const d=T.dummy,c=T.col;
  for(const p of parts){
    const key=typeKey(p);if(!S.filters[key]) continue;
    if(p.type==='anus'||(!S.beyond&&p.type!=='blood'&&p.s>LIEND)) continue;
    const q=posOf(p);d.position.set(q.x-300,400-q.y,q.z);
    const dim=dimmed(p)?.55:1;let r=p.size,col;
    if(p.type==='food'){c.copy(PCOL.food).lerp(PCOL.chyme,p.chyme);d.scale.set(r,r*.8,r*.9);d.rotation.set(p.rot,p.rot*.7,p.rot*.4);}
    else if(p.type==='fibre'){c.copy(PCOL.fibre).lerp(PCOL.fibreD,p.dark);d.scale.set(r*1.2,r*.7,r*.8);d.rotation.set(p.rot*.6,p.rot,p.rot*.3);}
    else if(p.type==='dig'||p.type==='blood'){c.copy(PCOL.dig);const f=p.fade===undefined?1:p.fade;r*=(.4+.6*f);d.scale.setScalar(r*1.3);d.rotation.set(0,0,0);}
    else if(p.type==='juice'){c.copy(PCOL.juice);r*=.45+.55*clamp(p.alpha,0,1);d.scale.setScalar(r);d.rotation.set(0,0,0);}
    else{c.copy(PCOL.water);const f=p.fade===undefined?1:p.fade;d.scale.setScalar(r*(.4+.6*f));d.rotation.set(0,0,0);}
    c.multiplyScalar(dim);d.updateMatrix();T.inst.setMatrixAt(n,d.matrix);T.inst.setColorAt(n,c);n++;
    if(n>=600) break;
  }
  T.inst.count=n;T.inst.instanceMatrix.needsUpdate=true;if(T.inst.instanceColor) T.inst.instanceColor.needsUpdate=true;
  T.renderer.render(T.scene,T.camera);
}
function pick3D(px,py){
  const T=T3;T.ray.setFromCamera({x:px/W*2-1,y:-(py/H)*2+1},T.camera);
  const vis=T.organMeshes.filter(m=>m.userData.organ!=='anus'||S.beyond);
  const hit=T.ray.intersectObjects(vis,false)[0];return hit?hit.object.userData.organ:null;
}

/* --------------------------------------------------------- projection/overlay */
const leaders=$('#leaders'),callBox=$('#callouts');
let callEls=[];
const svgNS='http://www.w3.org/2000/svg';
function proj(a){
  if(S.view==='2d') return {x:(a[0]-v2.x)*v2.s+W/2,y:(a[1]-v2.y)*v2.s+H/2};
  const v=toV(a).project(T3.camera);return {x:(v.x*.5+.5)*W,y:(-v.y*.5+.5)*H};
}
function rebuildCallouts(){
  leaders.innerHTML='';callBox.innerHTML='';callEls=[];
  let list=[];
  if(S.mode==='cp'||S.mode==='done') list=[];
  else if(S.sel) list=CALL[S.sel]||[];
  else list=NAMES.filter(n=>n.id!=='anus'||S.beyond);
  list.forEach(c=>{
    const line=document.createElementNS(svgNS,'line'),dot=document.createElementNS(svgNS,'circle');dot.setAttribute('r',4);
    leaders.append(line,dot);
    const el=document.createElement(c.id?'button':'div');el.className='callout'+(c.id?' name':'');el.textContent=c.text;
    if(c.id){el.type='button';el.addEventListener('click',()=>selectOrgan(c.id,{flow:false}));}
    callBox.append(el);callEls.push({c,line,dot,el,w:0,h:0});
  });
  requestAnimationFrame(()=>callEls.forEach(it=>{it.w=it.el.offsetWidth;it.h=it.el.offsetHeight;}));
}
function settled(){
  if(S.view==='2d') return Math.abs(Math.log(v2t.s/v2.s))<.03&&Math.hypot(v2t.x-v2.x,v2t.y-v2.y)*v2.s<8;
  return Math.abs(Math.log(camT.dist/cam.dist))<.03&&Math.hypot(camT.x-cam.x,camT.y-cam.y)<8&&Math.abs(camT.theta-cam.theta)<.04;
}
function updateCallouts(){
  const ok=settled()&&!userMoved;
  for(const it of callEls){
    const a=proj(it.c.a);
    let lx=a.x+it.c.dx,ly=a.y+it.c.dy;
    const hw=(it.w||80)/2+6,hh=(it.h||28)/2+6;
    lx=clamp(lx,hw,W-hw);ly=clamp(ly,hh+46,H-hh-8);
    it.el.style.left=lx+'px';it.el.style.top=ly+'px';
    it.line.setAttribute('x1',a.x);it.line.setAttribute('y1',a.y);it.line.setAttribute('x2',lx);it.line.setAttribute('y2',ly);
    it.dot.setAttribute('cx',a.x);it.dot.setAttribute('cy',a.y);
    const show=it.c.id?!S.sel:ok;
    it.el.classList.toggle('show',show);
    it.line.style.opacity=show?1:0;it.dot.style.opacity=show?1:0;
    it.el.style.pointerEvents=show&&it.c.id?'auto':'none';
  }
}

/* ------------------------------------------------------------ interaction */
const ptrs=new Map();let moved=0,multi=false,pinch=null;
function bindCanvas(cv){
  cv.addEventListener('pointerdown',e=>{
    cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===1){moved=0;multi=false;}
    if(ptrs.size===2){multi=true;const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s:v2t.s,dist:camT.dist};}
  });
  cv.addEventListener('pointermove',e=>{
    const p=ptrs.get(e.pointerId);
    if(!p){if(S.view==='2d'&&e.pointerType==='mouse'){const r=stage.getBoundingClientRect(),w=toWorld2D(e.clientX-r.left,e.clientY-r.top);hover=pick2D(w.x,w.y);cv.style.cursor=hover?'pointer':'default';}return;}
    const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
    if(ptrs.size===1){
      moved+=Math.abs(dx)+Math.abs(dy);if(moved<6) return;
      userMoved=true;
      if(S.view==='2d'){v2t.x-=dx/v2.s;v2t.y-=dy/v2.s;v2.x-=dx/v2.s;v2.y-=dy/v2.s;}
      else{camT.theta=clamp(camT.theta-dx*.007,-1.3,1.3);camT.pitch=clamp(camT.pitch+dy*.005,-.8,.9);cam.theta=camT.theta;cam.pitch=camT.pitch;}
    }else if(ptrs.size===2&&pinch){
      const [a,b]=[...ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y)/pinch.d;userMoved=true;
      if(S.view==='2d') v2t.s=clamp(pinch.s*d,.4,7);else camT.dist=clamp(pinch.dist/d,120,2600);
    }
  });
  const up=e=>{
    const had=ptrs.delete(e.pointerId);
    if(had&&moved<6&&!multi&&ptrs.size===0){
      const r=stage.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
      let id=null;if(S.view==='2d'){const w=toWorld2D(px,py);id=pick2D(w.x,w.y);}else if(T3.ready) id=pick3D(px,py);
      if(id) selectOrgan(id,{flow:false});else if(S.sel) showOverview();
    }
  };
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);});
  cv.addEventListener('pointerleave',()=>{hover=null;});
  cv.addEventListener('wheel',e=>{
    e.preventDefault();userMoved=true;const f=Math.exp(-e.deltaY*.0015);
    if(S.view==='2d'){
      const r=stage.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,ns=clamp(v2t.s*f,.4,7);
      const wx=v2t.x+(mx-W/2)/v2t.s,wy=v2t.y+(my-H/2)/v2t.s;v2t.s=ns;v2t.x=wx-(mx-W/2)/ns;v2t.y=wy-(my-H/2)/ns;
    }else camT.dist=clamp(camT.dist/f,120,2600);
  },{passive:false});
}
bindCanvas(c2d);bindCanvas(c3d);

function setView(v){
  if(v==='3d'&&!init3D()){hint.textContent='3D needs WebGL, which this browser does not offer.';hint.classList.remove('hide');return;}
  S.view=v;
  c2d.hidden=v!=='2d';c3d.hidden=v!=='3d';
  $('#v2d').setAttribute('aria-pressed',v==='2d');$('#v3d').setAttribute('aria-pressed',v==='3d');
  userMoved=false;setTargets();
  hint.textContent=v==='3d'?'Drag to turn the body. Pinch or scroll to zoom.':'Tap an organ to zoom in';
}
$('#v2d').onclick=()=>setView('2d');$('#v3d').onclick=()=>setView('3d');
$('#btnPause').onclick=e=>{S.paused=!S.paused;e.currentTarget.setAttribute('aria-pressed',S.paused);e.currentTarget.textContent=S.paused?'Play':'Pause';};
$('#selSpeed').value=String(S.speed);
$('#selSpeed').onchange=e=>{S.speed=+e.target.value;};
$('#btnWhole').onclick=()=>showOverview();
$('#beyond').onchange=e=>{
  S.beyond=e.target.checked;
  if(!S.beyond&&S.sel==='anus'){S.sel=null;S.mode='intro';}
  if(!S.beyond&&S.flow&&S.mode==='cp'&&S.cp&&S.cp.next==='anus'){}
  renderMatrix();renderPanel();rebuildCallouts();setTargets();
};

/* legend chips */
const LEG=[['food','Food not yet digested'],['dig','Digested food'],['fibre','Undigested food (fibre)'],['juice','Digestive juice'],['water','Water']];
$('#legend').innerHTML=LEG.map(([k,t])=>`<button type="button" class="chip" data-k="${k}" aria-pressed="true"><i class="sw ${k}"></i>${t}</button>`).join('');
$('#legend').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;const k=b.dataset.k;S.filters[k]=!S.filters[k];b.setAttribute('aria-pressed',S.filters[k]);});

/* ------------------------------------------------------------- navigation */
const ORDER=()=>ORGANS.filter(o=>!o.beyond||S.beyond).map(o=>o.id);
function selectOrgan(id,{flow=false}={}){
  if(id==='anus'&&!S.beyond){S.beyond=true;$('#beyond').checked=true;renderMatrix();}
  S.sel=id;S.mode='organ';S.cp=null;S.flow=flow;userMoved=false;
  setTargets();renderPanel();rebuildCallouts();renderMatrix();
  $('#btnWhole').hidden=false;hint.classList.add('hide');
}
function showOverview(){
  S.sel=null;S.mode='intro';S.cp=null;S.flow=false;userMoved=false;
  setTargets();renderPanel();rebuildCallouts();renderMatrix();$('#btnWhole').hidden=true;
}
function goNext(){
  const id=S.sel,cp=CP_AFTER[id],ord=ORDER(),i=ord.indexOf(id);
  if(cp&&lastOk(cp.id)===null){openCheckpoint(cp.id,true);return;}
  if(i<ord.length-1) selectOrgan(ord[i+1],{flow:true});else showDone();
}
function openCheckpoint(id,flow){
  S.cp=CPBY[id];S.cpDone=false;S.mode='cp';S.flow=!!flow;
  S.sel=CPBY[id].after;userMoved=false;setTargets();renderPanel();rebuildCallouts();renderMatrix();
  $('#btnWhole').hidden=false;hint.classList.add('hide');
}
function showDone(){S.mode='done';S.sel=null;setTargets();renderPanel();rebuildCallouts();renderMatrix();$('#btnWhole').hidden=true;}

/* ------------------------------------------------------------------ panel */
const panel=$('#panel');
const SW=k=>`<i class="sw ${k}"></i>`;
function renderPanel(){
  if(S.mode==='intro') panel.innerHTML=`
    <h2>Follow a meal through the body</h2>
    <p class="lead">Food travels through one long tube. Tap any organ to zoom in, or follow the food from the mouth.</p>
    <div class="row-actions"><button class="btn primary" data-act="start" type="button">Follow the food</button></div>
    <div class="legend-defs">
      <div class="row">${SW('food')}<p><b>Food not yet digested</b> is still in big pieces.</p></div>
      <div class="row">${SW('dig')}<p><b>Digested food</b> is broken down into tiny pieces that dissolve and can pass into the blood.</p></div>
      <div class="row">${SW('fibre')}<p><b>Undigested food</b> cannot be digested, like the fibre in vegetables.</p></div>
      <div class="row">${SW('juice')}<p><b>Digestive juice</b> breaks food down into smaller pieces.</p></div>
      <div class="row">${SW('water')}<p><b>Water</b> is taken out of the waste before it leaves the body.</p></div>
    </div>
    `;
  else if(S.mode==='organ') renderOrganPanel();
  else if(S.mode==='cp') renderCheckpoint();
  else if(S.mode==='done') renderDone();
  panel.scrollTop=0;
}
function renderOrganPanel(){
  const o=OBY[S.sel],c=CONTENT[o.id],ord=ORDER(),i=ord.indexOf(o.id),last=i===ord.length-1,prev=i>0?OBY[ord[i-1]].name:null,next=!last?OBY[ord[i+1]].name:null;
  panel.innerHTML=`
    <div class="p-head"><span class="dot" style="background:${o.tissue}"></span><h2>${o.name}</h2>${o.beyond?'<span class="pill">Beyond syllabus</span>':''}</div>
    <p class="step">Part ${i+1} of ${ord.length} of the digestive system</p>
    <p class="does">${c.does}</p>
    <div class="lens">
      <div class="row">${SW('dig')}<div><h3>Digested food</h3><p>${c.digested}</p></div></div>
      <div class="row">${SW('fibre')}<div><h3>Undigested food</h3><p>${c.undigested}</p></div></div>
      <div class="row">${SW('juice')}<div><h3>Digestive juice</h3><p>${c.juice}</p></div></div>
    </div>
    ${S.beyond&&c.beyond&&!o.beyond?`<div class="beyond"><b>Beyond syllabus</b>${c.beyond}</div>`:''}
    ${o.beyond?`<div class="beyond"><b>Beyond syllabus</b>${c.beyond}</div>`:''}
    <div class="nav">
      ${prev?`<button class="btn" data-act="prev" type="button">Back: ${prev}</button>`:'<button class="btn ghost" data-act="whole" type="button">Whole body</button>'}
      <button class="btn primary" data-act="next" type="button">${next?`Next: ${next}`:'Finish'}</button>
    </div>`;
}
function renderCheckpoint(){
  const cp=S.cp,after=OBY[cp.after].name;
  const nextLabel=ORDER().includes(cp.next)?`Continue: ${OBY[cp.next].name}`:'Finish';
  panel.innerHTML=`<p class="cp-kicker">Checkpoint ${cp.n} of ${CPS.length}, after the ${after.toLowerCase()}</p><div id="cpHost"></div><div class="row-actions" id="cpSkip"><button class="btn" data-act="cpskip" type="button">Skip for now</button></div>`;
  window.PSLE.Q.render($('#cpHost'),cp.q,{
    after:st=>(st.first!==null&&!cp.q.options[st.first].correct?`<button class="btn" data-qa="review" type="button">Review the ${after.toLowerCase()}</button>`:'')+`<button class="btn primary" data-qa="cpcontinue" type="button">${nextLabel}</button>`,
    onSolved:()=>{const k=$('#cpSkip');if(k)k.remove();},
    onAction:n=>{
      if(n==='cpcontinue'){const nx=cp.next;if(ORDER().includes(nx))selectOrgan(nx,{flow:true});else showDone();}
      else if(n==='review')selectOrgan(cp.after,{flow:true});
    }
  });
}
function renderDone(){
  const ok=CPS.filter(c=>lastOk(c.id)===true).length,un=unresolved(),skipped=CPS.filter(c=>lastOk(c.id)===null).length;
  panel.innerHTML=`
    <h2>You followed the food all the way</h2>
    <p class="lead">Food is chewed, swallowed, digested and absorbed. What cannot be digested is left over as waste.</p>
    <p class="done-score">${ok} of ${CPS.length}</p>
    <p>checkpoints correct${skipped?`, ${skipped} not answered yet`:''}${un?`, ${un} to fix in the mistake book`:''}.</p>
    <div class="row-actions">
      <button class="btn primary" data-act="restart" type="button">Start again</button>
      <a class="btn" href="../index.html#mistakes">Open the mistake book</a>
    </div>`;
}
panel.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b) return;
  const a=b.dataset.act;
  if(a==='start') selectOrgan('mouth',{flow:true});
  else if(a==='next') goNext();
  else if(a==='prev'){const ord=ORDER();selectOrgan(ord[ord.indexOf(S.sel)-1],{flow:true});}
  else if(a==='whole') showOverview();
  else if(a==='cpskip'||a==='cpcontinue'){const nx=S.cp.next;if(ORDER().includes(nx)) selectOrgan(nx,{flow:true});else showDone();}
  else if(a==='review') selectOrgan(S.cp.after,{flow:true});
  else if(a==='restart') selectOrgan('mouth',{flow:true});
});

/* ----------------------------------------------------------------- matrix */
function renderMatrix(){
  const cols=ORDER(),mx=$('#mx');
  mx.style.gridTemplateColumns=`150px repeat(${cols.length},minmax(84px,1fr))`;
  let h='<div></div>';
  cols.forEach(id=>{
    const o=OBY[id],cp=CP_AFTER[id];
    const flag=cp?`<span class="cpf ${lastOk(cp.id)===true?'ok':lastOk(cp.id)===false?'no':''}" title="Checkpoint ${cp.n}">${cp.n}</span>`:'';
    h+=`<button type="button" class="ch" data-id="${id}" aria-pressed="${S.sel===id}"><span class="od" style="background:${o.tissue}"></span>${o.name}${flag}</button>`;
  });
  MATRIX.forEach(r=>{
    h+=`<div class="rh"><i class="sw ${r.k}"></i>${r.label}</div>`;
    cols.forEach(id=>{const t=r.cells[id];h+=`<div class="cell ${t?'on':''} ${S.sel===id?'sel':''}">${t?esc(t):'none'}</div>`;});
  });
  mx.innerHTML=h;
}
$('#mx').addEventListener('click',e=>{const b=e.target.closest('.ch');if(b) selectOrgan(b.dataset.id,{flow:false});});
if(innerHeight<760) $('#matrixBox').open=false;

/* ------------------------------------------------------------ drawer/store */
const cpList=$('#cpList');
function renderCpList(){
  if(!cpList) return;
  cpList.innerHTML=CPS.map(c=>{
    const l=lastOk(c.id),wrong=att(c.id).filter(x=>!x.ok).length;
    const st=l===null?'<span class="badge none">Not answered</span>':l?'<span class="badge ok">✓ Right last time</span>':'<span class="badge due">↻ In your recap queue</span>';
    return `<li><span><b>Checkpoint ${c.n}: ${esc(c.q.title)}</b><small>After the ${OBY[c.after].name.toLowerCase()}${wrong?` · missed ${wrong} time${wrong>1?'s':''}`:''}</small></span><span class="row">${st}<button class="btn small" data-cp="${c.id}" type="button">${l===null?'Answer':'Try again'}</button></span></li>`;
  }).join('');
}
if(cpList) cpList.addEventListener('click',e=>{
  const b=e.target.closest('[data-cp]');if(!b) return;
  openCheckpoint(b.dataset.cp,false);
  const d=$('.dg');if(d) d.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
});
function refreshBadges(){renderMatrix();renderCpList();}
window.PSLE.onChange(refreshBadges);

/* ------------------------------------------------------------------- loop */
let last=performance.now();
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(!S.paused) sim(dt*S.speed);
  if(S.view==='2d') draw2D(dt);else if(T3.ready) draw3D(dt);
  updateCallouts();
  requestAnimationFrame(frame);
}
resize();setTargets();Object.assign(v2,v2t);
renderMatrix();renderPanel();rebuildCallouts();refreshBadges();
requestAnimationFrame(frame);
})();
