const request = require('supertest');
const initApp = require('../server');
const mongoose = require('mongoose');

var app;
beforeAll(async () => {
    app = await initApp();
});

afterAll(done => {
    mongoose.connection.close();
    done();
});

describe('GET /', () => {
    test('should respond with OK!', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toEqual(200);
    });
});