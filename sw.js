var CACHE_STATIC_NAME = 'static-v10';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/promise.js',
          '/src/js/fetch.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request) // network dulu
      .then(function(res) {
        return caches.open(CACHE_DYNAMIC_NAME) // jika berhasil simpan ke dynamic cache
          .then(function(cache) {
            cache.put(event.request.url, res.clone());
            return res;
          });
      })
      .catch(function() { // jika gagal
        return caches.match(event.request) // ambil dari cache dulu
          .then(function(response) {
            if (response) {
              return response; // jika ada return respon
            } else {
              return caches.match('/offline.html'); // jike tidak ada return offline.html
            }
          });
      })
  );
});

// var CACHE_STATIC_NAME = 'static-v10';
// var CACHE_DYNAMIC_NAME = 'dynamic-v2';

// self.addEventListener('install', function (event) {
//   console.log('[Service Worker] Installing Service Worker ...', event);
//   event.waitUntil(
//     caches.open(CACHE_STATIC_NAME)
//       .then(function (cache) {
//         console.log('[Service Worker] Precaching App Shell');
//         cache.addAll([
//           '/',
//           '/index.html',
//           '/offline.html',
//           '/src/js/app.js',
//           '/src/js/feed.js',
//           '/src/js/promise.js',
//           '/src/js/fetch.js',
//           '/src/js/material.min.js',
//           '/src/css/app.css',
//           '/src/css/feed.css',
//           '/src/images/main-image.jpg',
//           'https://fonts.googleapis.com/css?family=Roboto:400,700',
//           'https://fonts.googleapis.com/icon?family=Material+Icons',
//           'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
//         ]);
//       })
//   )
// });

// self.addEventListener('activate', function (event) {
//   console.log('[Service Worker] Activating Service Worker ....', event);
//   event.waitUntil(
//     caches.keys()
//       .then(function (keyList) {
//         return Promise.all(keyList.map(function (key) {
//           if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
//             console.log('[Service Worker] Removing old cache.', key);
//             return caches.delete(key);
//           }
//         }));
//       })
//   );
//   return self.clients.claim();
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//           .then(function(cache) {
//             cache.put(event.request.url, res.clone());
//             return res;
//           });
//       })
//       .catch(function() {
//         return caches.match(event.request);
//       })
//   );
// });