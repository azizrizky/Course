/* Lab Petualang — pustaka animasi kanvas untuk slide (bagian 2: Gerak & Kelas 8) */
(function(){
const A = window.ANIMS, H = window.AH;
const TAU = Math.PI*2, PI = Math.PI;
const {txt, emo, rr, circ, line, arrow, pill, lerp, clamp, ease} = H;
const C = ['#f97316','#0ea5e9','#22c55e','#a855f7','#ec4899','#eab308','#14b8a6','#6366f1','#ef4444','#06b6d4'];

/* ============ GAYA & GERAK ============ */
A.glb = {ctl:[['glb','GLB'],['glbb','GLBB dipercepat'],['diperlambat','GLBB diperlambat']], draw(g, w, h, t, st, o){
  const T = 6, k = (t % (T + 1.5))/T, kk = Math.min(1, k), m = st.mode, x0 = w*.06, L = w*.82;
  const s = m === 'glb' ? kk : m === 'glbb' ? kk*kk : 1 - (1 - kk)*(1 - kk); const y = h*.3;
  line(g, x0, y + 28, x0 + L + 40, y + 28, H.mut(o), 3);
  for(let i = 0; i <= 6; i++){ const ti = i/6, si = m === 'glb' ? ti : m === 'glbb' ? ti*ti : 1 - (1 - ti)*(1 - ti); if(ti <= kk + .001){ circ(g, x0 + si*L, y + 52, 7, C[0]); txt(g, `t=${i}`, x0 + si*L, y + 74, 13, H.mut(o)); } }
  emo(g, '🚗', x0 + s*L, y, 54);
  const gx = w*.12, gy = h*.92, gw = w*.36, gh = h*.36; arrow(g, gx, gy, gx + gw, gy, H.ink(o), 2, 10); arrow(g, gx, gy, gx, gy - gh, H.ink(o), 2, 10); txt(g, 'v', gx - 14, gy - gh, 16, H.ink(o)); txt(g, 't', gx + gw + 10, gy + 4, 16, H.ink(o));
  const vf = p => m === 'glb' ? .6 : m === 'glbb' ? .1 + p*.85 : .95 - p*.85; g.beginPath(); for(let p = 0; p <= kk; p += .02) g.lineTo(gx + p*gw*.92, gy - vf(p)*gh*.9); g.strokeStyle = C[1]; g.lineWidth = 4; g.stroke(); txt(g, 'grafik v – t', gx + gw/2, gy - gh - 14, 15, H.mut(o));
  const sx = w*.58, sw = w*.36; arrow(g, sx, gy, sx + sw, gy, H.ink(o), 2, 10); arrow(g, sx, gy, sx, gy - gh, H.ink(o), 2, 10); txt(g, 's', sx - 14, gy - gh, 16, H.ink(o)); txt(g, 't', sx + sw + 10, gy + 4, 16, H.ink(o));
  g.beginPath(); for(let p = 0; p <= kk; p += .02){ const sp = m === 'glb' ? p : m === 'glbb' ? p*p : 1 - (1 - p)*(1 - p); g.lineTo(sx + p*sw*.92, gy - sp*gh*.9); } g.strokeStyle = C[2]; g.lineWidth = 4; g.stroke(); txt(g, 'grafik s – t', sx + sw/2, gy - gh - 14, 15, H.mut(o));
  txt(g, {glb:'Kecepatan tetap → jarak tiap detik sama', glbb:'Kecepatan bertambah → jarak tiap detik makin jauh', diperlambat:'Kecepatan berkurang → jarak tiap detik makin dekat'}[m], w/2, h*.08, 18, H.ink(o));
}};
A.gaya = {ctl:[['dorong','Dorong'],['seimbang','Seimbang'],['gesek','Gaya gesek']], draw(g, w, h, t, st, o){
  const fy = h*.62, m = st.mode; rr(g, 0, fy, w, 14, 0, o.dark ? '#475569' : '#94a3b8'); for(let i = 0; i < w; i += 22) line(g, i, fy + 14, i - 10, fy + 26, H.mut(o), 2);
  let x = w*.42, F1 = 0, F2 = 0, fr = 0; if(m === 'dorong'){ x = w*.2 + ((t*60) % (w*.5)); F1 = 120; fr = 40; } else if(m === 'seimbang'){ F1 = 110; F2 = 110; } else { const k = (t % 4)/4; x = w*.2 + (1 - (1 - k)*(1 - k))*w*.4; fr = 70; }
  rr(g, x - 70, fy - 120, 140, 120, 10, '#b45309', '#78350f', 4); txt(g, '📦 10 kg', x, fy - 60, 20, '#fff');
  arrow(g, x, fy - 60, x, fy + 60, '#a855f7', 5, 16); txt(g, 'w (berat)', x + 50, fy + 50, 15, '#a855f7'); arrow(g, x, fy - 60, x, fy - 190, '#22c55e', 5, 16); txt(g, 'N (normal)', x + 56, fy - 180, 15, '#22c55e');
  if(F1){ arrow(g, x - 200, fy - 60, x - 72, fy - 60, '#ef4444', 7, 18); txt(g, `F = ${F1} N`, x - 140, fy - 84, 17, '#ef4444'); emo(g, '🧑', x - 230, fy - 50, 70); }
  if(F2){ arrow(g, x + 200, fy - 60, x + 72, fy - 60, '#0ea5e9', 7, 18); txt(g, `F = ${F2} N`, x + 140, fy - 84, 17, '#0ea5e9'); emo(g, '🧑', x + 230, fy - 50, 70); }
  if(fr){ arrow(g, x + 10, fy - 4, x - 10 - fr*.9, fy - 4, '#f59e0b', 6, 14); txt(g, `f gesek ${fr} N`, x - 40, fy + 40, 15, '#f59e0b'); }
  const R = F1 - F2 - fr; pill(g, m === 'seimbang' ? 'ΣF = 110 − 110 = 0 → benda diam (seimbang)' : m === 'dorong' ? `ΣF = ${F1} − ${fr} = ${R} N → benda bergerak dipercepat` : 'Hanya gaya gesek → benda melambat lalu berhenti', w/2, h*.9, m === 'seimbang' ? C[2] : C[0], '#fff', 18);
}};
A.newton3 = {draw(g, w, h, t, st, o){
  const k = (t % 5)/5, cx = w/2, y = h*.45, d = k < .15 ? 0 : ease(clamp((k - .15)/.85, 0, 1))*w*.32;
  emo(g, '🛹', cx - 40 - d, y + 54, 70); emo(g, '🛹', cx + 40 + d, y + 54, 70); emo(g, '🧒', cx - 40 - d, y - 10, 90); emo(g, '👧', cx + 40 + d, y - 10, 90);
  if(k < .25){ arrow(g, cx - 10, y - 20, cx + 70, y - 20, '#ef4444', 6, 16); arrow(g, cx + 10, y + 10, cx - 70, y + 10, '#0ea5e9', 6, 16); txt(g, 'aksi', cx + 40, y - 46, 17, '#ef4444'); txt(g, 'reaksi', cx - 40, y + 40, 17, '#0ea5e9'); }
  txt(g, 'Saling mendorong → keduanya bergerak berlawanan arah', w/2, h*.8, 19, H.ink(o)); txt(g, 'F aksi = − F reaksi (sama besar, berlawanan arah, pada benda berbeda)', w/2, h*.9, 16, H.mut(o));
}};

/* ============ SEL ============ */
A.sel = {ctl:[['hewan','Sel hewan'],['tumbuhan','Sel tumbuhan']], draw(g, w, h, t, st, o){
  const plant = st.mode === 'tumbuhan', cx = w*.5, cy = h*.5, Rx = w*.36, Ry = h*.38, act = Math.floor(t/1.5);
  g.save(); g.translate(cx, cy);
  if(plant){ rr(g, -Rx - 14, -Ry - 14, Rx*2 + 28, Ry*2 + 28, 28, '#65a30d'); rr(g, -Rx, -Ry, Rx*2, Ry*2, 22, '#ecfccb', '#4d7c0f', 4); rr(g, -Rx*.62, -Ry*.62, Rx*1.1, Ry*1.24, 40, 'rgba(125,211,252,.45)', '#38bdf8', 3); }
  else { g.beginPath(); for(let a = 0; a <= TAU + .01; a += .05){ const r = 1 + Math.sin(a*5 + t)*.03 + Math.sin(a*3 - t*.7)*.04; g.lineTo(Math.cos(a)*Rx*r, Math.sin(a)*Ry*r); } g.fillStyle = '#fde2e4'; g.fill(); g.strokeStyle = '#f472b6'; g.lineWidth = 5; g.stroke(); }
  for(let i = 0; i < 50; i++){ const a = i*2.4 + t*.15, r = .25 + ((i*37) % 70)/100; circ(g, Math.cos(a)*Rx*r*.9, Math.sin(a)*Ry*r*.85, 2.5, '#7c3aed'); }
  const nx = plant ? Rx*.5 : 0, ny = plant ? -Ry*.3 : 0; circ(g, nx, ny, 62, '#c4b5fd', '#7c3aed', 4); circ(g, nx + 10, ny - 8, 20, '#7c3aed');
  for(let i = 0; i < 3; i++){ g.beginPath(); g.arc(nx, ny, 80 + i*14, -1 + i*.2, 1.2 + i*.2); g.strokeStyle = '#38bdf8'; g.lineWidth = 4; g.stroke(); }
  const mito = [[-Rx*.55, Ry*.35, .5], [Rx*.45, Ry*.5, -.3], [-Rx*.1, Ry*.6, .1]]; mito.forEach(([x, y, a]) => { g.save(); g.translate(x, y); g.rotate(a); rr(g, -38, -16, 76, 32, 16, '#fb923c', '#c2410c', 3); g.beginPath(); for(let s = -30; s <= 30; s += 6) g.lineTo(s, Math.sin(s*.5 + t*2)*9); g.strokeStyle = '#7c2d12'; g.lineWidth = 2; g.stroke(); g.restore(); });
  for(let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(-Rx*.55, -Ry*.35 + i*10, 50 - i*6, 6, 0, 0, TAU); g.strokeStyle = '#eab308'; g.lineWidth = 4; g.stroke(); }
  if(plant){ [[-Rx*.75, Ry*.1], [-Rx*.35, Ry*.78], [Rx*.75, Ry*.05], [Rx*.15, Ry*.72]].forEach(([x, y], i) => { g.save(); g.translate(x, y); g.rotate(i); g.beginPath(); g.ellipse(0, 0, 34, 18, 0, 0, TAU); g.fillStyle = '#22c55e'; g.fill(); g.strokeStyle = '#15803d'; g.lineWidth = 3; g.stroke(); for(let k = -2; k <= 2; k++) line(g, k*10, -10, k*10, 10, '#15803d', 3); g.restore(); }); }
  else circ(g, Rx*.6, -Ry*.35, 18, '#a78bfa', '#6d28d9', 3);
  g.restore();
  const LB = plant ? [['Dinding sel', cx - Rx - 7, cy - Ry + 30, 'kaku, dari selulosa'], ['Kloroplas', cx - Rx*.75, cy + Ry*.1, 'fotosintesis'], ['Vakuola besar', cx - Rx*.1, cy - Ry*.05, 'menyimpan air & zat'], ['Nukleus', cx + Rx*.5, cy - Ry*.3, 'pusat pengatur'], ['Mitokondria', cx + Rx*.45, cy + Ry*.5, 'respirasi → energi'], ['Badan Golgi', cx - Rx*.55, cy - Ry*.35, 'mengemas zat']]
    : [['Membran sel', cx - Rx, cy, 'mengatur keluar-masuk zat'], ['Nukleus', cx, cy, 'pusat pengatur (DNA)'], ['Mitokondria', cx - Rx*.55, cy + Ry*.35, 'respirasi → energi'], ['Badan Golgi', cx - Rx*.55, cy - Ry*.35, 'mengemas zat'], ['Lisosom', cx + Rx*.6, cy - Ry*.35, 'mencerna zat'], ['Retikulum endoplasma', cx + 80, cy - 40, 'jalur transport']];
  const L = LB[act % LB.length]; circ(g, L[1], L[2], 12 + Math.sin(t*8)*3, null, '#fff', 4); pill(g, `${L[0]}: ${L[3]}`, w/2, h*.06, C[act % C.length], '#fff', 18);
}};
A.organisasi = {draw(g, w, h, t, st, o){
  const L = [['🔴','Sel','sel otot jantung'],['🧵','Jaringan','jaringan otot'],['❤️','Organ','jantung'],['🩸','Sistem organ','peredaran darah'],['🧍','Organisme','manusia']], act = Math.floor(t/1.4) % (L.length + 1);
  L.forEach((l, i) => { const x = w*(.1 + i*.2), y = h*.45, on = i < act, sz = 42 + i*6;
    if(i) arrow(g, x - w*.2 + 50, y, x - 50, y, on ? C[0] : H.ln(o), 5, 14); circ(g, x, y, sz, on ? C[i % C.length] : H.panel(o), H.ln(o), 3); g.globalAlpha = on ? 1 : .35; emo(g, l[0], x, y, sz*.9); g.globalAlpha = 1;
    txt(g, l[1], x, y + sz + 26, 19, on ? H.ink(o) : H.mut(o)); txt(g, l[2], x, y + sz + 50, 14, H.mut(o)); });
  txt(g, 'Sel → Jaringan → Organ → Sistem organ → Organisme', w/2, h*.1, 20, H.ink(o));
}};

/* ============ SISTEM ORGAN ============ */
A.cerna = {draw(g, w, h, t, st, o){
  const s = Math.min(w/500, h/560), ox = w/2 - 250*s, oy = h*.02;
  const P = [[250,40],[250,70],[248,120],[246,170],[250,215],[290,240],[300,270],[260,290],[210,300],[200,330],[250,340],[300,345],[295,375],[245,380],[200,385],[205,410],[255,415],[300,420],[340,410],[345,360],[350,300],[300,288],[200,290],[150,300],[150,360],[155,430],[180,470],[190,500]].map(p => [ox + p[0]*s, oy + p[1]*s]);
  g.beginPath(); P.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.strokeStyle = '#fda4af'; g.lineWidth = 26*s; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); g.strokeStyle = '#f43f5e'; g.lineWidth = 3; g.stroke();
  g.beginPath(); g.ellipse(ox + 285*s, oy + 250*s, 62*s, 40*s, .5, 0, TAU); g.fillStyle = '#fb7185'; g.fill(); g.beginPath(); g.ellipse(ox + 190*s, oy + 228*s, 70*s, 34*s, -.2, 0, TAU); g.fillStyle = 'rgba(146,64,14,.75)'; g.fill();
  const Ln = P.length - 1, k = (t*.08) % 1, idx = k*Ln, i = Math.floor(idx), f = idx - i, bx = lerp(P[i][0], P[i + 1][0], f), by = lerp(P[i][1], P[i + 1][1], f); circ(g, bx, by, 11*s + 3, '#a16207', '#fff', 2);
  const ST = [[0, .05, 'Mulut', 'mengunyah + amilase (ludah)'], [.05, .15, 'Kerongkongan', 'gerak peristaltik'], [.15, .28, 'Lambung', 'HCl + pepsin, diaduk 2–4 jam'], [.28, .7, 'Usus halus', 'pencernaan kimiawi + penyerapan sari makanan'], [.7, .96, 'Usus besar', 'penyerapan air, pembusukan oleh bakteri'], [.96, 1, 'Anus', 'pengeluaran feses']];
  const cur = ST.find(z => k >= z[0] && k < z[1]) || ST[5]; pill(g, `${cur[2]}: ${cur[3]}`, w/2, h*.95, C[ST.indexOf(cur) % C.length], '#fff', 17);
  txt(g, 'hati', ox + 150*s, oy + 220*s, 15, '#fff');
}};
A.napas = {draw(g, w, h, t, st, o){
  const b = Math.sin(t*1.3), inh = b > 0, k = b*.5 + .5, cx = w/2, cy = h*.46, s = Math.min(w, h)/560;
  rr(g, cx - 12*s, cy - 200*s, 24*s, 110*s, 10, '#fecaca', '#f87171', 3);
  [-1, 1].forEach(d => { line(g, cx, cy - 90*s, cx + d*60*s, cy - 40*s, '#f87171', 14*s); g.beginPath(); g.ellipse(cx + d*(105 + k*10)*s, cy + 20*s, (85 + k*18)*s, (140 + k*14)*s, d*.12, 0, TAU); g.fillStyle = 'rgba(251,113,133,.75)'; g.fill(); g.strokeStyle = '#e11d48'; g.lineWidth = 4; g.stroke();
    for(let i = 0; i < 6; i++) circ(g, cx + d*(80 + (i % 3)*30)*s, cy + (-30 + Math.floor(i/3)*60)*s, (12 + k*4)*s, 'rgba(255,255,255,.35)'); });
  const dy = cy + (170 - k*40)*s; g.beginPath(); g.moveTo(cx - 230*s, dy + 20*s); g.quadraticCurveTo(cx, dy - (inh ? 10 : 60)*s*(1 - k), cx + 230*s, dy + 20*s); g.strokeStyle = '#b45309'; g.lineWidth = 10; g.stroke(); txt(g, 'diafragma', cx + 170*s, dy + 40*s, 15, H.mut(o));
  for(let i = 0; i < 8; i++){ const p = ((t*.6 + i/8) % 1), y = inh ? lerp(cy - 280*s, cy - 100*s, p) : lerp(cy - 100*s, cy - 280*s, p); circ(g, cx + Math.sin(i)*12, y, 6, inh ? '#38bdf8' : '#a3a3a3'); }
  pill(g, inh ? 'INSPIRASI: diafragma berkontraksi (mendatar) → rongga dada membesar → udara masuk (O₂)' : 'EKSPIRASI: diafragma relaksasi (melengkung) → rongga dada mengecil → udara keluar (CO₂)', w/2, h*.95, inh ? C[1] : C[7], '#fff', 15);
}};
A.jantung = {draw(g, w, h, t, st, o){
  const cx = w/2, cy = h*.5, bt = 1 + Math.max(0, Math.sin(t*6))*.06;
  const loop = (y1, y2, rx, col1, col2, lbl) => { g.beginPath(); g.ellipse(cx, (y1 + y2)/2, rx, Math.abs(y2 - y1)/2, 0, 0, TAU); g.strokeStyle = H.ln(o); g.lineWidth = 16; g.stroke(); rr(g, cx - 80, y2 - 30 + (y2 > y1 ? 0 : 0), 160, 60, 20, H.panel(o)); txt(g, lbl, cx, y2, 18, H.ink(o)); };
  loop(cy, h*.08 + 20, w*.24, null, null, '🫁 Paru-paru'); loop(cy, h*.9, w*.4, null, null, '🧍 Seluruh tubuh');
  for(let i = 0; i < 16; i++){ const k = ((t*.12 + i/16) % 1), a = -PI/2 + k*TAU;
    const x1 = cx + Math.cos(a)*w*.24, y1 = (cy + h*.08 + 20)/2 + Math.sin(a)*(cy - h*.08 - 20)/2; circ(g, x1, y1, 7, Math.cos(a) > 0 ? '#ef4444' : '#3b82f6');
    const x2 = cx - Math.cos(a)*w*.4, y2 = (cy + h*.9)/2 - Math.sin(a)*(h*.9 - cy)/2; circ(g, x2, y2, 7, Math.cos(a) > 0 ? '#3b82f6' : '#ef4444'); }
  g.save(); g.translate(cx, cy); g.scale(bt, bt); emo(g, '❤️', 0, 0, 110); g.restore();
  txt(g, 'kanan', cx - 90, cy, 15, H.mut(o)); txt(g, 'kiri', cx + 90, cy, 15, H.mut(o));
  txt(g, 'Peredaran kecil: bilik kanan → paru-paru → serambi kiri', w*.5, h*.3, 15, '#ef4444'); txt(g, 'Peredaran besar: bilik kiri → seluruh tubuh → serambi kanan', w*.5, h*.7, 15, '#3b82f6');
}};

/* ============ USAHA & ENERGI ============ */
A.usaha = {draw(g, w, h, t, st, o){
  const k = clamp((t % 6)/4.5, 0, 1), fy = h*.62, F = 50, s = k*4, x = w*.14 + k*w*.56; rr(g, 0, fy, w, 12, 0, H.mut(o));
  rr(g, x - 60, fy - 110, 120, 110, 10, '#b45309', '#78350f', 4); emo(g, '🧑', x - 110, fy - 50, 80); arrow(g, x - 170, fy - 60, x - 62, fy - 60, '#ef4444', 7, 18); txt(g, 'F = 50 N', x - 120, fy - 130, 18, '#ef4444');
  line(g, w*.14, fy + 40, x, fy + 40, C[1], 4); txt(g, `s = ${s.toFixed(1).replace('.', ',')} m`, (w*.14 + x)/2, fy + 64, 18, C[1]);
  pill(g, `W = F × s = 50 × ${s.toFixed(1).replace('.', ',')} = ${Math.round(F*s)} J`, w/2, h*.12, C[2], '#fff', 22);
  emo(g, '🧱', w*.88, fy - 70, 120); emo(g, '🧍', w*.79, fy - 50, 80); txt(g, 'mendorong tembok: s = 0 → W = 0', w*.82, fy + 64, 14, H.mut(o));
}};
A.energi = {draw(g, w, h, t, st, o){
  const cx = w*.42, top = h*.1, L = h*.6, th = Math.sin(t*1.6)*.9, bx = cx + Math.sin(th)*L, by = top + Math.cos(th)*L, low = top + L;
  line(g, cx - 80, top, cx + 80, top, H.mut(o), 6); line(g, cx, top, bx, by, H.ink(o), 3); circ(g, bx, by, 26, '#f97316', '#fff', 3);
  g.beginPath(); g.arc(cx, top, L, PI/2 - .9, PI/2 + .9); g.strokeStyle = H.ln(o); g.setLineDash([6, 8]); g.lineWidth = 2; g.stroke(); g.setLineDash([]);
  const hRel = (low - by)/(L*(1 - Math.cos(.9))), Ep = clamp(hRel, 0, 1), Ek = 1 - Ep; const bxx = w*.8, bb = h*.85, bh = h*.6;
  [['Ep', Ep, C[1]], ['Ek', Ek, C[0]], ['Em', 1, C[2]]].forEach(([n, v, c], i) => { rr(g, bxx + i*48 - 50, bb - bh, 36, bh, 8, H.panel(o)); rr(g, bxx + i*48 - 50, bb - bh*v, 36, bh*v, 8, c); txt(g, n, bxx + i*48 - 32, bb + 22, 17, H.ink(o)); });
  txt(g, 'Ep = m·g·h   ·   Ek = ½·m·v²   ·   Em = Ep + Ek (tetap)', w/2, h*.96, 18, H.ink(o));
}};
A.tuas = {ctl:[['1','Jenis 1'],['2','Jenis 2'],['3','Jenis 3']], draw(g, w, h, t, st, o){
  const m = st.mode, y = h*.5, x0 = w*.12, L = w*.76, tilt = Math.sin(t*1.5)*.06;
  const pos = {'1':{T:.45, B:.08, K:.92, ex:'✂️ gunting, jungkat-jungkit, linggis', urut:'B – T – K'}, '2':{T:.06, B:.45, K:.92, ex:'🛒 gerobak dorong, pembuka botol, pemecah kemiri', urut:'T – B – K'}, '3':{T:.06, B:.92, K:.45, ex:'🎣 pinset, sekop, stapler, lengan', urut:'T – K – B'}}[m];
  const pt = p => { const x = x0 + p*L, cxp = x0 + pos.T*L; return [x, y + (x - cxp)*Math.tan(tilt)]; };
  const [a1, b1] = pt(0), [a2, b2] = pt(1); line(g, a1, b1, a2, b2, '#92400e', 14);
  const [tx, ty] = pt(pos.T); g.beginPath(); g.moveTo(tx, ty + 8); g.lineTo(tx - 34, ty + 70); g.lineTo(tx + 34, ty + 70); g.closePath(); g.fillStyle = '#64748b'; g.fill(); txt(g, 'T (titik tumpu)', tx, ty + 92, 16, H.ink(o));
  const [bx, by] = pt(pos.B); rr(g, bx - 34, by - 74, 68, 66, 8, '#a855f7'); txt(g, 'B', bx, by - 42, 24, '#fff'); txt(g, 'beban', bx, by - 92, 15, H.ink(o));
  const [kx, ky] = pt(pos.K); arrow(g, kx, ky - 120, kx, ky - 12, '#ef4444', 7, 18); txt(g, 'K (kuasa)', kx, ky - 136, 16, '#ef4444');
  pill(g, `Urutan: ${pos.urut}`, w/2, h*.12, C[[0, 1, 2][+m - 1]], '#fff', 21); txt(g, pos.ex, w/2, h*.9, 19, H.ink(o)); txt(g, 'w × lb = F × lk', w/2, h*.97, 16, H.mut(o));
}};
A.katrol = {ctl:[['tetap','Katrol tetap'],['bebas','Katrol bebas'],['majemuk','Takal']], draw(g, w, h, t, st, o){
  const m = st.mode, k = Math.sin(t*1.2)*.5 + .5, top = h*.1, cx = w/2; rr(g, w*.2, top - 16, w*.6, 16, 4, '#475569');
  const KM = {tetap:1, bebas:2, majemuk:4}[m], lift = k*h*.2, pull = lift*KM;
  if(m === 'tetap'){ circ(g, cx, top + 40, 36, '#94a3b8', '#475569', 4); line(g, cx, top, cx, top + 40, '#475569', 4); line(g, cx - 36, top + 40, cx - 36, h*.7 - lift, '#a16207', 4); line(g, cx + 36, top + 40, cx + 36, h*.55 + pull, '#a16207', 4);
    rr(g, cx - 76, h*.7 - lift, 80, 70, 8, '#a855f7'); txt(g, 'w', cx - 36, h*.7 - lift + 35, 22, '#fff'); arrow(g, cx + 36, h*.55 + pull, cx + 36, h*.55 + pull + 60, '#ef4444', 6, 16); }
  else { const n = m === 'bebas' ? 1 : 2, py = h*.55 - lift; line(g, cx - 60, top, cx - 60, py, '#a16207', 4); circ(g, cx, py, 40, '#94a3b8', '#475569', 4); line(g, cx + 40, py, cx + 40, top + 40, '#a16207', 4);
    if(n === 2){ circ(g, cx + 80, top + 40, 40, '#94a3b8', '#475569', 4); line(g, cx + 120, top + 40, cx + 120, h*.45 + pull*.5, '#a16207', 4); arrow(g, cx + 120, h*.45 + pull*.5, cx + 120, h*.45 + pull*.5 + 60, '#ef4444', 6, 16); line(g, cx - 20, py, cx - 20, top, '#a16207', 4); }
    else { arrow(g, cx + 40, top + 40, cx + 40, top - 30, '#ef4444', 6, 16); }
    line(g, cx, py + 40, cx, py + 70, '#475569', 4); rr(g, cx - 40, py + 70, 80, 70, 8, '#a855f7'); txt(g, 'w', cx, py + 105, 22, '#fff'); }
  pill(g, `Keuntungan mekanis = ${KM}  →  F = w ÷ ${KM}`, w/2, h*.92, C[[1, 2, 3][['tetap', 'bebas', 'majemuk'].indexOf(m)]], '#fff', 20);
  txt(g, {tetap:'mengubah arah gaya (sumur timba, tiang bendera)', bebas:'gaya kuasa setengah berat beban (derek pelabuhan)', majemuk:'gabungan katrol, gaya makin kecil (crane, lift)'}[m], w/2, h*.98 - 4, 15, H.mut(o));
}};

/* ============ UNSUR, SENYAWA, CAMPURAN ============ */
A.atom = {ctl:[['unsur','Unsur'],['senyawa','Senyawa'],['campuran','Campuran']], draw(g, w, h, t, st, o){
  const m = st.mode, x0 = w*.08, y0 = h*.14, W = w*.84, Hh = h*.62; rr(g, x0, y0, W, Hh, 18, H.panel(o), H.ln(o), 3);
  const R = H.rnd(m === 'unsur' ? 3 : m === 'senyawa' ? 5 : 9);
  for(let i = 0; i < 14; i++){ const bx = x0 + 60 + R()*(W - 120), by = y0 + 50 + R()*(Hh - 100), a = t*(.3 + R()) + i, x = bx + Math.sin(a)*20, y = by + Math.cos(a*1.3)*16;
    if(m === 'unsur'){ circ(g, x, y, 20, '#f59e0b', '#fff', 2); txt(g, 'Fe', x, y, 13, '#fff'); }
    else if(m === 'senyawa'){ circ(g, x, y, 22, '#ef4444', '#fff', 2); txt(g, 'O', x, y, 14, '#fff'); [[-24, 16], [24, 16]].forEach(([dx, dy]) => { circ(g, x + dx, y + dy, 14, '#e5e7eb', '#94a3b8', 2); txt(g, 'H', x + dx, y + dy, 11, '#334155'); }); }
    else { if(i % 3 === 0){ circ(g, x, y, 22, '#ef4444', '#fff', 2); [[-24, 16], [24, 16]].forEach(([dx, dy]) => circ(g, x + dx, y + dy, 14, '#e5e7eb', '#94a3b8', 2)); } else if(i % 3 === 1){ circ(g, x - 12, y, 18, '#22c55e', '#fff', 2); circ(g, x + 12, y, 18, '#22c55e', '#fff', 2); } else rr(g, x - 16, y - 16, 32, 32, 6, '#eab308', '#fff', 2); } }
  txt(g, {unsur:'UNSUR: satu jenis atom saja (contoh: besi Fe, emas Au, oksigen O₂)', senyawa:'SENYAWA: 2+ unsur bergabung secara kimia, perbandingan tetap (contoh: air H₂O)', campuran:'CAMPURAN: beberapa zat bercampur tanpa reaksi, sifat asli tetap (contoh: udara, sirup)'}[m], w/2, h*.86, 17, H.ink(o));
}};
A.pisah = {ctl:[['filtrasi','Penyaringan'],['evaporasi','Penguapan'],['destilasi','Penyulingan'],['kromatografi','Kromatografi']], draw(g, w, h, t, st, o){
  const m = st.mode, cx = w/2;
  if(m === 'filtrasi'){ g.beginPath(); g.moveTo(cx - 90, h*.18); g.lineTo(cx + 90, h*.18); g.lineTo(cx + 12, h*.42); g.lineTo(cx + 12, h*.52); g.lineTo(cx - 12, h*.52); g.lineTo(cx - 12, h*.42); g.closePath(); g.fillStyle = 'rgba(255,255,255,.85)'; g.fill(); g.strokeStyle = '#94a3b8'; g.lineWidth = 3; g.stroke();
    for(let i = 0; i < 20; i++) circ(g, cx - 60 + (i*23) % 120, h*.22 + (i % 3)*10, 5, '#a16207');
    for(let i = 0; i < 5; i++){ const k = (t*.8 + i/5) % 1; circ(g, cx, h*.53 + k*h*.18, 5, '#38bdf8'); } rr(g, cx - 70, h*.7, 140, h*.16, 10, 'rgba(56,189,248,.45)', '#94a3b8', 3);
    txt(g, 'pasir tertahan (residu)', cx + 170, h*.24, 16, H.ink(o)); txt(g, 'air jernih (filtrat)', cx + 170, h*.8, 16, H.ink(o)); txt(g, 'Berdasarkan perbedaan ukuran partikel · contoh: saringan air, saringan teh', cx, h*.95, 16, H.mut(o)); }
  if(m === 'evaporasi'){ const lv = 1 - ((t*.1) % 1); rr(g, cx - 110, h*.36, 220, 90, 40, 'rgba(255,255,255,.2)', '#94a3b8', 4); rr(g, cx - 100, h*.36 + 80 - lv*60, 200, lv*60 + 6, 30, 'rgba(56,189,248,.5)');
    for(let i = 0; i < 16; i++) circ(g, cx - 80 + i*11, h*.36 + 82, 4, '#fff'); for(let i = 0; i < 6; i++){ const k = (t*.5 + i/6) % 1; g.globalAlpha = 1 - k; emo(g, '💨', cx - 60 + i*24, h*.32 - k*90, 26); g.globalAlpha = 1; }
    for(let i = 0; i < 3; i++){ const f = 1 + Math.sin(t*18 + i)*.15; g.beginPath(); g.moveTo(cx - 30*f, h*.74); g.quadraticCurveTo(cx, h*.5, cx + 30*f, h*.74); g.fillStyle = ['rgba(251,146,60,.9)','rgba(250,204,21,.8)','rgba(96,165,250,.6)'][i]; g.fill(); }
    txt(g, 'Air menguap, garam tertinggal · contoh: tambak garam di pantai', cx, h*.92, 17, H.ink(o)); }
  if(m === 'destilasi'){ const fx = w*.22, fy = h*.5; circ(g, fx, fy, 60, 'rgba(244,114,182,.45)', '#94a3b8', 4); rr(g, fx - 10, fy - 120, 20, 70, 4, 'rgba(255,255,255,.4)', '#94a3b8', 2);
    g.save(); g.translate(fx + 10, fy - 110); g.rotate(.32); rr(g, 0, -16, w*.5, 32, 14, 'rgba(147,197,253,.35)', '#60a5fa', 3); rr(g, 10, -8, w*.48, 16, 8, 'rgba(255,255,255,.5)'); g.restore();
    for(let i = 0; i < 8; i++){ const k = (t*.4 + i/8) % 1; circ(g, fx + 10 + Math.cos(.32)*k*w*.5, fy - 110 + Math.sin(.32)*k*w*.5, 5, k < .5 ? '#cbd5e1' : '#38bdf8'); }
    rr(g, w*.68, h*.62, 110, 110, 14, 'rgba(56,189,248,.4)', '#94a3b8', 3); for(let i = 0; i < 3; i++){ const f = 1 + Math.sin(t*18 + i)*.15; g.beginPath(); g.moveTo(fx - 26*f, fy + 120); g.quadraticCurveTo(fx, fy + 60, fx + 26*f, fy + 120); g.fillStyle = ['rgba(251,146,60,.9)','rgba(250,204,21,.8)','rgba(96,165,250,.6)'][i]; g.fill(); }
    txt(g, 'kondensor (pendingin)', w*.5, h*.2, 16, H.ink(o)); txt(g, 'distilat', w*.68 + 55, h*.62 + 135, 16, H.ink(o)); txt(g, 'Berdasarkan perbedaan titik didih · contoh: air suling, minyak atsiri', cx, h*.95, 16, H.mut(o)); }
  if(m === 'kromatografi'){ const px = cx - 120, k = clamp((t % 8)/6, 0, 1); rr(g, px, h*.1, 240, h*.66, 6, '#fff', '#cbd5e1', 2); rr(g, px - 30, h*.7, 300, h*.14, 10, 'rgba(56,189,248,.35)');
    rr(g, px, h*.76 - k*h*.6, 240, k*h*.6 - 4, 0, 'rgba(56,189,248,.12)'); [['#ec4899', .9], ['#eab308', .65], ['#3b82f6', .4], ['#22c55e', .25]].forEach(([c, sp], i) => { const y = h*.66 - k*h*.5*sp; g.beginPath(); g.ellipse(cx, y, 22, 12, 0, 0, TAU); g.fillStyle = c; g.globalAlpha = .85; g.fill(); g.globalAlpha = 1; });
    circ(g, cx, h*.66, 8, '#1e293b'); txt(g, 'tinta hitam terpisah menjadi beberapa warna', cx + 230, h*.3, 15, H.ink(o)); txt(g, 'Berdasarkan perbedaan kecepatan merambat · contoh: memisahkan zat warna tinta', cx, h*.95, 16, H.mut(o)); }
}};

/* ============ GETARAN & GELOMBANG ============ */
A.bandul = {draw(g, w, h, t, st, o){
  const cx = w*.4, top = h*.08, L = h*.62, T = 2.2, th = Math.cos(t/T*TAU)*.5, bx = cx + Math.sin(th)*L, by = top + Math.cos(th)*L;
  line(g, cx - 90, top, cx + 90, top, H.mut(o), 8); line(g, cx, top, bx, by, H.ink(o), 3); circ(g, bx, by, 26, '#f59e0b', '#fff', 3);
  [['A', -.5], ['O', 0], ['B', .5]].forEach(([n, a]) => { const x = cx + Math.sin(a)*L, y = top + Math.cos(a)*L; circ(g, x, y + 46, 4, H.mut(o)); txt(g, n, x, y + 66, 20, H.ink(o)); });
  g.beginPath(); g.arc(cx, top, L + 40, PI/2 - .5, PI/2 + .5); g.strokeStyle = H.ln(o); g.setLineDash([6, 8]); g.lineWidth = 2; g.stroke(); g.setLineDash([]);
  const n = Math.floor(t/T); txt(g, `getaran: ${n}`, w*.82, h*.2, 22, H.ink(o)); txt(g, `waktu: ${t.toFixed(1).replace('.', ',')} s`, w*.82, h*.28, 18, H.mut(o));
  pill(g, '1 getaran = A → O → B → O → A', w*.82, h*.42, C[0], '#fff', 16); pill(g, `T = ${T.toFixed(1).replace('.', ',')} s`, w*.82, h*.52, C[1], '#fff', 18); pill(g, `f = 1/T ≈ ${(1/T).toFixed(2).replace('.', ',')} Hz`, w*.82, h*.62, C[2], '#fff', 18);
  txt(g, 'amplitudo = simpangan terjauh (O → A atau O → B)', w/2, h*.96, 16, H.mut(o));
}};
A.gelombang = {ctl:[['transversal','Transversal'],['longitudinal','Longitudinal']], draw(g, w, h, t, st, o){
  const y0 = h*.45, A1 = h*.16, lam = w*.32, x0 = w*.06, W = w*.88;
  if(st.mode === 'transversal'){ g.beginPath(); for(let x = 0; x <= W; x += 3) g.lineTo(x0 + x, y0 - Math.sin((x/lam - t*.5)*TAU)*A1); g.strokeStyle = C[1]; g.lineWidth = 5; g.stroke(); line(g, x0, y0, x0 + W, y0, H.ln(o), 2, [6, 8]);
    for(let i = 0; i < 14; i++){ const x = i*W/13; circ(g, x0 + x, y0 - Math.sin((x/lam - t*.5)*TAU)*A1, 6, '#f97316'); }
    const ph = (t*.5) % 1, xc = x0 + ((.25 + ph) % 1)*lam; arrow(g, xc + lam*0, y0 - A1 - 40, xc + lam, y0 - A1 - 40, C[2], 3, 10); txt(g, 'λ (1 bukit + 1 lembah)', xc + lam/2, y0 - A1 - 62, 16, C[2]);
    arrow(g, x0 + W - 20, y0, x0 + W - 20, y0 - A1, C[8], 3, 10); txt(g, 'A', x0 + W - 4, y0 - A1/2, 18, C[8]); arrow(g, w*.4, h*.85, w*.6, h*.85, H.ink(o), 3, 12); txt(g, 'arah rambat', w/2, h*.92, 15, H.mut(o)); txt(g, '↕ arah getar', w*.15, h*.88, 15, H.mut(o)); }
  else { for(let i = 0; i < 60; i++){ const xr = i/59*W, x = x0 + xr + Math.sin((xr/lam - t*.5)*TAU)*16; line(g, x, y0 - 60, x, y0 + 60, i % 10 === 0 ? '#f97316' : C[7], 3); }
    const ph = (t*.5) % 1; for(let k = 0; k < 3; k++){ const xc = x0 + ((k + ph + .75) % 3)*lam*(W/(3*lam)); }
    txt(g, 'rapatan', x0 + ((.75 + (t*.5)) % 1)*lam, y0 - 84, 16, C[0]); txt(g, 'renggangan', x0 + ((.25 + (t*.5)) % 1)*lam, y0 + 86, 16, C[1]);
    arrow(g, w*.4, h*.85, w*.6, h*.85, H.ink(o), 3, 12); txt(g, 'arah rambat = arah getar ↔', w/2, h*.92, 15, H.mut(o)); }
  txt(g, 'v = λ × f = λ / T', w/2, h*.08, 22, H.ink(o));
}};
A.bunyi = {draw(g, w, h, t, st, o){
  const sx = w*.14, sy = h*.42; emo(g, '🔊', sx, sy, 80); for(let i = 0; i < 6; i++){ const r = ((t*120 + i*80) % 480); g.beginPath(); g.arc(sx + 30, sy, r, -.6, .6); g.strokeStyle = `rgba(14,165,233,${1 - r/480})`; g.lineWidth = 6; g.stroke(); }
  emo(g, '👂', w*.75, sy, 70);
  const B = [['Infrasonik','< 20 Hz','🐘 gajah, 🌋 gempa', C[7]], ['Audiosonik','20 – 20.000 Hz','🧑 telinga manusia', C[2]], ['Ultrasonik','> 20.000 Hz','🦇 kelelawar, 🐬 lumba-lumba, USG', C[0]]];
  B.forEach((b, i) => { const x = w*(.18 + i*.32); rr(g, x - 120, h*.68, 240, 110, 18, b[3]); txt(g, b[0], x, h*.68 + 26, 20, '#fff'); txt(g, b[1], x, h*.68 + 54, 17, '#fff', 'center', 800); txt(g, b[2], x, h*.68 + 84, 14, '#fff', 'center', 700); });
  txt(g, 'Bunyi merambat lewat medium (padat, cair, gas) — tidak bisa di ruang hampa', w/2, h*.08, 17, H.ink(o));
}};

/* ============ STRUKTUR BUMI ============ */
A.lapisan = {draw(g, w, h, t, st, o){
  const cx = w*.38, cy = h*.55, R = Math.min(w*.34, h*.44);
  const L = [['Kerak','5–70 km · padat, tempat kita hidup','#78716c',1],['Mantel','± 2.900 km · batuan panas, mengalir pelan','#ea580c',.98],['Inti luar','± 2.200 km · besi-nikel cair','#f59e0b',.55],['Inti dalam','± 1.200 km · besi-nikel padat, ± 5.400 °C','#fde047',.2]];
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fillStyle = '#2563eb'; g.fill(); g.restore(); circ(g, cx, cy, R, null, '#16a34a', 6);
  const a0 = -PI/2 + .2*Math.sin(t*.3), a1 = 0 + .2*Math.sin(t*.3); L.forEach((l, i) => { g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R*l[3], a0, a1); g.closePath(); g.fillStyle = l[2]; g.fill(); });
  for(let i = 0; i < 8; i++){ const a = a0 + (a1 - a0)*((i + .5)/8), rr2 = R*(.6 + .3*Math.sin(t*1.5 + i)); circ(g, cx + Math.cos(a)*rr2, cy + Math.sin(a)*rr2, 4, 'rgba(255,255,255,.5)'); }
  const act = Math.floor(t/1.6) % 4; L.forEach((l, i) => { const y = h*(.16 + i*.2), x = w*.72, on = i === act; const a = (a0 + a1)/2, rr2 = R*(i === 0 ? .99 : (l[3] + (L[i + 1] ? L[i + 1][3] : 0))/2);
    line(g, cx + Math.cos(a)*rr2, cy + Math.sin(a)*rr2, x - 120, y, on ? l[2] : H.ln(o), on ? 4 : 2); rr(g, x - 120, y - 34, w*.27, 68, 14, on ? l[2] : H.panel(o)); txt(g, l[0], x - 104, y - 12, 19, on ? '#fff' : H.ink(o), 'left'); txt(g, l[1], x - 104, y + 14, 13, on ? '#fff' : H.mut(o), 'left', 700); });
}};
A.lempeng = {ctl:[['konvergen','Konvergen'],['divergen','Divergen'],['transform','Transform']], draw(g, w, h, t, st, o){
  const m = st.mode, y = h*.42, k = (t*.15) % 1, cx = w/2;
  rr(g, 0, y + 70, w, h*.4, 0, '#c2410c'); for(let i = 0; i < 6; i++){ const a = t*.6 + i; g.beginPath(); g.ellipse(w*(.1 + i*.17), y + 150 + Math.sin(a)*8, 50, 18, 0, 0, TAU); g.strokeStyle = 'rgba(253,186,116,.6)'; g.lineWidth = 3; g.stroke(); }
  txt(g, 'astenosfer (mantel, arus konveksi)', w/2, h*.9, 15, '#fff');
  if(m === 'konvergen'){ const d = k*60; rr(g, -20 + d, y, cx - 10, 70, 6, '#57534e'); g.save(); g.translate(cx + 10 - d, y); g.rotate(.18); rr(g, 0, 0, cx, 60, 6, '#0369a1'); g.restore();
    g.beginPath(); g.moveTo(cx - 140 + d, y); g.lineTo(cx - 60 + d, y - 80 - k*30); g.lineTo(cx - 10 + d, y); g.fillStyle = '#78716c'; g.fill(); circ(g, cx - 60 + d, y - 90 - k*30, 8 + Math.sin(t*6)*3, '#f97316');
    arrow(g, w*.15, y - 30, w*.3, y - 30, H.ink(o), 4, 12); arrow(g, w*.85, y - 30, w*.7, y - 30, H.ink(o), 4, 12); txt(g, 'Saling mendekat → subduksi, gunung api, palung, gempa (contoh: selatan Jawa)', w/2, h*.1, 16, H.ink(o)); }
  if(m === 'divergen'){ const d = k*50; rr(g, -20 - d, y, cx - 10, 70, 6, '#0369a1'); rr(g, cx + 30 + d, y, cx, 70, 6, '#0369a1'); g.beginPath(); g.moveTo(cx - 10 - d, y + 70); g.lineTo(cx + 10, y - 10); g.lineTo(cx + 30 + d, y + 70); g.fillStyle = '#f97316'; g.fill();
    arrow(g, w*.3, y - 30, w*.15, y - 30, H.ink(o), 4, 12); arrow(g, w*.7, y - 30, w*.85, y - 30, H.ink(o), 4, 12); txt(g, 'Saling menjauh → magma naik membentuk kerak baru (punggung tengah samudra)', w/2, h*.1, 16, H.ink(o)); }
  if(m === 'transform'){ const d = Math.sin(t*1.2)*40; rr(g, 40 + d, y - 40, w*.42, 110, 6, '#57534e'); rr(g, cx + 10 - d, y - 40, w*.42, 110, 6, '#78716c'); line(g, cx + 5, y - 60, cx + 5, y + 80, '#ef4444', 4, [8, 6]);
    arrow(g, w*.2, y - 70, w*.32, y - 70, H.ink(o), 4, 12); arrow(g, w*.8, y + 100, w*.68, y + 100, H.ink(o), 4, 12); txt(g, 'Saling bergeser → patahan & gempa (contoh: Sesar San Andreas)', w/2, h*.1, 16, H.ink(o)); }
}};
A.gempa = {draw(g, w, h, t, st, o){
  const ex = w*.3, ey = h*.42; for(let i = 0; i < 5; i++){ const r = ((t*90 + i*70) % 350); circ(g, ex, ey, r, null, `rgba(239,68,68,${1 - r/350})`, 4); }
  circ(g, ex, ey, 10, '#ef4444'); txt(g, 'episentrum', ex, ey + 30, 15, H.ink(o));
  const bx = w*.12, by = h*.42; [0, 1, 2].forEach(i => { const sh = Math.sin(t*25 + i)*Math.max(0, Math.sin(t*.8))*6; rr(g, bx + i*40 + sh, by - 70 - i*14, 32, 70 + i*14, 4, ['#64748b', '#94a3b8', '#475569'][i]); });
  const sx = w*.58, sy = h*.2, sw = w*.36, shh = h*.5; rr(g, sx, sy, sw, shh, 14, '#f8fafc', '#94a3b8', 3); g.beginPath();
  for(let x = 0; x < sw - 20; x += 2){ const tt = t*1.2 - (sw - 20 - x)/120, amp = Math.max(0, Math.sin(tt*.8))*Math.exp(-((tt % 7.85) - 2)*.3)*60; g.lineTo(sx + 10 + x, sy + shh/2 + Math.sin(tt*30)*Math.min(amp, shh*.42)); }
  g.strokeStyle = '#dc2626'; g.lineWidth = 2; g.stroke(); txt(g, 'seismogram', sx + sw/2, sy + shh + 22, 16, H.ink(o));
  txt(g, 'Seismograf mencatat getaran · kekuatan diukur dengan skala Magnitudo (SR)', w/2, h*.86, 17, H.ink(o)); txt(g, 'Saat gempa: lindungi kepala, berlindung di bawah meja kokoh, lalu evakuasi ke tempat terbuka', w/2, h*.94, 15, H.mut(o));
}};
})();
