DUARTE CLAN — FACEBOOK LITE PRODUCTION V49
Mobile Clean Header

Changes from V48:
- Mobile only: removed the large top hamburger/menu control.
- Mobile only: removed the top Family Features/Members round control.
- Mobile only: removed the redundant top Messenger round control.
- Kept the bottom navigation as the single mobile navigation surface:
  Home / Members / Notifications / Messenger.
- Kept desktop behavior unchanged.
- No Supabase schema, table, RLS, realtime, post, comment, reaction, story, or Messenger data logic changed.

Deployment:
Upload all files in this package together, replacing the previous V48 deployment.
If a previously installed PWA still shows the old header briefly, close/reopen it after the new service worker refreshes the page assets.
