import React from 'react';
import PropTypes from 'prop-types';
import { deleteCommentPost } from '../../api/postsAPI';

function ShowComments({
  postId, comments, username, handleComment,
}) {
  const handleDelete = async (id) => {
    console.log(`delete comment id:${id}`);
    const result = await deleteCommentPost(postId, id);
    console.log(`delete comment result:${JSON.stringify(result)}`);
    handleComment(result.commentDeleted);
  };

  return (
    <div className="comments">
      {comments.map((entry) => (
        <div key={entry._id}>
          {' '}
          {/* Use entry.id if available, otherwise use index */}
          <p>{`${entry.commentBy}: ${entry.comment}`}</p>
          {entry.commentBy === username && (
            <button className="postBtn" type="button" onClick={() => handleDelete(entry._id)}>delete!</button>
          )}
        </div>
      ))}
    </div>
  );
}

ShowComments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    commentBy: PropTypes.string,
    comment: PropTypes.string,
  })).isRequired,
  username: PropTypes.string.isRequired,
  handleComment: PropTypes.func.isRequired,
};

export default ShowComments;
