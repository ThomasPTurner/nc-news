const { fetchArticles, fetchArticleById, changeArticle }  = require('../models')

exports.getArticles = (req, res, next) => {
    return fetchArticles()
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch(next)
}
exports.getArticleById = ({params: { id }}, res, next)=>{
    return fetchArticles(id)
        .then(([article]) => {
            if (!article) return Promise.reject({code: 404, msg: 'article not found'})
            res.status(200).send({article});
        })
        .catch(next);
}
exports.patchArticle = ({body, params: { id }}, res, next) => {
    return changeArticle(id, body)
    .then(([article])=>{
        if (!article) return Promise.reject({code: 404, msg: 'article not found'})
        res.status(200).send({article})
    })
    .catch(next)
};
