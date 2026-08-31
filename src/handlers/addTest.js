const moment = require('moment/moment')
const dbTests = require('../db/db-tests')
const dbResults = require('../db/db-results')
const {formatTestToSend, errorTitleLength} = require('../helpers')

module.exports = function addTest (req, res) {
  const userId = req.user.id
  const { title, normalFrom, normalTo, results, position, isShowAverage } = req.body

  const errorText = errorTitleLength(title)
  if (errorText) {
    return res.json({ error: true, message: errorText })
  }

  results.sort((a, b) => moment(a.date) - moment(b.date))
  const showFrom = results[0]?.date || ''
  const showTo = results[results.length - 1]?.date || ''
  const addedTestId = dbTests.addTest(title, isShowAverage, normalFrom, normalTo, showFrom, showTo, userId, position)

  // todo подумать, как добавить несколько строк в одном sql-запросе
  results.forEach(result => {
    dbResults.addResult({
      test_id: addedTestId,
      date: result.date,
      value: result.value,
      userId,
    })
  })

  const addedTest = dbTests.getTestById(addedTestId, userId)
  const addedTestResults = dbResults.getResultsByTestId(addedTestId, userId)

  res.json(formatTestToSend(addedTest, addedTestResults))
}
