const request = require('supertest');
const jwt = require('jsonwebtoken');
const { closeMongoDBConnection, connect } = require('../../DbOperations/UserMapper');
const webapp = require('../../server');
/* eslint-disable */
let mongo;
describe('GET /user/userstruct endpoint integration test', () => {
  let db;
  let token;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    await db.collection('user').insertOne({ username: 'testuser', password: 'testpass', email: 'testuser@example.com' });
    const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ'; 
    const testUser = { username: 'testuser' }; 
    token = jwt.sign(testUser, secret, { expiresIn: '1h' }); 
  });

  afterAll(async () => {
    await db.collection('user').deleteOne({ username: 'testuser' });
    await closeMongoDBConnection();
  });

  test('Successful retrieval of user information returns status code 200 and user data', async () => {
    const response = await request(webapp)
      .get('/user/userstruct/testuser')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.type).toBe('application/json');
    expect(response.body.message).toBe('User information retrieved successfully!');
  });

  test('Server error during retrieval returns status code 500', async () => {

    const response = await request(webapp)
      .get('/user/userstruct/testuser')
      .set('Authorization', `Bearer test token`)

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
