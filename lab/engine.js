/* Lab Petualang — mesin Lab Virtual 3D bersama (three.js r158)
   Setiap topik didaftarkan di window.TOPICS3D[id] = {title, sub, modes:[{id,label,build(E)}], greet} */
(function(){
"use strict";
const P = new URLSearchParams(location.search);
const ID = P.get('t') || 'wujud-zat';
const DEF = (window.TOPICS3D || {})[ID];
const MAT = (window.MATERI_DATA || {})[ID] || {};
const $ = s => document.querySelector(s);
document.documentElement.dataset.lab = ID;
document.documentElement.classList.add('engine');
if(!DEF){ document.body.innerHTML = '<p style="padding:2em">Simulasi tidak ditemukan.</p>'; return; }
document.title = DEF.title + ' — Lab Petualang';
$('#tTitle').innerHTML = DEF.titleHTML || DEF.title; $('#tSub').textContent = DEF.sub || ('IPA Kelas ' + (MAT.kelas || '') + ' · SMPN 4 Magelang');

/* ---------- renderer ---------- */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, preserveDrawingBuffer:true});
renderer.setPixelRatio(window.LAB ? LAB.pixelRatio() : Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = !(window.LAB && LAB.lite); renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, .05, 2000);
const V3 = (x=0,y=0,z=0) => new THREE.Vector3(x,y,z);

function gradTex(stops, h = 512){ const c = document.createElement('canvas'); c.width = 4; c.height = h; const g = c.getContext('2d'); const gr = g.createLinearGradient(0,0,0,h);
  stops.forEach(([o,col]) => gr.addColorStop(o,col)); g.fillStyle = gr; g.fillRect(0,0,4,h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const pm = new THREE.PMREMGenerator(renderer);
const envTex = (() => { const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(60,32,16), new THREE.MeshBasicMaterial({side:THREE.BackSide, map:gradTex([[0,'#8fbff2'],[.42,'#e9f1fa'],[.5,'#ffffff'],[.56,'#b9b2a8'],[1,'#3f3b36']])})));
  const panel = (w,h,x,y,z,k,col = 0xffffff) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({color:col, side:THREE.DoubleSide})); m.material.color.multiplyScalar(k); m.position.set(x,y,z); m.lookAt(0,0,0); s.add(m); };
  // lampu langit-langit (softbox) + jendela + pantulan dinding hangat
  for(let i = -1; i <= 1; i++) panel(10, 3, i*12, 26, 6, 3.2);
  panel(30, 12, 0, 12, -40, 1.6, 0xdbeafe); panel(16, 9, 36, 10, 10, 1.2, 0xfff1dc); panel(16, 9, -36, 10, 10, .9, 0xe0f2fe); panel(40, 6, 0, -6, 30, .35, 0x9a8b78);
  return pm.fromScene(s,.03).texture; })();
scene.environment = envTex;
function setBg(){
  const dark = document.documentElement.dataset.theme !== 'light';
  const custom = DEF.bg && DEF.bg[dark ? 'dark' : 'light'];
  scene.background = gradTex(custom || (dark ? [[0,'#081022'],[.55,'#13285a'],[1,'#1d3d78']] : [[0,'#9cc8f2'],[.55,'#dcebfa'],[1,'#f6f9fe']]));
  scene.fog = new THREE.Fog(dark ? 0x13285a : 0xdcebfa, 40, 160);
}
setBg();
const hemi = new THREE.HemisphereLight(0xffffff, 0x8899aa, .55); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff4e6, 2.4); sun.position.set(8, 14, 9); sun.castShadow = true;
const SH = (window.LAB && LAB.shadow) || 2048; sun.shadow.mapSize.set(SH, SH); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
Object.assign(sun.shadow.camera, {left:-14, right:14, top:14, bottom:-14, near:1, far:60}); scene.add(sun, sun.target);

/* ---------- kamera orbit ---------- */
const cam = {target:V3(0,1,0), goalT:V3(0,1,0), th:.5, ph:1.1, r:12, g:{th:.5, ph:1.1, r:12}, minR:2, maxR:60};
function setView(v, instant){ cam.g.th = v.theta ?? cam.g.th; cam.g.ph = v.phi ?? cam.g.ph; cam.g.r = v.radius ?? cam.g.r; if(v.target) cam.goalT.set(...v.target);
  cam.minR = v.minR || 2; cam.maxR = v.maxR || 60; if(instant){ cam.th = cam.g.th; cam.ph = cam.g.ph; cam.r = cam.g.r; cam.target.copy(cam.goalT); } }
function applyCam(dt){ const k = 1 - Math.pow(.002, dt); cam.target.lerp(cam.goalT, Math.min(1, k*1.4));
  cam.th += (cam.g.th - cam.th)*k; cam.ph += (cam.g.ph - cam.ph)*k; cam.r += (cam.g.r - cam.r)*k; const s = Math.sin(cam.ph);
  camera.position.set(cam.target.x + cam.r*s*Math.sin(cam.th), cam.target.y + cam.r*Math.cos(cam.ph), cam.target.z + cam.r*s*Math.cos(cam.th)); camera.lookAt(cam.target); }
const ptrs = new Map(); let gest = null, tap = null;
canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, {x:e.clientX, y:e.clientY}); tap = {x:e.clientX, y:e.clientY, t:performance.now()}; startG(); });
canvas.addEventListener('pointermove', e => { const p = ptrs.get(e.pointerId); if(!p) return; p.x = e.clientX; p.y = e.clientY; moveG(); hover(e); });
const endP = e => { ptrs.delete(e.pointerId); if(tap && e.type === 'pointerup' && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 8 && performance.now() - tap.t < 450) doPick(e.clientX, e.clientY); tap = null; startG(); };
canvas.addEventListener('pointerup', endP); canvas.addEventListener('pointercancel', endP);
function startG(){ const ps = [...ptrs.values()]; if(ps.length === 1) gest = {x:ps[0].x, y:ps[0].y}; else if(ps.length >= 2){ const [a,b] = ps; gest = {m:1, d:Math.hypot(a.x-b.x, a.y-b.y)}; } else gest = null; }
function moveG(){ const ps = [...ptrs.values()]; if(!gest) return;
  if(ps.length === 1 && !gest.m){ const p = ps[0]; cam.g.th -= (p.x - gest.x)*.006; cam.g.ph = THREE.MathUtils.clamp(cam.g.ph - (p.y - gest.y)*.006, .15, 1.62); gest.x = p.x; gest.y = p.y; }
  else if(ps.length >= 2 && gest.m){ const [a,b] = ps, d = Math.hypot(a.x-b.x, a.y-b.y); if(gest.d > 0) zoom(gest.d/d); gest.d = d; } }
function zoom(f){ cam.g.r = THREE.MathUtils.clamp(cam.g.r*f, cam.minR, cam.maxR); }
canvas.addEventListener('wheel', e => { e.preventDefault(); zoom(Math.exp(e.deltaY*.0012)); }, {passive:false});

/* ---------- label, pilih objek ---------- */
const LBL = [], PICKS = [], TICKS = [];
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function label(target, text, opts = {}){
  const el = document.createElement('div'); el.className = 'lbl' + (opts.cls ? ' ' + opts.cls : ''); el.innerHTML = text; $('#labels').appendChild(el);
  const L = {el, target, off:opts.off || V3(), hidden:false}; LBL.push(L);
  if(opts.onClick) el.addEventListener('pointerup', e => { e.stopPropagation(); opts.onClick(); });
  return L;
}
const tmpV = V3();
function updLabels(){ const W = innerWidth, H = innerHeight;
  LBL.forEach(L => { if(L.hidden){ L.el.style.display = 'none'; return; }
    if(L.target.isObject3D){ L.target.getWorldPosition(tmpV); tmpV.add(L.off); } else tmpV.copy(L.target).add(L.off);
    tmpV.project(camera); if(tmpV.z > 1){ L.el.style.display = 'none'; return; }
    L.el.style.display = ''; L.el.style.left = ((tmpV.x+1)/2*W) + 'px'; L.el.style.top = ((1-tmpV.y)/2*H) + 'px'; }); }
function pick(obj, fn){ obj.traverse(o => { o.userData.__pick = fn; }); PICKS.push(obj); }
function hit(x, y){ ndc.set(x/innerWidth*2 - 1, -(y/innerHeight)*2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(PICKS, true)[0]; return h && h.object.userData.__pick ? h : null; }
function doPick(x, y){ const h = hit(x, y); if(h) h.object.userData.__pick(h); }
function hover(e){ if(ptrs.size) return; canvas.style.cursor = hit(e.clientX, e.clientY) ? 'pointer' : 'grab'; }

/* ---------- panel UI ---------- */
const pb = () => $('#pBody');
const ui = {
  clear(){ pb().innerHTML = ''; },
  html(h){ const d = document.createElement('div'); d.innerHTML = h; pb().appendChild(d); return d; },
  head(kick, title, text){ return this.html(`<div class="kick">${kick}</div><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}`); },
  sec(title, inner = ''){ return this.html(`<div class="sec"><b>${title}</b>${inner}</div>`).firstChild; },
  slider(parent, o){ const id = 's' + Math.random().toString(36).slice(2,8);
    const row = document.createElement('div'); row.className = 'srow';
    row.innerHTML = `<label for="${id}">${o.label}</label><input id="${id}" type="range" min="${o.min}" max="${o.max}" step="${o.step || 1}" value="${o.value}"><output>${fmt(o.value, o)}</output>`;
    (parent || pb()).appendChild(row); const inp = row.querySelector('input'), out = row.querySelector('output');
    inp.oninput = () => { const v = +inp.value; out.textContent = fmt(v, o); o.on && o.on(v); }; o.on && o.on(+o.value);
    return {set(v){ inp.value = v; out.textContent = fmt(+v, o); }, get:() => +inp.value}; },
  buttons(parent, list){ const d = document.createElement('div'); d.className = 'btns';
    list.forEach(b => { const el = document.createElement('button'); el.className = 'btn ' + (b.cls || ''); el.innerHTML = b.label; el.onclick = () => b.on(el); d.appendChild(el); b.el = el; });
    (parent || pb()).appendChild(d); return list; },
  seg(parent, opts, val, on){ const list = opts.map(([v,l]) => ({label:l, cls: v === val ? 'on' : '', on:(el) => { d.forEach(x => x.el.classList.remove('on')); el.classList.add('on'); on(v); }}));
    const d = this.buttons(parent, list); on(val); return d; },
  reads(parent, items){ const d = document.createElement('div'); d.className = 'reads'; const set = {};
    items.forEach(([k, l]) => { const r = document.createElement('div'); r.className = 'read'; r.innerHTML = `<span>${l}</span><b>–</b>`; d.appendChild(r); set[k] = v => r.querySelector('b').innerHTML = v; });
    (parent || pb()).appendChild(d); return set; }
};
function fmt(v, o){ const d = o.dec ?? (o.step && o.step < 1 ? String(o.step).split('.')[1].length : 0); return (o.fmt ? o.fmt(v) : v.toFixed(d).replace('.', ',')) + (o.unit ? ' ' + o.unit : ''); }
function info(title, html){ const el = $('#info'); el.innerHTML = `<button class="x">✕</button><h3>${title}</h3>${html}`; el.classList.add('on'); el.querySelector('.x').onclick = () => el.classList.remove('on'); }
function hint(t){ $('#hint').textContent = t; }

/* ---------- pembantu objek ---------- */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({color, roughness:.55, metalness:0}, o));
const glass = (color = 0xd8f0ff, o = {}) => new THREE.MeshPhysicalMaterial(Object.assign({color, roughness:.05, metalness:0, transmission:.9, thickness:.3, transparent:true, opacity:.55, ior:1.45, side:THREE.DoubleSide, depthWrite:false}, o));
function mesh(geo, m, parent, pos, shadow = true){ const o = new THREE.Mesh(geo, m); if(pos) o.position.set(...pos); o.castShadow = shadow; o.receiveShadow = true; (parent || E.root).add(o); return o; }
function txtSprite(text, o = {}){ const c = document.createElement('canvas'), g = c.getContext('2d'), fs = o.size || 64; g.font = `900 ${fs}px Nunito, sans-serif`;
  const w = Math.ceil(g.measureText(text).width) + fs*.8; c.width = w; c.height = fs*1.5; g.font = `900 ${fs}px Nunito, sans-serif`;
  if(o.bg){ g.fillStyle = o.bg; g.beginPath(); g.roundRect ? g.roundRect(0,0,w,fs*1.5,fs*.4) : g.rect(0,0,w,fs*1.5); g.fill(); }
  g.fillStyle = o.color || '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w/2, fs*.78);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const s = new THREE.Sprite(new THREE.SpriteMaterial({map:t, transparent:true, depthTest:o.depthTest ?? true}));
  const h = o.h || .5; s.scale.set(h*w/(fs*1.5), h, 1); return s; }
function platform(r = 7, color){ const dark = document.documentElement.dataset.theme !== 'light';
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'); g.fillStyle = color || (dark ? '#1a2f5c' : '#e9f0fa'); g.fillRect(0,0,512,512);
  g.strokeStyle = dark ? 'rgba(255,255,255,.08)' : 'rgba(15,31,61,.08)'; g.lineWidth = 2; for(let i = 0; i <= 512; i += 32){ g.beginPath(); g.moveTo(i,0); g.lineTo(i,512); g.stroke(); g.beginPath(); g.moveTo(0,i); g.lineTo(512,i); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(r/2, r/2); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const p = mesh(new THREE.CylinderGeometry(r, r*1.03, .3, 96), [mat(0x2a4a86), new THREE.MeshStandardMaterial({map:t, roughness:.85}), mat(0x2a4a86)], null, [0,-.15,0], false);
  p.receiveShadow = true; const ring = mesh(new THREE.TorusGeometry(r*1.015, .05, 12, 128), mat(0x2dd4bf, {emissive:0x2dd4bf, emissiveIntensity:.6}), null, [0,0,0], false); ring.rotation.x = Math.PI/2; return p; }
function arrow(from, dir, len, color, parent){ const a = new THREE.ArrowHelper(dir.clone().normalize(), from, len, color, Math.min(.6, len*.3), Math.min(.35, len*.18)); a.line.material.linewidth = 3; (parent || E.root).add(a); return a; }
function room(o = {}){
  const dark = document.documentElement.dataset.theme !== 'light', R = o.r || 22, Hh = o.h || 13;
  const G = new THREE.Group(); G.name = 'room'; E.root.add(G);
  const tiles = (() => { const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'); const base = o.floor || (dark ? '#3b4454' : '#d6dbe3');
    for(let y = 0; y < 4; y++) for(let x = 0; x < 4; x++){ const v = (Math.random()*16 - 8)|0; g.fillStyle = shadeHex(base, v); g.fillRect(x*128, y*128, 128, 128); }
    g.strokeStyle = dark ? 'rgba(0,0,0,.45)' : 'rgba(80,90,110,.35)'; g.lineWidth = 4; for(let i = 0; i <= 512; i += 128){ g.beginPath(); g.moveTo(i,0); g.lineTo(i,512); g.stroke(); g.beginPath(); g.moveTo(0,i); g.lineTo(512,i); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(R/3, R/3); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; })();
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(R*2, R*2), new THREE.MeshStandardMaterial({map:tiles, roughness:.32, metalness:.05})); fl.rotation.x = -Math.PI/2; fl.position.y = -.31; fl.receiveShadow = true; G.add(fl);
  const wallM = new THREE.MeshStandardMaterial({color:o.wall || (dark ? 0x26324a : 0xe8edf3), roughness:.9, side:THREE.BackSide});
  const box = new THREE.Mesh(new THREE.BoxGeometry(R*2, Hh, R*2), [wallM, wallM, new THREE.MeshStandardMaterial({color:dark ? 0x1b2436 : 0xf8fafc, roughness:.9, side:THREE.BackSide}), new THREE.MeshBasicMaterial({visible:false}), wallM, wallM]);
  box.position.y = Hh/2 - .31; G.add(box);
  // jendela bercahaya di dinding belakang
  for(let i = -1; i <= 1; i++){ const w = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), new THREE.MeshBasicMaterial({map:gradTex(dark ? [[0,'#1e3a8a'],[1,'#60a5fa']] : [[0,'#93c5fd'],[1,'#f0f9ff']])}));
    w.position.set(i*9, Hh*.55, -R + .05); G.add(w); const fr = new THREE.Mesh(new THREE.BoxGeometry(6.4, 5.4, .2), new THREE.MeshStandardMaterial({color:0xf1f5f9, roughness:.5})); fr.position.set(i*9, Hh*.55, -R + .02); G.add(fr); w.position.z = -R + .14;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(.15, 5, .1), fr.material); bar.position.set(i*9, Hh*.55, -R + .2); G.add(bar); }
  // papan tulis
  if(o.board !== false){ const bd = new THREE.Mesh(new THREE.BoxGeometry(9, 3.6, .15), new THREE.MeshStandardMaterial({color:0xf8fafc, roughness:.25, metalness:.05})); bd.position.set(-R + .1, 4.4, -3); bd.rotation.y = Math.PI/2; G.add(bd);
    const fb = new THREE.Mesh(new THREE.BoxGeometry(9.3, 3.9, .1), new THREE.MeshStandardMaterial({color:0x94a3b8, metalness:.6, roughness:.3})); fb.position.set(-R + .05, 4.4, -3); fb.rotation.y = Math.PI/2; G.add(fb); }
  // lampu panel langit-langit
  for(let i = -1; i <= 1; i++) for(let j = -1; j <= 1; j += 2){ const l = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.2), new THREE.MeshBasicMaterial({color:0xffffff})); l.rotation.x = Math.PI/2; l.position.set(i*8, Hh - .35, j*6); G.add(l); }
  // lemari & rak di dinding samping
  const cab = new THREE.MeshStandardMaterial({color:dark ? 0x475569 : 0xcbd5e1, roughness:.5, metalness:.2});
  for(let i = 0; i < 3; i++){ const c = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.5, 3.4), cab); c.position.set(R - .8, 2, -12 + i*3.6); c.castShadow = c.receiveShadow = true; G.add(c);
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(3, 3.6), new THREE.MeshPhysicalMaterial({color:0xcfe8ff, roughness:.05, transparent:true, opacity:.35})); gl.position.set(R - 1.52, 2.2, -12 + i*3.6); gl.rotation.y = -Math.PI/2; G.add(gl);
    for(let k = 0; k < 4; k++){ const b = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .6, 16), new THREE.MeshStandardMaterial({color:[0x38bdf8,0x22c55e,0xf97316,0xa855f7][k], transparent:true, opacity:.8, roughness:.1})); b.position.set(R - 1.2, 2.9, -13.1 + i*3.6 + k*.7); G.add(b); } }
  scene.fog = new THREE.Fog(dark ? 0x1b2436 : 0xe8edf3, R*1.4, R*3.2);
  cam.maxR = Math.min(cam.maxR, R*.85);
  return G; }
function shadeHex(hex, v){ const n = parseInt(hex.slice(1), 16); const c = k => Math.max(0, Math.min(255, ((n >> k) & 255) + v)); return `rgb(${c(16)},${c(8)},${c(0)})`; }
function say(key, text, auto){ if(window.LAB && LAB.guide) LAB.guide.show(ID + '_' + key, text, auto); }

/* ---------- mode & siklus ---------- */
const E = window.E3D = {THREE, scene, camera, renderer, root:null, V3, setView, label, pick, ui, info, hint, mat, glass, mesh, txtSprite, platform, arrow, say, room, canvasTexOf:gradTex, tick:fn => TICKS.push(fn), id:ID, def:DEF, mode:null, rnd:Math.random};
function clearMode(){
  if(E.root){ scene.remove(E.root); E.root.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if(m.map && m.map !== envTex) m.map.dispose(); m.dispose(); }); } }); }
  LBL.splice(0).forEach(L => L.el.remove()); PICKS.length = 0; TICKS.length = 0; $('#info').classList.remove('on'); ui.clear();
  E.root = new THREE.Group(); scene.add(E.root);
}
function setMode(id){
  const m = DEF.modes.find(x => x.id === id) || DEF.modes[0]; E.mode = m.id; clearMode();
  document.querySelectorAll('#modes .tbtn').forEach(b => b.classList.toggle('on', b.dataset.m === m.id));
  sun.position.set(8, 14, 9);
  setBg(); if((DEF.room || m.room) && m.room !== false) room(DEF.roomOpts || {});
  m.build(E);
  if(m.view) setView(m.view);
  if((DEF.room || m.room) && m.room !== false) cam.maxR = Math.min(cam.maxR, 18);
  if(m.say) say(m.id, m.say, false);
}
$('#modes').innerHTML = DEF.modes.length > 1 ? DEF.modes.map(m => `<button class="tbtn" data-m="${m.id}">${m.label}</button>`).join('') : '';
document.querySelectorAll('#modes .tbtn').forEach(b => b.onclick = () => setMode(b.dataset.m));
$('#panelBtn').onclick = () => { document.body.classList.toggle('noPanel'); $('#panelBtn').classList.toggle('on'); };
$('#resetView').onclick = () => { const m = DEF.modes.find(x => x.id === E.mode); if(m && m.view) setView(m.view); };
$('#fsBtn').onclick = () => { try{ document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }catch(e){} };
addEventListener('message', e => { if(e.data && e.data.type === 'lab-theme') setTimeout(setBg, 50); });

/* ---------- kuis dalam lab ---------- */
const QZ = {list:[], i:0, score:0};
function shuffle(a){ a = a.slice(); for(let i = a.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
function quizStart(){ const bank = (MAT.bank || []); if(!bank.length){ alert('Bank soal belum tersedia.'); return; }
  QZ.list = shuffle(bank).slice(0, Math.min(5, bank.length)); QZ.i = 0; QZ.score = 0; $('#quiz').classList.add('on'); quizShow(); }
function quizShow(){
  const q = QZ.list[QZ.i], perm = shuffle([0,1,2,3]);
  $('#qc').innerHTML = `<div class="kick" style="font-weight:900;color:var(--accent);font-size:.8em;letter-spacing:.1em">KUIS · SOAL ${QZ.i+1} DARI ${QZ.list.length}</div><h3>${q.q}</h3>
    ${perm.map((oi,k) => `<button class="qo" data-o="${oi}"><b>${'ABCD'[k]}.</b> ${q.opts[oi]}</button>`).join('')}<div class="qfb"></div>
    <div class="btns" style="justify-content:space-between"><button class="btn" id="qClose">✕ Tutup</button><button class="btn p" id="qNext" style="display:none">${QZ.i+1 < QZ.list.length ? 'Soal berikutnya ▶' : 'Lihat skor ▶'}</button></div>`;
  $('#qClose').onclick = () => $('#quiz').classList.remove('on');
  document.querySelectorAll('.qo').forEach(b => b.onclick = () => { if($('#qc').dataset.done === '1') return; $('#qc').dataset.done = '1';
    const ok = +b.dataset.o === q.ans; if(ok) QZ.score++;
    document.querySelectorAll('.qo').forEach(x => { if(+x.dataset.o === q.ans) x.classList.add('ok'); else if(x === b) x.classList.add('no'); });
    $('.qfb').innerHTML = `<b>${ok ? '🎉 Tepat!' : '❌ Belum tepat.'}</b> ${q.exp}${!ok && q.misc ? `<div class="note" style="margin-top:.4em">⚠️ ${q.misc}</div>` : ''}`;
    $('#qNext').style.display = ''; });
  $('#qc').dataset.done = '0';
  $('#qNext').onclick = () => { QZ.i++; if(QZ.i < QZ.list.length) quizShow(); else {
    const pct = Math.round(QZ.score/QZ.list.length*100);
    $('#qc').innerHTML = `<div style="text-align:center"><div style="font-size:4em">${pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div><h3>Skor kamu: ${QZ.score}/${QZ.list.length} (${pct})</h3><p>${pct >= 80 ? 'Hebat! Kamu sudah memahami materi ini.' : pct >= 60 ? 'Bagus! Ulangi eksperimennya untuk memperkuat pemahaman.' : 'Ayo jelajahi simulasinya lagi, lalu coba kuis sekali lagi!'}</p>
      <div class="btns" style="justify-content:center"><button class="btn" id="qClose2">Kembali ke simulasi</button><button class="btn p" id="qAgain">🔁 Ulangi kuis</button></div></div>`;
    $('#qClose2').onclick = () => $('#quiz').classList.remove('on'); $('#qAgain').onclick = quizStart; } };
}
$('#quizBtn').onclick = quizStart;

/* ---------- loop ---------- */
function resize(){ renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
let last = performance.now(), T = 0;
function frame(now){ const dt = Math.max(0, Math.min(.05, (now - last)/1000)); last = now; T += dt;
  TICKS.forEach(f => { try{ f(dt, T); }catch(e){ console.error(e); } });
  applyCam(dt); updLabels(); renderer.render(scene, camera); requestAnimationFrame(frame); }
setMode(P.get('m') || DEF.modes[0].id);
const firstView = DEF.modes.find(x => x.id === E.mode).view; if(firstView) setView(firstView, true);
if(window.LAB && LAB.guide) LAB.guide.init(ID, ID + '_greet', DEF.greet || `Halo! Selamat datang di simulasi ${DEF.title}. Ayo bereksperimen!`);
requestAnimationFrame(frame);
setTimeout(() => $('#loading').classList.add('off'), 300);
})();
