import { useReveal } from '../hooks/useReveal'
import { stops } from '../data/story'

function Stop({ stop, index }) {
  const ref = useReveal()
  const isFirst = index === 0

  return (
    <section
      ref={ref}
      id={stop.id}
      className={`stop${isFirst ? ' stop--hero' : ''}`}
    >
      <div className="stop__body">
        <span className={`stop__kicker u-mono${isFirst ? '' : ' reveal'}`}>{stop.kicker}</span>
        <h1 className={isFirst ? 'stop__title stop__title--brand' : 'stop__title'}>
          <span className={isFirst ? '' : 'reveal'} style={{ '--d': '80ms' }}>
            {stop.title}
          </span>
        </h1>
        <p className={`stop__text${isFirst ? '' : ' reveal'}`} style={{ '--d': '160ms' }}>
          {stop.text}
        </p>
      </div>

      {isFirst && (
        <div className="stop__hint u-mono">
          <p>Desliza para zarpar</p>
          <span className="stop__hint-line" aria-hidden="true" />
        </div>
      )}
    </section>
  )
}

export default function StoryStops() {
  return (
    <>
      {stops.map((stop, i) => (
        <Stop key={stop.id} stop={stop} index={i} />
      ))}
    </>
  )
}
