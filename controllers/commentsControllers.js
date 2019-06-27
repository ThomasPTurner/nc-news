const { createComment, fetchComments, updateComment, removeComment } = require('../models')

exports.postComment = ({params, query, body}, res, next) => {
    createComment(params, body)
        .then( ([comment]) => {
            res.status(201).send({comment})
        })
        .catch(next)
}

exports.getComments = ({params, query}, res, next) => {
    fetchComments(params, query)
        .then(comments => {
            if (!comments.length) return Promise.reject({code:404, msg: 'dependant resource not found'})
            res.status(200).send({comments})
        })
        .catch(next)
}

exports.patchComment = ({params, query, body}, res, next) => {
    updateComment(params, body)
        .then(([comment]) => {
            if (!comment) return Promise.reject({code:404, msg: 'not found'})
            res.status(200).send({comment})
        })
        .catch(next)  
}

exports.deleteComment = ({params}, res, next) => {
    removeComment(params)
        .then(([comment])=> {
            if (!comment) return Promise.reject({code:404, msg: 'not found'})
            res.status(204).send()
        })
        .catch(next)
}
