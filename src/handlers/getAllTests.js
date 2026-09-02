const dbTests = require('../db/db-tests')
const dbResults = require('../db/db-results')
const {formatTestToSend} = require('../helpers')

module.exports = function getAllTests (req, res) {
  const userId = req.user.id
  const tests = dbTests.getAllTests(userId)
  const results = dbResults.getAllResults(userId)

  const response = tests.map(test => {
    const testResults = results.filter(({ testId }) => testId === test.id)
    return formatTestToSend(test, testResults)
  })

  res.json(response)
}