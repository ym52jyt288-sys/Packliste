// Service Worker: hält die Packliste offline verfügbar (Flugzeug, Berghütte, Funkloch).
// Bei jeder Änderung an den Dateien VERSION erhöhen, damit das iPhone die neue Fassung lädt (gleiche Zahl wie APP_VERSION in daten.js).
const VERSION = 'packliste-2';
const DATEIEN = ['./', 'index.html', 'katalog.js', 'daten.js', 'sync.js', 'app.js', 'vendor/qrcode.min.js', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', e => {
  // cache: 'reload' – am HTTP-Cache vorbei, sonst landen bis zu 10 Minuten alte Dateien im neuen Cache (GitHub Pages: max-age=600)
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== VERSION).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // Seite und Skripte: erst Netz (damit Updates ankommen), sonst Cache.
  // cache: 'no-cache' fragt immer beim Server nach; ohne das lieferte der HTTP-Cache bis zu 10 Minuten die alte Seite.
  if (e.request.mode === 'navigate' || /\.(html|js|webmanifest)$/.test(url.pathname)) {
    e.respondWith(
      fetch(e.request.url, { cache: 'no-cache' })
        .then(r => { if (r.ok) { const kopie = r.clone(); caches.open(VERSION).then(c => c.put(e.request, kopie)); } return r; })
        .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
    );
    return;
  }
  // Alles andere (Icons): Cache zuerst
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
