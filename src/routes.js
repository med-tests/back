const {
  getAllTests,
  addTest,
  editTest,
} = require('./handlers.js')

module.exports = function (router) {
  // Получить все анализы
  router.get('/get-tests', getAllTests)

  // Добавить анализ с результатами
  router.post('/add-test', addTest)

  // Редактировать тест (в т.ч. удалить)
  router.patch('/edit-test/:id', editTest)
}
