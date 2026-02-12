import Map from 'https://cdn.skypack.dev/ol/Map';
import View from 'https://cdn.skypack.dev/ol/View';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile';
import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector';
import Feature from 'https://cdn.skypack.dev/ol/Feature';
import Point from 'https://cdn.skypack.dev/ol/geom/Point';
import LineString from 'https://cdn.skypack.dev/ol/geom/LineString';
import { fromLonLat, toLonLat } from 'https://cdn.skypack.dev/ol/proj';
import Style from 'https://cdn.skypack.dev/ol/style/Style';
import CircleStyle from 'https://cdn.skypack.dev/ol/style/Circle';
import Fill from 'https://cdn.skypack.dev/ol/style/Fill';
import Stroke from 'https://cdn.skypack.dev/ol/style/Stroke';
import { getDistance } from 'https://cdn.skypack.dev/ol/sphere';

// --- Constants ---
const COUNTDOWN_SECONDS = 15;
const STAR_THRESHOLDS = { THREE: 1000, TWO: 5000, ONE: 10000 };
const FALLBACK_COORDS = [
  [174.7665229, -36.8497722],
  [174.772262, -36.850378],
  [174.853815, -36.899273],
];

const ID = {
  MAP: 'basicMap',
  COUNTDOWN_TIMER: 'countdown-timer',
  COUNTDOWN_NUMBER: 'countdown-number',
  GUESS_OVERLAY: 'guess-overlay',
  OVERLAY_MESSAGE: 'overlay-message',
  DISTANCE_DISPLAY: 'distance-display',
  STARS: 'stars',
  ADD_RANDOM: 'add-random',
  NEXT_ROUND: 'next-round',
};

window.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById(ID.MAP);
  if (!el) {
    console.error('map element not found');
    return;
  }

  try {
    const nodes = JSON.parse(el.dataset.nodes || '[]');
    const centerLat = parseFloat(el.dataset.centerLat) || -36.965;
    const centerLon = parseFloat(el.dataset.centerLon) || 174.905;

    const vectorSource = new VectorSource();
    nodes.forEach((node) => {
      const feature = new Feature(new Point(fromLonLat([node.lon, node.lat])));
      feature.set('name', `Node ${node.id}`);
      vectorSource.addFeature(feature);
    });

    const osmStyle = new Style({
      image: new CircleStyle({ radius: 5, fill: new Fill({ color: '#ff7800' }), stroke: new Stroke({ color: '#000', width: 1 }) }),
    });
    const userStyle = new Style({
      image: new CircleStyle({ radius: 7, fill: new Fill({ color: '#007bff' }), stroke: new Stroke({ color: '#000', width: 1 }) }),
    });
    const randomStyle = new Style({
      image: new CircleStyle({ radius: 6, fill: new Fill({ color: '#00c853' }), stroke: new Stroke({ color: '#000', width: 1 }) }),
    });
    const answerStyle = new Style({
      image: new CircleStyle({ radius: 8, fill: new Fill({ color: '#ffc107' }), stroke: new Stroke({ color: '#000', width: 2 }) }),
    });
    const connectorStyle = new Style({
      stroke: new Stroke({ color: '#ff0000', width: 3 }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        if (!feature) return osmStyle;
        if (feature.get('connector')) return connectorStyle;
        if (feature.get('user')) return userStyle;
        if (feature.get('random')) return randomStyle;
        if (feature.get('answer')) return answerStyle;
        return osmStyle;
      },
    });

    const map = new Map({
      target: ID.MAP,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({ center: fromLonLat([centerLon, centerLat]), zoom: 14 }),
    });

    map.on('singleclick', (evt) => {
      try {
        const coord = evt.coordinate;
        const lonlat = toLonLat(coord);
        const existingUser = vectorSource.getFeatures().find((f) => f.get('user'));
        if (existingUser) vectorSource.removeFeature(existingUser);
        const feature = new Feature(new Point(coord));
        feature.set('name', `User node user-${Date.now()}`);
        feature.set('id', `user-${Date.now()}`);
        feature.set('user', true);
        feature.set('lon', lonlat[0]);
        feature.set('lat', lonlat[1]);
        vectorSource.addFeature(feature);
      } catch (e) {
        console.error('Error adding user node:', e);
      }
    });

    setTimeout(() => map.updateSize(), 200);

    // --- DOM refs (lazy) ---
    const dom = () => ({
      countdownTimer: document.getElementById(ID.COUNTDOWN_TIMER),
      countdownNumber: document.getElementById(ID.COUNTDOWN_NUMBER),
      overlay: document.getElementById(ID.GUESS_OVERLAY),
      overlayMessage: document.getElementById(ID.OVERLAY_MESSAGE),
      distanceDisplay: document.getElementById(ID.DISTANCE_DISPLAY),
      starsDiv: document.getElementById(ID.STARS),
    });

    // --- Helpers: current image coord ---
    function getCurrentImageCoord() {
      try {
        const c = window.getCurrentImageCoordinate && window.getCurrentImageCoordinate();
        if (c && typeof c.lon === 'number' && typeof c.lat === 'number') return [c.lon, c.lat];
      } catch (err) {
        console.warn('Could not read current image coordinate:', err);
      }
      return null;
    }

    // --- Helpers: map features ---
    function removeGuessFeatures() {
      vectorSource.getFeatures().filter((f) => f.get('random') || f.get('connector') || f.get('answer')).forEach((f) => vectorSource.removeFeature(f));
    }

    function addAnswerMarker(lon, lat) {
      const existing = vectorSource.getFeatures().find((f) => f.get('answer'));
      if (existing) vectorSource.removeFeature(existing);
      const feature = new Feature(new Point(fromLonLat([lon, lat])));
      feature.set('answer', true);
      vectorSource.addFeature(feature);
    }

    // --- Helpers: overlay ---
    function setOverlayMode(mode) {
      const d = dom();
      if (d.overlayMessage) d.overlayMessage.textContent = mode === 'times-up' ? 'Times up!' : 'Good guess!';
      if (d.distanceDisplay) {
        d.distanceDisplay.style.display = mode === 'times-up' ? 'none' : '';
        if (mode === 'times-up') d.distanceDisplay.textContent = '';
      }
      if (d.starsDiv) {
        d.starsDiv.style.display = mode === 'times-up' ? 'none' : '';
        if (mode === 'times-up') d.starsDiv.innerHTML = '';
      }
    }

    function showOverlay() {
      const d = dom();
      if (d.overlay) d.overlay.style.display = 'flex';
    }

    function hideOverlay() {
      const d = dom();
      if (d.overlay) d.overlay.style.display = 'none';
    }

    // --- Helpers: stars ---
    function getStarsForDistance(meters) {
      if (meters < STAR_THRESHOLDS.THREE) return 3;
      if (meters < STAR_THRESHOLDS.TWO) return 2;
      if (meters < STAR_THRESHOLDS.ONE) return 1;
      return 0;
    }

    function renderStars(container, count) {
      if (!container) return;
      container.innerHTML = '';
      const src = count === 1 ? '/1-star.png' : `/${count}-stars.png`;
      const img = document.createElement('img');
      img.src = src;
      img.alt = count === 0 ? '0 stars' : `${count} star${count === 1 ? '' : 's'}`;
      img.style.width = '100px';
      img.style.height = '32px';
      container.appendChild(img);
    }

    // --- Countdown ---
    function stopCountdown() {
      const id = el.dataset.countdownIntervalId;
      if (id) {
        clearInterval(Number(id));
        delete el.dataset.countdownIntervalId;
      }
      const d = dom();
      if (d.countdownTimer) d.countdownTimer.style.display = 'none';
    }

    function startCountdown() {
      const d = dom();
      if (!d.countdownTimer || !d.countdownNumber) return;
      stopCountdown();
      d.countdownTimer.style.display = 'block';
      let remaining = COUNTDOWN_SECONDS;
      d.countdownNumber.textContent = String(remaining);
      const countdownInterval = setInterval(() => {
        remaining--;
        d.countdownNumber.textContent = String(remaining);
        if (remaining <= 0) {
          clearInterval(countdownInterval);
          delete el.dataset.countdownIntervalId;
          d.countdownTimer.style.display = 'none';
          const coord = getCurrentImageCoord();
          if (coord) {
            const [lon, lat] = coord;
            addAnswerMarker(lon, lat);
            map.getView().setCenter(fromLonLat([lon, lat]));
          }
          setOverlayMode('times-up');
          showOverlay();
          setupNextRoundButton();
        }
      }, 1000);
      el.dataset.countdownIntervalId = String(countdownInterval);
    }

    window.addEventListener('game:start', () => startCountdown(), { once: true });

    // --- Next round (shared) ---
    function goToNextRound() {
      try {
        if (window.showNextGuessImage) window.showNextGuessImage();
      } catch (err) {
        console.error('Error rotating image:', err);
      }
      removeGuessFeatures();
      hideOverlay();
      startCountdown();
    }

    function setupNextRoundButton() {
      const btn = document.getElementById(ID.NEXT_ROUND);
      if (!btn || btn.dataset.listenerAdded) return;
      btn.addEventListener('click', goToNextRound);
      btn.dataset.listenerAdded = 'true';
    }

    // --- Make a guess ---
    let fallbackIndex = 0;
    document.getElementById(ID.ADD_RANDOM)?.addEventListener('click', () => {
      try {
        const features = vectorSource.getFeatures();
        const userFeature = features.find((f) => f.get('user'));
        if (!userFeature) {
          alert('Place a base point by clicking the map first.');
          return;
        }

        const coordPair = getCurrentImageCoord() || FALLBACK_COORDS[fallbackIndex++ % FALLBACK_COORDS.length];
        const [lon, lat] = coordPair;
        const newCoord = fromLonLat([lon, lat]);

        const existingRandom = features.find((f) => f.get('random'));
        if (existingRandom) vectorSource.removeFeature(existingRandom);
        const existingConnector = features.find((f) => f.get('connector'));
        if (existingConnector) vectorSource.removeFeature(existingConnector);

        const randFeature = new Feature(new Point(newCoord));
        randFeature.set('random', true);
        randFeature.set('originId', userFeature.get('id') || null);
        randFeature.set('created', Date.now());
        vectorSource.addFeature(randFeature);

        const line = new LineString([userFeature.getGeometry().getCoordinates(), randFeature.getGeometry().getCoordinates()]);
        const lineFeature = new Feature(line);
        lineFeature.set('connector', true);
        vectorSource.addFeature(lineFeature);

        // Calculate distance between user and random point
        const c1 = userFeature.getGeometry().getCoordinates();
        const c2 = randFeature.getGeometry().getCoordinates();
        const distanceMeters = getDistance(toLonLat(c1), toLonLat(c2));
        const distanceKm = (distanceMeters / 1000).toFixed(2);

        const d = dom();
        setOverlayMode('guess');
        if (d.distanceDisplay) d.distanceDisplay.textContent = `Distance: ${distanceKm} km`;
        renderStars(d.starsDiv, getStarsForDistance(distanceMeters));
        stopCountdown();
        showOverlay();
        setupNextRoundButton();
      } catch (e) {
        console.error('Error adding random dot:', e);
      }
    });
  } catch (e) {
    console.error('Error initializing OpenLayers map (client module):', e);
  }
});
