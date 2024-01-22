import React from 'react';
import PropTypes from 'prop-types';
import { deletePost } from '../../api/postsAPI';
import './Delete.css';

function DeletePost({ postId, handlePostAdded, handlePostDeleted }) {
  const handleDelete = async () => {
    await deletePost(postId);
    handlePostAdded();
    handlePostDeleted(null);
  };

  return (
    <div className="delete">
      <h3>
        Confirm you want to delete this post permanently?
      </h3>
      <button className="postBtn" type="button" onClick={handleDelete}>Confirm</button>
      <button className="postBtn" type="button" onClick={() => handlePostDeleted(null)}>Cancel</button>
    </div>
  );
}

DeletePost.propTypes = {
  postId: PropTypes.string.isRequired,
  handlePostAdded: PropTypes.func.isRequired,
  handlePostDeleted: PropTypes.func.isRequired,
};

export default DeletePost;
