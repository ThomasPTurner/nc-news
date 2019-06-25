const { connection } = require('../connection')

exports.fetchUsers = () => {
    return connection('users')
        .select('*')
}