const express = require('express');
const { getArticles, getArticleById } = require('../controllers/');
const articlesRouter = express.Router();
articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:id').get(getArticleById);

module.exports =  articlesRouter;
