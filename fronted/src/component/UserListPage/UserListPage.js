import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Follow from '../Follow/Follow';
import Unfollow from '../Unfollow/Unfollow';
import { getUserFollowing, getUserFollower } from '../../api/followAPI';
import SearchforUser from '../SearchforUser/SearchforUser';
import './UserListPage.css';

function UserListPage({ user, handleReturnFromManage, updateUser }) {
  const [followingsList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [returnFromSearch, setreturnFromSearch] = useState(false);

  const fetchUserData = async () => {
    console.log(`followingList${user.following}`);
    console.log(`followersList${user.followers}`);
    try {
      const fetchedFollowingUserData = await getUserFollowing(user.username);
      if (!fetchedFollowingUserData.error) {
        setFollowingList(fetchedFollowingUserData.followingLists);
      }
      const fetchedFollowerUserData = await getUserFollower(user.username);
      if (!fetchedFollowerUserData.error) {
        setFollowersList(fetchedFollowerUserData.followerLists);
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };
  useEffect(() => {
    // Fetch the list of users you are following
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 5000); // Fetch new data every 5 seconds]
    return () => clearInterval(intervalId);
  }, [user.followers, user.following]);

  const handleReturn = () => {
    handleReturnFromManage();
  };

  if (returnFromSearch) {
    return (
      <div>
        <SearchforUser
          user={user}
          setreturnFromSearch={setreturnFromSearch}
          setFollowingList={setFollowingList}
          followingList={followingsList}
          updateUser={updateUser}
        />
      </div>
    );
  }
  // console.log("followingList" + JSON.stringify(followingsList));
  return (
    <div className="userListPage">
      <div className="return-search-buttons">
        <button className="btn" type="button" onClick={handleReturn}>Return to profile</button>
        <button className="btn" type="button" onClick={() => setreturnFromSearch(true)}>Search for a user</button>
      </div>
      <div className="following-list">
        <h2>Following List</h2>
        <ul>
          {followingsList.map((followeduser) => (
            <li key={followeduser}>
              <div className="username-and-button">
                <span className="username">{followeduser}</span>
                <div className="button-container">
                  <div>
                    <Unfollow
                      user={user}
                      unfollowID={followeduser}
                      setFollowingList={setFollowingList}
                      updateUser={updateUser}
                    />
                  </div>
                </div>
              </div>

            </li>
          ))}
        </ul>
      </div>

      <div className="followers">
        <h2>Followers</h2>
        <ul>
          {followersList.map((followeruser) => (
            <li key={followeruser}>
              <div className="username-and-button">
                <span className="username">{followeruser}</span>
                <div className="button-container">
                  <div>
                    <Follow
                      user={user}
                      followID={followeruser}
                      setFollowingList={setFollowingList}
                      followingList={followingsList}
                      updateUser={updateUser}
                    />
                  </div>
                </div>
              </div>

            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

UserListPage.propTypes = {
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
  handleReturnFromManage: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default UserListPage;
