/* ===== Lab Virtual 3D — mode tambahan (lebih detail & realistis) =====
   Dimuat setelah topics.js. Menambah mode baru dan latar ruang laboratorium. */
(function(){
const T3 = window.TOPICS3D, PI = Math.PI, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',');
function addMode(id, mode, at){ const d = T3[id]; if(!d) return; if(at == null) d.modes.push(mode); else d.modes.splice(at, 0, mode); }
/* ruang laboratorium untuk topik di dalam kelas */
['hakikat-sains','pengukuran','wujud-zat','kalor','materi','usaha'].forEach(id => { if(T3[id]) T3[id].room = true; });
function flame(E, parent, pos, s = 1){ const g = new THREE.Group(); g.position.set(...pos); (parent || E.root).add(g);
  const f1 = E.mesh(new THREE.ConeGeometry(.12*s, .45*s, 16), E.mat(0xfb923c, {emissive:0xf97316, emissiveIntensity:2, transparent:true, opacity:.85}), g, [0, .22*s, 0], false);
  const f2 = E.mesh(new THREE.ConeGeometry(.06*s, .25*s, 16), E.mat(0x93c5fd, {emissive:0x3b82f6, emissiveIntensity:2, transparent:true, opacity:.8}), g, [0, .12*s, 0], false);
  const L = new THREE.PointLight(0xff9a3c, 3, 3); L.position.y = .4*s; g.add(L);
  E.tick((dt, t) => { const k = 1 + Math.sin(t*25)*.12 + Math.sin(t*17)*.08; f1.scale.set(1, k, 1); f2.scale.set(1, 2 - k, 1); L.intensity = 2.5 + k; }); return g; }
function burner(E, parent, pos){ const g = new THREE.Group(); g.position.set(...pos); (parent || E.root).add(g);
  E.mesh(new THREE.CylinderGeometry(.32, .38, .45, 32), E.glass(0xe0f2fe, {opacity:.5}), g, [0, .22, 0]);
  E.mesh(new THREE.CylinderGeometry(.3, .34, .28, 32), E.mat(0x60a5fa, {transparent:true, opacity:.55}), g, [0, .15, 0], false);
  E.mesh(new THREE.CylinderGeometry(.07, .07, .2, 16), E.mat(0x94a3b8, {metalness:.8, roughness:.3}), g, [0, .53, 0]); flame(E, g, [0, .62, 0]); return g; }
function tripod(E, parent, pos, h = 1.2){ const g = new THREE.Group(); g.position.set(...pos); (parent || E.root).add(g); const m = E.mat(0x475569, {metalness:.7, roughness:.35});
  for(let i = 0; i < 3; i++){ const a = i/3*PI*2, l = E.mesh(new THREE.CylinderGeometry(.03, .03, h*1.02, 8), m, g, [Math.cos(a)*.42, h/2, Math.sin(a)*.42]); l.rotation.z = Math.cos(a)*.18; l.rotation.x = -Math.sin(a)*.18; }
  E.mesh(new THREE.TorusGeometry(.5, .03, 8, 32), m, g, [0, h, 0]).rotation.x = PI/2; const gauze = E.mesh(new THREE.BoxGeometry(1.1, .02, 1.1), E.mat(0x9ca3af, {metalness:.5, roughness:.6}), g, [0, h + .02, 0]); return g; }
function puffs(E, origin, n, col, rate){ const P = []; for(let i = 0; i < n; i++){ const m = E.mesh(new THREE.SphereGeometry(.18, 12, 8), E.mat(col, {transparent:true, opacity:0, roughness:1, depthWrite:false}), null, null, false); P.push({m, t:Math.random()}); }
  E.tick((dt) => { const r = typeof rate === 'function' ? rate() : rate; P.forEach(p => { p.t += dt*.35*(r > 0 ? 1 : 0); if(p.t > 1){ p.t = 0; } const o = typeof origin === 'function' ? origin() : origin;
    p.m.position.set(o.x + Math.sin(p.t*6 + p.m.id)*.25*p.t, o.y + p.t*2.2, o.z + Math.cos(p.t*5 + p.m.id)*.2*p.t); p.m.scale.setScalar(.6 + p.t*2.2); p.m.material.opacity = r > 0 ? Math.sin(p.t*PI)*.45*r : Math.max(0, p.m.material.opacity - dt); }); }); }

/* ============ WUJUD ZAT: massa jenis (terapung–melayang–tenggelam) ============ */
addMode('wujud-zat', {id:'massajenis', label:'⚖️ Massa Jenis', view:{target:[0,1.8,0], radius:10, theta:.3, phi:1.2, minR:4},
 say:'Benda terapung jika massa jenisnya lebih kecil daripada massa jenis zat cair, melayang jika sama, dan tenggelam jika lebih besar. Ubah zat cairnya dan amati telur!',
 build(E){
  E.platform(7); const W = 7, D = 3, Ht = 3.4, wl = 2.7;
  E.mesh(new THREE.BoxGeometry(W, Ht, D), E.glass(0xe0f2fe, {opacity:.14}), null, [0, Ht/2, 0], false);
  const ed = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, Ht, D)), new THREE.LineBasicMaterial({color:0x7dd3fc})); ed.position.y = Ht/2; E.root.add(ed);
  const wm = new THREE.MeshPhysicalMaterial({color:0x38bdf8, transparent:true, opacity:.42, roughness:.05, clearcoat:1, depthWrite:false});
  const water = E.mesh(new THREE.BoxGeometry(W - .08, wl, D - .08), wm, null, [0, wl/2 + .02, 0], false);
  const surf = E.mesh(new THREE.PlaneGeometry(W - .1, D - .1, 40, 12), new THREE.MeshPhysicalMaterial({color:0x7dd3fc, transparent:true, opacity:.5, roughness:.02, clearcoat:1, side:THREE.DoubleSide}), null, [0, wl + .02, 0], false); surf.rotation.x = -PI/2;
  const OB = [['🪵 Kayu', .6, new THREE.BoxGeometry(.75, .45, .55), E.mat(0xa16207, {roughness:.85}), .45],
    ['🧊 Es batu', .92, new THREE.BoxGeometry(.55, .55, .55), new THREE.MeshPhysicalMaterial({color:0xe0f2fe, roughness:.05, transparent:true, opacity:.7, clearcoat:1}), .55],
    ['🥚 Telur', 1.08, new THREE.SphereGeometry(.28, 32, 24), E.mat(0xfef3c7, {roughness:.5}), .72],
    ['🟣 Plastisin', 1.5, new THREE.BoxGeometry(.5, .4, .5), E.mat(0xa855f7, {roughness:.7}), .4],
    ['🪨 Batu', 2.6, new THREE.DodecahedronGeometry(.32), E.mat(0x78716c, {roughness:.95}), .6],
    ['🔩 Besi', 7.9, new THREE.CylinderGeometry(.2, .2, .55, 24), E.mat(0x94a3b8, {metalness:.95, roughness:.25}), .55]];
  let rhoF = 1; const objs = OB.map(([n, rho, geo, m, hg], i) => { const o = E.mesh(geo, m, null, [-2.9 + i*1.16, Ht + .8, 0]); if(n.includes('Telur')) o.scale.y = 1.3;
    const L = E.label(o, `${n}<br><small>ρ = ${fmt(rho, 2)}</small>`, {off:E.V3(0, .65, 0)}); E.pick(o, () => E.info(n, `<p>Massa jenis ≈ <b>${fmt(rho, 2)} g/cm³</b>.</p><p>${rho < rhoF ? 'Lebih kecil dari zat cair → <b>terapung</b>.' : Math.abs(rho - rhoF) < .03 ? 'Sama dengan zat cair → <b>melayang</b>.' : 'Lebih besar dari zat cair → <b>tenggelam</b>.'}</p>`));
    return {o, rho, hg, v:0, n}; });
  const LQ = [[.8, 'Minyak goreng', 0xfacc15], [1, 'Air tawar', 0x38bdf8], [1.03, 'Air laut', 0x0ea5e9], [1.08, 'Air + sedikit garam', 0x22d3ee], [1.2, 'Air garam pekat', 0x67e8f9]];
  const R = E.ui; R.head('MASSA JENIS', 'Terapung, Melayang, Tenggelam', 'Pilih zat cair dan amati posisi tiap benda. ρ dalam g/cm³.');
  let rd = null; const s = R.sec('Zat cair dalam akuarium');
  R.seg(s, LQ.map(l => [String(l[0]), `${l[1]} (${fmt(l[0], 2)})`]), '1', v => { rhoF = +v; const l = LQ.find(x => String(x[0]) === v); wm.color.set(l[2]); surf.material.color.set(l[2]).offsetHSL(0, 0, .15); });
  rd = R.reads(R.sec('Status benda'), objs.map((b, i) => ['o' + i, b.n]));
  R.sec('Rumus', '<div class="formula">ρ = m ÷ V</div><p>ρ<sub>benda</sub> &lt; ρ<sub>cair</sub> → terapung · = → melayang · &gt; → tenggelam</p><p class="note">Telur tenggelam di air tawar tetapi terapung di air garam pekat — karena massa jenis air garam lebih besar!</p>');
  E.tick((dt, t) => { surf.geometry.attributes.position.array.forEach((_, k, a) => { if(k % 3 === 2) a[k] = Math.sin(t*2 + a[k - 2]*1.5)*.025 + Math.cos(t*1.6 + a[k - 1]*2)*.02; }); surf.geometry.attributes.position.needsUpdate = true;
    objs.forEach((b, i) => { const st = b.rho < rhoF - .02 ? 0 : Math.abs(b.rho - rhoF) <= .02 ? 1 : 2; const hh = b.hg*(b.n.includes('Telur') ? 1 : 1);
      const ty = st === 0 ? wl + hh/2 - (b.rho/rhoF)*hh + Math.sin(t*1.8 + i)*.03 : st === 1 ? wl*.5 + Math.sin(t + i)*.06 : hh/2 + .05;
      const inW = b.o.position.y < wl; b.v += ((ty - b.o.position.y)*(inW ? 3 : 12) - b.v*(inW ? 2.4 : .4))*dt; b.o.position.y += b.v*dt; if(b.o.position.y < hh/2 + .04){ b.o.position.y = hh/2 + .04; b.v = 0; }
      b.o.rotation.z = st === 0 ? Math.sin(t*1.5 + i)*.06 : 0; rd && rd['o' + i](['🛟 Terapung', '🫧 Melayang', '⬇️ Tenggelam'][st]); }); });
 }}, 2);

/* ============ PENGUKURAN: neraca Ohaus tiga lengan ============ */
addMode('pengukuran', {id:'neraca', label:'⚖️ Neraca Ohaus', view:{target:[1,1.3,0], radius:8.5, theta:-.12, phi:1.22, minR:3},
 say:'Neraca Ohaus tiga lengan mengukur massa benda. Geser anak timbangan pada lengan ratusan, puluhan, dan satuan sampai jarum menunjuk tepat di angka nol.',
 build(E){
  E.platform(6); const metal = E.mat(0xcbd5e1, {metalness:.85, roughness:.25}), dark = E.mat(0x334155, {metalness:.6, roughness:.4});
  E.mesh(new THREE.BoxGeometry(5.2, .3, 1.6), E.mat(0x1e293b, {roughness:.4}), null, [.6, .15, 0]);
  E.mesh(new THREE.CylinderGeometry(.1, .1, .9, 16), metal, null, [-1.3, .7, 0]); const pan = E.mesh(new THREE.CylinderGeometry(.85, .8, .06, 48), metal, null, [-1.3, 1.17, 0]);
  E.mesh(new THREE.BoxGeometry(.3, 1.3, .5), dark, null, [-.4, .95, 0]);
  const beams = new THREE.Group(); beams.position.set(-.4, 1.55, 0); E.root.add(beams);
  const BEAM = [[0, 200, 100, 'ratusan', .3], [1, 100, 10, 'puluhan', 0], [2, 10, .1, 'satuan', -.3]];
  const len = 3.4; const rid = BEAM.map(([i, max, step, nm, z]) => { E.mesh(new THREE.BoxGeometry(len, .08, .12), metal, beams, [len/2 + .1, .05 - i*.02, z]);
    const tex = (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 64; const g = c.getContext('2d'); g.fillStyle = '#e2e8f0'; g.fillRect(0, 0, 1024, 64); g.fillStyle = '#0f172a'; g.font = '900 26px Nunito,sans-serif'; g.textAlign = 'center';
      const n = max === 10 ? 100 : max/step; for(let k = 0; k <= n; k++){ const x = 20 + k*(984/n); g.fillRect(x - 1, 0, 2, k % (max === 10 ? 10 : 1) ? 16 : 30); if(max === 10 ? k % 10 === 0 : true) g.fillText(String(max === 10 ? k/10 : k*step), x, 56); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const lab = E.mesh(new THREE.PlaneGeometry(len, .18), new THREE.MeshBasicMaterial({map:tex}), beams, [len/2 + .1, .05 - i*.02, z + .065], false);
    const r = E.mesh(new THREE.BoxGeometry(.16, .22, .2), E.mat([0xef4444, 0x0ea5e9, 0xf59e0b][i], {roughness:.35}), beams, [.1 + .07, .1 - i*.02, z]); return {r, max, step, val:0, z}; });
  const ptr = E.mesh(new THREE.BoxGeometry(.4, .04, .04), E.mat(0xef4444), beams, [len + .35, .05, 0]);
  E.mesh(new THREE.BoxGeometry(.06, .7, .3), dark, null, [len - .4 + .9, 1.55, 0]); E.mesh(new THREE.BoxGeometry(.08, .03, .32), E.mat(0x22c55e, {emissive:0x22c55e, emissiveIntensity:.6}), null, [len - .4 + .9 - .02, 1.6, 0]);
  const OBJ = [['🍎 Apel', 182.4, () => { const g = new THREE.Group(); E.mesh(new THREE.SphereGeometry(.38, 32, 24), E.mat(0xdc2626, {roughness:.35}), g); E.mesh(new THREE.CylinderGeometry(.02, .02, .2, 8), E.mat(0x78350f), g, [0, .42, 0]); return g; }],
    ['🪨 Batu', 356.5, () => { const m = E.mesh(new THREE.DodecahedronGeometry(.42), E.mat(0x78716c, {roughness:.95})); return m; }], ['📘 Buku', 85.2, () => E.mesh(new THREE.BoxGeometry(.9, .12, .65), E.mat(0x2563eb, {roughness:.6}))],
    ['🔑 Kunci', 23.7, () => E.mesh(new THREE.TorusGeometry(.14, .05, 10, 24), E.mat(0xeab308, {metalness:.9, roughness:.25}))]];
  let cur = 0, mObj = OBJ[0][1], objM = null, tilt = 0, rd = null; const sl = [];
  function setObj(i){ cur = i; mObj = OBJ[i][1]; if(objM) E.root.remove(objM); objM = OBJ[i][2](); if(objM.parent !== E.root) E.root.add(objM); objM.position.set(-1.3, 1.6, 0); }
  const R = E.ui; R.head('NERACA OHAUS', 'Mengukur massa', 'Pilih benda, lalu geser anak timbangan sampai jarum di angka nol (seimbang).');
  R.seg(R.sec('Benda di piringan'), OBJ.map((o, i) => [String(i), o[0]]), '0', v => { setObj(+v); });
  const ss = R.sec('Anak timbangan'); rid.forEach((b, i) => sl.push(R.slider(ss, {label:['Lengan ratusan','Lengan puluhan','Lengan satuan'][i], min:0, max:b.max, step:b.step, value:0, unit:'g', dec:i === 2 ? 1 : 0, on:v => { b.val = v; }})));
  R.buttons(ss, [{label:'🪄 Bantu aku', on:() => { let m = mObj; const h = Math.min(200, Math.floor(m/100)*100); m -= h; const p = Math.floor(m/10)*10; m -= p; [h, p, Math.round(m*10)/10].forEach((v, i) => { sl[i].set(v); rid[i].val = v; }); }}, {label:'↺ Nol', on:() => sl.forEach((s, i) => { s.set(0); rid[i].val = 0; })}]);
  rd = R.reads(R.sec('Pembacaan'), [['r','Total anak timbangan'],['s','Status']]);
  R.sec('Cara membaca', '<p>Massa = lengan ratusan + lengan puluhan + lengan satuan. Contoh: 100 + 80 + 2,4 = <b>182,4 g</b>. Ketelitian neraca Ohaus 311 adalah <b>0,1 g</b>.</p>');
  E.tick((dt, t) => { const reading = rid.reduce((a, b) => a + b.val, 0), diff = mObj - reading; const goal = clamp(diff*.004, -.12, .12); tilt += (goal - tilt)*Math.min(1, dt*3);
    beams.rotation.z = -tilt; pan.position.y = 1.17 + Math.sin(-tilt)*-.9 - tilt*.4; if(objM) objM.position.y = pan.position.y + .43;
    rid.forEach(b => { b.r.position.x = .17 + (b.val/b.max)*(len - .14); });
    rd && rd.r(`${fmt(reading, 1)} g`); rd && rd.s(Math.abs(diff) < .05 ? `✅ Seimbang! Massa = ${fmt(mObj, 1)} g` : diff > 0 ? '⬆️ Benda lebih berat — tambah anak timbangan' : '⬇️ Terlalu berat — kurangi anak timbangan'); });
  setObj(0);
 }});

/* ============ USAHA: katrol & bidang miring ============ */
addMode('usaha', {id:'katrol', label:'🎡 Katrol', view:{target:[0,3,0], radius:11, theta:.25, phi:1.25},
 say:'Katrol tetap hanya mengubah arah gaya. Katrol bebas memperkecil gaya menjadi setengahnya. Takal atau katrol majemuk memperkecil gaya sesuai banyaknya tali yang menopang beban.',
 build(E){
  E.platform(7); const steel = E.mat(0x94a3b8, {metalness:.85, roughness:.3}), woodM = E.mat(0x92400e, {roughness:.7});
  E.mesh(new THREE.BoxGeometry(8, .3, .6), woodM, null, [0, 6.3, 0]); [-3.8, 3.8].forEach(x => E.mesh(new THREE.BoxGeometry(.3, 6.3, .6), woodM, null, [x, 3.15, 0]));
  const G = new THREE.Group(); E.root.add(G); let type = 'tetap', w = 300, k = 0, rd = null; const ropeM = new THREE.LineBasicMaterial({color:0xfde68a});
  function wheel(x, y){ const g = new THREE.Group(); g.position.set(x, y, 0); G.add(g); E.mesh(new THREE.CylinderGeometry(.42, .42, .16, 40), steel, g).rotation.x = PI/2; E.mesh(new THREE.TorusGeometry(.42, .05, 10, 40), E.mat(0x475569, {metalness:.7}), g); E.mesh(new THREE.CylinderGeometry(.07, .07, .3, 12), E.mat(0x1e293b), g).rotation.x = PI/2; return g; }
  let parts = {}; const rope = new THREE.Line(new THREE.BufferGeometry(), ropeM); E.root.add(rope); const lineW = new THREE.Line(new THREE.BufferGeometry(), ropeM); E.root.add(lineW);
  const load = new THREE.Group(); E.root.add(load); E.mesh(new THREE.BoxGeometry(1.1, .9, .8), E.mat(0x7c3aed, {roughness:.5}), load); const lt = E.txtSprite('beban', {size:48, h:.3}); lt.position.y = .7; load.add(lt);
  const hand = E.mesh(new THREE.SphereGeometry(.22, 20, 16), E.mat(0xfcd34d, {roughness:.6}));
  function build(){ G.clear(); parts = {}; if(type === 'tetap'){ parts.a = wheel(0, 5.6); } else if(type === 'bebas'){ parts.m = wheel(0, 3); } else { parts.a = wheel(-.55, 5.6); parts.b = wheel(.55, 5.6); parts.m = wheel(-.55, 3); parts.m2 = wheel(.55, 2.6); } }
  const KM = () => ({tetap:1, bebas:2, takal:4}[type]);
  const R = E.ui; R.head('KATROL', 'Pesawat sederhana: katrol', 'Pilih jenis katrol, atur berat beban, lalu tarik talinya.');
  R.seg(R.sec('Jenis katrol'), [['tetap','Tetap'],['bebas','Bebas'],['takal','Takal (4 tali)']], 'tetap', v => { type = v; build(); });
  const s = R.sec('Atur'); R.slider(s, {label:'Berat beban (w)', min:100, max:600, step:50, value:300, unit:'N', on:v => w = v}); R.slider(s, {label:'Tarik tali', min:0, max:100, step:1, value:0, unit:'%', on:v => k = v/100});
  rd = R.reads(R.sec('Hasil'), [['km','Keuntungan mekanis'],['f','Gaya kuasa F'],['h','Beban naik'],['t','Tali ditarik']]);
  R.sec('Ingat', '<p>KM = w ÷ F. Tali yang ditarik = KM × tinggi beban naik → <b>usaha tetap sama</b> (W = F × s).</p>');
  E.tick((dt, t) => { const km = KM(), h = k*2, F = w/km; const ly = 1 + h; load.position.set(type === 'tetap' ? -.42 : type === 'bebas' ? 0 : 0, ly, 0);
    let P = []; if(type === 'tetap'){ const a = parts.a.position; P = [[-.42, ly + .45], [-.42, a.y], [.42, a.y], [.42, 3.4 - k*2*km*.5]]; hand.position.set(.42, P[3][1], 0); }
    else if(type === 'bebas'){ parts.m.position.y = ly + 1.2; const m = parts.m.position; P = [[-.42, 6.15], [-.42, m.y], [.42, m.y], [.42, 6.15], [1.4, 6.15]]; hand.position.set(1.6, 6.15, 0); }
    else { parts.m.position.y = ly + 1.6; parts.m2.position.y = ly + 1.1; const A = parts.a.position, B = parts.b.position, M = parts.m.position, M2 = parts.m2.position; P = [[-.97, 6.15], [-.97, M.y], [-.13, M.y], [-.13, A.y], [.13, B.y], [.13, M2.y], [.97, M2.y], [.97, B.y], [.97, 4.2 - k*1.5]]; hand.position.set(.97, P[8][1], 0);
      lineW.geometry.setFromPoints([E.V3(-.55, M.y, 0), E.V3(-.55, ly + .45, 0), E.V3(.55, M2.y, 0)]); }
    if(type !== 'takal') lineW.geometry.setFromPoints(type === 'bebas' ? [E.V3(0, parts.m.position.y, 0), E.V3(0, ly + .45, 0)] : []);
    rope.geometry.setFromPoints(P.map(p => E.V3(p[0], p[1], 0))); G.children.forEach(c => c.rotation.z = -k*8);
    rd && rd.km(String(km)); rd && rd.f(`${fmt(F, 0)} N`); rd && rd.h(`${fmt(h, 2)} m`); rd && rd.t(`${fmt(h*km, 2)} m`); });
  build();
 }});
addMode('usaha', {id:'miring', label:'📐 Bidang Miring', view:{target:[0,1.5,0], radius:10, theta:.5, phi:1.2},
 say:'Bidang miring memperkecil gaya yang diperlukan untuk menaikkan benda. Makin landai bidang miring, makin kecil gaya, tetapi lintasannya makin panjang.',
 build(E){
  E.platform(7); let h = 1.5, s = 5, k = 0, run = false, rd = null; const w = 200;
  const ramp = new THREE.Mesh(new THREE.BufferGeometry(), E.mat(0xa16207, {roughness:.75, side:THREE.DoubleSide})); ramp.castShadow = ramp.receiveShadow = true; E.root.add(ramp);
  const top = E.mesh(new THREE.BoxGeometry(1.6, 1, 2), E.mat(0x64748b, {roughness:.6}), null, [0, .5, 0]);
  const box = E.mesh(new THREE.BoxGeometry(.7, .55, .7), E.mat(0x7c3aed, {roughness:.5}));
  const arrF = E.arrow(E.V3(), E.V3(1, 0, 0), 1, 0xef4444); const lb = E.label(box, 'F', {off:E.V3(0, .7, 0)});
  function geo(){ const d = Math.sqrt(Math.max(.1, s*s - h*h)), x0 = -d/2, x1 = d/2; const v = [x0,0,-1, x1,0,-1, x1,h,-1, x0,0,1, x1,0,1, x1,h,1];
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.setIndex([0,2,1, 3,4,5, 0,3,5, 0,5,2, 1,2,5, 1,5,4, 0,1,4, 0,4,3]); g.computeVertexNormals(); ramp.geometry.dispose(); ramp.geometry = g;
    top.scale.y = h; top.position.set(x1 + .8, h/2, 0); return {x0, x1, d}; }
  let G0 = geo();
  const R = E.ui; R.head('BIDANG MIRING', 'Makin landai, makin ringan', 'Atur tinggi bidang miring, lalu tekan Tarik. Berat kotak w = 200 N, panjang lintasan s = 5 m.');
  const sc = R.sec('Atur'); R.slider(sc, {label:'Tinggi (h)', min:.5, max:4, step:.1, value:1.5, unit:'m', on:v => { h = v; G0 = geo(); k = 0; }});
  R.buttons(sc, [{label:'▶ Tarik ke atas', cls:'p', on:() => { k = 0; run = true; }}, {label:'↺ Ulang', on:() => { k = 0; run = false; }}]);
  rd = R.reads(R.sec('Hasil'), [['km','KM = s ÷ h'],['f','F = w × h ÷ s'],['w','Usaha W = F × s'],['a','Sudut kemiringan']]);
  R.sec('Contoh di sekitar', '<ul class="pts"><li>Jalan berkelok di pegunungan</li><li>Tangga & ramp kursi roda</li><li>Sekrup & ulir (bidang miring yang melilit)</li><li>Pisau & kapak (baji)</li></ul>');
  E.tick((dt) => { if(run){ k = Math.min(1, k + dt*.25); if(k >= 1) run = false; } const ang = Math.asin(h/s), px = G0.x0 + Math.cos(ang)*s*k, py = Math.sin(ang)*s*k;
    box.position.set(px + Math.sin(ang)*.28 - Math.cos(ang)*0, py + Math.cos(ang)*.28, 0); box.rotation.z = ang;
    const F = w*h/s; arrF.position.copy(box.position).add(E.V3(Math.cos(ang)*.4, Math.sin(ang)*.4, 0)); arrF.setDirection(E.V3(Math.cos(ang), Math.sin(ang), 0)); arrF.setLength(.4 + F/120, .25, .15);
    lb.el.innerHTML = `F = ${fmt(F, 0)} N`;
    rd && rd.km(fmt(s/h, 2)); rd && rd.f(`${fmt(F, 0)} N`); rd && rd.w(`${fmt(F*s, 0)} J = w × h`); rd && rd.a(`${fmt(ang*180/PI, 0)}°`); });
 }});

/* ============ UNSUR SENYAWA CAMPURAN: pemisahan campuran ============ */
addMode('materi', {id:'pemisahan', label:'🧪 Pemisahan', room:true, view:{target:[0,1.8,0], radius:8, theta:.35, phi:1.2, minR:3},
 say:'Campuran dapat dipisahkan dengan cara fisika: penyaringan berdasarkan ukuran partikel, penguapan untuk mengambil zat terlarut, dan penyulingan berdasarkan perbedaan titik didih.',
 build(E){
  E.platform(6); let mode = 'filtrasi', T = 0, ready = false; const G = new THREE.Group(); E.root.add(G); let rd = null;
  const R = E.ui; R.head('PEMISAHAN CAMPURAN', 'Memisahkan campuran', 'Pilih metode dan amati prosesnya.');
  const DESC = {filtrasi:['Air + pasir', 'Perbedaan ukuran partikel', 'saringan air, saringan teh, masker'], evaporasi:['Air + garam', 'Zat terlarut tidak ikut menguap', 'tambak garam'], destilasi:['Air + garam (air laut)', 'Perbedaan titik didih', 'air suling, minyak atsiri, desalinasi']};
  R.seg(R.sec('Metode'), [['filtrasi','🧻 Penyaringan'],['evaporasi','♨️ Penguapan'],['destilasi','🌡️ Penyulingan']], 'filtrasi', v => { mode = v; T = 0; if(ready) build(); });
  rd = R.reads(R.sec('Keterangan'), [['c','Campuran'],['p','Prinsip'],['a','Penerapan'],['s','Proses']]);
  const ticks = []; function build(){ G.clear(); ticks.length = 0; const d = DESC[mode]; rd.c(d[0]); rd.p(d[1]); rd.a(d[2]);
    if(mode === 'filtrasi'){ const st = E.mat(0x475569, {metalness:.7, roughness:.35}); E.mesh(new THREE.CylinderGeometry(.04, .04, 3.4, 12), st, G, [-1.2, 1.7, 0]); E.mesh(new THREE.BoxGeometry(1.4, .06, .06), st, G, [-.55, 2.75, 0]); E.mesh(new THREE.TorusGeometry(.5, .04, 8, 32), st, G, [0, 2.75, 0]).rotation.x = PI/2;
      E.mesh(new THREE.ConeGeometry(.62, 1, 40, 1, true), E.glass(0xe0f2fe, {opacity:.35}), G, [0, 2.9, 0]).rotation.x = PI; E.mesh(new THREE.ConeGeometry(.56, .9, 40, 1, true), E.mat(0xffffff, {roughness:.95, side:THREE.DoubleSide}), G, [0, 2.95, 0]).rotation.x = PI;
      E.mesh(new THREE.CylinderGeometry(.07, .05, .7, 16), E.glass(0xe0f2fe, {opacity:.4}), G, [0, 2.1, 0]);
      const bk = new THREE.Group(); bk.position.set(0, 0, 0); G.add(bk); E.mesh(new THREE.CylinderGeometry(.75, .7, 1.4, 40, 1, true), E.glass(0xe0f2fe, {opacity:.25}), bk, [0, .7, 0]); const lq = E.mesh(new THREE.CylinderGeometry(.68, .66, 1, 40), E.mat(0x7dd3fc, {transparent:true, opacity:.6, roughness:.05}), bk, [0, .02, 0], false);
      const sand = []; for(let i = 0; i < 40; i++) sand.push(E.mesh(new THREE.SphereGeometry(.05 + Math.random()*.03, 8, 6), E.mat(0xa16207, {roughness:1}), G, [0, -10, 0], false));
      const drops = []; for(let i = 0; i < 6; i++) drops.push({m:E.mesh(new THREE.SphereGeometry(.05, 10, 8), E.mat(0x38bdf8, {roughness:.05}), G, [0, -10, 0], false), o:i/6});
      // gelas campuran keruh yang dituang
      const pour = new THREE.Group(); pour.position.set(1.1, 3.6, 0); G.add(pour); E.mesh(new THREE.CylinderGeometry(.35, .32, .8, 32, 1, true), E.glass(0xe0f2fe, {opacity:.3}), pour, [0, 0, 0]); const mud = E.mesh(new THREE.CylinderGeometry(.32, .3, .5, 32), E.mat(0x92400e, {transparent:true, opacity:.75}), pour, [0, -.12, 0], false);
      ticks.push((dt) => { const k = Math.min(1, T/12); pour.rotation.z = Math.min(1.6, T*.6); mud.scale.y = Math.max(.05, 1 - k); lq.scale.y = Math.max(.02, k); lq.position.y = .02 + k*.5;
        sand.forEach((s, i) => { const kk = clamp(T*.25 - i*.03, 0, 1); const a = i*2.4, r = .25*Math.sqrt((i % 20)/20); s.position.set(Math.cos(a)*r, kk <= 0 ? -10 : 3.4 - Math.min(kk, 1)*.95 + (i/40)*.25, Math.sin(a)*r); });
        drops.forEach(d => { const p = ((T*.7 + d.o) % 1); d.m.position.set(0, T > 1.5 && k < 1 ? 1.75 - p*1.1 : -10, 0); }); rd.s(k < 1 ? 'Air keruh disaring… pasir tertahan di kertas saring (residu)' : '✅ Filtrat jernih di gelas, pasir tertinggal'); }); }
    if(mode === 'evaporasi'){ tripod(E, G, [0, 0, 0], 1.3); burner(E, G, [0, 0, 0]); const dish = lathe(E, [[0, 0], [.6, .04], [.8, .25], [.82, .27]], E.mat(0xf8fafc, {roughness:.3, side:THREE.DoubleSide}), G, [0, 1.36, 0]);
      const lq = E.mesh(new THREE.CylinderGeometry(.68, .5, .14, 40), E.mat(0x38bdf8, {transparent:true, opacity:.55, roughness:.05}), G, [0, 1.45, 0], false);
      const salt = []; for(let i = 0; i < 40; i++){ const a = i*2.4, r = .55*Math.sqrt(i/40); salt.push(E.mesh(new THREE.BoxGeometry(.06, .06, .06), E.mat(0xffffff, {roughness:.4}), G, [Math.cos(a)*r, 1.4 + (r > .4 ? .05 : 0), Math.sin(a)*r], false)); }
      puffs(E, E.V3(0, 1.6, 0), 10, 0xffffff, () => mode === 'evaporasi' && T < 14 ? 1 : 0);
      ticks.push(() => { const k = Math.min(1, T/14); lq.scale.set(1 - k*.4, Math.max(.02, 1 - k), 1 - k*.4); salt.forEach((s, i) => s.scale.setScalar(clamp(k*2 - i/40, 0, 1))); rd.s(k < 1 ? `Air menguap… ${Math.round(k*100)}%` : '✅ Air habis menguap, kristal garam tertinggal'); }); }
    if(mode === 'destilasi'){ burner(E, G, [-2, 0, 0]); tripod(E, G, [-2, 0, 0], 1.25); const fl = new THREE.Group(); fl.position.set(-2, 1.3, 0); G.add(fl);
      E.mesh(new THREE.SphereGeometry(.6, 32, 24), E.glass(0xe0f2fe, {opacity:.3}), fl, [0, .6, 0]); const lq = E.mesh(new THREE.SphereGeometry(.56, 32, 24, 0, PI*2, PI*.5, PI*.5), E.mat(0x0ea5e9, {transparent:true, opacity:.6}), fl, [0, .62, 0], false);
      E.mesh(new THREE.CylinderGeometry(.1, .1, .8, 16), E.glass(0xe0f2fe, {opacity:.35}), fl, [0, 1.5, 0]);
      const cond = new THREE.Group(); cond.position.set(-.35, 2.85, 0); cond.rotation.z = -.42; G.add(cond); E.mesh(new THREE.CylinderGeometry(.08, .08, 3.6, 16), E.glass(0xe0f2fe, {opacity:.45}), cond, [0, -1.8, 0]).rotation.z = 0; cond.children[0].rotation.z = PI/2; cond.children[0].position.set(1.8, 0, 0);
      E.mesh(new THREE.CylinderGeometry(.25, .25, 2.6, 24, 1, true), E.glass(0x93c5fd, {opacity:.3}), cond, [1.8, 0, 0]).rotation.z = PI/2;
      const rec = new THREE.Group(); rec.position.set(1.45, 0, 0); G.add(rec); E.mesh(new THREE.ConeGeometry(.6, 1.2, 32, 1, true), E.glass(0xe0f2fe, {opacity:.3}), rec, [0, .6, 0]); const rl = E.mesh(new THREE.CylinderGeometry(.5, .55, .3, 32), E.mat(0x7dd3fc, {transparent:true, opacity:.6}), rec, [0, .15, 0], false);
      const vap = []; for(let i = 0; i < 10; i++) vap.push({m:E.mesh(new THREE.SphereGeometry(.05, 10, 8), E.mat(0xffffff, {transparent:true, opacity:.8}), G, [0, -10, 0], false), o:i/10});
      const salt = E.mesh(new THREE.CylinderGeometry(.35, .35, .04, 24), E.mat(0xffffff, {roughness:.5}), fl, [0, .07, 0], false);
      ticks.push(() => { const k = Math.min(1, T/16); lq.scale.set(1, Math.max(.05, 1 - k*.9), 1); rl.scale.y = .1 + k*2; rl.position.y = .02 + (.1 + k*2)*.15; salt.scale.setScalar(k);
        vap.forEach(v => { const p = (T*.35 + v.o) % 1; const A = E.V3(-2, 3.0, 0), B = E.V3(-.35 + Math.cos(-.42)*3.6, 2.85 + Math.sin(-.42)*3.6, 0); const q = p < .2 ? A.clone().lerp(E.V3(-.35, 2.85, 0), p/.2) : E.V3(-.35, 2.85, 0).lerp(B, (p - .2)/.8);
          v.m.position.copy(k < 1 ? q : E.V3(0, -10, 0)); v.m.material.color.set(p < .45 ? 0xffffff : 0x38bdf8); });
        rd.s(k < 1 ? 'Air mendidih (100 °C) → uap mengembun di kondensor → distilat' : '✅ Air murni terkumpul, garam tertinggal di labu'); }); }
  }
  E.tick((dt) => { T += dt; ticks.forEach(f => f(dt)); });
  R.buttons(null, [{label:'🔁 Ulangi proses', on:() => { T = 0; }}]);
  ready = true; build();
 }});
function lathe(E, pts, m, parent, pos){ return E.mesh(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), 48), m, parent, pos); }

/* ============ GETARAN & GELOMBANG: bunyi butuh medium ============ */
addMode('getaran-gelombang', {id:'bunyi', label:'🔔 Bunyi & Medium', view:{target:[0,1.8,0], radius:9, theta:.4, phi:1.2, minR:3},
 say:'Bunyi adalah gelombang longitudinal yang memerlukan medium. Jika udara di dalam tabung dipompa keluar, bunyi bel makin lemah dan akhirnya tidak terdengar.',
 build(E){
  E.platform(7); let air = 1, f = 440, rd = null;
  E.mesh(new THREE.CylinderGeometry(1.5, 1.6, .25, 48), E.mat(0x334155, {metalness:.5, roughness:.4}), null, [0, .12, 0]);
  E.mesh(new THREE.SphereGeometry(1.4, 48, 32, 0, PI*2, 0, PI/2), E.glass(0xe0f2fe, {opacity:.18}), null, [0, 1.2, 0], false); E.mesh(new THREE.CylinderGeometry(1.4, 1.4, .95, 48, 1, true), E.glass(0xe0f2fe, {opacity:.18}), null, [0, .72, 0], false);
  const bell = new THREE.Group(); bell.position.set(0, 1.5, 0); E.root.add(bell); E.mesh(new THREE.SphereGeometry(.38, 32, 24, 0, PI*2, 0, PI/2), E.mat(0xeab308, {metalness:.9, roughness:.2, side:THREE.DoubleSide}), bell).rotation.x = PI;
  E.mesh(new THREE.CylinderGeometry(.03, .03, 1.1, 8), E.mat(0x475569), null, [0, .8, 0]); const ham = E.mesh(new THREE.SphereGeometry(.08, 16, 12), E.mat(0x1e293b, {metalness:.7}), null, [.42, 1.35, 0]);
  E.mesh(new THREE.CylinderGeometry(.08, .08, 2.2, 12), E.mat(0x64748b, {metalness:.6}), null, [1.9, 1.1, 0]).rotation.z = PI/2; const pump = E.mesh(new THREE.BoxGeometry(.9, .7, .7), E.mat(0x0ea5e9, {roughness:.4}), null, [3.2, .35, 0]); E.label(pump, '🫧 pompa vakum', {off:E.V3(0, .6, 0)});
  const N = 160, im = new THREE.InstancedMesh(new THREE.SphereGeometry(.035, 8, 6), E.mat(0x7dd3fc, {emissive:0x0ea5e9, emissiveIntensity:.4}), N); E.root.add(im); const P = Array.from({length:N}, () => E.V3((Math.random() - .5)*2.2, .3 + Math.random()*2, (Math.random() - .5)*2.2)); const m4 = new THREE.Matrix4();
  const rings = []; for(let i = 0; i < 6; i++){ const r = E.mesh(new THREE.SphereGeometry(1, 32, 16), E.mat(0x38bdf8, {transparent:true, opacity:0, side:THREE.DoubleSide, depthWrite:false}), null, [0, 1.5, 0], false); rings.push({r, o:i/6}); }
  const ear = E.txtSprite('👂', {size:96, h:.9}); ear.position.set(-3.6, 1.6, 0); E.root.add(ear);
  const meter = E.mesh(new THREE.BoxGeometry(.25, 1, .25), E.mat(0x22c55e, {emissive:0x22c55e, emissiveIntensity:.6}), null, [-3.6, .5, 0]);
  const R = E.ui; R.head('BUNYI & MEDIUM', 'Bel di dalam tabung kaca', 'Pompa udara keluar dan dengarkan perubahan bunyinya. Atur juga frekuensinya.');
  const s = R.sec('Atur'); R.slider(s, {label:'Udara di tabung', min:0, max:100, step:1, value:100, unit:'%', on:v => air = v/100}); R.slider(s, {label:'Frekuensi', min:100, max:2000, step:10, value:440, unit:'Hz', on:v => f = v});
  R.buttons(s, [{label:'🔊 Dengar', on:() => beep()}]);
  rd = R.reads(R.sec('Pengamatan'), [['k','Kekerasan bunyi'],['l','Panjang gelombang di udara'],['c','Golongan']]);
  R.sec('Kesimpulan', '<p>Bunyi tidak dapat merambat di ruang hampa. Bunyi merambat paling cepat di zat padat (± 5.000 m/s di baja), lalu cair (± 1.500 m/s di air), dan gas (± 340 m/s di udara).</p>');
  function beep(){ try{ const ac = beep.ac || (beep.ac = new (window.AudioContext || window.webkitAudioContext)()); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.type = 'triangle'; g.gain.setValueAtTime(.25*air*air, ac.currentTime); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .8); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + .85); }catch(e){} }
  E.tick((dt, t) => { const vib = Math.sin(t*Math.min(60, f/12))*.04; bell.rotation.z = vib*.5; ham.position.x = .42 + Math.abs(vib)*1.2;
    const n = Math.round(N*air); P.forEach((p, i) => { p.x += Math.sin(t*3 + i)*.004 + Math.sin(t*f/40 + p.x*4)*.003*air; m4.makeScale(i < n ? 1 : .001, i < n ? 1 : .001, i < n ? 1 : .001); m4.setPosition(p); im.setMatrixAt(i, m4); }); im.instanceMatrix.needsUpdate = true;
    const sp = .9; rings.forEach(r => { const k = (t*sp*Math.min(2, .5 + f/800) + r.o) % 1; r.r.scale.setScalar(.4 + k*3.6); r.r.material.opacity = (1 - k)*.25*air*air; });
    meter.scale.y = Math.max(.02, air*air); meter.position.y = .5*Math.max(.02, air*air);
    rd && rd.k(air > .7 ? '🔊 Keras' : air > .3 ? '🔉 Lemah' : air > .05 ? '🔈 Sangat lemah' : '🔇 Tidak terdengar (hampa)'); rd && rd.l(`${fmt(340/f, 2)} m (v = 340 m/s)`); rd && rd.c(f < 20 ? 'Infrasonik' : f <= 20000 ? 'Audiosonik' : 'Ultrasonik'); });
 }});

/* ============ STRUKTUR BUMI: gempa & gunung api ============ */
addMode('struktur-bumi', {id:'gempa', label:'💥 Gempa Bumi', view:{target:[0,1.2,0], radius:13, theta:.55, phi:1.1},
 say:'Gempa tektonik terjadi karena pelepasan energi saat lempeng bergeser tiba-tiba. Gelombang seismik menyebar dari hiposentrum dan dicatat oleh seismograf.',
 build(E){
  let M = 6, shake = 0, T = 0, rd = null, fallen = []; const G = new THREE.Group(); E.root.add(G);
  E.mesh(new THREE.BoxGeometry(14, 1.2, 9), E.mat(0x92400e, {roughness:.95}), G, [0, -.6, 0]); E.mesh(new THREE.BoxGeometry(14, .5, 9), E.mat(0x78350f, {roughness:.95}), G, [0, -1.45, 0]); E.mesh(new THREE.BoxGeometry(14, .06, 9), E.mat(0x4d7c0f, {roughness:.9}), G, [0, .03, 0]);
  const fault = E.mesh(new THREE.BoxGeometry(.05, 1.8, 9), E.mat(0xef4444, {emissive:0xef4444, emissiveIntensity:.5}), G, [2.5, -.8, 0], false);
  const hypo = E.mesh(new THREE.SphereGeometry(.15, 16, 12), E.mat(0xf97316, {emissive:0xf97316, emissiveIntensity:1.5}), G, [2.5, -1.4, 0], false); E.label(hypo, 'hiposentrum', {off:E.V3(0, -.3, 0)});
  const epi = E.mesh(new THREE.CylinderGeometry(.25, .25, .04, 24), E.mat(0xef4444, {emissive:0xef4444, emissiveIntensity:1}), G, [2.5, .08, 0], false); E.label(epi, 'episentrum', {off:E.V3(0, .4, 0)});
  const winTex = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 128; const g = c.getContext('2d'); g.fillStyle = '#e2e8f0'; g.fillRect(0, 0, 64, 128); for(let y = 6; y < 128; y += 16) for(let x = 6; x < 64; x += 16){ g.fillStyle = Math.random() < .7 ? '#60a5fa' : '#fde68a'; g.fillRect(x, y, 10, 10); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const B = []; [[-5, -2.5, 2.4, 0], [-3.4, 1.8, 1.4, 1], [-1.2, -2, 3.2, 0], [.4, 2.4, 1.1, 2], [4.8, -2.2, 2, 1], [5.4, 2, 1.2, 2], [-5.5, 2.6, 1, 2], [3.6, 2.8, 2.6, 0]].forEach(([x, z, h, kind]) => {
    const b = new THREE.Group(); b.position.set(x, 0, z); G.add(b); const m = kind === 2 ? E.mat(0xb45309, {roughness:.8}) : new THREE.MeshStandardMaterial({map:winTex, roughness:.5});
    const body = E.mesh(new THREE.BoxGeometry(1, h, 1), m, b, [0, h/2, 0]); if(kind === 2) E.mesh(new THREE.ConeGeometry(.8, .6, 4), E.mat(0xdc2626), b, [0, h + .3, 0]).rotation.y = PI/4;
    B.push({b, h, kind, d:Math.hypot(x - 2.5, z)}); });
  const rings = []; for(let i = 0; i < 4; i++){ const r = E.mesh(new THREE.TorusGeometry(1, .04, 8, 96), E.mat(0xef4444, {emissive:0xef4444, emissiveIntensity:1, transparent:true, opacity:0}), G, [2.5, .1, 0], false); r.rotation.x = PI/2; rings.push(r); }
  // seismograf dengan kertas bergerak
  const sc = document.createElement('canvas'); sc.width = 512; sc.height = 160; const sg = sc.getContext('2d'); const stex = new THREE.CanvasTexture(sc); stex.colorSpace = THREE.SRGBColorSpace;
  const seis = new THREE.Group(); seis.position.set(-5.2, 0, -3.6); G.add(seis); E.mesh(new THREE.BoxGeometry(2.6, .8, 1), E.mat(0x334155, {metalness:.5}), seis, [0, .4, 0]); E.mesh(new THREE.PlaneGeometry(2.3, .72), new THREE.MeshBasicMaterial({map:stex}), seis, [0, .45, .51], false); E.label(seis, '📈 seismograf', {off:E.V3(0, 1.2, 0)});
  const trace = new Array(256).fill(0);
  const R = E.ui; R.head('GEMPA BUMI', 'Simulasi gempa tektonik', 'Atur magnitudo lalu mulai gempa. Amati gelombang, bangunan, dan seismogram.');
  const s = R.sec('Atur'); R.slider(s, {label:'Magnitudo', min:3, max:9, step:.1, value:6, unit:'M', on:v => M = v});
  R.buttons(s, [{label:'💥 Mulai gempa', cls:'p', on:() => { shake = 1; T = 0; }}, {label:'↺ Pulihkan', on:() => { B.forEach(o => { o.b.rotation.set(0, 0, 0); o.fallen = false; }); }}]);
  rd = R.reads(R.sec('Pengamatan'), [['m','Magnitudo'],['e','Energi relatif'],['d','Dampak']]);
  R.sec('Saat gempa', '<ul class="pts"><li>🛡️ Lindungi kepala, berlindung di bawah meja kokoh</li><li>🪟 Jauhi kaca & lemari</li><li>🏃 Setelah guncangan, evakuasi ke titik kumpul</li><li>🌊 Di pantai + gempa kuat → segera ke tempat tinggi (tsunami)</li></ul>');
  E.tick((dt, t) => { T += dt; const A = shake > 0 ? Math.pow(10, (M - 3)/2)*.0045*shake : 0; shake = Math.max(0, shake - dt/7);
    rings.forEach((r, i) => { const k = shake > 0 ? ((T*.5 + i/4) % 1) : 1; r.scale.setScalar(.2 + k*9); r.material.opacity = shake > 0 ? (1 - k)*.8 : 0; });
    B.forEach((o, i) => { if(o.fallen) return; const loc = A*Math.max(.25, 1 - o.d/10)*(1 + o.h*.3); o.b.rotation.z = Math.sin(T*18 + i)*loc*.6; o.b.rotation.x = Math.cos(T*15 + i)*loc*.4; o.b.position.y = Math.abs(Math.sin(T*22 + i))*loc*.3;
      if(M >= 7.2 && shake > .4 && loc > .18 && o.kind !== 0){ o.fallen = true; o.b.rotation.z = (i % 2 ? 1 : -1)*.5; o.b.position.y = 0; } });
    G.position.x = Math.sin(T*30)*A*.15; G.position.z = Math.cos(T*27)*A*.1;
    trace.shift(); trace.push(Math.sin(t*40)*Math.min(70, A*300) + (Math.random() - .5)*2);
    sg.fillStyle = '#f8fafc'; sg.fillRect(0, 0, 512, 160); sg.strokeStyle = '#cbd5e1'; sg.lineWidth = 1; for(let y = 20; y < 160; y += 20){ sg.beginPath(); sg.moveTo(0, y); sg.lineTo(512, y); sg.stroke(); }
    sg.strokeStyle = '#dc2626'; sg.lineWidth = 2; sg.beginPath(); trace.forEach((v, i) => sg.lineTo(i*2, 80 + v)); sg.stroke(); stex.needsUpdate = true;
    rd && rd.m(`${fmt(M, 1)} M`); rd && rd.e(`${fmt(Math.pow(31.6, M - 5), M < 5 ? 3 : 0)} × gempa M5`); rd && rd.d(M < 4 ? 'Terasa ringan, tidak merusak' : M < 5.5 ? 'Benda tergantung bergoyang, kaca bergetar' : M < 7 ? 'Kerusakan ringan–sedang pada bangunan' : 'Kerusakan berat, bangunan lemah roboh'); });
 }});
addMode('struktur-bumi', {id:'gunungapi', label:'🌋 Gunung Api', view:{target:[0,2,0], radius:15, theta:-.8, phi:1.2},
 say:'Magma dari dapur magma naik melalui pipa kepundan. Status gunung api di Indonesia ada empat: Normal, Waspada, Siaga, dan Awas.',
 build(E){
  let lvl = 0, rd = null; E.platform(8);
  const prof = []; for(let i = 0; i <= 30; i++){ const k = i/30, r = 6.5*(1 - k) + .9*k, y = 4.2*Math.pow(k, 1.25); prof.push([r, y]); } prof.push([.6, 4.0]); prof.push([.25, 3.4]);
  const cone = E.mesh(new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), 96, 0, PI*1.5), new THREE.MeshStandardMaterial({color:0x6b4f3a, roughness:.95, side:THREE.DoubleSide}));
  const cut1 = E.mesh(new THREE.ShapeGeometry(new THREE.Shape(prof.map(p => new THREE.Vector2(p[0], p[1])).concat([new THREE.Vector2(0, 3.4), new THREE.Vector2(0, 0)]))), E.mat(0x8b6b4a, {roughness:.9, side:THREE.DoubleSide})); cut1.rotation.y = -PI/2;
  const cut2 = cut1.clone(); cut2.rotation.y = PI; E.root.add(cut2);
  const pipe = E.mesh(new THREE.CylinderGeometry(.2, .3, 3.3, 20), E.mat(0xf97316, {emissive:0xea580c, emissiveIntensity:1.4}), null, [0, 2.55, 0], false); const ch = E.mesh(new THREE.SphereGeometry(1, 32, 20), E.mat(0xf97316, {emissive:0xea580c, emissiveIntensity:1.5}), null, [0, .75, 0], false); ch.scale.set(1.5, .55, 1.5);
  E.label(ch, 'dapur magma', {off:E.V3(1.6, 0, 0)}); E.label(pipe, 'pipa kepundan', {off:E.V3(.9, .8, 0)}); const crater = new THREE.Object3D(); crater.position.set(0, 4.2, 0); E.root.add(crater); E.label(crater, 'kawah', {off:E.V3(0, .5, 0)});
  const glow = new THREE.PointLight(0xff7a1a, 0, 12); glow.position.set(0, 4.6, 0); E.root.add(glow);
  puffs(E, E.V3(0, 4.3, 0), 18, 0x9ca3af, () => [.25, .55, .85, 1][lvl]);
  const bombs = []; for(let i = 0; i < 24; i++) bombs.push({m:E.mesh(new THREE.SphereGeometry(.09 + Math.random()*.08, 10, 8), E.mat(0xfb923c, {emissive:0xf97316, emissiveIntensity:2}), null, [0, -10, 0], false), p:E.V3(), v:E.V3(), t:Math.random()*2});
  const flows = []; for(let k = 0; k < 4; k++){ const a = .4 + k*1.1, pts = []; for(let i = 0; i <= 20; i++){ const kk = i/20, r = .8 + kk*5, y = 4.15*Math.pow(1 - kk*.95, 1.1) + .05; pts.push(E.V3(Math.cos(a + Math.sin(kk*5)*.15)*r, y, Math.sin(a + Math.sin(kk*5)*.15)*r)); }
    const tube = E.mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, .12, 8), E.mat(0xf97316, {emissive:0xea580c, emissiveIntensity:1.6}), null, null, false); tube.geometry.setDrawRange(0, 0); flows.push(tube); }
  let flowK = 0;
  const ST = [['🟢 Normal (Level I)','Tidak ada gejala peningkatan aktivitas. Kegiatan masyarakat normal.'],['🟡 Waspada (Level II)','Ada peningkatan aktivitas (asap, gempa vulkanik). Masyarakat tidak mendekati kawah.'],['🟠 Siaga (Level III)','Menuju letusan; peningkatan intensif. Siapkan evakuasi, radius bahaya diperluas.'],['🔴 Awas (Level IV)','Letusan/awan panas! Masyarakat di zona bahaya wajib mengungsi.']];
  const R = E.ui; R.head('GUNUNG API', 'Status & letusan gunung api', 'Gunung api strato (seperti Merapi) dipotong agar bagian dalamnya terlihat. Ubah status aktivitasnya.');
  R.seg(R.sec('Status gunung api (PVMBG)'), ST.map((s, i) => [String(i), s[0].split(' (')[0]]), '0', v => { lvl = +v; });
  rd = R.reads(R.sec('Keterangan'), [['s','Status'],['k','Tindakan']]);
  R.sec('Dampak positif', '<ul class="pts"><li>🌾 Tanah vulkanik subur</li><li>⛏️ Pasir & batu bahan bangunan</li><li>♨️ Energi panas bumi</li><li>🏞️ Wisata alam</li></ul>');
  E.tick((dt, t) => { pipe.material.emissiveIntensity = 1 + lvl*.5 + Math.sin(t*4)*.2; ch.material.emissiveIntensity = 1.2 + lvl*.4; glow.intensity = [0, 1, 3, 10][lvl] + Math.sin(t*9)*lvl;
    bombs.forEach(b => { if(lvl < 3){ b.m.position.y = -10; return; } b.t += dt; if(b.t > 2.2 || b.m.position.y < -1){ b.t = 0; b.p.set(0, 4.3, 0); b.v.set((Math.random() - .5)*5, 5 + Math.random()*4, (Math.random() - .5)*5); }
      b.v.y -= 9.8*dt; b.p.addScaledVector(b.v, dt); b.m.position.copy(b.p); });
    flowK = lvl === 3 ? Math.min(1, flowK + dt*.12) : Math.max(0, flowK - dt*.3); flows.forEach(f => f.geometry.setDrawRange(0, Math.floor(flowK*f.geometry.index.count)));
    if(lvl >= 2){ cone.position.x = Math.sin(t*35)*.01*lvl; } rd && rd.s(ST[lvl][0]); rd && rd.k(ST[lvl][1]); });
 }});
})();
