const express = require('express');
const { postComment, getComments, patchComment } = require('../controllers/');
const commentsRouter = express.Router({mergeParams: true})

commentsRouter.route('/')
    .get(getComments)
    .post(postComment);

commentsRouter.route('/:comment_id')
    .patch(patchComment)

module.exports =  commentsRouter;
