const request = require('supertest');
const { closeMongoDBConnection, connect } = require('../../DbOperations/UserMapper');
const userMapper = require('../../DbOperations/UserMapper');
const webapp = require('../../server');

let mongo;
/* eslint-disable */
describe('POST /user/register endpoint integration test', () => {
  let db;

  // Test user data for registration
  const newUserData = { username: 'newuser', password: 'newpass', email: 'newuser@example.com' };

  /**
   * Before any tests run, connect to the database.
   */
  beforeAll(async () => {
    // Connect to the database (reuse the existing connection setup)
    mongo = await connect();
    db = mongo.db();
  });

  afterEach(async () => {
    // After each test, remove the test user to ensure a clean state for the next test
    await db.collection('user').deleteOne({ username: newUserData.username });
  });

  afterAll(async () => {
    // After all tests, close the database connection
    await closeMongoDBConnection();
  });

  test('Successful registration returns status code 201 and success message', async () => {
    const response = await request(webapp)
      .post('/user/register')
      .send(newUserData);

    // Add debug log to see the response body when the test fails
    if (response.status !== 201) {
      console.log(response.body);
    }

    expect(response.status).toEqual(201);
    expect(response.type).toBe('application/json');
    expect(response.body.message).toBe('Registration successful!');
    // expect(response.body.user.username).toBe(newUserData.username);
  });

  test('Registration with existing username returns status code 500 and error message', async () => {
    // First, insert a user with the same username to simulate the user already existing
    await db.collection('user').insertOne({
      username: newUserData.username,
      password: newUserData.password,
      email: newUserData.email,
    });

    const response = await request(webapp)
      .post('/user/register')
      .send(newUserData);

    expect(response.status).toEqual(500);
    expect(response.type).toBe('application/json');
    expect(response.body.message).toBe('Username already exists!');
  });

  test('Unexpected error during registration returns status code 500 and failure message', async () => {
    // Mock the `addUser` method to simulate a database insertion error
    jest.spyOn(userMapper, 'addUser').mockImplementationOnce(() => {
      throw new Error('Unexpected database error');
    });

    const response = await request(webapp)
      .post('/user/register')
      .send(newUserData);

    expect(response.status).toEqual(500);
    expect(response.type).toBe('application/json');
    expect(response.body.message).toBe('Registration failed!');

    // Restore the original implementation for other tests
    userMapper.addUser.mockRestore();
  });
});
