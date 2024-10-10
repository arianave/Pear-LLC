import React, { useState, useEffect } from 'react';
import './MessagePage.css'; 
import { getChats } from '../userData/chats';
import { getUsername } from '../userData/user';

function MessagePage() {
  const [chats, setChats] = useState([]); // State for storing existing chats
  const [showSearch, setShowSearch] = useState(false); // State to show/hide search bar
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [uniqueChatUsers, setUniqueChatUsers] = useState([]); // Users chatted with
  const [showPopup, setShowPopup] = useState(false); // State for popup window
  const [selectedUser, setSelectedUser] = useState(null); // The user currently chatting with
  const [messages, setMessages] = useState([]); // Messages with the selected user

  // Function to handle starting a chat (simple search for now)
  const handleStartChat = () => {
    setShowSearch(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Handle chat search functionality here
    console.log(`Searching for ${searchTerm}`);
    setShowSearch(false); // Hide search after submission
  };

  // Fetch chats from backend or database
  const fetchChats = async () => {
    const chatsData = await getChats();
  
    if (chatsData) {
      setChats(chatsData); // Update state with the fetched chats
  
      // Get unique user IDs from chats (both sender and receiver)
      const userIds = [...new Set(chatsData.flatMap(chat => [chat.sender, chat.receiver]))]; 
  
      // Fetch usernames for those user IDs
      const userObjects = await Promise.all(userIds.map(async (id) => {
        const username = await getUsername(id);
        if (username) {
          return { userId: id, username }; // Return both userId and username
        }
        return null;
      }));
  
      // Filter out any null values (in case some usernames don't exist)
      setUniqueChatUsers(userObjects.filter(user => user !== null)); 
      console.log("Unique Chat Users:", userObjects.filter(user => user !== null));
    }
    
  };

   // useEffect hook to fetch chats on component mount
   useEffect(() => {
    const fetchData = async () => {
      await fetchChats(); // Call the async fetchChats function inside this new function
    };

    fetchData(); // Call the internal async function

  }, []);

  // Open chat with selected user
  const handleOpenChat = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
    console.log("unique chat users: ", uniqueChatUsers);

    // Fetch the message history with this user from existing chats
    fetchMessages(user.userId);
  };

  // Filter messages between current user and selected user
  const fetchMessages = (userId) => {
    console.log("UserID: ", userId);
    
    // Filter messages between the current user and the selected user
    if (selectedUser) { // Check if selectedUser is not null
      const filteredMessages = chats.filter(chat => 
        (chat.sender === userId || chat.receiver === userId) &&
        (chat.sender === selectedUser.userId || chat.receiver === selectedUser.userId)
      );
    
    console.log(filteredMessages);
    setMessages(filteredMessages); // Update state with filtered messages
    } else {
       console.log("No user selected, cannot fetch messages.");
    }
  };
  // Close the chat popup
  const handleCloseChat = () => {
    setShowPopup(false);
    setSelectedUser(null);
    setMessages([]);
  };

  return (
    <div className="messages-page">
      <div className="messages-header">
        <button className="plus-button" onClick={handleStartChat}>+</button>
      </div>

      {showSearch && (
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Enter username" 
            value={searchTerm} 
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchSubmit}>Search</button>
        </div>
      )}

      <div className="message-list">
      {uniqueChatUsers.length === 0 ? (
          <p>No messages found, try starting a chat!</p>
        ) : (
          uniqueChatUsers.map((user, index) => (
            <div key={index} className="chat-item" onClick={() => handleOpenChat(user)}>
              <p>{user.username}</p> {/* Display username instead of userId */}
            </div>
          ))
        )}
      </div>
       {/* Popup for showing messages */}
       {showPopup && (
        <div className="chat-popup">
          <div className="chat-header">
            <h2>Chat with {selectedUser.username}</h2>
            <button onClick={handleCloseChat}>Close</button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="message-item">
                  <p>{message.messageContent}</p>
                  <small>{new Date(message.messageDate).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Type a message..." />
            <button onClick={() => console.log('Send message')}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagePage;
