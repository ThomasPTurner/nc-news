const express = require('express');
const { getTopics } = require('../controllers/');
const topicsRouter = express.Router();
const { badMethod }  = require('../errors');

topicsRouter.route('/')
    .get(getTopics)
    .post(badMethod)
    .put(badMethod)
    .patch(badMethod)
    .delete(badMethod);
module.exports =  topicsRouter;
