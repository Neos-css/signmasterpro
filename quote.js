/* ============================================================
   quote.js — สร้างใบเสนอราคา A4 (Signmaster Pro) ฝั่งลูกค้า
   ------------------------------------------------------------
   ลูกค้ากดหลัง wizard → เปิดแท็บใหม่ → ใบเสนอราคา → พิมพ์ PDF
   - ข้อมูลบริษัท/บัญชี/Tax ID = พิมพ์บนใบอยู่แล้ว (ไม่ลับ) → ทำ client-side ได้
   - ลายเซ็น/ตรา = ยังไม่มี → เว้นเส้นประไว้ (ภายหลังย้ายเข้า Worker base64)
   เรียกใช้: window.printSignmasterQuote({ customer:{name,phone,email,note},
            items:[{desc,subs:[],qty,unit,price}], vatRate })
   ============================================================ */
(function () {
  var CO = {
    name: 'บริษัท ซายน์ มาสเตอร์โปร จำกัด',
    addr: '188/7 ถนนกาญจนาภิเษก แขวงสะพานสูง เขตสะพานสูง กรุงเทพฯ 10250',
    tel: '0-2373-7050-2', fax: '0-2373-7052',
    email: 'sign_masterpro@hotmail.com, aaadsign@gmail.com',
    web: 'www.signmasterpro.co.th',
    taxId: '0105550107618', taxNote: 'สำนักงานใหญ่',
    seller: 'คุณพชร / คุณนก',
    signer: 'นายพชร มงคลโภชน์', signerRole: 'ผู้จัดการ',
    bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
    bankBranch: 'สาขาหมู่บ้านนักกีฬาแหลมทอง · ออมทรัพย์',
    bankAcc: 'บริษัท ซายน์ มาสเตอร์โปร จำกัด',
    bankNo: '211-207922-2'
  };
  var THMON = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function baht(n){ n=Math.round((Number(n)||0)*100)/100; return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function thaiDate(d){ return d.getDate()+' '+THMON[d.getMonth()]+' '+(d.getFullYear()+543); }
  function quoteNo(d){ var p=function(x){return ('0'+x).slice(-2);}; return 'SMW'+String(d.getFullYear()+543).slice(-2)+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes()); }

  // โลโก้ส้ม (mark) ใช้ในหัวใบ — ดึงจาก #smart ถ้าหน้านั้นมี ไม่งั้น fallback ตัวอักษร
  function logoSVG(){
    var src = document.getElementById('smart');
    if (src) return '<svg viewBox="144 158 326 202" style="height:54px;width:auto">'+src.innerHTML+'</svg>';
    return '<div style="font-family:Anton,sans-serif;font-size:30px;color:#e63900;font-weight:700">SIGNMASTER PRO</div>';
  }

  function buildQuoteHTML(d){
    var now = new Date();
    var qno = d.quoteNo || quoteNo(now);   // ใช้เลขเดียวกับที่ระบบบันทึก/ส่งเมล
    var items = Array.isArray(d.items) ? d.items : [];
    var vatRate = (d.vatRate != null) ? d.vatRate : 0.07;
    var rows = items.map(function(it,i){
      var subs = (it.subs||[]).map(function(s){ return '<div class="ds">• '+esc(s)+'</div>'; }).join('');
      var amt = Number(it.price||0)*Number(it.qty||1);
      return '<tr><td class="c-no">'+(i+1)+'</td><td class="c-desc"><div class="dm">'+esc(it.desc)+'</div>'+subs+'</td><td class="c-qty">'+esc(it.qty||1)+'</td><td class="c-unit">'+esc(it.unit||'')+'</td><td class="c-price">'+baht(it.price)+'</td><td class="c-amt">'+baht(amt)+'</td></tr>';
    }).join('');
    // เติมแถวว่างให้ตารางสวย (อย่างน้อย 6 แถว)
    for (var k=items.length; k<6; k++) rows += '<tr><td class="c-no">&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>';
    var total = items.reduce(function(s,it){ return s+Number(it.price||0)*Number(it.qty||1); },0);
    var vat = total*vatRate, grand = total+vat;
    var c = d.customer||{};
    var pay = d.paymentNote || 'ชำระก่อนส่งมอบ/ติดตั้งงาน';
    // ลายเซ็น+ตราประทับบริษัท: ฉีดผ่าน window.SM_SIGN_IMG หรือ d.signImg (URL/base64)
    //   — ไม่ฝังลงไฟล์ quote.js (committed/public) กันลายเซ็น-ตราหลุด · ใส่จากไฟล์ gitignored/worker เฉพาะที่ปลอดภัย
    var signImg = d.signImg || (typeof window!=='undefined' && window.SM_SIGN_IMG) || 'https://signmaster-mail.neos-css01.workers.dev/sign-asset';
    var signBlock = signImg
      ? '<div style="height:106px;display:flex;align-items:flex-end;justify-content:center;margin:2px 0">'
        + '<img src="'+signImg+'" alt="ลายเซ็นและตราประทับบริษัท" style="max-height:106px;max-width:215px;object-fit:contain"></div>'
      : '<div class="sign-line"></div>';
    var lead = d.leadTime || 'ประมาณ 7–15 วันทำการ (ขึ้นกับปริมาณงาน)';
    var valid = d.validDays || 15;

    return '<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>ใบเสนอราคา Signmaster Pro · '+qno+'</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Anton&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}body{font-family:Sarabun,sans-serif;color:#1a1a1a;background:#e8e8e8;font-size:14px}'
    + '.cls-1{fill:#e63900}.cls-2{fill:#ff8a00}.cls-3{fill:#ff8a00}.cls-4{fill:#ff8a00}.cls-5{fill:#ff5a1f}.cls-6{fill:#e63900}.cls-7{fill:#e63900}.cls-8{fill:#ff9a1a}.cls-9{fill:#ff8a00}.cls-10{fill:#ff8a00}.cls-11{fill:#ff8a00}.cls-12{fill:#ff5a1f}.cls-14{fill:#ff9a1a}.cls-15{fill:#ff8a00}.cls-16{fill:#e63900}.cls-17{fill:#ff8a00}.cls-18{fill:#e63900}'
    + '.page{width:210mm;min-height:297mm;margin:16px auto;background:#fff;padding:16mm 15mm;box-shadow:0 2px 12px rgba(0,0,0,.15)}'
    + '@media print{body{background:#fff}.page{margin:0;box-shadow:none;width:auto;min-height:auto;padding:10mm}.noprint{display:none}}'
    + '.bar{max-width:210mm;margin:8px auto;display:flex;gap:10px;justify-content:center}.bar button{padding:10px 22px;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer}.bar .p{background:#e63900;color:#fff}.bar .c{background:#eee;color:#333}'
    + '.head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #e63900;padding-bottom:10px;gap:14px}'
    + '.co .name{font-size:19px;font-weight:700;color:#111}.co .addr{font-size:11.5px;color:#444;line-height:1.55;margin-top:3px}'
    + '.title{text-align:center;font-size:22px;font-weight:700;margin:14px 0 4px;letter-spacing:1px;color:#e63900}'
    + '.onlinebadge{text-align:center;font-size:11.5px;color:#9a3412;background:#fff2eb;border:1px dashed #f4a06a;border-radius:6px;padding:5px 10px;margin:0 0 10px;font-weight:600}'
    + '.meta{display:flex;justify-content:space-between;margin-bottom:8px;gap:16px}.meta div{font-size:12.5px;line-height:1.85}.meta b{font-weight:600}.fill{color:#c2410c;font-weight:600}'
    + 'table{width:100%;border-collapse:collapse;margin-top:4px}th,td{border:1px solid #555;padding:6px 8px;font-size:12.5px;vertical-align:top}th{background:#fff2eb;text-align:center;font-weight:600;color:#7c2d12}'
    + '.c-no{width:7%;text-align:center}.c-desc{width:47%}.c-qty{width:10%;text-align:center}.c-unit{width:10%;text-align:center}.c-price{width:13%;text-align:right}.c-amt{width:13%;text-align:right}'
    + '.dm{font-weight:600}.ds{font-size:11.5px;color:#555;padding-left:6px}'
    + '.sum-label{text-align:right;font-weight:600;background:#fff2eb}.sum-val{text-align:right;font-weight:600}.grand{background:#e63900;color:#fff}'
    + '.terms{display:flex;gap:12px;margin:12px 0 6px;font-size:11.5px}.terms .col{flex:1;border:1px solid #ffd9c7;border-radius:6px;padding:9px 11px;line-height:1.7}.terms h4{font-size:11.5px;color:#c2410c;margin-bottom:4px;font-weight:700}.terms .warn{color:#b00020;font-weight:600;margin-top:5px;font-size:10.5px}'
    + '.signs{display:flex;justify-content:space-between;margin-top:24px;text-align:center}.sign-box{width:45%}.sign-line{border-bottom:1px dotted #333;height:50px;margin-bottom:6px}'
    + '.sign-role{font-weight:600;font-size:12.5px}.sign-date{font-size:11.5px;color:#555;margin-top:3px}'
    + '</style></head><body>'
    + '<div class="bar noprint"><button class="p" onclick="window.print()">🖨️ บันทึก / พิมพ์ PDF</button><button class="c" onclick="window.close()">ปิด</button></div>'
    + '<div class="page">'
    + '<div class="head"><div style="flex:none">'+logoSVG()+'</div>'
    +   '<div class="co" style="text-align:right"><div class="name">'+CO.name+'</div><div class="addr">'+CO.addr+'<br>โทร '+CO.tel+' · แฟกซ์ '+CO.fax+'<br>'+CO.email+' · '+CO.web+'<br>เลขประจำตัวผู้เสียภาษี '+CO.taxId+' ('+CO.taxNote+')</div></div></div>'
    + '<div class="title">ใบเสนอราคา / QUOTATION</div>'
    + '<div class="onlinebadge">🌐 ฉบับออนไลน์ · ประเมินราคาเบื้องต้น (Online Estimate) — ราคาอาจปรับเปลี่ยนตามหน้างานจริงโดยทีมงาน Signmaster Pro</div>'
    + '<div class="meta"><div><b>เรียน / To:</b> <span class="fill">'+esc(c.name||'-')+'</span><br><b>ติดต่อ / Tel:</b> <span class="fill">'+esc([c.phone,c.email].filter(Boolean).join(' · ')||'-')+'</span>'+(c.note?'<br><b>หมายเหตุ:</b> '+esc(c.note):'')+'</div>'
    +   '<div style="text-align:right"><b>เลขที่ / No.:</b> <span class="fill">'+qno+'</span><br><b>วันที่ / Date:</b> <span class="fill">'+thaiDate(now)+'</span><br><b>พนักงานขาย:</b> '+CO.seller+'</div></div>'
    + '<table><thead><tr><th class="c-no">ลำดับ<br>Item</th><th class="c-desc">รายการ<br>Description</th><th class="c-qty">จำนวน<br>Qty</th><th class="c-unit">หน่วย<br>Unit</th><th class="c-price">ราคา/หน่วย<br>Unit Price</th><th class="c-amt">ราคารวม<br>Amount</th></tr></thead><tbody>'+rows
    +   '<tr><td colspan="4" rowspan="3" style="vertical-align:top;font-size:11.5px;color:#555"><b>หมายเหตุ:</b><br>• ราคานี้เป็นราคาประเมินจากข้อมูลที่ลูกค้าระบุบนเว็บ<br>• ยังไม่รวมค่าออกแบบ/ติดตั้ง (ถ้ามี จะแจ้งแยก)<br>• งานป้าย/ตู้ไฟบางประเภทประเมินหน้างานอีกครั้ง</td>'
    +     '<td class="sum-label">รวมเป็นเงิน / TOTAL</td><td class="sum-val">'+baht(total)+'</td></tr>'
    +   '<tr><td class="sum-label">ภาษีมูลค่าเพิ่ม / VAT 7%</td><td class="sum-val">'+baht(vat)+'</td></tr>'
    +   '<tr><td class="sum-label grand">รวมทั้งสิ้น / GRAND TOTAL</td><td class="sum-val grand">'+baht(grand)+'</td></tr>'
    + '</tbody></table>'
    + '<div class="terms"><div class="col"><h4>เงื่อนไข / Terms</h4>• ระยะเวลาการผลิต: '+esc(lead)+'<br>• ยืนราคา: '+esc(valid)+' วัน นับจากวันที่เสนอราคา<br>• กำหนดการชำระเงิน: '+esc(pay)+'</div>'
    +   '<div class="col"><h4>ชำระเงิน / Payment (โอนตรง)</h4>'+CO.bankName+'<br>'+CO.bankBranch+'<br>ชื่อบัญชี: <b>'+CO.bankAcc+'</b><br>เลขที่บัญชี: <b>'+CO.bankNo+'</b><div class="warn">⚠️ โอนเข้าบัญชีชื่อบริษัทเท่านั้น · ส่งหลักฐานการโอนให้ทีมงานยืนยัน</div></div></div>'
    + '<div class="signs"><div class="sign-box"><div style="font-weight:600;font-size:12.5px;margin-bottom:6px">ยืนยันการสั่งซื้อตามเอกสารฉบับนี้</div><div style="font-size:10.5px;color:#777;margin-bottom:16px">Purchase approved per this quotation</div><div class="sign-line"></div><div class="sign-role">ผู้สั่งซื้อ / Customer</div><div class="sign-date">วันที่ ......./......./.......</div></div>'
    +   '<div class="sign-box"><div style="font-weight:600;font-size:12.5px;margin-bottom:6px">ขอแสดงความนับถือ</div><div style="font-size:11.5px;color:#444;margin-bottom:4px">'+CO.name+'</div>'+signBlock+'<div class="sign-role">( '+CO.signer+' )</div><div class="sign-date">'+CO.signerRole+'</div></div></div>'
    + '</div></body></html>';
  }

  window.printSignmasterQuote = function (d) {
    var w = window.open('', '_blank');
    var html = buildQuoteHTML(d || {});
    if (!w) { // ป๊อปอัปถูกบล็อก → fallback เปิดด้วย data URL
      var blob = new Blob([html], { type: 'text/html' });
      window.open(URL.createObjectURL(blob), '_blank');
      return;
    }
    w.document.open(); w.document.write(html); w.document.close();
  };
})();
