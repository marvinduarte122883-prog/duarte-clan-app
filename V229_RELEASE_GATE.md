# Duarte Clan V229 — Preview preflight and release gate

**Status: NOT APPROVED FOR PRODUCTION.** V229 does not modify application behavior, Supabase rows, secrets, or production Workers. It packages V228 with a read-only test utility and an explicit release gate.

## Local validation
Run `python V229_PREFLIGHT.py` inside the unzipped folder. For a deployed Cloudflare *preview branch*, run `python V229_PREFLIGHT.py --site https://YOUR-PREVIEW.pages.dev`. The utility issues only public GET requests for static assets and version metadata. It cannot test authentication, RLS, calls, or WebView behavior. Never provide passwords, bearer tokens, or Supabase credentials.

## Manual security blockers
1. Register a new test member; verify the member cannot sign in before administrator approval, then can sign in only after approval. Verify rejected members remain blocked; review RLS policies directly.
2. On a **staging token Worker**, verify a caller and legitimate invited group member can obtain tokens; an unrelated or departed user cannot; ended calls deny new tokens. Recheck call lifecycle and Supabase RLS before deploying the new Worker to production.
3. In a preview browser, verify rapid Messenger A→B switching, Stories/reactions, photo uploads, notification navigation, calls, and session persistence after a reload.
4. Test two Android devices including a lower-memory phone: 320/375/430 px screens, back navigation, offline cached pages, reconnection, and that a site deployment does not log users out. FreeWebToApk behavior depends on the APK configuration.

## Release criteria
Require screenshots/logs of passing tests and a rollback copy of the live Cloudflare Worker and GitHub branch. If any auth or call authorization test fails, **do not deploy to production**. Do not weaken Supabase RLS for a passing test. Keep the staging LiveKit Worker separate from production. No claim that V229 has passed live tests.
