const request = require('supertest');
const initApp = require('../server');
const mongoose = require('mongoose');

var app;
var userId;
var accessToken;
beforeAll(async () => {
    app = await initApp();
});

afterAll(async () => {
    mongoose.connection.close();
});

describe('POST /users/register', () => {
    test('register user test', async () => {
        const createUserRes = await request(app).post(`/users/register`).send({
            name: 'testUserName',
            email: 'testUserEmail',
            password: 'testUserPassword',
            image: 'testUserImage'
        });
        expect(createUserRes.statusCode).toEqual(201);
        expect(createUserRes.body).toHaveProperty('userId');
        expect(createUserRes.body).toHaveProperty('accessToken');
        expect(createUserRes.body).toHaveProperty('refreshToken');
        expect(createUserRes.body.message).toEqual('User created!');
        userId = createUserRes.body.userId;
        accessToken = createUserRes.body.accessToken;
    });
});

describe('POST /users/login', () => {
    test('login user test', async () => {
        const loginUserRes = await request(app).post(`/users/login`).send({
            name: 'testUserName',
            email: 'testUserEmail',
            password: 'testUserPassword'
        })
        .set('Authorization', `Bearer ${accessToken}`);
        expect(loginUserRes.statusCode).toEqual(200);
        expect(loginUserRes.body).toHaveProperty('userId');
        expect(loginUserRes.body).toHaveProperty('accessToken');
        expect(loginUserRes.body).toHaveProperty('refreshToken');
        expect(loginUserRes.body.message).toEqual('User Logged In successfully!');
    });
});

describe('GET /users', () => {
    test('get user test', async () => {
        const response = await request(app).get('/users')
        .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.email).toEqual('testUserEmail'.toLowerCase());
        expect(response.body.fullName).toEqual('testUserName');
        expect(response.body.image).toEqual('testUserImage');
    });
});

describe('PUT /users/profile', () => {
    test('update user test', async () => {
        const response = await request(app).put('/users/profile')
        .send({
            fullName: 'testUserFullName'
        })
        .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual('User profile updated');
    });
});

describe('DELETE /users', () => {
    test('delete user test', async () => {
        const response = await request(app).delete('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual('User profile deleted');
    });
});