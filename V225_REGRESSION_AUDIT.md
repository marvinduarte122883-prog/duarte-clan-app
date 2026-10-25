# Duarte Clan V225 — Regression Audit and Release Gate

**Baseline:** V224 source files. **Scope:** local static code and packaging checks only. No access to live Supabase, Cloudflare deployment, FreeWebToApk Android WebView, or real members' accounts.

## Automated results

- `index.html`: 180 nonempty inline JavaScript blocks passed `node --check`, 2 script tags excluded (empty/external or non-JavaScript). `login.html`: 3 passed. `admin.html`: 4 passed.
- No missing referenced relative image/script/stylesheet paths were detected in the three HTML files. This check does not verify URLs loaded at runtime or dynamic asset paths.
- No duplicate element IDs in `login.html` or `admin.html`. **Two duplicate IDs in `index.html`:** `ff-v84-group-call-lite` and `duarte-v149-story-video-preview-fix`. Do not rename without auditing references and runtime effects.
- Older `duarte-sw-v59.js` fails Node.js syntax checking. The latest v62 did not fail, but keep old worker paths until confirming no installed clients use them; review v59 before any cleanup.
- **Security release blocker:** `cloudflare-worker-livekit-token.js` verifies the caller's Supabase session but does not check membership or invitation to the requested room. It must deny tokens to signed-in nonparticipants. Other Worker versions may have different behavior and need separate verification.

## Required live regression tests — not executed

| Area | Test | Pass condition |
| --- | --- | --- |
| Registration | New user signs up | Remains pending; cannot use protected content until approved |
| Admin approval | Approve and reject test accounts | Only authorized admin can decide; rejected account remains blocked; welcome message only after approval |
| Login | Desktop/mobile, reload, sign out and switch accounts | No redirect loop; session stays valid without leaking previous account's data |
| Authorization | Non-admin opens admin URLs and Supabase API | Access denied server-side, not only hidden by CSS |
| Media | Upload/view posts, multiple photos, video, and 24-hour stories | Proper orientation, no cropping, reactions/replies persist, expiry works |
| Messenger | A → B rapid switch; drafts; replies; read receipts | Never shows A's messages under B; reading position preserved |
| Calls | 1-to-1/group, denied user attempts room-token request | Only participants receive tokens; calls connect and close correctly |
| Notifications | Posts, comments, DMs and redirects | Correct target and unread state; no duplicate popups |
| Offline/updates | Go offline, reconnect, deploy an update, test WebView | Cached UI available as designed; no loss of valid auth session or drafts |
| Mobile layout | 320px, 360px, 390px, tablets; Android Back | No clipped buttons, unreadable text, horizontal scrolling, or stuck overlay |
| Performance | Low-memory Android device | Measure memory, startup, feed scrolling and crash/freeze frequency before release |

## Release decision

**NOT CLEARED FOR PRODUCTION SECURITY SIGN-OFF.** The LiveKit room-authorization weakness is a high-priority release blocker. Static checks do not prove live behavior. No source code or service worker was modified in V225 to avoid introducing an untested regression. This package is an audit snapshot and test plan, not a validated feature release.

## Deployment guidance

Keep V224 deployed until backend room-membership verification is added and tested, and the above account/role/device checks pass. If you do deploy the V225 snapshot, it has the same site code as V224, with only these audit documents added.
