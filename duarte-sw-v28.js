const CACHE_NAME="duarte-clan-v112-shell";
const SHELL=[
  "./",
  "./index.html",
  "./login.html",
  "./duarte-manifest-v23.webmanifest",
  "./duarte-icon-192.png",
  "./duarte-icon-512.png",
  "./duarte-icon-maskable-512.png",
  "./duarte-apple-touch-icon.png"
];

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    for(const url of SHELL){ try{ await cache.add(url); }catch(e){} }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith("duarte-clan-")&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message",event=>{
  if(event.data?.type==="SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;

  if(req.mode==="navigate"){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(req);
        const cache=await caches.open(CACHE_NAME);
        cache.put(req,fresh.clone()).catch(()=>{});
        return fresh;
      }catch(e){
        const cache=await caches.open(CACHE_NAME);
        return (await cache.match(req)) ||
               (await cache.match(url.pathname.endsWith("login.html")?"./login.html":"./index.html")) ||
               (await cache.match("./"));
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const hit=await cache.match(req);
    if(hit){
      fetch(req).then(r=>{ if(r.ok) cache.put(req,r.clone()); }).catch(()=>{});
      return hit;
    }
    try{
      const fresh=await fetch(req);
      if(fresh.ok) cache.put(req,fresh.clone()).catch(()=>{});
      return fresh;
    }catch(e){
      return new Response("",{status:503,statusText:"Offline"});
    }
  })());
});