const CACHE_NAME = 'hk-holidays-v2'; // Updated version
const STATIC_CACHE = 'hk-holidays-static-v2';
const DYNAMIC_CACHE = 'hk-holidays-dynamic-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/',
  '/static/css/',
  '/manifest.json',
  '/favicon.ico',
  '/logo-192x192.png',
  '/logo-512x512.svg',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache-first for static, network-first for dynamic
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests (if any) with network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Handle static assets with cache-first
  if (url.pathname.match(/\.(css|js|png|jpg|svg|ico|woff|woff2)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: network-first for HTML and other dynamic content
  event.respondWith(networkFirst(request));
});

// Cache-first strategy
function cacheFirst(request) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }
      return fetch(request)
        .then((response) => {
          // Don't cache if not ok
          if (!response.ok) return response;

          return caches.open(STATIC_CACHE)
            .then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
        });
    })
    .catch(() => {
      // Return offline fallback if available
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    });
}

// Network-first strategy
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      // Cache successful responses
      if (response.ok) {
        return caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
      }
      return response;
    })
    .catch(() => {
      // Return cached version if network fails
      return caches.match(request)
        .then((response) => {
          if (response) return response;
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
    });
}

// Handle background sync for notifications (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Background sync triggered');
  // Could refresh holiday data or send pending analytics
}

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo-192x192.png',
      badge: '/logo-192x192.png',
      vibrate: [100, 50, 100],
      data: data.extra || {},
      actions: [
        { action: 'view', title: 'View Holiday' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Holiday Reminder', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
