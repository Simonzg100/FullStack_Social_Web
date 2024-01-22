import axios from 'axios';
import { rootURL } from '../utils/utils';

const setHeaders = () => {
  const appToken = sessionStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = appToken ? `Bearer ${appToken}` : null;
};

/**
 * deletes any (expired) token and relaunch the app
 */
const reAuthenticate = () => {
  // delete the token
  sessionStorage.removeItem('app-token');
  window.location.reload(true);
};

export const getUserPosts = async (createBy) => {
  try {
    setHeaders();
    const response = await axios.get(`${rootURL}/post/userallPosts/${createBy}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const deletePost = async (postId) => {
  try {
    setHeaders();
    console.log(`trying to delete post: ${postId}`);
    const response = await axios.delete(`${rootURL}/post/deletePost`, {
      params: { postId },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const createPost = async (post) => {
  try {
    setHeaders();
    console.log(`trying to create post: ${JSON.stringify(post)}`);
    const newpost = {
      title: post.title,
      createBy: post.createBy,
      content: post.content,
      url: post.url,
      likeCount: 0,
      like: [],
      comment: [],
    };
    const response = await axios.post(`${rootURL}/post/createPost`, newpost);
    // if (response.status !== 201) {
    //   throw new Error(response.data.message || 'Error creating the post');
    // }
    return response.data;
  } catch (error) {
    console.log(error.message);
    if (error.response && error.response.status === 401) {
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const updatePost = async (postId, title, content, url) => {
  try {
    setHeaders();
    const updateData = {};
    updateData.postId = postId;
    if (title !== null) {
      updateData.title = title;
    }
    if (content !== null) {
      updateData.content = content;
    }
    if (url !== null) {
      updateData.url = url;
    }
    console.log(`trying to update post: ${JSON.stringify(updateData)}`);
    const response = await axios.put(`${rootURL}/post/updatePost`, updateData);
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error updating the post');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const likePost = async (postId, username) => {
  try {
    setHeaders();
    const response = await axios.put(`${rootURL}/post/like`, { postId, username });
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error liking the post');
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

export const unlikePost = async (postId, username) => {
  try {
    setHeaders();
    const response = await axios.put(`${rootURL}/post/unlike`, { postId, username });
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error unliking the post');
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

export const commentPost = async (postId, username, comment) => {
  try {
    setHeaders();
    const response = await axios.post(`${rootURL}/post/comment`, { postId, username, comment });
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Error commenting the post');
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

export const deleteCommentPost = async (postId, commentId) => {
  try {
    setHeaders();
    const response = await axios.post(`${rootURL}/post/deletecomment`, { postId, commentId });
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Error deleting comment for the post');
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

export const getAllFollowingPost = async (usernames) => {
  try {
    setHeaders();
    const response = await axios.get(`${rootURL}/post/getpostsByFollowinglist`, {
      params: { usernames },
    });
    // if (response.status !== 200) {
    //   throw new Error(response.data.message || 'Error fetching follower posts');
    // }
    const resultArray = response.data.posts;
    const nonEmptyArrays = resultArray.filter(
      (subArr) => Array.isArray(subArr) && subArr.length > 0,
    );
    const flattened = nonEmptyArrays.flat();
    const sorted = flattened.sort((a, b) => Number(b._id) - Number(a._id));
    return sorted;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized Error');
      reAuthenticate();
    }
    return { error: error.message };
  }
};

export const uploadFile = async (files) => {
  try {
    setHeaders();
    const response = await axios.post(`${rootURL}/post/uploadMedia`, files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Error uploading media');
    }
    console.log('response.data.s3URL', response.data.s3URL);
    return response.data.s3URL;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized Error');
      reAuthenticate();
    }
    return { error: error.message };
  }
};
export const hidePost = async (postId, username) => {
  try {
    setHeaders();
    const response = await axios.post(`${rootURL}/post/hide`, { postId, username });
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Error hiding the post');
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
export const unhidePost = async (postId, username) => {
  try {
    setHeaders();
    const response = await axios.post(`${rootURL}/post/unhide`, { postId, username });
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Error unhiding the post');
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
