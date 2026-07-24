/**
 * El titular entra letra por letra. Es la unica animacion de carga del
 * sitio: si la repitieramos en cada seccion perderia el efecto y el
 * "fade-up en todo" es justo lo que hace que una pagina se sienta hecha
 * en serie.
 */
function Split({ text, offset = 0 }) {
  let i = offset
  return (
    <>
      {[...text].map((ch, idx) => {
        if (ch === ' ') return <span key={idx}>&nbsp;</span>
        const el = (
          <span key={idx} className="l" style={{ '--i': i }}>
            {ch}
          </span>
        )
        i++
        return el
      })}
    </>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__body">
        <p className="hero__eyebrow u-mono">Coleccion Umbral · Mexico</p>

        <h1 className="hero__title">
          <span aria-hidden="true">
            <Split text="Tres casas." />
            <br />
            <em>
              <Split text="Un dia entero." offset={11} />
            </em>
          </span>
          <span className="u-hidden">Tres casas. Un dia entero.</span>
        </h1>

        <p className="hero__lede">
          Cada casa esta construida alrededor de una hora concreta. Baja y
          recorrelas en orden: la pagina amanece y anochece contigo.
        </p>
      </div>

      <div className="hero__foot u-mono">
        <p className="hero__scroll">Baja para avanzar el dia</p>
        <p>05:40 → 21:40</p>
      </div>
    </section>
  )
}
