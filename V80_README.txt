V80 Messenger Call Button Click Fix

Fixes the immediate UI issue where Audio Call and Video Call controls were visible but not clickable.
- Removes stale disabled/pointer-events state from call controls.
- Forces call controls above Messenger header overlays.
- Adds both direct button handlers and capture-phase fallback handlers.
- Re-enables buttons after Messenger state changes.
- Keeps recipient validation inside the call-start path so a stale UI state cannot permanently disable the buttons.

Important: keep/run the V79 Messenger Calls SQL setup before testing actual WebRTC connection.
