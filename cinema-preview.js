const effect=new URLSearchParams(location.search).get('effect')==='table'?'table':'camera';
const stage=document.querySelector('.cinema-stage');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
stage.classList.add(`demo-${effect}`);
document.querySelector(`[data-demo="${effect}"]`).setAttribute('aria-current','page');
document.querySelector('#demo-hint').textContent=effect==='camera'?'המצלמה מצלמת, הפילם נע והתמונות מתפתחות. לחצו ״נגן שוב״ לצפייה חוזרת.':'גללו מטה: ההירו נשאר במקום ורצועות הפילם חושפות צילומים נוספים.';
const label=document.querySelector('.sequence-label');let timers=[];
function play(){timers.forEach(clearTimeout);timers=[];window.scrollTo({top:0,behavior:'instant'});stage.classList.remove('play');void stage.offsetWidth;stage.classList.add('play');label.textContent=reduced.matches?'': 'מוכנה לצילום';if(!reduced.matches){timers.push(setTimeout(()=>label.textContent='מפתחת את הסיפור…',1100),setTimeout(()=>label.textContent='',4400));}}
document.querySelector('#replay').addEventListener('click',play);
let pending=false;
function update(){pending=false;if(effect!=='table'||reduced.matches)return;const top=innerWidth<=700?82:100;const rect=stage.getBoundingClientRect();const hero=stage.querySelector('.cinema-hero');const progress=Math.max(0,Math.min(1,(top-rect.top)/(stage.offsetHeight-hero.offsetHeight)));stage.querySelectorAll('.film-track').forEach((track,i)=>{const travel=track.scrollWidth-track.parentElement.clientWidth;track.style.setProperty('--strip-x',`${-(i===0?progress:1-progress)*travel}px`)});}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);
Promise.all([...stage.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))).then(()=>{play();update()});
reduced.addEventListener('change',()=>{play();update()});
