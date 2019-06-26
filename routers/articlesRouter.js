const express = require('express');
const commentsRouter = require('./commentsRouter')
const { getArticles, getArticleById, patchArticle } = require('../controllers/');
const articlesRouter = express.Router();

articlesRouter.use('/:id/comments', commentsRouter)

articlesRouter.route('/:id')
    .get(getArticleById)
    .patch(patchArticle)

articlesRouter.route('/').get(getArticles);

module.exports =  articlesRouter;
