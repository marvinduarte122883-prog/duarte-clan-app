DUARTE CLAN — FACEBOOK LITE PRODUCTION V46

This build is based on the V45 cleaned deployment package.

V46 internal Lite optimization:
- Preserves the existing black/gold Duarte design and Supabase behavior.
- Replaces V43/V44 click-time mobile navigation/menu rescans with one delegated navigation handler.
- Uses one lightweight MutationObserver only for dynamically inserted mobile navigation/menu cleanup.
- Removes repeated bind()/cleanMenu() execution after every document click.
- Keeps Home, Members and My Profile mobile routing available without per-element rebinding.
- Keeps active PWA files: duarte-manifest-v23.webmanifest and duarte-sw-v26.js.
- No database schema/RLS changes are included.

DEPLOY:
Upload the contents of this folder to the same HTTPS site root.
Do not upload older manifests/service workers alongside these files.
After deployment, close old tabs and reopen the site so the active service worker can refresh assets.
