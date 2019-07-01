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
                    expect(topics.length).to.be.greaterThan(1);
                    expect(topics[0]).to.have.keys('slug', 'description')
                });
        });
        it('topics are sorted by descending slug by default', () => {
            return request
                .get('/api/topics/')
                .expect(200)
                .then(({body: {topics}})=> {
                    expect(topics).to.be.descendingBy('slug')
                })
        });
        it('topics can be sorted by query', () => {
            return request
                .get('/api/topics/?sort_by=description')
                .expect(200)
                .then(({body: {topics}})=> {
                    expect(topics).to.be.descendingBy('description')
                })
        });
        it('default limit of 10', () => {
            return request
                .get('/api/topics/')
                .expect(200)
                .then(({body: {topics}})=> {
                    expect(topics.length).to.equal(3)
                })
        });
        it('page query to get to the next page', () => {
            return request
                .get('/api/topics/?p=2')
                .expect(200)
                .then(({body: {topics}})=> {
                    expect(topics.length).to.equal(0)
                })
        });
        it('page query is dynamic with limit', () => {
            return request
                .get('/api/topics/?p=3&limit=1')
                .expect(200)
                .then(({body: {topics}})=> {
                    expect(topics.length).to.equal(1)
                })
        });
        it('can limit by query', () => {
            return request
                .get('/api/topics/?limit=2')
                .expect(200)
                .then(({body: {topics}})=> {
                    expect(topics.length).to.equal(2)
                })
        });
        it('400 on bad sort query', () => {
            return request
                .get('/api/topics/?sort_by=batman')
                .expect(400)
                .then(({body: {msg}})=> {
                    expect(msg).to.equal('bad request')
                })
        });
        it('topics ordered query', () => {
            return request
                .get('/api/topics/?order=asc')
                .expect(200)
                .then(({body: {topics}})=> {
                    expect(topics).to.be.ascendingBy('slug')
                })
        });
        it('400 on bad orders query', () => {
            return request
                .get('/api/topics/?order=batman')
                .expect(400)
                .then(({body: {msg}})=> {
                    expect(msg).to.equal('bad request')
                })
        });
    });
});