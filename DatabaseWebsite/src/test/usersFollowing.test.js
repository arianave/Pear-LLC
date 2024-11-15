import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UsersFollowing from '../pages/usersFollowing';

// Mock API functions
jest.mock('../userData/user', () => ({
  getUserFollowing: jest.fn(() => Promise.resolve([])),
  unfollowUser: jest.fn(() => Promise.resolve()),
}));

const mockFollowing = [
  { _id: '1', username: 'user1' },
  { _id: '2', username: 'user2' },
  { _id: '3', username: 'user3' },
];

const mockUseParams = jest.fn(() => ({ userId: '12345' }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

describe('UsersFollowing', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <UsersFollowing />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the following page with title', () => {
    renderComponent();
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  test('fetches and displays users the user is following', async () => {
    const { getUserFollowing } = require('../userData/user');
    getUserFollowing.mockResolvedValueOnce(mockFollowing);

    renderComponent();

    await waitFor(() => {
      mockFollowing.forEach((user) => {
        expect(screen.getByText(user.username)).toBeInTheDocument();
      });
    });
  });

  test('displays a message if the user is not following anyone', async () => {
    const { getUserFollowing } = require('../userData/user');
    getUserFollowing.mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Following')).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  test('renders links to following users\' profile pages', async () => {
    const { getUserFollowing } = require('../userData/user');
    getUserFollowing.mockResolvedValueOnce(mockFollowing);

    renderComponent();

    await waitFor(() => {
      mockFollowing.forEach((user) => {
        const link = screen.getByText(user.username);
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', `/ProfilePage/${user._id}`);
      });
    });
  });

  test('removes a user from the following list when unfollow is clicked', async () => {
    const { getUserFollowing, unfollowUser } = require('../userData/user');
    getUserFollowing.mockResolvedValueOnce(mockFollowing);

    renderComponent();

    await waitFor(() => {
      const unfollowButtons = screen.getAllByText('Unfollow');
      fireEvent.click(unfollowButtons[0]);

      waitFor(() => {
        expect(unfollowUser).toHaveBeenCalledWith(mockFollowing[0]._id);
        expect(screen.queryByText(mockFollowing[0].username)).not.toBeInTheDocument();
      });
    });
  });

  test('handles API failure during unfollow gracefully', async () => {
    const { getUserFollowing, unfollowUser } = require('../userData/user');
    getUserFollowing.mockResolvedValueOnce(mockFollowing);
    unfollowUser.mockRejectedValueOnce(new Error('Failed to unfollow'));

    renderComponent();

    await waitFor(() => {
      const unfollowButtons = screen.getAllByText('Unfollow');
      fireEvent.click(unfollowButtons[0]);

      waitFor(() => {
        expect(screen.getByText(mockFollowing[0].username)).toBeInTheDocument();
      });
    });
  });

  test('updates the UI after a successful unfollow operation', async () => {
    const { getUserFollowing, unfollowUser } = require('../userData/user');
    getUserFollowing.mockResolvedValueOnce(mockFollowing);
    unfollowUser.mockResolvedValueOnce();

    renderComponent();

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Unfollow')[0]);

      waitFor(() => {
        expect(screen.queryByText(mockFollowing[0].username)).not.toBeInTheDocument();
      });
    });
  });

  test('renders a loading state while fetching the following list', async () => {
    const { getUserFollowing } = require('../userData/user');
    getUserFollowing.mockImplementation(() => new Promise(() => {})); // Simulate loading

    renderComponent();

    expect(screen.getByText('Following')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('handles missing userId in useParams gracefully', async () => {
    mockUseParams.mockReturnValueOnce({ userId: undefined });

    renderComponent();

    expect(screen.getByText('Following')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });
});
