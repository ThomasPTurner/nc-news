const topicsContollers = require('./topicsControllers');
const usersControllers = require('./usersControllers');
module.exports = { ...topicsContollers, ...usersControllers };
