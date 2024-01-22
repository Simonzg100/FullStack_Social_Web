import React from 'react';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import NewPost from '../component/Newpost/Newpost';
import { createPost } from '../api/postsAPI';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
jest.mock('../api/postsAPI');

jest.mock('../component/UploadMedia/UploadMedia', () => {
  return ({ handleSetUrl }) => {
    const setUrlToVideo = () => handleSetUrl('http://example.com/video.mp4');
    const setUrlToImage = () => handleSetUrl('http://example.com/image.jpg');

    return (
      <div>
        <button onClick={setUrlToVideo}>Set Video URL</button>
        <button onClick={setUrlToImage}>Set Image URL</button>
      </div>
    );
  };
});

describe('NewPost Component', () => {
  const mockHandlePostAdded = jest.fn();
  const mockHandlePostCancelled = jest.fn();
  const mockUser = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    major: 'Computer Science',
    followers: [],
    following: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new post with the expected URL format', async () => {
    createPost.mockResolvedValue({ success: true });

    render(
      <NewPost
        user={mockUser}
        handlePostAdded={mockHandlePostAdded}
        handlePostCancelled={mockHandlePostCancelled}
      />
    );

    const titleInput = screen.getByPlaceholderText('Title');
    const contentInput = screen.getByPlaceholderText('Content');
    fireEvent.change(titleInput, { target: { value: 'Test Post' } });
    fireEvent.change(contentInput, { target: { value: 'This is a test post content.' } });

    const addPostButton = screen.getByText('Add Post');
    fireEvent.click(addPostButton);

    await waitFor(() =>
      expect(createPost).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Post',
        content: 'This is a test post content.',
        createBy: mockUser.username,
      }))
    );

  });

  it('displays an error message when the title is empty', async () => {
    render(
      <NewPost
        user={mockUser}
        handlePostAdded={mockHandlePostAdded}
        handlePostCancelled={mockHandlePostCancelled}
      />
    );
  
    const addPostButton = screen.getByText('Add Post');
    fireEvent.click(addPostButton);
  
    expect(await screen.findByText('Title cannot be empty!')).toBeInTheDocument();
  });


  it('renders a video when a .mp4 URL is provided', async () => {
    render(
      <NewPost
        user={mockUser}
        handlePostAdded={mockHandlePostAdded}
        handlePostCancelled={mockHandlePostCancelled}
      />
    );
  
    fireEvent.click(screen.getByText('Set Video URL'));
  
    await waitFor(() => {
      const videoElement = screen.getByTitle(/Video for/); // Using a regex to match partially
      expect(videoElement).toBeInTheDocument();
      expect(videoElement).toHaveAttribute('src', 'http://example.com/video.mp4');
    });
  });
  

it('renders an image when a non-.mp4 URL is provided', async () => {
  render(
    <NewPost
      user={mockUser}
      handlePostAdded={mockHandlePostAdded}
      handlePostCancelled={mockHandlePostCancelled}
    />
  );

  fireEvent.click(screen.getByText('Set Image URL'));

  await waitFor(() => {
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'http://example.com/image.jpg');
  });
});

  
});



