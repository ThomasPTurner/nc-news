const { connection } = require('../connection');

exports.fetchTopics = () => connection('topics')
    .select('*')
