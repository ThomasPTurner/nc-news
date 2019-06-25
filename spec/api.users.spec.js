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
        it('gets a list of users', () => {
            return request
                .get('/api/users/')
                .expect(200)
                .then(( {body: {users}} ) => {
                    expect(users.length).to.equal(4);
                });
        });
    });
});