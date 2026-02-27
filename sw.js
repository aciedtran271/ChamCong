const CACHE = 'chamcong-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './icon.svg',
  './manifest.json',
  'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k !== CACHE ? caches.delete(k) : Promise.resolve();
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.url.startsWith('http') && (e.request.mode === 'navigate' || e.request.destination === 'script' || e.request.destination === 'style' || e.request.destination === 'document')) {
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        return cached || fetch(e.request).then(function (r) {
          if (r && r.status === 200 && r.url.indexOf('cdn.sheetjs.com') !== -1) {
            const clone = r.clone();
            caches.open(CACHE).then(function (cache) { cache.put(e.request, clone); });
          }
          return r;
        });
      })
    );
  }
});
