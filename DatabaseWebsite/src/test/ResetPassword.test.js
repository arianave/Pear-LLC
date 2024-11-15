import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '../pages/ResetPassword';

// Mock useNavigate function directly
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ResetPassword', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
  };

  test('renders the reset password field', () => {
    renderComponent();
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
    expect(screen.getByText('Enter your username to receive an email with a link to a new password.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Username/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Email/i })).toBeInTheDocument();
  });

test('renders the login link text', () => {
    renderComponent();
    const linkElement = screen.getByText((content, element) => {
      // Check if the element contains the combined text 'Need to log in? Log in here'
      return (
        element?.textContent === 'Need to log in? Log in here'
      );
    });
    expect(linkElement).toBeInTheDocument();
  });

  test('login link navigates to LogInPage', () => {
    renderComponent();
    const loginLink = screen.getByText('Log in here');
    expect(loginLink.closest('a')).toHaveAttribute('href', '/LogInPage');

    fireEvent.click(loginLink);
  });

  // resume code copied form log in page test with changes to accomodate reset password 
  test('handles input changes', () => {
    renderComponent();
    const usernameInput = screen.getByLabelText(/Username/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    expect(usernameInput.value).toBe('testuser');
  });

  
  test('displays error when username is not found when trying to reset password', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Send Email/i }));
    
    expect(await screen.findByText('Username entered does not match any exsisting accounts.')).toBeInTheDocument();

  });
  

  test('submits the form and handles server error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid username' }), // check if this fails, should since not coonnected to backend, but make sure it is failing for the right reasons 
      })
    );

    renderComponent();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Email/i }));

    expect(await screen.findByText('Invalid username. Please try again.')).toBeInTheDocument(); // again, should fail: check if fails for right reasons

    global.fetch.mockClear();
  });
});
