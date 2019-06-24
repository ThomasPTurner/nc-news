const ENV = process.env.NODE_ENV || 'development'
exports.data = require(`./${ENV}-data/`)
