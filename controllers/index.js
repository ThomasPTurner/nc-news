const topicsContollers = require('./topicsControllers');
const usersControllers = require('./usersControllers');
const articlesControllers = require('./articlesControllers')
const commentsControllers = require('./commentsControllers')
module.exports = { ...commentsControllers, ...topicsContollers, ...usersControllers, ...articlesControllers };
