import React from 'react';
import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';
import CommentPost from '../component/CommentPost/CommentPost';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('CommentPost Component', () => {
  const mockPost = {
    _id: 'post-id-123',
    createBy: 'user123',
    title: 'Example Title',
    content: 'Example Content',
    url: 'https://example.com/original-url.jpg',
    like: [],
    comment: [],
    likeCount: 0,
  };
  const mockUsername = 'testuser';
  const mockHandleComment = jest.fn();

  it('should display textarea when "write a comment" button is clicked', () => {
    render(<CommentPost post={mockPost} username={mockUsername} handleComment={mockHandleComment} />);

    act(() => {
      fireEvent.click(screen.getByText('write a comment'));
    });

    expect(screen.getByPlaceholderText('Content')).toBeInTheDocument();
  });

  it('should display an error message when trying to submit an empty comment', async () => {
    render(<CommentPost post={mockPost} username={mockUsername} handleComment={mockHandleComment} />);

    act(() => {
      fireEvent.click(screen.getByText('write a comment'));
    });

    act(() => {
      fireEvent.click(screen.getByText('submit'));
    });

    await waitFor(() => {
      expect(screen.getByText('Please enter a comment')).toBeInTheDocument();
    });
  });

  it('should call handleComment when a comment is submitted', async () => {
    axios.post.mockResolvedValue({ data: { postcommented: 'mock-comment'} });

    render(<CommentPost post={mockPost} username={mockUsername} handleComment={mockHandleComment} />);

    act(() => {
      fireEvent.click(screen.getByText('write a comment'));
    });

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'Test comment'} });
    });

    act(() => {
      fireEvent.click(screen.getByText('submit'));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  // New test case for handleCancel function
  it('should reset state when cancel button is clicked', () => {
    render(<CommentPost post={mockPost} username={mockUsername} handleComment={mockHandleComment} />);

    act(() => {
      fireEvent.click(screen.getByText('write a comment'));
    });

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'Test comment' } });
    });

    act(() => {
      fireEvent.click(screen.getByText('cancel'));
    });

    expect(screen.queryByPlaceholderText('Content')).not.toBeInTheDocument();
    expect(screen.getByText('write a comment')).toBeInTheDocument();
  });
});

