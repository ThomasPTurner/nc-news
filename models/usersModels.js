const { connection } = require('../connection')

exports.fetchUsers = () => {
    return connection('users')
        .select('*')
}

exports.fetchUserById = (id) => {
    return connection('users')
        .select('*')
        .where('username','=',id)
}