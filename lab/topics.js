/* ===== Topik Lab Virtual 3D — bagian A (Kelas 7) ===== */
window.TOPICS3D = window.TOPICS3D || {};
const T3 = window.TOPICS3D;
const PI = Math.PI;
/* pembantu umum */
function lathe(E, pts, m, parent, pos, seg = 64){ const g = new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg); return E.mesh(g, m, parent, pos); }
function canvasTex(w, h, draw){ const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function table(E, w = 9, d = 4, h = 2.2){ const top = E.mesh(new THREE.BoxGeometry(w, .18, d), E.mat(0xf1f5f9, {roughness:.35}), null, [0, h, 0]);
  const leg = new THREE.BoxGeometry(.18, h, .18); [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([x,z]) => E.mesh(leg, E.mat(0x475569, {metalness:.6, roughness:.35}), null, [x*(w/2-.3), h/2, z*(d/2-.3)]));
  E.mesh(new THREE.BoxGeometry(w-.6, .08, d-.6), E.mat(0x64748b, {metalness:.4}), null, [0, .5, 0]); return top; }
function beakerG(E, r, h, liquid, lcol, parent, pos){ const g = new THREE.Group(); g.position.set(...pos); (parent || E.root).add(g);
  lathe(E, [[0,0],[r,0],[r,h],[r*1.06,h*1.02]], E.glass(), g, [0,0,0]);
  if(liquid > 0) E.mesh(new THREE.CylinderGeometry(r*.94, r*.94, h*liquid, 48), E.mat(lcol, {transparent:true, opacity:.75, roughness:.1}), g, [0, h*liquid/2 + .01, 0]);
  return g; }
function infoPick(E, obj, title, html, extra){ E.pick(obj, () => { E.info(title, html); if(extra) extra(); }); }

/* =====================================================================
   1. HAKIKAT SAINS — alat laboratorium, metode ilmiah, simbol bahaya
   ===================================================================== */
T3['hakikat-sains'] = {
  title:'Hakikat Sains & Laboratorium', titleHTML:'Hakikat <span>Sains</span> & Lab',
  greet:'Halo! Saya Bu Nella. Di laboratorium virtual ini kita mengenal alat-alat laboratorium, langkah metode ilmiah, dan simbol bahaya bahan kimia. Ketuk alat untuk melihat namanya dan fungsinya!',
  modes:[
  {id:'alat', label:'🧪 Alat Lab', view:{target:[0,2.6,0], radius:10, theta:.25, phi:1.15},
   say:'Ketuk setiap alat di meja laboratorium untuk mengetahui nama dan fungsinya.',
   build(E){
    E.platform(8); const top = table(E, 10, 4.2);
    const Y = 2.29, G = new THREE.Group(); E.root.add(G);
    const add = (name, fn, html, obj) => { infoPick(E, obj, name, `<p>${html}</p>`); E.label(obj, name, {off:E.V3(0, .25, 0), onClick:() => E.info(name, `<p>${html}</p>`)}); };
    // gelas kimia
    const bk = beakerG(E, .45, 1.1, .5, 0x38bdf8, G, [-4, Y, -.8]); add('Gelas kimia', 0, 'Wadah untuk mencampur, memanaskan, atau menampung larutan. Skalanya hanya perkiraan, bukan untuk mengukur volume dengan teliti.', bk);
    // erlenmeyer
    const er = new THREE.Group(); er.position.set(-2.7, Y, -.9); G.add(er);
    lathe(E, [[0,0],[.5,0],[.52,.05],[.18,.95],[.18,1.35],[.21,1.38]], E.glass(), er, [0,0,0]);
    E.mesh(new THREE.ConeGeometry(.45, .4, 48, 1, true), E.mat(0xf472b6, {transparent:true, opacity:.75}), er, [0,.2,0]).rotation.x = PI; add('Labu Erlenmeyer', 0, 'Wadah larutan saat titrasi atau mencampur; bentuk leher yang menyempit mencegah cairan tumpah saat digoyang.', er);
    // gelas ukur
    const gu = new THREE.Group(); gu.position.set(-1.5, Y, -1); G.add(gu);
    lathe(E, [[0,0],[.32,0],[.32,.08],[.16,.1],[.16,2.1],[.19,2.12]], E.glass(), gu, [0,0,0]);
    E.mesh(new THREE.CylinderGeometry(.14, .14, 1.1, 32), E.mat(0x22c55e, {transparent:true, opacity:.7}), gu, [0,.65,0]);
    for(let i = 0; i < 10; i++) E.mesh(new THREE.BoxGeometry(.08, .012, .01), E.mat(0x0f172a), gu, [.12, .3 + i*.18, .14], false);
    add('Gelas ukur', 0, 'Mengukur volume zat cair dengan lebih teliti. Bacalah skala sejajar dengan dasar meniskus (permukaan cekung).', gu);
    // tabung reaksi + rak
    const rk = new THREE.Group(); rk.position.set(0, Y, -1); G.add(rk);
    E.mesh(new THREE.BoxGeometry(1.4, .08, .4), E.mat(0xb45309), rk, [0,.6,0]); E.mesh(new THREE.BoxGeometry(1.4, .08, .4), E.mat(0xb45309), rk, [0,.05,0]);
    [-.6,.6].forEach(x => E.mesh(new THREE.BoxGeometry(.06, .6, .4), E.mat(0xb45309), rk, [x,.33,0]));
    [[-.4,0xef4444],[0,0x3b82f6],[.4,0xfacc15]].forEach(([x,c]) => { lathe(E, [[0,.05],[.06,0],[.1,.08],[.1,1.1]], E.glass(), rk, [x,.15,0], 24);
      E.mesh(new THREE.CylinderGeometry(.085, .085, .35, 16), E.mat(c, {transparent:true, opacity:.8}), rk, [x,.36,0]); });
    add('Tabung reaksi & rak', 0, 'Tabung reaksi untuk mereaksikan zat dalam jumlah kecil. Rak menjaga tabung tetap berdiri.', rk);
    // pembakar spiritus
    const pb = new THREE.Group(); pb.position.set(1.6, Y, -.9); G.add(pb);
    lathe(E, [[0,0],[.42,0],[.45,.1],[.38,.45],[.12,.55],[.12,.7]], E.glass(0xbae6fd), pb, [0,0,0]);
    E.mesh(new THREE.CylinderGeometry(.33, .38, .3, 32), E.mat(0x7dd3fc, {transparent:true, opacity:.6}), pb, [0,.16,0]);
    E.mesh(new THREE.CylinderGeometry(.03, .03, .2, 8), E.mat(0xf5f5f4), pb, [0,.78,0]);
    const fl = E.mesh(new THREE.ConeGeometry(.1, .45, 16), new THREE.MeshBasicMaterial({color:0x60a5fa, transparent:true, opacity:.85}), pb, [0,1.08,0], false);
    E.tick((dt,t) => { fl.scale.set(1 + Math.sin(t*20)*.08, 1 + Math.sin(t*13)*.12, 1); });
    add('Pembakar spiritus', 0, 'Sumber api untuk memanaskan. Gunakan kaki tiga dan kasa ketika memanaskan gelas kimia. Matikan dengan penutupnya, jangan ditiup.', pb);
    // mikroskop
    const mk = new THREE.Group(); mk.position.set(3.4, Y, -.6); mk.rotation.y = -.5; G.add(mk);
    const black = E.mat(0x1e293b, {metalness:.3, roughness:.4}), white = E.mat(0xf8fafc, {roughness:.3});
    E.mesh(new THREE.BoxGeometry(1, .15, 1.3), black, mk, [0,.08,0]); E.mesh(new THREE.BoxGeometry(.28, 1.6, .3), white, mk, [0,.9,-.45]).rotation.x = .12;
    E.mesh(new THREE.BoxGeometry(.8, .06, .7), black, mk, [0,.75,.1]); E.mesh(new THREE.CylinderGeometry(.13, .13, 1, 24), white, mk, [0,1.75,.05]).rotation.x = .35;
    E.mesh(new THREE.CylinderGeometry(.07, .09, .3, 16), black, mk, [0,2.25,-.13]).rotation.x = .35; E.mesh(new THREE.CylinderGeometry(.1, .1, .14, 6), black, mk, [0,1.24,.25]);
    E.mesh(new THREE.CylinderGeometry(.11, .11, .12, 24), E.mat(0x94a3b8, {metalness:.8, roughness:.2}), mk, [.2,1.1,-.42]).rotation.z = PI/2;
    add('Mikroskop', 0, 'Mengamati benda yang sangat kecil (misalnya sel). Perbesaran total = perbesaran lensa okuler × perbesaran lensa objektif.', mk);
    // neraca
    const nr = new THREE.Group(); nr.position.set(-3.2, Y, 1); G.add(nr);
    E.mesh(new THREE.BoxGeometry(1.6, .12, .6), E.mat(0x0ea5e9), nr, [0,.06,0]); E.mesh(new THREE.CylinderGeometry(.35, .35, .05, 32), E.mat(0xcbd5e1, {metalness:.9, roughness:.2}), nr, [-.45,.2,0]);
    E.mesh(new THREE.BoxGeometry(.04, .3, .04), E.mat(0x334155), nr, [-.45,.1,0]); [.12,.22,.32].forEach((y,i) => E.mesh(new THREE.BoxGeometry(1.2, .03, .03), E.mat(0x334155), nr, [.15,y,.25]));
    add("Neraca Ohauss", 0, 'Mengukur massa benda. Satuan SI massa adalah kilogram (kg). Pastikan neraca menunjuk nol sebelum menimbang.', nr);
    // termometer
    const tm = new THREE.Group(); tm.position.set(-1.6, Y + .05, 1.1); tm.rotation.z = PI/2; G.add(tm);
    E.mesh(new THREE.CylinderGeometry(.06, .06, 1.6, 16), E.glass(), tm, [0,.8,0]); E.mesh(new THREE.SphereGeometry(.09, 16, 12), E.mat(0xef4444), tm, [0,0,0]);
    E.mesh(new THREE.CylinderGeometry(.025, .025, .9, 8), E.mat(0xef4444), tm, [0,.45,0]);
    add('Termometer', 0, 'Mengukur suhu. Satuan SI suhu adalah kelvin (K); sehari-hari kita memakai derajat Celsius (°C).', tm);
    // pipet & lup
    const pp = new THREE.Group(); pp.position.set(0, Y + .06, 1.2); pp.rotation.z = PI/2; G.add(pp);
    E.mesh(new THREE.CylinderGeometry(.04, .02, 1, 12), E.glass(), pp, [0,.5,0]); E.mesh(new THREE.SphereGeometry(.12, 16, 12), E.mat(0xf43f5e, {roughness:.7}), pp, [0,1.05,0]).scale.y = 1.6;
    add('Pipet tetes', 0, 'Memindahkan atau meneteskan zat cair dalam jumlah sedikit.', pp);
    const lp = new THREE.Group(); lp.position.set(1.6, Y + .05, 1.1); lp.rotation.x = -PI/2.3; G.add(lp);
    E.mesh(new THREE.TorusGeometry(.35, .04, 12, 48), E.mat(0x0f172a), lp); E.mesh(new THREE.CircleGeometry(.34, 48), E.glass(0xe0f2fe, {opacity:.35}), lp);
    E.mesh(new THREE.CylinderGeometry(.05, .05, .7, 12), E.mat(0x92400e), lp, [0,-.7,0]);
    add('Lup (kaca pembesar)', 0, 'Memperbesar bayangan benda kecil agar terlihat lebih jelas, misalnya serangga atau daun.', lp);
    // kaki tiga
    const kt = new THREE.Group(); kt.position.set(3.4, Y, 1.1); G.add(kt);
    E.mesh(new THREE.TorusGeometry(.4, .03, 8, 32), E.mat(0x64748b, {metalness:.8}), kt, [0,.8,0]).rotation.x = PI/2;
    for(let i = 0; i < 3; i++){ const a = i/3*PI*2; const l = E.mesh(new THREE.CylinderGeometry(.025, .025, .85, 8), E.mat(0x64748b, {metalness:.8}), kt, [Math.cos(a)*.42, .4, Math.sin(a)*.42]); l.rotation.z = Math.cos(a)*.1; l.rotation.x = -Math.sin(a)*.1; }
    E.mesh(new THREE.BoxGeometry(.9, .02, .9), E.mat(0xd6d3d1, {roughness:.9}), kt, [0,.83,0]);
    add('Kaki tiga & kasa', 0, 'Penyangga gelas kimia saat dipanaskan dengan pembakar spiritus. Kasa meratakan panas.', kt);
    E.ui.head('ALAT LABORATORIUM', 'Mengenal Alat Laboratorium', 'Ketuk alat di meja atau label namanya. Setiap alat punya fungsi khusus — memakai alat yang tepat membuat hasil pengamatan lebih akurat dan aman.');
    E.ui.sec('Tips memakai alat', `<ul class="pts"><li>Baca skala gelas ukur sejajar mata.</li><li>Panaskan zat memakai kaki tiga + kasa.</li><li>Kembalikan alat ke tempatnya setelah dipakai.</li><li>Laporkan alat yang retak/pecah kepada guru.</li></ul>`);
   }},
  {id:'metode', label:'🔎 Metode Ilmiah', view:{target:[0,1.8,0], radius:13, theta:0, phi:1.2},
   say:'Metode ilmiah adalah langkah sistematis untuk menjawab pertanyaan tentang alam: mengamati, merumuskan masalah, membuat hipotesis, bereksperimen, menganalisis data, lalu menarik kesimpulan.',
   build(E){
    E.platform(8);
    const ST = [['👀','Mengamati','Mengamati fenomena dengan pancaindra atau alat. Contoh: tanaman di dekat jendela tumbuh condong ke arah cahaya.'],
      ['❓','Merumuskan masalah','Membuat pertanyaan yang bisa diuji. Contoh: “Apakah cahaya memengaruhi arah pertumbuhan tanaman?”'],
      ['💡','Hipotesis','Dugaan sementara berdasarkan pengetahuan. Contoh: “Tanaman tumbuh ke arah datangnya cahaya.”'],
      ['🧪','Eksperimen','Menguji hipotesis dengan variabel bebas (yang diubah), terikat (yang diukur), dan kontrol (yang dibuat sama).'],
      ['📊','Analisis data','Mengolah data hasil eksperimen ke dalam tabel atau grafik, lalu mencari pola.'],
      ['✅','Kesimpulan','Menjawab rumusan masalah: hipotesis diterima atau ditolak. Hasil dikomunikasikan dalam laporan.']];
    const items = [];
    ST.forEach(([ic, nm, tx], i) => { const a = i/ST.length*PI*2 - PI/2, R = 5.2, x = Math.cos(a)*R, z = Math.sin(a)*R;
      const g = new THREE.Group(); g.position.set(x, 0, z); E.root.add(g);
      const ped = E.mesh(new THREE.CylinderGeometry(.9, 1, .6, 6), E.mat([0x0891b2,0x7c3aed,0xd97706,0x16a34a,0xdb2777,0x2563eb][i], {roughness:.4}), g, [0,.3,0]);
      const sp = E.txtSprite(ic, {size:120, h:1.3}); sp.position.set(0, 1.7, 0); g.add(sp);
      const n = E.txtSprite(`${i+1}`, {size:80, h:.5, bg:'rgba(15,31,61,.85)'}); n.position.set(0, .75, 1.02); g.add(n);
      E.pick(ped, () => go(i)); E.label(g, `${i+1}. ${nm}`, {off:E.V3(0, 2.6, 0), onClick:() => go(i)}); items.push({g, sp}); });
    for(let i = 0; i < ST.length; i++){ const a1 = i/ST.length*PI*2 - PI/2, a2 = (i+1)/ST.length*PI*2 - PI/2, R = 5.2;
      const curve = new THREE.QuadraticBezierCurve3(E.V3(Math.cos(a1)*R, .7, Math.sin(a1)*R), E.V3(Math.cos((a1+a2)/2)*R*1.12, 1.4, Math.sin((a1+a2)/2)*R*1.12), E.V3(Math.cos(a2)*R, .7, Math.sin(a2)*R));
      E.mesh(new THREE.TubeGeometry(curve, 24, .05, 8), E.mat(0xfbbf24, {emissive:0xfbbf24, emissiveIntensity:.4}), null, null, false); }
    const orb = E.mesh(new THREE.SphereGeometry(.28, 24, 16), E.mat(0xfde047, {emissive:0xfbbf24, emissiveIntensity:1.2}), null, [0,2,0], false);
    let cur = 0, goal = 0, auto = false, at = 0;
    function go(i){ cur = i; goal = i; E.info(`${i+1}. ${ST[i][1]}`, `<p>${ST[i][2]}</p>`); E.say('step' + i, ST[i][1] + '. ' + ST[i][2], false); items.forEach((it, k) => it.g.scale.setScalar(k === i ? 1.15 : 1)); }
    let pos = 0;
    E.tick((dt, t) => { if(auto){ at += dt; if(at > 4){ at = 0; go((cur + 1) % ST.length); } }
      pos += ((goal - pos + ST.length*1.5) % ST.length - ST.length*.5) * Math.min(1, dt*3);
      const a = pos/ST.length*PI*2 - PI/2; orb.position.set(Math.cos(a)*5.2, 2.6 + Math.sin(t*4)*.15, Math.sin(a)*5.2);
      items.forEach((it, k) => it.sp.position.y = 1.7 + Math.sin(t*2 + k)*.08); });
    E.ui.head('METODE ILMIAH', 'Langkah Metode Ilmiah', 'Ilmuwan bekerja secara sistematis. Ketuk setiap langkah atau putar otomatis.');
    const s = E.ui.sec('Kontrol');
    E.ui.buttons(s, [{label:'◀ Sebelumnya', on:() => go((cur + ST.length - 1) % ST.length)}, {label:'Berikutnya ▶', cls:'p', on:() => go((cur + 1) % ST.length)}, {label:'▶ Putar otomatis', on:el => { auto = !auto; el.classList.toggle('on', auto); }}]);
    E.ui.sec('Contoh variabel', `<p><b>Percobaan:</b> pengaruh cahaya terhadap pertumbuhan kecambah.</p><ul class="pts"><li><b>Variabel bebas:</b> ada/tidaknya cahaya</li><li><b>Variabel terikat:</b> tinggi & arah kecambah</li><li><b>Variabel kontrol:</b> jenis biji, air, tanah, suhu</li></ul>`);
    go(0);
   }},
  {id:'bahaya', label:'⚠️ Simbol Bahaya', view:{target:[0,1.8,0], radius:11, theta:0, phi:1.25},
   say:'Bahan kimia di laboratorium diberi simbol bahaya. Kenali simbolnya agar kita bisa bekerja dengan aman.',
   build(E){
    E.platform(7.5);
    const SY = [['🔥','Mudah terbakar','Bahan mudah menyala, misalnya alkohol & spiritus. Jauhkan dari api dan sumber panas.'],
      ['☠️','Beracun','Dapat menyebabkan keracunan bila tertelan, terhirup, atau terkena kulit. Contoh: pestisida, merkuri.'],
      ['🧴','Korosif','Dapat merusak kulit dan logam. Contoh: asam sulfat, natrium hidroksida. Gunakan sarung tangan & kacamata.'],
      ['💥','Mudah meledak','Dapat meledak karena panas, gesekan, atau benturan. Contoh: bahan kembang api.'],
      ['❗','Iritan / berbahaya','Menyebabkan iritasi kulit, mata, atau saluran napas. Contoh: amonia.'],
      ['🐟','Berbahaya bagi lingkungan','Merusak makhluk hidup air & lingkungan. Jangan dibuang ke saluran air.']];
    const plates = [];
    SY.forEach(([ic, nm, tx], i) => { const x = (i%3 - 1)*3.4, y = i < 3 ? 3.2 : 1.1;
      const tex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0,0,w,h); g.save(); g.translate(w/2, h/2); g.rotate(PI/4); g.strokeStyle = '#dc2626'; g.lineWidth = 34; g.strokeRect(-150, -150, 300, 300); g.restore();
        g.font = '170px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ic, w/2, h/2 + 10); });
      const p = E.mesh(new THREE.BoxGeometry(1.9, 1.9, .12), [E.mat(0xffffff), E.mat(0xffffff), E.mat(0xffffff), E.mat(0xffffff), new THREE.MeshStandardMaterial({map:tex, roughness:.5}), E.mat(0xe2e8f0)], null, [x, y, 0]);
      p.userData.base = y; plates.push(p);
      E.pick(p, () => { E.info(nm, `<p>${tx}</p>`); E.say('sym' + i, nm + '. ' + tx, false); plates.forEach(q => q.userData.sel = q === p); });
      E.label(p, nm, {off:E.V3(0, -1.15, 0)}); });
    E.tick((dt, t) => plates.forEach((p, i) => { p.rotation.y += ((p.userData.sel ? PI*2*Math.floor(t/2) : Math.sin(t + i)*.2) - p.rotation.y)*Math.min(1, dt*3); p.position.y = p.userData.base + Math.sin(t*1.5 + i)*.06; }));
    E.ui.head('KESELAMATAN KERJA', 'Simbol Bahaya Bahan Kimia', 'Ketuk setiap simbol untuk mengetahui artinya.');
    E.ui.sec('Aturan keselamatan di lab', `<ul class="pts"><li>Pakai jas lab, kacamata & sarung tangan.</li><li>Jangan makan/minum di laboratorium.</li><li>Jangan mencium bahan kimia langsung — kibaskan uapnya dengan tangan.</li><li>Baca label & simbol sebelum memakai bahan.</li><li>Segera lapor guru bila terjadi kecelakaan.</li></ul>`);
   }}
  ]
};

/* =====================================================================
   2. PENGUKURAN — jangka sorong & besaran pokok
   ===================================================================== */
T3['pengukuran'] = {
  title:'Pengukuran', titleHTML:'Peng<span>ukuran</span>',
  greet:'Halo! Mari belajar mengukur. Coba geser rahang jangka sorong dan baca hasil pengukurannya. Lalu kenali tujuh besaran pokok dan alat ukurnya.',
  modes:[
  {id:'sorong', label:'📏 Jangka Sorong', view:{target:[1.2,1.2,0], radius:7.5, theta:0, phi:1.2, minR:2.5},
   say:'Jangka sorong memiliki skala utama dan skala nonius. Ketelitiannya nol koma satu milimeter. Hasil ukur sama dengan skala utama ditambah skala nonius dikali nol koma satu milimeter.',
   build(E){
    E.platform(6);
    const S = .06; // 1 mm = 0.06 unit
    const steel = E.mat(0xd1d5db, {metalness:.85, roughness:.28});
    const mainTex = canvasTex(4096, 256, (g, w, h) => { g.fillStyle = '#e5e7eb'; g.fillRect(0,0,w,h); g.fillStyle = '#111827';
      const mm = w/150; for(let i = 0; i <= 150; i++){ const x = 30 + i*mm*.97; const L = i%10===0 ? 120 : i%5===0 ? 85 : 55; g.fillRect(x, 0, 4, L); if(i%10===0){ g.font = 'bold 70px Arial'; g.textAlign = 'center'; g.fillText(i/10, x, 200); } } });
    const barLen = 150*S;
    const bar = E.mesh(new THREE.BoxGeometry(barLen + .6, .5, .08), [steel, steel, steel, steel, new THREE.MeshStandardMaterial({map:mainTex, metalness:.5, roughness:.35}), steel], null, [barLen/2 - .1, 1.6, 0]);
    E.mesh(new THREE.BoxGeometry(.5, 1.6, .1), steel, null, [-.25, .95, 0]); E.mesh(new THREE.BoxGeometry(.3, .5, .1), steel, null, [-.2, 2.05, 0]);
    const slid = new THREE.Group(); E.root.add(slid);
    const verTex = canvasTex(1024, 256, (g, w, h) => { g.fillStyle = '#f3f4f6'; g.fillRect(0,0,w,h); g.fillStyle = '#1d4ed8';
      for(let i = 0; i <= 10; i++){ const x = 60 + i*(w - 140)/10; g.fillRect(x, 0, 5, i%5===0 ? 110 : 70); if(i%5===0){ g.font = 'bold 60px Arial'; g.textAlign = 'center'; g.fillText(i, x, 190); } } });
    const vw = 9*S*1.1;
    E.mesh(new THREE.BoxGeometry(vw + .2, .32, .1), [steel, steel, steel, steel, new THREE.MeshStandardMaterial({map:verTex, metalness:.4, roughness:.35}), steel], slid, [vw/2 - .05, 1.24, .02]);
    E.mesh(new THREE.BoxGeometry(.5, 1.6, .1), steel, slid, [-.25 + .5, .95, .02]); E.mesh(new THREE.BoxGeometry(.3, .5, .1), steel, slid, [.3, 2.05, .02]);
    E.mesh(new THREE.BoxGeometry(vw + .4, .2, .14), steel, slid, [vw/2, 1.95, 0]);
    const OBJ = {koin:['Koin',23.5,0xcaa64a], baut:['Mur/baut',12.7,0x94a3b8], kelereng:['Kelereng',16.0,0x22d3ee], pensil:['Pensil',7.4,0xfbbf24]};
    let obj = null, cur = 'koin', gap = 30;
    function setObj(k){ if(obj) E.root.remove(obj); cur = k; const [nm, d, c] = OBJ[k], r = d*S/2;
      obj = k === 'kelereng' ? E.mesh(new THREE.SphereGeometry(r, 48, 32), E.mat(c, {transparent:true, opacity:.85, roughness:.05})) :
            k === 'pensil' ? E.mesh(new THREE.CylinderGeometry(r, r, 1.2, 6), E.mat(c)) :
            E.mesh(new THREE.CylinderGeometry(r, r, k === 'koin' ? .12 : .5, k === 'baut' ? 6 : 64), E.mat(c, {metalness:.8, roughness:.3}));
      if(k !== 'pensil') obj.rotation.x = PI/2; else obj.rotation.x = PI/2;
      obj.userData.r = r; place(); }
    function place(){ if(obj) obj.position.set(obj.userData.r + .001, .6 + obj.userData.r*.2, 0); }
    E.ui.head('ALAT UKUR PANJANG', 'Jangka Sorong', 'Geser rahang (atau tekan “Jepit benda”) lalu baca skalanya.');
    const s1 = E.ui.sec('Benda yang diukur'); E.ui.seg(s1, Object.entries(OBJ).map(([k,v]) => [k, v[0]]), 'koin', k => { setObj(k); });
    let rd = null; const s2 = E.ui.sec('Rahang geser');
    const sl = E.ui.slider(s2, {label:'Bukaan', min:0, max:100, step:.1, value:30, unit:'mm', on:v => { gap = v; upd(); }});
    E.ui.buttons(s2, [{label:'🤏 Jepit benda', cls:'p', on:() => { gap = OBJ[cur][1]; sl.set(gap); upd(); }}, {label:'🔍 Dekatkan skala', on:() => E.setView({target:[gap*S + .3, 1.35, 0], radius:2.6, theta:0, phi:1.45, minR:1.2})}]);
    rd = E.ui.reads(E.ui.sec('Pembacaan'), [['u','Skala utama'],['n','Skala nonius'],['h','Hasil'],['c','Dalam cm']]);
    E.ui.sec('Cara membaca', `<div class="formula">Hasil = SU + (<i>n</i> × 0,1 mm)</div><p>SU = angka skala utama tepat sebelum garis 0 nonius. <i>n</i> = garis nonius yang <b>segaris</b> dengan garis skala utama. Ketelitian 0,1 mm.</p>`);
    function upd(){ slid.position.x = gap*S; if(!rd) return; const su = Math.floor(gap + 1e-6), n = Math.round((gap - su)*10) % 10;
      rd.u(`${su} mm`); rd.n(`${n} × 0,1`); rd.h(`${gap.toFixed(1).replace('.',',')} mm`); rd.c(`${(gap/10).toFixed(2).replace('.',',')} cm`);
      const r = obj ? obj.userData.r*2/S : 0; if(obj) obj.material.emissive && obj.material.emissive.setHex(Math.abs(gap - OBJ[cur][1]) < .05 ? 0x16a34a : 0x000000); }
    setObj('koin'); upd();
   }},
  {id:'besaran', label:'⚖️ Besaran Pokok', view:{target:[0,1.6,0], radius:12, theta:0, phi:1.15},
   say:'Ada tujuh besaran pokok dalam Sistem Internasional: panjang, massa, waktu, suhu, kuat arus listrik, intensitas cahaya, dan jumlah zat.',
   build(E){
    E.platform(8);
    const items = [];
    const add = (g, nm, html, x) => { g.position.x = x; E.root.add(g); infoPick(E, g, nm, html); E.label(g, nm, {off:E.V3(0, 2.4, 0)}); items.push(g); };
    // mistar
    const m = new THREE.Group(); const rt = canvasTex(2048, 128, (g,w,h) => { g.fillStyle = '#fde68a'; g.fillRect(0,0,w,h); g.fillStyle = '#111'; for(let i = 0; i <= 300; i++){ const x = 20 + i*6.6; g.fillRect(x, 0, 2, i%10===0 ? 60 : i%5===0 ? 42 : 26); if(i%10===0){ g.font = 'bold 30px Arial'; g.fillText(i/10, x - 8, 100); } } });
    E.mesh(new THREE.BoxGeometry(3, .04, .4), [E.mat(0xfde68a), E.mat(0xfde68a), new THREE.MeshStandardMaterial({map:rt}), E.mat(0xfde68a), E.mat(0xfde68a), E.mat(0xfde68a)], m, [0,.4,0]);
    add(m, 'Mistar — panjang', '<p><b>Besaran:</b> panjang · <b>Satuan SI:</b> meter (m).<br>Mistar ketelitiannya 1 mm; jangka sorong 0,1 mm; mikrometer sekrup 0,01 mm.</p>', -4.8);
    // neraca dua lengan
    const n = new THREE.Group(); E.mesh(new THREE.BoxGeometry(1.4, .15, .6), E.mat(0x0f766e), n, [0,.08,0]); E.mesh(new THREE.CylinderGeometry(.05, .05, 1.4, 12), E.mat(0x334155), n, [0,.8,0]);
    const beam = new THREE.Group(); beam.position.y = 1.5; n.add(beam); E.mesh(new THREE.BoxGeometry(2, .06, .06), E.mat(0x334155, {metalness:.6}), beam);
    const panL = new THREE.Group(), panR = new THREE.Group(); [panL, panR].forEach((p, i) => { p.position.set(i ? .95 : -.95, -.5, 0); beam.add(p); E.mesh(new THREE.CylinderGeometry(.35, .3, .06, 32), E.mat(0xcbd5e1, {metalness:.9, roughness:.2}), p); E.mesh(new THREE.CylinderGeometry(.01, .01, .5, 6), E.mat(0x64748b), p, [0,.25,0]); });
    E.mesh(new THREE.BoxGeometry(.3, .3, .3), E.mat(0xef4444), panL, [0,.18,0]); E.mesh(new THREE.CylinderGeometry(.08, .08, .2, 16), E.mat(0xca8a04, {metalness:.9}), panR, [0,.13,0]);
    E.tick((dt,t) => { beam.rotation.z = Math.sin(t*1.3)*.06; panL.rotation.z = panR.rotation.z = -beam.rotation.z; });
    add(n, 'Neraca — massa', '<p><b>Besaran:</b> massa · <b>Satuan SI:</b> kilogram (kg).<br>Massa berbeda dengan berat: berat adalah gaya (newton), diukur dengan neraca pegas.</p>', -1.6);
    // stopwatch
    const sw = new THREE.Group(); E.mesh(new THREE.CylinderGeometry(.7, .7, .18, 64), E.mat(0x111827, {metalness:.5}), sw, [0,1.2,0]).rotation.x = PI/2;
    const face = canvasTex(512, 512, (g,w,h) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(256,256,250,0,PI*2); g.fill(); g.fillStyle = '#111'; for(let i = 0; i < 60; i++){ g.save(); g.translate(256,256); g.rotate(i/60*PI*2); g.fillRect(-2, -240, 4, i%5===0 ? 34 : 16); g.restore(); } g.font = 'bold 40px Arial'; g.textAlign = 'center'; g.fillText('60', 256, 90); g.fillText('30', 256, 450); });
    E.mesh(new THREE.CircleGeometry(.62, 64), new THREE.MeshStandardMaterial({map:face}), sw, [0,1.2,.1]);
    const hand = E.mesh(new THREE.BoxGeometry(.03, .55, .02), E.mat(0xdc2626), sw, [0,1.2,.12]); hand.geometry.translate(0, .27, 0);
    E.mesh(new THREE.CylinderGeometry(.09, .09, .2, 16), E.mat(0x9ca3af, {metalness:.8}), sw, [0,2,0]);
    E.tick((dt,t) => hand.rotation.z = -t*PI*2/60*6);
    add(sw, 'Stopwatch — waktu', '<p><b>Besaran:</b> waktu · <b>Satuan SI:</b> sekon (s).<br>Stopwatch digital biasanya memiliki ketelitian 0,01 s.</p>', 1.6);
    // termometer
    const tm = new THREE.Group(); E.mesh(new THREE.CylinderGeometry(.1, .1, 2.2, 24), E.glass(), tm, [0,1.3,0]); E.mesh(new THREE.SphereGeometry(.17, 24, 16), E.mat(0xdc2626), tm, [0,.2,0]);
    const merc = E.mesh(new THREE.CylinderGeometry(.045, .045, 1, 12), E.mat(0xdc2626), tm, [0,.2,0]); merc.geometry.translate(0, .5, 0);
    E.tick((dt,t) => merc.scale.y = 1.1 + Math.sin(t*.7)*.5);
    add(tm, 'Termometer — suhu', '<p><b>Besaran:</b> suhu · <b>Satuan SI:</b> kelvin (K).<br>0 °C = 273 K; air mendidih 100 °C = 373 K (pada tekanan 1 atm).</p>', 4.6);
    E.ui.head('BESARAN & SATUAN', '7 Besaran Pokok (SI)', 'Ketuk alat ukur untuk melihat besaran dan satuannya.');
    E.ui.sec('Tabel besaran pokok', `<table style="width:100%;font-size:.9em;border-collapse:collapse">${[['Panjang','meter','m'],['Massa','kilogram','kg'],['Waktu','sekon','s'],['Suhu','kelvin','K'],['Kuat arus listrik','ampere','A'],['Intensitas cahaya','kandela','cd'],['Jumlah zat','mol','mol']].map(r => `<tr><td style="padding:.25em 0;border-bottom:1px solid var(--line)"><b>${r[0]}</b></td><td>${r[1]}</td><td style="text-align:right"><b>${r[2]}</b></td></tr>`).join('')}</table>`);
    E.ui.sec('Besaran turunan', '<p>Diturunkan dari besaran pokok, misalnya <b>luas</b> (m²), <b>volume</b> (m³), <b>kecepatan</b> (m/s), <b>massa jenis</b> (kg/m³), <b>gaya</b> (newton = kg·m/s²).</p>');
   }}
  ]
};

/* =====================================================================
   3. WUJUD ZAT — model partikel & perubahan wujud
   ===================================================================== */
T3['wujud-zat'] = {
  title:'Wujud Zat', titleHTML:'Wujud <span>Zat</span>',
  greet:'Halo! Zat tersusun dari partikel-partikel yang selalu bergerak. Ubah suhunya dan amati bagaimana susunan dan gerak partikel berubah dari padat, cair, menjadi gas!',
  modes:[
  {id:'partikel', label:'⚛️ Model Partikel', view:{target:[0,2,0], radius:9, theta:.5, phi:1.15},
   say:'Pada zat padat, partikel tersusun rapat dan hanya bergetar. Pada zat cair, partikel agak renggang dan dapat berpindah. Pada gas, partikel sangat renggang dan bergerak bebas sangat cepat.',
   build(E){
    E.platform(6);
    const W = 3.2, Hh = 3.2, base = .3;
    E.mesh(new THREE.BoxGeometry(W, Hh, W), E.glass(0xe0f2fe, {opacity:.18}), null, [0, base + Hh/2, 0], false);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, Hh, W)), new THREE.LineBasicMaterial({color:0x7dd3fc})); edges.position.set(0, base + Hh/2, 0); E.root.add(edges);
    const N = 125, r = .16;
    const im = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 20, 14), E.mat(0x38bdf8, {roughness:.2, metalness:.1}), N); im.castShadow = true; E.root.add(im);
    const P = []; for(let i = 0; i < N; i++){ const ix = i%5, iy = Math.floor(i/25), iz = Math.floor(i/5)%5;
      P.push({home:E.V3((ix-2)*r*2.05, base + r + iy*r*2.05, (iz-2)*r*2.05), p:E.V3((ix-2)*r*2.05, base + r + iy*r*2.05, (iz-2)*r*2.05), v:E.V3((Math.random()-.5), (Math.random()-.5), (Math.random()-.5))}); }
    const col = new THREE.Color(), m4 = new THREE.Matrix4();
    let T = -20; const R = E.ui;
    R.head('MODEL PARTIKEL', 'Susunan & Gerak Partikel', 'Geser suhu untuk memanaskan atau mendinginkan zat (contoh: air).');
    const s = R.sec('Suhu'); R.slider(s, {label:'Suhu', min:-40, max:160, step:1, value:-20, unit:'°C', on:v => T = v});
    R.buttons(s, [{label:'🧊 Padat', on:() => setT(-20)}, {label:'💧 Cair', on:() => setT(50)}, {label:'☁️ Gas', on:() => setT(140)}]);
    const rd = R.reads(R.sec('Pengamatan'), [['w','Wujud'],['g','Gerak partikel'],['j','Jarak partikel'],['b','Bentuk & volume']]);
    R.sec('Ciri wujud zat', `<table style="width:100%;font-size:.85em;border-collapse:collapse"><tr><td></td><td><b>Padat</b></td><td><b>Cair</b></td><td><b>Gas</b></td></tr><tr><td>Bentuk</td><td>tetap</td><td>berubah</td><td>berubah</td></tr><tr><td>Volume</td><td>tetap</td><td>tetap</td><td>berubah</td></tr><tr><td>Gaya tarik</td><td>sangat kuat</td><td>lemah</td><td>sangat lemah</td></tr></table>`);
    const slider = s.querySelector('input'); function setT(v){ T = v; slider.value = v; slider.dispatchEvent(new Event('input')); }
    E.tick((dt, t) => {
      const st = T < 0 ? 0 : T < 100 ? 1 : 2, sp = .4 + (T + 40)/200*3.2;
      rd.w(['🧊 Padat','💧 Cair','☁️ Gas'][st]); rd.g(['Bergetar di tempat','Bergeser & berpindah','Bebas & sangat cepat'][st]); rd.j(['Sangat rapat','Agak renggang','Sangat renggang'][st]); rd.b(['Bentuk & volume tetap','Bentuk berubah, volume tetap','Bentuk & volume berubah'][st]);
      col.setHSL(.6 - Math.min(1, (T + 40)/200)*.6, .8, .55); im.material.color.lerp(col, .1);
      P.forEach((q, i) => {
        if(st === 0){ q.p.lerp(q.home, Math.min(1, dt*4)); q.p.x += Math.sin(t*30 + i)*.004*sp; q.p.y += Math.cos(t*27 + i*1.7)*.004*sp; }
        else { const g = st === 1 ? 4 : 0, damp = st === 1 ? .985 : 1;
          q.v.y -= g*dt; q.v.multiplyScalar(damp); q.v.x += (Math.random()-.5)*sp*dt*6; q.v.z += (Math.random()-.5)*sp*dt*6; q.v.y += (Math.random()-.5)*sp*dt*(st === 1 ? 3 : 6);
          const vmax = st === 1 ? 1.4 : 2.2 + sp; if(q.v.length() > vmax) q.v.setLength(vmax); if(st === 2 && q.v.length() < sp*.8) q.v.setLength(sp*.8);
          q.p.addScaledVector(q.v, dt); const lim = W/2 - r, top = st === 1 ? base + 1.5 : base + Hh - r;
          if(q.p.x < -lim){ q.p.x = -lim; q.v.x *= -1; } if(q.p.x > lim){ q.p.x = lim; q.v.x *= -1; }
          if(q.p.z < -lim){ q.p.z = -lim; q.v.z *= -1; } if(q.p.z > lim){ q.p.z = lim; q.v.z *= -1; }
          if(q.p.y < base + r){ q.p.y = base + r; q.v.y = Math.abs(q.v.y)*.6; } if(q.p.y > top){ q.p.y = top; q.v.y = -Math.abs(q.v.y); } }
        m4.setPosition(q.p); im.setMatrixAt(i, m4); });
      im.instanceMatrix.needsUpdate = true; });
   }},
  {id:'perubahan', label:'🔄 Perubahan Wujud', view:{target:[0,1.6,0], radius:12, theta:0, phi:1.2},
   say:'Perubahan wujud terjadi karena zat menerima atau melepaskan kalor. Mencair, menguap, dan menyublim memerlukan kalor. Membeku, mengembun, dan mengkristal melepaskan kalor.',
   build(E){
    E.platform(8);
    const pos = {padat:E.V3(-4,1,1.5), cair:E.V3(4,1,1.5), gas:E.V3(0,3.6,-2.5)};
    const ice = new THREE.Group(); ice.position.copy(pos.padat); E.root.add(ice);
    for(let i = 0; i < 6; i++){ const c = E.mesh(new THREE.BoxGeometry(.7, .7, .7), E.mat(0xbfe8ff, {transparent:true, opacity:.8, roughness:.05, metalness:.1}), ice, [(i%3-1)*.75, Math.floor(i/3)*.72 - .2, (i%2)*.3]); c.rotation.y = i*.3; }
    const water = new THREE.Group(); water.position.copy(pos.cair); E.root.add(water); beakerG(E, .9, 1.6, .55, 0x38bdf8, water, [0,-.9,0]);
    const cloud = new THREE.Group(); cloud.position.copy(pos.gas); E.root.add(cloud);
    for(let i = 0; i < 9; i++) E.mesh(new THREE.SphereGeometry(.45 + Math.random()*.3, 24, 16), E.mat(0xffffff, {roughness:.9, transparent:true, opacity:.92}), cloud, [(Math.random()-.5)*2.2, (Math.random()-.5)*.6, (Math.random()-.5)*.8]);
    E.label(ice, '🧊 PADAT', {cls:'big', off:E.V3(0, 1.2, 0)}); E.label(water, '💧 CAIR', {cls:'big', off:E.V3(0, 1.2, 0)}); E.label(cloud, '☁️ GAS', {cls:'big', off:E.V3(0, 1.1, 0)});
    const CH = [['padat','cair','Mencair','Menyerap kalor. Contoh: es batu mencair, lilin meleleh.',0xef4444],['cair','padat','Membeku','Melepas kalor. Contoh: air menjadi es di freezer.',0x3b82f6],
      ['cair','gas','Menguap','Menyerap kalor. Contoh: air mendidih, pakaian basah mengering.',0xef4444],['gas','cair','Mengembun','Melepas kalor. Contoh: titik air di luar gelas berisi es, embun pagi.',0x3b82f6],
      ['padat','gas','Menyublim','Menyerap kalor. Contoh: kapur barus (naftalena) mengecil, es kering.',0xef4444],['gas','padat','Mengkristal (deposisi)','Melepas kalor. Contoh: terbentuknya salju/bunga es dari uap air.',0x3b82f6]];
    const dots = [];
    CH.forEach(([a, b, nm, tx, c], i) => { const A = pos[a].clone(), B = pos[b].clone(), mid = A.clone().add(B).multiplyScalar(.5), side = (i%2 ? -1 : 1);
      const n = E.V3().subVectors(B, A).cross(E.V3(0,1,0)).normalize().multiplyScalar(side*.9); if(n.length() < .1) n.set(0, 0, side*.9); mid.add(n); mid.y += .6;
      const curve = new THREE.QuadraticBezierCurve3(A, mid, B); E.mesh(new THREE.TubeGeometry(curve, 40, .05, 8), E.mat(c, {emissive:c, emissiveIntensity:.4}), null, null, false);
      const d = E.mesh(new THREE.SphereGeometry(.14, 16, 12), E.mat(c, {emissive:c, emissiveIntensity:1}), null, null, false); dots.push({d, curve, o:Math.random()});
      const lbl = E.label(curve.getPoint(.5), (c === 0xef4444 ? '🔥 ' : '❄️ ') + nm, {onClick:() => { E.info(nm, `<p>${tx}</p>`); E.say('ch' + i, nm + '. ' + tx, false); }}); });
    E.tick((dt, t) => { dots.forEach(q => q.d.position.copy(q.curve.getPoint((t*.25 + q.o) % 1))); cloud.position.y = pos.gas.y + Math.sin(t)*.15; cloud.rotation.y += dt*.1; });
    E.ui.head('PERUBAHAN WUJUD', '6 Perubahan Wujud Zat', 'Ketuk label panah. 🔥 = menyerap kalor, ❄️ = melepas kalor.');
    E.ui.sec('Ringkasan', `<ul class="pts">${CH.map(c => `<li><b>${c[2]}</b>: ${c[0]} → ${c[1]}</li>`).join('')}</ul>`);
   }}
  ]
};

/* =====================================================================
   4. KALOR — pemanasan es, perpindahan kalor, pemuaian
   ===================================================================== */
T3['kalor'] = {
  title:'Suhu, Kalor & Pemuaian', titleHTML:'Suhu, <span>Kalor</span> & Pemuaian',
  greet:'Halo! Kalor adalah energi panas yang berpindah dari benda bersuhu tinggi ke benda bersuhu rendah. Ayo panaskan es dan amati grafik suhunya!',
  modes:[
  {id:'pemanasan', label:'🔥 Pemanasan Es', view:{target:[0,2,0], radius:8, theta:.4, phi:1.2},
   say:'Perhatikan grafiknya. Saat es mencair dan air mendidih, suhunya tetap walaupun terus dipanaskan. Kalor dipakai untuk mengubah wujud, disebut kalor laten.',
   build(E){
    E.platform(6);
    const stand = new THREE.Group(); E.root.add(stand);
    E.mesh(new THREE.TorusGeometry(1.15, .05, 8, 48), E.mat(0x475569, {metalness:.8}), stand, [0,1.9,0]).rotation.x = PI/2;
    for(let i = 0; i < 3; i++){ const a = i/3*PI*2; E.mesh(new THREE.CylinderGeometry(.04, .04, 1.9, 8), E.mat(0x475569, {metalness:.8}), stand, [Math.cos(a)*1.15, .95, Math.sin(a)*1.15]); }
    lathe(E, [[0,0],[.5,0],[.52,.08],[.42,.5],[.13,.62],[.13,.8]], E.glass(0xbae6fd), stand, [0,0,0]);
    const flame = new THREE.Group(); flame.position.set(0, .95, 0); E.root.add(flame);
    const f1 = E.mesh(new THREE.ConeGeometry(.22, .8, 24), new THREE.MeshBasicMaterial({color:0xfb923c, transparent:true, opacity:.85}), flame, [0,.3,0], false);
    const f2 = E.mesh(new THREE.ConeGeometry(.12, .5, 24), new THREE.MeshBasicMaterial({color:0x60a5fa, transparent:true, opacity:.9}), flame, [0,.2,0], false);
    const fl = new THREE.PointLight(0xff8a3d, 3, 6); fl.position.set(0, 1.3, 0); E.root.add(fl);
    const bk = beakerG(E, 1, 2, 0, 0, null, [0, 1.96, 0]);
    const water = E.mesh(new THREE.CylinderGeometry(.94, .94, 1, 48), E.mat(0x38bdf8, {transparent:true, opacity:.7, roughness:.05}), bk, [0,.5,0]); water.scale.y = .001;
    const ice = []; for(let i = 0; i < 7; i++){ const c = E.mesh(new THREE.BoxGeometry(.42, .42, .42), E.mat(0xe0f7ff, {transparent:true, opacity:.85, roughness:.05}), bk, [(Math.random()-.5)*1.1, .22 + Math.floor(i/4)*.42, (Math.random()-.5)*1.1]); c.rotation.set(Math.random(), Math.random(), 0); ice.push(c); }
    const bub = []; for(let i = 0; i < 30; i++){ const b = E.mesh(new THREE.SphereGeometry(.04 + Math.random()*.05, 8, 6), E.mat(0xffffff, {transparent:true, opacity:.6}), bk, [0,-5,0], false); bub.push(b); }
    const steam = []; for(let i = 0; i < 20; i++){ const s = E.mesh(new THREE.SphereGeometry(.2, 12, 8), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0, depthWrite:false}), bk, [0,2,0], false); steam.push({s, t:Math.random()*3}); }
    const th = new THREE.Group(); th.position.set(.55, 2.2, .1); th.rotation.z = -.15; bk.add(th);
    E.mesh(new THREE.CylinderGeometry(.05, .05, 2.4, 12), E.glass(), th, [0,0,0]); E.mesh(new THREE.SphereGeometry(.08, 12, 8), E.mat(0xdc2626), th, [0,-1.2,0]);
    const mer = E.mesh(new THREE.CylinderGeometry(.025, .025, 1, 8), E.mat(0xdc2626), th, [0,-1.2,0]); mer.geometry.translate(0, .5, 0);
    E.label(th, '🌡️', {off:E.V3(0, 1.4, 0)});
    // panel & grafik
    let T = -10, Q = 0, run = false, P = 400, melted = 0, boiled = 0, t0 = 0; const pts = [];
    E.ui.head('KALOR & PERUBAHAN WUJUD', 'Memanaskan Es hingga Mendidih', 'Tekan Mulai lalu amati suhu & grafiknya.');
    const s = E.ui.sec('Kontrol');
    E.ui.slider(s, {label:'Daya api', min:100, max:1200, step:50, value:400, unit:'W', on:v => P = v});
    E.ui.buttons(s, [{label:'▶ Mulai / Jeda', cls:'p', on:() => run = !run}, {label:'↺ Ulangi', on:() => { T = -10; Q = 0; melted = 0; boiled = 0; t0 = 0; pts.length = 0; run = false; }}, {label:'⏩ ×5', on:el => { el.classList.toggle('on'); E._fast = !E._fast; }}]);
    const rd = E.ui.reads(E.ui.sec('Pengamatan'), [['t','Suhu'],['w','Wujud'],['q','Kalor diserap'],['f','Fase']]);
    const gc = document.createElement('canvas'); gc.width = 600; gc.height = 300; gc.style.cssText = 'width:100%;background:rgba(127,127,127,.1);border-radius:.7em'; E.ui.sec('Grafik suhu terhadap waktu').appendChild(gc);
    E.ui.sec('Rumus', `<div class="formula">Q = m · c · ΔT</div><p>Saat berubah wujud: <b>Q = m · L</b> (L = kalor lebur/uap). Massa es 0,5 kg; c<sub>es</sub> = 2.100, c<sub>air</sub> = 4.200 J/kg°C; L<sub>lebur</sub> = 336.000 J/kg.</p>`);
    const m = .5, Lf = 336000, Lv = 2260000;
    function draw(){ const g = gc.getContext('2d'), W = gc.width, Hh = gc.height; g.clearRect(0,0,W,Hh); const dark = document.documentElement.dataset.theme !== 'light';
      g.strokeStyle = dark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.3)'; g.lineWidth = 2; g.beginPath(); g.moveTo(40,10); g.lineTo(40,Hh-30); g.lineTo(W-10,Hh-30); g.stroke();
      g.fillStyle = dark ? '#cbd5e1' : '#334155'; g.font = '18px Nunito'; g.fillText('°C', 6, 20); g.fillText('waktu', W-60, Hh-8);
      const y = v => Hh-30 - (v + 20)/140*(Hh-50); [0,100].forEach(v => { g.setLineDash([6,6]); g.beginPath(); g.moveTo(40, y(v)); g.lineTo(W-10, y(v)); g.stroke(); g.setLineDash([]); g.fillText(v, 8, y(v) + 6); });
      const maxT = Math.max(60, t0); g.strokeStyle = '#f97316'; g.lineWidth = 4; g.beginPath(); pts.forEach(([tt, v], i) => { const x = 40 + tt/maxT*(W-60); i ? g.lineTo(x, y(v)) : g.moveTo(x, y(v)); }); g.stroke(); }
    let acc = 0;
    E.tick((dt, t) => {
      if(run){ const k = dt*(E._fast ? 5 : 1)*20; // 1 detik nyata = 20 detik simulasi
        let q = P*k; Q += q; t0 += k;
        while(q > 0){ if(T < 0){ const need = m*2100*(0 - T); if(q < need){ T += q/(m*2100); q = 0; } else { T = 0; q -= need; } }
          else if(melted < 1){ const need = (1 - melted)*m*Lf; if(q < need){ melted += q/(m*Lf); q = 0; } else { melted = 1; q -= need; } }
          else if(T < 100){ const need = m*4200*(100 - T); if(q < need){ T += q/(m*4200); q = 0; } else { T = 100; q -= need; } }
          else { boiled = Math.min(.9, boiled + q/(m*Lv)); q = 0; } }
        acc += dt; if(acc > .15){ acc = 0; pts.push([t0, T]); draw(); } }
      flame.visible = fl.visible = run; f1.scale.y = 1 + Math.sin(t*20)*.1 + P/1200*.6; f2.scale.y = f1.scale.y*.9;
      ice.forEach((c, i) => c.scale.setScalar(Math.max(.001, 1 - melted*1.05 + i*.0)));
      water.scale.y = Math.max(.001, (melted*.9 + .02)*(1 - boiled*.6)); water.position.y = water.scale.y*.5;
      mer.scale.y = .25 + (T + 20)/140*2;
      const boiling = T >= 100 && run;
      bub.forEach((b, i) => { if(boiling || (T > 85 && run && Math.random() < .01)){ b.position.y += dt*(1 + i%3); if(b.position.y > water.scale.y || b.position.y < 0){ b.position.set((Math.random()-.5)*1.4, .05, (Math.random()-.5)*1.4); } } else b.position.y = -5; });
      steam.forEach(q => { q.t += dt; if(T > 70 && run){ const k = (q.t % 3)/3; q.s.position.set(Math.sin(q.t*2)*.3, water.scale.y + .3 + k*2.2, Math.cos(q.t*1.7)*.3); q.s.material.opacity = (1 - k)*.5*(T >= 100 ? 1 : .3); q.s.scale.setScalar(.6 + k*1.5); } else q.s.material.opacity = 0; });
      rd.t(`${T.toFixed(1).replace('.',',')} °C`); rd.w(melted <= 0 ? '🧊 Es (padat)' : melted < 1 ? '🧊+💧 Es & air' : T < 100 ? '💧 Air (cair)' : '💧+☁️ Mendidih'); rd.q(`${(Q/1000).toFixed(0)} kJ`);
      rd.f(T < 0 ? 'Suhu es naik' : melted < 1 ? 'Melebur — suhu tetap 0 °C' : T < 100 ? 'Suhu air naik' : 'Menguap — suhu tetap 100 °C');
    });
    draw();
   }},
  {id:'perpindahan', label:'♨️ Perpindahan Kalor', view:{target:[0,1.6,0], radius:12, theta:0, phi:1.2},
   say:'Kalor berpindah dengan tiga cara. Konduksi lewat zat padat tanpa perpindahan partikel, konveksi lewat aliran zat cair atau gas, dan radiasi tanpa perantara, misalnya panas Matahari.',
   build(E){
    E.platform(8);
    // konduksi: batang logam
    const k = new THREE.Group(); k.position.set(-4.2, 0, 0); E.root.add(k);
    const N = 14, segs = []; for(let i = 0; i < N; i++) segs.push(E.mesh(new THREE.BoxGeometry(.3, .3, .3), E.mat(0x94a3b8, {metalness:.7, roughness:.3}), k, [-1.9 + i*.3, 1.6, 0]));
    E.mesh(new THREE.CylinderGeometry(.06, .06, 1.5, 8), E.mat(0x334155), k, [1.9, .8, 0]);
    const kf = E.mesh(new THREE.ConeGeometry(.18, .6, 16), new THREE.MeshBasicMaterial({color:0xfb923c}), k, [-1.9, 1, 0], false);
    E.label(k, 'Konduksi', {cls:'big', off:E.V3(0, 2.6, 0), onClick:() => E.info('Konduksi', '<p>Perpindahan kalor melalui zat padat <b>tanpa</b> disertai perpindahan partikel. Contoh: sendok logam di dalam teh panas ikut menjadi panas. Logam = konduktor; kayu & plastik = isolator.</p>')});
    // konveksi: panci air
    const v = new THREE.Group(); E.root.add(v);
    lathe(E, [[0,0],[1,0],[1,1.4],[1.05,1.42]], E.mat(0x64748b, {metalness:.8, roughness:.3, side:THREE.DoubleSide}), v, [0,.6,0]);
    E.mesh(new THREE.CylinderGeometry(.97, .97, 1.2, 48), E.mat(0x38bdf8, {transparent:true, opacity:.45}), v, [0,1.25,0], false);
    const vf = E.mesh(new THREE.ConeGeometry(.3, .5, 16), new THREE.MeshBasicMaterial({color:0xfb923c}), v, [0,.3,0], false);
    const parts = []; for(let i = 0; i < 40; i++) parts.push({m:E.mesh(new THREE.SphereGeometry(.06, 8, 6), E.mat(0xef4444, {emissive:0xef4444, emissiveIntensity:.5}), v, [0,1,0], false), a:Math.random()*PI*2, s:i%2 ? 1 : -1, o:Math.random()});
    E.label(v, 'Konveksi', {cls:'big', off:E.V3(0, 2.6, 0), onClick:() => E.info('Konveksi', '<p>Perpindahan kalor yang <b>disertai</b> perpindahan partikel zat cair/gas. Air panas di bawah naik, air dingin di atas turun → arus konveksi. Contoh: merebus air, angin darat & angin laut.</p>')});
    // radiasi: api unggun & tangan
    const r = new THREE.Group(); r.position.set(4.2, 0, 0); E.root.add(r);
    for(let i = 0; i < 4; i++){ const l = E.mesh(new THREE.CylinderGeometry(.08, .08, 1.1, 8), E.mat(0x78350f), r, [0,.25,0]); l.rotation.set(PI/2.4, i*PI/2, 0); }
    const rf = E.mesh(new THREE.ConeGeometry(.4, 1.1, 16), new THREE.MeshBasicMaterial({color:0xf97316, transparent:true, opacity:.9}), r, [0,.85,0], false);
    const rl = new THREE.PointLight(0xff7a2f, 4, 8); rl.position.set(0, 1.2, 0); r.add(rl);
    const waves = []; for(let i = 0; i < 5; i++){ const w = E.mesh(new THREE.TorusGeometry(.5, .03, 6, 48, PI*.6), new THREE.MeshBasicMaterial({color:0xfbbf24, transparent:true}), r, [0,1,0], false); w.rotation.set(0, PI/2, -PI*.3); waves.push(w); }
    E.mesh(new THREE.SphereGeometry(.28, 16, 12), E.mat(0xf2c9a0), r, [1.8,1.2,0]).scale.set(.7, 1.2, 1);
    E.label(r, 'Radiasi', {cls:'big', off:E.V3(.6, 2.6, 0), onClick:() => E.info('Radiasi', '<p>Perpindahan kalor <b>tanpa zat perantara</b> (berupa gelombang elektromagnetik). Contoh: panas Matahari sampai ke Bumi, tangan terasa hangat di dekat api unggun. Benda hitam & kusam menyerap radiasi lebih baik.</p>')});
    E.tick((dt, t) => { const heat = (t*.35) % 6;
      segs.forEach((s, i) => { const h = Math.max(0, Math.min(1, heat - i*.35)); s.material.color.setRGB(.58 + h*.42, .64 - h*.3, .72 - h*.6); s.material.emissive = s.material.emissive || new THREE.Color(); s.material.emissive.setRGB(h*.6, h*.1, 0); });
      kf.scale.y = vf.scale.y = 1 + Math.sin(t*18)*.12; rf.scale.set(1 + Math.sin(t*9)*.08, 1 + Math.sin(t*13)*.15, 1);
      parts.forEach(p => { p.a += dt*.9; const k = (p.a/(PI*2) + p.o) % 1, side = p.s; let x, y;
        if(k < .25){ x = side*.2; y = .75 + k*4*1.0; } else if(k < .5){ x = side*(.2 + (k - .25)*4*.6); y = 1.75; } else if(k < .75){ x = side*.8; y = 1.75 - (k - .5)*4*1.0; } else { x = side*(.8 - (k - .75)*4*.6); y = .75; }
        p.m.position.set(x, y, Math.sin(p.o*9)*.4); const hot = k < .5 ? 1 : 0; p.m.material.color.setHex(hot ? 0xef4444 : 0x3b82f6); p.m.material.emissive.setHex(hot ? 0xef4444 : 0x3b82f6); });
      waves.forEach((w, i) => { const k = (t*.6 + i/5) % 1; w.position.x = .3 + k*1.4; w.scale.setScalar(.6 + k*1.2); w.material.opacity = 1 - k; }); });
    E.ui.head('PERPINDAHAN KALOR', 'Konduksi, Konveksi, Radiasi', 'Ketuk label tiap peragaan untuk penjelasan.');
    E.ui.sec('Contoh sehari-hari', '<ul class="pts"><li><b>Konduksi:</b> gagang panci logam menjadi panas.</li><li><b>Konveksi:</b> asap naik dari cerobong, AC dipasang di atas.</li><li><b>Radiasi:</b> menjemur pakaian di bawah Matahari.</li></ul><div class="note">Termos menahan ketiga cara: ruang hampa (konduksi & konveksi) dan dinding mengkilap (radiasi).</div>');
   }},
  {id:'pemuaian', label:'🛤️ Pemuaian', view:{target:[0,1.5,0], radius:10, theta:.3, phi:1.15},
   say:'Benda memuai ketika dipanaskan. Itulah sebabnya sambungan rel kereta api diberi celah, dan keping bimetal melengkung ke arah logam yang pemuaiannya lebih kecil.',
   build(E){
    E.platform(7);
    let T = 25;
    const rails = new THREE.Group(); rails.position.set(-1.5, 0, 1.5); E.root.add(rails);
    for(let i = 0; i < 7; i++) E.mesh(new THREE.BoxGeometry(.35, .12, 1.8), E.mat(0x78350f), rails, [-3 + i*1, .06, 0]);
    const rl = [E.mesh(new THREE.BoxGeometry(3, .2, .12), E.mat(0x9ca3af, {metalness:.85, roughness:.3}), rails, [-1.55, .22, -.5]), E.mesh(new THREE.BoxGeometry(3, .2, .12), E.mat(0x9ca3af, {metalness:.85, roughness:.3}), rails, [1.55, .22, -.5]),
      E.mesh(new THREE.BoxGeometry(3, .2, .12), E.mat(0x9ca3af, {metalness:.85, roughness:.3}), rails, [-1.55, .22, .5]), E.mesh(new THREE.BoxGeometry(3, .2, .12), E.mat(0x9ca3af, {metalness:.85, roughness:.3}), rails, [1.55, .22, .5])];
    E.label(E.V3(-1.5, .6, 1), 'Celah sambungan rel', {onClick:() => E.info('Celah rel kereta', '<p>Saat siang yang panas, rel memuai (memanjang). Celah kecil di sambungan memberi ruang agar rel tidak melengkung.</p>')});
    const bim = new THREE.Group(); bim.position.set(3, 1.6, -1.5); E.root.add(bim);
    const segN = 30, L = 3, a = [], b = [];
    for(let i = 0; i < segN; i++){ a.push(E.mesh(new THREE.BoxGeometry(L/segN*1.02, .12, .5), E.mat(0xb45309, {metalness:.8, roughness:.3}), bim)); b.push(E.mesh(new THREE.BoxGeometry(L/segN*1.02, .12, .5), E.mat(0xd1d5db, {metalness:.85, roughness:.25}), bim)); }
    E.mesh(new THREE.BoxGeometry(.3, 1.6, .7), E.mat(0x334155), bim, [-L/2 - .1, -.6, 0]);
    const bf = E.mesh(new THREE.ConeGeometry(.25, .7, 16), new THREE.MeshBasicMaterial({color:0xfb923c}), bim, [0, -.9, 0], false);
    E.label(bim, 'Keping bimetal', {off:E.V3(0, 1.2, 0), onClick:() => E.info('Keping bimetal', '<p>Dua logam berbeda (tembaga & besi) dikeling menjadi satu. Saat dipanaskan, tembaga memuai lebih besar sehingga keping melengkung ke arah besi. Dipakai pada setrika listrik & termostat.</p>')});
    E.ui.head('PEMUAIAN', 'Pemuaian Zat Padat', 'Ubah suhu dan amati celah rel serta lengkungan keping bimetal.');
    const s = E.ui.sec('Suhu'); E.ui.slider(s, {label:'Suhu', min:-10, max:80, step:1, value:25, unit:'°C', on:v => T = v});
    const rd = E.ui.reads(E.ui.sec('Pengamatan'), [['g','Celah rel'],['b','Bimetal']]);
    E.ui.sec('Rumus pemuaian panjang', '<div class="formula">ΔL = L₀ · α · ΔT</div><p>α = koefisien muai panjang (besi ≈ 0,000012 /°C, tembaga ≈ 0,000017 /°C).</p>');
    E.tick((dt, t) => { const gap = Math.max(.01, .12 - (T - 25)*.0016);
      rl[0].position.x = -1.5 - gap/2; rl[1].position.x = 1.5 + gap/2; rl[2].position.x = -1.5 - gap/2; rl[3].position.x = 1.5 + gap/2; const sx = 1 + (T - 25)*.0007; rl.forEach(r => r.scale.x = sx);
      const curv = (T - 25)*.006; let x = -L/2, y = 0, ang = 0;
      for(let i = 0; i < segN; i++){ const d = L/segN; ang += curv*d/ L*6; x += Math.cos(ang)*d; y += Math.sin(ang)*d;
        const nx = -Math.sin(ang), ny = Math.cos(ang); a[i].position.set(x - Math.cos(ang)*d/2 - nx*.06, y - Math.sin(ang)*d/2 - ny*.06, 0); a[i].rotation.z = ang; b[i].position.set(x - Math.cos(ang)*d/2 + nx*.06, y - Math.sin(ang)*d/2 + ny*.06, 0); b[i].rotation.z = ang; }
      bf.visible = T > 30; bf.scale.y = 1 + Math.sin(t*18)*.1;
      rd.g(`${(gap*10).toFixed(1).replace('.',',')} mm`); rd.b(T > 27 ? 'Melengkung ke atas ↑' : T < 23 ? 'Melengkung ke bawah ↓' : 'Lurus'); });
   }}
  ]
};

/* ===== Topik Lab Virtual 3D — bagian B (Kelas 7: biologi) ===== */
/* model organisme sederhana */
function mkOrganism(E, kind, parent){
  const g = new THREE.Group(); (parent || E.root).add(g); const M = E.mat;
  if(kind === 'archae'){ const b = E.mesh(new THREE.CapsuleGeometry(.35, .9, 8, 24), M(0xf97316, {emissive:0x7c2d12, emissiveIntensity:.4, roughness:.3}), g, [0,.9,0]); b.rotation.z = PI/2;
    for(let i = 0; i < 3; i++) E.mesh(new THREE.TorusGeometry(.37, .03, 8, 32), M(0xfdba74), g, [-.4 + i*.4, .9, 0]).rotation.y = PI/2; }
  else if(kind === 'bakteri'){ const b = E.mesh(new THREE.CapsuleGeometry(.32, .8, 8, 24), M(0x22c55e, {roughness:.35, transparent:true, opacity:.9}), g, [0,.9,0]); b.rotation.z = PI/2;
    E.mesh(new THREE.TorusKnotGeometry(.18, .04, 64, 8, 2, 3), M(0x14532d), g, [0,.9,0]);
    const c = new THREE.CatmullRomCurve3([E.V3(.75,.9,0), E.V3(1.1,1.1,0), E.V3(1.4,.8,0), E.V3(1.8,1.05,0), E.V3(2.1,.85,0)]); const fl = E.mesh(new THREE.TubeGeometry(c, 40, .025, 6), M(0x166534), g); g.userData.fl = fl; }
  else if(kind === 'protista'){ const geo = new THREE.SphereGeometry(.7, 48, 32); const b = E.mesh(geo, M(0xa78bfa, {transparent:true, opacity:.75, roughness:.2}), g, [0,.9,0]);
    b.userData.base = geo.attributes.position.array.slice(); g.userData.blob = b; E.mesh(new THREE.SphereGeometry(.22, 24, 16), M(0x5b21b6), g, [.1,.95,.1]);
    for(let i = 0; i < 5; i++) E.mesh(new THREE.SphereGeometry(.08, 12, 8), M(0xc4b5fd), g, [(Math.random()-.5)*.8, .9 + (Math.random()-.5)*.6, (Math.random()-.5)*.6]); }
  else if(kind === 'jamur'){ lathe(E, [[0,0],[.18,0],[.15,.6],[.14,1]], M(0xf5f5f4, {roughness:.8}), g, [0,0,0], 32);
    lathe(E, [[0,1.65],[.45,1.6],[.85,1.35],[.95,1.1],[.6,1.05],[0,1.05]], M(0xdc2626, {roughness:.5}), g, [0,0,0], 48);
    for(let i = 0; i < 9; i++){ const a = Math.random()*PI*2, r = .25 + Math.random()*.5; E.mesh(new THREE.SphereGeometry(.07, 10, 8), M(0xffffff), g, [Math.cos(a)*r, 1.6 - r*.35, Math.sin(a)*r]); } }
  else if(kind === 'tumbuhan'){ E.mesh(new THREE.CylinderGeometry(.12, .18, 1.3, 12), M(0x7c4a1e, {roughness:.9}), g, [0,.65,0]);
    [[0,1.6,0,.75],[.4,1.35,.2,.5],[-.35,1.4,-.2,.55],[.1,2,.1,.5]].forEach(([x,y,z,r]) => E.mesh(new THREE.IcosahedronGeometry(r, 2), M(0x16a34a, {roughness:.8, flatShading:true}), g, [x,y,z])); }
  else if(kind === 'hewan'){ const body = E.mesh(new THREE.SphereGeometry(.5, 32, 24), M(0x0ea5e9, {roughness:.3, metalness:.1}), g, [0,.95,0]); body.scale.set(1.5, .9, .7);
    const tail = E.mesh(new THREE.ConeGeometry(.35, .6, 4), M(0x0284c7), g, [-.95,.95,0]); tail.rotation.z = PI/2; g.userData.tail = tail;
    E.mesh(new THREE.ConeGeometry(.18, .45, 4), M(0x0284c7), g, [0,1.4,0]);
    [.15,-.15].forEach(z => { E.mesh(new THREE.SphereGeometry(.09, 12, 8), M(0xffffff), g, [.5,1.05,z*1.6]); E.mesh(new THREE.SphereGeometry(.05, 10, 8), M(0x0f172a), g, [.56,1.05,z*1.7]); }); }
  return g;
}
const KINGDOMS = [
  ['archae','Archaebacteria','🔥','Uniseluler, prokariotik (tanpa membran inti), hidup di lingkungan ekstrem: sumber air panas, kawah, air sangat asin.','Contoh: <i>Methanobacterium</i>, <i>Thermococcus</i>, <i>Halobacterium</i>.'],
  ['bakteri','Eubacteria','🦠','Uniseluler, prokariotik, dinding sel dari peptidoglikan. Ada yang menguntungkan dan ada yang menyebabkan penyakit.','Contoh: <i>Lactobacillus</i> (yoghurt), <i>Escherichia coli</i>, <i>Rhizobium</i>.'],
  ['protista','Protista','🧫','Eukariotik (memiliki membran inti), umumnya uniseluler, hidup di tempat lembap/berair. Ada yang mirip hewan, mirip tumbuhan, atau mirip jamur.','Contoh: <i>Amoeba</i>, <i>Paramecium</i>, <i>Euglena</i>, alga.'],
  ['jamur','Fungi (jamur)','🍄','Eukariotik, tidak berklorofil sehingga heterotrof (menyerap zat dari lingkungan), dinding sel dari kitin, berkembang biak dengan spora.','Contoh: jamur tiram, ragi (<i>Saccharomyces</i>), <i>Rhizopus</i> pada tempe.'],
  ['tumbuhan','Plantae (tumbuhan)','🌿','Eukariotik, multiseluler, berklorofil sehingga dapat berfotosintesis (autotrof), dinding sel dari selulosa.','Contoh: lumut, paku, mangga, padi.'],
  ['hewan','Animalia (hewan)','🐟','Eukariotik, multiseluler, tidak berklorofil (heterotrof), tidak berdinding sel, umumnya dapat bergerak aktif.','Contoh: ikan, kucing, burung, serangga.']];
T3['klasifikasi'] = {
  title:'Klasifikasi Makhluk Hidup', titleHTML:'Klasifikasi <span>Makhluk Hidup</span>',
  greet:'Halo! Makhluk hidup dikelompokkan ke dalam enam kingdom berdasarkan ciri-cirinya. Ketuk setiap model untuk mengenal ciri kingdom tersebut, lalu coba tantangan tebak kingdom!',
  modes:[
  {id:'kingdom', label:'🌍 6 Kingdom', view:{target:[0,1.5,0], radius:13, theta:0, phi:1.15},
   say:'Enam kingdom adalah Archaebacteria, Eubacteria, Protista, Fungi, Plantae, dan Animalia.',
   build(E){
    E.platform(8.5);
    const gs = [];
    KINGDOMS.forEach(([k, nm, ic, ciri, contoh], i) => { const a = i/6*PI*2 - PI/2, R = 5.4;
      const ped = E.mesh(new THREE.CylinderGeometry(1, 1.15, .5, 32), E.mat([0xf97316,0x22c55e,0xa78bfa,0xdc2626,0x16a34a,0x0ea5e9][i], {roughness:.35}), null, [Math.cos(a)*R, .25, Math.sin(a)*R]);
      const g = mkOrganism(E, k); g.position.set(Math.cos(a)*R, .3, Math.sin(a)*R); g.userData.k = k; gs.push(g);
      const show = () => { E.info(`${ic} ${nm}`, `<p>${ciri}</p><p>${contoh}</p>`); E.say('k_' + k, `${nm}. ${ciri.replace(/<[^>]+>/g,'')}`, false); E.setView({target:[g.position.x, 1.3, g.position.z], radius:5, theta:Math.atan2(g.position.x, g.position.z), phi:1.2}); };
      E.pick(g, show); E.pick(ped, show); E.label(g, `${ic} ${nm}`, {off:E.V3(0, 2.4, 0), onClick:show}); });
    E.tick((dt, t) => gs.forEach((g, i) => { g.rotation.y += dt*.4; g.children.forEach(c => {});
      if(g.userData.blob){ const geo = g.userData.blob.geometry, p = geo.attributes.position, b = g.userData.blob.userData.base; for(let j = 0; j < p.count; j++){ const x = b[j*3], y = b[j*3+1], z = b[j*3+2]; const f = 1 + .12*Math.sin(t*2 + x*4) * Math.cos(t*1.5 + z*5 + y*3); p.setXYZ(j, x*f, y*f, z*f); } p.needsUpdate = true; geo.computeVertexNormals(); }
      if(g.userData.tail) g.userData.tail.rotation.y = Math.sin(t*6)*.4;
      if(g.userData.fl) g.userData.fl.rotation.x = t*3; }));
    E.ui.head('KLASIFIKASI', 'Sistem 6 Kingdom', 'Ketuk model atau label untuk melihat ciri-ciri tiap kingdom.');
    E.ui.sec('Prokariotik vs eukariotik', '<p><b>Prokariotik:</b> tidak punya membran inti (Archaebacteria, Eubacteria).<br><b>Eukariotik:</b> punya membran inti (Protista, Fungi, Plantae, Animalia).</p>');
    E.ui.sec('Takson (dari besar ke kecil)', '<div class="formula" style="font-size:1em">Kingdom → Filum/Divisi → Kelas → Ordo → Famili → Genus → Spesies</div><p>Nama ilmiah memakai <b>tata nama ganda</b> (binomial nomenklatur): <i>Oryza sativa</i> (padi). Nama genus diawali huruf kapital, ditulis miring.</p>');
   }},
  {id:'tebak', label:'🎯 Tebak Kingdom', view:{target:[0,1.4,0], radius:6.5, theta:.4, phi:1.2},
   say:'Amati model makhluk hidup di tengah panggung, baca petunjuknya, lalu pilih kingdom yang tepat!',
   build(E){
    E.platform(5);
    const Q = [['archae','Aku hidup di sumber air panas bersuhu 80 °C dan tidak punya membran inti.'],['bakteri','Aku bersel satu, tanpa membran inti, dan membantu membuat yoghurt.'],['protista','Aku bersel satu, punya membran inti, dan bergerak dengan kaki semu.'],
      ['jamur','Aku tidak punya klorofil, dinding selku dari kitin, dan aku berkembang biak dengan spora.'],['tumbuhan','Aku punya klorofil dan membuat makanan sendiri lewat fotosintesis.'],['hewan','Aku bersel banyak, tidak punya dinding sel, dan dapat bergerak aktif.']];
    let order = Q.map((_, i) => i).sort(() => Math.random() - .5), idx = 0, score = 0, cur = null;
    const rd = {}; E.ui.head('TANTANGAN', 'Tebak Kingdom!', 'Baca petunjuk, amati modelnya, lalu pilih jawaban.');
    const hintEl = E.ui.html('<div class="note" style="font-size:1.05em"></div>').firstChild; const s = E.ui.sec('Pilih kingdom');
    const btns = E.ui.buttons(s, KINGDOMS.map(([k, nm, ic]) => ({label:`${ic} ${nm.split(' ')[0]}`, on:() => answer(k)})));
    const sc = E.ui.reads(E.ui.sec('Skor'), [['s','Benar'],['n','Soal']]);
    function next(){ if(cur) E.root.remove(cur); if(idx >= order.length){ hintEl.innerHTML = `🏆 Selesai! Skor ${score}/${order.length}. <button class="btn p" id="again">Main lagi</button>`; hintEl.querySelector('#again').onclick = () => { order.sort(() => Math.random() - .5); idx = 0; score = 0; next(); }; return; }
      const [k, tx] = Q[order[idx]]; cur = mkOrganism(E, k); cur.position.y = .3; hintEl.innerHTML = '🔎 ' + tx; sc.s(score); sc.n(`${idx+1}/${order.length}`); }
    function answer(k){ if(idx >= order.length) return; const [kk] = Q[order[idx]], nm = KINGDOMS.find(x => x[0] === kk)[1];
      if(k === kk){ score++; E.info('🎉 Tepat!', `<p>Itu <b>${nm}</b>.</p>`); } else E.info('❌ Belum tepat', `<p>Jawaban yang benar: <b>${nm}</b>. ${KINGDOMS.find(x => x[0] === kk)[3]}</p>`);
      idx++; setTimeout(next, 700); }
    E.tick((dt, t) => { if(cur){ cur.rotation.y += dt*.6; cur.position.y = .3 + Math.sin(t*2)*.08; } });
    next();
   }}
  ]
};

/* =====================================================================
   7. EKOSISTEM — diorama, rantai makanan, populasi
   ===================================================================== */
function mkAnimal(E, type, parent){
  const g = new THREE.Group(); (parent || E.root).add(g); const M = E.mat;
  if(type === 'kelinci'){ const b = E.mesh(new THREE.SphereGeometry(.28, 16, 12), M(0xe7e5e4), g, [0,.3,0]); b.scale.set(1.3, 1, 1);
    E.mesh(new THREE.SphereGeometry(.17, 16, 12), M(0xf5f5f4), g, [.32,.48,0]); [.07,-.07].forEach(z => { const e = E.mesh(new THREE.CapsuleGeometry(.04, .25, 4, 8), M(0xf5f5f4), g, [.28,.75,z]); e.rotation.z = -.2; });
    E.mesh(new THREE.SphereGeometry(.03, 8, 6), M(0x111827), g, [.46,.52,.08]); }
  else if(type === 'rubah'){ const b = E.mesh(new THREE.SphereGeometry(.32, 16, 12), M(0xea580c), g, [0,.45,0]); b.scale.set(1.6, .9, .9);
    E.mesh(new THREE.ConeGeometry(.2, .45, 12), M(0xf97316), g, [.6,.55,0]).rotation.z = -PI/2;
    [.09,-.09].forEach(z => E.mesh(new THREE.ConeGeometry(.07, .2, 6), M(0x9a3412), g, [.5,.78,z]));
    const tl = E.mesh(new THREE.ConeGeometry(.15, .6, 10), M(0xfdba74), g, [-.65,.5,0]); tl.rotation.z = PI/2 + .4;
    [[.3,.12],[.3,-.12],[-.3,.12],[-.3,-.12]].forEach(([x,z]) => E.mesh(new THREE.CylinderGeometry(.04, .04, .3, 6), M(0x7c2d12), g, [x,.15,z])); }
  else if(type === 'elang'){ const b = E.mesh(new THREE.SphereGeometry(.22, 16, 12), M(0x78350f), g, [0,0,0]); b.scale.set(1.6, .8, .8);
    E.mesh(new THREE.SphereGeometry(.13, 12, 8), M(0xf5f5f4), g, [.32,.08,0]); E.mesh(new THREE.ConeGeometry(.05, .14, 6), M(0xfbbf24), g, [.47,.05,0]).rotation.z = -PI/2;
    const w1 = E.mesh(new THREE.BoxGeometry(.5, .03, 1), M(0x92400e), g, [0,0,.55]), w2 = E.mesh(new THREE.BoxGeometry(.5, .03, 1), M(0x92400e), g, [0,0,-.55]); g.userData.w = [w1, w2]; }
  else if(type === 'belalang'){ const b = E.mesh(new THREE.CapsuleGeometry(.06, .3, 4, 8), M(0x65a30d), g, [0,.18,0]); b.rotation.z = PI/2; E.mesh(new THREE.BoxGeometry(.3, .02, .14), M(0x84cc16), g, [-.03,.24,0]); }
  return g;
}
T3['ekosistem'] = {
  title:'Ekosistem', titleHTML:'<span>Ekosistem</span>',
  greet:'Halo! Selamat datang di diorama ekosistem padang rumput. Amati komponen biotik dan abiotik, ikuti aliran energi dalam rantai makanan, dan atur keseimbangan populasi!',
  bg:{dark:[[0,'#0b2a4a'],[.6,'#1f5f8a'],[1,'#7cc4e8']], light:[[0,'#7cc4f0'],[.6,'#cfe9fb'],[1,'#f1f8fe']]},
  modes:[
  {id:'komponen', label:'🌳 Komponen', view:{target:[0,1,0], radius:16, theta:.5, phi:1.05},
   say:'Ekosistem terdiri atas komponen biotik, yaitu makhluk hidup, dan komponen abiotik, yaitu benda tak hidup seperti cahaya matahari, air, tanah, udara, dan suhu.',
   build(E){ buildDiorama(E, {});
    E.ui.head('KOMPONEN EKOSISTEM', 'Biotik & Abiotik', 'Ketuk label pada diorama untuk melihat perannya.');
    E.ui.sec('Biotik (makhluk hidup)', '<ul class="pts"><li><b>Produsen:</b> rumput, pohon (berfotosintesis)</li><li><b>Konsumen:</b> belalang, kelinci, rubah, elang</li><li><b>Pengurai:</b> jamur & bakteri (menguraikan sisa makhluk hidup)</li></ul>');
    E.ui.sec('Abiotik (tak hidup)', '<ul class="pts"><li>Cahaya matahari ☀️ · Air 💧 · Tanah 🟫 · Udara 🌬️ · Suhu 🌡️</li></ul>');
    E.ui.sec('Interaksi', '<p><b>Predasi</b> (rubah memangsa kelinci), <b>kompetisi</b> (rubah & elang berebut kelinci), <b>simbiosis</b> mutualisme, komensalisme, parasitisme.</p>'); }},
  {id:'rantai', label:'🔗 Rantai Makanan', view:{target:[0,1.5,0], radius:14, theta:0, phi:1.1},
   say:'Energi dalam rantai makanan mengalir dari Matahari ke produsen, lalu ke konsumen tingkat satu, dua, dan tiga. Pada setiap tingkat, hanya sekitar sepuluh persen energi yang berpindah.',
   build(E){ const D = buildDiorama(E, {few:true});
    const chain = [['☀️ Matahari','Sumber energi utama'],['🌾 Rumput','Produsen'],['🦗 Belalang','Konsumen I (herbivor)'],['🐸 Katak','Konsumen II'],['🐍 Ular','Konsumen III'],['🦅 Elang','Konsumen puncak']];
    const P = [E.V3(-6,5.5,-4), E.V3(-4.5,.6,1), E.V3(-2.2,.6,2), E.V3(0,.6,2.5), E.V3(2.4,.6,2), E.V3(4.5,3.5,0)];
    const items = []; P.forEach((p, i) => { if(i > 0 && i < 5){ const o = E.txtSprite(chain[i][0].split(' ')[0], {size:110, h:1}); o.position.copy(p).add(E.V3(0,.6,0)); E.root.add(o); items.push(o); }
      E.label(p.clone().add(E.V3(0, i === 0 || i === 5 ? 1 : 1.5, 0)), chain[i][0], {cls:'big', onClick:() => E.info(chain[i][0], `<p><b>${chain[i][1]}</b>${i > 0 ? `. Energi yang diterima ≈ ${[0,10000,1000,100,10,1][i]} kJ (dari 100.000 kJ energi Matahari yang ditangkap ekosistem, hanya ±10% berpindah ke tingkat berikutnya).` : '. Energi cahaya diubah produsen menjadi energi kimia (fotosintesis).'}</p>`)}); });
    const dots = [];
    for(let i = 0; i < P.length - 1; i++){ const c = new THREE.QuadraticBezierCurve3(P[i].clone().add(E.V3(0,.9,0)), P[i].clone().add(P[i+1]).multiplyScalar(.5).add(E.V3(0,2.4,0)), P[i+1].clone().add(E.V3(0,.9,0)));
      E.mesh(new THREE.TubeGeometry(c, 30, .05, 8), E.mat(0xfbbf24, {emissive:0xfbbf24, emissiveIntensity:.5}), null, null, false);
      for(let j = 0; j < 3; j++) dots.push({m:E.mesh(new THREE.SphereGeometry(.13 - i*.015, 12, 8), E.mat(0xfde047, {emissive:0xfbbf24, emissiveIntensity:1.5}), null, null, false), c, o:j/3}); }
    E.tick((dt, t) => { dots.forEach(d => d.m.position.copy(d.c.getPoint((t*.3 + d.o) % 1))); items.forEach((o, i) => o.position.y = P[i+1].y + .6 + Math.sin(t*2 + i)*.1); });
    E.ui.head('ALIRAN ENERGI', 'Rantai Makanan', 'Titik kuning = energi yang mengalir. Ketuk label tiap tingkat trofik.');
    E.ui.sec('Piramida energi', '<div style="display:grid;gap:4px;justify-items:center">' + [['Elang',20],['Ular',36],['Katak',52],['Belalang',72],['Rumput',96]].map(([n,w]) => `<div style="width:${w}%;background:linear-gradient(90deg,#16a34a,#84cc16);color:#fff;border-radius:6px;text-align:center;font-weight:900;padding:3px">${n}</div>`).join('') + '</div><p>Makin ke atas, jumlah energi makin sedikit. Kumpulan rantai makanan yang saling berhubungan disebut <b>jaring-jaring makanan</b>.</p>');
   }},
  {id:'populasi', label:'📈 Populasi', view:{target:[0,1,0], radius:15, theta:.6, phi:1.05},
   say:'Atur jumlah kelinci dan rubah, lalu jalankan simulasi. Jika rubah terlalu banyak, kelinci habis dan akhirnya rubah pun kelaparan. Ekosistem seimbang jika populasinya terkendali.',
   build(E){ const D = buildDiorama(E, {few:true, noAnimals:true});
    let rab = 20, fox = 4, grass = 1, run = false, t0 = 0; const hist = [];
    const pool = {kelinci:[], rubah:[]};
    function sync(){ ['kelinci','rubah'].forEach(k => { const n = Math.round(k === 'kelinci' ? rab : fox), arr = pool[k];
      while(arr.length < Math.min(n, 40)){ const a = mkAnimal(E, k); const r = 2 + Math.random()*4.5, ang = Math.random()*PI*2; a.position.set(Math.cos(ang)*r, 0, Math.sin(ang)*r); a.userData.v = Math.random()*PI*2; arr.push(a); }
      while(arr.length > Math.min(n, 40)){ E.root.remove(arr.pop()); } }); }
    E.ui.head('KESEIMBANGAN', 'Populasi Pemangsa & Mangsa', 'Atur populasi awal lalu jalankan simulasinya.');
    const s = E.ui.sec('Populasi awal');
    const sR = E.ui.slider(s, {label:'🐇 Kelinci', min:2, max:40, value:20, on:v => { if(!run){ rab = v; sync(); } }});
    const sF = E.ui.slider(s, {label:'🦊 Rubah', min:0, max:15, value:4, on:v => { if(!run){ fox = v; sync(); } }});
    E.ui.slider(s, {label:'🌾 Rumput', min:.3, max:1.5, step:.1, value:1, unit:'×', on:v => grass = v});
    E.ui.buttons(s, [{label:'▶ Jalankan / Jeda', cls:'p', on:() => run = !run}, {label:'↺ Ulangi', on:() => { run = false; rab = sR.get(); fox = sF.get(); hist.length = 0; t0 = 0; sync(); draw(); }}]);
    const rd = E.ui.reads(E.ui.sec('Saat ini'), [['r','🐇 Kelinci'],['f','🦊 Rubah'],['y','Waktu'],['k','Kondisi']]);
    const gc = document.createElement('canvas'); gc.width = 600; gc.height = 260; gc.style.cssText = 'width:100%;background:rgba(127,127,127,.1);border-radius:.7em'; E.ui.sec('Grafik populasi').appendChild(gc);
    function draw(){ const g = gc.getContext('2d'), W = gc.width, H = gc.height; g.clearRect(0,0,W,H); const mx = Math.max(40, ...hist.map(h => Math.max(h[0], h[1]*3)));
      [[0,'#e7e5e4',1],[1,'#f97316',3]].forEach(([k, c, sc]) => { g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); hist.forEach((h, i) => { const x = i/Math.max(1, hist.length - 1)*(W - 20) + 10, y = H - 10 - h[k]*sc/mx*(H - 20); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); });
      g.fillStyle = '#e7e5e4'; g.font = 'bold 20px Nunito'; g.fillText('Kelinci', 14, 24); g.fillStyle = '#f97316'; g.fillText('Rubah (×3)', 110, 24); }
    let acc = 0; sync();
    E.tick((dt, t) => {
      if(run){ const h = dt*.8; t0 += h; const dr = (.6*grass*rab*(1 - rab/(60*grass)) - .045*rab*fox)*h, df = (.012*rab*fox - .35*fox)*h; rab = Math.max(0, rab + dr); fox = Math.max(0, fox + df);
        acc += dt; if(acc > .25){ acc = 0; hist.push([rab, fox]); if(hist.length > 200) hist.shift(); draw(); sync(); } }
      rd.r(Math.round(rab)); rd.f(Math.round(fox)); rd.y(`${Math.round(t0*12)} bulan`); rd.k(rab < 2 ? '⚠️ Kelinci hampir punah' : fox < .5 ? '⚠️ Tanpa pemangsa' : rab > 45 ? '⚠️ Kelinci berlebih' : '✅ Cukup seimbang');
      ['kelinci','rubah'].forEach(k => pool[k].forEach((a, i) => { a.userData.v += (Math.random()-.5)*dt*2; const sp = k === 'kelinci' ? 1.2 : .9;
        a.position.x += Math.cos(a.userData.v)*dt*sp; a.position.z += Math.sin(a.userData.v)*dt*sp; const r = Math.hypot(a.position.x, a.position.z);
        if(r > 7 || r < 1.6){ a.userData.v += PI; a.position.multiplyScalar(r > 7 ? 7/r : 1.6/r); } a.rotation.y = -a.userData.v; a.position.y = k === 'kelinci' ? Math.abs(Math.sin(t*8 + i))*.15 : 0; })); });
   }}
  ]
};
function buildDiorama(E, o){
  const g = E.root, M = E.mat;
  const gtex = canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#4d9a3a'; c.fillRect(0,0,w,h); for(let i = 0; i < 6000; i++){ c.fillStyle = ['#3f8a30','#5bab45','#6cbc4f','#468f35'][i%4]; c.fillRect(Math.random()*w, Math.random()*h, 3, 6); } });
  gtex.wrapS = gtex.wrapT = THREE.RepeatWrapping; gtex.repeat.set(4, 4);
  const ground = E.mesh(new THREE.CylinderGeometry(8, 7.6, .8, 64), [M(0x6b4423, {roughness:1}), new THREE.MeshStandardMaterial({map:gtex, roughness:1}), M(0x6b4423)], null, [0,-.4,0]);
  const pond = E.mesh(new THREE.CircleGeometry(1.7, 48), M(0x2563eb, {roughness:.05, metalness:.2, transparent:true, opacity:.85}), null, [3.5,.02,-2.5], false); pond.rotation.x = -PI/2;
  E.label(pond, '💧 Air (abiotik)', {onClick:() => E.info('Air', '<p>Komponen abiotik yang dibutuhkan semua makhluk hidup untuk minum, fotosintesis, dan tempat hidup ikan & katak.</p>')});
  const sunM = E.mesh(new THREE.SphereGeometry(.8, 32, 16), new THREE.MeshBasicMaterial({color:0xfde047}), null, [-6,5.5,-4], false);
  E.label(sunM, '☀️ Cahaya Matahari', {onClick:() => E.info('Cahaya Matahari', '<p>Sumber energi utama ekosistem. Produsen memakai cahaya untuk fotosintesis.</p>')});
  const rock = E.mesh(new THREE.DodecahedronGeometry(.7, 0), M(0x78716c, {flatShading:true}), null, [-2.8,.3,-3.5]); E.label(rock, '🪨 Tanah & batu', {onClick:() => E.info('Tanah', '<p>Abiotik: tempat tumbuh tumbuhan dan sumber mineral. Pengurai mengembalikan mineral ke tanah.</p>')});
  const trees = []; for(let i = 0; i < (o.few ? 5 : 9); i++){ const a = i/(o.few ? 5 : 9)*PI*2 + .3, r = 5.6 + Math.random()*1.4, t = mkOrganism(E, 'tumbuhan'); t.position.set(Math.cos(a)*r, 0, Math.sin(a)*r); t.scale.setScalar(.9 + Math.random()*.6); trees.push(t); }
  E.label(trees[0], '🌳 Pohon (produsen)', {off:E.V3(0, 2.6, 0), onClick:() => E.info('Produsen', '<p>Tumbuhan hijau membuat makanan sendiri melalui fotosintesis: CO₂ + air + cahaya → glukosa + O₂.</p>')});
  const grassGeo = new THREE.ConeGeometry(.06, .45, 4), gim = new THREE.InstancedMesh(grassGeo, M(0x65a30d), 600), m4 = new THREE.Matrix4();
  for(let i = 0; i < 600; i++){ const a = Math.random()*PI*2, r = 1 + Math.random()*6.6; if(Math.hypot(Math.cos(a)*r - 3.5, Math.sin(a)*r + 2.5) < 1.8){ m4.makeScale(0,0,0); } else m4.compose(E.V3(Math.cos(a)*r, .2, Math.sin(a)*r), new THREE.Quaternion(), E.V3(1, .6 + Math.random(), 1)); gim.setMatrixAt(i, m4); }
  E.root.add(gim);
  const mush = mkOrganism(E, 'jamur'); mush.scale.setScalar(.35); mush.position.set(-1.6, 0, -3.6); E.label(mush, '🍄 Jamur (pengurai)', {off:E.V3(0,.8,0), onClick:() => E.info('Pengurai', '<p>Jamur & bakteri menguraikan bangkai dan sisa makhluk hidup menjadi zat yang menyuburkan tanah.</p>')});
  const animals = [];
  if(!o.noAnimals){ [['kelinci',4],['rubah',2],['belalang',4]].forEach(([k, n]) => { for(let i = 0; i < (o.few ? 1 : n); i++){ const a = mkAnimal(E, k); const r = 2 + Math.random()*4, ang = Math.random()*PI*2; a.position.set(Math.cos(ang)*r, 0, Math.sin(ang)*r); a.userData.v = Math.random()*PI*2; a.userData.k = k; animals.push(a); } });
    const kl = animals.find(a => a.userData.k === 'kelinci'), rb = animals.find(a => a.userData.k === 'rubah');
    if(kl && !o.few) E.label(kl, '🐇 Kelinci (konsumen I)', {off:E.V3(0,1,0)}); if(rb && !o.few) E.label(rb, '🦊 Rubah (konsumen II)', {off:E.V3(0,1.1,0)}); }
  const eagle = mkAnimal(E, 'elang'); eagle.position.set(0, 4.5, 0); if(!o.few) E.label(eagle, '🦅 Elang (konsumen puncak)', {off:E.V3(0,.6,0)});
  E.tick((dt, t) => { eagle.position.set(Math.cos(t*.35)*5, 4.6 + Math.sin(t)*.3, Math.sin(t*.35)*5); eagle.rotation.y = -t*.35 - PI/2; eagle.userData.w.forEach((w, i) => w.rotation.x = Math.sin(t*6)*.4*(i ? -1 : 1));
    animals.forEach((a, i) => { a.userData.v += (Math.random()-.5)*dt*2; a.position.x += Math.cos(a.userData.v)*dt*.6; a.position.z += Math.sin(a.userData.v)*dt*.6;
      const r = Math.hypot(a.position.x, a.position.z); if(r > 6.8 || r < 1.4){ a.userData.v += PI; a.position.multiplyScalar(r > 6.8 ? 6.8/r : 1.4/r); } a.rotation.y = -a.userData.v; if(a.userData.k === 'kelinci') a.position.y = Math.abs(Math.sin(t*7 + i))*.15; }); });
  return {ground, animals};
}

/* ===== Topik Lab Virtual 3D — bagian C (Kelas 8) ===== */
/* =====================================================================
   9. SEL — sel hewan & sel tumbuhan
   ===================================================================== */
const ORG = {
  membran:['Membran sel','Lapisan tipis yang membungkus sel dan mengatur keluar-masuknya zat (selektif permeabel).'],
  dinding:['Dinding sel','Lapisan kaku dari selulosa di luar membran sel tumbuhan; memberi bentuk tetap & melindungi sel. Tidak dimiliki sel hewan.'],
  nukleus:['Nukleus (inti sel)','Pusat pengatur seluruh kegiatan sel; menyimpan materi genetik (DNA). Di dalamnya ada nukleolus (anak inti).'],
  mito:['Mitokondria','“Pembangkit energi” sel: tempat respirasi sel yang menghasilkan energi (ATP) dari glukosa dan oksigen.'],
  re:['Retikulum endoplasma','Jaringan saluran untuk mengangkut zat di dalam sel. RE kasar ditempeli ribosom; RE halus membuat lemak.'],
  golgi:['Badan Golgi','Mengemas dan mengirim protein/zat ke luar sel, seperti “kantor pos” sel.'],
  ribo:['Ribosom','Butiran kecil tempat sintesis (pembuatan) protein.'],
  liso:['Lisosom','Kantong berisi enzim pencerna; menghancurkan zat sisa atau bagian sel yang rusak. Umumnya pada sel hewan.'],
  sentri:['Sentriol','Berperan saat pembelahan sel; hanya dimiliki sel hewan.'],
  klorofil:['Kloroplas','Organel berklorofil (zat hijau daun) tempat fotosintesis; hanya dimiliki sel tumbuhan.'],
  vakuola:['Vakuola','Kantong berisi air, cadangan makanan, dan sisa metabolisme. Pada sel tumbuhan berukuran besar; pada sel hewan kecil atau tidak ada.'],
  sito:['Sitoplasma','Cairan kental di dalam sel tempat organel-organel berada dan reaksi kimia berlangsung.']
};
function cellBuild(E, plant){
  E.platform(7);
  const C = new THREE.Group(); C.position.y = 2.4; E.root.add(C); const M = E.mat;
  const show = k => () => { E.info(ORG[k][0], `<p>${ORG[k][1]}</p>`); E.say('o_' + k, ORG[k][0] + '. ' + ORG[k][1], false); };
  const lab = (obj, k, off) => { E.pick(obj, show(k)); E.label(obj, ORG[k][0], {off:off || E.V3(0,.35,0), onClick:show(k)}); };
  if(plant){
    const W = 4.2, H = 3, D = 3.2;
    const wall = E.mesh(new THREE.BoxGeometry(W, H, D), M(0x65a30d, {transparent:true, opacity:.22, side:THREE.DoubleSide, depthWrite:false}), C, null, false);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)), new THREE.LineBasicMaterial({color:0x3f6212})); C.add(edges);
    E.mesh(new THREE.BoxGeometry(W - .15, H - .15, D - .15), M(0xbef264, {transparent:true, opacity:.12, depthWrite:false}), C, null, false);
    lab(wall, 'dinding', E.V3(-W/2 + .3, H/2, D/2));
    const vac = E.mesh(new THREE.BoxGeometry(2.2, 1.8, 1.8, 6, 6, 6), M(0x7dd3fc, {transparent:true, opacity:.45, roughness:.05}), C, [.4,0,0], false); lab(vac, 'vakuola');
    for(let i = 0; i < 9; i++){ const a = i/9*PI*2; const k = E.mesh(new THREE.SphereGeometry(.28, 24, 16), M(0x16a34a, {roughness:.4}), C, [Math.cos(a)*1.65, Math.sin(a)*1.1, (i%2 ? 1 : -1)*1.15]); k.scale.set(1.5, .8, .8); k.rotation.z = a;
      for(let j = 0; j < 3; j++) E.mesh(new THREE.CylinderGeometry(.13, .13, .04, 16), M(0x14532d), k, [(j-1)*.14, 0, .2]).rotation.x = PI/2;
      if(i === 0) lab(k, 'klorofil'); }
    const nu = E.mesh(new THREE.SphereGeometry(.55, 32, 24), M(0x7c3aed, {transparent:true, opacity:.85, roughness:.3}), C, [-1.4,.6,0]); E.mesh(new THREE.SphereGeometry(.2, 16, 12), M(0x4c1d95), nu, [.1,.1,.2]); lab(nu, 'nukleus');
  } else {
    const mem = E.mesh(new THREE.SphereGeometry(2.3, 64, 48, 0, PI*1.5), M(0xfda4af, {transparent:true, opacity:.35, side:THREE.DoubleSide, roughness:.2, depthWrite:false}), C, null, false); mem.scale.set(1.15, .9, 1);
    const cut = E.mesh(new THREE.CircleGeometry(2.3, 64, PI*1.5, PI*.5), M(0xfecdd3, {transparent:true, opacity:.15, side:THREE.DoubleSide, depthWrite:false}), C, null, false); cut.scale.set(1.15, .9, 1);
    lab(mem, 'membran', E.V3(-1.8, 1.6, -1));
    const nu = E.mesh(new THREE.SphereGeometry(.75, 32, 24), M(0x7c3aed, {transparent:true, opacity:.9, roughness:.3}), C, [0,0,0]); E.mesh(new THREE.SphereGeometry(.28, 16, 12), M(0x4c1d95), nu, [.2,.2,.4]); lab(nu, 'nukleus', E.V3(0,.9,0));
    for(let i = 0; i < 4; i++){ const l = E.mesh(new THREE.SphereGeometry(.16, 16, 12), M(0xf59e0b), C, [Math.cos(i*1.7)*1.6, Math.sin(i*2.1)*.9, Math.sin(i*1.3)*1.2]); if(i === 0) lab(l, 'liso'); }
    const sc = new THREE.Group(); sc.position.set(.9, 1, .9); C.add(sc); E.mesh(new THREE.CylinderGeometry(.08, .08, .35, 9), M(0x0ea5e9), sc); E.mesh(new THREE.CylinderGeometry(.08, .08, .35, 9), M(0x0ea5e9), sc, [.15,0,0]).rotation.z = PI/2; lab(sc, 'sentri');
  }
  // organel bersama
  for(let i = 0; i < (plant ? 3 : 5); i++){ const m = E.mesh(new THREE.CapsuleGeometry(.16, .45, 8, 16), M(0xf97316, {roughness:.4}), C, plant ? [-1.5 + i*.4, -.9, .9 - i*.5] : [Math.cos(i*1.3 + 1)*1.5, Math.sin(i*2)*.8, Math.cos(i*2.2)*1.3]); m.rotation.set(i, i*2, 0);
    E.mesh(new THREE.TorusGeometry(.12, .02, 6, 16), M(0x9a3412), m, [0,.1,0]).rotation.x = PI/2; E.mesh(new THREE.TorusGeometry(.12, .02, 6, 16), M(0x9a3412), m, [0,-.1,0]).rotation.x = PI/2; if(i === 0) lab(m, 'mito'); }
  const reC = new THREE.CatmullRomCurve3(Array.from({length:12}, (_, i) => E.V3(Math.cos(i*.5)*(1 + i*.03) + (plant ? -1.4 : 0), Math.sin(i*1.4)*.25 + (plant ? -.3 : -.4), Math.sin(i*.5)*(1 + i*.03))));
  const re = E.mesh(new THREE.TubeGeometry(reC, 120, .07, 8), M(0x3b82f6, {roughness:.4}), C); lab(re, 're');
  const ribos = new THREE.InstancedMesh(new THREE.SphereGeometry(.035, 6, 4), M(0x1e3a8a), 160), m4 = new THREE.Matrix4();
  for(let i = 0; i < 160; i++){ const p = reC.getPoint(Math.random()); p.add(E.V3((Math.random()-.5)*.25, (Math.random()-.5)*.25, (Math.random()-.5)*.25)); m4.setPosition(p); ribos.setMatrixAt(i, m4); } C.add(ribos);
  const rbl = new THREE.Object3D(); rbl.position.copy(reC.getPoint(.85)); C.add(rbl); E.label(rbl, ORG.ribo[0], {onClick:show('ribo')});
  const go = new THREE.Group(); go.position.set(plant ? -1.6 : -1.3, plant ? -.2 : .7, plant ? -.9 : .6); C.add(go);
  for(let i = 0; i < 5; i++) E.mesh(new THREE.TorusGeometry(.45 - i*.03, .06, 8, 24, PI*.9), M(0xec4899, {roughness:.4}), go, [0, i*.13, 0]).rotation.set(PI/2, 0, PI*1.05);
  lab(go, 'golgi');
  const sl = new THREE.Object3D(); sl.position.set(plant ? 1.6 : 1.6, plant ? -1.1 : -.9, plant ? -1 : 1.2); C.add(sl); E.label(sl, ORG.sito[0], {onClick:show('sito')});
  E.tick((dt, t) => { C.rotation.y += dt*.12; C.position.y = 2.4 + Math.sin(t)*.05; });
  return C;
}
T3['sel'] = {
  title:'Sel', titleHTML:'Struktur <span>Sel</span>',
  greet:'Halo! Sel adalah unit terkecil penyusun makhluk hidup. Bandingkan sel hewan dan sel tumbuhan, lalu ketuk setiap organel untuk mengetahui fungsinya!',
  modes:[
  {id:'hewan', label:'🐾 Sel Hewan', view:{target:[0,2.4,0], radius:8, theta:.6, phi:1.15, minR:3},
   say:'Sel hewan bentuknya tidak tetap, tidak memiliki dinding sel dan kloroplas, tetapi memiliki sentriol dan lisosom.',
   build(E){ cellBuild(E, false); E.ui.head('SEL HEWAN', 'Bagian-bagian Sel Hewan', 'Sel diiris agar bagian dalamnya terlihat. Ketuk organel atau labelnya.');
     E.ui.sec('Ciri sel hewan', '<ul class="pts"><li>Bentuk tidak tetap (cenderung bulat)</li><li>Tidak berdinding sel & tidak berkloroplas</li><li>Memiliki sentriol & lisosom</li><li>Vakuola kecil atau tidak ada</li></ul>'); orgList(E); }},
  {id:'tumbuhan', label:'🌿 Sel Tumbuhan', view:{target:[0,2.4,0], radius:8.5, theta:.6, phi:1.15, minR:3},
   say:'Sel tumbuhan bentuknya tetap karena memiliki dinding sel. Sel tumbuhan juga memiliki kloroplas untuk fotosintesis dan vakuola yang besar.',
   build(E){ cellBuild(E, true); E.ui.head('SEL TUMBUHAN', 'Bagian-bagian Sel Tumbuhan', 'Dinding sel dibuat transparan. Ketuk organel atau labelnya.');
     E.ui.sec('Ciri sel tumbuhan', '<ul class="pts"><li>Bentuk tetap (cenderung kotak)</li><li>Memiliki dinding sel (selulosa)</li><li>Memiliki kloroplas → fotosintesis</li><li>Vakuola besar di tengah</li><li>Tidak memiliki sentriol</li></ul>'); orgList(E); }},
  {id:'banding', label:'⚖️ Bandingkan', view:{target:[0,2.4,0], radius:13, theta:0, phi:1.2},
   say:'Inilah sel hewan dan sel tumbuhan berdampingan. Perhatikan perbedaan bentuk, dinding sel, kloroplas, dan ukuran vakuolanya.',
   build(E){ const a = cellBuild(E, false); a.position.x = -3; const b = cellBuild(E, true); b.position.x = 3; b.scale.setScalar(.85);
     E.label(a, '🐾 Sel hewan', {cls:'big', off:E.V3(0, 2.6, 0)}); E.label(b, '🌿 Sel tumbuhan', {cls:'big', off:E.V3(0, 2.6, 0)});
     E.ui.head('PERBANDINGAN', 'Sel Hewan vs Sel Tumbuhan');
     E.ui.sec('Tabel perbedaan', `<table style="width:100%;font-size:.88em;border-collapse:collapse">${[['Bentuk','tidak tetap','tetap'],['Dinding sel','–','✔'],['Kloroplas','–','✔'],['Vakuola','kecil/tidak ada','besar'],['Sentriol','✔','–'],['Lisosom','✔','jarang']].map(r => `<tr><td style="padding:.3em 0;border-bottom:1px solid var(--line)"><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}<tr><td></td><td><b>Hewan</b></td><td><b>Tumbuhan</b></td></tr></table>`); }}
  ]
};
function orgList(E){ E.ui.sec('Fungsi organel', `<ul class="pts">${['nukleus','mito','re','ribo','golgi','vakuola'].map(k => `<li><b>${ORG[k][0]}</b>: ${ORG[k][1].split('.')[0]}.</li>`).join('')}</ul>`); }

/* =====================================================================
   10. SISTEM ORGAN — pencernaan, pernapasan, peredaran darah
   ===================================================================== */
function bodyShell(E){
  const M = E.mat, sk = M(0xfcd5b5, {transparent:true, opacity:.18, roughness:.4, depthWrite:false});
  const B = new THREE.Group(); E.root.add(B);
  lathe(E, [[0,0],[.75,.05],[.95,.6],[1.05,1.6],[1.15,2.6],[1.3,3.1],[1.2,3.35],[.45,3.5],[.3,3.7],[0,3.72]], sk, B, [0,0,0], 48).castShadow = false;
  E.mesh(new THREE.SphereGeometry(.55, 32, 24), sk, B, [0,4.2,0], false).scale.set(.9, 1.1, 1);
  [-1, 1].forEach(s => { const a = E.mesh(new THREE.CapsuleGeometry(.22, 2.1, 8, 16), sk, B, [s*1.45, 2.1, 0], false); a.rotation.z = s*.12; });
  B.position.y = .6; return B;
}
function organ(E, geo, color, parent, pos, scale, k, info){ const m = E.mesh(geo, E.mat(color, {roughness:.45}), parent, pos); if(scale) m.scale.set(...scale);
  if(k){ const fn = () => { E.info(k, `<p>${info}</p>`); E.say('org_' + k.split(' ')[0].toLowerCase(), k + '. ' + info, false); }; E.pick(m, fn); E.label(m, k, {onClick:fn}); } return m; }
T3['sistem-organ'] = {
  title:'Sistem Organ Manusia', titleHTML:'Sistem <span>Organ</span> Manusia',
  greet:'Halo! Tubuh kita tersusun atas sistem organ yang bekerja sama. Pilih sistem pencernaan, pernapasan, atau peredaran darah, lalu amati alirannya!',
  modes:[
  {id:'cerna', label:'🍎 Pencernaan', view:{target:[0,2.8,0], radius:7.5, theta:.3, phi:1.25, minR:3},
   say:'Makanan dicerna mulai dari mulut, lalu kerongkongan, lambung, usus halus, usus besar, hingga sisa makanan dikeluarkan melalui anus. Penyerapan sari makanan terjadi di usus halus.',
   build(E){ E.platform(4); const B = bodyShell(E);
    organ(E, new THREE.SphereGeometry(.18, 16, 12), 0xdc2626, B, [0,3.95,.4], [1.4,.6,1], 'Mulut', 'Pencernaan mekanik (dikunyah gigi) dan kimiawi (enzim amilase pada air liur mengubah amilum menjadi gula).');
    organ(E, new THREE.CylinderGeometry(.07, .07, 1.4, 12), 0xf472b6, B, [0,3.1,.1], null, 'Kerongkongan', 'Menyalurkan makanan ke lambung dengan gerak peristaltik (gerakan meremas-dorong).');
    organ(E, new THREE.SphereGeometry(.42, 32, 24), 0xf9a8d4, B, [.3,2.1,.15], [1.3,.8,.7], 'Lambung', 'Mengaduk makanan dan mencernanya dengan asam lambung (HCl) & enzim pepsin (memecah protein).');
    organ(E, new THREE.SphereGeometry(.55, 32, 24), 0x991b1b, B, [-.45,2.35,.05], [1.2,.55,.7], 'Hati', 'Menghasilkan empedu untuk mengemulsi (memecah) lemak, serta menawarkan racun.');
    const ih = new THREE.CatmullRomCurve3(Array.from({length:40}, (_, i) => E.V3(Math.sin(i*1.1)*.45, 1.75 - i*.022, .2 + Math.cos(i*1.1)*.18)));
    organ(E, new THREE.TubeGeometry(ih, 300, .07, 10), 0xfb7185, B, null, null, 'Usus halus', 'Tempat pencernaan kimiawi terakhir dan penyerapan sari makanan oleh vili (jonjot usus) ke dalam darah.');
    const ib = new THREE.CatmullRomCurve3([E.V3(.65,.5,.1), E.V3(.7,1.7,.1), E.V3(0,1.85,.15), E.V3(-.7,1.7,.1), E.V3(-.65,.6,.1), E.V3(-.2,.35,.1), E.V3(0,.1,.05)]);
    organ(E, new THREE.TubeGeometry(ib, 120, .13, 12), 0xc2410c, B, null, null, 'Usus besar', 'Menyerap air dan mineral dari sisa makanan; bakteri E. coli membantu membusukkan sisa makanan. Sisa dikeluarkan lewat anus.');
    const path = new THREE.CatmullRomCurve3([E.V3(0,3.95,.4), E.V3(0,3.3,.1), E.V3(0,2.5,.1), E.V3(.3,2.1,.2), ...ih.getPoints(20), ...ib.getPoints(10)]);
    const bolus = E.mesh(new THREE.SphereGeometry(.09, 12, 8), E.mat(0x84cc16, {emissive:0x65a30d, emissiveIntensity:.8}), B, null, false);
    E.tick((dt, t) => bolus.position.copy(path.getPoint((t*.05) % 1)));
    E.ui.head('SISTEM PENCERNAAN', 'Perjalanan Makanan', 'Bola hijau = makanan yang sedang dicerna. Ketuk organ untuk fungsinya.');
    E.ui.sec('Urutan saluran pencernaan', '<div class="formula" style="font-size:.95em">Mulut → Kerongkongan → Lambung → Usus halus → Usus besar → Anus</div><p><b>Kelenjar pencernaan:</b> kelenjar ludah, hati (empedu), pankreas (enzim amilase, lipase, tripsin).</p>');
    E.ui.sec('Gangguan', '<ul class="pts"><li>Maag (radang lambung)</li><li>Diare & sembelit (konstipasi)</li><li>Usus buntu (apendisitis)</li></ul>'); }},
  {id:'napas', label:'🫁 Pernapasan', view:{target:[0,3,0], radius:7, theta:.3, phi:1.25, minR:3},
   say:'Saat menghirup napas, diafragma turun dan paru-paru mengembang sehingga udara masuk. Pertukaran oksigen dan karbon dioksida terjadi di alveolus.',
   build(E){ E.platform(4); const B = bodyShell(E);
    organ(E, new THREE.CylinderGeometry(.09, .09, 1, 12), 0x93c5fd, B, [0,3.55,.15], null, 'Trakea (batang tenggorok)', 'Saluran udara berbentuk cincin tulang rawan; dilapisi rambut getar & lendir untuk menyaring debu.');
    [-1, 1].forEach(s => { const b = E.mesh(new THREE.CylinderGeometry(.06, .06, .6, 10), E.mat(0x93c5fd), B, [s*.22, 2.95, .15]); b.rotation.z = s*.6; });
    const lungs = [-1, 1].map(s => organ(E, new THREE.SphereGeometry(.6, 32, 24), 0xfb7185, B, [s*.55, 2.55, .1], [.8, 1.35, .7], s < 0 ? 'Paru-paru' : null, 'Tempat pertukaran gas. Di dalamnya terdapat jutaan alveolus (gelembung paru-paru) yang dikelilingi pembuluh kapiler.'));
    const dia = organ(E, new THREE.SphereGeometry(1, 32, 12, 0, PI*2, 0, PI*.35), 0xb91c1c, B, [0,1.15,.05], [1, .5, .8], 'Diafragma', 'Sekat otot antara rongga dada & perut. Berkontraksi (mendatar) saat inspirasi pada pernapasan perut.');
    const air = []; for(let i = 0; i < 24; i++) air.push({m:E.mesh(new THREE.SphereGeometry(.05, 8, 6), E.mat(0x38bdf8, {emissive:0x0ea5e9, emissiveIntensity:.8}), B, null, false), o:Math.random()});
    let ph = 0; const rd = {}; E.ui.head('SISTEM PERNAPASAN', 'Inspirasi & Ekspirasi', 'Biru = oksigen masuk, abu-abu = karbon dioksida keluar.');
    const R = E.ui.reads(E.ui.sec('Saat ini'), [['f','Fase'],['d','Diafragma']]); let rate = 15;
    E.ui.slider(E.ui.sec('Laju napas'), {label:'Napas/menit', min:8, max:40, value:15, on:v => rate = v});
    E.ui.sec('Urutan jalan udara', '<div class="formula" style="font-size:.9em">Hidung → Faring → Laring → Trakea → Bronkus → Bronkiolus → Alveolus</div><p>Laju napas meningkat saat berolahraga karena tubuh membutuhkan lebih banyak oksigen.</p>');
    E.tick((dt, t) => { ph += dt*rate/60*PI*2; const k = (Math.sin(ph) + 1)/2, ins = Math.cos(ph) > 0;
      lungs.forEach(l => l.scale.set(.8 + k*.12, 1.35 + k*.15, .7 + k*.1)); dia.position.y = 1.15 - k*.2; dia.scale.y = .5 - k*.2;
      R.f(ins ? '⬇️ Inspirasi (menghirup)' : '⬆️ Ekspirasi (menghembus)'); R.d(ins ? 'Berkontraksi, turun' : 'Relaksasi, naik');
      air.forEach((a, i) => { const p = (a.o + (ins ? 1 : -1)*0) % 1, side = i%2 ? 1 : -1, y = 4.1 - k*1.6 - a.o*.3; a.m.position.set(side*k*.45*a.o, y, .2); a.m.material.color.setHex(ins ? 0x38bdf8 : 0x94a3b8); a.m.material.emissive.setHex(ins ? 0x0ea5e9 : 0x334155); }); });
   }},
  {id:'darah', label:'❤️ Peredaran Darah', view:{target:[0,2.7,0], radius:7.5, theta:.3, phi:1.25, minR:3},
   say:'Jantung memompa darah ke seluruh tubuh. Peredaran darah manusia disebut peredaran darah ganda: peredaran kecil antara jantung dan paru-paru, serta peredaran besar antara jantung dan seluruh tubuh.',
   build(E){ E.platform(4); const B = bodyShell(E);
    const heart = new THREE.Group(); heart.position.set(.15, 2.65, .25); B.add(heart);
    const h1 = E.mesh(new THREE.SphereGeometry(.28, 24, 16), E.mat(0xdc2626, {roughness:.35}), heart, [-.12,.05,0]), h2 = E.mesh(new THREE.SphereGeometry(.28, 24, 16), E.mat(0xb91c1c, {roughness:.35}), heart, [.12,.05,0]);
    E.mesh(new THREE.ConeGeometry(.36, .5, 24), E.mat(0xdc2626, {roughness:.35}), heart, [0,-.3,0]).rotation.z = PI;
    const hfn = () => E.info('Jantung', '<p>Organ berotot dengan 4 ruang: serambi kanan, serambi kiri, bilik kanan, bilik kiri. Bilik kiri berdinding paling tebal karena memompa darah ke seluruh tubuh.</p>');
    E.pick(heart, hfn); E.label(heart, '❤️ Jantung', {onClick:hfn});
    [-1, 1].forEach(s => E.mesh(new THREE.SphereGeometry(.55, 24, 16), E.mat(0xfda4af, {transparent:true, opacity:.6}), B, [s*.6, 2.75, 0], false).scale.set(.8, 1.3, .6));
    const loops = [
      {c:new THREE.CatmullRomCurve3([E.V3(.15,2.7,.3), E.V3(.6,3.1,.2), E.V3(.7,2.6,.1), E.V3(.4,2.4,.25), E.V3(.15,2.7,.3)], true), n:'Peredaran darah kecil', d:'Jantung (bilik kanan) → paru-paru → jantung (serambi kiri). Darah melepas CO₂ dan mengikat O₂.', col:[0x3b82f6, 0xef4444]},
      {c:new THREE.CatmullRomCurve3([E.V3(.15,2.7,.3), E.V3(.2,4.1,.2), E.V3(-1.3,3.2,.1), E.V3(-1.5,1.2,0), E.V3(-.4,.3,.1), E.V3(.4,.3,.1), E.V3(1.5,1.2,0), E.V3(1.3,3.2,.1), E.V3(.15,2.7,.3)], true), n:'Peredaran darah besar', d:'Jantung (bilik kiri) → seluruh tubuh → jantung (serambi kanan). Darah kaya O₂ mengalir lewat arteri, kembali lewat vena.', col:[0xef4444, 0x3b82f6]}];
    const cells = [];
    loops.forEach((L, li) => { const tube = E.mesh(new THREE.TubeGeometry(L.c, 160, li ? .06 : .045, 8, true), E.mat(li ? 0xef4444 : 0x8b5cf6, {transparent:true, opacity:.55}), B, null, false);
      const fn = () => E.info(L.n, `<p>${L.d}</p>`); E.pick(tube, fn); E.label(L.c.getPoint(li ? .3 : .3), L.n, {onClick:fn, off:E.V3(0,.6,0)});
      for(let i = 0; i < (li ? 40 : 16); i++) cells.push({m:E.mesh(new THREE.SphereGeometry(.05, 8, 6), E.mat(0xef4444), B, null, false), L, o:i/(li ? 40 : 16)}); });
    let bpm = 75; E.ui.head('PEREDARAN DARAH', 'Jantung & Pembuluh Darah', 'Merah = darah kaya oksigen, biru = darah kaya karbon dioksida.');
    E.ui.slider(E.ui.sec('Denyut jantung'), {label:'Denyut', min:50, max:160, value:75, unit:'/menit', on:v => bpm = v});
    E.ui.sec('Pembuluh darah', '<ul class="pts"><li><b>Arteri</b>: membawa darah keluar dari jantung, dinding tebal & elastis.</li><li><b>Vena</b>: membawa darah kembali ke jantung, memiliki katup.</li><li><b>Kapiler</b>: pembuluh terkecil tempat pertukaran zat.</li></ul><p>Komponen darah: sel darah merah (mengangkut O₂), sel darah putih (melawan kuman), keping darah (pembekuan), plasma.</p>');
    let ph = 0; E.tick((dt, t) => { ph += dt*bpm/60*PI*2; const beat = Math.max(0, Math.sin(ph))**4; heart.scale.setScalar(1 + beat*.12);
      cells.forEach(c => { c.o = (c.o + dt*bpm/60*.05) % 1; c.m.position.copy(c.L.c.getPoint(c.o)); const ox = c.L === loops[0] ? (c.o < .5) : (c.o < .5); c.m.material.color.setHex(c.L.col[c.o < .5 ? 0 : 1]); }); });
   }}
  ]
};

/* =====================================================================
   11. USAHA, ENERGI & PESAWAT SEDERHANA
   ===================================================================== */
T3['usaha'] = {
  title:'Usaha, Energi & Pesawat Sederhana', titleHTML:'<span>Usaha</span>, Energi & Pesawat Sederhana',
  greet:'Halo! Usaha terjadi ketika gaya menyebabkan benda berpindah. Ayo dorong kotak, amati perubahan energi pada lintasan, dan coba tuas untuk mengangkat beban!',
  modes:[
  {id:'usaha', label:'📦 Usaha (W = F·s)', view:{target:[1,1,0], radius:10, theta:.3, phi:1.2},
   say:'Usaha sama dengan gaya dikali perpindahan, satuannya joule. Jika gaya membentuk sudut, hanya komponen gaya yang searah perpindahan yang melakukan usaha.',
   build(E){ E.platform(8);
    const floor = E.mesh(new THREE.BoxGeometry(14, .1, 3), E.mat(0xd6b88a, {roughness:.8}), null, [1,.05,0]);
    for(let i = 0; i <= 10; i++){ const m = E.txtSprite(`${i} m`, {size:48, h:.3, bg:'rgba(15,31,61,.75)'}); m.position.set(-4 + i, .35, 1.6); E.root.add(m); }
    const box = E.mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), E.mat(0xb45309, {roughness:.7}), null, [-4,.65,0]);
    E.mesh(new THREE.BoxGeometry(1.12, .12, 1.12), E.mat(0x78350f), box, [0,.3,0]); E.mesh(new THREE.BoxGeometry(1.12, .12, 1.12), E.mat(0x78350f), box, [0,-.3,0]);
    let F = 50, ang = 0, s = 0, m = 10, run = false, fr = .2, W = 0; let arr = null;
    const R = E.ui; R.head('USAHA', 'Mendorong Kotak', 'Atur gaya, sudut, dan gesekan, lalu tekan Dorong.');
    const sc = R.sec('Pengaturan');
    R.slider(sc, {label:'Gaya F', min:0, max:150, value:50, unit:'N', on:v => F = v}); R.slider(sc, {label:'Sudut θ', min:0, max:80, value:0, unit:'°', on:v => ang = v});
    R.slider(sc, {label:'Massa', min:2, max:40, value:10, unit:'kg', on:v => m = v}); R.seg(sc, [[0,'Licin'],[.2,'Kayu'],[.5,'Kasar']], .2, v => fr = v);
    R.buttons(sc, [{label:'▶ Dorong', cls:'p', on:() => { run = true; }}, {label:'↺ Ulangi', on:() => { run = false; s = 0; W = 0; v = 0; }}]);
    const rd = R.reads(R.sec('Hasil'), [['s','Perpindahan s'],['fx','F cos θ'],['w','Usaha W'],['k','Keterangan']]);
    R.sec('Rumus', '<div class="formula">W = <i>F</i> · <i>s</i> · cos θ</div><p>W dalam joule (J), F dalam newton (N), s dalam meter (m). Jika benda tidak berpindah (s = 0), usahanya <b>nol</b> walaupun kita mendorong dengan kuat!</p>');
    let v = 0;
    E.tick((dt, t) => { const fx = F*Math.cos(ang*PI/180), fy = F*Math.sin(ang*PI/180), N = Math.max(0, m*9.8 - fy), fric = fr*N;
      if(run && s < 10){ const net = fx - (v > 0 || fx > fric ? fric : fx); const a = Math.max(-v/dt, net/m); v = Math.max(0, v + a*dt); const ds = v*dt; s = Math.min(10, s + ds); W += fx*ds; if(v === 0 && fx <= fric) run = false; }
      box.position.x = -4 + s;
      if(arr) E.root.remove(arr); if(F > 0){ const dir = E.V3(Math.cos(ang*PI/180), Math.sin(ang*PI/180), 0), len = .5 + F/150*2.2; arr = E.arrow(box.position.clone().add(E.V3(-.6 - Math.cos(ang*PI/180)*len, .1 - Math.sin(ang*PI/180)*len*.3, 0)), dir, len, 0xef4444); } else arr = null;
      rd.s(`${s.toFixed(2).replace('.',',')} m`); rd.fx(`${fx.toFixed(1).replace('.',',')} N`); rd.w(`${W.toFixed(0)} J`); rd.k(fx <= fric && s === 0 ? 'Kotak diam → W = 0' : s >= 10 ? 'Sampai 10 m' : run ? 'Bergerak…' : 'Siap'); });
   }},
  {id:'energi', label:'🎢 Energi Mekanik', view:{target:[0,2.5,0], radius:12, theta:0, phi:1.25},
   say:'Saat bola turun, energi potensial berubah menjadi energi kinetik. Tanpa gesekan, energi mekaniknya tetap. Inilah hukum kekekalan energi.',
   build(E){ E.platform(7.5);
    const curve = new THREE.CatmullRomCurve3(Array.from({length:41}, (_, i) => { const x = -6 + i*.3; return E.V3(x, .4 + .12*x*x, 0); }));
    E.mesh(new THREE.TubeGeometry(curve, 200, .08, 8), E.mat(0x64748b, {metalness:.8, roughness:.3}), null, [0,0,-.25]); E.mesh(new THREE.TubeGeometry(curve, 200, .08, 8), E.mat(0x64748b, {metalness:.8, roughness:.3}), null, [0,0,.25]);
    for(let i = 0; i <= 12; i++){ const p = curve.getPoint(i/12); E.mesh(new THREE.CylinderGeometry(.05, .05, p.y, 8), E.mat(0x94a3b8), null, [p.x, p.y/2, 0]); }
    const ball = E.mesh(new THREE.SphereGeometry(.3, 32, 24), E.mat(0xef4444, {roughness:.25, metalness:.2}), null, [0,0,0]);
    let x = -5.5, v = 0, m = 1, fric = false;
    const R = E.ui; R.head('ENERGI MEKANIK', 'Ep ⇄ Ek', 'Lepaskan bola dari ketinggian berbeda dan amati diagram energinya.');
    const sc = R.sec('Pengaturan'); const sl = R.slider(sc, {label:'Posisi awal', min:-5.8, max:-1, step:.1, value:-5.5, unit:'', fmt:v => (.4 + .12*v*v).toFixed(1).replace('.',',') + ' m', on:val => { x = val; v = 0; }});
    R.slider(sc, {label:'Massa', min:.5, max:5, step:.5, value:1, unit:'kg', on:val => m = val});
    R.buttons(sc, [{label:'Gesekan: mati', on:el => { fric = !fric; el.textContent = 'Gesekan: ' + (fric ? 'nyala' : 'mati'); el.classList.toggle('on', fric); }}, {label:'↺ Lepas ulang', cls:'p', on:() => { x = sl.get(); v = 0; }}]);
    const bars = E.ui.html('<div class="sec"><b>Diagram energi</b><div id="eb" style="display:grid;gap:6px"></div></div>').querySelector('#eb');
    bars.innerHTML = [['Ep','#3b82f6'],['Ek','#ef4444'],['Em','#fbbf24']].map(([n,c]) => `<div style="display:grid;grid-template-columns:2.5em 1fr 5em;gap:6px;align-items:center;font-weight:900"><span>${n}</span><div style="background:rgba(127,127,127,.2);border-radius:6px;height:16px;overflow:hidden"><i data-b="${n}" style="display:block;height:100%;width:0;background:${c}"></i></div><output data-o="${n}"></output></div>`).join('');
    R.sec('Rumus', '<div class="formula">Ep = m·g·h &nbsp; Ek = ½·m·v² &nbsp; Em = Ep + Ek</div>');
    E.tick((dt, t) => { const g = 9.8, h = .4 + .12*x*x, slope = .24*x; for(let k = 0; k < 4; k++){ const d = dt/4, a = -g*Math.sin(Math.atan(slope)) - (fric ? .35*v : 0); v += a*d; x += v*Math.cos(Math.atan(.24*x))*d; }
      x = Math.max(-6, Math.min(6, x)); const hh = .4 + .12*x*x; ball.position.set(x, hh + .38, 0); ball.rotation.z -= v*dt/.3;
      const Ep = m*g*(hh - .4), Ek = .5*m*v*v, Emax = m*g*(.12*36);
      [['Ep',Ep],['Ek',Ek],['Em',Ep + Ek]].forEach(([n, val]) => { bars.querySelector(`[data-b="${n}"]`).style.width = Math.min(100, val/Emax*100) + '%'; bars.querySelector(`[data-o="${n}"]`).textContent = val.toFixed(0) + ' J'; }); });
   }},
  {id:'tuas', label:'⚖️ Tuas', view:{target:[0,1.5,0], radius:10, theta:.2, phi:1.2},
   say:'Tuas adalah pesawat sederhana. Makin jauh lengan kuasa dari titik tumpu, makin kecil gaya yang diperlukan untuk mengangkat beban. Keuntungan mekanisnya adalah lengan kuasa dibagi lengan beban.',
   build(E){ E.platform(7);
    const fulc = E.mesh(new THREE.ConeGeometry(.5, .9, 3), E.mat(0x475569), null, [0,.45,0]); fulc.rotation.y = PI/6;
    const beam = new THREE.Group(); beam.position.y = .95; E.root.add(beam);
    E.mesh(new THREE.BoxGeometry(8, .14, .5), E.mat(0xa16207, {roughness:.7}), beam);
    for(let i = -4; i <= 4; i++) if(i){ const m = E.txtSprite(`${Math.abs(i)}`, {size:44, h:.25}); m.position.set(i*.9, .25, .3); beam.add(m); }
    const load = E.mesh(new THREE.BoxGeometry(.7, .7, .7), E.mat(0x2563eb), beam, [-2,.42,0]); const effort = new THREE.Group(); beam.add(effort);
    let w = 600, lb = 1, lk = 3;
    E.ui.head('PESAWAT SEDERHANA', 'Tuas Jenis I', 'Atur posisi beban & kuasa. Lihat gaya kuasa yang diperlukan.');
    const sc = E.ui.sec('Pengaturan');
    E.ui.slider(sc, {label:'Berat beban', min:100, max:1000, step:50, value:600, unit:'N', on:v => w = v});
    E.ui.slider(sc, {label:'Lengan beban', min:.5, max:4, step:.5, value:1, unit:'m', on:v => lb = v});
    E.ui.slider(sc, {label:'Lengan kuasa', min:.5, max:4, step:.5, value:3, unit:'m', on:v => lk = v});
    const rd = E.ui.reads(E.ui.sec('Hasil'), [['f','Gaya kuasa F'],['km','Keuntungan mekanis']]);
    E.ui.sec('Rumus', '<div class="formula">w × l<sub>b</sub> = F × l<sub>k</sub> &nbsp; KM = l<sub>k</sub> / l<sub>b</sub></div><p>Contoh tuas: jungkat-jungkit, gunting (jenis I), gerobak dorong (jenis II), sekop/pinset (jenis III). Pesawat sederhana lain: bidang miring, katrol, roda berporos.</p>');
    let arr = null;
    E.tick((dt, t) => { const F = w*lb/lk; load.position.x = -lb*.9; load.scale.setScalar(.6 + w/1000*.6); load.position.y = .07 + load.scale.y*.35;
      beam.rotation.z += (Math.sin(t*1.5)*.03 - beam.rotation.z)*dt*2;
      if(arr) beam.remove(arr); arr = new THREE.ArrowHelper(E.V3(0,-1,0), E.V3(lk*.9, .3 + .4 + F/1000*1.8, 0), .4 + F/1000*1.8, 0xef4444, .35, .22); beam.add(arr);
      rd.f(`${F.toFixed(0)} N`); rd.km(`${(lk/lb).toFixed(2).replace('.',',')} ×`); });
   }}
  ]
};

/* =====================================================================
   12. MATERI — unsur, senyawa, campuran
   ===================================================================== */
const ATOM = {H:[0xffffff,.28,'Hidrogen'], O:[0xef4444,.4,'Oksigen'], C:[0x334155,.42,'Karbon'], N:[0x3b82f6,.4,'Nitrogen'], Na:[0xa855f7,.5,'Natrium'], Cl:[0x22c55e,.48,'Klorin'], Fe:[0xd97706,.45,'Besi'], He:[0x22d3ee,.32,'Helium']};
function molecule(E, atoms, bonds, parent){ const g = new THREE.Group(); (parent || E.root).add(g);
  atoms.forEach(([el, x, y, z]) => E.mesh(new THREE.SphereGeometry(ATOM[el][1], 32, 24), E.mat(ATOM[el][0], {roughness:.25, metalness:.05}), g, [x, y, z]));
  bonds.forEach(([a, b, n = 1]) => { const A = E.V3(...atoms[a].slice(1)), B = E.V3(...atoms[b].slice(1)), d = B.clone().sub(A), L = d.length();
    for(let k = 0; k < n; k++){ const c = E.mesh(new THREE.CylinderGeometry(.07, .07, L, 12), E.mat(0xcbd5e1, {metalness:.4, roughness:.3}), g); c.position.copy(A).add(B).multiplyScalar(.5);
      if(n > 1){ const off = E.V3(0,0,1).cross(d).normalize().multiplyScalar((k - (n-1)/2)*.16); c.position.add(off); } c.quaternion.setFromUnitVectors(E.V3(0,1,0), d.normalize()); } });
  return g; }
const MOLS = {
  unsur:[['H₂','Hidrogen (gas)', [['H',-.37,0,0],['H',.37,0,0]], [[0,1]], 'Unsur: tersusun dari satu jenis atom. Molekul unsur hidrogen terdiri atas 2 atom H. Lambang H.'],
         ['O₂','Oksigen (gas)', [['O',-.6,0,0],['O',.6,0,0]], [[0,1,2]], 'Molekul unsur oksigen: 2 atom O dengan ikatan rangkap. Dibutuhkan untuk bernapas.'],
         ['Fe','Besi (logam)', 'lattice-Fe', null, 'Unsur logam: atom-atom Fe tersusun teratur membentuk kisi. Lambang Fe (Ferrum).'],
         ['He','Helium (gas mulia)', [['He',0,0,0]], [], 'Unsur gas mulia berupa atom tunggal yang stabil; dipakai mengisi balon udara.']],
  senyawa:[['H₂O','Air', [['O',0,0,0],['H',.75,-.55,0],['H',-.75,-.55,0]], [[0,1],[0,2]], 'Senyawa: gabungan 2 atom H dan 1 atom O dengan perbandingan tetap. Sifatnya berbeda dari unsur penyusunnya.'],
           ['CO₂','Karbon dioksida', [['C',0,0,0],['O',-1.15,0,0],['O',1.15,0,0]], [[0,1,2],[0,2,2]], 'Senyawa gas hasil pernapasan dan pembakaran; dipakai tumbuhan untuk fotosintesis.'],
           ['CH₄','Metana', [['C',0,0,0],['H',.63,.63,.63],['H',-.63,-.63,.63],['H',-.63,.63,-.63],['H',.63,-.63,-.63]], [[0,1],[0,2],[0,3],[0,4]], 'Senyawa utama gas alam/biogas, berbentuk tetrahedral.'],
           ['NH₃','Amonia', [['N',0,.15,0],['H',.8,-.25,0],['H',-.4,-.25,.7],['H',-.4,-.25,-.7]], [[0,1],[0,2],[0,3]], 'Senyawa berbau menyengat; bahan baku pupuk urea.'],
           ['NaCl','Garam dapur', 'lattice-NaCl', null, 'Senyawa ion: Na⁺ dan Cl⁻ tersusun bergantian membentuk kristal kubus.']],
  campuran:[['Air garam','Campuran homogen', 'mix-homo', null, 'Campuran homogen (larutan): partikel garam tersebar merata, tidak bisa dibedakan. Dapat dipisahkan dengan penguapan.'],
            ['Air & minyak','Campuran heterogen', 'mix-hetero', null, 'Campuran heterogen: komponen masih dapat dibedakan (membentuk lapisan). Dapat dipisahkan dengan corong pisah.'],
            ['Pasir & air','Campuran heterogen (suspensi)', 'mix-sand', null, 'Partikel pasir mengendap di dasar. Dapat dipisahkan dengan penyaringan (filtrasi).']]
};
T3['materi'] = {
  title:'Unsur, Senyawa & Campuran', titleHTML:'<span>Unsur</span>, Senyawa & Campuran',
  greet:'Halo! Semua materi di sekitar kita dapat dikelompokkan menjadi unsur, senyawa, dan campuran. Pilih contoh di panel dan putar model molekulnya!',
  modes:['unsur','senyawa','campuran'].map((k, mi) => ({id:k, label:['⚛️ Unsur','🧬 Senyawa','🥤 Campuran'][mi], view:{target:[0,2,0], radius:7, theta:.4, phi:1.2, minR:2.5},
    say:['Unsur adalah zat tunggal yang tidak dapat diuraikan lagi menjadi zat yang lebih sederhana dengan reaksi kimia biasa.','Senyawa terbentuk dari dua unsur atau lebih yang bergabung secara kimia dengan perbandingan tetap.','Campuran terbentuk dari dua zat atau lebih yang bercampur tanpa reaksi kimia, sehingga sifat zat penyusunnya masih tampak.'][mi],
    build(E){ E.platform(5); const list = MOLS[k]; let cur = null, spin = true;
      E.ui.head(['UNSUR','SENYAWA','CAMPURAN'][mi], ['Unsur','Senyawa','Campuran'][mi], ['Zat tunggal yang tersusun dari satu jenis atom.','Gabungan dua unsur atau lebih secara kimia dengan perbandingan tetap.','Gabungan zat tanpa reaksi kimia; sifat asal masih ada.'][mi]);
      const sc = E.ui.sec('Pilih contoh');
      E.ui.seg(sc, list.map((x, i) => [i, x[0]]), 0, i => show(i));
      E.ui.buttons(sc, [{label:'⟳ Putar: nyala', on:el => { spin = !spin; el.textContent = '⟳ Putar: ' + (spin ? 'nyala' : 'mati'); }}]);
      const legend = E.ui.sec('Warna atom', `<div style="display:flex;flex-wrap:wrap;gap:6px">${Object.entries(ATOM).map(([s,[c,,n]]) => `<span style="display:inline-flex;align-items:center;gap:4px;font-weight:800;font-size:.85em"><i style="width:14px;height:14px;border-radius:50%;background:#${c.toString(16).padStart(6,'0')};border:1px solid #888"></i>${s} ${n}</span>`).join('')}</div>`);
      if(k === 'campuran') E.ui.sec('Cara pemisahan campuran', '<ul class="pts"><li><b>Filtrasi</b> (penyaringan): pasir & air</li><li><b>Evaporasi</b> (penguapan): garam dari air laut</li><li><b>Distilasi</b> (penyulingan): air murni, minyak atsiri</li><li><b>Kromatografi</b>: memisahkan zat warna tinta</li><li><b>Sublimasi</b>: kapur barus</li></ul>');
      function show(i){ if(cur) E.root.remove(cur); const [f, nm, atoms, bonds, tx] = list[i];
        if(atoms === 'lattice-Fe' || atoms === 'lattice-NaCl'){ cur = new THREE.Group(); E.root.add(cur); for(let x = -1; x <= 1; x++) for(let y = -1; y <= 1; y++) for(let z = -1; z <= 1; z++){ const el = atoms === 'lattice-Fe' ? 'Fe' : ((x + y + z + 3) % 2 ? 'Na' : 'Cl'); E.mesh(new THREE.SphereGeometry(ATOM[el][1]*(atoms === 'lattice-Fe' ? 1.2 : .9), 24, 16), E.mat(ATOM[el][0], {metalness:atoms === 'lattice-Fe' ? .8 : .05, roughness:.3}), cur, [x*1.05, y*1.05, z*1.05]); } }
        else if(String(atoms).startsWith('mix')){ cur = new THREE.Group(); E.root.add(cur); beakerG(E, 1.2, 2.6, 0, 0, cur, [0,-1.6,0]);
          const parts = []; const add = (n, c, r, fy) => { for(let j = 0; j < n; j++){ const m = E.mesh(new THREE.SphereGeometry(r, 10, 8), E.mat(c, {roughness:.3}), cur, null, false); m.userData.f = fy; parts.push(m); } };
          if(atoms === 'mix-homo'){ E.mesh(new THREE.CylinderGeometry(1.12, 1.12, 2, 32), E.mat(0x7dd3fc, {transparent:true, opacity:.35}), cur, [0,-.58,0], false); add(70, 0xffffff, .06, () => [-.1, 1.6]); }
          else if(atoms === 'mix-hetero'){ E.mesh(new THREE.CylinderGeometry(1.12, 1.12, 1.2, 32), E.mat(0x7dd3fc, {transparent:true, opacity:.4}), cur, [0,-.98,0], false); E.mesh(new THREE.CylinderGeometry(1.12, 1.12, .7, 32), E.mat(0xfacc15, {transparent:true, opacity:.65}), cur, [0,-.03,0], false); }
          else { E.mesh(new THREE.CylinderGeometry(1.12, 1.12, 2, 32), E.mat(0x93c5fd, {transparent:true, opacity:.3}), cur, [0,-.58,0], false); add(110, 0xd6a35c, .07, () => [-1.55, .25]); }
          parts.forEach(p => { const [a, b] = p.userData.f(); const r = Math.random()*.95, an = Math.random()*PI*2; p.position.set(Math.cos(an)*r, -1.5 + (a < -1 ? Math.random()*.3 : Math.random()*1.8), Math.sin(an)*r); p.userData.ph = Math.random()*9; }); cur.userData.parts = parts; }
        else cur = molecule(E, atoms, bonds);
        cur.position.y = 2.2; E.info(`${f} — ${nm}`, `<p>${tx}</p>`); E.say(k + i, `${nm}. ${tx}`, false); }
      E.tick((dt, t) => { if(cur){ if(spin && !cur.userData.parts) cur.rotation.y += dt*.6; if(cur.userData.parts) cur.userData.parts.forEach(p => { if(p.position.y > -1.4){ p.position.x += Math.sin(t*2 + p.userData.ph)*.002; p.position.z += Math.cos(t*2 + p.userData.ph)*.002; } }); } });
    }}))
};

/* =====================================================================
   13. GETARAN & GELOMBANG
   ===================================================================== */
T3['getaran-gelombang'] = {
  title:'Getaran & Gelombang', titleHTML:'<span>Getaran</span> & Gelombang',
  greet:'Halo! Getaran adalah gerak bolak-balik melalui titik setimbang. Gelombang adalah getaran yang merambat. Ayo amati bandul, pegas, dan gelombang tali serta slinki!',
  modes:[
  {id:'bandul', label:'🕰️ Bandul', view:{target:[0,2.5,0], radius:8, theta:0, phi:1.35},
   say:'Satu getaran bandul adalah gerak dari A ke O ke B, lalu kembali ke O dan ke A. Periode bandul hanya bergantung pada panjang tali dan percepatan gravitasi, tidak pada massanya.',
   build(E){ E.platform(5);
    E.mesh(new THREE.BoxGeometry(3, .15, .6), E.mat(0x334155, {metalness:.6}), null, [0,4.6,0]); [-1.3,1.3].forEach(x => E.mesh(new THREE.CylinderGeometry(.06, .06, 4.6, 12), E.mat(0x334155, {metalness:.6}), null, [x,2.3,0]));
    const piv = new THREE.Group(); piv.position.set(0, 4.5, 0); E.root.add(piv);
    const str = E.mesh(new THREE.CylinderGeometry(.015, .015, 1, 6), E.mat(0xe5e7eb), piv, null, false); const bob = E.mesh(new THREE.SphereGeometry(.25, 32, 24), E.mat(0xca8a04, {metalness:.85, roughness:.25}), piv);
    let L = 3, A = 25, th = 25*PI/180, w = 0, n = 0, prevSign = 1, tt = 0, run = true, g = 9.8;
    const lA = E.label(E.V3(), 'A'), lO = E.label(E.V3(), 'O'), lB = E.label(E.V3(), 'B');
    E.ui.head('GETARAN', 'Bandul Sederhana', 'Ubah panjang tali dan simpangan, lalu hitung getarannya.');
    const sc = E.ui.sec('Pengaturan');
    E.ui.slider(sc, {label:'Panjang tali', min:1, max:4, step:.1, value:3, unit:'m', on:v => { L = v; reset(); }});
    E.ui.slider(sc, {label:'Simpangan', min:5, max:45, value:25, unit:'°', on:v => { A = v; reset(); }});
    E.ui.seg(sc, [[9.8,'🌍 Bumi'],[1.6,'🌙 Bulan']], 9.8, v => { g = v; reset(); });
    E.ui.buttons(sc, [{label:'⏯ Jeda/Lanjut', on:() => run = !run}, {label:'↺ Ulangi', cls:'p', on:reset}]);
    const rd = E.ui.reads(E.ui.sec('Pengukuran'), [['n','Jumlah getaran'],['t','Waktu'],['T','Periode T'],['f','Frekuensi f']]);
    E.ui.sec('Rumus', '<div class="formula">T = t / n &nbsp; f = n / t = 1/T</div><p>Periode bandul: T = 2π√(L/g). Amplitudo = simpangan terjauh (OA atau OB).</p>');
    function reset(){ th = A*PI/180; w = 0; n = 0; tt = 0; prevSign = 1; }
    E.tick((dt) => { if(run){ for(let k = 0; k < 6; k++){ const d = dt/6; w += -(g/L)*Math.sin(th)*d; th += w*d; } tt += dt; if(Math.sign(w) !== prevSign && w > 0){ n += .5; } if(Math.sign(w) !== prevSign) { n = Math.floor(n*2 + .5)/2; } prevSign = Math.sign(w) || prevSign; }
      piv.rotation.z = th; str.scale.y = L; str.position.y = -L/2; bob.position.y = -L;
      const Ar = A*PI/180; lA.target.set(Math.sin(-Ar)*L*-1, 4.5 - Math.cos(Ar)*L - .5, 0); lB.target.set(-Math.sin(Ar)*L, 4.5 - Math.cos(Ar)*L - .5, 0); lO.target.set(0, 4.5 - L - .55, 0);
      const T = 2*PI*Math.sqrt(L/g), nn = Math.floor(tt/T*1000)/1000;
      rd.n(Math.floor(tt/T*10)/10); rd.t(`${tt.toFixed(1).replace('.',',')} s`); rd.T(`${T.toFixed(2).replace('.',',')} s`); rd.f(`${(1/T).toFixed(2).replace('.',',')} Hz`); });
   }},
  {id:'pegas', label:'🌀 Pegas', view:{target:[0,2.5,0], radius:7, theta:0, phi:1.35},
   say:'Beban pada pegas bergetar naik turun. Makin besar massa beban, makin lambat getarannya. Makin kaku pegasnya, makin cepat getarannya.',
   build(E){ E.platform(4);
    E.mesh(new THREE.BoxGeometry(2, .15, .6), E.mat(0x334155, {metalness:.6}), null, [0,4.8,0]); E.mesh(new THREE.CylinderGeometry(.06, .06, 4.8, 12), E.mat(0x334155, {metalness:.6}), null, [-.9,2.4,0]);
    let k = 40, m = 1, y = -1, v = 0; const blk = E.mesh(new THREE.BoxGeometry(.6, .6, .6), E.mat(0x2563eb, {metalness:.3}), null, [0,2,0]);
    const sp = []; for(let i = 0; i <= 240; i++){ const a = i/240*PI*2*16; sp.push(E.V3(Math.cos(a)*.25, -i/240, Math.sin(a)*.25)); }
    const spring = E.mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp), 400, .03, 6), E.mat(0x94a3b8, {metalness:.9, roughness:.2}), null, [0,4.7,0], false);
    function mk(len){ spring.scale.y = len; }
    E.ui.head('GETARAN', 'Getaran Pegas', 'Tarik ke bawah lalu lepaskan.');
    const sc = E.ui.sec('Pengaturan'); E.ui.slider(sc, {label:'Kekakuan k', min:10, max:120, value:40, unit:'N/m', on:v2 => k = v2}); E.ui.slider(sc, {label:'Massa', min:.2, max:4, step:.1, value:1, unit:'kg', on:v2 => m = v2});
    E.ui.buttons(sc, [{label:'⬇ Tarik & lepas', cls:'p', on:() => { y = -1; v = 0; }}]);
    const rd = E.ui.reads(E.ui.sec('Pengukuran'), [['T','Periode T'],['f','Frekuensi f']]);
    E.ui.sec('Rumus', '<div class="formula">T = 2π √(m / k)</div>');
    E.tick((dt) => { for(let i = 0; i < 6; i++){ const d = dt/6; v += (-k*y/m - .15*v)*d; y += v*d; } const len = 2 + m*.35 - y*.5; mk(len); blk.position.y = 4.7 - len - .3;
      const T = 2*PI*Math.sqrt(m/k); rd.T(`${T.toFixed(2).replace('.',',')} s`); rd.f(`${(1/T).toFixed(2).replace('.',',')} Hz`); });
   }},
  {id:'transversal', label:'〰️ Gelombang Transversal', view:{target:[0,1.6,0], radius:11, theta:0, phi:1.3},
   say:'Pada gelombang transversal, arah getar tegak lurus arah rambat. Satu gelombang terdiri atas satu bukit dan satu lembah. Cepat rambat gelombang sama dengan panjang gelombang dikali frekuensi.',
   build(E){ E.platform(7);
    const N = 60, beads = []; for(let i = 0; i < N; i++) beads.push(E.mesh(new THREE.SphereGeometry(.09, 12, 8), E.mat(i === 30 ? 0xef4444 : 0x38bdf8, {roughness:.3}), null, [-6 + i*.2, 1.6, 0]));
    const hand = E.mesh(new THREE.SphereGeometry(.25, 16, 12), E.mat(0xf2c9a0), null, [-6.3,1.6,0]);
    let A = .8, f = .8, v = 3; const lb = E.label(E.V3(), '⛰️ Bukit'), ll = E.label(E.V3(), '🕳️ Lembah'); const lam = E.label(E.V3(), 'λ');
    E.ui.head('GELOMBANG', 'Gelombang Transversal (tali)', 'Arah getar ⟂ arah rambat. Bola merah hanya naik-turun, tidak ikut merambat!');
    const sc = E.ui.sec('Pengaturan'); E.ui.slider(sc, {label:'Amplitudo', min:.2, max:1.4, step:.1, value:.8, unit:'m', on:x => A = x}); E.ui.slider(sc, {label:'Frekuensi', min:.2, max:2, step:.1, value:.8, unit:'Hz', on:x => f = x}); E.ui.slider(sc, {label:'Cepat rambat', min:1, max:6, step:.5, value:3, unit:'m/s', on:x => v = x});
    const rd = E.ui.reads(E.ui.sec('Hasil'), [['l','Panjang gelombang λ'],['T','Periode T']]);
    E.ui.sec('Rumus', '<div class="formula">v = λ · f &nbsp; λ = v / f</div><p>Contoh gelombang transversal: gelombang tali, gelombang air, cahaya.</p>');
    E.tick((dt, t) => { const lamb = v/f, k = 2*PI/lamb;
      beads.forEach((b, i) => { const x = i*.2, ph = Math.max(0, t - x/v); b.position.y = 1.6 + (t > x/v ? A*Math.sin(2*PI*f*t - k*x) : 0); }); hand.position.y = 1.6 + A*Math.sin(2*PI*f*t);
      const xc = ((PI/2 + 2*PI*f*t)/k) % lamb; lb.target.set(-6 + xc, 1.6 + A + .4, 0); ll.target.set(-6 + (xc + lamb/2) % lamb, 1.6 - A - .1, 0); lam.target.set(-6 + lamb/2, 1.6 - A - .6, 0);
      rd.l(`${lamb.toFixed(2).replace('.',',')} m`); rd.T(`${(1/f).toFixed(2).replace('.',',')} s`); });
   }},
  {id:'longitudinal', label:'🌀 Gelombang Longitudinal', view:{target:[0,1.6,0], radius:11, theta:.3, phi:1.25},
   say:'Pada gelombang longitudinal, arah getar sejajar arah rambat, membentuk rapatan dan renggangan. Contohnya gelombang pada slinki dan gelombang bunyi.',
   build(E){ E.platform(7);
    const N = 70, rings = []; for(let i = 0; i < N; i++){ const r = E.mesh(new THREE.TorusGeometry(.45, .03, 8, 32), E.mat(i === 35 ? 0xef4444 : 0x94a3b8, {metalness:.8, roughness:.25}), null, [-6 + i*.17, 1.6, 0]); r.rotation.y = PI/2; rings.push(r); }
    let A = .25, f = .7, v = 3; const lr = E.label(E.V3(), 'Rapatan'), lg = E.label(E.V3(), 'Renggangan');
    E.ui.head('GELOMBANG', 'Gelombang Longitudinal (slinki)', 'Arah getar ∥ arah rambat. Satu gelombang = satu rapatan + satu renggangan.');
    const sc = E.ui.sec('Pengaturan'); E.ui.slider(sc, {label:'Amplitudo', min:.05, max:.4, step:.05, value:.25, unit:'m', on:x => A = x}); E.ui.slider(sc, {label:'Frekuensi', min:.2, max:1.6, step:.1, value:.7, unit:'Hz', on:x => f = x});
    const rd = E.ui.reads(E.ui.sec('Hasil'), [['l','Panjang gelombang λ'],['v','Cepat rambat']]);
    E.ui.sec('Bunyi', '<p>Bunyi adalah gelombang longitudinal yang memerlukan medium (padat, cair, gas); tidak dapat merambat di ruang hampa. Cepat rambat bunyi di udara ± 340 m/s.</p>');
    E.tick((dt, t) => { const lamb = v/f, k = 2*PI/lamb; rings.forEach((r, i) => { const x = i*.17; r.position.x = -6 + x + A*Math.sin(2*PI*f*t - k*x); });
      const xr = ((2*PI*f*t)/k) % lamb; lr.target.set(-6 + xr, 2.3, 0); lg.target.set(-6 + (xr + lamb/2) % lamb, 2.3, 0); rd.l(`${lamb.toFixed(2).replace('.',',')} m`); rd.v(`${v} m/s`); });
   }}
  ]
};

/* =====================================================================
   14. STRUKTUR BUMI — lapisan bumi & lempeng tektonik
   ===================================================================== */
T3['struktur-bumi'] = {
  title:'Struktur Bumi', titleHTML:'Struktur <span>Bumi</span>',
  greet:'Halo! Bumi tersusun atas beberapa lapisan: kerak, mantel, inti luar, dan inti dalam. Ketuk setiap lapisan dan pelajari juga gerakan lempeng tektonik!',
  bg:{dark:[[0,'#020617'],[.6,'#0b1430'],[1,'#1e1b4b']], light:[[0,'#0b1430'],[.6,'#1e3a8a'],[1,'#60a5fa']]},
  modes:[
  {id:'lapisan', label:'🌍 Lapisan Bumi', view:{target:[0,2.5,0], radius:9, theta:.9, phi:1.2, minR:4},
   say:'Lapisan Bumi dari luar ke dalam adalah kerak bumi, mantel, inti luar yang cair, dan inti dalam yang padat dan sangat panas.',
   build(E){
    const G = new THREE.Group(); G.position.y = 2.5; E.root.add(G);
    const L = [['kerak','Kerak bumi',2.4,0x8b6b4a,'Lapisan terluar yang padat, tebal 5–70 km (kerak samudra tipis, kerak benua tebal). Tempat kita hidup.'],
      ['mantel','Mantel bumi',2.3,0xea580c,'Lapisan paling tebal (± 2.900 km), berupa batuan panas yang dapat mengalir perlahan. Bagian atasnya (astenosfer) menjadi tempat lempeng bergerak.'],
      ['luar','Inti luar',1.25,0xf59e0b,'Tebal ± 2.200 km, berupa logam besi-nikel CAIR bersuhu ± 4.000–5.000 °C. Alirannya menimbulkan medan magnet bumi.'],
      ['dalam','Inti dalam',.62,0xfde047,'Bola logam besi-nikel PADAT berjari-jari ± 1.220 km, suhunya ± 5.500 °C. Padat karena tekanannya sangat besar.']];
    const loader = new THREE.TextureLoader();
    L.forEach(([k, nm, r, c, tx], i) => { const geo = new THREE.SphereGeometry(r, 96, 64, PI*.5, PI*1.5);
      const m = i === 0 ? new THREE.MeshStandardMaterial({color:0xffffff, roughness:.8, side:THREE.DoubleSide}) : E.mat(c, {roughness:.6, emissive:c, emissiveIntensity:i*.18, side:THREE.DoubleSide});
      if(i === 0) loader.load((window.LAB ? LAB.texBase : '../assets/tex/') + 'earth_day_2k.jpg', t => { t.colorSpace = THREE.SRGBColorSpace; m.map = t; m.needsUpdate = true; });
      const s = E.mesh(geo, m, G); const cap1 = E.mesh(new THREE.CircleGeometry(r, 64, PI*.5, PI), E.mat(c, {roughness:.7, emissive:c, emissiveIntensity:i*.2, side:THREE.DoubleSide}), G); cap1.rotation.y = PI/2;
      const cap2 = E.mesh(new THREE.CircleGeometry(r, 64, -PI*.5, PI), E.mat(c, {roughness:.7, emissive:c, emissiveIntensity:i*.2, side:THREE.DoubleSide}), G); cap2.rotation.y = 0; cap2.rotation.z = 0;
      cap1.position.z = .001*i; cap2.position.x = .001*i;
      const fn = () => { E.info(nm, `<p>${tx}</p>`); E.say('l_' + k, nm + '. ' + tx, false); };
      [s, cap1, cap2].forEach(o => E.pick(o, fn)); const p = new THREE.Object3D(); p.position.set(r*.72*(i === 3 ? .1 : 1), r*.12 + (i === 3 ? .3 : 0), r*.72*(i === 3 ? .1 : 1)); G.add(p); E.label(p, nm, {onClick:fn}); });
    E.mesh(new THREE.SphereGeometry(2.5, 48, 32), E.mat(0x7dd3fc, {transparent:true, opacity:.08, side:THREE.BackSide, depthWrite:false}), G, null, false);
    E.tick((dt) => G.rotation.y += dt*.08);
    E.ui.head('STRUKTUR BUMI', 'Lapisan-lapisan Bumi', 'Bumi diiris seperempat bagian agar lapisannya terlihat. Ketuk tiap lapisan.');
    E.ui.sec('Lapisan dari luar ke dalam', '<div style="display:grid;gap:5px">' + L.map(([,nm,,c]) => `<div style="display:flex;align-items:center;gap:8px;font-weight:900"><i style="width:18px;height:18px;border-radius:4px;background:#${c.toString(16).padStart(6,'0')}"></i>${nm}</div>`).join('') + '</div><p>Suhu dan tekanan makin tinggi ke arah pusat Bumi. Jari-jari Bumi ± 6.371 km.</p>');
    E.ui.sec('Litosfer & astenosfer', '<p><b>Litosfer</b> = kerak + mantel atas yang kaku, terpecah menjadi lempeng-lempeng. <b>Astenosfer</b> = lapisan mantel yang lebih lunak tempat lempeng “mengapung” dan bergerak.</p>');
   }},
  {id:'lempeng', label:'🌋 Lempeng Tektonik', view:{target:[0,1.2,0], radius:11, theta:.6, phi:1.15},
   say:'Lempeng tektonik bergerak karena arus konveksi di mantel. Batas lempeng dapat saling menjauh, saling bertumbukan, atau saling bergeser, dan dapat menimbulkan gempa serta gunung api.',
   build(E){ E.platform(7);
    const mag = E.mesh(new THREE.BoxGeometry(10, .8, 4), E.mat(0xea580c, {emissive:0xc2410c, emissiveIntensity:.6, roughness:.8}), null, [0,.4,0]);
    const pA = E.mesh(new THREE.BoxGeometry(4.8, .7, 4), E.mat(0x65a30d, {roughness:.9}), null, [-2.45,1.15,0]), pB = E.mesh(new THREE.BoxGeometry(4.8, .7, 4), E.mat(0x2563eb, {roughness:.6}), null, [2.45,1.15,0]);
    const ridge = E.mesh(new THREE.ConeGeometry(.6, 1, 4), E.mat(0x78350f, {flatShading:true}), null, [0,1.3,0]); ridge.scale.z = 4;
    const lava = E.mesh(new THREE.BoxGeometry(.3, .6, 4), E.mat(0xf97316, {emissive:0xf97316, emissiveIntensity:1.5}), null, [0,1,0], false);
    let type = 'divergen', t0 = 0; const arrows = [];
    const D = {divergen:['Divergen (menjauh)','Dua lempeng saling menjauh; magma naik membentuk punggungan tengah samudra. Contoh: punggungan Atlantik Tengah.'],
      konvergen:['Konvergen (bertumbukan)','Dua lempeng saling mendekat; lempeng samudra menunjam di bawah lempeng benua (subduksi) membentuk palung, gunung api, dan gempa. Contoh: pantai barat Sumatra & selatan Jawa.'],
      transform:['Transform (bergeser)','Dua lempeng saling bergeser mendatar; sering menimbulkan gempa. Contoh: Sesar San Andreas (Amerika Serikat).']};
    E.ui.head('LEMPENG TEKTONIK', 'Batas Lempeng', 'Pilih jenis batas lempeng dan amati gerakannya.');
    E.ui.seg(E.ui.sec('Jenis batas'), Object.entries(D).map(([k, v]) => [k, v[0].split(' ')[0]]), 'divergen', k => { type = k; t0 = 0; E.info(D[k][0], `<p>${D[k][1]}</p>`); E.say('b_' + k, D[k][0] + '. ' + D[k][1], false); });
    E.ui.sec('Indonesia', '<p>Indonesia terletak di pertemuan tiga lempeng besar: <b>Indo-Australia</b>, <b>Eurasia</b>, dan <b>Pasifik</b>. Karena itu Indonesia memiliki banyak gunung api dan sering terjadi gempa bumi.</p><div class="note">Saat gempa: lindungi kepala, berlindung di bawah meja yang kokoh, jauhi kaca, lalu keluar ke tempat terbuka.</div>');
    E.tick((dt, t) => { t0 += dt; const k = (Math.sin(t0*.8) + 1)/2;
      if(type === 'divergen'){ pA.position.set(-2.45 - k*.8, 1.15, 0); pB.position.set(2.45 + k*.8, 1.15, 0); pA.rotation.z = pB.rotation.z = 0; pB.position.z = 0; ridge.visible = true; ridge.scale.y = .6 + k*.6; lava.visible = true; lava.scale.x = 1 + k*4; }
      else if(type === 'konvergen'){ ridge.visible = lava.visible = false; pA.position.set(-2.45 + k*.6, 1.15 + k*.25, 0); pA.rotation.z = -k*.06; pB.position.set(2.45 - k*.5, 1.15 - k*.45, 0); pB.rotation.z = -k*.22; }
      else { ridge.visible = lava.visible = false; pA.rotation.z = pB.rotation.z = 0; pA.position.set(-2.42, 1.15, -k*1.2 + .6); pB.position.set(2.42, 1.15, k*1.2 - .6); }
      if(type !== 'divergen' && k > .97) E.root.position.x = Math.sin(t*60)*.03; else E.root.position.x = 0; });
    E.info(D.divergen[0], `<p>${D.divergen[1]}</p>`);
   }}
  ]
};
