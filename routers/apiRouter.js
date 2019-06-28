const express = require('express');
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const apiRouter = express.Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles/:id/comments', commentsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/articles', articlesRouter);


module.exports = apiRouter;
