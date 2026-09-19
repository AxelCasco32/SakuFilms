import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useFilms, resolveImg } from '../hooks/useFilms'
import VideoModal from './VideoModal'

const AUTOPLAY_INTERVAL_MS = 4000
const LOOP_COPIES = 3 // triplicamos la lista para poder "engañar" el scroll y que el loop se sienta infinito

export default function FilmsCarousel() {
  const { films } = useFilms()
  const total = films.length

  // Copiamos la lista 3 veces: [copia A][copia B][copia C]. Arrancamos siempre
  // parados en la copia del medio, así hay margen para "saltar" sin que se note
  // tanto si el usuario sigue scrolleando/swipeando hacia cualquier lado.
  const loopedFilms = total > 0
    ? Array.from({ length: LOOP_COPIES * total }, (_, i) => films[i % total])
    : []

  const [activeIndex, setActiveIndex] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [openVideoUrl, setOpenVideoUrl] = useState<string | null>(null)

  const titleRef = useScrollReveal<HTMLDivElement>()
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const isPaused = useRef(false) // mouse encima (desktop)
  const isInteracting = useRef(false) // el usuario está scrolleando/swipeando ahora mismo

  function scrollToIndex(idx: number, smooth = true) {
    const track = trackRef.current
    const item = itemRefs.current[idx]
    if (!track || !item) return
    track.scrollTo({ left: item.offsetLeft, behavior: smooth ? 'smooth' : 'auto' })
  }

  // Al cargar los films (o cambiar la cantidad), arrancamos parados en la copia
  // del medio, en la primera pieza real — sin animación, es instantáneo.
  useEffect(() => {
    if (total === 0) return
    setActiveIndex(total)
    requestAnimationFrame(() => scrollToIndex(total, false))
  }, [total])

  function next() {
    setActiveIndex((a) => {
      const n = a + 1
      scrollToIndex(n)
      return n
    })
  }

  function prev() {
    setActiveIndex((a) => {
      const n = a - 1
      scrollToIndex(n)
      return n
    })
  }

  // Avance automático. Se pausa con el mouse encima o mientras el usuario
  // está scrolleando/swipeando manualmente.
  useEffect(() => {
    if (total <= 1) return
    const id = setInterval(() => {
      if (!isPaused.current && !isInteracting.current) next()
    }, AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(id)
  }, [total])

  // Detecta cuándo el scroll (autoplay, flechas, o el dedo del usuario) se
  // asienta en una pieza, y si esa pieza quedó en la copia de los extremos,
  // la reubica sin animación en la copia del medio — así el loop nunca se
  // "termina", sea cual sea la dirección en la que se siga moviendo.
  useEffect(() => {
    const track = trackRef.current
    if (!track || total === 0) return
    let settleTimeout: ReturnType<typeof setTimeout>

    function handleScroll() {
      isInteracting.current = true
      clearTimeout(settleTimeout)
      settleTimeout = setTimeout(() => {
        const items = itemRefs.current
        let closest = 0
        let minDiff = Infinity
        items.forEach((el, idx) => {
          if (!el || !track) return
          const diff = Math.abs(el.offsetLeft - track.scrollLeft)
          if (diff < minDiff) {
            minDiff = diff
            closest = idx
          }
        })
        setActiveIndex(closest)

        if (closest < total || closest >= total * 2) {
          const target = total + (closest % total)
          requestAnimationFrame(() => {
            scrollToIndex(target, false)
            setActiveIndex(target)
          })
        }
        isInteracting.current = false
      }, 150)
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', handleScroll)
      clearTimeout(settleTimeout)
    }
  }, [total])

  const displayIndex = total > 0 ? ((activeIndex % total) + total) % total : 0

  return (
    <section
      style={{
        backgroundColor: '#E8D4CE',
        padding: 'clamp(60px, 10vw, 120px) 0',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .saku-films-track::-webkit-scrollbar { display: none; }
      `}</style>

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

      {/* Carousel track: scroll nativo, así el swipe en mobile funciona solo */}
      <div
        ref={trackRef}
        className="saku-films-track"
        onMouseEnter={() => { isPaused.current = true }}
        onMouseLeave={() => { isPaused.current = false }}
        onTouchStart={() => { isPaused.current = true }}
        onTouchEnd={() => { isPaused.current = false }}
        style={{
          display: 'flex',
          gap: '20px',
          position: 'relative',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: 'clamp(24px, 8vw, 100px)',
          paddingRight: '40px',
        }}
      >
        {loopedFilms.map((film, i) => {
          const isHovered = hovered === i
          return (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setOpenVideoUrl(film.videoUrl || '')}
              style={{
                flexShrink: 0,
                width: 'clamp(280px, 30vw, 360px)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                scrollSnapAlign: 'start',
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
          {displayIndex + 1} / {total}
        </span>
      </div>

      {openVideoUrl !== null && (
        <VideoModal videoUrl={openVideoUrl} onClose={() => setOpenVideoUrl(null)} />
      )}
    </section>
  )
}