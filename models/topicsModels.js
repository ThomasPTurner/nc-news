const { connection } = require('../connection');
const { addSortByAndOrder, addPagination, rejectBadOrderQuery } = require('../db/utils/utils')

exports.fetchTopics = ({sort_by = 'slug', order, limit, p}) => {
    const topicsQuery = connection('topics')
        .select('topics.*')
        .leftJoin('articles', 'slug', '=', 'articles.topic')
        .groupBy('slug')
        .count({article_count: 'articles.topic'})
    addPagination(topicsQuery, limit, p)
    addSortByAndOrder(topicsQuery, sort_by, order);
    const promiseArr = [topicsQuery]
    rejectBadOrderQuery(order, promiseArr)
    return Promise.all(promiseArr)
        .then((promises) => promises[promises.length - 1])
}

exports.createTopic = (({slug, description}) => {
    return connection('topics')
        .insert({slug, description})
        .returning('*')
})