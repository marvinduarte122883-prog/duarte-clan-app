DUARTE CLAN — FACEBOOK LITE PRODUCTION CLEANUP V45

Production files only. Current black/gold UI and Supabase functionality are preserved.

Removed from deployment package:
- empty members.html
- empty events.html
- empty gallery.html
- duarte-manifest-v11.webmanifest
- duarte-manifest-v16.webmanifest
- duarte-sw-v11.js
- duarte-sw-v24.js
- stale QA/readme artifacts

Active PWA files retained:
- duarte-manifest-v23.webmanifest
- duarte-sw-v26.js

IMPORTANT:
The current index.html contains layered compatibility/mobile fixes through V44. They were NOT blindly deleted because later fixes can depend on earlier runtime functions. This package is therefore a safe deployment cleanup, not a destructive source rewrite.

After deployment:
1. Stay online for the first load.
2. Hard refresh once.
3. Verify Home, Members, Profile, Posts, Comments/Reactions, Stories, Notifications, Messenger, Online Presence, Logout.
4. Test one narrow mobile viewport and desktop.
5. Confirm the active service worker is duarte-sw-v26.js.
