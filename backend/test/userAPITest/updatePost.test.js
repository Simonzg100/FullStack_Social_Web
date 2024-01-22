const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../../DbOperations/PostMapper');
const webapp = require('../../server');
/* eslint-disable */
describe('PUT /post/updatePost endpoint', () => {
  let db;
  let mongo;
  let postId;
  let token;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const post = await db.collection('posts').insertOne({
      title: 'Initial Title',
      content: 'Initial Content',
      url: 'http://initialurl.com',
    });
    postId = post.insertedId;
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
    await db.collection('posts').deleteMany({ _id: postId });
    await closeMongoDBConnection();
    
  });

  test('should successfully update a post', async () => {
    const updatedData = {
      title: 'Updated Title',
      content: 'Updated Content',
      url: 'http://updatedurl.com',
    };

    const response = await request(webapp)
      .put('/post/updatePost')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId: postId.toString(), ...updatedData });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post updated successfully!');

    const updatedPost = await db.collection('posts').findOne({ _id: postId });
    expect(updatedPost.title).toBe(updatedData.title);
    expect(updatedPost.content).toBe(updatedData.content);
    expect(updatedPost.url).toBe(updatedData.url);
  });

  test('should return an error when trying to update a non-existent post', async () => {
    const nonExistentPostId = new ObjectId();
    const response = await request(webapp)
      .put('/post/updatePost')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postId: nonExistentPostId.toString(),
        title: 'New Title',
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  });

  test('should correctly update when only some fields are provided', async () => {
    const partialUpdateData = {
      content: 'Partially Updated Content',
    };

    const response = await request(webapp)
      .put('/post/updatePost')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId: postId.toString(), ...partialUpdateData });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post updated successfully!');

    const partiallyUpdatedPost = await db.collection('posts').findOne({ _id: postId });
    expect(partiallyUpdatedPost.content).toBe(partialUpdateData.content);
    expect(partiallyUpdatedPost.title).toBe('Updated Title');
    expect(partiallyUpdatedPost.url).toBe('http://updatedurl.com');
  });

  test('should correctly update when only some fields are provided', async () => {
    const partialUpdateData = {
      content: 'Partially Updated Content',
    };

    const response = await request(webapp)
      .put('/post/updatePost')
      .set('Authorization', `Bearer test token`)
      .send({ postId: postId.toString(), ...partialUpdateData });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
