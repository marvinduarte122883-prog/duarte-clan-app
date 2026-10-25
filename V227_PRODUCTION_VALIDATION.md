# Duarte Clan V227 — Production Validation (staged, not production certified)

## Changed from V226
- `duarte-version.json`: set to `v227-production-validation` to match this candidate, without changing cached login credentials, Supabase data, or the existing service worker logic.
- `index.html`: two colliding IDs belonged to pairs of `<style>` and `<script>` elements. Renamed the **script tag IDs only**, retaining their full JavaScript contents; CSS IDs and functionality are otherwise unchanged.
- V226 group-call authorization Worker remains staged and **must not be deployed before RLS and user authorization testing**.

## Static validation
See `V227_STATIC_TEST_RESULTS.json` for per-page Node JavaScript parse checks, duplicate ID scan, and worker syntax.
Static parsing does not prove login, messages, video, Supabase RLS, LiveKit authorization, offline caching, or phone performance.

## Production acceptance checklist (not yet passed)
1. **Staging deployment first.** Backup live Pages and separate Cloudflare LiveKit Worker; upload the website candidate to a preview deployment.
2. **Registration/access:** New account stays pending until administrator approval; reject/approve with role-appropriate permissions; confirmed member can log in and refresh without losing session.
3. **Posts/stories:** Upload photos, post/comment/react, check 24-hour story expiry, view media on low-memory Android.
4. **Messenger:** Switch A→B rapidly without mixing conversations; verify drafts, read/seen, replies, attachments, group messaging, reconnect.
5. **Calls:** On staging Worker, authenticated member invited to active call can obtain token; unrelated member, declined participant, and ended call get 403. Confirm one-to-one, group rejoin, RLS behavior and call teardown. Never loosen RLS globally.
6. **Notifications:** Validate click destinations, unread state and timing.
7. **PWA/APK:** Update while active, close/reopen, go offline/online, verify cached shell, version refresh, persisted authenticated session, Android Back navigation.
8. **Desktop/mobile:** Verify tap targets, no horizontal overflow, content scrolling and popups across phone sizes.
9. **Go/no-go:** Record evidence, fix blocking failures, deploy only after all mandatory checks pass.

## Known limitations
- No live Cloudflare/Supabase/LiveKit or physical Android testing was performed.
- The installed FreeWebToApk app may use a WebView cache policy independent of website service-worker changes.
- The `duarte-version.json` version change may cause an update prompt on the live site if this candidate is deployed. Do not deploy unless a real update is intended.
- No API secrets have been added, and no stored member data has been modified.
