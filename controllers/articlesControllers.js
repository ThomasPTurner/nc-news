const { fetchArticles, changeArticle }  = require('../models')

const getArticles = (req, res, next) => {
    return fetchArticles(req)
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch(next)
}

const getArticleById = (req, res, next)=>{
    return fetchArticles(req)
        .then(([article]) => {
            if (!article) return Promise.reject({code: 404, msg: 'article not found'})
            res.status(200).send({article});
        })
        .catch(next);
}

const patchArticle = (req, res, next) => {
    return changeArticle(req)
    .then(([article])=>{
        if (!article) return Promise.reject({code: 404, msg: 'article not found'})
        else return getArticleById(req, res, next)
    })
    .catch(next);
};

module.exports = { getArticles, getArticleById, patchArticle } 