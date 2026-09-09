// Cyclades React V4 — offline-first static application shell
const CACHE = 'cyclades-j2-pyrgos-fallback-v6-3-20260909';
const LOCAL_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './enrichment-data.js',
  './trip-data.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];
const VENDOR_ASSETS = [
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
const ASSETS = LOCAL_ASSETS.concat(VENDOR_ASSETS);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(ASSETS.map(asset =>
        fetch(asset, { cache: 'reload' }).then(response => {
          if (!response.ok) throw new Error('Precaching failed: ' + asset);
          return cache.put(asset, response);
        })
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate';

  // Let map tiles and remote preview images use the browser/provider cache rules.
  if (url.hostname === 'tile.openstreetmap.org' || url.hostname === 'commons.wikimedia.org' || url.hostname === 'upload.wikimedia.org') return;
  const isTripData = url.origin === self.location.origin && url.pathname.endsWith('/trip-data.html');

  if (isNavigation || isTripData) {
    event.respondWith(
      fetch(new Request(event.request, { cache: 'no-store' }))
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request)
            .then(hit => hit || (isNavigation ? caches.match('./index.html') : caches.match('./trip-data.html')))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(hit => hit || fetch(event.request).then(response => {
        if (response.ok || response.type === 'opaque') {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }))
  );
});
