import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LikePost from '../component/LikePost/LikePost';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('LikePost Component', () => {
  const mockPostId = '123';
  const mockUsername = 'testuser';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should like a post when the "Like" button is clicked', async () => {
    axios.put.mockResolvedValue({ data: { success: true } });

    const mockHandleLike = jest.fn();
    const mockHandleLikeCount = jest.fn();

    render(
      <LikePost
        post={{ _id: mockPostId, like: [] }}
        username={mockUsername}
        handleLike={mockHandleLike}
        handleLikeCount={mockHandleLikeCount}
      />
    );

    const likeButton = screen.getByText('Like');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/post/like'), {
        postId: mockPostId,
        username: mockUsername,
      });
    });
    await waitFor(() => {
      expect(mockHandleLike).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockHandleLikeCount).toHaveBeenCalled();
    });
  });
});
