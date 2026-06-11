/* ============================================================
   i18n.js — สลับภาษา TH/EN ทั้งเว็บ Signmaster Pro
   ------------------------------------------------------------
   หลักการ: ทุก element ที่มีข้อความไทย ใส่ attribute data-en="..."
   JS สลับ innerHTML ระหว่างไทย(เดิม)↔EN · จำค่าใน localStorage
   - data-en      : สลับ innerHTML
   - data-en-ph   : สลับ placeholder
   - window.SM_LANG : ภาษาปัจจุบัน ('th' | 'en')
   - window.t(th,en) : helper เลือกข้อความตามภาษา (ใช้ในโค้ด dynamic)
   - window.onLangChange(lang) : ถ้าหน้านั้นนิยามไว้ จะถูกเรียกหลังสลับ
                                 (ใช้ re-render เนื้อหาที่ JS สร้าง)
   ============================================================ */
(function(){
  window.SM_LANG = localStorage.getItem('sm_lang')
    || ((navigator.language||'').toLowerCase().startsWith('en') ? 'en' : 'th');

  window.t = function(th, en){ return window.SM_LANG === 'en' ? en : th; };

  window.applyLang = function(lang){
    window.SM_LANG = (lang === 'en') ? 'en' : 'th';
    // ข้อความทั่วไป (innerHTML)
    document.querySelectorAll('[data-en]').forEach(function(el){
      if(el.dataset.th === undefined) el.dataset.th = el.innerHTML;   // เก็บไทยต้นฉบับครั้งแรก
      el.innerHTML = (window.SM_LANG === 'en') ? el.getAttribute('data-en') : el.dataset.th;
    });
    // placeholder
    document.querySelectorAll('[data-en-ph]').forEach(function(el){
      if(el.dataset.thPh === undefined) el.dataset.thPh = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', (window.SM_LANG === 'en') ? el.getAttribute('data-en-ph') : el.dataset.thPh);
    });
    document.documentElement.lang = window.SM_LANG;
    localStorage.setItem('sm_lang', window.SM_LANG);
    document.querySelectorAll('.langbtn').forEach(function(b){
      b.classList.toggle('on', b.dataset.l === window.SM_LANG);
    });
    if(typeof window.onLangChange === 'function'){ try{ window.onLangChange(window.SM_LANG); }catch(e){} }
  };

  document.addEventListener('DOMContentLoaded', function(){ window.applyLang(window.SM_LANG); });
})();
