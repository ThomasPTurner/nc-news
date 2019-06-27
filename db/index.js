const ENV = process.env.NODE_ENV || 'development'
let data = ENV
if (ENV === 'production') data = 'development'
exports.data = require(`./${data}-data/`)