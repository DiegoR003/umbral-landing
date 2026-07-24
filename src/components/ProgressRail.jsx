import { useRef } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'

/**
 * Indicador vertical de cuanto falta para llegar. No es decoracion pura:
 * es la barra de progreso del recorrido completo, marina -> Arco -> marina.
 */
export default function ProgressRail() {
  const fill = useRef(null)
  const num = useRef(null)

  useScrollProgress((p) => {
    if (fill.current) fill.current.style.transform = `scaleY(${p.toFixed(4)})`
    if (num.current) num.current.textContent = String(Math.round(p * 100)).padStart(2, '0')
  })

  return (
    <div className="rail" aria-hidden="true">
      <div className="rail__track">
        <div className="rail__fill" ref={fill} />
      </div>
      <span className="rail__num u-mono" ref={num}>
        00
      </span>
    </div>
  )
}
