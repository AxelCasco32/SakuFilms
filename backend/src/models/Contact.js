import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    pareja: { type: String, default: '' },
    email: { type: String, required: true, trim: true },
    whatsapp: { type: String, default: '' },
    fecha: { type: String, default: '' },
    lugar: { type: String, default: '' },
    cobertura: { type: String, default: '' },
    mensaje: { type: String, default: '' },
  },
  { timestamps: true }
)

export const Contact = mongoose.model('Contact', contactSchema)
