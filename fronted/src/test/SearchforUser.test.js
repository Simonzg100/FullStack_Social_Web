import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import SearchforUser from '../component/SearchforUser/SearchforUser';
import * as followAPI from '../api/followAPI';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
// Mock the followAPI functions
jest.mock('../api/followAPI');

describe('SearchforUser Component', () => {
  const user = {
    username: 'testuser',
    // Add other user properties as needed for your test cases
  };

  it('should render the initial search form', () => {
    render(
      <SearchforUser
        user={user}
        setreturnFromSearch={jest.fn()}
        setFollowingList={jest.fn()}
        followingList={[]}
        updateUser={jest.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for users...');
    const searchButton = screen.getByText('Search');

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it('should display a match and follow button when a user is found', async () => {
    const searchResult = {
      username: 'founduser',
      // Add other user properties as needed for your test cases
    };

    // Mock the searchUsersByUsername function to return a result
    followAPI.searchUsersByUsername.mockResolvedValue({ user: searchResult });

    render(
      <SearchforUser
        user={user}
        setreturnFromSearch={jest.fn()}
        setFollowingList={jest.fn()}
        followingList={[]}
        updateUser={jest.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for users...');
    const searchButton = screen.getByText('Search');

    fireEvent.change(searchInput, { target: { value: 'founduser' } });
    fireEvent.click(searchButton);

    // Wait for the search to complete
    await waitFor(() => {
      expect(screen.getByText('Search Result')).toBeInTheDocument();
      expect(screen.getByText('founduser')).toBeInTheDocument();
      expect(screen.getByText('Follow')).toBeInTheDocument();
    });
  });

  it('should display a non-match message when no user is found', async () => {
    // Mock the searchUsersByUsername function to return no result
    followAPI.searchUsersByUsername.mockResolvedValue({ user: null });

    render(
      <SearchforUser
        user={user}
        setreturnFromSearch={jest.fn()}
        setFollowingList={jest.fn()}
        followingList={[]}
        updateUser={jest.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for users...');
    const searchButton = screen.getByText('Search');

    fireEvent.change(searchInput, { target: { value: 'nonexistinguser' } });
    fireEvent.click(searchButton);

    // Wait for the search to complete
    await waitFor(() => {
      // Use a custom text matcher function to locate the element
      const nonMatchMessage = screen.getByText((content, element) => {
        return content.includes('No user found with the username:');
      });
      expect(nonMatchMessage).toBeInTheDocument();
    });
  });

  it('should reset to initial search state when Search again is clicked', async () => {
    // Mock the searchUsersByUsername function to return a result
    followAPI.searchUsersByUsername.mockResolvedValue({ user: { username: 'founduser' } });
  
    render(
      <SearchforUser
        user={user}
        setreturnFromSearch={jest.fn()}
        setFollowingList={jest.fn()}
        followingList={[]}
        updateUser={jest.fn()}
      />
    );
  
    const searchInput = screen.getByPlaceholderText('Search for users...');
    fireEvent.change(searchInput, { target: { value: 'founduser' } });
    fireEvent.click(screen.getByText('Search'));
  
    // Wait for the search result to appear
    await waitFor(() => {
      expect(screen.getByText('Search Result')).toBeInTheDocument();
    });
  
    // Click on 'Search again'
    fireEvent.click(screen.getByText('Search again'));
  
    // Check if the component has returned to its initial state
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search for users...')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.queryByText('Search Result')).not.toBeInTheDocument();
    });
  });

  it('should display a matchedSelf message when the user searches their own username', async () => {
    followAPI.searchUsersByUsername.mockResolvedValue({ user: { username: user.username } });
  
    render(
      <SearchforUser
        user={user}
        setreturnFromSearch={jest.fn()}
        setFollowingList={jest.fn()}
        followingList={[]}
        updateUser={jest.fn()}
      />
    );
  
    const searchInput = screen.getByPlaceholderText('Search for users...');
    fireEvent.change(searchInput, { target: { value: user.username } });
    fireEvent.click(screen.getByText('Search'));
  
    // Wait for the search to complete and check for the matchedSelf message
    await waitFor(() => {
      expect(screen.getByText('I see you try to be tricky')).toBeInTheDocument();
    });
  });

  it('should call setreturnFromSearch with false when Return is clicked', () => {
    const mockSetreturnFromSearch = jest.fn();
  
    render(
      <SearchforUser
        user={user}
        setreturnFromSearch={mockSetreturnFromSearch}
        setFollowingList={jest.fn()}
        followingList={[]}
        updateUser={jest.fn()}
      />
    );
  
    const returnButton = screen.getByText('Return');
    fireEvent.click(returnButton);
  
    expect(mockSetreturnFromSearch).toHaveBeenCalledWith(false);
  });
});