const express = require('express')
const router = express.Router()
const db = require('../database')

// GET /api/consultants
router.get('/', (req, res) => {
  try {
    const consultants = db.prepare('SELECT * FROM consultants ORDER BY createdAt DESC').all()
    res.json({ success: true, data: consultants })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch consultants' })
  }
})

// GET /api/consultants/:id
router.get('/:id', (req, res) => {
  try {
    const consultant = db.prepare('SELECT * FROM consultants WHERE id = ?').get(req.params.id)
    if (!consultant) return res.status(404).json({ success: false, message: 'Consultant not found' })
    res.json({ success: true, data: consultant })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch consultant' })
  }
})

// POST /api/consultants
router.post('/', (req, res) => {
  try {
    const id = Date.now().toString()
    const { name, specialty, experience, email, phone } = req.body
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' })

    db.prepare('INSERT INTO consultants (id, name, specialty, experience, email, phone) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, name, specialty, experience, email, phone)

    const newConsultant = db.prepare('SELECT * FROM consultants WHERE id = ?').get(id)
    res.status(201).json({ success: true, data: newConsultant })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to create consultant' })
  }
})

// PUT /api/consultants/:id
router.put('/:id', (req, res) => {
  try {
    const { name, specialty, experience, email, phone } = req.body
    db.prepare('UPDATE consultants SET name=?, specialty=?, experience=?, email=?, phone=? WHERE id=?')
      .run(name, specialty, experience, email, phone, req.params.id)
    const updated = db.prepare('SELECT * FROM consultants WHERE id = ?').get(req.params.id)
    res.json({ success: true, data: updated })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update consultant' })
  }
})

// DELETE /api/consultants/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM consultants WHERE id = ?').run(req.params.id)
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Consultant not found' })
    res.json({ success: true, message: 'Consultant deleted successfully' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to delete consultant' })
  }
})

module.exports = router