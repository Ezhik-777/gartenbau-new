// Service Worker для улучшения производительности и кэширования
// Версия 2.0 - Оптимизированная для GitHub Pages

const CACHE_NAME = 'gartenbau-zm-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';

// Критичные ресурсы для немедленного кэширования
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/css/critical.min.css',
  '/js/jquery-3.4.1.min.js',
  '/img/bg-top.webp',
  '/img/logo.webp',
  '/manifest.json'
];

// Ресурсы для ленивого кэширования
const LAZY_CACHE_RESOURCES = [
  '/css/non-critical.min.css',
  '/css/jquery.fancybox.min.css',
  '/js/jquery.fancybox.min.js',
  '/js/common.js',
  '/img/bg-top.jpg',
  '/img/logo.png',
  '/img/ihr.webp',
  '/img/ihr.jpg',
  '/img/gal-1.webp',
  '/img/gal-2.webp',
  '/img/gal-3.webp',
  '/img/gal-4.webp',
  '/img/gal-5.webp',
  '/img/gal-6.webp',
  '/img/gal-7.webp',
  '/img/gal-8.webp'
];

// Install event - cache critical resources only
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('SW: Static cache opened');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('SW: Dynamic cache opened');
        return cache.addAll([]); // Start empty
      })
    ]).then(() => {
      console.log('SW: Critical resources cached');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const expectedCaches = [STATIC_CACHE, DYNAMIC_CACHE];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCaches.includes(cacheName)) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activated and claimed clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('SW: Serving from cache:', event.request.url);
          return response;
        }

        console.log('SW: Fetching from network:', event.request.url);
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          // Add to cache for future requests
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for form submissions (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle offline form submission sync
      console.log('SW: Background sync for contact form')
    );
  }
});

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/img/logo.webp',
      badge: '/img/logo.webp',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification click received.');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});