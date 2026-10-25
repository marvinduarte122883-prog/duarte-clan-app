# Duarte Clan V228 — Preview release checklist (V227 baseline)

**Status:** Preview candidate only. This package has **not** been deployed or tested against your Cloudflare, Supabase, or Android app. No new website behavior is claimed. The website version remains `v227-production-validation` because this stage adds deployment instructions and tests, not runtime changes.

## Preview deployment
1. Back up your current GitHub branch, Cloudflare Pages production deployment and **separate LiveKit token Worker**.
2. Use a **separate preview branch** in the linked GitHub repo. Upload the website contents from this ZIP (not the ZIP itself), with `index.html` at the site's published root. If your Pages build uses a subdirectory, place files there.
3. Ensure Cloudflare Pages recognizes the preview branch and returns a preview URL. Do **not** promote it or connect the production custom domain.
4. Verify `index.html`, `login.html`, `duarte-version.json`, `duarte-sw-v62.js`, and `_headers` are served by the preview URL. Confirm the returned version string is `v227-production-validation`.
5. If a Cloudflare Worker deployment is needed to test secure calls, deploy a **separate staging Worker and staging routes**; leave the production token Worker and real calls unchanged. Do not place keys in website JavaScript.

## Live smoke tests — record pass/fail and screenshots
- [ ] Pending registration is blocked until admin approval; rejected membership denied.
- [ ] Approved member can log in, refresh, and reopen without unintended logout.
- [ ] Member cannot access admin dashboard or privileged Supabase rows.
- [ ] Feed post, comment, like, upload and story creation/reaction/reply work.
- [ ] Messenger A→B rapid switching never shows A messages in B; drafts, seen, replies, group messages work.
- [ ] Notifications show correct unread count and navigate to source.
- [ ] Call Worker denies unauthorized/declined/ended call participants; authorized participants can join; 1:1 and group calls reconnect. **BLOCKER** until validated.
- [ ] Mobile: 320px, 375px, 430px and landscape navigation, More menu, photos, inputs, scroll and Android Back all fit without clipping.
- [ ] APK on at least one low-memory Android: update website, reconnect offline/online, verify sign-in remains, no lag or stuck update prompt.
- [ ] Desktop: Chrome and another browser; verify actions and modal scrolling.

## Security and release gate
- **No production promotion** until LiveKit participant authorization and admin-approval RLS have passed live tests.
- Do not weaken RLS to get calls working. If call permissions fail, collect the exact error and reconcile schema/policies in staging.
- If preview fails, revert the preview branch and restore the previous token Worker independently; preserve Supabase data and sessions.

## Local static results
See `V228_PREVIEW_CHECK_RESULTS.json`. These do not establish real-world reliability.
