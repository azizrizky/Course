/* Lab Petualang — animasi tambahan (kurikulum resmi): 5 kingdom, optik, mata, nefron, atom Bohr, pH, matahari */
(function(){
const A = window.ANIMS, H = window.AH;
const TAU = Math.PI*2;
const {txt, emo, rr, circ, line, arrow, pill, lerp, clamp} = H;
const C = ['#f97316','#0ea5e9','#22c55e','#a855f7','#ec4899','#eab308','#14b8a6','#6366f1','#ef4444','#06b6d4'];

/* Sistem 5 kingdom (Whittaker) — dipakai Buku Siswa IPA Kelas VII */
A.kingdom = {draw(g, w, h, t, st, o){
  const k = clamp(t/5, 0, 1), root = [w/2, h*.1], mid = [[w*.2, h*.36, 'Prokariotik', 'tanpa membran inti'], [w*.64, h*.36, 'Eukariotik', 'punya membran inti']];
  const K = [[0, '🦠', 'Monera'], [1, '🔬', 'Protista'], [1, '🍄', 'Fungi'], [1, '🌿', 'Plantae'], [1, '🐯', 'Animalia']];
  pill(g, '🧬 Makhluk Hidup', root[0], root[1], C[7], '#fff', 20);
  mid.forEach((m, i) => { const kk = clamp(k*3 - .2, 0, 1); line(g, root[0], root[1] + 16, lerp(root[0], m[0], kk), lerp(root[1] + 16, m[1] - 18, kk), H.mut(o), 4); if(kk >= 1){ pill(g, m[2], m[0], m[1], [C[8], C[2]][i], '#fff', 19); txt(g, m[3], m[0], m[1] + 30, 14, H.mut(o)); } });
  K.forEach(([p, e, n], i) => { const pk = clamp(k*3 - 1 - i*.2, 0, 1); if(pk <= 0) return; const x = p === 0 ? w*.2 : w*(.4 + (i - 1)*.155), y = h*.72, m = mid[p];
    line(g, m[0], m[1] + 16, lerp(m[0], x, pk), lerp(m[1] + 16, y - 42, pk), H.mut(o), 3); if(pk >= 1){ circ(g, x, y, 40 + Math.sin(t*3 + i)*2, C[i % C.length]); emo(g, e, x, y, 40); txt(g, n, x, y + 60, 17, H.ink(o)); } });
  txt(g, 'Sistem 5 kingdom (R.H. Whittaker, 1969)', w/2, h*.96, 16, H.mut(o));
}};

/* Optik: cermin & lensa dengan sinar istimewa */
A.optik = {par:[['s','Jarak benda s',2,40,.5,15,'cm'],['f','Jarak fokus |f|',5,20,.5,10,'cm']], ctl:[['cekung','Cermin cekung'],['cembung','Cermin cembung'],['lcembung','Lensa cembung'],['lcekung','Lensa cekung']], draw(g, w, h, t, st, o){
  const m = st.mode, cx = m.startsWith('l') ? w*.5 : w*.66, ay = h*.56, f = w*.13, ink = H.ink(o), mu = H.mut(o);
  line(g, w*.03, ay, w*.97, ay, mu, 2, [8, 6]);
  const s = .5 + .5*Math.sin(t*.5), d = st.user && st.p ? f*(st.p.s/st.p.f) : f*(1.3 + s*1.4), ho = h*.16; // jarak benda (slider: skala s/f)
  // alat optik
  if(m === 'cekung' || m === 'cembung'){ g.beginPath(); const bow = m === 'cekung' ? 1 : -1; g.moveTo(cx, ay - h*.36); g.quadraticCurveTo(cx + bow*w*.05, ay, cx, ay + h*.36); g.strokeStyle = C[1]; g.lineWidth = 7; g.stroke();
    for(let i = -6; i <= 6; i++){ const yy = ay + i*h*.055; line(g, cx + bow*w*.02 + 6, yy, cx + bow*w*.02 + 18, yy - 10, mu, 2); } }
  else { const conv = m === 'lcembung'; g.beginPath(); if(conv){ g.ellipse(cx, ay, w*.018, h*.36, 0, 0, TAU); } else { g.moveTo(cx - w*.022, ay - h*.36); g.lineTo(cx + w*.022, ay - h*.36); g.quadraticCurveTo(cx + 2, ay, cx + w*.022, ay + h*.36); g.lineTo(cx - w*.022, ay + h*.36); g.quadraticCurveTo(cx - 2, ay, cx - w*.022, ay - h*.36); }
    g.fillStyle = 'rgba(14,165,233,.28)'; g.fill(); g.strokeStyle = C[1]; g.lineWidth = 3; g.stroke(); }
  // titik fokus
  const fs = (m === 'cekung' || m === 'lcembung') ? 1 : -1, F = m.startsWith('l') ? [cx - f, cx + f] : [cx - f]; F.forEach(x => { circ(g, x, ay, 6, C[8]); txt(g, 'F', x, ay + 22, 16, C[8]); });
  if(!m.startsWith('l')){ circ(g, cx - 2*f, ay, 5, C[3]); txt(g, 'M (2F)', cx - 2*f, ay + 22, 14, C[3]); }
  // benda
  const bx = cx - d; arrow(g, bx, ay, bx, ay - ho, C[2], 6, 16); txt(g, 'benda', bx, ay + 22, 15, C[2]);
  // bayangan (rumus 1/f = 1/s + 1/s')
  const fv = fs*f, sp = 1/(1/fv - 1/d), M = -sp/d, hi = ho*M; // s' > 0 nyata
  const real = sp > 0, ix = m.startsWith('l') ? cx + sp : cx - sp;
  const ph = (t*.6) % 1;
  // sinar 1: sejajar sumbu
  const r = (x1, y1, x2, y2, col, dash) => line(g, x1, y1, x2, y2, col, 3, dash);
  if(m.startsWith('l')){ r(bx, ay - ho, cx, ay - ho, C[5]); const fx = cx + fv, slope = (ay - (ay - ho))/(fx - cx); const ex = w*.97; r(cx, ay - ho, ex, ay - ho + slope*(ex - cx), C[5]); if(!real) r(cx, ay - ho, ix, ay - hi, C[5], [6, 6]);
    r(bx, ay - ho, cx, ay, C[0]); const sl2 = ho/(cx - bx); r(cx, ay, w*.97, ay + sl2*(w*.97 - cx), C[0]); if(!real) r(cx, ay, ix, ay - hi, C[0], [6, 6]); }
  else { r(bx, ay - ho, cx, ay - ho, C[5]); const fx = cx - fv, sl = ((ay) - (ay - ho))/(fx - cx); const ex = w*.03; r(cx, ay - ho, ex, ay - ho + sl*(ex - cx), C[5]); if(!real) r(cx, ay - ho, ix, ay - hi, C[5], [6, 6]);
    r(bx, ay - ho, cx, ay, C[0]); const sl2 = ho/(cx - bx); r(cx, ay, w*.03, ay + sl2*(cx - w*.03), C[0]); if(!real) r(cx, ay, ix, ay - hi, C[0], [6, 6]); }
  // pulsa cahaya
  circ(g, lerp(bx, cx, ph), ay - ho, 6, '#fde047');
  if(isFinite(sp) && Math.abs(hi) < h*.5 && ix > w*.02 && ix < w*.98){ g.globalAlpha = real ? 1 : .55; arrow(g, ix, ay, ix, ay - hi, C[4], 6, 16); g.globalAlpha = 1; txt(g, real ? 'bayangan nyata' : 'bayangan maya', ix, ay - hi + (hi > 0 ? -22 : 22), 15, C[4]); }
  const sifat = (real ? 'nyata, terbalik' : 'maya, tegak') + ', ' + (Math.abs(M) > 1.02 ? 'diperbesar' : Math.abs(M) < .98 ? 'diperkecil' : 'sama besar');
  txt(g, {cekung:'Cermin cekung (konkaf) — mengumpulkan cahaya', cembung:'Cermin cembung (konveks) — menyebarkan cahaya', lcembung:'Lensa cembung (konvergen)', lcekung:'Lensa cekung (divergen)'}[m], w/2, h*.07, 19, ink);
  const fc = st.user && st.p ? st.p.f : 10, sc2 = (d/f*fc), spc = sp/f*fc; txt(g, `s = ${sc2.toFixed(1).replace('.', ',')} cm · f = ${fs > 0 ? '' : '−'}${String(fc).replace('.', ',')} cm · s′ = ${isFinite(spc) && Math.abs(spc) < 1e4 ? spc.toFixed(1).replace('.', ',') : '∞'} cm · ${sifat}${st.user ? '' : ' (otomatis — geser slider untuk mengatur)'}`, w/2, h*.95, 15, mu);
}};

/* Mata & cacat mata */
A.mata = {ctl:[['normal','Mata normal'],['miopi','Miopi (rabun jauh)'],['hiper','Hipermetropi (rabun dekat)']], draw(g, w, h, t, st, o){
  const m = st.mode, cx = w*.6, cy = h*.5, R = h*.3, ink = H.ink(o), mu = H.mut(o);
  circ(g, cx, cy, R, o.dark ? 'rgba(255,255,255,.08)' : '#fff7ed', '#f97316', 4);
  g.beginPath(); g.arc(cx, cy, R, -.9, .9); g.strokeStyle = C[8]; g.lineWidth = 9; g.stroke(); txt(g, 'retina', cx + R + 46, cy - R*.5, 15, C[8]);
  g.beginPath(); g.ellipse(cx - R*.78, cy, R*.1, R*.38, 0, 0, TAU); g.fillStyle = 'rgba(14,165,233,.45)'; g.fill(); txt(g, 'lensa', cx - R*.78, cy - R*.52, 15, C[1]);
  const focus = m === 'normal' ? cx + R*.98 : m === 'miopi' ? cx + R*.45 : cx + R*1.5, lx = cx - R*.78;
  const kac = m === 'normal' ? 0 : 1, gx = w*.2;
  if(kac){ g.beginPath(); if(m === 'hiper') g.ellipse(gx, cy, 12, R*.45, 0, 0, TAU); else { g.rect(gx - 12, cy - R*.45, 24, R*.9); } g.fillStyle = 'rgba(168,85,247,.25)'; g.fill(); g.strokeStyle = C[3]; g.lineWidth = 3; g.stroke(); txt(g, m === 'miopi' ? 'kacamata lensa cekung (−)' : 'kacamata lensa cembung (+)', gx, cy + R*.62, 15, C[3]); }
  const on = Math.floor(t/3) % 2 === 1 && kac; const fF = on ? cx + R*.98 : focus;
  [-1, 1].forEach(sg => { const y0 = cy + sg*R*.28; line(g, w*.03, y0, lx, y0, C[5], 3); const yE = cy + (y0 - cy)*Math.max(-1, (fF - Math.min(fF, cx + R*.98))/(fF - lx)); const endx = Math.min(fF, cx + R*.98);
    const yy = cy + (y0 - cy)*(1 - (endx - lx)/(fF - lx)); line(g, lx, y0, endx, yy, C[5], 3); });
  circ(g, Math.min(fF, cx + R*.98), cy, 7, fF > cx + R*.99 ? C[8] : C[2]);
  txt(g, {normal:'Bayangan jatuh tepat di retina → jelas', miopi:on ? 'Dibantu lensa cekung → bayangan mundur tepat di retina ✓' : 'Bayangan jatuh di DEPAN retina → benda jauh kabur', hiper:on ? 'Dibantu lensa cembung → bayangan maju tepat di retina ✓' : 'Bayangan jatuh di BELAKANG retina → benda dekat kabur'}[m], w/2, h*.08, 18, ink);
  if(kac) txt(g, on ? '👓 memakai kacamata' : '🙈 tanpa kacamata', w/2, h*.94, 16, mu);
}};

/* Nefron: filtrasi → reabsorpsi → augmentasi */
A.nefron = {draw(g, w, h, t, st, o){
  const ink = H.ink(o), mu = H.mut(o), ph = (t/4) % 3, stage = Math.floor(ph);
  const P = [[w*.16, h*.3], [w*.3, h*.3], [w*.36, h*.62], [w*.48, h*.82], [w*.58, h*.62], [w*.66, h*.3], [w*.78, h*.3], [w*.84, h*.85]];
  g.beginPath(); P.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.strokeStyle = '#fbbf24'; g.lineWidth = 26; g.lineJoin = 'round'; g.stroke(); g.strokeStyle = o.dark ? '#1e293b' : '#fff7ed'; g.lineWidth = 16; g.stroke();
  circ(g, P[0][0], P[0][1], 46, null, '#fbbf24', 10); circ(g, P[0][0], P[0][1], 30, '#ef4444'); txt(g, 'glomerulus', P[0][0], P[0][1] - 66, 15, C[8]); txt(g, 'kapsula Bowman', P[0][0], P[0][1] + 66, 14, mu);
  const lab = [['① Filtrasi', 'di glomerulus → urine primer (masih ada glukosa & asam amino)', 0], ['② Reabsorpsi', 'di tubulus kontortus proksimal → urine sekunder (glukosa diserap kembali)', 2], ['③ Augmentasi', 'di tubulus kontortus distal → urine sesungguhnya (zat sisa ditambahkan)', 5]];
  lab.forEach((L, i) => { const p = P[L[2] === 0 ? 1 : L[2]], a = i === stage; pill(g, L[0], p[0] + (i === 1 ? -40 : 30), p[1] - 46, a ? C[[0, 1, 3][i]] : (o.dark ? '#334155' : '#cbd5e1'), '#fff', 16); });
  txt(g, lab[stage][0] + ': ' + lab[stage][1], w/2, h*.07, 17, ink);
  txt(g, 'lengkung Henle', P[3][0], P[3][1] + 34, 14, mu); txt(g, 'tubulus pengumpul → ureter', P[7][0] - 40, P[7][1] + 28, 14, mu);
  const k = (t*.35) % 1, seg = Math.floor(k*(P.length - 1)), f = k*(P.length - 1) - seg, x = lerp(P[seg][0], P[seg + 1][0], f), y = lerp(P[seg][1], P[seg + 1][1], f);
  for(let i = 0; i < 4; i++) circ(g, x + Math.cos(t*3 + i)*6, y + Math.sin(t*3 + i)*6, 5, [C[5], C[2], C[1], C[4]][i]);
  if(stage === 1) for(let i = 0; i < 5; i++){ const q = (t*1.3 + i/5) % 1; circ(g, lerp(P[1][0] + 20, P[1][0] + 20, q), lerp(P[1][1] + 30, P[1][1] + 140, q) - 0, 6, C[2]); }
}};

/* Model atom (Bohr) */
A.atomBohr = {ctl:[['H','Hidrogen'],['C','Karbon'],['O','Oksigen'],['Na','Natrium']], draw(g, w, h, t, st, o){
  const E = {H:[1, 0, [1]], C:[6, 6, [2, 4]], O:[8, 8, [2, 6]], Na:[11, 12, [2, 8, 1]]}[st.mode], cx = w*.4, cy = h*.53, ink = H.ink(o), mu = H.mut(o);
  const rnd = H.rnd(7); for(let i = 0; i < E[0] + E[1]; i++){ const a = rnd()*TAU, r = Math.sqrt(rnd())*Math.min(30, 6 + (E[0] + E[1])*1.6); circ(g, cx + Math.cos(a)*r, cy + Math.sin(a)*r, 9, i < E[0] ? '#ef4444' : '#94a3b8', 'rgba(0,0,0,.2)', 1); }
  E[2].forEach((n, s) => { const R = 70 + s*58; circ(g, cx, cy, R, null, H.ln(o), 2); for(let i = 0; i < n; i++){ const a = t*(1.2 - s*.3) + i*TAU/n; circ(g, cx + Math.cos(a)*R, cy + Math.sin(a)*R, 9, '#0ea5e9', '#fff', 2); } });
  const bx = w*.72; [['🔴 Proton (+)', E[0], '#ef4444'], ['⚪ Neutron (0)', E[1], '#94a3b8'], ['🔵 Elektron (−)', E[0], '#0ea5e9']].forEach((r, i) => { rr(g, bx - 10, h*(.22 + i*.17), w*.26, h*.13, 16, H.panel(o)); txt(g, r[0], bx + 4, h*(.285 + i*.17), 17, ink, 'left'); txt(g, String(r[1]), bx + w*.23, h*(.285 + i*.17), 26, r[2], 'right'); });
  txt(g, `Atom ${st.mode}: nomor atom ${E[0]}, nomor massa ${E[0] + E[1]}, konfigurasi kulit ${E[2].join(' · ')}`, w/2, h*.07, 18, ink);
  txt(g, 'Model Bohr: elektron mengelilingi inti pada lintasan (kulit) tertentu', w/2, h*.95, 15, mu);
}};

/* Skala pH & indikator */
A.ph = {draw(g, w, h, t, st, o){
  const ink = H.ink(o), x0 = w*.06, W = w*.88, y = h*.42, cw = W/15;
  for(let i = 0; i <= 14; i++){ const hue = i < 7 ? i*16 : i === 7 ? 120 : 120 + (i - 7)*22; rr(g, x0 + i*cw, y, cw - 4, 56, 10, `hsl(${hue},80%,52%)`); txt(g, String(i), x0 + i*cw + cw/2 - 2, y + 28, 20, '#fff'); }
  txt(g, '◀ ASAM (pH < 7)', x0 + W*.18, y - 26, 18, '#ef4444'); txt(g, 'NETRAL', x0 + 7*cw + cw/2, y - 26, 18, '#22c55e'); txt(g, 'BASA (pH > 7) ▶', x0 + W*.82, y - 26, 18, '#6366f1');
  const items = [['🍋', 'jeruk', 2], ['🥤', 'soda', 3], ['🍅', 'tomat', 4], ['☕', 'kopi', 5], ['💧', 'air murni', 7], ['🩸', 'darah', 7.4], ['🧂', 'baking soda', 9], ['🧼', 'sabun', 10], ['🧽', 'pemutih', 13]];
  const k = Math.floor(t/1.6) % items.length; items.forEach((it, i) => { const x = x0 + it[2]*cw + cw/2, yy = y + 110 + (i % 2)*70, a = i === k; g.globalAlpha = a ? 1 : .55; line(g, x, y + 60, x, yy - 26, H.mut(o), 2); emo(g, it[0], x, yy, a ? 46 : 34); txt(g, it[1], x, yy + 34, 14, ink); g.globalAlpha = 1; });
  const it = items[k]; txt(g, `${it[0]} ${it[1]} ≈ pH ${it[2]} → ${it[2] < 7 ? 'asam: lakmus biru → MERAH' : it[2] > 7.2 ? 'basa: lakmus merah → BIRU' : 'netral: lakmus tidak berubah'}`, w/2, h*.1, 19, ink);
}};

/* Lapisan Matahari */
A.matahari = {draw(g, w, h, t, st, o){
  const cx = w*.36, cy = h*.54, R = h*.4, ink = H.ink(o), mu = H.mut(o);
  for(let i = 0; i < 18; i++){ const a = i*TAU/18 + t*.1, r1 = R*1.04, r2 = R*(1.18 + .06*Math.sin(t*2 + i)); line(g, cx + Math.cos(a)*r1, cy + Math.sin(a)*r1, cx + Math.cos(a)*r2, cy + Math.sin(a)*r2, 'rgba(253,186,116,.6)', 5); }
  const L = [[1, '#fb923c', 'Korona', '±1–2 juta °C, terlihat saat gerhana total'], [.96, '#f97316', 'Kromosfer', '±4.000–25.000 °C, berwarna kemerahan'], [.9, '#fbbf24', 'Fotosfer', '±5.500 °C, permukaan yang tampak (bintik matahari)'], [.72, '#f59e0b', 'Zona konveksi', 'energi naik-turun seperti air mendidih'], [.5, '#ea580c', 'Zona radiatif', 'energi merambat sebagai radiasi'], [.25, '#dc2626', 'Inti', '±15 juta °C, fusi hidrogen → helium']];
  L.forEach(l => { g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R*l[0], -1.25, 1.25); g.closePath(); g.fillStyle = l[1]; g.fill(); g.beginPath(); g.arc(cx, cy, R*l[0], 1.25, TAU - 1.25); g.fillStyle = l[0] > .88 ? l[1] : '#fbbf24'; g.fill(); });
  const k = Math.floor(t/2.2) % L.length;
  L.forEach((l, i) => { const ly = h*(.14 + i*.135), a = i === k; line(g, cx + R*l[0]*.92*Math.cos(-.6 + i*.24), cy + R*l[0]*.92*Math.sin(-.6 + i*.24), w*.66, ly, a ? ink : mu, a ? 3 : 1.5); rr(g, w*.66, ly - 24, w*.32, 48, 14, a ? l[1] : H.panel(o)); txt(g, l[2], w*.67, ly - 6, 17, a ? '#fff' : ink, 'left'); txt(g, l[3], w*.67, ly + 13, 12, a ? '#fff' : mu, 'left', 700); });
  txt(g, '☀️ Matahari = bintang terdekat, sumber energi utama Bumi', w*.36, h*.05, 17, ink);
}};
})();
