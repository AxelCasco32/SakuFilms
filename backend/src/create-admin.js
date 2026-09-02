import readline from 'node:readline'
import bcrypt from 'bcryptjs'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question('Elegí una contraseña para el panel admin: ', (password) => {
  const hash = bcrypt.hashSync(password, 10)
  console.log('\nListo. Copiá esta línea completa dentro de tu archivo .env (reemplazá la que ya está):\n')
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`)
  rl.close()
})
