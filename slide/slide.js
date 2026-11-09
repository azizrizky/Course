/* Lab Petualang — mesin slide pemaparan materi
   Data: window.SLIDE_DATA[id] = {color:[a,b], slides:[{t:'cover'|'tujuan'|'konsep'|'cards'|'rumus'|'anim'|'contoh'|'kuis'|'ingat'|'tabel'|'penerapan'|'mitos'|'rangkuman'|'refleksi', ...}]} */
(function(){
const $$on = sel => document.querySelector(sel) || {};
"use strict";
const $ = s => document.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const P = new URLSearchParams(location.search);
const ID = P.get('t') === 'pengukuran' ? 'hakikat-sains' : (P.get('t') || 'wujud-zat'); const GOSUB = P.get('t') === 'pengukuran' ? 'D' : P.get('sub');
const EMBED = P.get('embed') === '1';
const MAT = (window.MATERI_DATA || {})[ID] || {};
const ls = {get(k, d){ try{ const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } }, set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }};
const PAL = ['#f97316','#0ea5e9','#22c55e','#a855f7','#ec4899','#eab308','#14b8a6','#6366f1','#ef4444','#06b6d4'];
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; r = Math.round(r*k); g = Math.round(g*k); b = Math.round(b*k); return `rgb(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)})`; };
const grad = c => `linear-gradient(135deg, ${c}, ${shade(c, .62)})`;
if(EMBED) document.documentElement.classList.add('embed');

/* tema */
function applyTheme(t){ document.documentElement.dataset.theme = t; $('#bTheme').textContent = t === 'dark' ? '🌙' : '☀️'; }
applyTheme(P.get('theme') || ls.get('lab_theme', 'dark') || 'dark');
$$on('#bTheme').onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(t); ls.set('lab_theme', t); };
addEventListener('message', e => { if(e.data && e.data.type === 'lab-theme' && e.data.theme) applyTheme(e.data.theme); });

/* muat data */
setTimeout(() => { const l = document.querySelector('#loading'); if(l && !S.length && !l.querySelector('button')) init(); }, 9000);
const sc = document.createElement('script'); sc.src = `data/${ID}.js?v=20261109b`; sc.onload = init; sc.onerror = () => { $('#loading').textContent = 'Slide materi ini belum tersedia.'; }; document.head.appendChild(sc);

let D, S = [], cur = 0, scale = 1, SW = 1600, SH = 900;
let SECS = [];
const SUBC = ['#0ea5e9','#22c55e','#a855f7','#ec4899','#eab308','#14b8a6'];
function buildSecs(){ SECS = [{id:'awal', name:'Pembuka', short:'🚀', icon:'🚀', sub:'Tujuan & pertanyaan pemantik', color:'#f97316'}]
  .concat((MAT.subs || []).map(([k, t], i) => ({id:k, name:t, short:k, icon:k, sub:'Sub bab ' + k, color:SUBC[i % SUBC.length]})))
  .concat([{id:'penutup', name:'Latihan & Refleksi', short:'🏁', icon:'🏁', sub:'Kuis kilat, rangkuman, refleksi', color:'#f59e0b'}]); }
function secOf(d){ if(d.sb && SECS.some(x => x.id === d.sb)) return d.sb; if(['cover','tujuan','peta'].includes(d.t)) return 'awal'; if(['kuis','rangkuman','refleksi'].includes(d.t)) return 'penutup'; return (SECS[1] || SECS[0]).id; }
let MODE = 'auto', PLAY = false, playT = 0, HUB = 1;
const visited = new Set(ls.get('slide_vis_' + ID, []));
function init(){ try { init0(); } catch(err){ console.error(err); const l = $('#loading'); if(l) l.innerHTML = `<div style="max-width:520px;text-align:center;padding:20px"><b>Slide gagal dimuat 😥</b><p style="font-size:14px;opacity:.8">${String(err && err.message || err).replace(/</g, '&lt;')}</p><button onclick="location.replace(location.pathname + location.search.replace(/[?&]r=\\d+/, '') + (location.search ? '&' : '?') + 'r=' + Date.now() + location.hash)" style="padding:10px 18px;border-radius:12px;border:none;font-weight:900;cursor:pointer">🔄 Muat ulang</button></div>`; } }
function init0(){
  D = (window.SLIDE_DATA || {})[ID]; if(!D){ $('#loading span').textContent = 'Slide materi ini belum tersedia.'; return; }
  document.title = `${MAT.nama || D.title || ID} — Slide Materi`; $('#sbTitle').textContent = MAT.nama || ID;
  if(D.color){ document.documentElement.style.setProperty('--a', D.color[0]); document.documentElement.style.setProperty('--b', D.color[1]); }
  buildSecs(); const ord = SECS.map(x => x.id), list = D.slides.map((d, i) => ({d, i, sec:secOf(d)}));
  list.sort((a, b) => ord.indexOf(a.sec) - ord.indexOf(b.sec) || a.i - b.i);
  D.slides = list.map(x => x.d); HUB = Math.max(0, D.slides.findIndex(x => x.t === 'cover')) + 1; D.slides.splice(HUB, 0, {t:'peta', title:'Menu Materi'});
  const stage = $('#stage');
  D.slides.forEach((d, i) => { const el = document.createElement('section'); el.className = 'slide ' + d.t; el.dataset.sec = secOf(d); el.innerHTML = render(d, i); stage.appendChild(el); S.push({d, el, sec:secOf(d)}); wire(d, el); });
  S.forEach(x => { const sc = SECS.find(z => z.id === x.sec), k = x.el.querySelector('.kick'); if(k && sc && x.d.t !== 'peta' && x.d.t !== 'cover') k.insertAdjacentHTML('afterbegin', `<span class="subtag" style="--c:${sc.color}">${sc.id.length === 1 ? sc.id + '. ' + sc.name : sc.name}</span>`); });
  stage.insertAdjacentHTML('beforeend', '<div id="lb"><div class="lbc"></div></div>'); $('#lb').addEventListener('click', e => { if(e.target.id === 'lb' || e.target.closest('[data-lbx]')) closePop(); });
  $('#prog').innerHTML = S.map((x, i) => `<i data-i="${i}" title="${i + 1}. ${ttl(x.d)}" style="--c:${SECS.find(z => z.id === x.sec).color}"></i>`).join('');
  $$('#prog i').forEach(b => b.onclick = () => go(+b.dataset.i, true));
  $('#secs').innerHTML = SECS.map(x => `<button data-sec="${x.id}" style="--c:${x.color}" title="${x.id.length === 1 ? x.id + '. ' : ''}${x.name}"><span class="e">${x.icon}</span><span class="n">${x.id.length === 1 ? x.name : x.name.split(' ')[0]}</span><i class="pp"><i></i></i></button>`).join('');
  $$('#secs [data-sec]').forEach(b => b.onclick = () => goSec(b.dataset.sec));
  buildToc();
  fit(); addEventListener('resize', fit);
  const h = parseInt(location.hash.slice(1)), gs = GOSUB ? S.findIndex(x => x.sec === GOSUB) : -1; go(!isNaN(h) ? h - 1 : gs >= 0 ? gs : 0, false, true);
  setTimeout(() => { const l = $('#loading'); l.style.opacity = 0; setTimeout(() => l.remove(), 400); }, 250);
  requestAnimationFrame(loop);
}
const TYPE = {peta:'PETA BELAJAR', cover:'SAMPUL', tujuan:'TUJUAN', konsep:'KONSEP', cards:'MACAM', rumus:'RUMUS', anim:'ANIMASI', contoh:'CONTOH SOAL', kuis:'KUIS', ingat:'INGAT', tabel:'TABEL', penerapan:'PENERAPAN', mitos:'MITOS/FAKTA', rangkuman:'RANGKUMAN', refleksi:'REFLEKSI'};
const EMO = {peta:'🗺️', cover:'🎬', tujuan:'🎯', konsep:'💡', cards:'🧩', rumus:'🧮', anim:'🎞️', contoh:'✍️', kuis:'❓', ingat:'🧠', tabel:'📋', penerapan:'🌍', mitos:'🕵️', rangkuman:'🗺️', refleksi:'🪞'};
const strip = h => String(h).replace(/<[^>]+>/g, '');
const vis = (k, big) => k.ghs && window.GHS ? `<span class="svgv${big ? ' big' : ''}">${GHS[k.ghs]}</span>` : k.ill && window.ILL ? `<span class="svgv ill${big ? ' big' : ''}">${ILL[k.ill]}</span>` : (k.e || '');
const LBLT = {tujuan:'Tujuan & pertanyaan pemantik', mitos:'Mitos atau fakta?', rangkuman:'Peta konsep (rangkuman)', refleksi:'Refleksi & tindak lanjut', peta:'Peta Belajar', ingat:'Biar gampang ingat'};
const ttl = d => strip(d.t === 'kuis' ? 'Kuis: ' + d.q : d.title || LBLT[d.t] || TYPE[d.t] || '');
function fit(){ const wide = innerWidth >= 1180; document.body.classList.toggle('wide', wide); const vw = innerWidth - (wide ? 300 : 0), vh = innerHeight - 64 - 58, por = vh > vw*1.15; document.documentElement.classList.toggle('portrait', por);
  SW = por ? 1000 : 1600; SH = por ? 1640 : 900; const st = $('#stage'); st.style.width = SW + 'px'; st.style.height = SH + 'px';
  scale = Math.min(vw/SW, vh/SH); st.style.transform = `translate(-50%,-50%) scale(${scale})`; S.forEach(x => x.el.querySelectorAll('canvas.anim').forEach(sizeCanvas)); if(S[cur] && S[cur].d.t === 'rangkuman') layoutMind(S[cur].el); }

/* ---------- render ---------- */
const kick = (s, def) => `<div class="kick">${s.kick || def}</div>`;
const animBox = (name, o, cap, extra = '') => { const A = window.ANIMS && ANIMS[name]; const ctl = A && A.ctl ? `<div class="animctl">${A.ctl.map((c, k) => `<button data-v="${c[0]}" class="${k === 0 ? 'on' : ''}">${c[1]}</button>`).join('')}</div>` : '';
  return `<div class="animbox ${extra}"><canvas class="anim" data-anim="${name}" data-o='${JSON.stringify(o || {}).replace(/'/g, '&#39;')}'></canvas>${ctl}${cap ? `<div class="cap">${cap}</div>` : ''}</div>`; };
function render(s, i){
  const c = PAL;
  switch(s.t){
  case 'peta': return `<div class="kick">Menu Materi · Bab ${MAT.bab || ''} Kelas ${MAT.kelas || ''}</div><h2>${MAT.nama || ''} — <em>pilih sub bab</em></h2>
    <div class="hub">${SECS.map((x, k) => { const items = D.slides.map((d, j) => ({d, j})).filter(o => secOf(o.d) === x.id && o.d.t !== 'peta');
      return `<div class="hubc f" style="--c:${x.color}"><div class="hh"><span class="e">${x.icon}</span><div><small>${x.id.length === 1 ? 'SUB BAB ' + x.id : x.id === 'awal' ? 'PEMBUKA' : 'PENUTUP'}</small><b>${x.name}</b><i>${items.length} halaman</i></div></div>
        <ul>${items.map(o => `<li data-go="${o.j}"><span>${o.d.e || EMO[o.d.t] || '📄'}</span>${ttl(o.d).slice(0, 46)}</li>`).join('')}</ul>
        <button class="go" data-gosec="${x.id}">Buka ▶</button></div>`; }).join('')}</div>
    <p class="muted hubtip">👆 Ketuk judul halaman untuk langsung membukanya · 🏠 Menu untuk kembali ke sini · ✅ = sudah dipelajari</p>`;
  case 'cover': return `${s.anim ? `<canvas class="anim" data-anim="${s.anim}" data-o='${JSON.stringify(s.o || {})}'></canvas>` : `<div class="big-emo">${s.e || MAT.icon || '🔬'}</div>`}
    <div class="kick">IPA KELAS ${MAT.kelas || ''} · SMPN 4 MAGELANG</div><h1>${s.title}</h1><div class="sub">${s.sub || ''}</div>
    <div class="chips">${(s.chips || []).map((x, k) => `<span class="chip" style="border-color:${c[k % c.length]}">${x}</span>`).join('')}</div>
    <div class="covbt"><button class="btnx alt" data-menu>📚 Buka Menu Materi</button><button class="btnx" data-start>▶ Mulai dari awal</button></div>
    <div class="muted" style="margin-top:22px;font-weight:800;font-size:22px">👩‍🏫 Nella Alfiani Rofiqoh, S.Pd · Bab ${MAT.bab || ''} · ${(MAT.subs || []).length} sub bab</div>`;
  case 'tujuan': return `${kick(s, 'Tujuan Pembelajaran')}<h2>${s.title || 'Hari ini kita akan <em>belajar…</em>'}</h2>
    <div class="body"><div class="col w2">${s.items.map((t, k) => `<div class="tp f"><span class="n" style="background:${grad(c[k % c.length])}">${k+1}</span><p>${t}</p></div>`).join('')}
    ${s.cp ? `<div class="cpbox f">📘 <b>Capaian Pembelajaran Fase D</b> (Kep. Kepala BSKAP No. 046/H/KR/2025): ${s.cp}</div>` : ''}</div>
    <div class="col">${s.pemantik ? `<div class="pemantik f"><b>🤔 PERTANYAAN PEMANTIK</b><p>${s.pemantik}</p></div>` : ''}${s.anim ? animBox(s.anim, s.o, s.cap) : ''}</div></div>`;
  case 'konsep': return `${kick(s, 'Konsep Kunci')}<h2>${s.title}</h2><div class="body">
    <div class="col ${s.anim ? '' : 'w2'}">${s.def ? `<div class="defn f"><div class="lbl">${s.defLabel || '📖 PENGERTIAN'}</div><p>${s.def}</p></div>` : ''}
      ${s.points ? `<ul class="pts">${s.points.map((p, k) => `<li class="f"><span class="i" style="background:${grad(c[k % c.length])}">${p[0]}</span><span>${p[1]}</span></li>`).join('')}</ul>` : ''}
      ${s.key ? `<div class="key f">${s.key.map((k, j) => `<span style="border-color:${c[j % c.length]}">${k}</span>`).join('')}</div>` : ''}</div>
    ${s.anim ? `<div class="col">${animBox(s.anim, s.o, s.cap)}</div>` : s.e ? `<div class="col" style="flex:.6;display:grid;place-items:center;font-size:260px">${s.e}</div>` : ''}</div>`;
  case 'cards': { const n = s.cards.length, cols = s.cols || (n <= 2 ? 2 : n === 4 ? 4 : n === 5 ? 5 : 3);
    return `${kick(s, 'Macam-macam')}<h2>${s.title}</h2>${s.intro ? `<p class="muted" style="margin:-8px 0 18px">${s.intro}</p>` : ''}
    <p class="tapx">👆 Ketuk kartu untuk melihat detail</p><div class="cards c${cols}${n >= 7 ? ' many' : ''}">${s.cards.map((k, j) => `<div class="kc f ${k.more ? 'hasmore' : ''}" data-pi="${j}" style="background:${grad(k.c || c[j % c.length])}"><div class="e">${vis(k)}</div><h3>${k.n}</h3><p>${k.d}</p>${k.ex ? `<div class="ex">Contoh: ${k.ex}</div>` : ''}</div>`).join('')}</div>`; }
  case 'rumus': return `${kick(s, 'Rumus')}<h2>${s.title}</h2><div class="body">
    <div class="col w2"><div class="formula f"><div class="fx">${s.fx}</div>${s.alt ? `<div class="alt">${s.alt}</div>` : ''}</div>
      <div class="card f"><div class="vars">${s.vars.map(v => `<span class="s">${v[0]}</span><span>${v[1]}</span><span class="u">${v[2] || ''}</span>`).join('')}</div></div>
      ${s.note ? `<div class="cpbox f">💡 ${s.note}</div>` : ''}</div>
    <div class="col">${s.calc ? `<div class="card f calc" data-calc><b style="font-size:24px">🧮 Kalkulator coba-coba</b>${s.calc.in.map(x => `<div class="row"><label>${x[1]}</label><input type="number" step="any" data-k="${x[0]}" value="${x[2]}"><span style="width:60px">${x[3] || ''}</span></div>`).join('')}<div class="out">–</div></div>` : ''}
      ${s.anim ? animBox(s.anim, s.o, s.cap) : ''}</div></div>`;
  case 'anim': return `${kick(s, 'Animasi')}<h2>${s.title}</h2><div class="body"><div class="col w2" style="flex:1.7">${animBox(s.anim, s.o, s.cap)}</div>
    <div class="col">${(s.points || []).map((p, k) => `<div class="tp f"><span class="n" style="background:${grad(c[k % c.length])}">${p[0]}</span><p style="font-size:23px">${p[1]}</p></div>`).join('')}${s.text ? `<p class="f">${s.text}</p>` : ''}</div></div>`;
  case 'contoh': return `${kick(s, 'Contoh Soal')}<h2>${s.title || 'Ayo coba!'}</h2><div class="body"><div class="col w2">
    <div class="soal"><span class="tag">✍️ SOAL ${s.no || ''}</span><p>${s.q}</p></div>
    <div class="think">🤔 ${s.think || 'Coba kerjakan dulu bersama teman sebangku, lalu cek pembahasannya!'}</div>
    <button class="btnx" data-reveal>💡 Lihat Pembahasan</button>
    <div class="steps">${s.steps.map((t, k) => `<div class="step"><span class="n">${k+1}</span><span>${t}</span></div>`).join('')}</div>
    <div class="answer">✅ ${s.ans}</div></div>${s.anim ? `<div class="col">${animBox(s.anim, s.o, s.cap)}</div>` : ''}</div>`;
  case 'kuis': { const ord = shuf(s.opts.map((t, k) => k));
    return `${kick(s, 'Kuis Kilat')}<h2>${s.title || '❓ Ayo tebak!'}</h2><div class="soal" style="margin-bottom:22px"><p style="margin:0">${s.q}</p></div>
    <div class="qopts">${ord.map((k, j) => `<button class="qo" data-k="${k}"><b style="background:${grad(c[j])}">${'ABCD'[j]}</b><span>${s.opts[k]}</span></button>`).join('')}</div>
    <div class="qfb" style="margin-top:18px"></div><button class="btnx alt" data-show style="margin-top:14px">👀 Tunjukkan jawaban</button>`; }
  case 'ingat': return `${kick(s, 'Biar Gampang Ingat')}<h2>${s.title || '🧠 Jembatan Keledai'}</h2><div class="body" style="flex-direction:column">
    <div class="mnem f"><div class="w">${s.word}</div>${s.desc ? `<p>${s.desc}</p>` : ''}</div>
    ${s.letters ? `<div class="letters">${s.letters.map((l, k) => `<div class="letter f" style="background:${grad(c[k % c.length])}"><b>${l[0]}</b><span>${l[1]}</span></div>`).join('')}</div>` : ''}</div>`;
  case 'tabel': return `${kick(s, 'Perbandingan')}<h2>${s.title}</h2><table class="t f"><tr>${s.head.map(h => `<th>${h}</th>`).join('')}</tr>${s.rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>${s.note ? `<div class="cpbox f" style="margin-top:18px">💡 ${s.note}</div>` : ''}`;
  case 'penerapan': return `${kick(s, 'Penerapan dalam Kehidupan')}<h2>${s.title}</h2><div class="body"><div class="col ${s.anim ? 'w2' : ''}"><div class="apps">${s.apps.map((a, k) => `<div class="app f" data-pi="${k}"><span class="e" style="background:${grad(c[k % c.length])}">${a[0]}</span><div><h3>${a[1]}</h3><p>${a[2]}</p></div></div>`).join('')}</div></div>
    ${s.anim ? `<div class="col">${animBox(s.anim, s.o, s.cap)}</div>` : ''}</div>`;
  case 'mitos': return `${kick(s, 'Mitos atau Fakta?')}<h2>${s.title || '🕵️ Luruskan Miskonsepsi!'}</h2><p class="muted" style="margin:-8px 0 18px">Ketuk kartu untuk membuka faktanya.</p>
    <div class="cards c${Math.min(3, s.items.length)}">${s.items.map((m, k) => `<div class="kc f" data-flip style="cursor:pointer;background:${grad('#ef4444')}"><div class="e">❌</div><h3 style="font-size:26px">“${m[0]}”</h3><p class="fakta" style="display:none"><b>✅ FAKTA:</b> ${m[1]}</p><div class="ex hintf">Ketuk untuk melihat fakta</div></div>`).join('')}</div>`;
  case 'rangkuman': return `${kick(s, 'Rangkuman')}<h2>${s.title || '🗺️ Peta Konsep'}</h2><div class="mind" data-mind><svg></svg><div class="center">${s.center || MAT.nama}</div>
    ${s.br.map((b, k) => `<div class="br f" data-pi="${k}" style="background:${grad(c[k % c.length])}"><h3>${b[0]}</h3><ul>${b[1].map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`;
  case 'refleksi': return `${kick(s, 'Refleksi')}<h2>${s.title || '🪞 Apa yang sudah kamu pelajari?'}</h2><div class="refl">${s.items.map((r, k) => `<div class="card f" style="border-top:8px solid ${c[k % c.length]}"><div class="e">${r[0]}</div><p>${r[1]}</p></div>`).join('')}</div>
    <div class="ctaRow f" style="margin-top:34px"><button class="btnx alt" data-lab>🔬 Buka Lab 3D</button><button class="btnx" data-quiz>🎮 Main Kuis</button><button class="btnx alt" data-restart>🔁 Ulang dari awal</button></div>
    ${s.sumber ? `<p class="muted f" style="font-size:18px;margin-top:26px">📚 Sumber: ${s.sumber}</p>` : ''}`;
  }
  return `<h2>${s.title || ''}</h2>`;
}
function shuf(a){ for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- interaksi per slide ---------- */
function wire(s, el){
  if(s.t === 'cover'){ const m = el.querySelector('[data-menu]'), st = el.querySelector('[data-start]'); if(m) m.onclick = () => go(HUB, true); if(st) st.onclick = () => go(HUB + 1, true); }
  if(s.t === 'peta'){ $$('[data-go]', el).forEach(li => li.onclick = () => go(+li.dataset.go, true)); $$('[data-gosec]', el).forEach(b => b.onclick = () => goSec(b.dataset.gosec)); }
  if(s.t === 'cards') $$('.kc[data-pi]', el).forEach(k => k.onclick = () => { const c = s.cards[+k.dataset.pi]; popCard(c, c.c || PAL[+k.dataset.pi % PAL.length]); });
  if(s.t === 'penerapan') $$('.app[data-pi]', el).forEach(k => k.onclick = () => { const a = s.apps[+k.dataset.pi]; pop(a[0], a[1], a[2], '🌍 Penerapan IPA dalam kehidupan sehari-hari', PAL[+k.dataset.pi % PAL.length]); });
  if(s.t === 'rangkuman') $$('.br[data-pi]', el).forEach(k => k.onclick = () => { const b = s.br[+k.dataset.pi]; pop('🗺️', b[0], `<ul>${b[1].map(x => `<li>${x}</li>`).join('')}</ul>`, '', PAL[+k.dataset.pi % PAL.length]); });
  if(s.t === 'tabel') $$('table.t tr', el).forEach((tr, k) => { if(k) tr.onclick = () => tr.classList.toggle('hl'); });
  if(s.t === 'tujuan') $$('.tp', el).forEach(tp => tp.onclick = () => tp.classList.toggle('done'));
  const calc = el.querySelector('[data-calc]');
  if(calc){ const f = new Function(...s.calc.in.map(x => x[0]), 'return (' + (s.calc.f || s.calc.out[2]) + ');');
    const upd = () => { const v = s.calc.in.map(x => parseFloat(calc.querySelector(`[data-k="${x[0]}"]`).value)); let r; try { r = f(...v); } catch(e){ r = NaN; }
      if(s.calc.f){ calc.querySelector('.out').textContent = v.every(isFinite) ? r : '–'; return; }
      calc.querySelector('.out').textContent = `${s.calc.out[0]} = ${isFinite(r) ? (+r.toFixed(s.calc.out[3] ?? 2)).toLocaleString('id-ID') : '–'} ${s.calc.out[1] || ''}`; };
    calc.querySelectorAll('input').forEach(i => i.oninput = upd); upd(); }
  const rv = el.querySelector('[data-reveal]');
  if(rv){ rv.onclick = () => revealStep(el); }
  $$('.qo', el).forEach(b => b.onclick = () => answer(el, s, b));
  const sh = el.querySelector('[data-show]'); if(sh) sh.onclick = () => answer(el, s, el.querySelector(`.qo[data-k="${s.ans || 0}"]`), true);
  $$('[data-flip]', el).forEach(k => k.onclick = () => { const on = k.dataset.open !== '1'; k.dataset.open = on ? '1' : '0';
    k.style.background = grad(on ? '#16a34a' : '#ef4444'); k.querySelector('.e').textContent = on ? '✅' : '❌'; k.querySelector('.fakta').style.display = on ? '' : 'none'; k.querySelector('.hintf').style.display = on ? 'none' : ''; });
  const lb = el.querySelector('[data-lab]'); if(lb) lb.onclick = openLab;
  const qb = el.querySelector('[data-quiz]'); if(qb) qb.onclick = openQuiz;
  const rs = el.querySelector('[data-restart]'); if(rs) rs.onclick = () => go(0, true);
  $$('.animctl button', el).forEach(b => b.onclick = e => { e.stopPropagation(); const box = b.closest('.animbox'); box.querySelectorAll('.animctl button').forEach(x => x.classList.toggle('on', x === b)); const cv = box.querySelector('canvas'); cv._st = cv._st || {}; cv._st.mode = b.dataset.v; cv._st.t0 = performance.now(); });
}
function revealStep(el){ const steps = $$('.step', el), nx = steps.find(x => !x.classList.contains('in'));
  const btn = el.querySelector('[data-reveal]');
  if(nx){ nx.classList.add('in'); btn.textContent = steps.indexOf(nx) === steps.length - 1 ? '✅ Lihat Jawaban' : '➡️ Langkah berikutnya'; }
  else { el.querySelector('.answer').classList.add('in'); btn.disabled = true; btn.textContent = '🎉 Selesai!'; cheer(); } }
function answer(el, s, b, show){ if(el.dataset.done) return; el.dataset.done = '1'; const ok = +b.dataset.k === (s.ans || 0);
  $$('.qo', el).forEach(x => { if(+x.dataset.k === (s.ans || 0)) x.classList.add('ok'); else if(x === b && !show) x.classList.add('no'); });
  const fb = el.querySelector('.qfb'); fb.innerHTML = `<b>${show ? '👀 Jawaban:' : ok ? '🎉 Tepat sekali!' : '😅 Belum tepat.'}</b> ${s.exp || ''}`; fb.classList.add('on'); if(ok && !show) cheer(); }
function openLab(){ if(EMBED && parent !== window) parent.postMessage({type:'open-lab', id:ID, i:cur}, '*'); else { const u = '../' + (MAT.lab || `lab/lab.html?t=${ID}`); location.href = u + (u.includes('?') ? '&' : '?') + 'from=slide&sp=' + cur; } }
function openQuiz(){ if(EMBED && parent !== window) parent.postMessage({type:'open-quiz', id:ID}, '*'); else location.href = '../index.html'; }
$$on('#bLab').onclick = openLab;

/* konfeti kecil */
function cheer(){ const n = 40; for(let i = 0; i < n; i++){ const d = document.createElement('i'); const c = PAL[i % PAL.length];
  d.style.cssText = `position:fixed;left:50%;top:55%;width:12px;height:18px;background:${c};border-radius:3px;z-index:20;pointer-events:none;transition:transform 1.2s cubic-bezier(.2,.8,.3,1),opacity 1.2s`;
  document.body.appendChild(d); const a = Math.random()*Math.PI*2, r = 200 + Math.random()*380;
  requestAnimationFrame(() => { d.style.transform = `translate(${Math.cos(a)*r}px, ${Math.sin(a)*r - 120}px) rotate(${Math.random()*720}deg)`; d.style.opacity = 0; }); setTimeout(() => d.remove(), 1300); } }

/* ---------- navigasi ---------- */
function go(i, user, instant){
  i = Math.max(0, Math.min(S.length - 1, i)); const prev = cur, back = i < prev; const secChange = S[prev] && S[prev].sec !== S[i].sec && !instant;
  closePop(); playT = 0;
  const inc = S[i].el, out = S[prev] && prev !== i ? S[prev].el : null;
  if(secChange){ inc.style.transition = 'none'; inc.classList.remove('before'); inc.style.transform = 'translateZ(-1100px) rotateX(28deg) scale(.7)'; inc.style.opacity = 0; void inc.offsetWidth; inc.style.transition = ''; inc.style.transform = ''; inc.style.opacity = '';
    if(out){ out.classList.add('zoomout'); setTimeout(() => out.classList.remove('zoomout'), 900); } secBanner(S[i].sec); }
  cur = i;
  S.forEach((x, k) => { x.el.classList.toggle('on', k === i); x.el.classList.toggle('before', k < i); });
  const el = inc, fr = $$('.f', el);
  fr.forEach(f => f.style.transitionDelay = '');
  if(MODE === 'auto' || back || visited.has(i) || ['cover','tabel','peta'].includes(S[i].d.t)){
    fr.forEach((f, k) => { if(!f.classList.contains('in')){ f.style.transitionDelay = (instant ? 0 : .35 + k*.07) + 's'; f.classList.add('in'); } });
    setTimeout(() => fr.forEach(f => f.style.transitionDelay = ''), 2500); }
  visited.add(i); ls.set('slide_vis_' + ID, [...visited]);
  $$('#prog i').forEach((b, k) => { b.classList.toggle('done', k <= i); b.classList.toggle('cur', k === i); });
  $('#cnt').textContent = `${i + 1} / ${S.length}`; $('#bPrev').disabled = i === 0;
  const nx = S[i + 1], short = t => t.length > 26 ? t.slice(0, 25) + '…' : t;
  $('#bNext').innerHTML = !nx ? '🏠 Kembali ke menu' : `<span class="t">${short(ttl(nx.d))}</span> ▶`; $('#bNext').title = nx ? 'Berikutnya: ' + ttl(nx.d) : 'Kembali ke menu';
  $('#bPrev').title = i ? 'Sebelumnya: ' + ttl(S[i - 1].d) : '';
  updSecs(); updToc(); updHub();
  history.replaceState(null, '', '#' + (i + 1)); ls.set('slide_pos_' + ID, i);
  if(S[i].d.t === 'rangkuman') setTimeout(() => layoutMind(el), 60);
  el.querySelectorAll('canvas.anim').forEach(sizeCanvas);
  if(reading) readSlide();
  try{ if(EMBED) parent.postMessage({type:'slide-pos', id:ID, i, n:S.length}, '*'); }catch(e){}
}
function next(){ const el = S[cur].el, f = $$('.f', el).find(x => !x.classList.contains('in'));
  if(f && MODE === 'manual'){ f.classList.add('in'); if(S[cur].d.t === 'rangkuman') layoutMind(el); return; }
  if(cur < S.length - 1) go(cur + 1, true); else go(HUB, true); }
function prev(){ if(cur > 0) go(cur - 1, true); }
function goSec(id){ const k = S.findIndex(x => x.sec === id && x.d.t !== 'peta'); if(k >= 0) go(k, true); }
function updSecs(){ $$('#secs [data-sec]').forEach(b => { const id = b.dataset.sec, idx = S.map((x, k) => x.sec === id ? k : -1).filter(k => k >= 0);
  b.classList.toggle('on', S[cur].sec === id); const v = idx.filter(k => visited.has(k)).length; b.querySelector('.pp i').style.width = (idx.length ? v/idx.length*100 : 0) + '%'; b.classList.toggle('done', v === idx.length); }); }
function updHub(){ const h = S[HUB]; if(!h) return; $$('[data-go]', h.el).forEach(li => li.classList.toggle('vis', visited.has(+li.dataset.go))); }
function secBanner(id){ const x = SECS.find(z => z.id === id), b = $('#secfx'); b.querySelector('.e').textContent = x.icon; b.querySelector('b').textContent = x.name; b.querySelector('small').textContent = x.id.length === 1 ? 'Sub bab ' + x.id : x.sub;
  b.style.setProperty('--c', x.color); b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); clearTimeout(secBanner.t); secBanner.t = setTimeout(() => b.classList.remove('on'), 1400); }
function buildToc(){ const html = SECS.map(x => `<div class="tsec" style="--c:${x.color}"><div class="tsh"><span>${x.icon}</span><b>${x.name}</b></div>
    ${S.map((o, k) => o.sec === x.id ? `<button class="ti" data-i="${k}"><span class="n">${k + 1}</span><span class="e">${o.d.e || EMO[o.d.t] || '📄'}</span><span class="tt">${ttl(o.d)}</span><i>✅</i></button>` : '').join('')}</div>`).join('');
  $('#tocList').innerHTML = html; $('#sideList').innerHTML = `<div class="sideh"><img src="../assets/logo.svg" alt=""><div><small>Bab ${MAT.bab || ''} · Kelas ${MAT.kelas || ''}</small><b>${MAT.nama || ''}</b></div></div><button class="ti home" data-i="${HUB}"><span class="e">🏠</span><span class="tt">Menu Materi</span></button>` + html;
  $$('#tocList .ti, #sideList .ti').forEach(b => b.onclick = () => { go(+b.dataset.i, true); toc(false); }); }
function updToc(){ $$('#tocList .ti, #sideList .ti').forEach(b => { const k = +b.dataset.i; b.classList.toggle('cur', k === cur); b.classList.toggle('vis', visited.has(k)); }); }
function toc(on){ $('#toc').classList.toggle('on', on ?? !$('#toc').classList.contains('on')); if($('#toc').classList.contains('on')){ const c = $('#tocList .ti.cur'); if(c) c.scrollIntoView({block:'center'}); } }
function setMode(m, silent){ MODE = 'auto'; $$('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  if(m === 'auto' && S[cur]) $$('.f', S[cur].el).forEach((f, k) => { if(!f.classList.contains('in')){ f.style.transitionDelay = k*.06 + 's'; f.classList.add('in'); } });
  if(!silent && window.uiNotify) uiNotify(m === 'auto' ? 'Mode Otomatis: sekali klik, seluruh isi slide tampil' : 'Mode Manual: isi slide muncul satu per satu', {icon:m === 'auto' ? '⚡' : '👆'}); }
function togglePlay(on){ PLAY = false; }
const DUR = {cover:6, peta:7, tujuan:10, konsep:12, cards:12, tabel:12, anim:14, rumus:12, ingat:9, mitos:12, contoh:14, penerapan:12, kuis:10, rangkuman:12, refleksi:12};
function playTick(dt){ if(!PLAY || !$('#bPlay')) return; const x = S[cur], d = DUR[x.d.t] || 10; playT += dt; $('#bPlay').style.setProperty('--p', Math.min(1, playT/d));
  if(x.d.t === 'contoh'){ const steps = $$('.step', x.el).length + 1, k = Math.floor((playT - 2)/((d - 3)/steps)); const done = $$('.step.in', x.el).length + ($('.answer.in', x.el) ? 1 : 0); if(k >= done && done < steps) revealStep(x.el); }
  if(x.d.t === 'kuis' && playT > d*.65 && !x.el.dataset.done){ const b = x.el.querySelector('[data-show]'); if(b) b.click(); }
  if(x.d.t === 'mitos' && playT > d*.5 && !x.el.dataset.fl){ x.el.dataset.fl = 1; $$('[data-flip]', x.el).forEach((k, j) => setTimeout(() => { if(k.dataset.open !== '1') k.click(); }, j*500)); }
  if(playT >= d) next(); }
/* popup kartu (3D) */
function pop(e, title, body, extra, color){ const lb = $('#lb'), c = lb.querySelector('.lbc'); c.style.setProperty('--c', color || 'var(--a)');
  c.innerHTML = `<button class="lbx" data-lbx>✕</button><div class="lbe">${e}</div><h3>${title}</h3><div class="lbb">${body}</div>${extra ? `<div class="lbex">${extra}</div>` : ''}
    <div class="lbbt"><button class="btnx alt" data-say>🔊 Bacakan</button><button class="btnx" data-lbx>👍 Mengerti</button></div>`;
  c.querySelector('[data-say]').onclick = () => { try{ speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(strip(title + '. ' + body + '. ' + (extra || ''))); u.lang = 'id-ID'; speechSynthesis.speak(u); }catch(err){} };
  lb.classList.remove('on'); void lb.offsetWidth; lb.classList.add('on'); }
function popCard(c, color){ const more = c.more ? `<div class="lbm">${c.more.map(r => `<div class="lbr"><b>${r[0]}</b><span>${r[1]}</span></div>`).join('')}</div>` : '';
  pop(vis(c, true), c.n, `<p>${c.d}</p>${more}`, c.ex ? `💡 Contoh: ${c.ex}` : '', color); }
function closePop(){ const lb = $('#lb'); if(lb) lb.classList.remove('on'); }
$$on('#bNext').onclick = next; $('#bPrev').onclick = prev;
$$on('#bToc').onclick = () => toc(); $('#tocX').onclick = () => toc(false); $('#toc').addEventListener('click', e => { if(e.target.id === 'toc') toc(false); });
$$on('#bHub').onclick = () => go(HUB, true);
$$on('#bMenu').onclick = () => go(HUB, true);
$$on('#bFs').onclick = () => { try{ document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }catch(e){} };
addEventListener('keydown', e => {
  if(e.target.tagName === 'INPUT' || document.querySelector('.uid-ov')) return;
  const k = e.key;
  if(k === 'Escape'){ if($('#lb').classList.contains('on')) closePop(); else toc(false); return; }
  if($('#lb').classList.contains('on') && (k === 'Enter' || k === ' ')){ e.preventDefault(); closePop(); return; }
  if(k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter'){ e.preventDefault(); next(); }
  else if(k === 'ArrowLeft' || k === 'PageUp'){ e.preventDefault(); prev(); }
  else if(k === 'Home') go(0, true); else if(k === 'End') go(S.length - 1, true);
  else if(k === 'g' || k === 'G') toc();
  else if(k === 'h' || k === 'H') go(HUB, true);
  else if(k >= '1' && k <= '9' && SECS[+k - 1]) goSec(SECS[+k - 1].id);
  else if(k === 'f' || k === 'F') $('#bFs').click();
  else if(k === 'b' || k === 'B') $('#bRead').click();
  else if(k === 'p' || k === 'P'){ const el = S[cur].el; if(el.querySelector('[data-reveal]:not([disabled])')) revealStep(el); }
});
let sw = null;
$('#viewport').addEventListener('pointerdown', e => { if(e.pointerType !== 'mouse') sw = {x:e.clientX, y:e.clientY}; });
$('#viewport').addEventListener('pointerup', e => { if(!sw) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y; if(Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)*1.5) dx < 0 ? next() : prev(); sw = null; });

/* bacakan (TTS) */
let reading = false;
function readSlide(){ try{ speechSynthesis.cancel(); const el = S[cur].el;
  const txt = $$('h1,h2,.sub,.defn p,.pts li,.kc h3,.kc p,.tp p,.pemantik p,.soal p,.mnem .w,.mnem p,.app h3,.app p,.qo span', el).map(x => x.textContent.trim()).filter(Boolean).join('. ');
  const u = new SpeechSynthesisUtterance(txt.replace(/[→←↔]/g, ', ')); u.lang = 'id-ID'; u.rate = .98;
  const v = speechSynthesis.getVoices().find(v => /id(-|_)ID/i.test(v.lang)); if(v) u.voice = v; speechSynthesis.speak(u); }catch(e){} }
$$on('#bRead').onclick = () => { reading = !reading; $('#bRead').classList.toggle('on', reading); if(reading) readSlide(); else try{ speechSynthesis.cancel(); }catch(e){} };

/* peta konsep */
function layoutMind(el){ const m = el.querySelector('[data-mind]'); if(!m) return; const W = m.offsetWidth, H = m.offsetHeight, br = $$('.br', m), n = br.length;
  const svg = m.querySelector('svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); let paths = '';
  br.forEach((b, k) => { const a = -Math.PI/2 + (k + .5)/n*Math.PI*2 - Math.PI/n*.5*(n % 2 ? 0 : 1), x = W/2 + Math.cos(a)*W*.36, y = H/2 + Math.sin(a)*H*.36;
    const bw = b.offsetWidth, bh = b.offsetHeight; b.style.left = Math.max(0, Math.min(W - bw, x - bw/2)) + 'px'; b.style.top = Math.max(0, Math.min(H - bh, y - bh/2)) + 'px';
    const col = getComputedStyle(b).backgroundImage.match(/rgb\([^)]+\)|#[0-9a-f]{6}/i); const sc = b.classList.contains('in') ? 1 : 0;
    paths += `<path d="M${W/2},${H/2} Q${(W/2 + x)/2 + (y - H/2)*.15},${(H/2 + y)/2 - (x - W/2)*.15} ${x},${y}" stroke="${col ? col[0] : '#fff'}" stroke-width="8" fill="none" stroke-linecap="round" opacity="${.25 + sc*.6}" stroke-dasharray="${sc ? 'none' : '6 14'}"/>`; });
  svg.innerHTML = paths; }

/* ---------- animasi kanvas ---------- */
function sizeCanvas(cv){ const w = cv.offsetWidth, h = cv.offsetHeight; if(!w || !h) return; const k = Math.min(2.5, Math.max(1, scale)*(devicePixelRatio || 1));
  if(cv.width !== Math.round(w*k) || cv.height !== Math.round(h*k)){ cv.width = Math.round(w*k); cv.height = Math.round(h*k); } cv._k = k; cv._w = w; cv._h = h; }
let last = performance.now();
function loop(now){ const dt = Math.min(.05, Math.max(0, (now - last)/1000)); last = now; if(S.length) playTick(dt);
  const el = S[cur] && S[cur].el;
  if(el && window.ANIMS) el.querySelectorAll('canvas.anim').forEach(cv => { const A = ANIMS[cv.dataset.anim]; if(!A) return; if(!cv._k) sizeCanvas(cv); if(!cv._w) return;
    const g = cv.getContext('2d'); g.setTransform(cv._k, 0, 0, cv._k, 0, 0); g.clearRect(0, 0, cv._w, cv._h);
    cv._st = cv._st || {}; if(cv._st.mode === undefined && A.ctl) cv._st.mode = A.ctl[0][0]; cv._st.t = (cv._st.t || 0) + dt;
    const o = cv._o || (cv._o = JSON.parse(cv.dataset.o || '{}')); o.dark = document.documentElement.dataset.theme !== 'light';
    if(window.AH) AH.fs = Math.max(.72, Math.min(1.3, cv._w/760));
    try{ (A.draw || A)(g, cv._w, cv._h, cv._st.t, cv._st, o, dt); }catch(err){ if(!cv._err){ cv._err = 1; console.warn(cv.dataset.anim, err); } } });
  requestAnimationFrame(loop); }
window.SLIDE = {go, next, prev, goSec, setMode, togglePlay, get cur(){ return cur; }, get n(){ return S.length; }};
})();
