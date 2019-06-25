const { connection } = require('../connection')

exports.fetchArticles = () => {
    return connection('articles')
        .select('*')
}

exports.fetchArticleById = (id) => {
    return connection('articles')
        .select('articles.id','articles.topic', 'articles.title', 'articles.body')
        .countDistinct('comments.id AS comment_count')
        .join('comments','articles.id','=','comments.article_id')
        .groupBy('articles.id')
        .where({['articles.id']: id})
}

exports.changeArticle = (id, {inc_votes}) => {
    return connection('articles')
    .select('*')
    .where({id})
    .increment('votes', inc_votes)
    .returning('votes')
}