import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Film, FILM_CATEGORIES } from '../models/Film.js'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Solo se permiten imágenes'))
  },
})

export const filmsRouter = Router()

// Público: categorías válidas (para armar el <select> del admin sin hardcodearlas dos veces)
filmsRouter.get('/categories', (_req, res) => {
  res.json(FILM_CATEGORIES)
})

// Público: listar films, ordenados por "position" (usado por el carousel Y por la sección Films)
filmsRouter.get('/', async (_req, res) => {
  const films = await Film.find().sort({ position: 1, createdAt: 1 })
  res.json(films)
})

// Admin: crear film (multipart/form-data, campo "image" para el archivo)
filmsRouter.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const { couple, location, category, year, position, videoUrl } = req.body

  if (!couple || !location || !category || !year) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }
  if (!FILM_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Categoría inválida' })
  }

  let img = req.body.img || ''
  if (req.file) img = `/uploads/${req.file.filename}`
  if (!img) return res.status(400).json({ error: 'Falta la imagen' })

  const film = await Film.create({
    couple,
    location,
    category,
    year,
    img,
    videoUrl: videoUrl || '',
    position: Number(position) || 0,
  })
  res.status(201).json(film)
})

// Admin: editar film
filmsRouter.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  const existing = await Film.findById(req.params.id)
  if (!existing) return res.status(404).json({ error: 'No encontrado' })

  const { couple, location, category, year, position, videoUrl } = req.body
  if (category && !FILM_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Categoría inválida' })
  }

  let img = req.body.img || existing.img
  if (req.file) img = `/uploads/${req.file.filename}`

  existing.couple = couple ?? existing.couple
  existing.location = location ?? existing.location
  existing.category = category ?? existing.category
  existing.year = year ?? existing.year
  existing.img = img
  existing.videoUrl = videoUrl ?? existing.videoUrl
  existing.position = position !== undefined ? Number(position) : existing.position
  await existing.save()

  res.json(existing)
})

// Admin: borrar film
filmsRouter.delete('/:id', requireAuth, async (req, res) => {
  const deleted = await Film.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'No encontrado' })
  res.status(204).end()
})
