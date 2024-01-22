import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import ActivityFeed from '../component/ActivityFeed/ActivityFeed';
import * as postsAPI from '../api/postsAPI';
import '@testing-library/jest-dom/extend-expect';

/* eslint-disable */
jest.mock('../api/postsAPI');

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    this.callback([{ isIntersecting: true }]);
  }

  unobserve() {
    // Optional cleanup can go here
  }

  disconnect() {
    // Optional cleanup can go here
  }
};

const mockUpdateUser = jest.fn();

describe('ActivityFeed Component', () => {
  const mockUser = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password',
    major: 'Engineering',
    followers: [],
    following: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.removeItem = jest.fn();
    postsAPI.getUserPosts.mockResolvedValue([]);
    postsAPI.getAllFollowingPost.mockResolvedValue([]);
  });

  it('renders the activity feed and fetches posts', async () => {
    const adjustedMockUser = { ...mockUser, following: ['someUserId'] };

    render(<ActivityFeed user={adjustedMockUser} updateUser={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Group Social')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(postsAPI.getAllFollowingPost).toHaveBeenCalledWith(adjustedMockUser.following);
    });
  });

  it('displays the Profile component when clicking the profile button', async () => {
    render(<ActivityFeed user={mockUser} updateUser={jest.fn()} />);
    fireEvent.click(screen.getByText('Profile'));

    await waitFor(() => {
      expect(screen.getByText('Return to Activities')).toBeInTheDocument();
    });
  });

  it('displays the NewPost component when clicking the post button', async () => {
    render(<ActivityFeed user={mockUser} updateUser={jest.fn()} />);
    fireEvent.click(screen.getByText('Post Something'));

    await waitFor(() => {
      expect(screen.getByText('New Post')).toBeInTheDocument();
    });
  });

  it('handles logout correctly', () => {
    render(<ActivityFeed user={mockUser} updateUser={mockUpdateUser} />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
  
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('app-token');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('app-user');
    expect(mockUpdateUser).toHaveBeenCalledWith(null);
  });

  it('hides the Profile component when handleProfilettoFalse is called', async () => {
    render(<ActivityFeed user={mockUser} updateUser={jest.fn()} />);
    fireEvent.click(screen.getByText('Profile')); // Assuming this sets profileShow to true
  
    await waitFor(() => {
      expect(screen.getByText('Return to Activities')).toBeInTheDocument(); // Check if Profile is displayed
    });
  
    // Simulate handleProfilettoFalse function call
    fireEvent.click(screen.getByText('Return to Activities')); // Assuming this button calls handleProfilettoFalse
  
    await waitFor(() => {
      expect(screen.queryByText('Return to Activities')).not.toBeInTheDocument(); // Check if Profile is no longer displayed
    });
  });
  
  it('hides the NewPost component when handlePostCancelled is called', async () => {
    render(<ActivityFeed user={mockUser} updateUser={jest.fn()} />);
    fireEvent.click(screen.getByText('Post Something')); // Assuming this sets postShow to true
  
    await waitFor(() => {
      expect(screen.getByText('New Post')).toBeInTheDocument(); // Check if NewPost is displayed
    });
  
    // Simulate handlePostCancelled function call (e.g., clicking a 'Cancel' button inside NewPost component)
    fireEvent.click(screen.getByText('Cancel')); // Replace 'Cancel' with the actual text of the cancel button in your component
  
    await waitFor(() => {
      expect(screen.queryByText('New Post')).not.toBeInTheDocument(); // Check if NewPost is no longer displayed
    });
  });
  it('renders the NewPost component when postShow is true', async () => {
    render(<ActivityFeed user={mockUser} updateUser={jest.fn()} />);
  
    // Simulate the user action that sets postShow to true
    // Replace 'Post Something' with the actual text or button in your component that triggers this state change
    fireEvent.click(screen.getByText('Post Something'));
  
    // Check if NewPost component is rendered
    // Replace 'New Post' with a text or element that uniquely identifies the NewPost component
    const newPostElement = await screen.findByText('New Post'); 
    expect(newPostElement).toBeInTheDocument();
  });
});




