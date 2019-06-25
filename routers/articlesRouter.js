const express = require('express');
const { getArticles, getArticleById, patchArticle } = require('../controllers/');
const articlesRouter = express.Router();

articlesRouter.route('/:id')
    .get(getArticleById)
    .patch(patchArticle)

articlesRouter.route('/').get(getArticles);

module.exports =  articlesRouter;
