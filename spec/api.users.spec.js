process.env.NODE_ENC = 'test';
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


module.exports = () => {
    return describe.only('api/users', () => {
        describe('GET', () => {
            describe('invalid methods caught', () => {
                it('PUT', () => {
                    return request
                        .put('/api/users')
                        .expect(405)
                });
                it('DELETE', () => {
                    return request
                        .delete('/api/users')
                        .expect(405)
                });
                it('DELETE', () => {
                    return request
                        .delete('/api/users')
                        .expect(405)
                });
            });
            describe('POST', () => {
                it('posts a new user', () => {
                    return request
                        .post('/api/users/')
                        .send({username: 'foo', name: 'bar', avatar_url: 'www.foo.bar'})
                        .expect(201)
                        .then(({body: {user: { username }}})=>{
                            expect(username).to.equal('foo')
                        })
                });
                it('400 when posting with a username that already exists', () => {
                    return request
                        .post('/api/users/')
                        .send({username: 'fred', name: 'bar', avatar_url: 'www.foo.bar'})
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('bad input');
                        });
                });
                it('400 when posting without all required items', () => {
                    return request
                        .post('/api/users/')
                        .send({username: 'foo', avatar_url: 'www.foo.bar'})
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('bad request');
                        });
                });
                it('400 when with null values', () => {
                    return request
                        .post('/api/users/')
                        .send({username: null, name: 'bar', avatar_url: 'www.foo.bar'})
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('bad request');
                        });
                });
                it('returned user has correct keys', () => {
                    return request
                        .post('/api/users/')
                        .send({username: 'foo', name: 'bar', avatar_url: 'www.foo.bar'})
                        .expect(201)
                        .then(( {body: {user}} ) => {
                            expect(user).to.have.keys('username', 'avatar_url', 'name', 'article_count', 'article_votes', 'comment_count', 'comment_votes')
                        });
                });
            });
            describe('GET', () => {
                it('gets all users', () => {
                    return request
                        .get('/api/users/')
                        .expect(200)
                        .then(( {body: {users}} ) => {
                            expect(users.length).to.be.greaterThan(1)
                            expect(users[0]).to.have.keys('username', 'avatar_url', 'name', 'article_count', 'article_votes', 'comment_count', 'comment_votes')
                        });
                });
                it('users have an articles count', () => {
                    return request
                        .get('/api/users/')
                        .expect(200)
                        .then(({body: {users: [{article_count}]}})=> {
                            expect(article_count).to.equal('3')
                        })
                    
                });
                it('users have a comment count', () => {
                    return request
                        .get('/api/users/')
                        .expect(200)
                        .then(({body: {users: [,,{comment_count}]}})=> {
                            expect(comment_count).to.equal('13')
                        })
                    
                });
                it('users have a comment votes total', () => {
                    return request
                        .get('/api/users/')
                        .expect(200)
                        .then(({body: {users: [,,{comment_votes}]}})=> {
                            expect(comment_votes).to.equal('36')
                        })
                });
                it('users have an article votes total', () => {
                    return request
                        .get('/api/users/')
                        .expect(200)
                        .then(({body: {users: [,,,,{article_votes}]}})=> {
                            expect(article_votes).to.equal('100')
                        })
                });
                it('users are sorted by descending username by default', () => {
                    return request
                        .get('/api/users/')
                        .expect(200)
                        .then(({body: {users}})=> {
                            expect(users).to.be.descendingBy('username')
                        })
                });
                it('users can be sorted by query', () => {
                    return request
                        .get('/api/users/?sort_by=name')
                        .expect(200)
                        .then(({body: {users}})=> {
                            expect(users).to.be.descendingBy('name')
                        })
                });
                it('default limit of 10', () => {
                    return request
                        .get('/api/users/')
                        .expect(200)
                        .then(({body: {users}})=> {
                            expect(users.length).to.equal(5)
                        })
                });
                it('page query to get to the next page', () => {
                    return request
                        .get('/api/users/?p=10')
                        .expect(200)
                        .then(({body: {users}})=> {
                            expect(users.length).to.equal(0)
                        })
                });
                it('page query is dynamic with limit', () => {
                    return request
                        .get('/api/users/?p=3&limit=1')
                        .expect(200)
                        .then(({body: {users}})=> {
                            expect(users.length).to.equal(1)
                        })
                });
                it('can limit by query', () => {
                    return request
                        .get('/api/users/?limit=2')
                        .expect(200)
                        .then(({body: {users}})=> {
                            expect(users.length).to.equal(2)
                        })
                });
                it('400 on bad sort query', () => {
                    return request
                        .get('/api/users/?sort_by=batman')
                        .expect(400)
                        .then(({body: {msg}})=> {
                            expect(msg).to.equal('bad request')
                        })
                });
                it('users ordered query', () => {
                    return request
                        .get('/api/users/?order=asc')
                        .expect(200)
                        .then(({body: {users}})=> {
                            expect(users).to.be.ascendingBy('username')
                        })
                });
                it('400 on bad orders query', () => {
                    return request
                        .get('/api/users/?order=batman')
                        .expect(400)
                        .then(({body: {msg}})=> {
                            expect(msg).to.equal('bad request')
                        })
                }); 
            });
        });
        describe('api/users/:id', () => {
            describe('invalid methods caught', () => {
                it('PUT', () => {
                    return request
                        .put('/api/users/1')
                        .expect(405)
                });
                it('DELETE', () => {
                    return request
                        .delete('/api/users/1')
                        .expect(405)
                });
                it('POST', () => {
                    return request
                        .post('/api/users/1')
                        .expect(405)
                });
                it('DELETE', () => {
                    return request
                        .delete('/api/users/1')
                        .expect(405)
                });
            });
            describe('GET', () => {
                it('retrieves a single user', () => {
                    return request
                        .get('/api/users/fred')
                        .expect(200)
                        .then(({body: {user}}) => {
                            expect(user.username).to.equal('fred');
                            expect(user).to.include.keys('username', 'avatar_url', 'name');
                        });
                });
                it('users have an articles count', () => {
                    return request
                        .get('/api/users/fred')
                        .expect(200)
                        .then(({body: {user: {article_count}}})=> {
                            expect(article_count).to.equal('0')
                        })
                    
                });
                it('users have a comment count', () => {
                    return request
                        .get('/api/users/fred')
                        .expect(200)
                        .then(({body: {user: {comment_count}}})=> {
                            expect(comment_count).to.equal('0')
                        })
                    
                });
                it('users have a comment votes total', () => {
                    return request
                        .get('/api/users/fred')
                        .expect(200)
                        .then(({body: {user: {comment_votes}}})=> {
                            expect(comment_votes).to.be.null
                        })
                });
                it('users have an article votes total', () => {
                    return request
                        .get('/api/users/fred')
                        .expect(200)
                        .then(({body: {user: {article_votes}}})=> {
                            expect(article_votes).to.be.null
                        })
                });
                it('404 on valid but absent id', ()=> {
                    return request 
                        .get('/api/users/batman')
                        .expect(404)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('not found')
                        });
                });
                it('404 on invalid id', ()=> {
                    return request 
                        .get('/api/users/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                        .expect(404)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('not found')
                        });
                });
            });
        });
    });
}