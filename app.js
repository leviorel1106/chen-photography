const config = window.SITE_CONFIG;
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
function closeMenu() { menu?.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false'); }
menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menu?.classList.toggle('open', open); });
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
document.querySelectorAll('[data-whatsapp]').forEach(link => { if (config.whatsapp) { link.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent('היי חן, אשמח לשמוע על סשן צילום איתך')}`; link.target = '_blank'; link.rel = 'noopener noreferrer'; } });
document.querySelectorAll('[data-instagram]').forEach(link => { if (config.instagram) { link.href = config.instagram; link.target = '_blank'; link.rel = 'noopener noreferrer'; } });
const privacy = document.querySelector('#privacy-dialog');
document.querySelectorAll('[data-cookie-settings]').forEach(button => button.addEventListener('click', () => privacy?.showModal()));
document.querySelectorAll('[data-close-privacy]').forEach(button => button.addEventListener('click', () => privacy?.close()));
privacy?.addEventListener('click', event => { if(event.target === privacy) { const r = privacy.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) privacy.close(); } });

const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');
let leadReady = false;
let requestId = null;
const startedAt = Date.now();
if (form) {
  if (config.staticPreview) {
    status.textContent = 'הטופס עדיין לא מקבל פניות. בינתיים אפשר לפנות לחן בוואטסאפ.';
  } else fetch('/api/status').then(response => response.json()).then(data => {
    leadReady = data.leadsReady === true;
    if (!leadReady) status.textContent = 'הטופס עדיין לא מקבל פניות. בינתיים אפשר לפנות לחן בוואטסאפ.';
  }).catch(() => { status.textContent = 'הטופס אינו זמין כרגע. אפשר לפנות לחן בוואטסאפ.'; });
  form.addEventListener('input', () => { requestId = null; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type=submit]');
    status.classList.remove('error');
    if (!leadReady) { status.textContent = 'הטופס עדיין לא מחובר לקבלת פניות. הפרטים לא נשלחו. אפשר ליצור קשר באמצעות כפתור הוואטסאפ.'; status.classList.add('error'); return; }
    requestId ||= crypto.randomUUID();
    const payload = Object.fromEntries(new FormData(form));
    payload.consent = form.elements.consent.checked;
    payload.startedAt = startedAt;
    payload.requestId = requestId;
    button.disabled = true;
    status.textContent = 'שולחת את הפנייה…';
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'לא ניתן לשלוח את הפנייה כרגע. נסי שוב או כתבי לי בוואטסאפ.');
      status.textContent = 'תודה! הפנייה שלך התקבלה. אחזור אלייך להמשך ההיכרות.';
      form.reset(); requestId = null;
    } catch(error) {
      status.textContent = error.name === 'TimeoutError' ? 'לא התקבל אישור שליחה. אפשר לנסות שוב או לפנות בוואטסאפ.' : error.message;
      status.classList.add('error');
    } finally { button.disabled = false; }
  });
}
