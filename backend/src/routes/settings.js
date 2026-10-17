import { Router } from 'express'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const FIELDS = ['whatsapp', 'whatsappMessage', 'instagram', 'facebook', 'tiktok', 'youtube', 'vimeo']

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
    const s = await Settings.findOneAndUpdate({ key: 'main' }, update, {
      upsert: true,
      new: true,
    })
    res.json(pick(s))
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron guardar los ajustes' })
  }
})

export default router