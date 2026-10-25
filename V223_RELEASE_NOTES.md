# Duarte Clan V223 — Offline & APK Website Update Reliability

## Changes
- `index.html` now registers `duarte-sw-v62.js` with `updateViaCache: none`.
- New worker uses network-first HTML and CSS/JS loading with offline fallback to previously cached static resources.
- The worker does not intercept Supabase/API/auth/token/storage, audio/video/images or `duarte-version.json`.
- Update activation waits for the **Update** button (rather than automatically interrupting an open Messenger call).
- The existing update banner now uses white, blue, and dark-text theme colors.
- The release identifier in `duarte-version.json` is updated.
- No localStorage, IndexedDB, Supabase or authentication tokens are cleared.

## What this does not do
- Cannot guarantee WebView support for service workers or that closed APKs receive background push notifications.
- Offline access is restricted to successfully cached static pages/assets. Creating posts, authenticating, and messaging still require a connection.
- Existing clients running an old cached `index.html` may need to load the live site or refresh before they receive the new registration.

## Deployment
1. Upload the complete ZIP **contents** to the published Cloudflare Pages directory, not the ZIP itself.
2. Ensure `_headers`, `index.html`, `duarte-version.json`, and `duarte-sw-v62.js` deploy together.
3. Test website login, app refresh, online/offline loading and update prompt in a staging deployment first.
4. Test Android WebView APK separately; it may use WebView caching rather than the website's service worker.
5. Confirm existing conversations, stories, calls, account approval and login sessions in live testing.

## Static checks
`index.html` is based on V222. No existing feature script blocks were removed. JS and ZIP integrity checked during build.
