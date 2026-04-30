const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../database')

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already exists' })
    }

    const hashed = bcrypt.hashSync(password, 10)
    const id = Date.now().toString()

    db.prepare('INSERT INTO users (id, firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, firstName, lastName, email, hashed, role || 'user')

    const token = Buffer.from(`${id}:${email}:${Date.now()}`).toString('base64')

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id, firstName, lastName, email, role: role || 'user' }
    })
  } catch (e) {
    console.error('Signup error:', e)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const valid = bcrypt.compareSync(password, user.password)
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = Buffer.from(`${user.id}:${email}:${Date.now()}`).toString('base64')

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    })
  } catch (e) {
    console.error('Login error:', e)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

module.exports = router