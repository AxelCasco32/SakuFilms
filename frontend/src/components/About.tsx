import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'

// ── Carousel infinito ────────────────────────────────────────────────────────
const carouselImages = [
  { url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=560&h=740&fit=crop&auto=format', alt: 'Pareja fotografiando globos en Capadocia' },
  { url: 'https://images.unsplash.com/photo-1781945910800-52a0030b5637?w=560&h=740&fit=crop&auto=format', alt: 'Fotógrafo capturando a mujer en campo de flores' },
  { url: 'https://images.unsplash.com/photo-1610112839947-5664d10bab30?w=560&h=740&fit=crop&auto=format', alt: 'Pareja sentada sobre rocas' },
  { url: 'https://images.unsplash.com/photo-1735052712464-9d24b69be5f5?w=560&h=740&fit=crop&auto=format', alt: 'Novios en camino entre árboles' },
  { url: 'https://images.unsplash.com/flagged/photo-1575390130069-b4b76d648af7?w=560&h=740&fit=crop&auto=format', alt: 'Videógrafo filmando a pareja' },
  { url: 'https://images.unsplash.com/photo-1606217239582-d9f72323bcd7?w=560&h=740&fit=crop&auto=format', alt: 'Novios en la ciudad' },
]

const N = carouselImages.length
const EXTENDED = [...carouselImages, ...carouselImages, ...carouselImages]

function InfiniteCarousel() {
  const [rawIdx, setRawIdx] = useState(N)
  const [animated, setAnimated] = useState(true)
  const [cardStep, setCardStep] = useState(286)
  const [hinted, setHinted] = useState(false)

  const firstCardRef = useRef<HTMLDivElement>(null)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pausedRef = useRef(false)
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (firstCardRef.current) setCardStep(firstCardRef.current.offsetWidth + 16)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const goNext = useCallback(() => setRawIdx((i) => i + 1), [])
  const goPrev = useCallback(() => setRawIdx((i) => i - 1), [])

  const handleTransitionEnd = () => {
    if (rawIdx >= N * 2) { setAnimated(false); setRawIdx(N) }
    else if (rawIdx < N) { setAnimated(false); setRawIdx(N * 2 - 1) }
  }

  useEffect(() => {
    if (!animated) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)))
      return () => cancelAnimationFrame(raf)
    }
  }, [animated])

  useEffect(() => {
    autoRef.current = setInterval(() => { if (!pausedRef.current) goNext() }, 3800)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [goNext])

  const pauseAuto = () => { pausedRef.current = true }
  const resumeAuto = () => { pausedRef.current = false }

  const onTouchStart = (e: React.TouchEvent) => {
    pauseAuto()
    setHinted(true)
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }
  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }
  const onTouchEnd = () => {
    if (touchDeltaX.current < -40) goNext()
    else if (touchDeltaX.current > 40) goPrev()
    touchDeltaX.current = 0
    resumeAuto()
  }

  const translate = -(rawIdx * cardStep)
  const dotIdx = ((rawIdx % N) + N) % N

  return (
    <div onMouseEnter={pauseAuto} onMouseLeave={resumeAuto}>
      <div className="flex items-end justify-between mb-6">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-blush font-medium">
          Nuestra Historia
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            aria-label="Anterior"
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-petal"
            style={{ borderColor: 'rgba(184,117,107,0.4)', color: '#4A2E27', cursor: 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Siguiente"
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-petal"
            style={{ borderColor: 'rgba(184,117,107,0.4)', color: '#4A2E27', cursor: 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-hidden" style={{ cursor: 'grab' }}>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            transform: `translateX(${translate}px)`,
            transition: animated ? 'transform 0.72s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            willChange: 'transform',
          }}
          onTransitionEnd={handleTransitionEnd}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {EXTENDED.map((img, i) => {
            const realI = i % N
            const isActive = realI === dotIdx && Math.abs(i - rawIdx) < N
            return (
              <div
                key={i}
                ref={i === 0 ? firstCardRef : undefined}
                style={{
                  flexShrink: 0,
                  width: 'clamp(170px, 24vw, 272px)',
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  backgroundColor: '#EDD9D3',
                  opacity: isActive ? 1 : 0.68,
                  transform: isActive ? 'scale(1)' : 'scale(0.965)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  draggable={false}
                  className="w-full h-full object-cover"
                  style={{ transition: 'transform 0.7s ease', userSelect: 'none' }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-[6px]">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setRawIdx(N + i)}
              aria-label={`Imagen ${i + 1}`}
              style={{
                width: dotIdx === i ? '22px' : '6px',
                height: '5px',
                borderRadius: '3px',
                background: dotIdx === i ? '#B8756B' : 'rgba(184,117,107,0.28)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.35s ease, background 0.35s ease',
              }}
            />
          ))}
        </div>

        <span
          className="md:hidden font-sans text-[10px] tracking-[0.18em] uppercase text-blush flex items-center gap-1.5"
          style={{ opacity: hinted ? 0 : 0.6, transition: 'opacity 0.6s ease', pointerEvents: 'none' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8.5 3.5L12 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Deslizar
        </span>
      </div>
    </div>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="bg-cream text-earth">
      {/* ─── BLOCK 1 · Lo Efímero (ilustración como fondo) ────────────────── */}
      <div className="relative overflow-hidden">

        {/* Fondo: PNG transparente que ocupa gran parte del bloque */}
        <img
          src="/diseño.png"
          alt="Ilustración acuarela de cerezo sakura floreciente sobre roca"
          className="absolute left-0 bottom-0 h-full w-full md:w-[50%] object-cover opacity-25 md:opacity-100 pointer-events-none select-none"
          style={{
            // Ajusta el encuadre: 'center bottom' muestra la base/roca, 'center 30%' muestra más copa
            objectPosition: 'center 55%',
            animation: 'sakuraBreath 14s ease-in-out infinite',
            transformOrigin: 'center bottom',
            filter: 'saturate(1.06) brightness(0.98)',
            // Desvanece el borde derecho para que se funda con el fondo y el texto
            WebkitMaskImage: 'linear-gradient(to right, #000 78%, transparent 100%)',
            maskImage: 'linear-gradient(to right, #000 78%, transparent 100%)',
          }}
        />

        <div
          className="absolute bottom-5 left-5 px-3 py-1.5 z-10"
          style={{ backgroundColor: 'rgba(74,46,39,0.62)', backdropFilter: 'blur(6px)' }}
        >
          <span className="text-cream font-sans text-[9px] tracking-[0.24em] uppercase font-medium">
            Saku Films
          </span>
        </div>

        <section className="relative max-w-[1320px] mx-auto px-6 md:px-12 pt-8 md:pt-10 pb-6 md:pb-8 md:min-h-[680px] flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full">

          {/* Texto sobre la mitad derecha */}
          <div className="relative flex flex-col justify-center md:col-start-2">

            <div className="relative">
              <p className="font-sans text-[10px] tracking-[0.38em] uppercase text-rose font-medium mb-7">
                Nosotros
              </p>

              <h2
                className="font-serif text-earth mb-10"
                style={{
                  fontSize: 'clamp(2.6rem, 4.4vw, 3.8rem)',
                  fontWeight: 400,
                  lineHeight: 1.04,
                  letterSpacing: '-0.01em',
                  fontOpticalSizing: 'auto',
                } as React.CSSProperties}
              >
                Lo efímero<br />
                <em style={{ fontStyle: 'italic' }}>se vuelve eterno</em>
              </h2>

              <div className="w-9 h-px bg-blush mb-10" style={{ opacity: 0.5 }} />

              <div
                className="font-sans text-earth"
                style={{
                  fontSize: '13.5px',
                  lineHeight: 1.9,
                  opacity: 0.8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.35rem',
                }}
              >
                <p>
                  Saku nace de la belleza efímera del Sakura. No es solo una inspiración estética.
                  Es un símbolo, un concepto que atraviesa nuestra manera de mirar:{' '}
                  <em className="font-serif" style={{ fontSize: '15px', opacity: 1 }}>
                    lo efímero se vuelve eterno.
                  </em>
                </p>
                <p>
                  Contamos historias desde adentro. Nos acercamos a cada pareja para descubrir sus
                  gestos, sus vínculos y esos pequeños momentos que hacen que su historia sea
                  verdaderamente propia.
                </p>
                <p>
                  No hacemos films en serie. Creamos relatos audiovisuales sensibles, personalizados
                  y con identidad, para que cada película sea tan única y auténtica como la historia
                  que cuenta.
                </p>
                <p style={{ fontWeight: 500, opacity: 1 }}>
                  Porque hay momentos que suceden una sola vez. Y merecen volver a sentirse.
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>
      </div>

      {/* hairline divider */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="w-full h-px" style={{ background: 'rgba(201,143,135,0.18)' }} />
      </div>

      {/* ─── BLOCK 2 · Una Dupla Creativa ────────────────────────────────── */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 pt-6 md:pt-8 pb-8 md:pb-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start mb-8 md:mb-12">

          <div className="flex flex-col justify-center">
            <p className="font-sans text-[10px] tracking-[0.38em] uppercase text-rose font-medium mb-7">
              Los Fundadores
            </p>
            <h3
              className="font-serif text-earth mb-10"
              style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.7rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontOpticalSizing: 'auto',
              } as React.CSSProperties}
            >
              Una dupla<br />creativa
            </h3>
            <div className="w-9 h-px bg-blush mb-10" style={{ opacity: 0.5 }} />
            <div
              className="font-sans text-earth"
              style={{
                fontSize: '13.5px',
                lineHeight: 1.9,
                opacity: 0.8,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.35rem',
              }}
            >
              <p>
                Somos Erica y Matías, una dupla creativa especializada en bodas. Trabajamos juntos
                en cada proyecto, desde la mirada inicial hasta la edición final, construyendo una
                narrativa propia.
              </p>
              <p>
                Nuestra experiencia trabajando en edición de bodas para clientes internacionales nos
                permitió desarrollar una mirada narrativa y un criterio audiovisual que llevamos a
                cada historia.
              </p>
              <p>
                No pensamos la boda solo desde el registro.{' '}
                <span style={{ fontWeight: 600, opacity: 1 }}>Pensamos cómo contarla.</span>
              </p>
              <p>
                Observamos los vínculos, los gestos, las emociones y esos momentos que muchas veces
                suceden lejos de la mirada de una cámara. Cada elección —una imagen, un corte, un
                sonido, un silencio— tiene un sentido dentro del relato.
              </p>
              <p
                className="font-serif"
                style={{
                  fontSize: '15.5px',
                  lineHeight: 1.55,
                  fontStyle: 'italic',
                  opacity: 0.92,
                  paddingTop: '0.3rem',
                }}
              >
                "Porque no queremos hacer una película sobre una boda. Queremos contar la historia
                de quienes la están viviendo."
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-petal w-[80%] ml-auto">
            <img
              src="/diseño_2.jpg"
              alt="Erica y Matías, fundadores de SAKU Films"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-2/5"
              style={{ background: 'linear-gradient(to top, rgba(74,46,39,0.14), transparent)' }}
            />
            <div
              className="absolute bottom-5 right-5 px-3 py-1.5"
              style={{ backgroundColor: 'rgba(240,225,218,0.9)', backdropFilter: 'blur(6px)' }}
            >
              <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-earth font-medium">
                Erica &amp; Matías
              </span>
            </div>
          </div>
        </div>

        <InfiniteCarousel />
      </section>
    </div>
  )
}