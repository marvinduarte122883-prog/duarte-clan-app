# V232 Mobile Notifications Fix

- Keeps a single bottom Notifications entry on mobile.
- Hides legacy top-bar and extra floating notification controls on mobile without deleting their handlers.
- Improves text visibility in the actual mobile notification sheet and original notification panel.
- Makes unread items pale blue and timestamps readable.
- Does not change Supabase notifications, accounts, Messenger, or approval rules.

## Deploy
Upload website files to a non-production branch first. Confirm Cloudflare runs `npx wrangler preview` and check the preview on a real phone. Do not merge to main until verified.
