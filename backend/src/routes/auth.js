import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authRouter = Router()

authRouter.post('/login', (req, res) => {
  const { user, password } = req.body

  if (!user || !password) {
    return res.status(400).json({ error: 'Faltan usuario o contraseña' })
  }

  const validUser = user === process.env.ADMIN_USER
  const validPassword =
    process.env.ADMIN_PASSWORD_HASH &&
    bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH)

  if (!validUser || !validPassword) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '12h' })
  res.json({ token })
})
