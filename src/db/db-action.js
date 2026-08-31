const db = require('./db-init.js')

async function doAction() {
  try {
    await db.prepare('ALTER TABLE tests ADD COLUMN isShowAverage INTEGER DEFAULT 0').run()
    console.log('Колонка успешно добавлена')
  }
  catch (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('Column already exists, skipping...')
    } else {
      throw err
    }
  }
}

doAction()
