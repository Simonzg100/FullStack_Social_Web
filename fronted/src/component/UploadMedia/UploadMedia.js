import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadFile } from '../../api/postsAPI';

function UploadMedia({ handleSetUrl }) {
  const [files, setFiles] = useState();
  const [message, setMessage] = useState('');

  const updateFile = (evt) => {
    const file = evt.target.files[0]; // Get the first file

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    let maxSize;
    if (file.type.startsWith('image/')) {
      maxSize = 50 * 1024 * 1024; // 50 MB for images
    } else if (file.type.startsWith('video/')) {
      maxSize = 500 * 1024 * 1024; // 500 MB for videos
    } else {
      setMessage('Unsupported file type. Only images and videos are allowed.');
      return;
    }

    if (file.size > maxSize) {
      setMessage(`File size should not exceed ${maxSize / 1024 / 1024} MB`);
      return;
    }

    setFiles([...evt.target.files]); // Set the selected file
    setMessage('');
  };

  const handleUpload = async () => {
    if (!files) {
      setMessage('Please select a file');
      return;
    }
    setMessage('Uploading...');
    const formData = new FormData();

    for (let i = 0; i < files.length; i += 1) {
      formData.append(`File_${i}`, files[i]);
    }
    console.log('files', files[0]);
    console.log('formData', formData);

    const url = await uploadFile(formData);
    if (!url.error) {
      handleSetUrl(url);
    }
    setMessage('Upload complete');
  };

  return (
    <div className="upload">
      <div>
        File:
        <input
          id="upld"
          type="file"
          name="someFiles"
          onChange={(e) => updateFile(e)}
        />
      </div>
      {message && <div className="message">{message}</div>}
      <button className="uploadButton" type="submit" onClick={() => handleUpload()}>
        Upload New Media
      </button>
    </div>
  );
}

UploadMedia.propTypes = {
  handleSetUrl: PropTypes.func.isRequired,
};

export default UploadMedia;
