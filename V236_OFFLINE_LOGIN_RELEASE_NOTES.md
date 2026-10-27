# Duarte Clan V236 — Offline login

- Keeps the normal login page and shows a no-internet message; offline sign-in is blocked.
- If the external Supabase library cannot load, the login interface and offline warning still work.
- Cached previously loaded Home pages remain supported.
- Pre-caches the login document as a required service-worker installation asset; offline navigations can fall back to it.
- Online saved-session auto-login remains supported.

**Android limitation:** The FreeWebToApk native error screen can appear before the website service worker runs. Website files alone cannot replace that native screen. Check the wrapper's WebView storage/service-worker/offline-page settings; an APK rebuild might be needed. An offline-first launch without prior successful caching cannot work reliably.

Deploy full ZIP over HTTPS; open online to install worker, then test offline reload, logout, saved session, and actual APK separately.
