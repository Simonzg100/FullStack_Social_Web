import React from 'react';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Follow from '../component/Follow/Follow';
import { followPerson } from '../api/followAPI'; // Make sure this path is correct
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
// Mock the followAPI module
jest.mock('../api/followAPI', () => ({
  followPerson: jest.fn(() => Promise.resolve({ message: 'Follow successful!' }))
}));

describe('Follow Component', () => {
  const mockUser = {
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'secure123',
    major: 'Computer Science',
    followers: [],
    following: [],
  };
  const mockFollowID = 'jane_smith';
  const mockSetFollowingList = jest.fn();
  const mockFollowingList = [];
  const mockUpdateUser = jest.fn();

  it('renders the follow button and calls handleFollow with the correct parameter when clicked', async () => {
    render(
      <Follow
        user={mockUser}
        followID={mockFollowID}
        setFollowingList={mockSetFollowingList}
        followingList={mockUser.following}
        updateUser={mockUpdateUser}
      />
    );

    // Verify that the Follow button is rendered
    expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();

    // Simulate a click on the Follow button
    fireEvent.click(screen.getByRole('button', { name: /follow/i }));

    // Wait for the mock function calls to happen after the button click
    await waitFor(() => {
      // Check if followPerson API was called with the correct parameters
      expect(followPerson).toHaveBeenCalledWith(mockUser.username, mockFollowID);

      // Check if updateUser and setFollowingList were called with the updated user object
      expect(mockUpdateUser).toHaveBeenCalled();
      expect(mockSetFollowingList).toHaveBeenCalledWith([mockFollowID]);
    });
  });


  it('disables the follow button if the user is already followed', () => {
    // Re-render the component with a followingList that includes the followID
    render(
      <Follow
        user={mockUser}
        followID={mockFollowID}
        setFollowingList={mockSetFollowingList}
        followingList={[mockFollowID]}
        updateUser={mockUpdateUser}
      />
    );

    // The button should be disabled if the user is already followed
    expect(screen.getByRole('button', { name: /already followed/i })).toBeDisabled();
  });
});
