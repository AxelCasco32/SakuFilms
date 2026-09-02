import { useEffect, useState } from 'react'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export type Film = {
  _id?: string
  id?: string | number
  couple: string
  location: string
  category: string
  year: string
  img: string
  videoUrl?: string
  position?: number
}

// Placeholders de respaldo: se usan si el backend todavía no tiene films cargados o no está corriendo.
const FALLBACK_FILMS: Film[] = [
  { id: '01', couple: 'Lucía & Mateo', location: 'Buenos Aires', category: 'Wedding Films', year: '2024', img: 'https://images.unsplash.com/photo-1606216794050-6ff7db8cb43d?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
  { id: '02', couple: 'Emma & Julián', location: 'Mendoza', category: 'Trailers', year: '2024', img: 'https://images.unsplash.com/photo-1600270237614-d20aef1c8b14?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
  { id: '03', couple: 'Sofía & Tomás', location: 'Bariloche', category: 'Destination Weddings', year: '2023', img: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
  { id: '04', couple: 'Clara & Martín', location: 'Tigre', category: 'Highlights', year: '2023', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
  { id: '05', couple: 'Ana & Lucas', location: 'Uruguay', category: 'Destination Weddings', year: '2024', img: 'https://images.unsplash.com/photo-1721635513002-287a3a3b2fa1?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
]

export function resolveImg(img: string) {
  return img.startsWith('/uploads') ? `${API_URL}${img}` : img
}

/**
 * Trae los films desde el backend. Un mismo film cargado en el panel admin
 * aparece acá para el carousel del home Y para la grilla categorizada de Films,
 * porque ambos componentes usan este mismo hook / la misma fuente de datos.
 */
export function useFilms() {
  const [films, setFilms] = useState<Film[]>(FALLBACK_FILMS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/films`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Film[]) => { if (data.length > 0) setFilms(data) })
      .catch(() => { /* sin conexión al backend: se mantienen los placeholders */ })
      .finally(() => setLoaded(true))
  }, [])

  return { films, loaded }
}
