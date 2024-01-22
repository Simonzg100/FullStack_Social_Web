import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Unfollow from '../component/Unfollow/Unfollow';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
// Mock the followAPI module
jest.mock('../api/followAPI', () => ({
  unfollowPerson: jest.fn(() => Promise.resolve({ message: 'Unfollow successful!' }))
}));

describe('Unfollow Component', () => {
  // Mock user and update functions
  const mockUser = {
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password',
    major: 'Computer Science',
    followers: ['jane_doe'],
    following: ['jane_doe'],
  };

  const mockUnfollowID = 'jane_doe';
  const mockSetFollowingList = jest.fn();
  const mockUpdateUser = jest.fn();

  // Test if the component renders the button correctly
  it('renders the unfollow button', () => {
    render(
      <Unfollow
        user={mockUser}
        unfollowID={mockUnfollowID}
        setFollowingList={mockSetFollowingList}
        updateUser={mockUpdateUser}
      />
    );
    expect(screen.getByRole('button', { name: /unfollow/i })).toBeInTheDocument();
  });

  // Test if clicking the button calls the handleUnfollow function with the correct parameter
  it('calls handleUnfollow with the correct parameter when clicked', async () => {
    const { unfollowPerson } = require('../api/followAPI');
    render(
      <Unfollow
        user={mockUser}
        unfollowID={mockUnfollowID}
        setFollowingList={mockSetFollowingList}
        updateUser={mockUpdateUser}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /unfollow/i }));

    expect(unfollowPerson).toHaveBeenCalledWith(mockUser.username, mockUnfollowID);

    // Since handleUnfollow is an async function, we wait for the next tick
    await new Promise(process.nextTick);

    // Now we check if updateUser and setFollowingList were called with the correct data
    expect(mockUpdateUser).toHaveBeenCalled();
    expect(mockSetFollowingList).toHaveBeenCalledWith(
      mockUser.following.filter(id => id !== mockUnfollowID)
    );
  });

  // Add more tests as needed...
});