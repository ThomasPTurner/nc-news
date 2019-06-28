const express = require('express');
const { getTopics } = require('../controllers/');
const topicsRouter = express.Router();
const { badMethod }  = require('../errors');

topicsRouter.route('/')
    .get(getTopics)
    .all(badMethod)

module.exports =  topicsRouter;
