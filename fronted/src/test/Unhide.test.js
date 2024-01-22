import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Unhide from '../component/Unhide/Unhide';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('Unhide component tests', () => {
  const mockPostId = '12345';
  const mockCreatedBy = 'user123';
  const mockUsername = 'currentuser';

  beforeEach(() => {
    axios.post.mockClear();
  });

  it('calls unhidePost with the correct arguments when button is clicked', async () => {
    axios.post.mockResolvedValue({ status: 201, data: {} });

    const { getByText } = render(
      <Unhide postId={mockPostId} createBy={mockCreatedBy} username={mockUsername} />
    );

    const unhideButton = getByText(`Unhide ${mockCreatedBy}'s post`);
    fireEvent.click(unhideButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/post/unhide'), {
        postId: mockPostId,
        username: mockUsername,
      });
    });
  });
});
