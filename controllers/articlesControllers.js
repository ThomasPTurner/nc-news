const { fetchArticles, changeArticle }  = require('../models')

exports.getArticles = (req, res, next) => {
    return fetchArticles(req)
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch(next)
}

exports.getArticleById = (req, res, next)=>{
    return fetchArticles(req)
        .then(([article]) => {
            if (!article) return Promise.reject({code: 404, msg: 'article not found'})
            res.status(200).send({article});
        })
        .catch(next);
}

exports.patchArticle = (req, res, next) => {
    return changeArticle(req)
    .then(([article])=>{
        if (!article) return Promise.reject({code: 404, msg: 'article not found'})
        res.status(200).send({article})
    })
    .catch(next);
};
