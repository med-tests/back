const dbResults = require('../db/db-results')
const dbTests = require('../db/db-tests')
const {formatTestToSend} = require('../helpers')

module.exports = function addMultiResults (req, res) {
  const userId = req.user.id

  const sendData = []
  req.body.forEach(({ id, results}) => {
    results.forEach(result => {
      dbResults.addResult({
        testId: id,
        date: result.date,
        value: result.value,
        status: 1,
        userId,
      })
    })

    const edgeDates = dbResults.getEdgeDates(id, userId)
    
    dbTests.editTest(id, userId, {
      showFrom: edgeDates.showFrom,
      showTo: edgeDates.showTo,
    })

    const addedTest = dbTests.getTestById(id, userId)
    const addedTestResults = dbResults.getResultsByTestId(id, userId)
    
    sendData.push(formatTestToSend(addedTest, addedTestResults))
  })

  return res.json(sendData)
}