import { brand, credit } from '../data/story'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__mark">{brand.name}</div>
      <p className="u-mono" style={{ maxWidth: '26ch' }}>
        Salidas desde la Marina de Cabo San Lucas
      </p>
      <p className="u-mono">
        <a href="mailto:reservas@finisterra.mx">reservas@finisterra.mx</a>
        <br />
        <a href="tel:+526241234567">+52 624 123 4567</a>
      </p>
      <p className="u-mono">© {new Date().getFullYear()} {brand.name}</p>
      {credit && (
        <p className="foot__credit u-mono">
          Fotografía: {credit.text} — <a href={credit.url} target="_blank" rel="noopener noreferrer">{credit.author}</a>,{' '}
          <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">{credit.license}</a>
        </p>
      )}
    </footer>
  )
}
