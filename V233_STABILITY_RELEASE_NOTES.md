# Duarte Clan V233 — Stability and UI consistency patch

## Changes made
- Updated the front-end update-checker version from obsolete `v166-stage14` to `v233`, matching `duarte-version.json`. Numeric version matching is now consistent with the existing version checker.
- Updated the existing V62 service worker shell cache key to `duarte-clan-v233-shell`, retaining its original navigation strategy and private-data exclusions.
- Updated the V24 PWA manifest to the white/blue Facebook Lite theme.
- Updated in-app update banner colors for improved readability.
- Added mobile notification text contrast, wrapping, and button tap-target styles; previous V232 notification de-duplication behavior remains intact.

## Not changed
- Supabase access, RLS, accounts, sessions, admin/member approval workflow, Messenger, calls, notifications persistence, or stored media.
- No database migrations and no reset of browser storage.
- Did not switch from V216 to the stronger V217 mobile CSS because that could change navigation presentation without a real-device regression check.
- No browser push integration was added; background notifications in FreeWebToApk are not confirmed.

## Deployment safety and test checklist
1. Deploy full folder to a Cloudflare preview environment first, keeping relative paths.
2. Test administrator and pending-member logins; verify pending registration stays blocked.
3. Test mobile bottom notifications: a single entry, open and close, mark read, and correct deep links.
4. Test messages, group calls, stories, galleries, and photo permissions on Android/desktop.
5. Refresh and reopen, verify member sessions persist, and confirm the update banner behaves correctly.
6. Check service-worker activation in browser DevTools and offline fallback; do not assume push works when closed.
7. Promote to production only after verification. Existing installed website-mode APKs must be checked separately.
