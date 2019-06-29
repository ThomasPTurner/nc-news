const express = require('express');
const commentsRouter = require('./commentsRouter')
const { badMethod }  = require('../errors');
const { getArticles, getArticleById, patchArticle, postArticle, deleteArticleById } = require('../controllers/');
const articlesRouter = express.Router();

articlesRouter.route('/:id')
    .delete(deleteArticleById)
    .get(getArticleById)
    .patch(patchArticle)
    .all(badMethod)

articlesRouter.route('/')
    .get(getArticles)
    .post(postArticle)
    .all(badMethod)

articlesRouter.use('/:id/comments', commentsRouter)

module.exports =  articlesRouter;
