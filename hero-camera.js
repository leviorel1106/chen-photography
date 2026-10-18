const cameraStage = document.querySelector('.demo-camera');
const cameraReduced = matchMedia('(prefers-reduced-motion: reduce)');
const cameraImage = cameraStage.querySelector('.camera-real');
const photographs = [...cameraStage.querySelectorAll('.film-frame img')];
async function ready(image) {
  try { await image.decode(); } catch (_) { /* Keep the page usable if an asset fails. */ }
}
async function startCamera() {
  await ready(cameraImage);
  cameraStage.classList.add('camera-ready');
  await Promise.all(photographs.map(ready));
  // Reveal and animate only once the camera and photographs have decoded.
  requestAnimationFrame(() => requestAnimationFrame(() => cameraStage.classList.add('play')));
}
startCamera();
