import { useEffect, useRef } from 'react'

/**
 * Revelado por entrada al viewport con IntersectionObserver.
 * Es mas barato que un ScrollTrigger por elemento y no necesita limpieza
 * al cambiar el tamano de la ventana.
 */
export function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12, ...options }
    )

    // Observa el propio nodo y a sus hijos marcados con .reveal
    const targets = el.classList.contains('reveal')
      ? [el, ...el.querySelectorAll('.reveal')]
      : [...el.querySelectorAll('.reveal')]
    targets.forEach((t) => io.observe(t))

    return () => io.disconnect()
  }, [])

  return ref
}
