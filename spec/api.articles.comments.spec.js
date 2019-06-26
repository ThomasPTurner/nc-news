process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe('api/topics', () => {
    beforeEach(() => {
        return connection.seed.run();
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
        it('400 when posting to an invalid article', () => {
            return request
                .post('/api/articles/9001/comments/')
                .send({username: 'fred', body: 'girl, look at that body'})
                .expect(400)
                .then((  {body: {msg}} ) => {
                    expect(msg).to.equal('dependant resource not found');
                });
        });
    });
});