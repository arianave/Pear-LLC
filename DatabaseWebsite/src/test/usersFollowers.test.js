import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UsersFollowers from '../pages/usersFollowers';

// Mock API functions
jest.mock('../userData/user', () => ({
  getUserFollowers: jest.fn(() => Promise.resolve([])),
  removeUserFromFollowing: jest.fn(() => Promise.resolve()),
}));

const mockFollowers = [
  { _id: '1', username: 'follower1' },
  { _id: '2', username: 'follower2' },
  { _id: '3', username: 'follower3' },
];

const mockUseParams = jest.fn(() => ({ userId: '12345' }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

describe('UsersFollowers', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <UsersFollowers />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the followers page with title', () => {
    renderComponent();
    expect(screen.getByText('Followers')).toBeInTheDocument();
  });

  test('fetches and displays followers', async () => {
    const { getUserFollowers } = require('../userData/user');
    getUserFollowers.mockResolvedValueOnce(mockFollowers);

    renderComponent();

    await waitFor(() => {
      mockFollowers.forEach((follower) => {
        expect(screen.getByText(follower.username)).toBeInTheDocument();
      });
    });
  });

  test('displays a message if there are no followers', async () => {
    const { getUserFollowers } = require('../userData/user');
    getUserFollowers.mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Followers')).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  test('renders links to follower profile pages', async () => {
    const { getUserFollowers } = require('../userData/user');
    getUserFollowers.mockResolvedValueOnce(mockFollowers);

    renderComponent();

    await waitFor(() => {
      mockFollowers.forEach((follower) => {
        const link = screen.getByText(follower.username);
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', `/ProfilePage/${follower._id}`);
      });
    });
  });

  test('removes a follower when the remove button is clicked', async () => {
    const { getUserFollowers, removeUserFromFollowing } = require('../userData/user');
    getUserFollowers.mockResolvedValueOnce(mockFollowers);

    renderComponent();

    await waitFor(() => {
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);

      waitFor(() => {
        expect(removeUserFromFollowing).toHaveBeenCalledWith(mockFollowers[0]._id);
        expect(screen.queryByText(mockFollowers[0].username)).not.toBeInTheDocument();
      });
    });
  });

  test('handles API failure when removing a follower', async () => {
    const { getUserFollowers, removeUserFromFollowing } = require('../userData/user');
    getUserFollowers.mockResolvedValueOnce(mockFollowers);
    removeUserFromFollowing.mockRejectedValueOnce(new Error('Failed to remove follower'));

    renderComponent();

    await waitFor(() => {
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);

      waitFor(() => {
        expect(screen.getByText(mockFollowers[0].username)).toBeInTheDocument();
      });
    });
  });

  test('updates the UI after a follower is removed', async () => {
    const { getUserFollowers, removeUserFromFollowing } = require('../userData/user');
    getUserFollowers.mockResolvedValueOnce(mockFollowers);
    removeUserFromFollowing.mockResolvedValueOnce();

    renderComponent();

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Remove')[0]);

      waitFor(() => {
        expect(screen.queryByText(mockFollowers[0].username)).not.toBeInTheDocument();
      });
    });
  });

  test('renders a loading state while fetching followers', async () => {
    const { getUserFollowers } = require('../userData/user');
    getUserFollowers.mockImplementation(() => new Promise(() => {})); // Simulate loading state

    renderComponent();

    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('handles missing userId in useParams gracefully', async () => {
    mockUseParams.mockReturnValueOnce({ userId: undefined });
    renderComponent();

    expect(screen.getByText('Followers')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });
});
