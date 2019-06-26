const { createComment, fetchComments, updateComment } = require('../models')

exports.postComment = (req, res, next) => {
    createComment(req)
        .then( ([comment]) => {
            res.status(201).send({comment})
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

exports.patchComment = (req, res, next) => {
    updateComment(req)
        .then(([comment]) => {
            if (!comment) return Promise.reject({code:404, msg: 'not found'})
            res.status(200).send({comment})
        })
        .catch(next)  
}
