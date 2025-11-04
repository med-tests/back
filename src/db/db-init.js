const DbInit = require('better-sqlite3')

// создаём или открываем файл базы данных
const db = new DbInit('data.db')

// включаем поддержку внешних ключей (по умолчанию выключена в SQLite)
db.pragma('foreign_keys = ON')

db.pragma('journal_mode = WAL')

// TESTS BASE
db.prepare(`
  CREATE TABLE IF NOT EXISTS tests (
    code TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    normalFrom INTEGER,
    normalTo INTEGER,
    status INTEGER
  )
`).run()

// RESULTS BASE
db.prepare(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_code TEXT NOT NULL,
      value INTEGER NOT NULL,
      date TEXT NOT NULL,
      status INTEGER,
      FOREIGN KEY (test_code) REFERENCES tests(code) ON DELETE CASCADE
    )
`).run()


module.exports = db
