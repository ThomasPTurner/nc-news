process.env.NODE_ENC = 'test';
const { expect } = require('chai');
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
        it('GET', () => {
            return request
                .get('/api/users/')
                .expect(200)
                .then(( {body: {users}} ) => {
                    expect(users.length).to.equal(5);
                    expect(users[0]).to.have.keys('username', 'avatar_url', 'name')
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
            it('retrives a single user', () => {
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
                        expect(msg).to.equal('user not found')
                    });
            });
            it('404 on invalid id', ()=> {
                return request 
                    .get('/api/users/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('user not found')
                    });
            });
        });
    });
});