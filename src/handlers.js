const dbTests = require('./db/db-tests.js')
const dbResults = require('./db/db-results.js')
const { formatTestToSend } = require('./helpers')
const moment = require('moment')

function getAllTests (req, res) {
  const tests = dbTests.getAllTests()
  const results = dbResults.getAllResults()

  const response = tests.map(test => {
    const testResults = results.filter(({ test_id }) => test_id === test.id)
    return formatTestToSend(test, testResults)
  })

  res.json(response)
}

function addTest (req, res) {
  const { title, normalFrom, normalTo, results } = req.body

  results.sort((a, b) => moment(a.date) - moment(b.date))
  const showFrom = results[0]?.date || ''
  const showTo = results[results.length - 1]?.date || ''
  const addedTestId = dbTests.addTest(title, normalFrom, normalTo, showFrom, showTo)

  // todo подумать, как добавить несколько строк в одном sql-запросе
  results.forEach(result => {
    dbResults.addResult({
      test_id: addedTestId,
      date: result.date,
      value: result.value,
    })
  })

  const addedTest = dbTests.getTestById(addedTestId)
  const addedTestResults = dbResults.getResultsByTestId(addedTestId)

  res.json(formatTestToSend(addedTest, addedTestResults))
}

function editTest (req, res) {
  const id = req.params.id

  // TODO сделать ошибку, если нет id. id не может быть 0

  const { status } = req.body

  if (status === 0) {
    dbTests.editTest(id, { status: 0 })
    return res.json({ id })
  }

  // взять только подходящие поля
  const arr = ['title', 'normalFrom', 'normalTo', 'isHidden', 'showFrom', 'showTo']
  const data = {}
  arr.forEach(field => {
    if (Object.hasOwn(req.body, field)) {
      data[field] = req.body[field]
    }
  })

  const hasChangedResults = Object.hasOwn(req.body, 'results')
  if (!Object.keys(data).length && !hasChangedResults) {
    return res.json({ error: 'Нет полей для редактирования' })
  }
  if (Object.keys(data).length) {
    dbTests.editTest(id, data)
  }

  if (hasChangedResults) {
    req.body.results.forEach(result => {
      if (Object.hasOwn(result, 'id')) {
        // todo говнокод
        const data = {}

        if (Object.hasOwn(result, 'date')) {
          data.date = result.date
        }
        if (Object.hasOwn(result, 'value')) {
          data.value = result.value
        }
        if (Object.hasOwn(result, 'status')) {
          data.status = result.status
        }
        dbResults.editResult(result.id, data)
      }
      else {
        dbResults.addResult({
          test_id: id,
          date: result.date,
          value: result.value,
          status: 1,
        })
      }
    })
  }

  const addedTest = dbTests.getTestById(id)
  const addedTestResults = dbResults.getResultsByTestId(id)
  return res.json(formatTestToSend(addedTest, addedTestResults))
}

module.exports = {
  getAllTests,
  addTest,
  editTest,
}
