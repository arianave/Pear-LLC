import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostCreationPage from '../pages/PostCreationPage';

// Mock user data functions
jest.mock('../userData/user', () => ({
  getUserId: jest.fn(() => '12345'),
}));

global.fetch = jest.fn();

describe('PostCreationPage', () => {
  const renderComponent = () => render(<PostCreationPage />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the post creation page with all post type buttons', () => {
    renderComponent();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Picture')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();
    expect(screen.getByText('Thread')).toBeInTheDocument();
  });

  test('displays text input field when text post type is selected', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Text'));
    expect(screen.getByPlaceholderText('Write your text post here (max 250 characters)...')).toBeInTheDocument();
  });

  test('displays file and caption inputs when picture post type is selected', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Picture'));
    expect(screen.getByPlaceholderText('Add a caption (max 250 characters)...')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Post/i })).toBeInTheDocument();
  });

  test('displays file and caption inputs when video post type is selected', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Video'));
    expect(screen.getByPlaceholderText('Add a caption (max 250 characters)...')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('shows an error if text post is submitted without content', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Text'));
    fireEvent.click(screen.getByText('Post'));
    expect(await screen.findByText('Text post content is required.')).toBeInTheDocument();
  });

  test('shows an error if picture or video post is submitted without media or caption', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Picture'));
    fireEvent.click(screen.getByText('Post'));
    expect(await screen.findByText('Both media content and caption are required.')).toBeInTheDocument();
  });

  test('validates caption length for media posts', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Picture'));
    const captionInput = screen.getByPlaceholderText('Add a caption (max 250 characters)...');

    fireEvent.change(captionInput, {
      target: { value: 'A'.repeat(251) },
    });

    expect(screen.getByText('Caption cannot exceed 250 characters.')).toBeInTheDocument();
  });

  test('submits a text post successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('Text'));
    fireEvent.change(screen.getByPlaceholderText('Write your text post here (max 250 characters)...'), {
      target: { value: 'This is a test post.' },
    });
    fireEvent.click(screen.getByText('Post'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST' }));
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  test('submits a picture post successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('Picture'));

    const fileInput = screen.getByRole('textbox');
    const file = new File(['(⌐□_□)'], 'cool.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.change(screen.getByPlaceholderText('Add a caption (max 250 characters)...'), {
      target: { value: 'A cool caption' },
    });
    fireEvent.click(screen.getByText('Post'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST' }));
    });
  });

  test('handles API failure gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ success: false, error: 'Failed to create post.' }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('Text'));
    fireEvent.change(screen.getByPlaceholderText('Write your text post here (max 250 characters)...'), {
      target: { value: 'This is a test post.' },
    });
    fireEvent.click(screen.getByText('Post'));

    await waitFor(() => {
      expect(screen.getByText('Error creating post: Failed to create post.')).toBeInTheDocument();
    });
  });

  test('resets form fields after successful submission', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('Text'));
    const textInput = screen.getByPlaceholderText('Write your text post here (max 250 characters)...');
    fireEvent.change(textInput, { target: { value: 'This is a test post.' } });
    fireEvent.click(screen.getByText('Post'));

    await waitFor(() => {
      expect(textInput).toHaveValue('');
    });
  });

  test('prevents invalid file types for picture and video posts', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Picture'));

    const fileInput = screen.getByRole('textbox');
    const invalidFile = new File(['fake content'], 'fake.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(screen.queryByText('File type not supported.')).toBeInTheDocument();
  });

  test('limits text post input to 250 characters', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Text'));

    const textInput = screen.getByPlaceholderText('Write your text post here (max 250 characters)...');
    fireEvent.change(textInput, { target: { value: 'A'.repeat(251) } });

    expect(textInput.value).toHaveLength(250);
  });
});
