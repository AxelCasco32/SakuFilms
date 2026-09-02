import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useFilms, resolveImg } from '../hooks/useFilms'
import VideoModal from './VideoModal'

const AUTOPLAY_INTERVAL_MS = 4000

export default function FilmsCarousel() {
  const { films } = useFilms()
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [openVideoUrl, setOpenVideoUrl] = useState<string | null>(null)
  const titleRef = useScrollReveal<HTMLDivElement>()
  const isPaused = useRef(false)

  const prev = () => setActive((a) => Math.max(0, a - 1))
  const next = () => setActive((a) => (a + 1) % films.length)

  // Avance automático. Se pausa mientras el mouse está sobre una pieza.
  useEffect(() => {
    if (films.length <= 1) return
    const id = setInterval(() => {
      if (!isPaused.current) next()
    }, AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(id)
  }, [films.length])

  return (
    <section
      style={{
        backgroundColor: '#E8D4CE',
        padding: 'clamp(60px, 10vw, 120px) 0',
        overflow: 'hidden',
      }}
    >
      <div
        ref={titleRef}
        className="reveal"
        style={{ padding: '0 clamp(24px, 8vw, 100px)', marginBottom: 'clamp(32px, 5vw, 60px)' }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            color: '#69483F',
            lineHeight: 1.2,
            marginBottom: '10px',
          }}
        >
          Films que vuelven a sentirse.
        </h2>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 300,
            fontSize: '0.82rem',
            color: '#69483F',
            opacity: 0.65,
            letterSpacing: '0.04em',
          }}
        >
          Historias reales contadas desde adentro.
        </p>
      </div>

      {/* Carousel track */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => { isPaused.current = true }}
        onMouseLeave={() => { isPaused.current = false }}
      >
        <div
          style={{
            display: 'flex',
            gap: '20px',
            paddingLeft: 'clamp(24px, 8vw, 100px)',
            paddingRight: '40px',
            transform: `translateX(calc(-${active * 340}px))`,
            transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {films.map((film, i) => {
            const isHovered = hovered === i
            const key = film._id || film.id
            return (
              <div
                key={key}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setOpenVideoUrl(film.videoUrl || '')}
                style={{
                  flexShrink: 0,
                  width: 'clamp(280px, 30vw, 360px)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#DDB4AB',
                  }}
                >
                  <img
                    src={resolveImg(film.img)}
                    alt={`${film.couple} — ${film.location}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease',
                    }}
                  />
                  {/* Hover overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(105,72,63,0.45)',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.6rem',
                        color: '#fff',
                        fontWeight: 400,
                        textAlign: 'center',
                        padding: '0 20px',
                      }}
                    >
                      {film.couple}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.6rem',
                        color: 'rgba(255,255,255,0.8)',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Ver film
                    </span>
                  </div>
                </div>

                <div style={{ paddingTop: '16px' }}>
                  <div
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '0.58rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#B8756B',
                      marginBottom: '6px',
                    }}
                  >
                    {film.category} · {film.year}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.4rem',
                      fontWeight: 500,
                      color: '#69483F',
                      lineHeight: 1.2,
                      marginBottom: '4px',
                    }}
                  >
                    {film.couple}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '0.72rem',
                      color: '#69483F',
                      opacity: 0.6,
                    }}
                  >
                    {film.location}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          padding: '40px clamp(24px, 8vw, 100px) 0',
          alignItems: 'center',
        }}
      >
        <button
          onClick={prev}
          disabled={active === 0}
          style={{
            width: '44px',
            height: '44px',
            border: '1px solid #69483F',
            background: 'none',
            cursor: active === 0 ? 'default' : 'pointer',
            opacity: active === 0 ? 0.3 : 1,
            transition: 'opacity 0.3s ease',
            color: '#69483F',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Anterior"
        >
          ←
        </button>
        <button
          onClick={next}
          style={{
            width: '44px',
            height: '44px',
            border: '1px solid #69483F',
            background: 'none',
            cursor: 'pointer',
            color: '#69483F',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Siguiente"
        >
          →
        </button>
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            color: '#69483F',
            opacity: 0.5,
          }}
        >
          {active + 1} / {films.length}
        </span>
      </div>

      {openVideoUrl !== null && (
        <VideoModal videoUrl={openVideoUrl} onClose={() => setOpenVideoUrl(null)} />
      )}
    </section>
  )
}
