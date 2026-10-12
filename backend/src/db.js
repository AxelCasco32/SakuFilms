import mongoose from 'mongoose'
import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Falta MONGODB_URI en el archivo .env')
  }
  await mongoose.connect(uri)
  console.log('✅ Conectado a MongoDB')
}