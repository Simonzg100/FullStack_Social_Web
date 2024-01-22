// import the mongodb driver
const { MongoClient } = require('mongodb');

// import ObjectID
const { ObjectId } = require('mongodb');

const dbURL = '';
/**
 * MongoDB database connection
 */

let MongoConnection;
// connec to the db
const connect = async () => {
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      // { useNewUrlParser: true, useUnifiedTopology: true },
    ));
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

/**
 * user CRUD methods
 */
const getUsers = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('user').find({}).toArray();
    // print the results
    console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return err;
  }
};

const getUserByUsername = async (username) => {
  try {
    // get the db
    const db = await getDB();
    // console.log("username:" + username)
    return await db.collection('user').findOne({ username });
  } catch (error) {
    console.log(`Error fetching user by username: ${error.message}`);
    throw error;
  }
};

const getUserByID = async (userID) => {
  try {
    // get the db
    const db = await getDB();
    return await db.collection('user').findOne({ _id: new ObjectId(userID) });
  } catch (error) {
    console.log(`Error fetching user by username: ${error.message}`);
    throw error;
  }
};

const getUserIdByUsername = async (username) => {
  try {
    const db = await getDB();
    const user = await db.collection('user').findOne({ username });
    return user._id;
  } catch (error) {
    console.log(`Error fetching userId by username: ${error.message}`);
    throw error;
  }
};

const addUser = async (newUser) => {
  try {
    const db = await getDB();
    const result = await db.collection('user').insertOne(newUser);
    if (!result.acknowledged) {
      throw new Error('Failed to add the user!');
    }
    return result.insertedId;
  } catch (error) {
    console.error(`Error adding new user: ${error.message}`);
    throw error;
  }
};

const addFollowerByUsername = async (username, followerName) => {
  try {
    const db = await getDB();
    // Query to find the user by username
    const query = { username };
    // const update = { $set: { followers: followers } };
    const update = { $addToSet: { followers: followerName } };
    const result = await db.collection('user').updateOne(query, update);

    // Check if the update was successful
    // if (result.modifiedCount !== 1) {
    //   throw new Error('Failed to update the user.');
    // }
    if (!result.acknowledged) {
      throw new Error('Failed to update the user.');
    }
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    throw error;
  }
};

const addFollowingByUsername = async (username, followerName) => {
  try {
    const db = await getDB();
    // Query to find the user by username
    const query = { username };

    // Specify the fields to update

    const update = { $addToSet: { following: followerName } };

    const result = await db.collection('user').updateOne(query, update);

    // Check if the update was successful
    // if (result.modifiedCount !== 1) {
    //   throw new Error('Failed to update the user.');
    // }
    if (!result.acknowledged) {
      throw new Error('Failed to update the user.following');
    }
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    throw error;
  }
};
const deleteFollowerByUsername = async (username, followerName) => {
  try {
    const db = await getDB();
    // Query to find the user by username
    const query = { username };
    // Specify the fields to update
    const update = { $pull: { followers: followerName } };
    const result = await db.collection('user').updateOne(query, update);

    // Check if the update was successful
    // if (result.modifiedCount !== 1) {
    //   throw new Error('Failed to update the user.');
    // }
    if (!result.acknowledged) {
      throw new Error('Failed to update the user.');
    }
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    throw error;
  }
};

const deleteFollowingByUsername = async (username, followerName) => {
  try {
    const db = await getDB();
    // Query to find the user by username
    const query = { username };

    // Specify the fields to update
    // let following  = await getUserFolloingsByUsername(username);
    // following = following.filter(follower => follower !== followerName);

    // const update = { $set: { following: following } };
    const update = { $pull: { following: followerName } };

    const result = await db.collection('user').updateOne(query, update);

    // Check if the update was successful
    // if (result.modifiedCount !== 1) {
    //   throw new Error('Failed to update the user.');
    // }
    if (!result.acknowledged) {
      throw new Error('Failed to update the user.');
    }
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    throw error;
  }
};

const getUserFollowersByUsername = async (username) => {
  try {
    const db = await getDB();
    const user = await db.collection('user').findOne({ username });
    if (!user) {
      throw new Error('User not found!');
    }
    return user.followers;
  } catch (error) {
    console.error(`Error fetching followers by username: ${error.message}`);
    throw error;
  }
};

const getUserFolloingsByUsername = async (username) => {
  try {
    const db = await getDB();
    const user = await db.collection('user').findOne({ username });
    if (!user) {
      throw new Error('User not found!');
    }
    return user.following;
  } catch (error) {
    console.error(`Error fetching followers by username: ${error.message}`);
    throw error;
  }
};

const resetLoginAttempts = async (username) => {
  try {
    const db = await getDB();
    await db.collection('user').updateOne(
      { username },
      {
        $set: { loginAttempts: 0 },
      },
    );
  } catch (error) {
    console.log(`Error resetting login attempts for username ${username}: ${error.message}`);
    throw error;
  }
};

const updateLoginAttempts = async (username, attempts) => {
  try {
    const db = await getDB();
    await db.collection('user').updateOne(
      { username },
      {
        $set: {
          loginAttempts: attempts,
          lastAttemptTime: new Date(),
        },
      },
    );
  } catch (error) {
    console.log(`Error updating login attempts for username ${username}: ${error.message}`);
    throw error;
  }
};

// test
/**
(async () => {
  let result = null;
  // 1. test getUserByUsername;
  // result = await getUserByUsername("simon")
  // result = await getUserIdByUsername('simon');

  //2. getUserByID
  // const id = "6544824b0903a5512b3ef57a";
  // result = await getUserByID(id);

  //3. test add user
  // const newUser = {
  //   username: "test simon2",
  //   firstName: "Tina",
  //   lastName: "Wang",
  //   email: "tinaw@seas.upenn.edu",
  //   password: "123",
  //   Note: In a real-world application,
  //   you should never store plain-text passwords in a database.
  //   Always hash them before storing.
  //   major: "CIS",
  //   followers: [],
  //   following: []
  // };
  // result = await addUser(newUser);

  // 4. test getUserFollowersByUsername
  // result = await getUserFollowersByUsername('simon');

  //5.  test getUserFolloingsByUsername
  // result = await getUserFolloingsByUsername('simon');

  //6. test updateUserByUsername
  result  = await addFollowerByUsername('aaaaaa', 'simon');

  //7.
  // result = await addFollowingByUsername('simon', "hhhh");

  // 8.
  // result = await deleteFollowerByUsername('simon', "hhhh");

  //9
  // result = await deleteFollowingByUsername("simon", 'hhhh');

  console.log(`results: ${JSON.stringify(result)}`);
})();
 */
module.exports = {
  connect,
  closeMongoDBConnection,
  getUsers,
  getUserByUsername,
  addUser,
  getUserByID,
  getUserIdByUsername,
  addFollowerByUsername,
  deleteFollowerByUsername,
  getUserFollowersByUsername,
  getUserFolloingsByUsername,
  addFollowingByUsername,
  deleteFollowingByUsername,
  resetLoginAttempts,
  updateLoginAttempts,
};
