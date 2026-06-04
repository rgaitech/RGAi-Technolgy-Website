/* ============================================================
   SW.JS — PWA Offline Cache Service Worker
   ============================================================ */

const CACHE_NAME = 'rgai-tech-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/services.html',
  '/portfolio.html',
  '/about.html',
  '/contact.html',
  '/estimator.html',
  '/academy.html',
  '/careers.html',
  '/feedback.html',
  '/analytics.html',
  '/labs.html',
  '/thankyou.html',
  '/manifest.json',
  
  // CSS
  '/css/global.css',
  '/css/loader.css',
  '/css/navbar.css',
  '/css/hero.css',
  '/css/services.css',
  '/css/portfolio.css',
  '/css/about.css',
  '/css/testimonials.css',
  '/css/contact.css',
  '/css/footer.css',
  '/css/whatsapp.css',
  '/css/chatbot.css',
  '/css/aurora.css',
  '/css/transitions.css',
  '/css/microinteractions.css',
  '/css/estimator.css',
  '/css/academy.css',
  '/css/careers.css',
  '/css/feedback.css',
  '/css/analytics.css',
  '/css/agents.css',
  '/css/case-studies.css',
  '/css/reviews.css',
  '/css/labs.css',
  '/css/effects.css',
  
  // JS
  '/js/main.js',
  '/js/hero.js',
  '/js/services.js',
  '/js/portfolio.js',
  '/js/stats.js',
  '/js/testimonials.js',
  '/js/contact.js',
  '/js/whatsapp.js',
  '/js/chatbot.js',
  '/js/aurora.js',
  '/js/spotlight.js',
  '/js/transitions.js',
  '/js/microinteractions.js',
  '/js/estimator.js',
  '/js/careers.js',
  '/js/feedback.js',
  '/js/analytics.js',
  '/js/labs.js',
  '/js/effects.js',
  
  // Data
  '/data/knowledge.json',

  // PWA Icons
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Service Worker: Pre-caching offline assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event (Clean old caches)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting stale cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Cache-first with network fallback)
self.addEventListener('fetch', (e) => {
  // Ignore cross-origin queries (e.g. Firebase or CDNs that don't support caching)
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If resource not in cache, fetch it from network
      return fetch(e.request).then((networkResponse) => {
        // Check if response is valid before caching
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cache the newly fetched file dynamically
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline Fallback for html pages
        if (e.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
