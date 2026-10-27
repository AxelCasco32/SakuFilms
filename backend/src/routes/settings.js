import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { v2 as cloudinary } from 'cloudinary'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', '..', 'uploads')

// Igual que films.js: con CLOUDINARY_URL sube a Cloudinary; sin ella (local) guarda en /uploads
const cloudinaryEnabled = Boolean(process.env.CLOUDINARY_URL)
if (cloudinaryEnabled) cloudinary.config({ secure: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, cloudinaryEnabled ? os.tmpdir() : uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Solo se permiten imágenes'))
  },
})

async function saveFile(file) {
  if (!cloudinaryEnabled) return `/uploads/${file.filename}`
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder: 'saku/settings', resource_type: 'image' })
    return result.secure_url
  } finally {
    await fs.unlink(file.path).catch(() => {})
  }
}

const router = Router()
const FIELDS = ['whatsapp', 'whatsappMessage', 'instagram', 'facebook', 'tiktok', 'youtube', 'vimeo', 'destinationImage']

const getSettings = () =>
  Settings.findOneAndUpdate(
    { key: 'main' },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

const pick = (s) => Object.fromEntries(FIELDS.map((f) => [f, s[f] ?? '']))

const cleanUrl = (v = '') => {
  const url = String(v).trim()
  if (!url) return ''
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

// Imagen: acepta una URL completa o una ruta de /uploads (subida en local)
const cleanImage = (v = '') => {
  const url = String(v).trim()
  return url.startsWith('/uploads/') ? url : cleanUrl(url)
}

// Pública: la lee el sitio
router.get('/', async (req, res) => {
  try {
    res.json(pick(await getSettings()))
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron cargar los ajustes' })
  }
})

// Solo admin: la edita el cliente
router.put('/', requireAuth, async (req, res) => {
  try {
    const b = req.body || {}
    const update = {
      whatsapp: String(b.whatsapp ?? '').replace(/\D/g, ''),
      whatsappMessage: String(b.whatsappMessage ?? '').trim().slice(0, 300),
      instagram: cleanUrl(b.instagram),
      facebook: cleanUrl(b.facebook),
      tiktok: cleanUrl(b.tiktok),
      youtube: cleanUrl(b.youtube),
      vimeo: cleanUrl(b.vimeo),
    }
    // Solo se toca si viene en el pedido, así no se borra por accidente
    if (b.destinationImage !== undefined) update.destinationImage = cleanImage(b.destinationImage)

    const s = await Settings.findOneAndUpdate({ key: 'main' }, update, {
      upsert: true,
      new: true,
    })
    res.json(pick(s))
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron guardar los ajustes' })
  }
})

// Solo admin: subir el fondo de Destination Weddings (campo "image")
router.post('/destination-image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen' })
    const destinationImage = await saveFile(req.file)
    const s = await Settings.findOneAndUpdate({ key: 'main' }, { destinationImage }, {
      upsert: true,
      new: true,
    })
    res.json(pick(s))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo guardar la imagen' })
  }
})

export default router
