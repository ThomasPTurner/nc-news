const { connection } = require('../connection')
const { addSortByAndOrder, addPagination, rejectBadOrderQuery } = require('../db/utils/utils')

exports.fetchUsers = ({sort_by = 'username', order, limit, p}) => {
    const usersQuery = connection('users')
        .select('users.*')
        .leftJoin('articles', 'username', '=', 'articles.author')
        .groupBy('username')
        .countDistinct({article_count: 'articles.id'})
        .leftJoin('comments', 'username', '=', 'comments.author')
        .countDistinct({comment_count: 'comments.id'})
        .sumDistinct({comment_votes: 'comments.votes'})
        .sumDistinct({article_votes: 'articles.votes'})
    addPagination(usersQuery, limit, p)
    addSortByAndOrder(usersQuery, sort_by, order)
    
    const promiseArr = [usersQuery]
    rejectBadOrderQuery(order, promiseArr)
    return Promise.all(promiseArr)
        .then((promises) => promises[promises.length - 1])
}

exports.fetchUserById = (id) => connection('users')
    .select('*')
    .where('username','=',id)

exports.createUser = (body) => {
    return connection('users')
        .insert(body)
        .returning('*')
}