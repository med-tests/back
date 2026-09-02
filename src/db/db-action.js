const db = require('./db-init.js')

async function doAction() {
  try {
    // await db.prepare('ALTER TABLE tests ADD COLUMN isShowAverage INTEGER DEFAULT 0').run()
    // console.log('Колонка успешно добавлена')

    // переименование колонки
    // db.exec(`ALTER TABLE results RENAME COLUMN test_id TO testId;`)
    // console.log('Колонка успешно переименована')
  }
  catch (err) {
    console.log(err)
  }
}

doAction()
