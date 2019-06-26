const { createComment } = require('../models')

exports.postComment = ({params, body}, res, next) => {
    createComment(params, body)
        .then( ([comment]) => {
            res.status(200).send({comment})
        })
        .catch(next)
}