const db = require('./db-init')
const {getSetSqlString} = require('../helpers')

module.exports = {
  getAllResults: function (userId) {
    return db.prepare('SELECT * FROM results WHERE status = 1 AND userId = ? ORDER BY date ASC').all(userId)
  },
  addResult: function  ({ test_id, date, value, userId }) {
    return db
      .prepare('INSERT INTO results (test_id, userId, value, date, status) VALUES (?, ?, ?, ?, ?)')
      .run(test_id, userId, value, date, 1)
  },
  getResultsByTestId: function (test_id, userId) {
    return db.prepare('SELECT * FROM results WHERE test_id = ? AND status = 1 AND userId = ? ORDER BY date ASC').all(test_id, userId)
  },
  editResult: function (id, data, userId) {
    const setClause = getSetSqlString(data)

    return db
      .prepare(`UPDATE results SET ${setClause} WHERE id = @id AND userId = @userId`)
      .run({ ...data, id, userId })
  },
}
