import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Post from '../component/Post/Post';
import LikePost from '../component/LikePost/LikePost';
import UnlikePost from '../component/UnlikePost/UnlikePost';
import CommentPost from '../component/CommentPost/CommentPost';
import Hide from '../component/Hide/Hide';
import Unhide from '../component/Unhide/Unhide';
import '@testing-library/jest-dom/extend-expect';

/* eslint-disable */
jest.mock('../component/LikePost/LikePost', () => (props) => <button onClick={props.handleLike}>MockLikePost</button>);
jest.mock('../component/UnlikePost/UnlikePost', () => (props) => <button onClick={props.handleLike}>MockUnlikePost</button>);
jest.mock('../component/CommentPost/CommentPost', () => (props) => <button onClick={props.handleComment}>MockCommentPost</button>);
jest.mock('../component/Hide/Hide', () => ({ handleHide, postId }) => (
  <button onClick={() => handleHide(postId)}>MockHide</button>
));

jest.mock('../component/Unhide/Unhide', () => ({ handleUnhide, postId }) => (
  <button onClick={() => handleUnhide(postId)}>MockUnhide</button>
));

describe('Post Component', () => {
  const mockPost = {
    _id: '1',
    createBy: 'User1',
    title: 'Post Title',
    content: 'Post Content',
    url: 'http://example.com/image.jpg',
    like: ['User2'],
    comment: [],
    likeCount: 1,
  };
  const username = 'User1';

 
  it('renders the Post component', () => {
    render(<Post post={mockPost} username={username} likeEnabled={true} commentEnabled={true} />);
    expect(screen.getByText('Post Title')).toBeInTheDocument();
    expect(screen.getByText('Post Content')).toBeInTheDocument();
  });

  it('handles like button click', () => {
    const handleLike = jest.fn();
    render(<LikePost post={mockPost} username={username} handleLike={handleLike} />);
    fireEvent.click(screen.getByText('MockLikePost'));
    expect(handleLike).toHaveBeenCalled();
  });

  it('handles unlike button click', () => {
    const handleLike = jest.fn();
    render(<UnlikePost post={mockPost} username={username} handleLike={handleLike} />);
    fireEvent.click(screen.getByText('MockUnlikePost'));
    expect(handleLike).toHaveBeenCalled();
  });

  it('handles comment button click', () => {
    const handleComment = jest.fn();
    render(<CommentPost post={mockPost} username={username} handleComment={handleComment} />);
    fireEvent.click(screen.getByText('MockCommentPost'));
    expect(handleComment).toHaveBeenCalled();
  });

  it('handles hide button click', () => {
    const mockHandleHide = jest.fn();
    render(<Hide postId={mockPost._id} username={username} handleHide={mockHandleHide} />);
    const hideButton = screen.getByText('MockHide');
    fireEvent.click(hideButton);
    expect(mockHandleHide).toHaveBeenCalledWith(mockPost._id);
  });

  it('handles unhide button click', () => {
    const mockHandleUnhide = jest.fn();
    render(<Unhide postId={mockPost._id} createBy={mockPost.createBy} username={username} handleUnhide={mockHandleUnhide} />);
    const unhideButton = screen.getByText('MockUnhide');
    fireEvent.click(unhideButton);
    expect(mockHandleUnhide).toHaveBeenCalledWith(mockPost._id);
  });

  it('handles edit post button click', () => {
    const mockOnPostUpdate = jest.fn();
    render(<Post post={mockPost} onPostUpdate={mockOnPostUpdate} username={username} />);
    const editButton = screen.getByText('Edit post');
    fireEvent.click(editButton);
    expect(mockOnPostUpdate).toHaveBeenCalledWith(mockPost._id);
  });

  it('handles delete post button click', () => {
    const mockOnPostDeleted = jest.fn();
    render(<Post post={mockPost} onPostDeleted={mockOnPostDeleted} username={username} />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(mockOnPostDeleted).toHaveBeenCalledWith(mockPost._id);
  });

  it('renders Unhide button if post is hidden for the user', () => {
    const hiddenPost = { ...mockPost, hiddenBy: [username] };
    render(<Post post={hiddenPost} username={username} />);
    expect(screen.getByText('MockUnhide')).toBeInTheDocument();
  });

  it('displays a video for .mp4 URL', () => {
    const videoPost = { ...mockPost, url: 'http://example.com/video.mp4' };
    render(<Post post={videoPost} username={username} />);
    expect(screen.getByTitle(`Video for ${videoPost.title}`)).toBeInTheDocument();
  });

  it('displays an image for non-.mp4 URL', () => {
    render(<Post post={mockPost} username={username} />);
    expect(screen.getByAltText(mockPost.title)).toBeInTheDocument();
  });

  it('shows correct like count text', () => {
    render(<Post post={mockPost} username={username} />);
    expect(screen.getByText(`Liked by ${mockPost.likeCount} other users`)).toBeInTheDocument();
  });

  it('displays content correctly when no media URL is provided', () => {
    const noMediaPost = { ...mockPost, url: null };
    render(<Post post={noMediaPost} username={username} />);
    expect(screen.getByText(noMediaPost.content)).toBeInTheDocument();
  });
  
});
