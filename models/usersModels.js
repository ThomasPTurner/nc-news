const { connection } = require('../connection')

exports.fetchUsers = () => connection('users')
    .select('*');

exports.fetchUserById = (id) => connection('users')
    .select('*')
    .where('username','=',id)