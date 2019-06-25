const { connection } = require('../connection')

exports.fetchArticles = () => {
    return connection('articles')
        .select('*')
}