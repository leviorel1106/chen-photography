const categories = {
  home: { title: 'בבית', description: 'הסביבה הטבעית שלך, המקום שבו את הכי את. תיעוד רך, אותנטי וקרוב.' },
  urban: { title: 'בעיר', description: 'הקצב של יפו תל אביב, האור ברחובות והטקסטורות של העיר.' },
  portrait: { title: 'פורטרט', description: 'המקום להעז, לחקור ויזואלית ולהביא את העולם הפנימי שלך לקדמת הבמה.' }
};
const requested = new URLSearchParams(location.search).get('category');
const category = Object.hasOwn(categories, requested) ? requested : 'home';
const details = categories[category];
document.title = `${details.title} | הגלריות של חן פומיל`;
document.querySelector('#gallery-heading').textContent = details.title;
document.querySelector('#gallery-description').textContent = details.description;
document.querySelector(`[data-category=${category}]`).setAttribute('aria-current', 'page');
const box = document.querySelector('#lightbox');
const large = document.querySelector('#lightbox-image');
let photos = [], current = 0, opener;
function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  const photo = photos[current];
  large.src = photo.src; large.alt = photo.alt || `${details.title}, צילום אמנותי של חן פומיל, תמונה ${current + 1}`;
  document.querySelector('#lightbox-heading').textContent = `${details.title} · חן פומיל`;
  document.querySelector('#lightbox-counter').textContent = `${current + 1} מתוך ${photos.length}`;
}
function openPhoto(index, trigger) { opener = trigger; showPhoto(index); box.showModal(); document.body.classList.add('modal-open'); document.querySelector('#close-lightbox').focus(); }
box.addEventListener('close', () => { document.body.classList.remove('modal-open'); large.removeAttribute('src'); opener?.focus(); });
document.querySelector('#close-lightbox').addEventListener('click', () => box.close());
document.querySelector('#previous-photo').addEventListener('click', () => showPhoto(current - 1));
document.querySelector('#next-photo').addEventListener('click', () => showPhoto(current + 1));
box.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(current + 1); } if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(current - 1); } });
large.addEventListener('error', () => { document.querySelector('#lightbox-counter').textContent = 'לא ניתן לטעון את התמונה. אפשר לעבור לתמונה הבאה.'; });
fetch('assets/manifest.json').then(response => { if(!response.ok) throw new Error(); return response.json(); }).then(manifest => {
  photos = manifest.filter(photo => photo.group === category);
  if(!photos.length) throw new Error();
  const grid = document.querySelector('#photo-grid');
  photos.forEach((photo, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'photo-button'; button.setAttribute('aria-label', `הגדלת תמונה ${index + 1} בגלריית ${details.title}`);
    const img = document.createElement('img'); img.src = photo.thumb; img.srcset = `${photo.thumb} 480w, ${photo.src} 1600w`; img.sizes = '(max-width: 700px) 48vw, (max-width: 1000px) 45vw, 30vw'; img.width = photo.width; img.height = photo.height; img.alt = photo.alt || `${details.title}, צילום אמנותי של חן פומיל, תמונה ${index + 1}`; img.loading = index < 3 ? 'eager' : 'lazy';
    button.append(img); button.addEventListener('click', () => openPhoto(index, button)); grid.append(button);
  });
}).catch(() => { const status = document.querySelector('#gallery-status'); status.textContent = 'לא ניתן לטעון את הגלריה כרגע. נסו לרענן את העמוד, או חזרו לעמוד הבית.'; });
