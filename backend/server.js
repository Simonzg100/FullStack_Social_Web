// import fs
const fs = require('fs');

// import express
const express = require('express');

// import firmidable
const formidable = require('formidable');

// enable cross-origin resource sharing
const cors = require('cors');
// Import authentication operations

const jwt = require('jsonwebtoken');

// secret key
const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ';
// create express app
const webapp = express();

const { ObjectId } = require('mongodb');
const auth = require('./auth');
// import S3 operations
const s3 = require('./s3Operations');

const userMapper = require('./DbOperations/UserMapper');
const postMapper = require('./DbOperations/PostMapper');

// server port
const port = 8080;

webapp.use(cors());
webapp.use(express.json());

webapp.use(express.urlencoded({
  extended: true,
}));

// declare DB object

// let db;

// start server and connect to the DB

// Only start the server if the file was executed directly from the command line,
if (require.main === module) {
  webapp.listen(port, () => {
    // console.log(`Server running on port: ${port}`);
  });
}
const loginUser = new Set();
// Root endpoint
webapp.post('/user/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // get the database instance
    const user = await userMapper.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (user.loginAttempts >= 5 && new Date() - new Date(user.lastAttemptTime) < 10 * 60 * 1000) {
      return res.status(401).json({ message: 'Account locked. Try again later.' });
    }
    if (user.password !== password) {
      // console.log(`Passwords do not match for username: ${username}`);
      await userMapper.updateLoginAttempts(username, user.loginAttempts + 1);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (loginUser.has(username)) {
      return res.status(401).json({ message: 'Login in at other place' });
    }

    loginUser.add(username);
    // successfully login
    await userMapper.resetLoginAttempts(username);
    const jwtoken = jwt.sign({ username }, secret, { expiresIn: '12000s' });
    return res.status(200).json({ token: jwtoken, user });
  } catch (error) {
    // console.log(`Error during logn: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.post('/user/logout', (req, res) => {
  const { username } = req.body;
  if (loginUser.has(username)) {
    loginUser.delete(username);
  }
  res.status(200).json({ message: 'Logged out successfully' });
});

webapp.post('/user/register', async (req, res) => {
  try {
    const newUser = req.body;
    // Check if the user already exists based on the username
    const existingUser = await userMapper.getUserByUsername(newUser.username);
    if (existingUser) {
      // console.log("add newUser1:" + newUser);
      return res.status(500).json({ message: 'Username already exists!' });
    }
    const user = await userMapper.addUser(newUser);
    return res.status(201).json({ message: 'Registration successful!', user });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed!' });
  }
});

// followServer
webapp.get('/user/following/:username', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { username } = req.params;
    console.log('username', username);
    console.log('username', typeof (username));
    // get the database instance
    const followingLists = await userMapper.getUserFolloingsByUsername(username);
    return res.status(200).json({ message: 'Following list retrieved!', followingLists });
  } catch (error) {
    // console.log(`Error during logn: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.get('/user/follower/:username', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { username } = req.params;
    // get the database instance
    const followerLists = await userMapper.getUserFollowersByUsername(username);
    return res.status(200).json({ message: 'Follower list retrieved!', followerLists });
  } catch (error) {
    // console.log(`Error during logn: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.put('/user/followPerson', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { username, personFollowedByUser } = req.body;
    // get the database instance
    // 1. // update the user's following list
    await userMapper.addFollowingByUsername(username, personFollowedByUser);
    // 2.. update the user's follower list
    await userMapper.addFollowerByUsername(personFollowedByUser, username);
    return res.status(200).json({ message: `Followed !${personFollowedByUser}` });
  } catch (error) {
    // console.log(`Error during logn: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.put('/user/unfollowPerson', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { username, personUnfollowed } = req.body;
    // get the database instance

    // 1. // update the user's following list
    await userMapper.deleteFollowingByUsername(username, personUnfollowed);
    // 2.. update the user's follower list
    await userMapper.deleteFollowerByUsername(personUnfollowed, username);

    return res.status(200).json({ message: `unfollow !${personUnfollowed}` });
  } catch (error) {
    // console.log(`Error during logn: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.get('/user/search/:username', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { username } = req.params;
    const user = await userMapper.getUserByUsername(username);
    // console.log("user", user);
    return res.status(200).json({ message: 'Follower list updated!', user });
  } catch (error) {
    // console.log(`Error during logn: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.get('/post/userallPosts/:createBy', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { createBy } = req.params;
    const posts = await postMapper.getPostByUsername(createBy);
    return res.status(200).json(posts);
  } catch (err) {
    // console.log(`Error fetching posts of the user: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.delete('/post/deletePost', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { postId } = req.query;
    const objectId = new ObjectId(postId);
    await postMapper.deletePostByID(objectId);
    return res.status(200).json({ message: 'Post deleted successfully!', postId });
  } catch (err) {
    // console.log(`Error deleting the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.post('/post/createPost', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const post = req.body;
    const postCreated = await postMapper.addPost(post);
    return res.status(201).json({ message: 'Post created successfully!', postCreated });
  } catch (err) {
    // console.log(`Error creating the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.put('/post/updatePost', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const {
      postId, title, content, url,
    } = req.body;
    const updates = {};
    if (content !== undefined) updates.content = content;
    if (title !== undefined) updates.title = title;
    if (url !== undefined) updates.url = url;
    const post = await postMapper.updatePostByID(postId, updates);
    return res.status(200).json({ message: 'Post updated successfully!', post });
  } catch (err) {
    // console.log(`Error updating the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// like and unlike the post
webapp.put('/post/like', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { postId, username } = req.body;
    const postlike = await postMapper.likePost(postId, username);
    return res.status(200).json({ message: 'Post liked successfully!', postlike });
  } catch (err) {
    // console.log(`Error liking the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.put('/post/unlike', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { postId, username } = req.body;
    const postlike = await postMapper.unlikePost(postId, username);
    return res.status(200).json({ message: 'Post unliked successfully!', postlike });
  } catch (err) {
    // console.log(`Error unliking the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.post('/post/comment', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { postId, username, comment } = req.body;
    const postcommented = await postMapper.commentPost(postId, username, comment);
    return res.status(201).json({ message: 'Post commented successfully!', postcommented });
  } catch (err) {
    // console.log(`Error commenting the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.post('/post/deletecomment', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { postId, commentId } = req.body;
    const commentDeleted = await postMapper.deleteCommentPost(postId, commentId);
    return res.status(201).json({ message: 'Post comment deleted successfully!', commentDeleted });
  } catch (err) {
    // console.log(`Error deleting comment for the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.get('/user/userstruct/:username', async (req, res) => {
  if (!await auth.authenticateUser(req.headers.authorization, secret)) {
    return res.status(401).json({ error: 'failed authentication' });
  }
  try {
    const { username } = req.params;
    const user = await userMapper.getUserByUsername(username);
    return res.status(200).json({ message: 'User information retrieved successfully!', user });
  } catch (err) {
    // console.log(`Error updating the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.get('/post/getpostsByFollowinglist', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      console.log('req.headers.authorization', req.headers.authorization);
      console.log('secret', secret);
      return res.status(401).json({ error: 'failed authentication' });
    }
    const { usernames } = req.query;
    const postsPromises = usernames.map((username) => postMapper.getPostByUsername(username));
    const posts = await Promise.all(postsPromises);
    return res.status(200).json({ message: 'user following list posts retrieved successfully!', posts });
  } catch (error) {
    // console.log(`Error getting posts from user's following list: ${error.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.post('/post/hide', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    console.log(JSON.stringify(req.body));
    const Id = req.body.postId;
    const Username = req.body.username;
    const posthidden = await postMapper.hidePost(Id, Username);
    return res.status(201).json({ message: 'Post hidden successfully! Set to: ', posthidden });
  } catch (err) {
    console.log(`Error commenting the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

webapp.post('/post/unhide', async (req, res) => {
  try {
    if (!await auth.authenticateUser(req.headers.authorization, secret)) {
      return res.status(401).json({ error: 'failed authentication' });
    }
    const Id = req.body.postId;
    const Username = req.body.username;
    const posthidden = await postMapper.unhidePost(Id, Username);
    return res.status(201).json({ message: 'Post unhidden successfully! Set to: ', posthidden });
  } catch (err) {
    // console.log(`Error commenting the post: ${err.message}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// upload endpoint with formidable
webapp.post('/post/uploadMedia', async (req, res) => {
  // console.log('upload a file');
  const form = formidable({}); // { multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(404).json({ error: err.message });
    }
    // create a buffer to cache uploaded file
    let cacheBuffer = Buffer.alloc(0);

    // create a stream from the virtual path of the uploaded file
    const fStream = fs.createReadStream(files.File_0.path);

    fStream.on('data', (chunk) => {
      // fill the buffer with data from the uploaded file
      cacheBuffer = Buffer.concat([cacheBuffer, chunk]);
    });

    fStream.on('end', async () => {
      // send buffer to AWS
      const s3URL = await s3.uploadFile(cacheBuffer, files.File_0.name);

      // You can store the URL in mongoDB with the rest of the data
      // send a response to the client
      return res.status(200).json({ message: `files uploaded at ${s3URL}`, s3URL });
    });
    return null;
  });
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = webapp;
