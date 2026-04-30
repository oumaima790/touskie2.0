const express = require('express')
const router = express.Router()
const db = require('../database')

// GET /api/users
router.get('/', (req, res) => {
  try {
    const users = db.prepare('SELECT id, firstName, lastName, email, role, createdAt FROM users').all()
    res.json({ success: true, data: users })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' })
  }
})

// GET /api/users/:id
router.get('/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT id, firstName, lastName, email, role, createdAt FROM users WHERE id = ?').get(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' })
  }
})

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  try {
    const { firstName, lastName, email, role } = req.body
    db.prepare('UPDATE users SET firstName=?, lastName=?, email=?, role=? WHERE id=?')
      .run(firstName, lastName, email, role, req.params.id)
    res.json({ success: true, message: 'User updated successfully' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update user' })
  }
})

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, message: 'User deleted successfully' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to delete user' })
  }
})

module.exports = router