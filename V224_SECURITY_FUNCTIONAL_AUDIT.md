# Duarte Clan V224 — Security & Functionality Static Audit

**Scope:** V223 local website package; no live Supabase, Cloudflare, APK, WebView, or call endpoint access.

## Confirmed findings

1. **LiveKit room authorization requires remediation (high priority).** `cloudflare-worker-livekit-token.js` confirms a Supabase user ID but accepts any syntactically valid `duarte-UUID` room name. A signed-in member who knows another room name could request a room token. Before deployment, validate room membership/participation using an authoritative server-side record with a short-lived token; check all one-to-one/group endpoints as well. Do not deploy the sample Worker files as-is without addressing this.
2. **Duplicate HTML IDs:** `ff-v84-group-call-lite` and `duarte-v149-story-video-preview-fix` each appear twice in `index.html`. Their effects require DOM/browser testing before IDs are changed, because other scripts may look them up by ID.
3. **Large page and layered CSS:** 251 inline `<style>` elements and 182 script elements in `index.html`. This is a performance/maintainability risk, not proof of lag; profile actual low-memory hardware.
4. **Third-party runtime scripts:** Supabase and LiveKit load from jsDelivr. Audit network failures and pin dependency versions with integrity controls as appropriate.
5. **Offline authentication:** V223 caches HTML shell only; this is not a guarantee of authenticated offline access. Verify expiration, account switching, reconnection, and protection of any persisted personal content.

## Safe change included

Added `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` to Cloudflare Pages `_headers`. No JavaScript, Supabase schema, authentication flows, or call flows changed.

## Tests required before production

- Registration starts as pending; no member can access before approval; rejection stays blocked; welcome messages only after approval.
- Roles: member cannot access admin; admin can approve; storage policies restrict private data and uploads.
- Login, sign-out, refresh, session recovery, account switch, offline/online, expired tokens.
- Posts, comments, reactions, notifications, photos, stories (24h), Messenger conversation isolation, drafts, read receipts, voice/video/group calls.
- Try joining a group-call room as an authenticated nonparticipant: token endpoint must deny.
- Mobile and desktop viewport, touch targets, Android back, media overlays, installed APK update without logout.

## Security scope warning

Static frontend inspection cannot validate live RLS policies, Cloudflare Worker environment secrets, or server-side role enforcement. Do not label the site production-security-verified until these are checked.
