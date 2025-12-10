const db = require('./db-init')
const {getSetSqlString} = require('../helpers')

module.exports = {
  getAllTests: function () {
    return db.prepare('SELECT * FROM tests WHERE status = 1').all()
  },
  getTestById: function (id) {
    return db.prepare('SELECT * FROM tests WHERE id = ?').get(id)
  },
  addTest: function (title, normalFrom, normalTo, showFrom, showTo) {
    const result = db
      .prepare('INSERT INTO tests (title, normalFrom, normalTo, status, isHidden, showFrom, showTo) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(title, normalFrom, normalTo, 1, 0, showFrom, showTo)

    return result.lastInsertRowid
  },
  editTest: function (id, testFields) {
    const setClause = getSetSqlString(testFields)
    return db
      .prepare(`UPDATE tests SET ${setClause} WHERE id = @id`)
      .run({ ...testFields, id })
  },
}
