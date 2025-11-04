const {getAllTests, addTest} = require('./handlers.js')


module.exports = function (router) {
  // Получить все анализы
  router.get('/', getAllTests)

  // Добавить анализ с результатами
  router.post('/add-test', addTest)
}
