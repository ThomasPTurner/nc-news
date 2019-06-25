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
        // it('gets a list of articles', () => {
        //     return request
        //         .get('/api/articles/')
        //         .expect(200)
        //         .then(( {body: {articles}} ) => {
        //             expect(articles.length).to.equal(12);
        //         });
        // });
        describe('GET by article ID', () => {
            it('retrives a single article', () => {
                return request
                    .get('/api/articles/1')
                    .expect(200)
                    .then(( {body: {article: {title}}} ) => {
                        expect(title).to.equal('Living in the shadow of a great man');
                    });
            });
            it('atricle has comment_count', () => {
                return request
                    .get('/api/articles/1')
                    .expect(200)
                    .then(( {body: {article: {comment_count}}} ) => {
                        expect(comment_count).to.equal('13');
                    });
            });
            it('404 on valid but absent id', ()=> {
                return request 
                    .get('/api/articles/9001')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('article not found')
                    });
            });
            it('400 on invalid id', ()=> {
                return request 
                    .get('/api/articles/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('bad request')
                    });
            });
        });
    });
    describe('PATCH', () => {
        it('updates votes', () => {
            return request  
                .patch('/api/articles/1')
                .send({inc_votes: 1})
                .expect(200)
                .then(({body: {votes}}) => {
                    expect(votes).to.equal(101)
                })
        });
        it('400 on garbage input', () => {
            return request  
                .patch('/api/articles/1')
                .send({inc_votes: 'batman'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request')
                })
        });
    });
});