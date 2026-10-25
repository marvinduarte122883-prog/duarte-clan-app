# Duarte Clan V221 - verification checklist

Scope: styling and touch-target safety for mobile, with original application scripts preserved.

1. Confirm Cloudflare publishes this updated `index.html` (search page source for `duarte-v221-mobile-stability`).
2. Test on narrow and large Android screens: Home, Members, Notifications, Messenger, More.
3. Open More and older slide-out clan menu; verify black labels on white and scrolling.
4. Test photo viewer, story composer, comment composer, and back/navigation controls.
5. Test admin/member logins, mandatory approval, Supabase session refresh, Messenger/call flows.
6. Test installed WebView APK separately for stale cached files and internet-offline recovery.

This is a targeted CSS safety patch; it does not prove live device performance, real-time calls, or database permissions.
