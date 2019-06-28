const { connection } = require('../connection')
const { rejectEmptyArr, addPagination } = require('../db/utils/utils')

exports.fetchArticles = ({id},{sort_by, order, author, topic, limit= 10, p = 1 }= {}) => {

    if (!(['asc', 'desc', undefined]).includes(order)) return Promise.reject({code: 400, msg: 'bad request'})

    const articlesQuery = connection('articles')
        .select('articles.*')
        .count('comments.article_id AS comment_count')
        .leftJoin('comments','articles.id','=','comments.article_id')
        .groupBy('articles.id')
        .orderBy(sort_by || 'created_at', order || 'desc')
        .modify(query => {
            if (id) query.where({['articles.id']: id})
            if (author) query.where({['articles.author']: author})
            if (topic) query.where({['articles.topic']: topic})
        })
    
    addPagination(articlesQuery, limit, p)
    
    const checkForBadProperty = (key, value, table, arr) => {
        if (value) {
            const query = connection(table)
                .select('*')
                .where({[key]: value})
                .then(rejectEmptyArr)
            arr.unshift(query)
        }
    }
    
    const promiseArr = [articlesQuery] // build an array of promises so we're not querying when we don't have to
    checkForBadProperty('slug', topic, 'topics', promiseArr)
    checkForBadProperty('username', author, 'users', promiseArr)
    return Promise.all(promiseArr)
        .then((promiseArr) => promiseArr[promiseArr.length-1])
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

exports.fetchArticleCount = ({author, topic}) => connection('articles')
        .count(`id AS total_count`)
        .first()
        .modify(query => {
            if (author) query.where({['articles.author']: author})
            if (topic) query.where({['articles.topic']: topic})
        })

exports.createArticle = ({username: author, ...rest}) => connection('articles')
        .insert({author, ...rest})
        .returning('*')
