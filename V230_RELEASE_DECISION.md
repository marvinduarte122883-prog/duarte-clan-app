# Duarte Clan V230 — Release decision and evidence gate

**Decision: NO-GO for production at this time.** This is a preview/staging package and not a live-deployed or certified release. No production deployments or Supabase changes were made.

## Verified locally
- V229 static checker passes for required files, unique IDs, parseable version manifest, and presence of a group-call membership guard in worker source.
- V230 version manifest updated to `v230-release-gate-preview`; this is metadata only, not evidence of live deployment.
- ZIP integrity and file existence checked.

## Unverified and release blocking
- Supabase RLS and mandatory manual approval of all registrations (including direct API access attempts).
- LiveKit room authorization on **staging** Worker, including unauthorized, departed, declined, and ended-call scenarios.
- Desktop/mobile live browser interactions, two real Android phones, APK-specific cache/reconnect/session behavior.
- Cloudflare preview URL and active deployment version.

## Preview deployment
1. Back up the live GitHub branch, Cloudflare Worker code, and any deployment settings before testing.
2. Deploy the website contents of this ZIP to a **preview branch only**. Do not replace the production LiveKit Worker.
3. Run `python V230_PREFLIGHT.py --site https://YOUR-PREVIEW.pages.dev` on your own computer; use only a trusted HTTPS preview URL.
4. Check `V230_TEST_MATRIX.csv` and record test evidence. Use a separate staging LiveKit token Worker for authorization tests.
5. **Promote only after all critical and high tests pass** and recovery/rollback is demonstrated. If any permission or session test fails, stop and repair that issue.

This package does not modify application authentication, member data, call logic, photos, stories, or existing sessions. No claim is made that those functions passed live tests.
