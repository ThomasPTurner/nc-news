const express = require('express')
const app = express()
const { apiRouter } = require('./routers/')
const { handle404 } = require('./errors/')
app.use('/api', apiRouter)


app.use(handle404)

module.exports = app