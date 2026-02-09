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

window.addEventListener("DOMContentLoaded", () => {

const el = document.getElementById('basicMap');
if (!el) {
  console.error('map element not found');
} else {
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

    // styles for different feature types
    const osmStyle = new Style({
      image: new CircleStyle({ radius: 5, fill: new Fill({ color: '#ff7800' }), stroke: new Stroke({ color: '#000', width: 1 }) }),
    });
    const userStyle = new Style({
      image: new CircleStyle({ radius: 7, fill: new Fill({ color: '#007bff' }), stroke: new Stroke({ color: '#000', width: 1 }) }),
    });
    const randomStyle = new Style({
      image: new CircleStyle({ radius: 6, fill: new Fill({ color: '#00c853' }), stroke: new Stroke({ color: '#000', width: 1 }) }),
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
        return osmStyle;
      },
    });

    const map = new Map({
      target: 'basicMap',
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({ center: fromLonLat([centerLon, centerLat]), zoom: 14 }),
    });

    // Add click handler: add a node feature where the user clicks (only one user feature kept)
    map.on('singleclick', (evt) => {
      try {
        const coord = evt.coordinate; // map projection (WebMercator)
        const lonlat = toLonLat(coord);

        // Remove previous user-added feature (keep only one)
        const existingUser = vectorSource.getFeatures().find(f => f.get('user'));
        if (existingUser) {
          vectorSource.removeFeature(existingUser);
        }

        const id = `user-${Date.now()}`;
        const feature = new Feature(new Point(coord));
        feature.set('name', `User node ${id}`);
        feature.set('id', id);
        feature.set('user', true);
        feature.set('lon', lonlat[0]);
        feature.set('lat', lonlat[1]);
        vectorSource.addFeature(feature);
        console.log('Added user node at', lonlat);
      } catch (e) {
        console.error('Error adding user node:', e);
      }
    });

    // ensure map updates size after being shown
    setTimeout(() => map.updateSize(), 200);

    console.log('OpenLayers map initialized (client module)');

    // Array of predefined coordinates for random dots (fallback)
    const randomDotCoordinates = [
      [174.7665229, -36.8497722],
      [174.772262, -36.850378],
      [174.853815, -36.899273],
    ];
    let randomDotIndex = 0;

    // Button: add a random dot — prefer using current image's coordinates when available
    const btn = document.getElementById('add-random');
    if (btn) {
      btn.addEventListener('click', () => {
        try {
          const features = vectorSource.getFeatures();
          const userFeature = features.find(f => f.get('user'));
          if (!userFeature) {
            alert('Place a base point by clicking the map first.');
            return;
          }

          const existingRandomFeature = features.find(f => f.get('random'));

          // Remove the existing random dot (only one random dot at a time)
          if (existingRandomFeature) {
            vectorSource.removeFeature(existingRandomFeature);
          }

          // Try to get the coordinate tied to the current image
          let coordPair = null;
          try {
            if (window.getCurrentImageCoordinate) {
              const c = window.getCurrentImageCoordinate();
              if (c && typeof c.lon === 'number' && typeof c.lat === 'number') {
                coordPair = [c.lon, c.lat];
              }
            }
          } catch (err) {
            console.warn('Could not read current image coordinate from rotator:', err);
          }

          // Fallback to the predefined list if no image coord available
          if (!coordPair) {
            coordPair = randomDotCoordinates[randomDotIndex % randomDotCoordinates.length];
            randomDotIndex++;
          }

          const [lon, lat] = coordPair;
          const newCoord = fromLonLat([lon, lat]);
          const randFeature = new Feature(new Point(newCoord));

          // Store metadata on the random feature
          randFeature.set('random', true);
          randFeature.set('originId', userFeature.get('id') || null);
          randFeature.set('created', Date.now());
          vectorSource.addFeature(randFeature);
          console.log('Added random dot at', toLonLat(newCoord));

          // Remove existing connector if present
          const existingConnector = features.find(f => f.get('connector'));
          if (existingConnector) vectorSource.removeFeature(existingConnector);

          const c1 = userFeature.getGeometry().getCoordinates();
          const c2 = randFeature.getGeometry().getCoordinates();
          const line = new LineString([c1, c2]);
          const lineFeature = new Feature(line);
          lineFeature.set('connector', true);
          vectorSource.addFeature(lineFeature);
          
          // Calculate distance between the two points
          const distanceMeters = getDistance(
            toLonLat(c1),
            toLonLat(c2)
          );
          const distanceKm = (distanceMeters / 1000).toFixed(2);
          
          // Display distance
          const distanceDisplay = document.getElementById('distance-display');
          if (distanceDisplay) {
            distanceDisplay.textContent = `Distance: ${distanceKm} km`;
          }

          console.log('Connector drawn between user and random dot, distance: ' + distanceKm + ' km');

          // Show the overlay with the distance
          const overlay = document.getElementById('guess-overlay');
          if (overlay) {
            overlay.style.display = 'flex';
          }
          
          // Set up next-round button handler (only once)
          const nextRoundBtn = document.getElementById('next-round');
          if (nextRoundBtn && !nextRoundBtn.dataset.listenerAdded) {
            nextRoundBtn.addEventListener('click', () => {
              // Rotate image and hide overlay
              try {
                if (window.showNextGuessImage) window.showNextGuessImage();
              } catch (err) {
                console.error('Error rotating image:', err);
              }

              // Remove random dot and connector
              const featuresToRemove = vectorSource.getFeatures().filter(f => f.get('random') || f.get('connector'));
              featuresToRemove.forEach(f => vectorSource.removeFeature(f));

              
              if (overlay) overlay.style.display = 'none';
            });
            nextRoundBtn.dataset.listenerAdded = 'true';
          }

        } catch (e) {
          console.error('Error adding random dot:', e);
        }
      });
    }
  } catch (e) {
    console.error('Error initializing OpenLayers map (client module):', e);
  }
}
});