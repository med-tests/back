const db = require('./db-init.js')
const moment = require('moment')

const timestamp = moment(new Date()).format('DD-MM-YY_HH-mm')

const backupPath = `backup_${timestamp}.db`

db.backup(backupPath)
  .then(() => {
    console.log(`Бэкап создан: ${backupPath}`)
  })
  .catch(err => {
    console.error('Ошибка при создании бэкапа:', err)
  })