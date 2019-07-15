const express = require('express')
const cors = require('cors')
const app = express()
const { apiRouter } = require('./routers/')
const { handleWithCode, catchAll404, handle500, handlePGerrors } = require('./errors/')
app.use(express.json())
app.use(cors())
app.use('/api', apiRouter)

app.use('/*', catchAll404)
app.use(handlePGerrors)
app.use(handleWithCode)
app.use(handle500)

module.exports = app