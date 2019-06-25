const usersModels = require('./usersModels')
const topicsModels = require('./topicsModels')
module.exports = { ...topicsModels, ...usersModels } 