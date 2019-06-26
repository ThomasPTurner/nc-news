const usersModels = require('./usersModels')
const topicsModels = require('./topicsModels')
const articlesModels = require('./articlesModels')
const commentsModels = require('./commentsModels')
module.exports = { ...topicsModels, ...usersModels, ...articlesModels, ...commentsModels } 