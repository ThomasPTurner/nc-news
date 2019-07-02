const utilsTests = require('./utils.spec');
const usersTests = require('./api.users.spec');
const articlesTests = require('./api.articles.spec');
const topicsTests = require('./api.topics.spec');
const commentsTests = require('./api.comments.spec');
const {connection} = require('../connection');

describe('all', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  topicsTests()
  articlesTests()
  utilsTests()
  commentsTests()
  usersTests()
});