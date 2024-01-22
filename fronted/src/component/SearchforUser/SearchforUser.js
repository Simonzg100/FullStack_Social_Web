import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Follow from '../Follow/Follow';
import { searchUsersByUsername } from '../../api/followAPI';
import './SearchforUser.css';

function SearchforUser({
  user, setreturnFromSearch, setFollowingList, followingList, updateUser,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchMatch, setSearchMatch] = useState('initial');
  const [searchPending, setsearchPending] = useState(false);

  const handleReturn = () => {
    setreturnFromSearch(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    setsearchPending(true);
    try {
      console.log(`searching for user:${searchTerm}`);
      console.log(`searchTerm${searchTerm}`);

      const results = await searchUsersByUsername(searchTerm);
      if (!results.error) {
        const resultUser = results.user;
        setSearchResult(resultUser);
        console.log(`Got user:${JSON.stringify(results)}`);
        if (resultUser.username === user.username) {
          setSearchMatch('matchedSelf');
        } else {
          setSearchMatch('match');
        }
      }
    } catch (error) {
      console.log('Error searching for user:', error);
      setSearchMatch('nonmatch');
    }
    setsearchPending(false);
  };

  const handleResearch = async () => {
    try {
      setSearchMatch('initial');
      setSearchResult(null);
    } catch (error) {
      error('Error following user:', error);
    }
  };

  return (
    <div className="searchArea">
      <button className="postBtn" type="button" onClick={handleReturn}>Return</button>
      {searchMatch === 'initial' && !searchResult && (
        <div className="search-bar">
          <input
            className="searchInput"
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="postBtn" type="button" onClick={handleSearch}>Search</button>
          {searchPending && <div className="search-pending">Searching...</div>}
        </div>
      )}
      {searchMatch === 'match' && searchResult && (
      <div>
        <h2>Search Result</h2>
        <ul>
          <li key={searchResult.username} className="search-result-item">
            {searchResult.username}
            {followingList.includes(searchResult.username) ? (
              <button type="button" className="already-followed-button" disabled>Already Followed</button>
            ) : (
              <div>
                <Follow
                  user={user}
                  followID={searchResult.username}
                  setFollowingList={setFollowingList}
                  followingList={followingList}
                  updateUser={updateUser}
                />
              </div>
            )}
            <button className="search-again-button" type="button" onClick={handleResearch}>Search again</button>
          </li>
        </ul>
      </div>
      )}
      {searchMatch === 'nonmatch' && !searchResult && (
      <div>
        <p>
          No user found with the username:
          {searchTerm}
        </p>
        <button className="search-again-button" type="button" onClick={handleResearch}>Search again</button>
      </div>
      )}
      {searchMatch === 'matchedSelf' && (
      <div>
        <p>I see you try to be tricky</p>
        <p>But we accounted for this</p>
        <p>So try search for someone else</p>
        <p>That is not yourself</p>
        <p>LOL</p>
        <button className="searchbutton" type="button" onClick={handleResearch}>Search again</button>
      </div>
      )}
    </div>
  );
}

SearchforUser.propTypes = {
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
  setreturnFromSearch: PropTypes.func.isRequired,
  setFollowingList: PropTypes.func.isRequired,
  followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default SearchforUser;
