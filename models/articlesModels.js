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