# Duarte Clan V231 — Preview test execution guide

**Release decision: NO-GO until critical manual tests pass.** This is a preview validation package, not a production deployment. No live Cloudflare, Supabase, or Android testing was executed by this package.

## 1. Safe deployment
1. Create a Cloudflare Pages preview branch from the existing production branch; avoid deploying over the live app.
2. Upload the V231 website files in the same directory structure. Do **not** replace the production LiveKit token Worker with the staged Worker code.
3. Run `python V231_PREFLIGHT.py --site https://YOUR-PREVIEW.pages.dev` from your trusted computer. This checker makes **only unauthenticated GET requests** to public resources. It does not access Supabase records, sign in, or verify RLS.
4. Check the `duarte-version.json` response is exactly `v231-preview-validation` on the preview site.

## 2. Must-pass critical tests (separate test accounts only)
- Create a new test user. Before administrator approval, confirm that signing in or calling members-only APIs cannot reveal posts, profiles, media, group-call details, or private messages.
- Reject a test user; verify that a rejected user cannot access member-only data via direct Supabase queries. Validate RLS in Supabase, not just frontend menus.
- Approve one test user manually. Confirm activation occurs only after explicit administrator approval.
- Using a **staging** LiveKit token Worker, test token requests for an invited participant and for an uninvited, declined, departed, and ended-call participant. Reject the latter four.
- Verify RLS grants the staging token Worker the intended authorization data access, without publishing a service-role key in the browser.

## 3. Browser + Android verification
- Test logins and session persistence after reload and site update on desktop and 2 physical Android devices.
- Test Messenger conversation A→B switching, drafts, attachments, unread, Sent/Seen and calls.
- Check Stories 24-hour expiration, photo previews, comments/reactions, album uploads, full-screen viewing.
- Check bottom navigation and More menu at 320px, 375px, 430px widths; verify readable dark text, white cards, light-grey background and no horizontal clipping.
- Verify cache refresh and offline fallback on web and actual FreeWebToApk installation. Test Android Back behavior; avoid automatically clearing WebView storage.

## 4. Rollback and promotion
Record evidence and status in `V231_TEST_MATRIX.csv`. Never promote while any Critical or High test is Pending or Fail. Back up the current Pages deployment and token Worker before promoting. If authorization, login or calls regress, restore the previous Worker and Pages deployment.
