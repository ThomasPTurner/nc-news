const { connection } = require('../connection')
const { addSortByAndOrder, condenseAndAddCount, addPagination, checkForBadProperty, rejectBadOrderQuery } = require('../db/utils/utils')

exports.fetchArticles = ({id},{sort_by, order, author, topic, limit= 10, p = 1 }= {}) => {
    
    const articlesQuery = connection('articles')
        .select('articles.*')
        .leftJoin('comments','articles.id','=','comments.article_id')
        .modify(query => {
            if (id) query.where({['articles.id']: id})
            if (author) query.where({['articles.author']: author})
            if (topic) query.where({['articles.topic']: topic})
        })
    addSortByAndOrder(articlesQuery, sort_by, order)
    condenseAndAddCount(articlesQuery, 'comments.article_id', 'comment_count')
    addPagination(articlesQuery, limit, p)

    // build an array of promises. full query is last so we're not querying when we don't have to
    const promiseArr = [articlesQuery]
    rejectBadOrderQuery(order, promiseArr)
    checkForBadProperty(topic, 'slug', 'topics', promiseArr)
    checkForBadProperty(author, 'username', 'users', promiseArr)

    return Promise
        .all(promiseArr)
        .then((promiseArr) => promiseArr[promiseArr.length-1])
}

exports.changeArticle = ({id}, {inc_votes, ...rest}) => connection('articles')
        .where({['articles.id']: id})
        .increment({votes: inc_votes || 0})
        .returning('*');

exports.fetchArticleCount = ({author, topic}) => connection('articles')
    .count(`id AS total_count`)
    .first()
    .modify(query => {
        if (author) query.where({['articles.author']: author})
        if (topic) query.where({['articles.topic']: topic})
    });

exports.createArticle = ({username: author, ...rest}) => connection('articles')
    .insert({author, ...rest})
    .returning('*');

exports.removeArticleById = ({id}) => connection('comments')
        .where({article_id: id})
        .delete()
        .then(()=> connection('articles')
            .where({id})
            .delete()
            .returning('*')
        );

