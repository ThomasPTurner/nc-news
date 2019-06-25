const express = require('express')
const app = express()
const { apiRouter } = require('./routers/')
app.use('/api', apiRouter)

module.exports = app