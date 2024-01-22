// HTTP client
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

export const loginUser = async (user) => {
  try {
    const response = await axios.post(`${rootURL}/user/login`, user, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200) {
      throw response.data.message || 'Error during login';
    }
    sessionStorage.setItem('app-token', response.data.token);
    sessionStorage.setItem('app-user', JSON.stringify(response.data.user));
    return response;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data) {
      throw (error.response.data.message || 'Login failed');
    } else {
      throw new Error('Login failed. Please try again.');
    }
  }
};

export const logout = async (user) => {
  try {
    await axios.post(`${rootURL}/user/logout`, user, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error('Login failed. Please try again.');
  }
};

export const register = async (newUser) => {
  try {
    const response = await axios.post(`${rootURL}/user/register`, newUser);
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Error registering');
    }
    return response.data;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

export const getUser = async (username) => {
  try {
    setHeaders();
    const response = await axios.get(`${rootURL}/user/userstruct/${username}`);
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error fetching the user');
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
