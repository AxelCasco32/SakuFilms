import { useEffect, useState } from 'react'

export type Settings = {
  whatsapp: string
  whatsappMessage: string
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
  vimeo: string
  destinationImage: string
}

const EMPTY: Settings = {
  whatsapp: '',
  whatsappMessage: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  youtube: '',
  vimeo: '',
  destinationImage: '',
}

// ADAPTAR: usá la misma variable de entorno que ya usás para llamar al backend
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

let cache: Settings | null = null
let pending: Promise<Settings> | null = null

function load(): Promise<Settings> {
  if (cache) return Promise.resolve(cache)

  if (!pending) {
    pending = fetch(`${API}/api/settings`)
      .then((r) => (r.ok ? r.json() : EMPTY))
      .catch(() => EMPTY)
      .then((data): Settings => {
        const settings: Settings = { ...EMPTY, ...data }
        cache = settings
        return settings
      })
  }

  return pending
}

// Igual que useSettings, pero avisa cuándo terminó de cargar (para no mostrar
// primero un valor por defecto y después cambiarlo, ej. una imagen de fondo)
export function useSettingsStatus(): { settings: Settings; loaded: boolean } {
  const [settings, setSettings] = useState<Settings>(cache ?? EMPTY)
  const [loaded, setLoaded] = useState(cache !== null)

  useEffect(() => {
    let alive = true
    load().then((s) => {
      if (!alive) return
      setSettings(s)
      setLoaded(true)
    })
    return () => {
      alive = false
    }
  }, [])

  return { settings, loaded }
}

export function useSettings(): Settings {
  return useSettingsStatus().settings
}