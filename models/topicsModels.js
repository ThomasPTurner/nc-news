const { connection } = require('../connection');
const { addSortByAndOrder } = require('../db/utils/utils')

exports.fetchTopics = ({sort_by = 'slug', order}) => {
    const topicsQuery = connection('topics')
        .select('*')
    addSortByAndOrder(topicsQuery, sort_by, order);
    return topicsQuery
}
