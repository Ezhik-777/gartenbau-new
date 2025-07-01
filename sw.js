// Optimized Service Worker v3.0 - Ultra Performance Focus
const CACHE_NAME = 'gartenbau-zm-v3.0';
const STATIC_CACHE = 'static-v3.0';
const DYNAMIC_CACHE = 'dynamic-v3.0';
const IMAGE_CACHE = 'images-v3.0';

// Critical resources for immediate caching
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/css/optimized.min.css',
  '/js/optimized.min.js',
  '/js/lazy-gallery.min.js',
  '/img/image_25.webp',
  '/img/logo.webp',
  '/manifest.json'
];

// Essential resources for lazy caching
const ESSENTIAL_RESOURCES = [
  '/css/jquery.fancybox.min.css',
  '/js/jquery-3.4.1.min.js',
  '/js/jquery.fancybox.min.js',
  '/img/ihr.webp',
  '/img/logo.png',
  '/img/gal-1.webp',
  '/img/gal-2.webp',
  '/img/gal-3.webp',
  '/img/gal-4.webp',
  '/img/gal-5.webp',
  '/img/gal-6.webp',
  '/img/gal-7.webp',
  '/img/gal-8.webp'
];

// Gallery images pattern
const GALLERY_IMAGE_PATTERN = /\/img\/image_\d+\.webp$/;

// Install event - ultra-fast critical resource caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('SW: Installing critical resources');
        return cache.addAll(CRITICAL_RESOURCES.map(url => new Request(url, { cache: 'reload' })));
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('SW: Dynamic cache initialized');
        return Promise.resolve();
      }),
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('SW: Image cache initialized');
        return Promise.resolve();
      })
    ]).then(() => {
      console.log('SW: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - intelligent cache cleanup
self.addEventListener('activate', (event) => {
  const expectedCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!expectedCaches.includes(cacheName)) {
              console.log('SW: Deleting obsolete cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Preload essential resources
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('SW: Preloading essential resources');
        return cache.addAll(ESSENTIAL_RESOURCES.slice(0, 5)); // Limit initial preload
      })
    ]).then(() => {
      console.log('SW: Activated with optimized caches');
      return self.clients.claim();
    })
  );
});

// Advanced fetch event with intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and external domains
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Gallery images - special handling with LRU cache
  if (GALLERY_IMAGE_PATTERN.test(url.pathname)) {
    event.respondWith(handleGalleryImage(request));
    return;
  }

  // HTML documents - cache first with network fallback
  if (request.destination === 'document') {
    event.respondWith(handleDocument(request));
    return;
  }

  // CSS/JS - cache first strategy
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(handleAssets(request));
    return;
  }

  // Images - cache with size limits
  if (request.destination === 'image') {
    event.respondWith(handleImages(request));
    return;
  }

  // Default: network first with cache fallback
  event.respondWith(handleDefault(request));
});

// Gallery image handler with LRU cache management
async function handleGalleryImage(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('SW: Gallery image from cache:', request.url);
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      // Implement LRU: remove old images if cache is full
      await manageCacheSize(cache, 50); // Keep max 50 gallery images
      cache.put(request, response.clone());
      console.log('SW: Gallery image cached:', request.url);
    }
    
    return response;
  } catch (error) {
    console.log('SW: Gallery image failed:', error);
    return new Response('', { status: 404 });
  }
}

// Document handler - always try cache first
async function handleDocument(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      // Update in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {});
      
      console.log('SW: Document from cache:', request.url);
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Offline fallback
    const cache = await caches.open(STATIC_CACHE);
    return cache.match('/index.html') || new Response('Offline', { status: 503 });
  }
}

// Asset handler - cache first with long TTL
async function handleAssets(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('SW: Asset from cache:', request.url);
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      console.log('SW: Asset cached:', request.url);
    }
    return response;
  } catch (error) {
    console.log('SW: Asset fetch failed:', error);
    return new Response('', { status: 404 });
  }
}

// Image handler with size management
async function handleImages(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      await manageCacheSize(cache, 30); // Keep max 30 regular images
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('', { status: 404 });
  }
}

// Default handler
async function handleDefault(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    return cached || new Response('', { status: 404 });
  }
}

// LRU cache size management
async function manageCacheSize(cache, maxSize) {
  const keys = await cache.keys();
  if (keys.length >= maxSize) {
    // Remove oldest 20% of entries
    const toDelete = keys.slice(0, Math.floor(keys.length * 0.2));
    await Promise.all(toDelete.map(key => cache.delete(key)));
    console.log(`SW: Cleaned ${toDelete.length} old cache entries`);
  }
}

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