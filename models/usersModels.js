const { connection } = require('../connection')
const { addSortByAndOrder, addPagination, rejectBadOrderQuery } = require('../db/utils/utils')

exports.fetchUsers = ({sort_by = 'username', order, limit, p}, username) => {
    const usersQuery = connection('users')
        .select('users.*')
        .leftJoin('articles', 'username', '=', 'articles.author')
        .groupBy('username')
        .countDistinct({article_count: 'articles.id'})
        .leftJoin('comments', 'username', '=', 'comments.author')
        .countDistinct({comment_count: 'comments.id'})
        .sumDistinct({comment_votes: 'comments.votes'})
        .sumDistinct({article_votes: 'articles.votes'})
        .modify((query)=> {
            if (username) query.where({username})
        })
    addPagination(usersQuery, limit, p)
    addSortByAndOrder(usersQuery, sort_by, order)
    
    const promiseArr = [usersQuery]
    rejectBadOrderQuery(order, promiseArr)
    return Promise.all(promiseArr)
        .then((promises) => promises[promises.length - 1])
}

exports.createUser = ({username, avatar_url, name}) => {
    if (!username || !avatar_url || !name) return Promise.reject({code:400, msg: 'bad request'})
    return connection('users')
        .insert({username, avatar_url, name})
        .returning('*')
}