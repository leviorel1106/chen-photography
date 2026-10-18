
const effect = new URLSearchParams(location.search).get('effect') === 'focus' ? 'focus' : 'prints';
const hero = document.querySelector('.hero');
const panels = [...hero.querySelectorAll('.hero-panel img')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector(`[data-effect="${effect}"]`).setAttribute('aria-current','page');
document.querySelector('#motion-hint').textContent = effect === 'prints' ? 'גלול מעט מטה ומעלה כדי לראות את תנועת הצילומים. במחשב אפשר גם לעבור עליהם עם העכבר.' : 'התמונות נכנסות בהדרגה לפוקוס. אפשר להפעיל שוב להשוואה.';
let pending = false;
function update(){pending=false;if(reduced.matches)return;const rect=hero.getBoundingClientRect();const amount=Math.min(1,Math.max(0,(120-rect.top)/rect.height));const distance=innerWidth<=700?10:20;panels.forEach((img,i)=>img.style.setProperty('--photo-y',`${amount*distance*(i%2?1:-1)}px`));}
function start(){hero.classList.remove('effect-focus','effect-prints');void hero.offsetWidth;hero.classList.add(`effect-${effect}`);if(effect==='prints')update();}
document.querySelector('#replay').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'instant'});start();});
if(effect==='prints')addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});
addEventListener('resize',update);reduced.addEventListener('change',()=>{panels.forEach(img=>img.style.removeProperty('--photo-y'));start()});
Promise.all(panels.map(img=>img.decode().catch(()=>{}))).then(start);
