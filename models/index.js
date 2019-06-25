const usersModels = require('./usersModels')
const topicsModels = require('./topicsModels')
const articlesModels = require('./articlesModels')
module.exports = { ...topicsModels, ...usersModels, ...articlesModels } 