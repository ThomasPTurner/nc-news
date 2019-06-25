const { fetchArticles, fetchArticleById }  = require('../models')

const getArticles = (req, res, next) => {
    return fetchArticles()
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch(next)
}
const getArticleById = ({params: { id }}, res, next)=>{
    return fetchArticleById(id)
        .then(([article]) => {
            if (!article) return Promise.reject({code: 404, msg: 'article not found'})
            res.status(200).send({article});
        })
        .catch(next);
}
module.exports = { getArticles, getArticleById }
