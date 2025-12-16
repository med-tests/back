const express = require('express')
const cors = require('cors')
const {login, register} = require('./auth/auth')
const {checkAuth} = require('./auth/checkAuth')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(cors())
}

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
