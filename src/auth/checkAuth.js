const jwt = require('jsonwebtoken')
const dbAuth = require('../db/db-auth')

function checkAuth(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.json({
            error_code: 1,
            message: 'Ошибка авторизации. Необходимо авторизоваться.',
            error: true,
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.json({
                message: 'Ошибка авторизации. Токен устарел.',
                error_code: 1,
                error: true,
            })
        }

        req.user = dbAuth.getUserById(data.userId)
        if (!req.user) {
            return res.json({
                error_code: 1,
                message: 'Пользователь не найден',
                error: true,
            })
        }
        next()
    })
}

module.exports = {
    checkAuth,
}
