import React from 'react';
import PropTypes from 'prop-types';
import { unfollowPerson } from '../../api/followAPI';
import './Unfollow.css';

function Unfollow({
  user, unfollowID, setFollowingList, updateUser,
}) {
  const handleUnfollow = async (userIdToUnfollow) => {
    await unfollowPerson(user.username, userIdToUnfollow);
    const tempUser = user;
    tempUser.following = user.following.filter((id) => id !== userIdToUnfollow);
    updateUser(tempUser);
    setFollowingList(tempUser.following);
  };

  return (
    <div>
      <button className="unFollowbutton" type="button" onClick={() => handleUnfollow(unfollowID)}>Unfollow</button>
    </div>
  );
}

Unfollow.propTypes = {
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
  unfollowID: PropTypes.string.isRequired,
  setFollowingList: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default Unfollow;
