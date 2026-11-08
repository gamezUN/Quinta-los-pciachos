const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(opened));
    menuButton.setAttribute("aria-label", opened ? "Cerrar menú" : "Abrir menú");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
    }
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Cierra el menú móvil si la ventana vuelve a escritorio.
window.addEventListener("resize", () => {
  if (window.innerWidth > 700 && nav && menuButton) {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});


// Solicitud de información de eventos: prepara el mensaje y lo abre en WhatsApp.
const eventForm = document.getElementById("event-form");
if (eventForm) {
  const dateInput = eventForm.elements.fecha;
  if (dateInput) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localToday;
  }
  eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!eventForm.reportValidity()) return;
    const data = new FormData(eventForm);
    const lines = [
      "Hola, quiero solicitar información para un evento en Quinta Los Picachos.",
      "",
      "*Nombre:* " + data.get("nombre"),
      "*Teléfono:* " + data.get("telefono"),
      "*Correo:* " + data.get("correo"),
      "*Fecha deseada:* " + data.get("fecha"),
      "*Tipo de evento:* " + data.get("tipo"),
      "*Duración:* " + data.get("horas"),
      "*Número de personas:* " + data.get("personas"),
      "*Detalles adicionales:* " + (data.get("detalles") || "No especificados"),
      "",
      "Entiendo que esta es una solicitud de información y que la fecha queda pendiente de confirmación."
    ];
    const whatsappUrl = "https://wa.me/528182572088?text=" + encodeURIComponent(lines.join("\n"));
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}
