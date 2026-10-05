DUARTE CLAN — FACEBOOK LITE PRODUCTION V47
Social Features & Realtime Optimization

Changes from V46:
- Preserves current black/gold Duarte UI and Supabase schema/functions.
- Home/Profile canonical post synchronization retained.
- Replaced two 100ms interval-based openClanProfile hook waiters with bounded timeout initialization.
- Reduced setInterval usage from 6 in the original V46 audit to 4.
- Removed redundant document-wide presence repaint on every click.
- Presence remains driven by Supabase Presence events, renderer hooks, visibility/reconnect lifecycle.
- Existing social realtime channel continues to coalesce posts/comments/reactions/comment_reactions refreshes.
- Added production build marker: production-social-realtime-lite-v47.

Deploy the files in this folder together. Do not mix index.html with older Duarte builds.
Recommended QA: Home/Profile same-post sync, comments/reactions, member profile, online dot, Messenger, notifications, stories, mobile bottom navigation, desktop navigation, offline/reconnect.
