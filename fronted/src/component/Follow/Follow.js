import React from 'react';
import PropTypes from 'prop-types';
import { followPerson } from '../../api/followAPI';
import './Follow.css';

function Follow({
  user, followID, setFollowingList, followingList, updateUser,
}) {
  const handleFollow = async (userIdToFollow) => {
    await followPerson(user.username, userIdToFollow);
    const tempUser = user;
    tempUser.following = [...user.following, userIdToFollow];
    updateUser(tempUser);
    setFollowingList(tempUser.following);
  };

  return (
    <div className="user-info">
      {followingList.includes(followID) ? (
        <button className="followBut" type="button" disabled>Already Followed</button>
      ) : (
        <button type="button" className="followBut" onClick={() => handleFollow(followID)}>Follow</button>
      )}
    </div>
  );
}
Follow.propTypes = {
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
  followID: PropTypes.string.isRequired,
  setFollowingList: PropTypes.func.isRequired,
  followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default Follow;
