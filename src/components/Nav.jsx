import { brand, nav } from '../data/story'

export default function Nav() {
  return (
    <nav className="nav" aria-label="Principal">
      <a className="nav__mark" href="#top">
        {brand.name}
      </a>
      <div className="nav__links u-mono">
        {nav.map((item) => (
          <a key={item.href} className="nav__link" href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
