const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../../DbOperations/PostMapper');
const webapp = require('../../server');
/* eslint-disable */
describe('Post comment and uncomment', () => {
  let db;
  let mongo;
  const postID = new ObjectId(13);
  const commentId = new ObjectId(2);
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
    
    // Insert a sample post
    await db.collection('posts').insertOne({
      _id: postID,
      title: 'test',
      createBy: 'testpostuser2',
      content: 'test',
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
  });

  test('should comment a post successfully', async () => {
    // Arrange
    const postId = postID;
    const username = 'testpostuser3';
    const comment = 'test comment';

    // Act
    const response = await request(webapp)
      .post('/post/comment')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId, username, comment });

    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Post commented successfully!');
    // ...additional assertions as needed
  });

  test('should deletecomment a post successfully', async () => {
    // Arrange
    const postId = postID;
    const username = 'testpostuser3';

    // Act
    const response = await request(webapp)
      .post('/post/deletecomment')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId, commentId });
    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Post comment deleted successfully!');
    // ...additional assertions as needed
  });

  test('failed authentication', async () => {
    // Arrange
    const postId = postID;
    const username = 'testpostuser3';
    
    // Act
    const response = await request(webapp)
      .post('/post/deletecomment')
      .set('Authorization', `Bearer test token`)
      .send({ postId, commentId });
    // Assert
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
