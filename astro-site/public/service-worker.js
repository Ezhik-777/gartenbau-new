/*
 * Gartenbau Z.M. Service Worker v5.0
 * Enhanced PWA with Workbox integration
 * Features: Smart caching, offline support, background sync
 */

// Workbox configuration - using local copy for security (no CDN)
importScripts('/workbox-v7.4.0/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
const { BackgroundSyncPlugin } = workbox.backgroundSync;

// Service Worker version
const CACHE_VERSION = 'v5.0.0';
const CACHE_NAME = `gartenbau-zm-${CACHE_VERSION}`;

// Cache names for different asset types
const CACHES = {
  static: `${CACHE_NAME}-static`,
  dynamic: `${CACHE_NAME}-dynamic`,
  images: `${CACHE_NAME}-images`,
  fonts: `${CACHE_NAME}-fonts`,
};

// Enable Workbox logging in development
if (self.location.hostname === 'localhost') {
  workbox.setConfig({ debug: true });
}

// Precache static assets (will be populated by workbox-build)
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

/* ===================================
 * CACHING STRATEGIES
 * =================================== */

// 1. HTML Pages - Network First (fresh content, fallback to cache, offline fallback)
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: CACHES.dynamic,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
        maxEntries: 50,
      }),
      {
        // Fallback to offline page if both network and cache fail
        handlerDidError: async () => {
          return caches.match(OFFLINE_PAGE);
        },
      },
    ],
    networkTimeoutSeconds: 3, // Fallback to cache after 3s
  })
);

// 2. CSS & JavaScript - Stale While Revalidate (fast response, update in background)
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: CACHES.static,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        maxEntries: 60,
      }),
    ],
  })
);

// 3. Images - Cache First (long-term cache with size limit)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: CACHES.images,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100, // Limit to 100 images
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        // Purge entries when cache exceeds 50MB
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// 4. Fonts - Cache First (long-term cache)
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: CACHES.fonts,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);

// 5. Google Fonts - Cache First with cross-origin support
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: CACHES.fonts,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);

/* ===================================
 * BACKGROUND SYNC (Form Submissions)
 * =================================== */

// Background sync for contact form submissions when offline
const bgSyncPlugin = new BackgroundSyncPlugin('contactFormQueue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours (in minutes)
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log('Background sync: Form submission successful');
      } catch (error) {
        console.error('Background sync: Form submission failed', error);
        // Re-queue if failed
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// Register background sync for Formspree submissions
registerRoute(
  ({ url }) => url.hostname === 'formspree.io',
  new NetworkFirst({
    cacheName: CACHES.dynamic,
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

/* ===================================
 * OFFLINE FALLBACK
 * =================================== */

// Fallback to offline page for navigation requests
const OFFLINE_PAGE = '/offline.html';

// Cache the offline page during install
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing v${CACHE_VERSION}`);

  event.waitUntil(
    caches.open(CACHES.static).then((cache) => {
      return cache.addAll([
        OFFLINE_PAGE,
        '/img/logo.webp',
        '/manifest.json',
      ]);
    })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating v${CACHE_VERSION}`);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches that don't match current version prefix
          if (cacheName.startsWith('gartenbau-zm-') && !cacheName.startsWith(CACHE_NAME)) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of all clients immediately
  return self.clients.claim();
});


/* ===================================
 * PUSH NOTIFICATIONS (Optional)
 * =================================== */

// Push notification support (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Neue Nachricht von Gartenbau Z.M.',
    icon: '/img/logo.webp',
    badge: '/img/logo.webp',
    vibrate: [200, 100, 200],
    tag: 'gartenbau-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification('Gartenbau Z.M.', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

/* ===================================
 * MESSAGING
 * =================================== */

// Listen for skip waiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log(`[Service Worker] v${CACHE_VERSION} loaded successfully`);
