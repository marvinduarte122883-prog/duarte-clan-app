# Duarte Clan V233 — Deployment Readiness Check

Date: 2026-10-26

## Locally confirmed
- ZIP archive integrity passes.
- `index.html`, `login.html`, `admin.html` local linked script/CSS/image references all resolve; no missing local references found in these entry pages.
- All top-level external `.js` files pass `node --check` except the historical `duarte-sw-v59.js`, which has a syntax error. Current pages reference `duarte-sw-v62.js`, not V59.
- Active service worker V62 contains the V233 shell cache key and excludes Supabase requests, token routes, and media from caching.
- `duarte-version.json` identifies `v233`.
- Manifest V24 uses light background and blue theme, and its referenced icons exist.
- Existing `_headers` includes cache revalidation for index/login/version/current worker.

## Not confirmed, must be tested on HTTPS preview
1. Administrator-only access and mandatory approval enforced in Supabase RLS, including pending/rejected members.
2. No duplicate mobile notifications; text contrast, deep links, dismiss and mark-as-read all work.
3. Messenger message and unread isolation, media sends, voice/video/group call authorization.
4. Android WebView session persistence and no accidental logout on Back/refresh.
5. Stories/comments/gallery/media upload and mobile scrolling at 320/375/430 px.
6. Service worker update transition from older installations without losing sessions.
7. Background push notifications on closed Android APK (not added or validated).

## Deployment decision
**PREVIEW-ONLY**. Do not promote this package to production from static checks alone.

## Recommended steps
Deploy files through Cloudflare Pages preview branch or a separate preview project, not to the public production branch. Ensure the build output directory contains `index.html`, `duarte-version.json`, `duarte-sw-v62.js`, `_headers`, CSS, JS and icons at the deployment root. Confirm HTTP 200 for these assets and that `duarte-version.json` returns `v233`. Test admin and member scenarios using nonproduction accounts and avoid changing live databases without a backed-up/test environment. Use production release only after passing manual tests. The LiveKit token Worker is a separate deployment and is not replaced by this static website bundle.
