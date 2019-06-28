const { createComment, fetchComments, updateComment, removeComment, fetchArticles } = require('../models') 

exports.postComment = ({params, query, body}, res, next) => {
    return createComment(params, body)
        .then( ([comment]) => {
            res.status(201).send({comment})
        })
        .catch(next)
}

exports.getComments = ({params, query}, res, next) => {
    return fetchArticles(params, query)
        .then(([article]) => {
            if (!article) return Promise.reject({code: 404, msg: 'article not found'})
        })
        .then( () => {
            return fetchComments(params, query)
        })
        .then(comments => {
            res.status(200).send({comments})
        })
        .catch(next)
}

exports.patchComment = ({params, query, body}, res, next) => {
    return updateComment(params, body)
        .then(([comment]) => {
            if (!comment) return Promise.reject({code:404, msg: 'not found'})
            res.status(200).send({comment})
        })
        .catch(next)
}

exports.deleteComment = ({params}, res, next) => {
    return removeComment(params)
        .then(([comment])=> {
            if (!comment) return Promise.reject({code:404, msg: 'not found'})
            res.status(204).send()
        })
        .catch(next)
}
