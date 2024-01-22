const request = require('supertest');
const jwt = require('jsonwebtoken');
const { closeMongoDBConnection, connect } = require('../../DbOperations/UserMapper');
const webapp = require('../../server');

/* eslint-disable */
describe('GET /user/following endpoint', () => {
  let db;
  let mongo;
  let token;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
  });

  afterAll(async () => {
    await closeMongoDBConnection();
  });

  beforeEach(async () => {
    // Insert users and their followings
    await db.collection('user').insertOne({
      username: 'testuser',
      following: ['user1', 'user2'],
      followers: [],
    });
    const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ'; 
    const testuser = { username: 'testuser' }; 
    token = jwt.sign(testuser, secret, { expiresIn: '1h' }); 

    await db.collection('user').insertOne({
      username: 'user1',
      following: [],
      followers: ['testuser'],
    });
  });

  afterEach(async () => {
    await db.collection('user').deleteOne({ username: 'testuser' });
    await db.collection('user').deleteOne({ username: 'user1' });
  });

  test('should retrieve following list for a user', async () => {
    const response = await request(webapp)
      .get('/user/following/testuser')
      .set('Authorization', `Bearer ${token}`);
      

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Following list retrieved!');
    expect(response.body.followingLists).toEqual(expect.arrayContaining(['user1', 'user2']));
  });

  test('should respond with status code 500 if the user is not found', async () => {
    const response = await request(webapp)
      .get('/user/following/nonexistentuser')
      .set('Authorization', `Bearer ${token}`);
      

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  });

  test('should respond with status code 500 if the user is not found', async () => {
    const response = await request(webapp)
      .get('/user/following/nonexistentuser')
      .set('Authorization', `Bearer test token`)

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
