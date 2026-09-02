import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Destination() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section
      style={{
        position: 'relative',
        height: 'clamp(500px, 75vh, 800px)',
        overflow: 'hidden',
        backgroundColor: '#DDB4AB',
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1600&h=900&fit=crop&auto=format"
        alt="Destination wedding — couple on a hilltop landscape"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 30%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className="reveal"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(32px, 8vw, 100px)',
          maxWidth: '680px',
        }}
      >
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.58rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: '24px',
          }}
        >
          Destination Weddings
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            color: '#fff',
            lineHeight: 1.18,
            marginBottom: '20px',
            letterSpacing: '0.01em',
          }}
        >
          Wherever your<br />story blooms.
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '40px',
          }}
        >
          Tu historia, en cualquier destino.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '44px' }}>
          {['Buenos Aires', 'Mendoza', 'Patagonia', 'Uruguay', 'Europa', 'Japón'].map((d) => (
            <span
              key={d}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.6rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                borderBottom: '1px solid rgba(255,255,255,0.3)',
                paddingBottom: '3px',
              }}
            >
              {d}
            </span>
          ))}
        </div>
        <a
          href="#contacto"
          style={{
            display: 'inline-block',
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 500,
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.55)',
            padding: '12px 32px',
            textDecoration: 'none',
            alignSelf: 'flex-start',
            transition: 'background-color 0.35s ease, border-color 0.35s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.borderColor = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'
          }}
        >
          Conversemos
        </a>
      </div>
    </section>
  )
}
