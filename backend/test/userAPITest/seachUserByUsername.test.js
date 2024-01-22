const request = require('supertest');
const jwt = require('jsonwebtoken');
const { closeMongoDBConnection, connect } = require('../../DbOperations/UserMapper');
const webapp = require('../../server');
/* eslint-disable */
describe('GET /user/search endpoint', () => {
  let db;
  let mongo;
  let token;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db(); // Make sure this line correctly retrieves the database object from the connection

    await db.collection('user').insertOne({
      username: 'testuser',
      name: 'search test',
      followers: [],
      following: [],
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
    // Insert a sample user into the database
    
  });

  afterEach(async () => {
    // Clean up the database after each test
    
  });

  test('should return the correct user data when searching by username', async () => {
    const response = await request(webapp)
      .get('/user/search/testuser')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Follower list updated!'); // Make sure this message is what you expect
    expect(response.body.user).toBeDefined();
    expect(response.body.user.username).toBe('testuser');
  });

  test('should return the correct user data when searching by username', async () => {
    const response = await request(webapp)
      .get('/user/search/testuser')
      .set('Authorization', `Bearer test token`)

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
