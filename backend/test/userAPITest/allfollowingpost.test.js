const jwt = require('jsonwebtoken');
const request = require('supertest');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../../DbOperations/PostMapper');
const webapp = require('../../server');

/* eslint-disable */
describe('Post comment and uncomment', () => {
  let db;
  let mongo;
  const postID = new ObjectId(13);
  const commentId = new ObjectId(2);
  const postID2 = new ObjectId(13);
  const commentId2 = new ObjectId(4);
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
    token = jwt.sign(testUser, secret); 
  });

  afterAll(async () => {
    await db.collection('user').deleteOne({ username: 'testuser' });
    await closeMongoDBConnection();
  });

  beforeEach(async () => {
    // Insert a sample post
    await db.collection('posts').insertOne({
      _id: postID2,
      title: 'test2',
      createBy: 'testpostuser2',
      content: 'test2',
      likeCount: 0,
      like: [],
      comment: [
        {
          _id: commentId2,
          commentBy: 'hank',
          comment: 'hi2',
        },
      ],
    });

    await db.collection('posts').insertOne({
      _id: postID,
      title: 'test1',
      createBy: 'testpostuser3',
      content: 'test1',
      likeCount: 0,
      like: [],
      comment: [
        {
          _id: commentId,
          commentBy: 'hank',
          comment: 'hi',
        },
      ],
    });
    
  });

  afterEach(async () => {
    // await db.collection('posts').deleteOne({ _id: new ObjectId(12)});
    await db.collection('posts').deleteOne({ _id: postID });
    await db.collection('posts').deleteOne({ _id: postID2 });
    
  });

  test('should get posts successfully', async () => {
    // Act: Include the JWT token in the Authorization header
    const response = await request(webapp)
      .get('/post/getpostsByFollowinglist')
      .set('Authorization', `Bearer ${token}`) // Set the JWT token in the request header
      .query({ usernames: ['testpostuser2', 'testpostuser3'] });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'user following list posts retrieved successfully!');
  });

  test('failed authentication', async () => {
    const response = await request(webapp)
      .get('/post/getpostsByFollowinglist')
      .set('Authorization', `Bearer test token`)
      .query({ usernames: ['testpostuser2', 'testpostuser3'] });

    // Assert
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
