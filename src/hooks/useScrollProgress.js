import { useEffect, useRef } from 'react'

/**
 * Progreso de scroll (0..1) entregado por referencia, no por estado.
 * Igual que el motor de dia de la version anterior: se lee 60 veces por
 * segundo y un setState a esa frecuencia repintaria el arbol entero.
 */
export function useScrollProgress(onChange) {
  const cbRef = useRef(onChange)
  cbRef.current = onChange

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      cbRef.current(p)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
}
