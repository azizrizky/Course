/* Lab Petualang — dialog & notifikasi bergaya dasbor (pengganti alert/confirm bawaan peramban)
   uiConfirm(teks, {title, icon, img, ok, cancel, danger}) → Promise<boolean>
   uiAlert(teks, {title, icon})                             → Promise<void>
   uiNotify(teks, {icon, tone, ms})                          → notifikasi kecil melayang */
(function(){
if(window.uiDialog) return;
const css = `
.uid-ov{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:18px;background:rgba(6,12,30,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .28s ease;perspective:1100px}
.uid-ov.on{opacity:1}
.uid-card{position:relative;width:min(440px,100%);border-radius:28px;padding:30px 26px 22px;text-align:center;color:#eef4ff;font-family:'Nunito','Segoe UI',sans-serif;
  background:linear-gradient(160deg,rgba(30,44,90,.97),rgba(18,26,58,.97));border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 80px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.12);
  transform:rotateX(22deg) translateY(40px) scale(.86);opacity:0;transition:transform .55s cubic-bezier(.18,1.25,.4,1),opacity .3s}
.uid-ov.on .uid-card{transform:none;opacity:1}
.uid-ov.out .uid-card{transform:rotateX(-14deg) translateY(-24px) scale(.9);opacity:0;transition:transform .3s ease-in,opacity .25s}
html[data-theme=light] .uid-card{color:#14213d;background:linear-gradient(160deg,#ffffff,#eef4ff);border-color:rgba(20,33,61,.1);box-shadow:0 30px 70px rgba(40,60,120,.25)}
.uid-card:before{content:'';position:absolute;inset:-2px;border-radius:30px;padding:2px;background:linear-gradient(135deg,#2dd4bf,#a78bfa,#f472b6);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:.8;pointer-events:none}
.uid-ic{width:86px;height:86px;margin:-72px auto 10px;border-radius:50%;display:grid;place-items:center;font-size:44px;position:relative;
  background:radial-gradient(circle at 30% 25%,#5eead4,#0d9488 70%);box-shadow:0 14px 30px rgba(13,148,136,.45),inset 0 -6px 14px rgba(0,0,0,.2);animation:uidPop .7s cubic-bezier(.2,1.6,.4,1) .08s both}
.uid-ic.danger{background:radial-gradient(circle at 30% 25%,#fda4af,#e11d48 70%);box-shadow:0 14px 30px rgba(225,29,72,.45),inset 0 -6px 14px rgba(0,0,0,.2)}
.uid-ic.warn{background:radial-gradient(circle at 30% 25%,#fde68a,#f59e0b 70%);box-shadow:0 14px 30px rgba(245,158,11,.45),inset 0 -6px 14px rgba(0,0,0,.2)}
.uid-ic img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:4px solid #fff}
.uid-ic:after{content:'';position:absolute;inset:-8px;border-radius:50%;border:3px solid currentColor;color:rgba(45,212,191,.6);animation:uidRing 1.6s ease-out infinite}
.uid-ic.danger:after{color:rgba(244,63,94,.6)}.uid-ic.warn:after{color:rgba(245,158,11,.6)}
@keyframes uidPop{from{transform:scale(.2) rotate(-25deg)}}
@keyframes uidRing{from{transform:scale(.9);opacity:1}to{transform:scale(1.35);opacity:0}}
.uid-card h3{margin:6px 0 6px;font-family:'Baloo 2','Nunito',sans-serif;font-size:26px;line-height:1.15}
.uid-card p{margin:0 0 20px;font-weight:700;font-size:16px;line-height:1.5;opacity:.85}
.uid-bt{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.uid-bt button{flex:1;min-width:120px;border:none;border-radius:16px;padding:13px 18px;font:900 16px 'Nunito',sans-serif;cursor:pointer;transition:transform .15s,box-shadow .15s}
.uid-bt button:hover{transform:translateY(-2px)}
.uid-bt button:active{transform:translateY(2px)}
.uid-no{background:rgba(255,255,255,.1);color:inherit;border:1px solid rgba(255,255,255,.18)!important}
html[data-theme=light] .uid-no{background:#eef2f7;border-color:rgba(20,33,61,.12)!important}
.uid-ok{color:#fff;background:linear-gradient(135deg,#0d9488,#2dd4bf);box-shadow:0 6px 0 #0f766e}
.uid-ok.danger{background:linear-gradient(135deg,#e11d48,#fb7185);box-shadow:0 6px 0 #9f1239}
.uid-conf{position:fixed;width:10px;height:16px;border-radius:3px;z-index:100000;pointer-events:none}
.uid-nt{position:fixed;left:50%;top:18px;z-index:99998;display:flex;align-items:center;gap:12px;padding:12px 18px 12px 12px;border-radius:18px;font:800 15px 'Nunito',sans-serif;color:#eef4ff;
  background:linear-gradient(135deg,rgba(30,44,90,.96),rgba(18,26,58,.96));border:1px solid rgba(255,255,255,.14);box-shadow:0 16px 40px rgba(0,0,0,.35);transform:translate(-50%,-140%) rotateX(40deg);transition:transform .5s cubic-bezier(.2,1.3,.4,1);max-width:min(92vw,520px)}
.uid-nt.on{transform:translate(-50%,0)}
html[data-theme=light] .uid-nt{color:#14213d;background:#fff;border-color:rgba(20,33,61,.1)}
.uid-nt i{font-style:normal;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:20px;background:linear-gradient(135deg,#0d9488,#2dd4bf);flex:none}
.uid-nt.danger i{background:linear-gradient(135deg,#e11d48,#fb7185)}.uid-nt.warn i{background:linear-gradient(135deg,#f59e0b,#fbbf24)}
.uid-curtain{position:fixed;inset:0;z-index:99997;display:grid;place-items:center;pointer-events:none;background:radial-gradient(circle at 50% 45%,#2dd4bf,#4c1d95 70%);clip-path:circle(0% at 50% 50%);transition:clip-path .7s cubic-bezier(.7,0,.3,1)}
.uid-curtain.on{clip-path:circle(150% at 50% 50%)}
.uid-curtain b{font-family:'Baloo 2','Nunito',sans-serif;font-size:clamp(28px,6vw,54px);color:#fff;text-shadow:0 6px 24px rgba(0,0,0,.3);transform:translateY(20px) scale(.9);opacity:0;transition:.5s .35s}
.uid-curtain.on b{transform:none;opacity:1}
@media (prefers-reduced-motion:reduce){.uid-card,.uid-ov,.uid-nt,.uid-curtain{transition:none!important}.uid-ic,.uid-ic:after{animation:none!important}}`;
const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let open = 0;
function uiDialog(o){
  return new Promise(res => {
    open++; const ov = document.createElement('div'); ov.className = 'uid-ov'; const tone = o.danger ? 'danger' : o.warn ? 'warn' : '';
    ov.innerHTML = `<div class="uid-card" role="dialog" aria-modal="true"><div class="uid-ic ${tone}">${o.img ? `<img src="${o.img}" alt="">` : (o.icon || (o.cancel ? '❓' : '💬'))}</div>
      <h3>${esc(o.title || (o.cancel ? 'Yakin?' : 'Info'))}</h3><p>${o.html || esc(o.text || '')}</p>
      <div class="uid-bt">${o.cancel ? `<button class="uid-no">${esc(o.cancel)}</button>` : ''}<button class="uid-ok ${tone}">${esc(o.ok || 'Oke')}</button></div></div>`;
    document.body.appendChild(ov); requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('on')));
    const okB = ov.querySelector('.uid-ok'), noB = ov.querySelector('.uid-no'); setTimeout(() => okB.focus(), 60);
    const done = v => { if(ov._d) return; ov._d = 1; ov.classList.add('out'); ov.classList.remove('on'); removeEventListener('keydown', key, true); setTimeout(() => { ov.remove(); open--; }, 320); res(v); };
    const key = e => { if(e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); done(false); } else if(e.key === 'Enter'){ e.preventDefault(); e.stopPropagation(); done(true); } };
    addEventListener('keydown', key, true);
    okB.onclick = () => done(true); if(noB) noB.onclick = () => done(false);
    ov.addEventListener('pointerdown', e => { if(e.target === ov) done(!o.cancel); });
  });
}
const uiConfirm = (text, o = {}) => uiDialog(Object.assign({cancel:'Batal', ok:'Ya', text}, o));
const uiAlert = (text, o = {}) => uiDialog(Object.assign({text}, o)).then(() => {});
function uiNotify(text, o = {}){ const n = document.createElement('div'); n.className = 'uid-nt ' + (o.tone || ''); n.innerHTML = `<i>${o.icon || '✨'}</i><span>${esc(text)}</span>`;
  document.body.appendChild(n); requestAnimationFrame(() => requestAnimationFrame(() => n.classList.add('on'))); setTimeout(() => { n.classList.remove('on'); setTimeout(() => n.remove(), 500); }, o.ms || 2600); }
function uiCurtain(text, ms = 1300){ return new Promise(res => { const c = document.createElement('div'); c.className = 'uid-curtain'; c.innerHTML = `<b>${esc(text)}</b>`; document.body.appendChild(c);
  requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('on'))); setTimeout(() => { res(); c.style.transition = 'opacity .45s'; c.style.opacity = 0; setTimeout(() => c.remove(), 500); }, ms); }); }
window.uiDialog = uiDialog; window.uiConfirm = uiConfirm; window.uiAlert = uiAlert; window.uiNotify = uiNotify; window.uiCurtain = uiCurtain;
window.alert = m => { uiAlert(String(m), {icon:'💡', title:'Info'}); };
})();
