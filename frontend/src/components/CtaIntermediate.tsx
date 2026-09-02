import { useScrollReveal } from '../hooks/useScrollReveal'

export default function CtaIntermediate() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(80px, 12vw, 150px) clamp(24px, 8vw, 100px)',
        backgroundColor: '#69483F',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background image subtle */}
      <img
        src="https://images.unsplash.com/photo-1617724975854-70b5d0cedb0a?w=1400&h=600&fit=crop&auto=format"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.18,
        }}
      />

      <div
        ref={ref}
        className="reveal"
        style={{ position: 'relative', maxWidth: '800px' }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            color: '#F0E1DA',
            lineHeight: 1.1,
            marginBottom: '36px',
          }}
        >
          El instante pasa.<br />
          <em>La historia queda.</em>
        </h2>
        <a
          href="#films"
          style={{
            display: 'inline-block',
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 500,
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#F0E1DA',
            border: '1px solid rgba(240,225,218,0.4)',
            padding: '13px 36px',
            textDecoration: 'none',
            transition: 'border-color 0.35s ease, background-color 0.35s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#DDB4AB'
            e.currentTarget.style.backgroundColor = 'rgba(221,180,171,0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(240,225,218,0.4)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Ver films
        </a>
      </div>
    </section>
  )
}
