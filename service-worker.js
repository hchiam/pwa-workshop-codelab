// https://developers.google.com/codelabs/pwa-training/pwa03--working-with-workbox#2
// https://developers.google.com/codelabs/pwa-training/pwa03--working-with-workbox#3

import { warmStrategyCache, offlineFallback } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

setUpPageCache();
setUpAssetCache();
setUpOfflineFallback();

/**
 * https://developers.google.com/codelabs/pwa-training/pwa03--working-with-workbox#2
 */
function setUpPageCache() {
  const pageCache = new CacheFirst({
    cacheName: 'page-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  });
  warmStrategyCache({
    urls: ['/index.html', '/'],
    strategy: pageCache,
  });
  registerRoute(({ request }) => request.mode === 'navigate', pageCache);
}

/**
 * https://developers.google.com/codelabs/pwa-training/pwa03--working-with-workbox#2
 */
function setUpAssetCache() {
  registerRoute(
    ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    new StaleWhileRevalidate({
      cacheName: 'asset-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
  );
}

/**
 * https://developers.google.com/codelabs/pwa-training/pwa03--working-with-workbox#3
 */
function setUpOfflineFallback() {
  offlineFallback({
    pageFallback: '/offline.html',
  });
}

// the following is the older, less-powerful code:

// /*
// Copyright 2021 Google LLC

//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at

//       http://www.apache.org/licenses/LICENSE-2.0

//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//  */

// // Choose a cache name
// const cacheName = 'cache-v1';
// // List the files to precache
// const precacheResources = ['/', '/index.html', '/css/style.css', '/js/main.js', '/js/app/editor.js', '/js/lib/actions.js'];

// // When the service worker is installing, open the cache and add the precache resources to it
// self.addEventListener('install', (event) => {
//   console.log('Service worker install event!');
//   event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
// });

// self.addEventListener('activate', (event) => {
//   console.log('Service worker activate event!');
// });

// // When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
// self.addEventListener('fetch', (event) => {
//   console.log('Fetch intercepted for:', event.request.url);
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }
//       return fetch(event.request);
//     }),
//   );
// });
