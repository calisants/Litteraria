// Service worker do Mots & Parole: guarda o app no aparelho para funcionar sem internet.
// Ao publicar uma versão nova do index.html, troque o número em CACHE (v6 -> v7, e APP_VERSION no index.html).
const CACHE = "mots-parole-v20"; // só o cache muda; a chave do LocalStorage (APP_VERSION) segue v6 para não apagar o progresso
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./fonts/atkinson-hyperlegible-latin-400-normal.woff2",
  "./fonts/atkinson-hyperlegible-latin-700-normal.woff2",
  "./fonts/newsreader-latin-500-normal.woff2",
  "./fonts/newsreader-latin-600-normal.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rede primeiro (a versão nova aparece logo que há internet); sem internet ou com rede lenta, usa o que está guardado.
function networkFirst(req, fallbackUrl) {
  return caches.open(CACHE).then((cache) => {
    const net = fetch(req).then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    });
    const slow = new Promise((_, rej) => setTimeout(() => rej(new Error("lento")), 3500));
    return Promise.race([net, slow]).catch(() =>
      cache.match(req, { ignoreSearch: true }).then((hit) =>
        hit || (fallbackUrl ? cache.match(fallbackUrl) : null) || net
      )
    );
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Arquivos do próprio app. Se abrir a página sem estar guardada, cai no index.html.
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req, req.mode === "navigate" ? "./index.html" : null));
    return;
  }

  // Fontes do Google: guarda depois da primeira vez para o visual ficar igual offline.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req).then((hit) => {
          const update = fetch(req)
            .then((res) => {
              cache.put(req, res.clone());
              return res;
            })
            .catch(() => hit);
          return hit || update;
        })
      )
    );
  }
});
