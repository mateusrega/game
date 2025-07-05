self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('cat-troll-v1').then(cache =>
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/game.js',
        '/manifest.json',
        '/assets/icon-192.png',
        '/assets/icon-512.png'
      ])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
