import { useEffect, useMemo, useRef, useState } from 'react'

type Filter = 'Todos' | 'Wedding Films' | 'Trailers' | 'Wedding Photography'

type PortfolioProject = {
  id: string
  names: string
  location?: string
  year?: string
  categories: Exclude<Filter, 'Todos'>[]
  type: 'video' | 'photography'
  cover: string
  images?: string[]
  videoUrl?: string
  size?: 'portrait' | 'landscape' | 'feature'
  position?: string
}

/* ───────────────────────── CONTENIDO ─────────────────────────
   Editá acá nombres, lugar y año de cada proyecto.
   Si location o year quedan vacíos, simplemente no se muestran. */

// Cloudinary: pide la imagen ya optimizada (formato y calidad automáticos, ancho limitado)
const cld = (url: string, width: number) => url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)

const youtubeEmbed = (id: string) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`

const GALLERY_PHOTOS = [
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747562/01.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747563/02.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747564/03.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747564/04.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747565/05.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747565/06.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747566/07.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747567/08.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747567/09.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747578/10.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747579/11.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747579/12.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747580/13.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747568/14.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747569/15.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747569/16.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747570/17.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747571/18.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747572/19.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747572/20.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747573/21.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747580/22.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747574/23.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747575/24.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747575/25.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747576/26.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747577/27.jpg',
]

const PROJECTS: PortfolioProject[] = [
  // Wedding Photography: una galería con las 27 fotos
  {
    id: 'galeria-bodas',
    names: 'Galería de bodas',
    categories: ['Wedding Photography'],
    type: 'photography',
    cover: cld(GALLERY_PHOTOS[0], 1600),
    images: GALLERY_PHOTOS.map((url) => cld(url, 2000)),
  },

  // Trailers: ambos videos aparecen también en Wedding Films
  {
    id: 'trailer-01',
    names: 'Fiesta   Nina & Iñigo',
    categories: ['Wedding Films', 'Trailers'],
    type: 'video',
    cover: youtubeThumb('RM1jdGW5q18'),
    videoUrl: youtubeEmbed('RM1jdGW5q18'),
  },
  {
    id: 'trailer-02',
    names: 'First Look   Belen & Todd',
    categories: ['Wedding Films', 'Trailers'],
    type: 'video',
    cover: youtubeThumb('K9t3KPQXBbs'),
    videoUrl: youtubeEmbed('K9t3KPQXBbs'),
  },

  // Más videos: un proyecto puede estar en una o varias categorías. Ejemplo:
  // { id: 'film-01', names: 'Nombre & Nombre', location: 'Lugar', year: '2025',
  //   categories: ['Wedding Films'], type: 'video',
  //   cover: youtubeThumb('ID_DEL_VIDEO'), videoUrl: youtubeEmbed('ID_DEL_VIDEO') },
]

// Si un proyecto no define "size", se reparte en este patrón (filas de 7+5 / 5+7 columnas).
const SIZE_PATTERN: NonNullable<PortfolioProject['size']>[] = ['feature', 'landscape', 'portrait', 'feature']

const categoryOf = (project: PortfolioProject) => project.categories.join(' · ')

const metaOf = (project: PortfolioProject) => [project.location, project.year].filter(Boolean).join(' · ')

/* ───────────────────────── ICONOS ───────────────────────── */

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m9.25 7.6 7.1 4.4-7.1 4.4V7.6Z" fill="currentColor" />
    </svg>
  )
}

function GalleryIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="5.25" y="5.25" width="13.5" height="13.5" rx=".5" fill="none" stroke="currentColor" />
      <path d="m7.6 16 3.05-3.2 2.15 2 1.75-1.65 2.25 2.85M15.4 9.25h.01" fill="none" stroke="currentColor" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" />
    </svg>
  )
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg aria-hidden="true" className={direction === 'right' ? 'rotate' : ''} viewBox="0 0 24 24">
      <path d="m14.5 5-7 7 7 7M7.5 12H20" fill="none" stroke="currentColor" />
    </svg>
  )
}

/* ───────────────────────── MODALES ───────────────────────── */

function VideoModal({
  project,
  onClose,
}: {
  project: PortfolioProject | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!project) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div className="viewer video-viewer" role="dialog" aria-modal="true" aria-label={`Film de ${project.names}`}>
      <button className="viewer-close" onClick={onClose} aria-label="Cerrar vídeo">
        <CloseIcon />
      </button>
      <div className="video-shell">
        <iframe
          src={project.videoUrl}
          title={`Film de ${project.names}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <div className="viewer-caption">
          <p>{categoryOf(project)}</p>
          <h3>{project.names}</h3>
          <span>{metaOf(project)}</span>
        </div>
      </div>
    </div>
  )
}

function PhotoLightbox({
  project,
  onClose,
}: {
  project: PortfolioProject | null
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const touchStart = useRef<number | null>(null)
  const images = project?.images ?? []

  const previous = () => setIndex((current) => (current - 1 + images.length) % images.length)
  const next = () => setIndex((current) => (current + 1) % images.length)

  useEffect(() => setIndex(0), [project])

  useEffect(() => {
    if (!project) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [project, images.length, onClose])

  if (!project || images.length === 0) return null

  return (
    <div
      className="viewer photo-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`Fotografías de ${project.names}`}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return
        const distance = event.changedTouches[0].clientX - touchStart.current
        if (Math.abs(distance) > 45) distance > 0 ? previous() : next()
        touchStart.current = null
      }}
    >
      <div className="photo-topbar">
        <span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
        <button className="viewer-close" onClick={onClose} aria-label="Cerrar galería">
          <CloseIcon />
        </button>
      </div>
      <div className="photo-stage">
        <img key={images[index]} src={images[index]} alt={`${project.names}, fotografía ${index + 1}`} />
      </div>
      <button className="viewer-arrow arrow-left" onClick={previous} aria-label="Fotografía anterior">
        <ArrowIcon direction="left" />
      </button>
      <button className="viewer-arrow arrow-right" onClick={next} aria-label="Fotografía siguiente">
        <ArrowIcon direction="right" />
      </button>
      <div className="viewer-caption photo-caption">
        <p>Wedding Photography</p>
        <h3>{project.names}</h3>
        <span>{metaOf(project)}</span>
      </div>
    </div>
  )
}

/* ───────────────────────── TARJETA ───────────────────────── */

function ProjectCard({
  project,
  onOpen,
}: {
  project: PortfolioProject
  onOpen: (project: PortfolioProject) => void
}) {
  const action = project.type === 'video' ? 'Ver film' : 'Ver fotografías'
  const meta = metaOf(project)

  return (
    <article className={`project-card project-${project.size}`}>
      <button className="project-trigger" onClick={() => onOpen(project)} aria-label={`${action}: ${project.names}`}>
        <img
          src={project.cover}
          alt={project.names}
          loading="lazy"
          style={{ objectPosition: project.position }}
          onError={(event) => {
            // Si el video no tiene miniatura en máxima calidad, usa la estándar
            const img = event.currentTarget
            if (img.src.includes('maxresdefault')) img.src = img.src.replace('maxresdefault', 'hqdefault')
          }}
        />
        <span className="image-veil" />
        <span className="project-action">
          <span className="action-icon">
            {project.type === 'video' ? <PlayIcon /> : <GalleryIcon />}
          </span>
          <span>{action}</span>
        </span>
        <span className="project-details">
          <span className="project-category">{categoryOf(project)}</span>
          <span className="project-name">{project.names}</span>
          {meta && <span className="project-meta">{meta}</span>}
        </span>
      </button>
    </article>
  )
}

/* ───────────────────────── SECCIÓN ───────────────────────── */

const filters: Filter[] = ['Todos', 'Wedding Films', 'Trailers', 'Wedding Photography']

export default function Films() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Todos')
  const [videoProject, setVideoProject] = useState<PortfolioProject | null>(null)
  const [photoProject, setPhotoProject] = useState<PortfolioProject | null>(null)

  const filteredProjects = useMemo(
    () =>
      (activeFilter === 'Todos' ? PROJECTS : PROJECTS.filter((project) => project.categories.includes(activeFilter))).map(
        (project, i) => ({ ...project, size: project.size || SIZE_PATTERN[i % SIZE_PATTERN.length] }),
      ),
    [activeFilter],
  )

  const openProject = (project: PortfolioProject) => {
    if (project.type === 'video') setVideoProject(project)
    else setPhotoProject(project)
  }

  return (
    <main id="films">
      <section className="portfolio-section" aria-labelledby="portfolio-heading">
        <header className="section-header">
          <div className="eyebrow-row">
            <span className="eyebrow">Photography & Films</span>
          </div>
          <div className="title-row">
            <h1 id="portfolio-heading">Historias que merecen<br />volver a vivirse.</h1>
          </div>
        </header>

        <nav className="filter-list" aria-label="Filtrar proyectos">
          {filters.map((filter) => (
            <button
              key={filter}
              className={filter === activeFilter ? 'filter-active' : ''}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={filter === activeFilter}
            >
              {filter}
            </button>
          ))}
        </nav>

        {/* Zona con scroll propio: al cambiar de filtro se reinicia arriba */}
        <div className="gallery-scroll" key={activeFilter} tabIndex={0} aria-label="Galería de proyectos">
          {filteredProjects.length === 0 ? (
            <p className="gallery-empty">Próximamente.</p>
          ) : (
            <div className="gallery-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={openProject} />
              ))}
            </div>
          )}
        </div>
      </section>

      <VideoModal project={videoProject} onClose={() => setVideoProject(null)} />
      <PhotoLightbox project={photoProject} onClose={() => setPhotoProject(null)} />
    </main>
  )
}