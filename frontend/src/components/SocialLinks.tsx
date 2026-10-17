import { useSettings } from '../hooks/useSettings'

const NETWORKS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'vimeo', label: 'Vimeo' },
] as const

export default function SocialLinks() {
  const settings = useSettings()
  const links = NETWORKS.filter((n) => settings[n.key])

  if (links.length === 0) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
      {links.map((n) => (
        <a
          key={n.key}
          href={settings[n.key]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#69483F',
            textDecoration: 'none',
          }}
        >
          {n.label}
        </a>
      ))}
    </div>
  )
}