// self.addEventListener('install', function(event) {
//     event.waitUntil(
//       caches.open('first-app')
//         .then(function(cache) {
//           cache.addAll([
//             '/',
//             '/index.html',
//             '/src/css/app.css',
//             '/src/js/app.js'
//           ])
//         })
//     );
//     return self.clients.claim();
//   });
  
//   self.addEventListener('fetch', function(event) {
//     event.respondWith(
//       caches.match(event.request)
//         .then(function(res) {
//           return res;
//         })
//     );
//   });
  
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('first-app') // Nama cache untuk situs pertama
      .then(function(cache) {
        return cache.addAll([
          '/', // Halaman utama
          '/index.html',
          '/src/css/app.css',
          '/src/js/app.js'
        ]);
      })
  );

  event.waitUntil(
    caches.open('second-app') // Nama cache untuk situs kedua
      .then(function(cache) {
        return cache.addAll([
          '/', // Halaman utama
          '/index.html',
          '/src/css/app.css',
          '/src/js/app.js'
        ]);
      })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Menentukan apakah permintaan berasal dari path pertama atau kedua
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/coba/')) {
    // Jika URL mengarah ke '/coba/', gunakan cache 'second-app'
    event.respondWith(
      caches.match(event.request, { cacheName: 'second-app' })
        .then(function(res) {
          return res || fetch(event.request); // Jika tidak ada di cache, ambil dari server
        })
    );
  } else {
    // Jika URL tidak mengarah ke '/coba/', gunakan cache 'first-app'
    event.respondWith(
      caches.match(event.request, { cacheName: 'first-app' })
        .then(function(res) {
          return res || fetch(event.request); // Jika tidak ada di cache, ambil dari server
        })
    );
  }
});

// Aktivasi - Menghapus cache lama jika ada
self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['first-app', 'second-app']; // Cache yang akan disimpan
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Hapus cache lama
          }
        })
      );
    })
  );
});
