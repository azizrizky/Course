/* Lab Petualang — Cek Perasaan Kelas (emoticon 3D, kelompok 5 siswa, rekap rata-rata) */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const MOODS = [
  {id:'semangat',  name:'Semangat',  emo:'🤩', color:0xfb923c, css:'#f97316', w:5},
  {id:'senang',    name:'Senang',    emo:'😊', color:0xfacc15, css:'#facc15', w:4},
  {id:'bosan',     name:'Bosan',     emo:'😐', color:0xb6c2d4, css:'#94a3b8', w:2},
  {id:'mengantuk', name:'Mengantuk', emo:'😴', color:0xa5b4fc, css:'#818cf8', w:2},
  {id:'sedih',     name:'Sedih',     emo:'😢', color:0x7dd3fc, css:'#38bdf8', w:1}
];
const GROUP = 5;
const ls = {get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }, set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }};
const LITE = !!(window.LAB && LAB.lite);

/* ---------------- renderer & scene ---------------- */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, preserveDrawingBuffer:true});
renderer.setPixelRatio(window.LAB ? LAB.pixelRatio() : Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = !LITE; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, .1, 400);
const V3 = (x=0, y=0, z=0) => new THREE.Vector3(x, y, z);

function gradTex(stops, h = 512){ const c = document.createElement('canvas'); c.width = 4; c.height = h; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, h);
  stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, 4, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = (() => { const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({side:THREE.BackSide, map:gradTex([[0,'#8fbcf0'],[.45,'#eef4fb'],[.5,'#ffffff'],[.55,'#b0a89c'],[1,'#3d3a36']])})));
  const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide})); m.material.color.multiplyScalar(k); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  panel(30, 14, 25, 32, 15, 3); panel(18, 8, -30, 20, -20, 1.5); panel(40, 6, 0, 10, -45, 1.1); return pm.fromScene(s, .02).texture; })();

const hemi = new THREE.HemisphereLight(0xffffff, 0x445577, .6); scene.add(hemi);
const key = new THREE.DirectionalLight(0xfff1dd, 2.3); key.position.set(6, 12, 9); key.castShadow = true;
key.shadow.mapSize.set(LITE ? 1024 : 2048, LITE ? 1024 : 2048); key.shadow.bias = -.0004; key.shadow.normalBias = .02;
Object.assign(key.shadow.camera, {left:-12, right:12, top:12, bottom:-12, near:1, far:50}); scene.add(key);
const rimA = new THREE.PointLight(0x2dd4bf, 30, 30); rimA.position.set(-9, 5, -5); scene.add(rimA);
const rimB = new THREE.PointLight(0xc084fc, 30, 30); rimB.position.set(10, 6, -6); scene.add(rimB);

const floorMat = new THREE.MeshStandardMaterial({color:0x0f1d3d, roughness:.45, metalness:.25});
const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 64), floorMat); floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);
const ringMat = new THREE.MeshBasicMaterial({color:0x2dd4bf, transparent:true, opacity:.35});
[8.5, 9.1].forEach(r => { const m = new THREE.Mesh(new THREE.RingGeometry(r, r + .06, 128), ringMat); m.rotation.x = -Math.PI/2; m.position.y = .01; scene.add(m); });

function setTheme(){
  const dark = document.documentElement.dataset.theme !== 'light';
  scene.background = gradTex(dark ? [[0,'#060c1c'],[.5,'#142a5c'],[1,'#2a2368']] : [[0,'#a7cdf4'],[.55,'#e2eefb'],[1,'#fdf2f8']]);
  scene.fog = new THREE.Fog(dark ? 0x142a5c : 0xe2eefb, 26, 70);
  floorMat.color.set(dark ? 0x0f1d3d : 0xd5e3f5); hemi.intensity = dark ? .55 : .9;
}
setTheme();
addEventListener('message', e => { if(e.data && e.data.type === 'lab-theme') setTimeout(setTheme, 50); });

/* partikel latar yang melayang */
const dust = (() => { const n = LITE ? 120 : 320, g = new THREE.BufferGeometry(), p = new Float32Array(n*3);
  for(let i = 0; i < n; i++){ p[i*3] = (Math.random()-.5)*40; p[i*3+1] = Math.random()*14; p[i*3+2] = -4 - Math.random()*20; }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const gr = x.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0,0,64,64);
  const pts = new THREE.Points(g, new THREE.PointsMaterial({size:.22, map:new THREE.CanvasTexture(c), transparent:true, depthWrite:false, color:0xbfe9ff, opacity:.7})); scene.add(pts); return pts; })();

/* ---------------- bahan wajah ---------------- */
const DARK = new THREE.MeshStandardMaterial({color:0x2a1a14, roughness:.35});
const WHITE = new THREE.MeshStandardMaterial({color:0xffffff, roughness:.2, emissive:0xffffff, emissiveIntensity:.3});
const PINK = new THREE.MeshStandardMaterial({color:0xfb7185, roughness:.6, transparent:true, opacity:.55});
const TONGUE = new THREE.MeshStandardMaterial({color:0xf43f5e, roughness:.5});
const RED = new THREE.MeshStandardMaterial({color:0xef4444, roughness:.25, emissive:0xb91c1c, emissiveIntensity:.35});
const GOLD = new THREE.MeshStandardMaterial({color:0xfde047, roughness:.2, metalness:.4, emissive:0xfacc15, emissiveIntensity:.8});
const TEAR = new THREE.MeshPhysicalMaterial({color:0x7dd3fc, roughness:.05, transparent:true, opacity:.8, clearcoat:1, emissive:0x0ea5e9, emissiveIntensity:.25});
const headGeo = new THREE.SphereGeometry(1, 48, 32);
const onFace = (lat, lon, r = 1) => V3(Math.sin(lon)*Math.cos(lat)*r, Math.sin(lat)*r, Math.cos(lon)*Math.cos(lat)*r);
function starShape(ro, ri, n = 5){ const s = new THREE.Shape(); for(let i = 0; i <= n*2; i++){ const a = Math.PI/2 + i*Math.PI/n, r = i % 2 ? ri : ro; const x = Math.cos(a)*r, y = Math.sin(a)*r; i ? s.lineTo(x, y) : s.moveTo(x, y); } return s; }
const starGeo = new THREE.ExtrudeGeometry(starShape(.2, .085), {depth:.06, bevelEnabled:true, bevelThickness:.02, bevelSize:.02, bevelSegments:2}); starGeo.center();
const sparkGeo = new THREE.ExtrudeGeometry(starShape(.16, .05, 4), {depth:.03, bevelEnabled:false}); sparkGeo.center();
function zTex(){ const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.font = "900 110px 'Baloo 2','Nunito',sans-serif"; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.lineWidth = 10; x.strokeStyle = '#4338ca'; x.strokeText('Z', 64, 70); x.fillStyle = '#e0e7ff'; x.fillText('Z', 64, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const Z_TEX = zTex();

function stick(parent, mesh, pos, outward = true){ mesh.position.copy(pos); if(outward) mesh.lookAt(pos.clone().multiplyScalar(2)); parent.add(mesh); return mesh; }
function arcEye(parent, lat, lon, up){ const m = new THREE.Mesh(new THREE.TorusGeometry(.13, .04, 10, 20, Math.PI), DARK); const p = onFace(lat, lon, .985); stick(parent, m, p); m.rotateZ(up ? 0 : Math.PI); return m; }
function ovalEye(parent, lat, lon){ const g = new THREE.Group(); const e = new THREE.Mesh(new THREE.SphereGeometry(.13, 20, 14), DARK); e.scale.set(1, 1.35, .55); g.add(e);
  const h = new THREE.Mesh(new THREE.SphereGeometry(.04, 10, 8), WHITE); h.position.set(.04, .06, .06); g.add(h); stick(parent, g, onFace(lat, lon, .98)); return g; }
function brow(parent, lat, lon, tilt){ const m = new THREE.Mesh(new THREE.CapsuleGeometry(.035, .2, 4, 8), DARK); stick(parent, m, onFace(lat, lon, 1.0)); m.rotateZ(Math.PI/2 + tilt); return m; }

function buildFace(M, mini){
  const g = new THREE.Group(), head = new THREE.Group(); g.add(head);
  const skin = new THREE.MeshPhysicalMaterial({color:M.color, roughness:.32, clearcoat:1, clearcoatRoughness:.12, sheen:.4, sheenColor:new THREE.Color(0xffffff)});
  const h = new THREE.Mesh(headGeo, skin); h.castShadow = !mini; h.scale.set(1, .96, .94); head.add(h);
  const A = {head, extras:[]};
  if(M.id === 'semangat'){
    [-1, 1].forEach(s => { const st = new THREE.Mesh(starGeo, RED); stick(head, st, onFace(.22, s*.34, .99)); st.scale.setScalar(1.05); A.extras.push(st); });
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(.44, 32, Math.PI, Math.PI), DARK); stick(head, mouth, onFace(-.2, 0, .965)); mouth.rotateX(-.05);
    const tg = new THREE.Mesh(new THREE.CircleGeometry(.24, 24, Math.PI, Math.PI), TONGUE); tg.position.set(0, -.2, .01); mouth.add(tg);
    const teeth = new THREE.Mesh(new THREE.PlaneGeometry(.82, .09), WHITE); teeth.position.set(0, -.045, .005); mouth.add(teeth);
    [-1, 1].forEach(s => brow(head, .5, s*.33, -s*.25));
    if(!mini){ A.spark = []; for(let i = 0; i < 5; i++){ const sp = new THREE.Mesh(sparkGeo, GOLD); g.add(sp); A.spark.push(sp); } }
  } else if(M.id === 'senang'){
    arcEye(head, .2, -.33, true); arcEye(head, .2, .33, true);
    const sm = new THREE.Mesh(new THREE.TorusGeometry(.42, .055, 12, 36, Math.PI), DARK); sm.position.set(0, -.12, .92); sm.rotation.z = Math.PI; sm.rotation.x = -.35; head.add(sm);
    [-1, 1].forEach(s => { const c = new THREE.Mesh(new THREE.SphereGeometry(.16, 16, 12), PINK); c.scale.set(1.2, .7, .3); stick(head, c, onFace(-.08, s*.58, .96)); });
  } else if(M.id === 'bosan'){
    A.eyes = [-1, 1].map(s => { const e = ovalEye(head, .2, s*.33);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(.16, 20, 10, 0, Math.PI*2, 0, Math.PI/2), skin); lid.position.set(0, -.005, .02); lid.scale.set(1.05, .9, .8); lid.rotation.x = .25; e.add(lid);
      const line = new THREE.Mesh(new THREE.CapsuleGeometry(.025, .26, 4, 8), DARK); line.rotation.z = Math.PI/2; line.position.set(0, .0, .1); e.add(line); return e; });
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(.045, .5, 4, 10), DARK); stick(head, m, onFace(-.33, 0, .985)); m.rotateZ(Math.PI/2);
  } else if(M.id === 'mengantuk'){
    arcEye(head, .16, -.33, false); arcEye(head, .16, .33, false);
    [-1, 1].forEach(s => brow(head, .42, s*.33, s*.05));
    const o = new THREE.Mesh(new THREE.TorusGeometry(.09, .035, 10, 20), DARK); stick(head, o, onFace(-.36, .05, .985));
    if(!mini){ A.bubble = new THREE.Mesh(new THREE.SphereGeometry(.2, 20, 14), new THREE.MeshPhysicalMaterial({color:0xbae6fd, transparent:true, opacity:.45, roughness:0, clearcoat:1, iridescence:1}));
      A.bubble.position.copy(onFace(-.12, .2, 1.08)); head.add(A.bubble);
      A.z = [0, 1, 2].map(i => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:Z_TEX, transparent:true, depthWrite:false})); g.add(sp); return sp; }); }
  } else if(M.id === 'sedih'){
    ovalEye(head, .18, -.33); ovalEye(head, .18, .33);
    [-1, 1].forEach(s => brow(head, .45, s*.33, -s*.35));
    const fr = new THREE.Mesh(new THREE.TorusGeometry(.32, .05, 12, 32, Math.PI), DARK); fr.position.set(0, -.5, .86); fr.rotation.x = .45; head.add(fr);
    if(!mini){ const tear = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 12), TEAR); const c = new THREE.Mesh(new THREE.ConeGeometry(.088, .16, 16), TEAR); c.position.y = .1; tear.add(b, c); head.add(tear); A.tear = tear; }
  }
  g.userData.A = A; g.userData.M = M;
  return g;
}

/* ---------------- panggung & 5 emoticon ---------------- */
const FACES = [], PEDS = [], LBLS = [];
const pedMat = new THREE.MeshPhysicalMaterial({color:0xf8fafc, roughness:.25, metalness:.1, clearcoat:1});
MOODS.forEach((M, i) => {
  const x = (i - 2)*2.75, z = -Math.abs(i - 2)*.6;
  const ped = new THREE.Group(); ped.position.set(x, 0, z); scene.add(ped);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, .4, 48), pedMat); base.position.y = .2; base.castShadow = base.receiveShadow = true; ped.add(base);
  const glow = new THREE.Mesh(new THREE.TorusGeometry(1.08, .045, 10, 64), new THREE.MeshBasicMaterial({color:M.color})); glow.rotation.x = Math.PI/2; glow.position.y = .41; ped.add(glow);
  PEDS.push({ped, glow});
  const f = buildFace(M); f.position.set(x, 1.55, z); f.traverse(o => { if(o.isMesh) o.castShadow = true; }); scene.add(f);
  f.userData.base = V3(x, 1.55, z); f.userData.idx = i; f.userData.jump = 0; f.userData.spin = 0; f.userData.pop = 1; f.userData.hov = 1; f.userData.ph = Math.random()*6;
  FACES.push(f);
  const el = document.createElement('div'); el.className = 'ml'; el.innerHTML = `<div class="n">${M.name}</div><span class="k">${i + 1}</span>`;
  el.addEventListener('pointerup', e => { e.stopPropagation(); vote(i); }); $('#labels').appendChild(el); LBLS.push({el, pos:V3(x, .02, z + 1.2)});
});

/* toples kelereng perasaan */
const jar = new THREE.Group(); scene.add(jar);
const glass = new THREE.MeshPhysicalMaterial({color:0xffffff, transparent:true, opacity:.16, roughness:.04, clearcoat:1, side:THREE.DoubleSide, depthWrite:false});
const jarBody = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.25, 3.2, 48, 1, true), glass); jarBody.position.y = 1.6; jar.add(jarBody);
const jarBase = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.32, .12, 48), new THREE.MeshPhysicalMaterial({color:0xe2e8f0, roughness:.2, clearcoat:1})); jarBase.position.y = .06; jarBase.receiveShadow = true; jar.add(jarBase);
const jarRim = new THREE.Mesh(new THREE.TorusGeometry(1.36, .07, 12, 64), new THREE.MeshStandardMaterial({color:0x2dd4bf, emissive:0x0d9488, emissiveIntensity:.6, roughness:.3})); jarRim.rotation.x = Math.PI/2; jarRim.position.y = 3.2; jar.add(jarRim);
const jarLbl = document.createElement('div'); jarLbl.className = 'ml cnt'; $('#labels').appendChild(jarLbl);
const MARBLES = [];
const marbleGeo = new THREE.SphereGeometry(1, 24, 16);
const marbleMat = new THREE.MeshPhysicalMaterial({color:0xe9eef8, roughness:.08, clearcoat:1, iridescence:1, iridescenceIOR:1.6, metalness:.05});

/* ---------------- state ---------------- */
let S = null;               // sesi aktif
let phase = 'setup';        // setup | vote | gdone | result
let busy = false;
const last = ls.get('mood_last', {kelas:'', n:32, secret:true, sound:true});

function slotPos(k, total){
  const per = 7, layer = Math.floor(k/per), j = k % per;
  const layers = Math.max(1, Math.ceil(Math.max(total, k + 1)/per));
  const r = Math.min(.36, 2.9/(layers*1.75));
  const ang = j === 0 ? 0 : (j - 1)/6*Math.PI*2 + layer*.5;
  const rad = j === 0 ? 0 : r*2.05;
  return {p:V3(Math.cos(ang)*rad, .12 + r + layer*r*1.75, Math.sin(ang)*rad), r};
}

/* ---------------- suara ---------------- */
let AC = null;
function tone(f, d = .15, type = 'sine', vol = .15, when = 0){ if(!S || !S.sound) return; try{ AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const t = AC.currentTime + when;
  const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02); }catch(e){} }
const SND = {
  pick(i){ const base = [523, 494, 392, 349, 330][i]; tone(base, .12, 'triangle'); tone(base*1.5, .2, 'triangle', .12, .08); },
  plop(){ tone(880, .08, 'sine', .14); tone(1320, .1, 'sine', .08, .05); },
  group(){ [523, 659, 784, 1047].forEach((f, i) => tone(f, .25, 'triangle', .13, i*.1)); },
  drum(){ for(let i = 0; i < 14; i++) tone(120 + i*6, .06, 'square', .05, i*.07); [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .4, 'triangle', .12, 1.05 + i*.09)); }
};

/* ---------------- tween ---------------- */
const TW = [];
function tween(dur, fn, done){ const t = {t:0, dur, fn, done}; TW.push(t); return t; }
const easeOutBack = k => { const c = 1.70158; return 1 + (c + 1)*Math.pow(k - 1, 3) + c*Math.pow(k - 1, 2); };
const easeInOut = k => k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2)/2;

/* ---------------- tampilan atas ---------------- */
function counts(){ const c = {}; MOODS.forEach(m => c[m.id] = 0); S.votes.forEach(v => c[MOODS[v].id]++); return c; }
function updTop(){
  const n = S.votes.length, g = Math.floor(n/GROUP), inG = n % GROUP;
  const remain = S.total ? S.total - g*GROUP : GROUP, size = Math.min(GROUP, Math.max(1, remain));
  $('#tH').textContent = phase === 'result' ? `Hasil Perasaan Kelas ${S.kelas || ''}`.trim() : `Kelompok ${g + 1} · Siswa ke-${inG + 1}${size < GROUP ? ' dari ' + size : ''}`;
  $('#tS').textContent = phase === 'result' ? `${n} siswa sudah berbagi perasaannya hari ini` : `Ketuk emoticon yang paling menggambarkan perasaanmu hari ini${S.total ? ` · ${n}/${S.total} siswa` : ` · ${n} siswa`}`;
  const groupVotes = S.votes.slice(g*GROUP);
  $('#dots').innerHTML = phase === 'result' ? '' : Array.from({length:size}, (_, i) => i < groupVotes.length ? `<i class="done">${S.secret ? '✔' : MOODS[groupVotes[i]].emo}</i>` : `<i class="${i === inG ? 'cur' : ''}"></i>`).join('');
  jarLbl.innerHTML = `<div class="big">${n}${S.total ? `<span style="font-size:.5em;color:var(--muted)"> / ${S.total}</span>` : ''}</div><div class="pc">🫙 toples perasaan</div>`;
  $('#undoBtn').disabled = !n || phase === 'result'; $('#resBtn').disabled = !n;
  $('#info').innerHTML = `${S.kelas ? `<b>Kelas ${esc(S.kelas)}</b> · ` : ''}⌨️ <b>1–5</b> pilih · <b>⌫</b> batal · <b>Enter</b> lanjut${S.secret ? ' · 🙈 mode rahasia' : ''}`;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(t){ const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove('on'), 900); }

/* ---------------- memilih ---------------- */
function vote(i){
  if(phase !== 'vote' || busy) return;
  if(S.total && S.votes.length >= S.total) return;
  busy = true; const f = FACES[i], M = MOODS[i];
  S.votes.push(i); SND.pick(i);
  tween(.9, k => { f.userData.jump = Math.sin(k*Math.PI)*1.6; f.userData.spin = easeInOut(k)*Math.PI*2; f.userData.pop = 1 + Math.sin(k*Math.PI)*.25; }, () => { f.userData.jump = 0; f.userData.spin = 0; f.userData.pop = 1; });
  tween(.5, k => PEDS[i].glow.scale.setScalar(1 + Math.sin(k*Math.PI)*.25));
  // kelereng / emoticon mini terbang ke toples
  const idx = S.votes.length - 1, sp = slotPos(idx, S.total || 35);
  const mini = S.secret ? new THREE.Mesh(marbleGeo, marbleMat) : buildFace(M, true);
  mini.traverse(o => { if(o.isMesh) o.castShadow = true; });
  scene.add(mini); const from = f.userData.base.clone().add(V3(0, 1.2, 0));
  const to = () => jar.localToWorld(sp.p.clone());
  tween(1.0, k => { const e = easeInOut(k), t = to(); mini.position.lerpVectors(from, t, e); mini.position.y += Math.sin(k*Math.PI)*3.2; mini.rotation.y = k*Math.PI*3; mini.scale.setScalar(THREE.MathUtils.lerp(.55, sp.r, e)); },
    () => { scene.remove(mini); jar.add(mini); mini.position.copy(sp.p); mini.rotation.set(0, Math.random()*.6 - .3 + (S.secret ? 0 : Math.atan2(-jar.position.x, 10 - jar.position.z)), 0); SND.plop();
      tween(.25, k => mini.scale.setScalar(sp.r*(1 + Math.sin(k*Math.PI)*.18)));
      MARBLES.push(mini); });
  toast(S.secret ? '✔ Tercatat!' : `${M.emo} ${M.name}!`);
  setTimeout(() => {
    busy = false; updTop(); saveDraft();
    const n = S.votes.length;
    if(S.total && n >= S.total) showGroupDone(true);
    else if(n % GROUP === 0) showGroupDone(false);
  }, 1050);
  updTop();
}
function undo(){
  if(!S || !S.votes.length || busy || phase === 'result') return;
  S.votes.pop(); const m = MARBLES.pop();
  if(m) tween(.3, k => m.scale.setScalar(Math.max(.001, m.scale.x*(1 - k))), () => jar.remove(m));
  $('#gdone').classList.remove('on'); phase = 'vote'; updTop(); saveDraft(); toast('↶ Dibatalkan');
}
function showGroupDone(all){
  phase = 'gdone'; SND.group();
  const g = Math.ceil(S.votes.length/GROUP);
  $('#gdE').textContent = all ? '🏁' : '🎉';
  $('#gdH').textContent = all ? 'Semua siswa sudah memilih!' : `Kelompok ${g} selesai!`;
  $('#gdP').textContent = all ? 'Terima kasih semuanya! Saatnya melihat perasaan kelas hari ini.' : 'Terima kasih! Silakan kembali ke tempat duduk, lalu 5 siswa berikutnya maju ke depan.';
  $('#gdNext').style.display = all ? 'none' : '';
  $('#gdone').classList.add('on');
}
$('#gdNext').onclick = () => { $('#gdone').classList.remove('on'); phase = 'vote'; updTop(); };
$('#gdRes').onclick = () => { $('#gdone').classList.remove('on'); showResult(); };
$('#undoBtn').onclick = undo;
$('#resBtn').onclick = () => { $('#gdone').classList.remove('on'); showResult(); };
$('#fsBtn').onclick = () => { try{ document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }catch(e){} };

addEventListener('keydown', e => {
  if(phase === 'setup') { if(e.key === 'Enter') $('#goBtn').click(); return; }
  if(e.key >= '1' && e.key <= '5') vote(+e.key - 1);
  else if(e.key === 'Backspace'){ e.preventDefault(); undo(); }
  else if(e.key === 'Enter'){ if(phase === 'gdone') ($('#gdNext').style.display === 'none' ? $('#gdRes') : $('#gdNext')).click(); }
});

/* ---------------- hasil ---------------- */
const BARS = []; let crown = null, conf = null;
const RECO = {
  semangat:{t:'Energi kelas sedang tinggi! 🚀', b:['Manfaatkan untuk tantangan: eksperimen Lab 3D lalu kompetisi <b>Balap Komet</b> atau <b>Misi ke Bulan</b>.','Beri soal HOTS / pertanyaan “bagaimana jika…?” agar semangat tersalurkan.','Jaga fokus dengan aturan main yang jelas di awal.']},
  senang:{t:'Suasana kelas positif. 👍', b:['Lanjutkan sesuai rencana: apersepsi singkat → eksplorasi Lab 3D → kuis <b>Yakin-Ragu</b>.','Beri apresiasi atas suasana baik ini dan libatkan siswa sebagai “asisten lab”.']},
  bosan:{t:'Kelas butuh ritme baru. ⚡', b:['Buka dengan fenomena aneh / pertanyaan pemantik, bukan ceramah.','Gunakan mode kelas interaktif seperti <b>Detektif Mitos</b> atau kerja berpasangan.','Batasi penjelasan ≤ 10 menit, selingi dengan simulasi yang bisa disentuh siswa.']},
  mengantuk:{t:'Kelas perlu dibangunkan dulu. 🌤️', b:['Ice breaking bergerak 2–3 menit (tepuk semangat, peregangan, “Simon berkata”).','Buka jendela / perbaiki sirkulasi udara; ajak siswa minum air.','Pilih aktivitas berdiri: regu maju ke depan pada mode kelas, atau eksperimen kelompok.']},
  sedih:{t:'Kelas butuh kehangatan. 💛', b:['Sapa dengan hangat dan beri ruang bercerita singkat atau menulis jurnal perasaan.','Pilih aktivitas kolaboratif (mode <b>Regu</b>), hindari kompetisi yang menekan.','Temui siswa yang sedih secara pribadi setelah pelajaran (bila perlu bersama guru BK).']}
};
function idxLabel(x){ return x >= 4.2 ? 'Sangat positif — kelas siap belajar!' : x >= 3.4 ? 'Positif — suasana kelas baik' : x >= 2.6 ? 'Netral — perlu sedikit penyegaran' : x >= 1.8 ? 'Kurang bersemangat — mulai dengan ice breaking' : 'Perlu perhatian khusus'; }
function summary(){
  const c = counts(), n = S.votes.length, idx = n ? S.votes.reduce((a, v) => a + MOODS[v].w, 0)/n : 0;
  let dom = MOODS[0]; MOODS.forEach(m => { if(c[m.id] > c[dom.id] || (c[m.id] === c[dom.id] && m.w < dom.w && c[m.id] > 0)) dom = m; });
  return {c, n, idx:Math.round(idx*10)/10, dom};
}
function saveResult(){
  const r = summary(); if(!r.n) return;
  const rec = {id:S.id, t:Date.now(), kelas:S.kelas, total:r.n, counts:r.c, index:r.idx, dominant:r.dom.id};
  const L = ls.get('lab_mood', []).filter(x => x.id !== S.id); L.unshift(rec); ls.set('lab_mood', L.slice(0, 120));
  ls.set('mood_draft', null);
  try{ parent.postMessage({type:'mood-saved', rec}, '*'); }catch(e){}
}
function saveDraft(){ ls.set('mood_draft', S && S.votes.length ? S : null); }

function showResult(){
  if(!S.votes.length) return;
  phase = 'result'; busy = false; SND.drum();
  const r = summary(), max = Math.max(1, ...Object.values(r.c));
  // toples mengecil
  tween(.6, k => jar.scale.setScalar(Math.max(.001, 1 - easeInOut(k))), () => jar.visible = false);
  // batang 3D tumbuh
  BARS.forEach(b => { scene.remove(b.mesh); b.el.remove(); }); BARS.length = 0;
  MOODS.forEach((M, i) => {
    const f = FACES[i], cnt = r.c[M.id], h = .08 + 4.2*cnt/max;
    const mat = new THREE.MeshPhysicalMaterial({color:M.color, roughness:.18, clearcoat:1, transparent:true, opacity:.92, emissive:M.color, emissiveIntensity:.12});
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, 1, 48), mat); mesh.castShadow = true; mesh.position.set(f.userData.base.x, .4, f.userData.base.z); mesh.scale.y = .001; scene.add(mesh);
    const el = document.createElement('div'); el.className = 'ml cnt res'; el.innerHTML = `<div class="big">${cnt}</div><div class="pc">${Math.round(cnt/r.n*100)}%</div>`; el.style.opacity = 0; $('#labels').appendChild(el);
    const b = {mesh, el, h, f, y0:f.userData.base.y}; BARS.push(b);
    setTimeout(() => tween(1.6, k => { const e = easeOutBack(k)*Math.min(1, k*3); const hh = Math.max(.001, h*Math.min(e, 1.08));
        mesh.scale.y = hh; mesh.position.y = .4 + hh/2; f.userData.base.y = .4 + hh + 1.05; el.style.opacity = Math.min(1, k*2); }), 250 + i*180);
  });
  // mahkota & konfeti untuk perasaan dominan
  setTimeout(() => {
    const df = FACES[MOODS.indexOf(r.dom)];
    if(!crown){ crown = new THREE.Group(); const band = new THREE.Mesh(new THREE.CylinderGeometry(.55, .5, .22, 32, 1, true), GOLD); crown.add(band);
      for(let i = 0; i < 6; i++){ const a = i/6*Math.PI*2, c = new THREE.Mesh(new THREE.ConeGeometry(.12, .34, 12), GOLD); c.position.set(Math.cos(a)*.52, .26, Math.sin(a)*.52); crown.add(c);
        const gem = new THREE.Mesh(new THREE.SphereGeometry(.06, 10, 8), RED); gem.position.set(Math.cos(a)*.56, 0, Math.sin(a)*.56); crown.add(gem); } scene.add(crown); }
    const happy = r.dom.w >= 4; crown.visible = happy; crown.userData.f = df;
    tween(.8, k => { df.userData.pop = 1 + easeOutBack(k)*.3; crown.scale.setScalar(easeOutBack(k)); });
    if(happy) burst(df);
  }, 1500 + MOODS.length*180);
  // kamera
  CAMGOAL.res = Math.max(...BARS.map(b => b.h));
  layout();
  // panel hasil
  const meterLeft = r.n ? (r.idx - 1)/4*100 : 50;
  const warn = [];
  if(r.c.sedih >= 3 || (r.n >= 5 && r.c.sedih/r.n >= .2)) warn.push(`💛 <b>${r.c.sedih} siswa</b> memilih Sedih — sempatkan menyapa mereka secara pribadi hari ini.`);
  if(r.n >= 4 && (r.c.bosan + r.c.mengantuk)/r.n >= .5) warn.push(`⏱️ Separuh kelas kurang energi — sisipkan <b>jeda aktif</b> setiap ±15 menit.`);
  const R = RECO[r.dom.id];
  $('#res').innerHTML = `<div style="display:flex;align-items:center;gap:12px"><div style="font-size:54px;line-height:1">${r.dom.emo}</div><div><div style="font-weight:900;color:var(--muted);font-size:12px;letter-spacing:1px">PERASAAN DOMINAN</div><h2 class="fred">${r.dom.name}</h2></div></div>
    <div class="idx"><b>${r.idx.toFixed(1)}</b><span style="font-weight:900;color:var(--muted)">/ 5 · indeks perasaan kelas</span></div>
    <div style="font-weight:900">${idxLabel(r.idx)}</div>
    <div class="meter"><i style="left:50%" id="mNeedle"></i></div><div class="mlbl"><span>😢 1</span><span>😴😐 2</span><span>3</span><span>😊 4</span><span>🤩 5</span></div>
    <div style="margin-top:14px">${MOODS.map(M => `<div class="rrow"><span class="e">${M.emo}</span><span class="t">${M.name}</span><span class="pb"><i style="width:0;background:${M.css}" data-w="${r.c[M.id]/r.n*100}"></i></span><span class="v">${r.c[M.id]} · ${Math.round(r.c[M.id]/r.n*100)}%</span></div>`).join('')}</div>
    <div class="reco"><b>💡 Rekomendasi untuk Ibu: ${R.t}</b><ul>${R.b.map(x => `<li>${x}</li>`).join('')}</ul></div>
    ${warn.map(w => `<div class="reco warn">${w}</div>`).join('')}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">${S.total && r.n >= S.total ? '' : '<button class="btn ghost" id="rBack">⬅ Lanjut memilih</button>'}<button class="btn pink" id="rNew">🔁 Sesi baru</button></div>
    <div style="font-weight:800;color:var(--muted);font-size:12.5px;margin-top:10px">💾 Tersimpan otomatis di Riwayat Kelas · ${r.n} siswa${S.kelas ? ' · Kelas ' + esc(S.kelas) : ''}</div>`;
  $('#res').classList.add('on'); document.body.classList.add('resmode');
  setTimeout(() => { const nd = $('#mNeedle'); if(nd) nd.style.left = meterLeft + '%'; document.querySelectorAll('#res .pb i').forEach(i => i.style.width = i.dataset.w + '%'); }, 600);
  const rb = $('#rBack'); if(rb) rb.onclick = backToVote;
  $('#rNew').onclick = async () => { if(await uiConfirm('Hasil sesi ini sudah tersimpan di riwayat.', {title:'Mulai sesi baru?', icon:'🔁', ok:'Mulai baru'})) resetAll(true); };
  LBLS.forEach(L => L.el.querySelector('.k').style.display = 'none');
  updTop(); saveResult();
}
function clearResultVisuals(){
  BARS.forEach(b => { scene.remove(b.mesh); b.el.remove(); b.f.userData.base.y = 1.55; }); BARS.length = 0;
  if(crown) crown.visible = false; FACES.forEach(f => f.userData.pop = 1);
  $('#res').classList.remove('on'); document.body.classList.remove('resmode'); LBLS.forEach(L => L.el.querySelector('.k').style.display = '');
  jar.visible = true; tween(.5, k => jar.scale.setScalar(Math.max(.001, easeOutBack(k)))); CAMGOAL.res = 0; layout();
}
function backToVote(){ clearResultVisuals(); phase = 'vote'; updTop(); }
function resetAll(toSetup){
  clearResultVisuals(); MARBLES.splice(0).forEach(m => jar.remove(m)); S = null; ls.set('mood_draft', null);
  if(toSetup){ phase = 'setup'; openSetup(); }
}

/* konfeti */
function burst(f){
  const n = LITE ? 120 : 260;
  if(!conf){ conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(.12, .2), new THREE.MeshStandardMaterial({side:THREE.DoubleSide, roughness:.5, metalness:.2}), n); conf.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(conf);
    const cols = [0xf97316, 0xfacc15, 0x2dd4bf, 0xa78bfa, 0xf472b6, 0x38bdf8, 0x4ade80], c = new THREE.Color(); for(let i = 0; i < n; i++){ c.set(cols[i % cols.length]); conf.setColorAt(i, c); } conf.instanceColor.needsUpdate = true; }
  const o = f.userData.base.clone().add(V3(0, .8, 0));
  conf.userData.P = Array.from({length:n}, () => ({p:o.clone(), v:V3((Math.random()-.5)*9, 5 + Math.random()*7, (Math.random()-.5)*6), r:V3(Math.random()*6, Math.random()*6, Math.random()*6), s:V3((Math.random()-.5)*12, (Math.random()-.5)*12, 0)}));
  conf.userData.t = 0; conf.visible = true;
}
const dummy = new THREE.Object3D();
function updConf(dt){ if(!conf || !conf.visible) return; conf.userData.t += dt; const P = conf.userData.P;
  P.forEach((q, i) => { q.v.y -= 9*dt; q.v.multiplyScalar(1 - 1.2*dt); if(q.v.y < -2.2) q.v.y = -2.2; q.p.addScaledVector(q.v, dt); q.r.addScaledVector(q.s, dt);
    dummy.position.copy(q.p); dummy.rotation.set(q.r.x, q.r.y, q.r.z); dummy.scale.setScalar(q.p.y < 0 ? 0 : 1); dummy.updateMatrix(); conf.setMatrixAt(i, dummy.matrix); });
  conf.instanceMatrix.needsUpdate = true; if(conf.userData.t > 7) conf.visible = false; }

/* ---------------- tata letak kamera ---------------- */
const CAMGOAL = {pos:V3(0, 4, 14), look:V3(0, 1.6, 0), res:0};
const camLook = V3(0, 1.6, 0);
function layout(){
  const w = innerWidth, h = innerHeight, asp = w/h; renderer.setSize(w, h, false); camera.aspect = asp; camera.updateProjectionMatrix();
  const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov/2)), wide = asp > 1.15;
  if(phase === 'result' || CAMGOAL.res){
    const top = .4 + CAMGOAL.res + 2.6, panel = wide && w > 820;
    const halfW = panel ? 10.2 : 7.6, cx = panel ? 4.0 : 0;
    const D = Math.max((top/2 + 2.2)/tanH, halfW/(tanH*asp));
    CAMGOAL.look.set(cx, top/2 + .3 - (panel ? 0 : 1.6), 0); CAMGOAL.pos.set(cx, top/2 + D*.2, D);
  } else {
    if(wide){ jar.position.set(8.1, 0, -1.4); } else { jar.position.set(0, 4.4, -4.5); }
    const halfW = wide ? 9.0 : 7.2, cx = wide ? 1.3 : 0, top = wide ? 4.6 : 8.4;
    const D = Math.max((top/2 + 1.4)/tanH, halfW/(tanH*asp));
    CAMGOAL.look.set(cx, top/2 - .2, 0); CAMGOAL.pos.set(cx, top/2 + D*.24, D);
  }
}
addEventListener('resize', layout);

/* ---------------- pointer ---------------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let hovIdx = -1;
function faceAt(x, y){ ndc.set(x/innerWidth*2 - 1, -(y/innerHeight)*2 + 1); ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(FACES, true)[0]; if(!hit) return -1; let o = hit.object; while(o && o.userData.idx === undefined) o = o.parent; return o ? o.userData.idx : -1; }
canvas.addEventListener('pointermove', e => { hovIdx = phase === 'vote' ? faceAt(e.clientX, e.clientY) : -1; canvas.style.cursor = hovIdx >= 0 ? 'pointer' : ''; });
canvas.addEventListener('pointerup', e => { const i = faceAt(e.clientX, e.clientY); if(i >= 0) vote(i); });

/* ---------------- loop ---------------- */
const clock = new THREE.Clock(); const tmp = V3();
function frame(){
  const dt = Math.min(clock.getDelta(), .05), T = clock.elapsedTime;
  for(let i = TW.length - 1; i >= 0; i--){ const t = TW[i]; t.t += dt; const k = Math.min(1, t.t/t.dur); t.fn(k); if(k >= 1){ TW.splice(i, 1); t.done && t.done(); } }
  camera.position.lerp(CAMGOAL.pos, 1 - Math.pow(.03, dt)); camLook.lerp(CAMGOAL.look, 1 - Math.pow(.03, dt)); camera.lookAt(camLook);
  FACES.forEach((f, i) => { const u = f.userData, A = u.A, M = u.M, ph = u.ph + T;
    u.hov += ((hovIdx === i ? 1.13 : 1) - u.hov)*Math.min(1, dt*10);
    f.position.set(u.base.x, u.base.y + Math.sin(ph*1.6)*.1 + u.jump, u.base.z);
    f.scale.setScalar(u.hov*u.pop);
    const face = Math.atan2(CAMGOAL.pos.x - u.base.x, CAMGOAL.pos.z - u.base.z)*.6;
    f.rotation.set(0, face + u.spin, 0);
    if(M.id === 'semangat'){ A.head.rotation.z = Math.sin(ph*5)*.08; A.head.position.y = Math.abs(Math.sin(ph*4))*.08;
      A.extras.forEach((s, j) => { s.rotation.z = T*2*(j ? 1 : -1); s.scale.setScalar(1.05 + Math.sin(T*8 + j)*.12); });
      if(A.spark) A.spark.forEach((s, j) => { const a = T*1.4 + j/5*Math.PI*2; s.position.set(Math.cos(a)*1.45, .3 + Math.sin(a*2)*.5, Math.sin(a)*1.45); s.rotation.z = T*4 + j; s.scale.setScalar(.7 + Math.sin(T*6 + j)*.35); }); }
    else if(M.id === 'senang'){ A.head.rotation.z = Math.sin(ph*2.2)*.12; A.head.rotation.x = Math.sin(ph*1.1)*.05; }
    else if(M.id === 'bosan'){ A.head.rotation.z = Math.sin(ph*.7)*.06 - .05; const look = Math.sin(ph*.6); A.eyes.forEach(e => e.children[0].position.x = look*.04); A.head.rotation.y = Math.sin(ph*.45)*.25; }
    else if(M.id === 'mengantuk'){ A.head.rotation.z = .22 + Math.sin(ph*.8)*.1; A.head.rotation.x = Math.max(0, Math.sin(ph*.5))*.25;
      if(A.bubble) A.bubble.scale.setScalar(.35 + (Math.sin(ph*1.6)*.5 + .5)*.8);
      if(A.z) A.z.forEach((z, j) => { const k = ((T*.45 + j/3) % 1); z.position.set(.7 + k*.9, 1 + k*1.6, 0); z.scale.setScalar(.25 + k*.35); z.material.opacity = Math.sin(k*Math.PI); }); }
    else if(M.id === 'sedih'){ A.head.rotation.x = .18 + Math.sin(ph*.9)*.05; A.head.rotation.z = Math.sin(ph*.7)*.05;
      if(A.tear){ const k = (T*.5 + u.ph) % 1, p = onFace(.05 - k*.75, .4, 1.04); A.tear.position.copy(p); A.tear.scale.setScalar(k < .1 ? k*10 : k > .9 ? (1 - k)*10 : 1); } }
  });
  if(crown && crown.visible && crown.userData.f){ const f = crown.userData.f; crown.position.set(f.position.x, f.position.y + 1.15*f.scale.x, f.position.z); crown.rotation.y = T*.8; }
  dust.rotation.y = Math.sin(T*.05)*.2; dust.position.y = Math.sin(T*.3)*.2;
  jar.rotation.y = Math.sin(T*.4)*.06;
  updConf(dt);
  renderer.render(scene, camera);
  // label
  const W = innerWidth, H = innerHeight;
  const place = (el, v) => { tmp.copy(v).project(camera); if(tmp.z > 1){ el.style.display = 'none'; return; } el.style.display = ''; el.style.left = ((tmp.x + 1)/2*W) + 'px'; el.style.top = ((1 - tmp.y)/2*H) + 'px'; };
  LBLS.forEach(L => place(L.el, L.pos));
  if(jar.visible && S){ jarLbl.style.display = ''; place(jarLbl, jar.position.clone().add(V3(0, 3.9, 0))); } else jarLbl.style.display = 'none';
  BARS.forEach(b => place(b.el, V3(b.f.position.x, b.f.position.y + 1.15*b.f.scale.x + (crown && crown.visible && crown.userData.f === b.f ? .75 : 0), b.f.position.z)));
  requestAnimationFrame(frame);
}

/* ---------------- setup ---------------- */
const NOPT = [[20,'20'],[24,'24'],[28,'28'],[30,'30'],[32,'32'],[36,'36'],[0,'Tanpa batas']];
let setN = last.n ?? 32;
function openSetup(){
  phase = 'setup'; $('#setup').classList.add('on'); $('#top').style.opacity = 0; document.body.classList.add('setupmode');
  $('#kName').value = last.kelas || ''; $('#kSecret').checked = last.secret !== false; $('#kSound').checked = last.sound !== false;
  const draw = () => { $('#kN').innerHTML = NOPT.map(([v, l]) => `<button class="chip ${v === setN ? 'on' : ''}" data-n="${v}">${l}</button>`).join('') + `<input class="inp" id="kNc" type="number" min="1" max="60" placeholder="lainnya" style="width:110px;padding:7px 10px" value="${NOPT.some(o => o[0] === setN) ? '' : setN}">`;
    document.querySelectorAll('#kN [data-n]').forEach(b => b.onclick = () => { setN = +b.dataset.n; draw(); });
    $('#kNc').oninput = e => { const v = +e.target.value; if(v > 0){ setN = Math.min(60, v); document.querySelectorAll('#kN [data-n]').forEach(b => b.classList.remove('on')); } }; };
  draw();
  const d = ls.get('mood_draft', null);
  if(d && d.votes && d.votes.length && !$('#resume')){ const b = document.createElement('button'); b.id = 'resume'; b.className = 'btn big ghost'; b.style.marginLeft = '10px'; b.textContent = `↺ Lanjutkan sesi tadi (${d.votes.length} siswa)`;
    b.onclick = () => startSession(d); $('#goBtn').after(b); }
}
function startSession(draft){
  const kelas = $('#kName').value.trim(), secret = $('#kSecret').checked, sound = $('#kSound').checked;
  Object.assign(last, {kelas, n:setN, secret, sound}); ls.set('mood_last', last);
  S = draft || {id:'m' + Date.now(), kelas, total:setN, secret, sound, votes:[]};
  MARBLES.splice(0).forEach(m => jar.remove(m));
  S.votes.forEach((v, k) => { const sp = slotPos(k, S.total || 35); const m = S.secret ? new THREE.Mesh(marbleGeo, marbleMat) : buildFace(MOODS[v], true); m.position.copy(sp.p); m.scale.setScalar(sp.r); jar.add(m); MARBLES.push(m); });
  const r = $('#resume'); if(r) r.remove();
  $('#setup').classList.remove('on'); $('#top').style.opacity = 1; document.body.classList.remove('setupmode'); phase = 'vote'; layout(); updTop();
  SND.group(); toast('Kelompok 1, silakan maju! 👋');
}
$('#goBtn').onclick = () => startSession(null);

layout(); camera.position.copy(CAMGOAL.pos).add(V3(0, 6, 10)); camLook.copy(CAMGOAL.look);
openSetup();
requestAnimationFrame(frame);
setTimeout(() => { const l = $('#loading'); l.style.opacity = 0; setTimeout(() => l.remove(), 500); }, 300);
})();
