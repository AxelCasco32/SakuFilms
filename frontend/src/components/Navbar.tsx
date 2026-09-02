import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Films', href: '#films' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Contacto', href: '#contacto' },
]

function LogoMark({ light }: { light: boolean }) {
  return (
    <a href="#inicio" className="flex flex-col leading-none" style={{ textDecoration: 'none' }}>
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: '1.45rem',
          letterSpacing: '0.22em',
          color: light ? '#ffffff' : '#69483F',
          lineHeight: 1,
          transition: 'color 0.5s ease',
        }}
      >
        SAKU
      </span>
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 300,
          fontSize: '0.42rem',
          letterSpacing: '0.55em',
          color: light ? 'rgba(255,255,255,0.75)' : '#C98F87',
          marginTop: '3px',
          transition: 'color 0.5s ease',
        }}
      >
        FILMS
      </span>
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLight = !scrolled

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 md:px-14"
        style={{
          height: '72px',
          zIndex: 50,
          backgroundColor: scrolled ? '#F0E1DA' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(105,72,63,0.08)' : 'none',
          transition: 'background-color 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.55s ease',
        }}
      >
        <LogoMark light={isLight} />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link"
              style={{
                color: isLight ? 'rgba(255,255,255,0.88)' : '#69483F',
                transition: 'color 0.5s ease',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 500,
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '9px 22px',
              border: `1px solid ${isLight ? 'rgba(255,255,255,0.6)' : '#69483F'}`,
              color: isLight ? 'rgba(255,255,255,0.9)' : '#69483F',
              textDecoration: 'none',
              transition: 'all 0.4s ease',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = isLight ? 'rgba(255,255,255,0.15)' : '#69483F'
              el.style.color = isLight ? '#ffffff' : '#F0E1DA'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = 'transparent'
              el.style.color = isLight ? 'rgba(255,255,255,0.9)' : '#69483F'
            }}
          >
            Hablemos
          </a>
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '24px',
                height: '1px',
                backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : '#69483F',
                transition: 'background-color 0.5s ease',
              }}
            />
          ))}
        </button>
      </header>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 flex flex-col"
        style={{
          backgroundColor: '#F0E1DA',
          zIndex: 90,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div className="flex items-center justify-between px-8 h-[72px]">
          <LogoMark light={false} />
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#69483F', fontSize: '1.5rem' }}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center flex-1 gap-10">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                fontSize: '2.4rem',
                color: '#69483F',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s`,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 500,
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#69483F',
              textDecoration: 'none',
              padding: '10px 28px',
              border: '1px solid #69483F',
              marginTop: '12px',
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 0.5s ease 0.55s`,
            }}
          >
            Hablemos
          </a>
        </nav>
        {/* Subtle sakura petals in mobile menu */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-6 opacity-30 pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} width="14" height="18" viewBox="0 0 24 30" fill="none" aria-hidden="true">
              <ellipse cx="12" cy="12" rx="7" ry="11" fill="#DDB4AB" />
            </svg>
          ))}
        </div>
      </div>
    </>
  )
}
