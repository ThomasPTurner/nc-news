process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe('api/topics', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    describe('GET', () => {
        it('gets a list of comments specific to the article', () => {
            return request
                .get('/api/articles/1/comments/')
                .expect(200)
                .then(({body: {comments}})=>{
                    expect(comments.length).to.be.greaterThan(1)
                })
        });
        it('comments are for a specific article', () => {
            return request
                .get('/api/articles/1/comments/')
                .expect(200)
                .then(({body: {comments}})=>{
                    const checkIds = comments.every(({article_id})=> {
                        return (article_id === 1)
                    })
                    expect(checkIds).to.be.true
                })
        });
        it('404 when requesting from an invalid article', () => {
            return request
                .get('/api/articles/9001/comments/')
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('dependant resource not found');
                });
        });
        
    });
    describe('POST', () => {
        it('posts a comment', () => {
            return request
                .post('/api/articles/1/comments/')
                .send({username: 'fred', body: 'girl, look at that body'})
                .expect(200)
                .then(( {body: {comment: {body}}} ) => {
                    expect(body).to.equal('girl, look at that body');
                });
        });
        it('404 when posting to an invalid article', () => {
            return request
                .post('/api/articles/9001/comments/')
                .send({username: 'fred', body: 'girl, look at that body'})
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('dependant resource not found');
                });
        });
        it('404 when not given a user that exists', () => {
            return request
            .post('/api/articles/1/comments/')
            .send({username: 'batman', body: 'girl, look at that body'})
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).to.equal('dependant resource not found');
            });
        });
        it('400 when given a long body', () => {
            return request
            .post('/api/articles/1/comments/')
            .send({username: 'fred', body: 'this comment is way to longgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'})
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).to.equal('bad input');
            });
        });
    });
});