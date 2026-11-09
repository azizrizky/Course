/* Lab Petualang — mengubah lembar LKPD (HTML hasil edit) menjadi .docx asli di peramban (pakai docx.js, dimuat saat dibutuhkan) */
(function(){
const NAVY = '13254A', NAVY2 = '1E3F78', ORANGE = 'F28C28', CREAM = 'FFF4E6', SKY = 'D9EBFA', PALE = 'F3F8FD', YEL = 'FFD166', MUTE = '5B6B82', FONT = 'Calibri', W = 9638;
let LIB = null;
const loadLib = () => LIB ? Promise.resolve(LIB) : new Promise((res, rej) => { if(window.docx) return res(LIB = window.docx); const s = document.createElement('script'); s.src = 'assets/vendor/docx.min.js'; s.onload = () => res(LIB = window.docx); s.onerror = () => rej(new Error('Pustaka Word gagal dimuat (periksa internet)')); document.head.appendChild(s); });
const hex = c => { if(!c) return null; c = c.trim(); if(c[0] === '#') return (c.length === 4 ? c.slice(1).split('').map(x => x + x).join('') : c.slice(1, 7)).toUpperCase();
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/); if(m){ if(m[4] !== undefined && +m[4] === 0) return null; return [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('').toUpperCase(); }
  const n = {red:'FF0000', blue:'0000FF', green:'008000', black:'000000', white:'FFFFFF', yellow:'FFFF00', orange:'FFA500'}[c.toLowerCase()]; return n || null; };
const ptOf = v => { if(!v) return null; const m = String(v).match(/([\d.]+)\s*(pt|px|em|rem)?/); if(!m) return null; const n = +m[1], u = m[2] || 'px'; return u === 'pt' ? n : u === 'px' ? n*.75 : n*10.5; };
const FSIZE = {'1':8, '2':10, '3':12, '4':14, '5':18, '6':24, '7':36, 'x-small':8, small:10, medium:12, large:14, 'x-large':18, 'xx-large':24, 'xxx-large':36};

async function imgData(src){ const r = await fetch(src); const buf = await r.arrayBuffer(); const blob = new Blob([buf]); const url = URL.createObjectURL(blob);
  const dim = await new Promise(res => { const i = new Image(); i.onload = () => res([i.naturalWidth, i.naturalHeight]); i.onerror = () => res([400, 300]); i.src = url; }); URL.revokeObjectURL(url);
  const t = (r.headers.get('content-type') || src.slice(5, 20)).includes('png') || /\.png/i.test(src) ? 'png' : (/gif/.test(src) ? 'gif' : 'jpg'); return {data:new Uint8Array(buf), w:dim[0], h:dim[1], type:t}; }

window.lkpdToDocx = async function(sheetEl, meta){
  const D = await loadLib();
  const {Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, AlignmentType, ImageRun, Header, Footer, PageNumber, TabStopType, LineRuleType, VerticalAlign, TableLayoutType, PageBreak} = D;
  const B = (c, sz = 8, st = BorderStyle.SINGLE) => ({style:st, size:sz, color:c}), NONE = {style:BorderStyle.NONE, size:0, color:'FFFFFF'};
  const borders = (c, sz) => ({top:B(c, sz), bottom:B(c, sz), left:B(c, sz), right:B(c, sz)}), noB = {top:NONE, bottom:NONE, left:NONE, right:NONE};
  const IMG = new Map(); for(const im of sheetEl.querySelectorAll('img')){ const s = im.getAttribute('src'); if(s && !IMG.has(s)) try{ IMG.set(s, await imgData(s)); }catch(e){} }
  const imgRun = im => { const d = IMG.get(im.getAttribute('src')); if(!d) return null; let w = +(im.getAttribute('width') || 0) || Math.min(d.w, 600); w = Math.min(w, 620); return new ImageRun({type:d.type, data:d.data, transformation:{width:w, height:Math.round(w*d.h/d.w)}}); };
  /* ---- inline ---- */
  function runs(node, f, out){
    if(node.nodeType === 3){ const t = node.textContent.replace(/\s+/g, ' '); if(t) out.push(new TextRun(Object.assign({text:t, font:f.font || FONT, size:Math.round((f.size || 10.5)*2)}, f.b ? {bold:true} : {}, f.i ? {italics:true} : {}, f.u ? {underline:{}} : {}, f.s ? {strike:true} : {}, f.sup ? {superScript:true} : {}, f.sub ? {subScript:true} : {}, f.color ? {color:f.color} : {}, f.bg ? {shading:{type:ShadingType.CLEAR, fill:f.bg, color:'auto'}} : {}))); return; }
    if(node.nodeType !== 1) return; const el = node, tag = el.tagName, g = Object.assign({}, f), st = el.style || {};
    if(tag === 'BR'){ out.push(new TextRun({text:'', break:1})); return; }
    if(tag === 'IMG'){ const r = imgRun(el); if(r) out.push(r); return; }
    if(/^(B|STRONG|TH)$/.test(tag)) g.b = true; if(/^(I|EM)$/.test(tag)) g.i = true; if(tag === 'U') g.u = true; if(/^(S|STRIKE|DEL)$/.test(tag)) g.s = true; if(tag === 'SUP') g.sup = true; if(tag === 'SUB') g.sub = true;
    if(tag === 'FONT'){ if(el.getAttribute('color')) g.color = hex(el.getAttribute('color')); if(el.getAttribute('face')) g.font = el.getAttribute('face').split(',')[0].replace(/['"]/g, ''); if(el.getAttribute('size')) g.size = FSIZE[el.getAttribute('size')] || g.size; }
    if(st.fontWeight && (st.fontWeight === 'bold' || +st.fontWeight >= 600)) g.b = true; if(st.fontWeight === 'normal') g.b = false; if(st.fontStyle === 'italic') g.i = true;
    if((st.textDecoration || st.textDecorationLine || '').includes('underline')) g.u = true; if((st.textDecoration || st.textDecorationLine || '').includes('line-through')) g.s = true;
    if(st.color) g.color = hex(st.color) || g.color; if(st.backgroundColor) g.bg = hex(st.backgroundColor) || g.bg;
    if(st.fontSize) g.size = FSIZE[st.fontSize] || ptOf(st.fontSize) || g.size; if(st.fontFamily) g.font = st.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    if(st.verticalAlign === 'super') g.sup = true; if(st.verticalAlign === 'sub') g.sub = true;
    el.childNodes.forEach(c => runs(c, g, out)); }
  const INLINE = /^(#text|B|STRONG|I|EM|U|S|STRIKE|DEL|SUP|SUB|SPAN|FONT|A|BR|IMG|SMALL|MARK|CODE|LABEL)$/;
  const isInline = n => n.nodeType === 3 || (n.nodeType === 1 && INLINE.test(n.tagName) && !(n.classList && (n.classList.contains('lk-ln'))));
  const align = el => ({center:AlignmentType.CENTER, right:AlignmentType.RIGHT, justify:AlignmentType.JUSTIFIED})[(el.style && el.style.textAlign) || el.getAttribute && el.getAttribute('align')] || undefined;
  const para = (children, o = {}) => new Paragraph(Object.assign({children, spacing:{before:o.before ?? 30, after:o.after ?? 50, line:276, lineRule:LineRuleType.AUTO}}, o.align ? {alignment:o.align} : {}, o.indent ? {indent:o.indent} : {}, o.keep ? {keepNext:true} : {}, o.shade ? {shading:{type:ShadingType.CLEAR, fill:o.shade, color:'auto'}} : {}, o.border ? {border:o.border} : {}, o.tabs ? {tabStops:o.tabs} : {}));
  const spacer = a => { const p = para([], {after:a, before:0}); p._sp = true; return p; };
  const dotLine = (w, pre = []) => para([...pre, new TextRun({text:'\t', font:FONT, color:'9AA8BC'})], {tabs:[{type:TabStopType.RIGHT, position:w - 200, leader:'dot'}], before:130, after:30});
  const cellOf = (kids, o = {}) => new TableCell({children:kids.length ? kids : [para([])], width:{size:o.w, type:WidthType.DXA}, shading:o.fill ? {fill:o.fill, type:ShadingType.CLEAR, color:'auto'} : undefined, borders:o.borders || noB, margins:{top:o.mt ?? 90, bottom:o.mb ?? 90, left:o.ml ?? 150, right:o.mr ?? 150}, verticalAlign:o.va || VerticalAlign.TOP, columnSpan:o.span});
  const box = (kids, w, o = {}) => new Table({width:{size:w, type:WidthType.DXA}, columnWidths:[w], layout:TableLayoutType.FIXED, rows:[new TableRow({children:[cellOf(kids, Object.assign({w}, o))]})]});
  const inlineRuns = (el, f) => { const out = []; el.childNodes.forEach(c => runs(c, f, out)); return out; };

  /* ---- blok ---- */
  function blocks(parent, w, base = {}){ const out = []; let buf = [];
    const flush = () => { if(buf.length){ const r = []; buf.forEach(n => runs(n, base, r)); if(r.some(x => true) && buf.some(n => n.nodeType !== 3 || n.textContent.trim())) out.push(para(r)); buf = []; } };
    parent.childNodes.forEach(n => { if(isInline(n)){ buf.push(n); return; } flush(); if(n.nodeType === 1){ const b = block(n, w, base); if(b[0] && b[0]._pb) while(out.length && out[out.length - 1]._sp) out.pop(); out.push(...b); } });
    flush(); return out; }
  function block(el, w, base){ const cl = el.classList, tag = el.tagName;
    if(cl.contains('lk-pb')){ const p = new Paragraph({children:[], pageBreakBefore:true, spacing:{before:0, after:0}}); p._pb = true; return [p]; }
    if(cl.contains('lk-dot')) return [dotLine(w)];
    if(cl.contains('lk-cover')){ const img = el.querySelector('img'), txt = el.firstElementChild && el.firstElementChild.tagName !== 'IMG' ? el.firstElementChild : null, lw = Math.round(w*.58);
      return [new Table({width:{size:w, type:WidthType.DXA}, columnWidths:[lw, w - lw], layout:TableLayoutType.FIXED, rows:[new TableRow({children:[cellOf(txt ? blocks(txt, lw) : [], {w:lw, ml:0, va:VerticalAlign.CENTER}), cellOf(img ? [para([imgRun(img)].filter(Boolean), {align:AlignmentType.RIGHT})] : [], {w:w - lw, mr:0, va:VerticalAlign.CENTER})]})]}), spacer(100)]; }
    if(cl.contains('lk-id')){ const rows = [...el.children].map(r => { const lab = r.querySelector('b'), rest = [...r.childNodes].filter(x => x !== lab), cw = w - 1700;
        const val = []; rest.forEach(x => { if(x.nodeType === 1 && x.classList.contains('lk-ln')) val.push(dotLine(cw - 300)); else if(x.nodeType === 1 && /^(OL|UL)$/.test(x.tagName)) [...x.children].forEach((li, i) => val.push(dotLine(cw - 300, [new TextRun({text:`${i + 1}. `, font:FONT, size:21})]))); else if(x.nodeType === 1 || x.textContent.trim()) { const r2 = []; runs(x, {}, r2); val.push(para(r2, {before:20, after:20})); } });
        return new TableRow({children:[cellOf([para(lab ? inlineRuns(lab, {b:true}) : [], {before:20, after:20})], {w:1700, fill:CREAM, mt:40, mb:40}), cellOf(val, {w:cw, fill:CREAM, mt:40, mb:40})]}); });
      return [new Table({width:{size:w, type:WidthType.DXA}, columnWidths:[1700, w - 1700], layout:TableLayoutType.FIXED, borders:{top:B(ORANGE, 12), bottom:B(ORANGE, 12), left:NONE, right:NONE, insideHorizontal:NONE, insideVertical:NONE}, rows}), spacer(120)]; }
    if(cl.contains('lk-box')){ const h = el.querySelector(':scope > h3'), body = el.querySelector(':scope > div') || el;
      return [new Table({width:{size:w, type:WidthType.DXA}, columnWidths:[w], layout:TableLayoutType.FIXED, rows:[
        new TableRow({cantSplit:true, children:[cellOf([para(h ? inlineRuns(h, {b:true, color:'FFFFFF', size:11}) : [], {before:0, after:0, keep:true})], {w, fill:ORANGE, borders:borders(NAVY, 8), mt:60, mb:60})]}),
        new TableRow({children:[cellOf(blocks(body === el ? el : body, w - 300), {w, borders:borders(NAVY, 8), mt:90, mb:110})]})]}), spacer(120)]; }
    if(cl.contains('lk-bar')){ const k = cl.contains('k'), c = k ? NAVY2 : NAVY, bw = k ? w : Math.min(w, 6400);
      return [new Paragraph({children:inlineRuns(el, {b:true, color:'FFFFFF', size:11}), keepNext:true, shading:{type:ShadingType.CLEAR, fill:c, color:'auto'}, border:{top:B(c, 18), bottom:B(c, 18), left:B(c, 24), right:B(c, 24)}, indent:{left:60, right:w - bw + 60}, spacing:{before:160, after:120}})]; }
    const boxed = {'lk-frame':[NAVY, 8, null], 'lk-read':[ORANGE, 10, CREAM], 'lk-warn':['2563EB', 10, null]};
    for(const k in boxed) if(cl.contains(k)){ const [bc, bs, fill] = boxed[k]; return [box(blocks(el, w - 300), w, {borders:borders(bc, bs), fill, mt:110, mb:110}), spacer(80)]; }
    if(cl.contains('lk-quote') || tag === 'BLOCKQUOTE') return [box([para(inlineRuns(el, {b:true, i:true, color:'7A4A00'}), {align:AlignmentType.CENTER, before:0, after:0})], w, {fill:YEL, mt:130, mb:130})];
    if(tag === 'TABLE') return [tableOf(el, w), spacer(60)];
    if(tag === 'OL' || tag === 'UL') return listOf(el, w, 0);
    if(tag === 'HR') return [para([], {border:{bottom:B('9AA8BC', 6)}})];
    if(tag === 'IMG'){ const r = imgRun(el); return r ? [para([r], {align:AlignmentType.CENTER})] : []; }
    if(/^H[1-6]$/.test(tag) || tag === 'P' || ((tag === 'DIV' || tag === 'SECTION' || tag === 'HEADER' || tag === 'ARTICLE' || tag === 'FOOTER') && [...el.childNodes].every(isInline))){
      const f = Object.assign({}, base);
      if(tag === 'H1'){ f.b = true; f.size = 28; f.color = NAVY; } if(tag === 'H2'){ f.b = true; f.size = 14; f.color = NAVY2; } if(tag === 'H3' || tag === 'H4'){ f.b = true; f.size = 11.5; }
      if(cl.contains('lk-kick')){ f.b = true; f.size = 8; f.color = ORANGE; } if(cl.contains('lk-meta') || cl.contains('lk-foot')){ f.size = 9; f.color = MUTE; } if(cl.contains('lk-sub')){ f.b = true; f.color = NAVY; }
      if(cl.contains('lk-or')){ f.color = ORANGE; } if(cl.contains('lk-q')){ f.color = NAVY2; } if(cl.contains('lk-tt')) f.b = true; if(cl.contains('lk-note')){ f.i = true; f.color = MUTE; f.size = 9; }
      const r = inlineRuns(el, f); return [para(r, {align:align(el) || (cl.contains('lk-foot') ? AlignmentType.CENTER : undefined), keep:/^H/.test(tag) || cl.contains('lk-sub') || cl.contains('lk-tt'), before:/^H/.test(tag) ? 80 : 30})]; }
    return blocks(el, w, base); }
  function listOf(el, w, lvl){ const out = [], ord = el.tagName === 'OL'; let i = 0;
    [...el.children].forEach(li => { if(li.tagName !== 'LI') return; i++; const inl = [], sub = [];
      li.childNodes.forEach(c => { if(c.nodeType === 1 && /^(OL|UL)$/.test(c.tagName)) sub.push(c); else runs(c, {}, inl); });
      const ind = 360 + lvl*360; out.push(para([new TextRun(ord ? {text:`${i}.`, font:FONT, size:21} : {text:'●', font:FONT, size:14, color:ORANGE}), new TextRun({text:'\t'}), ...inl], {tabs:[{type:TabStopType.LEFT, position:ind}], indent:{left:ind, hanging:360}}));
      sub.forEach(s => out.push(...listOf(s, w, lvl + 1))); });
    return out; }
  function tableOf(t, w){ const rows = [...t.rows]; if(!rows.length) return para([]); const n = Math.max(...rows.map(r => [...r.cells].reduce((a, c) => a + (c.colSpan || 1), 0)));
    const first = n > 1 ? Math.round(w*(n > 5 ? .2 : .28)) : w, rest = n > 1 ? Math.floor((w - first)/(n - 1)) : 0, cw = [first, ...Array(n - 1).fill(rest)]; cw[n - 1] += w - cw.reduce((a, b) => a + b, 0);
    return new Table({width:{size:w, type:WidthType.DXA}, columnWidths:cw, layout:TableLayoutType.FIXED, rows:rows.map((r, ri) => { let ci = 0;
      return new TableRow({cantSplit:true, tableHeader:r.parentElement.tagName === 'THEAD', height:{value:380, rule:'atLeast'}, children:[...r.cells].map(c => { const span = c.colSpan || 1, cwid = cw.slice(ci, ci + span).reduce((a, b) => a + b, 0); ci += span; const th = c.tagName === 'TH';
        const fill = hex(c.style.backgroundColor) || (th ? SKY : (ri % 2 === 0 ? 'FFFFFF' : PALE)), kids = blocks(c, cwid - 120, th ? {b:true, color:NAVY, size:9.5} : {size:9.5});
        return cellOf(kids.length ? kids : [para([])], {w:cwid, span:span > 1 ? span : undefined, fill, borders:borders(th ? '7FA3CF' : '9DB7D8', 4), mt:40, mb:40, ml:80, mr:80, va:VerticalAlign.CENTER}); })}); })}); }

  const body = blocks(sheetEl, W);
  const header = new Header({children:[new Paragraph({children:[new TextRun({text:'LKPD IPA', bold:true, font:FONT, size:17, color:NAVY}), new TextRun({text:'  ·  ' + meta.head, font:FONT, size:17, color:NAVY})], border:{bottom:B(ORANGE, 12)}, spacing:{after:60}})]});
  const footer = new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:'Lab Petualang · LKPD IPA SMPN 4 Magelang  |  ', font:FONT, size:16, color:MUTE}), new TextRun({children:[PageNumber.CURRENT], font:FONT, size:16, color:MUTE, bold:true})]})]});
  const doc = new Document({creator:'Lab Petualang', title:meta.title, styles:{default:{document:{run:{font:FONT, size:21}}}},
    sections:[{properties:{page:{size:{width:11906, height:16838}, margin:{top:1134, bottom:1000, left:1134, right:1134, header:500, footer:450}}}, headers:{default:header}, footers:{default:footer}, children:body}]});
  return Packer.toBlob(doc);
};
})();
