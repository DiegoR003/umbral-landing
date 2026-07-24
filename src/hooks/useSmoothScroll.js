import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dayCycle, startDayCycle } from '../dayCycle'

gsap.registerPlugin(ScrollTrigger)

/**
 * Une tres cosas:
 *  1. Lenis para el scroll con inercia (se apaga con reduced-motion).
 *  2. ScrollTrigger, sincronizado al ticker de Lenis.
 *  3. El progreso 0..1 de la pagina, que es lo que mueve la hora del dia.
 */
export function useSmoothScroll(reduced) {
  useEffect(() => {
    dayCycle.frozen = reduced
    const stopCycle = startDayCycle()

    let lenis = null
    let rafFn = null

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
      lenis.on('scroll', ScrollTrigger.update)
      rafFn = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(rafFn)
      gsap.ticker.lagSmoothing(0)
    }

    // Progreso de la pagina -> hora del dia.
    const readProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      dayCycle.set(max > 0 ? window.scrollY / max : 0)
    }
    readProgress()
    window.addEventListener('scroll', readProgress, { passive: true })
    window.addEventListener('resize', readProgress)

    return () => {
      window.removeEventListener('scroll', readProgress)
      window.removeEventListener('resize', readProgress)
      if (rafFn) gsap.ticker.remove(rafFn)
      if (lenis) lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
      stopCycle()
    }
  }, [reduced])
}
