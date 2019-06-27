const ENV = process.env.NODE_ENV || 'development'
const data = { test, development, production: development };
exports.data = require(`./${ENV}-data/`)
