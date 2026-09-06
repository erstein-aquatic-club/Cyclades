// Cyclades — service worker
// Strategie : reseau d'abord pour le contenu, cache en secours.
// -> une mise a jour poussee sur GitHub apparait immediatement,
//    et la page reste consultable hors ligne.
const CACHE = 'cyclades';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
                './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
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
    // reseau d'abord : toujours la derniere version quand il y a du reseau
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copie = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copie));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
  } else {
    // images, manifest : cache d'abord, ils ne changent pas
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copie = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copie));
        return res;
      }))
    );
  }
});
