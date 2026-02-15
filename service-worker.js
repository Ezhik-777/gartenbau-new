/**
 * GARTENBAU Z.M. - Service Worker v4.0
 * =====================================
 * Progressive Web App functionality with intelligent caching
 */

const CACHE_VERSION = 'v4.0';
const CACHE_NAME = `gartenbau-zm-${CACHE_VERSION}`;

// Critical resources for immediate caching
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/impressum.html',
  '/datenschutz.html',
  '/css/main.css',
  '/js/jquery-3.4.1.min.js',
  '/js/main.js',
  '/js/premium.js',
  '/js/modern-gallery.js',
  '/js/app.js',
  '/manifest.json',
  '/img/logo.webp',
  '/img/logo.png'
];

// First 20 gallery images for fast initial experience
const GALLERY_CACHE = Array.from({ length: 20 }, (_, i) =>
  `/img/gal-${i + 1}.webp`
);

// CSS modules for faster loading
const CSS_MODULES = [
  '/css/modules/variables.css',
  '/css/modules/base.css',
  '/css/modules/layout.css',
  '/css/modules/components.css',
  '/css/modules/hero.css',
  '/css/modules/premium.css',
  '/css/modules/ux-enhancements.css',
  '/css/modules/utilities.css',
  '/css/modules/style.css'
];

// All resources to cache on install
const ALL_CACHE_RESOURCES = [
  ...STATIC_CACHE,
  ...GALLERY_CACHE,
  ...CSS_MODULES
];

/**
 * Install Event - Cache critical resources
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v4.0...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching critical resources...');
        return cache.addAll(ALL_CACHE_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Installation complete ✅');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v4.0...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete ✅');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event - Serve from cache, fallback to network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip Formspree submissions
  if (url.hostname === 'formspree.io') {
    return;
  }

  // Network First strategy for HTML pages
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the new version
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request)
            .then(cached => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // Cache First strategy for static assets (CSS, JS, images)
  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) {
          // Return cached version immediately
          // Update cache in background
          fetch(request)
            .then(response => {
              if (response.status === 200) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, response);
                });
              }
            })
            .catch(() => {
              // Ignore network errors in background update
            });

          return cached;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then(response => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(error => {
            console.error('[SW] Fetch failed:', request.url, error);

            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }

            throw error;
          });
      })
  );
});

/**
 * Message Event - Handle messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
});

/**
 * Background Sync for offline form submissions (future enhancement)
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncFormSubmissions());
  }
});

async function syncFormSubmissions() {
  // Placeholder for future offline form sync functionality
  console.log('[SW] Syncing form submissions...');
}

console.log('[SW] Service Worker v4.0 loaded ✅');
