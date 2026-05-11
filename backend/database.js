const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'touskie.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price REAL,
    publisherId TEXT,
    dateAdded TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS consultants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT,
    experience TEXT,
    email TEXT,
    phone TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT,
    amount REAL,
    description TEXT,
    userId TEXT,
    listingId TEXT,
    status TEXT DEFAULT 'completed',
    date TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS consultant_cases (
    id TEXT PRIMARY KEY,
    consultantId TEXT,
    userId TEXT,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'open',
    createdAt TEXT DEFAULT (datetime('now'))
  );
`)

// Seed default consultants if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM consultants').get()
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO consultants (id, name, specialty, experience) VALUES (?, ?, ?, ?)')
  insert.run('1', 'Dr. Ahmed Ayadi', 'Business Strategy', '10+ years')
  insert.run('2', 'Yassine ben Ali', 'Financial Advisory', '8+ years')
  insert.run('3', 'Oumaima belhadj', 'Digital Transformation', '12+ years')
  insert.run('4', 'Salma ben Abdallah', 'Operations', '15+ years')
}

module.exports = db