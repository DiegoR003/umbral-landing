import Sky from './three/Sky'
import { Nav, HourRail, Footer } from './components/Chrome'
import Hero from './components/Hero'
import House from './components/House'
import Experiences from './components/Experiences'
import Booking from './components/Booking'
import { houses } from './data/houses'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useReveal } from './hooks/useReveal'

export default function App() {
  const reduced = useReducedMotion()
  useSmoothScroll(reduced)
  const leadRef = useReveal()

  return (
    <>
      <a className="skip-link" href="#casas">
        Saltar al contenido
      </a>

      <Sky reduced={reduced} />
      <HourRail />
      <Nav />

      <main className="page">
        <Hero />

        <div ref={leadRef} className="lead-in" id="casas">
          <span className="lead-in__kicker u-mono reveal">Las casas</span>
          <h2 className="lead-in__title reveal" style={{ '--d': '80ms' }}>
            Ninguna sirve a la misma hora
          </h2>
          <p className="lead-in__note reveal" style={{ '--d': '160ms' }}>
            Tres construcciones, tres climas, tres momentos del dia. Estan
            pensadas para visitarse por separado y en la temporada en que su
            hora dura mas.
          </p>
        </div>

        {houses.map((house, i) => (
          <House key={house.id} house={house} flip={i % 2 === 1} reduced={reduced} />
        ))}

        <Experiences reduced={reduced} />
        <Booking />
      </main>

      <Footer />
    </>
  )
}
