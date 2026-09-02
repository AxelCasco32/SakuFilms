const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Films', href: '#films' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#F0E1DA',
        borderTop: '1px solid #C98F8725',
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 8vw, 100px) clamp(28px, 4vw, 44px)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(36px, 5vw, 60px)',
          marginBottom: 'clamp(36px, 5vw, 56px)',
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '0.22em',
                color: '#69483F',
                lineHeight: 1,
              }}
            >
              SAKU
            </div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 300,
                fontSize: '0.42rem',
                letterSpacing: '0.55em',
                color: '#C98F87',
                marginTop: '4px',
              }}
            >
              FILMS
            </div>
          </div>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              fontSize: '0.72rem',
              color: '#69483F',
              opacity: 0.55,
              lineHeight: 1.75,
              marginBottom: '8px',
            }}
          >
            Wedding Films &amp; Audiovisual
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: '#B8756B',
              opacity: 0.8,
            }}
          >
            Lo efímero se vuelve eterno.
          </p>
        </div>

        {/* Nav links */}
        <div>
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.55rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#B8756B',
              marginBottom: '20px',
            }}
          >
            Navegación
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.82rem',
                  color: '#69483F',
                  opacity: 0.65,
                  textDecoration: 'none',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.65' }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Social */}
        <div>
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.55rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#B8756B',
              marginBottom: '20px',
            }}
          >
            Contacto
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Instagram', href: '#' },
              { label: 'WhatsApp', href: '#' },
              { label: 'hola@sakufilms.com', href: 'mailto:hola@sakufilms.com' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.82rem',
                  color: '#69483F',
                  opacity: 0.65,
                  textDecoration: 'none',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.65' }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid #C98F8725',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.62rem',
            color: '#69483F',
            opacity: 0.35,
            letterSpacing: '0.06em',
          }}
        >
          &copy; {new Date().getFullYear()} SAKU Films. Todos los derechos reservados.
        </span>
        {/* Subtle sakura */}
        <div style={{ display: 'flex', gap: '8px', opacity: 0.2 }} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <svg key={i} width="10" height="10" viewBox="0 0 64 64" fill="none">
              {[0, 72, 144, 216, 288].map((d) => (
                <ellipse key={d} cx="32" cy="17" rx="7" ry="13" fill="#C98F87" transform={`rotate(${d} 32 32)`} />
              ))}
            </svg>
          ))}
        </div>
      </div>
    </footer>
  )
}
