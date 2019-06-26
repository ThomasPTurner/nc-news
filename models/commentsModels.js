const { connection } = require('../connection')

exports.createComment = ({params:{id: article_id}, body:{username: author, body}}) => {
    return connection('comments')
        .insert({ article_id, author, body})
        .where({article_id})
        .returning('*')
}

exports.fetchComments = ({params: {id: article_id}, query: {sort_by, order}}) => {
    return connection('comments')
        .select('*')
        .where({article_id})
        .modify((query) => {
            if (!sort_by)
                query.orderBy('votes', order || 'desc') //only votes should default to decending
            else {
                query.orderBy(sort_by || order || 'asc')
            }
        })
        
}

exports.updateComment = ({params:{ id: article_id, comment_id }, body:{ inc_votes, ...rest}}) => {
    if (Object.keys(rest).length || !inc_votes) { // validate object
        return Promise.reject({code: 400, msg: 'bad request'})
    }
    return connection('comments')
        .increment({votes: inc_votes})
        .where({article_id, id: comment_id})
        .returning('*')
}

exports.removeComment = ({params: {id: article_id, comment_id}}) => {
    return connection('comments')
        .where({article_id, id: comment_id})
        .delete()
        .returning('*')
}