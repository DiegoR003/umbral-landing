import { useRef } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'

/**
 * El fondo es una sola fotografia, fija (position: fixed), del principio
 * al final de la pagina. No es una imagen larga: es la misma toma todo
 * el tiempo, como en la referencia. Lo unico que se mueve es un zoom
 * lentisimo atado al scroll, para que no se sienta un fondo muerto.
 */
export default function StoryHero({ reduced }) {
  const imgRef = useRef(null)

  useScrollProgress((p) => {
    if (reduced || !imgRef.current) return
    const scale = 1 + p * 0.08
    imgRef.current.style.transform = `scale(${scale.toFixed(4)})`
  })

  return (
    <div className="story-bg" aria-hidden="true">
      <picture>
        <source srcSet="/hero/hero-2400.avif" type="image/avif" />
        <source srcSet="/hero/hero-800.webp 800w, /hero/hero-1200.webp 1200w, /hero/hero-2400.webp 2400w" type="image/webp" />
        <img
          ref={imgRef}
          className="story-bg__img"
          src="/hero/hero-2400.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="story-bg__scrim" />
    </div>
  )
}
