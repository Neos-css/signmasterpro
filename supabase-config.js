/* ============================================================
   supabase-config.js — เชื่อมเว็บ Signmaster Pro กับ Supabase
   ------------------------------------------------------------
   🔑 publishable key = ปลอดภัยใส่ในเว็บได้ (ป้องกันด้วย RLS)
   ❌ service_role key ห้ามใส่ในเว็บเด็ดขาด (ใช้เฉพาะ Worker)
   ============================================================ */
window.SB_URL = 'https://naiphyycmgoyudmipwwn.supabase.co';
window.SB_KEY = 'sb_publishable_xay0xr3SawwfClEJrqTEpg_9oEXtmBk';

/* สร้าง client (ถ้าโหลด supabase-js สำเร็จ) */
window.SB = (window.supabase && window.SB_URL)
  ? window.supabase.createClient(window.SB_URL, window.SB_KEY)
  : null;
