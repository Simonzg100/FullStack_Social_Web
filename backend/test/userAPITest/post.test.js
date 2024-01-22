const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../../DbOperations/PostMapper');
const webapp = require('../../server');
/* eslint-disable */
describe('Post fetch all post', () => {
  let db;
  let mongo;
  const postID = new ObjectId(1);
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
      createBy: 'testpostuser1',
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
    await db.collection('posts').deleteOne({ _id: postID });
  });

  test('should retrieve all posts for a specific user', async () => {
    const response = await request(webapp)
      .get('/post/userallPosts/testpostuser1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        createBy: 'testpostuser1',
        content: 'test',
        likeCount: 0,
      }),
    ]));
  });

  test('should return 404 if no posts are found for the user', async () => {
    const response = await request(webapp)
      .get('/post/userallPosts/nonexistentuser')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('should return 404 if no posts are found for the user', async () => {
    const response = await request(webapp)
      .get('/post/userallPosts/nonexistentuser')
      .set('Authorization', `Bearer test token`)

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
