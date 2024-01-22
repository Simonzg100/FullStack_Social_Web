const request = require('supertest');
const jwt = require('jsonwebtoken');
const { closeMongoDBConnection, connect } = require('../../DbOperations/UserMapper');
const webapp = require('../../server');
/* eslint-disable */
describe('PUT /user/unfollowPerson endpoint', () => {
  let db;
  let mongo;
  let token;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    await db.collection('user').insertMany([
      { username: 'followuser', following: ['followuser2'], followers: [] },
      { username: 'followuser2', following: [], followers: ['followuser'] },
    ]);
    const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ'; 
    const testuser = { username: 'followuser' }; 
    token = jwt.sign(testuser, secret, { expiresIn: '1h' }); 
  });

  afterAll(async () => {
    await db.collection('user').deleteOne({ username: 'followuser' });
    await db.collection('user').deleteOne({ username: 'followuser2' });
    await closeMongoDBConnection();
  });

  beforeEach(async () => {
   
  });

  afterEach(async () => {
  });

  test('should allow a user to unfollow another user', async () => {
    const response = await request(webapp)
      .put('/user/unfollowPerson')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'followuser', personUnfollowed: 'followuser2' });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('unfollow');

    // Verify the database was updated correctly for 'followuser'
    const followuser = await db.collection('user').findOne({ username: 'followuser' });
    expect(followuser.following).not.toContain('followuser2');

    // Verify the database was updated correctly for 'followuser2'
    const followuser2 = await db.collection('user').findOne({ username: 'followuser2' });
    expect(followuser2.followers).not.toContain('followuser');
  });

  test('should allow a user to unfollow another user', async () => {
    const response = await request(webapp)
      .put('/user/unfollowPerson')
      .set('Authorization', `Bearer test token`)
      .send({ username: 'followuser', personUnfollowed: 'followuser2' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
