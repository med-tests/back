const dbTests = require('../db/db-tests.js')

module.exports = function changeTestPosition (req, res) {
  const userId = req.user.id
  const id = req.params.id
  const { newPosition, oldPosition } = req.body
  dbTests.changePosition(id, userId, oldPosition, newPosition)
  return res.json({ id })
}