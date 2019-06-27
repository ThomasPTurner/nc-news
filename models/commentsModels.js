const { connection } = require('../connection')

exports.createComment = ({id: article_id}, {username: author, body}) => {
    return connection('comments')
        .insert({ article_id, author, body})
        .where({article_id})
        .returning('*')
}

exports.fetchComments = ({id: article_id}, {sort_by, order}) => {
    if (!(['asc', 'desc', undefined]).includes(order)) return Promise.reject({code: 400, msg: 'bad request'})
    return connection('comments')
        .select('*')
        .where({article_id})
        .orderBy(sort_by || 'created_at', order || 'desc')
}

exports.updateComment = ( {id: article_id, comment_id }, { inc_votes, ...rest}) => {
    if (Object.keys(rest).length || !inc_votes) { // validate object
        return Promise.reject({code: 400, msg: 'bad request'})
    }
    return connection('comments')
        .increment({votes: inc_votes})
        .where({article_id, id: comment_id})
        .returning('*')
}

exports.removeComment = ({id: article_id, comment_id}) => {
    return connection('comments')
        .where({article_id, id: comment_id})
        .delete()
        .returning('*')
}