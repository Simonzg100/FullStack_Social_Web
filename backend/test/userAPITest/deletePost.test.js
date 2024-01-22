const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../../DbOperations/PostMapper');
const webapp = require('../../server');
/* eslint-disable */
describe('DELETE /post/deletePost endpoint', () => {
  let db;
  let mongo;
  let postId;
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

  beforeEach(async () => {
    const post = {
      title: 'Test Post',
      content: 'This is a test post',
      createBy: 'testuser',
    };
    const result = await db.collection('posts').insertOne(post);
    postId = result.insertedId.toString();
  });

  afterEach(async () => {
    // Ensure postId is defined before trying to delete
    if (postId) {
      await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });
    }

    // Reset postId for safety, though this is optional since beforeEach will set it
    postId = undefined;
  });

  test('should delete a post successfully', async () => {
    const response = await request(webapp)
      .delete('/post/deletePost')
      .set('Authorization', `Bearer ${token}`)
      .query({ postId: postId.toString() });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post deleted successfully!');
    expect(response.body.postId).toBe(postId.toString());

    const post = await db.collection('posts').findOne({ _id: postId });
    expect(post).toBeNull();
  });

  test('should return a 500 status code if the post does not exist', async () => {
    const nonExistentPostId = new ObjectId();
    const response = await request(webapp)
      .delete('/post/deletePost')
      .set('Authorization', `Bearer ${token}`)
      .query({ postId: nonExistentPostId.toString() });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  });

  test('should delete a post successfully', async () => {
    const response = await request(webapp)
      .delete('/post/deletePost')
      .set('Authorization', `Bearer test token`)
      .query({ postId: postId.toString() });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
