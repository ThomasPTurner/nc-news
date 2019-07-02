const { fetchTopics, createTopic }  = require('../models')
const getTopics = ({query}, res, next) => fetchTopics(query)
        .then((topics)=> res.status(200).send({topics}))
        .catch(next)

const postTopics = ({body}, res, next) => {
        return createTopic(body)
                .then(([topic]) => {
                        topic.article_count = 0
                        res.status(201).send({topic})   
                })
                .catch(next)
}

module.exports = { getTopics, postTopics }
