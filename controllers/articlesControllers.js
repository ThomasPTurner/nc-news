const { fetchArticles }  = require('../models')
const getArticles = (req, res, next) => {
    return fetchArticles()
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch(next)
}

module.exports = { getArticles }
