/* Lab Petualang — mesin slide pemaparan materi
   Data: window.SLIDE_DATA[id] = {color:[a,b], slides:[{t:'cover'|'tujuan'|'konsep'|'cards'|'rumus'|'anim'|'contoh'|'kuis'|'ingat'|'tabel'|'penerapan'|'mitos'|'rangkuman'|'refleksi', ...}]} */
(function(){
"use strict";
const $ = s => document.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const P = new URLSearchParams(location.search);
const ID = P.get('t') || 'wujud-zat';
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
$('#bTheme').onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(t); ls.set('lab_theme', t); };
addEventListener('message', e => { if(e.data && e.data.type === 'lab-theme' && e.data.theme) applyTheme(e.data.theme); });

/* muat data */
const sc = document.createElement('script'); sc.src = `data/${ID}.js`; sc.onload = init; sc.onerror = () => { $('#loading').textContent = 'Slide materi ini belum tersedia.'; }; document.head.appendChild(sc);

let D, S = [], cur = 0, scale = 1;
function init(){
  D = (window.SLIDE_DATA || {})[ID]; if(!D){ $('#loading').textContent = 'Slide materi ini belum tersedia.'; return; }
  document.title = `${MAT.nama || D.title || ID} — Slide Materi`;
  if(D.color){ document.documentElement.style.setProperty('--a', D.color[0]); document.documentElement.style.setProperty('--b', D.color[1]); }
  const stage = $('#stage');
  D.slides.forEach((s, i) => { const el = document.createElement('section'); el.className = 'slide ' + s.t; el.innerHTML = render(s, i); stage.appendChild(el); S.push({d:s, el}); wire(s, el); });
  $('#prog').innerHTML = S.map((_, i) => `<i data-i="${i}" title="Slide ${i+1}"></i>`).join('');
  $$('#prog i').forEach(b => b.onclick = () => go(+b.dataset.i, true));
  $('#gridIn').innerHTML = S.map((s, i) => `<div class="gt" data-i="${i}"><small>${i+1} · ${TYPE[s.d.t] || ''}</small><span class="e">${s.d.e || EMO[s.d.t] || '📄'}</span><b>${strip(s.d.title || s.d.q || MAT.nama || '')}</b></div>`).join('');
  $$('.gt').forEach(b => b.onclick = () => { go(+b.dataset.i, true); $('#grid').classList.remove('on'); });
  fit(); addEventListener('resize', fit);
  const h = parseInt(location.hash.slice(1)); go(isNaN(h) ? 0 : h - 1, false, true);
  setTimeout(() => { const l = $('#loading'); l.style.opacity = 0; setTimeout(() => l.remove(), 400); }, 150);
  requestAnimationFrame(loop);
}
const TYPE = {cover:'SAMPUL', tujuan:'TUJUAN', konsep:'KONSEP', cards:'MACAM', rumus:'RUMUS', anim:'ANIMASI', contoh:'CONTOH SOAL', kuis:'KUIS', ingat:'INGAT', tabel:'TABEL', penerapan:'PENERAPAN', mitos:'MITOS/FAKTA', rangkuman:'RANGKUMAN', refleksi:'REFLEKSI'};
const EMO = {cover:'🎬', tujuan:'🎯', konsep:'💡', cards:'🧩', rumus:'🧮', anim:'🎞️', contoh:'✍️', kuis:'❓', ingat:'🧠', tabel:'📋', penerapan:'🌍', mitos:'🕵️', rangkuman:'🗺️', refleksi:'🪞'};
const strip = h => String(h).replace(/<[^>]+>/g, '');
function fit(){ const vw = innerWidth, vh = innerHeight - 64; scale = Math.min(vw/1600, vh/900); $('#stage').style.transform = `translate(-50%,-50%) scale(${scale})`; S.forEach(s => s.el.querySelectorAll('canvas.anim').forEach(sizeCanvas)); }

/* ---------- render ---------- */
const kick = (s, def) => `<div class="kick">${s.kick || def}</div>`;
const animBox = (name, o, cap, extra = '') => { const A = window.ANIMS && ANIMS[name]; const ctl = A && A.ctl ? `<div class="animctl">${A.ctl.map((c, k) => `<button data-v="${c[0]}" class="${k === 0 ? 'on' : ''}">${c[1]}</button>`).join('')}</div>` : '';
  return `<div class="animbox ${extra}"><canvas class="anim" data-anim="${name}" data-o='${JSON.stringify(o || {}).replace(/'/g, '&#39;')}'></canvas>${ctl}${cap ? `<div class="cap">${cap}</div>` : ''}</div>`; };
function render(s, i){
  const c = PAL;
  switch(s.t){
  case 'cover': return `${s.anim ? `<canvas class="anim" data-anim="${s.anim}" data-o='${JSON.stringify(s.o || {})}'></canvas>` : `<div class="big-emo">${s.e || MAT.icon || '🔬'}</div>`}
    <div class="kick">IPA KELAS ${MAT.kelas || ''} · SMPN 4 MAGELANG</div><h1>${s.title}</h1><div class="sub">${s.sub || ''}</div>
    <div class="chips">${(s.chips || []).map((x, k) => `<span class="chip" style="border-color:${c[k % c.length]}">${x}</span>`).join('')}</div>
    <div class="muted" style="margin-top:34px;font-weight:800;font-size:22px">👩‍🏫 Nella Alfiani Rofiqoh, S.Pd · Tekan ▶ atau → untuk mulai</div>`;
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
    <div class="cards c${cols}">${s.cards.map((k, j) => `<div class="kc f" style="background:${grad(k.c || c[j % c.length])}"><div class="e">${k.e}</div><h3>${k.n}</h3><p>${k.d}</p>${k.ex ? `<div class="ex">Contoh: ${k.ex}</div>` : ''}</div>`).join('')}</div>`; }
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
  case 'penerapan': return `${kick(s, 'Penerapan dalam Kehidupan')}<h2>${s.title}</h2><div class="body"><div class="col ${s.anim ? 'w2' : ''}"><div class="apps">${s.apps.map((a, k) => `<div class="app f"><span class="e" style="background:${grad(c[k % c.length])}">${a[0]}</span><div><h3>${a[1]}</h3><p>${a[2]}</p></div></div>`).join('')}</div></div>
    ${s.anim ? `<div class="col">${animBox(s.anim, s.o, s.cap)}</div>` : ''}</div>`;
  case 'mitos': return `${kick(s, 'Mitos atau Fakta?')}<h2>${s.title || '🕵️ Luruskan Miskonsepsi!'}</h2><p class="muted" style="margin:-8px 0 18px">Ketuk kartu untuk membuka faktanya.</p>
    <div class="cards c${Math.min(3, s.items.length)}">${s.items.map((m, k) => `<div class="kc f" data-flip style="cursor:pointer;background:${grad('#ef4444')}"><div class="e">❌</div><h3 style="font-size:26px">“${m[0]}”</h3><p class="fakta" style="display:none"><b>✅ FAKTA:</b> ${m[1]}</p><div class="ex hintf">Ketuk untuk melihat fakta</div></div>`).join('')}</div>`;
  case 'rangkuman': return `${kick(s, 'Rangkuman')}<h2>${s.title || '🗺️ Peta Konsep'}</h2><div class="mind" data-mind><svg></svg><div class="center">${s.center || MAT.nama}</div>
    ${s.br.map((b, k) => `<div class="br f" style="background:${grad(c[k % c.length])}"><h3>${b[0]}</h3><ul>${b[1].map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`;
  case 'refleksi': return `${kick(s, 'Refleksi')}<h2>${s.title || '🪞 Apa yang sudah kamu pelajari?'}</h2><div class="refl">${s.items.map((r, k) => `<div class="card f" style="border-top:8px solid ${c[k % c.length]}"><div class="e">${r[0]}</div><p>${r[1]}</p></div>`).join('')}</div>
    <div class="ctaRow f" style="margin-top:34px"><button class="btnx alt" data-lab>🔬 Buka Lab 3D</button><button class="btnx" data-quiz>🎮 Main Kuis</button><button class="btnx alt" data-restart>🔁 Ulang dari awal</button></div>
    ${s.sumber ? `<p class="muted f" style="font-size:18px;margin-top:26px">📚 Sumber: ${s.sumber}</p>` : ''}`;
  }
  return `<h2>${s.title || ''}</h2>`;
}
function shuf(a){ for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- interaksi per slide ---------- */
function wire(s, el){
  const calc = el.querySelector('[data-calc]');
  if(calc){ const f = new Function(...s.calc.in.map(x => x[0]), 'return (' + s.calc.out[2] + ');');
    const upd = () => { const v = s.calc.in.map(x => parseFloat(calc.querySelector(`[data-k="${x[0]}"]`).value)); let r = f(...v);
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
function openLab(){ if(EMBED && parent !== window) parent.postMessage({type:'open-lab', id:ID}, '*'); else location.href = '../' + (MAT.lab || `lab/lab.html?t=${ID}`); }
function openQuiz(){ if(EMBED && parent !== window) parent.postMessage({type:'open-quiz', id:ID}, '*'); else location.href = '../index.html'; }
$('#bLab').onclick = openLab;

/* konfeti kecil */
function cheer(){ const n = 40; for(let i = 0; i < n; i++){ const d = document.createElement('i'); const c = PAL[i % PAL.length];
  d.style.cssText = `position:fixed;left:50%;top:55%;width:12px;height:18px;background:${c};border-radius:3px;z-index:20;pointer-events:none;transition:transform 1.2s cubic-bezier(.2,.8,.3,1),opacity 1.2s`;
  document.body.appendChild(d); const a = Math.random()*Math.PI*2, r = 200 + Math.random()*380;
  requestAnimationFrame(() => { d.style.transform = `translate(${Math.cos(a)*r}px, ${Math.sin(a)*r - 120}px) rotate(${Math.random()*720}deg)`; d.style.opacity = 0; }); setTimeout(() => d.remove(), 1300); } }

/* ---------- navigasi ---------- */
function go(i, user, instant){
  i = Math.max(0, Math.min(S.length - 1, i)); const prev = cur; cur = i;
  S.forEach((s, k) => { s.el.classList.toggle('on', k === i); s.el.classList.toggle('prev', k < i); });
  const el = S[i].el; if(i < prev && !instant) $$('.f', el).forEach(f => f.classList.add('in'));
  else if(S[i].d.t === 'cover' || S[i].d.t === 'tabel') $$('.f', el).forEach(f => f.classList.add('in'));
  $$('#prog i').forEach((b, k) => b.classList.toggle('done', k <= i));
  $('#cnt').textContent = `${i + 1} / ${S.length}`; $('#bPrev').disabled = i === 0;
  $('#bNext').textContent = i === S.length - 1 ? 'Selesai ✓' : 'Berikutnya ▶';
  $$('.gt').forEach((g, k) => g.classList.toggle('cur', k === i));
  history.replaceState(null, '', '#' + (i + 1)); ls.set('slide_pos_' + ID, i);
  if(S[i].d.t === 'rangkuman') setTimeout(() => layoutMind(el), 30);
  el.querySelectorAll('canvas.anim').forEach(sizeCanvas);
  if(reading) readSlide();
  try{ if(EMBED) parent.postMessage({type:'slide-pos', id:ID, i, n:S.length}, '*'); }catch(e){}
}
function next(){ const el = S[cur].el, f = $$('.f', el).find(x => !x.classList.contains('in'));
  if(f){ f.classList.add('in'); if(S[cur].d.t === 'rangkuman') layoutMind(el); return; }
  if(cur < S.length - 1) go(cur + 1, true); }
function prev(){ if(cur > 0) go(cur - 1, true); }
$('#bNext').onclick = next; $('#bPrev').onclick = prev;
$('#bGrid').onclick = () => $('#grid').classList.toggle('on');
$('#bFs').onclick = () => { try{ document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }catch(e){} };
addEventListener('keydown', e => {
  if(e.target.tagName === 'INPUT') return;
  const k = e.key;
  if(k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter'){ e.preventDefault(); next(); }
  else if(k === 'ArrowLeft' || k === 'PageUp'){ e.preventDefault(); prev(); }
  else if(k === 'Home') go(0, true); else if(k === 'End') go(S.length - 1, true);
  else if(k === 'g' || k === 'G') $('#grid').classList.toggle('on');
  else if(k === 'f' || k === 'F') $('#bFs').click();
  else if(k === 'b' || k === 'B') $('#bRead').click();
  else if(k === 'p' || k === 'P'){ const el = S[cur].el; if(el.querySelector('[data-reveal]:not([disabled])')) revealStep(el); }
  else if(k === 'Escape') $('#grid').classList.remove('on');
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
$('#bRead').onclick = () => { reading = !reading; $('#bRead').classList.toggle('on', reading); if(reading) readSlide(); else try{ speechSynthesis.cancel(); }catch(e){} };

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
function loop(now){ const dt = Math.min(.05, Math.max(0, (now - last)/1000)); last = now;
  const el = S[cur] && S[cur].el;
  if(el && window.ANIMS) el.querySelectorAll('canvas.anim').forEach(cv => { const A = ANIMS[cv.dataset.anim]; if(!A) return; if(!cv._k) sizeCanvas(cv); if(!cv._w) return;
    const g = cv.getContext('2d'); g.setTransform(cv._k, 0, 0, cv._k, 0, 0); g.clearRect(0, 0, cv._w, cv._h);
    cv._st = cv._st || {}; if(cv._st.mode === undefined && A.ctl) cv._st.mode = A.ctl[0][0]; cv._st.t = (cv._st.t || 0) + dt;
    const o = cv._o || (cv._o = JSON.parse(cv.dataset.o || '{}')); o.dark = document.documentElement.dataset.theme !== 'light';
    if(window.AH) AH.fs = Math.max(.72, Math.min(1.3, cv._w/760));
    try{ (A.draw || A)(g, cv._w, cv._h, cv._st.t, cv._st, o, dt); }catch(err){ if(!cv._err){ cv._err = 1; console.warn(cv.dataset.anim, err); } } });
  requestAnimationFrame(loop); }
window.SLIDE = {go, next, prev};
})();
