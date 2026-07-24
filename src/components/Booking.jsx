import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { houses } from '../data/houses'

const today = () => new Date().toISOString().slice(0, 10)

export default function Booking() {
  const ref = useReveal()
  const [reply, setReply] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    if (!data.correo || !data.llegada) {
      setReply('Falta el correo o la fecha de llegada.')
      return
    }
    const casa = houses.find((h) => h.id === data.casa)
    // Aqui va tu integracion real de reservas.
    setReply(`Anotado. Te escribimos a ${data.correo} sobre ${casa.name}, ${data.llegada}.`)
    e.currentTarget.reset()
  }

  return (
    <section ref={ref} className="book" id="reservar" aria-labelledby="reservar-titulo">
      <div>
        <h2 className="book__title reveal" id="reservar-titulo">
          Elige tu hora
        </h2>
        <p className="book__note reveal" style={{ '--d': '100ms' }}>
          Contestamos en menos de un dia habil, con una persona y no con un
          formulario automatico. Minimo dos noches; tres en temporada de
          niebla.
        </p>
      </div>

      <form className="book__form reveal" style={{ '--d': '160ms' }} onSubmit={onSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="f-casa">
            Casa
          </label>
          <select id="f-casa" name="casa" defaultValue="niebla">
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.hour}
              </option>
            ))}
          </select>
        </div>

        <div className="book__row">
          <div className="field">
            <label className="field__label" htmlFor="f-llegada">
              Llegada
            </label>
            <input id="f-llegada" name="llegada" type="date" min={today()} required />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="f-noches">
              Noches
            </label>
            <input id="f-noches" name="noches" type="number" min="2" max="21" defaultValue="3" />
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="f-nombre">
            Nombre
          </label>
          <input id="f-nombre" name="nombre" type="text" placeholder="Como te llamamos" />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="f-correo">
            Correo
          </label>
          <input id="f-correo" name="correo" type="email" placeholder="tu@correo.mx" required />
        </div>

        <button className="btn" type="submit">
          <span>Pedir disponibilidad</span>
        </button>

        <p className="book__reply" role="status" aria-live="polite">
          {reply}
        </p>
      </form>
    </section>
  )
}
