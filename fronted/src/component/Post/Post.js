import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Post.css';

import LikePost from '../LikePost/LikePost';
import UnlikePost from '../UnlikePost/UnlikePost';
import CommentPost from '../CommentPost/CommentPost';
import ShowComments from '../ShowComments/ShowComments';
import Unhide from '../Unhide/Unhide';
import Hide from '../Hide/Hide';

function Post({
  post, onPostDeleted, onPostUpdate, username, likeEnabled, commentEnabled,
}) {
  const [likeList, setLike] = useState(post.like);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentList, setComment] = useState(post.comment);

  const handleDelete = async () => {
    if (onPostDeleted) {
      onPostDeleted(post._id);
    }
  };

  const handleLikeCountAdd = async () => {
    setLikeCount(likeCount + 1);
  };

  const handleLikeCountMinus = async () => {
    setLikeCount(likeCount - 1);
  };

  const handleLike = async (newList) => {
    setLike(newList);
  };

  const handleComment = async (newList) => {
    setComment(newList);
  };

  useEffect(() => {
    setLike(post.like);
    setLikeCount(post.likeCount);
    setComment(post.comment);
  }, [post]);

  if (post.hiddenBy !== undefined && post.hiddenBy.includes(username)) {
    return (
      <div className="post">
        <Unhide
          postId={post._id}
          createBy={post.createBy}
          username={username}
        />
      </div>
    );
  }

  // if media url provided
  if (post.url) {
    const isVideo = post.url && /\.mp4$/.test(post.url);
    return (
      <div className="post">
        <Hide
          postId={post._id}
          username={username}
        />
        <h3 id="author">{post.createBy}</h3>
        <p className="Postp">{post.content}</p>
        {isVideo ? (
          <video
            title={`Video for ${post.title}`}
            width="560"
            height="315"
            controls
            src={post.url}
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={post.url} alt={post.title} width="560" height="315" />
        )}
        <h3 id="title">{post.title}</h3>

        {likeList.includes(username) ? (
          <p className="likecount">{`Liked by you and ${likeCount - 1} other users`}</p>
        ) : (
          <p className="likecount">{`Liked by ${likeCount} other users`}</p>
        )}

        <ShowComments
          postId={post._id}
          comments={commentList}
          username={username}
          handleComment={handleComment}
        />

        {onPostUpdate && <button className="postBtn" type="button" onClick={() => onPostUpdate(post._id)}>Edit post</button>}
        {onPostDeleted && <button className="postBtn" type="button" onClick={handleDelete}>Delete</button>}
        {likeEnabled === true
          && (
          <div className="user-info">
            {(likeList).includes(username) ? (
              <UnlikePost
                post={post}
                username={username}
                handleLike={handleLike}
                handleLikeCount={handleLikeCountMinus}
              />
            ) : (
              <LikePost
                post={post}
                username={username}
                handleLike={handleLike}
                handleLikeCount={handleLikeCountAdd}
              />
            )}
          </div>
          )}
        {commentEnabled === true
        && <CommentPost post={post} username={username} handleComment={handleComment} />}
        <div className="line" />
      </div>
    );
  }
  // if no media url provided
  return (
    <div className="post">
      <Hide
        postId={post._id}
        username={username}
      />
      <h3>
        Author:
        {' '}
        {post.createBy}
      </h3>
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      {likeList.includes(username) ? (
        <p className="likecount">{`Liked by you and ${likeCount - 1} other users`}</p>
      ) : (
        <p className="likecount">{`Liked by ${likeCount} other users`}</p>
      )}

      <ShowComments
        postId={post._id}
        comments={commentList}
        username={username}
        handleComment={handleComment}
      />

      {onPostUpdate && <button className="postBtn" type="button" onClick={() => onPostUpdate(post._id)}>Edit post</button>}
      {onPostDeleted && <button className="postBtn" type="button" onClick={handleDelete}>Delete</button>}
      {likeEnabled === true
        && (
        <div className="user-info">
          {(likeList).includes(username) ? (
            <UnlikePost
              post={post}
              username={username}
              handleLike={handleLike}
              handleLikeCount={handleLikeCountMinus}
            />
          ) : (
            <LikePost
              post={post}
              username={username}
              handleLike={handleLike}
              handleLikeCount={handleLikeCountAdd}
            />
          )}
        </div>
        )}
      {commentEnabled === true
      && <CommentPost post={post} username={username} handleComment={handleComment} />}
      <div className="line" />
    </div>
  );
}

Post.propTypes = {
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
    hiddenBy: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onPostDeleted: PropTypes.func,
  onPostUpdate: PropTypes.func,
  likeEnabled: PropTypes.bool,
  commentEnabled: PropTypes.bool,
  username: PropTypes.string.isRequired,
};

Post.defaultProps = {
  onPostDeleted: null,
  onPostUpdate: null,
  likeEnabled: false,
  commentEnabled: false,
};

export default Post;
