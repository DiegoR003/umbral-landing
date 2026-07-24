# FINISTERRA — tours en lancha a El Arco, Cabo San Lucas

Landing de una sola pantalla larga. El fondo es **una sola fotografía real**
de El Arco (Land's End), fija todo el recorrido — no es una imagen gigante
que se recorre, es la misma toma del principio al final, como una ventana
que no se mueve. Lo que avanza con el scroll son los textos: cada parada
cuenta un momento del tour, de la salida en la marina al regreso con la
hora dorada.

Stack: **React 18 + Vite**, **Lenis + GSAP ticker** para el scroll con
inercia, cero librerías de imagen — el efecto es CSS (`position: fixed`)
más un `IntersectionObserver` para el texto.

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
│  ├─ favicon.svg  og.jpg
│  └─ hero/                    la fotografia, en avif/webp/jpg y 3 anchos
└─ src/
   ├─ main.jsx  App.jsx
   ├─ data/
   │  └─ story.js              marca, nav, paradas del recorrido, tour
   ├─ hooks/
   │  ├─ useSmoothScroll.js     Lenis + ticker de GSAP
   │  ├─ useScrollProgress.js   progreso 0..1 entregado por referencia
   │  ├─ useReducedMotion.js
   │  └─ useReveal.js           revelado por parada con IntersectionObserver
   ├─ components/
   │  ├─ StoryHero.jsx          la foto de fondo, fija, con zoom lentisimo
   │  ├─ Nav.jsx  ProgressRail.jsx  Footer.jsx
   │  ├─ StoryStops.jsx         las paradas: kicker + titular + texto
   │  └─ BookingCard.jsx        tarjeta final + formulario de reserva
   └─ styles/
      ├─ tokens.css             paleta fija, escala tipográfica, easings
      └─ global.css
```

---

## Por que una sola foto fija

No hay galería ni carrusel: la foto de El Arco vive en `.story-bg`,
`position: fixed`, detrás de todo (`z-index: 0`), y nunca cambia de
posición ni de recorte. Lo único que se mueve es un *zoom* casi
imperceptible (`scale(1 → 1.08)`) atado al progreso de scroll, para que
el fondo no se sienta muerto — se apaga por completo con
`prefers-reduced-motion`.

El contenido (`.page`, z-index 1) fluye normal por encima: cada parada de
`src/data/story.js` es una sección de `100svh` con el texto anclado abajo
a la izquierda, igual que iría cayendo el ojo si estuvieras de verdad en
la proa de la lancha. El texto se revela con `useReveal` (el mismo
`IntersectionObserver` de la versión anterior del sitio) — nada de scroll
hijacking ni de medir el alto exacto de cada sección a mano.

**Para cambiar el recorrido**, edita el arreglo `stops` en
`src/data/story.js`. Cada parada lleva `kicker`, `title` y `text`. La
primera (`bienvenida`) se muestra sin esperar scroll; el resto se revela
al entrar en viewport.

---

## La fotografía

`public/hero/` son derivados de `public/63.jpg` — una lancha de tour
acercándose a El Arco. **Pendiente: confirmar fuente y licencia** antes
de publicar el sitio; por eso `credit` en `src/data/story.js` está en
`null` y el pie de página no muestra ningún crédito. Si tiene licencia
que exige atribución, complétalo ahí — el componente `Footer.jsx` ya sabe
mostrarlo condicionalmente.

La imagen original es de resolución modesta (670×446, horizontal) y el
recorte a retrato la escala hacia arriba y recorta bastante a los lados
— por eso `object-position` en `.story-bg__img` (`global.css`) está
afinado a mano para dejar la lancha y el arco dentro del encuadre.
Si consigues una version de mayor resolucion del mismo angulo, el
reemplazo es directo.

Se generaron derivados con `sharp-cli`:
`hero-2400.avif`, `hero-2400.webp`, `hero-2400.jpg` (fallback) y
`hero-1200.webp` / `hero-800.webp` para pantallas chicas. El navegador
elige el primero que soporte vía el `<picture>` de `StoryHero.jsx`.

**Para reemplazar la foto**, corre algo equivalente sobre tu propia
imagen y actualiza las rutas en `StoryHero.jsx` y el crédito en
`src/data/story.js`:

```bash
npx sharp-cli -i tu-foto.jpg -o "hero-2400.{output.ext}" -f webp -q 76 resize 2400
```

---

## Rendimiento y accesibilidad

- La foto se sirve en AVIF/WebP con JPEG de respaldo, tres anchos, y
  `fetchpriority="high"` porque es el elemento más grande del primer
  render (LCP).
- Sin three.js, sin simple-parallax: el bundle es solo React + Lenis +
  GSAP (el ticker, no ScrollTrigger).
- `prefers-reduced-motion`: se apaga Lenis, el zoom del fondo y las
  transiciones de revelado — el contenido aparece completo de inmediato.
- Todo el texto existe en el DOM sin JS. Navegación completa con Tab,
  foco visible, contraste AA verificado contra el scrim de la foto.

---

## Conectar el formulario

`src/components/BookingCard.jsx` valida y muestra una confirmación local.
El punto de integración está marcado con un comentario en `onSubmit`: ahí
va tu POST al motor de reservas o al WhatsApp Business API.
