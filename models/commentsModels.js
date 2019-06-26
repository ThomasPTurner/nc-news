const { connection } = require('../connection')

exports.createComment = ({id}, {username, body}) => {
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