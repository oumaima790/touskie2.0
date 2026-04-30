const express = require('express')
const router = express.Router()
const db = require('../database')

// GET /api/listings
router.get('/', (req, res) => {
  try {
    const listings = db.prepare('SELECT * FROM listings ORDER BY createdAt DESC').all()
    res.json({ success: true, data: listings })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch listings' })
  }
})

// GET /api/listings/:id
router.get('/:id', (req, res) => {
  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id)
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
    res.json({ success: true, data: listing })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch listing' })
  }
})

// POST /api/listings
router.post('/', (req, res) => {
  try {
    const { title, description, category, price, publisherId } = req.body
    if (!title || !description || !category || !price || !publisherId) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const id = Date.now().toString()
    const dateAdded = new Date().toLocaleDateString()

    db.prepare('INSERT INTO listings (id, title, description, category, price, publisherId, dateAdded) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, title, description, category, parseFloat(price), publisherId, dateAdded)

    const newListing = db.prepare('SELECT * FROM listings WHERE id = ?').get(id)
    res.status(201).json({ success: true, message: 'Listing created successfully', data: newListing })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to create listing' })
  }
})

// PUT /api/listings/:id
router.put('/:id', (req, res) => {
  try {
    const { title, description, category, price } = req.body
    db.prepare('UPDATE listings SET title=?, description=?, category=?, price=? WHERE id=?')
      .run(title, description, category, parseFloat(price), req.params.id)
    const updated = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id)
    res.json({ success: true, message: 'Listing updated successfully', data: updated })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update listing' })
  }
})

// DELETE /api/listings/:id
router.delete('/:id', (req, res) => {
  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id)
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
    db.prepare('DELETE FROM listings WHERE id = ?').run(req.params.id)
    res.json({ success: true, message: 'Listing deleted successfully', data: listing })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to delete listing' })
  }
})

module.exports = router