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

describe('GET /users', () => {
    test('get user test', async () => {
        const response = await request(app).get('/users')
        .set('Authorization', `Bearer ${process.env.INTERNAL_SECRET_TOKEN}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.email).toEqual('testuseremail');
        expect(response.body.fullName).toEqual('testUserFullName');
        expect(response.body.image).toEqual('testUserImage');
    });
});

describe('PUT /users/profile', () => {
    test('update user test', async () => {
        const response = await request(app).put('/users/profile')
        .send({
            fullName: 'testUserFullName'
        })
        .set('Authorization', `Bearer ${process.env.INTERNAL_SECRET_TOKEN}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual('User profile updated');
    });
});