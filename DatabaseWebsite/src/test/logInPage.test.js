// LogInPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LogInPage from './LogInPage';

// Mock the navigate function from react-router-dom
import { useNavigate } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the storeUserId function
import { storeUserId } from '../userData/user';
jest.mock('../userData/user', () => ({
  storeUserId: jest.fn(),
}));

describe('LogInPage', () => {
  const mockedNavigate = useNavigate();

  beforeEach(() => {
    mockedNavigate.mockReset();
  });

  test('renders login page with input fields and submit button', () => {
    render(
      <Router>
        <LogInPage />
      </Router>
    );

    expect(screen.getByText('Welcome to Pear to Peer')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays error when username or password is empty', async () => {
    render(
      <Router>
        <LogInPage />
      </Router>
    );

    // Attempt to submit with empty fields
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Username not found, please try again.')).toBeInTheDocument();
      expect(screen.getByText('Incorrect Password for username, try again or try resetting password.')).toBeInTheDocument();
    });
  });

  test('calls API and navigates on successful login', async () => {
    // Mock fetch to return a successful login response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { userId: '12345' } }),
      })
    );

    render(
      <Router>
        <LogInPage />
      </Router>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/ProfilePage/12345');
      expect(storeUserId).toHaveBeenCalledWith('12345');
    });
  });

  test('displays server error on failed login', async () => {
    // Mock fetch to simulate a failed login response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );

    render(
      <Router>
        <LogInPage />
      </Router>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password. Please try again.')).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
