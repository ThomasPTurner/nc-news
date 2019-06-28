const { createComment, fetchComments, updateComment, removeComment, fetchArticles, fetchCommentCount } = require('../models') 
const { rejectEmptyArr } = require('../db/utils/utils')

exports.postComment = ({params, query, body}, res, next) => {
    
    return createComment(params, body)
        .then( ([comment]) => {
            res.status(201).send({comment})
        })
        .catch(next)
}

exports.getComments = ({params, query}, res, next) => {
    return fetchArticles(params, {})
        .then(rejectEmptyArr)
        .then(() => Promise.all([fetchComments(params, query),fetchCommentCount(params)]))
        .then(([comments,{total_count}]) => { // add the total_count (without passing in the whole table)
            const output = {
                comments,
                total_count
            }
            res.status(200).send(output)
        })
        .catch(next)
}

exports.patchComment = ({params, query, body}, res, next) => {
    return updateComment(params, body)
        .then(rejectEmptyArr)
        .then(([comment]) => {
            res.status(200).send({comment})
        })
        .catch(next)
}

exports.deleteComment = ({params}, res, next) => {
    return removeComment(params)
        .then(rejectEmptyArr)
        .then(()=> {
            res.status(204).send()
        })
        .catch(next)
}
