import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

type Sub = { label: string; tagline: string; desc: string }

type Service = {
  title: string
  intro?: string
  tagline?: string
  desc?: string
  subs?: Sub[]
}

const SERVICES: Service[] = [
  {
    title: 'Wedding Films',
    desc: 'Películas de boda construidas desde una mirada documental y cinematográfica. Capturamos la emoción, el silencio, el abrazo. Lo que no se puede repetir.',
  },
  {
    title: 'Wedding Photography',
    desc: 'Registro natural de momentos, detalles y emociones. Luz real, movimiento real, historia real.',
  },
  {
    title: 'Content Creation',
    desc: 'Contenido pensado para redes sociales y comunicación digital. Una extensión de la identidad visual de la boda.',
  },
  {
    title: 'Sesiones pre y post boda',
    intro:
      'Una experiencia para volver a encontrarse, crear nuevos momentos y seguir construyendo su historia.',
    subs: [
      {
        label: 'Pre boda',
        tagline: 'Una pausa antes de empezar.',
        desc: 'Su historia empieza mucho antes del “sí, quiero”. Una sesión para capturar lo que los hace únicos y convertir ese momento en parte de su historia.',
      },
      {
        label: 'Post boda',
        tagline: 'Cuando el día termina, la historia continúa.',
        desc: 'Una sesión para volver a ese vínculo, sin apuros ni protocolos, y crear nuevos momentos juntos.',
      },
    ],
  },
  {
    title: 'Civil',
    tagline: 'Porque cada “sí” merece ser parte de la historia.',
    desc: 'Una cobertura audiovisual íntima para conservar ese momento en el que todo comienza.',
  },
]

const PROCESS = [
  { title: 'Observamos', desc: 'Capturamos lo que sucede de forma natural.' },
  { title: 'Sentimos', desc: 'Encontramos los pequeños momentos que cuentan la historia.' },
  { title: 'Contamos', desc: 'Los convertimos en una película para volver a sentirlos.' },
]

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: '0.54rem',
  letterSpacing: '0.26em',
  textTransform: 'uppercase',
  color: '#B8756B',
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 300,
  fontSize: '0.74rem',
  color: '#69483F',
  lineHeight: 1.7,
  margin: 0,
  opacity: 0.8,
}

const taglineStyle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
  color: '#69483F',
  lineHeight: 1.3,
  margin: '0 0 6px',
}

export default function Services() {
  const [active, setActive] = useState<number | null>(null)
  const titleRef = useScrollReveal<HTMLDivElement>()
  const processRef = useScrollReveal<HTMLDivElement>()

  return (
    <section
      id="servicios"
      style={{
        backgroundColor: '#F0E1DA',
        padding: 'clamp(48px, 7vw, 90px) clamp(20px, 6vw, 80px)',
      }}
    >
      <div
        ref={titleRef}
        className="reveal"
        style={{ marginBottom: 'clamp(28px, 4vw, 48px)', maxWidth: '600px' }}
      >
        <div style={{ ...eyebrowStyle, marginBottom: '12px' }}>Servicios</div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
            color: '#69483F',
            lineHeight: 1.2,
          }}
        >
          Lo que hacemos.
        </h2>
      </div>

      {/* Services list: la descripción se despliega con hover, foco o toque */}
      <div style={{ maxWidth: '980px' }}>
        {SERVICES.map((s, i) => {
          const open = active === i

          return (
            <div
              key={s.title}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(i)}
              style={{
                borderTop: i === 0 ? '1px solid #C98F8740' : undefined,
                borderBottom: '1px solid #C98F8740',
                padding: '20px 0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px clamp(20px, 4vw, 56px)',
                alignItems: 'flex-start',
                cursor: 'pointer',
                outline: 'none',
                backgroundColor: open ? '#E8D4CE30' : 'transparent',
                transition: 'background-color 0.4s ease',
              }}
            >
              <div
                style={{
                  flex: '0 0 clamp(200px, 28%, 260px)',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.1rem, 1.9vw, 1.4rem)',
                  fontWeight: 500,
                  color: '#69483F',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {s.title}
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: '0.9rem',
                    color: '#B8756B',
                    opacity: open ? 1 : 0.45,
                    transform: open ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                  }}
                >
                  →
                </span>
              </div>

              <div
                style={{
                  flex: '1 1 280px',
                  maxWidth: '600px',
                  display: 'grid',
                  gridTemplateRows: open ? '1fr' : '0fr',
                  opacity: open ? 1 : 0,
                  transition:
                    'grid-template-rows 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
                }}
              >
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                  {s.intro && <p style={bodyStyle}>{s.intro}</p>}
                  {s.tagline && <p style={taglineStyle}>{s.tagline}</p>}
                  {s.desc && <p style={bodyStyle}>{s.desc}</p>}

                  {s.subs?.map((sub) => (
                    <div key={sub.label} style={{ marginTop: '16px' }}>
                      <div style={{ ...eyebrowStyle, marginBottom: '6px' }}>{sub.label}</div>
                      <p style={taglineStyle}>{sub.tagline}</p>
                      <p style={bodyStyle}>{sub.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Process section */}
      <div
        ref={processRef}
        className="reveal"
        style={{
          marginTop: 'clamp(36px, 5vw, 60px)',
          paddingTop: 'clamp(24px, 4vw, 40px)',
          borderTop: '1px solid #C98F8730',
        }}
      >
        <div style={{ ...eyebrowStyle, marginBottom: '28px' }}>Cómo miramos</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'clamp(20px, 3vw, 40px)',
          }}
        >
          {PROCESS.map((p) => (
            <div key={p.title}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: '#69483F',
                  marginBottom: '6px',
                }}
              >
                {p.title}
              </div>
              <p style={{ ...bodyStyle, opacity: 0.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}