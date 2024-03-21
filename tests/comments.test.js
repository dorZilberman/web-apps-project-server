const request = require('supertest');
const initApp = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user/user');
const Post = require('../models/post/post');

var app;
var userId;
var postId;
var commentId;
var accessToken;
beforeAll(async () => {
    app = await initApp();
    const getUserRes = await request(app).post(`/users`)
    .send({
        name: 'testCommentUserName',
        email: 'testCommentUserEmail',
        password: 'testCommentUserPassword'
    });
    userId = getUserRes._id;
    const post = new Post({
        userId: userId,
        title: 'testPostTitle',
        description: 'testPostDescription',
        image: ''
    });
    const newPost = await post.save();
    postId = newPost._id;
    accessToken = newPost.accessToken;
});

afterAll(async () => {
    const user = await User.findById(userId);
    await user.remove();
    const post = await Post.findById(postId);
    await post.remove();
    mongoose.connection.close();
});

describe('GET /comments', () => {
    test('get comments test', async () => {
        const response = await request(app).get(`/comments/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);
        // .set('Authorization', `Bearer ${process.env.INTERNAL_SECRET_TOKEN}`);
        expect(response.statusCode).toEqual(200);
    });
});

describe('post /comments', () => {
    test('create comment test', async () => {
        const response = await request(app).post('/comments')
        .send({
            postId,
            content: 'testCommentContent',
        })
        .set('Authorization', `Bearer ${accessToken}`);
        // .set('Authorization', `Bearer ${process.env.INTERNAL_SECRET_TOKEN}`);
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.content).toEqual('testCommentContent');
        commentId = response.body._id;
    });
});

describe(`delete /comments/${commentId}`, () => {
    test('delete comment test', async () => {
        const response = await request(app).delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);
        // .set('Authorization', `Bearer ${process.env.INTERNAL_SECRET_TOKEN}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual('Comment deleted successfully');
    });
});