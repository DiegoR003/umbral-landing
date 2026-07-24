# UMBRAL — landing de hoteles y servicios turísticos

Landing de una colección de tres casas de reposo en México. El scroll de la
página es un día completo: la paleta del sitio, la escena 3D y la posición del
sol se interpolan entre cinco horas reales, de las 05:40 a las 21:40.

Stack: **React 18 + Vite**, **three.js / @react-three/fiber** para la
atmósfera, **simple-parallax-js** para el parallax de las imágenes, **Lenis +
GSAP ScrollTrigger** para el scroll con inercia.

---

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # compila a dist/
npm run preview  # sirve dist/ en :4173
```

Node 18 o superior.

---

## Estructura

```
├─ index.html                  meta, OG, tipografías
├─ vite.config.js
├─ public/
│  ├─ favicon.svg  og.svg
│  └─ parallax/                8 imágenes SVG (68 kB en total)
└─ src/
   ├─ main.jsx  App.jsx
   ├─ dayCycle.js              ← el motor del ciclo de luz
   ├─ data/
   │  ├─ houses.js             las tres casas
   │  └─ experiences.js        los servicios, ordenados por hora
   ├─ hooks/
   │  ├─ useSmoothScroll.js    Lenis + ScrollTrigger + progreso de página
   │  ├─ useReducedMotion.js
   │  └─ useReveal.js          revelado con IntersectionObserver
   ├─ three/
   │  ├─ Sky.jsx               detecta WebGL y monta el canvas en idle
   │  ├─ SkyCanvas.jsx         aísla todo three.js en su propio chunk
   │  ├─ Scene.jsx             cielo, sol, crestas y niebla
   │  └─ geometry.js           siluetas de sierra procedurales
   ├─ components/
   │  ├─ Parallax.jsx          envoltura de simple-parallax-js
   │  ├─ Chrome.jsx            nav, riel de horas, pie
   │  ├─ Hero.jsx  House.jsx  Experiences.jsx  Booking.jsx
   └─ styles/
      ├─ tokens.css            paleta, escala tipográfica, easings
      └─ global.css
```

---

## Cómo funciona el ciclo de luz

`src/dayCycle.js` mantiene un único valor de progreso (0 = 05:40, 1 = 21:40)
que alimenta el scroll. En cada frame interpola la paleta entre las horas
definidas en `HOURS` y escribe el resultado como variables CSS en `:root`.

Vive **fuera de React** a propósito: se actualiza 60 veces por segundo y un
`setState` a esa frecuencia repintaría el árbol entero. La escena 3D lee los
mismos colores desde ahí, así que canvas y DOM nunca se desincronizan.

La interpolación es en espacio lineal, no en sRGB. Cruzar dos colores en sRGB
pasa por un gris lodoso en el punto medio; en lineal el cambio de luz se ve
como luz.

**Para cambiar las horas o los colores**, edita el arreglo `HOURS`. Cada parada
lleva `at` (posición en el scroll, 0..1), los colores del DOM (`bg`, `fg`,
`accent`), los de la escena (`skyTop`, `skyLow`, `ridge`, `sun`), la altura del
sol (`sunY`, de -0.5 a 0.5) y la densidad de niebla (`haze`, 0..1).

> Ningún componente escribe un color a mano. Todo se deriva de `--bg`, `--fg` y
> `--accent` con `color-mix()`. Si agregas una sección, usa esos tokens o se
> romperá cuando la página amanezca.

---

## Reemplazar las imágenes por fotografía

Las ocho imágenes de `public/parallax/` son ilustraciones duotono generadas
proceduralmente, en la paleta de la marca. Son placeholders art-directed: la
página se ve terminada sin fotos, pero están hechas para reemplazarse.

1. Sustituye los archivos en `public/parallax/` (mismo nombre, o actualiza la
   ruta en `src/data/houses.js` y `src/data/experiences.js`).
2. Usa retrato, mínimo 1400 px de ancho. El marco recorta a `4/5` en las casas
   y a `3/4` en las experiencias, y simple-parallax escala un 22–30% más, así
   que deja aire arriba y abajo del sujeto.
3. Actualiza el `alt`. Está en los mismos archivos de datos, junto a la imagen.

Formato recomendado: AVIF o WebP. Presupuesto: menos de 250 kB por imagen.

---

## Parallax

`src/components/Parallax.jsx` envuelve simple-parallax-js. Tres decisiones que
conviene conocer antes de tocarlo:

- La librería se importa con `import()` diferido. Si falla, o si el usuario
  pidió menos movimiento, la imagen se queda quieta y la página sigue intacta.
  El parallax nunca es requisito para ver el contenido.
- Se inicializa en el evento `load` de la imagen, porque la librería necesita
  las dimensiones reales para calcular el desplazamiento.
- **simple-parallax envuelve tu `<img>` en un `div.simpleParallax` propio.** Ese
  wrapper hereda alto automático y colapsa a cero dentro de un marco con
  `aspect-ratio`. Por eso `global.css` lo fuerza a llenar el marco. Si agregas
  un marco nuevo, añade su selector ahí o la imagen desaparecerá.

Props útiles: `scale` (1.2–1.35 se ve bien; más se nota falso), `delay`,
`orientation`.

---

## Rendimiento y accesibilidad

El bundle inicial es de ~101 kB gzip. Todo three.js (222 kB gzip) vive en un
chunk aparte que se descarga en `requestIdleCallback`, ya pasado el primer
render: el canvas nunca compite con el LCP.

- Sin WebGL, `.sky__fallback` deja un degradado CSS que **sigue cambiando de
  hora con el scroll**, porque usa las mismas variables.
- En equipos de gama baja (≤4 núcleos o móvil) el DPR baja a 1.25 y se apaga el
  antialiasing.
- La escena son ~10 draw calls: cinco crestas, tres capas de niebla, el cielo y
  el sol. No hay modelos ni texturas que cargar.
- `prefers-reduced-motion`: se apagan Lenis, el parallax y la animación del
  canvas, que pasa a `frameloop="demand"`. Aun así se repinta al hacer scroll,
  para que la hora del día avance en lugar de congelarse en el frame 0.
- Todo el texto existe en el DOM sin JS. Navegación completa con Tab, foco
  visible, y contraste AA verificado en las cinco horas del ciclo.

---

## Conectar el formulario

`src/components/Booking.jsx` valida y muestra una confirmación local. El punto
de integración está marcado con un comentario en `onSubmit`: ahí va tu POST al
motor de reservas o al CRM.
