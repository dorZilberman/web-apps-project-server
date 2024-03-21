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
    const createUserRes = await request(app).post(`/users/register`).send({
        name: 'testCommentUserName',
        email: 'testCommentUserEmail',
        password: 'testCommentUserPassword'
    });
    userId = createUserRes.body.userId;
    accessToken = createUserRes.body.accessToken;
    const post = new Post({
        userId: userId,
        title: 'testCommentPostTitle',
        description: 'testCommentPostDescription',
        image: ''
    });
    const newPost = await post.save();
    postId = newPost._id;
});

afterAll(async () => {
    const user = await User.findById(userId);
    await user.remove();
    const post = await Post.findById(postId);
    await post.remove();
    mongoose.connection.close();
});

describe(`GET /comments`, () => {
    test('get comments test', async () => {
        const response = await request(app).get(`/comments/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`);
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
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.content).toEqual('testCommentContent');
        commentId = response.body._id;
    });
});

describe(`delete /comments`, () => {
    test('delete comment test', async () => {
        const response = await request(app).delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual('Comment deleted successfully');
    });
});