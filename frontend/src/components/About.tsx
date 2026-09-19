import { useScrollReveal } from '../hooks/useScrollReveal'

const PILLARS = [
  { label: 'Viaje', text: 'Una identidad nacida del movimiento, los destinos y la experiencia de conocer el mundo.' },
  { label: 'Amor', text: 'Una marca construida por una pareja enfocada en historias que comienzan juntas.' },
  { label: 'Mirada', text: 'La formación audiovisual y la experiencia convierten momentos reales en lenguaje cinematográfico.' },
]

export default function About() {
  const imgRef = useScrollReveal<HTMLDivElement>()
  const textRef = useScrollReveal<HTMLDivElement>()

  return (
    <section
      id="nosotros"
      style={{
        backgroundColor: '#F0E1DA',
        padding: 'clamp(70px, 10vw, 130px) clamp(24px, 8vw, 100px)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Image */}
        <div
          ref={imgRef}
          className="reveal"
          style={{
            position: 'relative',
            aspectRatio: '3/4',
            backgroundColor: '#DDB4AB',
            overflow: 'hidden',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1606490194864-f380e19e55cd?w=700&h=950&fit=crop&auto=format"
            alt="Los fundadores de SAKU Films"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Small accent tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              backgroundColor: '#F0E1DA',
              padding: '8px 14px',
            }}
          >
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.58rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#69483F',
              }}
            >
              SAKU Films
            </span>
          </div>
        </div>

        {/* Text */}
        <div ref={textRef} className="reveal reveal-d2">
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.58rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#B8756B',
              marginBottom: '20px',
            }}
          >
            Nosotros
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              color: '#69483F',
              lineHeight: 1.2,
              marginBottom: '28px',
            }}
          >
            Lo efímero<br />se vuelve eterno.
          </h2>

          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              fontSize: '0.88rem',
              color: '#69483F',
              lineHeight: 1.82,
              opacity: 0.78,
              marginBottom: '48px',
            }}
          >
            SAKU nace de dos personas que comparten una historia, años de recorrido audiovisual y una
            mirada construida a través de viajes y experiencias. La floraci&oacute;n del sakura no es
            decoraci&oacute;n temática. Es un símbolo: aquello bello precisamente porque es pasajero.
          </p>

          {/* Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {PILLARS.map((p, i) => (
              <div
                key={p.label}
                style={{
                  borderTop: i === 0 ? '1px solid #C98F8740' : undefined,
                  borderBottom: '1px solid #C98F8740',
                  padding: '20px 0',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    color: '#B8756B',
                    minWidth: '70px',
                    flexShrink: 0,
                  }}
                >
                  {p.label}
                </span>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.78rem',
                    color: '#69483F',
                    opacity: 0.7,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
