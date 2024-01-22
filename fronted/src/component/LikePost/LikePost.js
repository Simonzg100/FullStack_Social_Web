import React from 'react';
import PropTypes from 'prop-types';
import { likePost } from '../../api/postsAPI';

function LikePost({
  post, username, handleLike, handleLikeCount,
}) {
  const handleClicked = async () => {
    await likePost(post._id, username);
    handleLike([...post.like, username]);
    handleLikeCount();
  };

  return (
    <div className="like">
      <button className="postBtn" type="button" onClick={handleClicked}>Like</button>
    </div>
  );
}

LikePost.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createBy: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    url: PropTypes.string,
    like: PropTypes.arrayOf(PropTypes.string).isRequired,
    comment: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      commentBy: PropTypes.string,
      comment: PropTypes.string,
    })).isRequired,
    likeCount: PropTypes.number.isRequired,
  }).isRequired,
  username: PropTypes.string.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleLikeCount: PropTypes.func.isRequired,
};

export default LikePost;
