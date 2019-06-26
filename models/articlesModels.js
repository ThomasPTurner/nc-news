const { connection } = require('../connection')

exports.fetchArticles = () => {
    return connection('articles')
        .select('*')
}

exports.fetchArticleById = (id) => {
    return connection('articles')
        .select(
            `articles.author`,
            `articles.title`,
            `articles.id`,
            `articles.body`,
            `articles.topic`,
            `articles.created_at`,
            `articles.votes`
        )
        .countDistinct('comments.id AS comment_count')
        .join('comments','articles.id','=','comments.article_id')
        .groupBy('articles.id')
        .where({['articles.id']: id})
}

exports.changeArticle = (id, {inc_votes, ...rest}) => {
    if (Object.keys(rest).length || !inc_votes) { // validate object
        return Promise.reject({code: 400, msg: 'bad request'})
    }
    return connection('articles')
    .select('*')
    .where({id})
    .increment('votes', inc_votes)
    .returning('votes')
}