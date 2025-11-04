const db = require('./db-init')

module.exports = {
  getAllTests: function () {
    return db.prepare('SELECT * FROM tests WHERE status = 1').all()
  },
  getTestByCode: function (code) {
    return db.prepare('SELECT * FROM tests WHERE code = ?').all(code)[0]
  },
  addTest: function (code, title, normalFrom, normalTo) {
    return db
      .prepare('INSERT INTO tests (code, title, normalFrom, normalTo, status) VALUES (?, ?, ?, ?, ?)')
      .run(code, title, normalFrom, normalTo, 1)
  },
  editTest: function (testFields, code) {
    // Формируем динамический SQL
    const setClause =
      Object.keys(testFields)
        .map((key) => `${key} = @${key}`)
        .join(', ')

    return db
      .prepare(`UPDATE tests SET ${setClause} WHERE code = @code`)
      .run({ ...testFields, code })
  },
}
