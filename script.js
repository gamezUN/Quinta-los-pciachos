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
