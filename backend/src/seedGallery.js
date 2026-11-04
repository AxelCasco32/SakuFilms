import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './db.js'
import { Film, PHOTO_CATEGORY } from './models/Film.js'

// Galería de Wedding Photography que antes estaba escrita en Films.tsx
const urls = [
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747562/01.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747563/02.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747564/03.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747565/05.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747565/06.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747566/07.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747567/08.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747567/09.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747578/10.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747579/11.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747579/12.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747580/13.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747568/14.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747569/15.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747569/16.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747570/17.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747571/18.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747572/19.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747572/20.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747573/21.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747580/22.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747574/23.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747575/24.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747575/25.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747576/26.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791747577/27.jpg',
]

await connectDB()

// No duplica: si ya existe una galería con la primera foto, solo agrega las que falten
const existing = await Film.findOne({ categories: PHOTO_CATEGORY, images: urls[0] })

if (existing) {
  const nuevas = urls.filter((url) => !existing.images.includes(url))
  existing.images.push(...nuevas)
  await existing.save()
  console.log(`✅ La galería ya existía: se agregaron ${nuevas.length} fotos (total ${existing.images.length})`)
} else {
  await Film.create({
    couple: '',
    categories: [PHOTO_CATEGORY],
    img: urls[0],
    images: urls,
    position: 0,
  })
  console.log(`✅ Galería creada con ${urls.length} fotos`)
}

await mongoose.disconnect()
