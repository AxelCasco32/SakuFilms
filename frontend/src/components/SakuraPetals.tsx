import { useMemo } from 'react'

const COLORS = ['#DDB4AB', '#C98F87', '#E8D4CE', '#B8756B', '#DDB4AB']

function Petal({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 24 30" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="7" ry="11" fill={color} opacity="0.75" />
      <ellipse cx="12" cy="14" rx="5" ry="9" fill={color} opacity="0.45" transform="rotate(28 12 14)" />
    </svg>
  )
}

export default function SakuraPetals() {
  const petals = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => {
      const duration = 11 + Math.random() * 14
      // Delay NEGATIVO: hace que el navegador arranque la animación como si ya
      // llevara corriendo un tiempo random. Así, en el primer frame, los pétalos
      // ya están repartidos en distintos puntos de su caída (no todos arriba
      // esperando su turno) — se evita el "amontonamiento" al cargar la página.
      const delay = -(Math.random() * duration)

      return {
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        size: 7 + Math.floor(Math.random() * 9),
        dx: `${(Math.random() - 0.5) * 140}px`,
        r0: `${(Math.random() - 0.5) * 80}deg`,
        r1: `${(Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 300)}deg`,
        po: `${0.35 + Math.random() * 0.4}`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
    })
  , [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 9 }} aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: p.left,
            animationName: 'petalFall',
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            '--dx': p.dx,
            '--r0': p.r0,
            '--r1': p.r1,
            '--po': p.po,
          } as React.CSSProperties}
        >
          <Petal color={p.color} size={p.size} />
        </div>
      ))}
    </div>
  )
}