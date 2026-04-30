const express = require('express')
const router = express.Router()
const db = require('../database')

// GET /api/transactions
router.get('/', (req, res) => {
  try {
    const transactions = db.prepare('SELECT * FROM transactions ORDER BY createdAt DESC').all()
    res.json({ success: true, data: transactions })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' })
  }
})

// GET /api/transactions/:id
router.get('/:id', (req, res) => {
  try {
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id)
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' })
    res.json({ success: true, data: transaction })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch transaction' })
  }
})

// POST /api/transactions
router.post('/', (req, res) => {
  try {
    const { type, amount, description, userId, listingId } = req.body
    if (!type || !amount || !description || !userId) {
      return res.status(400).json({ success: false, message: 'Type, amount, description, and userId are required' })
    }

    const id = Date.now().toString()
    const date = new Date().toLocaleDateString()

    db.prepare('INSERT INTO transactions (id, type, amount, description, userId, listingId, date) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, type, parseFloat(amount), description, userId, listingId || null, date)

    const newTransaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id)
    res.status(201).json({ success: true, message: 'Transaction created successfully', data: newTransaction })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to create transaction' })
  }
})

// PUT /api/transactions/:id
router.put('/:id', (req, res) => {
  try {
    const { type, amount, description, status } = req.body
    db.prepare('UPDATE transactions SET type=?, amount=?, description=?, status=? WHERE id=?')
      .run(type, parseFloat(amount), description, status, req.params.id)
    const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id)
    res.json({ success: true, message: 'Transaction updated successfully', data: updated })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update transaction' })
  }
})

// DELETE /api/transactions/:id
router.delete('/:id', (req, res) => {
  try {
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id)
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' })
    db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id)
    res.json({ success: true, message: 'Transaction deleted successfully', data: transaction })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to delete transaction' })
  }
})

module.exports = router