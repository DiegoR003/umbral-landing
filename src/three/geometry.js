import * as THREE from 'three'

/** PRNG con semilla: la sierra debe ser identica en cada carga. */
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Silueta de cresta en espacio unitario: x de -0.5 a 0.5, relleno hacia abajo.
 * Tres senos superpuestos + jitter fino. No es ruido Perlin, y es a proposito:
 * las sierras reales tienen periodos largos claros, no ruido uniforme.
 */
export function ridgeGeometry({ seed = 1, baseY = 0, amp = 0.12, segments = 128 }) {
  const rnd = mulberry32(seed)
  const p1 = rnd() * Math.PI * 2
  const p2 = rnd() * Math.PI * 2
  const p3 = rnd() * Math.PI * 2

  const shape = new THREE.Shape()
  shape.moveTo(-0.5, -0.75)

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = -0.5 + t
    let y = baseY
    y += Math.sin(t * 2.2 * Math.PI + p1) * amp
    y += Math.sin(t * 5.7 * Math.PI + p2) * amp * 0.4
    y += Math.sin(t * 13.1 * Math.PI + p3) * amp * 0.15
    y += (rnd() - 0.5) * amp * 0.06
    shape.lineTo(x, y)
  }

  shape.lineTo(0.5, -0.75)
  shape.closePath()
  return new THREE.ShapeGeometry(shape, 1)
}

/** Ancho y alto visibles a una distancia dada de la camara. */
export function visibleSize(camera, z) {
  const dist = Math.abs(camera.position.z - z)
  const h = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * dist
  return { w: h * camera.aspect, h }
}

/**
 * Las cinco capas de la sierra. Las lejanas son mas altas y planas,
 * las cercanas mas bajas y recortadas: eso es lo que da la profundidad,
 * no el desenfoque.
 */
export const RIDGE_LAYERS = [
  { z: -34, seed: 11, baseY: 0.08, amp: 0.13, tint: 0.72, drift: 0.14 },
  { z: -26, seed: 27, baseY: -0.02, amp: 0.11, tint: 0.52, drift: 0.24 },
  { z: -19, seed: 43, baseY: -0.13, amp: 0.09, tint: 0.34, drift: 0.38 },
  { z: -13, seed: 61, baseY: -0.24, amp: 0.07, tint: 0.16, drift: 0.56 },
  { z: -8, seed: 89, baseY: -0.36, amp: 0.05, tint: 0.0, drift: 0.82 },
]
