import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getAllFollowingPost } from '../../api/postsAPI';
import { logout } from '../../api/usersAPI';
import Profile from '../Profile/Profile';
import Post from '../Post/Post';
import NewPost from '../Newpost/Newpost';
import './ActivityFeed.css';
//  good

function ActivityFeed({ user, updateUser }) {
  const [activityData, setActivityData] = useState([]);
  const [profileShow, setProfileShow] = useState(false);
  const [postShow, setPostShow] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);
  const sentinelRef = useRef(null);
  const activityDataLengthRef = useRef(activityData.length);

  const handlePost = () => {
    setPostShow(true);
  };

  const handleProfilettoTrue = () => {
    setProfileShow(true);
  };

  const handleProfilettoFalse = () => {
    setProfileShow(false);
  };

  const handlePostAdded = () => {
    setPostShow(false);
  };

  const handlePostCancelled = () => {
    setPostShow(false);
  };

  const handleLogOut = async () => {
    sessionStorage.removeItem('app-token');
    sessionStorage.removeItem('app-user');
    updateUser(null);
    await logout(user);
  };

  const fetchUserPosts = async () => {
    if (user.following.length > 0) {
      const fetchedActivityData = await getAllFollowingPost(user.following);
      if (!fetchedActivityData.error) {
        setActivityData(fetchedActivityData);
        activityDataLengthRef.current = fetchedActivityData.length;
      }
    } else {
      setActivityData([]);
    }
  };

  const loadMorePosts = () => {
    setTimeout(() => {
      const length = activityDataLengthRef.current;
      if (length > 0 && nextIndex <= length) {
        setNextIndex(nextIndex + 1);
      }
    }, 1000); // Delay of 1000 milliseconds (1 second)
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
      }
    }, { threshold: 0.5 });
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [sentinelRef, nextIndex]);

  useEffect(() => {
    fetchUserPosts();
    const intervalId = setInterval(fetchUserPosts, 5000); // Fetch new data every 5 seconds
    return () => clearInterval(intervalId);
  }, [user.following, profileShow, postShow]);

  if (profileShow) {
    return (
      <Profile
        user={user}
        handleProfilettoFalse={handleProfilettoFalse}
        updateUser={updateUser}
      />
    );
  }

  if (postShow) {
    return (
      <NewPost
        className="profile-container"
        user={user}
        handlePostAdded={handlePostAdded}
        handlePostCancelled={handlePostCancelled}
      />
    );
  }

  return (
    <div className="container">
      <div className="sidebar">
        <p id="title">Group Social</p>
        <button className="btn" type="button" onClick={handlePost}>Post Something</button>
        <button className="btn" type="button" onClick={handleProfilettoTrue}>Profile</button>
        <button className="btn" type="button" onClick={handleLogOut}>Logout</button>
      </div>
      <div className="activity-feed">
        <h2 id="AFTitle">Activity Feed</h2>
        <div className="user-posts">
          {activityData.slice(0, nextIndex).map((post) => (
            <Post
              key={post._id}
              post={post}
              username={user.username}
              likeEnabled
              commentEnabled
            />
          ))}
          <div ref={sentinelRef} className="sentinel">
            {activityDataLengthRef.current <= nextIndex ? 'End of Content' : 'Loading more...'}
          </div>
        </div>
      </div>
    </div>
  );
}

ActivityFeed.propTypes = {
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
  updateUser: PropTypes.func.isRequired,
};

export default ActivityFeed;
