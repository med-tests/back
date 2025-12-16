const express = require('express')
const cors = require('cors')
const {login, register} = require('./auth/auth')
const {checkAuth} = require('./auth/checkAuth')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

// app.enable('trust proxy')

const whitelist = [
  'http://localhost:5173',
  'http://med-tests.fvds.ru',
]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    }
  }
}
app.use(cors(corsOptions))


app.use((req, res, next) => {
  console.log('req.ip', req.ip)
  // if (!req.headers.origin) {
  //   const clientIp = req.ip;
  //
  //   console.log('clientIp', clientIp)
    // Можно добавить дополнительную проверку IP
    // const allowedIps = ['trusted-ip-1', 'trusted-ip-2'];
    // if (!allowedIps.includes(clientIp)) {
    //   return res.status(403).send('Forbidden');
    // }
  // }
  next();
})

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
