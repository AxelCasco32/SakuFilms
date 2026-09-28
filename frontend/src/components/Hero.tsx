/* Thin decorative line SVG components */
function HorizontalRule({ opacity = 0.35 }: { opacity?: number }) {
  return (
    <svg width="120" height="1" viewBox="0 0 120 1" aria-hidden="true">
      <line x1="0" y1="0.5" x2="120" y2="0.5" stroke="white" strokeWidth="0.6" opacity={opacity} />
    </svg>
  )
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden film-grain"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* Video de fondo — archivo propio en /public/hero.mp4, sin iframe de terceros */}
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Cinematic gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to bottom, rgba(4,2,8,0.45) 0%, rgba(4,2,8,0.12) 40%, rgba(4,2,8,0.18) 65%, rgba(4,2,8,0.62) 100%)',
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(4,2,8,0.22) 100%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="relative h-full flex flex-col items-center justify-center text-center px-8"
        style={{ color: '#fff' }}
      >
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 300,
            fontSize: '0.52rem',
            letterSpacing: '0.48em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '28px',
            animation: 'heroItem 1.1s cubic-bezier(0.22,1,0.36,1) 0.5s both',
          }}
        >
          Wedding Films &amp; Audiovisual
        </div>

        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '18px 32px',
            marginBottom: '36px',
            animation: 'heroItem 1.2s cubic-bezier(0.22,1,0.36,1) 0.1s both',
          }}
        >
          <div
            style={{
              fontFamily: "'Cocosharp', 'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              letterSpacing: '0.34em',
              color: '#fff',
              lineHeight: 1,
              textIndent: '0.34em',
            }}
          >
            SAKU
          </div>

          <div style={{ margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HorizontalRule opacity={0.28} />
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.38rem, 0.85vw, 0.58rem)',
                letterSpacing: '0.72em',
                textIndent: '0.72em',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              FILMS
            </span>
            <HorizontalRule opacity={0.28} />
          </div>
        </div>

        <div
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))',
            marginBottom: '32px',
            animation: 'heroItem 1s cubic-bezier(0.22,1,0.36,1) 0.65s both',
          }}
          aria-hidden="true"
        />

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(1.1rem, 3.8vw, 2.3rem)',
            lineHeight: 1.22,
            color: '#fff',
            maxWidth: '600px',
            marginBottom: '18px',
            animation: 'heroItem 1.1s cubic-bezier(0.22,1,0.36,1) 0.8s both',
          }}
        >
          Cada instante es irrepetible.<br />Cada historia, única.
        </h1>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(0.88rem, 1.7vw, 1.15rem)',
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.025em',
            animation: 'heroItem 1.1s cubic-bezier(0.22,1,0.36,1) 1.05s both',
          }}
        >
          Convertimos momentos irrepetibles en historias<br />a las que siempre podés volver
        </p>
      </div>

      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          color: 'rgba(255,255,255,0.38)',
          animation: 'heroItem 1s ease 2.2s both',
        }}
      >
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.48rem', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <div style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
            <line x1="6" y1="1" x2="6" y2="18" stroke="currentColor" strokeWidth="0.8" />
            <polyline points="2,13 6,18 10,13" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
    </section>
  )
}