const db = require('./db-init')
const {getSetSqlString} = require('../helpers')

module.exports = {
  getAllResults: function (userId) {
    return db.prepare('SELECT * FROM results WHERE status = 1 AND userId = ? ORDER BY date ASC').all(userId)
  },
  addResult: function  ({ testId, date, value, userId }) {
    return db
      .prepare('INSERT INTO results (testId, userId, value, date, status) VALUES (?, ?, ?, ?, ?)')
      .run(testId, userId, value, date, 1)
  },
  getResultsByTestId: function (testId, userId) {
    return db.prepare('SELECT * FROM results WHERE testId = ? AND status = 1 AND userId = ? ORDER BY date ASC').all(testId, userId)
  },
  editResult: function (id, data, userId) {
    const setClause = getSetSqlString(data)

    return db
      .prepare(`UPDATE results SET ${setClause} WHERE id = @id AND userId = @userId`)
      .run({ ...data, id, userId })
  },
}
