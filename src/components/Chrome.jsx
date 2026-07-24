import { useEffect, useRef } from 'react'
import { dayCycle } from '../dayCycle'

export function Nav() {
  return (
    <nav className="site-nav" aria-label="Principal">
      <a className="site-nav__mark" href="#inicio">
        UMBRAL
      </a>
      <div className="site-nav__links u-mono">
        <a className="site-nav__link" href="#casas">
          Casas
        </a>
        <a className="site-nav__link" href="#experiencias">
          Experiencias
        </a>
        <a className="site-nav__link" href="#reservar">
          Reservar
        </a>
      </div>
    </nav>
  )
}

/**
 * Riel de horas. No es decoracion: es la barra de progreso del dia.
 * Se actualiza fuera de React porque cambia en cada frame.
 */
export function HourRail() {
  const fill = useRef(null)
  const hour = useRef(null)
  const name = useRef(null)

  useEffect(() => {
    let raf = 0
    let lastLabel = ''
    const tick = () => {
      const p = dayCycle.palette
      if (fill.current) fill.current.style.transform = `scaleY(${dayCycle.eased.toFixed(4)})`
      if (p.label !== lastLabel) {
        lastLabel = p.label
        if (hour.current) hour.current.textContent = p.label
        if (name.current) name.current.textContent = p.name
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="rail" aria-hidden="true">
      <div className="rail__fill" ref={fill} style={{ height: '100%', transform: 'scaleY(0)' }} />
      <div className="rail__now">
        <b ref={hour}>05:40</b>
        <span ref={name}>Alba</span>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="site-foot">
      <div className="site-foot__mark">UMBRAL</div>
      <p className="u-mono" style={{ maxWidth: '24ch' }}>
        Oaxaca · Baja California · Jalisco
      </p>
      <p className="u-mono">
        <a href="mailto:reservas@umbral.mx">reservas@umbral.mx</a>
        <br />
        <a href="tel:+525500000000">+52 55 0000 0000</a>
      </p>
      <p className="u-mono">© {new Date().getFullYear()} Umbral</p>
    </footer>
  )
}
