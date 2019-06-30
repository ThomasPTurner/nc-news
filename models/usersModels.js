const { connection } = require('../connection')
const { addSortByAndOrder } = require('../db/utils/utils')

exports.fetchUsers = ({sort_by = 'username', order}) => {
    const usersQuery = connection('users')
        .select('*');
    addSortByAndOrder(usersQuery, sort_by, order)
    return usersQuery
}
// add article votes, article totals, comment totals and comment votes totals.


exports.fetchUserById = (id) => connection('users')
    .select('*')
    .where('username','=',id)