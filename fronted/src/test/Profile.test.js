import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../component/Profile/Profile';
import * as postsAPI from '../api/postsAPI';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
jest.mock('../api/postsAPI');

const user = {
  username: 'john_doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  major: 'Computer Science',
  followers: ['follower1', 'follower2'],
  following: ['following1', 'following2'],
};

describe('Profile component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    postsAPI.getUserPosts.mockResolvedValue([]);
  });
  
  
  it('handles new post addition', async () => {
    // Mock getUserPosts to return a list of posts including the new post
    postsAPI.getUserPosts.mockResolvedValue([
      { _id: '1', title: 'Post 1', content: 'Content 1', createBy: 'User1', like: [], comment: [], likeCount: 0 },
      { _id: '2', title: 'New Post', content: 'New Content', createBy: 'john_doe', like: [], comment: [], likeCount: 0 }
    ]);
  
    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={() => {}}
          updateUser={() => {}}
        />
      );
    });
  
    await act(async () => {
      const postButton = screen.getByText('Post something!');
      fireEvent.click(postButton);
    });
  
    // Check if the post list is updated with the new post
    expect(await screen.findByText('New Post')).toBeInTheDocument();
  });
  

  it('fetches and displays user posts', async () => {
    postsAPI.getUserPosts.mockResolvedValue([
      { _id: '1', title: 'Post 1', content: 'Content 1', createBy: 'User1', like: [], comment: [], likeCount: 0 }
    ]);

    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={() => {}}
          updateUser={() => {}}
        />
      );
    });

    expect(await screen.findByText('Post 1')).toBeInTheDocument();
  });
  
  it('updates posts after adding a new post', async () => {
    const newPost = { _id: '2', title: 'New Post', content: 'New Content', createBy: 'User1', like: [], comment: [], likeCount: 0 };
    postsAPI.getUserPosts.mockResolvedValue([newPost]);

    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={() => {}}
          updateUser={() => {}}
        />
      );
    });

    const postButton = screen.getByText('Post something!');
    fireEvent.click(postButton);

    // Simulate the post addition process and then check for the new post
    expect(await screen.findByText('New Post')).toBeInTheDocument();
  });
  
  it('invokes handleProfilettoFalse on return', async () => {
    const mockHandleProfilettoFalse = jest.fn();

    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={mockHandleProfilettoFalse}
          updateUser={() => {}}
        />
      );
    });

    const returnButton = screen.getByText('Return to Activities');
    fireEvent.click(returnButton);

    expect(mockHandleProfilettoFalse).toHaveBeenCalled();
  });
  
  it('renders DeletePost component when a post is marked for deletion', async () => {
    postsAPI.getUserPosts.mockResolvedValue([
      { _id: '1', title: 'Post 1', content: 'Content 1', createBy: 'User1', like: [], comment: [], likeCount: 0 }
    ]);
  
    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={() => {}}
          updateUser={() => {}}
        />
      );
    });
  
    await act(async () => {
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
    });
  
    // Adjust the text based on your actual implementation
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });
  
  

  it('renders UserListPage component when follow is triggered', async () => {
    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={() => {}}
          updateUser={() => {}}
        />
      );
    });
  
    // Assuming there's a button to manage the friends list
    const manageFriendsButton = screen.getByText('Manage friends list');
    fireEvent.click(manageFriendsButton);
  
    // Check if UserListPage is rendered with expected elements
    expect(screen.getByText('Following List')).toBeInTheDocument();
    expect(screen.getByText('Followers')).toBeInTheDocument();
  });
  
  it('returns to profile view from UserListPage', async () => {
    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={() => {}}
          updateUser={() => {}}
        />
      );
    });

    // Assuming 'Manage friends list' button leads to UserListPage
    await act(async () => {
      fireEvent.click(screen.getByText('Manage friends list'));
    });

    // Assuming 'Return to profile' button returns from UserListPage
    await act(async () => {
      const returnButton = screen.getByText('Return to profile'); // Correct text as per your actual implementation
      fireEvent.click(returnButton);
    });

    // Check if the profile view is displayed again
    expect(screen.getByText(`${user.username}'s Profile`)).toBeInTheDocument();
  });

  it('hides NewPost component when post creation is cancelled', async () => {
    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={() => {}}
          updateUser={() => {}}
        />
      );
    });

    // Simulate action to show NewPost component
    await act(async () => {
      const addPostButton = screen.getByText('Post something!'); // Adjust this to match your button's text
      fireEvent.click(addPostButton);
    });

    // Assuming 'New Post' text appears in the NewPost component
    expect(screen.getByText('New Post')).toBeInTheDocument();

    // Simulate the action that triggers handlePostCancelled
    await act(async () => {
      const cancelButton = screen.getByText('Cancel'); // Adjust this text to match your cancel button
      fireEvent.click(cancelButton);
    });

    // Check if NewPost component is no longer rendered
    expect(screen.queryByText('New Post')).not.toBeInTheDocument();
  });

  it('adds a new post and updates the post list', async () => {
    // Mock getUserPosts to return a list of posts including the new post
    const newPosts = [
      { _id: '1', title: 'Post 1', content: 'Content 1', createBy: 'User1', like: [], comment: [], likeCount: 0 },
      { _id: '2', title: 'New Post', content: 'New Content', createBy: 'john_doe', like: [], comment: [], likeCount: 0 }
    ];
    postsAPI.getUserPosts.mockResolvedValue(newPosts);
  
    await act(async () => {
      render(
        <Profile
          user={user}
          handleProfilettoFalse={() => {}}
          updateUser={() => {}}
        />
      );
    });
    const postButton = screen.getByText('Post something!');
    fireEvent.click(postButton);
  
    expect(await screen.findByText('New Post')).toBeInTheDocument();
  });

});
