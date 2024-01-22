import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NewPost from '../Newpost/Newpost';
import './Profile.css';
import { getUserPosts } from '../../api/postsAPI';
import Post from '../Post/Post';
import PostUpdate from '../PostUpdate/PostUpdate';
import DeletePost from '../DeletePost/DeletePost';
import UserListPage from '../UserListPage/UserListPage';

function Profile({ user, handleProfilettoFalse, updateUser }) {
  const [addPost, setAddPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState(false);
  const [postUpdate, setPostUpdate] = useState(null);
  const [toDelete, settoDelete] = useState(null);

  const handlePostUpdate = (postId) => {
    setPostUpdate(postId);
  };

  const handleNewpost = () => {
    setAddPost(true);
  };

  const handlePostCancelled = () => {
    setAddPost(false);
  };

  const handlePostAdded = async () => {
    const updatedPosts = await getUserPosts(user.username);
    if (!updatedPosts.error) {
      setPosts(updatedPosts);
    }
    setAddPost(false);
  };

  const handleReturn = () => {
    handleProfilettoFalse();
  };

  const handlePostDeleted = (deletedPostId) => {
    settoDelete(deletedPostId);
  };

  const handleFollow = () => {
    setFollow(true);
  };

  const handleReturnFromManage = () => {
    setFollow(false);
  };

  const fetchUserPosts = async () => {
    const fetchedPosts = await getUserPosts(user.username);
    setPosts(fetchedPosts);
  };

  useEffect(() => {
    fetchUserPosts();
    const intervalId = setInterval(fetchUserPosts, 5000); // Fetch new data every 5 seconds
    return () => clearInterval(intervalId);
  }, [user, postUpdate, addPost, toDelete, follow]);

  if (addPost) {
    return (
      <div className="profile-container">
        <NewPost
          user={user}
          handlePostAdded={handlePostAdded}
          handlePostCancelled={handlePostCancelled}
        />
      </div>
    );
  }
  if (toDelete !== null) {
    return (
      <div className="delete-container">
        <DeletePost
          postId={toDelete}
          handlePostAdded={handlePostAdded}
          handlePostDeleted={handlePostDeleted}
        />
      </div>
    );
  }

  if (follow) {
    return (
      <div className="follow-container">
        <UserListPage
          user={user}
          handleReturnFromManage={handleReturnFromManage}
          updateUser={updateUser}
        />
      </div>
    );
  }
  if (postUpdate !== null) {
    return (
      <div className="update-container">
        <PostUpdate
          user={user}
          post={(posts.filter((post) => post._id === postUpdate))[0]}
          onPostUpdate={handlePostUpdate}
          updateUser={updateUser}
        />
      </div>
    );
  }
  return (
    <div className="profile-container">
      <h2>
        {`${user.username}'s Profile`}
      </h2>
      <p>
        Name:
        {user.firstName}
        {' '}
        {user.lastName}
      </p>
      <p>
        Email:
        {user.email}
      </p>
      <p>
        Major:
        {user.major}
      </p>
      <button className="ProfileBtn" type="button" onClick={handleFollow}>Manage friends list</button>
      <button className="ProfileBtn" type="button" onClick={handleReturn}>Return to Activities</button>

      <button className="ProfileBtn" type="button" onClick={handleNewpost}>Post something!</button>
      <div className="user-posts">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onPostDeleted={handlePostDeleted}
            onPostUpdate={handlePostUpdate}
            username={user.username}
          />
        ))}
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    major: PropTypes.string.isRequired,
    followers: PropTypes.arrayOf(PropTypes.string).isRequired,
    following: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleProfilettoFalse: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default Profile;
