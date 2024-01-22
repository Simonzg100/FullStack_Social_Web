import React from 'react';
import PropTypes from 'prop-types';
import { unhidePost } from '../../api/postsAPI';
import './Unhide.css';

function Unhide({
  postId, createBy, username,
}) {
  const handleUnhide = async (id) => {
    await unhidePost(id, username);
  };

  return (
    <div>
      <button className="UnhideButton" type="button" onClick={() => handleUnhide(postId)}>
        {' '}
        {`Unhide ${createBy}'s post`}
        {' '}
      </button>
    </div>
  );
}

Unhide.propTypes = {
  createBy: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default Unhide;
