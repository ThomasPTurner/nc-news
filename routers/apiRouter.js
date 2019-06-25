const express = require('express');
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const apiRouter = express.Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
