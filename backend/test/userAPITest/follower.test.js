const request = require('supertest');
const jwt = require('jsonwebtoken');
const { closeMongoDBConnection, connect } = require('../../DbOperations/UserMapper');
const webapp = require('../../server');
/* eslint-disable */
describe('GET /user/follower endpoint', () => {
  let db;
  let mongo;
  let token;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    await db.collection('user').insertOne({
      username: 'testuser',
      followers: ['follower1', 'follower2'],
      following: [],
    });
    const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ'; 
    const testuser = { username: 'testuser' }; 
    token = jwt.sign(testuser, secret, { expiresIn: '1h' }); 
  });

  afterAll(async () => {
    await db.collection('user').deleteOne({ username: 'testuser' });
    await closeMongoDBConnection();
  });

  beforeEach(async () => {
    // Insert a user and their followers
    
  });
  afterEach(async () => {
  });

  test('should retrieve follower list for a user', async () => {
    const response = await request(webapp)
      .get('/user/follower/testuser')
      .set('Authorization', `Bearer ${token}`);
      

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Follower list retrieved!');
    expect(response.body.followerLists).toEqual(expect.arrayContaining(['follower1', 'follower2']));
  });

  test('should respond with status code 404 if the user is not found', async () => {
    const response = await request(webapp)
      .get('/user/follower/nonexistentuser')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  });

  test('should respond with status code 404 if the user is not found', async () => {
    const response = await request(webapp)
      .get('/user/follower/nonexistentuser')
      .set('Authorization', `Bearer test token`)

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'failed authentication');
  });

});
