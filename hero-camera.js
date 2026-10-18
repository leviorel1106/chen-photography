
const cameraStage=document.querySelector('.demo-camera');
const cameraReduced=matchMedia('(prefers-reduced-motion: reduce)');
function startCamera(){if(!cameraReduced.matches)cameraStage.classList.add('play');}
Promise.all([...cameraStage.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))).then(startCamera);
cameraReduced.addEventListener('change',()=>{cameraStage.classList.remove('play');startCamera();});
