import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessagePage from '../pages/MessagePage';

// Mock dependencies
jest.mock('../userData/chats', () => ({
  getChats: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../userData/user', () => ({
  getUsername: jest.fn((id) => Promise.resolve(`User${id}`)),
  getUserId: jest.fn(() => '12345'),
}));

global.fetch = jest.fn();

describe('MessagePage', () => {
  const renderComponent = () => render(<MessagePage />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the message page with a start chat button', () => {
    renderComponent();
    expect(screen.getByText('🍐')).toBeInTheDocument();
  });

  test('shows the search bar when the start chat button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('🍐'));
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('hides the search bar after searching', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('🍐'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), {
      target: { value: 'testUser' },
    });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter username')).not.toBeInTheDocument();
    });
  });

  test('displays no messages when there are no chats', () => {
    renderComponent();
    expect(screen.getByText('No messages found, try starting a chat!')).toBeInTheDocument();
  });

  test('renders chats when they exist', async () => {
    const { getChats } = require('../userData/chats');
    getChats.mockResolvedValueOnce([
      { sender: '12345', receiver: '67890', messageContent: 'Hello', messageDate: '2024-01-01T00:00:00Z' },
    ]);

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('User67890')).toBeInTheDocument();
    });
  });

  test('opens a chat when a user is clicked', async () => {
    const { getChats } = require('../userData/chats');
    getChats.mockResolvedValueOnce([
      { sender: '12345', receiver: '67890', messageContent: 'Hello', messageDate: '2024-01-01T00:00:00Z' },
    ]);

    renderComponent();
    await waitFor(() => {
      fireEvent.click(screen.getByText('User67890'));
      expect(screen.getByText('Chat with User67890')).toBeInTheDocument();
    });
  });

  test('displays messages in chronological order', async () => {
    const { getChats } = require('../userData/chats');
    getChats.mockResolvedValueOnce([
      { sender: '12345', receiver: '67890', messageContent: 'First', messageDate: '2024-01-01T00:00:00Z' },
      { sender: '67890', receiver: '12345', messageContent: 'Second', messageDate: '2024-01-01T01:00:00Z' },
    ]);

    renderComponent();
    await waitFor(() => {
      fireEvent.click(screen.getByText('User67890'));
      const messages = screen.getAllByText(/First|Second/);
      expect(messages[0]).toHaveTextContent('First');
      expect(messages[1]).toHaveTextContent('Second');
    });
  });

  test('sends a message and clears the input field', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, newMessage: { sender: '12345', messageContent: 'Hello there!' } }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('🍐'));

    fireEvent.change(screen.getByPlaceholderText('Type a message...'), {
      target: { value: 'Hello there!' },
    });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toHaveValue('');
    });
  });

  test('prevents sending empty messages', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('🍐'));

    fireEvent.change(screen.getByPlaceholderText('Type a message...'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Send'));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('handles API failure for sending messages', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ success: false, message: 'Failed to send message.' }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('🍐'));

    fireEvent.change(screen.getByPlaceholderText('Type a message...'), {
      target: { value: 'Failed message!' },
    });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText('Failed to send message.')).toBeInTheDocument();
    });
  });

  test('ensures search results are case insensitive', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, users: [{ _id: '56789', username: 'TestUser' }] }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('🍐'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'testuser' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('TestUser')).toBeInTheDocument();
    });
  });

  test('handles long messages gracefully', async () => {
    const longMessage = 'A'.repeat(1000);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, newMessage: { sender: '12345', messageContent: longMessage } }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('🍐'));
    fireEvent.change(screen.getByPlaceholderText('Type a message...'), { target: { value: longMessage } });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });

  test('scrolls chat window to the bottom on new messages', async () => {
    const chatMessagesRef = {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 0,
      scrollTo: jest.fn(),
    };

    React.useRef = jest.fn(() => chatMessagesRef);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        newMessage: { sender: '12345', messageContent: 'New Message' },
      }),
    });

    renderComponent();
    fireEvent.click(screen.getByText('🍐'));

    fireEvent.change(screen.getByPlaceholderText('Type a message...'), { target: { value: 'New Message' } });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(chatMessagesRef.scrollTo).toHaveBeenCalledWith(0, chatMessagesRef.scrollHeight);
    });
  });
});
