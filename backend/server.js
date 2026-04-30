require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

require('./database')

app.use('/api/auth',             require('./routes/auth'))
app.use('/api/users',            require('./routes/users'))
app.use('/api/listings',         require('./routes/listings'))
app.use('/api/transactions',     require('./routes/transactions'))
app.use('/api/consultants',      require('./routes/consultants'))
app.use('/api/consultant-cases', require('./routes/consultantCases'))
app.use('/api/chat',             require('./routes/chat'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Touskie backend is running!', timestamp: new Date().toISOString() })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Something went wrong!' })
})

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Touskie Backend running on http://localhost:${PORT}`)
  console.log(`📦 Database: SQLite (touskie.db)`)
})

module.exports = app
