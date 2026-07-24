import Parallax from './Parallax'
import { useReveal } from '../hooks/useReveal'
import { experiences } from '../data/experiences'

export default function Experiences({ reduced }) {
  const ref = useReveal()

  return (
    <section ref={ref} id="experiencias" aria-labelledby="exp-titulo">
      <div className="lead-in">
        <span className="lead-in__kicker u-mono reveal">Servicios</span>
        <h2 className="lead-in__title reveal" id="exp-titulo" style={{ '--d': '80ms' }}>
          Todo tiene su hora
        </h2>
        <p className="lead-in__note reveal" style={{ '--d': '160ms' }}>
          No hay catalogo. Hay un dia, y cinco cosas que solo funcionan en el
          momento en que estan puestas. Las reservas se abren con noventa dias.
        </p>
      </div>

      <div className="exp">
        <ul
          className="exp__track"
          tabIndex={0}
          aria-label="Experiencias, en orden de hora del dia"
        >
          {experiences.map((exp, i) => (
            <li className="exp__card reveal" key={exp.name} style={{ '--d': `${i * 70}ms` }}>
              <span className="exp__hour">{exp.hour}</span>
              <h3 className="exp__name">{exp.name}</h3>
              <div className="exp__frame">
                <Parallax
                  src={exp.image}
                  alt={exp.alt}
                  reduced={reduced}
                  scale={1.22}
                  delay={0.6}
                />
              </div>
              <p className="exp__desc">{exp.desc}</p>
              <p className="exp__meta">{exp.meta}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
