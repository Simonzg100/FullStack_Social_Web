import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnlikePost from '../component/UnlikePost/UnlikePost';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('UnlikePost Component', () => {
  const mockPostId = '123';
  const mockUsername = 'testuser';
  const mockHandleLike = jest.fn();
  const mockHandleLikeCount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should unlike a post when the "Unlike" button is clicked', async () => {
    axios.put.mockResolvedValue({ data: { success: true } });

    render(
      <UnlikePost
        post={{ _id: mockPostId, like: [mockUsername] }}
        username={mockUsername}
        handleLike={mockHandleLike}
        handleLikeCount={mockHandleLikeCount}
      />
    );

    const unlikeButton = screen.getByText('unlike');
    fireEvent.click(unlikeButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/post/unlike'), {
        postId: mockPostId,
        username: mockUsername,
      });
    });

    await waitFor(() => {
      expect(mockHandleLike).toHaveBeenCalled();
      expect(mockHandleLikeCount).toHaveBeenCalled();
    });
  });
});
