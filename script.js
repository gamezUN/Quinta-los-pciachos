/* =========================================================
   Quinta Los Picachos · app informativa
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURACIÓN
   Deja un enlace vacío ("") y su botón NO se muestra.
   Cuando tengas los datos, pégalos aquí y aparecen solos:
   - instagram / facebook: la dirección completa del perfil
   - whatsapp: solo números con lada (52 + 10 dígitos), de un número
     de negocio. Ejemplo: "528112345678"
   --------------------------------------------------------- */
const CONFIG = {
    instagram: "",
    facebook: "https://www.facebook.com/p/Quinta-Los-Picachos-La-Huasteca-100065184687059/",
    whatsapp: "",
    whatsappMensaje: "Hola, quiero información sobre Quinta Los Picachos.",

    /* Seguidores que se muestran en la página (suma de las redes de la quinta). */
    seguidores: 7500,

    /* Aviso editable en la parte de arriba (temporada de lluvias, cierres, etc.).
       Pon activo: true y escribe el texto; con activo: false no se muestra.
       tipo: "info" (azul) o "alerta" (ámbar). */
    aviso: {
        activo: false,
        texto: "",
        tipo: "info"
    },

    /* Mapa y ruta. Puedes poner un nombre de lugar o coordenadas "lat,lng".
       Si el pin no cae exacto, pega aquí las coordenadas de la entrada de la quinta. */
    mapa: {
        destino: "Quinta Los Picachos, La Huasteca, Santa Catarina, Nuevo León",
        origen: "Entrada Parque Ecológico La Huasteca, Santa Catarina, Nuevo León"
    },

    /* Datos del responsable para el Aviso de privacidad.
       Si se dejan vacíos, el aviso usa un texto general.
       Lo ideal es poner el nombre o razón social, el domicilio y un medio de contacto. */
    legal: {
        responsable: "",
        domicilio: "",
        contacto: ""
    }
};

/* Horario (minutos desde las 00:00, hora de Monterrey) */
const ZONA = "America/Mexico_City";
const HORARIO = {
    abre: 10 * 60,            // 10:00 a.m.
    albercasCierran: 19 * 60 + 30, // 7:30 p.m.
    cierra: 20 * 60           // 8:00 p.m.
};

const VISTAS = ["inicio", "info", "fotos", "eventos", "mapa"];
const LEGALES = ["privacidad", "cookies", "terminos"];

/* Fotos (cat: albercas | palapas | verdes) */
const FOTOS = [
    { src: "assets/galeria-11.webp", alt: "Alberca con toboganes y montañas al fondo", cat: "albercas" },
    { src: "assets/galeria-09.webp", alt: "Alberca con palapa", cat: "albercas" },
    { src: "assets/galeria-08.webp", alt: "Palapa con asador bajo un árbol", cat: "palapas" },
    { src: "assets/galeria-10.webp", alt: "Palmeras, alberca y montañas vistas desde arriba", cat: "albercas" },
    { src: "assets/galeria-06.webp", alt: "Área techada con asador", cat: "palapas" },
    { src: "assets/galeria-03.webp", alt: "Jardín con árboles, mesas y asador", cat: "verdes" },
    { src: "assets/galeria-01.webp", alt: "Jardín con palapa al fondo", cat: "palapas" },
    { src: "assets/galeria-05.webp", alt: "Sillas blancas bajo un árbol", cat: "verdes" },
    { src: "assets/galeria-04.webp", alt: "Jardín con mesas y palapa", cat: "palapas" },
    { src: "assets/galeria-02.webp", alt: "Áreas verdes y estacionamiento", cat: "verdes" },
    { src: "assets/galeria-07.webp", alt: "Cabañas y jardín con palmeras", cat: "verdes" }
];

(function () {
    "use strict";

    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* =====================================================
       HORARIO EN VIVO
       ===================================================== */
    function minutosAhora() {
        const partes = new Intl.DateTimeFormat("es-MX", {
            timeZone: ZONA, hour: "numeric", minute: "numeric", hourCycle: "h23"
        }).formatToParts(new Date());
        const h = Number(partes.find(p => p.type === "hour").value);
        const m = Number(partes.find(p => p.type === "minute").value);
        return h * 60 + m;
    }

    function duracion(min) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h && m) return h + " h " + m + " min";
        if (h) return h + " h";
        return m + " min";
    }

    function calcularEstado() {
        const n = minutosAhora();

        if (n < HORARIO.abre) {
            return {
                estado: "cerrado", pill: "Cerrado",
                titulo: "Cerrado por ahora",
                sub: "Abrimos hoy a las 10:00 a.m. · en " + duracion(HORARIO.abre - n),
                n: n
            };
        }
        if (n < HORARIO.albercasCierran) {
            return {
                estado: "abierto", pill: "Abierto ahora",
                titulo: "Abierto ahora",
                sub: "Albercas hasta las 7:30 p.m. · quedan " + duracion(HORARIO.albercasCierran - n),
                n: n
            };
        }
        if (n < HORARIO.cierra) {
            return {
                estado: "parcial", pill: "Albercas cerradas",
                titulo: "Abierto · albercas cerradas",
                sub: "La quinta cierra a las 8:00 p.m. · en " + duracion(HORARIO.cierra - n),
                n: n
            };
        }
        return {
            estado: "cerrado", pill: "Cerrado",
            titulo: "Cerrado por hoy",
            sub: "Abrimos mañana a las 10:00 a.m.",
            n: n
        };
    }

    function actualizarHorario() {
        const e = calcularEstado();

        ["statusPill", "statusCard"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.dataset.state = e.estado;
        });

        const set = (id, texto) => { const el = document.getElementById(id); if (el) el.textContent = texto; };
        set("statusPillText", e.pill);
        set("statusTitle", e.titulo);
        set("statusSub", e.sub);

        // Línea del día
        const fill = document.getElementById("dayFill");
        const now = document.getElementById("dayNow");
        if (fill && now) {
            const total = HORARIO.cierra - HORARIO.abre;
            const pct = Math.max(0, Math.min(1, (e.n - HORARIO.abre) / total)) * 100;
            fill.style.width = pct + "%";
            now.style.left = pct + "%";
            now.classList.toggle("on", e.n >= HORARIO.abre && e.n <= HORARIO.cierra);
        }
    }

    /* =====================================================
       NAVEGACIÓN ENTRE VISTAS (menú inferior)
       ===================================================== */
    const tabbar = document.getElementById("tabbar");

    function ir(nombre) {
        if (!VISTAS.includes(nombre) && !LEGALES.includes(nombre)) nombre = "inicio";
        const esLegal = LEGALES.includes(nombre);

        $$(".view").forEach(v => v.classList.toggle("active", v.dataset.view === nombre));

        $$(".tab").forEach(t => {
            if (t.dataset.tab === nombre) t.setAttribute("aria-current", "page");
            else t.removeAttribute("aria-current");
        });

        tabbar.classList.toggle("sin-activa", esLegal);
        if (!esLegal) tabbar.style.setProperty("--i", VISTAS.indexOf(nombre));
        window.scrollTo({ top: 0, behavior: "instant" });
        observarAparicion();
        parallax();
    }

    function desdeHash() {
        ir(location.hash.replace("#", "") || "inicio");
    }

    window.addEventListener("hashchange", desdeHash);

    /* =====================================================
       APARECER AL HACER SCROLL + CONTADORES
       ===================================================== */
    let observador = null;

    function formatear(n, sep) {
        return sep ? n.toLocaleString("es-MX") : String(n);
    }

    function contar(el) {
        const meta = Number(el.dataset.count);
        const sep = !!el.dataset.sep;
        if (sinMovimiento) { el.textContent = formatear(meta, sep); return; }

        const dur = 1400;
        const t0 = performance.now();
        el.textContent = formatear(0, sep);

        function paso(t) {
            const p = Math.min(1, (t - t0) / dur);
            const suave = 1 - Math.pow(1 - p, 3);
            el.textContent = formatear(Math.round(meta * suave), sep);
            if (p < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
    }

    function observarAparicion() {
        if (!("IntersectionObserver" in window)) {
            $$(".reveal").forEach(el => el.classList.add("in"));
            return;
        }
        if (!observador) {
            observador = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;
                    const el = entrada.target;
                    el.classList.add("in");
                    $$("[data-count]", el).forEach(contar);
                    observador.unobserve(el);
                });
            }, { threshold: 0.15 });
        }
        $$(".view.active .reveal:not(.in)").forEach(el => observador.observe(el));
    }

    /* Efecto de profundidad en la portada */
    const heroMedia = document.getElementById("heroMedia");
    let esperando = false;

    function parallax() {
        if (!heroMedia || sinMovimiento) return;
        const y = Math.min(window.scrollY, 700);
        heroMedia.style.transform = "translate3d(0," + (y * 0.25) + "px,0)";
    }

    window.addEventListener("scroll", function () {
        if (esperando) return;
        esperando = true;
        requestAnimationFrame(function () { parallax(); esperando = false; });
    }, { passive: true });

    /* =====================================================
       GALERÍA + VISOR
       ===================================================== */
    const grid = document.getElementById("gallery");
    const strip = document.getElementById("strip");
    const filtros = document.getElementById("filters");
    let visibles = FOTOS.slice();

    function renderGaleria(filtro) {
        visibles = filtro === "todas" ? FOTOS.slice() : FOTOS.filter(f => f.cat === filtro);
        grid.innerHTML = "";
        visibles.forEach(function (foto, i) {
            const b = document.createElement("button");
            b.className = "gallery__item";
            b.style.setProperty("--n", i);
            b.innerHTML = '<img src="' + foto.src + '" alt="' + foto.alt + '" loading="lazy"><span>' + foto.alt + "</span>";
            b.addEventListener("click", function () { abrirVisor(visibles, i); });
            grid.appendChild(b);
        });
    }

    function renderTira() {
        FOTOS.slice(0, 7).forEach(function (foto, i) {
            const b = document.createElement("button");
            b.setAttribute("aria-label", "Ver foto: " + foto.alt);
            b.innerHTML = '<img src="' + foto.src + '" alt="' + foto.alt + '" loading="lazy">';
            b.addEventListener("click", function () { abrirVisor(FOTOS, i); });
            strip.appendChild(b);
        });
    }

    if (filtros) {
        filtros.addEventListener("click", function (e) {
            const chip = e.target.closest(".chip");
            if (!chip) return;
            $$(".chip", filtros).forEach(c => c.classList.toggle("active", c === chip));
            renderGaleria(chip.dataset.filter);
        });
    }

    /* Visor */
    const visor = document.getElementById("lightbox");
    const visorFig = document.getElementById("lbFig");
    const visorImg = document.getElementById("lbImg");
    const visorTexto = document.getElementById("lbCaption");
    const visorConteo = document.getElementById("lbCount");
    let lista = [];
    let actual = 0;

    function mostrarFoto(i, haciaAtras) {
        actual = (i + lista.length) % lista.length;
        const foto = lista[actual];

        visorFig.classList.toggle("izq", !!haciaAtras);
        // reiniciar la animación
        visorImg.style.animation = "none";
        void visorImg.offsetWidth;
        visorImg.style.animation = "";

        visorImg.src = foto.src;
        visorImg.alt = foto.alt;
        visorTexto.textContent = foto.alt;
        visorConteo.textContent = (actual + 1) + " / " + lista.length;

        // precargar la siguiente
        new Image().src = lista[(actual + 1) % lista.length].src;
    }

    function abrirVisor(fotos, i) {
        lista = fotos;
        mostrarFoto(i);
        visor.hidden = false;
        document.body.style.overflow = "hidden";
        document.getElementById("lbClose").focus();
    }

    function cerrarVisor() {
        visor.hidden = true;
        visorImg.src = "";
        document.body.style.overflow = "";
    }

    document.getElementById("lbClose").addEventListener("click", cerrarVisor);
    document.getElementById("lbPrev").addEventListener("click", function () { mostrarFoto(actual - 1, true); });
    document.getElementById("lbNext").addEventListener("click", function () { mostrarFoto(actual + 1); });

    visor.addEventListener("click", function (e) {
        if (e.target === visor) cerrarVisor();
    });

    document.addEventListener("keydown", function (e) {
        if (visor.hidden) return;
        if (e.key === "Escape") cerrarVisor();
        if (e.key === "ArrowLeft") mostrarFoto(actual - 1, true);
        if (e.key === "ArrowRight") mostrarFoto(actual + 1);
    });

    /* Deslizar con el dedo */
    let inicioX = null;
    visor.addEventListener("touchstart", function (e) { inicioX = e.touches[0].clientX; }, { passive: true });
    visor.addEventListener("touchend", function (e) {
        if (inicioX === null) return;
        const dx = e.changedTouches[0].clientX - inicioX;
        inicioX = null;
        if (Math.abs(dx) < 50) return;
        if (dx < 0) mostrarFoto(actual + 1);
        else mostrarFoto(actual - 1, true);
    }, { passive: true });

    /* =====================================================
       ENLACES OPCIONALES (redes / contacto)
       ===================================================== */
    function configurarEnlaces() {
        let hayAlguno = false;

        $$("[data-link]").forEach(function (el) {
            const tipo = el.dataset.link;
            const valor = (CONFIG[tipo] || "").trim();

            if (!valor) { el.hidden = true; return; }

            el.href = tipo === "whatsapp"
                ? "https://wa.me/" + valor.replace(/\D/g, "") + "?text=" + encodeURIComponent(CONFIG.whatsappMensaje)
                : valor;
            el.target = "_blank";
            el.rel = "noopener";
            el.hidden = false;
            hayAlguno = true;
        });

        // Ocultar paneles de redes si no hay ningún enlace
        $$("[data-hide-if-empty]").forEach(function (panel) {
            const visibles = $$("[data-link]", panel).filter(a => !a.hidden);
            panel.hidden = visibles.length === 0;
        });

        // Texto alternativo cuando no hay ningún medio de contacto configurado
        $$("[data-no-links]").forEach(function (p) {
            p.hidden = hayAlguno;
        });
    }

    /* =====================================================
       DATOS DEL RESPONSABLE (aviso de privacidad)
       ===================================================== */
    function configurarLegal() {
        $$("[data-legal]").forEach(function (el) {
            const valor = ((CONFIG.legal || {})[el.dataset.legal] || "").trim();
            if (valor) el.textContent = valor;
        });
    }

    /* =====================================================
       MAPA: se carga solo cuando la persona lo pide
       ===================================================== */
    function urlMapa(modo) {
        const m = CONFIG.mapa;
        const destino = encodeURIComponent(m.destino);
        const origen = encodeURIComponent(m.origen);
        if (modo === "satelite") return "https://www.google.com/maps?q=" + destino + "&t=h&output=embed";
        if (modo === "ruta") return "https://maps.google.com/maps?saddr=" + origen + "&daddr=" + destino + "&output=embed";
        return "https://www.google.com/maps?q=" + destino + "&output=embed";
    }

    function configurarMapa() {
        const m = CONFIG.mapa;

        // Botones que abren Google Maps (la ruta se abre ya trazada, en la app si está instalada)
        $$("[data-maps]").forEach(function (a) {
            a.href = a.dataset.maps === "ruta"
                ? "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(m.origen) +
                  "&destination=" + encodeURIComponent(m.destino) + "&travelmode=driving"
                : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(m.destino);
        });

        const contenedor = document.getElementById("map");
        const boton = document.getElementById("mapLoad");
        const modos = document.getElementById("mapModes");
        if (!contenedor || !boton) return;

        function cargar(modo) {
            let marco = contenedor.querySelector("iframe");
            if (!marco) {
                marco = document.createElement("iframe");
                marco.title = "Mapa de Quinta Los Picachos";
                marco.referrerPolicy = "no-referrer-when-downgrade";
                marco.allowFullscreen = true;
                contenedor.innerHTML = "";
                contenedor.appendChild(marco);
            }
            marco.src = urlMapa(modo);
        }

        // El mapa de Google solo se carga cuando la persona lo pide
        boton.addEventListener("click", function () {
            cargar("mapa");
            if (modos) modos.hidden = false;
        });

        if (modos) {
            modos.addEventListener("click", function (e) {
                const chip = e.target.closest(".chip");
                if (!chip) return;
                $$(".chip", modos).forEach(c => c.classList.toggle("active", c === chip));
                cargar(chip.dataset.modo);
            });
        }
    }

    /* =====================================================
       SEGUIDORES, AVISO, COMPARTIR E INSTALAR
       ===================================================== */
    function configurarSeguidores() {
        const n = Number(CONFIG.seguidores) || 0;
        $$("[data-seguidores]").forEach(function (el) {
            el.dataset.count = n;
            el.textContent = n.toLocaleString("es-MX");
        });
    }

    function configurarAviso() {
        const a = CONFIG.aviso || {};
        const el = document.getElementById("aviso");
        if (!el || !a.activo || !String(a.texto || "").trim()) return;
        el.textContent = a.texto;
        el.dataset.tipo = a.tipo === "alerta" ? "alerta" : "info";
        el.hidden = false;
    }

    function aviso(texto) {
        let t = document.getElementById("toast");
        if (!t) {
            t = document.createElement("div");
            t.id = "toast";
            t.className = "toast";
            t.setAttribute("role", "status");
            document.body.appendChild(t);
        }
        t.textContent = texto;
        t.classList.add("on");
        clearTimeout(t._h);
        t._h = setTimeout(function () { t.classList.remove("on"); }, 2600);
    }

    function configurarCompartir() {
        const compartir = document.getElementById("shareBtn");
        const instalar = document.getElementById("installBtn");
        const pistaIOS = document.getElementById("iosHint");
        const instalada = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;

        if (compartir) {
            compartir.addEventListener("click", async function () {
                const url = location.href.split("#")[0];
                try {
                    if (navigator.share) {
                        await navigator.share({
                            title: "Quinta Los Picachos · La Huasteca",
                            text: "Horarios, reglamento y fotos de Quinta Los Picachos.",
                            url: url
                        });
                        return;
                    }
                } catch (e) {
                    if (e && e.name === "AbortError") return;
                }
                try {
                    await navigator.clipboard.writeText(url);
                    aviso("Enlace copiado");
                } catch (e) {
                    aviso("Copia este enlace: " + url);
                }
            });
        }

        let diferido = null;
        window.addEventListener("beforeinstallprompt", function (e) {
            e.preventDefault();
            diferido = e;
            if (instalar && !instalada) instalar.hidden = false;
        });

        if (instalar) {
            instalar.addEventListener("click", async function () {
                if (!diferido) return;
                diferido.prompt();
                await diferido.userChoice;
                diferido = null;
                instalar.hidden = true;
            });
        }

        window.addEventListener("appinstalled", function () {
            if (instalar) instalar.hidden = true;
            aviso("App instalada");
        });

        // iPhone y iPad no ofrecen el botón: se muestra la instrucción
        const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        if (pistaIOS && esIOS && !instalada) pistaIOS.hidden = false;
    }

    function registrarSW() {
        if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("sw.js").catch(function () { });
            });
        }
    }

    /* =====================================================
       INICIO
       ===================================================== */
    function iniciar() {
        renderGaleria("todas");
        renderTira();
        configurarEnlaces();
        configurarLegal();
        configurarMapa();
        configurarSeguidores();
        configurarAviso();
        configurarCompartir();
        registrarSW();
        actualizarHorario();
        setInterval(actualizarHorario, 30000);

        if (sinMovimiento) {
            $$("[data-count]").forEach(contar);
        }

        desdeHash();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
