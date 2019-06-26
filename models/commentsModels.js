const { connection } = require('../connection')

exports.createComment = ({params:{id}, body:{username, body}}) => {
    return connection('comments')
        .insert({ article_id: id, author: username, body})
        .where({article_id: id})
        .returning('*')
}

exports.fetchComments = (id) => {
    return connection('comments')
        .select('*')
        .where({article_id: id})
}

exports.updateComment = ({params:{ id, comment_id }, body:{ inc_votes, ...rest}}) => {
    if (Object.keys(rest).length || !inc_votes) { // validate object
        return Promise.reject({code: 400, msg: 'bad request'})
    }
    return connection('comments')
        .increment({votes: inc_votes})
        .where({article_id: id, id: comment_id})
        .returning('*')
}

exports.removeComment = ({params: {id, comment_id}}) => {
    return connection('comments')
        .where({article_id: id, id: comment_id})
        .delete()
        .returning('*')
}