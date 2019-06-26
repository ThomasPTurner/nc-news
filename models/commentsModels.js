const { connection } = require('../connection')

exports.createComment = ({id}, {username, body}) => {
    return connection('comments')
        .insert({ article_id: id, author: username, body})
        .where({article_id: id})
        .returning('*')
}