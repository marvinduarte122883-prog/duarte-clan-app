/* Duarte Clan V223 – reliable and isolated static caching.
 * Auth responses, Supabase, tokens, uploads, media and API traffic are never intercepted.
 */
const CACHE_NAME = 'duarte-clan-v236-shell';
const PREFIX = 'duarte-clan-';
const SHELL = ["./index.html", "./login.html", "./admin.html", "./duarte-lite-v234.css", "./duarte-connectivity-v234.js", "./duarte-mobile-lite-theme-v216.css", "./duarte-mobile-lite-theme-v217.css", "./duarte-facebook-complete-v180.css", "./duarte-clan-brand-banner.png", "./duarte-icon-192.png", "./duarte-login-wallpaper-desktop.webp", "./duarte-login-wallpaper-mobile.webp", "./duarte-manifest-v24.webmanifest"];
const allowCache = response => response && response.ok && response.type === 'basic' && !response.headers.has('set-cookie') && !/private|no-store/i.test(response.headers.get('cache-control') || '');
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const loginResponse = await fetch(new Request('./login.html', {cache:'reload', credentials:'same-origin'}));
    if (!allowCache(loginResponse)) throw new Error('Login document could not be cached');
    await cache.put('./login.html', loginResponse.clone());
    await Promise.all(SHELL.filter(url => url !== './login.html').map(async url => {
      try {
        const response = await fetch(new Request(url, {cache:'reload', credentials:'same-origin'}));
        if (allowCache(response)) await cache.put(url, response);
      } catch (_) { /* Offline during installation: leave existing worker active. */ }
    }));
    // Wait until the user accepts the existing update prompt. Do not interrupt calls/stories.
  })());
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE_NAME) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API calls, authentication, uploads, dynamic media, or version checks.
  if (/supabase|auth|token|realtime|storage\/v1|\/rest\/v1|\/functions\/v1|duarte-version\.json/i.test(url.pathname)) return;
  if (['video','audio'].includes(request.destination)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, {cache:'no-store'});
        if (fresh.ok && allowCache(fresh)) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone()).catch(()=>{});
        }
        return fresh;
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        const path = url.pathname.toLowerCase();
        // Only serve a known page fallback; do not turn arbitrary routes into the dashboard.
        const key = path.endsWith('/login.html') ? './login.html' : path.endsWith('/admin.html') ? './admin.html' : (path.endsWith('/index.html') || path.endsWith('/')) ? './index.html' : null;
        return (await cache.match(request)) || (key && await cache.match(key)) || (await cache.match('./login.html')) || Response.error();
      }
    })());
    return;
  }
  if (!/\.(?:css|js|webmanifest|png|webp|svg)$/i.test(url.pathname)) return;
  // Only assets on this app's own origin; never cache user uploads or remote images.
  if (request.destination === 'image' && !/duarte-(?:icon|login-wallpaper|clan-brand|apple-touch|clan-wordmark)/i.test(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const fresh = await fetch(request, {cache:'no-cache'});
      if (allowCache(fresh)) cache.put(request, fresh.clone()).catch(()=>{});
      return fresh;
    } catch (_) {
      return (await cache.match(request)) || Response.error();
    }
  })());
});
