const { connection } = require('../connection')
const { addSortByAndOrder, addPagination, rejectBadOrderQuery } = require('../db/utils/utils')

exports.fetchUsers = ({sort_by = 'username', order, limit, p}) => {
    const usersQuery = connection('users')
        .select('*');
    addPagination(usersQuery, limit, p)
    addSortByAndOrder(usersQuery, sort_by, order)
    
    const promiseArr = [usersQuery]
    rejectBadOrderQuery(order, promiseArr)
    return Promise.all(promiseArr)
        .then((promises) => promises[promises.length - 1])
}
// add article votes, article totals, comment totals and comment votes totals.


exports.fetchUserById = (id) => connection('users')
    .select('*')
    .where('username','=',id)