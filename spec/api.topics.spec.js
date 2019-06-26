process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe.skip('api/topics', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    describe('GET', () => {
        it('gets a list of topics', () => {
            return request
                .get('/api/topics/')
                .expect(200)
                .then(( {body: {topics}} ) => {
                    expect(topics.length).to.equal(3);
                });
        });
    });
});