const express = require('express');
const commentsRouter = require('./commentsRouter')
const { badMethod }  = require('../errors');
const { getArticles, getArticleById, patchArticle } = require('../controllers/');
const articlesRouter = express.Router();

articlesRouter.use('/:id/comments', commentsRouter)

articlesRouter.route('/:id')
    .get(getArticleById)
    .patch(patchArticle)
    .post(badMethod)
    .put(badMethod)
    .delete(badMethod);

articlesRouter.route('/')
    .get(getArticles)
    .post(badMethod)
    .put(badMethod)
    .patch(badMethod)
    .delete(badMethod);;

module.exports =  articlesRouter;
