process.env.NODE_ENC = 'test';
const chai = require('chai');
const {expect} = chai
const app = require('../app');
const request = require('supertest')(app);
const { connection } = require('../connection');
chai.use(require('chai-sorted'))


describe('api/comments', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    describe('invalid methods caught', () => {
        it('PUT', () => {
            return request
                .put('/api/comments')
                .expect(405)
        });
        it('POST', () => {
            return request
                .post('/api/comments')
                .expect(405)
        });
    });
    describe('GET', () => {
        it('gets a list of comments with correct keys', () => {
            return request
                .get('/api/articles/1/comments/')
                .expect(200)
                .then(({body: {comments}})=>{
                    expect(comments.length).to.be.greaterThan(1)
                    expect(comments[0]).to.have.keys(
                        'id',
                        'author',
                        'article_id',
                        'votes',
                        'created_at',
                        'body'
                    );
                })
        });
        it('comments are sorted by created_on by default', () => {
            return request
                .get('/api/comments/')
                .expect(200)
                .then(({body: {comments}})=> {
                    expect(comments).to.be.descendingBy('created_at')
                })
        });
        it('comments can be sorted by query', () => {
            return request
                .get('/api/comments/?sort_by=author')
                .expect(200)
                .then(({body: {comments}})=> {
                    expect(comments).to.be.descendingBy('author')
                })
        });
        it('has a total_count key', () => {
            return request
                .get('/api/comments/')
                .expect(200)
                .then(({body: {total_count}})=> {
                    expect(+total_count).to.be.greaterThan(1)
                })
        });
        it('400 on bad sort query', () => {
            return request
                .get('/api/comments/?sort_by=batman')
                .expect(400)
                .then(({body: {msg}})=> {
                    expect(msg).to.equal('bad request')
                })
        });
        it('comments ordered query', () => {
            return request
                .get('/api/comments/?order=asc')
                .expect(200)
                .then(({body: {comments}})=> {
                    expect(comments).to.be.ascendingBy('created_at')
                })
        });
        it('400 on bad orders query', () => {
            return request
                .get('/api/comments/?order=batman')
                .expect(400)
                .then(({body: {msg}})=> {
                    expect(msg).to.equal('bad request')
                })
        });
    });
    describe('DELETE', () => {
        it('deletes an entry', () => {
            return request 
                .delete('/api/comments/2')
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
        it('404 on bad comment', () => {
            return request 
                .delete('/api/comments/9001')
                .expect(404)
                .then( ({body: {msg}}) => {
                  expect(msg).to.equal('not found')
                })
        });
    });
    describe('PATCH', () => {
        it('increments the vote on a comment', () => {
            return request
            .patch('/api/comments/2')
            .send({inc_votes: 1})
            .expect(200)
            .then(({body: {comment}}) => {
                expect(comment.votes).to.equal(15);
                expect(comment.id).to.equal(2);
                expect(comment).to.have.keys(
                    'id',
                    'author',
                    'article_id',
                    'votes',
                    'created_at',
                    'body'
                );
            })
        })
        it('404 on a non existent comment', () => {
            return request
                .patch('/api/comments/9001')
                .send({inc_votes: 1})
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('not found');
            });
        });
        it('allows negative votes', () => {
            return request  
                .patch('/api/comments/2')
                .send({inc_votes: -1})
                .expect(200)
                .then(({ body: { comment: { votes }}}) => {
                    expect(votes).to.equal(13)
                })
        });
        it('allows votes to be negative', () => {
            return request  
                .patch('/api/comments/2')
                .send({inc_votes: -15})
                .expect(200)
                .then(({ body: { comment: { votes }}}) => {
                    expect(votes).to.equal(-1)
                })
        });
        it('400 on bad value', () => {
            return request  
                .patch('/api/comments/2')
                .send({inc_votes: 'batman'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request')
                })
        });
    });
    describe('api/articles/:id/comments/', () => {
        describe('invalid methods caught', () => {
            it('PUT', () => {
                return request
                    .put('/api/comments/')
                    .expect(405)
            });
            it('PATCH', () => {
                return request
                    .patch('/api/articles/1/comments/')
                    .expect(405)
            });
            it('DELETE', () => {
                return request
                    .delete('/api/articles/1/comments/')
                    .expect(405)
            });
        });
        describe('POST', () => {
            it('posts a comment', () => {
                return request
                    .post('/api/articles/1/comments/')
                    .send({username: 'fred', body: 'look at that body'})
                    .expect(201)
                    .then(( {body: {comment}} ) => {
                        expect(comment.body).to.equal('look at that body');
                        expect(comment).to.have.keys(
                            'id',
                            'author',
                            'article_id',
                            'votes',
                            'created_at',
                            'body'
                        );
                    });
            });
            it('404 when posting to an invalid article', () => {
                return request
                    .post('/api/articles/9001/comments/')
                    .send({username: 'fred', body: 'look at that body'})
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('dependant resource not found');
                    });
            });
            it('404 when not given a user that exists', () => {
                return request
                .post('/api/articles/1/comments/')
                .send({username: 'batman', body: 'look at that body'})
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
        describe('GET', () => {
            it('gets a list of comments specific to the article', () => {
                return request
                    .get('/api/articles/1/comments/')
                    .expect(200)
                    .then(({body: {comments}})=>{
                        expect(comments.length).to.be.greaterThan(1)
                        expect(comments[0]).to.have.keys(
                            'id',
                            'author',
                            'article_id',
                            'votes',
                            'created_at',
                            'body'
                        );
                    })
            });
            it('default limit of 10', () => {
                return request
                    .get('/api/articles/1/comments/')
                    .expect(200)
                    .then(({body: {comments}})=> {
                        expect(comments.length).to.equal(10)
                    })
            });
            it('page query to get to the next page', () => {
                return request
                    .get('/api/articles/1/comments/?p=2')
                    .expect(200)
                    .then(({body: {comments}})=> {
                        expect(comments.length).to.equal(3)
                    })
            });
            it('can limit with query', () => {
                return request
                    .get('/api/articles/1/comments/?limit=4')
                    .expect(200)
                    .then(({body: {comments}})=> {
                        expect(comments.length).to.equal(4)
                    })
            });
            it('pages are dynamic with limit', () => {
                return request
                    .get('/api/articles/1/comments/?limit=6&p=3')
                    .expect(200)
                    .then(({body: {comments}})=> {
                        expect(comments.length).to.equal(1)
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
            it('comments are sorted by created_on by default', () => {
                return request
                    .get('/api/articles/1/comments/')
                    .expect(200)
                    .then(({body: {comments}})=> {
                        expect(comments).to.be.descendingBy('created_at')
                    })
            });
            it('comments can be sorted by query', () => {
                return request
                    .get('/api/articles/1/comments/?sort_by=author')
                    .expect(200)
                    .then(({body: {comments}})=> {
                        expect(comments).to.be.descendingBy('author')
                    })
            });
            it('400 on bad sort query', () => {
                return request
                    .get('/api/articles/1/comments/?sort_by=batman')
                    .expect(400)
                    .then(({body: {msg}})=> {
                        expect(msg).to.equal('bad request')
                    })
            });
            it('comments ordered query', () => {
                return request
                    .get('/api/articles/1/comments/?order=asc')
                    .expect(200)
                    .then(({body: {comments}})=> {
                        expect(comments).to.be.ascendingBy('created_at')
                    })
            });
            it('400 on bad orders query', () => {
                return request
                    .get('/api/articles/1/comments/?order=batman')
                    .expect(400)
                    .then(({body: {msg}})=> {
                        expect(msg).to.equal('bad request')
                    })
            });
            it('404 when requesting from an invalid article', () => {
                return request
                    .get('/api/articles/9001/comments/')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('not found');
                    });
            });
            it('200 and no content when requesting comments from an article with no comments', () => {
                return request
                    .get('/api/articles/13/comments/')
                    .expect(200)
                    .then(({body: {comments: [comment]}}) => {
                        expect(comment).to.be.undefined
                    })
            });
            it('has a total_count key', () => {
                return request
                    .get('/api/articles/1/comments/')
                    .expect(200)
                    .then(({body: {total_count}})=> {
                        expect(+total_count).to.be.greaterThan(1)
                    })
            });
            it('total count changes with articles', () => {
                return request
                    .get('/api/articles/2/comments/')
                    .expect(200)
                    .then(({body: {total_count}})=> {
                        expect(+total_count).to.equal(0)
                    })
            });
        });
    });
});
