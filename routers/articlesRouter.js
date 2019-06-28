const express = require('express');
const commentsRouter = require('./commentsRouter')
const { badMethod }  = require('../errors');
const { getArticles, getArticleById, patchArticle } = require('../controllers/');
const articlesRouter = express.Router();

articlesRouter.use('/:id/comments', commentsRouter)

articlesRouter.route('/:id')
    .get(getArticleById)
    .patch(patchArticle)
    .all(badMethod)

articlesRouter.route('/')
    .get(getArticles)
    .all(badMethod)

module.exports =  articlesRouter;
