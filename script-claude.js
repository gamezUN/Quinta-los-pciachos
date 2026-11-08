/* =========================================================
   Quinta Los Picachos
   ========================================================= */

// Número de WhatsApp de la quinta: código de país (52) + 10 dígitos, sin espacios ni signos.
// ⚠️ Confirma con el dueño que este número tiene WhatsApp.
const WHATSAPP = "528182572088";

(function () {
    "use strict";

    function waLink(texto) {
        return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
    }

    function iniciar() {
        /* ---------- Menú móvil ---------- */
        const menuBtn = document.getElementById("menuBtn");
        const nav = document.getElementById("nav");

        if (menuBtn && nav) {
            menuBtn.addEventListener("click", function () {
                const abierto = nav.classList.toggle("open");
                menuBtn.setAttribute("aria-expanded", String(abierto));
            });

            nav.querySelectorAll("a").forEach(function (enlace) {
                enlace.addEventListener("click", function () {
                    nav.classList.remove("open");
                    menuBtn.setAttribute("aria-expanded", "false");
                });
            });
        }

        /* ---------- Botones de WhatsApp (data-wa="mensaje") ---------- */
        document.querySelectorAll("[data-wa]").forEach(function (el) {
            el.href = waLink(el.dataset.wa);
            el.target = "_blank";
            el.rel = "noopener";
        });

        /* ---------- Galería con visor ---------- */
        const items = Array.from(document.querySelectorAll(".gallery__item"));
        const lightbox = document.getElementById("lightbox");
        const lbImg = document.getElementById("lbImg");
        const lbCaption = document.getElementById("lbCaption");
        let actual = 0;

        function mostrar(i) {
            actual = (i + items.length) % items.length;
            const img = items[actual].querySelector("img");
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lbCaption.textContent = img.alt;
        }

        function abrir(i) {
            mostrar(i);
            lightbox.hidden = false;
            document.body.style.overflow = "hidden";
        }

        function cerrar() {
            lightbox.hidden = true;
            lbImg.src = "";
            document.body.style.overflow = "";
        }

        if (items.length && lightbox) {
            items.forEach(function (item, i) {
                item.addEventListener("click", function () { abrir(i); });
            });

            document.getElementById("lbClose").addEventListener("click", cerrar);
            document.getElementById("lbPrev").addEventListener("click", function () { mostrar(actual - 1); });
            document.getElementById("lbNext").addEventListener("click", function () { mostrar(actual + 1); });

            lightbox.addEventListener("click", function (e) {
                if (e.target === lightbox) cerrar();
            });

            document.addEventListener("keydown", function (e) {
                if (lightbox.hidden) return;
                if (e.key === "Escape") cerrar();
                if (e.key === "ArrowLeft") mostrar(actual - 1);
                if (e.key === "ArrowRight") mostrar(actual + 1);
            });
        }

        /* ---------- Formulario de eventos → WhatsApp ---------- */
        const form = document.getElementById("eventoForm");
        const errorBox = document.getElementById("formError");
        const fecha = document.getElementById("fecha");

        if (fecha) {
            // No permitir fechas pasadas
            const hoy = new Date();
            hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
            fecha.min = hoy.toISOString().split("T")[0];
        }

        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                const campos = ["nombre", "fecha", "personas", "tipo"];
                let hayError = false;

                campos.forEach(function (id) {
                    const campo = document.getElementById(id);
                    const vacio = !campo.value.trim();
                    campo.classList.toggle("invalid", vacio);
                    if (vacio) hayError = true;
                });

                const personas = Number(document.getElementById("personas").value);
                if (!hayError && personas < 1) {
                    document.getElementById("personas").classList.add("invalid");
                    hayError = true;
                }

                if (hayError) {
                    errorBox.textContent = "Revisa los campos marcados: nombre, fecha, tipo de evento y número de personas son obligatorios.";
                    errorBox.hidden = false;
                    return;
                }

                errorBox.hidden = true;

                const val = function (id) { return document.getElementById(id).value.trim(); };

                // Fecha de aaaa-mm-dd a dd/mm/aaaa
                const [a, m, d] = val("fecha").split("-");

                let mensaje =
                    "Hola, quiero información para un evento en Quinta Los Picachos.\n\n" +
                    "Nombre: " + val("nombre") + "\n" +
                    "Tipo de evento: " + val("tipo") + "\n" +
                    "Fecha deseada: " + d + "/" + m + "/" + a + "\n" +
                    "Personas: " + val("personas") + "\n" +
                    "Horas: " + val("horas");

                if (val("detalles")) {
                    mensaje += "\nDetalles: " + val("detalles");
                }

                window.open(waLink(mensaje), "_blank", "noopener");
            });

            form.addEventListener("input", function (e) {
                e.target.classList.remove("invalid");
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
