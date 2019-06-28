const { fetchArticles, changeArticle, fetchArticleCount, createArticle }  = require('../models')
const { rejectEmptyArr } = require('../db/utils/utils')

const getArticles = ({params, query}, res, next) => Promise.all([fetchArticles(params, query), fetchArticleCount(query)])
    .then(([articles, {total_count}])=> {
        const output = {articles, total_count}
        res.status(200).send(output)
    })
    .catch(next)

const getArticleById = ({params, query}, res, next)=> fetchArticles(params, query)
        .then(rejectEmptyArr)
        .then(([article]) => res.status(200).send({article}))
        .catch(next);


const patchArticle = ({params, body, query}, res, next) => changeArticle(params, body)
    .then(rejectEmptyArr)
    .then(()=> getArticleById({params, query}, res, next))
    .catch(next);

const postArticle = ({body}, res, next) => createArticle(body)
    .then(([article])=> res.status(200).send({article}))

module.exports = { getArticles, getArticleById, patchArticle, postArticle } 