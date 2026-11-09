# Render ilustrasi sampul LKPD per bab (SVG dari ILL) -> PNG
import asyncio, json, subprocess
from playwright.async_api import async_playwright
ids = json.loads(subprocess.check_output(['node','-e',"global.window=global;require('/home/claude/v5/site/assets/lkpd.js');require('/home/claude/v5/site/assets/materi.js');console.log(JSON.stringify(Object.keys(MATERI_DATA).map(k=>[k,LKPD_DATA[k].ikon,LKPD_DATA[k].warna,MATERI_DATA[k].bab,MATERI_DATA[k].kelas])))"]))
html = """<html><body style='margin:0;background:transparent'><script src='http://127.0.0.1:8090/slide/ill.js'></script><div id=c></div><script>
function card(ic,col,bab,kls,ix){return `<div class=cv style="width:560px;height:340px;position:relative;font-family:Nunito,Arial,sans-serif">
<svg width=560 height=340 style="position:absolute;inset:0"><defs><linearGradient id="g${ix}" x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color="${col}"/><stop offset=1 stop-color="#13254A"/></linearGradient></defs>
<rect x=10 y=10 width=540 height=320 rx=40 fill="url(#g${ix})"/>
<g fill="#fff" opacity=.18>${Array.from({length:40},(_,i)=>`<rect x="${30+(i%10)*55}" y="${30+Math.floor(i/10)*90}" width="5" height="5" rx="2.5"/>`).join('')}</g></svg>
<div style="position:absolute;left:34px;top:26px;background:#F28C28;color:#fff;font-weight:900;font-size:22px;padding:6px 18px;border-radius:30px">KELAS ${kls==7?'VII':'VIII'} · BAB ${bab}</div>
<div style="position:absolute;left:30px;right:30px;top:90px;bottom:24px;display:flex;gap:22px;justify-content:center;align-items:center">
${ic.map((k,i)=>`<div style="width:150px;height:150px;border-radius:34px;background:#fff;display:grid;place-items:center;box-shadow:0 12px 26px rgba(0,0,0,.3);transform:rotate(${[-6,3,-2][i]}deg) translateY(${[10,-14,8][i]}px)"><div style="width:120px;height:120px">${ILL[k]}</div></div>`).join('')}</div></div>`}
document.getElementById('c').innerHTML = DATA.map((d,i)=>card(d[1],d[2],d[3],d[4],i)).join('');
document.querySelectorAll('.cv svg').forEach(s=>{}); 
</script><style>.cv div svg{width:100%;height:100%}</style></body></html>"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(device_scale_factor=2)
        await pg.goto('http://127.0.0.1:8090/index.html')
        await pg.set_content(html.replace('DATA', json.dumps(ids))); await pg.wait_for_timeout(800)
        els = await pg.query_selector_all('.cv')
        for (k, *_), el in zip(ids, els): await el.screenshot(path=f'/home/claude/v5/site/lkpd/img/{k}.png', omit_background=True)
        await b.close(); print(len(els))
asyncio.run(main())
