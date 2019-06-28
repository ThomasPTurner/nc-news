const { createComment, fetchComments, updateComment, removeComment, fetchArticles, fetchCommentCount } = require('../models') 
const { rejectEmptyArr } = require('../db/utils/utils')

const postComment = ({params, body}, res, next) => createComment(params, body)
        .then(([comment]) => res.status(201).send({comment}))
        .catch(next)

const getComments = ({params, query}, res, next) =>  fetchArticles(params, {})
        .then(rejectEmptyArr)
        .then(() => Promise.all([fetchComments(params, query),fetchCommentCount(params)]))
        .then(([comments,{total_count}]) => {
            const output = {comments, total_count}
            res.status(200).send(output)
        })
        .catch(next)

const patchComment = ({params, body}, res, next) =>  updateComment(params, body)
        .then(rejectEmptyArr)
        .then(([comment]) => {
            res.status(200).send({comment})
        })
        .catch(next)

const deleteComment = ({params}, res, next) => removeComment(params)
        .then(rejectEmptyArr)
        .then(()=> res.status(204).send())
        .catch(next)

module.exports = { postComment, getComments, patchComment, deleteComment }
