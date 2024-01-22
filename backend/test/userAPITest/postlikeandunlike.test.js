const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../../DbOperations/PostMapper');
const webapp = require('../../server');
/* eslint-disable */
describe('Post like and unlike', () => {
  let db;
  let mongo;
  let token;
  const postID = new ObjectId(12);

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
          _id: new ObjectId(2),
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

  test('should like a post successfully', async () => {
    // Arrange
    const postId = postID;
    const username = 'testpostuser3';

    // Act
    const response = await request(webapp)
      .put('/post/like')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId, username });

    console.log(JSON.stringify(response.body));
    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post liked successfully!');
    // ...additional assertions as needed
  });

  test('should unlike a post successfully', async () => {
    // Arrange
    const postId = postID;
    const username = 'testpostuser3';

    // Act
    const response = await request(webapp)
      .put('/post/unlike')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId, username });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post unliked successfully!');
  });

  test('should unlike a post successfully', async () => {
    // Arrange
    const postId = postID;
    const username = 'testpostuser3';

    // Act
    const response = await request(webapp)
      .put('/post/unlike')
      .set('Authorization', `Bearer test token`)
      .send({ postId, username });

    // Assert
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
