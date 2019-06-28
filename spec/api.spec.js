process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');

describe('/api/', () => {
    describe('bad methods', () => {
        it('POST', () => {
            return request
                .post('/api/')
                .expect(405)
        });
        it('PUT', () => {
            return request
                .put('/api/')
                .expect(405)
        });
        it('PATCH', () => {
            return request
                .patch('/api/')
                .expect(405)
        });
        it('DELETE', () => {
            return request
                .delete('/api/')
                .expect(405)
        });
    });
    describe('GET', () => {
        it('gets the apiJSON file', () => {
            return request
                .get('/api/')
                .expect(200)
        });
    });
});