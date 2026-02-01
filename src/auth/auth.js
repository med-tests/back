const bcrypt = require('bcryptjs')
const dbAuth = require('../db/db-auth')
const moment = require('moment')
const jwt = require('jsonwebtoken')

function login(req, res) {
    if (!validCredentials(req.body)) {
        return res.json({
            error_code: 2,
            message: 'Недостаточно данных',
            error: true,
        })
    }
    const {login, password} = req.body
    const user = dbAuth.getUserByLogin(login)
    if (!user || !bcrypt.compareSync(password, user.password || '')) {
        return res.json({
            error_code: 2,
            message: 'Неверный логин или пароль',
            error: true,
        })
    }

    return res.json({
        token: createJwt(login),
    })
}

function register(req, res) {
    if (!validCredentials(req.body)) {
        return res.json({
            message: 'Недостаточно данных',
            error: true,
        })
    }
    const {login, password} = req.body
    if (dbAuth.getUserIdByLogin(login) !== 0) {
        return res.json({
            message: 'Логин занят',
            error: true,
        })
    }
    const hashPassword = bcrypt.hashSync(password)
    dbAuth.createUser(login, hashPassword, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
    return res.json({
        token: createJwt(login),
    })
}

function validCredentials(body) {
    if (
        !Object.hasOwn(body, 'login')
        || !Object.hasOwn(body, 'password')
    ) {
        return false
    }

    return true
}

function createJwt(login) {
    return jwt.sign(
      { login: login, userId: dbAuth.getUserIdByLogin(login) },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    )
}

module.exports = {
    login,
    register,
}
