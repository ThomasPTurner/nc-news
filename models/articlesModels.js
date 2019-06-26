const { connection } = require('../connection')

exports.fetchArticles = (id) => {
    return connection('articles')
        .select('articles.*')
        .count('comments.id AS comment_count')
        .leftJoin('comments','articles.id','=','comments.article_id')
        .groupBy('articles.id')
        .modify(query => {
            if (id) query.where({['articles.id']: id})
        })
}

exports.changeArticle = (id, {inc_votes, ...rest}) => {
    if (Object.keys(rest).length || !inc_votes) { // validate object
        return Promise.reject({code: 400, msg: 'bad request'})
    }
    return connection('articles')
    .select('*')
    .where({id})
    .increment('votes', inc_votes)
    .returning('*')
}
