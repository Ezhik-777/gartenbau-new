/**
 * GARTENBAU Z.M. - Service Worker v4.1
 * =====================================
 * Progressive Web App with LRU Cache and intelligent caching
 */

const CACHE_VERSION = 'v4.1';
const CACHE_NAME = `gartenbau-zm-${CACHE_VERSION}`;
const IMAGE_CACHE = `gartenbau-zm-images-${CACHE_VERSION}`;
const MAX_IMAGE_CACHE_SIZE = 50; // Limit image cache to 50 items

// Critical resources for immediate caching
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/impressum.html',
  '/datenschutz.html',
  '/css/main.css',
  '/js/main.js',
  '/js/premium.js',
  '/js/modern-gallery.js',
  '/js/app.js',
  '/manifest.json',
  '/llm.txt',
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
 * LRU Cache implementation for images
 */
class LRUCache {
  constructor() {
    this.cache = new Map(); // url -> timestamp
  }

  async put(cacheName, request, response) {
    const cache = await caches.open(cacheName);
    const url = request.url;

    // Check cache size and enforce limit
    if (this.cache.size >= MAX_IMAGE_CACHE_SIZE) {
      // Find oldest entry
      let oldestUrl = null;
      let oldestTime = Infinity;

      for (const [cachedUrl, timestamp] of this.cache.entries()) {
        if (timestamp < oldestTime) {
          oldestTime = timestamp;
          oldestUrl = cachedUrl;
        }
      }

      // Remove oldest entry
      if (oldestUrl) {
        await cache.delete(oldestUrl);
        this.cache.delete(oldestUrl);
        console.log('[SW LRU] Evicted oldest:', oldestUrl);
      }
    }

    // Add new entry
    this.cache.set(url, Date.now());
    await cache.put(request, response);
  }

  touch(url) {
    // Update timestamp when accessed
    if (this.cache.has(url)) {
      this.cache.set(url, Date.now());
    }
  }
}

const imageLRU = new LRUCache();

/**
 * Install Event - Cache critical resources
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v4.1 with LRU Cache...');

  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('[SW] Caching static resources...');
        return cache.addAll(STATIC_CACHE.concat(CSS_MODULES));
      }),
      caches.open(IMAGE_CACHE).then(cache => {
        console.log('[SW] Caching initial gallery images...');
        return cache.addAll(GALLERY_CACHE);
      })
    ])
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
  console.log('[SW] Activating Service Worker v4.1...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== IMAGE_CACHE)
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
  const isImage = request.url.match(/\.(webp|jpg|jpeg|png|gif|svg)$/i);

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) {
          // Touch LRU cache for images
          if (isImage) {
            imageLRU.touch(request.url);
          }

          // Return cached version immediately
          // Update cache in background
          fetch(request)
            .then(response => {
              if (response.status === 200) {
                if (isImage) {
                  // Use LRU cache for images
                  imageLRU.put(IMAGE_CACHE, request, response.clone());
                } else {
                  // Regular cache for other assets
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, response);
                  });
                }
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

              if (isImage) {
                // Use LRU cache for images
                imageLRU.put(IMAGE_CACHE, request, responseClone);
              } else {
                // Regular cache for other assets
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, responseClone);
                });
              }
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

console.log('[SW] Service Worker v4.1 with LRU Cache loaded ✅');
