/* Eidos offline v1: same-origin pages and assets only */
const VERSION='eidos-offline-v2';const SHELL=['./','./index.html','./offline.html','./offline.html','./offline-manager.html','./offline-manager.js','./offline-catalog.json','./portal.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(async c=>{for(const path of SHELL){try{await c.add(path)}catch(_){}}}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
 e.respondWith((async()=>{const cache=await caches.open(VERSION);const hit=await cache.match(r);try{const network=await fetch(r);if(network.ok && network.type!=='opaque')cache.put(r,network.clone()).catch(()=>{});return network}catch(_){return hit||(r.mode==='navigate'?await cache.match(new URL('./offline.html',self.registration.scope)):Response.error())}})())});
