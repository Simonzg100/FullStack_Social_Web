import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { commentPost } from '../../api/postsAPI';

function CommentPost({ post, username, handleComment }) {
  const [addComment, setaddComment] = useState(false);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (content === '') {
      setMessage('Please enter a comment');
      return;
    }

    const result = await commentPost(post._id, username, content);
    if (!result.error) {
      handleComment(result.postcommented);
    }
    setaddComment(false);
    setContent('');
    setMessage('');
  };
  const handleCancel = () => {
    setaddComment(false);
    setContent('');
    setMessage('');
  };

  const handleAdd = () => {
    setaddComment(true);
  };

  if (addComment) {
    return (
      <div className="comment">
        {message && <div className="error-message">{message}</div>}
        <textarea className="NewCommentText" placeholder="Content" onChange={(e) => setContent(e.target.value)} />
        <button className="textArea postBtn" type="button" onClick={handleSubmit}>submit</button>
        <button className="postBtn" type="button" onClick={handleCancel}>cancel</button>
      </div>
    );
  }
  return (
    <div className="comment">
      <button className="postBtn" type="button" onClick={handleAdd}>write a comment</button>
    </div>
  );
}

CommentPost.propTypes = {
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
  handleComment: PropTypes.func.isRequired,
};

export default CommentPost;
