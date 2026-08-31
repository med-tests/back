const dbTests = require('../db/db-tests')

module.exports = function deleteTest (req, res) {
  const userId = req.user.id
  const id = req.params.id

  dbTests.editTest(id, userId, { status: 0 })
  return res.json({ id })
}
