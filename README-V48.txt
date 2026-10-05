DUARTE CLAN — FACEBOOK LITE PRODUCTION V48
Final Mobile/Desktop QA & Stability pass

Baseline: V47

Validated:
- Production package contains only active PWA assets; obsolete/empty pages remain excluded.
- index.html links only to login.html as a standalone HTML route.
- Active manifest remains duarte-manifest-v23.webmanifest.
- Active service worker remains duarte-sw-v26.js.
- Social/realtime V47 optimizations preserved.
- Mobile/desktop visual design and Supabase schema/API calls unchanged.

V48 stability changes:
- Replaced the remaining 350ms repeating bootstrap interval with three bounded one-shot retries (350/900/1800ms).
  This preserves delayed dynamic UI initialization without keeping another interval lifecycle.
- Reduced the offline diagnostics modal refresh frequency from 5s to 15s; it runs only while that modal is open/visible.
- Added production-facebook-lite-v48 build metadata.

Important release QA:
Static/code QA cannot prove live Supabase permissions, realtime delivery, device-specific browser behavior, or offline sync against production data. After deployment, run the live acceptance flow on at least one phone and one desktop:
Login > Home > Profile > Members > Member Profile > Post > Reaction > Comment/Reply > Stories > Online > Notifications > Messenger > Logout > Offline > Reconnect.
