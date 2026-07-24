/**
 * dayCycle — el gesto firma del sitio.
 *
 * El scroll de la pagina es un dia completo. Este modulo mantiene un unico
 * valor de progreso (0 = 05:40, 1 = 21:40), interpola la paleta entre horas
 * y escribe el resultado como variables CSS. La escena 3D lee los mismos
 * colores desde aqui, asi que canvas y DOM nunca se desincronizan.
 *
 * Deliberadamente vive fuera de React: se actualiza 60 veces por segundo y
 * un setState a esa frecuencia repintaria el arbol entero.
 */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// ── utilidades de color ────────────────────────────────────────────────
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex([r, g, b]) {
  const h = (v) => Math.round(clamp01(v / 255) * 255).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

// Interpolar en espacio lineal evita el gris lodoso del cruce en sRGB
const toLinear = (c) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
const toSrgb = (l) =>
  (l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055) * 255

function mixHex(a, b, t) {
  const A = hexToRgb(a).map(toLinear)
  const B = hexToRgb(b).map(toLinear)
  return rgbToHex(A.map((v, i) => toSrgb(v + (B[i] - v) * t)))
}

// ── las horas ──────────────────────────────────────────────────────────
// Cada parada es una hora real del dia con su propia luz. El salto grande
// (y el riesgo) esta en la 13:20: la pagina entera se vuelve de dia.
export const HOURS = [
  {
    at: 0.0,
    label: '05:40',
    name: 'Alba',
    bg: '#14161B',
    fg: '#EFE9E1',
    accent: '#8E9AA3',
    skyTop: '#0B0E1F',
    skyLow: '#2E3A44',
    ridge: '#0A0C10',
    sun: '#5C6A75',
    sunY: -0.22,
    haze: 0.42,
  },
  {
    at: 0.26,
    label: '07:10',
    name: 'Niebla',
    bg: '#2A3138',
    fg: '#EFE9E1',
    accent: '#C9A227',
    skyTop: '#5A6B78',
    skyLow: '#C3C0B8',
    ridge: '#1C2228',
    sun: '#F3EDE2',
    sunY: 0.06,
    haze: 0.68,
  },
  {
    at: 0.52,
    label: '13:20',
    name: 'Cal',
    bg: '#EFE9E1',
    fg: '#20262C',
    accent: '#6E6047',
    skyTop: '#D9D4CA',
    skyLow: '#EFE9E1',
    ridge: '#B9AC96',
    sun: '#FFF6DE',
    sunY: 0.42,
    haze: 0.14,
  },
  {
    at: 0.78,
    label: '19:05',
    name: 'Hora azul',
    bg: '#1B2340',
    fg: '#EFE9E1',
    accent: '#C9A227',
    skyTop: '#2B3A63',
    skyLow: '#8C6F73',
    ridge: '#121733',
    sun: '#C9A227',
    sunY: -0.04,
    haze: 0.5,
  },
  {
    at: 1.0,
    label: '21:40',
    name: 'Sereno',
    bg: '#0B0E1F',
    fg: '#EFE9E1',
    // jade aclarado: el #3E6B60 de marca no llega a AA sobre este fondo
    accent: '#5F9C8C',
    skyTop: '#05070F',
    skyLow: '#15203A',
    ridge: '#04060C',
    sun: '#3E6B60',
    sunY: -0.3,
    haze: 0.3,
  },
]

const COLOR_KEYS = ['bg', 'fg', 'accent', 'skyTop', 'skyLow', 'ridge', 'sun']
const NUM_KEYS = ['sunY', 'haze']

function paletteAt(p) {
  const t = clamp01(p)
  let i = 0
  while (i < HOURS.length - 2 && t > HOURS[i + 1].at) i++
  const a = HOURS[i]
  const b = HOURS[i + 1]
  const span = b.at - a.at
  const k = span === 0 ? 0 : clamp01((t - a.at) / span)
  // smoothstep: la luz no cambia de forma lineal, se asienta en cada hora
  const e = k * k * (3 - 2 * k)

  const out = { label: k < 0.5 ? a.label : b.label, name: k < 0.5 ? a.name : b.name }
  for (const key of COLOR_KEYS) out[key] = mixHex(a[key], b[key], e)
  for (const key of NUM_KEYS) out[key] = a[key] + (b[key] - a[key]) * e
  return out
}

// ── estado compartido ──────────────────────────────────────────────────
export const dayCycle = {
  progress: 0, // objetivo, lo escribe el scroll
  eased: 0, // valor suavizado que realmente se pinta
  palette: paletteAt(0),
  frozen: false, // true con prefers-reduced-motion
  set(p) {
    this.progress = clamp01(p)
    if (this.frozen) this.eased = this.progress
  },
}

let running = false
const root = typeof document !== 'undefined' ? document.documentElement : null

function applyCss(p) {
  if (!root) return
  root.style.setProperty('--bg', p.bg)
  root.style.setProperty('--fg', p.fg)
  root.style.setProperty('--accent', p.accent)
}

/** Arranca el bucle que suaviza el progreso y pinta las variables CSS. */
export function startDayCycle() {
  if (running) return () => {}
  running = true
  let raf = 0
  let last = performance.now()

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.1)
    last = now
    // seguimiento exponencial: el scroll manda, la luz llega con inercia
    const k = dayCycle.frozen ? 1 : 1 - Math.pow(0.0016, dt)
    dayCycle.eased += (dayCycle.progress - dayCycle.eased) * k
    dayCycle.palette = paletteAt(dayCycle.eased)
    applyCss(dayCycle.palette)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf)
    running = false
  }
}

export { paletteAt }
