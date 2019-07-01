process.env.NODE_ENC = 'test';
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe('api/users', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
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
            it('POST', () => {
                return request
                    .post('/api/users')
                    .expect(405)
            });
            it('DELETE', () => {
                return request
                    .delete('/api/users')
                    .expect(405)
            });
        });
        describe('GET', () => {
            it('gets all users', () => {
                return request
                    .get('/api/users/')
                    .expect(200)
                    .then(( {body: {users}} ) => {
                        expect(users.length).to.equal(5);
                        expect(users[0]).to.have.keys('username', 'avatar_url', 'name')
                    });
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
                        expect(user).to.have.keys('username', 'avatar_url', 'name');
                    });
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