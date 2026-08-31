const {
  getAllTests,
  addTest,
  editTest,
  deleteTest,
  changeTestPosition,
  addMultiResults,
} = require('./handlers.js')

module.exports = function (app) {
  // Получить все анализы
  app.get('/api/get-tests', getAllTests)

  // Добавить анализ с результатами
  app.post('/api/add-test', addTest)

  // Редактировать анализ
  app.patch('/api/edit-test/:id', editTest)

  // Удалить анализ
  app.delete('/api/delete-test/:id', deleteTest)

  // Изменить порядок анализов в списке
  app.patch('/api/position/:id', changeTestPosition)

  // Добавить несколько результатов к нескольким показателям
  app.post('/api/add-multi-results', addMultiResults)
}
