import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import PostUpdate from '../component/PostUpdate/PostUpdate';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
describe('PostUpdate Component', () => {
  const post = {
    _id: 'post-id-123',
    createBy: 'user123',
    title: 'Original Title',
    content: 'Original Content',
    url: 'https://example.com/original-url.jpg',
    like: [],
    comment: [],
    likeCount: 0,
  };
  const onPostUpdateMock = jest.fn();

  const mockPost = {
    _id: 'mockId',
    createBy: 'mockUser',
    title: 'Original Title',
    content: 'Original Content',
    url: 'https://example.com/original-url.jpg',
    like: [],
    comment: [],
    likeCount: 0,
  };

  test('should render with the original post data', () => {
    render(<PostUpdate post={post} onPostUpdate={jest.fn()} />);

    // Check if the original post data is displayed
    expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument();
    expect(screen.getByText('Original Content')).toBeInTheDocument();
    expect(screen.getByAltText('Original Title')).toBeInTheDocument();
  });

  test('should update the title, content, and URL on input change', () => {
    render(<PostUpdate post={mockPost} onPostUpdate={onPostUpdateMock} />);
  
    const titleInput = screen.getByDisplayValue('Original Title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
  
    const contentInput = screen.getByDisplayValue('Original Content');
    fireEvent.change(contentInput, { target: { value: 'New Content' } });
  
    expect(titleInput).toHaveValue('New Title');
    expect(contentInput).toHaveValue('New Content');
  });
  
  
  
  test('should call the onPostUpdate function when confirming edit', () => {
    render(<PostUpdate post={mockPost} onPostUpdate={onPostUpdateMock} />);
  
    fireEvent.change(screen.getByDisplayValue('Original Title'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByDisplayValue('Original Content'), { target: { value: 'New Content' } });
  
    const confirmEditButton = screen.getByText('Confirm Edit');
    fireEvent.click(confirmEditButton);
  
  });
  

  test('should display an error message when title is empty', async () => {
    render(<PostUpdate post={post} onPostUpdate={jest.fn()} />);

    const titleInput = screen.getByDisplayValue('Original Title');
    fireEvent.change(titleInput, { target: { value: '' } });

    const confirmEditButton = screen.getByText('Confirm Edit');
    fireEvent.click(confirmEditButton);

    expect(screen.getByText('Title cannot be empty!')).toBeInTheDocument();
  });

  test('should display an error message if no changes are made', () => {
    render(<PostUpdate post={mockPost} onPostUpdate={onPostUpdateMock} />);
  
    const confirmEditButton = screen.getByText('Confirm Edit');
    fireEvent.click(confirmEditButton);
  
    expect(screen.getByText('make a change!')).toBeInTheDocument();
  });

  test('should display a message when no URL is provided', () => {
    const mockPostWithoutUrl = {
      ...mockPost,
      url: '' 
    };
  
    render(<PostUpdate post={mockPostWithoutUrl} onPostUpdate={onPostUpdateMock} />);
    expect(screen.getByText('No previous URL provided')).toBeInTheDocument();
  });

  test('should call onPostUpdate with null when cancel is clicked', () => {
    render(<PostUpdate post={mockPost} onPostUpdate={onPostUpdateMock} />);
    
    const cancelButton = screen.getByText('Discard');
    fireEvent.click(cancelButton);
    
    expect(onPostUpdateMock).toHaveBeenCalledWith(null);
  });
  
});