import React from 'react';
import PropTypes from 'prop-types';
import { hidePost } from '../../api/postsAPI';
import './Hide.css';

function Hide({
  postId, username,
}) {
  const handleHide = async (id) => {
    try {
      await hidePost(id, username);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="HideButton" type="button" onClick={() => handleHide(postId)}>Hide this post</button>
    </div>
  );
}

Hide.propTypes = {
  postId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default Hide;
