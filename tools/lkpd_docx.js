/* Generator LKPD Word (.docx) dari assets/lkpd.js — gaya mengikuti LKPD referensi (navy + oranye) */
global.window = global;
const fs = require('fs'), path = require('path');
const SITE = process.env.SITE || path.resolve(__dirname, '..');
require(SITE + '/assets/materi.js'); require(SITE + '/assets/lkpd.js');
const {Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, AlignmentType, ImageRun,
  Header, Footer, PageNumber, TabStopType, LineRuleType, PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader, VerticalAlign, TableLayoutType, PageBreak} = require('docx');

const NAVY = '13254A', NAVY2 = '1E3F78', ORANGE = 'F28C28', CREAM = 'FFF4E6', SKY = 'D9EBFA', PALE = 'F3F8FD', YEL = 'FFD166', GREEN = 'E7F5EC', MUTE = '5B6B82';
const FONT = 'Calibri', W = 9638; // A4, margin 2 cm
const LOGO = fs.readFileSync(SITE + '/assets/icon-192.png');

/* --- teks berformat sederhana: <b>, <i>, entitas --- */
function runs(html, base = {}){
  const out = []; let b = false, it = false;
  String(html).replace(/&lt;/g, '\u0001').replace(/&gt;/g, '\u0002').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .split(/(<\/?[bi]>)/).forEach(tok => {
      if(tok === '<b>') b = true; else if(tok === '</b>') b = false; else if(tok === '<i>') it = true; else if(tok === '</i>') it = false;
      else if(tok){ const t = tok.replace(/<[^>]+>/g, '').replace(/\u0001/g, '<').replace(/\u0002/g, '>'); if(t) out.push(new TextRun(Object.assign({text:t, font:FONT, size:21}, base, b ? {bold:true} : {}, it ? {italics:true} : {}))); }
    });
  return out;
}
const P = (html, o = {}) => new Paragraph(Object.assign({children:runs(html, o.run || {}), spacing:{before:o.before ?? 40, after:o.after ?? 60, line:o.line ?? 276, lineRule:LineRuleType.AUTO}}, o.align ? {alignment:o.align} : {}, o.indent ? {indent:o.indent} : {}, o.keep ? {keepNext:true} : {}));
const num = (items, o = {}) => items.map((t, i) => new Paragraph({children:[new TextRun({text:`${i + 1}.`, font:FONT, size:21, bold:!!o.boldNum, color:o.numColor}), new TextRun({text:'\t', font:FONT}), ...runs(t)], tabStops:[{type:'left', position:360}], indent:{left:360, hanging:360}, spacing:{before:30, after:50, line:276, lineRule:LineRuleType.AUTO}}));
const bullets = items => items.map(t => new Paragraph({children:[new TextRun({text:'●', font:FONT, size:14, color:ORANGE}), new TextRun({text:'\t'}), ...runs(t)], tabStops:[{type:'left', position:300}], indent:{left:300, hanging:300}, spacing:{before:20, after:40, line:276, lineRule:LineRuleType.AUTO}}));
const dots = (n = 3, w = W - 420) => Array.from({length:n}, () => new Paragraph({tabStops:[{type:TabStopType.RIGHT, position:w, leader:'dot'}], children:[new TextRun({text:'\t', font:FONT, size:21, color:'9AA8BC'})], spacing:{before:150, after:40}}));
const blank = (h = 80) => new Paragraph({children:[], keepNext:true, spacing:{before:0, after:h}});

const B = (c, sz = 8) => ({style:BorderStyle.SINGLE, size:sz, color:c});
const NONE = {style:BorderStyle.NONE, size:0, color:'FFFFFF'};
const borders = (c, sz) => ({top:B(c, sz), bottom:B(c, sz), left:B(c, sz), right:B(c, sz)});
const noBorders = {top:NONE, bottom:NONE, left:NONE, right:NONE};
function cell(children, o = {}){ return new TableCell({children:Array.isArray(children) ? children : [children], width:{size:o.w || W, type:WidthType.DXA},
  shading:o.fill ? {fill:o.fill, type:ShadingType.CLEAR, color:'auto'} : undefined, borders:o.borders || noBorders,
  margins:{top:o.mt ?? 100, bottom:o.mb ?? 100, left:o.ml ?? 160, right:o.mr ?? 160}, verticalAlign:o.va || VerticalAlign.TOP, columnSpan:o.span}); }
function box(children, o = {}){ const w = o.w || W; return new Table({width:{size:w, type:WidthType.DXA}, columnWidths:[w], layout:TableLayoutType.FIXED,
  rows:[new TableRow({cantSplit:!!o.cantSplit, children:[cell(children, Object.assign({w, borders:o.border ? borders(o.border, o.bsz || 10) : noBorders}, o))]})]}); }
const bar = (text, fill, w = 6200) => new Paragraph({children:runs(`<b>${text}</b>`, {color:'FFFFFF', size:22}), keepNext:true, keepLines:true,
  shading:{type:ShadingType.CLEAR, fill, color:'auto'}, border:{top:B(fill, 18), bottom:B(fill, 18), left:B(fill, 24), right:B(fill, 24)}, indent:{left:60, right:W - w + 60}, spacing:{before:120, after:120}});
const sectionBox = (title, children, o = {}) => new Table({width:{size:W, type:WidthType.DXA}, columnWidths:[W], layout:TableLayoutType.FIXED,
  rows:[new TableRow({cantSplit:true, children:[cell(P(`<b>${title}</b>`, {run:{color:o.titleColor || 'FFFFFF', size:22}, before:0, after:0, keep:true}), {fill:o.head || ORANGE, borders:borders(o.border || '13254A', 8), mt:70, mb:70})]}),
        new TableRow({children:[cell(children, {fill:o.fill, borders:borders(o.border || '13254A', 8), mt:100, mb:120})]})]});

function dataTable(t, o = {}){
  const head = t.head, n = head.length, first = o.firstW || Math.round(W*(n > 5 ? .2 : .28)), rest = Math.floor((W - first)/(n - 1)), cw = [first, ...Array(n - 1).fill(rest)]; cw[n - 1] += W - cw.reduce((a, b) => a + b, 0);
  const hdr = new TableRow({tableHeader:true, cantSplit:true, children:head.map((h, i) => cell(P(`<b>${h}</b>`, {run:{size:19, color:NAVY}, align:AlignmentType.CENTER, before:0, after:0}), {w:cw[i], fill:SKY, borders:borders('7FA3CF', 6), mt:60, mb:60, va:VerticalAlign.CENTER}))});
  const rows = Array.isArray(t.rows) ? t.rows : Array.from({length:t.rows}, (_, r) => head.map((_, c) => c === 0 && t.isi && t.isi[r] != null ? t.isi[r] : ''));
  const body = rows.map((r, ri) => new TableRow({cantSplit:true, height:{value:o.rowH || 400, rule:'atLeast'}, children:r.map((v, i) => cell(P(i === 0 && v ? `<b>${v}</b>` : v, {run:{size:19}, align:i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER, before:0, after:0}), {w:cw[i], fill:ri % 2 ? PALE : 'FFFFFF', borders:borders('9DB7D8', 4), mt:50, mb:50, va:VerticalAlign.CENTER}))}));
  return new Table({width:{size:W, type:WidthType.DXA}, columnWidths:cw, layout:TableLayoutType.FIXED, rows:[hdr, ...body]});
}

function build(id){
  const D = LKPD_DATA[id], M = MATERI_DATA[id], kls = M.kelas == 7 ? 'VII' : 'VIII', img = fs.readFileSync(`${SITE}/lkpd/img/${id}.png`);
  const meta = `Kelas ${kls} · Fase D · Bab ${M.bab}: ${M.nama} · Tema: ${D.tema}`;
  const kids = [];
  // Sampul
  kids.push(new Table({width:{size:W, type:WidthType.DXA}, columnWidths:[5300, W - 5300], layout:TableLayoutType.FIXED, rows:[new TableRow({children:[
    cell([P('<b>L E M B A R   K E R J A   P E S E R T A   D I D I K</b>', {run:{color:ORANGE, size:16}, after:80}),
      P('<b>LKPD IPA</b>', {run:{color:NAVY, size:56}, before:0, after:60}),
      P(`<b>“${D.judul}”</b>`, {run:{color:NAVY2, size:28}, after:100}),
      P(meta, {run:{color:MUTE, size:18}})], {w:5300, ml:0, va:VerticalAlign.CENTER}),
    cell(new Paragraph({alignment:AlignmentType.RIGHT, children:[new ImageRun({type:'png', data:img, transformation:{width:240, height:146}})]}), {w:W - 5300, mr:0, va:VerticalAlign.CENTER})]})]}));
  kids.push(blank(120));
  const idRow = (k, v) => new TableRow({children:[cell(P(`<b>${k}</b>`, {before:0, after:0}), {w:1700, fill:CREAM, mt:50, mb:50}), cell(v, {w:W - 1700, fill:CREAM, mt:50, mb:50})]});
  kids.push(new Table({width:{size:W, type:WidthType.DXA}, columnWidths:[1700, W - 1700], layout:TableLayoutType.FIXED, borders:{top:B(ORANGE, 12), bottom:B(ORANGE, 12), left:NONE, right:NONE, insideHorizontal:NONE, insideVertical:NONE},
    rows:[idRow('Kelompok :', dots(1, W - 1700 - 340)[0]), idRow('Kelas :', P(`${kls} / ....`, {before:0, after:0})), idRow('Anggota :', Array.from({length:6}, (_, i) => new Paragraph({tabStops:[{type:TabStopType.RIGHT, position:W - 1700 - 340, leader:'dot'}], children:[new TextRun({text:`${i + 1}. `, font:FONT, size:21}), new TextRun({text:'\t', font:FONT, size:21, color:'9AA8BC'})], spacing:{before:90, after:30}})))]}));
  kids.push(blank(160));
  kids.push(sectionBox('A. Petunjuk Belajar', num(LKPD_DATA._petunjuk), {fill:'FFFFFF'})); kids.push(blank(140));
  kids.push(sectionBox('B. Capaian Pembelajaran', P(D.cp, {align:AlignmentType.JUSTIFIED}), {fill:'FFFFFF'})); kids.push(blank(140));
  kids.push(sectionBox('C. Tujuan Pembelajaran', num(D.tujuan), {fill:'FFFFFF'}));
  kids.push(new Paragraph({children:[new PageBreak()]}));
  // Tahap 1
  kids.push(bar('Tahap 1: Orientasi Murid pada Masalah', NAVY)); kids.push(blank(100));
  kids.push(box([P('<b>Permasalahan:</b>', {run:{color:NAVY}}), P(D.masalah, {align:AlignmentType.JUSTIFIED}), P(`<i>${D.pemantik}</i>`, {run:{color:NAVY2}, before:80})], {border:NAVY, bsz:8, fill:'FFFFFF', mt:140, mb:140})); kids.push(blank(200));
  // Tahap 2
  kids.push(bar('Tahap 2: Mengorganisasikan Murid untuk Belajar', NAVY)); kids.push(blank(100));
  const disk = [P('<b>Berkumpullah sesuai kelompok yang telah ditentukan dan diskusikan pertanyaan berikut berdasarkan permasalahan di atas.</b>', {align:AlignmentType.JUSTIFIED}), P('<b>AYO DISKUSI</b>', {run:{color:ORANGE}, before:100})];
  D.diskusi.forEach((q, i) => { disk.push(P(`${i + 1}. ${q}`, {before:80})); disk.push(...dots(3)); });
  kids.push(box(disk, {border:NAVY, bsz:8, mt:140, mb:140}));
  kids.push(new Paragraph({children:[new PageBreak()]}));
  // Tahap 3
  kids.push(bar('Tahap 3: Membimbing Penyelidikan Kelompok maupun Individu', NAVY)); kids.push(blank(100));
  D.kegiatan.forEach((k, ki) => {
    const c = [];
    c.push(P('<b>Ayo Membaca!</b>', {run:{color:NAVY}, keep:true}));
    c.push(box([P(k.baca, {align:AlignmentType.JUSTIFIED}), ...bullets(k.poin)], {border:ORANGE, bsz:10, fill:CREAM, mt:120, mb:120}));
    c.push(P(`<b>Alat dan bahan:</b> ${k.alat}`, {before:140}));
    c.push(P('<b>Langkah kerja:</b>', {keep:true})); c.push(...num(k.langkah));
    if(k.perhatian){ c.push(blank(40)); c.push(box(P(`<b>Perhatian!</b> ${k.perhatian}`, {before:0, after:0}), {border:'2563EB', bsz:10, fill:'FFFFFF', mt:100, mb:100})); }
    if(k.rujukan){ c.push(P(`<b>${k.rujukan.judul}</b>`, {before:160, keep:true})); c.push(dataTable(Object.assign({}, k.rujukan), {rowH:300})); }
    c.push(P(`<b>${k.tabel.judul}</b>`, {before:160, keep:true})); c.push(dataTable(k.tabel));
    if(k.catatan) c.push(P(`<i>${k.catatan}</i>`, {run:{color:MUTE, size:18}}));
    c.push(P('<b>Ayo Menjawab!</b>', {run:{color:NAVY}, before:160, keep:true}));
    k.jawab.forEach((q, i) => { c.push(P(`${i + 1}. ${q}`, {before:60})); c.push(...dots(3)); });
    kids.push(bar(`Kegiatan ${'ABCDE'[ki]} — ${k.judul}`, NAVY2, W)); kids.push(blank(60)); kids.push(...c);
    kids.push(blank(200));
  });
  // Tahap 4 & 5
  kids.push(bar('Tahap 4: Mengembangkan dan Menyajikan Hasil Karya', NAVY)); kids.push(blank(100));
  kids.push(box(P(D.sajikan, {align:AlignmentType.JUSTIFIED}), {border:NAVY, bsz:8, mt:140, mb:140})); kids.push(blank(200));
  kids.push(bar('Tahap 5: Menganalisis dan Mengevaluasi Pembelajaran', NAVY)); kids.push(blank(100));
  kids.push(sectionBox('Refleksi Diri', [P(D.refleksi, {align:AlignmentType.JUSTIFIED}), ...dots(5)], {fill:'FFFFFF'})); kids.push(blank(200));
  kids.push(box(P(`<i><b>“${D.quote}”</b></i>`, {run:{color:'7A4A00'}, align:AlignmentType.CENTER, before:0, after:0}), {fill:YEL, w:W, mt:140, mb:140}));

  const header = new Header({children:[new Table({width:{size:W, type:WidthType.DXA}, columnWidths:[W - 900, 900], layout:TableLayoutType.FIXED, borders:{top:NONE, left:NONE, right:NONE, bottom:B(ORANGE, 12), insideHorizontal:NONE, insideVertical:NONE},
    rows:[new TableRow({children:[cell(P(`<b>LKPD IPA</b>  ·  Kelas ${kls}  ·  Bab ${M.bab} ${M.nama}`, {run:{color:NAVY, size:17}, before:0, after:0}), {w:W - 900, ml:0, va:VerticalAlign.BOTTOM, mb:60}),
      cell(new Paragraph({alignment:AlignmentType.RIGHT, children:[new ImageRun({type:'png', data:LOGO, transformation:{width:32, height:32}})]}), {w:900, mr:0, mb:40})]})]})]});
  const footer = new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:'Lab Petualang · LKPD IPA SMPN 4 Magelang  |  ', font:FONT, size:16, color:MUTE}), new TextRun({children:[PageNumber.CURRENT], font:FONT, size:16, color:MUTE, bold:true})]})]});
  return new Document({creator:'Lab Petualang', title:`LKPD IPA — ${D.judul}`, description:meta,
    styles:{default:{document:{run:{font:FONT, size:21}}}},
    sections:[{properties:{page:{size:{width:11906, height:16838}, margin:{top:1134, bottom:1000, left:1134, right:1134, header:500, footer:450}}}, headers:{default:header}, footers:{default:footer}, children:kids}]});
}

(async () => {
  const only = process.argv[2];
  for(const id of Object.keys(MATERI_DATA)){ if(only && id !== only) continue; if(!LKPD_DATA[id]) { console.log('skip', id); continue; }
    const buf = await Packer.toBuffer(build(id)); const kls = MATERI_DATA[id].kelas, bab = MATERI_DATA[id].bab;
    const fn = `${SITE}/lkpd/LKPD-IPA-Kelas${kls}-Bab${bab}-${id}.docx`; fs.writeFileSync(fn, buf); console.log(path.basename(fn), buf.length); }
})();
