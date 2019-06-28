const express = require('express');
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const {badMethod} = require('../errors');

const apiRouter = express.Router();
const apiJSON = require('../api.json')
apiRouter.route('/').get((req, res, next)=>res.status(200).send(apiJSON))
    .all(badMethod)

apiRouter.use('/users', usersRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
