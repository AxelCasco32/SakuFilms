import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Manifesto() {
  const ref1 = useScrollReveal<HTMLDivElement>()
  const ref2 = useScrollReveal<HTMLDivElement>()
  const ref3 = useScrollReveal<HTMLDivElement>()

  return (
    <section
      style={{
        backgroundColor: '#F0E1DA',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle side accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          right: '-1px',
          width: '1px',
          height: '60%',
          backgroundColor: '#DDB4AB',
          opacity: 0.4,
        }}
      />

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div ref={ref1} className="reveal">
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 'clamp(1.7rem, 5vw, 3.3rem)',
              color: '#69483F',
              lineHeight: 1.22,
              marginBottom: 'clamp(40px, 6vw, 72px)',
              maxWidth: '700px',
            }}
          >
            Hay momentos que solo sucendecn una vez<br />Y merecen durar para siempre
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
            Capturamos aquello que hace única a cada historia <br /> 
            para volver a ese instante, una y otra vez. 
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
            }}
          >
            Lo efímero se vuelve eterno.
          </div>
        </div>
      </div>
    </section>
  )
}
