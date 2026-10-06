// V87 secure LiveKit token endpoint for Cloudflare Workers.
// Required Worker secrets/vars: LIVEKIT_API_KEY, LIVEKIT_API_SECRET,
// LIVEKIT_URL, SUPABASE_URL, SUPABASE_ANON_KEY.
const enc = new TextEncoder();
const b64u = (v) => btoa(String.fromCharCode(...new Uint8Array(v))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
const b64ut = (s) => b64u(enc.encode(s));
async function jwt(apiKey, apiSecret, identity, room) {
  const now = Math.floor(Date.now()/1000);
  const header = b64ut(JSON.stringify({alg:'HS256',typ:'JWT'}));
  const payload = b64ut(JSON.stringify({iss:apiKey,sub:identity,nbf:now-5,exp:now+600,video:{roomJoin:true,room,canPublish:true,canSubscribe:true,canPublishData:true}}));
  const input = header+'.'+payload;
  const key = await crypto.subtle.importKey('raw',enc.encode(apiSecret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig = await crypto.subtle.sign('HMAC',key,enc.encode(input));
  return input+'.'+b64u(sig);
}
const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store',...extra}});
export default { async fetch(req, env) {
  const u=new URL(req.url);
  if(u.pathname!='/api/group-call-token') return new Response('Not found',{status:404});
  if(req.method!=='POST') return json({error:'Method not allowed'},405);
  if(!env.LIVEKIT_API_KEY||!env.LIVEKIT_API_SECRET||!env.LIVEKIT_URL||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY) return json({error:'Group call server is not configured.'},503);
  const auth=req.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')) return json({error:'Authentication required.'},401);
  const userRes=await fetch(env.SUPABASE_URL.replace(/\/$/,'')+'/auth/v1/user',{headers:{authorization:auth,apikey:env.SUPABASE_ANON_KEY}});
  if(!userRes.ok) return json({error:'Your Duarte session is invalid or expired.'},401);
  const user=await userRes.json();
  if(!user?.id) return json({error:'Authenticated user was not found.'},401);
  let body;try{body=await req.json()}catch{return json({error:'Invalid request.'},400)}
  const room=String(body?.room_name||'');
  if(!/^duarte-[0-9a-f-]{36}$/i.test(room)) return json({error:'Invalid Duarte call room.'},400);
  // Use opaque Supabase UUID as LiveKit identity; do not expose email/name in the token.
  const token=await jwt(env.LIVEKIT_API_KEY,env.LIVEKIT_API_SECRET,user.id,room);
  return json({server_url:env.LIVEKIT_URL,participant_token:token},201);
}};
