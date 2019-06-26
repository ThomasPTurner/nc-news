const { connection } = require('../connection')

exports.fetchArticles = ({params :{id}, query: {sort_by, order, author, topic}}) => {
    if (!(['asc', 'desc', undefined]).includes(order)) return Promise.reject({code: 400, msg: 'bad request'})
    return connection('articles')
        .select('articles.*')
        .count('comments.id AS comment_count')
        .leftJoin('comments','articles.id','=','comments.article_id')
        .groupBy('articles.id')
        .modify(query => {
            if (id) query.where({['articles.id']: id})
            if (author) query.where({['articles.author']: author})
            if (topic) query.where({['articles.topic']: topic})
        })
        .modify((query) => {
            if (!sort_by)
                query.orderBy('votes', order || 'desc') //only votes should default to decending
            else {
                query.orderBy(sort_by || order || 'asc')
            }
        })
}

exports.changeArticle = ({params: {id}, body: {inc_votes, ...rest}}) => {
    if (Object.keys(rest).length || !inc_votes) { // validate object
        return Promise.reject({code: 400, msg: 'bad request'})
    }
    return connection('articles')
    .select('*')
    .where({id})
    .increment('votes', inc_votes)
    .returning('*')
}
