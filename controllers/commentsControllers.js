const { createComment, fetchComments } = require('../models')

exports.postComment = ({params, body}, res, next) => {
    createComment(params, body)
        .then( ([comment]) => {
            res.status(200).send({comment})
        })
        .catch(next)
}

exports.getComments = ({params: {id}}, res, next) => {
    fetchComments(id)
        .then(comments => {
            if (!comments.length) return Promise.reject({code:404, msg: 'dependant resource not found'})
            res.status(200).send({comments})
        })
        .catch(next)
}