import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateAccountPage from '../pages/CreateAccountPage';

// Mocking fetch to simulate API responses
global.fetch = jest.fn();

describe('CreateAccountPage', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <CreateAccountPage />
      </BrowserRouter>
    );
  };

  test('renders the create account form', () => {
    renderComponent();
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password Confirmation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    renderComponent();
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('johndoe@example.com');
  });

  test('displays validation error when first and last name are invalid', async () => {
    renderComponent();
  
    // Fill in fields with matching values for other fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test12' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User21' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '2000-01-01' } });
  
    // Fill in mismatched passwords
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Password Confirmation/i), { target: { value: 'Password123!' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
  
    // Ensure the 'Passwords do not match' error is displayed
    expect(await screen.findByText('First name must contain only letters.')).toBeInTheDocument();
    expect(await screen.findByText('Last name must contain only letters.')).toBeInTheDocument();
  });

  test('displays validation error when user is under the age of 13', async () => {
    renderComponent();
  
    // Fill in fields with matching values for other fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '2020-01-01' } });
  
    // Fill in mismatched passwords
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Password Confirmation/i), { target: { value: 'Password123!' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
  
    // Ensure the 'Passwords do not match' error is displayed
    expect(await screen.findByText('You must be 13 years or older to create an account.')).toBeInTheDocument();
  });

  test('displays validation error when user enters invalid email', async () => {
    renderComponent();
  
    // Fill in fields with matching values for other fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@com' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '2000-01-01' } });
  
    // Fill in mismatched passwords
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Password Confirmation/i), { target: { value: 'Password123!' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
  
    // Ensure the 'Passwords do not match' error is displayed
    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  test('displays validation error when user enters invalid password', async () => {
    renderComponent();
  
    // Fill in fields with matching values for other fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '2000-01-01' } });
  
    // Fill in mismatched passwords
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'Password' } });
    fireEvent.change(screen.getByLabelText(/Password Confirmation/i), { target: { value: 'Password123!' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
  
    // Ensure the 'Passwords do not match' error is displayed
    expect(await screen.findByText('Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.')).toBeInTheDocument();
  });

  test('displays validation error when passwords do not match', async () => {
    renderComponent();
  
    // Fill in fields with matching values for other fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '2000-01-01' } });
  
    // Fill in mismatched passwords
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Password Confirmation/i), { target: { value: 'DifferentPassword123!' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
  
    // Ensure the 'Passwords do not match' error is displayed
    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
  });

  test('displays server error on failed account creation', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Email already in use.' }),
    });

    renderComponent();
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'johndoe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'johnny123' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'Password@123' } });
    fireEvent.change(screen.getByLabelText(/Password Confirmation/i), { target: { value: 'Password@123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText('Email already in use.')).toBeInTheDocument();

    global.fetch.mockClear();
  });

  test('submits the form and clears data on successful account creation', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Account created successfully' }),
    });

    renderComponent();
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'johndoe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'johnny123' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'Password@123' } });
    fireEvent.change(screen.getByLabelText(/Password Confirmation/i), { target: { value: 'Password@123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.queryByLabelText(/First Name/i).value).toBe('');
      expect(screen.queryByLabelText(/Last Name/i).value).toBe('');
      expect(screen.queryByLabelText(/Email/i).value).toBe('');
      expect(screen.queryByLabelText(/Username/i).value).toBe('');
      expect(screen.queryByLabelText(/Password:/i).value).toBe('');
      expect(screen.queryByLabelText(/Password Confirmation/i).value).toBe('');
    });

    global.fetch.mockClear();
  });
});
