const { connection } = require('../connection')
const { rejectEmptyArr, addPagination } = require('../db/utils/utils')

exports.fetchArticles = ({id},{sort_by, order, author, topic, limit= 10, p = 1 }= {}) => {
    if (!(['asc', 'desc', undefined]).includes(order)) return Promise.reject({code: 400, msg: 'bad request'})
    const promiseArticles = connection('articles')
        .select('articles.*')
        .count('comments.article_id AS comment_count')
        .leftJoin('comments','articles.id','=','comments.article_id')
        .groupBy('articles.id')
        .modify(query => {
            if (id) query.where({['articles.id']: id})
            if (author) query.where({['articles.author']: author})
            if (topic) query.where({['articles.topic']: topic})
            if (limit !== -1) {
                query.limit(limit)
                    .offset(limit * (p - 1))
            }
        })
        .orderBy(sort_by || 'created_at', order || 'desc')
    const promiseArr = [promiseArticles] // build an array of promises so we're not querying when we don't have to
    if (topic)  {
        const checkTopics = (connection('topics')
            .select('*')
            .where({slug: topic}))
            .then(rejectEmptyArr)
        promiseArr.unshift(checkTopics)
    }
    if (author) {
        const checkAuthor = (connection('users')
            .select('*')
            .where({username: author}))
            .then(rejectEmptyArr)
        promiseArr.unshift(checkAuthor)
    }
    return Promise.all(promiseArr)
        .then((promiseArr) => {
            return promiseArr[promiseArr.length-1]
        })
}

exports.changeArticle = ({id}, {inc_votes, ...rest}) => {
    if (Object.keys(rest).length || !inc_votes) { // validate object
        return Promise.reject({code: 400, msg: 'bad request'})
    }
    return connection('articles')
        .where({['articles.id']: id})
        .increment({votes: inc_votes || 0})
        .returning('*')
}

exports.fetchArticleCount = ({id = 'id'},{author, topic}) => {
    return connection('articles')
        .count(`${id} AS count`)
        .first()
        .modify(query => {
            if (author) query.where({['articles.author']: author})
            if (topic) query.where({['articles.topic']: topic})
        })
}

