const express = require('express')
const router = express.Router()

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' })
    }

    // Chat is handled directly by the frontend (Groq API)
    // This endpoint is kept for compatibility
    res.json({
      success: true,
      reply: 'Please use the chat widget on the frontend.',
      fallback: true
    })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Chat error' })
  }
})

module.exports = router