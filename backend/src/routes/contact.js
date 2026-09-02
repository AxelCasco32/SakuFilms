import { Router } from 'express'
import nodemailer from 'nodemailer'
import { Contact } from '../models/Contact.js'
import { requireAuth } from '../middleware/auth.js'

export const contactRouter = Router()

function getTransport() {
  if (!process.env.SMTP_HOST) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

// Público: recibir consulta del formulario
contactRouter.post('/', async (req, res) => {
  const { nombre, pareja, email, whatsapp, fecha, lugar, cobertura, mensaje } = req.body

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Faltan nombre o email' })
  }

  await Contact.create({ nombre, pareja, email, whatsapp, fecha, lugar, cobertura, mensaje })

  // Si hay SMTP configurado, avisar por mail. Si falla, no rompe la respuesta al usuario.
  const transport = getTransport()
  if (transport && process.env.CONTACT_TO_EMAIL) {
    try {
      await transport.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `Nueva consulta SAKU FILMS — ${nombre}${pareja ? ' & ' + pareja : ''}`,
        text: `Nombre: ${nombre}
Pareja: ${pareja}
Email: ${email}
WhatsApp: ${whatsapp}
Fecha de boda: ${fecha}
Lugar: ${lugar}
Cobertura: ${cobertura}
Mensaje: ${mensaje}`,
      })
    } catch (err) {
      console.error('No se pudo enviar el email de aviso:', err.message)
    }
  }

  res.status(201).json({ ok: true })
})

// Admin: listar consultas recibidas
contactRouter.get('/', requireAuth, async (_req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 })
  res.json(contacts)
})

// Admin: borrar una consulta
contactRouter.delete('/:id', requireAuth, async (req, res) => {
  const deleted = await Contact.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'No encontrado' })
  res.status(204).end()
})
