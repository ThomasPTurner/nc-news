const { connection } = require('../connection')

exports.fetchArticles = ({id},{sort_by, order, author, topic}) => {
    if (!(['asc', 'desc', undefined]).includes(order)) return Promise.reject({code: 400, msg: 'bad request'})
    return connection('articles')
        .select('articles.*')
        .count('comments.id AS comment_count')
        .leftJoin('comments','articles.id','=','comments.article_id')
        .groupBy('articles.id')
        .modify(query => {
            if (id) query.where({['articles.id']: id})
            if (author) query.where({['articles.author']: author})
            if (topic) query.where({['articles.topic']: topic})
        })
        .orderBy(sort_by || 'created_at', order || 'desc')
}

exports.changeArticle = ({id}, {inc_votes, ...rest}) => {
    console.log(id, inc_votes)
    if (Object.keys(rest).length || !inc_votes) { // validate object
        return Promise.reject({code: 400, msg: 'bad request'})
    }
    return connection('articles')
    .where({['articles.id']: id})
    .increment('votes', inc_votes)
    .returning('*')
}
