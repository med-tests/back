const express = require('express')
const cors = require('cors')
const {login, register} = require('./auth/auth')
const {checkAuth} = require('./auth/checkAuth')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

const env = process.env.NODE_ENV

console.log(`\nЗапуск в режиме: ${env}`)

const corsOptions = {
  methods: 'GET,PATCH,POST,DELETE',
}
if (env === 'development') {
  corsOptions.origin = '*'
} else if (env === 'production') {
  corsOptions.origin = 'https://med-tests.fvds.ru'
}
app.use(cors(corsOptions))

app.use(express.json())

app.post('/api/login', login)
app.post('/api/register', register)

app.use(checkAuth)
require('./routes.js')(app)

try {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`)
  })
} catch (e) {
  console.log(e)
}
