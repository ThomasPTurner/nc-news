const express = require('express')
const app = express()
const { apiRouter } = require('./routers/')
const { handleWithCode, catchAll404, handle500 } = require('./errors/')
app.use('/api', apiRouter)

app.use('/*', catchAll404)
app.use(handleWithCode)
app.use(handle500)

module.exports = app