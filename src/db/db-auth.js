const db = require('./db-init')

module.exports = {
    createUser: (login, password, dateCreate) => {
        return db
            .prepare('INSERT INTO users (login, password, date_create) VALUES (?,?,?)')
            .run(login, password, dateCreate)
    },
    getUserIdByLogin: (login) => {
        return db
            .prepare('SELECT id FROM users WHERE login=? LIMIT 1')
            .get(login)?.id || 0
    },
    getUserByLogin: (login) => {
        return db
            .prepare('SELECT id, login, password FROM users WHERE login=? LIMIT 1')
            .get(login)
    },
    getUserById: (userId) => {
        return db
            .prepare('SELECT id, login, date_create FROM users WHERE id=? LIMIT 1')
            .get(userId)
    },
}
