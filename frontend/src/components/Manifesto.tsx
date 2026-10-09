import { useScrollReveal } from '../hooks/useScrollReveal'

/* Pequeña viñeta decorativa: línea — rombo — línea */
function OrnamentDivider() {
  return (
    <svg width="96" height="12" viewBox="0 0 96 12" aria-hidden="true">
      <line x1="0" y1="6" x2="38" y2="6" stroke="#B8756B" strokeWidth="0.8" opacity="0.55" />
      <rect x="44" y="2" width="8" height="8" transform="rotate(45 48 6)" fill="none" stroke="#B8756B" strokeWidth="0.8" opacity="0.7" />
      <line x1="58" y1="6" x2="96" y2="6" stroke="#B8756B" strokeWidth="0.8" opacity="0.55" />
    </svg>
  )
}

/* Tres puntitos, como un instante que se repite */
function DotsFlourish() {
  return (
    <svg width="40" height="6" viewBox="0 0 40 6" aria-hidden="true">
      <circle cx="4" cy="3" r="2.2" fill="#B8756B" opacity="0.75" />
      <circle cx="20" cy="3" r="2.2" fill="#B8756B" opacity="0.5" />
      <circle cx="36" cy="3" r="2.2" fill="#B8756B" opacity="0.3" />
    </svg>
  )
}

export default function Manifesto() {
  const refOrnament = useScrollReveal<HTMLDivElement>()
  const ref1 = useScrollReveal<HTMLDivElement>()
  const ref2 = useScrollReveal<HTMLDivElement>()
  const ref3 = useScrollReveal<HTMLDivElement>()
  const refAccent = useScrollReveal<HTMLDivElement>()
  const refDots = useScrollReveal<HTMLDivElement>()

  return (
    <section
      style={{
        backgroundColor: '#F0E1DA',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        ref={refAccent}
        className="reveal"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          right: '-1px',
          width: '1px',
          height: '60%',
          backgroundColor: '#DDB4AB',
          opacity: 0.4,
          transformOrigin: 'top',
        }}
      />

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div ref={refOrnament} className="reveal" style={{ marginBottom: 'clamp(20px, 3vw, 32px)' }}>
          <OrnamentDivider />
        </div>

        <div ref={ref1} className="reveal">
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 'clamp(1.7rem, 5vw, 3.3rem)',
              color: '#69483F',
              lineHeight: 1.22,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              marginBottom: 'clamp(40px, 6vw, 72px)',
              maxWidth: '700px',
            }}
          >
            Hay momentos que solo suceden una vez.<br />Y merecen durar para siempre.
          </h2>
        </div>

        <div ref={ref2} className="reveal reveal-d1" style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 2.4vw, 1.7rem)',
              color: '#69483F',
              lineHeight: 1.65,
              opacity: 0.88,
            }}
          >
            Acompañamos a parejas que buscan algo más que registrar su boda.<br />
            Capturamos aquello que hace única a cada historia, para volver a ese instante,<br />
            una y otra vez.
          </p>
        </div>

        <div ref={ref3} className="reveal reveal-d2">
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
              color: '#69483F',
              lineHeight: 1.8,
              letterSpacing: '0.04em',
              opacity: 0.7,
              marginBottom: '40px',
            }}
          >
            Viajamos, observamos y contamos historias.
          </p>
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(0.65rem, 1.1vw, 0.8rem)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#B8756B',
              marginBottom: '18px',
            }}
          >
            Lo efímero se vuelve eterno.
          </div>

          <div ref={refDots} className="reveal reveal-d2">
            <DotsFlourish />
          </div>
        </div>
      </div>
    </section>
  )
}