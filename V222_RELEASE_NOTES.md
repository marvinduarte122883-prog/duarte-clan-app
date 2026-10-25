# Duarte Clan V222 — Media & Messenger Performance

Based on V221. This is a conservative frontend performance update.

## Changed
- Offscreen rendering hints for post cards and album cards; containment for conversation rows.
- Mobile GPU-friendly styling and more reliable scroll boundaries for Messenger.
- Dynamic feed/conversation images receive native lazy-load and async decoding hints, without changing URLs, data, or photo viewer images.
- Media sizing within narrow mobile viewports.

## Unchanged
- Supabase schema, queries and records, authentication, member approval, posting, story creation/playback, Messenger message state, LiveKit calls, service workers and APK packaging.

## Deployment and tests
1. Deploy all ZIP contents to the actual Cloudflare site root, and confirm the latest deployment ID.
2. Test feed scroll and photo opening on a low-memory Android phone and desktop.
3. Test Messenger A → B switching, unread badges, photo attachment/viewer, replies, drafts, Sent/Seen.
4. Test story creation, playback and replies; test one-on-one and group calls.
5. Confirm the mobile homepage retains Duarte Clan light theme and the five navigation tabs.
6. Separately test installed WebView APK for cached HTML after an online reload.

Static checks do not guarantee performance improvements or live interaction success. If an offscreen media rendering issue occurs on an affected phone, remove the V222 style/script blocks from index.html to roll back this change.
