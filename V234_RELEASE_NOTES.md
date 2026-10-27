# Duarte Clan V234 — Lite UI + session persistence + offline shell

- Added lightweight consistent Facebook Lite-inspired visual polish on mobile and desktop.
- Supabase `persistSession`, `autoRefreshToken` explicitly enabled. No plaintext passwords are saved by the app; the browser or Android WebView manages its existing local session.
- Login now opens index.html automatically when a session exists. Offline auto-open requires a previously server-approved local member snapshot; index checks approval again on reconnection.
- Shared persistent offline notification, short online recovery confirmation.
- Service worker V234 caches the known app shell + same-origin static scripts, styles and branded images, but **not** API responses, Supabase data, user-uploaded media or token requests.
- The existing Home feed snapshot remains available where previously saved. Other dynamic views and images are not guaranteed offline. Outgoing interactions remain restricted by current offline logic.
- Deployment: upload all files together over HTTPS (GitHub Pages/Cloudflare Pages), reload online twice to activate and populate caches. WebView APK must support service workers and persistent site storage; some APK builders clear app storage or do not support service workers, which cannot be fixed by HTML alone.
- Log out ends the Supabase session. Device/browser clearing site data or storage eviction removes offline copies and login state.
- Verify on real Android APK, desktop, online/offline, pending approval, logout and returning login flows.
