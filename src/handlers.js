const dbTests = require('./db/db-tests.js')
const dbResults = require('./db/db-results.js')

function getAllTests (req, res) {
  const tests = dbTests.getAllTests()
  const results = dbResults.getAllResults()

  const response = tests.map(test => {
    const testResults = results.filter(({ test_code }) => test_code === test.code)
    return prepareTest(test, testResults)
  })

  res.json(response)
}

function addTest (req, res) {
  const { code, title, normalFrom, normalTo, results } = req.body

  dbTests.addTest(code, title, normalFrom, normalTo)

  // todo подумать, как переписать с @
  results.forEach(result => {
    dbResults.addResult({
      code,
      date: result.date,
      value: result.value,
    })
  })

  const addedTest = dbTests.getTestByCode(code)
  const addedTestResults = dbResults.getResultsByCode(code)

  res.json(prepareTest(addedTest, addedTestResults))
}

module.exports = {
  getAllTests,
  addTest,
}


function prepareTest (rawTest, rewResults) {
  return {
    code: rawTest.code,
    title: rawTest.title,
    normalFrom: rawTest.normalFrom,
    normalTo: rawTest.normalTo,
    results: rewResults
      .map(result => ({
        id: result.id,
        date: result.date,
        value: result.value,
      })),
  }
}
