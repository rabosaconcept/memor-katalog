// MEMOR katalogi — internetsiz ishlash uchun
const C = 'memor-katalog-v1791175495';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(
    ks.filter(k => k.indexOf('memor-katalog-') === 0 && k !== C).map(k => caches.delete(k))))
  .then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const img = /\.(webp|jpg|png)$/.test(new URL(r.url).pathname);
  if (img) {            // rasmlar: avval xotiradan
    e.respondWith(caches.open(C).then(c => c.match(r).then(m => m || fetch(r).then(n => {
      if (n.ok) c.put(r, n.clone()); return n; }))));
  } else {              // sahifa va ma'lumot: avval internetdan, bo'lmasa xotiradan
    e.respondWith(fetch(r).then(n => { const k = n.clone();
      if (n.ok) caches.open(C).then(c => c.put(r, k)); return n; })
      .catch(() => caches.match(r)));
  }
});
