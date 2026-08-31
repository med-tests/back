const dbResults = require('../db/db-results')

module.exports = function addMultiResults (req, res) {
  const userId = req.user.id

  const sendData = []
  req.body.forEach(({ id, results}) => {
    results.forEach(result => {
      dbResults.addResult({
        test_id: id,
        date: result.date,
        value: result.value,
        status: 1,
        userId,
      })
    })

    sendData.push({
      id,
      results: dbResults.getResultsByTestId(id, userId),
    })
  })

  return res.json(sendData)
}