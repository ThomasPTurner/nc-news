const express = require('express');
const { postComment, getComments } = require('../controllers/');
const commentsRouter = express.Router({mergeParams: true})

commentsRouter.route('/')
    .get(getComments)
    .post(postComment);

module.exports =  commentsRouter;
