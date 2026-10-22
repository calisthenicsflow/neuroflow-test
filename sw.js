const V='1088',SHELL='nf-shell-v'+V,AUDIO='nf-audio-a1';
const PRE=['./','index.html','manifest.webmanifest','privacy.html'].concat(["assets/fonts/dmmono-19de2e80.woff2", "assets/fonts/dmmono-1cb0636f.woff2", "assets/fonts/dmmono-7e5f82a6.woff2", "assets/fonts/dmmono-a1644b8f.woff2", "assets/fonts/dmsans-8ca1b7f2.woff2", "assets/fonts/dmsans-e8eef872.woff2"],["icons/apple-touch-icon.png", "icons/favicon.ico", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-32.png", "icons/icon-512.png", "icons/maskable-192.png", "icons/maskable-512.png"]);
const LANGF=["breath_b64_start.mp3", "love_b64_final.mp3", "love_b64_start.mp3", "mant_b64_final.mp3", "mant_b64_start.mp3", "mful_b64_final.mp3", "mful_b64_start.mp3", "open_b64_final.mp3", "open_b64_start.mp3", "skan_b64_final.wav", "skan_b64_start.mp3", "visual_b64_final.mp3", "visual_b64_start.mp3"];
const WHM=['fast_in','fast_out','medium_in','medium_out','slow_in','slow_out'].map(k=>'assets/whm_'+k+'.wav');
const key=u=>{const x=new URL(u,self.location.href);x.search='';return x.href;};
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>Promise.all(PRE.map(p=>fetch(p,{cache:'reload'}).then(r=>{if(r.ok)return c.put(key(p),r);}).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('nf-')&&k!==SHELL&&k!==AUDIO).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
async function cacheLang(lang){const c=await caches.open(AUDIO);const base=lang==='ru'?'assets/':'assets/'+lang+'/';
 for(const p of LANGF.map(f=>base+f).concat(WHM)){const k=key(p);if(await c.match(k))continue;try{const r=await fetch(p);if(r.status===200)await c.put(k,r);}catch(e){}}}
self.addEventListener('message',e=>{const d=e.data||{};if(d.t==='lang'&&/^(ru|en|de|es|zh)$/.test(d.lang))e.waitUntil(cacheLang(d.lang));});
function timeout(p,ms){return new Promise((res,rej)=>{const t=setTimeout(()=>rej(0),ms);p.then(r=>{clearTimeout(t);res(r);},x=>{clearTimeout(t);rej(x);});});}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/version.txt'))return;
 if(r.mode==='navigate'){e.respondWith(timeout(fetch(r),4000).then(res=>{if(res.ok&&!u.pathname.endsWith('privacy.html')){const cl=res.clone();caches.open(SHELL).then(c=>c.put(key('index.html'),cl));}return res;}).catch(()=>caches.match(u.pathname.endsWith('privacy.html')?key('privacy.html'):key('index.html'),{ignoreSearch:true}).then(m=>m||caches.match(key('./')))));return;}
 const isAudio=/\/assets\/.*\.(mp3|wav)$/.test(u.pathname);
 if(isAudio||/\/(assets\/fonts|icons|splash)\//.test(u.pathname)||u.pathname.endsWith('manifest.webmanifest')){
  e.respondWith(caches.match(key(r.url)).then(m=>m||fetch(r).then(res=>{if(res.status===200){const cl=res.clone();caches.open(isAudio?AUDIO:SHELL).then(c=>c.put(key(r.url),cl));}return res;})));}
});
