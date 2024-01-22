import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createPost } from '../../api/postsAPI';
import UploadMedia from '../UploadMedia/UploadMedia';
import './Newpost.css';

function NewPost({ user, handlePostAdded, handlePostCancelled }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCancel = () => {
    if (handlePostCancelled) {
      handlePostCancelled();
    }
  };

  // event handler for file selection
  const handleSetUrl = (newUrl) => {
    setUrl(newUrl);
  };

  const handlePostSubmit = async () => {
    if (!title.trim()) {
      setErrorMessage('Title cannot be empty!');
      return;
    }

    await createPost({
      title,
      content,
      createBy: user.username,
      url,
    });
    handlePostAdded();
  };

  function renderMedia() {
    const isVideo = url && /\.mp4$/.test(url);
    if (!url) {
      return <p className="no-url-message">No previous URL provided</p>;
    }

    if (isVideo) {
      return (
        <video
          title={`Video for ${title}`}
          width="560"
          height="315"
          controls
          src={url}
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return <img src={url} alt={title} width="560" height="315" />;
  }

  return (
    <div className="new-post-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <h1>New Post</h1>
      <input className="NewPostInput" type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <textarea className="NewPostText" placeholder="Content" onChange={(e) => setContent(e.target.value)} />

      {renderMedia()}
      <UploadMedia handleSetUrl={handleSetUrl} />

      <button className="NewPostButton" type="button" onClick={handlePostSubmit}>Add Post</button>
      <button className="NewPostButton" type="button" onClick={handleCancel}>Cancel</button>
    </div>
  );
}

NewPost.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    major: PropTypes.string.isRequired,
    followers: PropTypes.arrayOf(PropTypes.string).isRequired,
    following: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handlePostAdded: PropTypes.func.isRequired,
  handlePostCancelled: PropTypes.func.isRequired,
};

export default NewPost;
