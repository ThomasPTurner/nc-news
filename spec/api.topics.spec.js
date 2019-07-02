process.env.NODE_ENC = 'test';
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
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
        it('DELETE', () => {
            return request
                .delete('/api/topics')
                .expect(405)
        });
    });
    describe('POST', () => {
        it('posts an topic', () => {
            return request
                .post('/api/topics/')
                .send({slug: 'dinosaurs', description: 'terrible lizards. Or are they?'})
                .expect(201)
                .then(({body: {topic: {slug}}}) => {
                    expect(slug).to.equal('dinosaurs')
                })
        });
        it('400 when posting with a username that already exists', () => {
            return request
                .post('/api/topics/')
                .send({slug: 'mitch', description: 'terrible lizards. Or are they?'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad input');
                });
        });
        it('400 when posting without all required items', () => {
            return request
                .post('/api/topics/')
                .send({slug: 'dinosaurs'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request: value cannot be null');
                });
        });
        it('400 when with null values', () => {
            return request
                .post('/api/topics/')
                .send({slug: null, description: 'terrible lizards. Or are they?'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request: value cannot be null');
                });
        });
        it('returned user has correct keys', () => {
            return request
                .post('/api/topics/')
                .send({slug: 'dinosaurs', description: 'terrible lizards. Or are they?'})
                .expect(201)
                .then(( {body: {topic}} ) => {
                    expect(topic).to.have.keys('slug', 'article_count', 'description')
                });
        });
    });
    describe('GET', () => {
        it('gets a list of topics', () => {
            return request
                .get('/api/topics/')
                .expect(200)
                .then(( {body: {topics}} ) => {
                    expect(topics.length).to.be.greaterThan(1);
                    expect(topics[0]).to.have.keys('slug', 'description', 'article_count')
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
        it('topics have an article count', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then(({body: {topics: [,,{article_count}]}}) => {
                    expect(article_count).to.equal('1')
                })
        })
    });
});