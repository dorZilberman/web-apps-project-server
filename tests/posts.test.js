const request = require('supertest');
const initApp = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user/user');


var app;
var userId;
var postId;
var accessToken;
beforeAll(async () => {
    app = await initApp();
    const createUserRes = await request(app).post(`/users/register`).send({
        name: 'testPostUserName',
        email: 'testPostUserEmail',
        password: 'testPostUserPassword'
    });
    userId = createUserRes.body.userId;
    accessToken = createUserRes.body.accessToken;
});

afterAll(async () => {
    const user = await User.findById(userId);
    await user.remove();
    mongoose.connection.close();
});

describe('GET /posts', () => {
    test('get posts test', async () => {
        const response = await request(app).get('/posts')
        .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toEqual(200);
    });
});

describe('post /posts', () => {
    test('create post test', async () => {
        const response = await request(app).post('/posts')
        .send({
            title: 'testPostTitle',
            description: 'testPostDescription',
            image: 'testPostImage'
        })
        .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toEqual('testPostTitle');
        expect(response.body.description).toEqual('testPostDescription');
        expect(response.body.image).toEqual('testPostImage');
        postId = response.body._id;
    });
});

describe(`PUT /posts`, () => {
    test('update post test', async () => {
        const response = await request(app).put(`/posts/${postId}`)
        .send({
            title: 'testPostTitle2',
            description: 'testPostDescription2',
        })
        .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toEqual('testPostTitle2');
        expect(response.body.description).toEqual('testPostDescription2');
    });
});

describe(`delete /posts`, () => {
    test('delete post test', async () => {
        const response = await request(app).delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual('Post deleted successfully');
    });
});