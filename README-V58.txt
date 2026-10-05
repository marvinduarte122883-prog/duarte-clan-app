DUARTE FACEBOOK LITE PRODUCTION V58
Member Request Reject Fix

- Fixes Reject action for pending membership requests on desktop and mobile.
- Removes dependency on UPDATE ... SELECT returning a row through RLS.
- Verifies rejected state with a separate read.
- Refreshes pending members and member directory after success.
- Keeps rejected account blocked with approved=false and clan_role=Rejected.
- No visual redesign.
