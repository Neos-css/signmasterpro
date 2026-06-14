/* ============================================================
   ink-widget.js — แชตน้องอิงค์ (self-contained) ใส่ได้ทุกหน้า
   ใช้ในหน้ารอง (price.html / faq.html) · index.html มีตัวเต็มของตัวเอง
   เรียก worker signmaster-proxy /chat · ปุ่มลัดที่ต้องมีฟอร์ม → ลิงก์กลับ index
   ============================================================ */
(function(){
  if(window.__inkWidget) return; window.__inkWidget = true;
  var W = 'https://signmaster-proxy.neos-css01.workers.dev';
  function t(th,en){ return (localStorage.getItem('sm_lang')==='en') ? en : th; }
  // visitor id ถาวร (key เดียวกับ index) → worker เก็บ sm_chat_logs + sm_chat_ip ด้วย key นี้ ให้ admin เห็น IP+บล็อกได้
  var vid = localStorage.getItem('sm_vid');
  if(!vid){ vid='v_'+Math.random().toString(36).slice(2)+Date.now(); try{localStorage.setItem('sm_vid',vid);}catch(e){} }
  var hist = [];

  var css = document.createElement('style');
  css.textContent =
    '.iw-fab{position:fixed;bottom:18px;right:18px;z-index:1200;display:flex;align-items:center;gap:7px;border:0;cursor:pointer;background:linear-gradient(150deg,#ffa64d,#ff5a1f);color:#fff;font-weight:700;font-size:.9rem;padding:9px 16px 9px 9px;border-radius:999px;box-shadow:0 8px 22px rgba(230,57,0,.4);font-family:inherit}'
   +'.iw-fab .av{width:26px;height:26px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:.95rem}'
   +'.iw-fab.hide{display:none}'
   +'.iw-panel{position:fixed;bottom:18px;right:18px;z-index:1201;width:340px;max-width:92vw;height:520px;max-height:80vh;background:#fff;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden;font-family:inherit}'
   +'.iw-panel.open{display:flex}'
   +'.iw-head{background:linear-gradient(150deg,#ffa64d,#ff5a1f);color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}'
   +'.iw-head .av{width:38px;height:38px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:1.2rem}'
   +'.iw-head b{font-size:1rem}.iw-head small{display:block;font-size:.72rem;opacity:.92}'
   +'.iw-x{margin-left:auto;cursor:pointer;font-size:1.5rem;line-height:1}'
   +'.iw-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f7f8fa}'
   +'.iw-msg{max-width:82%;padding:9px 13px;border-radius:14px;font-size:.9rem;line-height:1.55}'
   +'.iw-msg.bot{background:#fff;border:1px solid #eee;align-self:flex-start;border-bottom-left-radius:4px}'
   +'.iw-msg.me{background:linear-gradient(150deg,#ffa64d,#ff5a1f);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}'
   +'.iw-quick{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;border-top:1px solid #eee}'
   +'.iw-quick button{font-size:.78rem;padding:6px 10px;border:1px solid #e5e7eb;background:#fff;border-radius:14px;cursor:pointer;font-family:inherit}'
   +'.iw-input{display:flex;gap:6px;padding:10px 12px;border-top:1px solid #eee}'
   +'.iw-input input{flex:1;border:1px solid #e5e7eb;border-radius:20px;padding:9px 14px;font:inherit;font-size:.9rem;outline:none}'
   +'.iw-input button{border:0;background:linear-gradient(150deg,#ffa64d,#ff5a1f);color:#fff;width:40px;border-radius:50%;cursor:pointer;font-size:1rem}';
  document.head.appendChild(css);

  var fab = document.createElement('button');
  fab.className = 'iw-fab'; fab.id = 'iwFab';
  fab.innerHTML = '<span class="av">🤖</span> ' + t('ปรึกษาน้องอิงค์','Chat with Ink');

  var panel = document.createElement('div');
  panel.className = 'iw-panel'; panel.id = 'iwPanel';
  panel.innerHTML =
    '<div class="iw-head"><span class="av">🤖</span><div><b>'+t('น้องอิงค์','Ink')+'</b><small>'+t('ผู้ช่วย AI งานป้าย · ออนไลน์ 24 ชม.','AI sign assistant · online 24/7')+'</small></div><span class="iw-x" id="iwX">×</span></div>'
   +'<div class="iw-body" id="iwBody"><div class="iw-msg bot">'+t('สวัสดีค่ะ 👋 <b>น้องอิงค์</b>เองค่ะ อยากทำป้ายแบบไหนดีคะ? สอบถามบริการ ขอดูผลงาน หรือประเมินราคาได้เลยค่ะ 🙂','Hi! 👋 I\'m <b>Ink</b>. What sign would you like? Ask about services, see our work, or get a quote 🙂')+'</div></div>'
   +'<div class="iw-quick">'
     +'<button data-q="'+t('ขอประเมินราคางานป้าย','Get a price quote')+'">💰 '+t('ประเมินราคา','Quote')+'</button>'
     +'<button data-q="'+t('มีบริการอะไรบ้าง','What services do you offer?')+'">🧱 '+t('บริการ','Services')+'</button>'
     +'<button data-q="'+t('ขอดูผลงาน','Show me your portfolio')+'">🖼️ '+t('ผลงาน','Portfolio')+'</button>'
     +'<button data-go="index.html#bulk">🎁 '+t('ราคาพิเศษ','Special Price')+'</button>'
   +'</div>'
   +'<div class="iw-input"><input id="iwText" placeholder="'+t('พิมพ์ถึงน้องอิงค์...','Message Ink...')+'"><button id="iwSend" aria-label="send">➤</button></div>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  function toggle(){ panel.classList.toggle('open'); fab.classList.toggle('hide'); }
  function push(txt,cls){ var b=document.getElementById('iwBody'); var d=document.createElement('div'); d.className='iw-msg '+cls; d.innerHTML=txt; b.appendChild(d); b.scrollTop=b.scrollHeight; return d; }
  async function reply(q){
    var d = push('···','bot');
    try{
      var r = await fetch(W+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q,history:hist.slice(-6).join('\n'),user:vid,name:(localStorage.getItem('sm_name')||''),log:true})});
      var j = await r.json().catch(function(){return {};});
      var a = j.answer || t('ขออภัยค่ะ ลองใหม่อีกครั้งนะคะ','Sorry, please try again');
      d.innerHTML = String(a).replace(/</g,'&lt;').replace(/&lt;br&gt;/g,'<br>').replace(/\n/g,'<br>');
      hist.push('ลูกค้า: '+q); hist.push('น้องอิงค์: '+a);
    }catch(e){ d.innerHTML = t('ขออภัยค่ะ เชื่อมต่อไม่ได้ ลองใหม่นะคะ 🙏','Sorry, connection error 🙏'); }
  }
  function ask(q){ push(q.replace(/</g,'&lt;'),'me'); reply(q); }

  fab.onclick = toggle;
  panel.querySelector('#iwX').onclick = toggle;
  panel.querySelectorAll('.iw-quick button').forEach(function(b){
    b.onclick = function(){ if(b.dataset.go){ location.href=b.dataset.go; } else { ask(b.dataset.q); } };
  });
  function send(){ var i=document.getElementById('iwText'); var v=i.value.trim(); if(!v)return; i.value=''; ask(v); }
  document.getElementById('iwSend').onclick = send;
  document.getElementById('iwText').addEventListener('keydown', function(e){ if(e.key==='Enter') send(); });
})();
