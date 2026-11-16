# Quinta Los Picachos — sitio web

Página informativa para celular (también funciona en escritorio), hecha con HTML, CSS y JavaScript, lista para GitHub Pages.

## Estructura
- `index.html`: contenido. Cinco vistas con menú inferior: Inicio, Info, Fotos, Eventos y Mapa.
- `styles.css`: diseño.
- `script.js`: menú, estado "Abierto ahora" en vivo, galería con visor y botones de redes.
- `manifest.webmanifest`, `sw.js` y `assets/icons/`: permiten instalar la página como app y abrirla sin conexión.
- `robots.txt` y `sitemap.xml`: para Google.
- `assets/`: fotos (`hero.webp` y `galeria-01.webp` a `galeria-11.webp`).

## Qué se actualiza aquí
- **Horario:** en `script.js`, constante `HORARIO` (hoy: 10:00 a 20:00, albercas hasta 19:30). El texto de las tarjetas está en `index.html`.
- **Todo lo editable está en `CONFIG`, al inicio de `script.js`:**
  - `instagram`, `facebook`, `whatsapp`: si un enlace está vacío, su botón no se muestra.
  - `seguidores`: número que se muestra en la página.
  - `aviso`: banner de arriba (lluvias, cierres). `activo: true` y el texto.
  - `mapa`: destino y origen de la ruta (nombre de lugar o coordenadas `lat,lng`).
  - `legal`: nombre o razón social, domicilio y contacto del aviso de privacidad.
- **Fotos:** lista `FOTOS` en `script.js` (cada foto tiene su categoría para los filtros).

## Notas
- La página no enlaza a ningún WhatsApp ni teléfono personal.
- La versión anterior de la página está en la rama `original`.
