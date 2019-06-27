process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe('api/topics', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    describe('invalid methods caught', () => {
        it('PUT', () => {
            return request
                .put('/api/topics')
                .expect(405)
        });
        it('DELETE', () => {
            return request
                .delete('/api/topics')
                .expect(405)
        });
        it('POST', () => {
            return request
                .post('/api/topics')
                .expect(405)
        });
        it('DELETE', () => {
            return request
                .delete('/api/topics')
                .expect(405)
        });
    });
    describe('GET', () => {
        it('gets a list of topics', () => {
            return request
                .get('/api/topics/')
                .expect(200)
                .then(( {body: {topics}} ) => {
                    expect(topics.length).to.equal(3);
                    expect(topics[0]).to.have.keys('slug', 'description')
                });
        });
    });
});