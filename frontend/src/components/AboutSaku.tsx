import { useScrollReveal } from '../hooks/useScrollReveal'

/* Flor de sakura estilizada: 5 pétalos dispuestos en radial */
function SakuraBlossom({ size = 260, opacity = 1 }: { size?: number; opacity?: number }) {
  const petalAngles = [0, 72, 144, 216, 288]
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ opacity }} aria-hidden="true">
      <g transform="translate(100,100)">
        {petalAngles.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              d="M0,0 C -18,-28 -14,-62 0,-78 C 14,-62 18,-28 0,0 Z"
              fill="none"
              stroke="#DDB4AB"
              strokeWidth="1"
              opacity="0.85"
            />
            <path
              d="M0,-14 C -7,-30 -5,-48 0,-58 C 5,-48 7,-30 0,-14 Z"
              fill="#DDB4AB"
              opacity="0.28"
            />
          </g>
        ))}
        <circle r="6" fill="#B8756B" opacity="0.6" />
      </g>
    </svg>
  )
}

export default function AboutSaku() {
  const refTag = useScrollReveal<HTMLDivElement>()
  const refHeadline = useScrollReveal<HTMLDivElement>()
  const refBody = useScrollReveal<HTMLDivElement>()
  const refClaim = useScrollReveal<HTMLDivElement>()
  const refBlossom = useScrollReveal<HTMLDivElement>()

  return (
    <section
      style={{
        backgroundColor: '#69483F',
        padding: 'clamp(90px, 12vw, 160px) clamp(24px, 8vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes sakuraSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .saku-blossom-bg {
          animation: sakuraSpin 90s linear infinite;
        }
      `}</style>

      <div
        ref={refBlossom}
        className="reveal saku-blossom-bg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          right: 'clamp(-60px, 4vw, 40px)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      >
        <SakuraBlossom size={340} opacity={0.14} />
      </div>

      <div style={{ maxWidth: '620px', position: 'relative' }}>
        <div ref={refTag} className="reveal" style={{ marginBottom: '20px' }}>
          <span
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.58rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#DDB4AB',
            }}
          >
            Sobre Saku
          </span>
        </div>

        <div ref={refHeadline} className="reveal">
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.8rem, 4.4vw, 3rem)',
              color: '#F0E1DA',
              lineHeight: 1.28,
              marginBottom: 'clamp(32px, 5vw, 52px)',
            }}
          >
            Saku nace de la belleza efímera del Sakura.
          </h2>
        </div>

        <div ref={refBody} className="reveal reveal-d1" style={{ marginBottom: 'clamp(28px, 4vw, 44px)' }}>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', color: 'rgba(240,225,218,0.85)', lineHeight: 1.85, marginBottom: '24px' }}>
            No es solo una inspiración estética. Es un símbolo, un concepto que atraviesa
            nuestra manera de mirar: lo efímero se vuelve eterno.
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', color: 'rgba(240,225,218,0.85)', lineHeight: 1.85, marginBottom: '24px' }}>
            Contamos historias desde adentro. Nos acercamos a cada pareja para descubrir
            sus gestos, sus vínculos y esos pequeños momentos que hacen que su historia
            sea verdaderamente propia.
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', color: 'rgba(240,225,218,0.85)', lineHeight: 1.85 }}>
            No hacemos films en serie. Creamos relatos audiovisuales sensibles,
            personalizados y con identidad, para que cada película sea tan única y
            auténtica como la historia que cuenta.
          </p>
        </div>

        <div ref={refClaim} className="reveal reveal-d2">
          <div style={{ width: '36px', height: '1px', backgroundColor: '#B8756B', opacity: 0.6, marginBottom: '22px' }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#F0E1DA', lineHeight: 1.5 }}>
            Porque hay momentos que suceden una sola vez.<br />Y merecen volver a sentirse.
          </p>
        </div>
      </div>
    </section>
  )
}