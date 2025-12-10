const db = require('./db-init')
const {getSetSqlString} = require('../helpers')

module.exports = {
  getAllResults: function () {
    return db.prepare('SELECT * FROM results WHERE status = 1 ORDER BY date ASC').all()
  },
  addResult: function  ({ test_id, date, value }) {
    return db
      .prepare('INSERT INTO results (test_id, value, date, status) VALUES (?, ?, ?, ?)')
      .run(test_id, value, date, 1)
  },
  getResultsByTestId: function (test_id) {
    return db.prepare('SELECT * FROM results WHERE test_id = ? AND status = 1 ORDER BY date ASC').all(test_id)
  },
  editResult: function (id, data) {
    const setClause = getSetSqlString(data)

    return db
      .prepare(`UPDATE results SET ${setClause} WHERE id = @id`)
      .run({ ...data, id })
  },
}
