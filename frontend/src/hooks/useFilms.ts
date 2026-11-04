import { useEffect, useState } from 'react'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export type Film = {
  _id?: string
  id?: string | number
  couple: string
  location: string
  // El backend devuelve un array (un proyecto puede estar en varias categorías)
  categories: string[]
  type?: 'video' | 'photography'
  year: string
  img: string
  // Solo Wedding Photography: fotos de la galería
  images?: string[]
  videoUrl?: string
  position?: number
}

// Placeholders de respaldo: se usan si el backend todavía no tiene films cargados o no está corriendo.
const FALLBACK_FILMS: Film[] = [
  { id: '01', couple: 'Lucía & Mateo', location: 'Buenos Aires', categories: ['Wedding Films'], year: '2024', img: 'https://images.unsplash.com/photo-1606216794050-6ff7db8cb43d?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
  { id: '02', couple: 'Emma & Julián', location: 'Mendoza', categories: ['Trailers'], year: '2024', img: 'https://images.unsplash.com/photo-1600270237614-d20aef1c8b14?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
  { id: '03', couple: 'Sofía & Tomás', location: 'Bariloche', categories: ['Wedding Films'], year: '2023', img: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
  { id: '04', couple: 'Clara & Martín', location: 'Tigre', categories: ['Trailers'], year: '2023', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
  { id: '05', couple: 'Ana & Lucas', location: 'Uruguay', categories: ['Wedding Films'], year: '2024', img: 'https://images.unsplash.com/photo-1721635513002-287a3a3b2fa1?w=800&h=1000&fit=crop&auto=format', videoUrl: '' },
]

export function filmCategories(film: Film) {
  return (film.categories ?? []).join(' · ')
}

export function resolveImg(img: string) {
  return img.startsWith('/uploads') ? `${API_URL}${img}` : img
}

// Un solo pedido al backend, compartido entre el carousel del home y la sección Films
let cache: Film[] | null = null
let pending: Promise<Film[] | null> | null = null

function loadFilms(): Promise<Film[] | null> {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = fetch(`${API_URL}/api/films`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Film[]) => (cache = data))
      .catch(() => {
        pending = null // permite reintentar en el próximo montaje
        return null
      })
  }
  return pending
}

/**
 * Todos los proyectos cargados en el panel admin (videos y fotografía), ordenados por "position".
 * films es null mientras carga o si el backend no responde.
 */
export function useAllFilms() {
  const [films, setFilms] = useState<Film[] | null>(cache)
  const [loaded, setLoaded] = useState(cache !== null)

  useEffect(() => {
    let alive = true
    loadFilms().then((data) => {
      if (!alive) return
      setFilms(data)
      setLoaded(true)
    })
    return () => {
      alive = false
    }
  }, [])

  return { films, loaded }
}

/**
 * Films del carousel del home: solo videos (Wedding Photography se ve en la sección Films).
 * Si el backend no tiene videos o no responde, se muestran los placeholders.
 */
export function useFilms() {
  const { films: all, loaded } = useAllFilms()
  const videos = (all ?? []).filter((film) => film.type !== 'photography')
  return { films: videos.length > 0 ? videos : FALLBACK_FILMS, loaded }
}
