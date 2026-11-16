/* Service worker de Quinta Los Picachos
   - Guarda copia de los archivos del propio sitio para abrir más rápido y sin conexión.
   - Siempre intenta primero la red, así los cambios se ven en cuanto se publican.
   - No guarda nada de terceros (Google Maps, tipografías) ni datos personales. */

const VERSION = "lp-v1";
const BASE = [
    "./",
    "index.html",
    "styles.css",
    "script.js",
    "manifest.webmanifest",
    "assets/hero.webp",
    "assets/icons/icon-192.png"
];

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(VERSION)
            .then(function (c) { return c.addAll(BASE); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys()
            .then(function (claves) {
                return Promise.all(claves.filter(function (k) { return k !== VERSION; })
                    .map(function (k) { return caches.delete(k); }));
            })
            .then(function () { return self.clients.claim(); })
    );
});

self.addEventListener("fetch", function (e) {
    const req = e.request;
    const url = new URL(req.url);

    // Solo archivos del propio sitio y solo lectura
    if (req.method !== "GET" || url.origin !== self.location.origin) return;

    e.respondWith(
        fetch(req)
            .then(function (resp) {
                if (resp && resp.ok) {
                    const copia = resp.clone();
                    caches.open(VERSION).then(function (c) { c.put(req, copia); });
                }
                return resp;
            })
            .catch(function () {
                return caches.match(req).then(function (hit) {
                    return hit || caches.match("index.html");
                });
            })
    );
});
