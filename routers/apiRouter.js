const express = require('express');
const topicsRouter = require('../routers/topicsRouter');
const usersRouter = require('../routers/topicsRouter');
const apiRouter = express.Router();

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
