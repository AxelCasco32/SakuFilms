import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useFilms, resolveImg } from '../hooks/useFilms'
import VideoModal from './VideoModal'

const CATEGORIES = ['Todos', 'Wedding Films', 'Trailers', 'Highlights', 'Destination Weddings']

export default function Films() {
  const { films } = useFilms()
  const [cat, setCat] = useState('Todos')
  const [hovered, setHovered] = useState<number | null>(null)
  const [openVideoUrl, setOpenVideoUrl] = useState<string | null>(null)
  const titleRef = useScrollReveal<HTMLDivElement>()

  // Cada film cargado en el admin (para el carousel) trae su categoría,
  // así que esta grilla queda sincronizada automáticamente: mismo origen de datos.
  const filtered = cat === 'Todos' ? films : films.filter((w) => w.category === cat)

  return (
    <section
      id="films"
      style={{
        backgroundColor: '#69483F',
        padding: 'clamp(70px, 10vw, 130px) clamp(24px, 8vw, 100px)',
      }}
    >
      <div ref={titleRef} className="reveal" style={{ marginBottom: 'clamp(36px, 5vw, 60px)' }}>
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.58rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#DDB4AB',
            marginBottom: '16px',
          }}
        >
          Films
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
            color: '#F0E1DA',
            lineHeight: 1.2,
          }}
        >
          Historias que merecen<br />volver a vivirse.
        </h2>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '48px' }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.62rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '7px 18px',
              border: '1px solid',
              borderColor: cat === c ? '#DDB4AB' : 'rgba(221,180,171,0.3)',
              backgroundColor: cat === c ? '#DDB4AB' : 'transparent',
              color: cat === c ? '#69483F' : 'rgba(240,225,218,0.7)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2px',
        }}
      >
        {filtered.map((w, i) => {
          const key = w._id || w.id || i
          return (
            <div
              key={key}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setOpenVideoUrl(w.videoUrl || '')}
              style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#DDB4AB' }}
            >
              <img
                src={resolveImg(w.img)}
                alt={`${w.couple} — ${w.location}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: hovered === i ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(105,72,63,0.85) 0%, rgba(105,72,63,0.1) 50%, transparent 100%)',
                  opacity: hovered === i ? 1 : 0.7,
                  transition: 'opacity 0.5s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  transform: hovered === i ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DDB4AB', marginBottom: '6px' }}>
                  {w.category} · {w.year}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 500, color: '#F0E1DA', lineHeight: 1.2, marginBottom: '4px' }}>
                  {w.couple}
                </div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.7rem', color: 'rgba(240,225,218,0.65)' }}>
                  {w.location}
                </div>
                {hovered === i && (
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(240,225,218,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#F0E1DA', fontSize: '0.65rem', paddingLeft: '2px' }}>▶</span>
                    </div>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,225,218,0.75)' }}>Ver film</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {openVideoUrl !== null && (
        <VideoModal videoUrl={openVideoUrl} onClose={() => setOpenVideoUrl(null)} />
      )}
    </section>
  )
}
