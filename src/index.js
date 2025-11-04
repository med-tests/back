const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()

// Todo настроить, когда будет сервер
// const whitelist = [
//   'http://127.0.0.1:8080',
//   'http://localhost:8080',
//   'http://162.250.125.132',
//   'http://affystat.durban',
// ]
//
// const corsOptions = {
//   // @ts-ignore
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     }
//   }
// }
// app.use(cors(corsOptions))

app.use(cors())
app.use(express.json())

require('./routes.js')(app)

try {
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
  })
} catch (e) {
  console.log(e)
}
