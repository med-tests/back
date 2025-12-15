const express = require('express')
const cors = require('cors')
const {login, register} = require('./auth/auth')
const {checkAuth} = require('./auth/checkAuth')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

const whitelist = [
  'http://127.0.0.1:8080',
  'http://localhost:8080',
  'http://med-tests.fvds.ru',
  process.env.SERVER_IP,
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    }
  }
}
app.use(cors(corsOptions))

app.use(express.json())
app.post('/api/login', login)
app.post('/api/register', register)

app.use(checkAuth)
require('./routes.js')(app)

try {
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
  })
} catch (e) {
  console.log(e)
}
