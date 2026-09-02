import { useScrollReveal } from '../hooks/useScrollReveal'

export default function CtaFinal() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section
      style={{
        position: 'relative',
        height: 'clamp(480px, 65vh, 700px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#69483F',
      }}
    >
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=1600&h=900&fit=crop&auto=format"
        alt="SAKU Films — lo efímero se vuelve eterno"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 20%',
          opacity: 0.25,
        }}
      />
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(105,72,63,0.7)' }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className="reveal"
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '0 clamp(24px, 8vw, 80px)',
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            color: '#F0E1DA',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            marginBottom: '36px',
          }}
        >
          LO EFÍMERO<br />SE VUELVE<br />ETERNO.
        </h2>
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 300,
            fontSize: '0.62rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(240,225,218,0.55)',
          }}
        >
          SAKU FILMS
        </div>
      </div>
    </section>
  )
}
