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
let submitting = false;
let requestId = null;
if (form) {
  form.addEventListener('input', () => { requestId = null; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    const button = form.querySelector('button[type=submit]');
    status.classList.remove('error');
    if (form.elements.website.value) return;
    requestId ||= crypto.randomUUID();
    const categories = { undecided: 'עדיין מתלבטת', home: 'בית', urban: 'עיר', portrait: 'פורטרט — חבילה בהתאמה אישית' };
    const payload = {
      'שם': form.elements.name.value.trim(),
      'טלפון': form.elements.phone.value.trim(),
      'סוג סשן': categories[form.elements.category.value] || 'עדיין מתלבטת',
      'הודעה': form.elements.message.value.trim() || 'לא נכתבה הודעה',
      'הסכמה לשימוש בפרטים לצורך מענה': 'כן',
      'מזהה פנייה': requestId,
      _subject: 'פנייה חדשה מהאתר — חן פומיל',
      _template: 'table',
      _url: 'https://leviorel1106.github.io/chen-photography/',
      _honey: ''
    };
    submitting = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'שולחת את הפנייה…';
    try {
      const response = await fetch(config.leadEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)
      });
      const data = await response.json();
      if (!response.ok || !(data.success === true || data.success === 'true')) {
        if (/activat/i.test(data.message || '')) throw new Error('הטופס ממתין לאימות כתובת המייל של חן. הפנייה לא אושרה לשליחה. אפשר לפנות בינתיים בוואטסאפ.');
        throw new Error('לא התקבל אישור שליחה. הפרטים נשמרו בטופס; אפשר לנסות שוב או לפנות בוואטסאפ.');
      }
      status.textContent = 'תודה! הפנייה שלך נשלחה לחן. אחזור אלייך להמשך ההיכרות.';
      form.reset(); requestId = null;
    } catch(error) {
      status.textContent = error.name === 'TimeoutError' ? 'לא התקבל אישור בזמן. ייתכן שהפנייה נשלחה; אפשר לפנות בוואטסאפ לבירור.' : (error.message?.startsWith('הטופס') || error.message?.startsWith('לא התקבל') ? error.message : 'לא ניתן להתחבר לשירות השליחה. הפרטים נשמרו בטופס; נסי שוב בעוד רגע.');
      status.classList.add('error');
    } finally {
      submitting = false; button.disabled = false; form.removeAttribute('aria-busy');
    }
  });
}
