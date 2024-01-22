import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UploadMedia from '../UploadMedia/UploadMedia';
import { updatePost } from '../../api/postsAPI';

function PostUpdate({ post, onPostUpdate }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [url, setUrl] = useState(post.url);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCancel = () => {
    onPostUpdate(null);
  };

  const handleSetUrl = (newurl) => {
    setUrl(newurl);
  };

  const handlePostSubmit = async () => {
    if (!title.trim()) {
      setErrorMessage('Title cannot be empty!');
      return;
    }
    if (title === post.title && content === post.content && url === post.url) {
      setErrorMessage('make a change!');
      return;
    }
    await updatePost(post._id, title, content, url);
    onPostUpdate(null);
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
    <div className="edit-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <input className="NewPostInput" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="NewPostText" value={content} onChange={(e) => setContent(e.target.value)} />
      {renderMedia()}
      <UploadMedia handleSetUrl={handleSetUrl} />
      <button type="button" className="NewPostButton" onClick={handlePostSubmit}>Confirm Edit</button>
      <button type="button" className="NewPostButton" onClick={handleCancel}>Discard</button>
    </div>
  );
}

PostUpdate.propTypes = {
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
  onPostUpdate: PropTypes.func.isRequired,
};

export default PostUpdate;
