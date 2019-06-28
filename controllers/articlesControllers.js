const { fetchArticles, changeArticle, fetchArticleCount }  = require('../models')
const { rejectEmptyArr } = require('../db/utils/utils')

const getArticles = ({params, query}, res, next) => {
    return Promise.all([fetchArticles(params, query), fetchArticleCount(params, query)])
    .then(([articles, {count} ])=> {
        const output = {
            articles: articles,
            total_count: count
        }
        res.status(200).send(output)
    })
    .catch(next)
}

const getArticleById = ({params, query}, res, next)=>{
    return fetchArticles(params, query)
        .then(rejectEmptyArr)
        .then(([article]) => res.status(200).send({article}))
        .catch(next);
}

const patchArticle = ({params, body, query}, res, next) => {
    return changeArticle(params, body)
    .then(rejectEmptyArr)
    .then(()=> getArticleById({params, query}, res, next))
    .catch(next);
};

module.exports = { getArticles, getArticleById, patchArticle } 