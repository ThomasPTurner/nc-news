const { connection } = require('../connection')

exports.fetchTopics = () => {
    return connection('topics')
        .select('*')
}