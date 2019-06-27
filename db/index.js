const ENV = process.env.NODE_ENV || 'development'
let data = ENV
if (ENV === 'production') data = 'development'
console.log(`./${data}-data/`)
exports.data = require(`./${data}-data/`)
