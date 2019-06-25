const knex = require('knex');
const dbConfig = require('./knexfile.js')
exports.connection = knex(dbConfig)