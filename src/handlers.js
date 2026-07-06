const dbTests = require('./db/db-tests.js')
const dbResults = require('./db/db-results.js')
const { formatTestToSend } = require('./helpers')
const moment = require('moment')

function getAllTests (req, res) {
  const userId = req.user.id
  const tests = dbTests.getAllTests(userId)
  const results = dbResults.getAllResults(userId)

  const response = tests.map(test => {
    const testResults = results.filter(({ testId }) => testId === test.id)
    return formatTestToSend(test, testResults)
  })

  res.json(response)
}

function addTest (req, res) {
  const userId = req.user.id
  const { title, normalFrom, normalTo, results, position } = req.body

  const errorText = errorTitleLength(title)
  if (errorText) {
    return res.json({ error: true, message: errorText })
  }

  results.sort((a, b) => moment(a.date) - moment(b.date))
  const showFrom = results[0]?.date || ''
  const showTo = results[results.length - 1]?.date || ''
  const addedTestId = dbTests.addTest(title, normalFrom, normalTo, showFrom, showTo, userId, position)

  // todo подумать, как добавить несколько строк в одном sql-запросе
  results.forEach(result => {
    dbResults.addResult({
      testId: addedTestId,
      date: result.date,
      value: result.value,
      userId,
    })
  })

  const addedTest = dbTests.getTestById(addedTestId, userId)
  const addedTestResults = dbResults.getResultsByTestId(addedTestId, userId)

  res.json(formatTestToSend(addedTest, addedTestResults))
}

function editTest (req, res) {
  const userId = req.user.id
  const id = req.params.id

  // взять только подходящие поля
  const arr = ['title', 'normalFrom', 'normalTo', 'isHidden', 'showFrom', 'showTo']
  const data = {}
  arr.forEach(field => {
    if (Object.hasOwn(req.body, field)) {
      data[field] = req.body[field]
    }
  })

  if (Object.hasOwn(data, 'title')) {
    const errorText = errorTitleLength(data.title)
    if (errorText) {
      return res.json({ error: true, message: errorText })
    }
  }

  const hasChangedResults = Object.hasOwn(req.body, 'results')

  if (!Object.keys(data).length && !hasChangedResults) {
    return res.json({ error: true, message: 'Нет полей для редактирования' })
  }

  if (Object.keys(data).length) {
    dbTests.editTest(id, userId, data)
  }

  if (hasChangedResults) {
    req.body.results.forEach(result => {
      if (Object.hasOwn(result, 'id')) {
        const data = {}
        const fields = ['date', 'value', 'status']
        fields.forEach(field => {
            if (Object.hasOwn(result, field)) {
              data[field] = result[field]
            }
          })
        dbResults.editResult(result.id, data, userId)
      }
      else {
        dbResults.addResult({
          testId: id,
          date: result.date,
          value: result.value,
          status: 1,
          userId,
        })
      }
    })
  }

  const addedTest = dbTests.getTestById(id, userId)
  const addedTestResults = dbResults.getResultsByTestId(id, userId)

  if (!addedTestResults.length) {
    dbTests.editTest(id, userId, {
      showFrom: '',
      showTo: '',
    })
  }
  return res.json(formatTestToSend(addedTest, addedTestResults))
}

function deleteTest (req, res) {
  const userId = req.user.id
  const id = req.params.id

  dbTests.editTest(id, userId, { status: 0 })
  return res.json({ id })
}

function changeTestPosition (req, res) {
  const userId = req.user.id
  const id = req.params.id
  const { newPosition, oldPosition } = req.body
  dbTests.changePosition(id, userId, oldPosition, newPosition)
  return res.json({ id })
}

function errorTitleLength (title) {
  const maxLength = 45

  return title.length > maxLength
   ? `Название должно быть короче ${maxLength} символов`
   : ''
}

module.exports = {
  getAllTests,
  addTest,
  editTest,
  deleteTest,
  changeTestPosition,
}
