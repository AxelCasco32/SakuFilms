   import mongoose from 'mongoose'

   const carouselPhotoSchema = new mongoose.Schema(
     {
       url: { type: String, required: true },
       destination: { type: String, default: '', trim: true }, // ej. "Japón" (se muestra en el sitio)
       publicId: { type: String, default: '' }, // solo si se subió a Cloudinary desde el panel
       position: { type: Number, default: 0 },
     },
     { timestamps: true },
   )

   export default mongoose.model('CarouselPhoto', carouselPhotoSchema)