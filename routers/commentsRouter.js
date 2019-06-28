const express = require('express');
const { postComment, getComments, patchComment, deleteComment } = require('../controllers/');
const commentsRouter = express.Router({mergeParams: true})
const { badMethod } = require('../errors')

commentsRouter.route('/')
    .get(getComments)
    .post(postComment)
    .all(badMethod)

commentsRouter.route('/:comment_id')
    .patch(patchComment)
    .delete(deleteComment)
    .all(badMethod)

module.exports =  commentsRouter;
