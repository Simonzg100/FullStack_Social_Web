const request = require('supertest');
const { closeMongoDBConnection, connect } = require('../../DbOperations/UserMapper');
const userMapper = require('../../DbOperations/UserMapper');
const webapp = require('../../server');

let mongo;
/* eslint-disable */
// TEST LOGIN ENDPOINT
describe('POST /user/login endpoint integration test', () => {
  let db;
  // test user for creating session / expected response
  const testUser = { username: 'testuser', password: 'testpass' };

  /**
   * Before any tests run, connect to the database and add the test user.
   */
  beforeAll(async () => {
    // Connect to the database
    mongo = await connect();
    db = mongo.db();
    // Insert the test user into the database
    await db.collection('user').insertOne({
      username: testUser.username,
      password: testUser.password,
    });
  });

  /**
   * After all tests are run, remove the test user and close the database connection.
   */
  afterAll(async () => {
    // Remove the test user from the database
    await db.collection('user').deleteOne({ username: testUser.username });
    await closeMongoDBConnection();
  });

  test('Successful login returns status code 200 and user data', async () => {
    const response = await request(webapp)
      .post('/user/login')
      .send(`username=${testUser.username}&password=${testUser.password}`);

    expect(response.status).toEqual(200);
    expect(response.type).toBe('application/json');
    expect(response.body.user.username).toBe(testUser.username);
    // Add more assertions if needed, for example, checking for a session token if your app uses one
  });

  test('Login with invalid username returns status code 401', async () => {
    const response = await request(webapp)
      .post('/user/login')
      .send(`username=wronguser&password=${testUser.password}`);

    expect(response.status).toEqual(401);
    expect(response.type).toBe('application/json');
    expect(response.body.message).toBe('Invalid username or password');
  });

  test('Login with invalid password returns status code 401', async () => {
    const response = await request(webapp)
      .post('/user/login')
      .send(`username=${testUser.username}&password=wrongpassword`);

    expect(response.status).toEqual(401);
    expect(response.type).toBe('application/json');
    expect(response.body.message).toBe('Invalid username or password');
  });

  test('Login with missing username or password returns status code 401', async () => {
    const response = await request(webapp)
      .post('/user/login')
      .send(`username=${testUser.username}`);

    expect(response.status).toEqual(401);
    expect(response.type).toBe('application/json');
    expect(response.body.message).toBe('Invalid username or password');
  });

  test('Server error during login returns status code 500', async () => {
    // Mock a database function to throw an error
    jest.spyOn(userMapper, 'getUserByUsername').mockImplementation(() => {
      throw new Error('Database connection error');
    });

    const response = await request(webapp)
      .post('/user/login')
      .send(`username=${testUser.username}&password=${testUser.password}`);

    expect(response.status).toEqual(500);
    expect(response.type).toBe('application/json');
    expect(response.body.message).toBe('Internal Server Error');

    // Restore the original implementation
    userMapper.getUserByUsername.mockRestore();
  });
});
