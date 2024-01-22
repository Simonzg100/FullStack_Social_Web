const request = require('supertest');
const jwt = require('jsonwebtoken');
/* eslint-disable */
const {
  closeMongoDBConnection, connect, addFollowingByUsername, addFollowerByUsername,
} = require('../../DbOperations/UserMapper');
const webapp = require('../../server');
// TEST LOGIN ENDPOINT

describe('PUT /user/followPerson endpoint', () => {
  let db;
  let token;
  let mongo;

  beforeAll(async () => {
    // Connect to the test database
    mongo = await connect();
    db = mongo.db(); // Make sure this line correctly retrieves the database object from the connection
    await db.collection('user').insertMany([
      { username: 'followuser', following: [], followers: [] },
      { username: 'followuser2', following: [], followers: [] },
    ]);
    const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ'; 
    const testuser = { username: 'followuser' }; 
    token = jwt.sign(testuser, secret, { expiresIn: '1h' }); 
  });

  afterAll(async () => {
    // Close the database connection
    await db.collection('user').deleteOne({ username: 'followuser' });
    await db.collection('user').deleteOne({ username: 'followuser2' });
    await closeMongoDBConnection();
  });

  beforeEach(async () => {
    // Before each test, set up the database state
    
  });
  afterEach(async () => {
    // After each test, reset the database state
    
  });

  test('should allow a user to follow another user', async () => {
    const response = await request(webapp)
      .put('/user/followPerson')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'followuser', personFollowedByUser: 'followuser2' });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Followed');

    // Verify the database was updated correctly for 'testuser'
    const testuser = await db.collection('user').findOne({ username: 'followuser' });
    expect(testuser.following).toContain('followuser2');

    // Verify the database was updated correctly for 'testuser2'
    const testuser2 = await db.collection('user').findOne({ username: 'followuser2' });
    expect(testuser2.followers).toContain('followuser');
  });

  test('backend does not throw error when trying to follow a non-existent user', async () => {
    const nonExistentUser = 'nonExistentUser';
    const response = await request(webapp)
      .put('/user/followPerson')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'followuser', personFollowedByUser: nonExistentUser });

    // Check that the response status code is 200 OK
    expect(response.status).toBe(200);

    const followuser = await db.collection('user').findOne({ username: 'followuser' });
    expect(followuser.following).toContain(nonExistentUser);

    expect(response.body.message).toBe(`Followed !${nonExistentUser}`);
  });

  test('backend does not throw error when trying to follow a non-existent user', async () => {
    const nonExistentUser = 'nonExistentUser';
    const response = await request(webapp)
      .put('/user/followPerson')
      .set('Authorization', `Bearer test token`)
      .send({ username: 'followuser', personFollowedByUser: nonExistentUser });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'failed authentication');
  });
});
