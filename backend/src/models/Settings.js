import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    whatsapp: { type: String, default: '' }, // solo dígitos con código de país: 5491122334455
    whatsappMessage: {
      type: String,
      default: 'Hola! Quiero consultar por una cobertura de boda.',
    },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    youtube: { type: String, default: '' },
    vimeo: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Settings', settingsSchema)