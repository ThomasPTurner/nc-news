process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe('api/users', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    describe('GET all', () => {
        it('gets a list of users', () => {
            return request
                .get('/api/users/')
                .expect(200)
                .then(( {body: {users}} ) => {
                    expect(users.length).to.equal(5);
                });
        });
        describe('GET by user ID', () => {
            it('retrives a single user', () => {
                return request
                    .get('/api/users/fred')
                    .expect(200)
                    .then(( {body: {user: {username}}} ) => {
                        expect(username).to.equal('fred');
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