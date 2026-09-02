import mongoose from 'mongoose'

export const FILM_CATEGORIES = ['Wedding Films', 'Trailers', 'Highlights', 'Destination Weddings']

const filmSchema = new mongoose.Schema(
  {
    couple: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: FILM_CATEGORIES },
    year: { type: String, required: true, trim: true },
    img: { type: String, required: true },
    // Link de YouTube del film (opcional). Se guarda tal cual lo carga el admin.
    videoUrl: { type: String, default: '' },
    // Define el orden en el carousel del home.
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Film = mongoose.model('Film', filmSchema)
