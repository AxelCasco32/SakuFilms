import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './db.js'
import CarouselPhoto from './models/CarouselPhoto.js'

const urls = [
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647172/Vietnam_3.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647171/Vietnam_2.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647171/SAKURA_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647171/SAKURA_2.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647171/Tailandia.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647170/Laos.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647170/Japon_14.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647170/Japon_12.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Irlanda_3.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Japon_15.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/indonesia_4.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Japon_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Irlanda_2.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Japon_9.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647168/indonesia_2.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647168/Irlanda_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647168/indonesia_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647167/Bulgaria.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647167/Grecia.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791647166/Camboya_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646624/Japon_7.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646620/China_3.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646616/Japon_3.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646616/Japon_6.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646615/indonesia_3.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646615/Japon_2.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646614/Japon_5.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646613/Colombia_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646612/Australia.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646610/Japon_11.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646609/China_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646609/Camboya_2.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646607/Tailandia_2.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646604/Londres_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646601/Londres_2.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646595/China_4.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646594/Vietnam_1.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646593/Japon_13.jpg',
  'https://res.cloudinary.com/ex91suxd/image/upload/v1791646593/Colombia_2.jpg',
]

await connectDB()

// No duplica las que ya existen
const existing = new Set((await CarouselPhoto.find().select('url')).map((p) => p.url))
const last = await CarouselPhoto.findOne().sort({ position: -1 })
let pos = last ? last.position + 1 : 0

const nuevas = urls
  .filter((url) => !existing.has(url))
  .map((url) => ({ url, publicId: '', position: pos++ }))

if (nuevas.length) await CarouselPhoto.insertMany(nuevas)

console.log(`✅ Agregadas ${nuevas.length} fotos (ya existían ${urls.length - nuevas.length})`)
await mongoose.disconnect()