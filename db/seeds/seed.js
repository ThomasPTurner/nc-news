const {data: {topicData, articleData, commentData, userData}}  = require('../index');

const { formatDate, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex, Promise) {
  return knex.migrate.rollback()
    .then(() => {
      return knex.migrate.latest()
    })
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData)
      const usersInsertions = knex('users').insert(userData);
      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          const formattedArticleData = formatDate(articleData)
          return knex('articles').insert(formattedArticleData).returning('*')
        })
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows);
          let formattedComments = formatComments(commentData, articleRef);
          return knex('comments').insert(formattedComments);
        });
    })
};
