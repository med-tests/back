const {
  getAllTests,
  addTest,
  editTest,
} = require('./handlers.js')

module.exports = function (router) {
  // Получить все анализы
  router.get('/api/get-tests', getAllTests)

  // Добавить анализ с результатами
  router.post('/api/add-test', addTest)

  // Редактировать тест (в т.ч. удалить)
  router.patch('/api/edit-test/:id', editTest)
}
