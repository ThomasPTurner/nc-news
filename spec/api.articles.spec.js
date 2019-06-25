process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe('api/articles', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    describe('GET', () => {
        it('gets a list of articles', () => {
            return request
                .get('/api/articles/')
                .expect(200)
                .then(( {body: {articles}} ) => {
                    expect(articles.length).to.equal(12);
                });
        });
    });
});