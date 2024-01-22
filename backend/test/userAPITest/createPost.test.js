const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../../DbOperations/PostMapper'); // Make sure to import the correct module for post operations
const webapp = require('../../server');
/* eslint-disable */
describe('POST /post/createPost endpoint', () => {
  let db;
  let mongo;
  let token;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    await db.collection('user').insertOne({
      username: 'testuser',
      followers: [],
      following: ['testpostuser2', 'testpostuser3'],
    });

    const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ'; 
    const testUser = { username: 'testuser' }; 
    token = jwt.sign(testUser, secret, { expiresIn: '1h' }); 
  });

  afterAll(async () => {
    await db.collection('user').deleteOne({ username: 'testuser' });
    await closeMongoDBConnection();
  });


  test('should create a post successfully', async () => {
    const newPost = {
      title: 'Test Title',
      createBy: 'testuser',
      content: 'Test Content',
      url: 'http://testurl.com',
    };

    const response = await request(webapp)
      .post('/post/createPost')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Post created successfully!');
    expect(response.body.postCreated).toBeDefined();

    // Optionally, verify that the post was added to the database
    const postId = new ObjectId(response.body.postCreated); // Convert the string to an ObjectId
    const post = await db.collection('posts').findOne({ _id: postId });

    expect(post).toBeDefined();
    expect(post.title).toBe(newPost.title);
    expect(post.createBy).toBe(newPost.createBy);
    expect(post.content).toBe(newPost.content);
    expect(post.url).toBe(newPost.url);

    await db.collection('posts').deleteOne({ _id: postId });
  });

  test('should create a post successfully', async () => {
    const newPost = {
      title: 'Test Title',
      createBy: 'testuser',
      content: 'Test Content',
      url: 'http://testurl.com',
    };

    const response = await request(webapp)
      .post('/post/createPost')
      .set('Authorization', `Bearer test token`)
      .send(newPost);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
