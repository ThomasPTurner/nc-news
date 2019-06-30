const { fetchTopics }  = require('../models')
const getTopics = ({query}, res, next) => fetchTopics(query)
        .then((topics)=> res.status(200).send({topics}))
        .catch(next)

module.exports = { getTopics }
