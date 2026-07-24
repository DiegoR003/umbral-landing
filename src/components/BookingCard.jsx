import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { trip } from '../data/story'

const today = () => new Date().toISOString().slice(0, 10)

export default function BookingCard() {
  const ref = useReveal()
  const [reply, setReply] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    if (!data.correo || !data.fecha) {
      setReply('Falta el correo o la fecha de salida.')
      return
    }
    // Aqui va tu integracion real de reservas.
    setReply(`Anotado. Te escribimos a ${data.correo} para confirmar la salida de las ${data.salida} el ${data.fecha}.`)
    e.currentTarget.reset()
  }

  return (
    <section ref={ref} id="reservar" className="stop stop--book" aria-labelledby="reservar-titulo">
      <div className="book reveal">
        <span className="book__kicker u-mono">{trip.kicker}</span>
        <h2 className="book__title" id="reservar-titulo">
          {trip.title}
        </h2>
        <p className="book__text">{trip.text}</p>

        <ul className="book__stats">
          {trip.stats.map(([k, v]) => (
            <li key={k}>
              <span className="k u-mono">{k}</span>
              <span className="v">{v}</span>
            </li>
          ))}
        </ul>

        <form className="book__form" onSubmit={onSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="f-salida">
              Salida
            </label>
            <select id="f-salida" name="salida" defaultValue="7:00 h">
              {trip.departures.map((d) => (
                <option key={d} value={d.split(' — ')[0]}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="book__row">
            <div className="field">
              <label className="field__label" htmlFor="f-fecha">
                Fecha
              </label>
              <input id="f-fecha" name="fecha" type="date" min={today()} required />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="f-personas">
                Personas
              </label>
              <input id="f-personas" name="personas" type="number" min="1" max="10" defaultValue="2" />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="f-correo">
              Correo
            </label>
            <input id="f-correo" name="correo" type="email" placeholder="tu@correo.mx" required />
          </div>

          <button className="btn" type="submit">
            <span>Reservar ahora</span>
          </button>

          <p className="book__reply" role="status" aria-live="polite">
            {reply}
          </p>
        </form>
      </div>
    </section>
  )
}
