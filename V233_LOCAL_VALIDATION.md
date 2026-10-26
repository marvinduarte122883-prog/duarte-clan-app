# Duarte Clan V233 — Local verification and preview release gate

## Automated static checks
- PASS — ZIP integrity
- PASS — Page required files present
- PASS — Current version consistently v233
- PASS — Active worker cache v233
- PASS — No duplicate index HTML IDs
- PASS — Supabase auth logic left intact
- PASS — Worker bypasses auth/API requests
- PASS — Service-worker update prompt preserved

Additional check: current V62 worker passed `node --check`. Historical V59 worker has a known syntax error, and was retained for compatibility; current HTML does not reference V59. Archive ZIP CRC validation passed.

## Not tested (production blockers)
- Preview deployment and actual HTTPS responses (no preview address or deployment credentials provided).
- Administrator approval/RLS permissions in Supabase, including rejected/pending accounts.
- Android WebView login persistence, responsiveness and notification behavior.
- Messenger, LiveKit calls, stories, media uploads, and offline reconnection.
- Real push notifications in the background (not implemented by this patch).

## Release decision
**PREVIEW ONLY. DO NOT DEPLOY TO PRODUCTION UNTIL CRITICAL MANUAL TESTS PASS.**

## Preview test sequence
1. Upload the website files to a **separate Cloudflare Pages preview branch/deployment**; do not replace the LiveKit token Worker.
2. Verify `duarte-version.json` reads `{"version":"v233"}` and check that the worker registered is `duarte-sw-v62.js`.
3. Test sign-in/logout/reload on desktop and FreeWebToApk Android; check retained sessions.
4. Create pending and rejected test accounts and verify **both UI and Supabase RLS** deny members-only data; approve only by admin.
5. Test bell notification list open/close, one row per event, readable messages and correct links.
6. Test Messenger A/B, unread and draft isolation, media attachments; use staging Worker to verify call permissions.
7. Test stories, gallery, reactions, comments, scroll, and layout at mobile widths 320/375/430 px.
8. Upgrade from prior app version and confirm service-worker update without losing login.
9. Only after checks pass, promote preview to production; otherwise roll back.
