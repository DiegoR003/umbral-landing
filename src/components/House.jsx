import Parallax from './Parallax'
import { useReveal } from '../hooks/useReveal'

export default function House({ house, flip = false, reduced }) {
  const ref = useReveal()

  return (
    <article
      ref={ref}
      className={`house${flip ? ' house--flip' : ''}`}
      id={house.id}
      aria-labelledby={`${house.id}-nombre`}
    >
      <div className="house__media reveal">
        <span className="house__stamp">{house.hour}</span>
        <Parallax
          src={house.image}
          alt={house.alt}
          reduced={reduced}
          scale={1.3}
          delay={0.45}
          orientation={flip ? 'up' : 'down'}
        />
      </div>

      <div className="house__body">
        <span className="house__hour reveal" style={{ '--d': '60ms' }}>
          {house.hour}
        </span>
        <h2 className="house__name reveal" id={`${house.id}-nombre`} style={{ '--d': '120ms' }}>
          {house.name}
        </h2>
        <p className="house__where u-mono reveal" style={{ '--d': '180ms' }}>
          {house.where}
        </p>
        <p className="house__text reveal" style={{ '--d': '240ms' }}>
          {house.text}
        </p>

        <ul className="house__facts reveal" style={{ '--d': '300ms' }}>
          {house.facts.map(([k, v]) => (
            <li key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
