import mongoose from 'mongoose'

export const FILM_CATEGORIES = ['Wedding Films', 'Trailers', 'Wedding Photography']
export const VIDEO_CATEGORIES = ['Wedding Films', 'Trailers']
export const PHOTO_CATEGORY = 'Wedding Photography'

const filmSchema = new mongoose.Schema(
  {
    // Nombre de la pareja o título del proyecto
    couple: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true },
    year: { type: String, default: '', trim: true },
    // Un proyecto puede estar en varias categorías de video (ej: Wedding Films + Trailers).
    // Wedding Photography va siempre sola.
    categories: {
      type: [{ type: String, enum: FILM_CATEGORIES }],
      validate: { validator: (v) => v.length > 0, message: 'Elegí al menos una categoría' },
    },
    // Se calcula solo a partir de las categorías (no se carga a mano)
    type: { type: String, enum: ['video', 'photography'], default: 'video' },
    // Portada: la que se ve en las tarjetas del carousel y de la galería
    img: { type: String, required: true },
    // Solo Wedding Photography: las fotos de la galería (rutas /uploads/... o URLs, ej. Cloudinary)
    images: { type: [String], default: [] },
    // Solo videos: link de YouTube, tal cual lo carga el admin
    videoUrl: { type: String, default: '' },
    // Orden de aparición (menor = primero)
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
)

filmSchema.pre('validate', function () {
  this.type = this.categories?.includes(PHOTO_CATEGORY) ? 'photography' : 'video'
})

export const Film = mongoose.model('Film', filmSchema)