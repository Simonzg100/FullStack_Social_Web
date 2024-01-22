import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import ShowComments from '../component/ShowComments/ShowComments';
import * as postsAPI from '../api/postsAPI';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
// Mock the postsAPI module
jest.mock('../api/postsAPI');

describe('ShowComments Component', () => {
  const comments = [
    { _id: 'comment-1', commentBy: 'user1', comment: 'Comment 1' },
    { _id: 'comment-2', commentBy: 'user2', comment: 'Comment 2' },
  ];

  const postId = 'post-id-123';
  const username = 'user1';
  const handleCommentMock = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    handleCommentMock.mockClear();
    postsAPI.deleteCommentPost.mockClear();
  });

  it('should render comments with delete button for the current user', async () => {
    // Mock the deleteCommentPost function
    postsAPI.deleteCommentPost.mockResolvedValue({ commentDeleted: 'comment-1' });

    render(
      <ShowComments
        postId={postId}
        comments={comments}
        username={username}
        handleComment={handleCommentMock}
      />
    );

    // Simulate clicking the delete button for the first comment
    const deleteButtons = screen.getAllByText('delete!');
    fireEvent.click(deleteButtons[0]);

    // Wait for handleCommentMock to be called
    await waitFor(() => {
      expect(handleCommentMock).toHaveBeenCalledWith('comment-1');
    });
  });

  it('should render comments without delete button for other users', () => {
    render(
      <ShowComments
        postId={postId}
        comments={comments}
        username="user3" // Replace with a different username
        handleComment={handleCommentMock}
      />
    );

    // Check if comments are rendered
    expect(screen.getByText('user1: Comment 1')).toBeInTheDocument();
    expect(screen.getByText('user2: Comment 2')).toBeInTheDocument();

    // Check that no delete button is rendered
    const deleteButtons = screen.queryAllByText('delete!');
    expect(deleteButtons).toHaveLength(0); // No delete buttons should be present
  });
});

