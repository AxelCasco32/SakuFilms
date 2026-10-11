import { useEffect, useRef, useState } from 'react'
import { resolveImg } from '../hooks/useFilms'

type Props = {
  images: string[]
  title: string
  subtitle: string
  category: string
  onClose: () => void
}

const SERIF = "'Cormorant Garamond', serif"
const SANS = "'Manrope', sans-serif"

const iconBtn: React.CSSProperties = {
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '1px solid rgba(240,225,218,0.35)',
  borderRadius: '50%',
  color: '#F0E1DA',
  cursor: 'pointer',
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" />
    </svg>
  )
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      style={{ transform: direction === 'right' ? 'rotate(180deg)' : undefined }}
    >
      <path d="m14.5 5-7 7 7 7M7.5 12H20" fill="none" stroke="currentColor" />
    </svg>
  )
}

export default function PhotoLightbox({ images, title, subtitle, category, onClose }: Props) {
  const [index, setIndex] = useState(0)
  const touchStart = useRef<number | null>(null)

  const previous = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [images.length, onClose])

  if (images.length === 0) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotografías de ${title}`}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return
        const distance = e.changedTouches[0].clientX - touchStart.current
        if (Math.abs(distance) > 45) distance > 0 ? previous() : next()
        touchStart.current = null
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(38,24,20,0.96)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Barra superior */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px clamp(16px, 4vw, 40px)',
          fontFamily: SANS,
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          color: 'rgba(240,225,218,0.75)',
        }}
      >
        <span>
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
        <button onClick={onClose} aria-label="Cerrar galería" style={iconBtn}>
          <CloseIcon />
        </button>
      </div>

      {/* Imagen */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 clamp(56px, 8vw, 110px)',
        }}
      >
        <img
          key={images[index]}
          src={resolveImg(images[index])}
          alt={`${title}, fotografía ${index + 1}`}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Flechas */}
      {images.length > 1 && (
        <>
          <button
            onClick={previous}
            aria-label="Fotografía anterior"
            style={{ ...iconBtn, position: 'absolute', left: 'clamp(8px, 2vw, 28px)', top: '50%', transform: 'translateY(-50%)' }}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            onClick={next}
            aria-label="Fotografía siguiente"
            style={{ ...iconBtn, position: 'absolute', right: 'clamp(8px, 2vw, 28px)', top: '50%', transform: 'translateY(-50%)' }}
          >
            <ArrowIcon direction="right" />
          </button>
        </>
      )}

      {/* Pie */}
      <div style={{ padding: '20px clamp(16px, 4vw, 40px) 28px', textAlign: 'center' }}>
        <div style={{ fontFamily: SANS, fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DDB4AB', marginBottom: 6 }}>
          {category}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 500, color: '#F0E1DA', lineHeight: 1.2 }}>
          {title}
        </div>
        <div style={{ fontFamily: SANS, fontSize: '0.7rem', color: 'rgba(240,225,218,0.65)', marginTop: 4 }}>
          {subtitle}
        </div>
      </div>
    </div>
  )
}