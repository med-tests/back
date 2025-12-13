const db = require('./db-init')
const {getSetSqlString} = require('../helpers')

module.exports = {
  getAllTests: function (userId) {
    return db.prepare('SELECT * FROM tests WHERE status = 1 AND userId = ? ORDER BY position DESC').all(userId)
  },
  getTestById: function (id, userId) {
    return db.prepare('SELECT * FROM tests WHERE id = ? AND userId = ?').get(id, userId)
  },
  addTest: function (title, normalFrom, normalTo, showFrom, showTo, userId, position) {
    const result = db
      .prepare('INSERT INTO tests (title, normalFrom, normalTo, status, isHidden, showFrom, showTo, userId, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(title, normalFrom, normalTo, 1, 0, showFrom, showTo, userId, position)

    return result.lastInsertRowid
  },
  editTest: function (id, userId, testFields) {
    const setClause = getSetSqlString(testFields)
    return db
      .prepare(`UPDATE tests SET ${setClause} WHERE id = @id AND userId = @userId`)
      .run({ ...testFields, id, userId })
  },
  changePosition: function (id, userId, oldPosition, newPosition) {
    if (newPosition > oldPosition) {
      db.prepare(`
          UPDATE tests
          SET position = position - 1
          WHERE position > @oldPosition
          AND position <= @newPosition
          AND id != @id
          AND userId = @userId
          AND status = 1
      `)
        .run({ oldPosition, newPosition, id, userId })
    }
    else {
      db.prepare(`
          UPDATE tests
          SET position = position + 1
          WHERE position >= @newPosition
          AND position < @oldPosition
          AND id != @id
          AND userId = @userId
          AND status = 1
      `)
        .run({ oldPosition, newPosition, id, userId })
    }

    db.prepare(`
        UPDATE tests
        SET position = @newPosition
        WHERE id = @id
      `).run({ newPosition, id })
  },
}
