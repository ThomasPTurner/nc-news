const { addPagination, addSortByAndOrder } = require('../db/utils/utils')
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
    const commentsQuery = connection('comments')
        .select('*')
        .modify(commentsQuery => {
            if(article_id) commentsQuery.where({article_id})
        })
    addSortByAndOrder(commentsQuery, sort_by, order)
    addPagination(commentsQuery, limit, p)
    return commentsQuery
}

exports.updateComment = ( { comment_id }, { inc_votes, ...rest}) => connection('comments')
        .increment({votes: inc_votes || 0})
        .where({id: comment_id})
        .returning('*')


exports.removeComment = ({ comment_id }) => connection('comments')
        .where({id: comment_id})
        .delete()
        .returning('*')


exports.fetchCommentCount = ({id: article_id}) => connection('comments')
        .count('article_id AS total_count')
        .first()
        .modify(query => {
            if (article_id) query.where({article_id})
        })
