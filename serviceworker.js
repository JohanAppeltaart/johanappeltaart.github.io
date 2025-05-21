const cacheName = "v1"
// This code executes in its own worker or thread
self.addEventListener("install", (event) => {
  console.log(`Service worker installed  ${event}`);

  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("caching files");
        cache.addAll(["index.html", "x-l.js", "x-l.css", "manifest.json", "favicon.ico"]);
      })
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
  // remove unwanted caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map(cache=> {
                if(cache != cacheName){
                    console.log("SW Clearing old cache")
                    return caches.delete(cache)
                }
            })
        )
        }
    )
  )
});


self.addEventListener("fetch", (event)=>{
    console.log("fetching", event)
    event.respondWith(
        fetch(event.request).catch(()=> caches.match(event.request))
    )
})