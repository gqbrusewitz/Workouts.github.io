// pwa/service-worker.js

const CACHE_NAME = "workout-log-cache-v1";

// Files to cache for offline use
const ASSETS_TO_CACHE = [
  "./",
  "../index.html",
  "../css/style.css",
  "../js/app.js",
  "../js/storage.js",
  "../js/timer.js",
  "../js/charts.js",
  "../js/theme.js",
  "../pwa/manifest.json"
];

// Install: Cache essential assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: Cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch: Serve cached assets, fall back to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return (
        cacheRes ||
        fetch(event.request).catch(() => {
          // Fallback for offline
          if (event.request.mode === "navigate") {
            return caches.match("../index.html");
          }
        })
      );
    })
  );
});
