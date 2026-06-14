/* ============================================================
   price-config.js — ⚙️ ศูนย์รวมราคา Signmaster Pro (config-driven)
   ------------------------------------------------------------
   🟡 ราคาทั้งหมดเป็น "ประมาณการ" จากเว็บเดิม signmasterpro.co.th
      → รอลูกค้ายืนยันราคาจริง (คาดได้พรุ่งนี้ 9 มิ.ย.)
   👉 พอได้ราคาจริง: แก้ตัวเลขในไฟล์นี้ที่เดียว เว็บอัปเดตทั้งระบบ
   ============================================================ */
window.PRICE_CONFIG = {
  draft: true,                                  // true = โชว์ป้าย "ราคาประมาณการ รอยืนยัน"
  updated: "2026-06-08",
  currency: "บาท",

  /* วัสดุงานพิมพ์ คิดตาม ตร.ม. (price_1_9 = 1-9 ตร.ม. / price_10 = 10 ตร.ม.ขึ้นไป) */
  materials: [
    // ── INKJET OUTDOOR 720 DPI (งานทั่วไป) ──
    { id:"o720-vinyl-opaque",  group:"inkjet", line:"Outdoor 720 DPI", name:"ไวนิลทึบแสง",            name_en:"Opaque vinyl",            price_1_9:150, price_10:120 },
    { id:"o720-vinyl-trans",   group:"inkjet", line:"Outdoor 720 DPI", name:"ไวนิลโปร่งแสง",          name_en:"Translucent vinyl",       price_1_9:250, price_10:230 },
    { id:"o720-sticker-pvc",   group:"inkjet", line:"Outdoor 720 DPI", name:"สติกเกอร์ PVC (ขาว/ใส)", name_en:"PVC sticker (white/clear)", price_1_9:350, price_10:300 },
    { id:"o720-sticker-see",   group:"inkjet", line:"Outdoor 720 DPI", name:"สติกเกอร์ซีทรู",          name_en:"See-through sticker",     price_1_9:350, price_10:300 },

    // ── INKJET OUTDOOR 1440 DPI (คมชัดระดับภาพถ่าย · MIMAKI) ──
    { id:"o1440-vinyl-opaque", group:"inkjet", line:"Outdoor 1440 DPI", name:"ไวนิลทึบแสง (คมชัด)",     name_en:"Opaque vinyl (HD)",        price_1_9:350, price_10:300 },
    { id:"o1440-vinyl-trans",  group:"inkjet", line:"Outdoor 1440 DPI", name:"ไวนิลโปร่งแสง (คมชัด)",   name_en:"Translucent vinyl (HD)",   price_1_9:450, price_10:400 },
    { id:"o1440-sticker-pvc",  group:"inkjet", line:"Outdoor 1440 DPI", name:"สติกเกอร์ PVC (ขาว/ใส)",  name_en:"PVC sticker (white/clear)", price_1_9:450, price_10:400 },
    { id:"o1440-sticker-3m",   group:"inkjet", line:"Outdoor 1440 DPI", name:"สติกเกอร์ 3M ลอกออกได้",  name_en:"3M removable sticker",     price_1_9:500, price_10:450 },
    { id:"o1440-canvas",       group:"inkjet", line:"Outdoor 1440 DPI", name:"ผ้าแคนวาส / ผ้า IT",      name_en:"Canvas / IT fabric",       price_1_9:500, price_10:450 },

    // ── INKJET INDOOR 1200 DPI (งานในร่ม · HP DesignJet) ──
    { id:"i1200-photo",        group:"inkjet", line:"Indoor 1200 DPI", name:"กระดาษโฟโต้ / PP",         name_en:"Photo paper / PP",        price_1_9:350, price_10:300 },
    { id:"i1200-sticker",      group:"inkjet", line:"Indoor 1200 DPI", name:"สติกเกอร์ PP / PVC",       name_en:"PP / PVC sticker",        price_1_9:450, price_10:400 },
    { id:"i1200-backlit",      group:"inkjet", line:"Indoor 1200 DPI", name:"สติกเกอร์/ฟิล์มแบ็คลิท",   name_en:"Backlit sticker / film",  price_1_9:500, price_10:450 },
    { id:"i1200-canvas",       group:"inkjet", line:"Indoor 1200 DPI", name:"แคนวาส (ในร่ม)",            name_en:"Canvas (indoor)",         price_1_9:500, price_10:450 },

    // ── ป้าย / ตู้ไฟ (เว็บเดิมไม่ระบุราคา → ประเมินหน้างาน) ──
    { id:"sign-quote",     group:"sign",     line:"ป้ายทุกชนิด",  name:"ป้ายโลหะ/อะคริลิก/ตัวอักษร ฯลฯ", name_en:"Metal/acrylic signs, letters, etc.", quote:true },
    { id:"lightbox-quote", group:"lightbox", line:"ตู้ไฟ",        name:"ตู้ไฟ / ตัวอักษรซ่อนไฟ",          name_en:"Lightbox / hidden-light letters",    quote:true },
    { id:"booth-quote",    group:"booth",    line:"งานบูธ/อีเวนต์", name:"ออกบูธ/งานอีเวนต์ (ประเมินหน้างาน)", name_en:"Event booth (on-site quote)",        quote:true },
  ],

  /* สินค้าสำเร็จรูป คิดเป็นชิ้น (Booth / Roll Up / Backdrop) */
  products: [
    { id:"rollup-50x120",  group:"booth", name:"Roll Up 50×120 ซม.", price:650 },
    { id:"rollup-60x160",  group:"booth", name:"Roll Up 60×160 ซม.", price:750 },
    { id:"rollup-50x150",  group:"booth", name:"Roll Up 50×150 ซม.", price:850 },
    { id:"rollup-80x180",  group:"booth", name:"Roll Up 80×180 ซม.", price:900 },
    { id:"rollup-80x200",  group:"booth", name:"Roll Up 80×200 ซม.", price:1200 },
    { id:"rollup-85x200",  group:"booth", name:"Roll Up 85×200 ซม.", price:1300 },
    { id:"rollup-100x200", group:"booth", name:"Roll Up 100×200 ซม.", price:1500 },
    { id:"counter-frame",  group:"booth", name:"เคาน์เตอร์ 2×2 (เฉพาะโครง)", price:3500 },
    { id:"counter-print",  group:"booth", name:"เคาน์เตอร์ 2×2 (โครง+พิมพ์)", price:5500 },
    { id:"backdrop",       group:"booth", name:"Backdrop 3×2–3×5 ม. (โครง+พิมพ์)", price_from:4900, price_to:13500 },
  ],

  /* ค่าบริการเสริม (ประมาณการ — รอยืนยัน) */
  options: {
    design_fee:  { label:"ค่าออกแบบ (ถ้าให้เราออกแบบ)", label_en:"Design fee (if we design it)", price:500, draft:true },
    install_fee: { label:"ค่าติดตั้ง (ต่อ ตร.ม.)",       label_en:"Installation (per sq.m.)",    price:100, draft:true },
  },
};
