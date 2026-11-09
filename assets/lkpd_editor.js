/* Lab Petualang — editor LKPD: mode edit lengkap, simpan otomatis (perangkat + GitHub), unduh Word hasil edit */
(function(){
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LS = 'lkpd_doc:';
const ED = window.LKED = {
  /* ---------- penyimpanan ---------- */
  local(key){ try{ return JSON.parse(localStorage.getItem(LS + key) || 'null'); }catch(e){ return null; } },
  saveLocal(key, html){ const d = {html, t:Date.now(), gh:(ED.local(key) || {}).gh || 0}; try{ localStorage.setItem(LS + key, JSON.stringify(d)); }catch(e){ uiNotify('Penyimpanan perangkat penuh. Hapus gambar besar atau simpan ke GitHub.', {icon:'⚠️'}); } return d; },
  markGH(key, t){ const d = ED.local(key); if(d){ d.gh = t; try{ localStorage.setItem(LS + key, JSON.stringify(d)); }catch(e){} } },
  drop(key){ try{ localStorage.removeItem(LS + key); }catch(e){} },
  path: key => `data/lkpd/${key}.html`,
  async online(key){ try{ const r = await fetch(ED.path(key) + '?t=' + Date.now(), {cache:'no-store'}); if(!r.ok) return null; const tx = await r.text(), m = tx.match(/<!--lkpd:t=(\d+)-->/); return m ? {html:tx.replace(/<!--lkpd:t=\d+-->\s*/, ''), t:+m[1]} : null; }catch(e){ return null; } },
  hasToken(){ try{ return !!(GH.cfg().token); }catch(e){ return false; } },
  async pushGH(key, html, t){ const body = `<!--lkpd:t=${t}-->\n` + html; await GH.put(ED.path(key), b64OfText(body), `LKPD ${key}: simpan dari editor`); ED.markGH(key, t); },
  async deleteGH(key){ try{ const ex = await GH.getFile(ED.path(key)); if(ex && ex.sha){ const c = GH.cfg(); await GH.api(`contents/${ED.path(key)}`, {method:'DELETE', body:JSON.stringify({message:`LKPD ${key}: kembali ke template`, sha:ex.sha, branch:c.branch})}); } }catch(e){} },
  /* bersihkan HTML sebelum disimpan */
  clean(el){ const c = el.cloneNode(true); c.removeAttribute('contenteditable'); $$('.lk-sel', c).forEach(x => x.classList.remove('lk-sel')); $$('[contenteditable]', c).forEach(x => x.removeAttribute('contenteditable')); return c.innerHTML; }
};

ED.download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); };

/* ---------- template blok ---------- */
const TPL = {
  bacaan:['📖 Kotak Ayo Membaca', '<p class="lk-sub">📖 Ayo Membaca!</p><div class="lk-read"><p>Tulis bacaan singkat di sini…</p><ul><li>Poin penting 1</li><li>Poin penting 2</li></ul></div><p></p>'],
  langkah:['🧪 Alat, bahan & langkah', '<p><b>Alat dan bahan:</b> …</p><p><b>Langkah kerja:</b></p><ol><li>Langkah pertama…</li><li>Langkah kedua…</li><li>Langkah ketiga…</li></ol><p></p>'],
  perhatian:['⚠️ Kotak Perhatian', '<div class="lk-warn"><b>⚠️ Perhatian!</b> Tulis peringatan keselamatan di sini…</div><p></p>'],
  tabel:['📊 Tabel pengamatan', () => `<p class="lk-tt">Tabel Pengamatan</p>${tableHTML(5, 4, true)}<p></p>`],
  tanya:['✍️ Pertanyaan + garis jawaban', '<p class="lk-sub">✍️ Ayo Menjawab!</p><p>1. Tulis pertanyaan…</p><div class="lk-dot"></div><div class="lk-dot"></div><div class="lk-dot"></div><p></p>'],
  diskusi:['💬 Ayo Diskusi', '<div class="lk-frame"><p class="lk-or"><b>AYO DISKUSI</b></p><p>1. Pertanyaan diskusi…</p><div class="lk-dot"></div><div class="lk-dot"></div></div><p></p>'],
  tahap:['🟦 Bar Tahap (navy)', '<h3 class="lk-bar">Tahap …: Judul tahap</h3><p></p>'],
  kegiatan:['🔷 Bar Kegiatan', '<h3 class="lk-bar k">Kegiatan C — Judul kegiatan</h3><p></p>'],
  bagian:['🟧 Kotak bagian (oranye)', '<section class="lk-box o"><h3>Judul bagian</h3><div><p>Isi bagian…</p></div></section><p></p>'],
  bingkai:['⬜ Bingkai teks', '<div class="lk-frame"><p>Tulis teks di dalam bingkai…</p></div><p></p>'],
  identitas:['🪪 Identitas kelompok', '<div class="lk-id"><div><b>Kelompok :</b><span class="lk-ln"></span></div><div><b>Kelas :</b><span>.... / ....</span></div><div><b>Anggota :</b><ol><li><span class="lk-ln"></span></li><li><span class="lk-ln"></span></li><li><span class="lk-ln"></span></li><li><span class="lk-ln"></span></li></ol></div></div><p></p>'],
  kutipan:['💬 Kutipan motivasi', '<blockquote class="lk-quote">“Tulis kutipan motivasi…”</blockquote><p></p>'],
  rubrik:['⭐ Rubrik penilaian', () => `<p class="lk-tt">Rubrik Penilaian</p><table class="lk-t"><thead><tr><th>Aspek</th><th>4 (Sangat baik)</th><th>3 (Baik)</th><th>2 (Cukup)</th><th>1 (Perlu bimbingan)</th></tr></thead><tbody>${['Kerja sama', 'Ketelitian data', 'Presentasi'].map(a => `<tr><td><b>${a}</b></td><td></td><td></td><td></td><td></td></tr>`).join('')}</tbody></table><p></p>`],
  halaman:['📄 Pemisah halaman', '<div class="lk-pb">✂ ─── halaman baru ───</div><p></p>']};
function tableHTML(r, c, head){ return `<table class="lk-t">${head ? `<thead><tr>${Array.from({length:c}, (_, i) => `<th>${i ? 'Kolom ' + (i + 1) : 'Keterangan'}</th>`).join('')}</tr></thead>` : ''}<tbody>${Array.from({length:head ? r - 1 : r}, () => `<tr>${'<td><br></td>'.repeat(c)}</tr>`).join('')}</tbody></table>`; }

/* ---------- editor ---------- */
let RANGE = null, SHEET = null;
const keep = () => { const s = getSelection(); if(s.rangeCount && SHEET && SHEET.contains(s.anchorNode)) RANGE = s.getRangeAt(0).cloneRange(); };
const restore = () => { if(!RANGE || !SHEET) return; SHEET.focus({preventScroll:true}); const s = getSelection(); s.removeAllRanges(); s.addRange(RANGE); };
const cmd = (c, v = null) => { restore(); document.execCommand('styleWithCSS', false, c === 'fontSize' ? false : true); document.execCommand(c, false, v); keep(); ED._changed && ED._changed(); };
const insertHTML = h => { restore(); if(!RANGE){ SHEET.insertAdjacentHTML('beforeend', h); } else document.execCommand('insertHTML', false, h); keep(); ED._changed && ED._changed(); };
const curCell = () => { const n = RANGE && RANGE.startContainer; const el = n && (n.nodeType === 1 ? n : n.parentElement); return el && el.closest('td,th'); };
function tableOp(op){ const c = curCell(); if(!c && op !== 'insert'){ uiNotify('Letakkan kursor di dalam sel tabel dulu.', {icon:'📊'}); return; }
  const tr = c && c.parentElement, tb = c && c.closest('table'), idx = c ? [...tr.children].indexOf(c) : 0;
  const rowCells = r => [...r.children];
  if(op === 'rowB' || op === 'rowA'){ const n = tr.cloneNode(true); rowCells(n).forEach(x => { const t = document.createElement('td'); t.innerHTML = '<br>'; x.replaceWith(t); }); if(tr.parentElement.tagName === 'THEAD'){ const tbd = tb.tBodies[0] || tb.createTBody(); tbd.prepend(n); } else tr[op === 'rowB' ? 'after' : 'before'](n); }
  if(op === 'colR' || op === 'colL'){ [...tb.rows].forEach(r => { const ref = r.children[idx]; const t = document.createElement(ref && ref.tagName === 'TH' ? 'th' : 'td'); t.innerHTML = ref && ref.tagName === 'TH' ? 'Kolom' : '<br>'; if(ref) ref[op === 'colR' ? 'after' : 'before'](t); else r.appendChild(t); }); }
  if(op === 'rowDel'){ if(tb.rows.length > 1) tr.remove(); else tb.remove(); }
  if(op === 'colDel'){ if(tr.children.length > 1) [...tb.rows].forEach(r => r.children[idx] && r.children[idx].remove()); else tb.remove(); }
  if(op === 'tblDel') tb.remove();
  if(op === 'cellColor'){ const v = $('#lkCellColor').value; c.style.background = v; }
  ED._changed && ED._changed(); }
function fontSize(pt){ cmd('fontSize', '7'); $$('font[size="7"]', SHEET).forEach(f => { const s = document.createElement('span'); s.style.fontSize = pt + 'pt'; s.innerHTML = f.innerHTML; f.replaceWith(s); }); ED._changed && ED._changed(); }

ED.toolbar = () => `<div class="lk-tb" id="lkTb">
  <div class="g"><button data-c="undo" title="Batalkan (Ctrl+Z)">↶</button><button data-c="redo" title="Ulangi (Ctrl+Y)">↷</button></div>
  <div class="g"><select id="lkBlock" title="Gaya paragraf"><option value="">Gaya…</option><option value="P">Paragraf</option><option value="H1">Judul besar</option><option value="H2">Judul</option><option value="H3">Subjudul</option></select>
    <select id="lkFont" title="Jenis huruf"><option value="">Huruf…</option>${['Nunito', 'Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Comic Sans MS', 'Courier New'].map(f => `<option style="font-family:'${f}'">${f}</option>`).join('')}</select>
    <select id="lkSize" title="Ukuran huruf"><option value="">Ukuran…</option>${[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 40].map(s => `<option value="${s}">${s} pt</option>`).join('')}</select></div>
  <div class="g"><button data-c="bold" title="Tebal (Ctrl+B)"><b>B</b></button><button data-c="italic" title="Miring (Ctrl+I)"><i>I</i></button><button data-c="underline" title="Garis bawah (Ctrl+U)"><u>U</u></button><button data-c="strikeThrough" title="Coret"><s>S</s></button><button data-c="superscript" title="Pangkat (x²)">x²</button><button data-c="subscript" title="Indeks (H₂O)">x₂</button>
    <label class="clr" title="Warna huruf">A<input type="color" id="lkColor" value="#dc2626"></label><label class="clr hl" title="Stabilo">🖍<input type="color" id="lkHl" value="#fde047"></label></div>
  <div class="g"><button data-c="justifyLeft" title="Rata kiri">⯇≡</button><button data-c="justifyCenter" title="Rata tengah">≡</button><button data-c="justifyRight" title="Rata kanan">≡⯈</button><button data-c="justifyFull" title="Rata kiri-kanan">☰</button>
    <button data-c="insertUnorderedList" title="Daftar butir">•≡</button><button data-c="insertOrderedList" title="Daftar nomor">1≡</button><button data-c="outdent" title="Kurangi indentasi">⇤</button><button data-c="indent" title="Tambah indentasi">⇥</button></div>
  <div class="g"><div class="dd"><button class="ddb" title="Tabel">📊 Tabel ▾</button><div class="ddm tbl"><div class="grid" id="lkGrid"></div><small id="lkGridL">Pilih ukuran tabel</small><hr>
      <button data-t="rowA">↥ Tambah baris di atas</button><button data-t="rowB">↧ Tambah baris di bawah</button><button data-t="colL">↤ Tambah kolom kiri</button><button data-t="colR">↦ Tambah kolom kanan</button><button data-t="rowDel">✕ Hapus baris</button><button data-t="colDel">✕ Hapus kolom</button><button data-t="tblDel">🗑 Hapus tabel</button>
      <label class="cc">🎨 Warna sel <input type="color" id="lkCellColor" value="#d9ebfa"><button data-t="cellColor">Terapkan</button></label></div></div>
    <div class="dd"><button class="ddb" title="Sisipkan template blok">🧩 Template ▾</button><div class="ddm">${Object.entries(TPL).map(([k, v]) => `<button data-tpl="${k}">${v[0]}</button>`).join('')}</div></div>
    <button id="lkImg" title="Sisipkan gambar">🖼️ Gambar</button><input type="file" id="lkImgF" accept="image/*" hidden>
    <button data-c="insertHorizontalRule" title="Garis pemisah">―</button><button id="lkLines" title="Sisipkan 3 garis jawaban">┄ Garis jawaban</button><button data-c="removeFormat" title="Hapus format">⌫ Format</button></div>
  <div class="g st"><span id="lkSt">Belum ada perubahan</span><button class="btn sm" id="lkSave" title="Simpan sekarang (Ctrl+S)">💾 Simpan</button><button class="btn sm ghost" id="lkReset" title="Kembalikan ke LKPD bawaan">↺ Template asli</button><button class="btn sm green" id="lkDone">✓ Selesai</button></div></div>`;

ED.attach = function(key, sheet, onDone){
  SHEET = sheet; RANGE = null; sheet.contentEditable = 'true'; sheet.classList.add('editing'); sheet.spellcheck = false;
  let tL = null, tG = null, dirty = false, lastSaved = (ED.local(key) || {}).t || 0;
  const st = (m, tone) => { const e = $('#lkSt'); if(e){ e.innerHTML = m; e.className = tone || ''; } };
  const fmt = t => new Date(t).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
  const saveLocal = () => { const d = ED.saveLocal(key, ED.clean(sheet)); lastSaved = d.t; dirty = false; st(`✅ Tersimpan di perangkat ${fmt(d.t)}${ED.hasToken() ? ' · ☁️ menunggu GitHub…' : ''}`, 'ok'); return d; };
  const saveGH = async (force) => { if(!ED.hasToken()){ if(force) st('💾 Tersimpan di perangkat. <a href="#" id="lkGoSet">Hubungkan GitHub</a> agar tersimpan online.', 'warn'); const a = $('#lkGoSet'); if(a) a.onclick = e => { e.preventDefault(); nav('settings'); }; return; }
    const d = ED.local(key); if(!d || d.gh === d.t) { st(`☁️ Tersimpan di GitHub ${fmt((d || {}).gh || Date.now())}`, 'ok'); return; }
    st('☁️ Menyimpan ke GitHub…'); try{ await ED.pushGH(key, d.html, d.t); st(`☁️ Tersimpan di GitHub ${fmt(Date.now())} · tampil online ± 1 menit lagi`, 'ok'); }catch(e){ st('⚠️ Gagal ke GitHub: ' + e.message + ' (tetap aman di perangkat)', 'warn'); } };
  ED._changed = () => { dirty = true; st('✏️ Ada perubahan…'); clearTimeout(tL); clearTimeout(tG); tL = setTimeout(() => { saveLocal(); tG = setTimeout(() => saveGH(), 15000); }, 1200); };
  sheet.addEventListener('input', ED._changed);
  document.addEventListener('selectionchange', keep);
  sheet.addEventListener('keydown', e => { if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){ e.preventDefault(); clearTimeout(tL); clearTimeout(tG); saveLocal(); saveGH(true); } });
  sheet.addEventListener('paste', e => { const h = e.clipboardData && e.clipboardData.getData('text/html'); if(h){ e.preventDefault(); const d = document.createElement('div'); d.innerHTML = h; $$('script,style,meta,link,o\\:p', d).forEach(x => x.remove()); $$('*', d).forEach(x => { [...x.attributes].forEach(a => { if(/^on/i.test(a.name) || a.name === 'class' && /^Mso/.test(a.value)) x.removeAttribute(a.name); }); }); document.execCommand('insertHTML', false, d.innerHTML); } });
  const tb = $('#lkTb');
  tb.addEventListener('mousedown', e => { if(e.target.closest('button') && !e.target.closest('.ddm .cc')) e.preventDefault(); });
  $$('[data-c]', tb).forEach(b => b.onclick = () => cmd(b.dataset.c));
  $('#lkBlock').onchange = e => { if(e.target.value) cmd('formatBlock', e.target.value); e.target.value = ''; };
  $('#lkFont').onchange = e => { if(e.target.value) cmd('fontName', e.target.value); e.target.value = ''; };
  $('#lkSize').onchange = e => { if(e.target.value) fontSize(+e.target.value); e.target.value = ''; };
  $('#lkColor').oninput = e => cmd('foreColor', e.target.value);
  $('#lkHl').oninput = e => cmd('hiliteColor', e.target.value);
  $$('.dd', tb).forEach(d => { $('.ddb', d).onclick = () => { const o = d.classList.contains('open'); $$('.dd', tb).forEach(x => x.classList.remove('open')); d.classList.toggle('open', !o); }; });
  document.addEventListener('mousedown', e => { if(!e.target.closest('.dd')) $$('.dd', tb).forEach(x => x.classList.remove('open')); });
  const grid = $('#lkGrid'); grid.innerHTML = Array.from({length:64}, (_, i) => `<i data-r="${Math.floor(i/8) + 1}" data-c="${i % 8 + 1}"></i>`).join('');
  grid.onmouseover = e => { const t = e.target.dataset; if(!t.r) return; $$('i', grid).forEach(x => x.classList.toggle('on', +x.dataset.r <= +t.r && +x.dataset.c <= +t.c)); $('#lkGridL').textContent = `${t.r} baris × ${t.c} kolom`; };
  grid.onmousedown = e => e.preventDefault();
  grid.onclick = e => { const t = e.target.dataset; if(!t.r) return; insertHTML(tableHTML(+t.r, +t.c, +t.r > 1) + '<p></p>'); $$('.dd', tb).forEach(x => x.classList.remove('open')); };
  $$('[data-t]', tb).forEach(b => b.onclick = () => { restore(); keep(); tableOp(b.dataset.t); });
  $$('[data-tpl]', tb).forEach(b => b.onclick = () => { const v = TPL[b.dataset.tpl][1]; insertHTML(typeof v === 'function' ? v() : v); $$('.dd', tb).forEach(x => x.classList.remove('open')); });
  $('#lkLines').onclick = () => insertHTML('<div class="lk-dot"></div><div class="lk-dot"></div><div class="lk-dot"></div><p></p>');
  $('#lkImg').onclick = () => $('#lkImgF').click();
  $('#lkImgF').onchange = e => { const f = e.target.files[0]; if(!f) return; const fr = new FileReader(); fr.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, 900/im.width), c = document.createElement('canvas'); c.width = im.width*s; c.height = im.height*s; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      insertHTML(`<img src="${c.toDataURL('image/jpeg', .82)}" style="max-width:100%" width="${Math.round(Math.min(c.width, 600))}">`); }; im.src = fr.result; }; fr.readAsDataURL(f); e.target.value = ''; };
  $('#lkSave').onclick = () => { clearTimeout(tL); clearTimeout(tG); saveLocal(); saveGH(true); };
  $('#lkReset').onclick = async () => { if(!await uiConfirm('Semua perubahan pada LKPD ini akan dihapus dan kembali ke versi bawaan Lab Petualang.', {title:'Kembalikan template asli?', icon:'↺', ok:'Kembalikan', danger:true})) return;
    clearTimeout(tL); clearTimeout(tG); ED.drop(key); if(ED.hasToken()) ED.deleteGH(key); ED.detach(); onDone(true); };
  $('#lkDone').onclick = async () => { clearTimeout(tL); clearTimeout(tG); if(dirty) saveLocal(); await saveGH(); ED.detach(); onDone(false); };
  // gambar dapat diubah ukurannya dengan klik: lebar ±
  sheet.addEventListener('click', e => { $$('.lk-sel', sheet).forEach(x => x.classList.remove('lk-sel')); if(e.target.tagName === 'IMG'){ e.target.classList.add('lk-sel'); const w = +(e.target.getAttribute('width') || e.target.width);
      uiDialog({title:'Atur gambar', icon:'🖼️', html:`<span style="display:block;font-weight:800;margin-bottom:6px">Lebar gambar (piksel, 40–900):</span><input type="number" id="lkImW" value="${w}" min="40" max="900" style="width:100%;padding:10px;border-radius:10px;border:1px solid #cbd5e1;font:800 16px Nunito,sans-serif"><label style="display:flex;gap:8px;align-items:center;margin-top:10px;font-weight:800"><input type="checkbox" id="lkImDel"> Hapus gambar ini</label>`, ok:'Terapkan', cancel:'Batal'}).then(v => { if(!v) return; if($('#lkImDel') && $('#lkImDel').checked) e.target.remove(); else { const nw = +$('#lkImW').value; if(nw) e.target.setAttribute('width', Math.max(40, Math.min(900, nw))); } ED._changed && ED._changed(); }); } });
  st(lastSaved ? `✅ Versi tersimpan ${fmt(lastSaved)}` : 'Mode edit aktif — ketik langsung pada lembar kerja', 'ok');
  ED.detach = () => { sheet.contentEditable = 'false'; sheet.classList.remove('editing'); document.removeEventListener('selectionchange', keep); ED._changed = null; SHEET = null; };
};
})();
