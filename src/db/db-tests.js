const db = require('./db-init')
const {getSetSqlString} = require('../helpers')

module.exports = {
  getAllTests: function (userId) {
    return db.prepare('SELECT * FROM tests WHERE status = 1 AND userId = ?').all(userId)
  },
  getTestById: function (id, userId) {
    return db.prepare('SELECT * FROM tests WHERE id = ? AND userId = ?').get(id, userId)
  },
  addTest: function (title, normalFrom, normalTo, showFrom, showTo, userId) {
    const result = db
      .prepare('INSERT INTO tests (title, normalFrom, normalTo, status, isHidden, showFrom, showTo, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(title, normalFrom, normalTo, 1, 0, showFrom, showTo, userId)

    return result.lastInsertRowid
  },
  editTest: function (id, userId, testFields) {
    const setClause = getSetSqlString(testFields)
    return db
      .prepare(`UPDATE tests SET ${setClause} WHERE id = @id AND userId = @userId`)
      .run({ ...testFields, id, userId })
  },
}
