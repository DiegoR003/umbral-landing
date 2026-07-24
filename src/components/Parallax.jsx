import { useEffect, useRef } from 'react'

/**
 * Envoltura de simple-parallax-js.
 *
 * Notas de implementacion:
 *  - La libreria se importa de forma diferida: si falla o si el usuario
 *    pidio menos movimiento, la imagen se queda quieta y la pagina sigue
 *    intacta. El parallax nunca es requisito para ver el contenido.
 *  - Se inicializa despues de `load` de la imagen porque simple-parallax
 *    necesita las dimensiones reales para calcular el desplazamiento.
 *  - `overflow: false` mantiene el recorte dentro del marco, que es lo que
 *    hace que se sienta una ventana y no una imagen que se despega.
 */
export default function Parallax({
  src,
  alt,
  className = '',
  scale = 1.28,
  delay = 0.5,
  orientation = 'down',
  transition = 'cubic-bezier(0.16, 1, 0.3, 1)',
  reduced = false,
  ...rest
}) {
  const imgRef = useRef(null)
  const instRef = useRef(null)

  useEffect(() => {
    if (reduced) return
    const img = imgRef.current
    if (!img) return

    let cancelled = false

    const init = async () => {
      try {
        const mod = await import('simple-parallax-js')
        const SimpleParallax = mod.default ?? mod
        if (cancelled || !img.isConnected) return
        instRef.current = new SimpleParallax(img, {
          scale,
          delay,
          orientation,
          transition,
          overflow: false,
        })
      } catch (err) {
        // Sin parallax la pagina se ve igual de bien, solo mas quieta.
        console.warn('[parallax] no se pudo inicializar:', err)
      }
    }

    if (img.complete && img.naturalWidth) init()
    else img.addEventListener('load', init, { once: true })

    return () => {
      cancelled = true
      img.removeEventListener('load', init)
      if (instRef.current?.destroy) instRef.current.destroy()
      instRef.current = null
    }
  }, [src, scale, delay, orientation, transition, reduced])

  return <img ref={imgRef} src={src} alt={alt} className={className} loading="lazy" decoding="async" {...rest} />
}
