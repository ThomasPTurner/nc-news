const { fetchArticles, changeArticle }  = require('../models')

const getArticles = ({params, query}, res, next) => {
    return fetchArticles(params, query)
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch(next)
}

const getArticleById = ({params, query}, res, next)=>{
    return fetchArticles(params, query)
        .then(([article]) => {
            if (!article) return Promise.reject({code: 404, msg: 'article not found'})
            res.status(200).send({article});
        })
        .catch(next);
}

const patchArticle = ({params, body, query}, res, next) => {
    return changeArticle(params, body)
    .then(([article])=>{
        if (!article) return Promise.reject({code: 404, msg: 'article not found'})
        else return getArticleById({params, query}, res, next)
    })
    .catch(next);
};

module.exports = { getArticles, getArticleById, patchArticle } 