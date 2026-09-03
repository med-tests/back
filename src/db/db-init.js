const DbInit = require('better-sqlite3')

// создаём или открываем файл базы данных
const db = new DbInit('data.db')

// включаем поддержку внешних ключей (по умолчанию выключена в SQLite)
db.pragma('foreign_keys = ON')

db.pragma('journal_mode = WAL')

// TESTS TABLE
db.prepare(`
  CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    userId INTEGER NOT NULL DEFAULT 1,
    isShowAverage INTEGER,   
    normalFrom INTEGER,
    normalTo INTEGER,
    position INTEGER NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    isHidden INTEGER,
    showFrom TEXT NOT NULL,
    showTo TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`).run()

db.prepare('CREATE INDEX IF NOT EXISTS idx_position_1 ON tests (position)').run()

// RESULTS TABLE
db.prepare(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL DEFAULT 1,
      testId INTEGER,
      value INTEGER NOT NULL,
      date TEXT NOT NULL,
      status INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (testId) REFERENCES tests(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
`).run()

// USERS TABLE
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      status INTEGER NOT NULL DEFAULT 1,
      date_create DATETIME NOT NULL
    )
`).run()

module.exports = db
