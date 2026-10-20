import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectDB } from './db.js'
import { filmsRouter } from './routes/films.js'
import { contactRouter } from './routes/contact.js'
import { authRouter } from './routes/auth.js'
import settingsRoutes from './routes/settings.js'
import carouselRoutes from './routes/carousel.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Orígenes fijos (local + producción)
const origenesFijos = [
  // local
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4000',
  // producción
  'https://api.sakufilms.com', // panel admin
  'https://sakufilms.com',
  'https://www.sakufilms.com',
]

// Orígenes extra: FRONTEND_URL separados por coma, sin espacios ni "/" al final
const origenesEnv = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean)

const origenes = [...new Set([...origenesFijos, ...origenesEnv])]

// En desarrollo, Vite puede usar cualquier puerto (5173, 5177...) y abrirse por localhost o por IP de la red local
const esLocalhost = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)
const esDesarrollo = process.env.NODE_ENV !== 'production'

app.use((req, res, next) => {
  cors({
    origin: (origin, cb) => {
      // Sin origen (curl, health checks, GET same-origin): permitir
      if (!origin) return cb(null, true)

      // El panel admin: mismo host que el backend (localhost, 127.0.0.1, IP, api.sakufilms.com)
      let mismoHost = false
      try {
        mismoHost = new URL(origin).host === req.get('host')
      } catch {}

      if (mismoHost || origenes.includes(origin) || (esDesarrollo && esLocalhost(origin))) {
        return cb(null, true)
      }

      console.warn('CORS bloqueado:', origin)
      cb(new Error('Origen no permitido por CORS'))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })(req, res, next)
})

app.use(express.json())

// Evita el 404 rojo que pide Chrome DevTools
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(204).end()
})

// Archivos subidos (imágenes de films)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Panel de admin (HTML+JS plano, sin build)
app.use('/admin', express.static(path.join(__dirname, '..', 'public')))

// API
app.use('/api/auth', authRouter)
app.use('/api/films', filmsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/settings', settingsRoutes)
app.use('/api/carousel', carouselRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Errores: CORS devuelve 403 limpio en vez de mostrar el stack
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.message === 'Origen no permitido por CORS') {
    return res.status(403).json({ error: err.message })
  }
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const port = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ SAKU backend corriendo en http://localhost:${port}`)
      console.log(`   Panel admin: http://localhost:${port}/admin`)
    })
  })
  .catch((err) => {
    console.error('❌ No se pudo conectar a MongoDB:', err.message)
    process.exit(1)
  })