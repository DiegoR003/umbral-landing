import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

/** Lenis para el scroll con inercia. Se apaga con reduced-motion. */
export function useSmoothScroll(reduced) {
  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    const rafFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(rafFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(rafFn)
      lenis.destroy()
    }
  }, [reduced])
}
