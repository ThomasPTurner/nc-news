const { connection } = require('../connection')

exports.fetchArticles = ({id},{sort_by, order, author, topic}= {}) => {
    if (!(['asc', 'desc', undefined]).includes(order)) return Promise.reject({code: 400, msg: 'bad request'})
    const promiseArticles = connection('articles')
        .select('articles.*')
        .count('comments.id AS comment_count')
        .leftJoin('comments','articles.id','=','comments.article_id')
        .groupBy('articles.id')
        .modify(query => {
            if (id) query.where({['articles.id']: id})
            if (author) query.where({['articles.author']: author})
            if (topic) query.where({['articles.topic']: topic})
        })
        .orderBy(sort_by || 'created_at', order || 'desc')
    
    const promiseArr = [promiseArticles] // build an array of promises so we're not querying when we don't have to
    if (topic)  {
        const checkTopics = (connection('topics').select('*').where({slug: topic})) // eventually re-factor these into single query, only query once if there's both a topic and an author in the endpoint query.
        promiseArr.push(checkTopics)
    }
    if (author) {
        const checkAuthor = (connection('users').select('*').where({username: author}))
        promiseArr.push(checkAuthor)
    }

    return Promise.all(promiseArr)
        .then((promiseArr) => {
            if (!promiseArr.slice(1).every(([el])=> el)) { //did any come back empty?
                return Promise.reject({code: 404, msg: 'not found'})
            } 
            return promiseArr[0]
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
