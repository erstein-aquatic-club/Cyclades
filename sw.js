// Cyclades — service worker
// Strategie : reseau d'abord pour le contenu, cache en secours.
// Versionner le cache force iOS/Safari a abandonner les anciennes ressources.
const CACHE = 'cyclades-v3-20260906';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
                './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(
        ASSETS.map(asset =>
          fetch(asset, { cache: 'reload' }).then(res => {
            if (!res.ok) throw new Error('Precaching failed: ' + asset);
            return c.put(asset, res);
          })
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const estContenu = e.request.mode === 'navigate' || url.pathname.endsWith('.html');

  if (estContenu) {
    // Toujours tenter le reseau sans reutiliser le cache HTTP de Safari.
    e.respondWith(
      fetch(new Request(e.request, { cache: 'no-store' }))
        .then(res => {
          const copie = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copie));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
  } else {
    // Ressources stables : cache d'abord.
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copie = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copie));
        return res;
      }))
    );
  }
});
