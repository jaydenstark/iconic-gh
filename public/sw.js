/**
 * ICONIC GH - Custom Service Worker
 * Handles static asset caching, offline fallbacks, and real-time push notification listeners.
 */

const CACHE_NAME = 'iconic-gh-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

// 1. Install Event: Cache essential shell resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Network-first falling back to Cache for a premium fast reader experience
self.addEventListener('fetch', (event) => {
  // Only handle standard HTTP/HTTPS schemes
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid response, clone and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network offline, try cached resources
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Custom response if offline and no cache matches
          return new Response(
            `<html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: -apple-system, sans-serif; background: #08080a; color: #fff; text-align: center; padding: 4rem 2rem; }
                  h1 { color: #ff2a5f; }
                  p { color: #8a8a93; }
                </style>
              </head>
              <body>
                <h1>You're Offline</h1>
                <p>ICONIC GH requires an active internet connection to load new stories. Please check your network.</p>
              </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});

// 4. Push Notification Event Listener
self.addEventListener('push', (event) => {
  let data = { title: 'BREAKING NEWS', body: 'New story published on ICONIC GH.', url: '/' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'BREAKING NEWS', body: event.data.text(), url: '/' };
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Notification Click: Open the redirect link
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open with this URL
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new browser tab/window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
