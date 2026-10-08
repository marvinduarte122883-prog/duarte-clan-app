// V109: Replace the code of the separate Cloudflare Worker "duarte-livekit-token".
// Set secrets in Cloudflare settings, NEVER paste credentials into this file.
// Includes the existing group token route and the new participant-restricted 1:1 route.
const enc = new TextEncoder();
const b64u = v => btoa(String.fromCharCode(...new Uint8Array(v))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
const b64ut = s => b64u(enc.encode(s));
const cors = {'access-control-allow-origin':'*','access-control-allow-headers':'authorization,content-type','access-control-allow-methods':'POST,OPTIONS','cache-control':'no-store'};
const json = (body,status=200) => new Response(JSON.stringify(body),{status,headers:{...cors,'content-type':'application/json'}});
const uuid = s => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
async function jwt(key,secret,id,room){
 const now=Math.floor(Date.now()/1000);
 const input=b64ut(JSON.stringify({alg:'HS256',typ:'JWT'}))+'.'+b64ut(JSON.stringify({iss:key,sub:id,nbf:now-5,exp:now+600,video:{roomJoin:true,room,canPublish:true,canSubscribe:true,canPublishData:true}}));
 const hmac=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return input+'.'+b64u(await crypto.subtle.sign('HMAC',hmac,enc.encode(input)));
}
export default {async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(path!=='/api/group-call-token'&&path!=='/api/one-to-one-token')return new Response('Duarte LiveKit token service',{status:200});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='POST')return json({error:'Method not allowed'},405);
 if(!env.LIVEKIT_API_KEY||!env.LIVEKIT_API_SECRET||!env.LIVEKIT_URL||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY)return json({error:'Token service configuration is missing'},503);
 const bearer=request.headers.get('authorization')||'';
 if(!/^Bearer\s+\S+$/i.test(bearer))return json({error:'Authentication required'},401);
 const base=env.SUPABASE_URL.replace(/\/+$/,'');
 const headers={authorization:bearer,apikey:env.SUPABASE_ANON_KEY,accept:'application/json'};
 let response;try{response=await fetch(base+'/auth/v1/user',{headers})}catch{return json({error:'Unable to verify session'},503)}
 if(!response.ok)return json({error:'Your Duarte session could not be verified',supabase_status:response.status},401);
 const user=await response.json().catch(()=>null);
 if(!uuid(String(user?.id||'')))return json({error:'Authenticated user was not found'},401);
 const input=await request.json().catch(()=>null);
 if(!input||typeof input!=='object')return json({error:'Invalid request'},400);
 let room='';
 if(path==='/api/one-to-one-token'){
  const callId=String(input.call_id||'');
  if(!uuid(callId))return json({error:'Invalid call reference'},400);
  // Use the caller's Supabase JWT, not a service-role key; fail closed when RLS denies.
  const api=base+'/rest/v1/duarte_calls?select=id,caller_id,callee_id,status&id=eq.'+encodeURIComponent(callId)+'&limit=1';
  const rowRes=await fetch(api,{headers});
  if(!rowRes.ok)return json({error:'Call authorization could not be verified',supabase_status:rowRes.status},403);
  const rows=await rowRes.json().catch(()=>[]);
  const call=Array.isArray(rows)?rows[0]:null;
  if(!call||![call.caller_id,call.callee_id].includes(user.id))return json({error:'You are not a participant in this call'},403);
  if(!['ringing','accepted'].includes(call.status))return json({error:'This call is no longer active'},409);
  room='duarte-direct-'+callId;
 }else{
  room=String(input.room_name||'');
  if(!/^duarte-[0-9a-f-]{36}$/i.test(room))return json({error:'Invalid Duarte group room'},400);
  // Existing group-call authorization retained here. For stronger group privacy,
  // separately verify group membership before issuing a group token.
 }
 return json({server_url:env.LIVEKIT_URL,participant_token:await jwt(env.LIVEKIT_API_KEY,env.LIVEKIT_API_SECRET,user.id,room)},201);
}};
