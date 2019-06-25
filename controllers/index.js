const topicsContollers = require('./topicsControllers');
const usersControllers = require('./usersControllers');
const articlesControllers = require('./articlesControllers')
module.exports = { ...topicsContollers, ...usersControllers, ...articlesControllers };
