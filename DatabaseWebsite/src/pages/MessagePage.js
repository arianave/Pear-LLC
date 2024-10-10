import React, { useState, useEffect } from 'react';
import './MessagePage.css'; 
import { getChats } from '../userData/chats';

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

  // Fetch chats from backend or database
  const fetchChats = async () => {
    // Use the getChats function to fetch chat data
    const chatsData = await getChats();

    if (chatsData) {
      setChats(chatsData); // Update state with the fetched chats
    }
  };

  useEffect(() => {
    // Call fetchChats when component mounts
    fetchChats();

    // Polling every 10 seconds to check for new chats
    const interval = setInterval(() => {
      fetchChats();
    }, 10000); // Fetch new chats every 10 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

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
              <p>Chat with {chat.receiver}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MessagePage;
