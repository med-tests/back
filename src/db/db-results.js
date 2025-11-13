const db = require('./db-init')

module.exports = {
  getAllResults: function () {
    return db.prepare('SELECT * FROM results WHERE status = 1 ORDER BY date ASC').all()
  },
  addResult: function  ({ code, date, value }) {
    return db
      .prepare('INSERT INTO results (test_code, value, date, status) VALUES (?, ?, ?, ?)')
      .run(code, value, date, 1)
  },
  getResultsByCode: function (code) {
    return db.prepare('SELECT * FROM results WHERE test_code = ?').all(code)
  },
  editResult: function (code, data) {
    const setClause =
      Object.keys(data)
        .map((key) => `${key} = @${key}`)
        .join(', ')

    return db
      .prepare(`UPDATE results SET ${setClause} WHERE test_code = @code`)
      .run({ ...data, code })
  },
  deleteResultsForTest: function (code) {
    return db
      .prepare('DELETE FROM results WHERE test_code = ?')
      .run(code)
  }
}
