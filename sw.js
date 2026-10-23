// Service worker do Litteraria: guarda o app no aparelho para funcionar sem internet.
// Ao publicar uma versão nova do index.html, troque o número em CACHE (v6 -> v7, e APP_VERSION no index.html).
const CACHE = "mots-parole-v95"; // só o cache muda; a chave do LocalStorage (APP_VERSION) segue v6 para não apagar o progresso
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./books/alice.js",
  "./books/peter.js",
  "./books/frank.js",
  "./books/principe.js",
  "./books/perrault.js",
  "./books/grimm.js",
  "./books/racconti.js",
  "./books/sherlock.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./icons/alice-192.png",
  "./icons/alice-512.png",
  "./icons/alice-maskable-512.png",
  "./icons/pp-192.png",
  "./icons/pp-512.png",
  "./icons/pp-maskable-512.png",
  "./icons/frank-192.png",
  "./icons/frank-512.png",
  "./icons/frank-maskable-512.png",
  "./icons/soft-192.png",
  "./icons/soft-512.png",
  "./icons/soft-maskable-512.png",
  "./icons/dante-192.png",
  "./icons/dante-512.png",
  "./icons/dante-maskable-512.png",
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
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== "mp-state").map((k) => caches.delete(k))))
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

  // Manifesto: o ícone escolhido em Ajustes (guardado em "mp-state") troca os ícones do manifesto.
  if (url.origin === self.location.origin && url.pathname.endsWith("/manifest.webmanifest")) {
    event.respondWith(manifestComIcone(req));
    return;
  }

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

// ---------- Ícone escolhido, lembretes e atalhos (v1.39) ----------
const ICON_OK = /^[a-z]{1,12}$/;
async function lerEstado() {
  try {
    const c = await caches.open("mp-state");
    const r = await c.match("state.json");
    return r ? await r.json() : null;
  } catch (_) { return null; }
}
async function manifestComIcone(req) {
  let base = null;
  try { const r = await fetch(req); base = await r.json(); }
  catch (_) {
    try { const c = await caches.open(CACHE); const hit = await c.match("./manifest.webmanifest"); base = hit ? await hit.json() : null; } catch (__) {}
  }
  if (!base) return fetch(req);
  const st = await lerEstado();
  const ic = st && ICON_OK.test(st.ic || "") ? st.ic : "padrao";
  if (ic !== "padrao") {
    base.icons = [
      { src: "icons/" + ic + "-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "icons/" + ic + "-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "icons/" + ic + "-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ];
  }
  return new Response(JSON.stringify(base), { headers: { "content-type": "application/manifest+json" } });
}
function hoje() {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
// O navegador acorda o service worker (sincronização periódica, só Chrome/Edge com o app instalado; o horário exato é dele).
async function lembrete() {
  const st = await lerEstado();
  if (!st || !st.on || st.push) return;
  if (!self.Notification || self.Notification.permission !== "granted") return;
  const now = new Date(), dia = hoje();
  if (now.getHours() < st.h || st.last === dia || st.notified === dia) return;
  let title, body;
  if (st.st === "calma") { title = "Litteraria"; body = "Quando puder, uma lição curta de " + (st.ln || "idiomas") + "."; }
  else if (st.st === "cartao" && st.cards && (st.cards[dia] || st.cards[Object.keys(st.cards)[0]])) {
    const c = st.cards[dia] || st.cards[Object.keys(st.cards)[0]];
    title = c.k; body = c.t + (c.s ? "\n" + c.s : "");
  } else {
    title = "📚 " + (st.name ? st.name + ", " : "") + "hora de brincar com as palavras!";
    const ontem = new Date(now.getTime() - 864e5), p = (n) => String(n).padStart(2, "0");
    const viva = st.gam && st.streak > 0 && st.last === ontem.getFullYear() + "-" + p(ontem.getMonth() + 1) + "-" + p(ontem.getDate());
    body = viva ? "Sua sequência de " + st.streak + (st.streak === 1 ? " dia" : " dias") + " está esperando. 5 minutos salvam o dia!" : "Que tal 5 minutos de " + (st.ln || "idiomas") + "? Uma lição curta já vale.";
  }
  await self.registration.showNotification(title, {
    body, icon: "icon-192.png", badge: "icon-192.png", vibrate: [120, 60, 120, 60, 220], tag: "mp-lembrete", renotify: true,
    data: { go: "hoje" }, actions: [{ action: "hoje", title: "Fazer agora" }, { action: "depois", title: "Depois" }]
  });
  st.notified = dia;
  try { const c = await caches.open("mp-state"); await c.put("state.json", new Response(JSON.stringify(st), { headers: { "content-type": "application/json" } })); } catch (_) {}
}
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "mp-lembrete") event.waitUntil(lembrete());
});
// Notificação enviada pelo servidor (Web Push). No iPhone toda mensagem precisa mostrar uma notificação.
self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (_) {}
  const go = d.go === "cartao" ? "cartao" : "hoje";
  event.waitUntil(self.registration.showNotification(String(d.t || "Litteraria").slice(0, 80), {
    body: String(d.b || "Uma lição curta de hoje?").slice(0, 200), icon: "icon-192.png", badge: "icon-192.png",
    vibrate: [120, 60, 120, 60, 220], tag: "mp-lembrete", renotify: true, data: { go },
    actions: [{ action: "hoje", title: "Fazer agora" }, { action: "depois", title: "Depois" }]
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "depois") return;
  const alvo = (event.notification.data && event.notification.data.go) === "cartao" ? "cartao" : "hoje";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const c of cs) {
        if ("focus" in c) { c.postMessage({ t: "go", go: alvo }); return c.focus(); }
      }
      return self.clients.openWindow("./?go=" + alvo);
    })
  );
});
