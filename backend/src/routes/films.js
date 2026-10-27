import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { v2 as cloudinary } from 'cloudinary'
import { Film, FILM_CATEGORIES, PHOTO_CATEGORY } from '../models/Film.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')

// En Render el disco se borra en cada deploy/reinicio, así que las imágenes se guardan en Cloudinary.
// Se activa definiendo CLOUDINARY_URL (cloudinary://API_KEY:API_SECRET@CLOUD_NAME).
// Sin esa variable (desarrollo local) se siguen guardando en /uploads como antes.
const cloudinaryEnabled = Boolean(process.env.CLOUDINARY_URL)
if (cloudinaryEnabled) cloudinary.config({ secure: true })

const storage = multer.diskStorage({
  // Con Cloudinary el archivo pasa por la carpeta temporal y se borra después de subirlo
  destination: (_req, _file, cb) => cb(null, cloudinaryEnabled ? os.tmpdir() : uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 61 }, // 15MB por archivo
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Solo se permiten imágenes'))
  },
})

// "image" = portada (1 archivo) · "photos" = fotos de la galería (hasta 60)
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'photos', maxCount: 60 },
])

// Devuelve la ruta/URL final del archivo subido
async function saveFile(file) {
  if (!cloudinaryEnabled) return `/uploads/${file.filename}`
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder: 'saku', resource_type: 'image' })
    return result.secure_url
  } finally {
    await fs.unlink(file.path).catch(() => {})
  }
}

// Acepta un array, un JSON ('["a","b"]') o un texto separado por comas/saltos de línea
function toList(value, separator = /[\s,]+/) {
  if (value === undefined || value === null || value === '') return []
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  const text = String(value).trim()
  if (text.startsWith('[')) {
    try {
      return toList(JSON.parse(text))
    } catch {
      /* si no es JSON válido, se trata como texto */
    }
  }
  return text.split(separator).map((v) => v.trim()).filter(Boolean)
}

function youtubeId(url = '') {
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/)
  return match ? match[1] : null
}

function validateFilm({ couple, categories, videoUrl, img, images }) {
  if (!couple) return 'Falta el nombre o título'
  if (categories.length === 0) return 'Elegí al menos una categoría'
  if (categories.some((c) => !FILM_CATEGORIES.includes(c))) return 'Categoría inválida'

  const isPhoto = categories.includes(PHOTO_CATEGORY)
  if (isPhoto && categories.length > 1) {
    return 'Wedding Photography no se puede combinar con Wedding Films o Trailers'
  }
  if (isPhoto && images.length === 0) return 'Cargá al menos una fotografía'
  if (!isPhoto && !videoUrl) return 'Falta el link del video'
  if (!img) return 'Falta la imagen de portada'
  return null
}

export const filmsRouter = Router()

// Público: categorías válidas (para armar el <select> del admin sin hardcodearlas dos veces)
filmsRouter.get('/categories', (_req, res) => {
  res.json(FILM_CATEGORIES)
})

// Público: listar proyectos, ordenados por "position".
// El carousel del home usa solo los de type "video"; la galería usa todos.
filmsRouter.get('/', asyncHandler(async (_req, res) => {
  const films = await Film.find().sort({ position: 1, createdAt: 1 })
  res.json(films)
}))

// Admin: crear (multipart/form-data)
//   campos: couple, location, year, position, categories, videoUrl, imageUrls
//   archivos: image (portada), photos (galería)
filmsRouter.post('/', requireAuth, uploadFields, asyncHandler(async (req, res) => {
  const { couple, location = '', year = '', position, videoUrl = '' } = req.body
  const categories = toList(req.body.categories ?? req.body.category, /,/)
  const isPhoto = categories.includes(PHOTO_CATEGORY)

  const uploadedPhotos = await Promise.all((req.files?.photos ?? []).map(saveFile))
  const images = isPhoto ? [...uploadedPhotos, ...toList(req.body.imageUrls)] : []

  let img = req.body.img || ''
  if (req.files?.image?.[0]) img = await saveFile(req.files.image[0])
  if (!img && isPhoto) img = images[0] || ''
  if (!img && !isPhoto && youtubeId(videoUrl)) img = `https://i.ytimg.com/vi/${youtubeId(videoUrl)}/hqdefault.jpg`

  const error = validateFilm({ couple, categories, videoUrl: isPhoto ? '' : videoUrl, img, images })
  if (error) return res.status(400).json({ error })

  const film = await Film.create({
    couple,
    location,
    year,
    categories,
    img,
    images,
    videoUrl: isPhoto ? '' : videoUrl,
    position: Number(position) || 0,
  })
  res.status(201).json(film)
}))

// Admin: editar
//   keepImages: fotos actuales que se conservan (JSON o texto). Si no se envía, se conservan todas.
filmsRouter.put('/:id', requireAuth, uploadFields, asyncHandler(async (req, res) => {
  const existing = await Film.findById(req.params.id)
  if (!existing) return res.status(404).json({ error: 'No encontrado' })

  const { couple, location, year, position, videoUrl } = req.body
  const rawCategories = req.body.categories ?? req.body.category
  const categories = rawCategories !== undefined ? toList(rawCategories, /,/) : existing.categories
  const isPhoto = categories.includes(PHOTO_CATEGORY)

  const keptImages = req.body.keepImages !== undefined ? toList(req.body.keepImages) : existing.images
  const uploadedPhotos = await Promise.all((req.files?.photos ?? []).map(saveFile))
  const images = isPhoto ? [...keptImages, ...uploadedPhotos, ...toList(req.body.imageUrls)] : []

  const nextVideoUrl = isPhoto ? '' : videoUrl ?? existing.videoUrl
  const nextCouple = couple ?? existing.couple

  let img = req.body.img || existing.img
  if (req.files?.image?.[0]) img = await saveFile(req.files.image[0])
  if (!img && isPhoto) img = images[0] || ''

  const error = validateFilm({ couple: nextCouple, categories, videoUrl: nextVideoUrl, img, images })
  if (error) return res.status(400).json({ error })

  existing.couple = nextCouple
  existing.location = location ?? existing.location
  existing.year = year ?? existing.year
  existing.categories = categories
  existing.img = img
  existing.images = images
  existing.videoUrl = nextVideoUrl
  existing.position = position !== undefined ? Number(position) : existing.position
  await existing.save()

  res.json(existing)
}))

// Admin: borrar
filmsRouter.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  const deleted = await Film.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'No encontrado' })
  res.status(204).end()
}))