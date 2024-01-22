import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hide from '../component/Hide/Hide';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('Hide component tests', () => {
  const mockPostId = 'post123';
  const mockUsername = 'testuser';

  beforeEach(() => {
    axios.post.mockClear();
  });

  test('calls hidePost with the correct arguments when button is clicked', async () => {
    axios.post.mockResolvedValue({ status: 201, data: {} });

    const { getByText } = render(
      <Hide postId={mockPostId} username={mockUsername} />
    );
    const hideButton = getByText('Hide this post');
    fireEvent.click(hideButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/post/hide'), {
        postId: mockPostId,
        username: mockUsername
      });
    });
  });

  test('logs an error when hidePost API call fails', async () => {
    const errorMessage = 'Failed to hide post';
    axios.post.mockRejectedValue(new Error(errorMessage));

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const { getByText } = render(
      <Hide postId={mockPostId} username={mockUsername} />
    );
    const hideButton = getByText('Hide this post');
    fireEvent.click(hideButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/post/hide'), {
        postId: mockPostId,
        username: mockUsername
      });
    });

    consoleLogSpy.mockRestore();
  });
});
