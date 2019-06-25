const express = require('express');
const { getArticles } = require('../controllers/');
const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles);

module.exports =  articlesRouter;
