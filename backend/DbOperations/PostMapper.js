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
    throw error;
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
  // await MongoConnection.close();
};

/**
 * post CRUD methods
 */
const getAllPosts = async () => {
  try {
    const db = await getDB();
    return await db.collection('posts').find({}).toArray();
  } catch (error) {
    console.log(`Error fetching all posts: ${error.message}`);
    throw error;
  }
};

// Fetch a post by its id
const getPostById = async (postId) => {
  try {
    const db = await getDB();
    return await db.collection('posts').findOne({ _id: new ObjectId(postId) });
  } catch (error) {
    console.error(`Error fetching post by id: ${error.message}`);
    throw error;
  }
};

const getPostByUsername = async (createBy) => {
  try {
    const db = await getDB();
    console.log(`trying to get posts of user: ${createBy}`);
    return await db.collection('posts').find({ createBy }).toArray();
  } catch (error) {
    console.log(`Error fetching posts by username: ${error.message}`);
    throw error;
  }
};

const addPost = async (post) => {
  try {
    const db = await getDB();
    const result = await db.collection('posts').insertOne(post);
    if (!result.acknowledged) {
      throw new Error('Failed to add the post!');
    }
    return result.insertedId;
  } catch (error) {
    console.log(`Error adding new post: ${error.message}`);
    throw error;
  }
};

// Update a post by its id
const updatePostByID = async (postId, updates) => {
  try {
    const db = await getDB();
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $set: updates },
    );
    if (result.modifiedCount === 0) {
      throw new Error('Failed to update the post!');
    }
    return true;
  } catch (error) {
    console.error(`Error updating post: ${error.message}`);
    throw error;
  }
};

// Delete a post by its id
const deletePostByID = async (postId) => {
  try {
    const db = await getDB();
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });
    if (result.deletedCount === 0) {
      throw new Error('Failed to delete the post!');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting post: ${error.message}`);
    throw error;
  }
};

const likePost = async (postId, username) => {
  try {
    const db = await getDB();
    const query = { _id: new ObjectId(postId) };
    const update = { $addToSet: { like: username }, $inc: { likeCount: 1 } };
    const result = await db.collection('posts').updateOne(query, update);
    console.log(`postId: ${query._id}`);
    console.log(`username: ${JSON.stringify(update)}`);
    console.log(`result: ${JSON.stringify(result)}`);
    if (!result.acknowledged) {
      throw new Error('Failed to like a post.');
    }
    const post = await db.collection('posts').findOne(query);
    console.log(`post: ${JSON.stringify(post)}`);
    return post.like;
  } catch (error) {
    console.error(`Error liking post: ${error.message}`);
    throw error;
  }
};

const unlikePost = async (postId, username) => {
  try {
    const db = await getDB();
    const query = { _id: new ObjectId(postId) };

    const update = { $pull: { like: username }, $inc: { likeCount: -1 } };
    const result = await db.collection('posts').updateOne(query, update);
    if (!result.acknowledged) {
      throw new Error('Failed to unlike a post');
    }
    const post = await db.collection('posts').findOne(query);
    return post.like;
  } catch (error) {
    console.log(`Error unliking a post: ${error.message}`);
    throw error;
  }
};

const commentPost = async (postId, username, comment) => {
  try {
    const db = await getDB();
    const query = { _id: new ObjectId(postId) };
    const update = {
      $push: {
        comment: {
          _id: new ObjectId(),
          commentBy: username,
          comment,
        },
      },
    };

    const result = await db.collection('posts').updateOne(query, update);

    if (!result.acknowledged) {
      throw new Error('failed to comment a post');
    }
    const post = await db.collection('posts').findOne(query);
    return post.comment;
  } catch (error) {
    console.log(`Error commenting a post: ${error.message}`);
    throw error;
  }
};

const deleteCommentPost = async (postId, commentId) => {
  try {
    const db = await getDB();
    const query = { _id: new ObjectId(postId) };
    const update = {
      $pull: {
        comment: { _id: new ObjectId(commentId) },
      },
    };
    const result = await db.collection('posts').updateOne(query, update);

    if (!result.acknowledged) {
      throw new Error('failed to comment a post');
    }
    const post = await db.collection('posts').findOne(query);
    return post.comment;
  } catch (error) {
    console.log(`Error deleting a comment: ${error.message}`);
    throw error;
  }
};

const getPostLikeById = async (postId) => {
  try {
    const getPostByIdResult = await getPostById(postId);
    return getPostByIdResult.like;
  } catch (error) {
    console.log(`Error fetching post's like recird: ${error.message}`);
    throw error;
  }
};

const getPostCommentById = async (postId) => {
  try {
    const getPostByIdResult = await getPostById(postId);
    return getPostByIdResult.comment;
  } catch (error) {
    console.log(`Error fetching post's comment recird: ${error.message}`);
    throw error;
  }
};

const hidePost = async (postId, username) => {
  try {
    const db = await getDB();
    const updateResult = await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { hiddenBy: username } },
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('No post found with the given ID.');
    }
    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    console.log(`post: ${JSON.stringify(post)}`);
    return post.is_hidden;
  } catch (error) {
    console.error(`Error adding hiddenBy field to post: ${error.message}`);
    throw error;
  }
};

const unhidePost = async (postId, username) => {
  try {
    const db = await getDB();
    const updateResult = await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { hiddenBy: username } },
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('No post found with the given ID.');
    }
    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    return post.is_hidden;
  } catch (error) {
    console.error(`Error removing hiddenBy field to post: ${error.message}`);
    throw error;
  }
};

// test

/**

(async () => {
  let result = null;
  // 1. test getPostByUsername
  result = await getPostByUsername("simon");

    // result = await getPostById("6547c962beb4de8ad6bf0f78")

  // 2. test addPost
  // const post = {
  //   title: "advice",
  //   content:"Advice from the Top 1% of Software Engineers",
  //   username: "ssdada",
  //   media: "aaaa",
  // }
  // result = await addPost(post);

  //3. updatePostBy_ID
  // const ID = '654552c0da29da2d05feca4a';
  // const updates = {
  //   username: 'ssssss',
  // }
  // result = await updatePostByID(ID, updates);

  // 4. test deletePostByID
  // const ID = '654552c0da29da2d05feca4a';
  // result = await deletePostByID(ID);

  // 5. like a post
  // result = await likePost('6547c962beb4de8ad6bf0f78','simon1');
  // result = await likePost('6547c962beb4de8ad6bf0f78','simon2');

  // result = await unlikePost('6547c962beb4de8ad6bf0f78','simon2');

  //6. comment
  // result = await commentPost('6547c962beb4de8ad6bf0f78', 'simon1', 'this is a comment1');
  // result = await commentPost('6547c962beb4de8ad6bf0f78', 'simon1', 'this is a comment1');
  // result = await commentPost('6547c962beb4de8ad6bf0f78', 'simon1', 'this is a comment1');
  // result = await commentPost('6547c962beb4de8ad6bf0f78', 'simon1', 'this is a comment1');
  // result = await commentPost('6547c962beb4de8ad6bf0f78', 'simon1', 'this is a comment1');

  // result = await deleteCommentPost('6547c962beb4de8ad6bf0f78', '654ab7cf9b0a1d551a7136e4');
  // result = await deleteCommentPost('6547c962beb4de8ad6bf0f78', '654ab7cf9b0a1d551a7136e5');

  //7 getPostLike
  // result  = await getPostLikeById('6547c962beb4de8ad6bf0f78');
  // result = await getPostCommentById('6547c962beb4de8ad6bf0f78');

  console.log(`results: ${JSON.stringify(result)}`);
  closeMongoDBConnection();
})();
  *
 */
module.exports = {
  connect,
  closeMongoDBConnection,
  getAllPosts,
  getPostById,
  getPostByUsername,
  addPost,
  updatePostByID,
  deletePostByID,
  likePost,
  unlikePost,
  commentPost,
  deleteCommentPost,
  getPostLikeById,
  getPostCommentById,
  hidePost,
  unhidePost,
};
