import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { v2 as cloudinary } from 'cloudinary'
import CarouselPhoto from '../models/CarouselPhoto.js'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')

// Igual que films.js: con CLOUDINARY_URL sube a Cloudinary; sin ella (local) guarda en /uploads
const cloudinaryEnabled = Boolean(process.env.CLOUDINARY_URL)
if (cloudinaryEnabled) cloudinary.config({ secure: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, cloudinaryEnabled ? os.tmpdir() : uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 40 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Solo se permiten imágenes'))
  },
})

// Devuelve { url, publicId } del archivo subido
async function saveFile(file) {
  if (!cloudinaryEnabled) return { url: `/uploads/${file.filename}`, publicId: '' }
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'saku/carousel',
      resource_type: 'image',
    })
    return { url: result.secure_url, publicId: result.public_id }
  } finally {
    await fs.unlink(file.path).catch(() => {})
  }
}

const carouselRouter = Router()

// Público: lo consume About.tsx
carouselRouter.get('/', async (_req, res) => {
  try {
    const photos = await CarouselPhoto.find().sort({ position: 1, createdAt: 1 })
    res.json(photos)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al leer el carrusel' })
  }
})

// Admin: agregar fotos, cada una con su propio destino
//   photos        -> archivos
//   destinations  -> JSON ["Japón", "Grecia", ...] en el mismo orden que los archivos
//   links         -> JSON [{ "url": "https://...", "destination": "Japón" }, ...]
const parseJson = (value, fallback) => {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

carouselRouter.post('/', requireAuth, upload.array('photos', 40), async (req, res) => {
  try {
    const destinations = parseJson(req.body.destinations, [])
    const links = parseJson(req.body.links, [])

    const saved = await Promise.all((req.files ?? []).map(saveFile))
    const items = saved.map((file, i) => ({
      ...file,
      destination: String(destinations[i] ?? '').trim(),
    }))

    for (const link of Array.isArray(links) ? links : []) {
      const url = String(link?.url ?? '').trim()
      if (!/^https?:\/\/\S+$/.test(url)) continue
      items.push({ url, publicId: '', destination: String(link?.destination ?? '').trim() })
    }

    if (!items.length) return res.status(400).json({ error: 'No se recibieron fotos' })

    const last = await CarouselPhoto.findOne().sort({ position: -1 })
    let pos = last ? last.position + 1 : 0
    const created = await CarouselPhoto.insertMany(items.map((i) => ({ ...i, position: pos++ })))
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al guardar las fotos' })
  }
})

// Admin: cambiar el destino de una foto
carouselRouter.put('/:id', requireAuth, async (req, res) => {
  try {
    const destination = String(req.body.destination ?? '').trim()
    const photo = await CarouselPhoto.findByIdAndUpdate(
      req.params.id,
      { destination },
      { new: true },
    )
    if (!photo) return res.status(404).json({ error: 'No encontrada' })
    res.json(photo)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al guardar el destino' })
  }
})

// Admin: quitar
carouselRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    const photo = await CarouselPhoto.findByIdAndDelete(req.params.id)
    if (!photo) return res.status(404).json({ error: 'No encontrada' })
    if (photo.publicId && cloudinaryEnabled) {
      await cloudinary.uploader.destroy(photo.publicId).catch(() => {})
    }
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al borrar' })
  }
})

export default carouselRouter