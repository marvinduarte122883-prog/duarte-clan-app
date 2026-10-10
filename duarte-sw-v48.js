const CACHE_NAME='duarte-clan-v138-shell';
const SHELL=['./','./index.html','./login.html'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const c=await caches.open(CACHE_NAME);
  await Promise.all(SHELL.map(async u=>{try{await c.add(new Request(u,{cache:'reload'}))}catch(_){}}));
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys()){
    if(key.startsWith('duarte-clan-')&&key!==CACHE_NAME)await caches.delete(key);
  }
  await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/duarte-version.json')){event.respondWith(fetch(req,{cache:'no-store'}));return}
 if(req.mode==='navigate'){
   event.respondWith((async()=>{
     try{const r=await fetch(req);if(r.ok){const c=await caches.open(CACHE_NAME);c.put(req,r.clone()).catch(()=>{})}return r}
     catch(_){const c=await caches.open(CACHE_NAME);return await c.match(req)||await c.match('./index.html')||Response.error()}
   })());return;
 }
 // Let browser HTTP caching handle images and video; never fill Cache Storage with them.
 if(req.destination==='image'||req.destination==='video'||req.destination==='audio')return;
 if(req.headers.has('range'))return;
 const file=/\.(?:js|css|webmanifest)$/i.test(url.pathname);
 if(!file)return;
 event.respondWith((async()=>{
   const c=await caches.open(CACHE_NAME),saved=await c.match(req);
   if(saved)return saved;
   try{const r=await fetch(req);if(r.ok)c.put(req,r.clone()).catch(()=>{});return r}
   catch(_){return new Response('',{status:503})}
 })());
});
