import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const SERVICES = [
  {
    num: '01',
    title: 'Wedding Films',
    desc: "Películas de boda construidas desde una mirada documental y cinematográfica. Capturamos la emoción, el silencio, el abrazo. Lo que no se puede repetir.",
    img: 'https://images.unsplash.com/photo-1606216794050-6ff7db8cb43d?w=600&h=400&fit=crop&auto=format',
  },
  {
    num: '02',
    title: 'Trailers',
    desc: "Piezas breves para revivir la esencia del día. Cada frame seleccionado con intención narrativa.",
    img: 'https://images.unsplash.com/photo-1547911139-c06c87da7115?w=600&h=400&fit=crop&auto=format',
  },
  {
    num: '03',
    title: 'Highlights',
    desc: "Una selección emocional de los momentos más importantes, construida para volver a sentirlos.",
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format',
  },
  {
    num: '04',
    title: 'Fotografía',
    desc: "Registro natural de momentos, detalles y emociones. Luz real, movimiento real, historia real.",
    img: 'https://images.unsplash.com/photo-1600270237614-d20aef1c8b14?w=600&h=400&fit=crop&auto=format',
  },
  {
    num: '05',
    title: 'Content Creation',
    desc: "Contenido pensado para redes sociales y comunicación digital. Una extensión de la identidad visual de la boda.",
    img: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&h=400&fit=crop&auto=format',
  },
  {
    num: '06',
    title: 'Destination Weddings',
    desc: "Cobertura audiovisual de bodas en distintos destinos. Viajamos con la historia.",
    img: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&h=400&fit=crop&auto=format',
  },
]

const PROCESS = [
  { num: '01', title: 'Observamos', desc: 'Capturamos lo que sucede de forma natural.' },
  { num: '02', title: 'Sentimos', desc: 'Encontramos los pequeños momentos que cuentan la historia.' },
  { num: '03', title: 'Contamos', desc: 'Los convertimos en una película para volver a sentirlos.' },
]

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null)
  const titleRef = useScrollReveal<HTMLDivElement>()
  const processRef = useScrollReveal<HTMLDivElement>()

  return (
    <section
      id="servicios"
      style={{
        backgroundColor: '#F0E1DA',
        padding: 'clamp(70px, 10vw, 130px) clamp(24px, 8vw, 100px)',
      }}
    >
      <div ref={titleRef} className="reveal" style={{ marginBottom: 'clamp(40px, 6vw, 72px)', maxWidth: '600px' }}>
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.58rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#B8756B',
            marginBottom: '16px',
          }}
        >
          Servicios
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            color: '#69483F',
            lineHeight: 1.2,
          }}
        >
          Lo que hacemos.
        </h2>
      </div>

      {/* Services list */}
      <div style={{ maxWidth: '900px' }}>
        {SERVICES.map((s, i) => (
          <div
            key={s.num}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              borderTop: i === 0 ? '1px solid #C98F8740' : undefined,
              borderBottom: '1px solid #C98F8740',
              padding: '28px 0',
              display: 'flex',
              gap: 'clamp(20px, 4vw, 56px)',
              alignItems: 'flex-start',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: hovered === i ? '#E8D4CE30' : 'transparent',
              transition: 'background-color 0.4s ease',
            }}
          >
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                color: '#B8756B',
                flexShrink: 0,
                paddingTop: '4px',
              }}
            >
              {s.num}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)',
                  fontWeight: 500,
                  color: '#69483F',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                {s.title}
                <span
                  style={{
                    fontSize: '1rem',
                    opacity: hovered === i ? 1 : 0,
                    transform: hovered === i ? 'translateX(0)' : 'translateX(-8px)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                    color: '#B8756B',
                  }}
                >
                  →
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.82rem',
                  color: '#69483F',
                  opacity: hovered === i ? 0.75 : 0,
                  maxHeight: hovered === i ? '100px' : '0',
                  overflow: 'hidden',
                  lineHeight: 1.75,
                  transition: 'opacity 0.4s ease, max-height 0.4s cubic-bezier(0.22,1,0.36,1)',
                  margin: 0,
                }}
              >
                {s.desc}
              </p>
            </div>

            {/* Hover image preview */}
            <div
              style={{
                flexShrink: 0,
                width: '120px',
                height: '80px',
                overflow: 'hidden',
                opacity: hovered === i ? 1 : 0,
                transform: hovered === i ? 'scale(1)' : 'scale(0.95)',
                transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)',
                backgroundColor: '#DDB4AB',
                display: 'none',
              }}
            >
              <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Process section */}
      <div
        ref={processRef}
        className="reveal"
        style={{
          marginTop: 'clamp(60px, 8vw, 100px)',
          paddingTop: 'clamp(40px, 6vw, 60px)',
          borderTop: '1px solid #C98F8730',
        }}
      >
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.58rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#B8756B',
            marginBottom: '48px',
          }}
        >
          Cómo miramos
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(32px, 5vw, 60px)',
          }}
        >
          {PROCESS.map((p) => (
            <div key={p.num}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '3rem',
                  fontWeight: 300,
                  color: '#DDB4AB',
                  lineHeight: 1,
                  marginBottom: '16px',
                }}
              >
                {p.num}
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: '#69483F',
                  marginBottom: '10px',
                }}
              >
                {p.title}
              </div>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.82rem',
                  color: '#69483F',
                  opacity: 0.65,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
