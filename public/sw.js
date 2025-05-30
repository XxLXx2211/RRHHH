
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Skip waiting to activate the new service worker immediately.
  // self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Perform any cleanup of old caches here if needed
  // event.waitUntil(clients.claim()); // Take control of uncontrolled clients
});

self.addEventListener('fetch', (event) => {
  // console.log('Service Worker: Fetching', event.request.url);
  // For a basic PWA, we can just let the network handle it.
  // More advanced caching strategies would go here.
  // event.respondWith(fetch(event.request));
});
