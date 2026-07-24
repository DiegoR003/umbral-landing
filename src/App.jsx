import Nav from './components/Nav'
import StoryHero from './components/StoryHero'
import StoryStops from './components/StoryStops'
import ProgressRail from './components/ProgressRail'
import BookingCard from './components/BookingCard'
import Footer from './components/Footer'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  const reduced = useReducedMotion()
  useSmoothScroll(reduced)

  return (
    <>
      <a className="skip-link" href="#reservar">
        Saltar a reservar
      </a>

      <StoryHero reduced={reduced} />
      <Nav />
      <ProgressRail />

      <main className="page" id="top">
        <StoryStops />
        <BookingCard />
      </main>

      <Footer />
    </>
  )
}
