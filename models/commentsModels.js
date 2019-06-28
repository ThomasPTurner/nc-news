const { connection } = require('../connection')

exports.createComment = ({id: article_id}, {username: author, body}) => {
    if (!article_id) return Promise.reject({code:405, msg: 'Method Not Allowed'})
    return connection('comments')
        .insert({ article_id, author, body })
        .where({article_id})
        .returning('*')
}

exports.fetchComments = ({id: article_id}, {p=1, sort_by, order, limit=10 }= {}) => {
    if (!(['asc', 'desc', undefined]).includes(order)) return Promise.reject({code: 400, msg: 'bad request'})
    return connection('comments')
        .select('*')
        .orderBy(sort_by || 'created_at', order || 'desc')
        .modify(query => {
            if(article_id) query.where({article_id})
            if (limit !== -1) {
                query.limit(limit)
                    .offset(limit * (p - 1))
            }
        })
}

exports.updateComment = ( { comment_id }, { inc_votes, ...rest}) => {
    return connection('comments')
        .increment({votes: inc_votes || 0})
        .where({id: comment_id})
        .returning('*')
}

exports.removeComment = ({ comment_id }) => {
    return connection('comments')
        .where({id: comment_id})
        .delete()
        .returning('*')
}

exports.fetchCommentCount = ({id: article_id}) => {
    return connection('comments')
        .count('article_id AS total_count')
        .first()
        .modify(query => {
            if (article_id) query.where({article_id})
        })
}