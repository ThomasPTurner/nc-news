const { connection } = require('../connection')

exports.fetchArticles = () => {
    return connection('articles')
        .select('*')
}

exports.fetchArticleById = (id) => {
    return connection('articles')
        .select('*')
        .where({id})
}

exports.changeArticle = (id, {body, title, topic}) => {
    return connection('articles')
    .select('*')
    .where({id})
    .update({ body })
    .returning('*')
    .then(article => article)
}