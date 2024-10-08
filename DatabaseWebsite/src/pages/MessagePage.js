import React, { useState } from 'react';
import './MessagePage.css'; 

function MessagePage() {
  const [chats, setChats] = useState([]); // State for storing existing chats
  const [showSearch, setShowSearch] = useState(false); // State to show/hide search bar
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

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
        {chats.length === 0 ? (
          <p>No messages found, try starting a chat!</p>
        ) : (
          chats.map((chat, index) => (
            <div key={index} className="chat-item">
              {/* Display chat item (to be developed later) */}
              <p>Chat with {chat.username}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MessagePage;
