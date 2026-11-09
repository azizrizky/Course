/* Lab Petualang — modul bersama untuk semua Lab Virtual 3D
   - tema terang/gelap (sinkron dengan dasbor), mode tersemat (embed), kualitas grafis (hemat/standar/HD)
   - narator "Bu Nella" (rekaman suara lokal / online dari GitHub / suara otomatis) */
(function(){
  "use strict";
  const P = new URLSearchParams(location.search);
  const ls = { get(k,d){ try{ const v = localStorage.getItem(k); return v==null ? d : v; }catch(e){ return d; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };
  const prefersDark = (() => { try{ return matchMedia('(prefers-color-scheme: dark)').matches; }catch(e){ return true; } })();
  let theme = P.get('theme') || ls.get('lab_theme','auto'); if(theme === 'auto') theme = prefersDark ? 'dark' : 'light';
  const quality = P.get('q') || ls.get('lab_quality','hd');
  const embed = P.get('embed') === '1' || window.self !== window.top;
  const dpr = window.devicePixelRatio || 1;
  const LAB = window.LAB = {
    theme, quality, embed,
    texBase: (document.currentScript && document.currentScript.src) ? new URL('tex/', document.currentScript.src).href : '../assets/tex/',
    assetBase: (document.currentScript && document.currentScript.src) ? new URL('./', document.currentScript.src).href : '../assets/',
    pixelRatio(){ return quality === 'hd' ? Math.min(Math.max(dpr, 1.5), 2.5) : quality === 'hemat' ? 1 : Math.min(dpr, 1.5); },
    shadow: quality === 'hd' ? 4096 : quality === 'hemat' ? 1024 : 2048,
    hd: quality === 'hd', lite: quality === 'hemat'
  };
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.quality = quality;
  if(embed) document.documentElement.classList.add('lab-embed');
  // font seragam
  const f = document.createElement('link'); f.rel = 'stylesheet';
  f.href = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap';
  document.head.appendChild(f);
  // pesan dari dasbor
  addEventListener('message', e => {
    const d = e.data || {};
    if(d.type === 'lab-theme'){ document.documentElement.dataset.theme = LAB.theme = d.theme; ls.set('lab_theme', d.theme); }
    if(d.type === 'lab-fullscreen'){ try{ document.documentElement.requestFullscreen(); }catch(_){} }
  });
  // deteksi grafis tersendat → beri tahu dasbor
  (function(){ let n = 0, t0 = performance.now(), slow = 0;
    function tick(now){ n++; if(now - t0 > 2500){ const fps = n*1000/(now - t0); slow = fps < 26 ? slow + 1 : 0; n = 0; t0 = now;
        if(slow === 2 && quality !== 'hemat'){ try{ parent.postMessage({type:'lab-slow', fps:Math.round(fps)}, '*'); }catch(_){} } }
      requestAnimationFrame(tick); }
    requestAnimationFrame(tick); })();

  /* ---------------- Narator Bu Nella ---------------- */
  const idb = (() => { let p = null; return () => p || (p = new Promise((res, rej) => { try{ const r = indexedDB.open('nellaVoice', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('clips'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }catch(e){ rej(e); } })); })();
  async function getClip(k){ try{ const db = await idb(); return await new Promise(res => { const rq = db.transaction('clips').objectStore('clips').get(k); rq.onsuccess = () => res(rq.result || null); rq.onerror = () => res(null); }); }catch(e){ return null; } }
  let voices = [];
  function loadVoices(){ try{ voices = speechSynthesis.getVoices().filter(v => /^id|ind/i.test(v.lang) || /indonesia/i.test(v.name)); }catch(e){} }
  if('speechSynthesis' in window){ loadVoices(); speechSynthesis.addEventListener('voiceschanged', loadVoices); }
  const vScore = v => (/natural|online/i.test(v.name)?40:0) + (/gadis/i.test(v.name)?30:0) + (/google/i.test(v.name)?25:0) + (/female|wanita|damayanti/i.test(v.name)?10:0);
  function pickVoice(){ const pref = ls.get('nellaVoiceName',''); return voices.find(v => v.name === pref) || voices.slice().sort((a,b) => vScore(b) - vScore(a))[0] || null; }
  let audio = null, manifest = null;
  async function onlineClip(sim, k){
    if(manifest === null){ manifest = {}; try{ const r = await fetch(new URL(`../voice/${sim}/index.json`, location.href), {cache:'no-cache'}); if(r.ok) manifest = (await r.json()).clips || {}; }catch(e){} }
    return manifest[k] ? new URL(`../voice/${sim}/${manifest[k]}`, location.href).href : null;
  }
  function stop(){ try{ speechSynthesis.cancel(); }catch(e){} if(audio){ audio.pause(); audio = null; } setTalk(false); }
  let guideEl = null, talkT = 0;
  function setTalk(on){ if(guideEl) guideEl.classList.toggle('talk', !!on); }
  async function speak(sim, key, text){
    stop(); setTalk(true);
    const blob = await getClip(key); let url = blob ? URL.createObjectURL(blob) : await onlineClip(sim, key);
    if(url){ audio = new Audio(url); audio.onended = () => setTalk(false); audio.play().catch(() => setTalk(false)); return; }
    if(!('speechSynthesis' in window)){ setTalk(false); return; }
    const v = pickVoice(); const parts = text.replace(/\s+/g,' ').match(/[^.!?]+[.!?]*/g) || [text];
    parts.forEach((s, i) => { const u = new SpeechSynthesisUtterance(s.trim()); u.lang = v ? v.lang : 'id-ID'; if(v) u.voice = v; u.rate = .98; u.pitch = 1.08;
      if(i === parts.length - 1) u.onend = () => setTalk(false); speechSynthesis.speak(u); });
    clearTimeout(talkT); talkT = setTimeout(() => setTalk(false), Math.min(30000, text.length*80));
  }
  LAB.guide = {
    sim: null, auto: ls.get('lab_autonarasi','0') === '1', mode: ls.get('lab_guide_mode','hide'), txt: ls.get('lab_guide_mode','hide') === 'text', cur: null,
    init(sim, greetKey, greetText){
      this.sim = sim;
      const el = guideEl = document.createElement('div'); el.id = 'labGuide';
      el.innerHTML = `<div class="lg-col"><div class="lg-tools"><button class="lg-sound" type="button"></button><button class="lg-txtb" type="button"></button></div>
        <button class="lg-ava" title="Bu Nella — ketuk untuk mendengarkan"><img src="${LAB.assetBase}nella/avatar.jpg" alt="Bu Nella"><i>🔊</i></button></div>
        <div class="lg-card"><div class="lg-h"><b>Bu Nella</b><span class="lg-sp"></span><button class="lg-x" title="Sembunyikan teks">✕</button></div>
        <p class="lg-t"></p><div class="lg-b"><button class="lg-play">▶ Dengarkan</button><button class="lg-stop">⏹</button></div></div>`;
      document.body.appendChild(el);
      const upd = () => { const sb = el.querySelector('.lg-sound'), tb = el.querySelector('.lg-txtb');
        sb.textContent = this.auto ? '🔊' : '🔇'; sb.classList.toggle('on', this.auto); sb.title = this.auto ? 'Narasi suara: NYALA (ketuk untuk mematikan)' : 'Narasi suara: MATI (ketuk untuk menyalakan)';
        tb.textContent = this.txt ? '💬' : '🗨️'; tb.classList.toggle('on', this.txt); tb.title = this.txt ? 'Teks narasi: tampil (ketuk untuk menyembunyikan)' : 'Teks narasi: tersembunyi (ketuk untuk menampilkan)';
        el.classList.toggle('notext', !this.txt); };
      el.querySelector('.lg-sound').onclick = () => { this.auto = !this.auto; ls.set('lab_autonarasi', this.auto ? '1' : '0'); upd();
        if(this.auto && this.cur) speak(this.sim, this.cur.key, this.cur.text); else stop(); };
      el.querySelector('.lg-txtb').onclick = () => { this.txt = !this.txt; this.mode = this.txt ? 'text' : 'avatar'; ls.set('lab_guide_mode', this.mode); upd(); if(this.txt && this.cur) el.classList.add('open'); else el.classList.remove('open'); };
      el.querySelector('.lg-ava').onclick = () => { if(this.txt) el.classList.toggle('open'); if(this.cur) speak(this.sim, this.cur.key, this.cur.text); };
      el.querySelector('.lg-x').onclick = () => { el.classList.remove('open'); };
      el.querySelector('.lg-play').onclick = () => this.cur && speak(this.sim, this.cur.key, this.cur.text);
      el.querySelector('.lg-stop').onclick = stop;
      // tombol kecil untuk memunculkan Bu Nella bila disembunyikan
      const peek = document.createElement('button'); peek.id = 'labGuidePeek'; peek.type = 'button'; peek.title = 'Tampilkan Bu Nella (narasi)'; peek.innerHTML = `<img src="${LAB.assetBase}nella/avatar.jpg" alt="">`; document.body.appendChild(peek);
      const hideBtn = document.createElement('button'); hideBtn.className = 'lg-hide'; hideBtn.type = 'button'; hideBtn.title = 'Sembunyikan Bu Nella'; hideBtn.textContent = '✕'; el.querySelector('.lg-tools').appendChild(hideBtn);
      const applyMode = () => { const hid = this.mode === 'hide'; el.style.display = hid ? 'none' : ''; peek.style.display = hid ? '' : 'none'; if(hid){ stop(); el.classList.remove('open'); } };
      peek.onclick = () => { this.mode = 'avatar'; this.txt = false; ls.set('lab_guide_mode', 'avatar'); applyMode(); upd(); };
      hideBtn.onclick = () => { this.mode = 'hide'; ls.set('lab_guide_mode', 'hide'); applyMode(); };
      upd(); applyMode(); this.show(greetKey, greetText, false);
      setTimeout(() => { if(!this.cur || this.cur.key === greetKey) el.classList.remove('open'); }, 9000);
    },
    show(key, text, autoplay = this.auto){
      if(!guideEl) return; this.cur = {key, text};
      guideEl.querySelector('.lg-t').textContent = text; if(this.mode === 'hide') return;
      if(this.txt) guideEl.classList.add('open');
      if(autoplay) speak(this.sim, key, text); else stop();
    },
    stop
  };
})();
