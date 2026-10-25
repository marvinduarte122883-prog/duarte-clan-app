# Duarte Clan V226 — LiveKit Token Authorization Repair (staged)

## Security repair
- Existing `V109_LIVEKIT_TOKEN_WORKER_DEPLOY_SEPARATELY.js` previously authenticated group callers but did not check room membership.
- Group-call tokens now require valid `call_id` and `room_name`, read `duarte_group_calls` using the caller's Supabase JWT, and require that the room name matches and call status is `ringing` or `active`.
- The same caller JWT must read their matching row in `duarte_group_call_participants`; only `joined` or `invited` members can get a token. Declined, left, missed, ended, missing, and unauthorized calls fail closed.
- Existing one-to-one caller/callee/status authorization remains intact.
- The legacy `cloudflare-worker-livekit-token.js` file now contains the same guarded implementation to avoid accidental deployment of the older unrestricted group-token route.
- No LiveKit secrets are included. Never commit keys to GitHub.

## Deployment — worker must be tested separately
1. Backup the **currently deployed Cloudflare LiveKit token Worker** and verify its routes, including `/api/group-call-token` and `/api/one-to-one-token`.
2. Deploy the updated `V109_LIVEKIT_TOKEN_WORKER_DEPLOY_SEPARATELY.js` as the **separate Cloudflare token Worker**, not your Pages `_worker.js` unless already deliberately configured that way. Configure existing secrets (`LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`) in Worker settings.
3. Verify Supabase RLS allows an authorized signed-in participant to SELECT their group call row and their own participant row. If RLS denies these queries, **the worker returns 403 by design**. Do not loosen RLS broadly; make narrowly-scoped policies after reviewing production policies.
4. Test: host starts a group call, invited member joins, unaffiliated member requests token (403), declined member requests token (403), ended call (403); then test 1:1 calls and group call rejoin.
5. Only promote after these live tests pass. Roll back to the backed-up Worker if valid calls fail.

## Explicit limitations
- This is a static code-level repair. No access to live Supabase RLS, Cloudflare Workers, Android APK, or actual LiveKit rooms was available.
- Membership-check correctness depends on RLS and the participant records created by existing server-side triggers.
- V226 does not prove production readiness. The V225 known duplicate IDs and old service-worker concerns remain outside this security patch.
- No database migrations or stored data changes are included. Main `index.html` scripts are untouched.
