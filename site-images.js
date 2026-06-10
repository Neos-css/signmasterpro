/* ============================================================
   site-images.js — ⚙️ ศูนย์รวม "รูปที่เปลี่ยนได้เอง" ของเว็บ
   ------------------------------------------------------------
   รูป 5 จุด: 4 การ์ดบริการ + 1 เกี่ยวกับเรา
   เปลี่ยนได้จากหลังบ้าน (เมนู 🖼️ จัดการภาพ) โดยไม่ต้องแก้โค้ด
   - เดโม: เก็บใน localStorage (เปลี่ยนเห็นเฉพาะเครื่องเดียว)
   - ต่อจริง: ย้ายไป Supabase table `sm_site_images` (เห็นทุกคน)
   ============================================================ */
window.SITE_IMAGES_DEFAULT = {
  hero:     { label:'🌟 ภาพปก (Hero)',   group:'lightbox', pos:'center',     src:'media/assets/img/service/gallery/lightbox-neon/lightbox-neon1.jpg' },
  booth:    { label:'🎪 บูธ & อีเวนต์',  group:'booth',    pos:'center 42%', src:'media/assets/img/service/gallery/booth/booth1.jpg' },
  inkjet:   { label:'🖨️ งานอิงค์เจท',    group:'inkjet',   pos:'center 38%', src:'media/assets/img/service/gallery/inkjet-vinyl/inkjet-vinyl3.jpg' },
  sign:     { label:'🪧 ป้ายทุกชนิด',     group:'sign',     pos:'center 78%', src:'media/assets/img/service/gallery/sign-background/sign-background1.jpg' },
  lightbox: { label:'💡 ตู้ไฟ',           group:'lightbox', pos:'center 45%', src:'media/assets/img/service/gallery/lightbox-front-light/lightbox-front-light1.jpg' },
  about:    { label:'🏢 เกี่ยวกับเรา',     group:'sign',     pos:'center 78%', src:'media/assets/img/service/gallery/sign-background/sign-background1.jpg' },
};

/* รวม default + ค่าที่บันทึกไว้ (localStorage) → window.SITE_IMAGES */
window.SITE_IMAGES = (function(){
  var d = JSON.parse(JSON.stringify(window.SITE_IMAGES_DEFAULT));
  try{
    var saved = JSON.parse(localStorage.getItem('sm_site_images') || '{}');
    for(var k in saved){ if(d[k] && saved[k] && saved[k].src){ d[k].src = saved[k].src; if(saved[k].pos) d[k].pos = saved[k].pos; } }
  }catch(e){}
  return d;
})();
