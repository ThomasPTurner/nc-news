const express = require('express');
const { getTopics } = require('../controllers/');
const topicsRouter = express.Router();

topicsRouter.route('/').get(getTopics);

module.exports =  topicsRouter;