import { Suspense, lazy, useEffect, useState } from 'react'

// three.js completo vive detras de este import(): no entra al bundle
// inicial y por lo tanto no compite con el LCP.
const SkyCanvas = lazy(() => import('./SkyCanvas'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

/**
 * El cielo vive detras de todo, fijo, y nunca bloquea el primer render:
 * el degradado CSS de `.sky__fallback` esta pintado desde el milisegundo
 * cero y el canvas se monta encima cuando ya hay pagina. Sin WebGL, ese
 * degradado se queda — y sigue cambiando de hora con el scroll, porque
 * usa las mismas variables CSS.
 */
export default function Sky({ reduced = false }) {
  const [mount, setMount] = useState(false)
  const [ok] = useState(() => (typeof window === 'undefined' ? false : hasWebGL()))

  useEffect(() => {
    if (!ok) return
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMount(true), { timeout: 1500 })
      : setTimeout(() => setMount(true), 450)
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id))
  }, [ok])

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__fallback" />
      {ok && mount && (
        <Suspense fallback={null}>
          <SkyCanvas reduced={reduced} />
        </Suspense>
      )}
    </div>
  )
}
