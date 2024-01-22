// import jwt
const jwt = require('jsonwebtoken');

// import the db interactions module
const dbLib = require('./DbOperations/UserMapper');

/**
 * autheticates a user by decoding the JWT
 * @returns true if the user is valid
 */
const authenticateUser = async (token, key) => {
  if (!token || !key) {
    return false;
  }
  let processedToken = token;
  if (token.startsWith('Bearer ')) {
    processedToken = token.slice(7);
  }

  try {
    const decoded = jwt.verify(processedToken, key);
    const user = await dbLib.getUserByUsername(decoded.username);
    if (!user) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { authenticateUser };
