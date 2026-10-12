import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectDB } from './db.js'
import { filmsRouter } from './routes/films.js'
import { contactRouter } from './routes/contact.js'
import { authRouter } from './routes/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Orígenes permitidos: FRONTEND_URL separados por coma, sin espacios ni "/" al final
const origenes = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      // Sin origen (panel admin same-origin, curl, health checks) o sin lista configurada: permitir
      if (!origin || origenes.length === 0 || origenes.includes(origin)) {
        return cb(null, true)
      }
      cb(new Error('Origen no permitido por CORS'))
    },
  })
)
app.use(express.json())

// Archivos subidos (imágenes de films)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Panel de admin (HTML+JS plano, sin build)
app.use('/admin', express.static(path.join(__dirname, '..', 'public')))

// API
app.use('/api/auth', authRouter)
app.use('/api/films', filmsRouter)
app.use('/api/contact', contactRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

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