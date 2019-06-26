process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe('api/comments', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    describe('DELETE', () => {
        it('deletes an entry', () => {
            return request 
                .delete('/api/articles/1/comments/2')
                .expect(204)
                .then( () => {
                    return connection('comments')
                        .select('*')
                        .where({id: 2})
                })
                .then(comment => {
                    expect(comment.length).to.equal(0) //checking it's not there any more
                })
        });
        it('404 on bad article', () => {
            return request 
                .delete('/api/articles/9001/comments/2')
                .expect(404)
                .then( ({body: {msg}}) => {
                  expect(msg).to.equal('not found')
                })
        });
        it('404 on bad comment', () => {
            return request 
                .delete('/api/articles/9001/comments/2')
                .expect(404)
                .then( ({body: {msg}}) => {
                  expect(msg).to.equal('not found')
                })
        });
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
                .expect(201)
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
    describe('PATCH', () => {
        it('increments the vote on a comment', () => {
            return request
            .patch('/api/articles/1/comments/2')
            .send({inc_votes: 1})
            .expect(200)
            .then(({body: {comment: {votes, id}}}) => {
                expect(votes).to.equal(15);
                expect(id).to.equal(2);
            })
        })
        it('404 on a non existant article', () => {
            return request
                .patch('/api/articles/9001/comments/2')
                .send({inc_votes: 1})
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('not found');
            });
        });
        it('404 on a non existant comment', () => {
            return request
                .patch('/api/articles/9001/comments/1')
                .send({inc_votes: 1})
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('not found');
            });
        });
        it('allows negative votes', () => {
            return request  
                .patch('/api/articles/1/comments/2')
                .send({inc_votes: -1})
                .expect(200)
                .then(({ body: { comment: { votes }}}) => {
                    expect(votes).to.equal(13)
                })
        });
        it('allows votes to be negative', () => {
            return request  
                .patch('/api/articles/1/comments/2')
                .send({inc_votes: -15})
                .expect(200)
                .then(({ body: { comment: { votes }}}) => {
                    expect(votes).to.equal(-1)
                })
        });
        it('400 on bad value', () => {
            return request  
                .patch('/api/articles/1/comments/2')
                .send({inc_votes: 'batman'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request')
                })
        });
        it('400 on bad key', () => {
            return request  
                .patch('/api/articles/1/comments/2')
                .send({batman: 1})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request')
                })
        });
        it('400 on additional keys', () => {
            return request  
                .patch('/api/articles/1/comments/2')
                .send({batman: 1, inc_votes: 1})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request')
                })
        });
    });
});