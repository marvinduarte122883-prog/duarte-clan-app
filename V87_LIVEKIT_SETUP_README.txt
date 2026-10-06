DUARTE CLAN V87 — LIVEKIT GROUP MEDIA

Frontend is configured for:
  wss://duarteclan-hobduf1o.livekit.cloud
  /api/group-call-token

IMPORTANT: Rotate the LiveKit API secret that was previously pasted into chat. Do not put the replacement secret in index.html or this ZIP.

Cloudflare Worker environment values required:
  LIVEKIT_URL = wss://duarteclan-hobduf1o.livekit.cloud
  LIVEKIT_API_KEY = your LiveKit API key
  LIVEKIT_API_SECRET = your NEW rotated LiveKit API secret (Secret)
  SUPABASE_URL = your existing Supabase project URL
  SUPABASE_ANON_KEY = your existing Supabase anon/publishable key

The supplied cloudflare-worker-livekit-token.js handles POST /api/group-call-token.
If your current Worker already serves the Duarte site, merge this route into its existing fetch handler rather than replacing the whole site Worker.

V87 frontend behavior:
- Existing Supabase group room/invitation creation remains.
- Host requests a short-lived token using the existing Supabase access token.
- LiveKit carries audio/video using SFU.
- Adaptive stream + dynacast are enabled for lighter mobile usage.
- API secret never goes to the browser.

Note: this build connects the call starter to LiveKit. Existing invitation records remain in Supabase. A later UI pass can add an incoming Group Call / Join surface for invited members if the current app does not already expose one.
