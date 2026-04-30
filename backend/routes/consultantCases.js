const express = require('express')
const router = express.Router()
const db = require('../database')

// GET /api/consultant-cases
router.get('/', (req, res) => {
  try {
    const cases = db.prepare('SELECT * FROM consultant_cases ORDER BY createdAt DESC').all()
    res.json({ success: true, data: cases })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch consultant cases' })
  }
})

// GET /api/consultant-cases/:id
router.get('/:id', (req, res) => {
  try {
    const caseItem = db.prepare('SELECT * FROM consultant_cases WHERE id = ?').get(req.params.id)
    if (!caseItem) return res.status(404).json({ success: false, message: 'Consultant case not found' })
    res.json({ success: true, data: caseItem })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch consultant case' })
  }
})

// POST /api/consultant-cases
router.post('/', (req, res) => {
  try {
    const { consultantId, caseType, status, review } = req.body
    if (!consultantId || !caseType || !status) {
      return res.status(400).json({ success: false, message: 'consultantId, caseType and status are required' })
    }

    const id = Date.now().toString()
    const dateCreated = new Date().toLocaleDateString()

    db.prepare('INSERT INTO consultant_cases (id, consultantId, caseType, status, review, dateCreated) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, consultantId, caseType, status, review || '', dateCreated)

    const newCase = db.prepare('SELECT * FROM consultant_cases WHERE id = ?').get(id)
    res.status(201).json({ success: true, message: 'Consultant case created successfully', data: newCase })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to create consultant case' })
  }
})

// PUT /api/consultant-cases/:id
router.put('/:id', (req, res) => {
  try {
    const { caseType, status, review } = req.body
    db.prepare('UPDATE consultant_cases SET caseType=?, status=?, review=? WHERE id=?')
      .run(caseType, status, review, req.params.id)
    const updated = db.prepare('SELECT * FROM consultant_cases WHERE id = ?').get(req.params.id)
    res.json({ success: true, message: 'Consultant case updated successfully', data: updated })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update consultant case' })
  }
})

// DELETE /api/consultant-cases/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM consultant_cases WHERE id = ?').run(req.params.id)
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Consultant case not found' })
    res.json({ success: true, message: 'Consultant case deleted successfully' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to delete consultant case' })
  }
})

module.exports = router