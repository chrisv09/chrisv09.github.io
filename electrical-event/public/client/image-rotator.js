// src/client/image-rotator.js
const img = document.getElementById('guessImage');
const images = img ? JSON.parse(img.dataset.images || '[]') : [];
let idx = 0;

function showNext() {
  if (!images.length) return;
  idx = (idx + 1) % images.length;
  const item = images[idx];
  if (img) img.src = (typeof item === 'string') ? item : item.url;
}

window.showNextGuessImage = showNext;

// Expose current image and coordinate accessors
window.getCurrentImage = () => (images.length ? images[idx] : null);
window.getCurrentImageCoordinate = () => {
  const cur = window.getCurrentImage();
  if (!cur) return null;
  if (typeof cur.lon === 'number' && typeof cur.lat === 'number') return { lon: cur.lon, lat: cur.lat };
  return null;
};

document.addEventListener('guess:made', showNext);

if (images.length) preloadImages(images);

export function preloadImages(urls) {
  urls.forEach(u => {
    const i = new Image();
    i.src = (typeof u === 'string') ? u : u.url;
  });
}