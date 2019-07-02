const express = require('express');
const { getTopics, postTopics } = require('../controllers/');
const topicsRouter = express.Router();
const { badMethod }  = require('../errors');

topicsRouter.route('/')
    .get(getTopics)
    .post(postTopics)
    .all(badMethod)

module.exports =  topicsRouter;
