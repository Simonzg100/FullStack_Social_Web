import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeletePost from '../component/DeletePost/DeletePost';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('DeletePost Component', () => {
  const mockPostId = 'mock-post-id';
  const mockHandlePostAdded = jest.fn();
  const mockHandlePostDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display confirmation message', () => {
    render(
      <DeletePost
        postId={mockPostId}
        handlePostAdded={mockHandlePostAdded}
        handlePostDeleted={mockHandlePostDeleted}
      />
    );

    expect(screen.getByText('Confirm you want to delete this post permanently?')).toBeInTheDocument();
  });

  test('should call deletePost API function on confirm', async () => {
    axios.delete.mockResolvedValue({ data: {} });

    render(
      <DeletePost
        postId={mockPostId}
        handlePostAdded={mockHandlePostAdded}
        handlePostDeleted={mockHandlePostDeleted}
      />
    );

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/post/deletePost'), {
        params: { postId: mockPostId },
      });
    });
  });

  test('should call handlePostDeleted with null on cancel', () => {
    render(
      <DeletePost
        postId={mockPostId}
        handlePostAdded={mockHandlePostAdded}
        handlePostDeleted={mockHandlePostDeleted}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockHandlePostDeleted).toHaveBeenCalledWith(null);
  });
});
