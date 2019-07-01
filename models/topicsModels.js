const { connection } = require('../connection');
const { addSortByAndOrder, addPagination, rejectBadOrderQuery } = require('../db/utils/utils')

exports.fetchTopics = ({sort_by = 'slug', order, limit, p}) => {
    const topicsQuery = connection('topics')
        .select('*')
    addPagination(topicsQuery, limit, p)
    addSortByAndOrder(topicsQuery, sort_by, order);
    const promiseArr = [topicsQuery]
    rejectBadOrderQuery(order, promiseArr)
    return Promise.all(promiseArr)
        .then((promises) => promises[promises.length - 1])
}
