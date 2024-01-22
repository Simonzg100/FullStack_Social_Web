import axios from 'axios';
import { rootURL } from '../utils/utils';

const setHeaders = () => {
  const appToken = sessionStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = appToken ? `Bearer ${appToken}` : null;
};

/**
 * deletes any (expired) token and relaunch the app
 */
const reAuthenticate = (status) => {
  if (status === 401) {
    // delete the token
    sessionStorage.removeItem('app-token');
    window.location.reload(true);
  }
};

export const getUserFollowing = async (username) => {
  try {
    setHeaders();
    const response = await axios.get(`${rootURL}/user/following/${username}`);
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error fetching following list of the user');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized Error');
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const getUserFollower = async (username) => {
  try {
    setHeaders();
    const response = await axios.get(`${rootURL}/user/follower/${username}`);
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error fetching follower list of the user');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized Error');
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const followPerson = async (username, personFollowedByUser) => {
  try {
    setHeaders();
    const response = await axios.put(`${rootURL}/user/followPerson`, { username, personFollowedByUser });
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error following the user');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized Error');
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const unfollowPerson = async (username, personUnfollowed) => {
  try {
    setHeaders();
    const response = await axios.put(`${rootURL}/user/unfollowPerson`, { username, personUnfollowed });
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error unfollowing the user');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized Error');
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const searchUsersByUsername = async (username) => {
  try {
    setHeaders();
    const response = await axios.get(`${rootURL}/user/search/${username}`);
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error searching the user');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized Error');
      reAuthenticate();
    }
    return { error: error.message };
  }
};
