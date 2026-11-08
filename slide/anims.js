/* Lab Petualang — pustaka animasi kanvas untuk slide (bagian 1: Kelas 7)
   ANIMS[nama] = {ctl:[[nilai,label]], draw(g, w, h, t, st, o, dt)} */
(function(){
const A = window.ANIMS = window.ANIMS || {};
const TAU = Math.PI*2, PI = Math.PI;
const H = window.AH = {
  ink:o => o.dark ? '#f4f7ff' : '#14213d', mut:o => o.dark ? '#a9b8d6' : '#5b6a88', ln:o => o.dark ? 'rgba(255,255,255,.16)' : 'rgba(20,33,61,.14)', panel:o => o.dark ? 'rgba(255,255,255,.07)' : 'rgba(20,33,61,.05)',
  txt(g, s, x, y, size = 18, col = '#fff', align = 'center', w = 900){ size *= H.fs; g.font = `${w} ${size}px Nunito, 'Segoe UI', sans-serif`; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); },
  emo(g, e, x, y, size = 40){ g.font = `${size}px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, x, y); },
  rr(g, x, y, w, h, r, fill, stroke, lw = 2){ g.beginPath(); if(g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); if(fill){ g.fillStyle = fill; g.fill(); } if(stroke){ g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } },
  circ(g, x, y, r, fill, stroke, lw = 2){ g.beginPath(); g.arc(x, y, Math.max(.1, r), 0, TAU); if(fill){ g.fillStyle = fill; g.fill(); } if(stroke){ g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } },
  line(g, x1, y1, x2, y2, col, lw = 3, dash){ g.beginPath(); g.setLineDash(dash || []); g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.stroke(); g.setLineDash([]); },
  arrow(g, x1, y1, x2, y2, col, lw = 4, hd = 14){ const a = Math.atan2(y2 - y1, x2 - x1); H.line(g, x1, y1, x2 - Math.cos(a)*hd*.6, y2 - Math.sin(a)*hd*.6, col, lw);
    g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - Math.cos(a - .45)*hd, y2 - Math.sin(a - .45)*hd); g.lineTo(x2 - Math.cos(a + .45)*hd, y2 - Math.sin(a + .45)*hd); g.closePath(); g.fillStyle = col; g.fill(); },
  pill(g, s, x, y, bg, col = '#fff', size = 16){ size *= H.fs; g.font = `900 ${size}px Nunito, sans-serif`; const w = g.measureText(s).width + size*1.2; H.rr(g, x - w/2, y - size*.85, w, size*1.7, size*.85, bg); H.txt(g, s, x, y + 1, size/H.fs, col); },
  lerp:(a, b, k) => a + (b - a)*k, clamp:(v, a, b) => Math.max(a, Math.min(b, v)), ease:k => k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2)/2,
  heat(k){ k = H.clamp(k, 0, 1); const h = 220 - k*220; return `hsl(${h},85%,${50 + k*5}%)`; },
  fs:1.22,
  rnd(seed){ let s = seed || 1; return () => (s = (s*16807) % 2147483647)/2147483647; }
};
const {txt, emo, rr, circ, line, arrow, pill, lerp, clamp, ease} = H;
const C = ['#f97316','#0ea5e9','#22c55e','#a855f7','#ec4899','#eab308','#14b8a6','#6366f1','#ef4444','#06b6d4'];

/* ============ HAKIKAT SAINS ============ */
A.metode = {draw(g, w, h, t, st, o){
  const S = [['👀','Mengamati'],['❓','Merumuskan masalah'],['💭','Hipotesis'],['🧪','Eksperimen'],['📊','Analisis data'],['✅','Kesimpulan'],['📢','Komunikasi']];
  const cx = w/2, cy = h/2 + 6, R = Math.min(w, h)*.36, act = Math.floor(t/1.6) % S.length;
  g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.strokeStyle = H.ln(o); g.lineWidth = 10; g.stroke();
  g.beginPath(); g.arc(cx, cy, R, -PI/2, -PI/2 + ((t/1.6) % S.length)/S.length*TAU); g.strokeStyle = C[act % C.length]; g.lineWidth = 10; g.lineCap = 'round'; g.stroke();
  S.forEach((s, i) => { const a = -PI/2 + i/S.length*TAU, x = cx + Math.cos(a)*R, y = cy + Math.sin(a)*R, on = i === act, r = on ? 46 + Math.sin(t*6)*3 : 36;
    circ(g, x, y, r, on ? C[i % C.length] : H.panel(o), C[i % C.length], 4); emo(g, s[0], x, y, on ? 40 : 30);
    txt(g, s[1], x + Math.cos(a)*(r + 10) * (Math.abs(Math.cos(a)) > .3 ? 1 : 0), y + (Math.abs(Math.cos(a)) > .3 ? 0 : Math.sin(a)*(r + 18)) + (Math.abs(Math.cos(a)) > .3 ? r + 18 : 0), on ? 19 : 16, on ? H.ink(o) : H.mut(o)); });
  emo(g, '🔬', cx, cy - 14, 64); txt(g, `Langkah ${act + 1}`, cx, cy + 40, 20, H.ink(o));
}};
A.lab = {draw(g, w, h, t, st, o){
  const base = h*.82; rr(g, w*.06, base, w*.88, 14, 7, o.dark ? '#64748b' : '#94a3b8');
  // pembakar spiritus
  const bx = w*.3; rr(g, bx - 40, base - 46, 80, 46, 14, '#cbd5e1', '#94a3b8'); rr(g, bx - 8, base - 62, 16, 18, 4, '#475569');
  for(let i = 0; i < 3; i++){ const f = 1 + Math.sin(t*20 + i)*.15; g.beginPath(); g.moveTo(bx - 14*f, base - 62); g.quadraticCurveTo(bx, base - 120*f + i*12, bx + 14*f, base - 62); g.fillStyle = ['rgba(251,146,60,.85)','rgba(250,204,21,.8)','rgba(96,165,250,.7)'][i]; g.fill(); }
  // kaki tiga & kasa
  line(g, bx - 70, base, bx - 55, base - 150, '#64748b', 6); line(g, bx + 70, base, bx + 55, base - 150, '#64748b', 6); rr(g, bx - 80, base - 158, 160, 10, 4, '#94a3b8');
  // gelas kimia
  const gx = bx - 62, gy = base - 300, gw = 124, gh = 140; const lv = .62;
  rr(g, gx, gy + gh*(1 - lv), gw, gh*lv, 10, 'rgba(56,189,248,.55)');
  g.strokeStyle = o.dark ? 'rgba(255,255,255,.75)' : 'rgba(20,33,61,.55)'; g.lineWidth = 4; g.beginPath(); g.moveTo(gx - 6, gy - 8); g.lineTo(gx, gy); g.lineTo(gx, gy + gh - 10); g.quadraticCurveTo(gx, gy + gh, gx + 10, gy + gh); g.lineTo(gx + gw - 10, gy + gh); g.quadraticCurveTo(gx + gw, gy + gh, gx + gw, gy + gh - 10); g.lineTo(gx + gw, gy); g.stroke();
  for(let i = 0; i < 4; i++) line(g, gx + gw - 26, gy + 30 + i*24, gx + gw - 8, gy + 30 + i*24, H.mut(o), 2);
  for(let i = 0; i < 14; i++){ const k = ((t*.7 + i*.137) % 1); circ(g, gx + 16 + ((i*37) % (gw - 32)), gy + gh - 10 - k*gh*lv, 3 + k*5, 'rgba(255,255,255,.7)'); }
  for(let i = 0; i < 6; i++){ const k = ((t*.4 + i/6) % 1); g.globalAlpha = 1 - k; circ(g, gx + gw/2 + Math.sin(t*2 + i)*20, gy - 20 - k*70, 10 + k*16, o.dark ? 'rgba(255,255,255,.35)' : 'rgba(100,116,139,.3)'); g.globalAlpha = 1; }
  // termometer
  const tx = gx + gw*.3, Tk = (Math.sin(t*.5)*.5 + .5); rr(g, tx - 7, gy - 110, 14, 220, 7, 'rgba(255,255,255,.85)', '#94a3b8'); rr(g, tx - 4, gy + 100 - 150*Tk - 20, 8, 150*Tk + 20, 4, '#ef4444'); circ(g, tx, gy + 112, 12, '#ef4444');
  pill(g, `${Math.round(25 + Tk*75)} °C`, tx + 60, gy - 90, '#ef4444');
  // erlenmeyer berubah warna
  const ex = w*.72, ey = base, col = `hsl(${(t*40) % 360},80%,55%)`;
  g.beginPath(); g.moveTo(ex - 20, ey - 200); g.lineTo(ex - 20, ey - 130); g.lineTo(ex - 85, ey - 6); g.quadraticCurveTo(ex - 88, ey, ex - 80, ey); g.lineTo(ex + 80, ey); g.quadraticCurveTo(ex + 88, ey, ex + 85, ey - 6); g.lineTo(ex + 20, ey - 130); g.lineTo(ex + 20, ey - 200);
  g.strokeStyle = o.dark ? 'rgba(255,255,255,.75)' : 'rgba(20,33,61,.55)'; g.lineWidth = 4; g.stroke();
  g.save(); g.clip(); g.fillStyle = col; g.globalAlpha = .7; g.beginPath(); g.moveTo(ex - 100, ey - 70); for(let x = -100; x <= 100; x += 10) g.lineTo(ex + x, ey - 70 + Math.sin(t*4 + x*.08)*5); g.lineTo(ex + 100, ey); g.lineTo(ex - 100, ey); g.fill(); g.restore(); g.globalAlpha = 1;
  // pipet tetes
  const dy = (t*1.2 % 1); rr(g, ex - 8, ey - 300, 16, 70, 6, 'rgba(255,255,255,.8)', '#94a3b8'); circ(g, ex, ey - 306, 14, '#f43f5e'); circ(g, ex, ey - 222 + dy*120, 7*(1 - dy*.3), col);
  txt(g, 'Gelas kimia', gx + gw/2, base + 34, 17, H.mut(o)); txt(g, 'Pembakar spiritus', bx, base + 56, 15, H.mut(o)); txt(g, 'Labu Erlenmeyer + pipet tetes', ex, base + 34, 17, H.mut(o));
}};
A.variabel = {draw(g, w, h, t, st, o){
  const W = [50, 100, 150], gk = clamp(t/6, 0, 1), base = h*.78;
  W.forEach((ml, i) => { const x = w*(.2 + i*.3), hh = (60 + ml*1.15)*ease(gk);
    rr(g, x - 48, base, 96, 70, 10, '#b45309'); rr(g, x - 54, base - 6, 108, 16, 6, '#d97706');
    line(g, x, base, x, base - hh, '#16a34a', 7); for(let k = 1; k <= Math.floor(hh/40); k++){ const y = base - k*40, s = k % 2 ? 1 : -1; g.beginPath(); g.ellipse(x + s*22, y, 22, 10, s*-.5, 0, TAU); g.fillStyle = '#22c55e'; g.fill(); }
    // tetes air
    for(let d = 0; d < 1 + i; d++){ const k = (t*1.4 + d*.33 + i*.2) % 1; emo(g, '💧', x + (d - i/2)*16, base - 220 + k*200, 18); }
    pill(g, `💧 ${ml} mL/hari`, x, base + 104, C[1]); txt(g, `tinggi ≈ ${Math.round(hh/8)} cm`, x, base + 140, 18, H.ink(o)); });
  pill(g, 'Variabel BEBAS: jumlah air (sengaja diubah)', w/2, 34, C[0], '#fff', 17);
  pill(g, 'Variabel TERIKAT: tinggi tanaman (diukur)', w/2, 72, C[3], '#fff', 17);
  txt(g, 'Variabel KONTROL: jenis tanaman, tanah, pot, cahaya → dibuat sama', w/2, 108, 16, H.mut(o));
}};
A.bahaya = {draw(g, w, h, t, st, o){
  const L = [['🔥','Mudah terbakar','alkohol, spiritus'],['☠️','Beracun','pestisida, merkuri'],['🧪','Korosif','asam sulfat, HCl pekat'],['💥','Mudah meledak','gas elpiji, petasan'],['❗','Iritan/berbahaya','pemutih, amonia'],['🐟','Berbahaya bagi lingkungan','oli bekas, deterjen'],['⭕','Pengoksidasi','kaporit, H₂O₂'],['🫁','Bahaya kesehatan','formalin, bensin']];
  const cols = 4, act = Math.floor(t/1.2) % L.length;
  L.forEach((s, i) => { const x = w*(.13 + (i % cols)*.248), y = h*(.28 + Math.floor(i/cols)*.44), on = i === act, sz = on ? 66 + Math.sin(t*8)*3 : 56;
    g.save(); g.translate(x, y); g.rotate(PI/4); rr(g, -sz/2, -sz/2, sz, sz, 6, '#fff', '#dc2626', 7); g.restore(); emo(g, s[0], x, y, on ? 38 : 32);
    txt(g, s[1], x, y + 66, on ? 18 : 16, on ? H.ink(o) : H.mut(o)); if(on) txt(g, s[2], x, y + 90, 15, C[0], 'center', 800); });
}};

/* ============ PENGUKURAN ============ */
A.sorong = {draw(g, w, h, t, st, o){
  const k = (Math.sin(t*.45)*.5 + .5), val = 1 + k*4.5, mm = 26, x0 = w*.1, y0 = h*.38, len = 7.4*10*mm/10*1.0;
  const px = v => x0 + 60 + v*10*mm/10*1.0*10/1; // cm → px (1 cm = mm*?)
  const S = mm*1.0; const cmpx = S*1.0*1; // 1 mm = S/10? keep 1 cm = S px*? simplified below
  const unit = (w*.78)/8; // px per cm
  rr(g, x0, y0, w*.84, 46, 8, '#cbd5e1', '#64748b'); rr(g, x0, y0 - 120, 40, 166, 6, '#94a3b8', '#64748b');
  for(let i = 0; i <= 80; i++){ const x = x0 + 40 + i*unit/10; line(g, x, y0, x, y0 + (i % 10 ? (i % 5 ? 10 : 16) : 24), '#1e293b', i % 10 ? 1.5 : 2.5); if(i % 10 === 0) txt(g, String(i/10), x, y0 + 34, 15, '#1e293b'); }
  const vx = x0 + 40 + val*unit; rr(g, vx - 40, y0 - 120, 40, 120, 6, '#64748b'); rr(g, vx - 40, y0 + 46, 150, 54, 8, '#e2e8f0', '#64748b');
  for(let i = 0; i <= 10; i++){ const x = vx + i*unit*.09; line(g, x, y0 + 46, x, y0 + 46 + (i % 5 ? 12 : 20), '#b91c1c', 2); if(i % 5 === 0) txt(g, String(i), x, y0 + 82, 13, '#b91c1c'); }
  rr(g, x0 + 40, y0 - 90, vx - 40 - (x0 + 40), 60, 8, 'rgba(250,204,21,.35)', '#eab308'); txt(g, 'benda', (x0 + 40 + vx - 40)/2, y0 - 60, 18, H.ink(o));
  const su = Math.floor(val*10)/10, nn = Math.round((val - su)*100);
  pill(g, `Skala utama: ${su.toFixed(1).replace('.', ',')} cm`, w*.28, h*.82, C[1], '#fff', 18); pill(g, `Nonius ke-${nn} × 0,01 = ${(nn/100).toFixed(2).replace('.', ',')} cm`, w*.68, h*.82, '#b91c1c', '#fff', 18);
  txt(g, `Hasil = ${(su + nn/100).toFixed(2).replace('.', ',')} cm`, w/2, h*.93, 24, H.ink(o));
}};
A.tangga = {draw(g, w, h, t, st, o){
  const U = ['km','hm','dam','m','dm','cm','mm'], n = U.length, sw = (w*.84)/n, sh = (h*.6)/n;
  U.forEach((u, i) => { const x = w*.08 + i*sw, y = h*.14 + i*sh; rr(g, x, y, sw - 6, h*.8 - y, 10, C[i % C.length]); txt(g, u, x + sw/2 - 3, y + 26, 24, '#fff'); });
  const cyc = 14, k = (t % cyc)/cyc, down = k < .5, kk = down ? k*2 : (k - .5)*2, pos = down ? kk*(n - 1) : (1 - kk)*(n - 1), i = Math.floor(pos), f = pos - i;
  const x = w*.08 + pos*sw + sw/2 - 3, y = h*.14 + pos*sh - 26 - Math.sin(f*PI)*40; circ(g, x, y, 16, '#fff', '#0f172a', 3);
  pill(g, down ? 'Turun 1 anak tangga → × 10' : 'Naik 1 anak tangga → : 10', w*.72, h*.12, down ? C[2] : C[8], '#fff', 18);
  txt(g, 'Contoh: 3 km = 3 × 10 × 10 × 10 = 3.000 m', w*.5, h*.96, 18, H.ink(o));
}};
A.termometer = {draw(g, w, h, t, st, o){
  const T = (Math.sin(t*.5)*.5 + .5)*100, S = [['Celsius','°C',0,100,C[8]],['Reamur','°R',0,80,C[5]],['Fahrenheit','°F',32,212,C[0]],['Kelvin','K',273,373,C[1]]];
  S.forEach((s, i) => { const x = w*(.14 + i*.24), top = h*.14, bot = h*.74, hh = bot - top;
    rr(g, x - 14, top - 20, 28, hh + 40, 14, 'rgba(255,255,255,.9)', '#94a3b8'); circ(g, x, bot + 34, 24, s[4]);
    const lv = T/100; rr(g, x - 7, bot - hh*lv, 14, hh*lv + 30, 6, s[4]);
    for(let k = 0; k <= 10; k++){ const y = bot - hh*k/10; line(g, x + 18, y, x + (k % 5 ? 28 : 36), y, H.mut(o), 2); }
    txt(g, `${s[3]}`, x + 58, top, 15, H.mut(o)); txt(g, `${s[2]}`, x + 58, bot, 15, H.mut(o));
    txt(g, s[0], x, bot + 84, 18, H.ink(o)); pill(g, `${(s[2] + (s[3] - s[2])*lv).toFixed(1).replace('.', ',')} ${s[1]}`, x, top - 46, s[4], '#fff', 17); });
  txt(g, 'C : R : (F − 32) : (K − 273) = 5 : 4 : 9 : 5', w/2, h*.97, 19, H.ink(o));
}};
A.neraca = {draw(g, w, h, t, st, o){
  const cyc = t % 10, add = Math.min(4, Math.floor(cyc/1.6)), diff = 4 - add, tilt = H.clamp(diff*.07, -.3, .3), cx = w/2, cy = h*.3, L = w*.32;
  rr(g, cx - 10, cy, 20, h*.5, 6, '#64748b'); rr(g, cx - 100, h*.8, 200, 18, 8, '#475569');
  g.save(); g.translate(cx, cy); g.rotate(-tilt); rr(g, -L - 10, -7, L*2 + 20, 14, 7, '#94a3b8'); g.beginPath(); g.moveTo(0, -8); g.lineTo(-10, -40); g.lineTo(10, -40); g.closePath(); g.fillStyle = '#ef4444'; g.fill(); g.restore();
  circ(g, cx, cy, 10, '#334155');
  [-1, 1].forEach(s => { const ex = cx + s*L*Math.cos(tilt), ey = cy - s*L*Math.sin(tilt), py = ey + h*.26;
    line(g, ex, ey, ex - 50, py, H.mut(o), 2); line(g, ex, ey, ex + 50, py, H.mut(o), 2); g.beginPath(); g.ellipse(ex, py, 70, 12, 0, 0, TAU); g.fillStyle = '#cbd5e1'; g.fill();
    if(s < 0) emo(g, '🍎', ex, py - 30, 56); else for(let i = 0; i < add; i++) rr(g, ex - 48 + i*25, py - 34, 21, 30, 4, '#eab308', '#a16207'); });
  pill(g, add >= 4 ? '⚖️ Seimbang → massa apel = 300 g' : `Anak timbangan: ${add*75} g`, cx, h*.92, add >= 4 ? C[2] : C[1], '#fff', 18);
}};

/* ============ WUJUD ZAT ============ */
A.partikel = {ctl:[['all','Semua'],['padat','Padat'],['cair','Cair'],['gas','Gas']], draw(g, w, h, t, st, o){
  const L = st.mode === 'all' ? ['padat','cair','gas'] : [st.mode]; const bw = (w*.9)/L.length;
  if(!st.P) st.P = {}; L.forEach((k, j) => { const x0 = w*.05 + j*bw + 10, y0 = h*.12, W = bw - 20, Hh = h*.66, r = Math.min(13, W/18);
    rr(g, x0, y0, W, Hh, 14, H.panel(o), C[[1,6,0][['padat','cair','gas'].indexOf(k)]], 4);
    let P = st.P[k + L.length]; if(!P){ P = st.P[k + L.length] = []; const R = H.rnd(7 + j); const nx = Math.floor((W - 20)/(r*2.2)), n = k === 'gas' ? 14 : nx*Math.min(6, Math.floor(Hh/(r*2.2)) - 1);
      for(let i = 0; i < n; i++){ const sp = k === 'cair' ? 2.7 : 2.15, nxx = k === 'cair' ? Math.floor((W - 20)/(r*2.7)) : nx; const hx = x0 + 12 + r*1.6 + (i % nxx)*r*sp, hy = y0 + Hh - 10 - r*1.2 - Math.floor(i/nxx)*r*sp; P.push({hx, hy, x:k === 'gas' ? x0 + 20 + R()*(W - 40) : hx, y:k === 'gas' ? y0 + 20 + R()*(Hh - 40) : hy, vx:(R() - .5)*(k === 'gas' ? 380 : 60), vy:(R() - .5)*(k === 'gas' ? 380 : 40)}); } }
    P.forEach((p, i) => { if(k === 'padat'){ p.x = p.hx + Math.sin(t*25 + i)*2; p.y = p.hy + Math.cos(t*23 + i*1.3)*2; }
      else if(k === 'cair'){ p.x = p.hx + Math.sin(t*1.3 + i*1.7)*r*1.6 + Math.sin(t*.7 + i)*r*.8; p.y = p.hy + Math.cos(t*1.1 + i*2.3)*r*.9; }
      else { p.x += p.vx/60; p.y += p.vy/60;
        if(p.x < x0 + r){ p.x = x0 + r; p.vx = Math.abs(p.vx); } if(p.x > x0 + W - r){ p.x = x0 + W - r; p.vx = -Math.abs(p.vx); } if(p.y < y0 + r){ p.y = y0 + r; p.vy = Math.abs(p.vy); } if(p.y > y0 + Hh - r){ p.y = y0 + Hh - r; p.vy = -Math.abs(p.vy)*(k === 'cair' ? .5 : 1); } }
      circ(g, p.x, p.y, r, C[[1,6,0][['padat','cair','gas'].indexOf(k)]], 'rgba(255,255,255,.5)', 1.5); });
    txt(g, {padat:'🧊 PADAT', cair:'💧 CAIR', gas:'☁️ GAS'}[k], x0 + W/2, y0 + Hh + 30, 22, H.ink(o));
    txt(g, {padat:'rapat · bergetar di tempat', cair:'agak renggang · bergeser', gas:'sangat renggang · bebas'}[k], x0 + W/2, y0 + Hh + 58, 16, H.mut(o)); });
}};
A.perubahan = {draw(g, w, h, t, st, o){
  const P = {padat:[w*.18, h*.78, '🧊', 'PADAT'], cair:[w*.82, h*.78, '💧', 'CAIR'], gas:[w*.5, h*.18, '☁️', 'GAS']};
  const CH = [['padat','cair','Mencair',1,1],['cair','padat','Membeku',0,-1],['cair','gas','Menguap',1,1],['gas','cair','Mengembun',0,-1],['padat','gas','Menyublim',1,-1],['gas','padat','Mengkristal',0,1]];
  const act = Math.floor(t/1.5) % CH.length;
  CH.forEach(([a, b, nm, panas, sd], i) => { const A1 = P[a], B1 = P[b], mx = (A1[0] + B1[0])/2, my = (A1[1] + B1[1])/2, dx = B1[0] - A1[0], dy = B1[1] - A1[1], L = Math.hypot(dx, dy), nx = -dy/L*sd*46, ny = dx/L*sd*46;
    const col = panas ? '#ef4444' : '#3b82f6', on = i === act; g.beginPath(); g.moveTo(A1[0], A1[1]); g.quadraticCurveTo(mx + nx, my + ny, B1[0], B1[1]); g.strokeStyle = col; g.globalAlpha = on ? 1 : .35; g.lineWidth = on ? 6 : 4; g.stroke(); g.globalAlpha = 1;
    const k = on ? (t % 1.5)/1.5 : -1; if(k >= 0){ const x = (1 - k)*(1 - k)*A1[0] + 2*(1 - k)*k*(mx + nx) + k*k*B1[0], y = (1 - k)*(1 - k)*A1[1] + 2*(1 - k)*k*(my + ny) + k*k*B1[1]; circ(g, x, y, 10, col, '#fff', 2); }
    pill(g, (panas ? '🔥 ' : '❄️ ') + nm, mx + nx*1.6, my + ny*1.6, on ? col : (o.dark ? 'rgba(255,255,255,.12)' : 'rgba(20,33,61,.08)'), on ? '#fff' : H.ink(o), on ? 18 : 15); });
  Object.values(P).forEach(p => { circ(g, p[0], p[1], 50, H.panel(o), H.ln(o), 3); emo(g, p[2], p[0], p[1] - 4, 50); txt(g, p[3], p[0], p[1] + 70, 19, H.ink(o)); });
  txt(g, '🔥 menyerap kalor   ❄️ melepas kalor', w/2, h*.97, 17, H.mut(o));
}};
A.terapung = {draw(g, w, h, t, st, o){
  const x0 = w*.08, y0 = h*.2, W = w*.84, Hh = h*.62, wl = y0 + Hh*.18;
  rr(g, x0, y0, W, Hh, 12, null, H.mut(o), 4); g.fillStyle = 'rgba(56,189,248,.35)'; g.beginPath(); g.moveTo(x0 + 2, wl); for(let x = 0; x <= W - 4; x += 10) g.lineTo(x0 + 2 + x, wl + Math.sin(t*2 + x*.04)*3); g.lineTo(x0 + W - 2, y0 + Hh - 2); g.lineTo(x0 + 2, y0 + Hh - 2); g.fill();
  const Obj = [['🪵','Terapung','ρ benda < ρ air', wl - 6, C[2]],['🥚','Melayang','ρ benda = ρ air', y0 + Hh*.55, C[5]],['🪨','Tenggelam','ρ benda > ρ air', y0 + Hh - 34, C[8]]];
  Obj.forEach((b, i) => { const x = x0 + W*(.18 + i*.32), k = clamp((t % 6)/2, 0, 1), y = lerp(y0 - 40, b[3], ease(k)) + (k >= 1 ? Math.sin(t*2 + i)*3 : 0);
    emo(g, b[0], x, y, 54); pill(g, b[1], x, y0 + Hh + 30, b[4], '#fff', 18); txt(g, b[2], x, y0 + Hh + 64, 16, H.ink(o)); });
  txt(g, 'ρ air = 1 g/cm³', x0 + W - 70, wl + 26, 15, H.mut(o));
}};

/* ============ KALOR ============ */
A.kurva = {draw(g, w, h, t, st, o){
  const x0 = w*.12, y0 = h*.84, W = w*.8, Hh = h*.68, k = clamp((t % 12)/10, 0, 1);
  arrow(g, x0, y0, x0 + W + 20, y0, H.ink(o), 3); arrow(g, x0, y0, x0, y0 - Hh - 20, H.ink(o), 3); txt(g, 'waktu / kalor diberikan →', x0 + W - 80, y0 + 26, 15, H.mut(o));
  g.save(); g.translate(x0 - 34, y0 - Hh/2); g.rotate(-PI/2); txt(g, 'suhu (°C)', 0, 0, 15, H.mut(o)); g.restore();
  const pts = [[0, -20],[.15, 0],[.4, 0],[.6, 100],[.85, 100],[1, 130]], Y = v => y0 - (v + 30)/170*Hh, X = p => x0 + p*W;
  [[0, 'Y0'],[100,'Y1']].forEach(([v]) => { line(g, x0, Y(v), x0 + W, Y(v), H.ln(o), 2, [6, 8]); txt(g, v + '°', x0 - 18, Y(v), 15, H.mut(o)); });
  g.beginPath(); g.moveTo(X(0), Y(-20)); let lx = X(0), ly = Y(-20);
  for(let i = 1; i < pts.length; i++){ const [a, va] = pts[i - 1], [b, vb] = pts[i]; if(k < a) break; const e = Math.min(k, b), v = va + (vb - va)*(e - a)/(b - a); lx = X(e); ly = Y(v); g.lineTo(lx, ly); }
  g.strokeStyle = C[0]; g.lineWidth = 6; g.lineJoin = 'round'; g.stroke(); circ(g, lx, ly, 9, '#fff', C[0], 4);
  const L = [[.075,'🧊 es naik suhu'],[.275,'🧊💧 melebur (suhu tetap)'],[.5,'💧 air naik suhu'],[.725,'💧☁️ mendidih (suhu tetap)'],[.92,'☁️ uap']];
  L.forEach(([p, s], i) => { if(k >= p - .07) pill(g, s, X(p), Y([ -10, 0, 50, 100, 115][i]) - 34 - (i % 2)*0, [C[1],C[6],C[1],C[0],C[3]][i], '#fff', 14); });
  txt(g, 'Saat berubah wujud, kalor dipakai untuk mengubah wujud → suhu tidak naik (kalor laten)', w/2, h*.06, 16, H.ink(o));
}};
A.perpindahan = {ctl:[['konduksi','Konduksi'],['konveksi','Konveksi'],['radiasi','Radiasi']], draw(g, w, h, t, st, o){
  const m = st.mode;
  if(m === 'konduksi'){ const y = h*.45, x0 = w*.15, L = w*.7; for(let i = 0; i < 40; i++){ const k = i/40, heat = clamp((t*.18) - k*.9 + .2, 0, 1)*(1 - k*.5); rr(g, x0 + k*L, y - 18, L/40 + 1, 36, 0, H.heat(heat)); }
    rr(g, x0, y - 18, L, 36, 10, null, H.mut(o), 2); for(let i = 0; i < 3; i++){ const f = 1 + Math.sin(t*18 + i)*.15; g.beginPath(); g.moveTo(x0 - 20*f, y + 90); g.quadraticCurveTo(x0, y + 10 - i*8, x0 + 20*f, y + 90); g.fillStyle = ['rgba(251,146,60,.9)','rgba(250,204,21,.8)','rgba(96,165,250,.6)'][i]; g.fill(); }
    for(let i = 0; i < 12; i++){ const x = x0 + 20 + i*(L - 40)/11, a = (1 - i/12)*4*clamp(t*.2, 0, 1); circ(g, x + Math.sin(t*30 + i)*a, y + Math.cos(t*27 + i)*a, 7, 'rgba(255,255,255,.85)'); }
    emo(g, '✋', x0 + L + 30, y - 10, 46); txt(g, 'Kalor merambat melalui logam tanpa disertai perpindahan partikel', w/2, h*.84, 18, H.ink(o)); txt(g, 'Contoh: sendok di teh panas, setrika, panci', w/2, h*.92, 16, H.mut(o)); }
  if(m === 'konveksi'){ const cx = w/2, cy = h*.5, pw = w*.42, ph = h*.42; rr(g, cx - pw/2, cy - ph/2, pw, ph, 18, 'rgba(56,189,248,.25)', H.mut(o), 5);
    for(let i = 0; i < 26; i++){ const s = i % 2 ? 1 : -1, k = ((t*.18 + i/26) % 1), a = k*TAU; const x = cx + s*(pw*.22) + Math.cos(a)*pw*.18*s, y = cy - Math.sin(a)*ph*.36; circ(g, x, y, 7, H.heat(.5 - Math.sin(a)*.5)); }
    arrow(g, cx - pw*.04, cy + ph*.3, cx - pw*.04, cy - ph*.3, '#ef4444', 5); arrow(g, cx + pw*.4, cy - ph*.3, cx + pw*.4, cy + ph*.3, '#3b82f6', 5);
    for(let i = 0; i < 3; i++){ const f = 1 + Math.sin(t*18 + i)*.15; g.beginPath(); g.moveTo(cx - 30*f, cy + ph/2 + 70); g.quadraticCurveTo(cx, cy + ph/2 - i*6, cx + 30*f, cy + ph/2 + 70); g.fillStyle = ['rgba(251,146,60,.9)','rgba(250,204,21,.8)','rgba(96,165,250,.6)'][i]; g.fill(); }
    txt(g, 'Air panas naik (massa jenis kecil), air dingin turun → arus konveksi', w/2, h*.08, 18, H.ink(o)); txt(g, 'Contoh: merebus air, angin darat & angin laut, cerobong asap', w/2, h*.95, 16, H.mut(o)); }
  if(m === 'radiasi'){ const sx = w*.18, sy = h*.45; for(let i = 0; i < 4; i++) circ(g, sx, sy, 60 + i*10 + Math.sin(t*3 + i)*4, `rgba(250,204,21,${.25 - i*.05})`); circ(g, sx, sy, 60, '#facc15'); emo(g, '😎', sx, sy, 50);
    for(let i = 0; i < 6; i++){ const y = sy - 100 + i*40, k = (t*.6 + i*.17) % 1; g.beginPath(); for(let x = 0; x < w*.45; x += 4) g.lineTo(sx + 80 + x, y + Math.sin(x*.08 - t*8)*8); g.strokeStyle = `rgba(249,115,22,${.4 + .4*Math.sin(t + i)})`; g.lineWidth = 3; g.stroke(); circ(g, sx + 80 + k*w*.45, y, 6, '#f97316'); }
    circ(g, w*.8, sy, 64, '#2563eb'); emo(g, '🌍', w*.8, sy, 110); txt(g, 'Kalor merambat tanpa zat perantara (bisa lewat ruang hampa)', w/2, h*.85, 18, H.ink(o)); txt(g, 'Contoh: panas matahari, api unggun, pakaian hitam cepat panas', w/2, h*.93, 16, H.mut(o)); }
}};
A.muai = {ctl:[['rel','Rel kereta'],['bimetal','Bimetal'],['kabel','Kabel listrik']], draw(g, w, h, t, st, o){
  const hot = Math.sin(t*.8)*.5 + .5; pill(g, hot > .5 ? `☀️ Siang (panas) · ${Math.round(25 + hot*25)}°C` : `🌙 Malam (dingin) · ${Math.round(25 + hot*25)}°C`, w/2, 34, hot > .5 ? C[0] : C[7], '#fff', 18);
  if(st.mode === 'rel'){ const y = h*.5, L = w*.38, gap = 30 - hot*24; for(let i = 0; i < 9; i++) rr(g, w*.06 + i*w*.11, y - 6, 26, 70, 4, '#92400e');
    rr(g, w*.5 - gap/2 - L, y, L, 20, 4, H.heat(hot*.7)); rr(g, w*.5 + gap/2, y, L, 20, 4, H.heat(hot*.7)); line(g, w*.5 - gap/2, y - 30, w*.5 - gap/2, y + 60, H.mut(o), 2, [4, 4]); line(g, w*.5 + gap/2, y - 30, w*.5 + gap/2, y + 60, H.mut(o), 2, [4, 4]);
    txt(g, `celah ${(gap/6).toFixed(1).replace('.', ',')} mm`, w/2, y - 46, 18, H.ink(o)); txt(g, 'Celah memberi ruang rel memuai saat panas, agar rel tidak melengkung', w/2, h*.86, 18, H.ink(o)); }
  if(st.mode === 'bimetal'){ const x0 = w*.2, y0 = h*.5, L = w*.6, bend = hot*.9; g.save(); g.translate(x0, y0);
    for(const [off, col, nm] of [[-9, '#f59e0b', 'tembaga (muai besar)'], [9, '#94a3b8', 'besi (muai kecil)']]){ g.beginPath(); const R = bend > .02 ? L/bend : 1e6; for(let s = 0; s <= 1; s += .02){ const a = s*bend, x = bend > .02 ? Math.sin(a)*(R + off) : s*L, y = bend > .02 ? R - Math.cos(a)*(R + off) - R + off*Math.cos(a)*0 : off; g.lineTo(x, (bend > .02 ? (R - Math.cos(a)*(R + off)) - (R - (R + off)) : 0) + off); }
      g.strokeStyle = col; g.lineWidth = 16; g.lineCap = 'round'; g.stroke(); }
    g.restore(); rr(g, x0 - 30, y0 - 40, 30, 80, 6, '#475569');
    txt(g, 'tembaga', x0 + 60, y0 - 34, 16, '#f59e0b'); txt(g, 'besi', x0 + 60, y0 + 40, 16, H.mut(o));
    txt(g, 'Dipanaskan → melengkung ke arah logam yang muainya lebih kecil (besi)', w/2, h*.88, 18, H.ink(o)); txt(g, 'Dipakai pada termostat setrika & alarm kebakaran', w/2, h*.95, 16, H.mut(o)); }
  if(st.mode === 'kabel'){ const y = h*.3, x1 = w*.15, x2 = w*.85, sag = 30 + hot*70; [x1, x2].forEach(x => { rr(g, x - 8, y, 16, h*.5, 4, '#78716c'); rr(g, x - 40, y, 80, 10, 4, '#78716c'); });
    for(const dy of [0, 26]){ g.beginPath(); g.moveTo(x1, y + dy); g.quadraticCurveTo(w/2, y + dy + sag*2, x2, y + dy); g.strokeStyle = '#1e293b'; g.lineWidth = 4; g.stroke(); }
    txt(g, hot > .5 ? 'Siang: kabel memuai → lebih kendur' : 'Malam: kabel menyusut → lebih tegang', w/2, h*.86, 19, H.ink(o)); txt(g, 'Kabel dipasang agak kendur agar tidak putus saat menyusut', w/2, h*.93, 16, H.mut(o)); }
}};

/* ============ TATA SURYA ============ */
A.orbit = {draw(g, w, h, t, st, o){
  const cx = w/2, cy = h/2, PL = [['Merkurius','#a8a29e',4,4.1],['Venus','#facc15',6,1.6],['Bumi','#3b82f6',6.5,1],['Mars','#ef4444',5,.53],['Jupiter','#f59e0b',13,.084],['Saturnus','#eab308',11,.034],['Uranus','#67e8f9',8,.012],['Neptunus','#6366f1',8,.006]];
  for(let i = 0; i < 120; i++){ const R = H.rnd(i + 3); circ(g, ((i*97) % w), ((i*53) % h), R()*1.6, o.dark ? 'rgba(255,255,255,.6)' : 'rgba(20,33,61,.25)'); }
  for(let i = 0; i < 5; i++) circ(g, cx, cy, 26 + i*6, `rgba(250,204,21,${.18 - i*.03})`); circ(g, cx, cy, 24, '#fbbf24');
  PL.forEach((p, i) => { const R = 46 + i*(Math.min(w, h)*.5 - 56)/8, a = t*p[3]*.8 + i*1.3; g.beginPath(); g.ellipse(cx, cy, R*1.35, R*.75, 0, 0, TAU); g.strokeStyle = H.ln(o); g.lineWidth = 1.5; g.stroke();
    const x = cx + Math.cos(a)*R*1.35, y = cy + Math.sin(a)*R*.75; if(p[0] === 'Saturnus'){ g.beginPath(); g.ellipse(x, y, p[2]*2, p[2]*.6, -.3, 0, TAU); g.strokeStyle = '#fde68a'; g.lineWidth = 2; g.stroke(); }
    circ(g, x, y, p[2], p[1]); txt(g, p[0], x, y - p[2] - 11, 13, H.ink(o)); });
  txt(g, '“Matahari Menyinari Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus”', w/2, h - 18, 15, H.mut(o));
}};
A.rotasi = {ctl:[['rotasi','Rotasi'],['revolusi','Revolusi']], draw(g, w, h, t, st, o){
  if(st.mode === 'rotasi'){ const cx = w*.55, cy = h*.5, R = Math.min(w, h)*.3;
    for(let i = 0; i < 6; i++) arrow(g, w*.04, cy - 120 + i*48, w*.2, cy - 120 + i*48, '#facc15', 3, 10); emo(g, '☀️', w*.08, h*.12, 50);
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip(); g.fillStyle = '#1d4ed8'; g.fillRect(cx - R, cy - R, R*2, R*2);
    for(let i = 0; i < 6; i++){ const a = t*.6 + i*1.05, x = cx + Math.sin(a)*R*.85; if(Math.cos(a) > 0){ g.beginPath(); g.ellipse(x, cy - 40 + (i % 3)*40, 40*Math.cos(a), 30, 0, 0, TAU); g.fillStyle = '#16a34a'; g.fill(); } }
    g.fillStyle = 'rgba(2,6,23,.6)'; g.fillRect(cx, cy - R, R, R*2); g.restore(); circ(g, cx, cy, R, null, '#93c5fd', 3);
    const pa = t*.6, px = cx + Math.sin(pa)*R, vis = Math.cos(pa) > 0; if(vis){ emo(g, '🧍', px, cy - 10, 36); pill(g, px < cx ? 'SIANG ☀️' : 'MALAM 🌙', px, cy - 54, px < cx ? C[5] : C[7], '#fff', 15); }
    txt(g, 'Bumi berputar pada porosnya ± 24 jam (dari barat ke timur)', w/2, h*.92, 18, H.ink(o)); txt(g, 'Akibat: siang & malam, gerak semu harian matahari, perbedaan waktu', w/2, h*.98 - 4, 15, H.mut(o)); }
  else { const cx = w/2, cy = h*.47, Rx = w*.36, Ry = h*.3; g.beginPath(); g.ellipse(cx, cy, Rx, Ry, 0, 0, TAU); g.strokeStyle = H.ln(o); g.lineWidth = 2; g.stroke(); circ(g, cx, cy, 34, '#fbbf24'); emo(g, '☀️', cx, cy, 50);
    const M = [['21 Mar',0],['21 Jun',PI/2],['23 Sep',PI],['22 Des',PI*1.5]]; M.forEach(([n, a]) => { const x = cx + Math.cos(a)*Rx, y = cy + Math.sin(a)*Ry; circ(g, x, y, 5, H.mut(o)); txt(g, n, x, y + (Math.sin(a) > .5 ? 24 : Math.sin(a) < -.5 ? -24 : 26), 14, H.mut(o)); });
    const a = t*.5, x = cx + Math.cos(a)*Rx, y = cy + Math.sin(a)*Ry; g.save(); g.translate(x, y); g.rotate(.41); circ(g, 0, 0, 22, '#2563eb'); line(g, 0, -34, 0, 34, '#fff', 2); g.restore();
    txt(g, 'Bumi mengelilingi Matahari ± 365¼ hari dengan poros miring 23,5°', w/2, h*.9, 18, H.ink(o)); txt(g, 'Akibat: pergantian musim, gerak semu tahunan Matahari, kalender Masehi', w/2, h*.97, 15, H.mut(o)); }
}};
A.gerhana = {ctl:[['bulan','Gerhana Bulan'],['matahari','Gerhana Matahari']], draw(g, w, h, t, st, o){
  const cy = h*.46, sx = w*.1, k = Math.sin(t*.6)*.5 + .5; circ(g, sx, cy, 70, '#fbbf24'); txt(g, 'Matahari', sx, cy + 96, 16, H.ink(o));
  if(st.mode === 'bulan'){ const ex = w*.55, mx = w*.86, my = cy + (k - .5)*120; g.beginPath(); g.moveTo(ex, cy - 40); g.lineTo(w, cy - 18); g.lineTo(w, cy + 18); g.lineTo(ex, cy + 40); g.fillStyle = 'rgba(15,23,42,.55)'; g.fill();
    line(g, sx, cy - 70, ex, cy - 40, 'rgba(250,204,21,.5)', 2); line(g, sx, cy + 70, ex, cy + 40, 'rgba(250,204,21,.5)', 2); circ(g, ex, cy, 40, '#2563eb'); emo(g, '🌍', ex, cy, 70);
    const inSh = Math.abs(my - cy) < 24; circ(g, mx, my, 18, inSh ? '#b45309' : '#e5e7eb'); txt(g, 'Bulan', mx, my + 34, 15, H.ink(o)); txt(g, 'Bumi', ex, cy + 64, 15, H.ink(o));
    pill(g, inSh ? '🌕➜🔴 Bulan masuk bayangan Bumi' : 'Bulan di luar bayangan', w/2, h*.84, inSh ? '#b45309' : C[7], '#fff', 17); txt(g, 'Susunan: Matahari – Bumi – Bulan · terjadi saat bulan purnama', w/2, h*.94, 16, H.mut(o)); }
  else { const mx = w*.5, my = cy + (k - .5)*120, ex = w*.86; circ(g, ex, cy, 46, '#2563eb'); emo(g, '🌍', ex, cy, 80);
    g.beginPath(); g.moveTo(mx, my - 18); g.lineTo(ex - 30, cy - 10); g.lineTo(ex - 30, cy + 10); g.lineTo(mx, my + 18); g.fillStyle = 'rgba(15,23,42,.6)'; g.fill();
    circ(g, mx, my, 18, '#9ca3af'); txt(g, 'Bulan', mx, my + 36, 15, H.ink(o)); const hit = Math.abs(my - cy) < 20; pill(g, hit ? '🌑 Bayangan Bulan jatuh ke Bumi' : 'Bayangan tidak mengenai Bumi', w/2, h*.84, hit ? '#0f172a' : C[7], '#fff', 17);
    txt(g, 'Susunan: Matahari – Bulan – Bumi · terjadi saat bulan baru', w/2, h*.94, 16, H.mut(o)); }
}};
A.fasebulan = {draw(g, w, h, t, st, o){
  const cx = w/2, cy = h*.5, R = Math.min(w, h)*.32; for(let i = 0; i < 5; i++) arrow(g, 10, cy - 100 + i*50, 70, cy - 100 + i*50, '#facc15', 3, 10); txt(g, 'sinar Matahari', 44, cy - 130, 14, H.mut(o));
  circ(g, cx, cy, 34, '#2563eb'); emo(g, '🌍', cx, cy, 60);
  const N = ['Bulan baru','Sabit muda','Kuartal I','Cembung','Purnama','Cembung','Kuartal III','Sabit tua'], act = Math.floor(t/1.2) % 8;
  N.forEach((n, i) => { const a = PI + i/8*TAU, x = cx + Math.cos(a)*R, y = cy - Math.sin(a)*R*.85; circ(g, x, y, i === act ? 22 : 16, '#334155'); g.save(); g.beginPath(); g.arc(x, y, i === act ? 22 : 16, -PI/2, PI/2, true); g.fillStyle = '#f8fafc'; g.fill(); g.restore();
    // tampak dari Bumi
    const sx = x + Math.cos(a)*68, sy = y - Math.sin(a)*58, r = 16, ph = i/8; circ(g, sx, sy, r, '#1e293b'); g.save(); g.beginPath(); g.arc(sx, sy, r, 0, TAU); g.clip();
    const lit = Math.cos(ph*TAU); g.fillStyle = '#f8fafc'; g.beginPath(); if(ph <= .5){ g.arc(sx, sy, r, -PI/2, PI/2); g.ellipse(sx, sy, Math.abs(lit)*r, r, 0, PI/2, -PI/2, lit > 0); } else { g.arc(sx, sy, r, PI/2, -PI/2); g.ellipse(sx, sy, Math.abs(lit)*r, r, 0, -PI/2, PI/2, lit > 0); } g.fill(); g.restore();
    if(i === act) pill(g, n, sx, sy + (Math.sin(a) > 0 ? -34 : 34), C[i % C.length], '#fff', 14); });
  txt(g, 'Lingkaran dalam: posisi Bulan · lingkaran luar: bentuk yang terlihat dari Bumi', w/2, h - 14, 15, H.mut(o));
}};

/* ============ KLASIFIKASI ============ */
A.kingdom = {draw(g, w, h, t, st, o){
  const k = clamp(t/5, 0, 1), root = [w/2, h*.1], mid = [[w*.24, h*.36, 'Prokariotik', 'tanpa membran inti'], [w*.72, h*.36, 'Eukariotik', 'punya membran inti']];
  const K = [[0, '🌋', 'Archaebacteria'], [0, '🦠', 'Eubacteria'], [1, '🦠', 'Protista'], [1, '🍄', 'Fungi'], [1, '🌿', 'Plantae'], [1, '🐯', 'Animalia']];
  pill(g, '🧬 Makhluk Hidup', root[0], root[1], C[7], '#fff', 20);
  mid.forEach((m, i) => { const kk = clamp(k*3 - .2, 0, 1); line(g, root[0], root[1] + 16, lerp(root[0], m[0], kk), lerp(root[1] + 16, m[1] - 18, kk), H.mut(o), 4); if(kk >= 1){ pill(g, m[2], m[0], m[1], [C[8], C[2]][i], '#fff', 19); txt(g, m[3], m[0], m[1] + 30, 14, H.mut(o)); } });
  K.forEach(([p, e, n], i) => { const pk = clamp(k*3 - 1 - i*.2, 0, 1); if(pk <= 0) return; const x = p === 0 ? w*(.1 + i*.14) : w*(.42 + (i - 2)*.16), y = h*.72, m = mid[p];
    line(g, m[0], m[1] + 16, lerp(m[0], x, pk), lerp(m[1] + 16, y - 42, pk), H.mut(o), 3); if(pk >= 1){ circ(g, x, y, 38 + Math.sin(t*3 + i)*2, C[i % C.length]); emo(g, e, x, y, 38); txt(g, n, x, y + 58, 16, H.ink(o)); } });
  txt(g, 'Sistem 6 kingdom (Carl Woese)', w/2, h*.96, 16, H.mut(o));
}};
A.takson = {draw(g, w, h, t, st, o){
  const T = [['Kingdom','Animalia','🐾'],['Filum','Chordata','🦴'],['Kelas','Mammalia','🍼'],['Ordo','Carnivora','🥩'],['Famili','Felidae','🐆'],['Genus','Felis','🐈'],['Spesies','Felis catus','🐱']];
  const act = Math.floor(t/1.3) % T.length, n = T.length;
  T.forEach((s, i) => { const ww = w*.9*(1 - i*.11), y = h*.06 + i*(h*.84/n), hh = h*.84/n - 8, x = (w - ww)/2, on = i <= act;
    rr(g, x, y, ww, hh, 14, on ? C[i % C.length] : H.panel(o)); txt(g, s[0], x + 20, y + hh/2, 19, on ? '#fff' : H.mut(o), 'left'); txt(g, s[1], x + ww - 54, y + hh/2, 19, on ? '#fff' : H.mut(o), 'right', 800); emo(g, s[2], x + ww - 28, y + hh/2, 22); });
  txt(g, '“King Philip Came Over For Good Soup” · makin ke bawah: anggota makin sedikit, persamaan makin banyak', w/2, h*.97, 14, H.mut(o));
}};
A.dikotomi = {draw(g, w, h, t, st, o){
  const Q = [[w*.5, h*.1, '1a. Bertulang belakang? '], [w*.27, h*.36, '2a. Berbulu (rambut)?'], [w*.73, h*.36, '3a. Berkaki 6?']];
  const L = [[w*.13, h*.68, '🐈', 'Kucing', 1, 1], [w*.4, h*.68, '🐦', 'Burung', 1, 0], [w*.6, h*.68, '🦋', 'Kupu-kupu', 2, 1], [w*.87, h*.68, '🐌', 'Siput', 2, 0]];
  const act = Math.floor(t/2) % 4, path = [[0, act < 2 ? 1 : 2], [act < 2 ? 1 : 2, act]];
  [[0, 1, 'ya'], [0, 2, 'tidak']].forEach(([a, b, s]) => { const on = path[0][1] === b; line(g, Q[a][0], Q[a][1] + 20, Q[b][0], Q[b][1] - 20, on ? C[0] : H.ln(o), on ? 6 : 3); txt(g, s, (Q[a][0] + Q[b][0])/2 + (b === 1 ? -24 : 24), (Q[a][1] + Q[b][1])/2, 16, H.mut(o)); });
  L.forEach((l, i) => { const on = i === act; line(g, Q[l[4]][0], Q[l[4]][1] + 20, l[0], l[1] - 40, on ? C[0] : H.ln(o), on ? 6 : 3); txt(g, l[5] ? 'ya' : 'tidak', (Q[l[4]][0] + l[0])/2 + (l[5] ? -22 : 22), (Q[l[4]][1] + l[1])/2, 15, H.mut(o));
    circ(g, l[0], l[1], on ? 42 : 34, on ? C[2] : H.panel(o), H.ln(o)); emo(g, l[2], l[0], l[1], on ? 44 : 34); txt(g, l[3], l[0], l[1] + 58, 17, on ? H.ink(o) : H.mut(o)); });
  Q.forEach((q, i) => pill(g, q[2], q[0], q[1], (i === 0 || path[0][1] === i) ? C[7] : (o.dark ? 'rgba(255,255,255,.12)' : 'rgba(20,33,61,.1)'), (i === 0 || path[0][1] === i) ? '#fff' : H.ink(o), 16));
  txt(g, 'Kunci dikotomi: selalu 2 pilihan yang berlawanan di setiap langkah', w/2, h*.95, 16, H.mut(o));
}};

/* ============ EKOSISTEM ============ */
A.rantai = {draw(g, w, h, t, st, o){
  const N = [['☀️','Matahari','sumber energi'],['🌾','Padi','produsen'],['🐭','Tikus','konsumen I'],['🐍','Ular','konsumen II'],['🦅','Elang','konsumen III'],['🍄','Pengurai','bakteri & jamur']];
  const y = h*.42; N.forEach((n, i) => { const x = w*(.08 + i*.168); if(i < N.length - 1){ arrow(g, x + 40, y, x + w*.168 - 40, y, i === 4 ? H.ln(o) : C[0], 5, 14);
      const k = (t*.6 + i*.2) % 1; if(i < 4) circ(g, lerp(x + 40, x + w*.168 - 46, k), y - 14, 6, '#facc15'); }
    circ(g, x, y, 40 + (Math.floor(t) % 6 === i ? 4 : 0), C[i % C.length]); emo(g, n[0], x, y, 40); txt(g, n[1], x, y + 62, 17, H.ink(o)); txt(g, n[2], x, y + 86, 14, H.mut(o)); });
  g.beginPath(); g.moveTo(w*.75, y + 110); g.quadraticCurveTo(w*.5, h*.95, w*.2, y + 110); g.strokeStyle = C[2]; g.lineWidth = 3; g.setLineDash([8, 8]); g.stroke(); g.setLineDash([]); txt(g, 'sisa makhluk hidup diurai → zat hara untuk tumbuhan', w*.48, h*.9, 15, H.mut(o));
  txt(g, '➜ panah menunjukkan arah aliran energi (“dimakan oleh”)', w/2, h*.1, 17, H.ink(o));
}};
A.piramida = {draw(g, w, h, t, st, o){
  const L = [['🌿 Produsen','10.000 kJ'],['🐛 Konsumen I','1.000 kJ'],['🐦 Konsumen II','100 kJ'],['🦅 Konsumen III','10 kJ']], n = L.length, k = clamp(t/3, 0, 1);
  L.forEach((l, i) => { const ww = w*.8*(1 - i*.22)*ease(clamp(k*n - i, 0, 1)), y = h*.78 - i*h*.17, x = w/2 - ww/2; if(ww < 2) return;
    rr(g, x, y, ww, h*.15, 10, C[[2,5,0,8][i]]); txt(g, l[0], w/2, y + h*.05, 19, '#fff'); txt(g, l[1], w/2, y + h*.1, 17, '#fff', 'center', 800);
    if(i < n - 1){ txt(g, '≈10% →', x + ww + 46, y - 6, 15, H.ink(o)); txt(g, '90% hilang (panas, aktivitas)', x + ww + 46, y + 16, 12, H.mut(o), 'left'); } });
  txt(g, 'Makin ke puncak, energi makin sedikit', w/2, h*.06, 19, H.ink(o));
}};
A.simbiosis = {ctl:[['mutualisme','Mutualisme'],['komensalisme','Komensalisme'],['parasitisme','Parasitisme']], draw(g, w, h, t, st, o){
  const D = {mutualisme:['🐝','🌸','+','+','Lebah & bunga','lebah dapat nektar, bunga terbantu penyerbukan'], komensalisme:['🌺','🌳','+','0','Anggrek & pohon','anggrek dapat tempat & cahaya, pohon tidak rugi'], parasitisme:['🌿','🍊','+','−','Benalu & pohon jeruk','benalu menyerap air & mineral, jeruk dirugikan']}[st.mode];
  const cx = w/2, cy = h*.44, b = Math.sin(t*3)*8; circ(g, cx - 150, cy, 86, C[2] + '33'); circ(g, cx + 150, cy, 86, (D[3] === '−' ? C[8] : D[3] === '0' ? C[7] : C[2]) + '33');
  emo(g, D[0], cx - 150 + (st.mode === 'mutualisme' ? Math.cos(t*2)*60 : 0), cy + b, 90); emo(g, D[1], cx + 150, cy, 100);
  for(let i = 0; i < 6; i++){ const k = (t*.5 + i/6) % 1; circ(g, lerp(cx + 70, cx - 70, k), cy - 40 + Math.sin(k*PI)*-30, 5, '#22c55e'); if(D[3] !== '0') circ(g, lerp(cx - 70, cx + 70, k), cy + 40 + Math.sin(k*PI)*30, 5, D[3] === '+' ? '#22c55e' : '#ef4444'); }
  [[cx - 150, D[2]], [cx + 150, D[3]]].forEach(([x, s]) => { circ(g, x + 70, cy - 70, 26, s === '+' ? '#16a34a' : s === '0' ? '#64748b' : '#dc2626'); txt(g, s, x + 70, cy - 70, 30, '#fff'); });
  txt(g, D[4], w/2, h*.78, 24, H.ink(o)); txt(g, D[5], w/2, h*.87, 18, H.mut(o));
}};
})();
