# Duarte Clan V235 — automatic welcome greeting

- When an approved new member logs in online for the first time on a device, a personal welcome dialog appears.
- The message uses the existing Admin Dashboard welcome template if the `duarte_get_welcome_template` RPC is installed; otherwise a built-in greeting is used.
- The dialog appears only for approved members and is dismissed by Explore Duarte Clan. Dismissal is remembered per user ID on that device.
- No change to admin approval, login session, posts, notification table, or other Supabase data.

**Limit:** The one-time dismissal is per device/browser, rather than account-wide. This release does not automatically publish a public feed post or send push notifications. Existing V124 database functions must be configured in Supabase to save a custom greeting.
