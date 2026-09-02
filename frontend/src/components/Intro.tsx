import { useEffect, useState } from 'react'

interface IntroProps {
  onComplete: () => void
}

function SakuraBloom() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32" cy="17"
          rx="7" ry="13"
          fill="#DDB4AB"
          opacity="0.9"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      {[36, 108, 180, 252, 324].map((deg) => (
        <ellipse
          key={deg + 1000}
          cx="32" cy="21"
          rx="4" ry="8"
          fill="#C98F87"
          opacity="0.6"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="6" fill="#B8756B" />
      <circle cx="32" cy="32" r="3" fill="#69483F" opacity="0.5" />
    </svg>
  )
}

export default function Intro({ onComplete }: IntroProps) {
  const [phase, setPhase] = useState<'bloom' | 'text' | 'out'>('bloom')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 700)
    const t2 = setTimeout(() => setPhase('out'), 2100)
    const t3 = setTimeout(() => onComplete(), 2900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-5"
      style={{
        backgroundColor: '#F0E1DA',
        zIndex: 100,
        animation: phase === 'out' ? 'introOut 0.8s ease forwards' : undefined,
        pointerEvents: 'none',
      }}
    >
      <div style={{ animation: 'introBloom 0.8s cubic-bezier(0.34,1.36,0.64,1) forwards' }}>
        <SakuraBloom />
      </div>

      {phase !== 'bloom' && (
        <div
          style={{
            animation: 'introText 0.65s cubic-bezier(0.22,1,0.36,1) forwards',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: '2.2rem',
              letterSpacing: '0.28em',
              color: '#69483F',
              lineHeight: 1,
            }}
          >
            SAKU
          </div>
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              fontSize: '0.55rem',
              letterSpacing: '0.55em',
              color: '#C98F87',
              marginTop: '4px',
            }}
          >
            FILMS
          </div>
        </div>
      )}
    </div>
  )
}
