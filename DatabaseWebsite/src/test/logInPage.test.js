import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LogInPage from '../pages/LogInPage';

// Mock useNavigate function directly
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('LogInPage', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <LogInPage />
      </BrowserRouter>
    );
  };

  test('renders the login form', () => {
    renderComponent();
    expect(screen.getByText('Welcome to Pear to Peer')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    renderComponent();
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  test('displays error when username or password is empty', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    expect(await screen.findByText('Username not found, please try again.')).toBeInTheDocument();
    expect(await screen.findByText('Incorrect Password for username, try again or try resetting password.')).toBeInTheDocument();
  });

  test('submits the form and handles server error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid username or password' }),
      })
    );

    renderComponent();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText('Invalid username or password. Please try again.')).toBeInTheDocument();

    global.fetch.mockClear();
  });

  test('redirects to ProfilePage on successful login', async () => {
    const useNavigate = require('react-router-dom').useNavigate;
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { userId: '12345' } }),
      })
    );

    renderComponent();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ProfilePage/12345');
    });

    global.fetch.mockClear();
  });
});
