import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import UserListPage from '../component/UserListPage/UserListPage'; // Import your component
import * as followAPI from '../api/followAPI';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
// Mock the followAPI functions
jest.mock('../api/followAPI');

describe('UserListPage Component', () => {
  const user = {
    username: 'testuser',
    firstName: 'Test', 
    lastName: 'User',
    email: 'testemail@gmail.com',
    password: '123',
    major: 'cis',
    followers: ['user3', 'user4'],
    following: ['user1', 'user2'],
    // Your user object here
  };

  const user1 = {
    username: 'user1',
    // Add other properties as needed
  };

  const user2 = {
    username: 'user2',
    // Add other properties as needed
  };

  const user3 = {
    username: 'user3',
    // Add other properties as needed
  };

  const user4 = {
    username: 'user4',
    // Add other properties as needed
  };

  beforeEach(() => {
    // Mock the functions getUserFollowing and getUserFollower
    followAPI.getUserFollowing.mockResolvedValue({
      followingLists: ['user1', 'user2'],
    });
    followAPI.getUserFollower.mockResolvedValue({
      followerLists: ['user3', 'user4'],
    });
  });

  it('should render following and followers lists', async () => {
    render(
      <UserListPage
        user={user}
        handleReturnFromManage={jest.fn()}
        updateUser={jest.fn()}
      />
    );

    // Wait for the lists to load
    await waitFor(() => {
      expect(screen.getByText('Following List')).toBeInTheDocument();
      expect(screen.getByText('Followers')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('user3')).toBeInTheDocument();
      expect(screen.getByText('user4')).toBeInTheDocument();
    });
  });

  it('should handle return from search', () => {
    const handleReturnFromManage = jest.fn();

    render(
      <UserListPage
        user={user}
        handleReturnFromManage={handleReturnFromManage}
        updateUser={jest.fn()}
      />
    );

    const returnButton = screen.getByText('Return to profile');
    fireEvent.click(returnButton);

    expect(handleReturnFromManage).toHaveBeenCalled();
  });

  it('should handle search for a user', async () => {
    render(
      <UserListPage
        user={user}
        handleReturnFromManage={jest.fn()}
        updateUser={jest.fn()}
      />
    );
  
    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Following List')).toBeInTheDocument();
      expect(screen.getByText('Followers')).toBeInTheDocument();
    });
  
    // Check if the search button is present
    const searchButton = screen.getByText('Search for a user');
    expect(searchButton).toBeInTheDocument();
  });
  
  it('should display the SearchforUser component when the search button is clicked', async () => {
  render(
    <UserListPage
      user={user}
      handleReturnFromManage={jest.fn()}
      updateUser={jest.fn()}
    />
  );

  // Simulate clicking the 'Search for a user' button
  const searchButton = screen.getByText('Search for a user');
  fireEvent.click(searchButton);

  // Wait for SearchforUser to render
  const searchInput = await screen.findByPlaceholderText('Search for users...');
  expect(searchInput).toBeInTheDocument();
});

});
