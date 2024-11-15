import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage'; // Adjust path if needed
import * as userData from '../userData/user'; // Mock userData methods
import * as userPosts from '../userData/userPosts'; // Mock userPosts methods

jest.mock('../userData/user');
jest.mock('../userData/userPosts');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ userId: '123' }),
}));

describe('ProfilePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders default profile info when no data is fetched', async () => {
    userData.getUserInfo.mockResolvedValue(null);
    userPosts.getUserPosts.mockResolvedValue([]);
    userData.getUserFollowers.mockResolvedValue([]);
    userData.getUserFollowing.mockResolvedValue([]);

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    expect(screen.getByText('No username')).toBeInTheDocument();
    expect(screen.getByText('No bio available')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Followers, Following, and Posts
  });

  test('renders fetched profile information correctly', async () => {
    userData.getUserInfo.mockResolvedValue({
      userId: '123',
      username: 'JohnDoe',
      profileBiography: 'Hello, world!',
    });
    userPosts.getUserPosts.mockResolvedValue([{ _id: '1' }, { _id: '2' }]);
    userData.getUserFollowers.mockResolvedValue([{ _id: '456' }]);
    userData.getUserFollowing.mockResolvedValue([{ _id: '789' }]);

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('JohnDoe')).toBeInTheDocument();
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Total posts
      expect(screen.getByText('1')).toBeInTheDocument(); // Followers
      expect(screen.getByText('1')).toBeInTheDocument(); // Following
    });
  });

  test('follow/unfollow button toggles state correctly', async () => {
    userData.getUserInfo.mockResolvedValue({
      userId: '123',
      username: 'JohnDoe',
    });
    userData.getUserFollowers.mockResolvedValue([]);
    userData.getUserFollowing.mockResolvedValue([]);
    userData.followUser.mockResolvedValue(true);
    userData.unfollowUser.mockResolvedValue(true);

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    const followButton = await screen.findByRole('button', { name: 'Follow' });
    fireEvent.click(followButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Unfollow' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Unfollow' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Follow' })).toBeInTheDocument();
    });
  });

  test('edit profile button navigates to EditProfile page', async () => {
    userData.getUserInfo.mockResolvedValue({
      userId: '123',
      username: 'JohnDoe',
    });

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    const editProfileButton = await screen.findByText('Edit Profile');
    fireEvent.click(editProfileButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/EditProfile');
    });
  });

  test('logout button navigates to LogInPage', async () => {
    userData.getUserInfo.mockResolvedValue({
      userId: '123',
      username: 'JohnDoe',
    });

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    const logoutButton = await screen.findByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/LogInPage');
    });
  });

  test('view photos/videos button opens modal and displays posts', async () => {
    userPosts.getUserPosts.mockResolvedValue([
      { _id: '1', textContent: 'Post 1', creationDate: '2024-01-01' },
      { _id: '2', textContent: 'Post 2', creationDate: '2024-01-02' },
    ]);

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    const viewPhotosButton = screen.getByText('Photos/Videos');
    fireEvent.click(viewPhotosButton);

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
  });

  test('view threads button logs placeholder message', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    const viewThreadsButton = screen.getByText('Threads');
    fireEvent.click(viewThreadsButton);

    expect(consoleLogSpy).toHaveBeenCalledWith('Viewing threads...');
    consoleLogSpy.mockRestore();
  });

  test('view followers button navigates to followers page', async () => {
    userData.getUserInfo.mockResolvedValue({
      userId: '123',
      username: 'JohnDoe',
    });

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    const viewFollowersButton = screen.getByText('Followers');
    fireEvent.click(viewFollowersButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/usersFollowers/123');
    });
  });

  test('view following button navigates to following page', async () => {
    userData.getUserInfo.mockResolvedValue({
      userId: '123',
      username: 'JohnDoe',
    });

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    const viewFollowingButton = screen.getByText('Following');
    fireEvent.click(viewFollowingButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/usersFollowing/123');
    });
  });
});
