function toYoutubeEmbed(url?: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?&]+)/,
    /(?:youtube\.com\/shorts\/)([^?&]+)/,
    /(?:youtube\.com\/embed\/)([^?&]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return `https://www.youtube.com/embed/${m[1]}`
  }
  return null
}

export default function VideoModal({ videoUrl, onClose }: { videoUrl?: string; onClose: () => void }) {
  const embed = toYoutubeEmbed(videoUrl)

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ position: 'relative', width: 'min(900px, 94vw)', aspectRatio: '16/9', backgroundColor: '#000' }}>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: '-40px',
            right: 0,
            background: 'transparent',
            border: 'none',
            color: '#F0E1DA',
            fontSize: '1.6rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        {embed ? (
          <iframe
            src={`${embed}?autoplay=1`}
            title="Video del film"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0E1DA', fontFamily: "'Manrope', sans-serif", fontSize: '0.9rem', padding: '20px', textAlign: 'center' }}>
            Este film todavía no tiene un video cargado.
          </div>
        )}
      </div>
    </div>
  )
}
