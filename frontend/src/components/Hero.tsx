export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* Background image (swap for <video> when available) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1547911139-c06c87da7115?w=1800&h=1200&fit=crop&auto=format')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          animation: 'kenBurns 18s ease-in-out infinite alternate',
        }}
        aria-hidden="true"
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.48) 100%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6" style={{ color: '#fff' }}>
        {/* Tag */}
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 400,
            fontSize: '0.6rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '28px',
            animation: 'heroItem 1s cubic-bezier(0.22,1,0.36,1) 0.4s both',
          }}
        >
          Wedding Films &amp; Audiovisual
        </div>

        {/* Logo mark */}
        <div
          style={{
            marginBottom: '32px',
            animation: 'heroItem 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s both',
          }}
        >
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              letterSpacing: '0.28em',
              color: '#fff',
              lineHeight: 1,
            }}
          >
            SAKU
          </div>
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)',
              letterSpacing: '0.62em',
              color: 'rgba(255,255,255,0.65)',
              marginTop: '6px',
            }}
          >
            FILMS
          </div>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(1.2rem, 5vw, 2.7rem)',
            lineHeight: 1.18,
            color: '#fff',
            maxWidth: '720px',
            marginBottom: '18px',
            animation: 'heroItem 1.1s cubic-bezier(0.22,1,0.36,1) 0.7s both',
          }}
        >
          Cada instante es irrepetible.<br />Cada historia, única.
        </h1>

        {/* Claim */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: '0.04em',
            marginBottom: '44px',
            animation: 'heroItem 1.1s cubic-bezier(0.22,1,0.36,1) 1s both',
          }}
        >
          Convertimos momentos irrepetibles en historias <br /> a las que siempre podés volver
        </p>

        {/* CTA */}
        <a
          href="#films"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 500,
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.5)',
            padding: '13px 36px',
            textDecoration: 'none',
            transition: 'border-color 0.35s ease, background-color 0.35s ease',
            animation: 'heroItem 1s cubic-bezier(0.22,1,0.36,1) 1.3s both',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fff'
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Conocé nuestro trabajo
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          color: 'rgba(255,255,255,0.55)',
          animation: 'heroItem 1s ease 1.8s both',
        }}
      >
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <div style={{ animation: 'scrollBounce 1.8s ease-in-out infinite' }}>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
            <line x1="8" y1="2" x2="8" y2="22" stroke="currentColor" strokeWidth="1" />
            <polyline points="3,17 8,22 13,17" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  )
}
