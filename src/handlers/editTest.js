const {errorTitleLength, formatTestToSend} = require('../helpers')
const dbTests = require('../db/db-tests.js')
const dbResults = require('../db/db-results.js')


module.exports = function editTest (req, res) {
  const userId = req.user.id
  const id = req.params.id

  // взять только подходящие поля
  const arr = ['title', 'isShowAverage', 'normalFrom', 'normalTo', 'isHidden', 'showFrom', 'showTo']
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

    const edgeDates = dbResults.getEdgeDates(id, userId)

    dbTests.editTest(id, userId, {
      showFrom: edgeDates.showFrom,
      showTo: edgeDates.showTo,
    })
  }

  const addedTest = dbTests.getTestById(id, userId)
  const addedTestResults = dbResults.getResultsByTestId(id, userId)

  return res.json(formatTestToSend(addedTest, addedTestResults))
}